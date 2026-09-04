import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { resolveLcSlug, lcConfig, ALL_LC_SLUGS } from '../data/lcConfig'

// ── LC Context ────────────────────────────────────────────────
const LCContext = createContext(null)

/** Read current LC slug from URL query param ?lc=... */
function readLcFromURL() {
  try {
    const params = new URLSearchParams(window.location.search)
    return resolveLcSlug(params.get('lc'))
  } catch {
    return 'the-x-factors'
  }
}

/** Write LC slug to URL without page reload */
function writeLcToURL(slug) {
  try {
    const url = new URL(window.location.href)
    url.searchParams.set('lc', slug)
    window.history.replaceState(null, '', url.toString())
  } catch {
    // ignore in environments without history API
  }
}

export function LCProvider({ children }) {
  const [activeLc, setActiveLcState] = useState(() => readLcFromURL())

  /** Switch active LC — updates state AND URL param */
  const setActiveLc = useCallback((slug) => {
    const resolved = resolveLcSlug(slug)
    setActiveLcState(resolved)
    writeLcToURL(resolved)
  }, [])

  // On mount, ensure URL param is set (handles direct visits without ?lc=)
  useEffect(() => {
    writeLcToURL(activeLc)
  }, [activeLc])

  const activeLcMeta = lcConfig[activeLc] || lcConfig['the-x-factors']

  return (
    <LCContext.Provider value={{ activeLc, setActiveLc, activeLcMeta, lcConfig, ALL_LC_SLUGS }}>
      {children}
    </LCContext.Provider>
  )
}

/** Hook: consume LC context anywhere in the tree */
export function useLC() {
  const ctx = useContext(LCContext)
  if (!ctx) throw new Error('useLC must be used inside <LCProvider>')
  return ctx
}
