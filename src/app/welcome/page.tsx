import Link from "next/link";

export default function Welcome() {
  return (
    <div className="flex min-h-screen flex-col justify-between p-4">
      {/* Top part for logo or illustration */}
      <div className="flex flex-grow flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold">ようこそ</h1>
        <p className="text-center">
          楽しく学んで、目標達成！ <br />
          親子で育む、成長と絆のアプリ！
        </p>
      </div>

      {/* Bottom part for buttons */}
      <div className="mb-10 flex justify-between space-x-4 text-center">
        <Link
          className="w-full rounded-full bg-black px-4 py-2 font-bold text-white transition duration-100 ease-in hover:bg-gray-500"
          href="/login"
        >
          ログイン
        </Link>
        <Link
          className="w-full rounded-full border-2 border-black bg-none px-4 py-2 font-bold text-black transition duration-100 ease-in hover:bg-gray-300"
          href="/signup"
        >
          新規登録
        </Link>
      </div>
    </div>
  );
}
