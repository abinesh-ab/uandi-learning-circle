import { Layers } from 'lucide-react'
import { deckConfig } from '../../data/data'

export default function TopNavbar({ activeMode, showMode, activeDeck, switchDeck, isFullscreen }) {
  if (isFullscreen) return null

  const navItems = [
    { id: 'home', label: 'Home', emoji: '🏠' },
    { id: 'decks', label: 'LC Call Decks', emoji: '📚' },
    { id: 'activities', label: 'Activities', emoji: '🎯' },
    { id: 'resources', label: 'Resources', emoji: '📖' },
  ]

  return (
    <header className="top-navbar fixed top-0 left-0 w-full z-50 px-4 py-3 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      {/* Brand */}
      <button
        onClick={() => showMode('home')}
        className="flex items-center gap-2.5 text-left group focus:outline-none"
      >
        <div className="w-8 h-8 bg-brand-blue font-black text-white rounded-xl flex items-center justify-center text-base shadow-md shadow-blue-500/20 font-heading group-hover:scale-105 transition-transform">
          ✕
        </div>
        <div>
          <h1 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 font-heading">The X Factors</h1>
          <p className="text-[10px] text-brand-blue font-semibold hidden sm:block">MSS FN &amp; Tuitions • Unlock the Unknown</p>
        </div>
      </button>

      {/* Global Nav */}
      <nav className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/80 px-1.5 py-1 rounded-full shadow-inner">
        {navItems.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => showMode(id)}
            className={`gnav-btn${activeMode === id ? ' active' : ''}`}
          >
            <span>{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Deck Selector */}
      {activeMode === 'decks' ? (
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs shadow-sm">
          <Layers className="w-4 h-4 text-brand-blue" />
          <select
            value={activeDeck}
            onChange={(e) => switchDeck(e.target.value)}
            className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer text-xs"
          >
            {Object.entries(deckConfig).map(([id, { label }]) => (
              <option key={id} value={id} className="bg-white">
                {label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="w-20 hidden md:block" /> // Spacer for balanced header centering
      )}
    </header>
  )
}
