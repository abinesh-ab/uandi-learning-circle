import { supabase, isSupabaseConfigured } from './supabaseClient'
import { teamMembers } from '../data/teamData'

// LocalStorage Keys for Fallback Mode
const LS_KEYS = {
  AFFIRMATIONS: 'xfactors_gratitude_vault',
  MISSIONS: 'xfactors_squad_missions',
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
// 2. AFFIRMATIONS API (The Gratitude Vault)
// ============================================================================
export async function fetchAffirmations() {
  if (!isSupabaseConfigured) {
    return getLocal(LS_KEYS.AFFIRMATIONS, [])
  }
  try {
    const { data, error } = await supabase.from('affirmations').select('*').order('created_at', { ascending: false })
    if (error) throw error
    
    // Map database column names to component expected structure
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
    return getLocal(LS_KEYS.AFFIRMATIONS, [])
  }
}

export async function postAffirmation({ recipient, sender, message, color = 'amber' }) {
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
  }

  // Always sync to LocalStorage as fallback
  const localList = getLocal(LS_KEYS.AFFIRMATIONS, [])
  setLocal(LS_KEYS.AFFIRMATIONS, [newAff, ...localList])

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

  // LocalStorage sync
  const localList = getLocal(LS_KEYS.AFFIRMATIONS, [])
  const updatedLocal = localList.map((item) => (item.id === id ? { ...item, reactions: updatedReactions } : item))
  setLocal(LS_KEYS.AFFIRMATIONS, updatedLocal)

  if (!isSupabaseConfigured) return true

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
  const localList = getLocal(LS_KEYS.AFFIRMATIONS, [])
  setLocal(
    LS_KEYS.AFFIRMATIONS,
    localList.filter((item) => item.id !== id)
  )

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
// 3. MISSIONS API (Squad Missions / Action Tracker)
// ============================================================================
export async function fetchMissions() {
  if (!isSupabaseConfigured) {
    return getLocal(LS_KEYS.MISSIONS, [])
  }
  try {
    const { data, error } = await supabase.from('missions').select('*').order('created_at', { ascending: false })
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
    return getLocal(LS_KEYS.MISSIONS, [])
  }
}

export async function createMission({ volunteer, title, category = 'General', dueDate = 'This Saturday' }) {
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

  const localList = getLocal(LS_KEYS.MISSIONS, [])
  setLocal(LS_KEYS.MISSIONS, [newMission, ...localList])

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

export async function broadcastMissionToAll({ title, category = 'General', dueDate = 'This Saturday' }) {
  const createdDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const volunteers = teamMembers.map((m) => m.name)

  const broadcastList = volunteers.map((vName, idx) => ({
    id: `mis-bcast-${Date.now()}-${idx}`,
    volunteer: vName,
    title: title.trim(),
    category,
    status: 'todo',
    dueDate,
    createdAt: createdDate,
  }))

  const localList = getLocal(LS_KEYS.MISSIONS, [])
  setLocal(LS_KEYS.MISSIONS, [...broadcastList, ...localList])

  if (!isSupabaseConfigured) return broadcastList

  try {
    const insertPayload = volunteers.map((vName) => ({
      volunteer_name: vName,
      title: title.trim(),
      category,
      status: 'todo',
      due_date: dueDate,
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
// 6. REAL-TIME SUBSCRIPTION HELPER
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
