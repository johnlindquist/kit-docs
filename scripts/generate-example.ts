import "@johnlindquist/kit"

const result = await generate(
    'Generate 10 random users as an array in a property called "users"',
    z.object({
        users: z.array(
            z.object({
                firstName: z.string(),
                lastName: z.string(),
                age: z.number(),
                email: z.string().email(),
            })
        )
    })
)
const users = result.users

await editor(JSON.stringify(users, null, 2))