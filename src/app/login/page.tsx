"use client";
import {useState, FormEvent} from "react";
import {signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, Auth} from "firebase/auth";
import {useRouter} from "next/navigation";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";

import {auth} from "@/api/firebase";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error on new submit attempt
    try {
      await signInWithEmailAndPassword(auth as Auth, email, password);
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      setError("パスワードが間違っています。再度お試しください。");
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth as Auth, provider);
      router.push("/");
    } catch (err: unknown) {
      console.error("Google Sign-In Error: ", err);
      setError("Googleでのサインインに失敗しました。");
    }
  };

  return (
    <div className="container mx-auto max-w-md">
      <form
        className="flex flex-col content-center justify-center gap-10 rounded-lg p-6"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-4 text-2xl font-bold">ログイン</h1>
        <div className="flex flex-col gap-4">
          <div className="relative mb-4">
            <input
              required
              className="w-full border-0 border-b-2 border-gray-500 bg-transparent px-3 py-2 placeholder-gray-500 transition duration-100 ease-in-out focus:border-orange-300 focus:outline-none focus:ring-0"
              placeholder="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              required
              className="w-full border-0 border-b-2 border-gray-500 bg-transparent px-3 py-2 placeholder-gray-500 transition duration-100 ease-in-out focus:border-orange-300 focus:outline-none focus:ring-0"
              placeholder="パスワード"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>

          {error && <p className="text-center text-red-600">{error}</p>}
        </div>

        <div className="flex flex-col gap-8">
          <button
            className={`w-full rounded py-2 font-bold text-white transition duration-100 ease-in-out ${email && password ? "bg-orange-300 hover:bg-orange-200" : "cursor-not-allowed bg-gray-300"}`}
            disabled={!email || !password} // Disable if either field is empty
            type="submit"
          >
            ログイン
          </button>
          <p className="text-center text-lg">
            <span>アカウントがありませんか?</span>{" "}
            <Link className="font-bold text-orange-300" href="/signup">
              今すぐ登録
            </Link>
          </p>
        </div>

        <div className="my-2 flex items-center">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500">または</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="flex flex-col gap-6">
          <button
            className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 py-2 font-bold text-gray-700 transition duration-100 ease-in-out hover:bg-gray-100"
            onClick={handleGoogleSignIn}
          >
            <Image alt="Google" height={24} src="/google.svg" width={24} />
            <span>Googleでサインイン</span>
          </button>
        </div>
      </form>
    </div>
  );
}
