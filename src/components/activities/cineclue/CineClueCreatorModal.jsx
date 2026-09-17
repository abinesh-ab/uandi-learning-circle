import { useState, useRef } from 'react'
import { X, Plus, Trash2, Pencil, Upload, Loader2, ImageOff, ChevronUp, ChevronDown } from 'lucide-react'
import { compressAndUploadImage } from '../../../services/cineclueApi'

const CATEGORIES = ['Movie', 'Song', 'Celebrity', 'Dialogue', 'Other']
const BLANK_CLUE = { image_url: '', title: '', desc: '', timer_seconds: 45 }
const BLANK_PUZZLE = {
  title: '',
  category: 'Movie',
  hint: '',
  hint_image_url: '',
  clues: [{ ...BLANK_CLUE }],
  answer: { title: '', desc: '', image_url: '' },
}

// ── Reusable Image Uploader Component ───────────────────────────
function ImageUploader({ value, onChange, label, compact = false }) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setUploadError('')
    const { url, error } = await compressAndUploadImage(file, 'puzzles')
    setUploading(false)
    if (error) {
      setUploadError(`Upload failed: ${error}`)
    } else {
      onChange(url)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{label}</label>}

      {/* Preview / Drop Zone */}
      <div
        className={`relative rounded-xl border-2 border-dashed border-slate-200 hover:border-brand-blue transition-colors cursor-pointer overflow-hidden bg-slate-50 ${compact ? 'h-24' : 'h-36'}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center group">
              <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1 rounded-full">
                Click to replace
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-1.5 text-slate-400">
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                <p className="text-[10px] font-bold text-brand-blue">Compressing & uploading…</p>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <p className="text-[10px] font-semibold">Drop or click to upload</p>
                <p className="text-[9px] text-slate-300">Auto-compressed → cloud saved</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL input as alternative */}
      <div className="flex items-center gap-2 mt-1">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste an image URL…"
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-[10px] text-slate-900 focus:outline-none focus:border-brand-blue bg-white"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {uploadError && <p className="text-[10px] text-rose-600 font-semibold">{uploadError}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}

// ── Single Clue Row ──────────────────────────────────────────────
function ClueRow({ clue, index, total, onChange, onRemove, onMoveUp, onMoveDown }) {
  return (
    <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-700">🎴 Clue {index + 1}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
          {total > 1 && (
            <button
              type="button"
              onClick={onRemove}
              className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <ImageUploader
        value={clue.image_url}
        onChange={(url) => onChange({ ...clue, image_url: url })}
        label="Clue Image *"
        compact={false}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Clue Title</label>
          <input
            type="text"
            value={clue.title}
            onChange={(e) => onChange({ ...clue, title: e.target.value })}
            placeholder="e.g. Scene from 2022"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Timer (sec)</label>
          <select
            value={clue.timer_seconds}
            onChange={(e) => onChange({ ...clue, timer_seconds: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
          >
            {[15, 20, 30, 45, 60, 90].map((s) => (
              <option key={s} value={s}>{s}s</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Clue Description (optional)</label>
        <input
          type="text"
          value={clue.desc}
          onChange={(e) => onChange({ ...clue, desc: e.target.value })}
          placeholder="Hint text shown below the image…"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
        />
      </div>
    </div>
  )
}

// ── Puzzle Form ──────────────────────────────────────────────────
function PuzzleForm({ initial, onSave, onCancel, isSaving, saveError }) {
  const [form, setForm] = useState(
    initial || { ...BLANK_PUZZLE, clues: [{ ...BLANK_CLUE }] }
  )

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const setAnswerField = (key, val) =>
    setForm((f) => ({ ...f, answer: { ...f.answer, [key]: val } }))

  const updateClue = (i, updated) =>
    setForm((f) => {
      const clues = [...f.clues]
      clues[i] = updated
      return { ...f, clues }
    })

  const addClue = () =>
    setForm((f) => ({ ...f, clues: [...f.clues, { ...BLANK_CLUE }] }))

  const removeClue = (i) =>
    setForm((f) => ({ ...f, clues: f.clues.filter((_, idx) => idx !== i) }))

  const moveClue = (i, dir) =>
    setForm((f) => {
      const clues = [...f.clues]
      const j = i + dir
      if (j < 0 || j >= clues.length) return f
      ;[clues[i], clues[j]] = [clues[j], clues[i]]
      return { ...f, clues }
    })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (!form.answer.title.trim()) return
    const validClues = form.clues.filter((c) => c.image_url.trim())
    if (validClues.length === 0) return
    onSave({ ...form, clues: validClues })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Puzzle Meta */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          📝 Puzzle Info
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Puzzle Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              required
              placeholder="e.g. Kollywood Classic #2"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Category</label>
            <select
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Hint Text</label>
            <input
              type="text"
              value={form.hint}
              onChange={(e) => setField('hint', e.target.value)}
              placeholder="Optional text hint…"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
            />
          </div>
        </div>

        <ImageUploader
          value={form.hint_image_url}
          onChange={(url) => setField('hint_image_url', url)}
          label="Hint Image (optional)"
          compact={true}
        />
      </div>

      {/* Clues Builder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            🎴 Clue Slides ({form.clues.length})
          </h4>
          <button
            type="button"
            onClick={addClue}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-blue text-white text-[10px] font-black hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Clue
          </button>
        </div>

        {form.clues.map((clue, i) => (
          <ClueRow
            key={i}
            clue={clue}
            index={i}
            total={form.clues.length}
            onChange={(updated) => updateClue(i, updated)}
            onRemove={() => removeClue(i)}
            onMoveUp={() => moveClue(i, -1)}
            onMoveDown={() => moveClue(i, 1)}
          />
        ))}
      </div>

      {/* Answer */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          🏆 Answer
        </h4>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Answer Title *</label>
            <input
              type="text"
              value={form.answer.title}
              onChange={(e) => setAnswerField('title', e.target.value)}
              required
              placeholder="e.g. Jailer (2023) — Kaavaalaa"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Answer Description</label>
            <input
              type="text"
              value={form.answer.desc}
              onChange={(e) => setAnswerField('desc', e.target.value)}
              placeholder="e.g. Directed by Nelson, starring Rajinikanth"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
            />
          </div>
          <ImageUploader
            value={form.answer.image_url}
            onChange={(url) => setAnswerField('image_url', url)}
            label="Answer Poster / Image"
            compact={false}
          />
        </div>
      </div>

      {saveError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
          ⚠️ {saveError}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 py-3 rounded-2xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isSaving ? 'Saving…' : '✓ Save Puzzle'}
        </button>
      </div>
    </form>
  )
}

// ── Main Creator Modal ───────────────────────────────────────────
export default function CineClueCreatorModal({
  isOpen,
  onClose,
  puzzles,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}) {
  const [view, setView] = useState('list') // 'list' | 'create' | 'edit'
  const [editingPuzzle, setEditingPuzzle] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  if (!isOpen) return null

  const handleSave = async (formData) => {
    setIsSaving(true)
    setSaveError('')
    let res
    if (view === 'edit' && editingPuzzle) {
      res = await onEdit(editingPuzzle.id, formData)
    } else {
      res = await onAdd(formData)
    }
    setIsSaving(false)
    if (res?.success !== false) {
      setView('list')
      setEditingPuzzle(null)
      setSaveError('')
    } else {
      setSaveError(res?.error || 'Failed to save puzzle. Please check all fields.')
    }
  }

  const startEdit = (puzzle) => {
    setEditingPuzzle(puzzle)
    setSaveError('')
    setView('edit')
  }

  const handleDelete = async (id) => {
    await onDelete(id)
    setDeleteConfirm(null)
  }

  const CATEGORY_COLORS = {
    Movie: 'bg-blue-100 text-blue-700',
    Song: 'bg-rose-100 text-rose-700',
    Celebrity: 'bg-amber-100 text-amber-700',
    Dialogue: 'bg-emerald-100 text-emerald-700',
    Other: 'bg-slate-100 text-slate-600',
  }

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-base font-black text-slate-900 font-heading">
              {view === 'list' ? '🎬 Manage Puzzles' : view === 'create' ? '✨ Create New Puzzle' : '✏️ Edit Puzzle'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {view === 'list'
                ? `${puzzles.length} puzzle${puzzles.length !== 1 ? 's' : ''} available`
                : 'Fill in puzzle details and upload clue images'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {view !== 'list' && (
              <button
                onClick={() => { setView('list'); setEditingPuzzle(null) }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {view === 'list' ? (
            <div className="space-y-4">
              {/* New Puzzle Button */}
              <button
                onClick={() => { setEditingPuzzle(null); setView('create') }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-brand-blue text-brand-blue text-xs font-black hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-4 h-4" /> Create New Puzzle
              </button>

              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
                </div>
              ) : puzzles.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-xs">No puzzles yet. Create your first one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {puzzles.map((p) => (
                    <div key={p.id} className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white transition-colors">
                      {/* Thumbnail */}
                      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                        {p.clues?.[0]?.image_url ? (
                          <img src={p.clues[0].image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">{p.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[p.category] || 'bg-slate-100 text-slate-600'}`}>
                            {p.category}
                          </span>
                          <span className="text-[9px] text-slate-400">{p.clues?.length || 0} clue{p.clues?.length !== 1 ? 's' : ''}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">→ {p.answer?.title || '—'}</p>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(p)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue hover:bg-blue-100 flex items-center justify-center transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        {deleteConfirm === p.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[9px] font-black hover:bg-rose-700 transition-colors"
                            >
                              Yes, delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[9px] font-bold hover:bg-slate-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors"
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
          ) : (
            <PuzzleForm
              initial={view === 'edit' ? editingPuzzle : null}
              onSave={handleSave}
              onCancel={() => { setView('list'); setEditingPuzzle(null); setSaveError('') }}
              isSaving={isSaving}
              saveError={saveError}
            />

          )}
        </div>
      </div>
    </div>
  )
}
