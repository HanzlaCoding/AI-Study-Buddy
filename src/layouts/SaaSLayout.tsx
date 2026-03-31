import { ReactNode } from "react";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function SaaSLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100dvh] overflow-y-auto overflow-x-hidden flex flex-col bg-[#FFFFFF] text-zinc-900 font-sans selection:bg-[#6366F1]/20">
      {/* Light Mode subtle grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Top Navigation - Shared SaaS Style */}
      <header className="w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl sticky top-0 z-[100]">
        <nav className="flex justify-between items-center shrink-0 max-w-5xl mx-auto w-full px-6 md:px-8 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-heading font-bold tracking-tight text-zinc-900">FlowState</span>
          </Link>
          
          <div className="flex items-center gap-6 md:gap-8 text-[13px] font-medium text-zinc-500">
            <Link to="/about" className="hidden md:block hover:text-zinc-900 transition-colors">About Us</Link>
            <Link to="/pricing" className="hidden md:block hover:text-zinc-900 transition-colors">Pricing</Link>
            <Link to="/testimonials" className="hidden sm:block hover:text-zinc-900 transition-colors">Testimonials</Link>
            <Link to="/" className="bg-zinc-900 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-md text-center">
              Start for Free
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center">
        {children}
      </main>

      {/* Footer Status Indicators */}
      <footer className="relative z-10 flex flex-col items-center justify-center w-full py-2 md:py-3 text-center mt-auto bg-[#F4F4F5] border-t border-zinc-200">
        <div className="flex gap-4 mb-1.5 text-[11px] md:text-xs text-zinc-500 font-medium">
            <Link to="/about" className="hover:text-zinc-900">About</Link>
            <Link to="/pricing" className="hover:text-zinc-900">Pricing</Link>
            <Link to="/testimonials" className="hover:text-zinc-900">Testimonials</Link>
        </div>
        <p className="text-zinc-500 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold mb-1.5">System Status: Operational</p>
        <p className="text-zinc-400 text-[10px] md:text-xs">© {new Date().getFullYear()} FlowState Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
