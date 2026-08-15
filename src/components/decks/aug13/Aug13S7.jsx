export default function Aug13S7() {
  return (
    <div className="max-w-5xl w-full space-y-5">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
          🤝 Volunteer–Student Social Contract
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900">Build a Smaller Promise with Your Student</h2>
        <p className="text-xs text-slate-600 italic max-w-xl mx-auto">"We created our LC Social Contract together. Now let's build one with each of our students."</p>
      </div>

      <div className="glass-card p-4 rounded-2xl border-l-4 border-l-rose-400 bg-rose-50/30">
        <p className="text-sm text-slate-800">"Curate it in your own way with your student. There is no rigid template — make it personal, meaningful, and yours."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="glass-card-interactive p-4 rounded-2xl border-t-4 border-t-blue-500 space-y-2">
          <div className="flex items-center gap-2"><span className="text-xl">🎯</span><h4 className="text-xs font-black text-slate-900">Student Goal Setting</h4></div>
          <ul className="space-y-1 text-[11px] text-slate-600">
            <li>→ What do I want to improve?</li>
            <li>→ What am I struggling with?</li>
            <li>→ What is my academic goal?</li>
            <li>→ What do I want to achieve?</li>
          </ul>
        </div>

        <div className="glass-card-interactive p-4 rounded-2xl border-t-4 border-t-rose-500 space-y-2">
          <div className="flex items-center gap-2"><span className="text-xl">❤️</span><h4 className="text-xs font-black text-slate-900">Promises &amp; Commitments</h4></div>
          <p className="text-[10px] font-black text-brand-blue">Volunteer → Student:</p>
          <p className="text-[11px] text-slate-600">What can my student expect from me?</p>
          <p className="text-[10px] font-black text-rose-600 mt-1">Student → Volunteer:</p>
          <p className="text-[11px] text-slate-600">What can I expect from my student?</p>
          <p className="text-[10px] font-black text-emerald-600 mt-1">Together:</p>
          <p className="text-[11px] text-slate-600">What do we promise each other?</p>
        </div>

        <div className="glass-card-interactive p-4 rounded-2xl border-t-4 border-t-emerald-500 space-y-2">
          <div className="flex items-center gap-2"><span className="text-xl">📅</span><h4 className="text-xs font-black text-slate-900">Personal Student Calendar</h4></div>
          <p className="text-[11px] text-slate-600">Build a simple roadmap around their goal. What milestones do we want to hit in 4 weeks? 8 weeks? By the exam?</p>
        </div>

        <div className="glass-card-interactive p-4 rounded-2xl border-t-4 border-t-violet-500 space-y-2">
          <div className="flex items-center gap-2"><span className="text-xl">✉️</span><h4 className="text-xs font-black text-slate-900">Future Letter to Self</h4></div>
          <p className="text-[11px] text-slate-600 italic">"Dear Future Me…"</p>
          <ul className="space-y-0.5 text-[11px] text-slate-600">
            <li>→ What do I want you to achieve?</li>
            <li>→ What do I want you to be proud of?</li>
            <li>→ What do I hope you never give up on?</li>
          </ul>
        </div>

        <div className="glass-card-interactive p-4 rounded-2xl border-t-4 border-t-amber-500 space-y-2 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2"><span className="text-xl">🌈</span><h4 className="text-xs font-black text-slate-900">Dream Board <span className="font-normal text-slate-400">(Optional)</span></h4></div>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            {['Dreams', 'Career', 'Skills', 'Interests', 'Inspirations', 'Future Goals'].map((tag, i) => {
              const colors = ['bg-amber-50 border-amber-200 text-amber-700', 'bg-blue-50 border-blue-200 text-blue-700', 'bg-rose-50 border-rose-200 text-rose-700', 'bg-emerald-50 border-emerald-200 text-emerald-700', 'bg-violet-50 border-violet-200 text-violet-700', 'bg-slate-50 border-slate-200 text-slate-600']
              return <span key={tag} className={`px-2 py-1 border rounded-full font-semibold ${colors[i]}`}>{tag}</span>
            })}
          </div>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl bg-slate-900 border border-slate-700 text-center">
        <p className="text-white font-black text-sm">"This isn't another worksheet."</p>
        <p className="text-amber-400 text-sm mt-1">"It's a promise between a student and the person walking alongside them."</p>
      </div>
    </div>
  )
}
