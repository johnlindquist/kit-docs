// Name: Cancel Audio with Keyboard Shortcut
// Group: Audio

import "@johnlindquist/kit"

// Start saying long thing
say(`I have so much to say I'm just going to keep talking until someone shuts me up`)

registerShortcut("opt x", () => {
  say("") //will cancel
  process.exit() // you need to exit or else the shortcuts will keep the script active
})

registerShortcut("opt y", () => {
  say("You're done", {
    name: "Alice",
    rate: 0.5,
    pitch: 2,
  })
  process.exit()
})
