import { useState } from 'react'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'

const decisionColors = {
  KEEP: 'text-green-400 bg-green-950/30 border-green-900/40',
  REMOVE: 'text-red-400 bg-red-950/30 border-red-900/40',
  REPLACE: 'text-amber-400 bg-amber-950/30 border-amber-900/40',
  CONSOLIDATE: 'text-blue-400 bg-blue-950/30 border-blue-900/40',
  REVIEW: 'text-slate-400 bg-slate-900/30 border-slate-700/40',
}

const riskColors = {
  LOW: 'text-green-400',
  MEDIUM: 'text-amber-400',
  HIGH: 'text-red-400',
}

export default function VendorTable({ vendors, navigate }) {
  const [filter, setFilter] = useState('ALL')
  const [expanded, setExpanded] = useState(null)
  const [sort, setSort] = useState({ field: 'monthly_cost', dir: 'desc' })

  const decisions = ['ALL', 'KEEP', 'REMOVE', 'REPLACE', 'CONSOLIDATE', 'REVIEW']

  const filtered = vendors
    .filter(v => filter === 'ALL' || v.decision === filter)
    .sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1
      if (sort.field === 'monthly_cost') return (a.monthly_cost - b.monthly_cost) * dir
      if (sort.field === 'name') return a.name.localeCompare(b.name) * dir
      return 0
    })

  const toggleSort = (field) => {
    setSort(s => s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'desc' })
  }

  const totalFiltered = filtered.reduce((sum, v) => sum + (v.monthly_cost || 0), 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Vendor Decisions</h1>
        <p className="text-slate-500 text-sm">Every tool. Every decision. With reasoning.</p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        {decisions.map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              filter === d
                ? d === 'ALL'
                  ? 'bg-slate-700 border-slate-600 text-slate-200'
                  : `border ${decisionColors[d]}`
                : 'border-navy-700 text-slate-500 hover:text-slate-300 hover:border-navy-600'
            }`}
          >
            {d} {d !== 'ALL' && `(${vendors.filter(v => v.decision === d).length})`}
          </button>
        ))}
        <div className="ml-auto text-xs text-slate-500">
          {filtered.length} vendors · ${totalFiltered.toFixed(2)}/mo
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-navy-700 text-xs text-slate-500 font-medium uppercase tracking-wider">
          <div className="col-span-3 cursor-pointer flex items-center gap-1" onClick={() => toggleSort('name')}>
            Vendor
            {sort.field === 'name' && (sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
          </div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1 cursor-pointer flex items-center gap-1 justify-end" onClick={() => toggleSort('monthly_cost')}>
            Cost
            {sort.field === 'monthly_cost' && (sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
          </div>
          <div className="col-span-2">Decision</div>
          <div className="col-span-1">Risk</div>
          <div className="col-span-3">Reason</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-navy-800">
          {filtered.map((v, i) => (
            <div key={i}>
              <div
                className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-navy-800/30 cursor-pointer transition-colors items-start"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="col-span-3">
                  <div className="text-sm text-slate-200 font-medium">{v.name}</div>
                  {v.duplicate_of?.length > 0 && (
                    <div className="text-xs text-amber-400/70 mt-0.5">
                      Overlaps: {v.duplicate_of.join(', ')}
                    </div>
                  )}
                </div>
                <div className="col-span-2 text-xs text-slate-500 pt-0.5">
                  {v.category?.replace('_', ' ')}
                </div>
                <div className="col-span-1 text-sm font-mono text-slate-300 text-right">
                  ${(v.monthly_cost || 0).toFixed(2)}
                </div>
                <div className="col-span-2">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${decisionColors[v.decision]}`}>
                    {v.decision}
                  </span>
                </div>
                <div className={`col-span-1 text-xs font-medium pt-0.5 ${riskColors[v.risk]}`}>
                  {v.risk}
                </div>
                <div className="col-span-3 text-xs text-slate-500 leading-relaxed">
                  {expanded === i ? v.reason : v.reason?.slice(0, 80) + (v.reason?.length > 80 ? '...' : '')}
                </div>
              </div>

              {expanded === i && v.replacement && (
                <div className="px-4 pb-4 bg-navy-900/30">
                  <div className="p-3 rounded-lg bg-navy-950 border border-navy-700">
                    <div className="text-xs font-medium text-sentinel-blue mb-1">Replacement workflow</div>
                    <div className="text-xs text-slate-400 leading-relaxed">{v.replacement}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            No vendors match this filter.
          </div>
        )}
      </div>

      {/* Summary row */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">{filtered.length} vendors shown</span>
        <div className="flex items-center gap-4">
          <span className="text-slate-500">Subtotal: <span className="text-slate-200 font-mono">${totalFiltered.toFixed(2)}/mo</span></span>
        </div>
      </div>
    </div>
  )
}
