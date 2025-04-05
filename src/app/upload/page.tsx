import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { ArrowLeft, Upload, Image, Check, AlertTriangle } from "lucide-react";

export default async function UploadPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscription: true,
      _count: {
        select: {
          images: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  // Calculate upload limits based on subscription
  const maxUploads = user.subscription === "PAID" ? 100 : 10;
  const uploadsUsed = user._count.images;
  const uploadsRemaining = Math.max(0, maxUploads - uploadsUsed);
  const uploadPercentage = Math.round((uploadsUsed / maxUploads) * 100);

  return (
    <div className="flex flex-col w-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 p-1 mr-4 text-gray-500 transition rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Image Upload
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column: Upload form */}
          <div className="lg:col-span-2">
            <div className="p-6 border border-gray-200 rounded-xl">
              <h2 className="mb-6 text-lg font-medium text-gray-900">Upload Product Images</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Main upload area */}
                <div className="md:col-span-2">
                  <div className="flex flex-col items-center p-8 text-center border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-center w-20 h-20 mb-4 bg-blue-50 rounded-full">
                      <Upload className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      Drag and drop your files here
                    </h3>
                    <p className="mb-4 text-sm text-gray-500 max-w-md">
                      Upload product images for generation. Supported formats: JPG, PNG, WEBP. 
                      Maximum file size: 5MB per image.
                    </p>
                    <label
                      htmlFor="file-upload"
                      className="px-5 py-2.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer"
                    >
                      Browse Files
                      <input id="file-upload" type="file" className="hidden" multiple accept="image/*" />
                    </label>
                  </div>
                </div>
                
                {/* Upload tips */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="flex items-center gap-2 mb-3 text-sm font-medium text-blue-800">
                    <Check className="w-4 h-4" /> 
                    Best Practices
                  </h3>
                  <ul className="pl-6 text-sm text-blue-700 list-disc space-y-1">
                    <li>Use high-quality product images with clear backgrounds</li>
                    <li>Ensure product is well lit and centered in the frame</li>
                    <li>Square or rectangular images work best</li>
                    <li>Remove any distracting elements from the background</li>
                  </ul>
                </div>
                
                {/* Upload limits */}
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h3 className="flex items-center gap-2 mb-3 text-sm font-medium text-amber-800">
                    <AlertTriangle className="w-4 h-4" /> 
                    Upload Limits
                  </h3>
                  <p className="mb-2 text-sm text-amber-700">
                    You have used {uploadsUsed} of {maxUploads} uploads
                    ({uploadsRemaining} remaining)
                  </p>
                  <div className="w-full h-2 mb-2 bg-amber-200 rounded-full">
                    <div 
                      className="h-2 rounded-full bg-amber-500" 
                      style={{ width: `${Math.min(100, uploadPercentage)}%` }}
                    ></div>
                  </div>
                  {user.subscription !== "PAID" && (
                    <p className="text-xs text-amber-700">
                      <Link href="/pricing" className="underline hover:text-amber-800">
                        Upgrade to Premium
                      </Link> for more uploads and larger file sizes.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Batch upload options */}
              <div className="p-4 mt-6 border border-gray-200 rounded-lg">
                <h3 className="mb-4 text-base font-medium text-gray-900">
                  Batch Upload Options
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Product Line Name (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Summer Collection 2023"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Apply Tags to All (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. shoes, summer, outdoor"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                    <Upload className="w-4 h-4" />
                    Upload All Files
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Instructions */}
          <div className="lg:col-span-1">
            <div className="p-6 border border-gray-200 rounded-xl">
              <h2 className="mb-4 text-lg font-medium text-gray-900">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white bg-blue-600 rounded-full">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Upload Images</h3>
                    <p className="text-sm text-gray-500">
                      Upload product images that you want to use for generation.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white bg-blue-600 rounded-full">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Go to Dashboard</h3>
                    <p className="text-sm text-gray-500">
                      Navigate to your dashboard where you'll see your uploaded images.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white bg-blue-600 rounded-full">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Generate Content</h3>
                    <p className="text-sm text-gray-500">
                      Select an image and fill out product details to create AI-powered marketing assets.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-bold text-white bg-blue-600 rounded-full">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Export & Share</h3>
                    <p className="text-sm text-gray-500">
                      Download your generated content or share directly to social media and digital signage.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Link
                  href="/dashboard"
                  className="inline-block px-4 py-2 text-sm font-medium text-blue-600 transition border border-blue-200 rounded-lg hover:bg-blue-50"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
            
            {/* Upgrade CTA */}
            {user.subscription !== "PAID" && (
              <div className="p-6 mt-6 text-center bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
                <h3 className="mb-2 text-base font-medium text-gray-900">Premium Benefits</h3>
                <ul className="mb-4 text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2 justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                    Batch upload up to 100 images
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                    Increase file size limit to 10MB
                  </li>
                  <li className="flex items-center gap-2 justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                    Priority AI generation queue
                  </li>
                </ul>
                <Link
                  href="/pricing"
                  className="inline-block px-4 py-2 text-sm font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 