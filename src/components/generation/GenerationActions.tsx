'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  Share2, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy,
  Check
} from 'lucide-react';

interface GenerationActionsProps {
  imageUrl: string;
  title: string;
  showLabels?: boolean;
}

export default function GenerationActions({ 
  imageUrl, 
  title,
  showLabels = false
}: GenerationActionsProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoadingCanvas, setIsLoadingCanvas] = useState(false);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  
  // Function to download the image
  const handleDownload = async () => {
    try {
      // Create an invisible anchor with the image URL
      const a = document.createElement('a');
      a.style.display = 'none';
      
      // For external URLs with CORS restrictions, use our proxy API
      if (imageUrl.startsWith('https://oaidalleapiprodscus.blob.core.windows.net') || 
          imageUrl.includes('?')) {
        try {
          // Use our proxy API route to bypass CORS
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(imageUrl)}`;
          const response = await fetch(proxyUrl);
          
          if (!response.ok) {
            throw new Error('Failed to proxy image');
          }
          
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          a.href = url;
          a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
        } catch (proxyError) {
          console.error('Proxy error:', proxyError);
          
          // Fallback to the canvas method if proxy fails
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          // Set up a promise to handle image loading
          const imgLoaded = new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageUrl;
          });
          
          // Wait for image to load
          await imgLoaded.catch(() => {
            // If loading with crossOrigin fails, we'll try without it
            img.crossOrigin = '';
            img.src = imageUrl;
          });
          
          // Create a canvas and draw the image on it
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          
          // Get data URL from canvas (this bypasses CORS)
          try {
            a.href = canvas.toDataURL('image/png');
            a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
            document.body.appendChild(a);
            a.click();
          } catch (canvasError) {
            // If toDataURL fails due to tainted canvas, inform the user
            alert('Cannot download this image directly due to security restrictions. Right-click and use "Save image as" instead.');
            return;
          }
        }
      } else {
        // For internal URLs without CORS issues, use direct approach
        a.href = imageUrl;
        a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
      }
      
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try saving it directly by right-clicking and selecting "Save image as".');
    }
  };

  // Function to copy image URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  // Function to share on social media
  const shareOnSocialMedia = (platform: string) => {
    let shareUrl = '';
    const text = encodeURIComponent(`Check out this AI-generated content: ${title}`);
    const url = encodeURIComponent(window.location.href);

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  useEffect(() => {
    if (canvasError) {
      console.error('Canvas error:', canvasError);
    }
  }, [canvasError]);

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleDownload}
        className={`flex items-center gap-1 ${showLabels ? 'px-3 py-1.5 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700' : 'p-1 text-gray-500 transition rounded-full hover:bg-gray-100'}`}
        title="Download"
      >
        <Download className={`${showLabels ? 'w-4 h-4' : 'w-5 h-5'}`} />
        {showLabels && 'Download'}
      </button>
      
      <div className="relative">
        <button 
          onClick={() => setShowShareOptions(!showShareOptions)}
          className={`flex items-center gap-1 ${showLabels ? 'px-3 py-1.5 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50' : 'p-1 text-gray-500 transition rounded-full hover:bg-gray-100'}`}
          title="Share"
        >
          <Share2 className={`${showLabels ? 'w-4 h-4' : 'w-5 h-5'}`} />
          {showLabels && 'Share'}
        </button>
        
        {showShareOptions && (
          <div className="absolute right-0 z-10 w-52 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
            <p className="px-3 py-2 text-xs font-medium text-gray-500">Share on</p>
            <div className="grid grid-cols-4 gap-1 mt-1 p-2">
              <button 
                onClick={() => alert('Instagram sharing requires app integration')}
                className="flex flex-col items-center p-2 text-gray-700 transition rounded-md hover:bg-gray-50"
              >
                <Instagram className="w-5 h-5" />
                <span className="mt-1 text-xs">Instagram</span>
              </button>
              <button 
                onClick={() => shareOnSocialMedia('facebook')}
                className="flex flex-col items-center p-2 text-gray-700 transition rounded-md hover:bg-gray-50"
              >
                <Facebook className="w-5 h-5" />
                <span className="mt-1 text-xs">Facebook</span>
              </button>
              <button 
                onClick={() => shareOnSocialMedia('twitter')}
                className="flex flex-col items-center p-2 text-gray-700 transition rounded-md hover:bg-gray-50"
              >
                <Twitter className="w-5 h-5" />
                <span className="mt-1 text-xs">Twitter</span>
              </button>
              <button 
                onClick={() => shareOnSocialMedia('linkedin')}
                className="flex flex-col items-center p-2 text-gray-700 transition rounded-md hover:bg-gray-50"
              >
                <Linkedin className="w-5 h-5" />
                <span className="mt-1 text-xs">LinkedIn</span>
              </button>
              
              <div className="col-span-4 mt-2 pt-2 border-t border-gray-100">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center w-full p-2 text-gray-700 transition rounded-md hover:bg-gray-50"
                >
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                  <span className="text-xs">{copied ? 'Copied!' : 'Copy link'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 