import "@johnlindquist/kit"

// Assistant with tools
const fakeWeatherAPI = ({ location }: { location: string }) => {
    if (location === "moon") return "It's kinda dusty"
    return `The weather in ${location} is 70 and sunny.`
}

const weatherTool = {
    getWeather: {
        description: "Call this tool for any weather location in the Universe",
        parameters: z.object({
            location: z.string().describe("The location to get the weather for")
        }),
        execute: async ({ location }: { location: string }) => {
            console.log("Executing weather tool")
            const weather = fakeWeatherAPI({ location })
            return { weather }
        }
    }
}

console.log("Creating weather assistant")
const weatherAssistant = assistant(
    "You are a helpful weather assistant. Use the provided tools to answer the user's questions.",
    { tools: weatherTool }
)

weatherAssistant.addUserMessage("What's the weather on the moon?")
const result = await weatherAssistant.generate()

console.log("Generating weather assistant")
let response = ""
if ("text" in result) {
    response = result.text
} else {
    toast("No text response")
    await editor(JSON.stringify(result, null, 2))
    exit()
}

await div(md(`
## Assistant with Tools
**User:** What's the weather on the moon?
**Assistant:** ${response}
`)) 