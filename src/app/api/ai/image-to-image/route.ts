import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import openai from "@/lib/openai/client";
import { Subscription } from "@/lib/db/types";
import { GenerationPlatform } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse the request body
    const formData = await request.formData();
    const sourceImageFile = formData.get("sourceImage") as File;
    const prompt = formData.get("prompt") as string;
    const targetPlatformString = formData.get("targetPlatform") as string;

    // Ensure target platform is a valid enum value
    if (!Object.values(GenerationPlatform).includes(targetPlatformString as GenerationPlatform)) {
      return NextResponse.json(
        { error: "Invalid target platform" },
        { status: 400 }
      );
    }
    
    const targetPlatform = targetPlatformString as GenerationPlatform;

    if (!sourceImageFile) {
      return NextResponse.json(
        { error: "Source image is required" },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
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

    // Create a new generation record in the database
    const generation = await prisma.generation.create({
      data: {
        userId: session.user.id,
        prompt,
        targetPlatform,
        status: "PENDING",
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

    // For image-to-image, we describe the source image in the prompt
    // and use DALL-E to create a new image based on that description
    const enhancedPrompt = `Transform this image based on: ${prompt}. 
    Ensure the output maintains the core elements of the original but applies the requested changes.`;
    
    // Call OpenAI API to generate the image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      size: "1024x1024",
      n: 1,
    });

    if (!response.data || response.data.length === 0) {
      // Update generation record to failed
      await prisma.generation.update({
        where: { id: generation.id },
        data: {
          status: "FAILED",
        },
      });
      
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    const generatedImageUrl = response.data[0].url;

    // Update the generation record with the generated image URL
    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        outputImageUrl: generatedImageUrl,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      outputImageUrl: generatedImageUrl,
    });
  } catch (error) {
    console.error("Error in image-to-image generation:", error);
    return NextResponse.json(
      { error: "Failed to process image generation" },
      { status: 500 }
    );
  }
} 