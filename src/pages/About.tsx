import SaaSLayout from "../layouts/SaaSLayout";
import { Zap } from "lucide-react";

export default function About() {
  return (
    <SaaSLayout>
      <div className="w-full max-w-4xl mx-auto px-6 py-4 md:py-8 flex flex-col h-full justify-center">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#6366F1]/10 flex items-center justify-center mb-3 md:mb-4">
            <Zap size={24} className="text-[#6366F1]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight text-zinc-900 mb-3 md:mb-4">
            We are engineering focus.
          </h1>
          <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            In a world engineered for distraction, we built FlowState to help creators, students, and professionals reclaim their deep work. We believe that extraordinary work requires extraordinary focus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-4 md:mt-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-zinc-900 mb-3">Our Mission</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We started FlowState because the modern computing environment is inherently hostile to deep thought. Constant notifications, infinite feeds, and multi-tab workflows shatter attention spans. Our mission is to build the ultimate neural workspace—a digital cloister where your only metric is the depth of your focus.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-zinc-900 mb-3">The Methodology</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              FlowState isn't just a timer; it's a psychology-driven environment. By combining strict Neural Pomodoro blocks, dynamic acoustic masking, and intelligent distraction logging, we create a workflow that actively trains your brain to sustain flow states longer and with less effort over time.
            </p>
          </div>
        </div>
      </div>
    </SaaSLayout>
  );
}
