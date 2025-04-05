'use client';

import { useState } from 'react';
import { Download, Share2, Check } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface BulkActionsProps {
  generations: Array<{
    id: string;
    prompt: string;
    outputImageUrl?: string | null;
  }>;
}

export default function BulkActions({ generations }: BulkActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Filter generations that have an output image URL
  const completedGenerations = generations.filter(
    gen => gen.outputImageUrl
  );
  
  // Function to download all images as a ZIP file
  const handleBulkDownload = async () => {
    if (completedGenerations.length === 0) {
      alert('No completed generations to download.');
      return;
    }
    
    setIsDownloading(true);
    
    try {
      const zip = new JSZip();
      const imagesFolder = zip.folder('images');
      
      // Create an array of promises for fetching each image
      const downloadPromises = completedGenerations.map(async (generation) => {
        if (!generation.outputImageUrl) return;
        
        try {
          // For CORS-protected URLs, use our proxy API
          if (generation.outputImageUrl.startsWith('https://oaidalleapiprodscus.blob.core.windows.net') || 
              generation.outputImageUrl.includes('?')) {
            try {
              // Use our proxy API route to bypass CORS
              const proxyUrl = `/api/proxy?url=${encodeURIComponent(generation.outputImageUrl)}`;
              const response = await fetch(proxyUrl);
              
              if (!response.ok) {
                throw new Error(`Failed to proxy image: ${generation.prompt}`);
              }
              
              const blob = await response.blob();
              const filename = `${generation.prompt.replace(/\s+/g, '-').toLowerCase().substring(0, 30)}-${generation.id.substring(0, 8)}.png`;
              imagesFolder?.file(filename, blob);
            } catch (proxyError) {
              console.error(`Proxy error for ${generation.id}:`, proxyError);
              
              // Fallback to canvas approach if proxy fails
              const img = new Image();
              img.crossOrigin = 'anonymous';
              
              // Set up a promise to handle image loading
              const imgLoaded = new Promise((resolve, reject) => {
                img.onload = () => resolve(img);
                img.onerror = () => {
                  // If loading fails with crossOrigin, try without it
                  img.crossOrigin = '';
                  img.src = generation.outputImageUrl as string;
                  img.onload = () => resolve(img);
                  img.onerror = () => reject(new Error(`Failed to load image: ${generation.prompt}`));
                };
                
                img.src = generation.outputImageUrl as string;
              });
              
              // Wait for image to load
              const loadedImg = await imgLoaded;
              
              // Create a canvas and draw the image on it
              const canvas = document.createElement('canvas');
              canvas.width = (loadedImg as HTMLImageElement).width;
              canvas.height = (loadedImg as HTMLImageElement).height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(loadedImg as HTMLImageElement, 0, 0);
              
              // Get data URL from canvas
              const dataUrl = canvas.toDataURL('image/png');
              
              // Convert data URL to blob
              const byteString = atob(dataUrl.split(',')[1]);
              const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              
              const blob = new Blob([ab], { type: mimeString });
              const filename = `${generation.prompt.replace(/\s+/g, '-').toLowerCase().substring(0, 30)}-${generation.id.substring(0, 8)}.png`;
              imagesFolder?.file(filename, blob);
            }
          } else {
            // For direct URLs without CORS issues
            const response = await fetch(generation.outputImageUrl);
            if (!response.ok) throw new Error(`Failed to fetch image: ${generation.prompt}`);
            
            const blob = await response.blob();
            const filename = `${generation.prompt.replace(/\s+/g, '-').toLowerCase().substring(0, 30)}-${generation.id.substring(0, 8)}.jpg`;
            imagesFolder?.file(filename, blob);
          }
        } catch (error) {
          console.error(`Error processing image ${generation.id}:`, error);
          // Continue with other images even if one fails
        }
      });
      
      // Wait for all downloads to complete
      await Promise.all(downloadPromises);
      
      // Check if we actually added any files
      const files = await zip.folder('images')?.file(/.+/);
      if (!files || files.length === 0) {
        throw new Error('Could not download any images due to security restrictions.');
      }
      
      // Generate and save the ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'ai-generated-content.zip');
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      alert(`Failed to download images: ${error instanceof Error ? error.message : 'Unknown error'}. Try downloading images individually.`);
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Function to copy collection URL to clipboard
  const copyCollectionLink = async () => {
    try {
      const collectionUrl = window.location.href;
      await navigator.clipboard.writeText(collectionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex gap-4">
        <button 
          onClick={handleBulkDownload}
          disabled={isDownloading || completedGenerations.length === 0}
          className={`flex items-center gap-2 px-4 py-2 font-medium text-white transition bg-blue-600 rounded-lg ${
            isDownloading || completedGenerations.length === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-blue-700'
          }`}
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Downloading...' : 'Export All'}
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center gap-2 px-4 py-2 font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Share2 className="w-4 h-4" />
            Share Collection
          </button>
          
          {showShareOptions && (
            <div className="absolute right-0 z-10 w-64 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-4">
                <p className="mb-2 text-sm font-medium text-gray-700">Share this collection</p>
                <p className="mb-4 text-xs text-gray-500">Copy the link to share your collection with others</p>
                
                <button
                  onClick={copyCollectionLink}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy collection link'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 