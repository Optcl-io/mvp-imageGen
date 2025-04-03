# ChatGPT Cookie Authentication Guide

## Problem

OpenAI has implemented strict security measures that block automated login attempts to their ChatGPT service. This affects our automation for image generation.

## Solution: Using Browser Cookies

The most reliable way to authenticate with ChatGPT is to:
1. Login manually in your browser
2. Export your authentication cookies
3. Use these cookies for automation

## Step 1: Install a Cookie Export Extension

For Chrome:
- Install [Cookie-Editor](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)

For Firefox:
- Install [Cookie Quick Manager](https://addons.mozilla.org/en-US/firefox/addon/cookie-quick-manager/)

## Step 2: Login to ChatGPT

1. Open your browser and go to [chat.openai.com](https://chat.openai.com/)
2. Log in with your OpenAI account
3. Make sure you're fully logged in and can see the chat interface

## Step 3: Export Your Cookies

Using Cookie-Editor in Chrome:
1. Click the Cookie-Editor extension icon while on chat.openai.com
2. Click "Export" at the bottom of the panel
3. Choose "Export as JSON" (NOT "Export as JS")
4. Copy the exported JSON data

Using Cookie Quick Manager in Firefox:
1. Click the extension icon
2. Click "Current Site"
3. Click "Export" and save as JSON

## Step 4: Save Cookies to the Right Location

1. Create a file named `cookies.json` in the `scripts` directory of the project
2. Paste the exported JSON data into this file
3. Save the file

## Step 5: Verify Cookie Format

The exported cookies should be in a JSON array format like this:

```json
[
  {
    "domain": ".openai.com",
    "name": "__Secure-next-auth.session-token",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "value": "your-session-token-value"
  },
  ...more cookies...
]
```

You can validate your cookies by running:

```bash
python scripts/check_cookies.py --cookies scripts/cookies.json
```

## Step 6: Test the Authentication

With valid cookies in place, the script should now be able to access ChatGPT without needing to log in.

## Important Notes

1. **Security**: Your cookies provide access to your OpenAI account. Keep them secure and never share them.
2. **Expiration**: Cookies will eventually expire (usually after a few days or weeks). If automation stops working, you may need to update your cookies.
3. **Terms of Service**: Ensure your usage complies with OpenAI's terms of service.

## Troubleshooting

If you're still having issues:

1. Make sure you exported the cookies while fully logged in to ChatGPT
2. Verify the cookie file format using the validation script
3. Check that the cookies.json file is in the correct location (scripts/cookies.json)
4. Try logging in again and generating fresh cookies
5. Make sure your OpenAI account doesn't have any verification challenges pending 