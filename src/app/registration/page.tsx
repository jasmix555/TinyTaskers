"use client";
import {useState} from "react";
import {useRouter} from "next/navigation"; // Next.js navigation hook
import Link from "next/link";

import {supabase} from "@/api/supabase"; // Supabase client

const RegistrationPage = () => {
  const router = useRouter(); // Initialize router

  // State variables
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // Step in the registration process (1 = Email, 2 = OTP, 3 = Username/Password)
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Step 1: Send OTP to email (and create user with a temporary password)
  const handleSendOtp = async () => {
    const tempPassword = "temp_password"; // Temporary password for OTP flow

    const {error} = await supabase.auth.signUp({
      email,
      password: tempPassword,
    });

    if (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    } else {
      setErrorMessage("");
      setSuccessMessage("OTP sent to your email. Please check your inbox.");
      setStep(2); // Move to OTP step
    }
  };

  // Step 2: Verify OTP (This can be done using Supabase's magic link or a 3rd-party OTP service)
  const handleVerifyOtp = async () => {
    // For this example, we mock OTP verification
    if (otp === "1234") {
      // Mock verification
      setErrorMessage("");
      setStep(3); // Move to username and password input step
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  // Step 3: Finalize registration with username and password
  const handleCompleteRegistration = async () => {
    // Update user password and username after OTP verification
    const {error} = await supabase.auth.updateUser({
      password, // Update password
      data: {username}, // Save username in user metadata (if you're using profiles, save it in the 'profiles' table)
    });

    if (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    } else {
      setErrorMessage("");
      setSuccessMessage("Registration complete! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500); // Redirect after success
    }
  };

  return (
    <div className="mx-auto max-w-screen-md px-8 py-10">
      <h1 className="text-3xl font-bold">Register</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Step 1: Email input */}
      {step === 1 && (
        <div>
          <input
            className="mb-4 w-full rounded-md border p-2"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="w-full rounded-md bg-blue-500 py-2 text-white" onClick={handleSendOtp}>
            Send OTP
          </button>
        </div>
      )}

      {/* Step 2: OTP input */}
      {step === 2 && (
        <div>
          <input
            className="mb-4 w-full rounded-md border p-2"
            placeholder="Enter OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="w-full rounded-md bg-blue-500 py-2 text-white"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>
        </div>
      )}

      {/* Step 3: Username and password input */}
      {step === 3 && (
        <div>
          <input
            className="mb-4 w-full rounded-md border p-2"
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="mb-4 w-full rounded-md border p-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full rounded-md bg-blue-500 py-2 text-white"
            onClick={handleCompleteRegistration}
          >
            Complete Registration
          </button>
        </div>
      )}

      {/* Link to login page if user has an account */}
      {step !== 3 && (
        <p className="mt-4">
          Already have an account?{" "}
          <Link className="text-blue-500" href="/login">
            Login here
          </Link>
        </p>
      )}
    </div>
  );
};

export default RegistrationPage;
