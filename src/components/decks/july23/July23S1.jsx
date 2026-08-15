import { ArrowRight } from 'lucide-react'

export default function July23S1() {
  return (
    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6 text-left">
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight font-heading">
          Marialaya <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-amber-500">
            FN &amp; Tuitions
          </span>
        </h1>
        <p className="text-3xl font-light text-slate-700 tracking-wide font-heading">Learning Circle</p>
        <p className="text-slate-500 text-base max-w-lg leading-relaxed">
          Building a space of learning, mentorship, and growth for underprivileged children together.
        </p>
        <div className="pt-4">
          <button className="px-8 py-4 bg-brand-blue hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-3">
            Let's Begin <ArrowRight className="w-6 h-6 text-amber-400" />
          </button>
        </div>
      </div>
      <div className="relative flex justify-center items-center">
        <div className="glass-card p-8 rounded-3xl relative z-10 border border-slate-200 shadow-xl w-full max-w-md">
          <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
              <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
            </defs>
            <path d="M 50 250 Q 200 280 350 250" stroke="rgba(15,23,42,0.1)" strokeWidth="4" fill="none" />
            <circle cx="200" cy="180" r="45" fill="url(#blueGrad)" />
            <path d="M 180 170 Q 200 150 220 170 Q 200 210 180 170 Z" fill="#ffffff" opacity="0.9" />
            <circle cx="120" cy="150" r="25" fill="#38BDF8" opacity="0.8" />
            <rect x="100" y="185" width="40" height="50" rx="10" fill="#38BDF8" opacity="0.6" />
            <circle cx="280" cy="140" r="30" fill="url(#yellowGrad)" />
            <rect x="255" y="180" width="50" height="60" rx="12" fill="url(#yellowGrad)" opacity="0.9" />
            <path d="M 200 135 L 200 90 M 200 105 Q 220 95 225 105 M 200 115 Q 180 105 175 115" stroke="#D97706" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  )
}
