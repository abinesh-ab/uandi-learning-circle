import { Binary, BookOpen, CheckCircle } from 'lucide-react'

export default function July23S4() {
  return (
    <div className="max-w-5xl w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-slate-900 font-heading">Our Core Pillars</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card-interactive p-8 rounded-3xl space-y-4 border-t-4 border-t-blue-500 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-xl">
              <Binary className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-heading">Functional Numeracy</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Establishing basic mathematical foundations, numbers, shapes, and arithmetic logic through practical, activity-based learning.
            </p>
          </div>
        </div>

        <div className="glass-card-interactive p-8 rounded-3xl space-y-4 border-t-4 border-t-amber-500 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-heading">Tuitions</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Primary Focus:</strong> Maths &amp; Accountancy majors
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Support for other subjects via doubt clearing sessions, tests, and exam prep support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl text-center max-w-3xl mx-auto">
        <p className="text-base text-amber-800 font-medium italic">
          "By making them strong in one subject, eventually they'll gain confidence and perform better in all subjects."
        </p>
      </div>
    </div>
  )
}
