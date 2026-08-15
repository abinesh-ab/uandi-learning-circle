import { useState } from 'react'
import { Sparkles } from 'lucide-react'

const tabs = [
  { id: 'fn', label: 'Foundational Numeracy (U&I)' },
  { id: '9th', label: '9th Maths' },
  { id: '11th', label: '11th Accountancy' },
  { id: '12th', label: '12th Accountancy' },
]

const mathTopics9th = [
  'Real Numbers',
  'Polynomials',
  'Linear Equations',
  'Geometry',
  'Coordinate Geometry',
  'Mensuration',
  'Statistics',
  'Trigonometry',
  'Probability',
  'Quadratic Equations',
]
const accountancy11th = [
  'Intro to Accounting',
  'Transactions',
  'Journal Entries',
  'Ledger',
  'Trial Balance',
  'Financial Statements',
  'Cash Flow',
  'Depreciation',
  'Bank Rec',
  'Errors',
]
const accountancy12th = [
  'Partnership Accounts',
  'Goodwill',
  'Admission',
  'Retirement',
  'Death',
  'Dissolution',
  'Company Accounts',
  'Cash Flow',
  'Ratio Analysis',
  'Issue of Shares',
]

export default function July23S6() {
  const [activeTab, setActiveTab] = useState('fn')

  return (
    <div className="max-w-6xl w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading">Class Planning Hub</h2>
          <p className="text-xs text-slate-500">Detailed curriculum &amp; visual activity strategies.</p>
        </div>
        <div className="flex bg-slate-200/80 p-1.5 rounded-2xl gap-1 overflow-x-auto max-w-full">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === id ? 'bg-brand-blue text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[360px]">
        {activeTab === 'fn' && (
          <div className="glass-card p-6 rounded-3xl border border-amber-300 space-y-4">
            <div className="flex items-center gap-3 text-amber-700">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-xl font-bold font-heading">U&amp;I Syllabus — Visual Teaching Concept for Division</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700">
              {[
                ['1. Material Setup', 'Use 12 physical chocolates/marbles and 3 paper cups representing children.'],
                [
                  '2. Equal Sharing Activity',
                  'Ask the student to distribute 1 chocolate into each cup sequentially until none are left.',
                ],
                [
                  '3. Property Explanation',
                  'Each child gets 4 chocolates. Explain that 12 divided by 3 equals 4 (Equal Sharing &amp; Grouping).',
                ],
              ].map(([title, desc]) => (
                <div key={title} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-1 font-heading">{title}</h4>
                  <p className="text-xs text-slate-500" dangerouslySetInnerHTML={{ __html: desc }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === '9th' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {mathTopics9th.map((t, i) => (
              <div key={t} className="glass-card-interactive p-3 rounded-xl text-center">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-brand-blue font-black text-xs flex items-center justify-center mx-auto mb-2 font-heading">
                  {i + 1}
                </div>
                <p className="text-[11px] font-semibold text-slate-800">{t}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === '11th' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {accountancy11th.map((t, i) => (
              <div key={t} className="glass-card-interactive p-3 rounded-xl text-center">
                <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 font-black text-xs flex items-center justify-center mx-auto mb-2 font-heading">
                  {i + 1}
                </div>
                <p className="text-[11px] font-semibold text-slate-800">{t}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === '12th' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {accountancy12th.map((t, i) => (
              <div key={t} className="glass-card-interactive p-3 rounded-xl text-center">
                <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center mx-auto mb-2 font-heading">
                  {i + 1}
                </div>
                <p className="text-[11px] font-semibold text-slate-800">{t}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
