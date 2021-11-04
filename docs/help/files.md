Most of the methods from [fs/promises](https://nodejs.org/api/fs.html#promises-api) and [fs-extra](https://www.npmjs.com/package/fs-extra) are globally available

## Create a File

```js
// "home" is a method that wraps `path.resolve` based on your home directory
let filePath = home("projects", "kit", "note.txt")
// writes a file to the filePath using `fs-extra's` "outputFile"
await outputFile(filePath, `Drink more water`)
```

## Select and Edit a File

```js
// "selectFile" uses Finder's file selector
let filePath = await selectFile()
let contents = await readFile(filePath, "utf-8")

// Pass the text contents into the editor to quickly edit a file
let result = await editor(contents)
await writeFile(filePath, result)
```
