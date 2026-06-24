import { useState } from 'react'
import { Copy, CheckCircle, FileDown } from 'lucide-react'

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-slate-200 mb-4 pb-2 border-b border-navy-700">{title}</h2>
      {children}
    </div>
  )
}

export default function ReportPage({ data, navigate }) {
  const [copied, setCopied] = useState(false)

  const s = data.summary || {}
  const vendors = data.vendors || []
  const plan = data.migration_plan || {}
  const workflows = data.workflows || []

  const generateText = () => {
    const lines = [
      'STAGOVE VENDORSENTINEL AI — SOFTWARE VENDOR AUDIT REPORT',
      `Generated: ${new Date(data.generated_at).toLocaleString()}`,
      '='.repeat(60),
      '',
      '1. EXECUTIVE SUMMARY',
      '-'.repeat(40),
      `Total vendors analyzed: ${vendors.length}`,
      `Current monthly cost:    $${(s.total_monthly_cost || 0).toFixed(2)}`,
      `Optimized monthly cost:  $${(s.optimized_monthly_cost || 0).toFixed(2)}`,
      `Monthly savings:         $${(s.monthly_savings || 0).toFixed(2)}`,
      `Annual savings:          $${(s.annual_savings || 0).toLocaleString()}`,
      '',
      `Decisions: ${s.keep_count || 0} KEEP · ${s.remove_count || 0} REMOVE · ${s.replace_count || 0} REPLACE · ${s.consolidate_count || 0} CONSOLIDATE · ${s.review_count || 0} REVIEW`,
      '',
      '2. VENDOR DECISIONS',
      '-'.repeat(40),
      ...vendors.map(v =>
        `[${v.decision}] ${v.name} — $${(v.monthly_cost || 0).toFixed(2)}/mo — ${v.category?.replace('_', ' ')} — Risk: ${v.risk}\n  Reason: ${v.reason}`
      ),
      '',
      '3. REPLACEMENT WORKFLOWS',
      '-'.repeat(40),
      ...(workflows.length > 0 ? workflows.map(w =>
        `${w.tool} → ${w.workflow_name}\n${w.description}\nSteps: ${w.steps?.join('; ')}`
      ) : ['No workflows generated for this audit.']),
      '',
      '4. MIGRATION PLAN',
      '-'.repeat(40),
      plan.today ? `TODAY:\n${plan.today.actions?.map(a => `  • ${a}`).join('\n')}` : '',
      plan.this_week ? `\nWEEK 1:\n${plan.this_week.actions?.map(a => `  • ${a}`).join('\n')}` : '',
      plan.this_month ? `\nMONTH 1:\n${plan.this_month.actions?.map(a => `  • ${a}`).join('\n')}` : '',
      '',
      '5. WHERE IS THE AGENTIC INTELLIGENCE?',
      '-'.repeat(40),
      'VendorSentinel is autonomous because it does not simply answer user questions.',
      'It receives a business goal, creates a plan, evaluates software tools, detects waste,',
      'makes independent decisions, calculates savings, designs replacement workflows,',
      'and generates a migration plan.',
      '',
      'The intelligence exists in:',
      '  • Vendor classification — mapping each tool to its business function',
      '  • Duplication detection — identifying overlapping tools in the same category',
      '  • Cost-risk analysis — weighing cost against criticality',
      '  • Autonomous decision making — Keep/Remove/Replace/Consolidate/Review',
      '  • Workflow replacement — designing operational alternatives for every removed tool',
      '  • Migration planning — sequencing the transition with minimal risk',
      '',
      'This cannot be replaced by a spreadsheet because a spreadsheet stores costs',
      'but cannot reason about software overlap, business function, replacement strategy,',
      'migration risk, or operational redesign.',
      '',
      '—',
      'StaGove VendorSentinel AI | Powered by Groq + LLaMA 3.3 70B',
    ]
    return lines.join('\n')
  }

  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(generateText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = generateText()
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const downloadReport = () => {
    const blob = new Blob([generateText()], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vendorsentinel-audit-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const savingsPct = s.total_monthly_cost > 0
    ? Math.round((s.monthly_savings / s.total_monthly_cost) * 100)
    : 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Final Audit Report</h1>
          <p className="text-slate-500 text-sm">Market-ready vendor audit. Ready to copy or export.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyReport}
            className="flex items-center gap-2 px-4 py-2 bg-sentinel-blue hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Report'}
          </button>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 border border-navy-700 hover:border-navy-600 text-slate-400 hover:text-slate-200 text-sm rounded-lg transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Report body */}
      <div className="card p-8 space-y-0">
        {/* Title */}
        <div className="text-center mb-10 pb-8 border-b border-navy-700">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">StaGove</div>
          <h2 className="text-3xl font-bold gradient-text mb-2">VendorSentinel AI</h2>
          <div className="text-slate-400 text-sm">Software Vendor Audit Report</div>
          <div className="text-slate-600 text-xs mt-2">{new Date(data.generated_at).toLocaleString()}</div>
        </div>

        <Section title="1. Executive Summary">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Current Cost', value: `$${(s.total_monthly_cost || 0).toFixed(2)}/mo` },
              { label: 'Optimized Cost', value: `$${(s.optimized_monthly_cost || 0).toFixed(2)}/mo`, color: 'text-sentinel-cyan' },
              { label: 'Monthly Savings', value: `$${(s.monthly_savings || 0).toFixed(2)}`, color: 'text-green-400' },
              { label: 'Annual Savings', value: `$${(s.annual_savings || 0).toLocaleString()}`, color: 'text-green-400' },
            ].map(item => (
              <div key={item.label} className="text-center p-4 bg-navy-950 rounded-lg border border-navy-800">
                <div className={`text-xl font-bold ${item.color || 'text-slate-200'}`}>{item.value}</div>
                <div className="text-xs text-slate-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            VendorSentinel analyzed {vendors.length} software vendors and identified a <strong className="text-slate-200">{savingsPct}% cost reduction opportunity</strong> — from ${(s.total_monthly_cost || 0).toFixed(2)}/month to ${(s.optimized_monthly_cost || 0).toFixed(2)}/month.
            {' '}This represents <strong className="text-green-400">${(s.annual_savings || 0).toLocaleString()} in annual savings</strong> through vendor elimination, consolidation, and workflow replacement.
          </p>
        </Section>

        <Section title="2. Software Inventory & Decisions">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-navy-700">
                  <th className="text-left py-2 pr-4 font-medium">Vendor</th>
                  <th className="text-left py-2 pr-4 font-medium">Category</th>
                  <th className="text-right py-2 pr-4 font-medium">Cost/mo</th>
                  <th className="text-left py-2 pr-4 font-medium">Decision</th>
                  <th className="text-left py-2 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {vendors.map((v, i) => (
                  <tr key={i} className="hover:bg-navy-800/20">
                    <td className="py-2.5 pr-4 text-slate-300 font-medium">{v.name}</td>
                    <td className="py-2.5 pr-4 text-slate-500 text-xs">{v.category?.replace('_', ' ')}</td>
                    <td className="py-2.5 pr-4 text-right font-mono text-slate-400">${(v.monthly_cost || 0).toFixed(2)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs font-semibold ${
                        v.decision === 'KEEP' ? 'text-green-400' :
                        v.decision === 'REMOVE' ? 'text-red-400' :
                        v.decision === 'REPLACE' ? 'text-amber-400' :
                        v.decision === 'CONSOLIDATE' ? 'text-blue-400' :
                        'text-slate-400'
                      }`}>{v.decision}</span>
                    </td>
                    <td className={`py-2.5 text-xs font-medium ${
                      v.risk === 'LOW' ? 'text-green-400' : v.risk === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'
                    }`}>{v.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="3. Decision Reasoning">
          <div className="space-y-4">
            {vendors.map((v, i) => (
              <div key={i} className="p-4 bg-navy-950 rounded-lg border border-navy-800">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-slate-300">{v.name}</div>
                  <span className={`text-xs font-semibold ml-4 flex-shrink-0 ${
                    v.decision === 'KEEP' ? 'text-green-400' :
                    v.decision === 'REMOVE' ? 'text-red-400' :
                    v.decision === 'REPLACE' ? 'text-amber-400' :
                    v.decision === 'CONSOLIDATE' ? 'text-blue-400' : 'text-slate-400'
                  }`}>{v.decision}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{v.reason}</p>
                {v.replacement && (
                  <div className="mt-2 pt-2 border-t border-navy-800">
                    <span className="text-xs text-sentinel-blue">Replacement: </span>
                    <span className="text-xs text-slate-500">{v.replacement}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section title="4. Migration Timeline">
          {plan.today && (
            <div className="space-y-4">
              {['today', 'this_week', 'this_month'].map(phase => {
                const p = plan[phase]
                if (!p) return null
                return (
                  <div key={phase} className="p-4 bg-navy-950 rounded-lg border border-navy-800">
                    <div className="font-medium text-slate-300 mb-3">{p.title}</div>
                    <ul className="space-y-1.5">
                      {p.actions?.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                          <span className="text-slate-700 mt-1">•</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </Section>

        <Section title="5. Where Is the Agentic Intelligence?">
          <div className="p-6 rounded-xl bg-gradient-to-br from-sentinel-blue/5 to-sentinel-cyan/5 border border-sentinel-blue/20">
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              VendorSentinel is autonomous because it does not simply answer user questions. It receives a business goal, creates a plan, evaluates software tools, detects waste, makes independent decisions, calculates savings, designs replacement workflows, and generates a migration plan.
            </p>
            <div className="text-sm text-slate-500 font-medium mb-3">The intelligence exists in:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['Vendor classification', 'Mapping each tool to its exact business function'],
                ['Duplication detection', 'Identifying overlapping tools consuming redundant budget'],
                ['Cost-risk analysis', 'Weighing monthly cost against operational criticality'],
                ['Decision making', 'Keep/Remove/Replace/Consolidate decisions with reasoning'],
                ['Workflow replacement', 'Designing how operations continue without removed tools'],
                ['Migration planning', 'Sequencing the transition with minimal disruption'],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-sentinel-blue mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-300 font-medium">{title}</span>
                    <span className="text-slate-600"> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mt-4 pt-4 border-t border-navy-700">
              This cannot be replaced by a spreadsheet. A spreadsheet can store costs, but it cannot independently reason about software overlap, business function, replacement strategy, migration risk, and operational redesign.
            </p>
          </div>
        </Section>

        {/* Footer */}
        <div className="pt-6 border-t border-navy-700 text-center">
          <div className="text-xs text-slate-600">
            StaGove VendorSentinel AI · Powered by Groq + LLaMA 3.3 70B Versatile · Autonomous Software Intelligence
          </div>
        </div>
      </div>
    </div>
  )
}
