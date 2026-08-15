const schedule = [
  { color: 'bg-emerald-50 border-emerald-100 text-emerald-700', time: '6:00–6:10', task: 'School catch-up & good things' },
  { color: 'bg-blue-50 border-blue-100 text-blue-700', time: '6:10–6:20', task: 'Previous concept retrieval' },
  { color: 'bg-violet-50 border-violet-100 text-violet-700', time: '6:20–6:40', task: 'Explain goodwill concept' },
  { color: 'bg-amber-50 border-amber-100 text-amber-700', time: '6:40–7:00', task: 'Guided examples together' },
  { color: 'bg-rose-50 border-rose-100 text-rose-700', time: '7:00–7:20', task: 'Student solo practice' },
  { color: 'bg-teal-50 border-teal-100 text-teal-700', time: '7:20–7:40', task: 'Application / challenge problem' },
  { color: 'bg-slate-50 border-slate-200 text-slate-600', time: '7:40–7:55', task: 'Doubts clearance' },
  { color: 'bg-emerald-50 border-emerald-200 text-emerald-700', time: '7:55–8:00', task: 'Reflection + homework launch' },
]

export default function Aug13S4({ locked }) {
  return (
    <div className="max-w-5xl w-full space-y-4 relative">
      {/* Lock Overlay */}
      {locked && (
        <div className="slide-lock-overlay">
          <span className="text-5xl mb-3">🔒</span>
          <p className="text-sm font-black text-slate-700">3a is Locked</p>
          <p className="text-xs text-slate-500 mt-1">Select "NO" on the RSVP slide to unlock planning section</p>
        </div>
      )}

      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
          ⏰ 3a — Class Timing + Granular Planning
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900">How Much Time Do We <em>Actually</em> Have?</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { val: '2', label: 'Hours per class', border: 'border-t-brand-blue', textColor: 'text-brand-blue' },
          { val: '×4', label: 'Classes per month', border: 'border-t-amber-500', textColor: 'text-amber-600' },
          { val: '8 hrs', label: 'Total per month', border: 'border-t-rose-500', textColor: 'text-rose-600' },
        ].map(({ val, label, border, textColor }) => (
          <div key={label} className={`glass-card p-5 rounded-2xl border-t-4 ${border}`}>
            <div className={`text-4xl font-black ${textColor}`}>{val}</div>
            <div className="text-xs font-bold text-slate-700 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 rounded-2xl border border-amber-200 bg-amber-50/50">
        <p className="text-sm text-amber-900 font-semibold text-center">"Our students are preparing for school and public exams. We cannot teach everything in 2 hours."</p>
        <p className="text-xs text-amber-700 text-center mt-1 font-bold">→ Our class should become a <em>launchpad for the entire week.</em></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">❌ Weak Planning</h4>
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[11px] text-slate-700 italic">"Teach Partnership Accounts."</div>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">✅ Granular Planning</h4>
            <div className="space-y-1">
              {schedule.map(({ color, time, task }) => (
                <div key={time} className={`flex gap-3 p-2 ${color} border rounded-lg text-[10px]`}>
                  <span className="font-black shrink-0">{time}</span>
                  <span className="text-slate-700">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="glass-card p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎬</span>
              <h4 className="text-sm font-black text-slate-900">The Filmmaking Principle</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed italic">"A great film doesn't begin when the camera starts rolling."</p>
            <p className="text-[11px] text-slate-500 mt-1.5">Before the shoot: Story • Screenplay • Shot planning • Props • Scheduling • Storyboards</p>
            <p className="text-[11px] text-brand-blue font-semibold mt-1">Deep preparation reduces chaos during execution.</p>
            <div className="mt-3 border-t border-slate-100 pt-3 grid grid-cols-3 gap-1 text-[9px] text-center">
              <div className="bg-blue-50 p-1.5 rounded-lg"><span className="font-black text-blue-700 block">BEFORE</span><span className="text-slate-600">Know • Plan • Prepare</span></div>
              <div className="bg-amber-50 p-1.5 rounded-lg"><span className="font-black text-amber-700 block">DURING</span><span className="text-slate-600">Execute • Observe • Adapt</span></div>
              <div className="bg-emerald-50 p-1.5 rounded-lg"><span className="font-black text-emerald-700 block">AFTER</span><span className="text-slate-600">Document • Reflect • Improve</span></div>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl bg-slate-900 border border-slate-700 text-center space-y-1">
            <p className="text-white font-black text-sm">"Good teaching doesn't start at 6 PM."</p>
            <p className="text-amber-400 font-black text-sm">"It starts before we enter the classroom."</p>
          </div>
        </div>
      </div>
    </div>
  )
}
