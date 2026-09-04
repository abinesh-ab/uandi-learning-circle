// MSS Centre — Learning Circle Configuration
// Central source of truth for all 3 LC identities

export const LC_SLUGS = {
  X_FACTORS: 'the-x-factors',
  MAJARAAM: 'majaraam',
  KANAKKU: 'kanakkukaanumkovai',
}

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
    hasDecks: true,
    hasOwnHome: true,
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
    hasDecks: false,
    hasOwnHome: false,
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
    hasDecks: false,
    hasOwnHome: false,
  },
}

export const ALL_LC_SLUGS = Object.keys(lcConfig)

export const VALID_SLUGS = new Set(ALL_LC_SLUGS)

/** Resolve a raw URL param value to a valid LC slug. Defaults to 'the-x-factors'. */
export function resolveLcSlug(raw) {
  if (raw && VALID_SLUGS.has(raw)) return raw
  return LC_SLUGS.X_FACTORS
}
