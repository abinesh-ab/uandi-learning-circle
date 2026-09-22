import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Lightbulb,
  Play,
  Pause,
  RefreshCw,
  Trophy,
  ImageOff,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  X,
} from 'lucide-react'

const CATEGORY_STYLES = {
  Movie: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Song: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  Celebrity: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  Dialogue: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  Other: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
}

// ── Timer Pill Component ─────────────────────────────────────────
function TimerPill({ remaining, duration, running, onStart, onPause, onReset, onChangeDuration }) {
  const isUrgent = remaining <= 10 && remaining > 0 && running
  const isExpired = remaining === 0

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md backdrop-blur-sm">
      <div
        className={`flex items-center justify-center font-mono font-black text-sm px-2 py-0.5 rounded-lg ${
          isExpired
            ? 'bg-rose-950 text-rose-400 border border-rose-700 animate-pulse'
            : isUrgent
            ? 'bg-amber-950 text-amber-300 border border-amber-600 animate-pulse'
            : 'bg-slate-900 text-emerald-400'
        }`}
      >
        ⏱️ {remaining}s
      </div>

      <div className="flex items-center gap-1">
        {running ? (
          <button
            onClick={onPause}
            className="p-1 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-white transition-colors"
            title="Pause Timer"
          >
            <Pause className="w-3 h-3" />
          </button>
        ) : (
          <button
            onClick={onStart}
            disabled={remaining === 0}
            className="p-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors"
            title="Start Timer"
          >
            <Play className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => onReset()}
          className="p-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          title="Reset Timer"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Quick duration presets */}
      <div className="flex items-center gap-0.5 pl-1 border-l border-slate-700">
        {[10, 15, 30, 45, 60].map((d) => (
          <button
            key={d}
            onClick={() => onChangeDuration(d)}
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors ${
              duration === d ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {d}s
          </button>
        ))}
      </div>
    </div>
  )
}


// ── Main Presenter Play View (One Clue Slide at a Time) ──────────
export default function CineCluePlayView({
  puzzle,
  activePuzzleIndex,
  totalPuzzles,
  onBack,
  onNextPuzzle,
  onPrevPuzzle,
  onGoToPuzzle,
  // Timer
  timerDuration,
  timerRemaining,
  timerRunning,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onChangeTimerDuration,
}) {
  // Slide index: 0 to (clues.length - 1) for clues, or 'answer' for the answer slide
  const [activeSlide, setActiveSlide] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const confettiInstanceRef = useRef(null)

  const clues = puzzle?.clues || []
  const totalClues = clues.length
  const isAnswerSlide = activeSlide === 'answer'
  const currentClue = typeof activeSlide === 'number' ? clues[activeSlide] : null

  // Initialize dedicated confetti canvas instance for fullscreen support
  useEffect(() => {
    if (canvasRef.current) {
      try {
        confettiInstanceRef.current = confetti.create(canvasRef.current, {
          resize: true,
          useWorker: true,
        })
      } catch (err) {
        console.warn('Canvas confetti initialization fallback:', err)
      }
    }
  }, [])

  // Reset slide when active puzzle changes
  useEffect(() => {
    setActiveSlide(0)
    setShowHint(false)
    onResetTimer()
  }, [activePuzzleIndex, onResetTimer])

  // Fire celebratory confetti when answer is revealed (works in fullscreen & normal view)
  const triggerConfetti = useCallback(() => {
    const fire = (particleRatio, opts) => {
      const conf = confettiInstanceRef.current || confetti
      try {
        conf({
          ...opts,
          particleCount: Math.floor(220 * particleRatio),
          origin: { y: 0.6 },
          zIndex: 999999,
        })
      } catch (err) {
        confetti({
          ...opts,
          particleCount: Math.floor(220 * particleRatio),
          origin: { y: 0.6 },
          zIndex: 999999,
        })
      }
    }
    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#2563eb', '#f59e0b', '#ef4444'] })
    fire(0.2,  { spread: 60, colors: ['#22c55e', '#a855f7', '#ec4899'] })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 })
    fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1,  { spread: 120, startVelocity: 45 })
  }, [])

  const goToAnswerSlide = useCallback(() => {
    setActiveSlide('answer')
    triggerConfetti()
  }, [triggerConfetti])


  // Slide navigation
  const nextSlide = useCallback(() => {
    if (typeof activeSlide === 'number') {
      if (activeSlide < totalClues - 1) {
        setActiveSlide(activeSlide + 1)
      } else {
        goToAnswerSlide()
      }
    }
  }, [activeSlide, totalClues, goToAnswerSlide])

  const prevSlide = useCallback(() => {
    if (isAnswerSlide) {
      setActiveSlide(Math.max(0, totalClues - 1))
    } else if (typeof activeSlide === 'number' && activeSlide > 0) {
      setActiveSlide(activeSlide - 1)
    }
  }, [isAnswerSlide, activeSlide, totalClues])

  // Fullscreen toggle (both native DOM and state-based)
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setIsFullscreen(false)
    }
  }, [])

  // Listen to native fullscreen changes (e.g. Esc key pressed)
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFSChange)
    return () => document.removeEventListener('fullscreenchange', handleFSChange)
  }, [])

  // Keyboard navigation (Arrow keys, Space for timer, F for fullscreen)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, toggleFullscreen, isFullscreen])

  if (!puzzle) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-slate-950 text-white gap-4">
        <div className="text-4xl">🎬</div>
        <p className="text-slate-400 text-sm">No puzzle selected.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
        >
          ← Back to Lobby
        </button>
      </div>
    )
  }

  const catStyle = CATEGORY_STYLES[puzzle.category] || CATEGORY_STYLES.Other

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-slate-950 text-white select-none transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] w-screen h-screen'
          : 'relative w-full h-[78vh] min-h-[560px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800'
      }`}
    >
      {/* Confetti Canvas inside container to guarantee visibility in Fullscreen mode */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-50 w-full h-full"
      />

      {/* ── Top Bar / Header ───────────────────────────────────── */}

      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md shrink-0 gap-3 z-20">
        {/* Left: Back & Puzzle Info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" /> Lobby
          </button>
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${catStyle}`}>
              {puzzle.category}
            </span>
            <h2 className="text-sm font-black text-white truncate font-heading">{puzzle.title}</h2>
          </div>
        </div>

        {/* Center: Interactive Timer */}
        <div className="shrink-0">
          <TimerPill
            remaining={timerRemaining}
            duration={timerDuration}
            running={timerRunning}
            onStart={onStartTimer}
            onPause={onPauseTimer}
            onReset={onResetTimer}
            onChangeDuration={onChangeTimerDuration}
          />
        </div>

        {/* Right: Hint, Fullscreen, & Puzzle Nav */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Hint Toggle */}
          {(puzzle.hint || puzzle.hint_image_url) && (
            <button
              onClick={() => setShowHint((h) => !h)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showHint
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-amber-950/60 border border-amber-700/60 text-amber-300 hover:bg-amber-900/70'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'View Full Screen (F)'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Puzzle Switcher */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
            <button
              onClick={onPrevPuzzle}
              disabled={totalPuzzles <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
              title="Previous Puzzle"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
            </button>
            <span className="text-[10px] text-slate-400 font-bold px-1 whitespace-nowrap">
              {activePuzzleIndex + 1}/{totalPuzzles}
            </span>
            <button
              onClick={onNextPuzzle}
              disabled={totalPuzzles <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
              title="Next Puzzle"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Hint Drawer / Banner ───────────────────────────────── */}
      {showHint && (puzzle.hint || puzzle.hint_image_url) && (
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-b border-amber-600/50 px-6 py-3 shrink-0 flex items-center justify-between gap-4 animate-fade-in z-20">
          <div className="flex items-center gap-3 min-w-0">
            {puzzle.hint_image_url && (
              <img
                src={puzzle.hint_image_url}
                alt="Hint"
                className="w-14 h-14 rounded-xl object-cover border border-amber-400 shrink-0"
              />
            )}
            <div>
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">
                💡 PUZZLE HINT
              </span>
              <p className="text-sm font-bold text-amber-100">{puzzle.hint || 'Visual clue attached'}</p>
            </div>
          </div>
          <button
            onClick={() => setShowHint(false)}
            className="p-1.5 rounded-lg text-amber-400 hover:text-white hover:bg-amber-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Stage: Active Clue Slide OR Answer Slide ────────────── */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          disabled={activeSlide === 0}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-800 disabled:opacity-0 text-white flex items-center justify-center border border-slate-700 shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* ── SLIDE CONTENT ── */}
        {!isAnswerSlide ? (
          /* Single Clue Slide (Large, Centered) */
          <div className="w-full h-full max-w-5xl flex flex-col items-center justify-center animate-fade-in space-y-3">
            {/* Clue Header Pill */}
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-brand-blue/30 border border-brand-blue/60 text-blue-300 font-mono font-black text-xs uppercase tracking-wider">
                🎴 Clue {activeSlide + 1} of {totalClues}
              </span>
              {currentClue?.title && (
                <span className="text-slate-300 font-bold text-xs truncate max-w-xs sm:max-w-md">
                  • {currentClue.title}
                </span>
              )}
            </div>

            {/* Large Clue Image Card */}
            <div className="relative w-full flex-1 max-h-[58vh] sm:max-h-[64vh] rounded-3xl overflow-hidden bg-slate-900/90 border-2 border-slate-700 shadow-2xl flex items-center justify-center group">
              {currentClue?.image_url ? (
                <img
                  src={currentClue.image_url}
                  alt={currentClue.title || `Clue ${activeSlide + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                  <ImageOff className="w-12 h-12" />
                  <p className="text-xs">No image provided for this clue</p>
                </div>
              )}
            </div>

            {/* Clue Description Text */}
            {currentClue?.desc && (
              <p className="text-sm text-slate-300 font-medium text-center max-w-2xl px-4 leading-relaxed">
                {currentClue.desc}
              </p>
            )}
          </div>
        ) : (
          /* Answer Slide (Full Celebration Poster) */
          <div className="w-full h-full max-w-4xl flex flex-col items-center justify-center animate-fade-in text-center p-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/25 animate-bounce">
              <Trophy className="w-4 h-4" /> CORRECT ANSWER!
            </div>

            {/* Answer Poster Image */}
            {puzzle.answer?.image_url && (
              <div className="relative w-full max-w-md h-56 sm:h-72 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl shadow-amber-500/30">
                <img
                  src={puzzle.answer.image_url}
                  alt={puzzle.answer.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Answer Title & Description */}
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-amber-200 font-heading leading-tight">
                {puzzle.answer?.title || 'Unknown Title'}
              </h1>
              {puzzle.answer?.desc && (
                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                  {puzzle.answer.desc}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveSlide(0)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Review Clues
              </button>
              {totalPuzzles > 1 && (
                <button
                  onClick={onNextPuzzle}
                  className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-sm shadow-xl shadow-amber-500/30 transition-all hover:scale-105"
                >
                  Next Puzzle <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Control & Slide Bar ─────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900/90 border-t border-slate-800/80 backdrop-blur-md shrink-0 gap-3 z-20">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={activeSlide === 0}
          className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-bold transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Slide Indicator Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full px-2 py-1 scrollbar-none">
          {clues.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all ${
                activeSlide === idx
                  ? 'bg-brand-blue text-white shadow-md shadow-blue-500/40 scale-105'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Clue {idx + 1}
            </button>
          ))}

          {/* Answer Tab */}
          <button
            onClick={goToAnswerSlide}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              isAnswerSlide
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/40 scale-105'
                : 'bg-amber-950/60 border border-amber-700/60 text-amber-300 hover:bg-amber-900/80'
            }`}
          >
            <Trophy className="w-3 h-3" /> Answer
          </button>
        </div>

        {/* Next / Reveal Button */}
        {!isAnswerSlide ? (
          activeSlide < totalClues - 1 ? (
            <button
              onClick={nextSlide}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-black transition-all shadow-md shadow-blue-500/30 hover:scale-105"
            >
              Next Clue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={goToAnswerSlide}
              className="flex items-center gap-1 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-black transition-all shadow-xl shadow-amber-500/30 hover:scale-105 animate-pulse"
            >
              <Sparkles className="w-4 h-4" /> Reveal Answer!
            </button>
          )
        ) : (
          totalPuzzles > 1 ? (
            <button
              onClick={onNextPuzzle}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-black transition-all shadow-md hover:scale-105"
            >
              Next Puzzle <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setActiveSlide(0)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Restart Clues
            </button>
          )
        )}
      </div>
    </div>
  )
}
