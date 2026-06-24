const PROXY_ENDPOINT = '/.netlify/functions/groq-proxy'
const MODEL = 'llama-3.3-70b-versatile'

export async function callGroq(messages, maxTokens = 4000) {
  const response = await fetch(PROXY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    if (response.status === 429) throw new Error('RATE_LIMIT')
    if (response.status === 401) throw new Error('INVALID_KEY')
    throw new Error(error?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

export async function callGroqWithRetry(messages, maxTokens = 4000, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await callGroq(messages, maxTokens)
    } catch (err) {
      if (err.message === 'RATE_LIMIT' && i < retries - 1) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1)))
        continue
      }
      throw err
    }
  }
}
