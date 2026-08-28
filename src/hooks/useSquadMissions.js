import { useState, useEffect, useCallback } from 'react'
import {
  fetchMissions,
  createMission,
  broadcastMissionToAll,
  toggleMissionStatusApi,
  deleteMissionApi,
  subscribeToTable,
} from '../services/api'
import { isSupabaseConfigured } from '../services/supabaseClient'

export function useSquadMissions() {
  const [missions, setMissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load initial missions
  const loadData = useCallback(async () => {
    setIsLoading(true)
    const list = await fetchMissions()
    setMissions(list)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData()

    // Realtime Supabase listener
    const unsubscribe = subscribeToTable('missions', () => {
      loadData()
    })

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [loadData])

  // Toggle mission status between 'todo' and 'completed'
  const toggleMissionStatus = async (id) => {
    const target = missions.find((m) => m.id === id)
    if (!target) return

    const nextStatus = target.status === 'todo' ? 'completed' : 'todo'
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    // Optimistic UI update
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? dateStr : undefined,
          }
        }
        return m
      })
    )

    await toggleMissionStatusApi(id, nextStatus)
  }

  // Add new mission or broadcast to ALL volunteers
  const addMission = async ({
    title,
    category = 'General',
    volunteer = 'Aravinth',
    dueDate = 'This Saturday',
    isBroadcast = false,
    passcode = '',
  }) => {
    if (!title.trim()) return { success: false, error: 'Task title is required.' }

    if (isBroadcast) {
      if (passcode !== 'X' && passcode !== 'x') {
        return { success: false, error: 'Administrative passcode required for broadcast creation.' }
      }

      await broadcastMissionToAll({ title, category, dueDate })
      loadData()
      return { success: true }
    } else {
      await createMission({ volunteer, title, category, dueDate })
      loadData()
      return { success: true }
    }
  }

  // Delete task with passcode guard (Passcode: 'factors')
  const deleteMission = async (id, passcode) => {
    const cleanPass = (passcode || '').trim().toLowerCase()
    if (cleanPass !== 'factors') {
      return false
    }
    setMissions((prev) => prev.filter((m) => m.id !== id))
    await deleteMissionApi(id)
    return true
  }

  return {
    missions,
    isLoading,
    isSupabaseConfigured,
    toggleMissionStatus,
    addMission,
    deleteMission,
    refetch: loadData,
  }
}
