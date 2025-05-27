import "@johnlindquist/kit"

const summarize = ai(
    "Summarize the following text in one sentence"
)

const summary = await summarize(
    "The quick brown fox jumps over the lazy dog. The lazy dog was not impressed. The fox, feeling dejected, went home."
)

await div(md(`
## AI Text Summarization
**Input:** The quick brown fox jumps over the lazy dog. The lazy dog was not impressed. The fox, feeling dejected, went home.

**Summary:** ${summary}
`)) 