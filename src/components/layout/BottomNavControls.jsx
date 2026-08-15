import { ArrowLeft, ArrowRight, Maximize, Minimize } from 'lucide-react'

export default function BottomNavControls({ currentSlide, totalSlides, navigate, toggleFullscreen, isFullscreen }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/90 px-4 py-2.5 rounded-full shadow-xl border border-slate-200/90 backdrop-blur-md">
      <span className="text-xs font-mono text-brand-blue font-bold px-2">
        {currentSlide} / {totalSlides}
      </span>

      <button
        onClick={toggleFullscreen}
        title="Toggle Fullscreen Mode"
        className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>

      <button
        onClick={() => navigate(-1)}
        disabled={currentSlide === 1}
        className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all disabled:opacity-30"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => navigate(1)}
        disabled={currentSlide === totalSlides}
        className="p-2.5 rounded-full bg-brand-blue hover:bg-blue-700 text-white font-bold transition-all flex items-center gap-1.5 px-4 shadow-lg shadow-blue-600/25 disabled:opacity-50"
      >
        <span className="text-xs">Next</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
