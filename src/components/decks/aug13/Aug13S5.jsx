const norms = [
  { color: 'border-t-teal-500', emoji: '🎯', title: '01 — Keep it Purposeful', desc: 'Avoid unnecessary message flooding or information spam. Every message should add value.' },
  { color: 'border-t-blue-500', emoji: '💡', title: '02 — Share What Matters', desc: 'If you find something useful for teaching, lesson planning, kids, activities or our LC — share it!' },
  { color: 'border-t-amber-500', emoji: '🛡️', title: '03 — Protect Important Messages', desc: 'Avoid unnecessary forwards and conversations that bury important LC updates.' },
  { color: 'border-t-violet-500', emoji: '🕐', title: '04 — Agree on Active Hours', desc: "Let's finalize a few days/timings that work for everyone. Consistent active hours = better coordination." },
  { color: 'border-t-rose-500', emoji: '🙋', title: '05 — When We Meet, Be Active', desc: 'If we agree on a particular time for LC discussions, everyone should make an effort to be present and participate.' },
  { color: 'border-t-emerald-500', emoji: '🌟', title: '06 — Share Your Value', desc: "Lesson ideas • Teaching methods • Activities • Student stories • Learning strategies. Everyone's experience matters." },
]

export default function Aug13S5() {
  return (
    <div className="max-w-5xl w-full space-y-4">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider">
          🤝 WAG Norms &amp; Engagements
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900">Our Group Communication Norms</h2>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Let's finalize these together — not rules imposed by one person, but norms we build as a team.
        </p>
      </div>

      <div className="glass-card p-4 rounded-2xl border-l-4 border-l-teal-500 bg-teal-50/30 flex items-start gap-3">
        <span className="text-3xl shrink-0">💬</span>
        <div>
          <p className="text-sm font-bold text-slate-800">WAG = Our WhatsApp Group</p>
          <p className="text-xs text-slate-600 mt-0.5">The goal: Keep our group <strong>useful, active and manageable</strong> — a space that adds value, not noise.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {norms.map(({ color, emoji, title, desc }) => (
          <div key={title} className={`glass-card-interactive p-4 rounded-2xl border-t-4 ${color} space-y-1.5`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{emoji}</span>
              <h4 className="text-xs font-black text-slate-900">{title}</h4>
            </div>
            <p className="text-[11px] text-slate-600">{desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 rounded-2xl border border-slate-200 space-y-3">
        <p className="text-xs font-black text-slate-700 uppercase tracking-wider">🤔 Let's Finalize Together 👇</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-center">
            <p className="text-[11px] font-bold text-teal-800">What should we keep?</p>
            <p className="text-[10px] text-teal-600 mt-1">Share what you value most about our group.</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-[11px] font-bold text-amber-800">What should we avoid?</p>
            <p className="text-[10px] text-amber-600 mt-1">What makes the group less useful for you?</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-[11px] font-bold text-blue-800">When should we be active?</p>
            <p className="text-[10px] text-blue-600 mt-1">What timings work best for you?</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
        <span className="text-2xl shrink-0">🎙️</span>
        <div>
          <p className="text-[11px] text-slate-700 font-semibold italic">"I'll keep the messages short. For anything that needs more context, I'll share a quick voice note."</p>
          <p className="text-[10px] text-slate-400 mt-1">— A commitment to keeping communication light and clear.</p>
        </div>
      </div>
    </div>
  )
}
