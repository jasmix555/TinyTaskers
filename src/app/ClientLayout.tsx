"use client"; // This component will handle client-side logic

import {ReactNode} from "react";

import {useAuth} from "@/hooks"; // Import useAuth to check for user status
import Navbar from "@/components/Navbar"; // Import your Navbar component

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({children}: ClientLayoutProps) => {
  const {user, hasChildInfo} = useAuth();
  const isParent = user && !hasChildInfo; // Check if the logged-in user is a parent

  return (
    <>
      <main className="flex-grow">
        {children}
        {isParent && <Navbar />}
      </main>
    </>
  );
};

export default ClientLayout;
