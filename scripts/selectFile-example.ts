
let filePromptMessage = "Select a file to upload"
let filePath = await selectFile(filePromptMessage)
let text = await readFile(filePath, "utf8")
let gist = await createGist(text)


