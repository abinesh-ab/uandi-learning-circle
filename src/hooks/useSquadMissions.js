import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import {
  fetchMissions,
  createMission,
  broadcastMissionToAll,
  toggleMissionStatusApi,
  deleteMissionApi,
  subscribeToTable,
} from '../services/api'
import { isSupabaseConfigured } from '../services/supabaseClient'
import { useLC } from '../context/LCContext'

export function useSquadMissions(lcName = 'the-x-factors', teamMembers = []) {
  const { validateEnablePasscode, validateDeletePasscode } = useLC()
  const [missions, setMissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    const list = await fetchMissions(lcName)
    setMissions(list)
    setIsLoading(false)
  }, [lcName])

  useEffect(() => {
    loadData()

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

  // Add new mission or broadcast to ALL volunteers of the active LC
  const addMission = async ({
    title,
    category = 'General',
    volunteer,
    dueDate = 'This Saturday',
    isBroadcast = false,
    passcode = '',
  }) => {
    if (!title.trim()) return { success: false, error: 'Task title is required.' }

    // Resolve the first volunteer name for this LC as default
    const defaultVolunteer = volunteer || (teamMembers[0]?.name ?? 'Volunteer')

    if (isBroadcast) {
      if (!validateEnablePasscode(passcode)) {
        return { success: false, error: 'Administrative passcode required for broadcast creation.' }
      }

      // Broadcast only to THIS LC's volunteers
      const lcVolunteers = (teamMembers || []).map((m) => m.name)
      await broadcastMissionToAll({ title, category, dueDate, lcName, lcVolunteers })
      loadData()
      return { success: true }
    } else {
      await createMission({ volunteer: defaultVolunteer, title, category, dueDate, lcName })
      loadData()
      return { success: true }
    }
  }

  // Delete task — validated against active LC's deletePasscode
  const deleteMission = async (id, passcode) => {
    if (!validateDeletePasscode(passcode)) {
      return { success: false, error: 'Invalid passcode' }
    }
    const target = missions.find((m) => m.id === id)
    setMissions((prev) => prev.filter((m) => m.id !== id))
    await deleteMissionApi(id)
    return { success: true, deletedMission: target }
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
