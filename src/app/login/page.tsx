"use client";

import {useState, FormEvent, useEffect} from "react";
import {signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, Auth} from "firebase/auth";
import {FirebaseError} from "firebase/app";
import {useRouter} from "next/navigation";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";

import {useAuth} from "@/hooks/useAuth";
import {auth} from "@/api/firebase";
import Loading from "@/components/Loading";

export default function Login() {
  const {user, loading} = useAuth(); // Call useAuth to trigger redirect
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false); // Loading state for Google sign-in
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading) return <Loading />; // Show loading state

  // If the user is already logged in, render nothing (redirect will happen automatically)
  if (user) return null;

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth as Auth, email, password);
      router.push("/");
    } catch (err) {
      const error = err as FirebaseError; // Cast error to FirebaseError

      console.error(error);
      setError("パスワードが間違っています。再度お試しください。"); // You can improve this to show specific error messages based on error code if needed
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    setIsGoogleLoading(true); // Start loading state

    try {
      await signInWithPopup(auth as Auth, provider);
      router.push("/");
    } catch (err) {
      const error = err as FirebaseError; // Cast error to FirebaseError

      console.error("Google Sign-In Error: ", error);
      setError("Googleでのサインインに失敗しました。");
    } finally {
      setIsGoogleLoading(false); // End loading state
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
              aria-label="Email Address"
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
              aria-label="Password"
              className="w-full border-0 border-b-2 border-gray-500 bg-transparent px-3 py-2 placeholder-gray-500 transition duration-100 ease-in-out focus:border-orange-300 focus:outline-none focus:ring-0"
              placeholder="パスワード"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
          {error && (
            <p aria-live="assertive" className="text-center text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <button
            className={`w-full rounded py-2 font-bold text-white transition duration-100 ease-in-out ${email && password ? "bg-orange-300 hover:bg-orange-200" : "cursor-not-allowed bg-gray-300"}`}
            disabled={!email || !password}
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
            aria-label="Sign in with Google"
            className={`flex w-full items-center justify-center gap-2 rounded border border-gray-300 py-2 font-bold text-gray-700 transition duration-100 ease-in-out ${isGoogleLoading ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={isGoogleLoading}
            onClick={handleGoogleSignIn}
          >
            <Image alt="Google" height={24} src="/google.svg" width={24} />
            <span>{isGoogleLoading ? "Signing in..." : "Googleでサインイン"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
