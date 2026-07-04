import { useState } from "react";
import type {  SyntheticEvent  } from "react";

interface FormState {
  name: string;
  username: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [form, setForm] = useState<FormState>({ name: "", username: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Signup failed");
      setSubmitted(true);
    } catch {
      setError("Couldn't reach the server. Try again in a moment.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1220] flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden border border-[#1E2A3F] shadow-2xl">
        {/* Left: form */}
        <div className="bg-[#0F1729] p-8 sm:p-10 flex flex-col justify-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E8A33D] mb-3">
            init --account
          </p>
          <h1 className="text-3xl font-bold text-[#F3F5F9] mb-1">Create your account</h1>
          <p className="text-[#8C9BB5] text-sm mb-8">
            Already running one?{" "}
            <a href="#" className="text-[#E8A33D] hover:underline">
              Sign in
            </a>
          </p>

          {submitted ? (
            <div className="rounded-lg border border-[#2A6F4F] bg-[#102A1F] px-4 py-5 text-[#7FD9A8] text-sm">
              Account created. Check your inbox to verify <span className="font-mono">{form.email}</span>.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="block font-mono text-[11px] uppercase tracking-wide text-[#8C9BB5] mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ada Lovelace"
                  className="w-full rounded-lg bg-[#141E33] border border-[#26334C] px-3.5 py-2.5 text-[#F3F5F9] placeholder-[#4C5972] outline-none focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="username" className="block font-mono text-[11px] uppercase tracking-wide text-[#8C9BB5] mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="ada_lovelace"
                  className="w-full rounded-lg bg-[#141E33] border border-[#26334C] px-3.5 py-2.5 text-[#F3F5F9] placeholder-[#4C5972] outline-none focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-mono text-[11px] uppercase tracking-wide text-[#8C9BB5] mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ada@example.com"
                  className="w-full rounded-lg bg-[#141E33] border border-[#26334C] px-3.5 py-2.5 text-[#F3F5F9] placeholder-[#4C5972] outline-none focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-mono text-[11px] uppercase tracking-wide text-[#8C9BB5] mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg bg-[#141E33] border border-[#26334C] px-3.5 py-2.5 text-[#F3F5F9] placeholder-[#4C5972] outline-none focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] transition-colors"
                />
              </div>

              {error && (
                <p className="text-sm text-[#E8746C] font-mono">{error}</p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-[#E8A33D] text-[#0B1220] font-semibold py-2.5 hover:bg-[#F2B458] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8A33D] focus:ring-offset-2 focus:ring-offset-[#0F1729]"
              >
                Create account
              </button>

              <p className="text-[11px] text-[#5C6B85] text-center pt-1">
                By continuing you agree to the Terms and Privacy Policy.
              </p>
            </form>
          )}
        </div>

        {/* Right: signature panel */}
        <div className="hidden md:flex flex-col justify-center bg-[#0B1220] p-10 border-l border-[#1E2A3F] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,#E8A33D_1px,transparent_0)] [background-size:18px_18px]" />
          <div className="relative font-mono text-[13px] leading-relaxed text-[#8C9BB5]">
            <p className="text-[#5C6B85]">// what you get on day one</p>
            <p className="mt-3">
              <span className="text-[#E8A33D]">const</span> account = {"{"}
            </p>
            <p className="pl-4">projects: <span className="text-[#7FD9A8]">3</span>,</p>
            <p className="pl-4">api_keys: <span className="text-[#7FD9A8]">2</span>,</p>
            <p className="pl-4">support: <span className="text-[#F2B458]">'priority'</span>,</p>
            <p className="pl-4">trial_days: <span className="text-[#7FD9A8]">14</span>,</p>
            <p>{"}"}</p>
          </div>
          <p className="relative mt-10 text-[#F3F5F9] text-lg font-semibold leading-snug">
            No credit card. No setup call.
            <br />
            Just a working account in 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
