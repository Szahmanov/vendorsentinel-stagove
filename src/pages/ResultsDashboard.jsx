import { TrendingDown, DollarSign, Package, AlertTriangle, CheckCircle, XCircle, RefreshCw, Layers, Eye, ArrowRight } from 'lucide-react'

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
      <div className={`text-3xl font-bold mb-1`}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  )
}

const decisionColors = {
  KEEP: 'text-green-400 bg-green-950/30 border-green-900/30',
  REMOVE: 'text-red-400 bg-red-950/30 border-red-900/30',
  REPLACE: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
  CONSOLIDATE: 'text-blue-400 bg-blue-950/30 border-blue-900/30',
  REVIEW: 'text-slate-400 bg-slate-900/30 border-slate-700/30',
}

export default function ResultsDashboard({ data, navigate }) {
  const s = data.summary || {}
  const vendors = data.vendors || []
  const duplicates = data.duplicate_groups || []

  const decisionCounts = vendors.reduce((acc, v) => {
    acc[v.decision] = (acc[v.decision] || 0) + 1
    return acc
  }, {})

  const savingsPct = s.total_monthly_cost > 0
    ? Math.round((s.monthly_savings / s.total_monthly_cost) * 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Audit Results</h1>
          <p className="text-slate-500 text-sm">
            {vendors.length} vendors analyzed · {new Date(data.generated_at).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => navigate('report')}
          className="flex items-center gap-2 px-4 py-2 bg-sentinel-blue/10 hover:bg-sentinel-blue/20 border border-sentinel-blue/20 text-sentinel-blue text-sm rounded-lg transition-colors"
        >
          View Full Report
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          label="Monthly Cost"
          value={`$${(s.total_monthly_cost || 0).toFixed(2)}`}
          sub="Current stack"
          color="blue"
          icon={DollarSign}
        />
        <KPICard
          label="Optimized Cost"
          value={`$${(s.optimized_monthly_cost || 0).toFixed(2)}`}
          sub="After elimination"
          color="cyan"
          icon={Package}
        />
        <KPICard
          label="Monthly Savings"
          value={`$${(s.monthly_savings || 0).toFixed(2)}`}
          sub={`${savingsPct}% reduction`}
          color="green"
          icon={TrendingDown}
        />
        <KPICard
          label="Annual Savings"
          value={`$${(s.annual_savings || 0).toLocaleString()}`}
          sub="Per year"
          color="green"
          icon={TrendingDown}
        />
      </div>

      {/* Decision breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {['KEEP', 'REMOVE', 'REPLACE', 'CONSOLIDATE', 'REVIEW'].map(d => {
          const icons = { KEEP: CheckCircle, REMOVE: XCircle, REPLACE: RefreshCw, CONSOLIDATE: Layers, REVIEW: Eye }
          const Icon = icons[d]
          const count = decisionCounts[d] || 0
          return (
            <button
              key={d}
              onClick={() => navigate('vendors')}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:opacity-80 transition-opacity ${decisionColors[d]}`}
            >
              <div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs opacity-70 mt-0.5">{d}</div>
              </div>
              <Icon className="w-5 h-5 opacity-50" />
            </button>
          )
        })}
      </div>

      {/* Duplicate groups */}
      {duplicates.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="font-semibold text-slate-200">Duplicate Tool Groups Detected</h2>
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

      {/* Quick vendor list */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-200">Vendor Decisions</h2>
          <button onClick={() => navigate('vendors')} className="text-xs text-sentinel-blue hover:underline">
            View full table →
          </button>
        </div>
        <div className="space-y-2">
          {vendors.slice(0, 6).map((v, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-navy-800 last:border-0">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${decisionColors[v.decision]}`}>
                {v.decision}
              </span>
              <span className="flex-1 text-sm text-slate-300 truncate">{v.name}</span>
              <span className="text-xs text-slate-500">{v.category?.replace('_', ' ')}</span>
              <span className="text-sm font-mono text-slate-400">${(v.monthly_cost || 0).toFixed(2)}</span>
            </div>
          ))}
          {vendors.length > 6 && (
            <button onClick={() => navigate('vendors')} className="text-xs text-slate-500 hover:text-slate-300 pt-2 transition-colors">
              +{vendors.length - 6} more vendors →
            </button>
          )}
        </div>
      </div>

      {/* Navigation tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { page: 'workflows', label: 'Replacement Workflows', desc: 'See how to operate without removed tools', color: 'text-sentinel-blue' },
          { page: 'migration', label: 'Migration Plan', desc: 'Day-by-day action plan for the transition', color: 'text-green-400' },
          { page: 'report', label: 'Final Report', desc: 'Export-ready business audit document', color: 'text-sentinel-cyan' },
        ].map(item => (
          <button
            key={item.page}
            onClick={() => navigate(item.page)}
            className="card p-5 text-left hover:border-navy-600 transition-colors group"
          >
            <div className={`text-sm font-semibold ${item.color} mb-1 group-hover:underline`}>{item.label}</div>
            <div className="text-xs text-slate-500">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
