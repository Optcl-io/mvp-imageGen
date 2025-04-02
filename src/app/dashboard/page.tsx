import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import ContentGeneratorForm from "@/components/forms/ContentGeneratorForm";
import GenerationHistory from "@/components/dashboard/GenerationHistory";
import dynamic from "next/dynamic";
import Link from "next/link";

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
    ? parseInt(process.env.PAID_TIER_DAILY_LIMIT || "10")
    : parseInt(process.env.FREE_TIER_DAILY_LIMIT || "3");
  
  const remainingGenerations = Math.max(0, dailyLimit - generationsToday);

  // Get data
  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const images = await prisma.image.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                Welcome back, {user.name?.split(' ')[0] || 'Creator'}!
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`${
                  user.subscription === "PAID" 
                    ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white" 
                    : "bg-gray-200 text-gray-800"
                } px-4 py-1.5 rounded-full text-sm font-bold shadow-sm`}>
                  {user.subscription === "PAID" ? "✨ Premium Plan" : "Free Plan"}
                </span>
                
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        remainingGenerations === 0 
                          ? 'bg-red-500' 
                          : user.subscription === "PAID" 
                            ? 'bg-green-500' 
                            : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (generationsToday / dailyLimit) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-600">
                    {remainingGenerations}/{dailyLimit} remaining
                  </span>
                </div>
              </div>
            </div>

            {user.subscription !== "PAID" && (
              <Link 
                href="/pricing"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Upgrade to Premium
              </Link>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Generator Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Content
                  </h2>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      Your images:
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {images.length}
                    </span>
                  </div>
                </div>
                <ContentGeneratorForm 
                  images={images} 
                  remainingGenerations={remainingGenerations} 
                />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Your Content Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-sm font-medium">Today's Generations</p>
                    <p className="text-2xl font-bold">{generationsToday}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-sm font-medium">Total Images</p>
                    <p className="text-2xl font-bold">{images.length}</p>
                  </div>
                </div>
              </div>
              
              {/* Recent Generations */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Recent Content
                  </h3>
                  <Link
                    href="/history"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </Link>
                </div>
                <GenerationHistory generations={generations} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FixedSubscribeButton />
    </>
  );
}