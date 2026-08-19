"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/v1/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing. You have been added to our guest registry.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error?.message || data.message || "Unable to complete subscription.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("A network error occurred. Please try again.");
    }
  };

  return (
    <section className="py-24 bg-[#11100E] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <span className="label-caps text-[#C86E45] block mb-3">The Embera Dispatch</span>
        <h2 className="section-title text-[#F7F2E9] mb-4">
          From our kitchen <br className="hidden sm:inline" />
          <span className="italic font-light text-[#D3B98D]">to your inbox.</span>
        </h2>
        <p className="text-[#A9A095] text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          Menus, stories and special evenings, delivered occasionally.
        </p>

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9A095]" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Enter your email address..."
                className="w-full bg-[#191714] border border-white/15 px-4 py-3.5 pl-11 text-sm text-[#F7F2E9] placeholder-[#A9A095] focus:outline-none focus:border-[#C86E45] transition-colors"
                disabled={status === "loading"}
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-terracotta text-xs py-3.5 px-6 shrink-0 justify-center"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </div>

          {/* Feedback messages */}
          {status === "success" && (
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#778064] animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#C86E45] animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
