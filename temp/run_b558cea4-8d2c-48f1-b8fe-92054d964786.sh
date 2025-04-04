#!/bin/bash
set -e

# Debug information
echo "Script started at $(date)"
echo "Current directory: $(pwd)"
echo "Python path: "python""
echo "Script path: "/Users/mukundsoni/Desktop/mvp-imageGen/scripts/chatgpt_image_generator.py""

# Remove any previous output file
if [ -f "/Users/mukundsoni/Desktop/mvp-imageGen/temp/output_b558cea4-8d2c-48f1-b8fe-92054d964786.json" ]; then
  echo "Removing previous output file"
  rm "/Users/mukundsoni/Desktop/mvp-imageGen/temp/output_b558cea4-8d2c-48f1-b8fe-92054d964786.json" || true
fi

# Check if Python exists
command -v python >/dev/null 2>&1 || { echo "ERROR: Python interpreter not found at python"; exit 1; }

# Check if script exists
if [ ! -f "/Users/mukundsoni/Desktop/mvp-imageGen/scripts/chatgpt_image_generator.py" ]; then
  echo "ERROR: Script not found at /Users/mukundsoni/Desktop/mvp-imageGen/scripts/chatgpt_image_generator.py"
  exit 1
fi

# Check if cookie file exists (if using cookies)

if [ ! -f "/Users/mukundsoni/Desktop/mvp-imageGen/scripts/chatgpt_cookies.json" ]; then
  echo "WARNING: Cookie file not found at /Users/mukundsoni/Desktop/mvp-imageGen/scripts/chatgpt_cookies.json"
fi


# Execute with proper error handling
echo "Executing Python script..."

# Save and escape arguments properly
PYTHON_PATH="python"
SCRIPT_PATH="/Users/mukundsoni/Desktop/mvp-imageGen/scripts/chatgpt_image_generator.py"
COOKIE_PATH="/Users/mukundsoni/Desktop/mvp-imageGen/scripts/chatgpt_cookies.json"
IMAGE_PATH="/Users/mukundsoni/Desktop/mvp-imageGen/public/uploads/40dbaefb-5202-481f-9b20-6749229e6e41.jpeg"
PRODUCT_NAME="hi"
SLOGAN="ok"
OUTPUT_PATH="/Users/mukundsoni/Desktop/mvp-imageGen/temp/output_b558cea4-8d2c-48f1-b8fe-92054d964786.json"
PRICE="10"
PLATFORM="DIGITAL_SIGNAGE"
AUDIENCE="good"
BRAND_COLORS="red"

# Build and execute command
CMD="$PYTHON_PATH $SCRIPT_PATH"
CMD="$CMD --cookies \"$COOKIE_PATH\""
CMD="$CMD --image \"$IMAGE_PATH\""
CMD="$CMD --product \"$PRODUCT_NAME\""
CMD="$CMD --slogan \"$SLOGAN\""
CMD="$CMD --output \"$OUTPUT_PATH\""
CMD="$CMD --headless"
CMD="$CMD --price \"$PRICE\""
CMD="$CMD --platform \"$PLATFORM\""
CMD="$CMD --audience \"$AUDIENCE\""
CMD="$CMD --colors \"$BRAND_COLORS\""

echo "Running command: $CMD"
eval "$CMD"

status=$?
if [ $status -ne 0 ]; then
  echo "Python script failed with exit code $status"
  exit $status
fi

# Check if output file was created
if [ ! -f "/Users/mukundsoni/Desktop/mvp-imageGen/temp/output_b558cea4-8d2c-48f1-b8fe-92054d964786.json" ]; then
  echo "ERROR: Output file was not created at /Users/mukundsoni/Desktop/mvp-imageGen/temp/output_b558cea4-8d2c-48f1-b8fe-92054d964786.json"
  exit 1
fi

echo "Python script execution completed successfully"
echo "Output file exists: $(ls -la /Users/mukundsoni/Desktop/mvp-imageGen/temp/output_b558cea4-8d2c-48f1-b8fe-92054d964786.json)"
