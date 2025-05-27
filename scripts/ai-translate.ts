import "@johnlindquist/kit"

const translateToFrench = ai("Translate to French")

const frenchText = await translateToFrench("Hello, how are you today?")

await div(md(`
## AI Translation
**English:** Hello, how are you today?

**French:** ${frenchText}
`))