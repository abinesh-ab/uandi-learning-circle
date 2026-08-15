import { Car } from 'lucide-react'

export default function July23S5() {
  const milestones = [
    { n: 1, color: 'bg-amber-500', textColor: 'text-amber-700', label: 'End Goal' },
    { n: 2, color: 'bg-brand-blue', textColor: 'text-slate-900', label: 'Milestone 1' },
    { n: 3, color: 'bg-brand-blue', textColor: 'text-slate-900', label: 'Milestone 2' },
    { n: 4, color: 'bg-purple-600', textColor: 'text-slate-900', label: 'Checkpoint' },
    { n: 5, color: 'bg-emerald-500', textColor: 'text-emerald-700', label: 'Goal Achieved' },
  ]

  return (
    <div className="max-w-6xl w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-slate-900 font-heading">The Night Highway Principle</h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Driving from <strong>Coimbatore to Chennai</strong> at night, headlights only show the next few hundred meters. That's enough to complete the whole journey.
        </p>
      </div>

      <div className="relative glass-card rounded-3xl p-6 overflow-hidden border border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xs text-center md:text-left">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">CURRENT LOCATION</span>
            <h3 className="text-2xl font-black text-slate-900 font-heading">Coimbatore</h3>
          </div>
          <div className="flex-1 w-full bg-slate-100 h-16 rounded-2xl relative flex items-center px-4 border border-blue-200">
            <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-amber-200 to-transparent" />
            <div className="relative z-10 flex items-center gap-2 text-amber-600">
              <Car className="w-8 h-8 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-800">Headlights: Next Milestone</span>
            </div>
          </div>
          <div className="space-y-1 max-w-xs text-center md:text-right">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">DESTINATION</span>
            <h3 className="text-2xl font-black text-slate-900 font-heading">Chennai</h3>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-emerald-400 -translate-y-1/2 z-0" />
        {milestones.map(({ n, color, textColor, label }) => (
          <div key={n} className="glass-card p-4 rounded-2xl text-center relative z-10 w-full md:w-1/5">
            <div className={`w-8 h-8 rounded-full ${color} text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs`}>
              {n}
            </div>
            <h4 className={`text-xs font-bold ${textColor}`}>{label}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}
