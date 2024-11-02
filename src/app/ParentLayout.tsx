"use client"; // This component will handle client-side logic

import {ReactNode} from "react";
import {usePathname} from "next/navigation"; // Import usePathname to get the current pathname

import Navbar from "@/components/Navbar"; // Import your Navbar component
import {NavbarProps} from "@/types/NavbarProps"; // Import NavbarProps to access paths
import {useAuth, useFetchChildren} from "@/hooks";

interface ClientLayoutProps {
  children: ReactNode;
}

const ParentLayout = ({children}: ClientLayoutProps) => {
  const {user} = useAuth();
  const {children: childData, loading} = useFetchChildren(user?.uid || "");

  const isParent = user && !loading && childData.length > 0; // Check if the logged-in user is a parent and children data is loaded
  const pathname = usePathname(); // Get the current pathname

  // Check if the current path is in the navbarPaths
  const navbarPaths = NavbarProps.map((item) => item.path);
  const showNavbar = isParent && navbarPaths.includes(pathname); // Show navbar only if the user is a parent and the pathname is in the navbar paths

  return (
    <>
      <main className={`flex-grow ${isParent ? "pb-16" : ""}`}>
        {children}
        {showNavbar && <Navbar />} {/* Render Navbar conditionally */}
      </main>
    </>
  );
};

export default ParentLayout;
