import { useState, useRef, useEffect } from 'react'
import { Plus, X, Lock, FileText, Link, File } from 'lucide-react'

const CATEGORY_OPTIONS = [
  '9th Maths',
  'Accountancy',
  'Templates',
  'Curriculum',
  'Pedagogy',
  'Foundational Numeracy',
]

const GRADE_OPTIONS = ['General', '9th Std', '10th Std', '11th Std', '12th Std', 'Primary']

const FILE_TYPES = ['PDF', 'DOC', 'LINK', 'SHEET']

export default function AddResourceModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('9th Maths')
  const [grade, setGrade] = useState('General')
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [fileType, setFileType] = useState('PDF')
  const [passcode, setPasscode] = useState('')

  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setCategory('9th Maths')
      setGrade('General')
      setDescription('')
      setFileUrl('')
      setFileType('PDF')
      setPasscode('')
      setError('')
      setIsShaking(false)
      setTimeout(() => titleRef.current?.focus(), 100)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsShaking(false)

    if (!title.trim() || !fileUrl.trim()) {
      setError('Title and File URL are required.')
      return
    }

    if (passcode.trim().toLowerCase() !== 'x') {
      setError('Invalid passcode')
      setIsShaking(true)
      return
    }

    const res = await onSubmit({
      title: title.trim(),
      category,
      grade,
      description: description.trim(),
      file_url: fileUrl.trim(),
      file_type: fileType,
      passcode,
    })

    if (res && res.error) {
      setError(res.error)
      setIsShaking(true)
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 relative transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold shadow-xs">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 font-heading">Add New Resource</h3>
            <p className="text-xs text-slate-500">Publish academic materials to the Resource Hub.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Resource Title *</label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 9th Maths SSLC Question Bank 2026"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50 focus:bg-white"
              required
            />
          </div>

          {/* Category & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Grade / Standard</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File URL & File Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700">File URL / Drive Link *</label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Type</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50 font-bold"
              >
                {FILE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of chapters, solutions, or usage instructions..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50 focus:bg-white resize-none"
            />
          </div>

          {/* Passcode Field */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-500" /> Passcode Verification *
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-center text-slate-900 focus:outline-none focus:border-brand-blue bg-slate-50"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-bold text-center animate-fade-in">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              Save Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
