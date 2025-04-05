import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, Instagram, Smartphone, Tv, Globe } from "lucide-react";

type ExportPageProps = {
  params: {
    id: string;
  }
}

export default async function ExportPage({
  params,
}: ExportPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  // Use params.id after all async operations
  const generationId = params.id;
  
  const generation = await prisma.generation.findUnique({
    where: {
      id: generationId,
      userId: session.user.id, // Only allow user to view their own generations
    },
    include: {
      results: true,
    },
  });

  if (!generation) {
    redirect("/dashboard");
  }

  // Check if there are results to export
  if (!generation.results || generation.results.length === 0) {
    redirect(`/generation/${generationId}`);
  }

  return (
    <div className="flex flex-col w-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href={`/generation/${generationId}`}
            className="flex items-center gap-1 p-1 mr-4 text-gray-500 transition rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Export Options
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Preview Section */}
          <div className="p-6 border border-gray-200 rounded-xl">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Content Preview</h2>
            <div className="grid grid-cols-2 gap-4">
              {generation.results.slice(0, 4).map((result, index) => (
                <div key={result.id} className="relative overflow-hidden rounded-lg aspect-square">
                  <Image
                    src={result.url}
                    alt={`Generated content ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {generation.results.length > 4 && (
              <p className="mt-3 text-sm text-gray-500 text-center">
                +{generation.results.length - 4} more designs available
              </p>
            )}

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-gray-900">Download All</h3>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  PNG Files
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  JPG Files
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  All Files (ZIP)
                </button>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="p-6 border border-gray-200 rounded-xl">
            <h2 className="mb-6 text-lg font-medium text-gray-900">Export To Platform</h2>
            
            <div className="space-y-6">
              {/* Digital Signage */}
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-blue-100">
                    <Tv className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Digital Signage</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Export your content directly to connected digital signage networks.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                        <ExternalLink className="w-4 h-4" />
                        Connect Signage
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Instagram */}
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-pink-100">
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Instagram</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Publish your content as posts or stories directly to Instagram.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white transition bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600">
                        <Instagram className="w-4 h-4" />
                        Connect Account
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Schedule Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* TikTok */}
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-black">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">TikTok</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Export your content to TikTok for short-form video platforms.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white transition bg-black rounded-lg hover:bg-gray-900">
                        <Smartphone className="w-4 h-4" />
                        Connect TikTok
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Website Integration */}
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 mr-4 rounded-full bg-green-100">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Website Integration</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get embeddable code to integrate with your website or online store.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white transition bg-green-600 rounded-lg hover:bg-green-700">
                        <ExternalLink className="w-4 h-4" />
                        Get Embed Code
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        View Docs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Premium Upgrade CTA */}
        <div className="p-6 mt-8 text-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
          <h2 className="mb-2 text-xl font-bold text-gray-900">Want More Export Options?</h2>
          <p className="mb-4 text-gray-700">
            Upgrade to Premium for advanced export features, direct integrations with more platforms, and scheduling.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    </div>
  );
} 