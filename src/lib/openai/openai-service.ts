import OpenAI from 'openai';
import { GenerationPlatform } from '@/lib/db/types';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define platform-specific dimensions
/* eslint-disable @typescript-eslint/no-unused-vars */
const PLATFORM_DIMENSIONS: Record<GenerationPlatform, { width: number; height: number }> = {
  [GenerationPlatform.DIGITAL_SIGNAGE]: { width: 1920, height: 1080 }, // 16:9 aspect ratio
  [GenerationPlatform.INSTAGRAM_POST]: { width: 1080, height: 1080 }, // 1:1 aspect ratio
  [GenerationPlatform.INSTAGRAM_STORY]: { width: 1080, height: 1920 }, // 9:16 aspect ratio
  [GenerationPlatform.TIKTOK]: { width: 1080, height: 1920 }, // 9:16 aspect ratio
};

// Helper function to get the correct size string for OpenAI API
function getSizeString(platform: GenerationPlatform): "1024x1024" | "1792x1024" | "1024x1792" {
  if (platform === GenerationPlatform.INSTAGRAM_POST) {
    return "1024x1024"; // Square
  } else if (platform === GenerationPlatform.DIGITAL_SIGNAGE) {
    return "1792x1024"; // Landscape
  } else {
    return "1024x1792"; // Portrait (for INSTAGRAM_STORY and TIKTOK)
  }
}

// Function to generate the prompt for OpenAI
export function generatePrompt(
  productName: string,
  slogan: string,
  price: string,
  audience: string,
  platform: GenerationPlatform,
  brandColors: string
): string {
  const platformText = platform.replace('_', ' ').toLowerCase();
  
  return `Create a professional marketing image for ${productName} with the following details:
- Slogan: "${slogan}"
- Price: ${price}
- Target audience: ${audience}
- Brand colors: ${brandColors}

The image should be optimized for ${platformText} with clear product visualization, 
eye-catching design that incorporates the brand colors, and prominently displays the slogan and price.
Make the text legible and ensure the overall design is polished and professional.`;
}

// Function to generate image using OpenAI
export async function generateImage(
  prompt: string,
  platform: GenerationPlatform
): Promise<string | null> {
  try {
    const size = getSizeString(platform);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: size,
      quality: "standard",
      response_format: "url",
    });

    return response.data[0]?.url || null;
  } catch (error) {
    console.error('Error generating image with OpenAI:', error);
    return null;
  }
} 