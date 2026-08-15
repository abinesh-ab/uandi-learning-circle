import { getAssetUrl } from '../../../utils/assetUrl'

const expected = [
  { emoji: '✨', text: 'Show up every Saturday, consistently and on time' },
  { emoji: '📋', text: 'Come prepared with a class plan — even a simple one' },
  { emoji: '🌱', text: 'Be patient — every child learns at their own pace' },
  { emoji: '🗣️', text: 'Communicate openly — no issue is too small to share' },
  { emoji: '📝', text: "Log your student's progress after every session" },
  { emoji: '💡', text: "Bring creativity — don't just follow the textbook" },
  { emoji: '🌻', text: 'Know your child beyond their marks and grades' },
  { emoji: '🔥', text: 'Bring your energy — your presence shapes the whole class' },
  { emoji: '🪫', text: 'Support your fellow volunteers, not just your student' },
  { emoji: '🚀', text: 'Keep growing — attend LC calls and share your ideas' },
]

const promised = [
  { emoji: '📛', text: 'I will show up with intention, not just attendance' },
  { emoji: '🌟', text: "I will know my student's story, not just their marks" },
  { emoji: '🎯', text: 'I will never give up on a child who is struggling' },
  { emoji: '📖', text: 'I will make every Saturday count — for my child' },
  { emoji: '🙋', text: 'I will speak up when I need help or guidance' },
  { emoji: '🗺️', text: 'I will plan my class — even if imperfectly' },
  { emoji: '🎉', text: 'I will celebrate every small win with my child' },
  { emoji: '🤝', text: 'I will be a team player in The X Factors' },
  { emoji: '🔄', text: 'I will reflect after each class and keep improving' },
  { emoji: '❤️', text: 'I will remember why I started — the children' },
]

export default function Aug6S1() {
  return (
    <div className="max-w-7xl w-full space-y-4">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          🤝 Officially Signed — August 6th, 2026
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900">
          The X Factors —{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-400 to-brand-blue">Social Contract</span>
        </h2>
        <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
          On August 6th, the team gathered with pens, sticky notes, ideas and courage. Together, we wrote our shared promise — to each other, and to every child in our care.
        </p>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px_1fr] gap-4 items-start">
        {/* Left: Expected */}
        <div>
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-wider">
              💙 What Was Expected
            </span>
            <p className="text-[9px] text-slate-400 mt-1 font-medium">From every volunteer in The X Factors</p>
          </div>
          <div className="space-y-1.5">
            {expected.map(({ emoji, text }) => (
              <div key={text} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-blue-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <span className="text-sm shrink-0 mt-0.5">{emoji}</span>
                <p className="text-[11px] text-slate-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Photo + Quote */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-300 shadow-xl glass-card p-1.5 group">
            <div className="rounded-xl overflow-hidden bg-amber-50" style={{ height: '300px' }}>
              <img
                src={getAssetUrl('social-contract-aug6.jpeg')}
                alt="The X Factors Social Contract Signing — August 6th, 2026"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#fef3c7,#fde68a);gap:8px"><span style="font-size:3rem">🤝</span><p style="font-size:10px;color:#92400e;font-weight:700;text-align:center;padding:0 12px">social-contract-aug6.jpeg</p></div>'
                }}
              />
            </div>
            <div className="absolute inset-x-1.5 bottom-1.5 p-2.5 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent rounded-b-xl text-white">
              <span className="text-[8px] font-mono font-bold text-amber-400 uppercase tracking-widest block">THE X FACTORS</span>
              <h3 className="text-xs font-black leading-tight">Social Contract Signing</h3>
              <span className="text-[9px] text-slate-300">Aug 6, 2026 • MSS FN &amp; Tuitions</span>
            </div>
          </div>
          <div className="w-full bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-[10px] text-amber-800 italic font-medium leading-relaxed">
              "A Social Contract is not a set of rules.<br />It is a set of promises — made by people,<br />for people, and for children."
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <div className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-[8px] text-amber-600 font-black uppercase tracking-widest">The X Factors • 2026</span>
              <div className="w-1 h-1 rounded-full bg-amber-400" />
            </div>
          </div>
        </div>

        {/* Right: Promised */}
        <div>
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black rounded-full uppercase tracking-wider">
              ❤️ What They Promised
            </span>
            <p className="text-[9px] text-slate-400 mt-1 font-medium">From the heart of every X Factor</p>
          </div>
          <div className="space-y-1.5">
            {promised.map(({ emoji, text }) => (
              <div key={text} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-rose-100 shadow-sm hover:border-rose-300 hover:shadow-md transition-all duration-200">
                <span className="text-sm shrink-0 mt-0.5">{emoji}</span>
                <p className="text-[11px] text-slate-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
