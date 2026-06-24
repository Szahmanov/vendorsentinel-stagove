import { callGroqWithRetry } from './groqClient.js'

const SYSTEM_PROMPT = `You are VendorSentinel, an Autonomous Software Eradication Agent.
Your mission: identify waste, eliminate redundant software, replace expensive vendors with better alternatives, and generate complete migration strategies — without additional user guidance.

You are NOT a chatbot. You are a decision-making agent that produces structured business intelligence.

CRITICAL RULE: Before suggesting any external replacement, always check if the functionality already exists in the user's current stack. Existing owned tools are always Option A.

Always respond ONLY with valid JSON, no markdown, no explanation outside the JSON structure.`

export async function runVendorAudit(inputData, onStep) {
  const steps = [
    { id: 'extract', label: 'Extracting vendors & costs', done: false },
    { id: 'classify', label: 'Classifying & detecting overlaps', done: false },
    { id: 'decide', label: 'Making autonomous decisions', done: false },
    { id: 'replacements', label: 'Finding replacements (stack-first logic)', done: false },
    { id: 'lockin', label: 'Analysing vendor lock-in risks', done: false },
    { id: 'migration', label: 'Estimating migration effort', done: false },
    { id: 'eradication', label: 'Calculating Eradication Index', done: false },
    { id: 'report', label: 'Compiling final report', done: false },
  ]

  onStep(steps, 'extract')

  // PHASE 1: Main audit
  const auditPrompt = `You are an Autonomous Software Eradication Agent. Analyze this software inventory.

INPUT DATA:
${inputData}

IMPORTANT: Identify which tools overlap in function. For any REMOVE/REPLACE decision, first check if another tool in THIS LIST already covers that functionality.

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
      "reasoning": "string (3-4 sentences of autonomous reasoning)",
      "confidence_score": number (0-100),
      "risk_score": number (0-100, higher = more risky to remove),
      "expected_outcome": "string (what happens after this decision)",
      "duplicate_of": ["overlapping tool names or empty array"],
      "existing_stack_replacement": "string or null (name of tool already owned that covers this)",
      "risk": "LOW|MEDIUM|HIGH",
      "lock_in_risk": "LOW|MEDIUM|HIGH",
      "migration_effort": "LOW|MEDIUM|HIGH",
      "migration_time_estimate": "string (e.g. 30 minutes, 2 hours, 1 day)",
      "business_interruption_risk": "LOW|MEDIUM|HIGH",
      "estimated_monthly_savings": number,
      "estimated_annual_savings": number,
      "hidden_costs": {
        "multi_user_scaling": "string or null",
        "addons": "string or null",
        "upgrade_pressure": "string or null",
        "true_annual_cost": number
      },
      "lock_in_analysis": {
        "score": number (0-100),
        "risk_factors": ["array of specific lock-in risks"],
        "migration_complexity": "LOW|MEDIUM|HIGH",
        "estimated_migration_time": "string"
      }
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
    "total_migration_time": "string",
    "overall_risk_score": "LOW|MEDIUM|HIGH",
    "complexity_score_before": number (0-100),
    "complexity_score_after": number (0-100),
    "complexity_reduction_pct": number,
    "eradication_index": {
      "score": number (0-100),
      "duplicate_tools_eliminated": number,
      "vendors_eliminated": number,
      "workflow_simplification_pct": number,
      "monthly_spend_reduction_pct": number,
      "complexity_reduction_pct": number
    }
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

  // PHASE 2: Replacement options (stack-first)
  const needsReplacement = auditResult.vendors.filter(v =>
    v.decision === 'REMOVE' || v.decision === 'REPLACE' || v.decision === 'CONSOLIDATE'
  )
  const allToolNames = auditResult.vendors.map(v => v.name).join(', ')

  onStep(steps, 'replacements')

  let replacementsResult = { replacements: [] }
  if (needsReplacement.length > 0) {
    const replacementPrompt = `You are finding replacements for eliminated software tools.

FULL CURRENT STACK (tools the user already owns): ${allToolNames}

TOOLS TO REPLACE:
${needsReplacement.map(v => `- ${v.name} ($${v.monthly_cost}/mo, ${v.category}): ${v.purpose}. Existing stack replacement: ${v.existing_stack_replacement || 'none identified'}`).join('\n')}

PRIORITY ORDER for replacements:
1. BEST OPTION: Tool already owned in current stack (if applicable)
2. FREE OPTION: Best free alternative
3. CHEAPEST OPTION: Lowest cost paid alternative
4. OPEN SOURCE OPTION: Self-hostable open source alternative

For each tool provide all 4 option types. If an existing stack tool covers it, make that Option 1 (Best).

Respond with ONLY this JSON (no markdown):
{
  "replacements": [
    {
      "tool": "string (original tool name)",
      "original_monthly_cost": number,
      "replacement_reasoning": "string (why these replacements were selected: similar functionality, already owned, lowest migration effort, etc.)",
      "options": [
        {
          "type": "BEST",
          "label": "Best Option",
          "name": "string",
          "already_owned": true or false,
          "cost": "Free | $X/mo | Already owned",
          "monthly_cost": number,
          "feature_match_pct": number (0-100),
          "feature_breakdown": {
            "core_features": number (0-100),
            "collaboration": number (0-100),
            "integrations": number (0-100),
            "reliability": number (0-100),
            "ease_of_use": number (0-100)
          },
          "annual_savings": number,
          "migration_time": "string",
          "migration_difficulty": "Easy|Medium|Hard",
          "business_interruption_risk": "Low|Medium|High",
          "trade_offs": "string"
        },
        {
          "type": "FREE",
          "label": "Free Option",
          "name": "string",
          "already_owned": false,
          "cost": "Free",
          "monthly_cost": 0,
          "feature_match_pct": number,
          "feature_breakdown": {
            "core_features": number,
            "collaboration": number,
            "integrations": number,
            "reliability": number,
            "ease_of_use": number
          },
          "annual_savings": number,
          "migration_time": "string",
          "migration_difficulty": "Easy|Medium|Hard",
          "business_interruption_risk": "Low|Medium|High",
          "trade_offs": "string"
        },
        {
          "type": "CHEAPEST",
          "label": "Cheapest Option",
          "name": "string",
          "already_owned": false,
          "cost": "$X/mo",
          "monthly_cost": number,
          "feature_match_pct": number,
          "feature_breakdown": {
            "core_features": number,
            "collaboration": number,
            "integrations": number,
            "reliability": number,
            "ease_of_use": number
          },
          "annual_savings": number,
          "migration_time": "string",
          "migration_difficulty": "Easy|Medium|Hard",
          "business_interruption_risk": "Low|Medium|High",
          "trade_offs": "string"
        },
        {
          "type": "OPEN_SOURCE",
          "label": "Open Source Option",
          "name": "string",
          "already_owned": false,
          "cost": "Free (self-hosted)",
          "monthly_cost": 0,
          "feature_match_pct": number,
          "feature_breakdown": {
            "core_features": number,
            "collaboration": number,
            "integrations": number,
            "reliability": number,
            "ease_of_use": number
          },
          "annual_savings": number,
          "migration_time": "string",
          "migration_difficulty": "Easy|Medium|Hard",
          "business_interruption_risk": "Low|Medium|High",
          "trade_offs": "string"
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

  onStep(steps, 'lockin')
  await delay(300)

  // PHASE 3: Workflows
  onStep(steps, 'migration')

  let workflowsResult = { workflows: [] }
  if (needsReplacement.length > 0) {
    const workflowPrompt = `Generate replacement workflows for these eliminated tools:

${needsReplacement.map(v => `- ${v.name} (${v.category}, $${v.monthly_cost}/mo): ${v.decision} — existing stack replacement: ${v.existing_stack_replacement || 'none'}`).join('\n')}

Respond with ONLY this JSON (no markdown):
{
  "workflows": [
    {
      "tool": "string",
      "decision": "string",
      "workflow_name": "string",
      "description": "string",
      "steps": ["concrete steps"],
      "tools_needed": ["free tools or existing stack tools"],
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
      workflowsResult = { workflows: needsReplacement.map(v => ({
        tool: v.name, decision: v.decision,
        workflow_name: `${v.name} Replacement`, description: `Replace ${v.name}`,
        steps: ['Export data', 'Set up replacement', 'Migrate team', 'Cancel subscription'],
        tools_needed: [v.existing_stack_replacement || 'Google Workspace'],
        time_to_implement: v.migration_time_estimate || '1-2 weeks',
        ai_automation: 'Use AI to automate repetitive tasks'
      }))}
    }
  }

  // PHASE 4: Migration plan
  onStep(steps, 'eradication')

  const migrationPrompt = `Create a migration plan for a business eliminating these tools:
Tools: ${needsReplacement.map(v => `${v.name} (${v.migration_time_estimate || '1-2 days'})`).join(', ')}
Monthly savings: $${auditResult.summary?.monthly_savings || 0}
Overall risk: ${auditResult.summary?.overall_risk_score || 'LOW'}

Respond with ONLY this JSON (no markdown):
{
  "migration_plan": {
    "today": { "title": "Immediate Actions (Day 1)", "actions": ["4-6 actions"], "priority": "CRITICAL" },
    "this_week": { "title": "Week 1 Transition", "actions": ["5-7 actions"], "priority": "HIGH" },
    "this_month": { "title": "Month 1 Completion", "actions": ["5-7 actions"], "priority": "MEDIUM" },
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
    migrationResult = { migration_plan: {
      today: { title: 'Day 1', actions: ['Note billing dates', 'Export all data', 'Notify team', 'Set up replacements'], priority: 'CRITICAL' },
      this_week: { title: 'Week 1', actions: ['Cancel subscriptions', 'Train team', 'Verify data'], priority: 'HIGH' },
      this_month: { title: 'Month 1', actions: ['Complete cancellations', 'Review savings', 'Document processes'], priority: 'MEDIUM' },
      data_exports: ['Project files', 'Contacts', 'Task history'],
      risk_warnings: ['Export before canceling', 'Check integrations'],
      backup_strategy: 'Export all data to Google Drive before canceling'
    }}
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

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

export const SAMPLE_DATA = `Canva Pro, $14.99/month, design tool for marketing materials
Trello Premium, $10/month, project management and task boards
Monday.com, $36/month, project management and team coordination
Dropbox Business, $19.99/month, file storage and sync
Google Workspace, $18/month, email, drive, docs, communication
HubSpot Starter, $20/month, CRM and contact management
Calendly Professional, $12/month, meeting scheduling
QuickBooks Online, $30/month, accounting and invoicing
Notion Plus, $10/month, documentation and project management`
