let buffer = await webcam()
let imagePath = tmpPath("image.jpg")
await writeFile(imagePath, buffer)
await revealFile(imagePath)