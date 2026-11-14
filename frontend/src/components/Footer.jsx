import React from "react";
import { Film, ShieldCheck, Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070b12] text-slate-400 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Film className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-lg text-white">
              Cine<span className="text-amber-400">Pass</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The next-generation Cinema Hall & Multiplex Ticket Booking System. Built with the complete MERN Stack (MongoDB, Express, React, Node.js).
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Cinema Experience</h4>
          <ul className="text-xs space-y-2">
            <li className="hover:text-amber-400 cursor-pointer transition">Dolby Atmos Sound System</li>
            <li className="hover:text-amber-400 cursor-pointer transition">IMAX Laser 4K Projection</li>
            <li className="hover:text-amber-400 cursor-pointer transition">VIP Luxe Recliner Lounges</li>
            <li className="hover:text-amber-400 cursor-pointer transition">In-Seat Gourmet Dining</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Customer Support</h4>
          <ul className="text-xs space-y-2">
            <li className="flex items-center gap-2"><Headphones className="w-3.5 h-3.5 text-amber-400" /> 24/7 Helpline: 1800-CINE-PASS</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Secure Checkout</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Instant Refund & Cancellation</li>
            <li className="hover:text-amber-400 cursor-pointer transition">Terms & Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Stack Details</h4>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">MongoDB / Mongoose</span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">Express.js API</span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">React 18 + Vite</span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">Node.js Runtime</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Real-time seat reservation with instant e-ticket pass generation.
          </p>
        </div>
      </div>
    </footer>
  );
}

