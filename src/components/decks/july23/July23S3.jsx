import { getAssetUrl } from '../../../utils/assetUrl'

export default function July23S3() {
  const universes = [
    { cls: 'text-brand-blue border-blue-200', label: '🦸 Marvel' },
    { cls: 'text-amber-600 border-amber-200', label: '🌌 Avatar' },
    { cls: 'text-emerald-600 border-emerald-200', label: '⚡ Harry Potter' },
    { cls: 'text-purple-600 border-purple-200', label: '🔮 Inside Out' },
    { cls: 'text-rose-600 border-rose-200', label: '⚔️ Anime Series (Naruto, One Piece)' },
    { cls: 'text-indigo-600 border-indigo-200', label: '🚀 Interstellar' },
  ]

  return (
    <div className="max-w-5xl w-full text-center space-y-6">
      <div className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden glass-card border border-slate-200 p-2 shadow-xl">
        <img
          src={getAssetUrl('FN-Tuitions.jpeg')}
          alt="Learning Circle Community Photo"
          className="w-full h-64 md:h-80 object-cover object-center rounded-2xl shadow-inner"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-heading">
          We are building an <span className="text-brand-blue">Identity</span>
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          "We are building more than a Learning Circle. We're building a universe where every volunteer takes on a character name and identity for the year."
        </p>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Universe Inspirations</span>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {universes.map(({ cls, label }) => (
            <span key={label} className={`px-3.5 py-1.5 rounded-full glass-card text-xs font-semibold ${cls}`}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
