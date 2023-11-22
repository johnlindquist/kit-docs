// Name: Progress Panel
// Group: Prompt

import "@johnlindquist/kit"

let first = ""
let second = ""
let third = ""
let progressPanel = () =>
  md(`# Progress: 
- ${first || "Waiting first value"}
- ${second || "Waiting second value"}
- ${third || "Waiting third value"}
`)

first = await arg("Enter the first value", progressPanel)
second = await arg("Enter the second value", progressPanel)
third = await arg("Enter the third value", progressPanel)

await div(
  md(`# You entered:
- ${first}
- ${second}
- ${third}
`)
)
