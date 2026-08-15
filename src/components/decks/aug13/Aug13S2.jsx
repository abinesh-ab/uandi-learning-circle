import { useState } from 'react'

const timePowers = [
  { emoji: '⏸️', title: 'Pause Time', desc: 'Freeze the world in a perfect moment' },
  { emoji: '⏩', title: 'Fast-Forward', desc: 'Skip the hard parts, get to the good' },
  { emoji: '⏪', title: 'Go Back', desc: 'Fix a mistake or relive something cherished' },
  { emoji: '🔁', title: 'Replay a Moment', desc: 'Experience something wonderful again' },
  { emoji: '🐌', title: 'Slow It Down', desc: 'Make every precious moment last longer' },
  { emoji: '⏰', title: 'Add Extra Hours', desc: 'Never run out of time for what matters' },
  { emoji: '🚀', title: 'Jump to Future', desc: 'See what our students will become' },
]

export default function Aug13S2() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="max-w-5xl w-full space-y-5 text-center">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider">
          ⏳ Ice Breaker · Aug 13 LC Call
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900">
          If you had a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">Time Superpower</span>,
          <br className="hidden md:block" /> what would you do?
        </h2>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Pick one. Then explain <em>why</em> — that's the real question.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {timePowers.map(({ emoji, title, desc }) => (
          <button
            key={title}
            onClick={() => setSelected(title)}
            className={`timepower-card glass-card-interactive p-4 rounded-2xl flex flex-col items-center gap-1.5 text-center border-2 border-transparent${selected === title ? ' tp-selected' : ''}`}
          >
            <span className="text-3xl">{emoji}</span>
            <span className="text-xs font-black text-slate-900">{title}</span>
            <span className="text-[10px] text-slate-500">{desc}</span>
          </button>
        ))}
        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 gap-1">
          <span className="text-2xl">🤔</span>
          <span className="text-[10px] font-bold text-slate-400">Your own idea?</span>
        </div>
      </div>

      {selected && (
        <div className="glass-card p-4 rounded-2xl max-w-2xl mx-auto border-l-4 border-l-violet-500 text-left">
          <p className="text-[10px] font-black text-violet-600 uppercase tracking-wider mb-1">Follow-up for the group</p>
          <p className="text-sm text-slate-800 font-semibold">"You have complete control over time. What would you <em>change, relive, fix, or create</em>?"</p>
          <p className="text-[11px] text-slate-500 mt-1">Share your story!</p>
        </div>
      )}

      <div className="glass-card p-4 rounded-2xl max-w-2xl mx-auto border-l-4 border-l-brand-blue text-left">
        <p className="text-[10px] font-black text-brand-blue uppercase tracking-wider mb-1">Bridge → This Week's Theme</p>
        <p className="text-sm text-slate-800">"We may not have the superpower to control time. But we <strong>do</strong> have control over how we use the time we have."</p>
        <p className="text-[11px] text-slate-500 mt-1.5">We cannot create more time with our kids. We can only make the time we have <strong>more meaningful.</strong></p>
      </div>
    </div>
  )
}
