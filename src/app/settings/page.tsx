import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  Settings, 
  Bell, 
  Key, 
  LogOut, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      subscription: true,
      stripeSubscriptionId: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col w-screen bg-white">
      <div className="px-4 py-8 mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 p-1 mr-4 text-gray-500 transition rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Account Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 overflow-hidden bg-gray-100 rounded-full">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'User avatar'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-2xl font-medium text-gray-500">
                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-base font-medium text-gray-900">
                      {user.name || user.email.split('@')[0]}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className={`px-3 py-1 text-xs font-medium inline-flex items-center rounded-full ${
                    user.subscription === "PAID" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {user.subscription === "PAID" ? "Premium Account" : "Free Account"}
                  </div>
                </div>
              </div>
              
              <nav>
                <ul className="divide-y divide-gray-200">
                  <li>
                    <Link
                      href="#profile"
                      className="flex items-center px-6 py-4 text-sm transition rounded-none hover:bg-gray-50"
                    >
                      <User className="w-5 h-5 mr-3 text-gray-500" />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#subscription"
                      className="flex items-center px-6 py-4 text-sm transition rounded-none hover:bg-gray-50"
                    >
                      <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                      <span>Subscription</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#notifications"
                      className="flex items-center px-6 py-4 text-sm transition rounded-none hover:bg-gray-50"
                    >
                      <Bell className="w-5 h-5 mr-3 text-gray-500" />
                      <span>Notifications</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#security"
                      className="flex items-center px-6 py-4 text-sm transition rounded-none hover:bg-gray-50"
                    >
                      <ShieldCheck className="w-5 h-5 mr-3 text-gray-500" />
                      <span>Security</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#preferences"
                      className="flex items-center px-6 py-4 text-sm transition rounded-none hover:bg-gray-50"
                    >
                      <Settings className="w-5 h-5 mr-3 text-gray-500" />
                      <span>Preferences</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      className="flex items-center w-full px-6 py-4 text-sm text-left transition rounded-none hover:bg-red-50"
                    >
                      <LogOut className="w-5 h-5 mr-3 text-red-500" />
                      <span className="text-red-600">Sign out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Section */}
            <section id="profile" className="p-6 mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h2 className="flex items-center mb-6 text-lg font-medium text-gray-900">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                Profile Information
              </h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name || ''}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Contact support to change your email address.
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Profile Picture
                  </label>
                  <div className="flex items-center">
                    <div className="relative w-16 h-16 overflow-hidden mr-4 bg-gray-100 rounded-full">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || 'User avatar'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-2xl font-medium text-gray-500">
                          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <label
                          htmlFor="avatar-upload"
                          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                          Change
                          <input id="avatar-upload" type="file" className="hidden" accept="image/*" />
                        </label>
                        {user.image && (
                          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or GIF. 2MB max.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </section>
            
            {/* Subscription Section */}
            <section id="subscription" className="p-6 mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h2 className="flex items-center mb-6 text-lg font-medium text-gray-900">
                <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                Subscription Plan
              </h2>
              
              <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className={`px-3 py-1 text-xs font-medium inline-flex items-center rounded-full mb-2 ${
                      user.subscription === "PAID" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {user.subscription === "PAID" ? "Premium Plan" : "Free Plan"}
                    </div>
                    <h3 className="text-base font-medium text-gray-900">
                      {user.subscription === "PAID" ? "Premium Account" : "Free Account"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {user.subscription === "PAID" 
                        ? "You have access to all premium features" 
                        : "Basic access with limited features"}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    {user.subscription === "PAID" ? (
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Manage Subscription
                      </button>
                    ) : (
                      <Link
                        href="/pricing"
                        className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Upgrade to Premium
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              
              {user.subscription === "PAID" && (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-900">
                    Payment Method
                  </h3>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 mr-3 bg-gray-100 rounded-md">
                        <CreditCard className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Visa ending in 4242
                        </p>
                        <p className="text-xs text-gray-500">
                          Expires 12/2025
                        </p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      Update
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="mb-3 text-sm font-medium text-gray-900">
                      Billing History
                    </h3>
                    <div className="border border-gray-200 rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Apr 1, 2023 - Premium Plan
                            </p>
                            <p className="text-xs text-gray-500">
                              Invoice #INV-2023-04-001
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-4 text-sm font-medium text-gray-900">
                              $19.99
                            </span>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Mar 1, 2023 - Premium Plan
                            </p>
                            <p className="text-xs text-gray-500">
                              Invoice #INV-2023-03-001
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-4 text-sm font-medium text-gray-900">
                              $19.99
                            </span>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            
            {/* Security Section */}
            <section id="security" className="p-6 mb-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <h2 className="flex items-center mb-6 text-lg font-medium text-gray-900">
                <ShieldCheck className="w-5 h-5 mr-2 text-gray-500" />
                Security
              </h2>
              
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-gray-900">
                  Change Password
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-gray-200">
                <h3 className="mb-3 text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      We'll send you a code to verify your identity when you sign in
                    </p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                    Enable 2FA
                  </button>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-gray-200">
                <h3 className="mb-3 text-sm font-medium text-red-600">
                  Danger Zone
                </h3>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="text-sm font-medium text-red-700">Delete Account</h4>
                  <p className="mt-1 text-sm text-red-600">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <div className="mt-3">
                    <button className="px-4 py-2 text-sm font-medium text-white transition bg-red-600 rounded-lg hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 