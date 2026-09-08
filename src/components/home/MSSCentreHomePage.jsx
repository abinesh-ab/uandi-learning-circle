import { useState } from 'react'
import { useLC } from '../../context/LCContext'
import { getAssetUrl } from '../../utils/assetUrl'
import CreateLCModal from './CreateLCModal'

const STAT_STRIP = [
  { emoji: '🏫', value: '8', label: 'Learning Circles', sub: 'Active squads every weekend' },
  { emoji: '👩‍🎓', value: '50+', label: 'Students', sub: 'Children across all squads' },
  { emoji: '🙌', value: '70+', label: 'Volunteers', sub: 'Weekly changemakers' },
  { emoji: '📘', value: '2', label: 'Programmes', sub: 'Literacy & Numeracy' },
]

const STATIC_CARD_STYLES = {
  'the-x-factors':    { border: 'border-blue-300',    bg: 'bg-blue-50 hover:bg-blue-100',       badge: 'bg-brand-blue text-white',  ring: 'ring-blue-300'    },
  majaraam:           { border: 'border-amber-300',   bg: 'bg-amber-50 hover:bg-amber-100',     badge: 'bg-amber-500 text-white',   ring: 'ring-amber-300'   },
  kanakkukaanumkovai: { border: 'border-emerald-300', bg: 'bg-emerald-50 hover:bg-emerald-100', badge: 'bg-emerald-600 text-white', ring: 'ring-emerald-300' },
}

const DYNAMIC_CARD_COLORS = [
  { border: 'border-violet-300', bg: 'bg-violet-50 hover:bg-violet-100', badge: 'bg-violet-600 text-white', ring: 'ring-violet-300' },
  { border: 'border-rose-300',   bg: 'bg-rose-50 hover:bg-rose-100',     badge: 'bg-rose-500 text-white',   ring: 'ring-rose-300'   },
  { border: 'border-cyan-300',   bg: 'bg-cyan-50 hover:bg-cyan-100',     badge: 'bg-cyan-600 text-white',   ring: 'ring-cyan-300'   },
  { border: 'border-orange-300', bg: 'bg-orange-50 hover:bg-orange-100', badge: 'bg-orange-500 text-white', ring: 'ring-orange-300' },
  { border: 'border-indigo-300', bg: 'bg-indigo-50 hover:bg-indigo-100', badge: 'bg-indigo-600 text-white', ring: 'ring-indigo-300' },
]

export default function MSSCentreHomePage({ showMode }) {
  const { activeLc, setActiveLc, allLcConfig, allLcSlugs } = useLC()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState(null)

  let dynamicCardIndex = 0

  const getCardStyle = (slug) => {
    if (STATIC_CARD_STYLES[slug]) return STATIC_CARD_STYLES[slug]
    return DYNAMIC_CARD_COLORS[dynamicCardIndex++ % DYNAMIC_CARD_COLORS.length]
  }

  const handleEnterLC = (slug) => {
    setActiveLc(slug)
    showMode('home')
  }

  const openEdit = (e, slug) => {
    e.stopPropagation()
    setEditingSlug(slug)
    setIsCreateModalOpen(true)
  }

  return (
    <div className="h-full overflow-y-auto bg-white">

      {/* ── Full-bleed hero photo ─────────────────────────────────
          No card. No border. No padding. Photo fills the frame.
      ───────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[52vh] md:h-[60vh] overflow-hidden">
        <img
          src={getAssetUrl('mss-centre-hero.jpg')}
          alt="MSS Centre Team"
          className="w-full h-full object-cover object-top"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {/* Top gradient — helps navbar text remain readable */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
        {/* Bottom fade — dissolves into the white content below */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-10">

        {/* Centre badge + headline + subtitle */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-blue/10 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-widest mb-2">
            🏛️ MSS Centre • Coimbatore
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-heading leading-tight mb-1">
            Where Every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-amber-500">
              Weekend
            </span>{' '}
            Changes a Life
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Volunteers and educators across 8 squads — teaching, mentoring, and building brighter futures every Saturday and Sunday.
          </p>
        </div>

        {/* ── Compact impact stat strip ─────────────────────────── */}
        <div className="grid grid-cols-4 gap-2 mb-7">
          {STAT_STRIP.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-0.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm text-center"
            >
              <div className="text-xl">{stat.emoji}</div>
              <div className="text-xl font-black text-slate-900 font-heading leading-none">{stat.value}</div>
              <div className="text-[9px] font-bold text-slate-600 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Learning Circles gateway ──────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-heading">Learning Circles</h2>
              <p className="text-slate-400 text-xs mt-0.5">Enter a squad to access their hub</p>
            </div>
            {/* Hidden admin trigger — no visible label or hint */}
            <button
              onClick={() => { setEditingSlug(null); setIsCreateModalOpen(true) }}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm transition-colors shrink-0"
              aria-hidden="true"
              tabIndex={-1}
            >
              +
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allLcSlugs.map((slug) => {
              const lc = allLcConfig[slug]
              if (!lc) return null
              const cardStyle = getCardStyle(slug)
              const isActive = activeLc === slug

              return (
                <button
                  key={slug}
                  onClick={() => handleEnterLC(slug)}
                  className={`relative group flex flex-col items-start gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 text-left shadow-sm hover:shadow-lg hover:-translate-y-0.5 ${cardStyle.bg} ${cardStyle.border} ${isActive ? `ring-2 ${cardStyle.ring}` : ''}`}
                >
                  {isActive ? (
                    <div className={`absolute top-2.5 right-2.5 text-[9px] font-black px-2 py-0.5 rounded-full ${cardStyle.badge}`}>
                      ACTIVE
                    </div>
                  ) : (
                    /* ✎ edit pencil — visible on hover for all LCs */
                    <button
                      onClick={(e) => openEdit(e, slug)}
                      className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs border border-slate-200 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
                      aria-label={`Edit ${lc.displayName}`}
                      title="Edit"
                    >
                      ✎
                    </button>
                  )}

                  <div className="text-2xl">{lc.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-sm font-heading leading-tight">{lc.displayName}</h3>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed line-clamp-2">{lc.tagline}</p>
                  </div>
                  <div className={`text-[10px] font-black px-2.5 py-1 rounded-full self-start ${cardStyle.badge}`}>
                    {isActive ? '✓ Active' : 'Enter →'}
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      </div>

      {/* Create / Edit LC Modal */}
      <CreateLCModal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setEditingSlug(null) }}
        editSlug={editingSlug}
      />
    </div>
  )
}
