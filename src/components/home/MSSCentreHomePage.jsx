import { useLC } from '../../context/LCContext'
import { lcConfig, ALL_LC_SLUGS } from '../../data/lcConfig'
import { getAssetUrl } from '../../utils/assetUrl'

// Colour maps for LC cards
const cardStyles = {
  'the-x-factors': {
    border: 'border-blue-300',
    bg: 'bg-blue-50 hover:bg-blue-100',
    badge: 'bg-brand-blue text-white',
    glow: 'shadow-blue-200',
    ring: 'ring-blue-300',
  },
  majaraam: {
    border: 'border-amber-300',
    bg: 'bg-amber-50 hover:bg-amber-100',
    badge: 'bg-amber-500 text-white',
    glow: 'shadow-amber-200',
    ring: 'ring-amber-300',
  },
  kanakkukaanumkovai: {
    border: 'border-emerald-300',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    badge: 'bg-emerald-600 text-white',
    glow: 'shadow-emerald-200',
    ring: 'ring-emerald-300',
  },
}

const visionPillars = [
  { emoji: '🌱', title: 'Grow Together', desc: 'Three Learning Circles. One shared mission — transforming young lives every Saturday.' },
  { emoji: '🎯', title: 'Student First', desc: 'Every activity, resource, and mission is designed around the child at the centre.' },
  { emoji: '🤝', title: 'Volunteer Driven', desc: 'Powered by passionate changemakers who show up with heart, week after week.' },
  { emoji: '📐', title: 'Deep Learning', desc: 'Numeracy, Accountancy, and Maths — built from foundations to exam-readiness.' },
]

export default function MSSCentreHomePage({ showMode }) {
  const { activeLc, setActiveLc, activeLcMeta } = useLC()

  const handleEnterLC = (slug) => {
    setActiveLc(slug)
    showMode('home') // keep on home, but LC context will now show X Factors home if xf
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '280px' }}>
        <img
          src={getAssetUrl('mss-centre-hero.jpg')}
          alt="MSS Centre"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { e.target.style.display = 'none' }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950/80" />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            🏛️ MSS Centre
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading leading-tight mb-2">
            MSS Centre
            <span className="text-amber-400"> • </span>
            Learning Circle Hub
          </h1>
          <p className="text-white/75 text-sm max-w-md">
            Three Learning Circles. Hundreds of students. One relentless squad of changemakers.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

        {/* ── Squad Gateway ─────────────────────────────── */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-slate-900 font-heading">Choose Your Learning Circle</h2>
            <p className="text-slate-500 text-sm mt-1">Enter a squad to access their Missions, Resources, and Gratitude Vault</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ALL_LC_SLUGS.map((slug) => {
              const lc = lcConfig[slug]
              const style = cardStyles[slug]
              const isActive = activeLc === slug

              return (
                <button
                  key={slug}
                  onClick={() => handleEnterLC(slug)}
                  className={`relative group flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-200 text-left shadow-md hover:shadow-xl hover:-translate-y-1 ${style.bg} ${style.border} ${isActive ? `ring-2 ${style.ring}` : ''}`}
                >
                  {isActive && (
                    <div className={`absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-full ${style.badge}`}>
                      ACTIVE
                    </div>
                  )}
                  <div className="text-4xl">{lc.emoji}</div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base font-heading leading-tight">{lc.displayName}</h3>
                    <p className="text-slate-500 text-xs mt-1">{lc.tagline}</p>
                  </div>
                  <div className={`mt-1 text-xs font-bold px-3 py-1 rounded-full ${style.badge}`}>
                    {isActive ? '✓ Currently Active' : 'Enter →'}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Vision Pillars ────────────────────────────── */}
        <section>
          <h2 className="text-lg font-black text-slate-900 font-heading mb-4 text-center">Our Shared Centre Vision</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {visionPillars.map((p) => (
              <div
                key={p.title}
                className="flex flex-col gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="text-2xl">{p.emoji}</div>
                <div>
                  <div className="font-black text-slate-900 text-sm font-heading">{p.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Active LC indicator ───────────────────────── */}
        <section className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm max-w-sm w-full text-center">
            <div className="text-3xl">{activeLcMeta.emoji}</div>
            <div className="font-black text-slate-900 font-heading text-base">
              Currently Viewing: {activeLcMeta.displayName}
            </div>
            <p className="text-slate-500 text-xs">
              Use the nav tabs above to access Resources, Gratitude Vault, and Squad Missions for this circle.
            </p>
            {activeLc !== 'the-x-factors' && (
              <div className="mt-1 text-xs text-slate-400 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100">
                💡 LC Call Decks &amp; Home page are exclusive to <strong>The X Factors</strong>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
