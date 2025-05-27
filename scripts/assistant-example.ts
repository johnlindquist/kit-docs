import "@johnlindquist/kit"

const downloadsPath = home("Downloads")
const files = await readdir(downloadsPath)

const jester = assistant("Tell a joke about these file names.")
jester.addUserMessage(files.join("\n"))

await editor({
    onInit: async () => {
        for await (const chunk of jester.textStream) {
            editor.append(chunk)
        }
    }
})