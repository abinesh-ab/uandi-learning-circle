import { useState } from 'react'
import {
  ChevronLeft,
  Plus,
  Play,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  ImageOff,
  Loader2,
  Sparkles,
  Settings,
} from 'lucide-react'

const CATEGORY_COLORS = {
  Movie: 'bg-blue-100 text-blue-700 border-blue-200',
  Song: 'bg-rose-100 text-rose-700 border-rose-200',
  Celebrity: 'bg-amber-100 text-amber-700 border-amber-200',
  Dialogue: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Other: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function DeckDetailView({
  deck,
  puzzles,
  isLoading,
  onBackToLibrary,
  onPlayDeck,
  onAddPuzzle,
  onEditPuzzle,
  onDeletePuzzle,
  onReorderPuzzles,
  onEditDeck,
}) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  if (!deck) return null

  // Reorder up/down
  const handleMove = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= puzzles.length) return

    const newPuzzles = [...puzzles]
    const temp = newPuzzles[index]
    newPuzzles[index] = newPuzzles[targetIndex]
    newPuzzles[targetIndex] = temp

    const orderedIds = newPuzzles.map((p) => p.id)
    onReorderPuzzles(orderedIds)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Breadcrumb & Top Bar ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBackToLibrary}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Deck Library
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditDeck(deck)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Settings className="w-3.5 h-3.5" /> Edit Deck
          </button>
        </div>
      </div>

      {/* ── Deck Banner ───────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shrink-0 shadow-lg">
              {deck.cover_emoji || '🎬'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                  {deck.target_audience || 'Centre-wide'}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {puzzles.length} {puzzles.length === 1 ? 'Puzzle' : 'Puzzles'} in Sequence
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                {deck.title}
              </h2>
              {deck.description && (
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  {deck.description}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onPlayDeck(deck.id)}
              disabled={puzzles.length === 0}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-40 text-white font-black text-xs shadow-xl shadow-rose-500/30 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4" /> Launch Presenter Mode
            </button>
            <button
              onClick={onAddPuzzle}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Add Puzzle
            </button>
          </div>
        </div>
      </div>

      {/* ── Puzzles List Section ──────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>🎴 Sequence of Puzzles</span>
            <span className="text-xs font-bold text-slate-400">({puzzles.length})</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-bold hidden sm:block">
            Use arrows to reorder puzzle order for call flow
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
          </div>
        ) : puzzles.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-3">
            <div className="text-4xl">🎬</div>
            <h4 className="text-sm font-black text-slate-700">No puzzles in this deck yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your first puzzle slide to this deck. You can upload clue images, set hints, and write the answer.
            </p>
            <button
              onClick={onAddPuzzle}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add First Puzzle
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {puzzles.map((p, idx) => (
              <div
                key={p.id}
                className="group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-brand-blue hover:shadow-md transition-all"
              >
                {/* Order Index Pill */}
                <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-brand-blue font-black text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </div>

                {/* Reorder Arrows */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => handleMove(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-600 transition-colors"
                    title="Move Up in Sequence"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 1)}
                    disabled={idx === puzzles.length - 1}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-600 transition-colors"
                    title="Move Down in Sequence"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Thumbnail Preview */}
                <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                  {p.clues?.[0]?.image_url ? (
                    <img src={p.clues[0].image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <ImageOff className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Puzzle Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[p.category] || CATEGORY_COLORS.Other}`}>
                      {p.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {p.clues?.length || 0} clue slide{p.clues?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate mt-0.5">
                    {p.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    🏆 <span className="font-bold text-slate-700">Answer:</span> {p.answer?.title || '—'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onEditPuzzle(p)}
                    className="p-2 rounded-xl bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors"
                    title="Edit Puzzle"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === p.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { onDeletePuzzle(p.id); setDeleteConfirmId(null) }}
                        className="px-2 py-1 rounded-xl bg-rose-600 text-white text-[9px] font-black hover:bg-rose-700 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-1.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-[9px] font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                      title="Delete Puzzle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
