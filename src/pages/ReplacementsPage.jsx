import { useState } from 'react'
import { CheckCircle, DollarSign, Zap, ChevronDown, ChevronUp } from 'lucide-react'

const difficultyColors = {
  Easy: 'text-green-400 bg-green-950/30 border-green-900/30',
  Medium: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
  Hard: 'text-red-400 bg-red-950/30 border-red-900/30',
}

export default function ReplacementsPage({ replacements, vendors, navigate }) {
  const [expanded, setExpanded] = useState(0)

  const enriched = replacements.length > 0 ? replacements : vendors
    .filter(v => ['REMOVE', 'REPLACE', 'CONSOLIDATE'].includes(v.decision))
    .map(v => ({
      tool: v.name,
      options: [
        {
          label: 'Option A (Recommended)',
          name: 'Google Workspace / Free alternative',
          cost: 'Free',
          monthly_cost: 0,
          feature_match_pct: 80,
          annual_savings: (v.monthly_cost || 0) * 12,
          migration_difficulty: 'Medium',
          trade_offs: 'Some features may require manual workflows',
          ai_workflow: 'Use AI to automate repetitive tasks previously handled by this tool'
        }
      ]
    }))

  if (enriched.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center py-20 text-slate-500">No tools marked for replacement.</div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="text-xs text-sentinel-blue uppercase tracking-widest font-medium mb-1">Software Replacement Engine</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Replacement Options</h1>
        <p className="text-slate-500 text-sm">{enriched.length} tools with free or lower-cost alternatives identified</p>
      </div>

      <div className="space-y-4">
        {enriched.map((item, i) => {
          const vendor = vendors.find(v => v.name === item.tool)
          const isOpen = expanded === i
          return (
            <div key={i} className="card overflow-hidden">
              <button
                className="w-full flex items-center gap-4 p-5 hover:bg-navy-800/30 transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-slate-200">{item.tool}</span>
                    {vendor && (
                      <span className="text-xs text-slate-500">${(vendor.monthly_cost || 0).toFixed(2)}/mo current</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">{item.options?.length || 0} alternatives found</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {item.options?.[0] && (
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-400">
                        ${((vendor?.monthly_cost || 0) - (item.options[0].monthly_cost || 0)).toFixed(2)}/mo saved
                      </div>
                      <div className="text-xs text-slate-500">with best option</div>
                    </div>
                  )}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-navy-700 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {item.options?.map((opt, j) => (
                      <div key={j} className={`p-4 rounded-xl border ${j === 0 ? 'border-sentinel-blue/30 bg-sentinel-blue/5' : 'border-navy-700 bg-navy-950'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-semibold ${j === 0 ? 'text-sentinel-blue' : 'text-slate-400'}`}>{opt.label}</span>
                          {j === 0 && <CheckCircle className="w-4 h-4 text-sentinel-blue" />}
                        </div>

                        <div className="text-lg font-bold text-slate-200 mb-1">{opt.name}</div>
                        <div className="text-sm text-green-400 font-semibold mb-3">{opt.cost}</div>

                        <div className="space-y-2 mb-3">
                          {/* Feature match */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">Feature match</span>
                              <span className="text-slate-300">{opt.feature_match_pct}%</span>
                            </div>
                            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                              <div className="h-full bg-sentinel-blue rounded-full" style={{ width: `${opt.feature_match_pct}%` }} />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Annual savings</span>
                            <span className="text-green-400 font-semibold">${(opt.annual_savings || 0).toLocaleString()}</span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Migration</span>
                            <span className={`px-2 py-0.5 rounded border text-xs font-medium ${difficultyColors[opt.migration_difficulty]}`}>
                              {opt.migration_difficulty}
                            </span>
                          </div>
                        </div>

                        {opt.trade_offs && (
                          <div className="p-2 bg-navy-900 rounded-lg mb-2">
                            <div className="text-xs text-slate-500 mb-1">Trade-offs</div>
                            <div className="text-xs text-slate-400">{opt.trade_offs}</div>
                          </div>
                        )}

                        {opt.ai_workflow && (
                          <div className="p-2 bg-sentinel-blue/5 border border-sentinel-blue/20 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <Zap className="w-3 h-3 text-sentinel-blue" />
                              <span className="text-xs text-sentinel-blue">AI Workflow</span>
                            </div>
                            <div className="text-xs text-slate-400">{opt.ai_workflow}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
