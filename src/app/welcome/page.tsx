"use client";

import Link from "next/link";

const WelcomePage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">ようこそ</h1>
      <p>楽しく学んで、目標達成！親子で育む、成長と絆のアプリ</p>
      <div className="mt-4 flex w-full flex-row items-center justify-center gap-4">
        <Link className="rounded-full bg-black px-4 py-2 font-bold text-white" href="/login">
          ログイン
        </Link>
        <Link className="rounded-full bg-black px-4 py-2 font-bold text-white" href="/registration">
          新規登録
        </Link>
      </div>

      <div>
        <Link className="rounded-full bg-black px-4 py-2 font-bold text-white" href="/child">
          子供アカウントログイン
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
