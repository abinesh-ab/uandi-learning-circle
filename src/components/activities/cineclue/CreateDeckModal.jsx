import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'

const EMOJI_OPTIONS = ['🎬', '🚀', '🧠', '🍿', '🎵', '🏆', '✨', '🧩', '🎯', '🎨', '🌟', '📚']
const TARGET_AUDIENCES = ['Centre-wide', 'LC Squad', 'Kids Workshop', 'Special Event']
const SQUADS = [
  { id: 'centre', label: 'Centre-wide / MSS' },
  { id: 'the-x-factors', label: 'The X Factors' },
  { id: 'majaraam', label: 'MajaRaam' },
  { id: 'kanakkukaanumkovai', label: 'KanakkuKaanumKovai' },
]

export default function CreateDeckModal({
  isOpen,
  onClose,
  onSave,
  editingDeck = null,
  isSaving = false,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverEmoji, setCoverEmoji] = useState('🎬')
  const [targetAudience, setTargetAudience] = useState('Centre-wide')
  const [createdByLc, setCreatedByLc] = useState('centre')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  // Populate when editing or opening
  useEffect(() => {
    if (editingDeck) {
      setTitle(editingDeck.title || '')
      setDescription(editingDeck.description || '')
      setCoverEmoji(editingDeck.cover_emoji || '🎬')
      setTargetAudience(editingDeck.target_audience || 'Centre-wide')
      setCreatedByLc(editingDeck.created_by_lc || 'centre')
    } else {
      setTitle('')
      setDescription('')
      setCoverEmoji('🎬')
      setTargetAudience('Centre-wide')
      setCreatedByLc('centre')
    }
    setError('')
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [editingDeck, isOpen])

  // Escape key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Deck title is required.')
      return
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      cover_emoji: coverEmoji,
      target_audience: targetAudience,
      created_by_lc: createdByLc,
    })
  }

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile bottom-sheet drag handle */}
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{coverEmoji}</span>
            <div>
              <h3 className="text-base font-black text-slate-900 font-heading">
                {editingDeck ? 'Edit Puzzle Deck' : 'Create New Puzzle Deck'}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Bundle connection puzzles for your squad, call, or workshop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
              ⚠️ {error}
            </div>
          )}

          {/* Deck Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Deck Title *
            </label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError('') }}
              placeholder="e.g. The X Factors Weekly Sync - Sept 20"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
              required
            />
          </div>

          {/* Cover Emoji */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Cover Icon
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setCoverEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    coverEmoji === emoji
                      ? 'bg-blue-100 border-2 border-brand-blue scale-110 shadow-sm'
                      : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Target Audience & Squad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
              >
                {TARGET_AUDIENCES.map((aud) => (
                  <option key={aud} value={aud}>{aud}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Squad / Origin
              </label>
              <select
                value={createdByLc}
                onChange={(e) => setCreatedByLc(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
              >
                {SQUADS.map((sq) => (
                  <option key={sq.id} value={sq.id}>{sq.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Designed for 8th & 9th Std kids with Kollywood clues and fun riddles..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-black shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isSaving ? 'Saving Deck...' : editingDeck ? 'Update Deck' : 'Create Deck 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
