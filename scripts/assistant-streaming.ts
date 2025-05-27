import "@johnlindquist/kit"

const ideaGenerator = assistant("You're an idea generatior. Generate 3 extremely terse ideas based on my query")
const idea = await arg("Enter your idea")
ideaGenerator.addUserMessage(idea)

const remainingIterations = 3


const editorStreamer = async () => {
    for await (const chunk of ideaGenerator.textStream) {
        editor.append(chunk)
    }
    editor.append("\n\n")
}

await editor({
    onInit: async () => {
        for (let i = 0; i < remainingIterations; i++) {
            await editorStreamer()
            ideaGenerator.addSystemMessage("Pick your favorite idea and generate 3 more based on it")
        }
    }
})



