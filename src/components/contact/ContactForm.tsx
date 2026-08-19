"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "GENERAL",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setFeedback("Please complete all required fields.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setFeedback("Thank you. Your message has been received by our concierge. We will respond promptly.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          enquiryType: "GENERAL",
          message: "",
        });
      } else {
        setStatus("error");
        setFeedback(data.error?.message || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setFeedback("A network error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 sm:p-10 bg-[#191714] border border-white/10 space-y-6">
      <div>
        <span className="label-caps text-[#C86E45] block mb-1">Direct Inquiries</span>
        <h3 className="font-editorial text-3xl text-[#F7F2E9]">Send a Message</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="label-caps text-[#A9A095] block">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Lord Julian Sterling"
            className="w-full bg-[#11100E] border border-white/10 px-4 py-3 text-xs text-[#F7F2E9] placeholder-[#A9A095]/60 focus:outline-none focus:border-[#C86E45]"
          />
        </div>

        <div className="space-y-2">
          <label className="label-caps text-[#A9A095] block">Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="julian@sterling.co.uk"
            className="w-full bg-[#11100E] border border-white/10 px-4 py-3 text-xs text-[#F7F2E9] placeholder-[#A9A095]/60 focus:outline-none focus:border-[#C86E45]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="label-caps text-[#A9A095] block">Telephone (Optional)</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98201 55300"
            className="w-full bg-[#11100E] border border-white/10 px-4 py-3 text-xs text-[#F7F2E9] placeholder-[#A9A095]/60 focus:outline-none focus:border-[#C86E45]"
          />
        </div>

        <div className="space-y-2">
          <label className="label-caps text-[#A9A095] block">Nature of Inquiry</label>
          <select
            value={formData.enquiryType}
            onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
            className="w-full bg-[#11100E] border border-white/10 px-4 py-3 text-xs text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
          >
            <option value="GENERAL">General Inquiry</option>
            <option value="RESERVATION">Table Reservation Assistance</option>
            <option value="PRIVATE_DINING">Private Dining & Salon Hire</option>
            <option value="EVENTS">Events & Masterclasses</option>
            <option value="PRESS">Press & Media</option>
            <option value="CAREERS">Careers & Culinary Brigade</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="label-caps text-[#A9A095] block">Message *</label>
        <textarea
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please share details regarding your inquiry, preferred dates, or specific dietary questions..."
          className="w-full bg-[#11100E] border border-white/10 px-4 py-3 text-xs text-[#F7F2E9] placeholder-[#A9A095]/60 focus:outline-none focus:border-[#C86E45] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-terracotta text-xs w-full py-4 justify-center"
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Transmit Message</span>
          </>
        )}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-2 text-xs text-[#778064] p-3 bg-[#778064]/10 border border-[#778064]/30 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-xs text-[#C86E45] p-3 bg-[#C86E45]/10 border border-[#C86E45]/30 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}
    </form>
  );
}
