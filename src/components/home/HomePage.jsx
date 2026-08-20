import { useState, useMemo } from 'react'
import { Sparkles, ArrowRight, BookOpen, Layers, Target, Users, Heart, Award, Compass, Shield, Zap, Smile } from 'lucide-react'
import { teamMembers } from '../../data/teamData'
import { resourcesData } from '../../data/resourcesData'
import { getAssetUrl } from '../../utils/assetUrl'

// ── Shared Core Values Constellation Data ────────────────────
const constellationValues = [
  {
    name: 'CHANGEMAKERS',
    category: 'HOW WE CREATE IMPACT',
    emoji: '👑',
    desc: 'Transforming futures and building real community impact one class at a time.',
    size: 'hero',
    color: 'from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black',
    bgGlow: 'shadow-amber-500/40 border-amber-300 ring-2 ring-amber-400/50',
    rotation: 'rotate-0',
  },
  {
    name: 'UNSTOPPABLE',
    category: 'HOW WE SHOW UP',
    emoji: '⚡',
    desc: 'Overcoming every obstacle and showing up with relentless energy every Saturday.',
    size: 'hero',
    color: 'from-rose-500 via-red-500 to-pink-500 text-white font-black',
    bgGlow: 'shadow-rose-500/40 border-rose-300 ring-2 ring-rose-400/50',
    rotation: '-rotate-2',
  },
  {
    name: 'OPEN HEART',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '❤️',
    desc: 'Empathy, warmth, and genuine care for every child and team member.',
    size: 'hero',
    color: 'from-pink-500 via-rose-400 to-rose-600 text-white font-black',
    bgGlow: 'shadow-pink-500/40 border-pink-300 ring-2 ring-pink-400/50',
    rotation: 'rotate-1',
  },
  {
    name: 'DETERMINED',
    category: 'HOW WE SHOW UP',
    emoji: '🎯',
    desc: 'Resilient and unwavering focus on creating academic breakthroughs for kids.',
    size: 'hero',
    color: 'from-blue-600 via-indigo-600 to-blue-700 text-white font-black',
    bgGlow: 'shadow-blue-500/40 border-blue-300 ring-2 ring-blue-400/50',
    rotation: 'rotate-2',
  },
  {
    name: 'Trust Circle',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '🛡️',
    desc: 'A safe, supportive space where everyone can speak openly and lean on each other.',
    size: 'medium',
    color: 'from-emerald-500 to-teal-600 text-white font-extrabold',
    bgGlow: 'shadow-emerald-500/25 border-emerald-300',
    rotation: '-rotate-1',
  },
  {
    name: 'Peer Learning',
    category: 'HOW WE LEARN',
    emoji: '🧠',
    desc: 'Constantly exchanging teaching techniques, ideas, and growing together.',
    size: 'medium',
    color: 'from-violet-600 to-purple-600 text-white font-extrabold',
    bgGlow: 'shadow-violet-500/25 border-violet-300',
    rotation: 'rotate-2',
  },
  {
    name: 'Cross Functional',
    category: 'HOW WE LEARN',
    emoji: '🔄',
    desc: 'Integrating Maths, Accountancy, Pedagogy, and creative activities seamlessly.',
    size: 'medium',
    color: 'from-cyan-500 to-blue-600 text-white font-extrabold',
    bgGlow: 'shadow-cyan-500/25 border-cyan-300',
    rotation: '-rotate-2',
  },
  {
    name: 'Individual Excellence',
    category: 'HOW WE LEARN',
    emoji: '⭐',
    desc: 'Every volunteer bringing their authentic best and continuous self-improvement.',
    size: 'medium',
    color: 'from-amber-500 to-yellow-500 text-slate-950 font-extrabold',
    bgGlow: 'shadow-amber-400/25 border-amber-200',
    rotation: 'rotate-1',
  },
  {
    name: 'Supportive',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '🤝',
    desc: 'Lifting each other up during tough classes and celebrating small wins together.',
    size: 'medium',
    color: 'from-orange-500 to-amber-600 text-white font-extrabold',
    bgGlow: 'shadow-orange-500/25 border-orange-300',
    rotation: 'rotate-0',
  },
  {
    name: 'Friendly',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '🤗',
    desc: 'Approaching children as a warm mentor, positive role model, and lifelong friend.',
    size: 'regular',
    color: 'from-teal-400 to-emerald-500 text-slate-950 font-bold',
    bgGlow: 'border-teal-200',
    rotation: '-rotate-1',
  },
  {
    name: 'United',
    category: 'HOW WE TREAT EACH OTHER',
    emoji: '🔗',
    desc: 'One tribe, one heart, and one shared mission to transform children’s futures.',
    size: 'regular',
    color: 'from-purple-500 to-indigo-600 text-white font-bold',
    bgGlow: 'border-purple-300',
    rotation: 'rotate-2',
  },
  {
    name: 'Punctual',
    category: 'HOW WE SHOW UP',
    emoji: '⏰',
    desc: 'Respecting and valuing every precious Saturday minute we get with our kids.',
    size: 'regular',
    color: 'from-blue-400 to-cyan-500 text-slate-950 font-bold',
    bgGlow: 'border-blue-200',
    rotation: '-rotate-2',
  },
  {
    name: 'Practical',
    category: 'HOW WE SHOW UP',
    emoji: '📐',
    desc: 'Hands-on, activity-based learning that makes abstract concepts tangible.',
    size: 'regular',
    color: 'from-emerald-400 to-green-500 text-slate-950 font-bold',
    bgGlow: 'border-emerald-200',
    rotation: 'rotate-1',
  },
  {
    name: 'Dedicated',
    category: 'HOW WE CREATE IMPACT',
    emoji: '🔥',
    desc: 'Deep dedication to our kids academic growth and emotional well-being.',
    size: 'regular',
    color: 'from-red-500 to-rose-600 text-white font-bold',
    bgGlow: 'border-red-300',
    rotation: '-rotate-1',
  },
  {
    name: 'Credible',
    category: 'HOW WE CREATE IMPACT',
    emoji: '📜',
    desc: 'Deep preparation, subject mastery, and solid pedagogical foundations.',
    size: 'regular',
    color: 'from-slate-700 to-slate-900 text-white font-bold',
    bgGlow: 'border-slate-400',
    rotation: 'rotate-1',
  },
  {
    name: 'Competitive',
    category: 'HOW WE CREATE IMPACT',
    emoji: '🏆',
    desc: 'Striving for excellence and high standards without compromising warmth.',
    size: 'regular',
    color: 'from-amber-600 to-orange-600 text-white font-bold',
    bgGlow: 'border-amber-400',
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
    <div className="relative min-h-screen space-y-16 pb-20 overflow-x-hidden">
      {/* ────────────────────────────────────────────────────────
          1. HERO SECTION
         ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-12 px-4 overflow-hidden rounded-b-[3rem] shadow-2xl">
        {/* Dark warm hero background */}
        <div className="home-hero-bg">
          <img src={getAssetUrl('hero-home.png')} alt="" onError={(e) => (e.target.style.display = 'none')} />
        </div>

        {/* Ambient floating doodles & math symbols */}
        <div className="absolute top-12 left-10 text-4xl float-anim opacity-35 select-none pointer-events-none" style={{ animationDelay: '0s' }}>
          📚
        </div>
        <div className="absolute top-20 right-16 text-3xl float-slow opacity-30 select-none pointer-events-none" style={{ animationDelay: '1s' }}>
          💡
        </div>
        <div className="absolute bottom-28 left-16 text-3xl float-anim opacity-30 select-none pointer-events-none" style={{ animationDelay: '0.5s' }}>
          🌱
        </div>
        <div className="absolute bottom-20 right-12 text-4xl float-slow opacity-35 select-none pointer-events-none" style={{ animationDelay: '1.5s' }}>
          ⭐
        </div>
        <div className="absolute top-36 left-1/3 text-2xl float-anim opacity-25 select-none pointer-events-none" style={{ animationDelay: '2s' }}>
          🔭
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 space-y-6 max-w-4xl mx-auto">
          {/* Identity Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>MSS FN &amp; Tuitions • Marialaya, CBE • A U&amp;I Learning Circle</span>
          </div>

          {/* Headline & Slogan */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none font-heading drop-shadow-md">
              THE X FACTORS
            </h1>
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-rose-400 tracking-widest uppercase font-heading">
              Unlock the Unknown
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Different minds. One mission. Bigger possibilities. Welcome to the digital home of our volunteer tribe.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <button
              onClick={() => showMode('decks')}
              className="px-8 py-4 bg-brand-blue hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 transition-all text-sm flex items-center gap-2"
            >
              <Layers className="w-4 h-4" /> View LC Decks
            </button>
            <button
              onClick={() => showMode('activities')}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/30 hover:scale-105 transition-all text-sm flex items-center gap-2"
            >
              <Target className="w-4 h-4" /> Spin &amp; Jam
            </button>
            <button
              onClick={() => showMode('resources')}
              className="px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-black rounded-2xl hover:scale-105 transition-all text-sm flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Knowledge Toolbox
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          2. QUICK ACCESS CARDS
         ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              Meet the 8 Changemakers behind The X Factors.
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
          4. SHARED CORE VALUES — WORD CLOUD CONSTELLATION HUB
         ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-amber-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
            <span>✨ Living Culture &amp; Identity</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading">
            SHARED CORE VALUES — <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-brand-blue">CONSTELLATION</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            This is what our Learning Circle feels like — a vibrant cloud of belief, energy, and shared purpose that makes us proud to stick to it.
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
                    ? 'bg-slate-900 text-white shadow-lg scale-105 ring-2 ring-amber-400'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-sm'
                }`}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        {/* WORD CLOUD CONSTELLATION CANVAS */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 border-2 border-slate-800 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
          {/* Ambient Background Starfield & Glow Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Word Cloud Items */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5 py-6 max-w-5xl mx-auto">
            {filteredConstellationValues.map((val) => {
              const isHovered = hoveredValue?.name === val.name
              let sizeClasses = 'text-xs py-2 px-4 rounded-2xl'
              if (val.size === 'hero') {
                sizeClasses = 'text-base sm:text-xl py-3.5 px-6 rounded-3xl shadow-2xl scale-105 sm:scale-110 font-black tracking-wide'
              } else if (val.size === 'medium') {
                sizeClasses = 'text-sm sm:text-base py-2.5 px-5 rounded-2xl shadow-xl font-bold'
              }

              return (
                <div
                  key={val.name}
                  onMouseEnter={() => setHoveredValue(val)}
                  onClick={() => setHoveredValue(val)}
                  className={`group relative cursor-pointer transition-all duration-300 ease-out border backdrop-blur-md bg-gradient-to-r ${val.color} ${val.bgGlow} ${sizeClasses} ${val.rotation} hover:scale-115 hover:z-30 hover:-translate-y-1`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl group-hover:scale-125 transition-transform">{val.emoji}</span>
                    <span>{val.name}</span>
                  </span>
                </div>
              )
            })}
          </div>

          {/* DYNAMIC SPOTLIGHT CARD (HOVER / CLICK REVEAL) */}
          {hoveredValue && (
            <div className="relative z-20 mt-6 max-w-2xl mx-auto w-full p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl animate-fade-in">
              <div className="flex items-center gap-3 text-left">
                <span className="text-3xl p-2.5 rounded-2xl bg-white/15 shrink-0">{hoveredValue.emoji}</span>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest block">
                    {hoveredValue.category}
                  </span>
                  <h4 className="text-lg font-black font-heading text-white">{hoveredValue.name}</h4>
                  <p className="text-xs text-white/80 leading-relaxed">{hoveredValue.desc}</p>
                </div>
              </div>
              <div className="shrink-0 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-amber-200 border border-white/20">
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
