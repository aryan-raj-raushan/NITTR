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
import logo from "public/nitttrLogo.jpg";

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

  return (
    <nav className="w-full">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative w-full max-w-xs bg-white shadow-xl">
              <div className="flex flex-col items-center px-4 py-5">
                <Link href="https://nitttrbpl.ac.in">
                  <div className="relative mb-5 h-24 w-24">
                    <Image src={logo} layout="fill" alt="logo" />
                  </div>
                </Link>
                <div className="flex flex-col gap-2">
                  {NavBarData.pages.map((page, index) => (
                    <Button key={index}>
                      <Link href={page.href} className="text-sm font-medium">
                        {page.name}
                      </Link>
                    </Button>
                  ))}
                </div>
                <div>
                  {isLogin ? (
                    <Button onClick={handleSignOut}>LOGOUT</Button>
                  ) : (
                    <Button onClick={signIn}>LOGIN/REGISTER</Button>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      {/* Desktop header */}
      <header className="hidden md:block">
        <nav className="px-4 sm:px-6 lg:px-8">
          <div className="mx-20 border-b border-gray-200">
            <div className="flex items-center justify-between py-2">
              <div className="mx-2 cursor-pointer font-bold md:text-2xl">
                <Link href="https://nitttrbpl.ac.in">
                  <div className="relative h-14 w-14">
                    <Image src={logo} layout="fill" alt="logo" />
                  </div>
                </Link>
              </div>
              <div className="flex items-center gap-10">
                {NavBarData.pages.map((page, index) => (
                  <Link
                    key={index}
                    href={page.href}
                    className="text-xl font-medium text-gray-700 hover:text-gray-800 hover:underline"
                  >
                    {page.name}
                  </Link>
                ))}
                {isLogin ? (
                  <AccountDropdown />
                ) : (
                  <Button onClick={signIn}>Login</Button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu toggle button */}
      <button
        type="button"
        className="rounded-md bg-white p-2 text-gray-400 md:hidden"
        onClick={() => setOpen(true)}
      >
        <span className="">
          {/* You might need to replace this with your own icon or menu component */}
          Menu
        </span>
      </button>
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
  ],
};
