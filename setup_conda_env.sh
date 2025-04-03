#!/bin/bash
echo "Setting up conda environment for ChatGPT automation..."

# Create the conda environment
conda create -n chatgpt-automation python=3.10 -y
if [ $? -ne 0 ]; then
    echo "Failed to create conda environment."
    exit 1
fi

# Activate the environment
source "$(conda info --base)/etc/profile.d/conda.sh"
conda activate chatgpt-automation
if [ $? -ne 0 ]; then
    echo "Failed to activate conda environment."
    exit 1
fi

# Install required packages
pip install playwright
if [ $? -ne 0 ]; then
    echo "Failed to install playwright."
    exit 1
fi

# Install browser
playwright install chromium
if [ $? -ne 0 ]; then
    echo "Failed to install Chromium for Playwright."
    exit 1
fi

echo ""
echo "Environment setup complete!"
echo ""
echo "To activate the environment, run:"
echo "conda activate chatgpt-automation"
echo ""
echo "Make sure to set OPENAI_EMAIL and OPENAI_PASSWORD in your .env file."
echo ""
read -p "Press Enter to continue..." 