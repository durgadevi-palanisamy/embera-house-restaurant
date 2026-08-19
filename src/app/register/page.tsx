"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setStatus("error");
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/account");
        router.refresh();
      } else {
        setStatus("error");
        setErrorMessage(data.error?.message || "Registration failed.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error occurred. Please try again.");
    }
  };

  return (
    <div className="pt-36 pb-28 min-h-screen bg-[#11100E] flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-[#191714] border border-white/10 p-8 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <span className="label-caps text-[#C86E45] block">Guest Registry</span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9]">
            Create an <span className="italic font-light text-[#D3B98D]">Account.</span>
          </h1>
          <p className="text-xs text-[#A9A095]">
            Save dining preferences, manage bookings and bookmark favourite dishes.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="label-caps text-[#A9A095] block">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9A095]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lord Julian Sterling"
                className="w-full bg-[#11100E] border border-white/15 px-4 py-3 pl-10 text-xs text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-caps text-[#A9A095] block">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9A095]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#11100E] border border-white/15 px-4 py-3 pl-10 text-xs text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-caps text-[#A9A095] block">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9A095]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900000"
                className="w-full bg-[#11100E] border border-white/15 px-4 py-3 pl-10 text-xs text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-caps text-[#A9A095] block">Password (Min 8 Characters) *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9A095]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#11100E] border border-white/15 px-4 py-3 pl-10 text-xs text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
              />
            </div>
          </div>

          {status === "error" && (
            <div className="p-3 bg-[#C86E45]/15 border border-[#C86E45] text-xs text-[#F7F2E9] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C86E45] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-terracotta text-xs w-full py-3.5 justify-center shadow-lg"
          >
            {status === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-white/10 text-xs text-[#A9A095]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#D3B98D] hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
