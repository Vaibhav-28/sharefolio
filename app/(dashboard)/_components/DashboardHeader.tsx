"use client";
import { UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import SideNav from "./SideNav";

const DashboardHeader = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <>
      <div className="h-[68px]" />
      <div className="flex p-5 bg-white fixed top-0 w-full border-b  items-center justify-between md:justify-end">
        {!openSideMenu && (
          <Menu
            onClick={() => setOpenSideMenu(true)}
            className="md:hidden cursor-pointer"
          />
        )}
        {!openSideMenu && (
          <Image
            className="md:hidden"
            src="/logo.png"
            width={150}
            height={100}
            alt="sharefolio"
          />
        )}
        <div className={`${openSideMenu ? "ml-auto" : ""}`}>
          <UserButton />
        </div>
      </div>
      <div
        className={`h-full shadow-md w-64 flex flex-col fixed inset-y-0 z-50 bg-white transition-transform duration-300 ${
          openSideMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideNav />
        <X
          onClick={() => setOpenSideMenu(false)}
          className="absolute md:hidden right-2 top-6 cursor-pointer"
        />
      </div>
    </>
  );
};

export default DashboardHeader;
