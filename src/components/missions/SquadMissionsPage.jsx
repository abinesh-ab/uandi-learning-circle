import { useState, useMemo } from 'react'
import confetti from 'canvas-confetti'
import { CheckSquare, Square, Plus, CheckCircle2, Clock, Lock, X, ChevronDown, ChevronUp, Sparkles, Database, HardDrive, Trash2, Filter } from 'lucide-react'
import { lcTeams } from '../../data/teamData'
import { useSquadMissions } from '../../hooks/useSquadMissions'
import AdminDeleteModal from '../common/AdminDeleteModal'

const CATEGORY_COLORS = {
  'Student Log': 'bg-blue-100 text-blue-800 border-blue-200',
  'Lesson Plan': 'bg-purple-100 text-purple-800 border-purple-200',
  'Academic Plan': 'bg-amber-100 text-amber-800 border-amber-200',
  'Resource Prep': 'bg-teal-100 text-teal-800 border-teal-200',
  Admin: 'bg-rose-100 text-rose-800 border-rose-200',
  General: 'bg-slate-100 text-slate-800 border-slate-200',
}

export default function SquadMissionsPage({ activeLc = 'the-x-factors' }) {
  const { missions, isLoading, isSupabaseConfigured, toggleMissionStatus, addMission, deleteMission } = useSquadMissions(activeLc)

  // Active LC's team members
  const teamMembers = lcTeams[activeLc] || lcTeams['the-x-factors']

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [targetDeleteId, setTargetDeleteId] = useState(null)
  const [targetDeleteTitle, setTargetDeleteTitle] = useState('')
  const [expandedRows, setExpandedRows] = useState({})

  // Volunteer Filter State ('ALL' | volunteer name)
  const [selectedVolunteerFilter, setSelectedVolunteerFilter] = useState('ALL')

  // Form State for Adding Missions
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Student Log')
  const [volunteer, setVolunteer] = useState(teamMembers[0]?.name || '')
  const [dueDate, setDueDate] = useState('This Saturday')
  const [isBroadcast, setIsBroadcast] = useState(true)
  const [passcode, setPasscode] = useState('')
  const [formError, setFormError] = useState('')

  // Calculate stats per volunteer (Handles 0 tasks gracefully as 100% / All caught up!)
  const volunteerStats = useMemo(() => {
    const stats = {}
    teamMembers.forEach((member) => {
      const vMissions = missions.filter((m) => m.volunteer === member.name)
      const completed = vMissions.filter((m) => m.status === 'completed').length
      const total = vMissions.length
      const percent = total > 0 ? Math.round((completed / total) * 100) : 100
      stats[member.name] = {
        total,
        completed,
        todo: total - completed,
        percent,
        missions: vMissions,
      }
    })
    return stats
  }, [missions, teamMembers])


  // Header Progress display (Dynamic based on selected volunteer filter)
  const headerProgressStats = useMemo(() => {
    if (selectedVolunteerFilter !== 'ALL') {
      const stats = volunteerStats[selectedVolunteerFilter] || { total: 0, completed: 0, percent: 100 }
      return {
        title: `${selectedVolunteerFilter}'s Progress`,
        completed: stats.completed,
        total: stats.total,
        percent: stats.percent,
        isFiltered: true,
      }
    }
    const grandTotal = missions.length
    const grandCompleted = missions.filter((m) => m.status === 'completed').length
    const overallPercent = grandTotal > 0 ? Math.round((grandCompleted / grandTotal) * 100) : 100
    return {
      title: 'Squad Progress',
      completed: grandCompleted,
      total: grandTotal,
      percent: overallPercent,
      isFiltered: false,
    }
  }, [missions, selectedVolunteerFilter, volunteerStats])

  // Filtered members list to display
  const displayedMembers = useMemo(() => {
    if (selectedVolunteerFilter === 'ALL') return teamMembers
    return teamMembers.filter((m) => m.name === selectedVolunteerFilter)
  }, [selectedVolunteerFilter])

  // Delete handlers (Passcode: 'factors')
  const promptDelete = (id, taskTitle) => {
    setTargetDeleteId(id)
    setTargetDeleteTitle(taskTitle)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async (passcode) => {
    if (!targetDeleteId) return { error: 'No task selected' }
    const res = await deleteMission(targetDeleteId, passcode)
    if (res && res.success && res.deletedMission) {
      const vName = res.deletedMission.volunteer
      const remainingVMissions = missions.filter((m) => m.volunteer === vName && m.id !== targetDeleteId)
      const remainingTodo = remainingVMissions.filter((m) => m.status === 'todo').length
      // Trigger confetti if deleting an obsolete pending task brings volunteer to 100% completion
      if (remainingTodo === 0 && res.deletedMission.status === 'todo') {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } })
      }
    }
    return res
  }

  // Toggle Row Expansion
  const toggleRowExpansion = (name) => {
    setExpandedRows((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  // Handle Add Mission Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const res = await addMission({
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

  return (
    <div className="relative min-h-screen pt-14 pb-20 px-4 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-blue/10 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-wider">
              <CheckSquare className="w-3.5 h-3.5 text-brand-blue" /> Squad Action Tracker
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
                  <span>Realtime Cloud</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3 h-3 text-amber-600" />
                  <span>Local Storage Mode</span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">SQUAD MISSIONS</h1>
          <p className="text-xs text-slate-500">
            Row-based volunteer accountability matrix. Track Saturday deliverables, student logs &amp; class plans.
          </p>
        </div>
 {/* Single Volunteer Dropdown Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedVolunteerFilter}
              onChange={(e) => setSelectedVolunteerFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-900 font-bold text-xs rounded-2xl shadow-sm focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option value="ALL">🌟 All Volunteers ({teamMembers.length})</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>

            {selectedVolunteerFilter !== 'ALL' && (
              <button
                onClick={() => setSelectedVolunteerFilter('ALL')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors shrink-0 flex items-center gap-1"
                title="Reset to view all volunteers"
              >
                <span>Clear Filter</span>
                <span>✕</span>
              </button>
            )}
          </div>
        {/* Board Progress Badge, Volunteer Dropdown Filter & Add Action Button */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Progress Badge */}
          <div className="glass-card px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 bg-white">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                {headerProgressStats.title}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 font-heading">
                {headerProgressStats.completed}/{headerProgressStats.total} Done ({headerProgressStats.percent}%)
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 font-extrabold text-xs flex items-center justify-center border border-emerald-200 shrink-0">
              {headerProgressStats.percent}%
            </div>
          </div>

         

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-brand-blue hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Mission / Task</span>
          </button>
        </div>
      </div>

      {/* Row-Based Horizontal Volunteer Kanban Matrix */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card h-28 rounded-3xl border border-slate-200 bg-white/60 p-5 space-y-3 animate-pulse">
              <div className="h-4 w-40 bg-slate-200 rounded-full" />
              <div className="h-3 w-full bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedMembers.map((member) => {
            const stats = volunteerStats[member.name] || { total: 0, completed: 0, todo: 0, percent: 0, missions: [] }
            const todoTasks = stats.missions.filter((m) => m.status === 'todo')
            const completedTasks = stats.missions.filter((m) => m.status === 'completed')

            const isExpanded = !!expandedRows[member.name]
            const visibleTodo = isExpanded ? todoTasks : todoTasks.slice(0, 3)
            const visibleCompleted = isExpanded ? completedTasks : completedTasks.slice(0, 3)
            const hasMoreTasks = todoTasks.length > 3 || completedTasks.length > 3

            return (
              <div
                key={member.id}
                className="glass-card rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden transition-all hover:border-slate-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  {/* 1. Left Column: Volunteer Profile & Dynamic Progress */}
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50/80 to-white flex flex-col justify-between space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-brand-blue to-amber-400 shrink-0">
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
                          <h3 className="text-sm sm:text-base font-black text-slate-900 font-heading">{member.name}</h3>
                          <span className="text-sm">{member.emoji}</span>
                        </div>
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider line-clamp-1">
                          {member.focus}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Progress Bar */}
                    <div className="space-y-1 pt-1.5 border-t border-slate-100">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-500">Row Completion</span>
                        <span className={stats.percent === 100 ? 'text-emerald-600 font-black' : 'text-slate-900'}>
                          {stats.total === 0 ? '100% (All caught up!)' : `${stats.completed}/${stats.total} Done (${stats.percent}%)`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
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
                  <div className="p-4 space-y-2.5 bg-slate-50/40">
                    <div className="flex justify-between items-center pb-0.5">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending Tasks
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {todoTasks.length} Pending
                      </span>
                    </div>

                    {todoTasks.length === 0 ? (
                      <div className="p-3 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        ✨ No pending tasks
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {visibleTodo.map((task) => (
                          <div
                            key={task.id}
                            className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-brand-blue transition-all flex items-start justify-between gap-3 group"
                          >
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => toggleMissionStatus(task.id)}
                                className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                                title="Mark task as completed"
                              >
                                <Square className="w-4 h-4" />
                              </button>
                              <div className="space-y-1">
                                <p className="text-xs font-semibold text-slate-900 leading-snug">{task.title}</p>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                                      CATEGORY_COLORS[task.category] || CATEGORY_COLORS.General
                                    }`}
                                  >
                                    {task.category}
                                  </span>
                                  {task.dueDate && (
                                    <span className="text-[9px] font-mono text-slate-500 flex items-center gap-0.5">
                                      <Clock className="w-3 h-3 text-slate-400" /> {task.dueDate}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => toggleMissionStatus(task.id)}
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-bold transition-colors"
                              >
                                Done ✓
                              </button>
                              <button
                                onClick={() => promptDelete(task.id, task.title)}
                                className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete task (Passcode required)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Right Column: Completed Tasks (Done) */}
                  <div className="p-4 space-y-2.5 bg-emerald-50/20">
                    <div className="flex justify-between items-center pb-0.5">
                      <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {completedTasks.length} Done
                      </span>
                    </div>

                    {completedTasks.length === 0 ? (
                      <div className="p-3 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        No completed tasks yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {visibleCompleted.map((task) => (
                          <div
                            key={task.id}
                            className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start justify-between gap-3 text-emerald-900 group"
                          >
                            <div className="flex items-start gap-2">
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
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {task.category}
                                  </span>
                                  {task.completedAt && (
                                    <span className="text-[9px] font-mono text-emerald-600">✓ {task.completedAt}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => toggleMissionStatus(task.id)}
                                className="text-[10px] font-bold text-emerald-700 hover:underline"
                              >
                                Undo
                              </button>
                              <button
                                onClick={() => promptDelete(task.id, task.title)}
                                className="p-1 text-emerald-400 hover:text-rose-600 hover:bg-rose-100/50 rounded-lg transition-colors"
                                title="Delete task (Passcode required)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expand / Collapse Bar if volunteer has > 3 tasks */}
                {hasMoreTasks && (
                  <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/60 text-center">
                    <button
                      onClick={() => toggleRowExpansion(member.name)}
                      className="text-[11px] font-bold text-brand-blue hover:text-blue-700 inline-flex items-center gap-1 focus:outline-none"
                    >
                      <span>
                        {isExpanded
                          ? 'Collapse Tasks'
                          : `Show All (${todoTasks.length + completedTasks.length} Tasks)`}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

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
                    <span>Broadcast to ALL {teamMembers.length} Volunteers</span>
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

                {/* Administrative Passcode Verification if Broadcast */}
                {isBroadcast && (
                  <div className="pt-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 block flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-600" /> Administrative Passcode Required:
                    </label>
                    <input
                      type="password"
                      placeholder="Enter administrative passcode..."
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

      {/* Passcode Protected Delete Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={targetDeleteTitle}
      />
    </div>
  )
}
