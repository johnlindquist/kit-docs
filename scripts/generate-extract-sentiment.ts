import "@johnlindquist/kit"

const sentimentSchema = z.object({
    sentiment: z.enum(["positive", "negative", "neutral"]),
    confidence: z.number().min(0).max(1),
    keywords: z.array(z.string()).describe("Keywords that contributed to the sentiment")
})

const extractSentiment = async (text: string) => {
    return generate(
        `Extract sentiment from the following text: ${text}`,
        sentimentSchema
    )
}

const sentimentResult = await extractSentiment("I love Script Kit! It's so easy to use.")

await div(md(`
## Sentiment Analysis
**Text:** I love Script Kit! It's so easy to use.
**Result:**
\`\`\`json
${JSON.stringify(sentimentResult, null, 2)}
\`\`\`
`)) 