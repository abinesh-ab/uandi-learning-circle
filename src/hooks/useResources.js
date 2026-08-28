import { useState, useEffect, useCallback } from 'react'
import {
  fetchResources,
  postResource,
  deleteResourceApi,
  subscribeToTable,
} from '../services/api'
import { isSupabaseConfigured } from '../services/supabaseClient'

export function useResources() {
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load initial resources
  const loadData = useCallback(async () => {
    setIsLoading(true)
    const list = await fetchResources()
    setResources(list)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData()

    // Realtime Supabase listener
    const unsubscribe = subscribeToTable('resources', () => {
      loadData()
    })

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [loadData])

  // Add new resource (Requires passcode 'x' or 'X')
  const addResource = async ({
    title,
    category,
    grade,
    description,
    file_url,
    file_type,
    passcode,
  }) => {
    const cleanPass = (passcode || '').trim().toLowerCase()
    if (cleanPass !== 'x') {
      return { success: false, error: 'Invalid passcode' }
    }

    if (!title?.trim() || !file_url?.trim() || !category?.trim()) {
      return { success: false, error: 'Title, category, and file URL are required.' }
    }

    // Optimistic UI insert
    const tempObj = {
      id: `temp-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      grade: (grade || 'General').trim(),
      description: (description || '').trim(),
      file_url: file_url.trim(),
      file_type: (file_type || 'PDF').toUpperCase().trim(),
      created_at: new Date().toISOString(),
    }

    setResources((prev) => [tempObj, ...prev])
    await postResource({ title, category, grade, description, file_url, file_type })
    loadData()
    return { success: true }
  }

  // Delete resource (Requires passcode 'factors')
  const deleteResource = async (id, passcode) => {
    const cleanPass = (passcode || '').trim().toLowerCase()
    if (cleanPass !== 'factors') {
      return { success: false, error: 'Invalid passcode' }
    }

    setResources((prev) => prev.filter((item) => item.id !== id))
    await deleteResourceApi(id)
    return { success: true }
  }

  return {
    resources,
    isLoading,
    isSupabaseConfigured,
    addResource,
    deleteResource,
  }
}
