import { useState, useRef, useEffect } from 'react'
import { Trash2, Lock, X } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-sm w-full space-y-5 text-center relative transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <Trash2 className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 font-heading">Delete Record</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter passcode to delete this item.
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
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold text-center text-slate-900 focus:outline-none transition-all ${
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
              className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all hover:scale-[1.02]"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
