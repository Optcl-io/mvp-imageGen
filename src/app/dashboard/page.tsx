import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import ContentGeneratorForm from "@/components/forms/ContentGeneratorForm";
import GenerationHistory from "@/components/dashboard/GenerationHistory";
import dynamic from "next/dynamic";
import { Sparkles, Zap, History, User } from "lucide-react";
import Link from "next/link";
import { Image as ImageIcon, ChevronRight } from "lucide-react";

// Dynamically import client components
const FixedSubscribeButton = dynamic(
  () => import('@/components/subscription/FixedSubscribeButton'),
  { loading: () => null }
);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      generationsToday: true,
      subscription: true,
      lastGenerationDay: true,
      name: true,
      email: true,
      generations: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          generations: true,
          images: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  // Check if it's a new day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let generationsToday = user.generationsToday;
  
  if (!user.lastGenerationDay || user.lastGenerationDay < today) {
    generationsToday = 0;
  }

  // Calculate limits
  const dailyLimit = user.subscription === "PAID" 
    ? parseInt(process.env.PAID_TIER_DAILY_LIMIT || "50")
    : parseInt(process.env.FREE_TIER_DAILY_LIMIT || "5");
  
  const remainingGenerations = Math.max(0, dailyLimit - generationsToday);
  const generationPercentage = Math.round((generationsToday / dailyLimit) * 100);

  return (
    <div className="flex flex-col w-screen bg-white ">
      <div className="px-4 py-8 mx-auto max-w-7xl"> 
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back, <span className="font-medium text-gray-900">{user.name || user.email?.split('@')[0] || 'Creator'}</span>
          </p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Subscription status badge */}
          <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
            user.subscription === "PAID" 
              ? "bg-gradient-to-r from-green-100 to-teal-100 text-green-800" 
              : "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800"
          }`}>
            {user.subscription === "PAID" ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {user.subscription === "PAID" ? "Premium Plan" : "Free Plan"}
          </div>
          
          {/* Remaining generations counter */}
          <div className="flex items-center gap-2 px-4 py-2 text-sm text-blue-800 rounded-full bg-blue-50">
            <Zap className="w-4 h-4" />
            <span>{remainingGenerations} of {dailyLimit} remaining today</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 mb-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today&apos;s Usage</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {generationsToday} <span className="text-sm font-normal text-gray-500">/ {dailyLimit}</span>
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
              <History className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${
                  generationPercentage >= 90 ? 'bg-red-500' : 
                  generationPercentage >= 70 ? 'bg-amber-500' : 'bg-blue-500'
                }`} 
                style={{ width: `${Math.min(100, generationPercentage)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Generations</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{user._count.generations}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-50">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {user._count.generations === 0 ? 'Start creating!' : 'Keep up the great work!'}
          </p>
        </div>

        <div className="p-6 bg-white border shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Uploaded Images</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{user._count.images}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50">
              <ImageIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {user._count.images === 0 ? 'Upload your first image' : 'Ready for more creations'}
          </p>
        </div>

        <div className="p-6 bg-white border shadow-sm rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Account Status</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {user.subscription === "PAID" ? 'Active' : 'Free'}
              </p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          {user.subscription !== "PAID" && (
            <Link 
              href="/pricing" 
              className="inline-block mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Upgrade now →
            </Link>
          )}
        </div>
      </div>

      {/* Content generator form */}
      <div className="p-8 mb-12 border border-gray-200 shadow-sm bg-gradient-to-br from-white to-gray-50 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-purple-500">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Content</h2>
        </div>
        <ContentGeneratorForm 
          remainingGenerations={remainingGenerations}
          isPremium={user.subscription === "PAID"}
        />
      </div>

      {/* Recent generations */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Generations</h2>
          {user._count.generations > 0 && (
            <Link 
              href="/generations" 
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        {user.generations.length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <GenerationHistory generations={user.generations as any} />
        ) : (
          <div className="p-8 text-center bg-white border-2 border-gray-200 border-dashed rounded-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
              <Sparkles className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="mb-1 text-lg font-medium text-gray-900">No generations yet</h3>
            <p className="mb-4 text-gray-500">Your created content will appear here</p>
            <p className="text-sm text-gray-400">Generate your first ad above</p>
          </div>
        )}
      </div>

      {/* Free tier CTA */}
      {user.subscription !== "PAID" && (
        <div className="fixed z-10 bottom-5 right-5">
          <FixedSubscribeButton />
        </div>
      )}
    </div>
    </div>
  );
}