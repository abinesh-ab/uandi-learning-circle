import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import {
  resolveLcSlug,
  lcConfig as staticLcConfig,
  ALL_LC_SLUGS as STATIC_ALL_SLUGS,
  STATIC_LC_SLUGS,
} from '../data/lcConfig'
import { STATIC_TEAMS } from '../data/teamData'
import { useDynamicLCs } from '../hooks/useDynamicLCs'

const LCContext = createContext(null)

// ── LocalStorage helpers for static LC overrides ────────────────
const STATIC_OVERRIDE_KEY = 'mss_static_lc_overrides'
const OVERRIDE_EVENT = 'mss_lc_override_updated'

function readStaticOverrides() {
  try {
    const raw = localStorage.getItem(STATIC_OVERRIDE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveStaticOverrides(overrides) {
  try {
    localStorage.setItem(STATIC_OVERRIDE_KEY, JSON.stringify(overrides))
  } catch {}
}

// ── URL sync helpers ─────────────────────────────────────────────
function readLcFromURL() {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('lc') || 'the-x-factors'
  } catch {
    return 'the-x-factors'
  }
}

function writeLcToURL(slug) {
  try {
    const url = new URL(window.location.href)
    url.searchParams.set('lc', slug)
    window.history.replaceState(null, '', url.toString())
  } catch {}
}

// ── Build merged static config with overrides applied ───────────
function buildMergedStaticConfig(overrides) {
  const merged = {}
  STATIC_LC_SLUGS.forEach((slug) => {
    const base = staticLcConfig[slug]
    const override = overrides[slug] || {}
    merged[slug] = {
      ...base,
      ...override,
      // Always preserve identity fields from base for static LCs
      slug: base.slug,
      enablePasscode: override.enablePasscode || base.enablePasscode,
      deletePasscode: override.deletePasscode || base.deletePasscode,
      hasDecks: base.hasDecks,
      hasOwnHome: base.hasOwnHome,
      isStatic: true,
    }
  })
  return merged
}

// ── Build merged static teams with overrides applied ────────────
function buildMergedStaticTeams(overrides) {
  const merged = { ...STATIC_TEAMS }
  STATIC_LC_SLUGS.forEach((slug) => {
    const teamOverride = overrides[slug]?.team_data
    if (Array.isArray(teamOverride) && teamOverride.length > 0) {
      // Convert stored team_data format to teamData.js format
      merged[slug] = teamOverride.map((m, i) => ({
        id: m.id || `${slug}-m${i}`,
        name: m.name || '',
        role: m.role || '100% Changemaker',
        focus: m.specialty || 'Learning Circle',
        desc: m.desc || `Bringing energy and dedication to every session.`,
        avatarColor: `from-slate-500 to-slate-700`,
        avatarText: m.avatarText || (m.name ? m.name.slice(0, 2).toUpperCase() : '??'),
        photo: m.photo || '',
        specialty: m.specialty || 'Changemaker',
        emoji: m.emoji || '🌟',
      }))
    }
  })
  return merged
}

// ── Provider ─────────────────────────────────────────────────────
export function LCProvider({ children }) {
  const [activeLcRaw, setActiveLcRaw] = useState(() => readLcFromURL())
  const [staticOverrides, setStaticOverrides] = useState(() => readStaticOverrides())

  const {
    dynamicLcConfig,
    dynamicTeams,
    dynamicRows,
    isLoading: dynamicLoading,
    addDynamicLC,
    updateDynamicLC,
  } = useDynamicLCs()

  // Listen for override updates (from CreateLCModal saving static edits)
  useEffect(() => {
    const handler = () => setStaticOverrides(readStaticOverrides())
    window.addEventListener(OVERRIDE_EVENT, handler)
    return () => window.removeEventListener(OVERRIDE_EVENT, handler)
  }, [])

  // Merged static config (base + overrides)
  const mergedStaticConfig = useMemo(
    () => buildMergedStaticConfig(staticOverrides),
    [staticOverrides]
  )

  // Merged static teams (base + overrides)
  const mergedStaticTeams = useMemo(
    () => buildMergedStaticTeams(staticOverrides),
    [staticOverrides]
  )

  // All LC config: dynamic < mergedStatic (static always wins slug conflicts)
  const allLcConfig = useMemo(
    () => ({ ...dynamicLcConfig, ...mergedStaticConfig }),
    [dynamicLcConfig, mergedStaticConfig]
  )

  // All teams: dynamic < mergedStatic
  const allTeams = useMemo(
    () => ({ ...dynamicTeams, ...mergedStaticTeams }),
    [dynamicTeams, mergedStaticTeams]
  )

  // All slugs: static first, then dynamic
  const allLcSlugs = useMemo(() => {
    const dynamicSlugs = Object.keys(dynamicLcConfig)
    return [...STATIC_ALL_SLUGS, ...dynamicSlugs]
  }, [dynamicLcConfig])

  const allValidSlugs = useMemo(() => new Set(allLcSlugs), [allLcSlugs])

  const activeLc = useMemo(
    () => resolveLcSlug(activeLcRaw, allValidSlugs),
    [activeLcRaw, allValidSlugs]
  )

  const setActiveLc = useCallback((slug) => {
    setActiveLcRaw(slug)
    writeLcToURL(slug)
  }, [])

  useEffect(() => {
    writeLcToURL(activeLc)
  }, [activeLc])

  const activeLcMeta = allLcConfig[activeLc] || staticLcConfig['the-x-factors']

  // Passcode validators for the active LC
  const validateEnablePasscode = useCallback(
    (passcode) => {
      const clean = (passcode || '').trim().toLowerCase()
      return clean === (activeLcMeta.enablePasscode || '').toLowerCase()
    },
    [activeLcMeta]
  )

  const validateDeletePasscode = useCallback(
    (passcode) => {
      const clean = (passcode || '').trim().toLowerCase()
      return clean === (activeLcMeta.deletePasscode || '').toLowerCase()
    },
    [activeLcMeta]
  )

  // ── Save an override for a STATIC LC ───────────────────────────
  const updateStaticLcOverride = useCallback((slug, overrideData) => {
    if (!STATIC_LC_SLUGS.includes(slug)) return
    const current = readStaticOverrides()
    const updated = { ...current, [slug]: { ...(current[slug] || {}), ...overrideData } }
    saveStaticOverrides(updated)
    setStaticOverrides(updated)
    // Notify other components (e.g., if multiple hooks listen)
    window.dispatchEvent(new CustomEvent(OVERRIDE_EVENT))
  }, [])

  const contextValue = useMemo(
    () => ({
      activeLc,
      setActiveLc,
      activeLcMeta,
      allLcConfig,
      allLcSlugs,
      allTeams,
      dynamicRows,
      dynamicLoading,
      addDynamicLC,
      updateDynamicLC,
      updateStaticLcOverride,
      validateEnablePasscode,
      validateDeletePasscode,
      staticOverrides,
      // Backward-compat aliases
      lcConfig: allLcConfig,
      ALL_LC_SLUGS: allLcSlugs,
    }),
    [
      activeLc,
      setActiveLc,
      activeLcMeta,
      allLcConfig,
      allLcSlugs,
      allTeams,
      dynamicRows,
      dynamicLoading,
      addDynamicLC,
      updateDynamicLC,
      updateStaticLcOverride,
      validateEnablePasscode,
      validateDeletePasscode,
      staticOverrides,
    ]
  )

  return <LCContext.Provider value={contextValue}>{children}</LCContext.Provider>
}

export function useLC() {
  const ctx = useContext(LCContext)
  if (!ctx) throw new Error('useLC must be used inside <LCProvider>')
  return ctx
}
