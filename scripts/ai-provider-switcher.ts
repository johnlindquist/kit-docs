import "@johnlindquist/kit"

const providers = [
    { name: "OpenAI", value: "openai", models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"] },
    { name: "Anthropic", value: "anthropic", models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"] },
    { name: "Google", value: "google", models: ["gemini-1.5-pro-latest", "gemini-1.0-pro"] },
    { name: "xAI (Grok)", value: "xai", models: ["grok-1"] },
    { name: "OpenRouter", value: "openrouter", models: ["openrouter/cognitive-compute", "openrouter/other-model"] },
]

const provider = await arg("Select AI Provider", providers.map(p => ({ name: p.name, value: p.value })))
const selectedProvider = providers.find(p => p.value === provider)!
const model = await arg("Select Model", selectedProvider.models)
const prompt = await arg("Enter your prompt")

const modelString = `${provider}:${model}`

const result = await ai(prompt, { model: modelString })

await div(md(`
### Provider: ${selectedProvider.name}
### Model: ${model}

**Prompt:**

> ${prompt}

**Result:**

> ${result}
`)) 