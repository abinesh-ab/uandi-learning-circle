export default function Aug13S3({ rsvp, handleRSVP }) {
  return (
    <div className="max-w-3xl w-full text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
        📅 Offline Planning Meet — RSVP
      </div>

      <h2 className="text-3xl md:text-4xl font-black text-slate-900">Can You Make It?</h2>

      <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-2">
        <div className="text-4xl">☀️</div>
        <h3 className="text-xl font-black text-slate-900">This Sunday</h3>
        <p className="text-brand-blue font-bold text-lg">9:00 AM – 11:00 AM</p>
        <p className="text-xs text-slate-500">Offline Planning Meet + Lunch together 🍽️</p>
        <p className="text-[11px] text-slate-400 mt-2">
          We'll plan our classes, align on student goals, and build The X Factors together in person.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => handleRSVP('yes')}
          className={`flex-1 py-5 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all flex items-center justify-center gap-3${rsvp === 'yes' ? ' ring-4 ring-emerald-300 scale-105' : ''}`}
        >
          <span className="text-2xl">🟢</span> YES — Let's Meet!
        </button>
        <button
          onClick={() => handleRSVP('no')}
          className={`flex-1 py-5 px-8 bg-red-500 hover:bg-red-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-500/25 hover:scale-105 transition-all flex items-center justify-center gap-3${rsvp === 'no' ? ' ring-4 ring-red-300 scale-105' : ''}`}
        >
          <span className="text-2xl">🔴</span> NO — Can't Make It
        </button>
      </div>

      {rsvp === 'yes' && (
        <div className="glass-card p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-left">
          <p className="font-black text-emerald-800 text-lg">Let's go! 🚀</p>
          <p className="text-sm text-emerald-700 mt-1">Sunday morning becomes our <strong>X Factors Planning Meet.</strong></p>
          <p className="text-xs text-emerald-600 mt-2">Section 3a is locked — we'll cover it together offline. Moving ahead… ▶</p>
        </div>
      )}

      {rsvp === 'no' && (
        <div className="glass-card p-4 rounded-2xl bg-amber-50 border border-amber-300 text-left">
          <p className="font-black text-amber-800">🔓 Planning section unlocked!</p>
          <p className="text-xs text-amber-700 mt-1">We'll walk through the planning together in this call. Section 3a is now accessible.</p>
        </div>
      )}
    </div>
  )
}
