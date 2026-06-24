import { callGroqWithRetry } from './groqClient.js'

const SYSTEM_PROMPT = `You are VendorSentinel, an autonomous software audit intelligence system.
You analyze software stacks and make independent decisions to eliminate waste, detect duplicates, and generate replacement workflows.

You are NOT a chatbot. You are a decision-making agent. You receive data and produce structured business intelligence.

When analyzing software:
1. Classify each tool into exactly one category: project_management, communication, design, storage, crm, accounting, scheduling, reporting, marketing, automation, other
2. Assign exactly one decision per tool: KEEP, REMOVE, REPLACE, CONSOLIDATE, REVIEW
3. Detect duplicates: tools in the same category with overlapping functions
4. Calculate savings as the monthly cost of removed/replaced/consolidated tools
5. Generate specific replacement workflows for every REMOVE or REPLACE decision
6. Produce a concrete migration plan

Always respond ONLY with valid JSON, no markdown, no explanation outside the JSON structure.`

export async function runVendorAudit(inputData, onStep) {
  const steps = [
    { id: 'extract', label: 'Extracting vendors & costs', done: false },
    { id: 'classify', label: 'Classifying tools by function', done: false },
    { id: 'detect', label: 'Detecting duplicates & waste', done: false },
    { id: 'decide', label: 'Making autonomous decisions', done: false },
    { id: 'savings', label: 'Calculating savings', done: false },
    { id: 'workflows', label: 'Designing replacement workflows', done: false },
    { id: 'migration', label: 'Generating migration plan', done: false },
    { id: 'report', label: 'Compiling final report', done: false },
  ]

  onStep(steps, 'extract')

  const auditPrompt = `Analyze this software inventory and perform a complete vendor audit.

INPUT DATA:
${inputData}

Respond with ONLY this JSON structure (no markdown, no backticks):
{
  "vendors": [
    {
      "name": "string",
      "category": "project_management|communication|design|storage|crm|accounting|scheduling|reporting|marketing|automation|other",
      "monthly_cost": number,
      "annual_cost": number,
      "purpose": "string",
      "decision": "KEEP|REMOVE|REPLACE|CONSOLIDATE|REVIEW",
      "reason": "string (2-3 sentences explaining the autonomous reasoning)",
      "duplicate_of": ["string array of overlapping tool names, or empty array"],
      "risk": "LOW|MEDIUM|HIGH",
      "replacement": "string (specific replacement workflow, or null if KEEP)"
    }
  ],
  "summary": {
    "total_monthly_cost": number,
    "total_annual_cost": number,
    "optimized_monthly_cost": number,
    "optimized_annual_cost": number,
    "monthly_savings": number,
    "annual_savings": number,
    "keep_count": number,
    "remove_count": number,
    "replace_count": number,
    "consolidate_count": number,
    "review_count": number,
    "duplicate_groups": number
  },
  "duplicate_groups": [
    {
      "category": "string",
      "tools": ["array of tool names"],
      "recommendation": "string"
    }
  ]
}`

  onStep(steps, 'classify')

  let auditResult
  try {
    const auditRaw = await callGroqWithRetry([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: auditPrompt }
    ], 4000)

    const cleaned = auditRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    auditResult = JSON.parse(cleaned)
  } catch (err) {
    if (err.message === 'INVALID_KEY') throw new Error('Groq API key not configured. Contact the administrator.')
    if (err.message === 'RATE_LIMIT') throw new Error('Rate limit hit. Wait 30 seconds and retry.')
    throw new Error(`Audit failed: ${err.message}`)
  }

  onStep(steps, 'detect')
  await delay(400)
  onStep(steps, 'decide')
  await delay(300)
  onStep(steps, 'savings')
  await delay(300)

  const needsWorkflow = auditResult.vendors.filter(v =>
    v.decision === 'REMOVE' || v.decision === 'REPLACE' || v.decision === 'CONSOLIDATE'
  )

  onStep(steps, 'workflows')

  let workflowsResult = { workflows: [] }
  if (needsWorkflow.length > 0) {
    const workflowPrompt = `Generate specific replacement workflows for these software tools that are being eliminated:

${needsWorkflow.map(v => `- ${v.name} (${v.category}, $${v.monthly_cost}/mo): ${v.decision} — ${v.reason}`).join('\n')}

Respond with ONLY this JSON (no markdown):
{
  "workflows": [
    {
      "tool": "string",
      "decision": "REMOVE|REPLACE|CONSOLIDATE",
      "workflow_name": "string",
      "description": "string",
      "steps": ["array of concrete action steps"],
      "tools_needed": ["free tools or manual processes that replace this"],
      "time_to_implement": "string",
      "ai_automation": "string"
    }
  ]
}`

    try {
      const workflowRaw = await callGroqWithRetry([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: workflowPrompt }
      ], 3000)

      const cleaned = workflowRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      workflowsResult = JSON.parse(cleaned)
    } catch {
      workflowsResult = {
        workflows: needsWorkflow.map(v => ({
          tool: v.name,
          decision: v.decision,
          workflow_name: `${v.name} Replacement`,
          description: v.replacement || `Replace ${v.name} with simpler alternatives`,
          steps: ['Export existing data', 'Identify free alternative', 'Migrate team', 'Cancel subscription'],
          tools_needed: ['Google Workspace', 'Manual process'],
          time_to_implement: '1-2 weeks',
          ai_automation: 'Use AI to generate reports, summaries, and task lists on demand'
        }))
      }
    }
  }

  onStep(steps, 'migration')

  const migrationPrompt = `Create a detailed migration plan for a business eliminating these tools:

Tools being removed: ${needsWorkflow.map(v => v.name).join(', ')}
Monthly savings: $${auditResult.summary?.monthly_savings || 0}

Respond with ONLY this JSON (no markdown):
{
  "migration_plan": {
    "today": {
      "title": "Immediate Actions (Day 1)",
      "actions": ["array of 4-6 specific actions"],
      "priority": "CRITICAL"
    },
    "this_week": {
      "title": "Week 1 Transition",
      "actions": ["array of 5-7 specific actions"],
      "priority": "HIGH"
    },
    "this_month": {
      "title": "Month 1 Completion",
      "actions": ["array of 5-7 specific actions"],
      "priority": "MEDIUM"
    },
    "data_exports": ["list of data to export before canceling"],
    "risk_warnings": ["array of risks to watch for"],
    "backup_strategy": "string"
  }
}`

  let migrationResult = { migration_plan: null }
  try {
    const migrationRaw = await callGroqWithRetry([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: migrationPrompt }
    ], 2000)

    const cleaned = migrationRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    migrationResult = JSON.parse(cleaned)
  } catch {
    migrationResult = {
      migration_plan: {
        today: { title: 'Immediate Actions (Day 1)', actions: ['Audit all subscriptions and note next billing dates', 'Export all data from tools marked REMOVE', 'Notify team of upcoming changes', 'Set up replacement workflows'], priority: 'CRITICAL' },
        this_week: { title: 'Week 1 Transition', actions: ['Cancel subscriptions not in next billing cycle', 'Train team on replacement tools', 'Set up new processes', 'Verify data integrity'], priority: 'HIGH' },
        this_month: { title: 'Month 1 Completion', actions: ['Cancel all targeted subscriptions', 'Review savings', 'Optimize new workflows', 'Document new processes'], priority: 'MEDIUM' },
        data_exports: ['Project files', 'Contact lists', 'Task histories', 'Reports'],
        risk_warnings: ['Data loss if not exported first', 'Team resistance to change', 'Hidden dependencies'],
        backup_strategy: 'Export all data to Google Drive before canceling any subscription'
      }
    }
  }

  onStep(steps, 'report')
  await delay(200)

  steps.forEach(s => s.done = true)
  onStep(steps, null)

  return {
    vendors: auditResult.vendors || [],
    summary: auditResult.summary || {},
    duplicate_groups: auditResult.duplicate_groups || [],
    workflows: workflowsResult.workflows || [],
    migration_plan: migrationResult.migration_plan || {},
    generated_at: new Date().toISOString()
  }
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

export const SAMPLE_DATA = `Canva Pro, $14.99/month, design tool for marketing materials
Trello Premium, $10/month, project management and task boards
Monday.com, $36/month, project management and team coordination
Dropbox Business, $19.99/month, file storage and sync
Google Workspace, $18/month, email, drive, docs, communication
HubSpot Starter, $20/month, CRM and contact management
Calendly Professional, $12/month, meeting scheduling
QuickBooks Online, $30/month, accounting and invoicing
Notion Plus, $10/month, documentation and project management`
