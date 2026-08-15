export const getAssetUrl = (path) => {
  if (!path) return ''
  const base = import.meta.env.BASE_URL || '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const cleanBase = base.endsWith('/') ? base : base + '/'
  return cleanBase + cleanPath
}
