"use client";
import { signOut, signIn } from "next-auth/react";
import { cn as classNames } from "~/lib/utils";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import AccountDropdown from "../account-dropdown";
import { Menu } from "lucide-react";
import logo from "public/nitttrLogo.jpg";
import Image from "next/image";

const Navbar = () => {
  // const [open, setOpen] = useState(false);

  // const { data: session } = useSession();
  // const user = session ? session.user : null;

  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const user = session && session?.user;



  return (
    <nav className="w-full">
      {/* <NavbarAnnouncement />
      <NavbarTop />
      <NavbarBottom /> */}
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 " onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5"></div>

                {/* Links */}

                <div className="flex h-full flex-col items-center justify-around gap-5 sm:gap-[15%]">
                  <Link className="mb-5" href={"https://nitttrbpl.ac.in"}>
                    <div className="relative size-24 ">
                      <Image priority src={logo} alt="logo"></Image>
                    </div>
                  </Link>

                  <div className="flex flex-col gap-2">
                    {NavBarData.pages.map((page, index) => (
                      <Button key={index}>
                        <a
                          key={page.name}
                          href={page.href}
                          className="flex items-center text-sm font-medium  "
                        >
                          {page.name}
                        </a>
                      </Button>
                    ))}
                  </div>

                  <div>
                    {user ? (
                      <Button
                        className="cursor-pointer"
                        onClick={() => {
                          signOut();
                        }}
                      >
                        LOGOUT
                      </Button>
                    ) : (
                      <Button
                        className="cursor-pointer"
                        onClick={() => {
                          signIn();
                        }}
                      >
                        LOGIN/REGISTER
                      </Button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <button
        type="button"
        className="rounded-md  bg-white p-2 text-gray-400 md:hidden"
        onClick={() => setOpen(true)}
      >
        <span className="">
          <Menu></Menu>
        </span>
      </button>
      <header className="hidden md:block">
        <nav
          aria-label="Top"
          className=" px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200 mx-20">
            <div className="flex h-fit py-2 items-center justify-between">
              <div className='md:text-2xl mx-2 font-bold cursor-pointer'>

                <Link href={"https://nitttrbpl.ac.in"}>
                  <div className='size-14 relative ' >
                    <Image src={logo} alt='logo'></Image>
                  </div> </Link>

              </div>
              {/* Flyout menus */}
              <div className="flex h-full w-full items-center justify-end gap-10">
                {NavBarData.pages.map((page) => (
                  <a
                    key={page.name}
                    href={page.href}
                    className="flex items-center text-xl font-medium text-gray-700 hover:text-gray-800 hover:underline"
                  >
                    {page.name}
                  </a>
                ))}
                {user ? (
                  <AccountDropdown></AccountDropdown>
                ) : (
                  <Button
                    onClick={() => {
                      signIn();
                    }}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
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
