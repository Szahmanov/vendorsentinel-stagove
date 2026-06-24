import { CheckCircle, Loader } from 'lucide-react'
import { Shield } from 'lucide-react'

export default function ProcessingPage({ steps, navigate }) {
  const completedCount = steps.filter(s => s.done).length
  const total = steps.length
  const progress = total > 0 ? (completedCount / total) * 100 : 0

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sentinel-blue to-sentinel-cyan flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-200">VendorSentinel AI</div>
            <div className="text-xs text-slate-500">Autonomous Audit in Progress</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Processing</span>
            <span>{completedCount}/{total} steps</span>
          </div>
          <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sentinel-blue to-sentinel-cyan rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                step.done
                  ? 'border-green-900/40 bg-green-950/10'
                  : step.active
                  ? 'border-sentinel-blue/40 bg-sentinel-blue/5'
                  : 'border-navy-800 bg-navy-900/30'
              }`}
            >
              <div className="flex-shrink-0">
                {step.done ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : step.active ? (
                  <Loader className="w-5 h-5 text-sentinel-blue animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-navy-700" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium transition-colors ${
                  step.done
                    ? 'text-green-400'
                    : step.active
                    ? 'text-sentinel-blue'
                    : 'text-slate-600'
                }`}>
                  {step.label}
                </div>
                {step.active && (
                  <div className="text-xs text-slate-500 mt-0.5">
                    Agent is reasoning...
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-600 font-mono">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Intelligence note */}
        <div className="mt-10 p-4 rounded-xl bg-navy-900/50 border border-navy-800">
          <div className="text-xs text-slate-500 leading-relaxed text-center">
            The agent is executing its autonomous decision loop — extracting, classifying, comparing, deciding, and planning without further input from you.
          </div>
        </div>
      </div>
    </div>
  )
}
