import { useState, useEffect } from 'react'
import { useLC } from '../../context/LCContext'
import { getAssetUrl } from '../../utils/assetUrl'
import CreateLCModal from './CreateLCModal'

// ── Configurable Image List ─────────────────────────────────────
// Add additional centre photos to this array anytime: { url: '...', alt: '...' }
export const CENTRE_HERO_PHOTOS = [
  {
    url: 'mss-centre-hero.jpg',
    alt: 'MSS Centre Team & Students',
  },
]

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

// ── Hero Slideshow Component ─────────────────────────────────────
function HeroSlideshow({ slides = CENTRE_HERO_PHOTOS }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const hasMultiple = Array.isArray(slides) && slides.length > 1

  // Auto-play slideshow: transitions every 4.5s when multiple photos exist and not hovered/touched
  useEffect(() => {
    if (!hasMultiple || isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [hasMultiple, isPaused, slides.length])

  // Boundary safety if slides change dynamically
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0)
    }
  }, [slides.length, currentIndex])

  return (
   // AFTER:
   <div
      className="relative w-full h-[62vh] sm:h-[66vh] md:h-[70vh] max-h-[75vh] bg-slate-900 overflow-hidden select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Slides with smooth cross-fade */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex
        return (
          <div
            key={slide.url + index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={getAssetUrl(slide.url)}
              alt={slide.alt || 'MSS Centre Photo'}
              className="w-full h-full object-cover object-[center_48%]"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        )
      })}

      {/* Discreet Indicator Dots (only rendered when >1 photo exists) */}
      {hasMultiple && (
        <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center items-center gap-1.5 pointer-events-auto">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-6 h-1.5 bg-white shadow-md'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/90'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Previous / Next Arrow Controls (visible on hover if >1 photo exists) */}
      {hasMultiple && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center text-lg backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center text-lg backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}

// ── Main Page Component ──────────────────────────────────────────
export default function MSSCentreHomePage({ showMode, heroSlides = CENTRE_HERO_PHOTOS }) {
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
    <div className="w-full min-h-full bg-white">

      {/* ── Auto-Playing Hero Slideshow (Zero dead spacing, no heavy blur wash) ── */}
      <HeroSlideshow slides={heroSlides} />

      {/* ── Clean Content Section Directly Below Image ──────────── */}
      <div className="max-w-5xl mx-auto px-4 pt-4 sm:pt-5 pb-10">

        {/* Centre badge + headline + subtitle */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-blue/10 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-widest mb-1.5">
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

        {/* ── Compact Impact Stat Strip (Fits above the fold) ───── */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {STAT_STRIP.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-0.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs text-center hover:bg-white hover:shadow-sm transition-all"
            >
              <div className="text-xl">{stat.emoji}</div>
              <div className="text-xl font-black text-slate-900 font-heading leading-none">{stat.value}</div>
              <div className="text-[9px] font-bold text-slate-600 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Learning Circles Gateway ──────────────────────────── */}
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
                  className={`relative group flex flex-col items-start gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 ${cardStyle.bg} ${cardStyle.border} ${isActive ? `ring-2 ${cardStyle.ring}` : ''}`}
                >
                  {isActive ? (
                    <div className={`absolute top-2.5 right-2.5 text-[9px] font-black px-2 py-0.5 rounded-full ${cardStyle.badge}`}>
                      ACTIVE
                    </div>
                  ) : (
                    /* ✎ edit pencil — visible on hover for all LCs */
                    <button
                      onClick={(e) => openEdit(e, slug)}
                      className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs border border-slate-200 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-xs"
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
