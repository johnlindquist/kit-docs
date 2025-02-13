let filePath = await find("Search in the Downloads directory", {
  onlyin: home("Downloads"),
})

await revealFile(filePath)