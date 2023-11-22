// Name: Strict Mode
// Group: Prompt

import "@johnlindquist/kit"

let fruit = await arg(
  {
    placeholder: "Select a fruit",
    hint: "Type 'Grape' and hit enter",
    strict: false,
  },
  ["Apple", "Banana", "Cherry"]
)

await div(md(fruit))
