#!/usr/bin/env python
"""
Cookie file validator for the ChatGPT image generator.
This script checks if a cookie file is valid for use with Playwright.
"""

import os
import sys
import json
import argparse

def check_cookie_file(filepath):
    """Check if a cookie file is valid for use with Playwright."""
    print(f"Checking cookie file: {filepath}")
    
    if not os.path.exists(filepath):
        print(f"ERROR: File does not exist: {filepath}")
        return False
        
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            
        if not content.strip():
            print("ERROR: File is empty")
            return False
            
        cookies = json.loads(content)
        
        if not isinstance(cookies, list):
            print(f"ERROR: Cookies must be a list, found {type(cookies)}")
            return False
            
        if not cookies:
            print("WARNING: Cookie list is empty")
            return False
            
        valid_cookies = 0
        for i, cookie in enumerate(cookies):
            if not isinstance(cookie, dict):
                print(f"ERROR: Cookie at index {i} is not a dictionary")
                continue
                
            # Required fields for Playwright
            required_fields = ['name', 'value', 'domain', 'path']
            missing_fields = [field for field in required_fields if field not in cookie]
            
            if missing_fields:
                print(f"WARNING: Cookie '{cookie.get('name', f'at index {i}')}' is missing fields: {', '.join(missing_fields)}")
            else:
                valid_cookies += 1
                
        print(f"Found {valid_cookies} valid cookies out of {len(cookies)}")
        
        # Check for important OpenAI cookies
        openai_cookies = [c for c in cookies if c.get('domain', '').endswith('openai.com')]
        session_cookies = [c for c in openai_cookies if c.get('name', '') in ['__Secure-next-auth.session-token', 'puid']]
        
        if not openai_cookies:
            print("WARNING: No cookies found for openai.com domain")
        else:
            print(f"Found {len(openai_cookies)} cookies for OpenAI domains")
            
        if not session_cookies:
            print("WARNING: No session cookies found (like __Secure-next-auth.session-token)")
        else:
            print(f"Found {len(session_cookies)} session cookies")
            
        return valid_cookies > 0
        
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON: {e}")
        try:
            with open(filepath, 'r') as f:
                preview = f.read(100)
            print(f"File preview: {preview}...")
        except:
            pass
        return False
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Validate cookie files for ChatGPT automation")
    parser.add_argument("--cookies", required=True, help="Path to cookie file")
    
    args = parser.parse_args()
    
    valid = check_cookie_file(args.cookies)
    
    if valid:
        print("\nSUCCESS: Cookie file appears valid")
        return 0
    else:
        print("\nFAILED: Cookie file is not valid")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 