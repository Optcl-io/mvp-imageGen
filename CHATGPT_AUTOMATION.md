# ChatGPT Automation for Image Generation

This project includes automation to use ChatGPT's image generation capabilities for creating marketing images.

## Setup Instructions

### 1. Environment Setup

Make sure you have:
- Python 3.8+ installed
- Conda or another virtual environment tool (optional but recommended)

### 2. Create a Python Environment

```bash
# Using conda (recommended)
conda create -n chatgpt-automation python=3.10
conda activate chatgpt-automation

# Or using venv
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Required Packages

```bash
# Install Playwright and other dependencies
pip install playwright
playwright install chromium
```

### 4. Configure Environment Variables

Edit the `.env` file and add your OpenAI account credentials:

```
OPENAI_EMAIL="your-openai-account-email"
OPENAI_PASSWORD="your-openai-account-password"
```

These credentials will be used to log in to the ChatGPT web interface.

### 5. Directory Structure

Ensure these directories exist:
- `scripts/` - Contains the Python automation script
- `temp/` - For temporary files during processing
- `public/generated_images/` - Where the generated images will be stored

## How It Works

1. When a user submits the content generation form, the request goes to `/api/chatgpt-generation`.
2. The API endpoint runs the Python script `scripts/chatgpt_image_generator.py`.
3. The script:
   - Opens a browser window (headless by default)
   - Logs into ChatGPT using your credentials
   - Uploads the product image
   - Sends the prompt with product details
   - Waits for image generation to complete
   - Downloads the resulting image
   - Returns the image path to the API

4. The API saves the image details to the database and returns the URL to the frontend.

## Troubleshooting

- **Authentication Errors**: Ensure your OpenAI credentials are correct. If you use 2FA, you'll need to disable it for this automation.
- **Timeouts**: The script has timeouts for various operations. If ChatGPT is slow, you might need to increase these timeouts.
- **UI Changes**: If OpenAI changes their UI, the selectors in the script might need to be updated.
- **Rate Limiting**: OpenAI might rate limit your account if you generate too many images in a short period.

## Security Notes

- Keep your OpenAI credentials secure. Do not commit the `.env` file to your repository.
- This approach uses automation that might violate OpenAI's terms of service. Use at your own discretion.
- Consider using the official API when it becomes available for image generation. 