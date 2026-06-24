import { Shield, TrendingDown, Zap, Target, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  { icon: Target, title: 'Vendor Classification', desc: 'Every tool categorized and mapped to business function automatically.' },
  { icon: TrendingDown, title: 'Duplicate Detection', desc: 'Overlapping tools surfaced. Consolidation paths identified.' },
  { icon: Zap, title: 'Autonomous Decisions', desc: 'Keep, Remove, Replace, Consolidate — reasoned independently per tool.' },
  { icon: Shield, title: 'Migration Planning', desc: 'Day-by-day action plan. No data loss. No disruption.' },
]

const steps = [
  'Input your software list or paste invoices',
  'Agent extracts, classifies, and audits every vendor',
  'Decisions made with reasoning for each tool',
  'Savings calculated. Workflows designed. Report generated.',
]

export default function LandingPage({ navigate }) {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sentinel-blue to-sentinel-cyan flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-400">StaGove</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sentinel-blue/10 border border-sentinel-blue/20 text-sentinel-blue text-xs font-medium mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-sentinel-cyan animate-pulse" />
          Autonomous Software Audit Agent
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
          <span className="gradient-text">VendorSentinel</span>
          <span className="block text-slate-200 text-4xl sm:text-5xl mt-2">AI</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          Eliminate unnecessary software. Replace complexity with autonomous intelligence.
        </p>

        <p className="text-sm text-slate-500 max-w-xl mx-auto mb-12">
          Not a chatbot. An autonomous agent that audits your entire software stack, detects waste, makes decisions, calculates savings, and generates a migration plan.
        </p>

        {/* Sample savings callout */}
        <div className="inline-flex items-center gap-8 px-8 py-5 rounded-2xl bg-navy-900 border border-navy-700 mb-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-300">$450</div>
            <div className="text-xs text-slate-500 mt-1">Current/mo</div>
          </div>
          <div className="flex items-center gap-2 text-sentinel-cyan">
            <TrendingDown className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sentinel-cyan">$180</div>
            <div className="text-xs text-slate-500 mt-1">Optimized/mo</div>
          </div>
          <div className="border-l border-navy-700 pl-8 text-center">
            <div className="text-2xl font-bold text-green-400">$3,240</div>
            <div className="text-xs text-slate-500 mt-1">Saved/year</div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('input')}
            className="flex items-center gap-2 px-8 py-4 bg-sentinel-blue hover:bg-blue-500 text-white font-semibold rounded-xl transition-all glow-blue text-lg"
          >
            Start Vendor Audit
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-200 mb-3">Autonomous Decision Loop</h2>
          <p className="text-slate-500">The intelligence is in the process, not the conversation.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative p-5 card">
              <div className="text-4xl font-black text-navy-800 mb-3 leading-none">{String(i + 1).padStart(2, '0')}</div>
              <p className="text-sm text-slate-400 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="flex items-start gap-4 p-5 card hover:border-navy-600 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-sentinel-blue/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-sentinel-blue" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200 mb-1">{f.title}</div>
                  <div className="text-sm text-slate-500">{f.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Why not ChatGPT */}
      <section className="border-t border-navy-800">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-red-900/30 bg-red-950/10">
              <div className="text-sm font-semibold text-red-400 mb-4">ChatGPT answers questions</div>
              <ul className="space-y-2 text-sm text-slate-500">
                {['Responds to prompts', 'Requires user guidance at every step', 'No persistent decision loop', 'No structured business output'].map(x => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="text-red-800">×</span> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-green-900/30 bg-green-950/10">
              <div className="text-sm font-semibold text-green-400 mb-4">VendorSentinel executes a process</div>
              <ul className="space-y-2 text-sm text-slate-400">
                {['Receives a goal and acts autonomously', 'Makes decisions with reasoning', 'Calculates real savings figures', 'Outputs a market-ready audit report'].map(x => (
                  <li key={x} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-navy-800 py-8 text-center text-slate-600 text-sm">
        StaGove VendorSentinel AI — Autonomous Software Intelligence
      </footer>
    </div>
  )
}
