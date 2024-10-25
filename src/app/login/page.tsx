const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Login to the App</h1>
      <p>Enter your credentials to access the platform.</p>
      <div className="mt-4">
        <form className="flex flex-col space-y-4">
          <input
            className="px-4 py-2 border border-gray-300 rounded"
            placeholder="Email"
            type="email"
          />
          <input
            className="px-4 py-2 border border-gray-300 rounded"
            placeholder="Password"
            type="password"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
