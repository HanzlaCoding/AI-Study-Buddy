import { ReactNode } from "react";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function DarkSaaSLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] overflow-x-hidden flex flex-col bg-[#09090B] text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* Dark subtle grid overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2224%22%20height=%2224%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20d=%22M%2024%200%20L%200%200%200%2024%22%20fill=%22none%22%20stroke=%22rgba(255,255,255,0.03)%22%20stroke-width=%221%22/%3E%3C/svg%3E')] opacity-100" />

      {/* Top Navigation */}
      <header className="w-full border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl sticky top-0 z-[100]">
        <nav className="flex justify-between items-center shrink-0 max-w-5xl mx-auto w-full px-6 md:px-8 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="text-lg font-heading font-bold tracking-tight text-zinc-100">FlowState</span>
          </Link>

          <div className="flex items-center gap-6 md:gap-8 text-[13px] font-medium text-zinc-500">
            <Link to="/about" className="hidden md:block hover:text-zinc-200 transition-colors">About Us</Link>
            <Link to="/pricing" className="hidden md:block hover:text-zinc-200 transition-colors">Pricing</Link>
            <Link to="/testimonials" className="hidden sm:block hover:text-zinc-200 transition-colors">Testimonials</Link>
            <Link to="/" className="bg-white text-zinc-900 px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold hover:bg-zinc-100 transition-colors shadow-md text-center text-sm">
              Start for Free
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center justify-center w-full py-3 md:py-4 text-center border-t border-white/5 bg-[#09090B]">
        <div className="flex gap-6 mb-2 text-xs text-zinc-600 font-medium">
          <Link to="/about" className="hover:text-zinc-300 transition-colors">About</Link>
          <Link to="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
          <Link to="/testimonials" className="hover:text-zinc-300 transition-colors">Testimonials</Link>
        </div>
        <p className="text-zinc-700 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">System Status: Operational</p>
        <p className="text-zinc-700 text-[10px]">© {new Date().getFullYear()} FlowState Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
