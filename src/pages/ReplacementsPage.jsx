import { useState } from 'react'
import { CheckCircle, ChevronDown, ChevronUp, Zap, Star, DollarSign, Code } from 'lucide-react'

const typeConfig = {
  BEST: { label: 'Best Option', icon: Star, color: 'text-sentinel-blue', border: 'border-sentinel-blue/30 bg-sentinel-blue/5', badge: 'bg-sentinel-blue/20 text-sentinel-blue border-sentinel-blue/30' },
  FREE: { label: 'Free Option', icon: CheckCircle, color: 'text-green-400', border: 'border-green-900/30 bg-green-950/5', badge: 'bg-green-950/30 text-green-400 border-green-900/30' },
  CHEAPEST: { label: 'Cheapest Option', icon: DollarSign, color: 'text-amber-400', border: 'border-amber-900/30 bg-amber-950/5', badge: 'bg-amber-950/30 text-amber-400 border-amber-900/30' },
  OPEN_SOURCE: { label: 'Open Source', icon: Code, color: 'text-purple-400', border: 'border-purple-900/30 bg-purple-950/5', badge: 'bg-purple-950/30 text-purple-400 border-purple-900/30' },
}

const difficultyColors = {
  Easy: 'text-green-400',
  Medium: 'text-amber-400',
  Hard: 'text-red-400',
}

function FeatureBar({ label, score }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-navy-800 rounded-full overflow-hidden">
        <div className="h-full bg-sentinel-blue/60 rounded-full" style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">{score}%</span>
    </div>
  )
}

export default function ReplacementsPage({ replacements, vendors }) {
  const [expanded, setExpanded] = useState(0)

  const items = replacements.length > 0 ? replacements : vendors
    .filter(v => ['REMOVE', 'REPLACE', 'CONSOLIDATE'].includes(v.decision))
    .map(v => ({
      tool: v.name,
      original_monthly_cost: v.monthly_cost,
      replacement_reasoning: v.reasoning || 'Selected based on functionality overlap and cost analysis.',
      options: [
        { type: 'BEST', label: 'Best Option', name: v.existing_stack_replacement || 'Google Workspace', already_owned: !!v.existing_stack_replacement, cost: v.existing_stack_replacement ? 'Already owned' : 'Free', monthly_cost: 0, feature_match_pct: 85, feature_breakdown: { core_features: 85, collaboration: 80, integrations: 75, reliability: 90, ease_of_use: 85 }, annual_savings: (v.monthly_cost || 0) * 12, migration_time: '1-2 days', migration_difficulty: 'Easy', business_interruption_risk: 'Low', trade_offs: 'Minor workflow adjustments required' },
        { type: 'FREE', label: 'Free Option', name: 'Free alternative', already_owned: false, cost: 'Free', monthly_cost: 0, feature_match_pct: 75, feature_breakdown: { core_features: 75, collaboration: 70, integrations: 60, reliability: 80, ease_of_use: 80 }, annual_savings: (v.monthly_cost || 0) * 12, migration_time: '2-3 days', migration_difficulty: 'Medium', business_interruption_risk: 'Low', trade_offs: 'Fewer integrations, manual workarounds needed' },
        { type: 'CHEAPEST', label: 'Cheapest Option', name: 'Budget alternative', already_owned: false, cost: '$5/mo', monthly_cost: 5, feature_match_pct: 80, feature_breakdown: { core_features: 80, collaboration: 75, integrations: 70, reliability: 85, ease_of_use: 80 }, annual_savings: ((v.monthly_cost || 0) - 5) * 12, migration_time: '1-2 days', migration_difficulty: 'Easy', business_interruption_risk: 'Low', trade_offs: 'Slightly reduced feature set' },
        { type: 'OPEN_SOURCE', label: 'Open Source', name: 'Open source alternative', already_owned: false, cost: 'Free (self-hosted)', monthly_cost: 0, feature_match_pct: 78, feature_breakdown: { core_features: 80, collaboration: 70, integrations: 65, reliability: 75, ease_of_use: 65 }, annual_savings: (v.monthly_cost || 0) * 12, migration_time: '1 week', migration_difficulty: 'Hard', business_interruption_risk: 'Medium', trade_offs: 'Requires server setup and maintenance' },
      ]
    }))

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center py-20 text-slate-500">No tools marked for replacement.</div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="text-xs text-sentinel-blue uppercase tracking-widest font-medium mb-1">Stack-First Replacement Engine</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Replacement Options</h1>
        <p className="text-slate-500 text-sm">{items.length} tools · 4 options each · existing stack checked first</p>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => {
          const isOpen = expanded === i
          const bestSaving = item.options?.[0]?.annual_savings || 0
          return (
            <div key={i} className="card overflow-hidden">
              <button className="w-full flex items-center gap-4 p-5 hover:bg-navy-800/30 transition-colors text-left"
                onClick={() => setExpanded(isOpen ? null : i)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-semibold text-slate-200">{item.tool}</span>
                    <span className="text-xs text-slate-500">${(item.original_monthly_cost || 0).toFixed(2)}/mo current</span>
                    {item.options?.some(o => o.already_owned) && (
                      <span className="text-xs text-green-400 bg-green-950/30 border border-green-900/30 px-2 py-0.5 rounded">
                        ✓ Existing stack covers this
                      </span>
                    )}
                  </div>
                  {item.replacement_reasoning && (
                    <p className="text-xs text-slate-500 leading-relaxed">{item.replacement_reasoning}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">up to ${bestSaving.toLocaleString()}/yr saved</div>
                    <div className="text-xs text-slate-500">4 options available</div>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-navy-700 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {item.options?.map((opt, j) => {
                      const cfg = typeConfig[opt.type] || typeConfig.BEST
                      const Icon = cfg.icon
                      return (
                        <div key={j} className={`p-4 rounded-xl border ${cfg.border}`}>
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${cfg.badge}`}>{opt.label}</span>
                            {opt.already_owned && (
                              <span className="text-xs text-green-400 bg-green-950/30 border border-green-900/30 px-2 py-0.5 rounded">Owned</span>
                            )}
                          </div>

                          <div className="text-base font-bold text-slate-200 mb-1">{opt.name}</div>
                          <div className={`text-sm font-semibold mb-3 ${opt.monthly_cost === 0 ? 'text-green-400' : 'text-amber-400'}`}>{opt.cost}</div>

                          {/* Overall match */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">Overall match</span>
                              <span className={cfg.color}>{opt.feature_match_pct}%</span>
                            </div>
                            <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${j === 0 ? 'bg-sentinel-blue' : j === 1 ? 'bg-green-500' : j === 2 ? 'bg-amber-500' : 'bg-purple-500'}`}
                                style={{ width: `${opt.feature_match_pct}%` }} />
                            </div>
                          </div>

                          {/* Feature breakdown */}
                          {opt.feature_breakdown && (
                            <div className="space-y-1.5 mb-3 p-2 bg-navy-900/50 rounded-lg">
                              <div className="text-xs text-slate-500 mb-2 font-medium">Feature breakdown:</div>
                              {Object.entries(opt.feature_breakdown).map(([key, val]) => (
                                <FeatureBar key={key} label={key.replace('_', ' ')} score={val} />
                              ))}
                            </div>
                          )}

                          {/* Stats */}
                          <div className="space-y-1.5 mb-3">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Annual savings</span>
                              <span className="text-green-400 font-semibold">${(opt.annual_savings || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Migration time</span>
                              <span className="text-slate-300">{opt.migration_time}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Difficulty</span>
                              <span className={`font-medium ${difficultyColors[opt.migration_difficulty]}`}>{opt.migration_difficulty}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Business risk</span>
                              <span className={`font-medium ${opt.business_interruption_risk === 'Low' ? 'text-green-400' : opt.business_interruption_risk === 'Medium' ? 'text-amber-400' : 'text-red-400'}`}>
                                {opt.business_interruption_risk}
                              </span>
                            </div>
                          </div>

                          {/* Trade-offs */}
                          {opt.trade_offs && (
                            <div className="p-2 bg-navy-900 rounded-lg">
                              <div className="text-xs text-slate-500 mb-1">Trade-offs</div>
                              <div className="text-xs text-slate-400 leading-relaxed">{opt.trade_offs}</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
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
