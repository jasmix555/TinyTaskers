import Link from "next/link";

export default function Welcome() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Welcome</h1>
      <p>Please log in or sign up.</p>
      <div className="flex space-x-4">
        <Link
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          href="/login"
        >
          Login
        </Link>
        <Link
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          href="/signup"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
