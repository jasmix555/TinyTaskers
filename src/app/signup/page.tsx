"use client";
import Link from "next/link";
import {useState, useEffect, FormEvent} from "react";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";

import {useAuth} from "@/hooks/useAuth";
import {auth} from "@/api/firebase";

export default function SignUp() {
  const {loading} = useAuth(); // Call useAuth to trigger redirect
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState<number | null>(null); // Timer state
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send a verification email
      await sendEmailVerification(user);
      setIsConfirming(true);
      startTimer(); // Start the timer for email verification expiration
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("不明なエラーが発生しました");
      }
      console.error("Signup Error:", error);
    }
  };

  const startTimer = () => {
    const timerDuration = 300; // seconds

    setTimer(timerDuration);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);

          return null;
        }

        return prev! - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const pollForEmailVerification = async () => {
      const interval = setInterval(async () => {
        const user = auth.currentUser;

        if (user) {
          await user.reload();
          if (user.emailVerified) {
            setIsVerified(true);
            clearInterval(interval);
          }
        }
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    };

    if (isConfirming) {
      pollForEmailVerification();
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isVerified) {
      router.push("/username");
    }
  }, [isVerified, router]);

  const handleResendVerification = async () => {
    const user = auth.currentUser;

    if (user) {
      await sendEmailVerification(user);
      setError(null);
      startTimer(); // Restart the timer on resend
    }
  };

  // Render loading state if loading is true
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render the signup form if no user is logged in and no verification is in progress
  if (!isConfirming) {
    return (
      <div className="container mx-auto max-w-md">
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        <form
          className="flex flex-col content-center justify-center gap-10 rounded-lg p-6"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-4 text-center text-3xl font-bold">アプリをはじめよう</h1>
          <p className="mb-4 text-center text-sm">有効なメールアドレスを入力してください。</p>
          <div className="flex flex-col gap-4">
            <input
              required
              className="w-full border-0 border-b-2 border-gray-500 bg-transparent px-3 py-2 placeholder-gray-500 transition duration-100 ease-in-out focus:border-orange-300 focus:outline-none focus:ring-0"
              placeholder="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              className="w-full border-0 border-b-2 border-gray-500 bg-transparent px-3 py-2 placeholder-gray-500 transition duration-100 ease-in-out focus:border-orange-300 focus:outline-none focus:ring-0"
              placeholder="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className={`w-full rounded py-2 font-bold text-white transition duration-100 ease-in-out ${
              !email || !password
                ? "cursor-not-allowed bg-gray-400"
                : "bg-orange-300 hover:bg-orange-200"
            }`}
            disabled={!email || !password}
            type="submit"
          >
            メールアドレスを確認
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link className="text-orange-300 underline" href={"/login"}>
            ログインページに戻る
          </Link>
        </div>
      </div>
    );
  }

  // Render the confirmation UI if email verification is in progress
  return (
    <div className="container mx-auto max-w-md p-6 text-center">
      <p className="mb-4 text-center text-green-600">
        確認メールが送信されました。メールを確認して、アカウントを有効化してください。
        <br /> ({email})
        <br />
        受信トレイを確認してください。
        <br />
        <button className="ml-2 text-blue-500 underline" onClick={handleResendVerification}>
          再送信
        </button>
        <br />
        {timer !== null && (
          <span className="ml-2 text-sm text-gray-600">{`(${timer}秒後に再送信可能)`}</span>
        )}
      </p>
    </div>
  );
}
