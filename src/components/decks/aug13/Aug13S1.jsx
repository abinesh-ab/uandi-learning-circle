export default function Aug13S1({ navigate }) {
  return (
    <div className="max-w-4xl w-full space-y-6 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-wider">
        📅 August 13, 2026 · LC Call
      </div>

      <div className="space-y-2">
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-none font-heading">THE X FACTORS</h2>
        <p className="text-xl md:text-2xl font-bold text-brand-blue tracking-widest uppercase">LC Call — August 13</p>
      </div>

      <p className="text-base text-slate-500 italic max-w-lg mx-auto">
        "We have limited time. Let's make every hour count."
      </p>

      {/* Agenda preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left max-w-3xl mx-auto">
        {[
          { emoji: '⏳', title: 'Ice Breaker', sub: 'Time Superpower' },
          { emoji: '📅', title: 'Offline RSVP', sub: 'Sunday Planning Meet' },
          { emoji: '💬', title: 'WAG Norms', sub: 'Group Engagement' },
          { emoji: '🏆', title: 'Leaderboard', sub: '+ Social Contract' },
        ].map(({ emoji, title, sub }) => (
          <div key={title} className="glass-card-interactive p-3 rounded-2xl space-y-1">
            <span className="text-lg">{emoji}</span>
            <p className="text-xs font-black text-slate-900">{title}</p>
            <p className="text-[10px] text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate(1)}
        className="px-8 py-3 bg-brand-blue hover:bg-blue-700 text-white font-black text-sm rounded-full shadow-xl shadow-blue-500/30 hover:scale-105 transition-all inline-flex items-center gap-2"
      >
        Let's Begin <span>→</span>
      </button>
    </div>
  )
}
