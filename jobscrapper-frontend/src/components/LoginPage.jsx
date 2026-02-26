import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const ok = onLogin(username, password);
    if (!ok) {
      setError("Invalid username or password.");
      return;
    }
    setError("");
  }

  return (
    <div className="app-bg flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Sign in to access the dashboard.</p>

        <label className="mt-5 block">
          <span className="mb-1 block text-sm font-medium">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring dark:border-slate-700 dark:bg-slate-900"
            autoComplete="username"
            required
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring dark:border-slate-700 dark:bg-slate-900"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
