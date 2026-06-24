import { useState } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import InputPage from './pages/InputPage.jsx'
import ProcessingPage from './pages/ProcessingPage.jsx'
import ResultsDashboard from './pages/ResultsDashboard.jsx'
import VendorTable from './pages/VendorTable.jsx'
import ReplacementsPage from './pages/ReplacementsPage.jsx'
import WorkflowsPage from './pages/WorkflowsPage.jsx'
import MigrationPage from './pages/MigrationPage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import NavBar from './components/NavBar.jsx'

export default function App() {
  const [page, setPage] = useState('landing')
  const [auditData, setAuditData] = useState(null)
  const [inputText, setInputText] = useState('')
  const [processingSteps, setProcessingSteps] = useState([])
  const [error, setError] = useState(null)

  const navigate = (p) => {
    setError(null)
    setPage(p)
    window.scrollTo(0, 0)
  }

  const showNav = !['landing', 'processing'].includes(page)

  return (
    <div className="min-h-screen bg-navy-950">
      {showNav && (
        <NavBar currentPage={page} navigate={navigate} hasResults={!!auditData} />
      )}
      <main className={showNav ? 'pt-16' : ''}>
        {page === 'landing' && <LandingPage navigate={navigate} />}
        {page === 'input' && (
          <InputPage
            navigate={navigate}
            inputText={inputText}
            setInputText={setInputText}
            setAuditData={setAuditData}
            setProcessingSteps={setProcessingSteps}
            setError={setError}
            error={error}
          />
        )}
        {page === 'processing' && <ProcessingPage steps={processingSteps} navigate={navigate} />}
        {page === 'results' && auditData && <ResultsDashboard data={auditData} navigate={navigate} />}
        {page === 'vendors' && auditData && <VendorTable vendors={auditData.vendors} navigate={navigate} />}
        {page === 'replacements' && auditData && <ReplacementsPage replacements={auditData.replacements} vendors={auditData.vendors} navigate={navigate} />}
        {page === 'workflows' && auditData && <WorkflowsPage workflows={auditData.workflows} vendors={auditData.vendors} navigate={navigate} />}
        {page === 'migration' && auditData && <MigrationPage plan={auditData.migration_plan} summary={auditData.summary} navigate={navigate} />}
        {page === 'report' && auditData && <ReportPage data={auditData} navigate={navigate} />}
      </main>
    </div>
  )
}
