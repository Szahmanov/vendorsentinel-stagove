import { Shield, TrendingDown, Zap, Target, ArrowRight, CheckCircle, XCircle } from 'lucide-react'

const features = [
  { icon: Target, title: 'Stack-First Replacements', desc: 'Checks your existing tools before suggesting external alternatives. Already-owned tools come first.' },
  { icon: TrendingDown, title: 'Duplicate Elimination', desc: 'Identifies overlapping tools burning budget. Consolidation paths generated automatically.' },
  { icon: Zap, title: 'Software Eradication Index', desc: 'Quantifies complexity reduction, vendor elimination, and spend reduction in a single score.' },
  { icon: Shield, title: 'Migration Planning', desc: 'Sequenced roadmap with risk warnings, data exports, and time estimates per tool.' },
]

const steps = [
  'Paste your software list or upload a CSV',
  'Agent classifies, detects overlaps, checks your stack for existing coverage',
  'Autonomous decisions with confidence scores, risk scores, and expected outcomes',
  'Replacements found, migration planned, eradication index calculated',
]

export default function LandingPage({ navigate }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sentinel-blue to-sentinel-cyan flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-400">StaGove</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16 text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sentinel-blue/10 border border-sentinel-blue/20 text-sentinel-blue text-xs font-medium mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-sentinel-cyan animate-pulse" />
          Autonomous Software Eradication Agent
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6 break-words">
          <span className="gradient-text">VendorSentinel</span>
          <span className="block text-slate-200 text-3xl sm:text-5xl mt-2">AI</span>
        </h1>

        {/* Tagline */}
        <div className="max-w-lg mx-auto mb-12 space-y-1">
          {['Identify waste.', 'Eliminate redundant software.', 'Replace expensive vendors.', 'Generate migration plans.', 'Reduce software costs autonomously.'].map((line, i) => (
            <p key={i} className={`text-base sm:text-lg leading-relaxed ${i === 0 ? 'text-slate-300 font-semibold' : 'text-slate-400'}`}>{line}</p>
          ))}
        </div>

        <p className="text-sm text-slate-500 max-w-xl mx-auto mb-12">
          Not a chatbot. Not a spreadsheet. An autonomous agent that classifies every tool, detects waste, checks your existing stack for coverage, finds 4 replacement types per eliminated tool, assesses lock-in risk, and produces a complete migration strategy — without being asked for any of it.
        </p>

        {/* Sample savings */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-5 rounded-2xl bg-navy-900 border border-navy-700 mb-12 w-full sm:w-auto">
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
          <button onClick={() => navigate('input')}
            className="flex items-center gap-2 px-8 py-4 bg-sentinel-blue hover:bg-blue-500 text-white font-semibold rounded-xl transition-all glow-blue text-lg">
            Start Software Eradication
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
                {['Responds to prompts only', 'Requires user guidance at every step', 'Cannot check your existing stack', 'No structured eradication strategy', 'No migration roadmap or risk scoring'].map(x => (
                  <li key={x} className="flex items-center gap-2"><XCircle className="w-3.5 h-3.5 text-red-800 flex-shrink-0" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-green-900/30 bg-green-950/10">
              <div className="text-sm font-semibold text-green-400 mb-4">VendorSentinel eradicates autonomously</div>
              <ul className="space-y-2 text-sm text-slate-400">
                {['Receives a goal, acts without prompting', 'Checks existing stack before external options', 'Finds 4 replacement types per eliminated tool', 'Scores confidence, risk, and expected outcome', 'Produces a complete migration roadmap'].map(x => (
                  <li key={x} className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-navy-800 py-8 text-center text-slate-600 text-sm">
        StaGove VendorSentinel AI — Autonomous Software Eradication Agent
      </footer>
    </div>
  )
}
