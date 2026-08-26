import confetti from 'canvas-confetti'
import { Sun, Trophy, Heart, Zap } from 'lucide-react'

const celebrate = () =>
  confetti({
    particleCount: 180,
    spread: 110,
    origin: { y: 0.55 },
    colors: ['#2563EB', '#F59E0B', '#E11D48', '#10B981', '#8B5CF6', '#FACC15'],
  })

const cards = [
  {
    icon: Sun,
    bg: 'bg-amber-100 text-amber-700',
    border: 'border-t-amber-500',
    title: 'Small Wins This Week',
    prompt: 'What went really well — big or small — that made you smile?',
  },
  {
    icon: Trophy,
    bg: 'bg-blue-100 text-brand-blue',
    border: 'border-t-brand-blue',
    title: 'Kid Breakthroughs',
    prompt: 'A student who surprised you, made a leap, or showed up differently.',
  },
  {
    icon: Heart,
    bg: 'bg-rose-100 text-rose-600',
    border: 'border-t-rose-500',
    title: 'Volunteer Appreciations',
    prompt: 'Shout out a teammate who went above and beyond this week. 🌻',
  },
]

export default function Aug27S1() {
  return (
    <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
      {/* Badge + Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-black uppercase tracking-widest shadow-sm">
          🌻 LC Call — August 27 · Opening Round
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 font-heading">
          Weekly Good Things{' '}
          <span className="inline-block animate-bounce">🎉</span>
        </h2>
        <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
          We have good things from this week that we might have missed noticing — let's celebrate them together!
        </p>
      </div>

      {/* 3 Prompt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {cards.map(({ icon: Icon, bg, border, title, prompt }) => (
          <div
            key={title}
            className={`glass-card bg-white rounded-3xl border border-slate-200 border-t-4 ${border} p-7 flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1`}
          >
            <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center shadow-sm`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-900 font-heading">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Confetti CTA */}
      <button
        onClick={celebrate}
        className="px-10 py-4 bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 hover:opacity-90 text-white font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 hover:scale-105 transition-all inline-flex items-center gap-2.5"
      >
        <Zap className="w-5 h-5" />
        🎊 Celebrate &amp; Kick Off!
      </button>
    </div>
  )
}
