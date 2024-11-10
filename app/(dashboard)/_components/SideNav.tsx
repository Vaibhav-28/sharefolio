"use client";
import { Files, Home, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const menuList = [
  {
    id: 1,
    name: "Home",
    icon: Home,
    path: "/",
  },
  {
    id: 2,
    name: "Upload",
    icon: Upload,
    path: "/upload",
  },
  {
    id: 3,
    name: "Files",
    icon: Files,
    path: "/files",
  },
];

const SideNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const index = menuList?.findIndex((item) => pathname === item?.path);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname, menuList]);
  return (
    <div className="shadow-sm border-r h-full">
      <div className="p-5 border-b">
        <Image src="/logo.png" width={150} height={100} alt="Sharefolio" />
      </div>
      <div className="flex flex-col float-left w-full">
        {menuList?.map((item, index) => {
          return (
            <button
              className={`flex gap-2 p-4 px-6 hover:bg-gray-100 w-full text-gray-500 ${
                activeIndex === index ? "bg-blue-50 text-primary" : ""
              }`}
              key={item?.id}
              onClick={() => {
                setActiveIndex(index);
                router.push(item?.path);
              }}
            >
              <item.icon />
              <h2>{item?.name}</h2>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideNav;
