"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleGetStarted = () => {
    router.push("/files");
  };

  return (
    <>
      <div className="h-[68px]" />{" "}
      <header className="bg-white  shadow-md fixed top-0 text-gray-800 py-4 px-6 sm:px-8 md:px-10 lg:px-12 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Image width={150} height={100} src="/logo.png" alt="Sharefolio" />
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/"
                    className={` hover:text-primary  ${
                      pathname === "/" ? "font-semibold" : ""
                    }`}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/upload"
                    className={`hover:text-primary ${
                      pathname === "/upload" ? "font-semibold" : ""
                    }`}
                  >
                    Upload
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex gap-2 items-center ">
            <Button
              className="hidden md:block"
              variant="default"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>

            <UserButton />

            <button
              className="block p-2 rounded-md hover:bg-secondary md:hidden"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                className="h-6 w-6 text-gray-800"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="flex flex-col ">
              <Link
                href="/"
                className={` ${pathname === "/" ? "font-semibold" : ""}`}
              >
                <li className="hover:bg-blue-50 p-2">Home</li>
              </Link>
              <Link
                href="/files"
                className={` ${pathname === "/files" ? "font-semibold" : ""}`}
              >
                <li className="hover:bg-blue-50 p-2">Files</li>
              </Link>
              <Link
                href="/upload"
                className={`${pathname === "/upload" ? "font-semibold" : ""}`}
              >
                <li className="hover:bg-blue-50 p-2">Upload</li>
              </Link>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
