import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError(null);

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies if using JWT in HttpOnly cookies
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed.");
      }

      console.log(data);

      // TODO:
      navigate("/dashboard");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d0cac3] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#26334C] bg-[#561c24] p-8 shadow-2xl">


        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-white mb-8">
          Sign in to continue to your Closet Match account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm text-white"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full rounded-lg border border-white bg-[#661218] px-4 py-3 text-white placeholder:text-white outline-none focus:border-[#E8A33D]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm text-white"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white bg-[#661218] px-4 py-3 text-white placeholder:text-white outline-none focus:border-[#E8A33D]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white py-3 font-semibold text-[#0B1220] transition hover:bg-[#F2B458] disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8C9BB5]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#E8A33D] hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}