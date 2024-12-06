// layout.tsx
import type {Metadata} from "next";

import {ReactNode} from "react";

import "./globals.css";
import ParentLayout from "./ParentLayout"; // Import the new ClientLayout component

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function Layout({children}: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <ParentLayout>{children}</ParentLayout>
        </div>
      </body>
    </html>
  );
}
