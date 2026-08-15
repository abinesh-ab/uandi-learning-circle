export default function July23S7() {
  return (
    <div className="max-w-4xl w-full space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold text-slate-900 font-heading">Why We Show Up</h2>
        <p className="text-slate-600 text-base max-w-xl mx-auto">
          Every Saturday morning, you choose to give your time. Let's remind ourselves why.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            emoji: '🌟',
            title: 'You are the difference',
            desc: 'For some of our kids, you are the only consistent mentor in their academic life.',
          },
          {
            emoji: '🌱',
            title: 'Growth takes time',
            desc: 'You may not see results today. But every class you teach is a root being built underground.',
          },
          {
            emoji: '❤️',
            title: 'Your impact is real',
            desc: 'Years from now, a child will look back and remember the volunteer who believed in them.',
          },
        ].map(({ emoji, title, desc }) => (
          <div
            key={title}
            className="glass-card-interactive p-8 rounded-3xl flex flex-col items-center gap-4 border-t-4 border-t-brand-blue"
          >
            <span className="text-4xl">{emoji}</span>
            <h3 className="text-lg font-bold text-slate-900 font-heading">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 rounded-2xl text-center max-w-2xl mx-auto bg-brand-blue/5 border border-brand-blue/20">
        <p className="text-brand-blue font-black text-lg">
          "Don't measure your impact by what you see. Measure it by what you give."
        </p>
      </div>
    </div>
  )
}
