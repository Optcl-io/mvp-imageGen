import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { saveUploadedImage } from '@/lib/utils/file-upload';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/auth-options';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const result = await saveUploadedImage(formData, 'image');

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Save image metadata to database
    const image = await prisma.image.create({
      data: {
        userId: session.user.id,
        url: result.fileUrl!,
        filename: result.filename!,
        fileSize: result.fileSize!,
        contentType: result.contentType!,
      },
    });

    return NextResponse.json({
      success: true,
      image: {
        id: image.id,
        url: image.url,
      },
    });
  } catch (error) {
    console.error('Error in upload handler:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 