import { supabase, isSupabaseConfigured } from './supabaseClient'
import { teamMembers } from '../data/teamData'
import { initialResources } from '../data/resourcesData'

// LocalStorage Keys for Fallback Mode — keyed per LC
const LS_KEYS = {
  AFFIRMATIONS: (lc = 'the-x-factors') => `${lc}_gratitude_vault`,
  MISSIONS:     (lc = 'the-x-factors') => `${lc}_squad_missions`,
  RESOURCES:    (lc = 'the-x-factors') => `${lc}_resources`,
  STUDENT_LOGS: 'xfactors_student_logs',
  GENERIC_ENTRIES: 'xfactors_generic_entries',
}

// Helper: Safely get item from LocalStorage
function getLocal(key, defaultVal = []) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultVal
  } catch {
    return defaultVal
  }
}

// Helper: Safely set item in LocalStorage
function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    console.error('LocalStorage write failed:', e)
  }
}

// ============================================================================
// 1. VOLUNTEERS API
// ============================================================================
export async function getVolunteers() {
  if (!isSupabaseConfigured) {
    return teamMembers.map((m) => ({ id: m.id, name: m.name, role: m.role, focus: m.focus }))
  }
  try {
    const { data, error } = await supabase.from('volunteers').select('*').order('name')
    if (error) throw error
    return data && data.length > 0 ? data : teamMembers
  } catch (err) {
    console.error('Error fetching volunteers from Supabase:', err)
    return teamMembers
  }
}

// ============================================================================
// 2. AFFIRMATIONS API (The Gratitude Vault) — LC filtered
// ============================================================================
export async function fetchAffirmations(lcName = 'the-x-factors') {
  if (!isSupabaseConfigured) {
    return getLocal(LS_KEYS.AFFIRMATIONS(lcName), [])
  }
  try {
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .eq('lc_name', lcName)
      .order('created_at', { ascending: false })
    if (error) throw error

    const mapped = (data || []).map((row) => ({
      id: row.id,
      recipient: row.recipient_name,
      sender: row.sender_name,
      message: row.message,
      color: row.color || 'amber',
      reactions: row.reactions || { '❤️': 0, '🔥': 0, '👏': 0, '🌟': 0 },
      timestamp: new Date(row.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + ' • ' + new Date(row.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      created_at: row.created_at,
    }))
    return mapped
  } catch (err) {
    console.error('Error fetching affirmations from Supabase, falling back to LocalStorage:', err)
    return getLocal(LS_KEYS.AFFIRMATIONS(lcName), [])
  }
}

export async function postAffirmation({ recipient, sender, message, color = 'amber', lcName = 'the-x-factors' }) {
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const newAff = {
    id: `aff-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipient,
    sender,
    message: message.trim(),
    color,
    reactions: { '❤️': 1, '🔥': 0, '👏': 1, '🌟': 0, '🐝': 0, '🌻': 0 },
    timestamp: `${dateStr} • ${timeStr}`,
    created_at: new Date().toISOString(),
    lc_name: lcName,
  }

  const localList = getLocal(LS_KEYS.AFFIRMATIONS(lcName), [])
  setLocal(LS_KEYS.AFFIRMATIONS(lcName), [newAff, ...localList])

  if (!isSupabaseConfigured) return newAff

  try {
    const { data, error } = await supabase
      .from('affirmations')
      .insert({
        recipient_name: recipient,
        sender_name: sender,
        message: message.trim(),
        color,
        reactions: newAff.reactions,
        lc_name: lcName,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error inserting affirmation to Supabase:', err)
    return newAff
  }
}

export async function reactToAffirmation(id, emoji, currentReactions = {}) {
  const updatedReactions = {
    ...currentReactions,
    [emoji]: (currentReactions[emoji] || 0) + 1,
  }

  if (!isSupabaseConfigured) {
    // Best-effort update across all LC local keys
    ;['the-x-factors', 'majaraam', 'kanakkukaanumkovai'].forEach((lc) => {
      const localList = getLocal(LS_KEYS.AFFIRMATIONS(lc), [])
      if (localList.some((item) => item.id === id)) {
        const updated = localList.map((item) => (item.id === id ? { ...item, reactions: updatedReactions } : item))
        setLocal(LS_KEYS.AFFIRMATIONS(lc), updated)
      }
    })
    return true
  }

  try {
    const { error } = await supabase
      .from('affirmations')
      .update({ reactions: updatedReactions })
      .eq('id', id)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error updating reactions in Supabase:', err)
    return true
  }
}

export async function deleteAffirmationApi(id) {
  // Remove from all LC local storage
  ;['the-x-factors', 'majaraam', 'kanakkukaanumkovai'].forEach((lc) => {
    const localList = getLocal(LS_KEYS.AFFIRMATIONS(lc), [])
    setLocal(LS_KEYS.AFFIRMATIONS(lc), localList.filter((item) => item.id !== id))
  })

  if (!isSupabaseConfigured) return true

  try {
    const { error } = await supabase.from('affirmations').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error('Error deleting affirmation from Supabase:', err)
    return true
  }
}

// ============================================================================
// 3. MISSIONS API (Squad Missions / Action Tracker) — LC filtered
// ============================================================================
export async function fetchMissions(lcName = 'the-x-factors') {
  if (!isSupabaseConfigured) {
    return getLocal(LS_KEYS.MISSIONS(lcName), [])
  }
  try {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('lc_name', lcName)
      .order('created_at', { ascending: false })
    if (error) throw error

    const mapped = (data || []).map((row) => ({
      id: row.id,
      volunteer: row.volunteer_name,
      title: row.title,
      category: row.category || 'General',
      status: row.status || 'todo',
      dueDate: row.due_date,
      createdAt: row.created_at,
      completedAt: row.completed_at
        ? new Date(row.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : undefined,
    }))
    return mapped
  } catch (err) {
    console.error('Error fetching missions from Supabase, falling back to LocalStorage:', err)
    return getLocal(LS_KEYS.MISSIONS(lcName), [])
  }
}

export async function createMission({ volunteer, title, category = 'General', dueDate = 'This Saturday', lcName = 'the-x-factors' }) {
  const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const newMission = {
    id: `mis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    volunteer,
    title: title.trim(),
    category,
    status: 'todo',
    dueDate,
    createdAt: createdDate,
    lc_name: lcName,
  }

  const localList = getLocal(LS_KEYS.MISSIONS(lcName), [])
  setLocal(LS_KEYS.MISSIONS(lcName), [newMission, ...localList])

  if (!isSupabaseConfigured) return newMission

  try {
    const { data, error } = await supabase
      .from('missions')
      .insert({
        volunteer_name: volunteer,
        title: title.trim(),
        category,
        status: 'todo',
        due_date: dueDate,
        lc_name: lcName,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error inserting mission into Supabase:', err)
    return newMission
  }
}

export async function broadcastMissionToAll({ title, category = 'General', dueDate = 'This Saturday', lcName = 'the-x-factors', lcVolunteers }) {
  const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  // lcVolunteers is passed from the hook so it only broadcasts within the active LC's team
  const volunteers = lcVolunteers || teamMembers.map((m) => m.name)

  const broadcastList = volunteers.map((vName, idx) => ({
    id: `mis-bcast-${Date.now()}-${idx}`,
    volunteer: vName,
    title: title.trim(),
    category,
    status: 'todo',
    dueDate,
    createdAt: createdDate,
    lc_name: lcName,
  }))

  const localList = getLocal(LS_KEYS.MISSIONS(lcName), [])
  setLocal(LS_KEYS.MISSIONS(lcName), [...broadcastList, ...localList])

  if (!isSupabaseConfigured) return broadcastList

  try {
    const insertPayload = volunteers.map((vName) => ({
      volunteer_name: vName,
      title: title.trim(),
      category,
      status: 'todo',
      due_date: dueDate,
      lc_name: lcName,
    }))

    const { data, error } = await supabase.from('missions').insert(insertPayload).select()
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error broadcasting missions to Supabase:', err)
    return broadcastList
  }
}

export async function toggleMissionStatusApi(id, newStatus) {
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const localList = getLocal(LS_KEYS.MISSIONS, [])
  const updatedLocal = localList.map((m) =>
    m.id === id ? { ...m, status: newStatus, completedAt: newStatus === 'completed' ? dateStr : undefined } : m
  )
  setLocal(LS_KEYS.MISSIONS, updatedLocal)

  if (!isSupabaseConfigured) return true

  try {
    const { error } = await supabase
      .from('missions')
      .update({
        status: newStatus,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
      })
      .eq('id', id)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error updating mission status in Supabase:', err)
    return true
  }
}

export async function deleteMissionApi(id) {
  const localList = getLocal(LS_KEYS.MISSIONS, [])
  setLocal(
    LS_KEYS.MISSIONS,
    localList.filter((m) => m.id !== id)
  )

  if (!isSupabaseConfigured) return true

  try {
    const { error } = await supabase.from('missions').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error('Error deleting mission from Supabase:', err)
    return true
  }
}

// ============================================================================
// 4. STUDENT LOGS API (Future-Proof Entry System)
// ============================================================================
export async function fetchStudentLogs(studentName = null) {
  if (!isSupabaseConfigured) {
    const logs = getLocal(LS_KEYS.STUDENT_LOGS, [])
    return studentName ? logs.filter((l) => l.student_name === studentName) : logs
  }
  try {
    let query = supabase.from('student_logs').select('*').order('created_at', { ascending: false })
    if (studentName) query = query.eq('student_name', studentName)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching student logs from Supabase:', err)
    return getLocal(LS_KEYS.STUDENT_LOGS, [])
  }
}

export async function submitStudentLog({ student_name, volunteer_name, topics_covered, student_understanding = 'Good', homework_assigned = '', notes = '' }) {
  const newLog = {
    id: `log-${Date.now()}`,
    student_name,
    volunteer_name,
    session_date: new Date().toISOString().split('T')[0],
    topics_covered,
    student_understanding,
    homework_assigned,
    notes,
    created_at: new Date().toISOString(),
  }

  const localLogs = getLocal(LS_KEYS.STUDENT_LOGS, [])
  setLocal(LS_KEYS.STUDENT_LOGS, [newLog, ...localLogs])

  if (!isSupabaseConfigured) return newLog

  try {
    const { data, error } = await supabase.from('student_logs').insert(newLog).select().single()
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error submitting student log to Supabase:', err)
    return newLog
  }
}

// ============================================================================
// 5. GENERIC DYNAMIC STORE API (Universal Extension Layer)
// ============================================================================
export async function fetchEntriesByModule(moduleType) {
  if (!isSupabaseConfigured) {
    const entries = getLocal(LS_KEYS.GENERIC_ENTRIES, [])
    return entries.filter((e) => e.module_type === moduleType)
  }
  try {
    const { data, error } = await supabase
      .from('generic_entries')
      .select('*')
      .eq('module_type', moduleType)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching generic entries from Supabase:', err)
    return getLocal(LS_KEYS.GENERIC_ENTRIES, [])
  }
}

export async function submitEntry(moduleType, authorName, payload) {
  const newEntry = {
    id: `entry-${Date.now()}`,
    module_type: moduleType,
    author_name: authorName,
    payload,
    created_at: new Date().toISOString(),
  }

  const localEntries = getLocal(LS_KEYS.GENERIC_ENTRIES, [])
  setLocal(LS_KEYS.GENERIC_ENTRIES, [newEntry, ...localEntries])

  if (!isSupabaseConfigured) return newEntry

  try {
    const { data, error } = await supabase.from('generic_entries').insert(newEntry).select().single()
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error submitting generic entry to Supabase:', err)
    return newEntry
  }
}

// ============================================================================
// 6. RESOURCES API (Resource Hub Table & Library) — LC filtered
// ============================================================================
export async function fetchResources(lcName = 'the-x-factors') {
  if (!isSupabaseConfigured) {
    const local = getLocal(LS_KEYS.RESOURCES(lcName), null)
    if (!local || local.length === 0) {
      // Seed initial resources only for X Factors
      if (lcName === 'the-x-factors') {
        setLocal(LS_KEYS.RESOURCES(lcName), initialResources)
        return initialResources
      }
      return []
    }
    return local
  }
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('lc_name', lcName)
      .order('created_at', { ascending: false })
    if (error) throw error
    if (!data || data.length === 0) {
      return getLocal(LS_KEYS.RESOURCES(lcName), lcName === 'the-x-factors' ? initialResources : [])
    }
    return data
  } catch (err) {
    console.error('Error fetching resources from Supabase:', err)
    return getLocal(LS_KEYS.RESOURCES(lcName), lcName === 'the-x-factors' ? initialResources : [])
  }
}

export async function postResource({ title, category, grade = 'General', description = '', file_url, file_type = 'PDF', lcName = 'the-x-factors' }) {
  const newRes = {
    id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    category: category.trim(),
    grade: grade.trim(),
    description: description.trim(),
    file_url: file_url.trim(),
    file_type: (file_type || 'PDF').toUpperCase().trim(),
    created_at: new Date().toISOString(),
    lc_name: lcName,
  }

  const localList = getLocal(LS_KEYS.RESOURCES(lcName), lcName === 'the-x-factors' ? initialResources : [])
  setLocal(LS_KEYS.RESOURCES(lcName), [newRes, ...localList])

  if (!isSupabaseConfigured) return newRes

  try {
    const { data, error } = await supabase
      .from('resources')
      .insert({
        title: title.trim(),
        category: category.trim(),
        grade: grade.trim(),
        description: description.trim(),
        file_url: file_url.trim(),
        file_type: (file_type || 'PDF').toUpperCase().trim(),
        lc_name: lcName,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error inserting resource to Supabase:', err)
    return newRes
  }
}

export async function deleteResourceApi(id, lcName = 'the-x-factors') {
  const localList = getLocal(LS_KEYS.RESOURCES(lcName), lcName === 'the-x-factors' ? initialResources : [])
  setLocal(
    LS_KEYS.RESOURCES(lcName),
    localList.filter((item) => item.id !== id)
  )

  if (!isSupabaseConfigured) return true

  try {
    const { error } = await supabase.from('resources').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error('Error deleting resource from Supabase:', err)
    return true
  }
}

// ============================================================================
// 7. REAL-TIME SUBSCRIPTION HELPER
// ============================================================================
export function subscribeToTable(tableName, onChangeCallback) {
  if (!isSupabaseConfigured || !supabase) return () => {}

  const channel = supabase
    .channel(`public:${tableName}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: tableName },
      (payload) => {
        if (typeof onChangeCallback === 'function') {
          onChangeCallback(payload)
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
