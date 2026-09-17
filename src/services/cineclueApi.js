import { supabase, isSupabaseConfigured } from './supabaseClient'

const TABLE = 'cineclue_puzzles'
const BUCKET = 'cineclue-images'
const LS_KEY = 'mss_cineclue_puzzles'

// ── Default seed puzzles (auto-loaded on first run) ──────────────
const SEED_PUZZLES = [
  {
    id: 'seed-cineclue-1',
    title: 'Kollywood Classic #1',
    category: 'Movie',
    hint: 'Two brothers. One mission. Old school action.',
    hint_image_url: '',
    clues: [
      {
        image_url: 'https://placehold.co/900x560/1e293b/94a3b8?text=Clue+1%3A+Upload+your+image',
        title: 'Clue 1',
        desc: 'Replace with a scene or poster image via Creator Mode',
        timer_seconds: 45,
      },
      {
        image_url: 'https://placehold.co/900x560/0f172a/64748b?text=Clue+2%3A+Upload+your+image',
        title: 'Clue 2',
        desc: 'Replace with another clue image via Creator Mode',
        timer_seconds: 45,
      },
      {
        image_url: 'https://placehold.co/900x560/172554/60a5fa?text=Clue+3%3A+Upload+your+image',
        title: 'Clue 3',
        desc: 'Replace with the strongest clue image',
        timer_seconds: 45,
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

// ── LocalStorage helpers ─────────────────────────────────────────
function getLocal() {
  try {
    const saved = localStorage.getItem(LS_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function setLocal(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch {}
}

// ── Image Compression (Canvas API → JPEG, 900px max, 75% quality) ─
async function compressImageBlob(file, maxDim = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      // Calculate scaled dimensions preserving aspect ratio
      const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1)
      const w = Math.round(img.width * ratio)
      const h = Math.round(img.height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h

      const ctx = canvas.getContext('2d')
      // White background for transparent PNGs
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

/**
 * Compress and upload an image file.
 * - Compresses in-browser to ≤900px JPEG at 75% quality
 * - Uploads to Supabase Storage bucket `cineclue-images`
 * - Falls back to base64 data URL when Supabase is not configured
 *
 * @param {File} file - The raw image file from the file input
 * @param {string} pathPrefix - Folder prefix inside bucket (e.g. 'puzzles')
 * @returns {{ url: string|null, error: string|null }}
 */
export async function compressAndUploadImage(file, pathPrefix = 'puzzles') {
  try {
    const compressed = await compressImageBlob(file, 900, 0.75)

    if (!isSupabaseConfigured) {
      // Offline mode: return base64 so it works in localStorage puzzles
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

    if (uploadError) return { url: null, error: uploadError.message }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    return { url: urlData.publicUrl, error: null }
  } catch (err) {
    return { url: null, error: err.message || 'Upload failed' }
  }
}

// ── Puzzle CRUD ──────────────────────────────────────────────────
export async function fetchCinecluePuzzles() {
  if (!isSupabaseConfigured) {
    const local = getLocal()
    if (!local || local.length === 0) {
      setLocal(SEED_PUZZLES)
      return [...SEED_PUZZLES]
    }
    return local
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    const rows = data || []

    // Auto-seed if Supabase is empty
    if (rows.length === 0) {
      for (const seed of SEED_PUZZLES) {
        await supabase.from(TABLE).upsert(seed, { onConflict: 'id' })
      }
      setLocal(SEED_PUZZLES)
      return [...SEED_PUZZLES]
    }

    setLocal(rows)
    return rows
  } catch (err) {
    console.error('[CineClue] fetch error:', err)
    return getLocal() || [...SEED_PUZZLES]
  }
}

export async function createCinecluePuzzle(puzzle) {
  const row = {
    ...puzzle,
    id: puzzle.id || crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }

  // Always save locally first
  const local = getLocal() || []
  setLocal([...local.filter((r) => r.id !== row.id), row])

  if (!isSupabaseConfigured) return { success: true, row }

  try {
    const { error } = await supabase.from(TABLE).insert(row)
    if (error) throw error
    return { success: true, row }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function updateCinecluePuzzle(id, updates) {
  const local = getLocal() || []
  const updated = local.map((r) => (r.id === id ? { ...r, ...updates } : r))
  setLocal(updated)

  if (!isSupabaseConfigured) return { success: true }

  try {
    const { error } = await supabase.from(TABLE).update(updates).eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function deleteCinecluePuzzle(id) {
  const local = getLocal() || []
  setLocal(local.filter((r) => r.id !== id))

  if (!isSupabaseConfigured) return { success: true }

  try {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
