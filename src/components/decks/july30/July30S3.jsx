import { useState } from 'react'

const nameProposals = [
  { id: 1, name: 'LC 0', desc: 'Every great journey starts at Zero—the point of breakthrough.', border: 'border-l-blue-500' },
  { id: 2, name: 'Project Prime ⭐', desc: 'Every child is 1 of 1, unique building blocks of math.', border: 'border-l-rose-500' },
  { id: 3, name: 'MSS Sigmas (Σ)', desc: 'Small efforts added up create an infinite total impact.', border: 'border-l-emerald-500' },
  { id: 4, name: 'Fibonacci Fellows 🌻', desc: 'Grow naturally step-by-step, building on previous roots.', border: 'border-l-amber-500' },
  { id: 5, name: 'Phi Collective (φ)', desc: 'Golden Ratio: purposeful harmony & balanced growth.', border: 'border-l-purple-500' },
  { id: 6, name: 'Vector Warriors', desc: 'Magnitude + Direction. Moving purposefully, not just fast.', border: 'border-l-indigo-500' },
  { id: 7, name: 'Infinity Circle (∞)', desc: 'Potential has no limit, and learning never truly ends.', border: 'border-l-cyan-500' },
  { id: 8, name: 'Pythagoras Pillaigal 😂', desc: 'Leads² + Volunteers² = Confident Kids²', border: 'border-l-rose-400' },
  { id: 9, name: 'The Root Squad (√)', desc: 'Finding the root cause before solving any problem.', border: 'border-l-amber-600' },
]

export default function July30S3() {
  const [rsvpDate, setRsvpDate] = useState('')

  return (
    <div className="max-w-6xl w-full space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-sm mb-1">
          ✅ Name Chosen — July 30th, 2026
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center justify-center gap-2">
          🎉 We Have a Name!
        </h2>
        <p className="text-xs text-slate-600 max-w-2xl mx-auto">
          After voting on July 30th, the squad chose their identity. The 10 proposals below are preserved as part of our LC's story — and the winner is highlighted below.
        </p>

        {/* Team photo */}
        <div className="relative max-w-3xl mx-auto glass-card p-4 rounded-3xl border-2 border-blue-300/50 shadow-xl overflow-hidden group">
          <div className="w-full h-64 md:h-80 bg-gradient-to-b from-blue-50/50 to-amber-50/50 rounded-2xl flex items-center justify-center overflow-hidden">
            <img
              src="/The-X-Factors.jpeg"
              alt="Coimbatore Squad Team"
              className="h-full w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-all duration-500"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between px-2">
            <div className="text-left">
              <span className="text-xs font-black text-slate-900 block">LC Per Vaippadhu Urudhi</span>
              <span className="text-[10px] text-brand-blue font-mono">The Main Characters • Year 2026</span>
            </div>
            <span className="px-3 py-1 bg-brand-blue text-white font-bold text-[10px] rounded-full uppercase tracking-wider">Our Tribe</span>
          </div>
        </div>
      </div>

      {/* Name proposals */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Visionary Universe Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 max-h-[260px] overflow-y-auto p-1">
          {nameProposals.map(({ id, name, desc, border }) => (
            <div key={id} className={`glass-card-interactive p-3 rounded-2xl border-l-4 ${border}`}>
              <h4 className="text-xs font-black text-brand-blue">{id}. {name}</h4>
              <p className="text-[10px] text-slate-600 mt-1">{desc}</p>
            </div>
          ))}
          {/* Winner */}
          <div className="p-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 relative shadow-md">
            <span className="absolute -top-2.5 right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">✅ CHOSEN</span>
            <h4 className="text-xs font-black text-emerald-700">10. The X Factors ✕</h4>
            <p className="text-[10px] text-emerald-800 mt-1 font-medium">Every child has an unknown genius waiting to be discovered. <em>Unlock the Unknown.</em></p>
          </div>
        </div>
      </div>

      {/* Social contract */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group h-48 md:h-56 bg-amber-50/50">
            <img
              src="/social-contract.png"
              alt="Social Contract Handcrafted"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-slate-900 shadow-sm">
              🤝 Handcrafted Social Contract
            </span>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">OFFLINE SIGNING COMMITMENT</span>
              <h4 className="text-xl font-extrabold text-slate-900">Promises Deserve People, Not Forms</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                We sign our Social Contract together in person because real commitment requires real connection between Leads, Volunteers, and Kids.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 block">Schedule Offline Contract RSVP:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Set Date & Location..."
                  value={rsvpDate}
                  onChange={(e) => setRsvpDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 text-xs rounded-xl text-slate-900 focus:outline-none focus:border-brand-blue"
                />
                <button
                  onClick={() => alert('RSVP Date Confirmed!')}
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shrink-0 shadow-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
