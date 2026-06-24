import { useState, useRef } from 'react'
import { Upload, FileText, Type, AlertCircle, Zap } from 'lucide-react'
import { runVendorAudit, SAMPLE_DATA } from '../agent/vendorAgent.js'

const TABS = [
  { id: 'manual', label: 'Manual / Paste', icon: Type },
  { id: 'csv', label: 'CSV Upload', icon: Upload },
]

export default function InputPage({ navigate, inputText, setInputText, setAuditData, setProcessingSteps, setError, error }) {
  const [tab, setTab] = useState('manual')
  const [csvContent, setCsvContent] = useState('')
  const [csvFilename, setCsvFilename] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const fileRef = useRef()

  const handleCSV = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCsvFilename(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setCsvContent(ev.target.result)
    reader.readAsText(file)
  }

  const getInput = () => tab === 'csv' ? csvContent : inputText

  const runAudit = async () => {
    const input = getInput().trim()
    if (!input) return setError('Please provide your software list before running the audit.')
    setIsRunning(true)
    setError(null)
    navigate('processing')
    try {
      const result = await runVendorAudit(input, (steps, currentStep) => {
        setProcessingSteps([...steps.map(s => ({ ...s, active: s.id === currentStep }))])
      })
      setAuditData(result)
      navigate('results')
    } catch (err) {
      setError(err.message)
      navigate('input')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Software Inventory</h1>
        <p className="text-slate-500 text-sm">Provide your software list. The agent will analyze, classify, and audit every tool.</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/30 border border-red-800/40 mb-6">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-sm text-red-300 font-medium">Audit failed</div>
            <div className="text-sm text-red-400/80 mt-0.5">{error}</div>
          </div>
        </div>
      )}

      <div className="flex gap-1 p-1 bg-navy-900 rounded-xl mb-6 border border-navy-700">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-lg transition-colors ${tab === t.id ? 'bg-navy-800 text-slate-200 border border-navy-600' : 'text-slate-500 hover:text-slate-300'}`}>
              <Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          )
        })}
      </div>

      {tab === 'manual' && (
        <div className="mb-6">
          <textarea value={inputText} onChange={e => setInputText(e.target.value)}
            placeholder="Notion Plus, $10/month, project management&#10;Trello Premium, $10/month, task boards&#10;Monday.com, $36/month, team coordination"
            className="w-full h-64 bg-navy-950 border border-navy-700 rounded-xl px-4 py-4 text-slate-300 text-sm placeholder-slate-600 focus:outline-none focus:border-sentinel-blue transition-colors resize-none font-mono" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-600">{inputText.length} characters</span>
            <button onClick={() => { setTab('manual'); setInputText(SAMPLE_DATA) }} className="text-xs text-sentinel-blue hover:text-blue-400">Load sample data →</button>
          </div>
        </div>
      )}

      {tab === 'csv' && (
        <div className="mb-6">
          <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-navy-700 hover:border-sentinel-blue rounded-xl p-12 text-center cursor-pointer transition-colors group">
            <Upload className="w-8 h-8 text-slate-600 group-hover:text-sentinel-blue mx-auto mb-3" />
            {csvFilename
              ? <><div className="text-sm text-slate-300 font-medium">{csvFilename}</div><div className="text-xs text-slate-500 mt-1">{csvContent.length} characters loaded</div></>
              : <><div className="text-sm text-slate-400">Click to upload CSV</div><div className="text-xs text-slate-600 mt-1">vendor, monthly_cost, category</div></>
            }
          </div>
          <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleCSV} className="hidden" />
        </div>
      )}

      <div className="card p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Accepted formats</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500">
          <div><div className="text-slate-400 font-medium mb-1">Simple list</div><div className="font-mono text-slate-600">Notion, $10/month<br/>Slack, $8/user/month</div></div>
          <div><div className="text-slate-400 font-medium mb-1">Plain text</div><div className="font-mono text-slate-600">We use Notion for docs,<br/>Monday for projects...</div></div>
          <div><div className="text-slate-400 font-medium mb-1">CSV</div><div className="font-mono text-slate-600">name,cost,category<br/>Notion,10,pm</div></div>
        </div>
      </div>

      <button onClick={runAudit} disabled={isRunning || !getInput().trim()}
        className="w-full flex items-center justify-center gap-2 py-4 bg-sentinel-blue hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all glow-blue">
        <Zap className="w-5 h-5" />Run Autonomous Audit
      </button>
    </div>
  )
}
