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
    take: 10,
  });

  return (
    <main className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user.name || user.email || 'User'}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row items-start md:items-center">
          {/* Subscription status badge */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.subscription === "PAID" 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {user.subscription === "PAID" ? "Premium" : "Free"} Plan
          </div>
          
          {/* Remaining generations counter */}
          <div className="text-sm text-gray-600">
            {remainingGenerations} / {dailyLimit} generations remaining today
          </div>
        </div>
      </div>

      {/* Subscription issue button - only shown to users on free tier */}
      {user.subscription !== "PAID" && session?.user?.subscription !== "PAID" && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-800 mb-2">Subscription Problem?</h3>
          <p className="text-sm text-indigo-700 mb-4">
            If you've already paid but your account still shows as Free, you can fix the issue.
          </p>
          <Link 
            href="/fix-subscription" 
            className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
          >
            Fix My Subscription
          </Link>
        </div>
      )}

      {/* Content generator form */}
      <div className="mb-12 bg-white rounded-xl shadow-sm p-6">
        <ContentGeneratorForm 
          remainingGenerations={remainingGenerations}
          isPremium={user.subscription === "PAID"}
        />
      </div>

      {/* Recent generations */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Generations</h2>
        <GenerationHistory generations={generations as any} />
      </div>

      {/* Free tier CTA */}
      {user.subscription !== "PAID" && (
        <div className="fixed bottom-5 right-5 z-10">
          <FixedSubscribeButton />
        </div>
      )}
    </main>
  );
}