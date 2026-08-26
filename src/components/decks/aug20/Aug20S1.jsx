import { getAssetUrl } from '../../../utils/assetUrl'
import { FileText, Calendar, Target, Clock, BookOpen, ChevronRight, Award, CheckCircle, ExternalLink } from 'lucide-react'

export default function Aug20S1() {
  const sessionLoop = [
    { time: '10m', step: 'Check-in', icon: '👋', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { time: '10m', step: 'Retrieval & HW', icon: '🧠', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { time: '10m', step: 'Skill Energizer', icon: '⚡', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { time: '40m', step: 'Core Teaching', icon: '📐', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { time: '20m', step: 'Solo Practice', icon: '✏️', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { time: '15m', step: 'Doubts Clearance', icon: '❓', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { time: '15m', step: 'Reflection & HW', icon: '📝', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  ]

  return (
    <div className="max-w-6xl w-full space-y-6 animate-fade-in pb-4">
      {/* Header & Meta Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" /> Slide 1 of 3 • August 20th, 2026
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-heading">
            Academic Class Planning &amp; Milestone Calendar
          </h2>
          <p className="text-xs text-slate-500">Individual Academic Strategy &amp; Annual Roadmap (Tamil Nadu Samacheer Kalvi)</p>
        </div>

        {/* Attachment Button */}
        <a
          href="https://drive.google.com/drive/folders/1RUDUHaTVkUI_7avWTjMF52EFETkbS-5D"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 hover:scale-105 transition-all shrink-0"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>View Full Academic Plan &amp; Calendar</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/70" />
        </a>
      </div>

      {/* Student Hero Banner */}
      <div className="glass-card p-5 rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50/80 via-white to-blue-50/60 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white font-black text-xl flex items-center justify-center shadow-lg font-heading shrink-0">
            KP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                9th Std Mathematics
              </span>
              <span className="text-xs text-slate-500">TN Samacheer Kalvi</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 font-heading mt-0.5">Student Profile: Karpagavalli</h3>
            <p className="text-xs text-slate-600">Building a 10th Standard Board foundation through consistent structured tuition loops.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 w-full sm:w-auto justify-around">
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Baseline</span>
            <span className="text-lg font-black text-slate-700 font-heading">60<span className="text-xs text-slate-400 font-normal">/100</span></span>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-500" />
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Target Goal</span>
            <span className="text-xl font-black text-emerald-600 font-heading">85+<span className="text-xs text-emerald-500 font-normal">/100</span></span>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-200">
            +25 Marks Leap
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Layered Strategy & Milestone Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Layered Curriculum Strategy */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200 space-y-4 bg-white/80">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-heading">1. Layered Curriculum Strategy</h3>
              <p className="text-xs text-slate-500">Tiered topic distribution for maximum mark conversion</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Tier 1 */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Priority Scoring (High Yield)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">Core Weightage</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Algebra, Geometry, Mensuration</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Deep teaching + repeated practice + weekly unit tests. Covers high-weightage 2-mark &amp; 5-mark recurring compulsory questions.
              </p>
            </div>

            {/* Tier 2 */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-blue" /> Foundation &amp; Easy Marks
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200/80 text-blue-900">Retrieval Base</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Set Language, Real Numbers</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Touch-up + school homework + retrieval revision. Protects easy marks without consuming heavy weekend tuition hours.
              </p>
            </div>

            {/* Tier 3 */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Late-Stage Sprints
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900">Objective Drills</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Coordinate Geometry, Statistics, Probability, Trigonometry + Graphs</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Targeted conceptual teaching + short 1-mark objective drills after the core base is solidified.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Academic Milestone Calendar */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200 space-y-4 bg-white/80">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-heading">2. Academic Milestone Calendar</h3>
              <p className="text-xs text-slate-500">2-Phase roadmap leading to annual examination</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Phase 1 */}
            <div className="p-4 rounded-2xl border-l-4 border-l-brand-blue bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-brand-blue uppercase tracking-wider">
                  Phase 1 (Aug ➔ Dec 2026)
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Build the Base
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">Primary focus: Algebra, Geometry &amp; Mensuration</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-brand-blue shrink-0" /> Chapters 1 &amp; 2 revision via weekly homework</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-brand-blue shrink-0" /> Regular Saturday unit tests &amp; doubt clearance</li>
                <li className="flex items-center gap-1.5 text-amber-800 font-semibold"><Award className="w-3.5 h-3.5 text-amber-600 shrink-0" /> December Checkpoint: Full 100-mark diagnostic exam</li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="p-4 rounded-2xl border-l-4 border-l-emerald-500 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                  Phase 2 (Jan ➔ Mar 2027)
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Convert to Marks
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">Primary focus: Probability, Statistics &amp; Graphs</p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 1-mark question bank drills &amp; theorem recall</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Timed full-paper mock examinations &amp; speed drills</li>
                <li className="flex items-center gap-1.5 text-emerald-800 font-semibold"><Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Final Target: 85+/100 annual exam score</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 120-Minute Weekly Session Loop */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 space-y-3 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-blue" />
            <h3 className="text-sm font-black text-slate-900 font-heading">3. 120-Minute Weekly Saturday Session Loop</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono font-bold">Total Duration: 2 Hours</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          {sessionLoop.map(({ time, step, icon, color }) => (
            <div key={step} className={`p-2.5 rounded-2xl border text-center space-y-1 ${color}`}>
              <span className="text-lg block">{icon}</span>
              <span className="text-[10px] font-mono font-extrabold block">{time}</span>
              <p className="text-[11px] font-bold text-slate-900 leading-tight">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
