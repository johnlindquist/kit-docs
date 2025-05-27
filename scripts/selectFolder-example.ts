let promptMessage = "Select a folder for your project"
let folderPath = await selectFolder(promptMessage)

let files = await readdir(folderPath)

await editor(files.join("\n"))
