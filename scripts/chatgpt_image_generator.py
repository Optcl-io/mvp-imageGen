import os
import time
import argparse
import json
from playwright.sync_api import sync_playwright, TimeoutError

class ChatGPTImageGenerator:
    def __init__(self, email, password, headless=False):
        self.email = email
        self.password = password
        self.headless = headless
        self.browser = None
        self.page = None
        self.results_dir = os.path.join(os.getcwd(), "public", "generated_images")
        os.makedirs(self.results_dir, exist_ok=True)
        
    def start(self):
        playwright = sync_playwright().start()
        self.browser = playwright.chromium.launch(headless=self.headless)
        self.context = self.browser.new_context()
        self.page = self.context.new_page()
        return self
        
    def login(self):
        # Navigate to ChatGPT
        self.page.goto("https://chat.openai.com/")
        
        # Click the login button
        self.page.click("text=Log in")
        
        # Wait for the login page to load
        self.page.wait_for_selector('input[name="username"]', timeout=10000)
        
        # Enter email
        self.page.fill('input[name="username"]', self.email)
        self.page.click('button[type="submit"]')
        
        # Wait for password field and enter password
        self.page.wait_for_selector('input[name="password"]', timeout=10000)
        self.page.fill('input[name="password"]', self.password)
        self.page.click('button[type="submit"]')
        
        # Wait for the chat to load
        try:
            self.page.wait_for_selector('textarea[data-id="root"]', timeout=30000)
            print("Login successful")
        except TimeoutError:
            print("Login failed or page did not load completely")
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
    parser.add_argument("--email", required=True, help="OpenAI account email")
    parser.add_argument("--password", required=True, help="OpenAI account password")
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
    
    prompt = create_marketing_prompt(
        args.product, 
        args.slogan, 
        args.price, 
        args.platform, 
        args.audience, 
        args.colors
    )
    
    generator = ChatGPTImageGenerator(args.email, args.password, args.headless)
    
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