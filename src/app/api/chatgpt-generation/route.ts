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
      
      // Instead of joining and executing as a string, use child_process.spawn
      // which handles argument spaces properly
      const { spawn } = require('child_process');
      
      let tempScriptPath, shellCommand;
      
      if (process.platform === 'win32') {
        // For Windows, we have two options:
        const usePowerShell = true; // Set to false to use batch files instead
        
        if (usePowerShell) {
          // PowerShell script (better handling of special characters)
          const psContent = `
& "${pythonPath}" "${scriptPath}" `+
            `--email "${process.env.OPENAI_EMAIL}" `+
            `--password "${process.env.OPENAI_PASSWORD}" `+
            `--image "${imagePath}" `+
            `--product "${productName}" `+
            `--slogan "${slogan}" `+
            `--output "${outputJsonPath}" `+
            `--headless `+
            `${price ? `--price "${price}" ` : ''}`+
            `${platform ? `--platform "${platform}" ` : ''}`+
            `${audience ? `--audience "${audience}" ` : ''}`+
            `${brandColors ? `--colors "${brandColors}"` : ''}`;
          
          tempScriptPath = path.join(tempDir, `run_${generation.id}.ps1`);
          await fs.writeFile(tempScriptPath, psContent);
          shellCommand = `powershell.exe -ExecutionPolicy Bypass -File "${tempScriptPath}"`;
          
          // For security, mask the password in logs
          const maskedPsContent = psContent.replace(
            /--password\s+"(.+?)"/,
            '--password "********"'
          );
          console.log("Running PowerShell script with content:");
          console.log(maskedPsContent);
        } else {
          // Batch file (traditional approach)
          const batchContent = `@echo off
"${pythonPath}" ^
  "${scriptPath}" ^
  --email "${process.env.OPENAI_EMAIL}" ^
  --password "${process.env.OPENAI_PASSWORD}" ^
  --image "${imagePath}" ^
  --product "${productName}" ^
  --slogan "${slogan}" ^
  --output "${outputJsonPath}" ^
  --headless ^
  ${price ? `--price "${price}" ^` : ''}
  ${platform ? `--platform "${platform}" ^` : ''}
  ${audience ? `--audience "${audience}" ^` : ''}
  ${brandColors ? `--colors "${brandColors}"` : ''}
`;
          tempScriptPath = path.join(tempDir, `run_${generation.id}.bat`);
          await fs.writeFile(tempScriptPath, batchContent);
          shellCommand = tempScriptPath;
          
          // For security, mask the password in logs
          const maskedBatchContent = batchContent.replace(
            /--password\s+"(.+?)"/,
            '--password "********"'
          );
          console.log("Running batch file with content:");
          console.log(maskedBatchContent);
        }
      } else {
        // For Unix systems, create a shell script
        const scriptContent = `#!/bin/bash
"${pythonPath}" \\
  "${scriptPath}" \\
  --email "${process.env.OPENAI_EMAIL}" \\
  --password "${process.env.OPENAI_PASSWORD}" \\
  --image "${imagePath}" \\
  --product "${productName}" \\
  --slogan "${slogan}" \\
  --output "${outputJsonPath}" \\
  --headless \\
  ${price ? `--price "${price}" \\` : ''}
  ${platform ? `--platform "${platform}" \\` : ''}
  ${audience ? `--audience "${audience}" \\` : ''}
  ${brandColors ? `--colors "${brandColors}"` : ''}
`;
        tempScriptPath = path.join(tempDir, `run_${generation.id}.sh`);
        await fs.writeFile(tempScriptPath, scriptContent);
        await execAsync(`chmod +x "${tempScriptPath}"`);
        shellCommand = tempScriptPath;
        
        // For security, mask the password in logs
        const maskedScriptContent = scriptContent.replace(
          /--password\s+"(.+?)"/,
          '--password "********"'
        );
        console.log("Running script with content:");
        console.log(maskedScriptContent);
      }
      
      console.log("Created temporary script file");
      
      // Execute the script file
      const execResult = await execAsync(shellCommand).catch(e => ({ 
        stdout: "", 
        stderr: e.message || "Unknown error", 
        error: e
      }));
      
      const stdout = execResult.stdout;
      const stderr = execResult.stderr;
      
      console.log("Script output:", stdout);
      
      // Clean up the temporary script
      await fs.unlink(tempScriptPath).catch(e => 
        console.error("Error deleting temp script:", e)
      );
      
      if (stderr) {
        console.error("Script errors:", stderr);
      }
      
      // Check for specific error conditions in the output
      if (stdout.includes("CloudFlare") || stdout.includes("verification challenge")) {
        console.error("CloudFlare challenge detected");
        await prisma.generation.update({
          where: { id: generation.id },
          data: {
            status: "FAILED",
            feedback: "CloudFlare security challenge detected. Please try again later or contact support."
          },
        });
        
        return NextResponse.json({
          success: false,
          error: "CloudFlare security challenge detected. OpenAI is currently blocking automated access. Please try again later."
        }, { status: 503 }); // Service Unavailable
      }
      
      if (stdout.includes("security check") || stdout.includes("verify you are human")) {
        console.error("Security verification detected");
        await prisma.generation.update({
          where: { id: generation.id },
          data: {
            status: "FAILED",
            feedback: "Security verification detected. Please try again later or contact support."
          },
        });
        
        return NextResponse.json({
          success: false,
          error: "Security verification detected. OpenAI is currently requiring manual verification. Please try again later."
        }, { status: 503 }); // Service Unavailable
      }
      
      // Check for common error patterns in the output
      if (stdout.includes("Timeout") && stdout.includes("exceeded")) {
        console.error("Script timed out during execution");
        
        await prisma.generation.update({
          where: { id: generation.id },
          data: {
            status: "FAILED",
            feedback: "Operation timed out. OpenAI might be experiencing high traffic."
          },
        });
        
        return NextResponse.json({
          success: false,
          error: "ChatGPT automation timed out. The OpenAI service may be slow or experiencing issues."
        }, { status: 504 }); // Gateway Timeout
      }
      
      // Read the output JSON if it exists
      let result;
      try {
        const resultJson = await fs.readFile(outputJsonPath, 'utf8');
        result = JSON.parse(resultJson);
        
        if (!result.success) {
          throw new Error("Script execution failed: " + (result.error || "Unknown error"));
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
        await fs.unlink(outputJsonPath).catch(e => 
          console.error("Error deleting output JSON:", e)
        );
        
        return NextResponse.json({
          success: true,
          generationId: generation.id,
          outputImageUrl: outputImageUrl,
        });
      } catch (readError: any) {
        console.error("Error reading output JSON:", readError);
        
        // Check if the file doesn't exist, which means the script failed
        // before creating the output file
        if (readError.code === 'ENOENT') {
          await prisma.generation.update({
            where: { id: generation.id },
            data: {
              status: "FAILED",
              feedback: "ChatGPT automation failed before generating an image."
            },
          });
          
          return NextResponse.json({
            success: false,
            error: "ChatGPT automation failed. The script encountered an error before image generation."
          }, { status: 500 });
        }
        
        throw readError;
      }
    } catch (error: any) {
      console.error("Error executing Python script:", error);
      
      // Get a more descriptive error message
      const errorMessage = error.message || "Unknown error";
      
      // Update generation status to failed with specific message
      await prisma.generation.update({
        where: { id: generation.id },
        data: {
          status: "FAILED",
          feedback: `Error: ${errorMessage.substring(0, 200)}`
        },
      });
      
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to process image generation",
          details: errorMessage
        },
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