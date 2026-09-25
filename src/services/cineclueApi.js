import { supabase, isSupabaseConfigured } from './supabaseClient'

const PUZZLES_TABLE = 'cineclue_puzzles'
const DECKS_TABLE = 'cineclue_decks'
const BUCKET = 'cineclue-images'
const LS_PUZZLES_KEY = 'mss_cineclue_puzzles'
const LS_DECKS_KEY = 'mss_cineclue_decks'

// ── UUID validation helper ────────────────────────────────────────
export function isValidUUID(str) {
  if (typeof str !== 'string') return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export function safeUUID(id) {
  return isValidUUID(id) ? id : crypto.randomUUID()
}

// ── Default Decks & Seed Data ─────────────────────────────────────
export const DEFAULT_DECK_ID = '00000000-0000-4000-8000-000000000001'

export const DEFAULT_DECK = {
  id: DEFAULT_DECK_ID,
  title: 'General CineClue Puzzles',
  description: 'Default collection of cinema & music connection puzzles',
  target_audience: 'Centre-wide',
  cover_emoji: '🎬',
  created_by_lc: 'centre',
  created_at: '2026-01-01T00:00:00.000Z',
}

export const SEED_DECKS = [
  DEFAULT_DECK,
  {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'The X Factors Weekly Sync',
    description: 'Curated high-energy icebreaker connection puzzles for squad calls',
    target_audience: 'LC Squad',
    cover_emoji: '🚀',
    created_by_lc: 'the-x-factors',
    created_at: '2026-01-02T00:00:00.000Z',
  },
]

export const SEED_PUZZLES = [
  {
    id: '11111111-1111-4111-8111-111111111001',
    deck_id: DEFAULT_DECK_ID,
    order_index: 0,
    title: 'Kollywood Classic #1',
    category: 'Movie',
    hint: 'Two brothers. One mission. Old school action.',
    hint_image_url: '',
    clues: [
      {
        image_url: 'https://placehold.co/900x560/1e293b/94a3b8?text=Clue+1%3A+Upload+your+image',
        title: 'Clue 1',
        desc: 'Replace with a scene or poster image via Creator Mode',
      },
      {
        image_url: 'https://placehold.co/900x560/0f172a/64748b?text=Clue+2%3A+Upload+your+image',
        title: 'Clue 2',
        desc: 'Replace with another clue image via Creator Mode',
      },
      {
        image_url: 'https://placehold.co/900x560/172554/60a5fa?text=Clue+3%3A+Upload+your+image',
        title: 'Clue 3',
        desc: 'Replace with the strongest clue image',
      },
    ],
    answer: {
      title: 'YOUR ANSWER HERE',
      desc: 'Edit this puzzle in Creator Mode to set the real answer.',
      image_url: '',
    },
    created_at: new Date().toISOString(),
  },
]

// ── LocalStorage Helpers ─────────────────────────────────────────
function sanitizeDecks(list) {
  if (!Array.isArray(list) || list.length === 0) return [...SEED_DECKS]
  const sanitized = list.map((d) => ({
    ...d,
    id: safeUUID(d?.id),
    title: d?.title || 'Untitled Deck',
    cover_emoji: d?.cover_emoji || '🎬',
    target_audience: d?.target_audience || 'Centre-wide',
    created_by_lc: d?.created_by_lc || 'centre',
    created_at: d?.created_at || new Date().toISOString(),
  }))
  if (!sanitized.some((d) => d.id === DEFAULT_DECK_ID)) {
    sanitized.unshift(DEFAULT_DECK)
  }
  return sanitized
}

function sanitizePuzzles(list) {
  if (!Array.isArray(list)) return []
  return list.map((p, idx) => ({
    ...p,
    id: safeUUID(p?.id),
    deck_id: p?.deck_id ? safeUUID(p.deck_id) : DEFAULT_DECK_ID,
    order_index: typeof p?.order_index === 'number' ? p.order_index : idx,
  }))
}

function getLocalDecks() {
  try {
    const saved = localStorage.getItem(LS_DECKS_KEY)
    if (!saved) {
      localStorage.setItem(LS_DECKS_KEY, JSON.stringify(SEED_DECKS))
      return [...SEED_DECKS]
    }
    const parsed = JSON.parse(saved)
    const sanitized = sanitizeDecks(parsed)
    localStorage.setItem(LS_DECKS_KEY, JSON.stringify(sanitized))
    return sanitized
  } catch {
    return [...SEED_DECKS]
  }
}

function setLocalDecks(data) {
  try {
    const sanitized = sanitizeDecks(data)
    localStorage.setItem(LS_DECKS_KEY, JSON.stringify(sanitized))
  } catch {}
}

function getLocalPuzzles() {
  try {
    const saved = localStorage.getItem(LS_PUZZLES_KEY)
    if (!saved) {
      localStorage.setItem(LS_PUZZLES_KEY, JSON.stringify(SEED_PUZZLES))
      return [...SEED_PUZZLES]
    }
    const parsed = JSON.parse(saved)
    const sanitized = sanitizePuzzles(parsed)
    localStorage.setItem(LS_PUZZLES_KEY, JSON.stringify(sanitized))
    return sanitized
  } catch {
    return [...SEED_PUZZLES]
  }
}

function setLocalPuzzles(data) {
  try {
    const sanitized = sanitizePuzzles(data)
    localStorage.setItem(LS_PUZZLES_KEY, JSON.stringify(sanitized))
  } catch {}
}

// ── Image Compression (Canvas API → JPEG, 900px max, 75% quality) ─
async function compressImageBlob(file, maxDim = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1)
      const w = Math.round(img.width * ratio)
      const h = Math.round(img.height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h

      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0, w, h)

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Canvas toBlob failed'))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Image load failed'))
    }
    img.src = objectUrl
  })
}

export async function compressAndUploadImage(file, pathPrefix = 'puzzles') {
  try {
    const compressed = await compressImageBlob(file, 900, 0.75)

    if (!isSupabaseConfigured) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve({ url: e.target.result, error: null })
        reader.onerror = () => resolve({ url: null, error: 'FileReader failed' })
        reader.readAsDataURL(compressed)
      })
    }

    const filename = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, compressed, {
        contentType: 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      console.warn('[CineClue Storage] Upload error, falling back to base64:', uploadError.message)
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve({ url: e.target.result, error: null })
        reader.onerror = () => resolve({ url: null, error: 'FileReader fallback failed' })
        reader.readAsDataURL(compressed)
      })
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    return { url: urlData.publicUrl, error: null }
  } catch (err) {
    return { url: null, error: err.message || 'Upload failed' }
  }
}

// ── Deck CRUD ────────────────────────────────────────────────────
export async function fetchCineclueDecks() {
  const localDecks = getLocalDecks()
  const localPuzzles = getLocalPuzzles()

  // Calculate puzzle counts helper
  const attachCounts = (decks, puzzles) => {
    return decks.map((d) => ({
      ...d,
      puzzle_count: puzzles.filter((p) => p.deck_id === d.id).length,
    }))
  }

  if (!isSupabaseConfigured) {
    return attachCounts(localDecks, localPuzzles)
  }

  try {
    const { data, error } = await supabase
      .from(DECKS_TABLE)
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      // If table doesn't exist yet, gracefully fallback to local
      console.warn('[CineClue Decks] fetch error, falling back to local:', error.message)
      return attachCounts(localDecks, localPuzzles)
    }

    let rows = data || []
    if (rows.length === 0) {
      // Auto-seed default deck in Supabase
      for (const d of SEED_DECKS) {
        await supabase.from(DECKS_TABLE).upsert(d, { onConflict: 'id' }).catch(() => {})
      }
      rows = [...SEED_DECKS]
    }

    // Always ensure DEFAULT_DECK exists
    if (!rows.some((d) => d.id === DEFAULT_DECK_ID)) {
      await supabase.from(DECKS_TABLE).upsert(DEFAULT_DECK, { onConflict: 'id' }).catch(() => {})
      rows.unshift(DEFAULT_DECK)
    }

    setLocalDecks(rows)
    return attachCounts(rows, localPuzzles)
  } catch (err) {
    console.error('[CineClue Decks] fetch exception:', err)
    return attachCounts(localDecks, localPuzzles)
  }
}

export async function createCineclueDeck(deck) {
  const validId = safeUUID(deck.id)
  const row = {
    ...deck,
    id: validId,
    cover_emoji: deck.cover_emoji || '🎬',
    target_audience: deck.target_audience || 'Centre-wide',
    created_by_lc: deck.created_by_lc || 'centre',
    created_at: deck.created_at || new Date().toISOString(),
  }

  const local = getLocalDecks()
  setLocalDecks([...local.filter((d) => d.id !== row.id), row])

  if (!isSupabaseConfigured) return { success: true, row }

  try {
    const { data, error } = await supabase
      .from(DECKS_TABLE)
      .upsert(row)
      .select()
      .single()

    if (error) throw error
    return { success: true, row: data || row }
  } catch (err) {
    console.error('[CineClue Decks] create error:', err)
    // Non-fatal if Supabase table is not yet migrated
    return { success: true, row, warning: err.message }
  }
}

export async function updateCineclueDeck(id, updates) {
  const validId = safeUUID(id)
  const local = getLocalDecks()
  const existing = local.find((d) => d.id === id || d.id === validId) || {}
  const merged = { ...existing, ...updates, id: validId }

  const updatedLocal = local.filter((d) => d.id !== id && d.id !== validId)
  updatedLocal.push(merged)
  setLocalDecks(updatedLocal)

  if (!isSupabaseConfigured) return { success: true, row: merged }

  try {
    const { data, error } = await supabase
      .from(DECKS_TABLE)
      .upsert(merged)
      .select()
      .single()

    if (error) throw error
    return { success: true, row: data || merged }
  } catch (err) {
    console.error('[CineClue Decks] update error:', err)
    return { success: true, row: merged, warning: err.message }
  }
}

export async function deleteCineclueDeck(id) {
  if (id === DEFAULT_DECK_ID) {
    return { success: false, error: 'Cannot delete the default general deck.' }
  }

  // Delete deck and cascade all puzzles inside it
  const localDecks = getLocalDecks().filter((d) => d.id !== id)
  setLocalDecks(localDecks)

  const localPuzzles = getLocalPuzzles().filter((p) => p.deck_id !== id)
  setLocalPuzzles(localPuzzles)

  if (!isSupabaseConfigured) return { success: true }

  try {
    if (isValidUUID(id)) {
      await supabase.from(PUZZLES_TABLE).delete().eq('deck_id', id).catch(() => {})
      const { error } = await supabase.from(DECKS_TABLE).delete().eq('id', id)
      if (error) throw error
    }
    return { success: true }
  } catch (err) {
    console.error('[CineClue Decks] delete error:', err)
    return { success: false, error: err.message }
  }
}

// ── Puzzle CRUD (Deck Scoped) ────────────────────────────────────
export async function fetchCinecluePuzzles(deckId = null) {
  const local = getLocalPuzzles()

  if (!isSupabaseConfigured) {
    if (local.length === 0) {
      setLocalPuzzles(SEED_PUZZLES)
      return deckId ? SEED_PUZZLES.filter((p) => p.deck_id === deckId) : [...SEED_PUZZLES]
    }
    const filtered = deckId ? local.filter((p) => p.deck_id === deckId) : local
    return filtered.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
  }

  try {
    let query = supabase
      .from(PUZZLES_TABLE)
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true })

    if (deckId) {
      query = query.eq('deck_id', deckId)
    }

    const { data, error } = await query

    if (error) throw error

    let rows = data || []

    // If Supabase is empty, auto-seed
    if (rows.length === 0 && (!deckId || deckId === DEFAULT_DECK_ID)) {
      for (const seed of SEED_PUZZLES) {
        await supabase.from(PUZZLES_TABLE).upsert(seed, { onConflict: 'id' }).catch(() => {})
      }
      setLocalPuzzles(SEED_PUZZLES)
      return [...SEED_PUZZLES]
    }

    // Auto-migrate orphan puzzles without a deck_id to DEFAULT_DECK_ID
    const orphans = rows.filter((r) => !r.deck_id)
    if (orphans.length > 0) {
      for (const orphan of orphans) {
        orphan.deck_id = DEFAULT_DECK_ID
        await supabase
          .from(PUZZLES_TABLE)
          .update({ deck_id: DEFAULT_DECK_ID })
          .eq('id', orphan.id)
          .catch(() => {})
      }
    }

    // Sort by order_index
    rows = rows.map((r, idx) => ({
      ...r,
      deck_id: r.deck_id || DEFAULT_DECK_ID,
      order_index: typeof r.order_index === 'number' ? r.order_index : idx,
    })).sort((a, b) => a.order_index - b.order_index)

    // Merge with local state
    if (deckId) {
      const otherPuzzles = local.filter((p) => p.deck_id !== deckId)
      setLocalPuzzles([...otherPuzzles, ...rows])
    } else {
      setLocalPuzzles(rows)
    }

    return rows
  } catch (err) {
    console.error('[CineClue Puzzles] fetch error:', err)
    const filtered = deckId ? local.filter((p) => p.deck_id === deckId) : local
    return filtered.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
  }
}

export async function createCinecluePuzzle(puzzle) {
  const validId = safeUUID(puzzle.id)
  const deckId = puzzle.deck_id ? safeUUID(puzzle.deck_id) : DEFAULT_DECK_ID

  const local = getLocalPuzzles()
  const deckPuzzles = local.filter((p) => p.deck_id === deckId)
  const orderIndex = typeof puzzle.order_index === 'number' ? puzzle.order_index : deckPuzzles.length

  const row = {
    ...puzzle,
    id: validId,
    deck_id: deckId,
    order_index: orderIndex,
    created_at: puzzle.created_at || new Date().toISOString(),
  }

  setLocalPuzzles([...local.filter((r) => r.id !== row.id && r.id !== puzzle.id), row])

  if (!isSupabaseConfigured) return { success: true, row }

  try {
    const { data, error } = await supabase
      .from(PUZZLES_TABLE)
      .upsert(row)
      .select()
      .single()

    if (error) throw error
    return { success: true, row: data || row }
  } catch (err) {
    console.error('[CineClue Puzzles] create error:', err)
    return { success: false, error: err.message }
  }
}

export async function updateCinecluePuzzle(id, updates) {
  const validId = safeUUID(id)
  const local = getLocalPuzzles()
  const existing = local.find((r) => r.id === id || r.id === validId) || {}
  const merged = { ...existing, ...updates, id: validId }

  const updatedLocal = local.filter((r) => r.id !== id && r.id !== validId)
  updatedLocal.push(merged)
  setLocalPuzzles(updatedLocal)

  if (!isSupabaseConfigured) return { success: true, row: merged }

  try {
    const { data, error } = await supabase
      .from(PUZZLES_TABLE)
      .upsert(merged)
      .select()
      .single()

    if (error) throw error
    return { success: true, row: data || merged }
  } catch (err) {
    console.error('[CineClue Puzzles] update error:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteCinecluePuzzle(id) {
  const local = getLocalPuzzles()
  setLocalPuzzles(local.filter((r) => r.id !== id))

  if (!isSupabaseConfigured) return { success: true }

  try {
    if (isValidUUID(id)) {
      const { error } = await supabase.from(PUZZLES_TABLE).delete().eq('id', id)
      if (error) throw error
    }
    return { success: true }
  } catch (err) {
    console.error('[CineClue Puzzles] delete error:', err)
    return { success: false, error: err.message }
  }
}

export async function reorderCinecluePuzzles(deckId, orderedIds) {
  const local = getLocalPuzzles()
  const updatedLocal = local.map((p) => {
    if (p.deck_id === deckId) {
      const newIndex = orderedIds.indexOf(p.id)
      return newIndex !== -1 ? { ...p, order_index: newIndex } : p
    }
    return p
  })
  setLocalPuzzles(updatedLocal)

  if (!isSupabaseConfigured) return { success: true }

  try {
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i]
      if (isValidUUID(id)) {
        await supabase
          .from(PUZZLES_TABLE)
          .update({ order_index: i })
          .eq('id', id)
          .catch(() => {})
      }
    }
    return { success: true }
  } catch (err) {
    console.error('[CineClue Puzzles] reorder error:', err)
    return { success: false, error: err.message }
  }
}
