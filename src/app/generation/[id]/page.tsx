import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Instagram,
  MessageSquare,
  Smartphone,
  Tv,
} from "lucide-react";
import GenerationActions from "@/components/generation/GenerationActions";
import FeedbackForm from "@/components/generation/FeedbackForm";

type GenerationDetailsPageProps = {
  params: {
    id: string;
  }
}

export default async function GenerationDetailsPage({
  params,
}: GenerationDetailsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const generation = await prisma.generation.findUnique({
    where: { 
      id: params.id,
      userId: session.user.id, // Only allow user to view their own generations
    },
  });

  if (!generation) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col w-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/generations"
            className="flex items-center gap-1 p-1 mr-4 text-gray-500 transition rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {generation.prompt ? generation.prompt.split(' ').slice(0, 5).join(' ') + '...' : "Content Generation"}
            </h1>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(generation.createdAt), { addSuffix: true })}
              
              {generation.targetPlatform && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    {generation.targetPlatform === 'DIGITAL_SIGNAGE' && <Tv className="w-4 h-4 mr-1" />}
                    {generation.targetPlatform === 'INSTAGRAM_POST' && <Instagram className="w-4 h-4 mr-1" />}
                    {generation.targetPlatform === 'INSTAGRAM_STORY' && <Instagram className="w-4 h-4 mr-1" />}
                    {generation.targetPlatform === 'TIKTOK' && <Smartphone className="w-4 h-4 mr-1" />}
                    {generation.targetPlatform.replace('_', ' ')}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column: Metadata */}
          <div className="lg:col-span-1">
            <div className="p-6 border border-gray-200 rounded-xl">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Generation Details</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Prompt</p>
                  <p className="text-sm text-gray-900">{generation.prompt || "Not specified"}</p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500">Slogan</p>
                  <p className="text-sm text-gray-900">{generation.slogan || "Not specified"}</p>
                </div>
                
                {generation.price && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Price</p>
                    <p className="text-sm text-gray-900">{generation.price}</p>
                  </div>
                )}
                
                {generation.audience && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Target Audience</p>
                    <p className="text-sm text-gray-900">{generation.audience}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-xs font-medium text-gray-500">Status</p>
                  <div className="mt-1">
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
                </div>
              </div>
            </div>
            
            {/* Feedback section */}
            <div className="p-6 mt-6 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-medium text-gray-900">Feedback</h2>
              </div>
              
              <p className="mb-4 text-sm text-gray-500">
                Your feedback helps us improve our AI-generated content.
              </p>
              
              <FeedbackForm generationId={generation.id} />
            </div>
          </div>
          
          {/* Right column: Generated result */}
          <div className="lg:col-span-2">
            <div className="p-6 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Generated Content</h2>
                
                {generation.status === 'COMPLETED' && generation.outputImageUrl && (
                  <GenerationActions
                    imageUrl={generation.outputImageUrl}
                    title={generation.prompt}
                    showLabels={true}
                  />
                )}
              </div>
              
              {generation.outputImageUrl ? (
                <div className="overflow-hidden border border-gray-200 rounded-lg group">
                  <div className="relative aspect-square">
                    <Image
                      src={generation.outputImageUrl}
                      alt="Generated content"
                      fill
                      className="object-cover"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/50 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <a
                          href={generation.outputImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-white transition rounded-full bg-black/50 hover:bg-black/70"
                          title="View full size"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm font-medium text-gray-700">
                          {generation.targetPlatform.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          generation.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800' 
                            : generation.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {generation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 rounded-lg bg-gray-50">
                  <div className="p-3 mb-4 bg-gray-100 rounded-full">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {generation.status === 'PENDING' 
                      ? 'Your content is being generated. Please check back in a few moments.' 
                      : generation.status === 'FAILED'
                      ? 'Content generation failed. Please try again.'
                      : 'No content available.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Export options for completed generations */}
            {generation.status === 'COMPLETED' && generation.outputImageUrl && (
              <div className="p-6 mt-6 border border-gray-200 rounded-xl">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Export Options</h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Link
                    href={`/export/${generation.id}`}
                    className="flex items-center gap-3 p-4 transition rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Tv className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Export for Digital Signage</p>
                      <p className="text-sm text-gray-500">Optimized for display screens</p>
                    </div>
                  </Link>
                  
                  <Link
                    href={`/export/${generation.id}?format=instagram`}
                    className="flex items-center gap-3 p-4 transition rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                      <Instagram className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Export for Instagram</p>
                      <p className="text-sm text-gray-500">Optimized for Instagram posts</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 