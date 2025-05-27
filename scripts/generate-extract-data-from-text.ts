import "@johnlindquist/kit"

const userSchema = z.object({
    name: z.string(),
    age: z.number().optional(),
    email: z.string().email().optional(),
})

const extractUserInfo = async (text: string) => {
    return generate(
        `Extract user information from the text: ${text}`,
        userSchema
    )
}

const userInfo = await extractUserInfo(
    "My name is John Doe. I am 30 years old. You can reach me at john.doe@example.com"
)

await div(md(`
## User Info Extraction
**Text:** My name is John Doe. I am 30 years old. You can reach me at john.doe@example.com
**Result:**
\`\`\`json
${JSON.stringify(userInfo, null, 2)}
\`\`\`
`)) 