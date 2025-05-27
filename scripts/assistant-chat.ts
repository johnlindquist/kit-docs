// Name: Chat with Assistant

import "@johnlindquist/kit"

const chatbot = assistant('You are a helpful assistant')

let currentMessage = ""
await chat({
    onSubmit: async (input) => {
        currentMessage = ""
        chatbot.stop()
        chat.addMessage({
            text: "...",
            position: "left"
        })

        chatbot.addUserMessage(input)

        for await (const chunk of chatbot.textStream) {
            currentMessage += chunk
            const markdownMessage = md(currentMessage)
            const messageIndex = (await chat.getMessages()).length - 1
            chat.setMessage(messageIndex, {
                text: markdownMessage,
            })
        }
    }
})