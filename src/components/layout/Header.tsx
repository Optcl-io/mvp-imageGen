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
    <Disclosure as="nav" className="bg-gradient-to-r from-purple-900 to-blue-800 shadow-lg z-40">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                  <span className="ml-3 text-2xl font-bold text-white">
                    Optcl
                  </span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-8">
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
                    <Menu.Button className="flex rounded-full bg-white/10 text-sm focus:outline-none">
                      <span className="sr-only">Open user menu</span>
                      {session.user.image ? (
                        <Image
                          className="h-10 w-10 rounded-full border-2 border-white/30"
                          src={session.user.image}
                          alt=""
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                      className="rounded-lg px-4 py-2 text-lg font-medium text-white/90 hover:text-white hover:underline"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="rounded-lg bg-white px-6 py-2 text-lg font-bold text-blue-600 shadow-lg hover:bg-blue-50"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/20 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
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
            <div className="border-t border-white/20 pb-3 pt-4">
              {session?.user ? (
                <>
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      {session.user.image ? (
                        <Image
                          className="h-10 w-10 rounded-full border-2 border-white/30"
                          src={session.user.image}
                          alt=""
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
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
                  <div className="mt-3 space-y-1 px-2">
                    <Disclosure.Button
                      as={Link}
                      href="/dashboard"
                      className="block rounded-md px-3 py-2 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      Dashboard
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="button"
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button
                    as={Link}
                    href="/auth/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    Sign in
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    href="/auth/register"
                    className="block rounded-md bg-white px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
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