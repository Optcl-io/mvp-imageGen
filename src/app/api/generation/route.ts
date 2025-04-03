import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import { Subscription } from "@/lib/db/types";
import { GenerationPlatform } from "@prisma/client";
import openai from "@/lib/openai/client";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { productName, slogan, price, audience, platform, brandColors, imageId } = body;

    if (!productName || !slogan) {
      return NextResponse.json(
        { error: "Product name and slogan are required" },
        { status: 400 }
      );
    }

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Get the user's generation limit status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscription: true,
        generationsToday: true,
        lastGenerationDay: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if it's a new day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let generationsToday = user.generationsToday;
    
    if (!user.lastGenerationDay || user.lastGenerationDay < today) {
      generationsToday = 0;
      // Will be updated below
    }

    // Check if user has exceeded their daily limit
    const dailyLimit = user.subscription === Subscription.PAID 
      ? parseInt(process.env.PAID_TIER_DAILY_LIMIT || "10")
      : parseInt(process.env.FREE_TIER_DAILY_LIMIT || "3");
    
    if (generationsToday >= dailyLimit) {
      return NextResponse.json(
        { error: "Daily generation limit reached" },
        { status: 403 }
      );
    }

    // Get the image
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image || image.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Image not found or not owned by user" },
        { status: 404 }
      );
    }

    // Create a new generation record in the database
    const generation = await prisma.generation.create({
      data: {
        userId: session.user.id,
        prompt: `Create ${platform} content for product "${productName}" with slogan "${slogan}"${
          price ? ` priced at ${price}` : ""
        }${audience ? ` targeting ${audience}` : ""}${
          brandColors ? ` using brand colors ${brandColors}` : ""
        }`,
        targetPlatform: platform as GenerationPlatform,
        status: "PENDING",
        slogan: slogan,
        price: price,
        audience: audience,
      },
    });

    // Update user's generation count
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        generationsToday: generationsToday + 1,
        lastGenerationDay: today,
      },
    });

    // Create a prompt for OpenAI to generate content
    const prompt = `
      Create marketing content for a product with the following details:
      - Product Name: ${productName}
      - Slogan/Tagline: ${slogan}
      ${price ? `- Price: ${price}` : ""}
      ${audience ? `- Target Audience: ${audience}` : ""}
      ${brandColors ? `- Brand Colors: ${brandColors}` : ""}
      - Target Platform: ${platform}
      
      The content should be optimized for ${platform} and include engaging text.
    `;

    // Call OpenAI API to generate text content
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a marketing expert that creates platform-specific content for digital signage and social media."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
    });

    const generatedText = response.choices[0]?.message?.content || "";

    // Now generate an image based on the text and original image
    const imagePrompt = `
      Create a professional marketing image for ${platform} showing the product.
      Product: ${productName}
      Slogan: ${slogan}
      ${price ? `Price: ${price}` : ""}
      ${audience ? `Target Audience: ${audience}` : ""}
      ${brandColors ? `Using brand colors: ${brandColors}` : ""}
      Style: Polished, professional, appealing to target audience, perfect for ${platform}
    `;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
    });

    const generatedImageUrl = imageResponse.data[0]?.url || "";

    // Update the generation record with generated content
    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        outputImageUrl: generatedImageUrl,
        status: "COMPLETED",
        feedback: generatedText,
      },
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      outputText: generatedText,
      outputImageUrl: generatedImageUrl,
    });
  } catch (error) {
    console.error("Error in content generation:", error);
    return NextResponse.json(
      { error: "Failed to process content generation" },
      { status: 500 }
    );
  }
} 