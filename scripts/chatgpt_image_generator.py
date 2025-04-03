import os
import time
import argparse
import json
from playwright.sync_api import sync_playwright, TimeoutError

class ChatGPTImageGenerator:
    def __init__(self, email=None, password=None, cookies_file=None, headless=False):
        self.email = email
        self.password = password
        self.cookies_file = cookies_file
        self.headless = headless
        self.browser = None
        self.page = None
        self.results_dir = os.path.join(os.getcwd(), "public", "generated_images")
        os.makedirs(self.results_dir, exist_ok=True)
        
    def start(self):
        playwright = sync_playwright().start()
        self.browser = playwright.chromium.launch(headless=self.headless)
        self.context = self.browser.new_context()
        
        # Load cookies if provided
        if self.cookies_file and os.path.exists(self.cookies_file):
            try:
                with open(self.cookies_file, 'r') as f:
                    cookies = json.load(f)
                
                print(f"Loaded {len(cookies)} cookies from {self.cookies_file}")
                self.context.add_cookies(cookies)
                print("Added cookies to browser context")
            except Exception as e:
                print(f"Error loading cookies: {str(e)}")
        
        self.page = self.context.new_page()
        return self
        
    def check_if_logged_in(self):
        """Check if already logged in based on current page content"""
        # Navigate to ChatGPT
        self.page.goto("https://chat.openai.com/", wait_until="networkidle", timeout=120000)
        
        # If we can find the chat input, we're already logged in
        chat_input = self.page.query_selector('textarea[data-id="root"]')
        if chat_input:
            print("Already logged in via cookies")
            return True
            
        print("Not logged in, will need to perform login")
        return False
        
    def login(self):
        # First check if already logged in via cookies
        if self.cookies_file and self.check_if_logged_in():
            return
            
        # If no email/password provided, fail
        if not self.email or not self.password:
            print("Email and password required for login")
            screenshot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "no_credentials.png")
            self.page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")
            self.browser.close()
            exit(4)  # No credentials error code
            
        try:
            # Navigate to ChatGPT
            print("Navigating to ChatGPT...")
            self.page.goto("https://chat.openai.com/", wait_until="networkidle", timeout=120000)
            
            # Check current URL for redirects
            current_url = self.page.url
            print(f"Current URL: {current_url}")
            
            if "auth/error" in current_url or "chatgpt.com/api/auth/error" in current_url:
                print("Detected error page redirect. OpenAI may be blocking automated access.")
                screenshot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "error_redirect.png")
                self.page.screenshot(path=screenshot_path)
                print(f"Screenshot saved to {screenshot_path}")
                self.browser.close()
                exit(3)  # Special exit code for redirect errors
            
            # Add a longer wait for the page to load fully
            self.page.wait_for_load_state("networkidle", timeout=90000)
            print("Page loaded, looking for login button...")
            
            # Check for CloudFlare or other verification challenges
            cloudflare_selectors = [
                "iframe[src*='cloudflare']",
                "#challenge-form",
                "input[name='cf_captcha_kind']",
                "div.cf-browser-verification",
                "#cf-please-wait"
            ]
            
            for selector in cloudflare_selectors:
                if self.page.query_selector(selector):
                    print(f"Detected CloudFlare or other verification challenge: {selector}")
                    screenshot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cloudflare_challenge.png")
                    self.page.screenshot(path=screenshot_path)
                    print(f"Screenshot saved to {screenshot_path}")
                    print("MANUAL ACTION REQUIRED: Please complete the CloudFlare verification in a regular browser")
                    self.browser.close()
                    exit(2)  # Special exit code for CloudFlare challenges
                    
            # Also check for any text about security checks
            page_content = self.page.content().lower()
            security_phrases = ["security check", "verify you are human", "captcha", "bot detection", "prove you're human"]
            for phrase in security_phrases:
                if phrase in page_content:
                    print(f"Detected possible security verification text: '{phrase}'")
                    screenshot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "security_check.png")
                    self.page.screenshot(path=screenshot_path)
                    print(f"Screenshot saved to {screenshot_path}")
                    print("MANUAL ACTION REQUIRED: You may need to complete a security check in a regular browser")
                    self.browser.close()
                    exit(2)  # Special exit code for security challenges
            
            # If we can find the chat input, we're already logged in
            chat_input = self.page.query_selector('textarea[data-id="root"]')
            if chat_input:
                print("Already logged in, skipping login process")
                return
                
            # Wait for and click the login button with increased timeout
            try:
                # Try to find the button by text first
                if self.page.query_selector("text=Log in"):
                    self.page.click("text=Log in", timeout=90000)
                    print("Clicked login button by text")
                else:
                    print("Login button text not found, trying alternative methods")
                    # Try by button role as a fallback
                    try:
                        login_button = self.page.get_by_role("button", name="Log in")
                        login_button.click(timeout=90000)
                        print("Clicked login button by role")
                    except Exception as e2:
                        print(f"Could not click login button by role: {str(e2)}")
                        # Last resort - look for any button that might be login
                        buttons = self.page.query_selector_all("button")
                        login_found = False
                        for button in buttons:
                            text = button.inner_text().lower()
                            if "log in" in text or "login" in text or "sign in" in text:
                                button.click()
                                login_found = True
                                print(f"Found login button with text: {text}")
                                break
                        
                        if not login_found:
                            print("Could not find any login button, checking if already logged in")
                            # Check if we're already logged in
                            if self.page.query_selector('textarea[data-id="root"]'):
                                print("Already logged in, continuing")
                                return
                            else:
                                raise Exception("Could not find login button and not already logged in")
            except Exception as e:
                print(f"Error clicking login button: {str(e)}")
                screenshot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "login_button_error.png")
                self.page.screenshot(path=screenshot_path)
                print(f"Screenshot saved to {screenshot_path}")
                # Try direct navigation to login
                self.page.goto("https://chat.openai.com/auth/login", wait_until="networkidle", timeout=120000)
                print("Tried direct navigation to login page")
            
            # Wait for the login page to load
            try:
                print("Waiting for username field...")
                self.page.wait_for_selector('input[name="username"]', timeout=120000)
                print("Login page loaded, entering email")
                
                # Enter email
                self.page.fill('input[name="username"]', self.email)
                self.page.click('button[type="submit"]')
            except TimeoutError:
                print("Username field not found, checking alternate selectors...")
                # Try alternative selectors
                if self.page.query_selector('#username'):
                    self.page.fill('#username', self.email)
                    self.page.click('button[type="submit"]')
                    print("Used alternate username selector")
                else:
                    raise Exception("Could not find username field")
            
            # Wait for password field and enter password
            try:
                print("Waiting for password field...")
                self.page.wait_for_selector('input[name="password"]', timeout=120000)
                print("Password field found, entering password")
                self.page.fill('input[name="password"]', self.password)
                self.page.click('button[type="submit"]')
            except TimeoutError:
                print("Password field not found, checking alternate selectors...")
                # Try alternative selectors
                if self.page.query_selector('#password'):
                    self.page.fill('#password', self.password)
                    self.page.click('button[type="submit"]')
                    print("Used alternate password selector")
                else:
                    raise Exception("Could not find password field")
            
            # Wait for the chat to load
            try:
                print("Waiting for chat to load...")
                self.page.wait_for_selector('textarea[data-id="root"]', timeout=180000)
                print("Login successful")
                
                # Save cookies for future use if successfully logged in
                if not self.cookies_file:
                    cookie_dir = os.path.dirname(os.path.abspath(__file__))
                    self.cookies_file = os.path.join(cookie_dir, "chatgpt_cookies.json")
                
                cookies = self.context.cookies()
                with open(self.cookies_file, 'w') as f:
                    json.dump(cookies, f)
                print(f"Saved {len(cookies)} cookies to {self.cookies_file}")
                
            except TimeoutError:
                print("Login failed or page did not load completely")
                # Take a screenshot for debugging
                screenshot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "login_timeout.png")
                self.page.screenshot(path=screenshot_path)
                print(f"Screenshot saved to {screenshot_path}")
                
                # Check if there's an error message
                error_messages = self.page.query_selector_all("div.text-red, .error, .error-message")
                for error_elem in error_messages:
                    if error_elem.is_visible():
                        print(f"Error message found: {error_elem.inner_text()}")
                
                self.browser.close()
                exit(1)
        except Exception as e:
            print(f"Error during login process: {str(e)}")
            # Take a screenshot for debugging
            screenshot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "login_error.png")
            self.page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")
            self.browser.close()
            exit(1)
            
    def generate_image(self, image_path, prompt):
        # Ensure we're in a new conversation
        try:
            # Click "New chat" button if visible
            self.page.click('text=New chat', timeout=5000)
        except:
            # Already in a new chat or button not found
            pass
        
        # Make sure we're using GPT-4o
        try:
            # Click the model selector
            self.page.click('button[aria-label="Model switcher"]')
            # Select GPT-4o
            self.page.click('text=GPT-4o')
        except:
            print("Could not select GPT-4o, continuing with default model")
            
        # Upload the image
        file_input = self.page.wait_for_selector('input[type="file"]', timeout=10000)
        file_input.set_input_files(image_path)
        
        # Wait for image to upload
        self.page.wait_for_selector('img[alt="Uploaded image"]', timeout=30000)
        
        # Enter the prompt
        textarea = self.page.locator('textarea[data-id="root"]')
        textarea.fill(prompt)
        textarea.press("Enter")
        
        # Wait for response and image generation
        print("Waiting for image generation...")
        try:
            # Wait for the generated image to appear
            self.page.wait_for_selector('img.rounded-md:not([alt="Uploaded image"])', timeout=120000)
            time.sleep(2)  # Give a little extra time for image to fully load
            print("Image generated successfully")
        except TimeoutError:
            print("Timed out waiting for image generation")
            return None

        # Get the generated image
        generated_images = self.page.query_selector_all('img.rounded-md:not([alt="Uploaded image"])')
        
        if not generated_images:
            print("No generated images found")
            return None
            
        # Get the last image (most likely the generated one)
        img_element = generated_images[-1]
        
        # Get image source
        img_src = img_element.get_attribute('src')
        
        # If it's a data URL, save it directly
        if img_src.startswith('data:image'):
            filename = f"generated_{int(time.time())}.png"
            filepath = os.path.join(self.results_dir, filename)
            
            # Save the image
            with open(filepath, "wb") as f:
                # Extract the base64 data and save
                img_data = img_src.split(',')[1]
                import base64
                f.write(base64.b64decode(img_data))
                
            return {
                "success": True,
                "image_path": filepath,
                "filename": filename
            }
        
        # If it's an external URL
        elif img_src.startswith('http'):
            filename = f"generated_{int(time.time())}.png"
            filepath = os.path.join(self.results_dir, filename)
            
            # Download the image
            import urllib.request
            urllib.request.urlretrieve(img_src, filepath)
            
            return {
                "success": True,
                "image_path": filepath,
                "image_url": img_src,
                "filename": filename
            }
        
        return {
            "success": False,
            "error": "Could not retrieve image"
        }
    
    def close(self):
        if self.browser:
            self.browser.close()

def create_marketing_prompt(product_name, slogan, price=None, target_platform=None, audience=None, brand_colors=None):
    """Create a detailed prompt for marketing image generation"""
    prompt = f"Transform this product image to create a professional marketing image for {product_name}.\n"
    prompt += f"Slogan: {slogan}\n"
    
    if price:
        prompt += f"Price: {price}\n"
    if audience:
        prompt += f"Target audience: {audience}\n"
    if brand_colors:
        prompt += f"Brand colors to use: {brand_colors}\n"
    if target_platform:
        prompt += f"Create this for {target_platform} format.\n"
        
    prompt += "Make it visually appealing, professional, and ready to use for marketing."
    return prompt

def main():
    parser = argparse.ArgumentParser(description="Generate marketing images with ChatGPT")
    parser.add_argument("--email", help="OpenAI account email")
    parser.add_argument("--password", help="OpenAI account password")
    parser.add_argument("--cookies", help="Path to cookies file for authentication")
    parser.add_argument("--image", required=True, help="Path to source image")
    parser.add_argument("--product", required=True, help="Product name")
    parser.add_argument("--slogan", required=True, help="Product slogan or tagline")
    parser.add_argument("--price", help="Product price")
    parser.add_argument("--platform", help="Target platform (Instagram, Digital Signage, etc.)")
    parser.add_argument("--audience", help="Target audience")
    parser.add_argument("--colors", help="Brand colors")
    parser.add_argument("--headless", action="store_true", help="Run browser in headless mode")
    parser.add_argument("--output", help="Output JSON file path")
    
    args = parser.parse_args()
    
    # Validate authentication options
    if not args.cookies and (not args.email or not args.password):
        print("ERROR: Either --cookies or both --email and --password must be provided")
        return {"success": False, "error": "Missing authentication credentials"}
    
    prompt = create_marketing_prompt(
        args.product, 
        args.slogan, 
        args.price, 
        args.platform, 
        args.audience, 
        args.colors
    )
    
    generator = ChatGPTImageGenerator(
        email=args.email, 
        password=args.password, 
        cookies_file=args.cookies,
        headless=args.headless
    )
    
    try:
        generator.start()
        generator.login()
        result = generator.generate_image(args.image, prompt)
        
        if result and result.get("success"):
            print(f"Image generated successfully: {result.get('image_path')}")
            if args.output:
                with open(args.output, 'w') as f:
                    json.dump(result, f)
                    return result
            return result
        else:
            print("Failed to generate image")
            return {"success": False, "error": "Failed to generate image"}
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"success": False, "error": str(e)}
    finally:
        generator.close()

if __name__ == "__main__":
    main() 