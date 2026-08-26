import { Users, LayoutGrid, Cpu, HelpCircle } from 'lucide-react'

const constraints = [
  { icon: <LayoutGrid className="w-5 h-5" />, bg: 'bg-blue-100 text-brand-blue', label: 'Seating Capacity', value: '12 Tables', sub: 'Fixed physical space — cannot expand' },
  { icon: <Users className="w-5 h-5" />, bg: 'bg-amber-100 text-amber-700', label: 'Team Size', value: '3 Workers', sub: 'Small team — bandwidth is precious' },
  { icon: <Cpu className="w-5 h-5" />, bg: 'bg-emerald-100 text-emerald-700', label: 'Equipment', value: '1 Vending Machine', sub: 'Self-serve — limited prep capacity' },
]

export default function Aug27S2() {
  return (
    <div className="max-w-4xl w-full space-y-7 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-400 text-xs font-black uppercase tracking-widest shadow-sm">
          ☕ Strategy Simulation
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-heading">
          The Campus Cafe Challenge
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          A small cafe sits inside a busy college campus and wants to significantly grow its revenue.(Monthly revenue: ₹1,80,000 | Monthly operating costs: ₹1,50,000 (Very thin profit margin).)
          You are the strategy team. Study the constraints — then decide what to prioritise.
        </p>
      </div>

      {/* Constraint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {constraints.map(({ icon, bg, label, value, sub }) => (
          <div
            key={label}
            className="glass-card bg-white rounded-3xl border border-slate-200 p-5 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center shadow-sm`}>
              {icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
              <p className="text-xl font-black text-slate-900 font-heading">{value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* The Core Question */}
      <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8 text-center space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5" /> The Core Question
        </div>
        <p className="text-base sm:text-lg font-black text-slate-900 font-heading leading-snug max-w-2xl mx-auto">
          With{' '}
          <span className="text-rose-600">strictly limited space</span>,{' '}
          <span className="text-rose-600">a team of 3</span>, and{' '}
          <span className="text-emerald-600">high potential footfall from students</span>{' '}
          — how should the cafe prioritise its ideas to grow revenue without burning out the team or wasting money?
        </p>
        <p className="text-xs text-slate-500 font-medium">
          Head to the next slide → place each idea into the Strategy Matrix 🎯
        </p>
      </div>
    </div>
  )
}
