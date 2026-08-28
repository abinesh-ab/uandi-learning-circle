import { useState, useMemo, useEffect } from 'react'
import {
  BookOpen,
  Search,
  Plus,
  ExternalLink,
  Trash2,
  FileText,
  Link as LinkIcon,
  FileSpreadsheet,
  File,
  Database,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { resourceCategories } from '../../data/resourcesData'
import { useResources } from '../../hooks/useResources'
import AddResourceModal from './AddResourceModal'
import AdminDeleteModal from '../common/AdminDeleteModal'

const FILE_TYPE_BADGES = {
  PDF: 'bg-rose-100 text-rose-700 border-rose-200',
  DOC: 'bg-blue-100 text-blue-700 border-blue-200',
  LINK: 'bg-purple-100 text-purple-700 border-purple-200',
  SHEET: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const CATEGORY_COLORS = {
  '9th Maths': 'bg-amber-100 text-amber-800 border-amber-200',
  Accountancy: 'bg-blue-100 text-blue-800 border-blue-200',
  Templates: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Curriculum: 'bg-purple-100 text-purple-800 border-purple-200',
  Pedagogy: 'bg-rose-100 text-rose-800 border-rose-200',
  'Foundational Numeracy': 'bg-violet-100 text-violet-800 border-violet-200',
  General: 'bg-slate-100 text-slate-800 border-slate-200',
}

export default function ResourcesPage() {
  const { resources, isLoading, isSupabaseConfigured, addResource, deleteResource } = useResources()

  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [targetDeleteId, setTargetDeleteId] = useState(null)
  const [targetDeleteTitle, setTargetDeleteTitle] = useState('')

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchCat = activeCategory === 'All' || res.category === activeCategory
      const q = searchQuery.trim().toLowerCase()
      const matchSearch =
        !q ||
        res.title?.toLowerCase().includes(q) ||
        res.category?.toLowerCase().includes(q) ||
        res.grade?.toLowerCase().includes(q) ||
        res.description?.toLowerCase().includes(q)

      return matchCat && matchSearch
    })
  }, [resources, activeCategory, searchQuery])

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, searchQuery])

  // Paginated resources
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredResources.length)

  const paginatedResources = useMemo(() => {
    return filteredResources.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredResources, startIndex, itemsPerPage])

  // Handle Add Resource
  const handleAddSubmit = async (payload) => {
    const res = await addResource(payload)
    if (res.success) {
      showToast('Resource added successfully!')
    }
    return res
  }

  // Handle Delete Prompt
  const promptDelete = (id, title) => {
    setTargetDeleteId(id)
    setTargetDeleteTitle(title)
    setIsDeleteModalOpen(true)
  }

  // Handle Delete Confirmation (Passcode: 'factors')
  const handleConfirmDelete = async (passcode) => {
    if (!targetDeleteId) return { error: 'No item selected' }
    const res = await deleteResource(targetDeleteId, passcode)
    if (res.success) {
      showToast('Resource deleted.')
    }
    return res
  }

  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'LINK':
        return <LinkIcon className="w-3.5 h-3.5" />
      case 'SHEET':
        return <FileSpreadsheet className="w-3.5 h-3.5" />
      case 'DOC':
      case 'PDF':
      default:
        return <FileText className="w-3.5 h-3.5" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-blue/10 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-brand-blue" /> Learning Circle Resource Hub
            </div>
            {/* Supabase Status Indicator */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>{isSupabaseConfigured ? 'Supabase Live Sync' : 'LocalStorage Mode'}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-amber-500">Toolbox &amp; Repository</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            High-density table view of textbooks, answer guides, session planners, and question banks.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-brand-blue hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Resource
        </button>
      </div>

      {/* Controls Bar: Search & Category Pills */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Real-time Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, grade, or category..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs font-medium rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:bg-white"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center md:justify-end w-full">
            {resourceCategories.map(({ id, label, icon }) => {
              const isActive = activeCategory === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md scale-105 ring-2 ring-brand-blue'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  <span className="text-sm">{icon}</span>
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          HIGH-DENSITY COMPACT RESOURCE TABLE VIEW
         ──────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-4 sm:px-6 w-16 text-center">Type</th>
                <th className="py-4 px-4 sm:px-6">Resource Title &amp; Description</th>
                <th className="py-4 px-4 sm:px-6">Category &amp; Grade</th>
                <th className="py-4 px-4 sm:px-6">Date Added</th>
                <th className="py-4 px-4 sm:px-6 text-right w-36">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                // Loading Skeleton Rows
                [1, 2, 3, 4].map((n) => (
                  <tr key={n} className="animate-pulse">
                    <td className="py-4 px-4 text-center">
                      <div className="w-8 h-6 bg-slate-200 rounded-lg mx-auto" />
                    </td>
                    <td className="py-4 px-4 space-y-2">
                      <div className="w-48 h-4 bg-slate-200 rounded" />
                      <div className="w-72 h-3 bg-slate-100 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-24 h-5 bg-slate-200 rounded-full" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-20 h-3 bg-slate-100 rounded" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="w-16 h-8 bg-slate-200 rounded-xl ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredResources.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 space-y-3">
                    <BookOpen className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                    <p className="text-sm font-bold text-slate-600">No resources found matching filters.</p>
                    <p className="text-xs text-slate-400">Try adjusting your search query or selected category pill.</p>
                  </td>
                </tr>
              ) : (
                paginatedResources.map((res) => {
                  const badgeStyle = FILE_TYPE_BADGES[res.file_type] || FILE_TYPE_BADGES.PDF
                  const catStyle = CATEGORY_COLORS[res.category] || CATEGORY_COLORS.General

                  const formattedDate = res.created_at
                    ? new Date(res.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Aug 2026'

                  return (
                    <tr
                      key={res.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Column 1: Icon / Type Badge */}
                      <td className="py-4 px-4 sm:px-6 text-center align-middle">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase shadow-2xs ${badgeStyle}`}
                          title={`File type: ${res.file_type}`}
                        >
                          {getFileTypeIcon(res.file_type)}
                          <span>{res.file_type}</span>
                        </span>
                      </td>

                      {/* Column 2: Title & Description */}
                      <td className="py-4 px-4 sm:px-6 align-middle space-y-1 max-w-md">
                        <h4 className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors font-heading text-sm leading-snug">
                          {res.title}
                        </h4>
                        {res.description && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {res.description}
                          </p>
                        )}
                      </td>

                      {/* Column 3: Category & Grade */}
                      <td className="py-4 px-4 sm:px-6 align-middle space-y-1.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${catStyle}`}>
                          {res.category}
                        </span>
                        {res.grade && (
                          <div className="text-[10px] font-mono text-slate-500 font-bold">
                            {res.grade}
                          </div>
                        )}
                      </td>

                      {/* Column 4: Date Added */}
                      <td className="py-4 px-4 sm:px-6 align-middle text-xs font-medium text-slate-500 whitespace-nowrap">
                        {formattedDate}
                      </td>

                      {/* Column 5: Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={res.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-brand-blue/10 hover:bg-brand-blue hover:text-white text-brand-blue font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => promptDelete(res.id, res.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete Resource (Passcode required)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Compact Table Pagination Footer */}
        {filteredResources.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
            <div>
              Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-slate-900">{endIndex}</span> of{' '}
              <span className="font-bold text-slate-900">{filteredResources.length}</span> resources
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Page Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <span className="px-3 font-bold text-slate-900">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl focus:outline-none focus:border-brand-blue cursor-pointer shadow-2xs"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      {/* Uniform Passcode Protected Delete Modal */}
      <AdminDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={targetDeleteTitle}
      />
    </div>
  )
}
