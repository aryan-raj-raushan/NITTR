"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "~/store";
import { clearAuthState } from "~/store/authSlice";
import { Button } from "~/components/ui/button";
import AccountDropdown from "../account-dropdown";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "public/nitttrLogo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const isLogin = useAppSelector((state) => state.auth.authState);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignOut = () => {
    dispatch(clearAuthState());
    router.push("/");
  };

  const signIn = () => {
    router.push("/login");
  };

  // Function to set authentication cookie
  function setAuthCookie() {
    const authData = localStorage.getItem("persist:auth");
    if (authData) {
      document.cookie = `authData=${encodeURIComponent(authData)}; path=/`;
    }
  }

  useEffect(() => {
    setAuthCookie();
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="w-full bg-gray-800 text-white sm:bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50" onClose={closeMenu}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="relative ml-auto w-full max-w-xs rounded-l-2xl bg-gray-800 p-6 text-white shadow-xl">
              <button
                type="button"
                className="absolute right-4 top-4 text-gray-400 hover:text-white focus:outline-none"
                onClick={closeMenu}
              >
                <FiX className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex flex-col items-center gap-6">
                <div className="mb-5">
                  {isLogin ? (
                    <AccountDropdown />
                  ) : (
                    <Button
                      onClick={() => {
                        signIn();
                        closeMenu();
                      }}
                      className="w-full rounded-lg bg-black py-2 text-white shadow-md transition-opacity hover:opacity-90"
                    >
                      Login
                    </Button>
                  )}
                </div>
                <div className="flex w-full flex-col gap-4">
                  {NavBarData.pages.map((page, index) => (
                    <Link key={index} href={page.href} className="w-full">
                      <Button
                        onClick={closeMenu}
                        className="w-full rounded-lg bg-gray-700 px-4 py-2 text-left text-lg transition-colors hover:bg-gray-600"
                      >
                        {page.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      {/* Desktop header */}
      <header className="hidden md:block">
        <nav className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl border-b border-gray-300">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <Link href="https://nitttrbpl.ac.in">
                  <div className="relative h-14 w-14">
                    <Image
                      src={logo}
                      layout="fill"
                      alt="logo"
                      className="rounded-full"
                    />
                  </div>
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                {NavBarData.pages.map((page, index) => {
                  // Conditionally render "My Bookings" based on isLogin state
                  if (page.name === "My Bookings" && !isLogin) {
                    return null; // Don't render "My Bookings" if not logged in
                  }
                  return (
                    <Link
                      key={index}
                      href={page.href}
                      className="text-lg font-medium text-gray-600 hover:underline"
                    >
                      {page.name}
                    </Link>
                  );
                })}
              </div>
              <div className="flex items-center space-x-4">
                {isLogin ? (
                  <AccountDropdown />
                ) : (
                  <Button
                    onClick={signIn}
                    className="rounded-lg bg-black px-4 py-2 text-white shadow-md transition-opacity hover:opacity-90"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu toggle button */}
      <div className="flex items-center justify-between p-4 md:hidden">
        <Link href="https://nitttrbpl.ac.in">
          <div className="relative h-10 w-10">
            <Image
              src={logo}
              layout="fill"
              alt="logo"
              className="rounded-full"
            />
          </div>
        </Link>
        <button
          type="button"
          className="rounded-md p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setOpen(true)}
        >
          <FiMenu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

export const NavBarData = {
  pages: [
    { name: "Home", href: "/" },
    { name: "Institute", href: "https://nitttrbpl.ac.in" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Gallery", href: "/gallery" },
    { name: "My Bookings", href: "/myBookings" },
  ],
};
