import { useState, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { jamQuestions, activitiesList } from '../../data/activitiesData'
import { Lock } from 'lucide-react'

export default function ActivitiesPage() {
  const [spinning, setSpinning] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const wheelRef = useRef(null)

  const spinWheel = useCallback(() => {
    if (spinning) return
    setSpinning(true)
    setSelectedQuestion(null)

    const wheel = wheelRef.current
    if (wheel) {
      wheel.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.85, 0.35, 1)'
      const randomDeg = 1440 + Math.floor(Math.random() * 360)
      wheel.style.transform = `rotate(${randomDeg}deg)`
    }

    setTimeout(() => {
      const chosen = jamQuestions[Math.floor(Math.random() * jamQuestions.length)]
      setSelectedQuestion(chosen)
      setSpinning(false)
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } })
    }, 4600)
  }, [spinning])

  const resetSpin = useCallback(() => {
    setSelectedQuestion(null)
    setSpinning(false)
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          🎯 LC Activities
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 font-heading">
          Learn, Play &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-amber-500">Think Together</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Interactive activities for team calls, openers, and deep perspective building.
        </p>
      </div>

      {/* Activity Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activitiesList.map(({ id, title, icon, desc, isLocked, badge }) => (
          <div
            key={id}
            className={`glass-card p-5 rounded-3xl border ${
              isLocked ? 'border-slate-200 opacity-80' : 'border-violet-300 bg-gradient-to-br from-violet-50/60 to-white shadow-md'
            } flex flex-col justify-between space-y-3 relative overflow-hidden`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{icon}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 ${
                    isLocked ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-violet-100 text-violet-700'
                  }`}
                >
                  {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                  <span>{badge}</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-heading">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────
          SPIN & JAM ARENA
         ──────────────────────────────────────────────────────── */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border-2 border-violet-300 bg-gradient-to-br from-violet-50/50 via-white to-blue-50/30 shadow-xl max-w-3xl mx-auto text-center space-y-6 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-xs font-black text-violet-600 uppercase tracking-widest block">FEATURED GAME</span>
          <h2 className="text-3xl font-black text-slate-900 font-heading">🎡 SPIN &amp; JAM</h2>
          <p className="text-xs sm:text-sm text-slate-600">Spin the wheel. Get a question. Let's jam.</p>
        </div>

        {/* Wheel Container */}
        <div className="relative flex justify-center py-4">
          {/* Pointer */}
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0"
            style={{
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderTop: '22px solid #7C3AED',
            }}
          />

          <div
            ref={wheelRef}
            onClick={spinWheel}
            className="w-60 h-60 sm:w-64 sm:h-64 rounded-full border-4 border-white shadow-2xl relative flex items-center justify-center cursor-pointer select-none bg-gradient-to-tr from-violet-600 via-blue-600 to-amber-500"
            title="Click to spin!"
          >
            <div className="w-28 h-28 rounded-full bg-white shadow-inner flex flex-col items-center justify-center z-10 p-2">
              <span className="text-3xl">🎲</span>
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide mt-1">
                {spinning ? 'SPINNING...' : 'SPIN'}
              </span>
            </div>
          </div>
        </div>

        {/* Spin Action Button */}
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="px-10 py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-lg shadow-violet-600/30 hover:scale-105 transition-all inline-flex items-center gap-2"
        >
          {spinning ? '🌀 Spinning Wheel (4s)...' : '🎲 SPIN THE WHEEL'}
        </button>

        {/* SINGLE Revealed Question Result */}
        {selectedQuestion && (
          <div className="p-6 bg-white rounded-3xl border-2 border-violet-400 space-y-4 shadow-xl text-center max-w-xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-[10px] font-black uppercase tracking-wider">
              ✨ YOUR JAM TOPIC • {selectedQuestion.tag}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading leading-snug">
              "{selectedQuestion.question}"
            </h3>

            <p className="text-xs font-bold text-brand-blue pt-1">
              🎤 Your turn. Take it away.
            </p>

            <button
              onClick={resetSpin}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              🔄 Spin Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
