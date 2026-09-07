import { useState, useEffect } from 'react'
import { fetchLearningCircles, createLearningCircle, updateLearningCircle } from '../services/lcApi'
import { buildLcMeta, STATIC_LC_SLUGS } from '../data/lcConfig'

const LS_KEY = 'mss_dynamic_lcs'

function getLocal() {
  try {
    const saved = localStorage.getItem(LS_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

/** Derive colour index for a dynamic LC based on insertion order */
function getColourIndex(rows, slug) {
  const staticCount = STATIC_LC_SLUGS.length
  const idx = rows.findIndex((r) => r.id === slug)
  return (staticCount + idx) % 8
}

/** Convert raw team_data array from DB row into teamData.js-compatible shape */
function buildTeamFromRow(row, meta) {
  if (!Array.isArray(row.team_data)) return []
  return row.team_data.map((m, i) => ({
    id: m.id || `${row.id}-m${i}`,
    name: m.name || '',
    role: m.role || '100% Changemaker',
    focus: m.specialty || 'Learning Circle',
    desc: m.desc || 'Bringing energy and dedication to every session.',
    avatarColor: `from-${meta?.color || 'blue'}-500 to-${meta?.color || 'blue'}-700`,
    avatarText: m.avatarText || (m.name ? m.name.slice(0, 2).toUpperCase() : '??'),
    photo: m.photo || '',
    specialty: m.specialty || 'Changemaker',
    emoji: m.emoji || '🌟',
  }))
}

export function useDynamicLCs() {
  const [rawRows, setRawRows] = useState(() => getLocal())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLearningCircles()
      .then((rows) => {
        // Filter out any row that clashes with a static LC slug
        const filtered = rows.filter((r) => !STATIC_LC_SLUGS.includes(r.id))
        setRawRows(filtered)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  // Non-static rows only
  const dynamicRows = rawRows.filter((r) => !STATIC_LC_SLUGS.includes(r.id))

  // Build merged maps
  const dynamicLcConfig = {}
  const dynamicTeams = {}
  dynamicRows.forEach((row, idx) => {
    const meta = buildLcMeta(row, STATIC_LC_SLUGS.length + idx)
    dynamicLcConfig[row.id] = meta
    dynamicTeams[row.id] = buildTeamFromRow(row, meta)
  })

  const addDynamicLC = async (formData) => {
    const result = await createLearningCircle(formData)
    if (result.success) {
      setRawRows((prev) => {
        const filtered = prev.filter((r) => r.id !== result.row.id)
        return [...filtered, result.row]
      })
    }
    return result
  }

  const updateDynamicLC = async (slug, formData) => {
    const result = await updateLearningCircle(slug, formData)
    if (result.success) {
      setRawRows((prev) => prev.map((r) => (r.id === slug ? result.row : r)))
    }
    return result
  }

  return {
    dynamicLcConfig,
    dynamicTeams,
    dynamicRows,
    isLoading,
    addDynamicLC,
    updateDynamicLC,
  }
}
