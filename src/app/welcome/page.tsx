// app/welcome.tsx
"use client";

import Link from "next/link";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

import {useAuth} from "@/hooks/useAuth";
import Loading from "@/components/Loading";

export default function Welcome() {
  const {user, loading} = useAuth(); // Call useAuth to trigger redirect
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading) return <Loading />;

  // If the user is already logged in, render nothing (redirect will happen automatically)
  if (user) return null;

  return (
    <div className="container mx-auto flex h-screen flex-col justify-between gap-4 p-4">
      <div>Logo</div>
      {/* Top part for logo or illustration */}
      <div className="flex flex-grow flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">ようこそ</h1>
        <p className="text-center">
          楽しく学んで、目標達成！ <br />
          親子で育む、成長と絆のアプリ！
        </p>
      </div>

      {/* Bottom part for buttons */}
      <div className="flex justify-between space-x-4 text-center">
        <Link
          aria-label="Login for parents"
          className="w-full rounded bg-black px-4 py-2 font-bold text-white transition duration-100 ease-in hover:bg-gray-500"
          href="/login"
        >
          ログイン
        </Link>
        <Link
          aria-label="Sign up for new parents"
          className="w-full rounded border-2 border-black bg-none px-4 py-2 font-bold text-black transition duration-100 ease-in hover:bg-gray-300"
          href="/signup"
        >
          新規登録
        </Link>
      </div>

      <Link
        aria-label="Login for children"
        className="mb-14 w-full rounded border-2 border-orange-100 bg-orange-300 px-4 py-2 text-center font-bold text-white"
        href="/child-login"
      >
        子供アカウントログイン
      </Link>
    </div>
  );
}
