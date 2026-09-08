import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Plus, Trash2, Lock } from 'lucide-react'
import { useLC } from '../../context/LCContext'
import { STATIC_LC_SLUGS, lcConfig as staticLcConfig } from '../../data/lcConfig'

const PROGRAMMES = [
  'Foundational Numeracy & Tuitions + LIFT',
  'Foundational Literacy',
  'Both Programmes',
]

const EMOJI_OPTIONS = ['🌟', '✨', '🚀', '📐', '📖', '🎯', '🏆', '💡', '🌱', '🔥', '🌻', '🐝', '⚡', '🎨', '🧠', '💎']

const DEFAULT_RESOURCE_CATS = ['Student Materials', 'Templates', 'Curriculum', 'Pedagogy', 'General']
const DEFAULT_MISSION_CATS  = ['Student Log', 'Lesson Plan', 'Class Activity', 'Centre Task', 'General']

function generateSlug(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}

export default function CreateLCModal({ isOpen, onClose, editSlug = null }) {
  const { addDynamicLC, updateDynamicLC, updateStaticLcOverride, allLcConfig, allTeams, dynamicRows } = useLC()

  const isEditMode   = Boolean(editSlug)
  const isStaticEdit = isEditMode && STATIC_LC_SLUGS.includes(editSlug)
  // X Factors: only team roster + categories editable; name/slug/passcodes locked
  const isXFactors   = editSlug === 'the-x-factors'

  // ── Form state ──────────────────────────────────────────────────
  const [name,          setName]         = useState('')
  const [slug,          setSlug]         = useState('')
  const [slugManual,    setSlugManual]   = useState(false)
  const [programme,     setProgramme]    = useState(PROGRAMMES[0])
  const [tagline,       setTagline]      = useState('')
  const [emoji,         setEmoji]        = useState('🌟')
  const [description,   setDescription] = useState('')
  const [enablePasscode,setEnablePasscode] = useState('')
  const [deletePasscode,setDeletePasscode] = useState('')
  const [passcode,      setPasscode]     = useState('')   // admin verification

  const [volunteers,    setVolunteers]   = useState([{ name: '', role: '100% Changemaker', emoji: '✨' }])
  const [resourceCats,  setResourceCats] = useState(DEFAULT_RESOURCE_CATS)
  const [missionCats,   setMissionCats]  = useState(DEFAULT_MISSION_CATS)
  const [newResCat,     setNewResCat]    = useState('')
  const [newMisCat,     setNewMisCat]    = useState('')

  const [error,         setError]        = useState('')
  const [isSubmitting,  setIsSubmitting] = useState(false)
  const [isShaking,     setIsShaking]    = useState(false)
  const [submitted,     setSubmitted]    = useState(false)

  const nameRef = useRef(null)

  // ── Keyboard: Escape closes ─────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // ── Populate form on open ───────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    setError('')
    setIsSubmitting(false)
    setSubmitted(false)
    setPasscode('')
    setIsShaking(false)

    if (isEditMode && editSlug) {
      // For static LCs, load from merged context (base + any saved overrides)
      // For dynamic LCs, load from dynamicRows
      const lcMeta = allLcConfig[editSlug]
      const teamData = allTeams[editSlug] || []

      if (lcMeta) {
        setName(lcMeta.displayName || '')
        setSlug(lcMeta.slug || editSlug)
        setSlugManual(true)
        setProgramme(lcMeta.programme || PROGRAMMES[0])
        setTagline(lcMeta.tagline || '')
        setEmoji(lcMeta.emoji || '🌟')
        setDescription(lcMeta.description || '')
        setEnablePasscode(lcMeta.enablePasscode || '')
        setDeletePasscode(lcMeta.deletePasscode || '')
        setResourceCats(lcMeta.resourceCategories?.length ? lcMeta.resourceCategories : DEFAULT_RESOURCE_CATS)
        setMissionCats(lcMeta.missionCategories?.length ? lcMeta.missionCategories : DEFAULT_MISSION_CATS)
      }

      // Build volunteer list from team data
      setVolunteers(
        teamData.length > 0
          ? teamData.map((m) => ({
              id: m.id,
              name: m.name || '',
              role: m.role || '100% Changemaker',
              emoji: m.emoji || '✨',
            }))
          : [{ name: '', role: '100% Changemaker', emoji: '✨' }]
      )
    } else {
      // New LC — reset all
      setName('')
      setSlug('')
      setSlugManual(false)
      setProgramme(PROGRAMMES[0])
      setTagline('')
      setEmoji('🌟')
      setDescription('')
      setEnablePasscode('')
      setDeletePasscode('')
      setVolunteers([{ name: '', role: '100% Changemaker', emoji: '✨' }])
      setResourceCats([...DEFAULT_RESOURCE_CATS])
      setMissionCats([...DEFAULT_MISSION_CATS])
      setTimeout(() => nameRef.current?.focus(), 100)
    }
  }, [isOpen, isEditMode, editSlug, allLcConfig, allTeams])

  // Auto-generate slug from name (new LC only)
  useEffect(() => {
    if (!slugManual && name && !isStaticEdit) {
      setSlug(generateSlug(name))
    }
  }, [name, slugManual, isStaticEdit])

  if (!isOpen) return null

  // ── Volunteer roster helpers ────────────────────────────────────
  const addVolunteer    = () => setVolunteers((v) => [...v, { name: '', role: '100% Changemaker', emoji: '✨' }])
  const removeVolunteer = (i) => setVolunteers((v) => v.filter((_, idx) => idx !== i))
  const updateVolunteer = (i, field, val) =>
    setVolunteers((v) => v.map((vol, idx) => (idx === i ? { ...vol, [field]: val } : vol)))

  // ── Category helpers ────────────────────────────────────────────
  const addResCat = () => {
    const t = newResCat.trim()
    if (t && !resourceCats.includes(t)) { setResourceCats((c) => [...c, t]); setNewResCat('') }
  }
  const removeResCat = (cat) => setResourceCats((c) => c.filter((x) => x !== cat))
  const addMisCat = () => {
    const t = newMisCat.trim()
    if (t && !missionCats.includes(t)) { setMissionCats((c) => [...c, t]); setNewMisCat('') }
  }
  const removeMisCat = (cat) => setMissionCats((c) => c.filter((x) => x !== cat))

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsShaking(false)

    // Admin verification — always 'factors'
    const cleanPass = passcode.trim().toLowerCase()
    if (cleanPass !== 'factors') {
      setError('Incorrect verification')
      setIsShaking(true)
      return
    }

    if (!name.trim()) { setError('Learning Circle name is required.'); return }

    // For new dynamic LCs only: check slug uniqueness
    if (!isEditMode) {
      if (!slug.trim()) { setError('URL slug is required.'); return }
      if (!enablePasscode.trim()) { setError('Enable passcode is required.'); return }
      if (!deletePasscode.trim()) { setError('Delete passcode is required.'); return }
      if (allLcConfig[slug.trim()]) {
        setError(`Slug "${slug}" is already in use. Choose a different one.`)
        return
      }
    }

    const filteredVolunteers = volunteers
      .filter((v) => v.name.trim())
      .map((v, i) => ({
        id: v.id || `${slug || editSlug}-m${i}`,
        name: v.name.trim(),
        role: v.role || '100% Changemaker',
        emoji: v.emoji || '✨',
        avatarText: v.name.trim().slice(0, 2).toUpperCase(),
        specialty: 'Changemaker',
        desc: `Bringing energy and dedication to every session.`,
      }))

    setIsSubmitting(true)
    try {
      let result

      if (isStaticEdit) {
        // Save override for a static LC to localStorage
        const overrideData = {
          tagline:            tagline.trim(),
          description:        description.trim(),
          emoji,
          programme,
          // Only update passcodes for non-X-Factors static LCs
          ...(isXFactors ? {} : {
            enablePasscode: enablePasscode.trim(),
            deletePasscode: deletePasscode.trim(),
          }),
          resourceCategories: resourceCats.filter(Boolean),
          missionCategories:  missionCats.filter(Boolean),
          team_data:          filteredVolunteers,
        }
        updateStaticLcOverride(editSlug, overrideData)
        result = { success: true }
      } else if (isEditMode) {
        // Update a dynamic LC
        const formData = {
          id:                  editSlug,
          name:                name.trim(),
          short_name:          name.trim(),
          programme,
          tagline:             tagline.trim(),
          emoji,
          description:         description.trim(),
          team_data:           filteredVolunteers,
          resource_categories: resourceCats.filter(Boolean),
          mission_categories:  missionCats.filter(Boolean),
          enable_passcode:     enablePasscode.trim(),
          delete_passcode:     deletePasscode.trim(),
        }
        result = await updateDynamicLC(editSlug, formData)
      } else {
        // Create a new dynamic LC
        const formData = {
          id:                  slug.trim(),
          name:                name.trim(),
          short_name:          name.trim(),
          programme,
          tagline:             tagline.trim(),
          emoji,
          description:         description.trim(),
          team_data:           filteredVolunteers,
          resource_categories: resourceCats.filter(Boolean),
          mission_categories:  missionCats.filter(Boolean),
          enable_passcode:     enablePasscode.trim(),
          delete_passcode:     deletePasscode.trim(),
        }
        result = await addDynamicLC(formData)
      }

      if (result.success) {
        setSubmitted(true)
        setTimeout(() => { onClose(); setSubmitted(false) }, 1500)
      } else {
        setError(result.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    /* ── Backdrop — closes on click ─────────────────────────────── */
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* ── Modal card — swallow clicks so backdrop doesn't fire ── */}
      <div
        className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-brand-blue" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 font-heading">
                {isEditMode
                  ? `Edit — ${allLcConfig[editSlug]?.displayName || editSlug}`
                  : 'Setup New Learning Circle'}
              </h2>
              <p className="text-[10px] text-slate-400">
                {isStaticEdit ? 'Admin override · slug locked' : 'Admin access required'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="text-5xl">🎉</div>
              <p className="font-black text-slate-900 text-lg">
                {isEditMode ? 'Learning Circle Updated!' : 'Learning Circle Created!'}
              </p>
              <p className="text-slate-500 text-sm">It now appears in the hub and navigation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Identity ────────────────────────────────────── */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Identity</h3>

                {/* Emoji picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Squad Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        disabled={isXFactors}
                        className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${emoji === e ? 'border-brand-blue bg-blue-50 scale-110' : 'border-slate-200 hover:border-slate-300'} ${isXFactors ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* LC Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">LC Name *</label>
                    <input
                      ref={nameRef}
                      type="text"
                      required
                      placeholder="e.g. Kovai Rockstars"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isStaticEdit}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* URL Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">URL Slug{!isStaticEdit && ' *'}</label>
                    <input
                      type="text"
                      required={!isStaticEdit}
                      placeholder="e.g. kovai-rockstars"
                      value={slug}
                      onChange={(e) => { setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')); setSlugManual(true) }}
                      disabled={isStaticEdit}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-brand-blue disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400">?lc={slug || 'your-slug'}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Programme</label>
                  <select
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    disabled={isXFactors}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {PROGRAMMES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Rise Every Saturday"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Short Description</label>
                    <input
                      type="text"
                      placeholder="One line about this LC"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>
              </div>

              {/* ── Passcodes (not shown for X Factors) ─────────── */}
              {!isXFactors && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Access Controls</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Enable Passcode *</label>
                      <input
                        type="text"
                        required={!isStaticEdit}
                        placeholder="Shared with volunteers"
                        value={enablePasscode}
                        onChange={(e) => setEnablePasscode(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                      />
                      <p className="text-[10px] text-slate-400">For adding content — share with team</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Delete Passcode *</label>
                      <input
                        type="text"
                        required={!isStaticEdit}
                        placeholder="Keep private (LC leader only)"
                        value={deletePasscode}
                        onChange={(e) => setDeletePasscode(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                      />
                      <p className="text-[10px] text-slate-400">For deletions — LC leader only</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Volunteer Roster ─────────────────────────────── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Volunteer Roster</h3>
                  <button
                    type="button"
                    onClick={addVolunteer}
                    className="flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-blue-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Volunteer
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {volunteers.map((vol, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <select
                        value={vol.emoji}
                        onChange={(e) => updateVolunteer(i, 'emoji', e.target.value)}
                        className="bg-transparent text-base border-0 focus:outline-none cursor-pointer min-w-[2rem]"
                      >
                        {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <input
                        type="text"
                        placeholder="Volunteer name"
                        value={vol.name}
                        onChange={(e) => updateVolunteer(i, 'name', e.target.value)}
                        className="flex-1 bg-transparent text-xs font-bold text-slate-900 focus:outline-none placeholder-slate-400 min-h-[44px]"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={vol.role}
                        onChange={(e) => updateVolunteer(i, 'role', e.target.value)}
                        className="w-32 hidden sm:block bg-transparent text-xs text-slate-500 focus:outline-none placeholder-slate-300"
                      />
                      {volunteers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVolunteer(i)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Resource Categories ──────────────────────────── */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Resource Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {resourceCats.map((cat) => (
                    <span key={cat} className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                      {cat}
                      <button type="button" onClick={() => removeResCat(cat)} className="text-blue-400 hover:text-rose-500 ml-0.5 min-h-[24px] min-w-[16px]">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add category..."
                    value={newResCat}
                    onChange={(e) => setNewResCat(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addResCat())}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                  />
                  <button type="button" onClick={addResCat} className="px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors min-h-[44px]">Add</button>
                </div>
              </div>

              {/* ── Mission Categories ───────────────────────────── */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Mission / Task Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {missionCats.map((cat) => (
                    <span key={cat} className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      {cat}
                      <button type="button" onClick={() => removeMisCat(cat)} className="text-emerald-400 hover:text-rose-500 ml-0.5 min-h-[24px] min-w-[16px]">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add category..."
                    value={newMisCat}
                    onChange={(e) => setNewMisCat(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMisCat())}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                  />
                  <button type="button" onClick={addMisCat} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors min-h-[44px]">Add</button>
                </div>
              </div>

              {/* ── Admin Verification ───────────────────────────── */}
              <div className="space-y-1.5 p-4 rounded-2xl border border-amber-200 bg-amber-50">
                <input
                  type="password"
                  placeholder="Admin verification"
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); setError(''); setIsShaking(false) }}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold text-center text-slate-900 focus:outline-none transition-all min-h-[48px] ${isShaking ? 'border-rose-400 bg-rose-50 animate-pulse' : 'border-amber-300 bg-white focus:border-amber-500'}`}
                />
                {error && <p className="text-xs text-rose-600 font-bold text-center pt-1">{error}</p>}
              </div>

              {/* ── Actions ──────────────────────────────────────── */}
              <div className="flex gap-3 pb-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-brand-blue hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 min-h-[48px]"
                >
                  {isSubmitting ? 'Saving…' : isEditMode ? 'Update LC' : 'Create LC'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
