import { useState, useEffect } from 'react'
import { initialMissions } from '../data/seedData'
import { teamMembers } from '../data/teamData'

const STORAGE_KEY = 'xfactors_squad_missions'

const CORE_VOLUNTEERS = teamMembers.map((m) => m.name)

export function useSquadMissions() {
  const [missions, setMissions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialMissions
    } catch {
      return initialMissions
    }
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(missions))
    } catch (err) {
      console.error('Failed to save squad missions state:', err)
    }
  }, [missions])

  // Toggle mission status between 'todo' and 'completed'
  const toggleMissionStatus = (id) => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'todo' ? 'completed' : 'todo'
          return {
            ...m,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? dateStr : undefined,
          }
        }
        return m;
      })
    )
  }

  // Add new mission or broadcast to ALL volunteers
  const addMission = ({ title, category = 'General', volunteer = 'Aravinth', dueDate = 'This Saturday', isBroadcast = false, passcode = '' }) => {
    if (!title.trim()) return { success: false, error: 'Task title is required.' }

    if (isBroadcast) {
      if (passcode !== 'X' && passcode !== 'x') {
        return { success: false, error: 'Broadcast creation requires Passcode "X".' }
      }

      const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

      const broadcastMissions = CORE_VOLUNTEERS.map((vName, idx) => ({
        id: `mis-bcast-${Date.now()}-${idx}`,
        volunteer: vName,
        title: title.trim(),
        category,
        status: 'todo',
        dueDate,
        createdAt: createdDate,
      }))

      setMissions((prev) => [...broadcastMissions, ...prev])
      return { success: true, count: broadcastMissions.length }
    } else {
      const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      const newMission = {
        id: `mis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        volunteer,
        title: title.trim(),
        category,
        status: 'todo',
        dueDate,
        createdAt: createdDate,
      }
      setMissions((prev) => [newMission, ...prev])
      return { success: true, count: 1 }
    }
  }

  // Delete task with passcode guard
  const deleteMission = (id, passcode) => {
    if (passcode !== 'X' && passcode !== 'x') {
      alert('Invalid passcode. Passcode "X" is required to delete tasks.')
      return false
    }
    setMissions((prev) => prev.filter((m) => m.id !== id))
    return true
  }

  // Reset to initial seed data
  const resetMissionsData = (passcode) => {
    if (passcode !== 'X' && passcode !== 'x') {
      alert('Invalid passcode. Passcode "X" is required to reset data.')
      return false
    }
    setMissions(initialMissions)
    return true
  }

  return {
    missions,
    toggleMissionStatus,
    addMission,
    deleteMission,
    resetMissionsData,
    setMissions,
  }
}
