import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { resolveLcSlug, lcConfig as staticLcConfig, ALL_LC_SLUGS as STATIC_ALL_SLUGS } from '../data/lcConfig'
import { STATIC_TEAMS } from '../data/teamData'
import { useDynamicLCs } from '../hooks/useDynamicLCs'

const LCContext = createContext(null)

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

export function LCProvider({ children }) {
  const [activeLcRaw, setActiveLcRaw] = useState(() => readLcFromURL())
  const {
    dynamicLcConfig,
    dynamicTeams,
    dynamicRows,
    isLoading: dynamicLoading,
    addDynamicLC,
    updateDynamicLC,
  } = useDynamicLCs()

  // Merged LC config: static entries always take priority over dynamic
  const allLcConfig = useMemo(
    () => ({ ...dynamicLcConfig, ...staticLcConfig }),
    [dynamicLcConfig]
  )

  // Merged teams: static always wins
  const allTeams = useMemo(
    () => ({ ...dynamicTeams, ...STATIC_TEAMS }),
    [dynamicTeams]
  )

  // Merged slug list: static first, then dynamic (deduped)
  const allLcSlugs = useMemo(() => {
    const dynamicSlugs = Object.keys(dynamicLcConfig)
    return [...STATIC_ALL_SLUGS, ...dynamicSlugs]
  }, [dynamicLcConfig])

  const allValidSlugs = useMemo(() => new Set(allLcSlugs), [allLcSlugs])

  // Resolve activeLc — falls back to the-x-factors if slug not yet in merged list
  const activeLc = useMemo(
    () => resolveLcSlug(activeLcRaw, allValidSlugs),
    [activeLcRaw, allValidSlugs]
  )

  const setActiveLc = useCallback((slug) => {
    setActiveLcRaw(slug)
    writeLcToURL(slug)
  }, [])

  // Keep URL in sync whenever activeLc changes
  useEffect(() => {
    writeLcToURL(activeLc)
  }, [activeLc])

  const activeLcMeta = allLcConfig[activeLc] || staticLcConfig['the-x-factors']

  // Passcode validators for the currently active LC
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
      validateEnablePasscode,
      validateDeletePasscode,
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
      validateEnablePasscode,
      validateDeletePasscode,
    ]
  )

  return <LCContext.Provider value={contextValue}>{children}</LCContext.Provider>
}

export function useLC() {
  const ctx = useContext(LCContext)
  if (!ctx) throw new Error('useLC must be used inside <LCProvider>')
  return ctx
}
