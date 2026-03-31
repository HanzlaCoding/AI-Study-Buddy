import SaaSLayout from "../layouts/SaaSLayout";
import { Sparkles, CheckCircle, Zap } from "lucide-react";

export default function Pricing() {
  return (
    <SaaSLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-4 md:py-8 flex flex-col h-full justify-center text-center">
        <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight text-zinc-900 mb-2 md:mb-4">
          Simple, transparent pricing.
        </h1>
        <p className="text-zinc-500 text-sm md:text-base max-w-2xl mx-auto mb-6 md:mb-8">
          Invest in your focus. No hidden fees, no complex tiers. Just everything you need to hit FlowState.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="glass-premium rounded-[2rem] p-6 md:p-8 flex flex-col text-left border border-zinc-200 bg-white shadow-sm">
            <h3 className="text-lg md:text-xl font-heading font-semibold text-zinc-900 mb-1 md:mb-2">Starter</h3>
            <p className="text-zinc-500 text-xs md:text-sm mb-4 md:mb-6">Perfect for students and casual learners.</p>
            <div className="mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl font-bold font-heading text-zinc-900">$0</span>
              <span className="text-zinc-500 text-sm md:text-base"> / month</span>
            </div>
            <button className="w-full py-2.5 md:py-3 rounded-xl bg-zinc-100 text-zinc-900 font-bold hover:bg-zinc-200 transition-colors mb-6 md:mb-8 text-sm md:text-base">
              Get Started
            </button>
            <ul className="flex flex-col gap-3 md:gap-4 text-xs md:text-sm text-zinc-600 flex-1">
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-emerald-500" /> Basic Pomodoro Timer</li>
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-emerald-500" /> YouTube Video Focus</li>
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-emerald-500" /> Local Sticky Notes</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="glass-premium rounded-[2rem] p-6 md:p-8 flex flex-col text-left border-2 border-[#6366F1] bg-white relative shadow-xl md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6366F1] text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Most Popular
            </div>
            <h3 className="text-lg md:text-xl font-heading font-semibold text-zinc-900 mb-1 md:mb-2">Pro</h3>
            <p className="text-zinc-500 text-xs md:text-sm mb-4 md:mb-6">For deep workers and professionals.</p>
            <div className="mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl font-bold font-heading text-zinc-900">$12</span>
              <span className="text-zinc-500 text-sm md:text-base"> / month</span>
            </div>
            <button className="w-full py-2.5 md:py-3 rounded-xl bg-[#6366F1] text-white font-bold hover:bg-[#4F46E5] transition-colors mb-6 md:mb-8 shadow-md text-sm md:text-base">
              Start Free Trial
            </button>
            <ul className="flex flex-col gap-3 md:gap-4 text-xs md:text-sm text-zinc-600 flex-1">
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-[#6366F1]" /> Everything in Starter</li>
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-[#6366F1]" /> Advanced Ambient Acoustics</li>
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-[#6366F1]" /> Unlimited Playlist Support</li>
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-[#6366F1]" /> Whisper AI Summaries</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-premium rounded-[2rem] p-6 md:p-8 flex flex-col text-left border border-zinc-200 bg-white shadow-sm">
            <h3 className="text-lg md:text-xl font-heading font-semibold text-zinc-900 mb-1 md:mb-2">Teams</h3>
            <p className="text-zinc-500 text-xs md:text-sm mb-4 md:mb-6">Scale focus across your organization.</p>
            <div className="mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl font-bold font-heading text-zinc-900">$49</span>
              <span className="text-zinc-500 text-sm md:text-base"> / seat</span>
            </div>
            <button className="w-full py-2.5 md:py-3 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors mb-6 md:mb-8 text-sm md:text-base">
              Contact Sales
            </button>
            <ul className="flex flex-col gap-3 md:gap-4 text-xs md:text-sm text-zinc-600 flex-1">
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-zinc-900" /> Custom Integrations</li>
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-zinc-900" /> Team Analytics Dashboard</li>
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-zinc-900" /> SSO & Advanced Security</li>
              <li className="flex items-center gap-2 md:gap-3"><CheckCircle size={14} className="text-zinc-900" /> Priority 24/7 Support</li>
            </ul>
          </div>
        </div>
      </div>
    </SaaSLayout>
  );
}
