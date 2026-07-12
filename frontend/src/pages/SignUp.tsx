import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

interface FormState {
  name: string;
  username: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.username || !form.email || !form.password) {
      setError("Fill in every field — that's the whole form.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password needs at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed.");
      }

      setSubmitted(true);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Couldn't reach the server. Try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d0cac3] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#26334C] bg-[#561c24] p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">
          Create your account
        </h1>

        <p className="text-white mb-8">
          Sign up to get started with Closet Match.
        </p>

        {submitted ? (
          <div className="rounded-lg border border-white/40 bg-white/10 px-4 py-5 text-white text-sm">
            Account created. Check your inbox to verify{" "}
            <span className="font-semibold">{form.email}</span>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm text-white"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-[#8C9BB5] px-4 py-3 text-[#E8A33D] placeholder:text-[#8C9BB5] outline-none focus:border-[#E8A33D]"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm text-white"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="jane_doe"
                className="w-full rounded-lg border border-[#8C9BB5] px-4 py-3 text-[#E8A33D] placeholder:text-[#8C9BB5] outline-none focus:border-[#E8A33D]"
              />
            </div>

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
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-[#8C9BB5] px-4 py-3 text-white placeholder:text-[#8C9BB5] outline-none focus:border-[#E8A33D]"
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
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-[#8C9BB5] px-4 py-3 text-white placeholder:text-[#8C9BB5] outline-none focus:border-[#E8A33D]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white py-3 font-semibold text-[#0B1220] transition hover:bg-[#550f14] hover:text-white disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#8C9BB5]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#E8A33D] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}