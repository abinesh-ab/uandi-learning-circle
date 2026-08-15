import { Sun, Trophy, Lightbulb } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function July23S2() {
  const triggerConfetti = () =>
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#2563EB', '#F59E0B', '#E11D48', '#10B981'] })

  return (
    <div className="max-w-4xl w-full text-center space-y-8">
      <div className="space-y-3">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 flex items-center justify-center gap-3 font-heading">
          Good Things <span className="animate-bounce">🌻</span>
        </h2>
        <p className="text-amber-700 text-lg max-w-xl mx-auto font-medium">
          We definitely have some good things that we might have missed during the week to notice — let's share that!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center pt-4">
        <div className="glass-card-interactive p-8 rounded-3xl flex flex-col justify-center items-center border-t-4 border-t-amber-500">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <Sun className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">Good Things From This Week</h3>
        </div>
        <div className="glass-card-interactive p-8 rounded-3xl flex flex-col justify-center items-center border-t-4 border-t-blue-500">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">Small Wins</h3>
        </div>
        <div className="glass-card-interactive p-8 rounded-3xl flex flex-col justify-center items-center border-t-4 border-t-emerald-500">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">New Learnings</h3>
        </div>
      </div>

      <button
        onClick={triggerConfetti}
        className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-full transition-all inline-flex items-center gap-2 shadow-md hover:scale-105"
      >
        🎉 Celebrate &amp; Share
      </button>
    </div>
  )
}
