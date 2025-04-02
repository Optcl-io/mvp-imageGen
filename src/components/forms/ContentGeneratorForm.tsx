'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GenerationPlatform } from '@/lib/db/types';

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

      router.refresh();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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

      router.refresh();
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
        Content Generator
      </h2>

      {/* Image Upload Section */}
      <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold mr-3">
            1
          </div>
          <h3 className="text-lg font-semibold text-indigo-800">Upload Product Image</h3>
        </div>
        
        <form onSubmit={handleImageUpload} className="mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png,image/webp"
                className="block w-full text-sm text-gray-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-white file:text-indigo-700
                  hover:file:bg-indigo-50 file:shadow-sm file:border file:border-indigo-200"
              />
            </div>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 shadow-sm transition-colors flex items-center"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : 'Upload'}
            </button>
          </div>
          {uploadError && <p className="mt-2 text-red-500 text-sm">{uploadError}</p>}
        </form>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3 text-gray-700">Select an image:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage?.id === image.id 
                      ? 'border-indigo-500 ring-2 ring-indigo-200' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.url}
                    alt="Uploaded product"
                    fill
                    className="object-cover"
                  />
                  {selectedImage?.id === image.id && (
                    <div className="absolute inset-0 bg-indigo-600 bg-opacity-20 flex items-center justify-center">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generation Form */}
      <div className="p-6 bg-purple-50 rounded-lg border border-purple-100">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold mr-3">
            2
          </div>
          <h3 className="text-lg font-semibold text-purple-800">Enter Details & Generate</h3>
        </div>

        <form onSubmit={handleGenerateContent}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Product Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. Premium Coffee Blend"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Slogan/Tagline<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. Wake Up Your Senses"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. $19.99"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. Young professionals, 25-35"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Brand Colors
              </label>
              <input
                type="text"
                value={brandColors}
                onChange={(e) => setBrandColors(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. #3B82F6 (blue) and white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as GenerationPlatform)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              >
                <option value={GenerationPlatform.DIGITAL_SIGNAGE}>Digital Signage</option>
                <option value={GenerationPlatform.INSTAGRAM_POST}>Instagram Post</option>
                <option value={GenerationPlatform.INSTAGRAM_STORY}>Instagram Story</option>
                <option value={GenerationPlatform.TIKTOK}>TikTok</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isGenerating || remainingGenerations <= 0 || !selectedImage}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition-all ${
                isGenerating || remainingGenerations <= 0 || !selectedImage
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Creative Content...
                </span>
              ) : (
                `Generate Content (${remainingGenerations} remaining today)`
              )}
            </button>
            {generationError && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600 text-sm">{generationError}</p>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Generation Counter */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {remainingGenerations > 0 ? (
          <p>You have <span className="font-bold text-indigo-600">{remainingGenerations}</span> generations left today</p>
        ) : (
          <p className="text-red-500">You've used all your generations for today</p>
        )}
      </div>
    </div>
  );
}