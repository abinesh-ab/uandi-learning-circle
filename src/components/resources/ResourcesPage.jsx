import { useState, useMemo } from 'react'
import { ExternalLink, BookOpen, Search } from 'lucide-react'
import { resourceCategories, resourcesData } from '../../data/resourcesData'

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = useMemo(() => {
    return resourcesData.filter((res) => {
      if (activeCategory !== 'all' && res.category !== activeCategory) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return (
          res.title.toLowerCase().includes(q) ||
          res.subject.toLowerCase().includes(q) ||
          res.classLevel.toLowerCase().includes(q) ||
          res.resourceType.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-wider shadow-sm">
          <BookOpen className="w-4 h-4" /> Resource Hub
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-heading">
          Learning Circle <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-violet-600 to-amber-500">Toolbox</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Official academic textbooks, exercise guides, answer keys, and teaching materials for The X Factors.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 shadow-md space-y-4">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, class, or title..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {resourceCategories.map(({ id, label, icon }) => {
            const isActive = activeCategory === id
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Compact Resource Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="glass-card-interactive p-5 rounded-3xl border border-slate-200 flex flex-col justify-between hover:border-brand-blue group shadow-sm hover:shadow-lg space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{res.icon}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue text-[10px] font-extrabold uppercase">
                  {res.subject}
                </span>
              </div>

              <div className="text-[10px] font-mono text-slate-400 font-bold tracking-wider">
                {res.classLevel} • {res.resourceType}
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-blue transition-colors font-heading leading-tight">
                {res.title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">{res.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-slate-100 group-hover:bg-brand-blue text-slate-700 group-hover:text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{res.actionText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
