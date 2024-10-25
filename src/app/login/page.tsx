const Login = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Login to the App</h1>
      <p>Enter your credentials to access the platform.</p>
      <div className="mt-4">
        <form className="flex flex-col space-y-4">
          <input
            className="rounded border border-gray-300 px-4 py-2"
            placeholder="Email"
            type="email"
          />
          <input
            className="rounded border border-gray-300 px-4 py-2"
            placeholder="Password"
            type="password"
          />
          <button className="rounded bg-blue-500 px-4 py-2 text-white" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
