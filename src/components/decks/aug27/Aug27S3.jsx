import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { RotateCcw } from 'lucide-react'

// ─── Data ──────────────────────────────────────────────────────────────────
const INITIAL_IDEAS = [
  { id: 1, text: '"Full rebrand, new name, new logo, new interiors"' },
  { id: 2, text: '"Run a weekly open-mic on the slowest evening"' },
  { id: 3, text: '"Build a Brew Lab app with loyalty points and pre-ordering"' },
  { id: 4, text: '"Add 15 new items to the menu"' },
  { id: 5, text: '"Fix the Wi-Fi and add plug points at every table"' },
  { id: 6, text: '"Let students book tables as exam-season study spots with a minimum order"' },
  { id: 7, text: '"Start a WhatsApp broadcast to regulars with the daily special"' },
  { id: 8, text: '"Open a second outlet in the next city"' },
  { id: 9, text: '"Put a chalkboard outside with the day\'s special"' },
  { id: 10, text: '"Tie up with three nearby colleges as the official student hangout with 10% discount"' },
]

const QUADRANTS = [
  {
    id: 'goldmine',
    icon: '💎',
    label: 'GOLDMINE',
    sub: 'High Potential · Low Challenge',
    bg: 'bg-emerald-50',
    border: 'border-emerald-400',
    badge: 'bg-emerald-500 text-white',
    chip: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    row: 'top',
    col: 'left',
  },
  {
    id: 'moonshot',
    icon: '🚀',
    label: 'MOONSHOT',
    sub: 'High Potential · High Challenge',
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    badge: 'bg-amber-500 text-white',
    chip: 'bg-amber-100 text-amber-900 border-amber-300',
    row: 'top',
    col: 'right',
  },
  {
    id: 'quickwin',
    icon: '⚡',
    label: 'QUICK WIN',
    sub: 'Low Potential · Low Challenge',
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    badge: 'bg-brand-blue text-white',
    chip: 'bg-blue-100 text-blue-900 border-blue-300',
    row: 'bottom',
    col: 'left',
  },
  {
    id: 'questionable',
    icon: '🚫',
    label: 'QUESTIONABLE',
    sub: 'Low Potential · High Challenge',
    bg: 'bg-rose-50',
    border: 'border-rose-400',
    badge: 'bg-rose-500 text-white',
    chip: 'bg-rose-100 text-rose-900 border-rose-300',
    row: 'bottom',
    col: 'right',
  },
]

const emptyBoard = () => Object.fromEntries(QUADRANTS.map((q) => [q.id, []]))

// ─── Component ──────────────────────────────────────────────────────────────
export default function Aug27S3() {
  const [pool, setPool] = useState(INITIAL_IDEAS)
  const [board, setBoard] = useState(emptyBoard())
  const [dragging, setDragging] = useState(null)   // { id, from: 'pool'|quadrantId }
  const [picker, setPicker] = useState(null)         // id of card showing quadrant picker

  const total = INITIAL_IDEAS.length
  const placed = Object.values(board).flat().length

  // Celebrate when all placed
  useEffect(() => {
    if (placed === total && total > 0) {
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, colors: ['#10B981', '#F59E0B', '#2563EB', '#E11D48'] })
    }
  }, [placed, total])

  // ── Helpers ────────────────────────────────────────────────────────────────
  const findCard = (id) => {
    const fromPool = pool.find((c) => c.id === id)
    if (fromPool) return { card: fromPool, from: 'pool' }
    for (const qId of Object.keys(board)) {
      const found = board[qId].find((c) => c.id === id)
      if (found) return { card: found, from: qId }
    }
    return null
  }

  const placeCard = (cardId, targetQId) => {
    const result = findCard(cardId)
    if (!result) return
    const { card, from } = result

    // Remove from source
    if (from === 'pool') {
      setPool((p) => p.filter((c) => c.id !== cardId))
    } else {
      setBoard((b) => ({ ...b, [from]: b[from].filter((c) => c.id !== cardId) }))
    }
    // Add to target
    setBoard((b) => ({ ...b, [targetQId]: [...b[targetQId], card] }))
    setPicker(null)
  }

  const returnToPool = (cardId, fromQId) => {
    const card = board[fromQId]?.find((c) => c.id === cardId)
    if (!card) return
    setBoard((b) => ({ ...b, [fromQId]: b[fromQId].filter((c) => c.id !== cardId) }))
    setPool((p) => [...p, card])
  }

  const reset = () => {
    setPool(INITIAL_IDEAS)
    setBoard(emptyBoard())
    setPicker(null)
  }

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const onDragStart = (e, id, from) => {
    setDragging({ id, from })
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDropQuadrant = (e, qId) => {
    e.preventDefault()
    if (dragging) placeCard(dragging.id, qId)
    setDragging(null)
  }
  const onDropPool = (e) => {
    e.preventDefault()
    if (dragging && dragging.from !== 'pool') returnToPool(dragging.id, dragging.from)
    setDragging(null)
  }

  return (
    <div className="max-w-6xl w-full space-y-4 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-800 text-xs font-black uppercase tracking-widest">
          🎯 Strategy Matrix
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-heading">
          Potential vs. Challenge
        </h2>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Drag &amp; drop each idea card into the right quadrant — or tap a card to pick its quadrant. Debate as a team!
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-brand-blue transition-all duration-500"
            style={{ width: `${total > 0 ? (placed / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-500 shrink-0">{placed}/{total} placed</span>
        <button onClick={reset} className="text-slate-400 hover:text-rose-500 transition-colors shrink-0" title="Reset">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Axis labels + 2×2 Grid */}
      <div className="relative pl-8">
        {/* Y-axis label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap flex flex-col items-center gap-0.5 pointer-events-none select-none">
          <span>HIGH ↑</span>
          <span className="font-bold text-slate-500">POTENTIAL</span>
          <span>↓ LOW</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {QUADRANTS.map((q) => {
            const cards = board[q.id]
            return (
              <div
                key={q.id}
                className={`rounded-3xl border-2 ${q.border} ${q.bg} min-h-[170px] p-3 flex flex-col gap-2 transition-all duration-150`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDropQuadrant(e, q.id)}
              >
                {/* Quadrant Header */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${q.badge} flex items-center gap-1 shrink-0`}>
                    {q.icon} {q.label}
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold leading-tight">{q.sub}</span>
                </div>

                {/* Placed chips */}
                <div className="flex flex-wrap gap-1.5">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, card.id, q.id)}
                      onDoubleClick={() => returnToPool(card.id, q.id)}
                      title="Double-click to return to pool"
                      className={`text-[9px] sm:text-[10px] font-semibold ${q.chip} border rounded-xl px-2 py-1 cursor-grab active:cursor-grabbing max-w-[180px] leading-snug shadow-sm hover:shadow-md transition-shadow select-none`}
                    >
                      {card.text}
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <p className="text-[9px] text-slate-400 italic pt-1">Drop ideas here…</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* X-axis label */}
        <div className="text-center mt-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest select-none">
          LOW CHALLENGE ←&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ HIGH CHALLENGE
        </div>
      </div>

      {/* Idea Pool */}
      <div
        className={`rounded-3xl border-2 border-dashed transition-colors ${
          dragging && dragging.from !== 'pool' ? 'border-brand-blue bg-blue-50' : 'border-slate-300 bg-white/60'
        } p-4 space-y-2`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropPool}
      >
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          💡 Idea Pool — {pool.length} remaining · tap to assign · drag to quadrant
        </p>

        {pool.length === 0 ? (
          <p className="text-xs font-bold text-emerald-600 text-center py-2">
            🎉 All ideas placed! Great team discussion!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pool.map((card) => (
              <div key={card.id} className="relative">
                <div
                  draggable
                  onDragStart={(e) => onDragStart(e, card.id, 'pool')}
                  onClick={() => setPicker(picker === card.id ? null : card.id)}
                  className={`text-[10px] sm:text-xs font-semibold text-slate-800 bg-white border-2 ${
                    picker === card.id ? 'border-violet-500 shadow-lg' : 'border-slate-200 hover:border-violet-400'
                  } shadow-sm px-3 py-2 rounded-2xl cursor-pointer max-w-[220px] leading-snug transition-all select-none active:scale-95`}
                >
                  📌 {card.text}
                </div>

                {/* Quadrant picker popover */}
                {picker === card.id && (
                  <div className="absolute bottom-full left-0 mb-1.5 z-30 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 space-y-1 min-w-[190px] animate-fade-in">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-1.5 pb-0.5">
                      Place in quadrant:
                    </p>
                    {QUADRANTS.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => placeCard(card.id, q.id)}
                        className={`w-full text-left text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 hover:${q.bg} transition-colors`}
                      >
                        <span>{q.icon}</span>
                        <span>{q.label}</span>
                        <span className="text-slate-400 font-normal text-[9px] ml-auto">{q.sub}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
