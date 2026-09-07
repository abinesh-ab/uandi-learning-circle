// MSS Centre — Learning Circle Configuration
// Central source of truth for all static LC identities

export const LC_SLUGS = {
  X_FACTORS: 'the-x-factors',
  MAJARAAM: 'majaraam',
  KANAKKU: 'kanakkukaanumkovai',
}

export const STATIC_LC_SLUGS = ['the-x-factors', 'majaraam', 'kanakkukaanumkovai']

// Shared default categories for all 3 static LCs
const DEFAULT_RESOURCE_CATEGORIES = [
  '9th Maths',
  'Accountancy',
  'Templates',
  'Curriculum',
  'Pedagogy',
  'Foundational Numeracy',
]

const DEFAULT_MISSION_CATEGORIES = [
  'Student Log',
  'Lesson Plan',
  'Academic Plan',
  'Resource Prep',
  'Admin',
  'General',
]

export const lcConfig = {
  'the-x-factors': {
    slug: 'the-x-factors',
    displayName: 'The X Factors',
    shortName: 'X Factors',
    emoji: '✨',
    color: 'blue',
    accent: 'bg-brand-blue text-white',
    pillActive: 'bg-brand-blue/10 text-brand-blue border-blue-200',
    pillDefault: 'hover:bg-slate-100 text-slate-700 border-slate-200',
    tagline: 'Unlock the Unknown',
    programme: 'Foundational Numeracy & Tuitions + LIFT',
    description: 'Foundational Numeracy, Accountancy & higher secondary tuition for 9th–12th students.',
    hasDecks: true,
    hasOwnHome: true,
    resourceCategories: DEFAULT_RESOURCE_CATEGORIES,
    missionCategories: DEFAULT_MISSION_CATEGORIES,
    enablePasscode: 'x',
    deletePasscode: 'factors',
    isStatic: true,
  },
  majaraam: {
    slug: 'majaraam',
    displayName: 'MajaRaam',
    shortName: 'MajaRaam',
    emoji: '🌟',
    color: 'amber',
    accent: 'bg-amber-500 text-white',
    pillActive: 'bg-amber-100 text-amber-800 border-amber-200',
    pillDefault: 'hover:bg-slate-100 text-slate-700 border-slate-200',
    tagline: 'Learn Together, Grow Together',
    programme: 'Foundational Literacy',
    description: 'Foundational Literacy — reading, comprehension, and early numeracy for primary students.',
    hasDecks: false,
    hasOwnHome: false,
    resourceCategories: DEFAULT_RESOURCE_CATEGORIES,
    missionCategories: DEFAULT_MISSION_CATEGORIES,
    enablePasscode: 'maja',
    deletePasscode: 'raam',
    isStatic: true,
  },
  kanakkukaanumkovai: {
    slug: 'kanakkukaanumkovai',
    displayName: 'KanakkuKaanumKovai',
    shortName: 'KKKovai',
    emoji: '📐',
    color: 'emerald',
    accent: 'bg-emerald-600 text-white',
    pillActive: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    pillDefault: 'hover:bg-slate-100 text-slate-700 border-slate-200',
    tagline: 'Numbers for a Better Tomorrow',
    programme: 'Foundational Numeracy',
    description: 'Foundational Numeracy — building strong maths foundations for government school students.',
    hasDecks: false,
    hasOwnHome: false,
    resourceCategories: DEFAULT_RESOURCE_CATEGORIES,
    missionCategories: DEFAULT_MISSION_CATEGORIES,
    enablePasscode: 'kovai',
    deletePasscode: 'kanakku',
    isStatic: true,
  },
}

// Auto-assign colour palette for dynamic LCs (cycles if more than 8)
export const LC_COLOR_PALETTE = [
  {
    color: 'violet',
    accent: 'bg-violet-600 text-white',
    pillActive: 'bg-violet-100 text-violet-800 border-violet-200',
  },
  {
    color: 'rose',
    accent: 'bg-rose-500 text-white',
    pillActive: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    color: 'cyan',
    accent: 'bg-cyan-600 text-white',
    pillActive: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  {
    color: 'orange',
    accent: 'bg-orange-500 text-white',
    pillActive: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  {
    color: 'indigo',
    accent: 'bg-indigo-600 text-white',
    pillActive: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    color: 'teal',
    accent: 'bg-teal-600 text-white',
    pillActive: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    color: 'pink',
    accent: 'bg-pink-500 text-white',
    pillActive: 'bg-pink-100 text-pink-800 border-pink-200',
  },
  {
    color: 'lime',
    accent: 'bg-lime-600 text-white',
    pillActive: 'bg-lime-100 text-lime-800 border-lime-200',
  },
]

/** Convert a Supabase learning_circles row into lcConfig-compatible meta object */
export function buildLcMeta(row, colourIndex = 0) {
  const palette = LC_COLOR_PALETTE[colourIndex % LC_COLOR_PALETTE.length]
  return {
    slug: row.id,
    displayName: row.name,
    shortName: row.short_name || row.name,
    emoji: row.emoji || '🌟',
    color: palette.color,
    accent: palette.accent,
    pillActive: palette.pillActive,
    pillDefault: 'hover:bg-slate-100 text-slate-700 border-slate-200',
    tagline: row.tagline || '',
    programme: row.programme || 'Foundational Numeracy & Tuitions + LIFT',
    description: row.description || '',
    hasDecks: false,
    hasOwnHome: false,
    resourceCategories:
      Array.isArray(row.resource_categories) && row.resource_categories.length > 0
        ? row.resource_categories
        : ['General'],
    missionCategories:
      Array.isArray(row.mission_categories) && row.mission_categories.length > 0
        ? row.mission_categories
        : ['Student Log', 'Lesson Plan', 'General'],
    enablePasscode: row.enable_passcode || '',
    deletePasscode: row.delete_passcode || '',
    isDynamic: true,
    isStatic: false,
  }
}

export const ALL_LC_SLUGS = Object.keys(lcConfig) // static slugs only; context has merged list
export const VALID_SLUGS = new Set(ALL_LC_SLUGS)

/** Resolve a raw URL param to a valid LC slug. Defaults to 'the-x-factors'. */
export function resolveLcSlug(raw, validSlugs = VALID_SLUGS) {
  if (raw && validSlugs.has(raw)) return raw
  return LC_SLUGS.X_FACTORS
}
