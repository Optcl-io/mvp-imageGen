'use client';

import Image from 'next/image';
import { useState } from 'react';
import { GenerationPlatform, GenerationStatus } from '@/lib/db/types';

// Define Generation type manually since we aren't using the Prisma generated type
type Generation = {
  id: string;
  userId: string;
  prompt: string;
  targetPlatform: GenerationPlatform;
  status: GenerationStatus;
  outputImageUrl: string | null;
  feedback: string | null;
  slogan: string | null;
  price: string | null;
  audience: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type GenerationWithFormatting = Generation & {
  formattedDate: string;
  statusClass: string;
  statusText: string;
}

interface GenerationHistoryProps {
  generations: Generation[];
}

export default function GenerationHistory({ generations }: GenerationHistoryProps) {
  const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);

  // Format generations with additional display properties
  const formattedGenerations: GenerationWithFormatting[] = generations.map(gen => {
    const formattedDate = new Date(gen.createdAt).toLocaleString();
    
    let statusClass = '';
    let statusText = '';
    
    switch (gen.status) {
      case GenerationStatus.COMPLETED:
        statusClass = 'bg-green-100 text-green-800';
        statusText = 'Completed';
        break;
      case GenerationStatus.PENDING:
        statusClass = 'bg-yellow-100 text-yellow-800';
        statusText = 'Pending';
        break;
      case GenerationStatus.FAILED:
        statusClass = 'bg-red-100 text-red-800';
        statusText = 'Failed';
        break;
      default:
        statusClass = 'bg-gray-100 text-gray-800';
        statusText = gen.status;
    }

    return {
      ...gen,
      formattedDate,
      statusClass,
      statusText
    };
  });

  // Handle generation download
  const handleDownload = (imageUrl: string | null, platform: GenerationPlatform) => {
    if (!imageUrl) return;
    
    // Open image in new tab
    window.open(imageUrl, '_blank');
  };

  // Handle social media share
  const handleShare = (generation: Generation) => {
    // In a real implementation, this would connect to social media APIs
    alert('This would integrate with the social media platform API to share the content directly.');
  };

  return (
    <div>
      {formattedGenerations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No generations yet. Create your first one!
        </div>
      ) : (
        <div className="space-y-4">
          {formattedGenerations.map((generation) => (
            <div 
              key={generation.id} 
              className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">
                      {generation.targetPlatform.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-gray-500">{generation.formattedDate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${generation.statusClass}`}>
                    {generation.statusText}
                  </span>
                </div>
                
                {generation.slogan && (
                  <p className="text-sm mb-2">
                    <span className="font-medium">Slogan:</span> {generation.slogan}
                  </p>
                )}

                {generation.status === GenerationStatus.COMPLETED && generation.outputImageUrl && (
                  <div className="mt-3">
                    <div className="relative aspect-video rounded-md overflow-hidden mb-3">
                      <Image
                        src={generation.outputImageUrl}
                        alt={`Generated content for ${generation.targetPlatform}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(generation.outputImageUrl, generation.targetPlatform)}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleShare(generation)}
                        className="text-sm px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                )}
                
                {generation.status === GenerationStatus.FAILED && (
                  <p className="text-sm text-red-500 mt-2">
                    Generation failed. Please try again.
                  </p>
                )}
                
                {generation.status === GenerationStatus.PENDING && (
                  <div className="flex items-center justify-center h-20 bg-gray-50 rounded-md mt-2">
                    <div className="animate-pulse text-gray-400">Processing...</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 