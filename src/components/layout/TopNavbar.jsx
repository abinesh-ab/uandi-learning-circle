import { useState, useRef, useEffect } from 'react'
import { Layers, ChevronDown, Check } from 'lucide-react'
import { deckConfig } from '../../data/data'
import { useLC } from '../../context/LCContext'

export default function TopNavbar({ activeMode, showMode, activeDeck, switchDeck, isFullscreen }) {
  const { activeLc, setActiveLc, activeLcMeta, allLcSlugs, allLcConfig } = useLC()
  const [lcDropdownOpen, setLcDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLcDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (isFullscreen) return null

  // Nav items — LC Call Decks only for X Factors
  const navItems = [
    { id: 'home', label: 'Home', emoji: '🏠', xfOnly: false },
    { id: 'decks', label: 'LC Call Decks', emoji: '📚', xfOnly: true },
    { id: 'activities', label: 'Activities', emoji: '🎯', xfOnly: false },
    { id: 'resources', label: 'Resources', emoji: '📖', xfOnly: false },
    { id: 'gratitude', label: 'Gratitude', emoji: '💖', xfOnly: false },
    { id: 'missions', label: 'Missions', emoji: '📋', xfOnly: false },
  ].filter(({ xfOnly }) => !xfOnly || activeLc === 'the-x-factors')

  const handleSwitchLC = (slug) => {
    setActiveLc(slug)
    setLcDropdownOpen(false)
    // If switching away from X Factors while on decks → go home
    if (slug !== 'the-x-factors' && activeMode === 'decks') {
      showMode('home')
    }
  }

  return (
    <header className="top-navbar fixed top-0 left-0 w-full z-50 px-4 py-3 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      {/* ── Brand: MSS Centre + LC Switcher ─────────────── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => showMode('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 bg-brand-blue font-black text-white rounded-xl flex items-center justify-center text-base shadow-md shadow-blue-500/20 font-heading group-hover:scale-105 transition-transform">
            ✕
          </div>
          <div>
            <h1 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 font-heading">MSS Centre 🏛️</h1>
            <p className="text-[10px] text-brand-blue font-semibold hidden sm:block">
              {activeLcMeta.emoji} {activeLcMeta.displayName}
            </p>
          </div>
        </button>

        {/* LC Switcher Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setLcDropdownOpen((o) => !o)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all duration-150 shadow-sm"
          >
            <span>{activeLcMeta.emoji}</span>
            <span className="max-w-[120px] truncate">{activeLcMeta.shortName}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${lcDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown — lists ALL LCs (static + dynamic) */}
          {lcDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-[9999] animate-fade-in">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Switch Learning Circle</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {allLcSlugs.map((slug) => {
                  const lc = allLcConfig[slug]
                  if (!lc) return null
                  const isActive = activeLc === slug
                  return (
                    <button
                      key={slug}
                      onClick={() => handleSwitchLC(slug)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm ${
                        isActive ? 'bg-blue-50 text-brand-blue font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <span className="text-xl">{lc.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold leading-tight truncate">{lc.displayName}</div>
                        <div className="text-xs text-slate-400 truncate">{lc.tagline}</div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-brand-blue shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Global Nav ──────────────────────────────────── */}
      <nav className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/80 px-1.5 py-1 rounded-full shadow-inner overflow-x-auto max-w-[55vw] sm:max-w-none scrollbar-none">
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

      {/* ── Deck Selector (decks mode only) ─────────────── */}
      {activeMode === 'decks' ? (
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs shadow-sm shrink-0">
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
        <div className="w-16 hidden md:block" />
      )}
    </header>
  )
}
