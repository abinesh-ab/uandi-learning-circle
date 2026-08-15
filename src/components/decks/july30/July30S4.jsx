import { useState } from 'react'

const scenes = [
  { id: 1, label: 'DAY 1', emoji: '🌱', bgClass: 'bg-emerald-50 border-emerald-300', textClass: 'text-emerald-700', title: '"A seed is planted into rich soil."', desc: 'Warm morning sunlight. A tiny watering can beside it. Peaceful beginnings.' },
  { id: 2, label: 'AFTER 1 MONTH', emoji: '🪵', bgClass: 'bg-slate-50 border-slate-300', textClass: 'text-slate-500', title: '"Still nothing."', desc: 'The ground looks exactly the same. Only tiny watering marks.' },
  { id: 3, label: 'AFTER 6 MONTHS', emoji: '💧', bgClass: 'bg-slate-50 border-slate-300', textClass: 'text-slate-500', title: '"Still nothing above ground."', desc: 'Watering continues patiently day after day.' },
  { id: 4, label: 'AFTER 1 YEAR', emoji: '🌿', bgClass: 'bg-emerald-50 border-emerald-300', textClass: 'text-emerald-700', title: '"A tiny sprout appears."', desc: 'Only a few centimeters tall. Almost disappointing after 365 days.' },
  { id: 5, label: 'AFTER 2 YEARS', emoji: '🌿', bgClass: 'bg-emerald-50 border-emerald-300', textClass: 'text-emerald-700', title: '"Growing... slowly."', desc: 'Slightly taller, but still looks insignificant.' },
  { id: 6, label: 'AFTER 3 YEARS', emoji: '🎋', bgClass: 'bg-emerald-50 border-emerald-300', textClass: 'text-emerald-700', title: '"Keep watering."', desc: 'Everything around it seems to be growing much faster.' },
  { id: 7, label: 'AFTER 4 YEARS', emoji: '❓', bgClass: 'bg-amber-50 border-amber-300', textClass: 'text-amber-700', title: '"Would you still continue?"', titleClass: 'text-2xl font-black text-amber-800', desc: 'Looks like almost nothing has changed above the surface.' },
  { id: 8, label: 'YEAR 5 — THE LEAP', emoji: '🎋✨', bgClass: 'bg-emerald-100 border-emerald-500', textClass: 'text-emerald-700', title: '"Growth was happening all along!"', titleClass: 'text-2xl font-black text-slate-900', desc: 'Within weeks, it shoots up into a massive 80-foot bamboo tower!', bounce: true },
  { id: 9, label: 'UNDERGROUND FOUNDATION REVEAL', isImage: true, desc: '"For 4 years, it wasn\'t resting. It was building an underground root network capable of supporting 80 feet of height!"' },
  { id: 10, label: 'THE LESSON', isLesson: true },
]

export default function July30S4() {
  const [scene, setScene] = useState(1)
  const maxScenes = 10

  const changeScene = (dir) => {
    const next = scene + dir
    if (next < 1 || next > maxScenes) return
    setScene(next)
  }

  const current = scenes[scene - 1]

  return (
    <div className="max-w-5xl w-full bg-white border border-emerald-200 rounded-3xl p-6 md:p-10 shadow-xl relative min-h-[520px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 text-lg">🌱</span>
          <h3 className="text-lg font-bold text-slate-900 font-heading">The Bamboo Story — Invisible Growth</h3>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Scene {scene} of {maxScenes}
        </span>
      </div>

      {/* Scene content */}
      <div className="py-6 flex-1 flex items-center justify-center">
        {current.isLesson ? (
          <div className="flex flex-col items-center text-center space-y-4 max-w-xl">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">THE 3 PHASES OF GROWTH</span>
              <div className="flex justify-center gap-6 text-xs font-bold text-slate-900 pt-1">
                <span>💤 1. SLEEP</span>
                <span>🌱 2. CREEP</span>
                <span>🚀 3. LEAP</span>
              </div>
            </div>
            <div className="space-y-2 text-slate-800 text-xs sm:text-sm leading-relaxed">
              <p>"Our kids are like bamboo. Not every lesson shows immediate results."</p>
              <p className="font-bold text-brand-blue">"Every Saturday... You are building roots."</p>
              <p className="text-slate-500 text-xs pt-2">🌱 Let's keep watering the bamboo together.</p>
            </div>
          </div>
        ) : current.isImage ? (
          <div className="flex flex-col items-center text-center space-y-4 max-w-2xl w-full">
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">{current.label}</span>
            <img src="/bamboo-roots.png" alt="Underground Roots Matrix" className="w-full h-56 object-cover rounded-2xl border border-slate-200 shadow-md" onError={(e) => { e.target.style.display = 'none' }} />
            <p className="text-xs text-slate-600 italic">{current.desc}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-4 max-w-md">
            <div className={`w-32 h-32 rounded-full ${current.bgClass} border-2 flex items-center justify-center text-4xl shadow-sm${current.bounce ? ' animate-bounce' : ''}`}>
              {current.emoji}
            </div>
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${current.textClass}`}>{current.label}</span>
            <h4 className={current.titleClass || 'text-xl font-bold text-slate-900'}>{current.title}</h4>
            <p className="text-xs text-slate-500">{current.desc}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center border-t border-slate-100 pt-4">
        <button
          onClick={() => changeScene(-1)}
          disabled={scene === 1}
          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 text-xs font-bold disabled:opacity-20"
        >
          ← Previous Scene
        </button>
        <button
          onClick={() => changeScene(1)}
          disabled={scene === maxScenes}
          className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center gap-1 shadow-md shadow-emerald-600/20 disabled:opacity-50"
        >
          {scene === maxScenes ? <><span>Finish Story</span> 🌱</> : <><span>Next Scene</span> →</>}
        </button>
      </div>
    </div>
  )
}
