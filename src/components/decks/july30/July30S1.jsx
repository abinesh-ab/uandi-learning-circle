import { Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { getAssetUrl } from '../../../utils/assetUrl'

const heroCategories = [
  { emoji: '🏆', title: 'Proud Moment', desc: 'A personal or kid victory this week.', border: 'border-l-amber-500' },
  { emoji: '🤝', title: 'Helped Someone', desc: 'Supported a volunteer or student.', border: 'border-l-blue-500' },
  { emoji: '💡', title: 'Solved a Problem', desc: 'Overcame a tough learning hurdle.', border: 'border-l-emerald-500' },
  { emoji: '❤️', title: 'Encouraged a Friend', desc: 'Lifted squad energy during class.', border: 'border-l-rose-500' },
]

export default function July30S1() {
  const triggerConfetti = () => confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#2563EB', '#F59E0B', '#E11D48', '#10B981'] })

  return (
    <div className="max-w-5xl w-full text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider shadow-sm">
        <Sparkles className="w-4 h-4 text-amber-500" /> Good Things • Share Your Hero Moment
      </div>

      <h2 className="text-4xl md:text-5xl font-black text-slate-900">
        Weekly <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-blue-600">HERO MOMENT</span> 🎬
      </h2>

      {/* Image card */}
      <div className="max-w-xs md:max-w-sm mx-auto relative rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl glass-card p-2 group">
        <div className="w-full h-72 md:h-80 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
          <img
            src={getAssetUrl('cover1.jpg')}
            alt="Hero Moment"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-500"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
        <div className="absolute inset-x-2 bottom-2 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent text-white rounded-b-2xl">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">U&I CELEBRATION</span>
          <h3 className="text-xl md:text-2xl font-black tracking-wider uppercase">HERO MOMENT</h3>
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto pt-2">
        {heroCategories.map(({ emoji, title, desc, border }) => (
          <div key={title} className={`glass-card-interactive p-4 rounded-2xl border-l-4 ${border}`}>
            <span className="text-xl block mb-1">{emoji}</span>
            <h4 className="text-xs font-bold text-slate-900">{title}</h4>
            <p className="text-[11px] text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={triggerConfetti}
        className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-full shadow-lg shadow-amber-500/20 hover:scale-105 transition-all inline-flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" /> Trigger Hero Celebration Confetti
      </button>
    </div>
  )
}
