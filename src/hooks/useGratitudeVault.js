import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { initialAffirmations } from '../data/seedData'

const STORAGE_KEY = 'xfactors_gratitude_vault'
const SENDER_KEY = 'xfactors_saved_sender_name'

export function useGratitudeVault() {
  const [affirmations, setAffirmations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialAffirmations
    } catch {
      return initialAffirmations
    }
  })

  const [savedSender, setSavedSender] = useState(() => {
    try {
      return localStorage.getItem(SENDER_KEY) || ''
    } catch {
      return ''
    }
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(affirmations))
    } catch (err) {
      console.error('Failed to save gratitude vault state:', err)
    }
  }, [affirmations])

  // Add a new affirmation note
  const addAffirmation = ({ recipient, message, sender, color = 'amber' }) => {
    if (!recipient || !message.trim() || !sender.trim()) return false

    // Save sender name for future posts
    try {
      localStorage.setItem(SENDER_KEY, sender.trim())
      setSavedSender(sender.trim())
    } catch (e) {
      console.error(e)
    }

    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })

    const newNote = {
      id: `aff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipient,
      message: message.trim(),
      sender: sender.trim(),
      timestamp: `${dateStr} • ${timeStr}`,
      reactions: { '❤️': 1, '🔥': 0, '👏': 1, '🌟': 0 },
      color,
    }

    setAffirmations((prev) => [newNote, ...prev])

    // Trigger celebratory particle confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E11D48', '#2563EB', '#F59E0B', '#10B981', '#8B5CF6'],
    })

    return true
  }

  // Reaction counter handler
  const toggleReaction = (id, emoji) => {
    setAffirmations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentCount = item.reactions[emoji] || 0
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
  }

  // Delete affirmation with passcode guard
  const deleteAffirmation = (id, passcode) => {
    if (passcode !== 'X' && passcode !== 'x') {
      alert('Invalid passcode. Passcode "X" is required for administrative deletion.')
      return false
    }
    setAffirmations((prev) => prev.filter((item) => item.id !== id))
    return true
  }

  // Reset to initial seed data
  const resetVaultData = (passcode) => {
    if (passcode !== 'X' && passcode !== 'x') {
      alert('Invalid passcode. Passcode "X" is required to reset data.')
      return false
    }
    setAffirmations(initialAffirmations)
    return true
  }

  return {
    affirmations,
    savedSender,
    addAffirmation,
    toggleReaction,
    deleteAffirmation,
    resetVaultData,
    setAffirmations,
  }
}
