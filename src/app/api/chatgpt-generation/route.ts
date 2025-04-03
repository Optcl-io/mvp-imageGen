import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import { Subscription } from "@/lib/db/types";
import { GenerationPlatform } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

const execAsync = promisify(exec);

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

    // Ensure temp directory exists
    const tempDir = path.join(process.cwd(), "temp");
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (err) {
      console.log("Temp directory already exists or error creating it");
    }

    // Create temp paths for input/output
    const imagePath = image.url.startsWith("/") 
      ? path.join(process.cwd(), "public", image.url) 
      : path.join(process.cwd(), "public", "/uploads/", path.basename(image.url));
    
    const outputJsonPath = path.join(tempDir, `output_${generation.id}.json`);

    // Build command
    const scriptPath = path.join(process.cwd(), "scripts", "chatgpt_image_generator.py");
    
    // Use the conda environment's Python
    // This could be either the conda Python or a virtual environment Python
    let pythonPath = 'python';
    let useConda = true;
    
    // First, try with system Python to see if playwright is available
    try {
      const { stdout, stderr } = await execAsync('python -c "import playwright; print(\'playwright installed\')"');
      if (stdout.includes('playwright installed')) {
        console.log("Playwright is available in system Python, using it directly");
        pythonPath = 'python';
        useConda = false;
      }
    } catch (e) {
      console.log("Playwright not found in system Python, looking for conda environment...");
      useConda = true;
    }
    
    if (useConda) {
      if (process.platform === 'darwin') { // macOS
        // Common conda locations on macOS
        const commonPaths = [
          '/usr/local/anaconda3/envs/chatgpt-automation/bin/python',
          '/usr/local/miniconda3/envs/chatgpt-automation/bin/python',
          `${process.env.HOME}/anaconda3/envs/chatgpt-automation/bin/python`,
          `${process.env.HOME}/miniconda3/envs/chatgpt-automation/bin/python`,
          '/opt/homebrew/anaconda3/envs/chatgpt-automation/bin/python',
          '/opt/homebrew/miniconda3/envs/chatgpt-automation/bin/python',
        ];
        
        // Check if any of the paths exist
        for (const path of commonPaths) {
          try {
            if (existsSync(path)) {
              pythonPath = path;
              break;
            }
          } catch (e) {
            // Ignore errors and continue to the next path
          }
        }
        
        // If no path was found, use conda run
        if (pythonPath === 'python') {
          pythonPath = 'conda run -n chatgpt-automation python';
        }
      } else if (process.platform === 'win32') {
        // On Windows, use conda run
        pythonPath = 'conda run -n chatgpt-automation python';
      } else if (process.env.NODE_ENV === 'production') {
        // For production Linux servers
        pythonPath = '/opt/conda/envs/chatgpt-automation/bin/python';
      }
    }
    
    const command = [
      pythonPath,
      scriptPath,
      "--email", process.env.OPENAI_EMAIL as string,
      "--password", process.env.OPENAI_PASSWORD as string,
      "--image", imagePath,
      "--product", productName,
      "--slogan", slogan,
      "--output", outputJsonPath,
      "--headless"
    ];

    if (price) command.push("--price", price);
    if (platform) command.push("--platform", platform);
    if (audience) command.push("--audience", audience);
    if (brandColors) command.push("--colors", brandColors);

    // Execute the Python script
    try {
      console.log("Executing ChatGPT image generation script...");
      
      // Special handling for macOS users when we don't have direct path
      if (process.platform === 'darwin' && pythonPath === 'conda run -n chatgpt-automation python') {
        try {
          // Try to find the exact Python path using which
          const { stdout } = await execAsync('conda run -n chatgpt-automation which python');
          const exactPythonPath = stdout.trim();
          if (exactPythonPath) {
            console.log(`Found conda Python path: ${exactPythonPath}`);
            // Replace the command with the exact path
            command[0] = exactPythonPath;
          }
        } catch (whichError) {
          console.log("Could not determine exact Python path, using conda run instead");
        }
      }
      
      // For security, mask the password in logs
      const logCommand = [...command];
      const pwIndex = logCommand.indexOf("--password") + 1;
      if (pwIndex > 0 && pwIndex < logCommand.length) {
        logCommand[pwIndex] = "********";
      }
      console.log(`Running command: ${logCommand.join(" ")}`);
      
      const { stdout, stderr } = await execAsync(command.join(" "));
      console.log("Script output:", stdout);
      
      if (stderr) {
        console.error("Script errors:", stderr);
      }
      
      // Read the output JSON
      const resultJson = await fs.readFile(outputJsonPath, 'utf8');
      const result = JSON.parse(resultJson);
      
      if (!result.success) {
        throw new Error("Script execution failed");
      }
      
      // Update the generation record with the result
      const outputImageUrl = `/generated_images/${path.basename(result.image_path)}`;
      
      await prisma.generation.update({
        where: { id: generation.id },
        data: {
          outputImageUrl: outputImageUrl,
          status: "COMPLETED",
          feedback: "Generated with ChatGPT"
        },
      });
      
      // Clean up temporary file
      await fs.unlink(outputJsonPath);
      
      return NextResponse.json({
        success: true,
        generationId: generation.id,
        outputImageUrl: outputImageUrl,
      });
    } catch (error) {
      console.error("Error executing Python script:", error);
      
      // Update generation status to failed
      await prisma.generation.update({
        where: { id: generation.id },
        data: {
          status: "FAILED",
        },
      });
      
      return NextResponse.json(
        { error: "Failed to process image generation" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in content generation:", error);
    return NextResponse.json(
      { error: "Failed to process content generation" },
      { status: 500 }
    );
  }
} 