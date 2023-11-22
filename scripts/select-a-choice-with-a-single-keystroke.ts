// Name: Single Keystroke Demo
// Group: Prompt

import "@johnlindquist/kit"

let choice = await arg({
  placeholder: "Choose a color",
  choices: [
    { name: "[R]ed", value: "red" },
    { name: "[G]reen", value: "green" },
    { name: "[B]lue", value: "blue" },
  ],
})

await div(md(`You chose ${choice}`))
