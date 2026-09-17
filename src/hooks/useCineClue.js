import { useState, useEffect, useRef, useCallback } from 'react'
import {
  fetchCinecluePuzzles,
  createCinecluePuzzle,
  updateCinecluePuzzle,
  deleteCinecluePuzzle,
} from '../services/cineclueApi'

const SESSION_KEY = 'cineclue_unlocked'
const PASSCODE = 'xfactors'

// ── Main CineClue hook ───────────────────────────────────────────
export function useCineClue() {
  // Access control
  const [isUnlocked, setIsUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  )

  // Puzzles list
  const [puzzles, setPuzzles] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Active puzzle index
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0)

  // Presenter / play state
  const [revealedCount, setRevealedCount] = useState(1)
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  // Timer state
  const [timerDuration, setTimerDuration] = useState(45)
  const [timerRemaining, setTimerRemaining] = useState(45)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef(null)

  // Load puzzles when unlocked
  useEffect(() => {
    if (!isUnlocked) return
    setIsLoading(true)
    fetchCinecluePuzzles().then((rows) => {
      setPuzzles(rows)
      setIsLoading(false)
    })
  }, [isUnlocked])

  // Timer engine
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setTimerRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [timerRunning])

  // ── Passcode verify ──
  const unlock = useCallback((inputPasscode) => {
    if (inputPasscode === PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setIsUnlocked(true)
      return true
    }
    return false
  }, [])

  const lock = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsUnlocked(false)
  }, [])

  // ── Puzzle navigation ──
  const activePuzzle = puzzles[activePuzzleIndex] || null

  const goToPuzzle = useCallback((index) => {
    setActivePuzzleIndex(index)
    setRevealedCount(1)
    setShowHint(false)
    setShowAnswer(false)
    setTimerRemaining(45)
    setTimerRunning(false)
  }, [])

  const nextPuzzle = useCallback(() => {
    if (puzzles.length === 0) return
    goToPuzzle((activePuzzleIndex + 1) % puzzles.length)
  }, [activePuzzleIndex, puzzles.length, goToPuzzle])

  const prevPuzzle = useCallback(() => {
    if (puzzles.length === 0) return
    goToPuzzle((activePuzzleIndex - 1 + puzzles.length) % puzzles.length)
  }, [activePuzzleIndex, puzzles.length, goToPuzzle])

  // ── Clue reveal controls ──
  const revealNextClue = useCallback(() => {
    if (!activePuzzle) return
    setRevealedCount((prev) => Math.min(prev + 1, activePuzzle.clues.length))
  }, [activePuzzle])

  const revealAllClues = useCallback(() => {
    if (!activePuzzle) return
    setRevealedCount(activePuzzle.clues.length)
  }, [activePuzzle])

  const toggleHint = useCallback(() => setShowHint((p) => !p), [])

  const revealAnswer = useCallback(() => setShowAnswer(true), [])

  const hideAnswer = useCallback(() => setShowAnswer(false), [])

  // ── Timer controls ──
  const startTimer = useCallback(() => setTimerRunning(true), [])
  const pauseTimer = useCallback(() => setTimerRunning(false), [])
  const resetTimer = useCallback((duration) => {
    const d = duration || timerDuration
    setTimerRunning(false)
    setTimerRemaining(d)
    setTimerDuration(d)
  }, [timerDuration])

  const changeTimerDuration = useCallback((seconds) => {
    setTimerDuration(seconds)
    setTimerRemaining(seconds)
    setTimerRunning(false)
  }, [])

  // ── CRUD actions ──
  const addPuzzle = useCallback(async (puzzle) => {
    const res = await createCinecluePuzzle(puzzle)
    if (res.success) {
      setPuzzles((prev) => [...prev, res.row])
    }
    return res
  }, [])

  const editPuzzle = useCallback(async (id, updates) => {
    const res = await updateCinecluePuzzle(id, updates)
    if (res.success) {
      setPuzzles((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
    }
    return res
  }, [])

  const removePuzzle = useCallback(async (id) => {
    const res = await deleteCinecluePuzzle(id)
    if (res.success) {
      setPuzzles((prev) => {
        const next = prev.filter((p) => p.id !== id)
        setActivePuzzleIndex((i) => Math.min(i, Math.max(0, next.length - 1)))
        return next
      })
    }
    return res
  }, [])

  return {
    // Access
    isUnlocked,
    unlock,
    lock,

    // Puzzles
    puzzles,
    isLoading,
    activePuzzle,
    activePuzzleIndex,
    goToPuzzle,
    nextPuzzle,
    prevPuzzle,
    addPuzzle,
    editPuzzle,
    removePuzzle,

    // Presenter state
    revealedCount,
    showHint,
    showAnswer,
    revealNextClue,
    revealAllClues,
    toggleHint,
    revealAnswer,
    hideAnswer,

    // Timer
    timerDuration,
    timerRemaining,
    timerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    changeTimerDuration,
  }
}
