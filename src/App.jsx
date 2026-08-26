import { useState, useEffect, useCallback, useRef } from 'react'
import { Lock } from 'lucide-react'
import TopNavbar from './components/layout/TopNavbar'
import BottomNavControls from './components/layout/BottomNavControls'
import HomePage from './components/home/HomePage'
import ActivitiesPage from './components/activities/ActivitiesPage'
import ResourcesPage from './components/resources/ResourcesPage'
import GratitudeVaultPage from './components/gratitude/GratitudeVaultPage'
import SquadMissionsPage from './components/missions/SquadMissionsPage'
import DecksMode from './components/decks/DecksMode'
import { deckConfig } from './data/data'
import { useFullscreen } from './hooks/useFullscreen'

export default function App() {
  const [activeMode, setActiveMode] = useState('home') // 'home' | 'decks' | 'activities' | 'resources' | 'gratitude' | 'missions'
  const [activeDeck, setActiveDeck] = useState('deck-aug20') // Open deck default
  const [currentSlide, setCurrentSlide] = useState(1)
  const [aug13LockedSlides, setAug13LockedSlides] = useState(new Set([4]))
  const [aug13RSVP, setAug13RSVP] = useState(null)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

  // Passcode gates
  const [spinJamUnlocked, setSpinJamUnlocked] = useState(false)
  const [aug27Unlocked, setAug27Unlocked] = useState(false)
  const [passcodeTarget, setPasscodeTarget] = useState(null) // 'spinjam' | 'aug27' | null
  const [passcodeInput, setPasscodeInput] = useState('')
  const [passcodeError, setPasscodeError] = useState(false)
  const passcodeRef = useRef(null)

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
  const switchDeck = useCallback(
    (deckId) => {
      if (deckId === 'deck-aug27' && !aug27Unlocked) {
        setPasscodeTarget('aug27')
        setPasscodeInput('')
        setPasscodeError(false)
        return
      }
      setActiveDeck(deckId)
      setCurrentSlide(1)
    },
    [aug27Unlocked]
  )

  // ── Switch mode (unlocked for all modes) ─────────────────
  const showMode = useCallback((mode) => {
    setActiveMode(mode)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── Trigger Spin & Jam unlock ─────────────────────────────
  const requestUnlockSpinJam = useCallback(() => {
    setPasscodeTarget('spinjam')
    setPasscodeInput('')
    setPasscodeError(false)
  }, [])

  // ── Passcode submit handler ──────────────────────────────
  const submitPasscode = useCallback(() => {
    const input = passcodeInput.trim().toLowerCase()
    if (passcodeTarget === 'spinjam' && input === 'x') {
      setSpinJamUnlocked(true)
      setPasscodeTarget(null)
      setPasscodeError(false)
      setPasscodeInput('')
    } else if (passcodeTarget === 'aug27' && input === 'x') {
      setAug27Unlocked(true)
      setPasscodeTarget(null)
      setPasscodeError(false)
      setPasscodeInput('')
      setActiveDeck('deck-aug27')
      setCurrentSlide(1)
      setActiveMode('decks')
    } else {
      setPasscodeError(true)
      setPasscodeInput('')
      if (passcodeRef.current) passcodeRef.current.focus()
    }
  }, [passcodeInput, passcodeTarget])

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
          handleRSVP={handleAug13RSVP}
          navigate={navigate}
        />
      </div>

      {/* Mode: Activities */}
      <div className={`mode-panel${activeMode === 'activities' ? ' active' : ''}`}>
        <ActivitiesPage
          spinJamUnlocked={spinJamUnlocked}
          onRequestUnlockSpinJam={requestUnlockSpinJam}
        />
      </div>

      {/* Mode: Resources */}
      <div className={`mode-panel${activeMode === 'resources' ? ' active' : ''}`}>
        <ResourcesPage />
      </div>

      {/* Mode: Gratitude Vault */}
      <div className={`mode-panel${activeMode === 'gratitude' ? ' active' : ''}`}>
        <GratitudeVaultPage showMode={showMode} />
      </div>

      {/* Mode: Squad Missions */}
      <div className={`mode-panel${activeMode === 'missions' ? ' active' : ''}`}>
        <SquadMissionsPage />
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

      {/* Passcode Gate Modal (Spin & Jam / Aug 27 Deck) */}
      {passcodeTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-sm w-full space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 font-heading">
                {passcodeTarget === 'aug27' ? 'LC Call — August 27' : 'Spin & Jam'}
              </h2>
              <p className="text-xs text-slate-500">Enter the passcode to continue.</p>
            </div>
            <input
              ref={passcodeRef}
              type="password"
              value={passcodeInput}
              onChange={(e) => {
                setPasscodeInput(e.target.value)
                setPasscodeError(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitPasscode()
              }}
              autoFocus
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold text-center text-slate-900 focus:outline-none transition-colors ${
                passcodeError
                  ? 'border-rose-400 bg-rose-50 animate-shake'
                  : 'border-slate-300 bg-slate-50 focus:border-amber-500'
              }`}
            />
            {passcodeError && (
              <p className="text-xs text-rose-600 font-bold -mt-2">Incorrect passcode. Try again.</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setPasscodeTarget(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPasscode}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
