import { useState, useRef, useEffect } from 'react'
import { Trash2, X } from 'lucide-react'

export default function AdminDeleteModal({ isOpen, onClose, onConfirm, itemTitle = 'this item' }) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setPasscode('')
      setError('')
      setIsShaking(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setError('')
    setIsShaking(false)

    if (!passcode.trim()) {
      setError('Invalid passcode')
      setIsShaking(true)
      return
    }

    const result = await onConfirm(passcode)
    if (!result || result.error) {
      setError('Invalid passcode')
      setIsShaking(true)
      setPasscode('')
      inputRef.current?.focus()
    } else {
      onClose()
    }
  }

  return (
    /* Backdrop — closes on click */
    <div
      className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center bg-slate-950/65 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className={`bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl space-y-5 text-center transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        <div className="px-8 pt-4 pb-8 space-y-5">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <Trash2 className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-slate-900 font-heading">Delete Record</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter passcode to permanently delete this item.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                ref={inputRef}
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value)
                  setError('')
                  setIsShaking(false)
                }}
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold text-center text-slate-900 focus:outline-none transition-all min-h-[48px] ${
                  error
                    ? 'border-rose-400 bg-rose-50 text-rose-900 focus:border-rose-500'
                    : 'border-slate-300 bg-slate-50 focus:border-rose-500 focus:bg-white'
                }`}
                autoFocus
              />
              {error && (
                <p className="text-xs text-rose-600 font-bold mt-2 animate-fade-in">{error}</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors min-h-[48px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all hover:scale-[1.02] min-h-[48px]"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
