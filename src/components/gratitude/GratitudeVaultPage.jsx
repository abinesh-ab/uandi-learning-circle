import { useState, useMemo } from 'react'
import { Heart, Sparkles, Plus, Trash2, Send, X, Lock, Filter, Check, Database, HardDrive } from 'lucide-react'
import { teamMembers } from '../../data/teamData'
import { useGratitudeVault } from '../../hooks/useGratitudeVault'
import AdminDeleteModal from '../common/AdminDeleteModal'

const COLOR_MAP = {
  amber: {
    bg: 'bg-amber-50/90 hover:bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-950',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    accent: 'text-amber-600',
  },
  rose: {
    bg: 'bg-rose-50/90 hover:bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-950',
    badge: 'bg-rose-100 text-rose-900 border-rose-300',
    accent: 'text-rose-600',
  },
  blue: {
    bg: 'bg-blue-50/90 hover:bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-950',
    badge: 'bg-blue-100 text-blue-900 border-blue-300',
    accent: 'text-blue-600',
  },
  emerald: {
    bg: 'bg-emerald-50/90 hover:bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-950',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    accent: 'text-emerald-600',
  },
  purple: {
    bg: 'bg-purple-50/90 hover:bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-950',
    badge: 'bg-purple-100 text-purple-900 border-purple-300',
    accent: 'text-purple-600',
  },
}

const QUICK_EMOJIS = ['🌟', '🌻', '🐝', '🚀', '❤️', '👏', '🧠', '🤝', '🔥', '💡', '👑']

export default function GratitudeVaultPage({ showMode }) {
  const { affirmations, isLoading, isSupabaseConfigured, savedSender, addAffirmation, toggleReaction, deleteAffirmation } =
    useGratitudeVault()

  const [selectedVolunteer, setSelectedVolunteer] = useState('ALL') // 'ALL' | volunteer name
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [targetDeleteId, setTargetDeleteId] = useState(null)
  const [passcode, setPasscode] = useState('')

  // Form State
  const [recipient, setRecipient] = useState(teamMembers[0]?.name || 'Aravinth')
  const [message, setMessage] = useState('')
  const [sender, setSender] = useState(savedSender || '')
  const [selectedColor, setSelectedColor] = useState('amber')

  // Volunteers List
  const volunteerNames = useMemo(() => {
    const names = teamMembers.map((m) => m.name)
    return [...names, 'Entire Tribe']
  }, [])

  // Filtered Affirmations
  const filteredAffirmations = useMemo(() => {
    if (selectedVolunteer === 'ALL') return affirmations
    return affirmations.filter((a) => a.recipient === selectedVolunteer)
  }, [affirmations, selectedVolunteer])

  // Count affirmations per volunteer
  const countsPerVolunteer = useMemo(() => {
    const counts = {}
    affirmations.forEach((a) => {
      counts[a.recipient] = (counts[a.recipient] || 0) + 1
    })
    return counts
  }, [affirmations])

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim() || !sender.trim()) return

    const success = addAffirmation({
      recipient,
      message,
      sender,
      color: selectedColor,
    })

    if (success) {
      setMessage('')
      setIsModalOpen(false)
    }
  }

  // Handle Delete Confirmation (Passcode: 'factors')
  const confirmDelete = async (passcode) => {
    if (!targetDeleteId) return { error: 'No note selected' }
    const success = await deleteAffirmation(targetDeleteId, passcode)
    return { success, error: success ? null : 'Invalid passcode' }
  }

  return (
    <div className="relative min-h-screen pt-14 pb-20 px-4 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Subtle Floating Bees & Sunflowers Background Accents */}
      <div className="absolute top-10 left-6 text-2xl opacity-25 float-anim select-none pointer-events-none" style={{ animationDelay: '0s' }}>
        🐝
      </div>
      <div className="absolute top-16 right-10 text-3xl opacity-25 float-slow select-none pointer-events-none" style={{ animationDelay: '1.2s' }}>
        🌻
      </div>
      <div className="absolute top-36 left-1/4 text-xl opacity-20 float-anim select-none pointer-events-none" style={{ animationDelay: '0.7s' }}>
        🌻
      </div>
      <div className="absolute top-44 right-1/4 text-2xl opacity-25 float-slow select-none pointer-events-none" style={{ animationDelay: '1.8s' }}>
        🐝
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-2.5 max-w-3xl mx-auto relative z-10">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> The Gratitude Vault <span className="text-amber-500">🐝 🌻</span>
          </div>

          {/* Database Mode Status Indicator */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              isSupabaseConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {isSupabaseConfigured ? (
              <>
                <Database className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>Supabase Realtime Cloud</span>
              </>
            ) : (
              <>
                <HardDrive className="w-3 h-3 text-amber-600" />
                <span>Local Storage Mode</span>
              </>
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading">
          OUR SQUAD <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-500 to-brand-blue">KUDOS &amp; LOVE</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          A permanent home for peer affirmations, appreciations, and warmth. Celebrate your fellow X Factors and leave a lasting memory of gratitude.
        </p>

        {/* Primary Action Button */}
        <div className="pt-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-7 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-rose-500/25 hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Give Affirmation ✨</span>
          </button>
        </div>
      </div>

      {/* Volunteer Selector / Avatar Strip */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter by Volunteer Wall
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {filteredAffirmations.length} {filteredAffirmations.length === 1 ? 'Note' : 'Notes'} Shown
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none">
          {/* All Tribe Pill */}
          <button
            onClick={() => setSelectedVolunteer('ALL')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-2 border shadow-sm ${
              selectedVolunteer === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 scale-105 ring-2 ring-rose-400'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>✨ All Tribe</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono">
              {affirmations.length}
            </span>
          </button>

          {/* Individual Volunteers */}
          {teamMembers.map((member) => {
            const isSelected = selectedVolunteer === member.name
            const count = countsPerVolunteer[member.name] || 0

            return (
              <button
                key={member.id}
                onClick={() => setSelectedVolunteer(member.name)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border shadow-sm ${
                  isSelected
                    ? 'bg-brand-blue text-white border-brand-blue scale-105 ring-2 ring-amber-400'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span>{member.emoji}</span>
                <span>{member.name}</span>
                {count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}

          {/* Entire Tribe Bucket */}
          <button
            onClick={() => setSelectedVolunteer('Entire Tribe')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border shadow-sm ${
              selectedVolunteer === 'Entire Tribe'
                ? 'bg-rose-600 text-white border-rose-600 scale-105 ring-2 ring-amber-400'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>🤝 Entire Tribe</span>
            {countsPerVolunteer['Entire Tribe'] > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono">
                {countsPerVolunteer['Entire Tribe']}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card p-6 rounded-3xl border border-slate-200 bg-white/60 space-y-4 animate-pulse">
              <div className="h-4 w-24 bg-slate-200 rounded-full" />
              <div className="h-12 bg-slate-200 rounded-xl" />
              <div className="h-4 w-32 bg-slate-200 rounded-md" />
            </div>
          ))}
        </div>
      ) : filteredAffirmations.length === 0 ? (
        <div className="glass-card p-10 rounded-3xl border border-slate-200 text-center space-y-3 max-w-md mx-auto my-6 relative z-10">
          <span className="text-4xl block">💌 🌻</span>
          <h3 className="text-base font-bold text-slate-800 font-heading">No affirmations posted yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Be the first to leave a warm note of gratitude for {selectedVolunteer === 'ALL' ? 'the squad' : selectedVolunteer}!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            Give Affirmation ✨
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {filteredAffirmations.map((note) => {
            const theme = COLOR_MAP[note.color] || COLOR_MAP.amber

            return (
              <div
                key={note.id}
                className={`glass-card p-5 rounded-3xl border ${theme.border} ${theme.bg} space-y-3 relative shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${theme.badge}`}>
                    For: {note.recipient}
                  </span>

                  {/* Delete Trigger */}
                  <button
                    onClick={() => {
                      setTargetDeleteId(note.id)
                      setIsDeleteModalOpen(true)
                    }}
                    title="Delete affirmation note"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white/60"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Message Body */}
                <div className="space-y-2 py-1">
                  <p className={`text-xs sm:text-sm font-semibold ${theme.text} leading-relaxed font-body whitespace-pre-line`}>
                    "{note.message}"
                  </p>
                </div>

                {/* Attribution & Reaction Bar */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 font-heading">From: {note.sender}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{note.timestamp}</span>
                  </div>

                  {/* Reaction Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {['❤️', '🔥', '👏', '🌟', '🐝', '🌻'].map((emoji) => {
                      const count = note.reactions?.[emoji] || 0

                      return (
                        <button
                          key={emoji}
                          onClick={() => toggleReaction(note.id, emoji)}
                          className={`px-2 py-0.5 rounded-xl text-xs font-bold transition-transform active:scale-125 flex items-center gap-1 border shadow-2xs ${
                            count > 0
                              ? 'bg-white text-slate-900 border-slate-300 shadow-xs'
                              : 'bg-white/60 hover:bg-white text-slate-600 border-slate-200/80'
                          }`}
                        >
                          <span>{emoji}</span>
                          {count > 0 && <span className="font-mono text-[10px] font-extrabold">{count}</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Give Affirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl bg-white space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Share Kudos 🐝 🌻
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-heading">Give an Affirmation ✨</h2>
              <p className="text-xs text-slate-500">Post a warm note of appreciation to inspire your fellow volunteer.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target Volunteer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Recipient Volunteer:</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                >
                  {volunteerNames.map((name) => (
                    <option key={name} value={name}>
                      {name === 'Entire Tribe' ? '🤝 Entire Tribe' : name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 block">Affirmation Message:</label>
                  <span className="text-[10px] text-slate-400">Quick Emojis 👇</span>
                </div>

                {/* Quick Emoji Bar */}
                <div className="flex items-center gap-1.5 flex-wrap pb-1">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setMessage((prev) => prev + emoji)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm transition-transform active:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Write your note of appreciation here... (e.g. Thank you for your energy and support during Saturday class!)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-brand-blue leading-relaxed resize-none"
                />
              </div>

              {/* Sender Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Given by (Your Name):</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name... (e.g. Aravinth)"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Note Theme Picker */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 block">Sticky Note Theme:</label>
                <div className="flex items-center gap-3">
                  {Object.keys(COLOR_MAP).map((color) => {
                    const isSelected = selectedColor === color
                    const theme = COLOR_MAP[color]

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full ${theme.bg} border-2 ${
                          isSelected ? 'border-slate-900 scale-110 shadow-md' : 'border-slate-300'
                        } flex items-center justify-center transition-transform`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Affirmation to Vault ✨</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Passcode Protected Delete Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
