import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import {
  fetchAffirmations,
  postAffirmation,
  reactToAffirmation,
  deleteAffirmationApi,
  subscribeToTable,
} from '../services/api'
import { isSupabaseConfigured } from '../services/supabaseClient'

const SENDER_KEY = 'xfactors_saved_sender_name'

export function useGratitudeVault() {
  const [affirmations, setAffirmations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [savedSender, setSavedSender] = useState(() => {
    try {
      return localStorage.getItem(SENDER_KEY) || ''
    } catch {
      return ''
    }
  })

  // Load initial affirmations
  const loadData = useCallback(async () => {
    setIsLoading(true)
    const list = await fetchAffirmations()
    setAffirmations(list)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData()

    // Realtime Supabase listener
    const unsubscribe = subscribeToTable('affirmations', () => {
      loadData()
    })

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [loadData])

  // Add a new affirmation note
  const addAffirmation = async ({ recipient, message, sender, color = 'amber' }) => {
    if (!recipient || !message.trim() || !sender.trim()) return false

    try {
      localStorage.setItem(SENDER_KEY, sender.trim())
      setSavedSender(sender.trim())
    } catch (e) {
      console.error(e)
    }

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    const tempNote = {
      id: tempId,
      recipient,
      message: message.trim(),
      sender: sender.trim(),
      color,
      timestamp: `${dateStr} • ${timeStr}`,
      reactions: { '❤️': 1, '🔥': 0, '👏': 1, '🌟': 0, '🐝': 0, '🌻': 0 },
    }

    setAffirmations((prev) => [tempNote, ...prev])

    // Trigger celebratory particle confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#2563EB', '#F59E0B', '#10B981', '#8B5CF6'],
    })

    // Post to API (Supabase or LocalStorage)
    await postAffirmation({ recipient, sender, message, color })
    loadData()
    return true
  }

  // Reaction counter handler
  const toggleReaction = async (id, emoji) => {
    const target = affirmations.find((a) => a.id === id)
    const currentReactions = target?.reactions || {}

    // Optimistic UI update
    setAffirmations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentCount = item.reactions?.[emoji] || 0
          return {
            ...item,
            reactions: {
              ...item.reactions,
              [emoji]: currentCount + 1,
            },
          }
        }
        return item
      })
    )

    await reactToAffirmation(id, emoji, currentReactions)
  }

  // Delete affirmation with passcode guard
  const deleteAffirmation = async (id, passcode) => {
    if (passcode !== 'X' && passcode !== 'x') {
      alert('Invalid administrative passcode.')
      return false
    }

    setAffirmations((prev) => prev.filter((item) => item.id !== id))
    await deleteAffirmationApi(id)
    return true
  }

  return {
    affirmations,
    isLoading,
    isSupabaseConfigured,
    savedSender,
    addAffirmation,
    toggleReaction,
    deleteAffirmation,
    refetch: loadData,
  }
}
