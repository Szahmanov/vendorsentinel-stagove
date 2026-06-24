import { Workflow, Clock, Wrench, Bot, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const decisionColors = {
  REMOVE: 'text-red-400 bg-red-950/30 border-red-900/40',
  REPLACE: 'text-amber-400 bg-amber-950/30 border-amber-900/40',
  CONSOLIDATE: 'text-blue-400 bg-blue-950/30 border-blue-900/40',
}

export default function WorkflowsPage({ workflows, vendors, navigate }) {
  const [expanded, setExpanded] = useState(0)

  // Build full workflow list combining agent workflows with vendor data
  const eliminatedVendors = vendors.filter(v => ['REMOVE', 'REPLACE', 'CONSOLIDATE'].includes(v.decision))

  const enrichedWorkflows = eliminatedVendors.map(v => {
    const wf = workflows.find(w => w.tool?.toLowerCase() === v.name?.toLowerCase())
    return {
      tool: v.name,
      decision: v.decision,
      monthly_cost: v.monthly_cost,
      category: v.category,
      workflow_name: wf?.workflow_name || `${v.name} Replacement`,
      description: wf?.description || v.replacement || `Replace ${v.name} with simpler alternatives`,
      steps: wf?.steps || ['Export existing data', 'Identify free alternative', 'Migrate team workflows', 'Cancel subscription'],
      tools_needed: wf?.tools_needed || ['Google Workspace', 'Manual process'],
      time_to_implement: wf?.time_to_implement || '1–2 weeks',
      ai_automation: wf?.ai_automation || 'Use AI to generate outputs on demand, replacing the need for dedicated software.'
    }
  })

  if (enrichedWorkflows.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center py-20">
          <Workflow className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <div className="text-slate-500">No tools were marked for replacement.</div>
        </div>
      </div>
    )
  }

  const totalSavings = enrichedWorkflows.reduce((s, w) => s + (w.monthly_cost || 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Replacement Workflows</h1>
          <p className="text-slate-500 text-sm">
            {enrichedWorkflows.length} tools being replaced · ${totalSavings.toFixed(2)}/mo freed
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {enrichedWorkflows.map((wf, i) => (
          <div key={i} className="card overflow-hidden">
            {/* Header */}
            <button
              className="w-full flex items-center gap-4 p-5 hover:bg-navy-800/30 transition-colors text-left"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${decisionColors[wf.decision]}`}>
                    {wf.decision}
                  </span>
                  <span className="font-semibold text-slate-200">{wf.tool}</span>
                  <span className="text-xs text-slate-500">{wf.category?.replace('_', ' ')}</span>
                </div>
                <div className="text-sm text-slate-500">{wf.workflow_name}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-mono text-red-400">${(wf.monthly_cost || 0).toFixed(2)}/mo</div>
                <div className="text-xs text-green-400">→ $0/mo</div>
              </div>
              {expanded === i ? (
                <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
              )}
            </button>

            {/* Expanded content */}
            {expanded === i && (
              <div className="border-t border-navy-700 p-5 space-y-5 bg-navy-950/30">
                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed">{wf.description}</p>

                {/* Steps */}
                <div>
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Implementation Steps</div>
                  <div className="space-y-2">
                    {wf.steps.map((step, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-sentinel-blue/10 border border-sentinel-blue/20 text-sentinel-blue text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {j + 1}
                        </div>
                        <span className="text-sm text-slate-400">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Tools needed */}
                  <div className="p-4 bg-navy-900 rounded-lg border border-navy-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tools Needed</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {wf.tools_needed.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-navy-800 border border-navy-700 text-slate-400 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="p-4 bg-navy-900 rounded-lg border border-navy-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Implementation Time</span>
                    </div>
                    <div className="text-sm text-slate-300">{wf.time_to_implement}</div>
                  </div>

                  {/* AI automation */}
                  <div className="p-4 bg-sentinel-blue/5 rounded-lg border border-sentinel-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-3.5 h-3.5 text-sentinel-blue" />
                      <span className="text-xs font-medium text-sentinel-blue uppercase tracking-wider">AI Automation</span>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">{wf.ai_automation}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
