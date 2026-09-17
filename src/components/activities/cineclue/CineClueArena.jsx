import { useState, useEffect, useRef } from 'react'
import { Clapperboard, Lock, Settings, Play, Loader2, ImageOff } from 'lucide-react'
import { useCineClue } from '../../../hooks/useCineClue'
import CineCluePlayView from './CineCluePlayView'
import CineClueCreatorModal from './CineClueCreatorModal'

// ── Passcode Gate Modal ───────────────────────────────────────────
function PasscodeGate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = onUnlock(value.trim())
    if (!ok) {
      setError(true)
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className={`w-full max-w-sm space-y-6 transition-transform ${shake ? 'animate-shake' : ''}`}>
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/25 text-3xl">
            🎬
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-heading">Connections: CineClue</h3>
            <p className="text-xs text-slate-500 mt-0.5">Host-only access • Enter verification code</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false) }}
              className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border text-sm font-bold text-slate-900 focus:outline-none transition-all text-center tracking-[0.2em] ${
                error
                  ? 'border-rose-400 bg-rose-50 focus:border-rose-500'
                  : 'border-slate-300 bg-slate-50 focus:border-brand-blue focus:bg-white'
              }`}
              required
            />
          </div>
          {error && (
            <p className="text-xs text-rose-600 font-bold text-center animate-fade-in">
              Incorrect code. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-rose-500/25 transition-all hover:scale-[1.02]"
          >
            Enter CineClue Studio 🎬
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Lobby: Puzzle Selector ────────────────────────────────────────
function CineClueLobby({
  puzzles,
  isLoading,
  activePuzzleIndex,
  onSelectPuzzle,
  onPlay,
  onOpenCreator,
}) {
  const CATEGORY_COLORS = {
    Movie: 'bg-blue-100 text-blue-700 border-blue-200',
    Song: 'bg-rose-100 text-rose-700 border-rose-200',
    Celebrity: 'bg-amber-100 text-amber-700 border-amber-200',
    Dialogue: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Other: 'bg-slate-100 text-slate-600 border-slate-200',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 font-heading">
            🎬 Select a Puzzle
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Choose a puzzle, then launch Presenter Mode.</p>
        </div>
        <button
          onClick={onOpenCreator}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
        >
          <Settings className="w-3.5 h-3.5" /> Manage Puzzles
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
        </div>
      ) : puzzles.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-5xl">🎬</div>
          <p className="text-sm font-bold text-slate-600">No puzzles yet!</p>
          <p className="text-xs text-slate-400">Use "Manage Puzzles" to create your first CineClue.</p>
          <button
            onClick={onOpenCreator}
            className="px-5 py-2.5 rounded-2xl bg-brand-blue text-white text-xs font-black shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all"
          >
            + Create First Puzzle
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {puzzles.map((p, i) => (
              <button
                key={p.id}
                onClick={() => onSelectPuzzle(i)}
                className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${
                  activePuzzleIndex === i
                    ? 'border-brand-blue bg-blue-50 shadow-md shadow-blue-100'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                  {p.clues?.[0]?.image_url ? (
                    <img src={p.clues[0].image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <ImageOff className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">{p.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[p.category] || CATEGORY_COLORS.Other}`}>
                      {p.category}
                    </span>
                    <span className="text-[9px] text-slate-400">{p.clues?.length || 0} clues</span>
                  </div>
                </div>
                {activePuzzleIndex === i && (
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-blue" />
                )}
              </button>
            ))}
          </div>

          {/* Launch Button */}
          {puzzles.length > 0 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={onPlay}
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-sm shadow-2xl shadow-rose-500/30 hover:from-rose-600 hover:to-amber-600 transition-all hover:scale-[1.02]"
              >
                <Play className="w-5 h-5" />
                Launch Presenter Mode 🎬
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── CineClue Arena: Top-Level Container ──────────────────────────
export default function CineClueArena() {
  const cc = useCineClue()
  const [view, setView] = useState('lobby')  // 'lobby' | 'play'
  const [creatorOpen, setCreatorOpen] = useState(false)

  if (!cc.isUnlocked) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 flex items-center gap-3">
          <Clapperboard className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-black text-white font-heading">Connections: CineClue 🎬 🎵</h3>
            <p className="text-[10px] text-slate-400">Connect the Clues • Crack the Title</p>
          </div>
        </div>
        <PasscodeGate onUnlock={cc.unlock} />
      </div>
    )
  }

  if (view === 'play') {
    return (
      <CineCluePlayView
        puzzle={cc.activePuzzle}
        activePuzzleIndex={cc.activePuzzleIndex}
        totalPuzzles={cc.puzzles.length}
        onBack={() => setView('lobby')}
        onNextPuzzle={cc.nextPuzzle}
        onPrevPuzzle={cc.prevPuzzle}
        onGoToPuzzle={cc.goToPuzzle}
        // Timer
        timerDuration={cc.timerDuration}
        timerRemaining={cc.timerRemaining}
        timerRunning={cc.timerRunning}
        onStartTimer={cc.startTimer}
        onPauseTimer={cc.pauseTimer}
        onResetTimer={cc.resetTimer}
        onChangeTimerDuration={cc.changeTimerDuration}
      />
    )
  }


  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clapperboard className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-black text-white font-heading">Connections: CineClue 🎬 🎵</h3>
              <p className="text-[10px] text-slate-400">Connect the Clues • Crack the Title</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider">
              🟢 Host Unlocked
            </span>
          </div>
        </div>

        {/* Lobby */}
        <div className="p-6">
          <CineClueLobby
            puzzles={cc.puzzles}
            isLoading={cc.isLoading}
            activePuzzleIndex={cc.activePuzzleIndex}
            onSelectPuzzle={cc.goToPuzzle}
            onPlay={() => setView('play')}
            onOpenCreator={() => setCreatorOpen(true)}
          />
        </div>
      </div>

      {/* Creator Modal */}
      <CineClueCreatorModal
        isOpen={creatorOpen}
        onClose={() => setCreatorOpen(false)}
        puzzles={cc.puzzles}
        isLoading={cc.isLoading}
        onAdd={cc.addPuzzle}
        onEdit={cc.editPuzzle}
        onDelete={cc.removePuzzle}
      />
    </>
  )
}
