import { getAssetUrl } from '../../../utils/assetUrl'
import { FileText, Award, BarChart3, Clock, ExternalLink, ShieldCheck, CheckCircle2, DollarSign, Calculator } from 'lucide-react'

export default function Aug20S3() {
  const levels = [
    {
      lvl: 'Level 1 (10m)',
      title: 'Knowing the Names (Golden Rules)',
      icon: '🏷️',
      badge: 'Golden Rules',
      desc: 'Classify account types into Real, Personal, or Nominal:',
      details: ['Cash (Real Account)', 'Ramesh (Personal Account)', 'Rent Paid (Nominal Account)', 'Building (Real Account)', 'Interest Received (Nominal Account)'],
      color: 'border-l-blue-500 bg-blue-50/60',
    },
    {
      lvl: 'Level 2 (10m)',
      title: 'The Two Sides of Business (Dual Aspect)',
      icon: '⚖️',
      badge: 'Dual Aspect',
      desc: 'Identify "What Comes In" vs "What Goes Out" across basic transactions:',
      details: ['Starting capital (Cash In / Owner Claim)', 'Buying furniture (Furniture In / Cash Out)', 'Buying goods (Stock In / Cash Out)', 'Electricity bill (Expense / Cash Out)', 'Sales (Cash In / Goods Out)'],
      color: 'border-l-indigo-500 bg-indigo-50/60',
    },
    {
      lvl: 'Level 3 (10m)',
      title: 'Calculating Basic Profit',
      icon: '📈',
      badge: 'Arithmetic Base',
      desc: 'Small business starts with ₹40,000 capital and grows to ₹90,000 closing capital:',
      details: ['Formula: Closing Capital - Opening Capital = Net Profit', 'Calculation: ₹90,000 - ₹40,000 = ₹50,000 Profit'],
      color: 'border-l-emerald-500 bg-emerald-50/60',
    },
    {
      lvl: 'Level 4 (10m)',
      title: 'What We Own vs What We Owe',
      icon: '🏦',
      badge: 'Balance Sheet',
      desc: 'Categorize items into Business Assets vs Liabilities:',
      details: ['Assets (Owned): Computer, Cash in Hand, Stock of Goods', 'Liabilities (Owed): Bank Loan, Unpaid Salary to Staff'],
      color: 'border-l-amber-500 bg-amber-50/60',
    },
    {
      lvl: 'Level 5 (10m)',
      title: 'The Accounting Equation Puzzle',
      icon: '🧩',
      badge: 'Equation Math',
      desc: 'Mastering the fundamental law: Assets = Capital + Liabilities',
      details: [
        'Case A: Assets ₹1,00,000 - Liabilities ₹40,000 ➔ Capital = ₹60,000',
        'Case B: Capital ₹50,000 + Bank Loan ₹20,000 ➔ Total Assets = ₹70,000',
      ],
      color: 'border-l-rose-500 bg-rose-50/60',
    },
  ]

  const interventionAreas = [
    { lvl: 'L1', area: 'Vocabulary', focus: 'Account Classification (Golden Rules)' },
    { lvl: 'L2', area: 'Transaction Duality', focus: 'Debit/Credit & Dual Aspect Intuition' },
    { lvl: 'L3', area: 'Arithmetic Deductions', focus: 'Capital & Profit Calculation' },
    { lvl: 'L4', area: 'Balance Sheet Intuition', focus: 'Assets vs Liabilities Distinction' },
    { lvl: 'L5', area: 'Equation Balancing', focus: 'Accounting Equation Algebra' },
  ]

  return (
    <div className="max-w-6xl w-full space-y-6 animate-fade-in pb-4">
      {/* Header & Meta Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" /> Slide 3 of 3 • Diagnostic Pre-Assessment
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-heading">
            Commerce Foundation Pre-Assessment (Class 11 &amp; 12)
          </h2>
          <p className="text-xs text-slate-500">Accountancy baseline diagnostic framework &amp; mark scheme</p>
        </div>

        {/* Attachment Button */}
        <a
          href={getAssetUrl('docs/diagnostic_accounting_test.pdf')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/20 hover:scale-105 transition-all shrink-0"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>Download Accountancy Diagnostic Test &amp; Mark Scheme PDF</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/70" />
        </a>
      </div>

      {/* Assessment Overview Stats Banner */}
      <div className="glass-card p-5 rounded-3xl border-2 border-purple-200 bg-gradient-to-r from-purple-50/80 via-white to-amber-50/60 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl shadow-lg shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-widest block">
              DIAGNOSTIC TEST OVERVIEW
            </span>
            <h3 className="text-lg font-black text-slate-900 font-heading">5-Level Commerce Baseline Diagnostic</h3>
            <p className="text-xs text-slate-600">Quick 30-minute diagnostic tool to identify exact learning intervention areas.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 w-full sm:w-auto justify-around">
          <div className="text-center px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-blue" /> Duration
            </span>
            <span className="text-lg font-black text-slate-900 font-heading">30 Mins</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-500" /> Total Score
            </span>
            <span className="text-lg font-black text-purple-700 font-heading">50 Marks</span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center px-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Structure</span>
            <span className="text-xs font-extrabold text-emerald-600">5 Levels × 10m</span>
          </div>
        </div>
      </div>

      {/* 5-Level Diagnostic Framework */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 space-y-4 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-base font-black text-slate-900 font-heading">Five-Level Diagnostic Framework</h3>
              <p className="text-xs text-slate-500">Structured 10-mark diagnostic progression</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-3 py-1 bg-purple-50 text-purple-800 rounded-full border border-purple-200">
            5 Levels • 50 Marks Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levels.map(({ lvl, title, icon, badge, desc, details, color }) => (
            <div key={lvl} className={`p-4 rounded-2xl border-l-4 space-y-2 ${color} transition-all hover:shadow-md`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-base">{icon}</span> {lvl}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {badge}
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 font-heading">{title}</h4>
              <p className="text-[11px] font-medium text-slate-600">{desc}</p>
              <ul className="text-[10px] text-slate-700 space-y-1 pt-1 border-t border-slate-200/60">
                {details.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostic Value & Intervention Areas */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 space-y-3 bg-slate-50/60">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-purple-600" /> Diagnostic Value &amp; Targeted Intervention Mapping
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {interventionAreas.map(({ lvl, area, focus }) => (
            <div key={lvl} className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 text-left">
              <span className="text-[10px] font-mono font-black text-purple-700 px-2 py-0.5 rounded bg-purple-50 inline-block border border-purple-200">
                {lvl}
              </span>
              <h4 className="text-xs font-bold text-slate-900">{area}</h4>
              <p className="text-[10px] text-slate-500 leading-tight">{focus}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
