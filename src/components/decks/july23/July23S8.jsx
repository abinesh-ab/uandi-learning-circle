export default function July23S8() {
  return (
    <div className="max-w-5xl w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold text-slate-900 font-heading">Social Contract</h2>
        <p className="text-slate-600 text-base max-w-lg mx-auto">
          "Social Contract is not a set of rules. It is a set of promises."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="glass-card-interactive p-8 rounded-3xl space-y-4 text-center border-l-4 border-l-blue-500">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-heading">Lead ➔ Volunteer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Support, guidance, continuous feedback, resources, and unwavering trust in your capacity to teach.
          </p>
        </div>

        <div className="glass-card-interactive p-8 rounded-3xl space-y-4 text-center border-l-4 border-l-amber-500">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-heading">Volunteer ➔ Student</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Empathy, consistency, active listening, mentorship, and believing in their unlimited potential.
          </p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl text-center space-y-2 max-w-xl mx-auto">
        <p className="text-xs text-slate-600">
          🤝 <em>We'll do this offline because promises deserve people, not forms.</em>
        </p>
      </div>
    </div>
  )
}
