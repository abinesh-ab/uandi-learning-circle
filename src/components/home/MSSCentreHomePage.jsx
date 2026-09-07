import { useState } from 'react'
import { useLC } from '../../context/LCContext'
import { getAssetUrl } from '../../utils/assetUrl'
import CreateLCModal from './CreateLCModal'

const PROGRAMMES = [
  {
    id: 'numeracy',
    name: 'Foundational Numeracy & Tuitions + LIFT',
    emoji: '📐',
    desc: 'Building strong maths foundations from primary arithmetic through 9th–12th standard board exams.',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-brand-blue/10 text-brand-blue',
  },
  {
    id: 'literacy',
    name: 'Foundational Literacy',
    emoji: '📖',
    desc: 'Developing reading fluency, comprehension, and early literacy skills for government school students.',
    color: 'emerald',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
  },
]

const STAT_STRIP = [
  { emoji: '🏫', value: '8', label: 'Learning Circles', sub: 'Active squads every weekend' },
  { emoji: '👩‍🎓', value: '50+', label: 'Students', sub: 'Children engaged across all LCs' },
  { emoji: '🙌', value: '70+', label: 'Volunteers', sub: 'Dedicated weekly changemakers' },
  { emoji: '📘', value: '2', label: 'Core Programmes', sub: 'Literacy & Numeracy / Tuitions' },
]

// Default colour palette for LC gateway cards (static LCs get their own, dynamic get palette)
const DEFAULT_CARD_STYLE = { border: 'border-slate-200', bg: 'bg-slate-50 hover:bg-slate-100', badge: 'bg-slate-700 text-white', ring: 'ring-slate-300' }

const STATIC_CARD_STYLES = {
  'the-x-factors': { border: 'border-blue-300', bg: 'bg-blue-50 hover:bg-blue-100', badge: 'bg-brand-blue text-white', ring: 'ring-blue-300' },
  majaraam: { border: 'border-amber-300', bg: 'bg-amber-50 hover:bg-amber-100', badge: 'bg-amber-500 text-white', ring: 'ring-amber-300' },
  kanakkukaanumkovai: { border: 'border-emerald-300', bg: 'bg-emerald-50 hover:bg-emerald-100', badge: 'bg-emerald-600 text-white', ring: 'ring-emerald-300' },
}

const DYNAMIC_CARD_COLORS = [
  { border: 'border-violet-300', bg: 'bg-violet-50 hover:bg-violet-100', badge: 'bg-violet-600 text-white', ring: 'ring-violet-300' },
  { border: 'border-rose-300', bg: 'bg-rose-50 hover:bg-rose-100', badge: 'bg-rose-500 text-white', ring: 'ring-rose-300' },
  { border: 'border-cyan-300', bg: 'bg-cyan-50 hover:bg-cyan-100', badge: 'bg-cyan-600 text-white', ring: 'ring-cyan-300' },
  { border: 'border-orange-300', bg: 'bg-orange-50 hover:bg-orange-100', badge: 'bg-orange-500 text-white', ring: 'ring-orange-300' },
  { border: 'border-indigo-300', bg: 'bg-indigo-50 hover:bg-indigo-100', badge: 'bg-indigo-600 text-white', ring: 'ring-indigo-300' },
]

export default function MSSCentreHomePage({ showMode }) {
  const { activeLc, setActiveLc, activeLcMeta, allLcConfig, allLcSlugs, dynamicRows } = useLC()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState(null)

  const handleEnterLC = (slug) => {
    setActiveLc(slug)
    showMode('home')
  }

  const getCardStyle = (slug, dynamicIndex) => {
    if (STATIC_CARD_STYLES[slug]) return STATIC_CARD_STYLES[slug]
    return DYNAMIC_CARD_COLORS[dynamicIndex % DYNAMIC_CARD_COLORS.length] || DEFAULT_CARD_STYLE
  }

  let dynamicCardIndex = 0

  return (
    <div className="h-full overflow-y-auto bg-slate-50">

      {/* ── Hero Photo ──────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 pt-6">
        <div className="relative w-full rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl">
          <img
            src={getAssetUrl('mss-centre-hero.jpg')}
            alt="MSS Centre Team"
            className="w-full h-[280px] sm:h-[380px] md:h-[460px] object-cover object-[center_35%]"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      </div>

      {/* ── Centre Identity (below photo) ──────────────────────── */}
      <div className="text-center px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-widest mb-3">
          🏛️ MSS Centre • Coimbatore
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading leading-tight mb-3">
          Where Every{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-amber-500">
            Weekend
          </span>{' '}
          Changes a Life
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Volunteers, educators, and changemakers uniting across 8 Learning Circles every Saturday and Sunday — building brighter futures one child at a time.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">

        {/* ── Impact Metric Strip ─────────────────────────────── */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STAT_STRIP.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1.5 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm text-center"
              >
                <div className="text-3xl">{stat.emoji}</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-none">
                  {stat.value}
                </div>
                <div className="text-xs font-black text-slate-700">{stat.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Programme Highlights ─────────────────────────────── */}
        <section>
          <div className="text-center mb-5">
            <h2 className="text-xl font-black text-slate-900 font-heading">Our Core Programmes</h2>
            <p className="text-slate-500 text-sm mt-1">Two pathways. One shared mission of impact.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROGRAMMES.map((prog) => (
              <div
                key={prog.id}
                className={`flex flex-col gap-3 p-5 rounded-3xl border-2 ${prog.bg} ${prog.border} shadow-sm`}
              >
                <div className="text-3xl">{prog.emoji}</div>
                <div>
                  <div className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 ${prog.badge}`}>
                    Programme
                  </div>
                  <h3 className="font-black text-slate-900 text-sm font-heading leading-tight">{prog.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{prog.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Explore Learning Circles Gateway ─────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-heading">Explore Our Learning Circles</h2>
              <p className="text-slate-500 text-sm mt-0.5">Enter a squad to access their Missions, Resources, and Gratitude Vault</p>
            </div>
            {/* Hidden admin trigger — no visible label or hint */}
            <button
              onClick={() => { setEditingSlug(null); setIsCreateModalOpen(true) }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm transition-colors shrink-0"
              aria-hidden="true"
              tabIndex={-1}
            >
              +
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allLcSlugs.map((slug) => {
              const lc = allLcConfig[slug]
              if (!lc) return null
              const isStatic = !!STATIC_CARD_STYLES[slug]
              const cardStyle = isStatic ? getCardStyle(slug, 0) : getCardStyle(slug, dynamicCardIndex++)
              const isActive = activeLc === slug
              const isDynamic = lc.isDynamic

              return (
                <button
                  key={slug}
                  onClick={() => handleEnterLC(slug)}
                  className={`relative group flex flex-col items-start gap-3 p-5 rounded-3xl border-2 transition-all duration-200 text-left shadow-md hover:shadow-xl hover:-translate-y-1 ${cardStyle.bg} ${cardStyle.border} ${isActive ? `ring-2 ${cardStyle.ring}` : ''}`}
                >
                  {isActive && (
                    <div className={`absolute top-3 right-3 text-[9px] font-black px-2 py-0.5 rounded-full ${cardStyle.badge}`}>
                      ACTIVE
                    </div>
                  )}
                  {isDynamic && !isActive && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingSlug(slug); setIsCreateModalOpen(true) }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/60 hover:bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs border border-slate-200 transition-colors"
                      title="Edit"
                    >
                      ✎
                    </button>
                  )}
                  <div className="text-3xl">{lc.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-sm font-heading leading-tight">{lc.displayName}</h3>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed line-clamp-2">{lc.tagline}</p>
                    {lc.programme && (
                      <div className={`inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${cardStyle.badge}`}>
                        {lc.programme.length > 30 ? lc.programme.slice(0, 30) + '…' : lc.programme}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs font-black px-3 py-1.5 rounded-full self-end ${cardStyle.badge}`}>
                    {isActive ? '✓ Active' : 'Enter →'}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

      </div>

      {/* ── Create / Edit LC Modal ─────────────────────────────── */}
      <CreateLCModal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setEditingSlug(null) }}
        editSlug={editingSlug}
      />
    </div>
  )
}
