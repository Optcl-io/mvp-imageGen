'use client';
import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Pricing', href: '/pricing' },
];

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-white">
      {({ open }) => (
        <>
          <div className="px-4 mx-auto max-w-[1920px] sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center w-48">
                <Link href="/" className="flex items-center group">
                  <div className="relative transition-all duration-300 h-[30px] w-[30px] group-hover:rotate-12">
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      fill
                      className="object-contain invert"
                    />
                  </div>
                  <span className="ml-3 text-2xl font-bold text-transparent bg-black bg-clip-text">
                    Optcl
                  </span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative px-4 py-2 text-lg font-medium rounded-lg transition-all duration-200 ${
                        pathname === item.href
                          ? 'text-blue-600 font-semibold'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {item.name}
                      {pathname === item.href && (
                        <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 bg-blue-600 rounded-full"></span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Desktop Auth/User Section */}
              <div className="hidden md:block">
                {session?.user ? (
                  <Menu as="div" className="relative ml-4">
                    <Menu.Button className="flex items-center justify-end w-48 space-x-2 text-sm rounded-full focus:outline-none">
                      <span className="sr-only">Open user menu</span>
                      {session.user.image ? (
                        <div className="relative w-10 h-10 overflow-hidden border-2 border-white rounded-full shadow-md">
                          <Image
                            src={session.user.image}
                            alt="User profile"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-pink-500">
                          <span className="text-xl font-bold text-white">
                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/dashboard"
                              className={`block px-4 py-2 text-sm ${
                                active ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut({ callbackUrl: '/' })}
                              className={`block w-full px-4 py-2 text-left text-sm ${
                                active ? 'bg-gray-50 text-red-600' : 'text-gray-700'
                              }`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-lg font-medium text-gray-700 transition-colors duration-200 rounded-lg hover:text-blue-600"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-6 py-2.5 text-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile menu button */}
              <div className="flex -mr-2 md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-lg ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {session?.user ? (
                <>
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      {session.user.image ? (
                        <div className="relative w-10 h-10 overflow-hidden border-2 border-white rounded-full shadow-md">
                          <Image
                            src={session.user.image}
                            alt="User profile"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                          <span className="text-xl font-bold text-white">
                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {session.user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="px-2 mt-3 space-y-1">
                    <Disclosure.Button
                      as={Link}
                      href="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      Dashboard
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </>
              ) : (
                <div className="px-2 mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    href="/auth/login"
                    className="block w-full px-3 py-2.5 text-base font-medium text-center text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    Sign in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    href="/auth/register"
                    className="block w-full px-3 py-2.5 text-base font-medium text-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700"
                  >
                    Sign up
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}