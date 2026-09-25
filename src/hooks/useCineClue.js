import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  fetchCineclueDecks,
  createCineclueDeck,
  updateCineclueDeck,
  deleteCineclueDeck,
  fetchCinecluePuzzles,
  createCinecluePuzzle,
  updateCinecluePuzzle,
  deleteCinecluePuzzle,
  reorderCinecluePuzzles,
  DEFAULT_DECK_ID,
} from '../services/cineclueApi'

const SESSION_KEY = 'cineclue_unlocked'
const PASSCODE = 'xfactors'

export function useCineClue() {
  // Access control
  const [isUnlocked, setIsUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  )

  // Decks state
  const [decks, setDecks] = useState([])
  const [isDecksLoading, setIsDecksLoading] = useState(false)
  const [activeDeckId, setActiveDeckId] = useState(null)

  // Puzzles state (scoped to active deck)
  const [puzzles, setPuzzles] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Presenter navigation & stage state
  const [activePuzzleIndex, setActivePuzzleIndex] = useState(0)
  const [revealedCount, setRevealedCount] = useState(1)
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isDeckCompleted, setIsDeckCompleted] = useState(false)

  // Timer state
  const [timerDuration, setTimerDuration] = useState(45)
  const [timerRemaining, setTimerRemaining] = useState(45)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef(null)

  // ── Load Decks ───────────────────────────────────────────────────
  const loadDecks = useCallback(async () => {
    setIsDecksLoading(true)
    try {
      const rows = await fetchCineclueDecks()
      setDecks(rows)
      return rows
    } finally {
      setIsDecksLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDecks()
  }, [loadDecks])

  // ── Load Puzzles for Active Deck ─────────────────────────────────
  const loadPuzzles = useCallback(async (deckId) => {
    setIsLoading(true)
    try {
      const rows = await fetchCinecluePuzzles(deckId)
      setPuzzles(rows)
      return rows
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPuzzles(activeDeckId)
  }, [activeDeckId, loadPuzzles])

  // Active Deck object
  const activeDeck = useMemo(() => {
    if (!activeDeckId) return null
    return decks.find((d) => d.id === activeDeckId) || null
  }, [decks, activeDeckId])

  // Active Puzzle object
  const activePuzzle = useMemo(() => {
    if (puzzles.length === 0) return null
    return puzzles[activePuzzleIndex] || null
  }, [puzzles, activePuzzleIndex])

  // ── Timer Engine ─────────────────────────────────────────────────
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

  // ── Access Control (Secret Passcode: xfactors) ───────────────────
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

  // ── Deck Selection & Presenter Reset ─────────────────────────────
  const selectDeck = useCallback((deckId) => {
    setActiveDeckId(deckId)
    setActivePuzzleIndex(0)
    setRevealedCount(1)
    setShowHint(false)
    setShowAnswer(false)
    setIsDeckCompleted(false)
    setTimerRemaining(45)
    setTimerRunning(false)
  }, [])

  // ── Puzzle Navigation ────────────────────────────────────────────
  const goToPuzzle = useCallback((index) => {
    setActivePuzzleIndex(index)
    setRevealedCount(1)
    setShowHint(false)
    setShowAnswer(false)
    setIsDeckCompleted(false)
    setTimerRemaining(timerDuration)
    setTimerRunning(false)
  }, [timerDuration])

  const nextPuzzle = useCallback(() => {
    if (puzzles.length === 0) return
    if (activePuzzleIndex < puzzles.length - 1) {
      goToPuzzle(activePuzzleIndex + 1)
    } else {
      // Finished all puzzles in this deck!
      setIsDeckCompleted(true)
    }
  }, [activePuzzleIndex, puzzles.length, goToPuzzle])

  const prevPuzzle = useCallback(() => {
    if (puzzles.length === 0) return
    if (isDeckCompleted) {
      setIsDeckCompleted(false)
      goToPuzzle(puzzles.length - 1)
      return
    }
    const prevIdx = Math.max(0, activePuzzleIndex - 1)
    goToPuzzle(prevIdx)
  }, [activePuzzleIndex, puzzles.length, isDeckCompleted, goToPuzzle])

  const replayDeck = useCallback(() => {
    goToPuzzle(0)
  }, [goToPuzzle])

  // ── Clue Reveal Controls ─────────────────────────────────────────
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

  // ── Timer Controls ───────────────────────────────────────────────
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

  // ── Deck CRUD Actions ────────────────────────────────────────────
  const addDeck = useCallback(async (deckData) => {
    const res = await createCineclueDeck(deckData)
    if (res.success) {
      await loadDecks()
    }
    return res
  }, [loadDecks])

  const editDeck = useCallback(async (id, updates) => {
    const res = await updateCineclueDeck(id, updates)
    if (res.success) {
      await loadDecks()
    }
    return res
  }, [loadDecks])

  const removeDeck = useCallback(async (id) => {
    const res = await deleteCineclueDeck(id)
    if (res.success) {
      if (activeDeckId === id) {
        setActiveDeckId(DEFAULT_DECK_ID)
      }
      await loadDecks()
      await loadPuzzles(activeDeckId === id ? DEFAULT_DECK_ID : activeDeckId)
    }
    return res
  }, [activeDeckId, loadDecks, loadPuzzles])

  // ── Puzzle CRUD Actions ──────────────────────────────────────────
  const addPuzzle = useCallback(async (puzzleData) => {
    const payload = {
      ...puzzleData,
      deck_id: puzzleData.deck_id || activeDeckId || DEFAULT_DECK_ID,
    }
    const res = await createCinecluePuzzle(payload)
    if (res.success) {
      await loadPuzzles(activeDeckId)
      await loadDecks()
    }
    return res
  }, [activeDeckId, loadPuzzles, loadDecks])

  const editPuzzle = useCallback(async (id, updates) => {
    const res = await updateCinecluePuzzle(id, updates)
    if (res.success) {
      await loadPuzzles(activeDeckId)
      await loadDecks()
    }
    return res
  }, [activeDeckId, loadPuzzles, loadDecks])

  const removePuzzle = useCallback(async (id) => {
    const res = await deleteCinecluePuzzle(id)
    if (res.success) {
      await loadPuzzles(activeDeckId)
      await loadDecks()
      setActivePuzzleIndex((i) => Math.max(0, i - 1))
    }
    return res
  }, [activeDeckId, loadPuzzles, loadDecks])

  const reorderPuzzles = useCallback(async (orderedIds) => {
    const res = await reorderCinecluePuzzles(activeDeckId, orderedIds)
    if (res.success) {
      await loadPuzzles(activeDeckId)
    }
    return res
  }, [activeDeckId, loadPuzzles])

  return {
    // Access Control
    isUnlocked,
    unlock,
    lock,

    // Decks
    decks,
    isDecksLoading,
    activeDeckId,
    activeDeck,
    selectDeck,
    loadDecks,
    addDeck,
    editDeck,
    removeDeck,

    // Puzzles
    puzzles,
    isLoading,
    activePuzzle,
    activePuzzleIndex,
    goToPuzzle,
    nextPuzzle,
    prevPuzzle,
    replayDeck,
    isDeckCompleted,
    addPuzzle,
    editPuzzle,
    removePuzzle,
    reorderPuzzles,
    loadPuzzles,

    // Presenter Stage
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
