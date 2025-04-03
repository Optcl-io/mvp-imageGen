import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check admin status - only admins can validate cookies
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Check for cookie files
    const cookieFilePaths = [
      path.join(process.cwd(), "scripts", "cookies.json"),
      path.join(process.cwd(), "scripts", "chatgpt_cookies.json")
    ];
    
    const foundCookieFiles = cookieFilePaths.filter(path => existsSync(path));
    
    if (foundCookieFiles.length === 0) {
      return NextResponse.json({ 
        valid: false,
        message: "No cookie files found. Please add cookies.json to the scripts directory.",
        cookieFiles: []
      });
    }
    
    // Get validation results for each file
    const results = [];
    
    for (const filePath of foundCookieFiles) {
      try {
        const validationCommand = `python ${path.join(process.cwd(), "scripts", "check_cookies.py")} --cookies "${filePath}"`;
        
        const { stdout, stderr } = await execAsync(validationCommand);
        
        const isValid = stdout.includes("SUCCESS: Cookie file appears valid");
        const cookieCount = stdout.match(/Found (\d+) valid cookies/);
        const openaiCookies = stdout.match(/Found (\d+) cookies for OpenAI domains/);
        const sessionCookies = stdout.match(/Found (\d+) session cookies/);
        
        results.push({
          path: filePath,
          filename: path.basename(filePath),
          valid: isValid,
          cookieCount: cookieCount ? parseInt(cookieCount[1]) : 0,
          openaiCookies: openaiCookies ? parseInt(openaiCookies[1]) : 0,
          sessionCookies: sessionCookies ? parseInt(sessionCookies[1]) : 0,
          output: stdout
        });
      } catch (error: any) {
        results.push({
          path: filePath,
          filename: path.basename(filePath),
          valid: false,
          error: error.message,
          output: error.stdout || "Error validating cookie file"
        });
      }
    }
    
    // Get the overall status
    const anyValid = results.some(r => r.valid);
    
    return NextResponse.json({
      valid: anyValid,
      message: anyValid 
        ? "Valid cookie file found" 
        : "No valid cookie files found. Please check the validation errors.",
      cookieFiles: results
    });
    
  } catch (error: any) {
    console.error("Error validating cookies:", error);
    return NextResponse.json(
      { error: "Failed to validate cookies", details: error.message },
      { status: 500 }
    );
  }
} 