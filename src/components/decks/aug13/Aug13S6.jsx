export default function Aug13S6() {
  const criteria = [
    { emoji: '💡', label: 'Innovation', desc: 'Creative methods & ideas', border: 'border-t-violet-500' },
    { emoji: '🔥', label: '100% Attendance', desc: 'No student left behind', border: 'border-t-orange-500' },
    { emoji: '🤝', label: 'LC Participation', desc: 'Active in calls & planning', border: 'border-t-blue-500' },
    { emoji: '📝', label: 'Student Logs', desc: 'Meaningful & timely logs', border: 'border-t-emerald-500' },
  ]

  return (
    <div className="max-w-5xl w-full space-y-5">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
          🏆 X Factors Leaderboard
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900">Which Team is Creating the Most Impact?</h2>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">Friendly accountability — not competition. Every criterion is a measure of care for our kids.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {criteria.map(({ emoji, label, desc, border }) => (
          <div key={label} className={`glass-card p-3 rounded-xl text-center border-t-4 ${border}`}>
            <span className="text-xl block mb-1">{emoji}</span>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider block">{label}</span>
            <p className="text-[9px] text-slate-500 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 rounded-3xl border border-amber-200 bg-amber-50/30 relative overflow-hidden">
        <img
          src="/leaderboard-aug13.jpeg"
          alt="X Factors Leaderboard"
          className="w-full max-h-80 object-contain rounded-2xl"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
        />
        <div className="hidden flex-col items-center justify-center py-12 gap-3">
          <span className="text-5xl">🏆</span>
          <p className="text-sm font-bold text-slate-500">Leaderboard coming soon!</p>
          <p className="text-xs text-slate-400">Add <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">leaderboard-aug13.jpeg</code> to the public folder</p>
        </div>
      </div>
    </div>
  )
}
