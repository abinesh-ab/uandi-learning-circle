import confetti from 'canvas-confetti'

export default function July23S9() {
  const triggerConfetti = () =>
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#2563EB', '#F59E0B', '#E11D48', '#10B981'] })

  return (
    <div className="max-w-3xl w-full space-y-8 text-center">
      <div className="relative flex justify-center">
        <div className="glass-card p-8 rounded-full border border-amber-300 relative z-10">
          <span className="text-6xl" style={{ display: 'block', animation: 'spin 25s linear infinite' }}>
            ☀️
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight font-heading">Together We Grow 💙</h2>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Thank you for your energy, time, and commitment to educating our children.
        </p>
      </div>

      <button
        onClick={triggerConfetti}
        className="px-10 py-5 bg-gradient-to-r from-brand-blue to-amber-500 text-white font-extrabold text-xl rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
      >
        Let's Change Lives 💙
      </button>
    </div>
  )
}
