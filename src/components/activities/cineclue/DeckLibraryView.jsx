import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Play,
  Settings,
  Pencil,
  Trash2,
  Sparkles,
  Layers,
  Loader2,
  Users,
} from 'lucide-react'

const AUDIENCE_FILTERS = ['All', 'Centre-wide', 'LC Squad', 'Kids Workshop', 'Special Event']

const AUDIENCE_COLORS = {
  'Centre-wide': 'bg-blue-100 text-blue-700 border-blue-200',
  'LC Squad': 'bg-purple-100 text-purple-700 border-purple-200',
  'Kids Workshop': 'bg-amber-100 text-amber-700 border-amber-200',
  'Special Event': 'bg-rose-100 text-rose-700 border-rose-200',
}

export default function DeckLibraryView({
  decks,
  isLoading,
  onPlayDeck,
  onManageDeck,
  onCreateDeck,
  onEditDeck,
  onDeleteDeck,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [audienceFilter, setAudienceFilter] = useState('All')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // Filtered decks
  const filteredDecks = useMemo(() => {
    return decks.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (d.target_audience && d.target_audience.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesAudience =
        audienceFilter === 'All' || d.target_audience === audienceFilter

      return matchesSearch && matchesAudience
    })
  }, [decks, searchTerm, audienceFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Top Bar / Action Strip ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-900 font-heading flex items-center gap-2">
            <span>📚 CineClue Deck Library</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a curated game deck to launch, or manage puzzle sequences.
          </p>
        </div>

        <button
          onClick={onCreateDeck}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-rose-500/25 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" /> Create New Deck
        </button>
      </div>

      {/* ── Search & Filter Pills ────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search decks by name, audience, or topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue bg-white shadow-sm"
          />
        </div>

        {/* Audience filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {AUDIENCE_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setAudienceFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                audienceFilter === filter
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── Deck Grid ────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
          <p className="text-xs text-slate-400 font-bold">Loading game decks...</p>
        </div>
      ) : filteredDecks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-3">
          <div className="text-5xl">🎬</div>
          <h4 className="text-sm font-black text-slate-700">No matching decks found</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {searchTerm
              ? `No decks matching "${searchTerm}". Try a different keyword.`
              : 'Create your first puzzle deck to start hosting game sessions!'}
          </p>
          <button
            onClick={onCreateDeck}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create First Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDecks.map((deck) => {
            const count = deck.puzzle_count || 0
            const audienceStyle =
              AUDIENCE_COLORS[deck.target_audience] || AUDIENCE_COLORS['Centre-wide']

            return (
              <div
                key={deck.id}
                className="group relative rounded-3xl border border-slate-200 bg-white hover:border-brand-blue hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm"
              >
                {/* Top strip / Deck Meta */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {deck.cover_emoji || '🎬'}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Audience Badge */}
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${audienceStyle} uppercase tracking-wider`}>
                        {deck.target_audience || 'Centre-wide'}
                      </span>

                      {/* Edit Deck */}
                      <button
                        onClick={() => onEditDeck(deck)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Deck Details"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Deck */}
                      {deck.id !== '00000000-0000-4000-8000-000000000001' && (
                        deleteConfirmId === deck.id ? (
                          <div className="flex items-center gap-1 animate-fade-in">
                            <button
                              onClick={() => { onDeleteDeck(deck.id); setDeleteConfirmId(null) }}
                              className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[9px] font-black hover:bg-rose-700 transition-colors"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[9px] font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(deck.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Deck"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-base font-black text-slate-900 font-heading group-hover:text-brand-blue transition-colors line-clamp-1">
                      {deck.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {deck.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Stats Pill */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-slate-500">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                      <Layers className="w-3 h-3 text-brand-blue" />
                      {count} {count === 1 ? 'Puzzle' : 'Puzzles'} Inside
                    </span>
                    {deck.created_by_lc && deck.created_by_lc !== 'centre' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-purple-50 text-purple-700 text-[10px]">
                        <Users className="w-3 h-3" />
                        {deck.created_by_lc}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onManageDeck(deck.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    Manage Puzzles
                  </button>

                  <button
                    onClick={() => onPlayDeck(deck.id)}
                    disabled={count === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:opacity-40 disabled:hover:scale-100 text-white text-xs font-black shadow-md shadow-rose-500/20 transition-all hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Play Deck
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
