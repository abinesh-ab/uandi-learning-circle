import { HelpCircle } from 'lucide-react'
import { kidsList, kidBorderColors } from '../../../data/data'

export default function July30S2() {
  return (
    <div className="max-w-6xl w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900">Individual Super Kid Lesson Planning</h2>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          Reviewing progress for each child. Let's discuss planning assistance, required materials, or doubts for your specific student!
        </p>
      </div>

      {/* Kids grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[420px] overflow-y-auto p-1">
        {kidsList.map((kid, idx) => (
          <div
            key={kid}
            className={`glass-card-interactive p-3 rounded-2xl border-t-4 ${kidBorderColors[idx % kidBorderColors.length]} flex flex-col justify-between hover:border-brand-blue cursor-pointer`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-xs shadow-sm">
                👶
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate">{kid}</h4>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 block font-mono">Volunteer: Select</span>
              <div className="flex items-center justify-between text-[10px] text-slate-700 bg-slate-100/80 px-2 py-1 rounded-lg">
                <span>Plan Ready?</span>
                <span className="text-amber-600 font-bold">In Review</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-4 rounded-2xl text-center flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Need Teaching Materials or Doubt Support?</h4>
            <p className="text-[11px] text-slate-500">Speak up during this slide! We will coordinate customized worksheets &amp; games for your student.</p>
          </div>
        </div>
        <span className="px-4 py-2 bg-brand-blue text-white font-bold text-xs rounded-xl shrink-0 shadow-md shadow-blue-500/10">
          Ask Squad Assistance
        </span>
      </div>
    </div>
  )
}
