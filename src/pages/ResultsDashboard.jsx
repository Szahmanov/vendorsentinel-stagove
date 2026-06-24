import { TrendingDown, DollarSign, Package, AlertTriangle, CheckCircle, ArrowRight, Zap, Brain, Target, Clock, Shield } from 'lucide-react'

const decisionColors = {
  KEEP: 'text-green-400 bg-green-950/30 border-green-900/30',
  REMOVE: 'text-red-400 bg-red-950/30 border-red-900/30',
  REPLACE: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
  CONSOLIDATE: 'text-blue-400 bg-blue-950/30 border-blue-900/30',
  REVIEW: 'text-slate-400 bg-slate-900/30 border-slate-700/30',
}

function ScoreBar({ label, score, colorClass }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={colorClass}>{score}/100</span>
      </div>
      <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colorClass.includes('red') ? 'bg-red-500' : colorClass.includes('green') ? 'bg-green-500' : 'bg-amber-500'}`}
          style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
    </div>
  )
}

export default function ResultsDashboard({ data, navigate }) {
  const s = data.summary || {}
  const vendors = data.vendors || []
  const duplicates = data.duplicate_groups || []
  const ei = s.eradication_index || {}

  const savingsPct = s.total_monthly_cost > 0 ? Math.round((s.monthly_savings / s.total_monthly_cost) * 100) : 0
  const eradicationScore = ei.score || Math.min(Math.round(savingsPct * 1.3), 100)

  const agentTasks = [
    'Classified every tool into its exact business function category',
    'Detected overlapping tools consuming redundant budget',
    'Checked if existing owned tools could replace eliminated ones',
    'Evaluated 4 replacement types per tool (Best, Free, Cheapest, Open Source)',
    'Calculated feature match breakdowns for every alternative',
    'Assessed vendor lock-in risk and migration complexity',
    'Estimated migration time and business interruption risk per tool',
    'Generated a sequenced migration roadmap with risk warnings',
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xs text-sentinel-blue uppercase tracking-widest font-medium mb-1">Autonomous Software Eradication Agent</div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Eradication Report</h1>
          <p className="text-slate-500 text-sm">{vendors.length} vendors analyzed · {new Date(data.generated_at).toLocaleString()}</p>
        </div>
        <button onClick={() => navigate('report')}
          className="flex items-center gap-2 px-4 py-2 bg-sentinel-blue/10 hover:bg-sentinel-blue/20 border border-sentinel-blue/20 text-sentinel-blue text-sm rounded-lg transition-colors">
          Full Report <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tagline */}
      <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-sentinel-blue/5 to-sentinel-cyan/5 border border-sentinel-blue/10">
        <p className="text-sm text-slate-400 leading-relaxed">
          <span className="text-slate-200 font-medium">Identify waste. Eliminate redundant software. Replace expensive vendors. Generate migration plans. Reduce software costs autonomously.</span>
        </p>
      </div>

      {/* Executive Summary */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-4 h-4 text-sentinel-blue" />
          <h2 className="font-semibold text-slate-200">Executive Summary</h2>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Current Annual Cost', value: `$${(s.total_annual_cost || s.total_monthly_cost * 12 || 0).toLocaleString()}`, color: 'text-slate-200', sub: `$${(s.total_monthly_cost || 0).toFixed(2)}/mo` },
            { label: 'Optimized Annual Cost', value: `$${(s.optimized_annual_cost || s.optimized_monthly_cost * 12 || 0).toLocaleString()}`, color: 'text-sentinel-cyan', sub: `$${(s.optimized_monthly_cost || 0).toFixed(2)}/mo` },
            { label: 'Total Annual Savings', value: `$${(s.annual_savings || 0).toLocaleString()}`, color: 'text-green-400', sub: `${savingsPct}% reduction` },
            { label: 'Migration Time', value: s.total_migration_time || 'Est. 1-2 weeks', color: 'text-amber-400', sub: `Risk: ${s.overall_risk_score || 'LOW'}` },
          ].map(item => (
            <div key={item.label} className="p-4 bg-navy-950 rounded-xl border border-navy-800">
              <div className="text-xs text-slate-500 mb-2">{item.label}</div>
              <div className={`text-xl font-bold ${item.color} mb-1`}>{item.value}</div>
              <div className="text-xs text-slate-600">{item.sub}</div>
            </div>
          ))}
        </div>

        {/* Decision breakdown */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Analyzed', value: vendors.length, color: 'text-slate-200' },
            { label: 'Eliminated', value: (s.remove_count || 0) + (s.consolidate_count || 0), color: 'text-red-400' },
            { label: 'Replaced', value: s.replace_count || 0, color: 'text-amber-400' },
            { label: 'Kept', value: s.keep_count || 0, color: 'text-green-400' },
            { label: 'For Review', value: s.review_count || 0, color: 'text-slate-400' },
            { label: 'Duplicates', value: duplicates.length, color: 'text-purple-400' },
          ].map(item => (
            <div key={item.label} className="text-center p-3 bg-navy-950 rounded-lg border border-navy-800">
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-xs text-slate-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Software Eradication Index */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-amber-400" />
          <h2 className="font-semibold text-slate-200">Software Eradication Index</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Score */}
          <div className="flex flex-col items-center justify-center p-6 bg-navy-950 rounded-xl border border-navy-800">
            <div className={`text-6xl font-black mb-2 ${eradicationScore >= 70 ? 'text-green-400' : eradicationScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
              {eradicationScore}
            </div>
            <div className="text-xs text-slate-500 text-center">Software Eradication Index</div>
            <div className="text-xs text-slate-600 mt-1">out of 100</div>
          </div>
          {/* Bars */}
          <div className="space-y-3">
            <ScoreBar label="Stack Complexity Before" score={s.complexity_score_before || 75} colorClass="text-red-400" />
            <ScoreBar label="Stack Complexity After" score={s.complexity_score_after || 40} colorClass="text-green-400" />
            <ScoreBar label="Monthly Spend Reduction" score={savingsPct} colorClass="text-amber-400" />
          </div>
          {/* Breakdown */}
          <div className="space-y-2">
            {[
              { label: 'Duplicate tools eliminated', value: ei.duplicate_tools_eliminated || duplicates.length },
              { label: 'Vendors eliminated', value: ei.vendors_eliminated || (s.remove_count || 0) + (s.consolidate_count || 0) },
              { label: 'Workflow simplification', value: `${ei.workflow_simplification_pct || s.complexity_reduction_pct || savingsPct}%` },
              { label: 'Monthly spend reduction', value: `${savingsPct}%` },
              { label: 'Complexity reduction', value: `${s.complexity_reduction_pct || Math.round(((s.complexity_score_before || 75) - (s.complexity_score_after || 40)) / (s.complexity_score_before || 75) * 100)}%` },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-navy-950 rounded-lg border border-navy-800">
                <span className="text-xs text-slate-400">{item.label}</span>
                <span className="text-xs font-semibold text-green-400">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Autonomous Decision Log */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-sentinel-blue" />
            <h2 className="font-semibold text-slate-200">Autonomous Decision Log</h2>
          </div>
          <button onClick={() => navigate('vendors')} className="text-xs text-sentinel-blue hover:underline">Full table →</button>
        </div>
        <div className="space-y-3">
          {vendors.map((v, i) => (
            <div key={i} className="p-4 bg-navy-950 rounded-xl border border-navy-800">
              <div className="flex items-start gap-3 mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border flex-shrink-0 mt-0.5 ${decisionColors[v.decision]}`}>
                  {v.decision}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-200">{v.name}</span>
                    <span className="text-xs text-slate-500">${(v.monthly_cost || 0).toFixed(2)}/mo</span>
                    {v.existing_stack_replacement && (
                      <span className="text-xs text-green-400 bg-green-950/30 border border-green-900/30 px-2 py-0.5 rounded">
                        → Use {v.existing_stack_replacement} (already owned)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{v.reasoning || v.reason}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 bg-navy-900 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-0.5">Confidence</div>
                  <div className="text-sm font-bold text-sentinel-blue">{v.confidence_score || '—'}%</div>
                </div>
                <div className="p-2 bg-navy-900 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-0.5">Risk</div>
                  <div className={`text-sm font-bold ${v.risk === 'HIGH' ? 'text-red-400' : v.risk === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'}`}>{v.risk}</div>
                </div>
                <div className="p-2 bg-navy-900 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-0.5">Annual Saving</div>
                  <div className="text-sm font-bold text-green-400">${(v.estimated_annual_savings || v.estimated_monthly_savings * 12 || 0).toLocaleString()}</div>
                </div>
                <div className="p-2 bg-navy-900 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-0.5">Migration</div>
                  <div className="text-sm font-bold text-amber-400">{v.migration_time_estimate || v.migration_effort || '—'}</div>
                </div>
              </div>
              {v.expected_outcome && (
                <div className="mt-2 p-2 bg-sentinel-blue/5 border border-sentinel-blue/10 rounded-lg">
                  <span className="text-xs text-sentinel-blue font-medium">Expected outcome: </span>
                  <span className="text-xs text-slate-400">{v.expected_outcome}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Duplicate groups */}
      {duplicates.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="font-semibold text-slate-200">Duplicate Tool Groups Detected</h2>
            <span className="ml-auto text-xs text-amber-400 bg-amber-950/30 border border-amber-900/30 px-2 py-0.5 rounded-full">{duplicates.length} groups</span>
          </div>
          <div className="space-y-3">
            {duplicates.map((group, i) => (
              <div key={i} className="p-4 bg-navy-950 rounded-lg border border-navy-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{group.category?.replace('_', ' ')}</span>
                  <span className="text-xs text-amber-400">{group.tools?.length} overlapping</span>
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
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-sentinel-cyan" />
          <h2 className="font-semibold text-slate-200">Why This Required An Autonomous Agent</h2>
        </div>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          VendorSentinel completed the following tasks <span className="text-slate-200 font-medium">without additional user guidance</span> — reasoning autonomously across your entire software stack:
        </p>
        <div className="space-y-2">
          {agentTasks.map((task, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-navy-950 rounded-lg border border-navy-800">
              <div className="w-5 h-5 rounded-full bg-sentinel-blue/10 border border-sentinel-blue/20 text-sentinel-blue text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                {i + 1}
              </div>
              <span className="text-sm text-slate-400">{task}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-navy-950 rounded-xl border border-navy-800">
          <p className="text-xs text-slate-500 leading-relaxed">
            A spreadsheet can store costs. A chatbot can answer questions. Neither can simultaneously classify tools, detect overlaps, check your existing stack for coverage, evaluate 4 replacement types per tool, score feature matches, assess lock-in risk, estimate migration effort, and produce a sequenced implementation roadmap — <span className="text-slate-300">autonomously, in a single run, without being asked for any of it.</span>
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { page: 'vendors', label: 'Decision Table', desc: 'Full log with confidence & risk scores', color: 'text-sentinel-blue' },
          { page: 'replacements', label: 'Replacements', desc: 'Best / Free / Cheapest / Open Source', color: 'text-amber-400' },
          { page: 'workflows', label: 'Workflows', desc: 'How to operate without removed tools', color: 'text-sentinel-cyan' },
          { page: 'migration', label: 'Migration Plan', desc: 'Sequenced day-by-day roadmap', color: 'text-green-400' },
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
