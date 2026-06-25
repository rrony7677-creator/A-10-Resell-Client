"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
      setSending(false);
    }, 800);
  };

  const inputClass =
    "w-full text-white bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] focus:border-zinc-600 rounded-lg h-12 px-3 text-sm placeholder:text-zinc-600 outline-none transition-all";

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Get in Touch</h1>
          <p className="text-zinc-400 text-sm mb-8">Questions, feedback, or partnership ideas — we'd love to hear from you.</p>

          <div className="space-y-5 text-sm">
            <div><p className="text-zinc-500">Email</p><p className="text-zinc-200">support@resellhub.com</p></div>
            <div><p className="text-zinc-500">Phone</p><p className="text-zinc-200">+880 1234-567890</p></div>
            <div><p className="text-zinc-500">Address</p><p className="text-zinc-200">Dhaka, Bangladesh</p></div>
            <div>
              <p className="text-zinc-500 mb-2">Follow us</p>
              <div className="flex gap-3">
                {["Facebook", "Twitter", "Instagram"].map((s) => (
                  <span key={s} className="text-xs px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-300">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#121214] border border-zinc-900 rounded-xl p-6 space-y-4">
          <div>
            <label className="text-zinc-400 text-sm font-medium block mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Your name" />
          </div>
          <div>
            <label className="text-zinc-400 text-sm font-medium block mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-zinc-400 text-sm font-medium block mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full text-white bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] focus:border-zinc-600 rounded-lg p-3 text-sm placeholder:text-zinc-600 outline-none transition-all"
              placeholder="How can we help?"
            />
          </div>
          <button type="submit" disabled={sending} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg h-11 font-semibold text-sm">
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}