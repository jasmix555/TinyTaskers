"use client";
import {useState, useEffect, FormEvent} from "react";
import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import {useRouter} from "next/navigation";

import {auth} from "@/api/firebase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
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
      setVerificationSent(true);
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
    // Set a timer for 5 minutes (300 seconds)
    const timerDuration = 300; // seconds

    setTimer(timerDuration);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval); // Stop the timer

          return null; // Reset the timer state
        }

        return prev! - 1; // Decrement the timer
      });
    }, 1000); // Update every second
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
      setVerificationSent(true);
      startTimer(); // Restart the timer on resend
    }
  };

  const handleGoToLogin = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <div className="container mx-auto max-w-md">
      {error && <p className="mb-4 text-center text-red-600">{error}</p>}
      {verificationSent && (
        <p className="mb-4 text-center text-green-600">
          メールに確認リンクが送信されました。
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
      )}
      {!isConfirming ? (
        <form
          className="flex flex-col content-center justify-center gap-10 rounded-lg p-6"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-4 text-center text-3xl font-bold">
            {isConfirming ? "メール確認中" : "アプリをはじめよう"}
          </h1>
          <p className="mb-4 text-center text-sm">
            {isConfirming ? " " : "有効なメールアドレスを入力してください。"}
          </p>
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
            <div className="relative mb-4">
              <input
                required
                className="w-full border-0 border-b-2 border-gray-500 bg-transparent px-3 py-2 placeholder-gray-500 transition duration-100 ease-in-out focus:border-orange-300 focus:outline-none focus:ring-0"
                placeholder="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className={`w-full rounded py-2 font-bold text-white transition duration-100 ease-in-out ${
              !email || !password
                ? "cursor-not-allowed bg-gray-400"
                : "bg-orange-300 hover:bg-orange-200"
            }`}
            disabled={!email || !password} // Disable button if email or password is empty
            type="submit"
          >
            メールアドレスを確認
          </button>
        </form>
      ) : (
        ""
      )}
      <div className="mt-4 text-center">
        <button className="text-orange-300 underline" onClick={handleGoToLogin}>
          ログインページに戻る
        </button>
      </div>
    </div>
  );
}
