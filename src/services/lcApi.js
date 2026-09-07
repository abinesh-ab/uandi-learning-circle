import { supabase, isSupabaseConfigured } from './supabaseClient'

const LS_KEY = 'mss_dynamic_lcs'

function getLocal() {
  try {
    const saved = localStorage.getItem(LS_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function setLocal(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch {}
}

export async function fetchLearningCircles() {
  if (!isSupabaseConfigured) {
    return getLocal()
  }
  try {
    const { data, error } = await supabase
      .from('learning_circles')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    if (error) throw error
    // Sync to local fallback
    const rows = data || []
    setLocal(rows)
    return rows
  } catch (err) {
    console.error('Error fetching learning circles:', err)
    return getLocal()
  }
}

export async function createLearningCircle({
  id,
  name,
  short_name,
  programme,
  tagline,
  emoji,
  description,
  team_data,
  resource_categories,
  mission_categories,
  enable_passcode,
  delete_passcode,
  photo_url,
}) {
  const row = {
    id,
    name,
    short_name: short_name || name,
    programme: programme || 'Foundational Numeracy & Tuitions + LIFT',
    tagline: tagline || '',
    emoji: emoji || '🌟',
    description: description || '',
    team_data: team_data || [],
    resource_categories: resource_categories || [],
    mission_categories: mission_categories || [],
    enable_passcode: enable_passcode || '',
    delete_passcode: delete_passcode || '',
    photo_url: photo_url || '',
    is_active: true,
    created_at: new Date().toISOString(),
  }

  // Always save to local fallback first
  const local = getLocal()
  setLocal([...local.filter((r) => r.id !== id), row])

  if (!isSupabaseConfigured) return { success: true, row }

  try {
    const { data, error } = await supabase
      .from('learning_circles')
      .upsert(row)
      .select()
      .single()
    if (error) throw error
    return { success: true, row: data || row }
  } catch (err) {
    console.error('Error creating learning circle:', err)
    return { success: true, row }
  }
}

export async function updateLearningCircle(id, updates) {
  const local = getLocal()
  const existing = local.find((r) => r.id === id) || { id }
  const row = { ...existing, ...updates, id }
  setLocal([...local.filter((r) => r.id !== id), row])

  if (!isSupabaseConfigured) return { success: true, row }

  try {
    const { data, error } = await supabase
      .from('learning_circles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return { success: true, row: data || row }
  } catch (err) {
    console.error('Error updating learning circle:', err)
    return { success: true, row }
  }
}

/** Helper used by api.js to get all known LC slugs for LocalStorage cleanup */
export function getAllKnownLcSlugs() {
  const staticSlugs = ['the-x-factors', 'majaraam', 'kanakkukaanumkovai']
  try {
    const dynamic = getLocal()
    const dynamicSlugs = dynamic.map((r) => r.id)
    return [...new Set([...staticSlugs, ...dynamicSlugs])]
  } catch {
    return staticSlugs
  }
}
