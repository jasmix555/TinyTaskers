"use client";

import Link from "next/link";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to the App</h1>
      <p>This is your introduction to the platform.</p>
      <div className="mt-4">
        <Link className="px-4 py-2 bg-blue-500 text-white rounded" href="/registration">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
