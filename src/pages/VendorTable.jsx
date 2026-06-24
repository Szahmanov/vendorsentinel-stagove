import { useState } from 'react'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'

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

export default function VendorTable({ vendors }) {
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

  const totalFiltered = filtered.reduce((sum, v) => sum + (v.monthly_cost || 0), 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Vendor Decisions</h1>
        <p className="text-slate-500 text-sm">Every tool. Every decision. With reasoning.</p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        {decisions.map(d => (
          <button key={d} onClick={() => setFilter(d)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              filter === d
                ? d === 'ALL' ? 'bg-slate-700 border-slate-600 text-slate-200' : `border ${decisionColors[d]}`
                : 'border-navy-700 text-slate-500 hover:text-slate-300 hover:border-navy-600'
            }`}>
            {d} {d !== 'ALL' && `(${vendors.filter(v => v.decision === d).length})`}
          </button>
        ))}
        <div className="ml-auto text-xs text-slate-500 flex-shrink-0">
          {filtered.length} vendors · ${totalFiltered.toFixed(2)}/mo
        </div>
      </div>

      {/* Cards — works on all screen sizes */}
      <div className="space-y-3">
        {filtered.map((v, i) => {
          const reason = v.reasoning || v.reason || ''
          const isOpen = expanded === i
          return (
            <div key={i} className="card overflow-hidden">
              {/* Main row */}
              <button
                className="w-full text-left p-4 hover:bg-navy-800/30 transition-colors"
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div className="flex items-start gap-3">
                  {/* Decision badge */}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${decisionColors[v.decision]}`}>
                    {v.decision}
                  </span>

                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-semibold text-slate-200">{v.name}</span>
                      <span className="text-xs text-slate-500">{v.category?.replace(/_/g, ' ')}</span>
                    </div>
                    {v.duplicate_of?.length > 0 && (
                      <div className="text-xs text-amber-400/80 mt-0.5">
                        Overlaps: {v.duplicate_of.join(', ')}
                      </div>
                    )}
                    {v.existing_stack_replacement && (
                      <div className="text-xs text-green-400 mt-0.5">
                        → Use {v.existing_stack_replacement} (already owned)
                      </div>
                    )}
                  </div>

                  {/* Cost + risk + chevron */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-sm font-mono text-slate-300">${(v.monthly_cost || 0).toFixed(2)}/mo</span>
                    <span className={`text-xs font-medium ${riskColors[v.risk]}`}>{v.risk} risk</span>
                  </div>
                  {isOpen
                    ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  }
                </div>

                {/* Reason preview (collapsed) */}
                {!isOpen && reason && (
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2 pl-0">
                    {reason}
                  </p>
                )}
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-navy-800 p-4 bg-navy-950/40 space-y-3">
                  {/* Full reasoning */}
                  {reason && (
                    <div>
                      <div className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Reasoning</div>
                      <p className="text-sm text-slate-400 leading-relaxed">{reason}</p>
                    </div>
                  )}

                  {/* Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {v.confidence_score != null && (
                      <div className="p-2 bg-navy-900 rounded-lg text-center">
                        <div className="text-xs text-slate-500 mb-0.5">Confidence</div>
                        <div className="text-sm font-bold text-sentinel-blue">{v.confidence_score}%</div>
                      </div>
                    )}
                    {v.risk_score != null && (
                      <div className="p-2 bg-navy-900 rounded-lg text-center">
                        <div className="text-xs text-slate-500 mb-0.5">Risk Score</div>
                        <div className={`text-sm font-bold ${riskColors[v.risk]}`}>{v.risk_score}/100</div>
                      </div>
                    )}
                    {(v.estimated_annual_savings || v.estimated_monthly_savings) && (
                      <div className="p-2 bg-navy-900 rounded-lg text-center">
                        <div className="text-xs text-slate-500 mb-0.5">Annual Saving</div>
                        <div className="text-sm font-bold text-green-400">
                          ${(v.estimated_annual_savings || (v.estimated_monthly_savings || 0) * 12).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {v.migration_time_estimate && (
                      <div className="p-2 bg-navy-900 rounded-lg text-center">
                        <div className="text-xs text-slate-500 mb-0.5">Migration</div>
                        <div className="text-sm font-bold text-amber-400">{v.migration_time_estimate}</div>
                      </div>
                    )}
                  </div>

                  {/* Expected outcome */}
                  {v.expected_outcome && (
                    <div className="p-3 bg-sentinel-blue/5 border border-sentinel-blue/15 rounded-lg">
                      <span className="text-xs text-sentinel-blue font-medium">Expected outcome: </span>
                      <span className="text-xs text-slate-400">{v.expected_outcome}</span>
                    </div>
                  )}

                  {/* Lock-in */}
                  {v.lock_in_analysis?.risk_factors?.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Lock-in Risk Factors</div>
                      <div className="flex flex-wrap gap-1.5">
                        {v.lock_in_analysis.risk_factors.map((rf, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 bg-amber-950/30 border border-amber-900/30 text-amber-300 rounded">{rf}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Replacement suggestion */}
                  {v.replacement_suggestion && (
                    <div className="p-3 bg-navy-900 rounded-lg border border-navy-700">
                      <div className="text-xs font-medium text-slate-400 mb-1">Replacement suggestion</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{v.replacement_suggestion}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="card py-12 text-center text-slate-500 text-sm">No vendors match this filter.</div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">{filtered.length} vendors shown</span>
        <span className="text-slate-500">Total: <span className="text-slate-200 font-mono">${totalFiltered.toFixed(2)}/mo</span></span>
      </div>
    </div>
  )
}
