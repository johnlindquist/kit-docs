// Name: Append Text to Editor
// Group: Editor

import "@johnlindquist/kit"

let sentence = `This is a sentence that will be appended to the editor.`
let words = sentence.split(" ")

setInterval(() => {
  let word = words.shift()
  if (word) {
    editor.append(word + " ")
  }
}, 100)

await editor({
  lineNumbers: "on",
  fontFamily: "Menlo",
})
