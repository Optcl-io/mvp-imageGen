import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get URL parameter from the request
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  
  try {
    // Validate that the URL is from our expected sources
    if (!url.startsWith('https://oaidalleapiprodscus.blob.core.windows.net/') && 
        !url.startsWith('https://images.unsplash.com/')) {
      return NextResponse.json({ 
        error: 'Invalid URL source', 
        url: url,
        allowed: ['https://oaidalleapiprodscus.blob.core.windows.net/', 'https://images.unsplash.com/']
      }, { status: 403 });
    }
    
    // Make the request to the target URL
    const response = await fetch(url, {
      headers: {
        'Accept': 'image/*',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` }, 
        { status: response.status }
      );
    }
    
    // Get content type from response headers
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Get image as array buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image', message: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 