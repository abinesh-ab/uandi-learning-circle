import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { ChevronLeft, ChevronRight, Eye, EyeOff, Lightbulb, Timer, Play, Pause, RefreshCw, Lock, ImageOff } from 'lucide-react'

// ── Category color map ───────────────────────────────────────────
const CATEGORY_COLORS = {
  Movie: 'bg-blue-900/60 text-blue-200 border-blue-700',
  Song: 'bg-rose-900/60 text-rose-200 border-rose-700',
  Celebrity: 'bg-amber-900/60 text-amber-200 border-amber-700',
  Dialogue: 'bg-emerald-900/60 text-emerald-200 border-emerald-700',
  Other: 'bg-slate-700/60 text-slate-300 border-slate-600',
}

// ── Timer circle ─────────────────────────────────────────────────
function TimerRing({ remaining, duration, running }) {
  const pct = duration > 0 ? remaining / duration : 0
  const r = 28
  const circ = 2 * Math.PI * r
  const stroke = circ * (1 - pct)

  const color =
    remaining > 15 ? '#22c55e' :
    remaining > 8  ? '#f59e0b' : '#ef4444'

  const pulse = remaining <= 8 && running

  return (
    <div className={`relative flex items-center justify-center ${pulse ? 'animate-pulse' : ''}`}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="36" cy="36" r={r} stroke="#1e293b" strokeWidth="6" fill="none" />
        <circle
          cx="36"
          cy="36"
          r={r}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={stroke}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white leading-none" style={{ color }}>
          {remaining}
        </span>
        <span className="text-[8px] text-slate-400 uppercase tracking-widest">sec</span>
      </div>
    </div>
  )
}

// ── Locked clue card ─────────────────────────────────────────────
function LockedClueCard({ index }) {
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_70%)]" />
      <div className="text-center space-y-2 z-10">
        <div className="w-10 h-10 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center mx-auto">
          <Lock className="w-4 h-4 text-slate-500" />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clue {index + 1}</p>
      </div>
    </div>
  )
}

// ── Revealed clue card ───────────────────────────────────────────
function RevealedClueCard({ clue, index }) {
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-brand-blue shadow-xl shadow-brand-blue/20 animate-fade-in">
      {clue.image_url ? (
        <img
          src={clue.image_url}
          alt={clue.title || `Clue ${index + 1}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-slate-600" />
        </div>
      )}
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-blue text-white text-[9px] font-black uppercase tracking-wider shadow">
        Clue {index + 1}
      </div>
      {clue.title && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          <p className="text-white text-xs font-bold truncate">{clue.title}</p>
          {clue.desc && <p className="text-white/60 text-[10px] truncate">{clue.desc}</p>}
        </div>
      )}
    </div>
  )
}

// ── Main Play View ───────────────────────────────────────────────
export default function CineCluePlayView({
  puzzle,
  activePuzzleIndex,
  totalPuzzles,
  onBack,
  onNextPuzzle,
  onPrevPuzzle,
  onGoToPuzzle,
  // Reveal controls
  revealedCount,
  showHint,
  showAnswer,
  onRevealNext,
  onRevealAll,
  onToggleHint,
  onRevealAnswer,
  onHideAnswer,
  // Timer
  timerDuration,
  timerRemaining,
  timerRunning,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onChangeTimerDuration,
}) {
  const didConfetti = useRef(false)

  // Fire confetti on answer reveal
  useEffect(() => {
    if (showAnswer && !didConfetti.current) {
      didConfetti.current = true
      const fire = (particleRatio, opts) => {
        confetti({
          ...opts,
          particleCount: Math.floor(200 * particleRatio),
          origin: { y: 0.6 },
        })
      }
      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#2563eb', '#f59e0b', '#ef4444'] })
      fire(0.2,  { spread: 60, colors: ['#22c55e', '#a855f7', '#ec4899'] })
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
      fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
      fire(0.1,  { spread: 120, startVelocity: 45 })
    }
    if (!showAnswer) didConfetti.current = false
  }, [showAnswer])

  if (!puzzle) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-white gap-4">
        <div className="text-4xl">🎬</div>
        <p className="text-slate-400 text-sm">No puzzles available. Add some in Creator Mode.</p>
        <button onClick={onBack} className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors">
          ← Back
        </button>
      </div>
    )
  }

  const clues = puzzle.clues || []
  const allRevealed = revealedCount >= clues.length
  const catStyle = CATEGORY_COLORS[puzzle.category] || CATEGORY_COLORS.Other

  // Dynamic grid columns based on clue count
  const gridCols =
    clues.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
    clues.length === 2 ? 'grid-cols-2 max-w-3xl mx-auto' :
    clues.length <= 4 ? 'grid-cols-2' :
    'grid-cols-3'

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900/80 border-b border-slate-800 shrink-0 gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-bold transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex-1 min-w-0 text-center">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${catStyle} uppercase tracking-wider`}>
              {puzzle.category}
            </span>
            <h2 className="text-sm font-black text-white truncate">{puzzle.title}</h2>
          </div>
        </div>

        {/* Puzzle navigation dots */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onPrevPuzzle} className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors" disabled={totalPuzzles <= 1}>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{activePuzzleIndex + 1}/{totalPuzzles}</span>
          <button onClick={onNextPuzzle} className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors" disabled={totalPuzzles <= 1}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Clues Grid (center / large area) */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className={`grid ${gridCols} gap-4`}>
            {clues.map((clue, i) => (
              i < revealedCount
                ? <RevealedClueCard key={i} clue={clue} index={i} />
                : <LockedClueCard key={i} index={i} />
            ))}
          </div>

          {/* Hint card (collapsible) */}
          {showHint && (puzzle.hint || puzzle.hint_image_url) && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-900/30 border border-amber-700/40 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Hint</span>
              </div>
              {puzzle.hint_image_url && (
                <img src={puzzle.hint_image_url} alt="Hint" className="w-full max-h-40 object-cover rounded-xl mb-3" />
              )}
              {puzzle.hint && <p className="text-sm text-amber-100">{puzzle.hint}</p>}
            </div>
          )}
        </div>

        {/* ── Right Control Panel ── */}
        <div className="w-52 shrink-0 bg-slate-900/70 border-l border-slate-800 flex flex-col gap-4 px-4 py-5 overflow-y-auto">

          {/* Timer */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Timer</p>
            <TimerRing remaining={timerRemaining} duration={timerDuration} running={timerRunning} />
            <div className="flex items-center gap-2">
              {timerRunning ? (
                <button
                  onClick={onPauseTimer}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black transition-colors"
                >
                  <Pause className="w-3 h-3" /> Pause
                </button>
              ) : (
                <button
                  onClick={onStartTimer}
                  disabled={timerRemaining === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[10px] font-black transition-colors"
                >
                  <Play className="w-3 h-3" /> Start
                </button>
              )}
              <button
                onClick={() => onResetTimer()}
                className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
            {/* Duration selector */}
            <div className="flex gap-1 flex-wrap justify-center">
              {[30, 45, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => onChangeTimerDuration(d)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black transition-colors ${timerDuration === d ? 'bg-brand-blue text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Reveal Controls */}
          <div className="space-y-2">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest text-center">
              Clues {revealedCount}/{clues.length}
            </p>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-blue rounded-full transition-all duration-300"
                style={{ width: `${(revealedCount / clues.length) * 100}%` }}
              />
            </div>
            <button
              onClick={onRevealNext}
              disabled={allRevealed}
              className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 disabled:opacity-40 text-white text-[10px] font-black transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              {allRevealed ? 'All Revealed' : 'Reveal Next Clue'}
            </button>
            {!allRevealed && (
              <button
                onClick={onRevealAll}
                className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold transition-colors"
              >
                Reveal All Clues
              </button>
            )}
          </div>

          <div className="h-px bg-slate-800" />

          {/* Hint Toggle */}
          <button
            onClick={onToggleHint}
            disabled={!puzzle.hint && !puzzle.hint_image_url}
            className={`w-full py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 ${
              showHint
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/40 disabled:opacity-30'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showHint ? 'Hide Hint' : 'Reveal Hint 💡'}
          </button>

          <div className="h-px bg-slate-800" />

          {/* Answer Reveal */}
          {showAnswer ? (
            <button
              onClick={onHideAnswer}
              className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <EyeOff className="w-3.5 h-3.5" /> Hide Answer
            </button>
          ) : (
            <button
              onClick={onRevealAnswer}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-[10px] font-black shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.03] animate-pulse-slow"
            >
              🏆 Reveal Answer!
            </button>
          )}
        </div>
      </div>

      {/* ── Answer Banner ── */}
      {showAnswer && puzzle.answer?.title && (
        <div className="shrink-0 bg-gradient-to-r from-amber-500 via-amber-400 to-rose-500 px-6 py-5 animate-fade-in border-t-4 border-amber-300">
          <div className="max-w-4xl mx-auto flex items-center gap-5">
            {puzzle.answer.image_url && (
              <img
                src={puzzle.answer.image_url}
                alt="Answer"
                className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-xl border-2 border-white/40"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-amber-900/70 uppercase tracking-wider">🏆 Answer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-tight">
                {puzzle.answer.title}
              </h2>
              {puzzle.answer.desc && (
                <p className="text-xs text-slate-800/80 mt-1 font-semibold">{puzzle.answer.desc}</p>
              )}
            </div>
            {totalPuzzles > 1 && (
              <button
                onClick={onNextPuzzle}
                className="shrink-0 px-4 py-2.5 rounded-2xl bg-slate-900/20 hover:bg-slate-900/30 text-slate-900 text-xs font-black transition-colors"
              >
                Next Puzzle →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
