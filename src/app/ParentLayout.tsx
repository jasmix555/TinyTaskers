"use client"; // This component will handle client-side logic

import {ReactNode} from "react";
import {usePathname} from "next/navigation"; // Import usePathname to get the current pathname

import Navbar from "@/components/Navbar"; // Import your Navbar component
import {NavbarProps} from "@/types/NavbarProps"; // Import NavbarProps to access paths

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ParentLayout({children}: ClientLayoutProps) {
  const pathname = usePathname(); // Get the current pathname

  // Check if the current path is in the navbarPaths
  const navbarPaths = NavbarProps.map((item) => item.path);
  const showNavbar = navbarPaths.includes(pathname); // Show navbar only if the user is a parent and the pathname is in the navbar paths

  return (
    <>
      <main className={`flex-grow ${showNavbar ? "pb-16" : ""}`}>
        {children}
        {showNavbar && <Navbar />}
      </main>
    </>
  );
}
