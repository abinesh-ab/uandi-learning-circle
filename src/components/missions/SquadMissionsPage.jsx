import { useState, useMemo } from 'react'
import { CheckSquare, Square, Plus, CheckCircle2, Clock, Shield, Lock, Download, Upload, RotateCcw, X, Copy, Check, ChevronDown, ChevronUp, Layers, Users, Sparkles } from 'lucide-react'
import { teamMembers } from '../../data/teamData'
import { useSquadMissions } from '../../hooks/useSquadMissions'

const CATEGORY_COLORS = {
  'Student Log': 'bg-blue-100 text-blue-800 border-blue-200',
  'Lesson Plan': 'bg-purple-100 text-purple-800 border-purple-200',
  'Academic Plan': 'bg-amber-100 text-amber-800 border-amber-200',
  'Resource Prep': 'bg-teal-100 text-teal-800 border-teal-200',
  Admin: 'bg-rose-100 text-rose-800 border-rose-200',
  General: 'bg-slate-100 text-slate-800 border-slate-200',
}

export default function SquadMissionsPage() {
  const { missions, toggleMissionStatus, addMission, deleteMission, resetMissionsData, setMissions } = useSquadMissions()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isBackupTrayOpen, setIsBackupTrayOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Form State for Adding Missions
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Student Log')
  const [volunteer, setVolunteer] = useState(teamMembers[0]?.name || 'Aravinth')
  const [dueDate, setDueDate] = useState('This Saturday')
  const [isBroadcast, setIsBroadcast] = useState(true)
  const [passcode, setPasscode] = useState('')
  const [formError, setFormError] = useState('')

  // Passcode Guard Modal for Reset / Import
  const [adminAction, setAdminAction] = useState(null) // null | 'RESET' | 'IMPORT'
  const [adminPasscode, setAdminPasscode] = useState('')
  const [importJsonText, setImportJsonText] = useState('')

  // Calculate stats per volunteer
  const volunteerStats = useMemo(() => {
    const stats = {}
    teamMembers.forEach((member) => {
      const vMissions = missions.filter((m) => m.volunteer === member.name)
      const completed = vMissions.filter((m) => m.status === 'completed').length
      const total = vMissions.length
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0
      stats[member.name] = {
        total,
        completed,
        todo: total - completed,
        percent,
        missions: vMissions,
      }
    })
    return stats
  }, [missions])

  // Overall Board Completion Rate
  const overallStats = useMemo(() => {
    const total = missions.length
    const completed = missions.filter((m) => m.status === 'completed').length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percent }
  }, [missions])

  // Handle Add Mission Submit
  const handleAddSubmit = (e) => {
    e.preventDefault()
    setFormError('')

    const res = addMission({
      title,
      category,
      volunteer,
      dueDate,
      isBroadcast,
      passcode,
    })

    if (!res.success) {
      setFormError(res.error || 'Failed to create task.')
      return
    }

    // Reset Form
    setTitle('')
    setFormError('')
    setPasscode('')
    setIsAddModalOpen(false)
  }

  // Handle Export JSON Payload
  const handleExportJson = () => {
    try {
      const savedVault = localStorage.getItem('xfactors_gratitude_vault') || '[]'
      const payload = {
        exportedAt: new Date().toISOString(),
        gratitudeVault: JSON.parse(savedVault),
        squadMissions: missions,
      }
      const jsonStr = JSON.stringify(payload, null, 2)
      navigator.clipboard.writeText(jsonStr)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2500)
    } catch (e) {
      alert('Export failed: ' + e.message)
    }
  }

  // Handle Import JSON
  const handleImportJson = () => {
    if (adminPasscode !== 'X' && adminPasscode !== 'x') {
      alert('Invalid passcode. Passcode "X" is required for administrative import.')
      return
    }
    try {
      const parsed = JSON.parse(importJsonText)
      if (parsed.squadMissions && Array.isArray(parsed.squadMissions)) {
        setMissions(parsed.squadMissions)
      }
      if (parsed.gratitudeVault && Array.isArray(parsed.gratitudeVault)) {
        localStorage.setItem('xfactors_gratitude_vault', JSON.stringify(parsed.gratitudeVault))
      }
      alert('Successfully imported JSON backup payload!')
      setAdminAction(null)
      setAdminPasscode('')
      setImportJsonText('')
    } catch (err) {
      alert('Failed to parse JSON string: ' + err.message)
    }
  }

  // Handle Reset Data
  const handleResetData = () => {
    if (adminPasscode !== 'X' && adminPasscode !== 'x') {
      alert('Invalid passcode. Passcode "X" is required to reset data.')
      return
    }
    resetMissionsData(adminPasscode)
    setAdminAction(null)
    setAdminPasscode('')
  }

  return (
    <div className="relative min-h-screen pt-20 pb-28 px-4 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/10 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4 text-brand-blue" /> Squad Action Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">SQUAD MISSIONS</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Row-based volunteer accountability matrix. Track Saturday deliverables, student logs &amp; class plans.
          </p>
        </div>

        {/* Board Overall Progress Badge & Add Action Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="glass-card px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 bg-white">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Squad Progress</span>
              <span className="text-sm font-black text-slate-900 font-heading">
                {overallStats.completed}/{overallStats.total} Done ({overallStats.percent}%)
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-extrabold text-xs flex items-center justify-center border border-emerald-200">
              {overallStats.percent}%
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 bg-brand-blue hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Mission / Task</span>
          </button>
        </div>
      </div>

      {/* Row-Based Horizontal Volunteer Kanban Matrix */}
      <div className="space-y-6">
        {teamMembers.map((member) => {
          const stats = volunteerStats[member.name] || { total: 0, completed: 0, todo: 0, percent: 0, missions: [] }
          const todoTasks = stats.missions.filter((m) => m.status === 'todo')
          const completedTasks = stats.missions.filter((m) => m.status === 'completed')

          return (
            <div
              key={member.id}
              className="glass-card rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden transition-all hover:border-slate-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                {/* 1. Left Column: Volunteer Profile & Dynamic Progress */}
                <div className="p-5 bg-gradient-to-br from-slate-50/80 to-white flex flex-col justify-between space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-brand-blue to-amber-400 shrink-0">
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div
                          className={`hidden w-full h-full bg-gradient-to-br ${member.avatarColor} items-center justify-center font-black text-white text-xs`}
                        >
                          {member.avatarText}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-black text-slate-900 font-heading">{member.name}</h3>
                        <span className="text-sm">{member.emoji}</span>
                      </div>
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider line-clamp-1">
                        {member.focus}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-500">Row Completion</span>
                      <span className={stats.percent === 100 ? 'text-emerald-600 font-black' : 'text-slate-900'}>
                        {stats.completed}/{stats.total} Done ({stats.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                      <div
                        className={`h-full transition-all duration-500 ${
                          stats.percent === 100
                            ? 'bg-emerald-500'
                            : stats.percent >= 50
                            ? 'bg-brand-blue'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${stats.percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Middle Column: Pending Tasks (To-Do) */}
                <div className="p-5 space-y-3 bg-slate-50/40">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending Tasks (To-Do)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {todoTasks.length} Pending
                    </span>
                  </div>

                  {todoTasks.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      ✨ All pending tasks completed!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {todoTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-brand-blue transition-all flex items-start justify-between gap-3 group"
                        >
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => toggleMissionStatus(task.id)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                              title="Mark task as completed"
                            >
                              <Square className="w-4 h-4" />
                            </button>
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-slate-900 leading-snug">{task.title}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${
                                    CATEGORY_COLORS[task.category] || CATEGORY_COLORS.General
                                  }`}
                                >
                                  {task.category}
                                </span>
                                {task.dueDate && (
                                  <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" /> {task.dueDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleMissionStatus(task.id)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-bold transition-colors shrink-0"
                          >
                            Done ✓
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Right Column: Completed Tasks (Done) */}
                <div className="p-5 space-y-3 bg-emerald-50/20">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed Tasks (Done)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {completedTasks.length} Done
                    </span>
                  </div>

                  {completedTasks.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No completed tasks yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {completedTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start justify-between gap-3 text-emerald-900 group"
                        >
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => toggleMissionStatus(task.id)}
                              className="mt-0.5 text-emerald-600 hover:text-slate-500 transition-colors shrink-0"
                              title="Mark back as to-do"
                            >
                              <CheckSquare className="w-4 h-4" />
                            </button>
                            <div className="space-y-1">
                              <p className="text-xs font-semibold line-through text-emerald-800/80 leading-snug">
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                                  {task.category}
                                </span>
                                {task.completedAt && (
                                  <span className="text-[9px] font-mono text-emerald-600">✓ {task.completedAt}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleMissionStatus(task.id)}
                            className="text-[10px] font-bold text-emerald-700 hover:underline shrink-0"
                          >
                            Undo
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Admin Sync & Backup Utility Tray */}
      <div className="glass-card rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <button
          onClick={() => setIsBackupTrayOpen(!isBackupTrayOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-heading">
              Admin Sync &amp; Backup Utility
            </span>
          </div>
          {isBackupTrayOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isBackupTrayOpen && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-fade-in">
            <p className="text-xs text-slate-500 leading-relaxed">
              Export current board state as JSON for repository hardcoding or import weekly task batches.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportJson}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-transform active:scale-95"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{isCopied ? 'JSON Copied to Clipboard!' : 'Export State JSON Payload'}</span>
              </button>

              <button
                onClick={() => setAdminAction('IMPORT')}
                className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-white" />
                <span>Import JSON State</span>
              </button>

              <button
                onClick={() => setAdminAction('RESET')}
                className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Reset to Seed Defaults</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Mission Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl bg-white space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddModalOpen(false)
                setFormError('')
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-blue" /> Action Tracker
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-heading">Add Mission / Task</h2>
              <p className="text-xs text-slate-500">Create a task for an individual volunteer or broadcast to the whole squad.</p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              {/* Task Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Task Description / Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Student Log Aug 29 - CCS_008"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                />
              </div>

              {/* Category Tag & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Category Tag:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                  >
                    <option value="Student Log">Student Log</option>
                    <option value="Lesson Plan">Lesson Plan</option>
                    <option value="Academic Plan">Academic Plan</option>
                    <option value="Resource Prep">Resource Prep</option>
                    <option value="Admin">Admin</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Due Date:</label>
                  <input
                    type="text"
                    placeholder="e.g. This Saturday / Aug 29"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Assignment Mode Toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">Assignment Mode:</label>

                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="radio"
                      name="assignmentMode"
                      checked={isBroadcast}
                      onChange={() => setIsBroadcast(true)}
                      className="w-4 h-4 text-brand-blue"
                    />
                    <span>Broadcast to ALL {teamMembers.length} Volunteers (Passcode "X" Required)</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="radio"
                      name="assignmentMode"
                      checked={!isBroadcast}
                      onChange={() => setIsBroadcast(false)}
                      className="w-4 h-4 text-brand-blue"
                    />
                    <span>Individual Assignment</span>
                  </label>
                </div>

                {/* Individual Volunteer Selector */}
                {!isBroadcast && (
                  <div className="pt-2">
                    <select
                      value={volunteer}
                      onChange={(e) => setVolunteer(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    >
                      {teamMembers.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.focus})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Passcode Verification if Broadcast */}
                {isBroadcast && (
                  <div className="pt-2 space-y-1">
                    <label className="text-[11px] font-bold text-rose-700 block flex items-center gap-1">
                      <Lock className="w-3 h-3 text-rose-600" /> Enter Administrative Passcode "X" to Confirm Broadcast:
                    </label>
                    <input
                      type="text"
                      placeholder='Enter passcode "X"...'
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 text-xs font-bold rounded-xl text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-brand-blue hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBroadcast ? `Broadcast Mission to All ${teamMembers.length} Rows 🚀` : 'Assign Mission'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Action Passcode Modal (Import or Reset) */}
      {adminAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl bg-white space-y-4 relative text-center">
            <button
              onClick={() => {
                setAdminAction(null)
                setAdminPasscode('')
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 font-heading">
                {adminAction === 'RESET' ? 'Reset State to Seed Defaults' : 'Import JSON Payload'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This administrative action requires entering passcode <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-700">"X"</code>.
              </p>
            </div>

            {adminAction === 'IMPORT' && (
              <textarea
                rows={5}
                placeholder="Paste exported JSON payload string here..."
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 text-xs rounded-xl text-slate-900 font-mono resize-none"
              />
            )}

            <input
              type="text"
              placeholder='Enter passcode "X"...'
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-xs font-bold rounded-xl text-center focus:outline-none focus:border-brand-blue"
            />

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setAdminAction(null)
                  setAdminPasscode('')
                }}
                className="w-1/2 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={adminAction === 'RESET' ? handleResetData : handleImportJson}
                className="w-1/2 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
