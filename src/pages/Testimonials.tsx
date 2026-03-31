import SaaSLayout from "../layouts/SaaSLayout";
import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      title: "Senior Software Engineer",
      text: "FlowState is the only tool that actually keeps me off Reddit during compile times. The focus blocks are ruthless in the best way possible.",
      rating: 5,
    },
    {
      name: "David Chen",
      title: "Med Student",
      text: "The Whisper AI summaries from YouTube lectures saved my life during finals. Being able to take notes while the ambient noise blocks out the library is a game changer.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      title: "Indie Hacker",
      text: "I used to have 4 different apps for timer, notes, and music. Having them in one single UI is incredible. The design is absolutely gorgeous too.",
      rating: 5,
    },
    {
      name: "Marcus Thorne",
      title: "Product Designer",
      text: "As a designer, I'm picky about the apps I use. FlowState is beautiful, fast, and stays completely out of the way until I need it.",
      rating: 4,
    },
    {
      name: "Jessica Albright",
      title: "Law Student",
      text: "The logging of my 'biggest distraction' before starting a session really forces me to be mindful. 10/10 app.",
      rating: 5,
    },
    {
      name: "Tom Haverford",
      title: "Entrepreneur",
      text: "Treat yo self to some deep work! Seriously, the acoustic environment feature is top tier.",
      rating: 5,
    }
  ];

  return (
    <SaaSLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-4 md:py-8 flex flex-col h-full justify-center text-center">
        <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight text-zinc-900 mb-2 md:mb-4">
          Loved by deep workers.
        </h1>
        <p className="text-zinc-500 text-sm md:text-base max-w-2xl mx-auto mb-6 md:mb-8">
          See how thousands of students and professionals are doubling their focused output.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {reviews.slice(0, 3).map((review, i) => (
            <div key={i} className="glass-premium rounded-2xl p-5 md:p-6 flex flex-col text-left border border-zinc-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-3 cursor-default text-amber-500">
                {[...Array(review.rating)].map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-zinc-600 leading-relaxed mb-4 italic text-[13px] md:text-sm">
                "{review.text}"
              </p>
              <div className="mt-auto">
                <p className="font-bold text-zinc-900 font-heading text-sm">{review.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{review.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SaaSLayout>
  );
}
