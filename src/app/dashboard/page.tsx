import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import ContentGeneratorForm from "@/components/forms/ContentGeneratorForm";
import GenerationHistory from "@/components/dashboard/GenerationHistory";
import dynamic from "next/dynamic";

// Dynamically import client components
const FixedSubscribeButton = dynamic(() => import('@/components/subscription/FixedSubscribeButton'), { ssr: false });

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  // Get user's generation count for today
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      generationsToday: true,
      subscription: true,
      lastGenerationDay: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  // Check if it's a new day and reset the counter if needed
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let generationsToday = user.generationsToday;
  
  if (!user.lastGenerationDay || user.lastGenerationDay < today) {
    generationsToday = 0;
    // We don't update the database here to avoid unnecessary writes
    // The actual update will happen when a generation is created
  }

  // Calculate remaining generations
  const dailyLimit = user.subscription === "PAID" 
    ? parseInt(process.env.PAID_TIER_DAILY_LIMIT || "5")
    : parseInt(process.env.FREE_TIER_DAILY_LIMIT || "1");
  
  const remainingGenerations = Math.max(0, dailyLimit - generationsToday);

  // Get user's previous generations
  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Get user's uploaded images
  const images = await prisma.image.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Digital Content Generator</h1>
          <div className="flex items-center">
            <p className="text-gray-600">
              {user.subscription === "PAID" ? "Premium" : "Free"} Account
            </p>
            <span className="mx-2">•</span>
            <p className="text-gray-600">
              {remainingGenerations} generation{remainingGenerations !== 1 ? "s" : ""} remaining today
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Generate New Content</h2>
              <ContentGeneratorForm 
                images={images} 
                remainingGenerations={remainingGenerations} 
              />
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Generations</h2>
              <GenerationHistory generations={generations} />
            </div>
          </div>
        </div>
      </div>
      <FixedSubscribeButton />
    </>
  );
} 