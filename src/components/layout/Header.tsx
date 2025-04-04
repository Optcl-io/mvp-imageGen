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
    <Disclosure as="nav" className="z-40 shadow-lg bg-gradient-to-r from-purple-900 to-blue-800">
      {({ open }) => (
        <>
          <div className="px-4 mx-auto max-w-[1920px] sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <span className="ml-3 text-2xl font-bold text-white">
                    Optcl
                  </span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 text-lg font-medium ${
                        pathname === item.href
                          ? 'rounded-lg bg-white/20 text-white'
                          : 'text-white/80 hover:text-white hover:underline'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden md:block">
                {session?.user ? (
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex text-sm rounded-full bg-white/10 focus:outline-none">
                      <span className="sr-only">Open user menu</span>
                      {session.user.image ? (
                        <Image
                          className="w-10 h-10 border-2 rounded-full border-white/30"
                          src={session.user.image}
                          alt=""
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
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
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/dashboard"
                              className={`block px-4 py-2 text-sm ${
                                active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
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
                                active ? 'bg-red-50 text-red-600' : 'text-gray-700'
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
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-lg font-medium rounded-lg text-white/90 hover:text-white hover:underline"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-6 py-2 text-lg font-bold text-blue-600 bg-white rounded-lg shadow-lg hover:bg-blue-50"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              <div className="flex -mr-2 md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-white rounded-md hover:bg-white/20 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block w-8 h-8" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block w-8 h-8" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    pathname === item.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-white/20">
              {session?.user ? (
                <>
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      {session.user.image ? (
                        <Image
                          className="w-10 h-10 border-2 rounded-full border-white/30"
                          src={session.user.image}
                          alt=""
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                          <span className="text-xl font-bold text-white">
                            {session.user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {session.user.name}
                      </div>
                      <div className="text-sm font-medium text-white/70">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="px-2 mt-3 space-y-1">
                    <Disclosure.Button
                      as={Link}
                      href="/dashboard"
                      className="block px-3 py-2 text-base font-medium rounded-md text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      Dashboard
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full px-3 py-2 text-base font-medium text-left rounded-md text-white/80 hover:bg-white/10 hover:text-white"
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
                    className="block px-3 py-2 text-base font-medium rounded-md text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    Sign in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    href="/auth/register"
                    className="block px-3 py-2 text-base font-medium text-blue-600 bg-white rounded-md hover:bg-blue-50"
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