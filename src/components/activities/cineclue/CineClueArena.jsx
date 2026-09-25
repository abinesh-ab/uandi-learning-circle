import { useState, useEffect, useRef } from 'react'
import { Clapperboard, Lock } from 'lucide-react'
import { useCineClue } from '../../../hooks/useCineClue'
import CineCluePlayView from './CineCluePlayView'
import CineClueCreatorModal from './CineClueCreatorModal'
import DeckLibraryView from './DeckLibraryView'
import DeckDetailView from './DeckDetailView'
import CreateDeckModal from './CreateDeckModal'

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

// ── CineClue Arena: Top-Level Container ──────────────────────────
export default function CineClueArena() {
  const cc = useCineClue()

  // View routing: 'library' | 'manage-deck' | 'play'
  const [view, setView] = useState('library')

  // Creator modal (for adding/editing a puzzle) — used from DeckDetailView
  const [creatorOpen, setCreatorOpen] = useState(false)
  const [editingPuzzle, setEditingPuzzle] = useState(null)

  // Deck modal (create / edit a deck)
  const [deckModalOpen, setDeckModalOpen] = useState(false)
  const [editingDeck, setEditingDeck] = useState(null)
  const [isSavingDeck, setIsSavingDeck] = useState(false)

  // ── Deck actions (passcode already verified at unlock stage) ──
  const handlePlayDeck = (deckId) => {
    cc.selectDeck(deckId)
    setView('play')
  }

  const handleManageDeck = (deckId) => {
    cc.selectDeck(deckId)
    setView('manage-deck')
  }

  const handleCreateDeck = () => {
    setEditingDeck(null)
    setDeckModalOpen(true)
  }

  const handleEditDeck = (deck) => {
    setEditingDeck(deck)
    setDeckModalOpen(true)
  }

  const handleSaveDeck = async (data) => {
    setIsSavingDeck(true)
    if (editingDeck) {
      await cc.editDeck(editingDeck.id, data)
    } else {
      await cc.addDeck({ ...data, id: crypto.randomUUID() })
    }
    setIsSavingDeck(false)
    setDeckModalOpen(false)
    setEditingDeck(null)
  }

  const handleDeleteDeck = async (deckId) => {
    await cc.removeDeck(deckId)
  }

  // ── Puzzle actions from DeckDetailView ────────────────────────
  const handleAddPuzzle = () => {
    setEditingPuzzle(null)
    setCreatorOpen(true)
  }

  const handleEditPuzzle = (puzzle) => {
    setEditingPuzzle(puzzle)
    setCreatorOpen(true)
  }

  // ── Locked: show passcode gate ────────────────────────────────
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

  // ── Play View (full-bleed presenter mode) ─────────────────────
  if (view === 'play') {
    return (
      <CineCluePlayView
        puzzle={cc.activePuzzle}
        activeDeck={cc.activeDeck}
        activePuzzleIndex={cc.activePuzzleIndex}
        totalPuzzles={cc.puzzles.length}
        isDeckCompleted={cc.isDeckCompleted}
        onBack={() => setView('library')}
        onReturnToLibrary={() => { cc.replayDeck(); setView('library') }}
        onNextPuzzle={cc.nextPuzzle}
        onPrevPuzzle={cc.prevPuzzle}
        onGoToPuzzle={cc.goToPuzzle}
        onReplayDeck={cc.replayDeck}
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

  // ── Shared unlocked header ────────────────────────────────────
  const renderHeader = (title = 'Connections: CineClue 🎬 🎵', subtitle = 'Connect the Clues • Crack the Title') => (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Clapperboard className="w-5 h-5 text-amber-400" />
        <div>
          <h3 className="text-sm font-black text-white font-heading">{title}</h3>
          <p className="text-[10px] text-slate-400">{subtitle}</p>
        </div>
      </div>
      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider">
        🟢 Host Unlocked
      </span>
    </div>
  )

  // ── Manage Deck (puzzle sequence editor) ──────────────────────
  if (view === 'manage-deck') {
    return (
      <>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {renderHeader()}
          <div className="p-6">
            <DeckDetailView
              deck={cc.activeDeck}
              puzzles={cc.puzzles}
              isLoading={cc.isLoading}
              onBackToLibrary={() => setView('library')}
              onPlayDeck={handlePlayDeck}
              onAddPuzzle={handleAddPuzzle}
              onEditPuzzle={handleEditPuzzle}
              onDeletePuzzle={cc.removePuzzle}
              onReorderPuzzles={cc.reorderPuzzles}
              onEditDeck={handleEditDeck}
            />
          </div>
        </div>

        {/* Puzzle creator modal (add or edit) */}
        <CineClueCreatorModal
          isOpen={creatorOpen}
          onClose={() => { setCreatorOpen(false); setEditingPuzzle(null) }}
          puzzles={cc.puzzles}
          isLoading={cc.isLoading}
          onAdd={cc.addPuzzle}
          onEdit={cc.editPuzzle}
          onDelete={cc.removePuzzle}
          deckId={cc.activeDeckId}
          editingPuzzle={editingPuzzle}
        />

        {/* Deck edit modal */}
        <CreateDeckModal
          isOpen={deckModalOpen}
          onClose={() => { setDeckModalOpen(false); setEditingDeck(null) }}
          onSave={handleSaveDeck}
          editingDeck={editingDeck}
          isSaving={isSavingDeck}
        />
      </>
    )
  }

  // ── Default: Deck Library ─────────────────────────────────────
  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {renderHeader()}
        <div className="p-6">
          <DeckLibraryView
            decks={cc.decks}
            isLoading={cc.isDecksLoading}
            onPlayDeck={handlePlayDeck}
            onManageDeck={handleManageDeck}
            onCreateDeck={handleCreateDeck}
            onEditDeck={handleEditDeck}
            onDeleteDeck={handleDeleteDeck}
          />
        </div>
      </div>

      {/* Deck create/edit modal */}
      <CreateDeckModal
        isOpen={deckModalOpen}
        onClose={() => { setDeckModalOpen(false); setEditingDeck(null) }}
        onSave={handleSaveDeck}
        editingDeck={editingDeck}
        isSaving={isSavingDeck}
      />
    </>
  )
}
