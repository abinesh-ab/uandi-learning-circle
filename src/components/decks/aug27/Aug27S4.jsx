import { Brain, BookOpen } from 'lucide-react'

const blocks = [
  {
    id: 'life',
    icon: Brain,
    iconBg: 'bg-violet-100 text-violet-700',
    border: 'border-l-4 border-violet-500',
    accentBg: 'bg-violet-500',
    emoji: '🧠',
    title: 'In Daily Life & Career',
    subtitle: 'Energy & Time Management',
    points: [
      {
        quad: '💎',
        quadLabel: 'GOLDMINE',
        quadColor: 'bg-emerald-100 text-emerald-800',
        label: 'Audit Your Effort',
        text: 'Stop pouring 80% of your energy into Questionable tasks — things that take massive effort but yield almost nothing in return. Identify your personal Goldmines and protect them fiercely.',
      },
      {
        quad: '⚡',
        quadLabel: 'QUICK WIN',
        quadColor: 'bg-blue-100 text-blue-800',
        label: 'Stack Quick Wins for Momentum',
        text: 'Start your day or week with small, easy-to-finish tasks. These build confidence and create forward motion before you tackle bigger challenges.',
      },
      {
        quad: '🚀',
        quadLabel: 'MOONSHOT',
        quadColor: 'bg-amber-100 text-amber-800',
        label: 'Protect Your Bandwidth',
        text: 'Pursue 1–2 Goldmines for high return, and commit to only ONE Moonshot at a time. Spreading across multiple Moonshots simultaneously guarantees burnout and zero results.',
      },
    ],
  },
  {
    id: 'academic',
    icon: BookOpen,
    iconBg: 'bg-brand-blue/10 text-brand-blue',
    border: 'border-l-4 border-brand-blue',
    accentBg: 'bg-brand-blue',
    emoji: '📚',
    title: 'In the Classroom & Syllabus',
    subtitle: '9th Maths & Accountancy Strategy',
    points: [
      {
        quad: '💎',
        quadLabel: 'GOLDMINE',
        quadColor: 'bg-emerald-100 text-emerald-800',
        label: 'Goldmine Chapters — Deep Focus',
        text: 'Algebra, Geometry & Mensuration are compulsory high-weightage sections that guarantee 25+ mark leaps. Consistent Saturday attendance + clear step-by-step proofs + weekly unit tests.',
      },
      {
        quad: '⚡',
        quadLabel: 'QUICK WIN',
        quadColor: 'bg-blue-100 text-blue-800',
        label: 'Quick-Win Chapters — Easy Marks Protected',
        text: 'Set Language, Real Numbers & 1-mark drills. Done quickly to lock in easy marks without eating up core tuition hours. 5-minute retrieval warmups every session.',
      },
      {
        quad: '🚀',
        quadLabel: 'MOONSHOT',
        quadColor: 'bg-amber-100 text-amber-800',
        label: 'The 1-Moonshot Rule for Students',
        text: 'Transforming a struggling student\'s confidence is a long climb. Pick one core breakthrough — e.g. mastering 2-step equations — and build small, weekly visible wins. Never try to fix 10 gaps at once.',
      },
    ],
  },
]

export default function Aug27S4() {
  return (
    <div className="max-w-5xl w-full space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest">
          💡 Beyond the Cafe
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-heading">
          Applying the Matrix in Life &amp; Class
        </h2>
        <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed italic">
          "We have limited hours every Saturday and limited energy every week.{' '}
          <span className="text-brand-blue not-italic font-black">Strategy is knowing what to say NO to.</span>"
        </p>
      </div>

      {/* 2 Big Side-by-Side Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocks.map(({ id, icon: Icon, iconBg, border, accentBg, emoji, title, subtitle, points }) => (
          <div
            key={id}
            className={`glass-card bg-white rounded-3xl ${border} p-6 space-y-5 shadow-sm hover:shadow-xl transition-all`}
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900 font-heading leading-tight">{emoji} {title}</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">{subtitle}</p>
              </div>
            </div>

            {/* Points */}
            <div className="space-y-4">
              {points.map(({ quad, quadLabel, quadColor, label, text }) => (
                <div key={label} className="flex gap-3 items-start">
                  {/* Quadrant Badge */}
                  <span className={`text-[9px] font-black px-2 py-1 rounded-lg shrink-0 mt-0.5 ${quadColor}`}>
                    {quad} {quadLabel}
                  </span>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-black text-slate-900 leading-snug">{label}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Closing Quote */}
      <div className="text-center">
        <div className="inline-block rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-8 py-5 max-w-2xl shadow-2xl">
          <p className="text-sm sm:text-base font-black font-heading leading-snug">
            "The best strategy is the one that gets executed — consistently, every single Saturday."
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium tracking-wide">
            — The X Factors • LC Call, August 27
          </p>
        </div>
      </div>
    </div>
  )
}
