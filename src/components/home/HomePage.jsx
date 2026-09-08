import { useState, useMemo } from 'react'
import { Sparkles, ArrowRight, BookOpen, Layers, Target, Users, Heart, Award, Compass, Shield, Zap, Smile } from 'lucide-react'
import { teamMembers } from '../../data/teamData'
import { resourcesData } from '../../data/resourcesData'
import { getAssetUrl } from '../../utils/assetUrl'

// ── Shared Core Values Data ────────────────────
const constellationValues = [
  {
    name: 'CHANGEMAKERS',
    category: 'HOW WE CREATE IMPACT',
    emoji: '👑',
    desc: 'Transforming futures and building real community impact one class at a time.',
    size: 'hero',
    color: 'bg-amber-100/90 text-amber-950 border-amber-300 hover:bg-amber-200',
    rotation: 'rotate-0',
  },
  {
    name: 'UNSTOPPABLE',
    category: 'HOW WE SHOW UP',
    emoji: '⚡',
    desc: 'Overcoming every obstacle and showing up with relentless energy every Saturday.',
    size: 'hero',
    color: 'bg-rose-100/90 text-rose-950 border-rose-300 hover:bg-rose-200',
    rotation: '-rotate-2',
  },
  {
    name: 'OPEN HEART',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '❤️',
    desc: 'Empathy, warmth, and genuine care for every child and team member.',
    size: 'hero',
    color: 'bg-pink-100/90 text-pink-950 border-pink-300 hover:bg-pink-200',
    rotation: 'rotate-1',
  },
  {
    name: 'DETERMINED',
    category: 'HOW WE SHOW UP',
    emoji: '🎯',
    desc: 'Resilient and unwavering focus on creating academic breakthroughs for kids.',
    size: 'hero',
    color: 'bg-blue-100/90 text-blue-950 border-blue-300 hover:bg-blue-200',
    rotation: 'rotate-2',
  },
  {
    name: 'Trust Circle',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '🛡️',
    desc: 'A safe, supportive space where everyone can speak openly and lean on each other.',
    size: 'medium',
    color: 'bg-emerald-100/90 text-emerald-950 border-emerald-300 hover:bg-emerald-200',
    rotation: '-rotate-1',
  },
  {
    name: 'Peer Learning',
    category: 'HOW WE LEARN',
    emoji: '🧠',
    desc: 'Constantly exchanging teaching techniques, ideas, and growing together.',
    size: 'medium',
    color: 'bg-violet-100/90 text-violet-950 border-violet-300 hover:bg-violet-200',
    rotation: 'rotate-2',
  },
  {
    name: 'Cross Functional',
    category: 'HOW WE LEARN',
    emoji: '🔄',
    desc: 'Integrating Maths, Accountancy, Pedagogy, and creative activities seamlessly.',
    size: 'medium',
    color: 'bg-cyan-100/90 text-cyan-950 border-cyan-300 hover:bg-cyan-200',
    rotation: '-rotate-2',
  },
  {
    name: 'Individual Excellence',
    category: 'HOW WE LEARN',
    emoji: '⭐',
    desc: 'Every volunteer bringing their authentic best and continuous self-improvement.',
    size: 'medium',
    color: 'bg-yellow-100/90 text-yellow-950 border-yellow-300 hover:bg-yellow-200',
    rotation: 'rotate-1',
  },
  {
    name: 'Supportive',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '🤝',
    desc: 'Lifting each other up during tough classes and celebrating small wins together.',
    size: 'medium',
    color: 'bg-orange-100/90 text-orange-950 border-orange-300 hover:bg-orange-200',
    rotation: 'rotate-0',
  },
  {
    name: 'Friendly',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '🤗',
    desc: 'Approaching children as a warm mentor, positive role model, and lifelong friend.',
    size: 'regular',
    color: 'bg-teal-100/90 text-teal-950 border-teal-300 hover:bg-teal-200',
    rotation: '-rotate-1',
  },
  {
    name: 'United',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '🔗',
    desc: 'One tribe, one heart, and one shared mission to transform children’s futures.',
    size: 'regular',
    color: 'bg-purple-100/90 text-purple-950 border-purple-300 hover:bg-purple-200',
    rotation: 'rotate-2',
  },
  {
    name: 'Punctual',
    category: 'HOW WE SHOW UP',
    emoji: '⏰',
    desc: 'Respecting and valuing every precious Saturday minute we get with our kids.',
    size: 'regular',
    color: 'bg-sky-100/90 text-sky-950 border-sky-300 hover:bg-sky-200',
    rotation: '-rotate-2',
  },
  {
    name: 'Practical',
    category: 'HOW WE SHOW UP',
    emoji: '📐',
    desc: 'Hands-on, activity-based learning that makes abstract concepts tangible.',
    size: 'regular',
    color: 'bg-green-100/90 text-green-950 border-green-300 hover:bg-green-200',
    rotation: 'rotate-1',
  },
  {
    name: 'Dedicated',
    category: 'HOW WE CREATE IMPACT',
    emoji: '🔥',
    desc: 'Deep dedication to our kids academic growth and emotional well-being.',
    size: 'regular',
    color: 'bg-red-100/90 text-red-950 border-red-300 hover:bg-red-200',
    rotation: '-rotate-1',
  },
  {
    name: 'Credible',
    category: 'HOW WE CREATE IMPACT',
    emoji: '📜',
    desc: 'Deep preparation, subject mastery, and solid pedagogical foundations.',
    size: 'regular',
    color: 'bg-slate-200 text-slate-900 border-slate-300 hover:bg-slate-300',
    rotation: 'rotate-1',
  },
  {
    name: 'Competitive',
    category: 'HOW WE CREATE IMPACT',
    emoji: '🏆',
    desc: 'Striving for excellence and high standards without compromising warmth.',
    size: 'regular',
    color: 'bg-amber-100/90 text-amber-900 border-amber-300 hover:bg-amber-200',
    rotation: '-rotate-1',
  },
]

export default function HomePage({ showMode }) {
  const [activeTeamMember, setActiveTeamMember] = useState(null)
  const [activeConstellationCategory, setActiveConstellationCategory] = useState('ALL')
  const [hoveredValue, setHoveredValue] = useState(constellationValues[0])

  const scrollToTeam = () => {
    const el = document.getElementById('team-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const categoryFilters = [
    { id: 'ALL', label: 'All Values', emoji: '✨' },
    { id: 'HOW WE SHOW UP', label: 'How We Show Up', emoji: '⚡' },
    { id: 'HOW WE TREAT EACH OTHER', label: 'How We Treat Each Other', emoji: '❤️' },
    { id: 'HOW WE LEARN', label: 'How We Learn', emoji: '🧠' },
    { id: 'HOW WE CREATE IMPACT', label: 'How We Create Impact', emoji: '🚀' },
  ]

  const filteredConstellationValues = useMemo(() => {
    if (activeConstellationCategory === 'ALL') return constellationValues
    return constellationValues.filter((v) => v.category === activeConstellationCategory)
  }, [activeConstellationCategory])

  return (
    <div className="relative pt-16 pb-16 space-y-12 animate-fade-in">
      {/* ────────────────────────────────────────────────────────
          1. HERO BANNER
         ──────────────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="p-8 sm:p-14 rounded-[2.5rem] border border-slate-700/50 text-white text-center shadow-2xl relative overflow-hidden flex flex-col items-center justify-start min-h-[400px] sm:min-h-[460px]"
          style={{
            backgroundImage: `url(${getAssetUrl('hero-home.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
          }}
        >
          {/* Soft top-to-bottom vignette gradient so top text is crystal clear while team photo below is 100% bright & visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-slate-950/80 pointer-events-none rounded-[2.5rem]" />

          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Math Doodles & Emojis */}
          <div className="absolute top-6 left-8 text-3xl opacity-70 pointer-events-none select-none">
            📚
          </div>
          <div className="absolute top-16 left-12 text-2xl font-serif text-slate-200/50 pointer-events-none select-none font-bold">
            √x
          </div>
          <div className="absolute top-36 left-16 text-xl font-mono text-slate-200/40 pointer-events-none select-none">
            %
          </div>
          <div className="absolute top-10 left-1/4 text-3xl opacity-50 pointer-events-none select-none">
            💡
          </div>
          <div className="absolute top-8 left-1/3 text-xl text-slate-200/40 pointer-events-none select-none">
            ☆
          </div>
          <div className="absolute top-12 left-1/2 text-base text-slate-200/40 pointer-events-none select-none">
            ◯
          </div>
          <div className="absolute top-10 right-1/4 text-3xl opacity-50 pointer-events-none select-none">
            📖
          </div>
          <div className="absolute top-14 right-1/3 text-xl text-slate-200/40 pointer-events-none select-none">
            ☆
          </div>
          <div className="absolute top-16 right-12 text-2xl font-serif text-slate-200/50 pointer-events-none select-none font-bold">
            x²
          </div>
          <div className="absolute top-36 right-16 text-lg font-serif text-slate-200/40 pointer-events-none select-none">
            Σ = n(n+1)/2
          </div>
          <div className="absolute bottom-16 right-10 text-2xl opacity-80 pointer-events-none select-none">
            ⭐
          </div>
          <div className="absolute bottom-16 left-10 text-xl opacity-70 pointer-events-none select-none">
            🌱
          </div>

          {/* Clean Top Title & Subtitle Block */}
          <div className="relative z-10 max-w-3xl w-full space-y-4 pt-2 animate-fade-in flex flex-col items-center">
            {/* Title Header */}
            <div className="space-y-1 text-center">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] uppercase">
                THE X FACTORS
              </h1>
              <p className="text-amber-400 font-extrabold uppercase tracking-widest text-xs sm:text-sm md:text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                UNLOCK THE UNKNOWN
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-100 font-semibold max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              Different minds. One mission. Bigger possibilities.
            </p>

            {/* Side-by-Side Pill Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
             
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/65 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold shadow-md">
                ❤️ A U&amp;I LEARNING CIRCLE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          2. QUICK ACCESS CARDS
         ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            onClick={() => showMode('decks')}
            className="glass-card-interactive p-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/80 to-white cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
              📚
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">LC Call Decks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Revisit our conversations, plans, social contract, and decisions.
            </p>
            <div className="pt-2 text-xs font-black text-brand-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Decks</span> →
            </div>
          </div>

          <div
            onClick={() => showMode('gratitude')}
            className="glass-card-interactive p-6 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/80 to-white cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-rose-500/25 group-hover:scale-110 transition-transform">
              💖
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Gratitude Vault</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peer-affirmation kudos wall. Leave warm notes &amp; appreciations for teammates.
            </p>
            <div className="pt-2 text-xs font-black text-rose-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Gratitude Vault</span> →
            </div>
          </div>

          <div
            onClick={() => showMode('missions')}
            className="glass-card-interactive p-6 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-600/25 group-hover:scale-110 transition-transform">
              📋
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Squad Missions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Row-based volunteer action tracker. Single-click task completion &amp; broadcast tasks.
            </p>
            <div className="pt-2 text-xs font-black text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Squad Missions</span> →
            </div>
          </div>

          <div
            onClick={() => showMode('activities')}
            className="glass-card-interactive p-6 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50/80 to-white cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-violet-600/25 group-hover:scale-110 transition-transform">
              🎯
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Activities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learn, play, think and grow together. Spin &amp; Jam topic spinner.
            </p>
            <div className="pt-2 text-xs font-black text-violet-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Activities</span> →
            </div>
          </div>

          <div
            onClick={() => showMode('resources')}
            className="glass-card-interactive p-6 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/25 group-hover:scale-110 transition-transform">
              📖
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Resources</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Academic textbooks, exercise guides, and foundational numeracy sheets.
            </p>
            <div className="pt-2 text-xs font-black text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Toolbox</span> →
            </div>
          </div>

          <div
            onClick={scrollToTeam}
            className="glass-card-interactive p-6 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-white cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
              👥
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Team</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Meet the 11 Changemakers behind The X Factors.
            </p>
            <div className="pt-2 text-xs font-black text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Meet Changemakers</span> →
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          3. OUR VISION
         ──────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/60 via-white to-rose-50/40 text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider">
            ✨ OUR VISION
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading leading-tight max-w-2xl mx-auto">
            "We believe every child deserves the confidence, curiosity and support to discover their wings — and the freedom to fly towards their dreams."
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto italic">
            Building roots of learning every Saturday evening, so our kids can soar.
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          4. SHARED CORE VALUES — CLEAN DARK CONSTELLATION CANVAS
         ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold uppercase tracking-wider">
            ✨ SHARED CORE VALUES
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">WHAT WE BELIEVE IN</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            This is what our Learning Circle feels like — a constellation of belief, energy, and shared purpose.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categoryFilters.map(({ id, label, emoji }) => {
            const isActive = activeConstellationCategory === id
            return (
              <button
                key={id}
                onClick={() => setActiveConstellationCategory(id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-lg scale-105 ring-2 ring-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shadow-sm'
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        {/* CLEAN DARK CONSTELLATION CANVAS (No background text clutter) */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-12 border border-slate-800 shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-between">
          
          {/* Subtle Ambient Color Glow Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Highlighted Team Values Layer */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-6 max-w-5xl mx-auto">
            {filteredConstellationValues.map((val) => {
              let sizeClasses = 'text-xs py-2 px-3.5 rounded-2xl'
              if (val.size === 'hero') {
                sizeClasses = 'text-sm sm:text-base py-3 px-5 rounded-3xl shadow-md font-black tracking-wide'
              } else if (val.size === 'medium') {
                sizeClasses = 'text-xs sm:text-sm py-2.5 px-4 rounded-2xl shadow-sm font-extrabold'
              }

              return (
                <div
                  key={val.name}
                  onMouseEnter={() => setHoveredValue(val)}
                  onClick={() => setHoveredValue(val)}
                  className={`group relative cursor-pointer transition-all duration-300 ease-out border backdrop-blur-md ${val.color} ${sizeClasses} ${val.rotation} hover:scale-110 hover:z-20 hover:-translate-y-0.5`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg group-hover:scale-125 transition-transform">{val.emoji}</span>
                    <span>{val.name}</span>
                  </span>
                </div>
              )
            })}
          </div>

          {/* Dynamic Spotlight Reveal Card */}
          {hoveredValue && (
            <div className="relative z-20 mt-6 max-w-xl mx-auto w-full p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl animate-fade-in">
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 shrink-0">{hoveredValue.emoji}</span>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                    {hoveredValue.category}
                  </span>
                  <h4 className="text-lg font-black font-heading text-white">{hoveredValue.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{hoveredValue.desc}</p>
                </div>
              </div>
              <div className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500/20 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                PROUD X FACTOR
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          5. MEET THE X FACTORS (TEAM SECTION)
         ──────────────────────────────────────────────────────── */}
      <section id="team-section" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-24">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-wider">
            👥 The Squad
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">MEET THE X FACTORS</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Changemakers dedicated to educating, empowering, and walking alongside our children.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setActiveTeamMember(member)}
              className="glass-card-interactive p-5 rounded-3xl border border-slate-200 text-center space-y-4 cursor-pointer hover:border-brand-blue group relative overflow-hidden shadow-sm hover:shadow-xl"
            >
              {/* Equal Shared Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-brand-blue text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
                100% CHANGEMAKER
              </div>

              {/* Profile Avatar / Photo */}
              <div className="relative w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-brand-blue via-amber-400 to-emerald-400 shadow-md group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div
                    className={`hidden w-full h-full bg-gradient-to-br ${member.avatarColor} items-center justify-center font-black text-white text-2xl font-heading`}
                  >
                    {member.avatarText}
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 text-xl p-1 bg-white rounded-full shadow-md">
                  {member.emoji}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 font-heading group-hover:text-brand-blue transition-colors">
                  {member.name}
                </h3>
                <p className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wide">
                  {member.focus}
                </p>
                <p className="text-xs text-slate-600 pt-1 leading-relaxed">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member Details Modal */}
      {activeTeamMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-card max-w-sm w-full p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4 text-center relative bg-white">
            <button
              onClick={() => setActiveTeamMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-sm font-bold"
            >
              ✕
            </button>

            <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-brand-blue to-amber-400 shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src={activeTeamMember.photo}
                  alt={activeTeamMember.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-blue text-white text-[9px] font-black uppercase tracking-wider inline-block mb-1">
                100% CHANGEMAKER
              </span>
              <h3 className="text-xl font-black text-slate-900 font-heading">{activeTeamMember.name}</h3>
              <span className="text-xs font-bold text-amber-700">{activeTeamMember.focus}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              "{activeTeamMember.desc}"
            </p>

            <button
              onClick={() => setActiveTeamMember(null)}
              className="w-full py-2.5 bg-brand-blue text-white font-bold text-xs rounded-xl shadow-md"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
