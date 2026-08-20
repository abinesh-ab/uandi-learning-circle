import { useState } from 'react'
import { getAssetUrl } from '../../../utils/assetUrl'
import { Maximize2, X, Sparkles, Heart, Target } from 'lucide-react'

const expected = [
  { emoji: '🎯', text: 'Give me the end of the year goal for the student and check progress and support (for Yuvan)' },
  { emoji: '📚', text: 'Provide proper resources & question banks' },
  { emoji: '🛠️', text: 'Bring more workshops, career life skills and guidance for students' },
  { emoji: '🚀', text: 'Give and support on providing more launch stories' },
  { emoji: '⏱️', text: 'Keep the LC calls and debrief in short' },
  { emoji: '🧳', text: 'Monthly one team trip and engagement' },
  { emoji: '🔬', text: 'Support on teach curated science activities to all the centres (for Aravinth)' },
  { emoji: '🏆', text: 'Initiative on student of the month' },
  { emoji: '📅', text: 'Proper Calendar plan and track the progress' },
]

const promised = [
  { emoji: '👶', text: 'Always Child first' },
  { emoji: '🙋', text: 'Never miss class without responsibility' },
  { emoji: '📝', text: 'Go with class planning in a granular way' },
  { emoji: '💬', text: 'Responsive and engaging in WAG' },
  { emoji: '⏰', text: 'Always be on time, be informed' },
  { emoji: '🔥', text: 'Bring your best to the LC' },
  { emoji: '🤝', text: 'Communication and Involvement to the class planning and in all lc activities' },
  { emoji: '🗣️', text: 'Give honest feedback (brutally honest) about LC },
  { emoji: '🙋', text: 'Ask support whenever needed' },
]

export default function Aug6S1() {
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false)

  return (
    <div className="max-w-7xl w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" /> Officially Signed — August 6th, 2026
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-heading">
          The X Factors —{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-brand-blue">
            Social Contract
          </span>
        </h2>
        <p className="text-xs md:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          On August 6th, our team came together to establish our shared vision and commitments — what we expect from our leads &amp; LC system, and what we promise to every child in our care.
        </p>
      </div>

      {/* Prominent Wide Social Contract Photo Banner */}
      <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-300 shadow-2xl glass-card p-2 group bg-gradient-to-b from-amber-50/50 to-white">
        <div className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
          <img
            src={getAssetUrl('social-contract-aug6.jpeg')}
            alt="The X Factors Social Contract Signing — August 6th, 2026"
            className="w-full h-full object-contain group-hover:scale-102 transition-all duration-500"
            onError={(e) => {
              e.target.parentElement.innerHTML =
                '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#fef3c7,#fde68a);gap:8px"><span style="font-size:3rem">🤝</span><p style="font-size:12px;color:#92400e;font-weight:700;text-align:center;padding:0 12px">social-contract-aug6.jpeg</p></div>'
            }}
          />

          {/* Expand Fullscreen Button */}
          <button
            onClick={() => setIsPhotoExpanded(true)}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-950 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Expand Photo
          </button>

          {/* Bottom Photo Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent text-white flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                THE X FACTORS • MSS FN &amp; TUITIONS
              </span>
              <h3 className="text-base sm:text-lg font-black leading-tight font-heading">
                Social Contract Signing Day
              </h3>
            </div>
            <span className="text-xs text-slate-300 font-medium bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
              August 6th, 2026
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: What Was Expected vs What Was Promised */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-2">
        {/* Left Column: What Was Expected */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/60 via-white to-slate-50 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-blue-100 pb-3">
            <span className="p-2 rounded-2xl bg-blue-500 text-white shadow-md shadow-blue-500/25">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-heading">WHAT WAS EXPECTED</h3>
              <p className="text-xs text-slate-500">Key goals, support &amp; system expectations discussed</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {expected.map(({ emoji, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-blue-100/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-lg shrink-0 mt-0.5 group-hover:scale-110 transition-transform">{emoji}</span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: What Was Promised */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/60 via-white to-slate-50 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-rose-100 pb-3">
            <span className="p-2 rounded-2xl bg-rose-500 text-white shadow-md shadow-rose-500/25">
              <Heart className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-heading">WHAT WAS PROMISED</h3>
              <p className="text-xs text-slate-500">Core volunteer commitments to children &amp; team</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {promised.map(({ emoji, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-rose-100/80 shadow-sm hover:border-rose-300 hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-lg shrink-0 mt-0.5 group-hover:scale-110 transition-transform">{emoji}</span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inspiring Bottom Quote Card */}
      <div className="glass-card p-5 rounded-2xl text-center border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-rose-50 max-w-3xl mx-auto shadow-sm">
        <p className="text-xs sm:text-sm text-amber-950 font-bold italic">
          "A Social Contract is not a set of rules. It is a set of promises — made by people, for people, and for children."
        </p>
      </div>

      {/* Expanded Lightbox Modal for Uncropped Full Resolution View */}
      {isPhotoExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 rounded-3xl p-3 border border-white/20 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
            <button
              onClick={() => setIsPhotoExpanded(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={getAssetUrl('social-contract-aug6.jpeg')}
              alt="Social Contract Signing Full Uncropped View"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <p className="text-xs text-amber-300 font-mono font-bold mt-2">
              The X Factors — August 6th, 2026 Social Contract Signing
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
