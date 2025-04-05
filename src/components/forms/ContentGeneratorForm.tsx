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
  images?: ImageType[];
  remainingGenerations: number;
  isPremium?: boolean;
}

type TabType = 'content' | 'image-to-image';

export default function ContentGeneratorForm({ 
  images = [], 
  remainingGenerations
}: ContentGeneratorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceImageRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('image-to-image');
  
  // Content generation form fields
  const [productName, setProductName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [price, setPrice] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState<GenerationPlatform>(GenerationPlatform.DIGITAL_SIGNAGE);
  const [brandColors, setBrandColors] = useState('');
  
  // Image-to-image form fields
  const [transformPrompt, setTransformPrompt] = useState('');
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);

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
    console.log("Form submission triggered");
    console.log("Selected image:", selectedImage);
    console.log("Remaining generations:", remainingGenerations);
    console.log("Product name:", productName);
    console.log("Slogan:", slogan);

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

  const handleSourceImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    setSourceImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSourceImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageTransform = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Image transform triggered");
    console.log("Source image file:", sourceImageFile);
    console.log("Transform prompt:", transformPrompt);
    console.log("Remaining generations:", remainingGenerations);

    if (!sourceImageFile) {
      setGenerationError('Please select a source image to transform');
      return;
    }

    if (!transformPrompt) {
      setGenerationError('Please provide a prompt for image transformation');
      return;
    }

    if (remainingGenerations <= 0) {
      setGenerationError('You have reached your daily generation limit');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      const formData = new FormData();
      formData.append('sourceImage', sourceImageFile);
      formData.append('prompt', transformPrompt);
      formData.append('targetPlatform', platform);

      const response = await fetch('/api/ai/image-to-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transform image');
      }

      router.refresh();
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Failed to transform image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        Content Generator
      </h2>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'content'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-indigo-500'
          }`}
        >
          Content Generation
        </button>
        <button
          onClick={() => setActiveTab('image-to-image')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'image-to-image'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-indigo-500'
          }`}
        >
          Image Transformation
        </button>
      </div>

      {activeTab === 'content' ? (
        <>
          {/* Image Upload Section */}
          <div className="p-6 mb-8 border border-indigo-100 rounded-lg bg-indigo-50">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-8 h-8 mr-3 font-bold text-white bg-indigo-600 rounded-full">
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
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white file:text-indigo-700 hover:file:bg-indigo-50 file:shadow-sm file:border file:border-indigo-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center px-5 py-2 text-white transition-colors bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                  {isUploading ? (
                    <>
                      <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : 'Upload'}
                </button>
              </div>
              {uploadError && <p className="mt-2 text-sm text-red-500">{uploadError}</p>}
            </form>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-medium text-gray-700">Select an image:</h4>
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage?.id === image.id 
                          ? 'border-indigo-500 ring-2 ring-indigo-200' 
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => {
                        setSelectedImage(image);
                        console.log("Image selected:", image.id);
                      }}
                    >
                      <Image
                        src={image.url}
                        alt="Uploaded product"
                        fill
                        className="object-cover"
                      />
                      {selectedImage?.id === image.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 bg-opacity-20">
                          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="p-6 border border-purple-100 rounded-lg bg-purple-50">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center w-8 h-8 mr-3 font-bold text-white bg-purple-600 rounded-full">
                2
              </div>
              <h3 className="text-lg font-semibold text-purple-800">Enter Details & Generate</h3>
            </div>

            <form onSubmit={handleGenerateContent}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  disabled={isGenerating}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition-all ${
                    isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  <div className="p-3 mt-3 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">{generationError}</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </>
      ) : (
        /* Image-to-Image Transformation Form */
        <div className="p-6 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-teal-50">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-8 h-8 mr-3 font-bold text-white bg-blue-600 rounded-full">
              1
            </div>
            <h3 className="text-lg font-semibold text-blue-800">Image Transformation</h3>
          </div>
          
          <form onSubmit={handleImageTransform}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload Source Image
              </label>
              <input
                type="file"
                ref={sourceImageRef}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleSourceImageSelect}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white file:text-blue-700 hover:file:bg-blue-50 file:shadow-sm file:border file:border-blue-200"
              />
            </div>

            {sourceImagePreview && (
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-medium text-gray-700">Source Image:</h4>
                <div className="relative w-full h-64 overflow-hidden border-2 border-blue-300 rounded-lg">
                  <Image
                    src={sourceImagePreview}
                    alt="Source image"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Transformation Prompt<span className="text-red-500">*</span>
              </label>
              <textarea
                value={transformPrompt}
                onChange={(e) => setTransformPrompt(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe how you want the image to be transformed..."
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Target Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as GenerationPlatform)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={GenerationPlatform.DIGITAL_SIGNAGE}>Digital Signage</option>
                <option value={GenerationPlatform.INSTAGRAM_POST}>Instagram Post</option>
                <option value={GenerationPlatform.INSTAGRAM_STORY}>Instagram Story</option>
                <option value={GenerationPlatform.TIKTOK}>TikTok</option>
              </select>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition-all ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Transforming Image...
                  </span>
                ) : (
                  `Transform Image (${remainingGenerations} remaining today)`
                )}
              </button>
              {generationError && (
                <div className="p-3 mt-3 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-red-600">{generationError}</p>
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Generation Counter */}
      <div className="mt-4 text-sm text-center text-gray-500">
        {remainingGenerations > 0 ? (
          <p>You have <span className="font-bold text-indigo-600">{remainingGenerations}</span> generations left today</p>
        ) : (
          <p className="text-red-500">You&apos;ve used all your generations for today</p>
        )}
      </div>
    </div>
  );
}