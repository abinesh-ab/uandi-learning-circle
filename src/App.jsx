import { useState, useEffect, useCallback } from 'react'
import TopNavbar from './components/layout/TopNavbar'
import BottomNavControls from './components/layout/BottomNavControls'
import HomePage from './components/home/HomePage'
import ActivitiesPage from './components/activities/ActivitiesPage'
import ResourcesPage from './components/resources/ResourcesPage'
import DecksMode from './components/decks/DecksMode'
import { deckConfig } from './data/data'
import { useFullscreen } from './hooks/useFullscreen'

export default function App() {
  const [activeMode, setActiveMode] = useState('home') // 'home' | 'decks' | 'activities' | 'resources'
  const [activeDeck, setActiveDeck] = useState('deck-aug13')
  const [currentSlide, setCurrentSlide] = useState(1)
  const [aug13LockedSlides, setAug13LockedSlides] = useState(new Set([4]))
  const [aug13RSVP, setAug13RSVP] = useState(null)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

  const totalSlides = deckConfig[activeDeck]?.slides ?? 1

  // ── Navigation ──────────────────────────────────────────
  const goToSlide = useCallback(
    (num) => {
      if (num < 1 || num > totalSlides) return
      setCurrentSlide(num)
    },
    [totalSlides]
  )

  const navigate = useCallback(
    (dir) => {
      if (activeDeck === 'deck-aug13') {
        let target = currentSlide + dir
        while (target >= 1 && target <= totalSlides && aug13LockedSlides.has(target)) {
          target += dir
        }
        if (target >= 1 && target <= totalSlides) goToSlide(target)
      } else {
        goToSlide(currentSlide + dir)
      }
    },
    [activeDeck, currentSlide, totalSlides, aug13LockedSlides, goToSlide]
  )

  // ── Switch deck ─────────────────────────────────────────
  const switchDeck = useCallback((deckId) => {
    setActiveDeck(deckId)
    setCurrentSlide(1)
  }, [])

  // ── Switch mode ─────────────────────────────────────────
  const showMode = useCallback((mode) => {
    setActiveMode(mode)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── RSVP handler (Aug 13) ────────────────────────────────
  const handleAug13RSVP = useCallback(
    (choice) => {
      setAug13RSVP(choice)
      if (choice === 'yes') {
        setAug13LockedSlides(new Set([4]))
        setTimeout(() => navigate(1), 2200)
      } else {
        setAug13LockedSlides(new Set())
      }
    },
    [navigate]
  )

  // ── Keyboard controls ────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (activeMode !== 'decks') return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        navigate(1)
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigate(-1)
      }
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [activeMode, navigate, toggleFullscreen])

  return (
    <div
      className={`h-screen w-screen relative select-none bg-slate-50 text-slate-900 antialiased overflow-hidden${
        isFullscreen ? ' fullscreen-mode' : ''
      }`}
    >
      {/* Ambient Background Mesh */}
      <div className="bg-mesh" />

      {/* Persistent Top Navbar */}
      <TopNavbar
        activeMode={activeMode}
        showMode={showMode}
        activeDeck={activeDeck}
        switchDeck={switchDeck}
        isFullscreen={isFullscreen}
      />

      {/* Mode: Home */}
      <div className={`mode-panel${activeMode === 'home' ? ' active' : ''}`}>
        <HomePage showMode={showMode} />
      </div>

      {/* Mode: Decks */}
      <div className={`mode-panel${activeMode === 'decks' ? ' active' : ''}`}>
        <DecksMode
          activeDeck={activeDeck}
          currentSlide={currentSlide}
          aug13LockedSlides={aug13LockedSlides}
          aug13RSVP={aug13RSVP}
          handleAug13RSVP={handleAug13RSVP}
          navigate={navigate}
        />
      </div>

      {/* Mode: Activities */}
      <div className={`mode-panel${activeMode === 'activities' ? ' active' : ''}`}>
        <ActivitiesPage />
      </div>

      {/* Mode: Resources */}
      <div className={`mode-panel${activeMode === 'resources' ? ' active' : ''}`}>
        <ResourcesPage />
      </div>

      {/* Bottom Nav Controls (only in Decks mode) */}
      {activeMode === 'decks' && (
        <BottomNavControls
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          navigate={navigate}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
        />
      )}
    </div>
  )
}
