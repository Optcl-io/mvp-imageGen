'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GenerationPlatform } from '@/lib/db/types';

// Define Image type manually since we aren't using the Prisma generated type
type ImageType = {
  id: string;
  userId: string;
  url: string;
  filename: string;
  fileSize: number;
  contentType: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ContentGeneratorFormProps {
  images: ImageType[];
  remainingGenerations: number;
}

export default function ContentGeneratorForm({ 
  images, 
  remainingGenerations 
}: ContentGeneratorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  
  const [productName, setProductName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [price, setPrice] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState<GenerationPlatform>(GenerationPlatform.DIGITAL_SIGNAGE);
  const [brandColors, setBrandColors] = useState('');

  // Handle image upload
  const handleImageUpload = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!fileInputRef.current?.files?.length) {
      setUploadError('Please select an image to upload');
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setUploadError('');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Refresh the page to get the new image
      router.refresh();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle content generation
  const handleGenerateContent = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      setGenerationError('Please select an image first');
      return;
    }

    if (!productName || !slogan) {
      setGenerationError('Product name and slogan are required');
      return;
    }

    if (remainingGenerations <= 0) {
      setGenerationError('You have reached your daily generation limit');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      const response = await fetch('/api/generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          slogan,
          price,
          audience,
          platform,
          brandColors,
          imageId: selectedImage.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      // Refresh the page to show the new generation
      router.refresh();
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* Image Upload Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">1. Upload Product Image</h3>
        <form onSubmit={handleImageUpload} className="mb-4">
          <div className="mb-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
          {uploadError && <p className="mt-2 text-red-500 text-sm">{uploadError}</p>}
        </form>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Select an image:</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative aspect-square cursor-pointer rounded-md overflow-hidden border-2 ${
                    selectedImage?.id === image.id ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.url}
                    alt="Uploaded product"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generation Form */}
      <div>
        <h3 className="text-lg font-medium mb-3">2. Enter Details & Generate</h3>
        <form onSubmit={handleGenerateContent}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name*
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slogan/Tagline*
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. $99.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. Young adults, professionals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Colors
              </label>
              <input
                type="text"
                value={brandColors}
                onChange={(e) => setBrandColors(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. Blue and white, #FF5500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as GenerationPlatform)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value={GenerationPlatform.DIGITAL_SIGNAGE}>Digital Signage</option>
                <option value={GenerationPlatform.INSTAGRAM_POST}>Instagram Post</option>
                <option value={GenerationPlatform.INSTAGRAM_STORY}>Instagram Story</option>
                <option value={GenerationPlatform.TIKTOK}>TikTok</option>
              </select>
            </div>

            <div className="mt-2">
              <button
                type="submit"
                disabled={isGenerating || remainingGenerations <= 0 || !selectedImage}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isGenerating ? 'Generating...' : `Generate Content (${remainingGenerations} left today)`}
              </button>
              {generationError && <p className="mt-2 text-red-500 text-sm">{generationError}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 