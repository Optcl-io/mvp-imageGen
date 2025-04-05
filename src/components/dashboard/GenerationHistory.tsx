'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { 
  Clock, 
  Info, 
  Instagram, 
  Maximize, 
  Smartphone, 
  Tv, 
} from 'lucide-react';
import Link from 'next/link';
import { GenerationPlatform, GenerationStatus } from '@/lib/db/types';
import GenerationActions from '../generation/GenerationActions';

export interface GenerationHistoryProps {
  generations: Array<{
    id: string;
    prompt: string;
    slogan?: string | null;
    price?: string | null;
    audience?: string | null;
    targetPlatform: GenerationPlatform;
    status: GenerationStatus;
    outputImageUrl?: string | null;
    createdAt: Date;
    outputImage?: {
      url: string;
    } | null;
  }>;
  viewMode?: 'list' | 'grid';
}

export default function GenerationHistory({ generations, viewMode = 'list' }: GenerationHistoryProps) {
  if (viewMode === 'grid') {
    return (
      <>
        {generations.map((generation) => (
          <div 
            key={generation.id} 
            className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition group"
          >
            <div className="relative aspect-square w-full">
              {generation.outputImageUrl || (generation.outputImage && generation.outputImage.url) ? (
                <Image
                  src={generation.outputImageUrl || (generation.outputImage?.url || '/placeholder.jpg')}
                  alt={generation.prompt}
                  fill
                  className="object-cover w-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <p className="text-sm text-gray-500">No preview available</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Link 
                  href={`/generation/${generation.id}`}
                  className="p-2 bg-white rounded-full shadow-lg"
                >
                  <Maximize className="w-5 h-5 text-gray-700" />
                </Link>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 truncate">{generation.prompt.split(' ').slice(0, 3).join(' ')}</h3>
                {generation.targetPlatform && (
                  <div className="flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded">
                    {generation.targetPlatform === 'DIGITAL_SIGNAGE' && <Tv className="w-3 h-3 mr-1" />}
                    {generation.targetPlatform === 'INSTAGRAM_POST' && <Instagram className="w-3 h-3 mr-1" />}
                    {generation.targetPlatform === 'INSTAGRAM_STORY' && <Instagram className="w-3 h-3 mr-1" />}
                    {generation.targetPlatform === 'TIKTOK' && <Smartphone className="w-3 h-3 mr-1" />}
                    {generation.targetPlatform.replace('_', ' ')}
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{generation.slogan}</p>
              <div className="flex items-center mt-4 text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}
              </div>
              
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    generation.status === 'COMPLETED' 
                      ? 'bg-green-100 text-green-800' 
                      : generation.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {generation.status}
                  </span>
                </div>
                {generation.status === 'COMPLETED' && generation.outputImageUrl && (
                  <GenerationActions 
                    imageUrl={generation.outputImageUrl} 
                    title={generation.prompt}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }
  
  // Default list view
  return (
    <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      <ul className="divide-y divide-gray-200">
        {generations.map((generation) => (
          <li key={generation.id} className="hover:bg-gray-50">
            <div className="flex items-center p-4 sm:px-6">
              <div className="flex items-center flex-1 min-w-0">
                {/* Source image thumbnail */}
                <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-100 rounded-md">
                  {generation.outputImageUrl || (generation.outputImage && generation.outputImage.url) ? (
                    <Image
                      src={generation.outputImageUrl || (generation.outputImage?.url || '/placeholder.jpg')}
                      alt="Source"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100">
                      <Info className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 px-4">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{generation.prompt.split(' ').slice(0, 5).join(' ')}</h3>
                    {generation.targetPlatform && (
                      <div className="ml-2 flex items-center px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded">
                        {generation.targetPlatform === 'DIGITAL_SIGNAGE' && <Tv className="w-3 h-3 mr-1" />}
                        {generation.targetPlatform === 'INSTAGRAM_POST' && <Instagram className="w-3 h-3 mr-1" />}
                        {generation.targetPlatform === 'INSTAGRAM_STORY' && <Instagram className="w-3 h-3 mr-1" />}
                        {generation.targetPlatform === 'TIKTOK' && <Smartphone className="w-3 h-3 mr-1" />}
                        {generation.targetPlatform.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{generation.slogan || generation.prompt}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div className="ml-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  generation.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : generation.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {generation.status}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center ml-4 space-x-2">
                <Link 
                  href={`/generation/${generation.id}`}
                  className="p-1 text-gray-500 transition rounded-full hover:bg-gray-100"
                  title="View details"
                >
                  <Maximize className="w-5 h-5" />
                </Link>
                {generation.status === 'COMPLETED' && generation.outputImageUrl && (
                  <GenerationActions 
                    imageUrl={generation.outputImageUrl} 
                    title={generation.prompt}
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 