import { TrendingDown, DollarSign, Package, AlertTriangle, CheckCircle, XCircle, RefreshCw, Layers, Eye, ArrowRight, Zap, Brain, Target } from 'lucide-react'

const decisionColors = {
  KEEP: 'text-green-400 bg-green-950/30 border-green-900/30',
  REMOVE: 'text-red-400 bg-red-950/30 border-red-900/30',
  REPLACE: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
  CONSOLIDATE: 'text-blue-400 bg-blue-950/30 border-blue-900/30',
  REVIEW: 'text-slate-400 bg-slate-900/30 border-slate-700/30',
}

function KPICard({ label, value, sub, color = 'blue', icon: Icon }) {
  const colors = {
    blue: 'text-sentinel-blue border-sentinel-blue/20 bg-sentinel-blue/5',
    green: 'text-green-400 border-green-900/30 bg-green-950/10',
    red: 'text-red-400 border-red-900/30 bg-red-950/10',
    amber: 'text-amber-400 border-amber-900/30 bg-amber-950/10',
    cyan: 'text-sentinel-cyan border-cyan-900/30 bg-cyan-950/10',
  }
  return (
    <div className={`p-5 rounded-xl border ${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</span>
        {Icon && <Icon className="w-4 h-4 opacity-60" />}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  )
}

function ScoreBar({ label, score, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={color}>{score}/100</span>
      </div>
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color.includes('red') ? 'bg-red-500' : color.includes('green') ? 'bg-green-500' : 'bg-sentinel-blue'}`}
          style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default function ResultsDashboard({ data, navigate }) {
  const s = data.summary || {}
  const vendors = data.vendors || []
  const duplicates = data.duplicate_groups || []

  const savingsPct = s.total_monthly_cost > 0
    ? Math.round((s.monthly_savings / s.total_monthly_cost) * 100) : 0

  const complexityReduction = s.complexity_reduction_pct || Math.round(
    ((s.complexity_score_before - s.complexity_score_after) / (s.complexity_score_before || 100)) * 100
  )

  const agentReasons = [
    { title: 'Classification', desc: 'Maps every tool to its exact business function — something a spreadsheet cannot reason about.' },
    { title: 'Overlap Detection', desc: 'Identifies tools in the same category consuming redundant budget without being told what to look for.' },
    { title: 'Decision Making', desc: 'Weighs cost, risk, and criticality simultaneously to produce Keep/Remove/Replace/Consolidate decisions.' },
    { title: 'Cost Optimization', desc: 'Calculates real savings figures including hidden costs, add-ons, and multi-user scaling.' },
    { title: 'Replacement Discovery', desc: 'Finds specific free or lower-cost alternatives with feature-match scores for each eliminated tool.' },
    { title: 'Migration Planning', desc: 'Sequences the transition with risk warnings and data export requirements — autonomously.' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="text-xs text-sentinel-blue uppercase tracking-widest font-medium mb-1">Software Eradication & Cost Optimization</div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Audit Results</h1>
          <p className="text-slate-500 text-sm">{vendors.length} vendors analyzed · {new Date(data.generated_at).toLocaleString()}</p>
        </div>
        <button onClick={() => navigate('report')}
          className="flex items-center gap-2 px-4 py-2 bg-sentinel-blue/10 hover:bg-sentinel-blue/20 border border-sentinel-blue/20 text-sentinel-blue text-sm rounded-lg transition-colors">
          Full Report <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Executive Summary */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-4 h-4 text-sentinel-blue" />
          <h2 className="font-semibold text-slate-200">Executive Summary</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-5">
          {[
            { label: 'Analyzed', value: vendors.length, color: 'text-slate-200' },
            { label: 'Removed', value: s.remove_count || 0, color: 'text-red-400' },
            { label: 'Replaced', value: s.replace_count || 0, color: 'text-amber-400' },
            { label: 'Consolidated', value: s.consolidate_count || 0, color: 'text-blue-400' },
            { label: 'Kept', value: s.keep_count || 0, color: 'text-green-400' },
            { label: 'For Review', value: s.review_count || 0, color: 'text-slate-400' },
          ].map(item => (
            <div key={item.label} className="text-center p-3 bg-navy-950 rounded-lg border border-navy-800">
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-slate-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Monthly Cost" value={`$${(s.total_monthly_cost || 0).toFixed(2)}`} sub="Current stack" color="blue" icon={DollarSign} />
          <KPICard label="Optimized Cost" value={`$${(s.optimized_monthly_cost || 0).toFixed(2)}`} sub="After eradication" color="cyan" icon={Package} />
          <KPICard label="Monthly Savings" value={`$${(s.monthly_savings || 0).toFixed(2)}`} sub={`${savingsPct}% reduction`} color="green" icon={TrendingDown} />
          <KPICard label="Annual Savings" value={`$${(s.annual_savings || 0).toLocaleString()}`} sub="Per year" color="green" icon={TrendingDown} />
        </div>
      </div>

      {/* Eradication Score */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="font-semibold text-slate-200">Software Eradication Score</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <ScoreBar label="Stack Complexity Before" score={s.complexity_score_before || 72} color="text-red-400" />
            <ScoreBar label="Stack Complexity After" score={s.complexity_score_after || 38} color="text-green-400" />
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-navy-950 rounded-xl border border-navy-800">
            <div className="text-5xl font-black text-green-400 mb-1">{complexityReduction || savingsPct}%</div>
            <div className="text-xs text-slate-500 text-center">Complexity Reduction</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-slate-500 mb-3">What was eliminated:</div>
            {[
              `${s.remove_count || 0} tools fully removed`,
              `${s.replace_count || 0} tools replaced with cheaper alternatives`,
              `${s.consolidate_count || 0} tools consolidated`,
              `${duplicates.length} overlap group${duplicates.length !== 1 ? 's' : ''} resolved`,
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Log */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-sentinel-blue" />
            <h2 className="font-semibold text-slate-200">Autonomous Decision Log</h2>
          </div>
          <button onClick={() => navigate('vendors')} className="text-xs text-sentinel-blue hover:underline">View full table →</button>
        </div>
        <div className="space-y-2">
          {vendors.map((v, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-navy-950 rounded-lg border border-navy-800">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${decisionColors[v.decision]}`}>
                {v.decision}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-slate-200">{v.name}</span>
                  <span className="text-xs text-slate-500">${(v.monthly_cost || 0).toFixed(2)}/mo</span>
                  {v.confidence_score && (
                    <span className="text-xs text-sentinel-blue ml-auto">Confidence: {v.confidence_score}%</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{v.reasoning || v.reason}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-xs font-medium ${v.risk === 'HIGH' ? 'text-red-400' : v.risk === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'}`}>
                  {v.risk} risk
                </div>
                {(v.estimated_monthly_savings > 0) && (
                  <div className="text-xs text-green-400 mt-0.5">-${v.estimated_monthly_savings}/mo</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Duplicate groups */}
      {duplicates.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="font-semibold text-slate-200">Duplicate Tool Groups</h2>
            <span className="text-xs text-amber-400 bg-amber-950/30 border border-amber-900/30 px-2 py-0.5 rounded-full ml-auto">
              {duplicates.length} group{duplicates.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-3">
            {duplicates.map((group, i) => (
              <div key={i} className="p-4 bg-navy-950 rounded-lg border border-navy-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{group.category?.replace('_', ' ')}</span>
                  <span className="text-xs text-amber-400">{group.tools?.length} overlapping tools</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {group.tools?.map(t => (
                    <span key={t} className="text-xs px-2 py-1 bg-amber-950/30 border border-amber-900/30 text-amber-300 rounded-md">{t}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-500">{group.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why autonomous agent */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Brain className="w-4 h-4 text-sentinel-cyan" />
          <h2 className="font-semibold text-slate-200">Why This Required An Autonomous Agent</h2>
        </div>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          A spreadsheet can store costs. A chatbot can answer questions. Neither can do what VendorSentinel does — independently reason across six dimensions simultaneously and produce a market-ready eradication strategy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {agentReasons.map((r, i) => (
            <div key={i} className="p-4 bg-navy-950 rounded-lg border border-navy-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sentinel-cyan flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-200">{r.title}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { page: 'vendors', label: 'Vendor Decisions', desc: 'Full decision table with reasoning', color: 'text-sentinel-blue' },
          { page: 'replacements', label: 'Replacement Options', desc: 'Free & cheaper alternatives', color: 'text-amber-400' },
          { page: 'workflows', label: 'Workflows', desc: 'How to operate without removed tools', color: 'text-sentinel-cyan' },
          { page: 'migration', label: 'Migration Plan', desc: 'Day-by-day action plan', color: 'text-green-400' },
        ].map(item => (
          <button key={item.page} onClick={() => navigate(item.page)}
            className="card p-5 text-left hover:border-navy-600 transition-colors group">
            <div className={`text-sm font-semibold ${item.color} mb-1 group-hover:underline`}>{item.label}</div>
            <div className="text-xs text-slate-500">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
