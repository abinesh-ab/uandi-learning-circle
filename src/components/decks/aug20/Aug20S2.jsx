import { getAssetUrl } from '../../../utils/assetUrl'
import { FileText, Lightbulb, CheckCircle2, Box, ArrowRight, ExternalLink, HelpCircle, Layers, Award } from 'lucide-react'

export default function Aug20S2() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Real-World Problem',
      icon: '🎁',
      desc: 'Place a shoebox on the table: "How much wrapping paper covers this box completely?" Establishes Surface Area = Outside Boundary vs Volume = Space Inside.',
      border: 'border-l-amber-500 bg-amber-50/60',
    },
    {
      step: 'Step 2',
      title: '6 Faces via Unfolded 3D Nets',
      icon: '📦',
      desc: 'Unfold physical net into 3 equal opposite pairs: Top/Bottom, Front/Back, and Left/Right.',
      border: 'border-l-blue-500 bg-blue-50/60',
    },
    {
      step: 'Step 3',
      title: 'Formula Derivation Together',
      icon: '📐',
      desc: 'Using l=10, b=5, h=3 cm, sum the 3 equal face pairs to derive Total Surface Area TSA = 2(lb + bh + lh) and Cube TSA = 6a².',
      border: 'border-l-emerald-500 bg-emerald-50/60',
    },
    {
      step: 'Step 4',
      title: 'Examination Protocol (5-Step Thought Chain)',
      icon: '🧠',
      desc: 'What happens? ➔ Finding what? ➔ Which concept? ➔ Which formula? ➔ Substitute & Solve.',
      border: 'border-l-purple-500 bg-purple-50/60',
    },
    {
      step: 'Step 5',
      title: 'Deliberate Comparison Challenge',
      icon: '🔄',
      desc: 'Wrapping/Painting Box ➔ Surface Area | Filling Water/Toys ➔ Volume | Tiling Floor ➔ 2D Area.',
      border: 'border-l-rose-500 bg-rose-50/60',
    },
    {
      step: 'Step 6',
      title: 'Proof of Mastery',
      icon: '🌟',
      desc: 'Solve an unseen transfer problem + 1-Minute Teach-Back explaining Surface Area as if teaching a 5th Standard student.',
      border: 'border-l-teal-500 bg-teal-50/60',
    },
  ]

  const checkpoints = [
    { num: 1, label: 'Concept', desc: 'Outside boundary vs space inside' },
    { num: 2, label: 'Starting Base', desc: 'Rectangle area base (l × b)' },
    { num: 3, label: 'Concrete Tool', desc: 'Physical shoebox + cut unfolded net' },
    { num: 4, label: 'Discovery', desc: 'Recognizing 3 pairs of equal faces' },
    { num: 5, label: 'Real App', desc: 'Carton packaging & paint estimation' },
    { num: 6, label: 'Proof Task', desc: '1-Minute Teach-Back to 5th Std student' },
  ]

  return (
    <div className="max-w-6xl w-full space-y-6 animate-fade-in pb-4">
      {/* Header & Meta Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Box className="w-3.5 h-3.5" /> Slide 2 of 3 • Model Class Preparation
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-heading">
            Class 2: Surface Area of Cuboid &amp; Cube (Mensuration)
          </h2>
          <p className="text-xs text-slate-500">Pedagogical lesson plan design &amp; concrete active learning framework</p>
        </div>

        {/* Attachment Button */}
        <a
          href="https://drive.google.com/drive/folders/1RUDUHaTVkUI_7avWTjMF52EFETkbS-5D"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all shrink-0"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>View Full Model Prepared Class Plan</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/70" />
        </a>
      </div>

      {/* Core Principle & Criterion Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-3xl border-2 border-amber-300 bg-amber-50/50 space-y-2">
          <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest block flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> CORE TEACHING PRINCIPLE
          </span>
          <p className="text-sm font-black text-slate-900 font-heading italic">
            "Don't teach the formula first. Create the situation that makes the formula necessary."
          </p>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-3xl border-2 border-emerald-300 bg-emerald-50/50 space-y-2">
          <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-widest block flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-600" /> REAL SUCCESS CRITERION
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 italic">
            "She looks at a real object, understands what boundary needs to be measured, chooses the correct calculation, and explains why."
          </p>
        </div>
      </div>

      {/* Six-Step Pedagogical Flow */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 space-y-4 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-heading">Six-Step Pedagogical Flow</h3>
              <p className="text-xs text-slate-500">From concrete real-world situation to formula derivation &amp; proof task</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            6 Steps Loop
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map(({ step, title, icon, desc, border }) => (
            <div key={step} className={`p-4 rounded-2xl border-l-4 space-y-2 ${border} transition-all hover:shadow-md`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-base">{icon}</span> {step}
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 font-heading">{title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formula & Thought Chain Highlight Card */}
      <div className="glass-card p-5 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-purple-50/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-mono font-bold text-brand-blue uppercase tracking-widest">
            DERIVED FORMULA SUMMARY
          </span>
          <div className="flex items-center gap-3 flex-wrap pt-1">
            <span className="px-3 py-1.5 rounded-xl bg-blue-100 text-brand-blue font-mono font-black text-xs border border-blue-300">
              TSA of Cuboid = 2(lb + bh + lh)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-700 font-mono font-black text-xs border border-purple-300">
              TSA of Cube = 6a²
            </span>
          </div>
        </div>

        <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            5-STEP THOUGHT CHAIN
          </span>
          <p className="text-xs font-bold text-slate-800 pt-0.5">
            1. Situation ➔ 2. Target ➔ 3. Concept ➔ 4. Formula ➔ 5. Solve
          </p>
        </div>
      </div>

      {/* Before-Class Educator Checkpoints */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 space-y-3 bg-white">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Before-Class Educator Checkpoints
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {checkpoints.map(({ num, label, desc }) => (
            <div key={num} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center mx-auto">
                {num}
              </span>
              <span className="text-[11px] font-black text-slate-900 block">{label}</span>
              <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
