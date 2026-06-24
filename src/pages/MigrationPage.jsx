import { Calendar, AlertTriangle, Database, Shield, CheckSquare } from 'lucide-react'

const priorityColors = {
  CRITICAL: 'border-red-900/40 bg-red-950/10',
  HIGH: 'border-amber-900/40 bg-amber-950/10',
  MEDIUM: 'border-blue-900/40 bg-blue-950/10',
}

const priorityBadge = {
  CRITICAL: 'text-red-400 bg-red-950/30 border-red-900/40',
  HIGH: 'text-amber-400 bg-amber-950/30 border-amber-900/40',
  MEDIUM: 'text-blue-400 bg-blue-950/30 border-blue-900/40',
}

export default function MigrationPage({ plan, summary, navigate }) {
  if (!plan || !plan.today) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center py-20 text-slate-500">Migration plan not available.</div>
      </div>
    )
  }

  const phases = [
    { key: 'today', data: plan.today, icon: '⚡' },
    { key: 'this_week', data: plan.this_week, icon: '📅' },
    { key: 'this_month', data: plan.this_month, icon: '🗓️' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Migration Plan</h1>
        <p className="text-slate-500 text-sm">
          Step-by-step transition plan to eliminate waste with zero data loss.
        </p>
      </div>

      {/* Savings reminder */}
      <div className="p-5 rounded-xl bg-green-950/15 border border-green-900/30 mb-8 flex items-center gap-4">
        <div className="text-3xl font-bold text-green-400">${(summary?.annual_savings || 0).toLocaleString()}</div>
        <div>
          <div className="text-sm font-medium text-green-300">Annual savings unlocked after migration</div>
          <div className="text-xs text-green-600 mt-0.5">${(summary?.monthly_savings || 0).toFixed(2)}/month · follow this plan to capture it</div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-5 mb-8">
        {phases.map(({ key, data, icon }) => {
          if (!data) return null
          return (
            <div key={key} className={`card p-6 border ${priorityColors[data.priority] || 'border-navy-700'}`}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <h2 className="font-semibold text-slate-200">{data.title}</h2>
                    <div className="text-xs text-slate-500 mt-0.5">{data.actions?.length} actions</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded border ${priorityBadge[data.priority]}`}>
                  {data.priority}
                </span>
              </div>

              <div className="space-y-2.5">
                {data.actions?.map((action, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border border-navy-600 flex-shrink-0 mt-0.5 flex items-center justify-center">
                      <CheckSquare className="w-3 h-3 text-slate-600" />
                    </div>
                    <span className="text-sm text-slate-400 leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Data exports */}
      {plan.data_exports?.length > 0 && (
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-sentinel-blue" />
            <h3 className="font-semibold text-slate-200">Data to Export First</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {plan.data_exports.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-sentinel-blue flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backup strategy */}
      {plan.backup_strategy && (
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-400" />
            <h3 className="font-semibold text-slate-200">Backup Strategy</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{plan.backup_strategy}</p>
        </div>
      )}

      {/* Risk warnings */}
      {plan.risk_warnings?.length > 0 && (
        <div className="p-5 rounded-xl bg-amber-950/10 border border-amber-900/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-amber-300 text-sm">Risk Warnings</h3>
          </div>
          <div className="space-y-2">
            {plan.risk_warnings.map((risk, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-300/70">
                <span className="text-amber-700 mt-1">—</span>
                {risk}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
