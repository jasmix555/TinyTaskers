"use client";
import {useState} from "react";

import {supabase} from "@/api/supabase";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  const handleLogin = async () => {
    const {error} = await supabase.auth.signInWithPassword({email, password});

    if (error) {
      setErrorMessage(error.message);
      setSuccessMessage(""); // Clear success message on error
    } else {
      setErrorMessage("");
      setSuccessMessage("Login successful!"); // Display success message
    }
  };

  const handleRegister = async () => {
    const {error} = await supabase.auth.signUp({email, password});

    if (error) {
      setErrorMessage(error.message);
      setSuccessMessage(""); // Clear success message on error
    } else {
      setErrorMessage("");
      setSuccessMessage("Registration successful! Check your email for verification.");
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
      {successMessage && <p style={{color: "green"}}>{successMessage}</p>} {/* Success message */}
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={isLogin ? handleLogin : handleRegister}>
        {isLogin ? "Login" : "Register"}
      </button>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Register" : "Switch to Login"}
      </button>
    </div>
  );
};

export default Registration;
