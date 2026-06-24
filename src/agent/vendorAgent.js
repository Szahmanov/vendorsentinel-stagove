import { callGroqWithRetry } from './groqClient.js'

const SYSTEM_PROMPT = `You are VendorSentinel, an autonomous Software Eradication & Cost Optimization Agent.
You analyze software stacks and make independent decisions to eliminate waste, detect duplicates, find free replacements, and generate complete migration strategies.

You are NOT a chatbot. You are a decision-making agent that produces structured business intelligence.

Always respond ONLY with valid JSON, no markdown, no explanation outside the JSON structure.`

export async function runVendorAudit(inputData, onStep) {
  const steps = [
    { id: 'extract', label: 'Extracting vendors & costs', done: false },
    { id: 'classify', label: 'Classifying & detecting overlaps', done: false },
    { id: 'decide', label: 'Making autonomous decisions', done: false },
    { id: 'replacements', label: 'Finding free replacements', done: false },
    { id: 'hidden', label: 'Detecting hidden costs', done: false },
    { id: 'workflows', label: 'Designing replacement workflows', done: false },
    { id: 'migration', label: 'Generating migration plan', done: false },
    { id: 'report', label: 'Compiling final report', done: false },
  ]

  onStep(steps, 'extract')

  // PHASE 1: Main audit
  const auditPrompt = `You are a Software Eradication & Cost Optimization Agent. Analyze this software inventory.

INPUT DATA:
${inputData}

Respond with ONLY this JSON (no markdown, no backticks):
{
  "vendors": [
    {
      "name": "string",
      "category": "project_management|communication|design|storage|crm|accounting|scheduling|reporting|marketing|automation|other",
      "monthly_cost": number,
      "annual_cost": number,
      "purpose": "string",
      "decision": "KEEP|REMOVE|REPLACE|CONSOLIDATE|REVIEW",
      "reasoning": "string (2-3 sentences of autonomous reasoning)",
      "confidence_score": number (0-100),
      "duplicate_of": ["array of overlapping tool names or empty"],
      "risk": "LOW|MEDIUM|HIGH",
      "lock_in_risk": "LOW|MEDIUM|HIGH",
      "migration_effort": "LOW|MEDIUM|HIGH",
      "estimated_monthly_savings": number,
      "hidden_costs": {
        "multi_user_scaling": "string or null",
        "addons": "string or null",
        "upgrade_pressure": "string or null",
        "true_annual_cost": number
      },
      "replacement_suggestion": "string or null"
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
    "complexity_score_before": number (0-100, higher = more complex),
    "complexity_score_after": number (0-100),
    "complexity_reduction_pct": number
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
    if (err.message === 'INVALID_KEY') throw new Error('Groq API key not configured.')
    if (err.message === 'RATE_LIMIT') throw new Error('Rate limit hit. Wait 30 seconds and retry.')
    throw new Error(`Audit failed: ${err.message}`)
  }

  onStep(steps, 'decide')
  await delay(300)

  // PHASE 2: Replacement options for REMOVE/REPLACE/CONSOLIDATE
  const needsReplacement = auditResult.vendors.filter(v =>
    v.decision === 'REMOVE' || v.decision === 'REPLACE' || v.decision === 'CONSOLIDATE'
  )

  onStep(steps, 'replacements')

  let replacementsResult = { replacements: [] }
  if (needsReplacement.length > 0) {
    const replacementPrompt = `For each software tool being eliminated, provide 3 replacement options (free or lower cost).

TOOLS TO REPLACE:
${needsReplacement.map(v => `- ${v.name} ($${v.monthly_cost}/mo, ${v.category}): ${v.purpose}`).join('\n')}

Respond with ONLY this JSON (no markdown):
{
  "replacements": [
    {
      "tool": "string (original tool name)",
      "options": [
        {
          "label": "Option A (Recommended)",
          "name": "string",
          "cost": "Free | $X/mo",
          "monthly_cost": number,
          "feature_match_pct": number (0-100),
          "annual_savings": number,
          "migration_difficulty": "Easy|Medium|Hard",
          "trade_offs": "string",
          "ai_workflow": "string (how AI can replace missing features)"
        },
        {
          "label": "Option B",
          "name": "string",
          "cost": "Free | $X/mo",
          "monthly_cost": number,
          "feature_match_pct": number,
          "annual_savings": number,
          "migration_difficulty": "Easy|Medium|Hard",
          "trade_offs": "string",
          "ai_workflow": "string"
        },
        {
          "label": "Option C",
          "name": "string",
          "cost": "Free | $X/mo",
          "monthly_cost": number,
          "feature_match_pct": number,
          "annual_savings": number,
          "migration_difficulty": "Easy|Medium|Hard",
          "trade_offs": "string",
          "ai_workflow": "string"
        }
      ]
    }
  ]
}`

    try {
      const repRaw = await callGroqWithRetry([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: replacementPrompt }
      ], 4000)
      const cleaned = repRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      replacementsResult = JSON.parse(cleaned)
    } catch {
      replacementsResult = { replacements: [] }
    }
  }

  onStep(steps, 'hidden')
  await delay(300)

  // PHASE 3: Workflows
  onStep(steps, 'workflows')

  let workflowsResult = { workflows: [] }
  if (needsReplacement.length > 0) {
    const workflowPrompt = `Generate replacement workflows for these eliminated tools:

${needsReplacement.map(v => `- ${v.name} (${v.category}, $${v.monthly_cost}/mo): ${v.decision}`).join('\n')}

Respond with ONLY this JSON (no markdown):
{
  "workflows": [
    {
      "tool": "string",
      "decision": "string",
      "workflow_name": "string",
      "description": "string",
      "steps": ["array of concrete steps"],
      "tools_needed": ["free tools or AI workflows"],
      "time_to_implement": "string",
      "ai_automation": "string"
    }
  ]
}`

    try {
      const wfRaw = await callGroqWithRetry([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: workflowPrompt }
      ], 3000)
      const cleaned = wfRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      workflowsResult = JSON.parse(cleaned)
    } catch {
      workflowsResult = {
        workflows: needsReplacement.map(v => ({
          tool: v.name,
          decision: v.decision,
          workflow_name: `${v.name} Replacement`,
          description: v.replacement_suggestion || `Replace ${v.name} with free alternatives`,
          steps: ['Export data', 'Find free alternative', 'Migrate team', 'Cancel subscription'],
          tools_needed: ['Google Workspace', 'AI workflows'],
          time_to_implement: '1-2 weeks',
          ai_automation: 'Use AI to generate outputs on demand'
        }))
      }
    }
  }

  // PHASE 4: Migration plan
  onStep(steps, 'migration')

  const migrationPrompt = `Create a migration plan for eliminating these tools:
Tools: ${needsReplacement.map(v => v.name).join(', ')}
Monthly savings: $${auditResult.summary?.monthly_savings || 0}

Respond with ONLY this JSON (no markdown):
{
  "migration_plan": {
    "today": {
      "title": "Immediate Actions (Day 1)",
      "actions": ["4-6 specific actions"],
      "priority": "CRITICAL"
    },
    "this_week": {
      "title": "Week 1 Transition",
      "actions": ["5-7 specific actions"],
      "priority": "HIGH"
    },
    "this_month": {
      "title": "Month 1 Completion",
      "actions": ["5-7 specific actions"],
      "priority": "MEDIUM"
    },
    "data_exports": ["data to export before canceling"],
    "risk_warnings": ["risks to watch for"],
    "backup_strategy": "string"
  }
}`

  let migrationResult = { migration_plan: null }
  try {
    const migRaw = await callGroqWithRetry([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: migrationPrompt }
    ], 2000)
    const cleaned = migRaw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    migrationResult = JSON.parse(cleaned)
  } catch {
    migrationResult = {
      migration_plan: {
        today: { title: 'Immediate Actions (Day 1)', actions: ['Note all billing dates', 'Export data from tools marked REMOVE', 'Notify team', 'Set up replacements'], priority: 'CRITICAL' },
        this_week: { title: 'Week 1 Transition', actions: ['Cancel non-critical subscriptions', 'Train team on replacements', 'Verify data integrity'], priority: 'HIGH' },
        this_month: { title: 'Month 1 Completion', actions: ['Cancel all targeted subscriptions', 'Review savings', 'Document new processes'], priority: 'MEDIUM' },
        data_exports: ['Project files', 'Contacts', 'Task history', 'Reports'],
        risk_warnings: ['Export data before canceling', 'Check for integrations', 'Hidden dependencies'],
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
    replacements: replacementsResult.replacements || [],
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
