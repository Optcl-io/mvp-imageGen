import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import GenerationHistory from "@/components/dashboard/GenerationHistory";
import Link from "next/link";
import { ChevronLeft, Filter, SortDesc } from "lucide-react";
import { GenerationPlatform, GenerationStatus } from "@/lib/db/types";
import BulkActions from "@/components/generation/BulkActions";

type GenerationsPageProps = {
  searchParams: {
    platform?: string;
    sort?: string;
  }
}

export default async function GenerationsPage({
  searchParams,
}: GenerationsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  // Get user data with all generations
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  // Access searchParams after all async operations to avoid Next.js warnings
  const platformParam = searchParams?.platform;
  const sortParam = searchParams?.sort;
  
  const platform = platformParam as GenerationPlatform | undefined;
  const sort = sortParam === "oldest" ? "asc" : "desc";

  // Fetch generations separately
  const generations = await prisma.generation.findMany({
    where: { 
      userId: session.user.id,
      ...(platform ? { targetPlatform: platform } : {})
    },
    orderBy: { createdAt: sort },
  });

  // Transform the Prisma Generation records to match the expected type in GenerationHistory
  const formattedGenerations = generations.map(gen => ({
    id: gen.id,
    prompt: gen.prompt,
    slogan: gen.slogan,
    price: gen.price,
    audience: gen.audience,
    targetPlatform: gen.targetPlatform as GenerationPlatform,
    status: gen.status as GenerationStatus,
    outputImageUrl: gen.outputImageUrl,
    createdAt: gen.createdAt,
  }));

  return (
    <div className="flex flex-col w-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 p-1 mr-4 text-gray-500 transition rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                My Digital Content
              </h1>
              <p className="text-gray-500">
                Browse and manage your AI-generated digital marketing content
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/generations"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                !platform
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </Link>
            <Link
              href="/generations?platform=DIGITAL_SIGNAGE"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                platform === "DIGITAL_SIGNAGE"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Digital Signage
            </Link>
            <Link
              href="/generations?platform=INSTAGRAM_POST"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                platform === "INSTAGRAM_POST"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Instagram Posts
            </Link>
            <Link
              href="/generations?platform=INSTAGRAM_STORY"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                platform === "INSTAGRAM_STORY"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Instagram Stories
            </Link>
            <Link
              href="/generations?platform=TIKTOK"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                platform === "TIKTOK"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              TikTok
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort:</span>
            <Link
              href={`/generations${
                platform ? `?platform=${platform}` : ""
              }${platform ? "&" : "?"}sort=${
                sort === "asc" ? "newest" : "oldest"
              }`}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <SortDesc className="w-4 h-4" />
              {sort === "desc" ? "Newest first" : "Oldest first"}
            </Link>
          </div>
        </div>

        {generations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-3">
              <GenerationHistory generations={formattedGenerations} viewMode="grid" />
            </div>
            
            <BulkActions generations={formattedGenerations} />
          </>
        ) : (
          <div className="p-12 text-center border-2 border-gray-200 border-dashed rounded-xl">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
              <Filter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-gray-900">No content found</h3>
            <p className="max-w-md mx-auto mb-6 text-gray-500">
              {platform
                ? `You haven't created any content for ${platform.replace("_", " ")} yet.`
                : "You haven't created any digital marketing content yet. Head to the dashboard to create your first asset!"}
            </p>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Create Your First Asset
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 