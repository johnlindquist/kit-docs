// Name: ai-convert-selected-text

import "@johnlindquist/kit"

const text = await getSelectedText()

const rewriter = ai(`
You are an expert at cleaning up text for clarity and readability. 
- Only improve the text. 
- Do not include any other text in your response. 
- Avoid using markdown formatting.
`)

const cleanedText = await rewriter(text)

await setSelectedText(cleanedText)