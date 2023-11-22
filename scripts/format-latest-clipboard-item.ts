// Name: Format Latest Clipboard Item
// Group: Clipboard

import "@johnlindquist/kit"

let text = await paste()
let newText = text.replace("a", "b")
await setSelectedText(newText)
