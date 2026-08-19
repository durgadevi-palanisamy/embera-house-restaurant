"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.user.role === "SUPER_ADMIN" || data.user.role === "MANAGER") {
          router.push("/admin");
        } else {
          router.push("/account");
        }
        router.refresh();
      } else {
        setStatus("error");
        setErrorMessage(data.error?.message || "Invalid credentials.");
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
          <span className="label-caps text-[#C86E45] block">Member & Staff Access</span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9]">
            Sign in to <span className="italic font-light text-[#D3B98D]">Embera.</span>
          </h1>
          <p className="text-xs text-[#A9A095]">
            Access your reservations, saved preferences and favourite dishes.
          </p>
        </div>

        {/* Demo Credentials Hint */}
        <div className="p-4 bg-[#11100E] border border-white/10 text-xs text-[#A9A095] space-y-1">
          <p className="font-medium text-[#F7F2E9]">Demo Accounts:</p>
          <p>• Admin: <code className="text-[#C86E45]">admin@emberahouse.com</code> / <code className="text-[#C86E45]">EmberaAdmin2026!</code></p>
          <p>• Guest: <code className="text-[#D3B98D]">julian@sterling.co.uk</code> / <code className="text-[#D3B98D]">Customer2026!</code></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="label-caps text-[#A9A095] block">Email Address</label>
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
            <label className="label-caps text-[#A9A095] block">Password</label>
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
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-white/10 text-xs text-[#A9A095]">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-[#D3B98D] hover:underline font-medium">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
