import { Shield, BarChart3, Table, Workflow, Map, FileText, ChevronLeft, RefreshCw } from 'lucide-react'

const navItems = [
  { id: 'results', label: 'Dashboard', icon: BarChart3, requiresResults: true },
  { id: 'vendors', label: 'Vendors', icon: Table, requiresResults: true },
  { id: 'replacements', label: 'Replacements', icon: RefreshCw, requiresResults: true },
  { id: 'workflows', label: 'Workflows', icon: Workflow, requiresResults: true },
  { id: 'migration', label: 'Migration', icon: Map, requiresResults: true },
  { id: 'report', label: 'Report', icon: FileText, requiresResults: true },
]

export default function NavBar({ currentPage, navigate, hasResults }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => navigate('landing')}
          className="flex items-center gap-2 text-slate-100 hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sentinel-blue to-sentinel-cyan flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight">VendorSentinel AI</div>
            <div className="text-xs text-slate-500 leading-tight">StaGove</div>
          </div>
        </button>

        <nav className="flex items-center gap-1">
          <button onClick={() => navigate('input')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              currentPage === 'input' ? 'bg-sentinel-blue/20 text-sentinel-blue' : 'text-slate-300 hover:text-white hover:bg-navy-800'
            }`}>
            <ChevronLeft className="w-3.5 h-3.5" />
            New Audit
          </button>

          {navItems.map(item => {
            if (item.requiresResults && !hasResults) return null
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  isActive ? 'bg-sentinel-blue/20 text-sentinel-blue' : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:block">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
