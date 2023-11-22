# Tips

Tips are a collection of answers to user questions in GitHub Discussions and our Discord organized by topic.

## Audio

### Cancel Audio with Keyboard Shortcut

```ts
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

```

## Clipboard

### Format Latest Clipboard Item

```ts
// Name: Format Latest Clipboard Item
// Group: Clipboard

import "@johnlindquist/kit"

let text = await paste()
let newText = text.replace("a", "b")
await setSelectedText(newText)

```

## Data

### Database Read/Write Example

```ts
// Name: Database Read/Write Example
// Description: Add/remove items from a list of fruit
// Group: Data

import "@johnlindquist/kit"

let fruitDb = await db(["apple", "banana", "orange"])

while (true) {
  let fruitToAdd = await arg("Add a fruit", md(fruitDb.items.map(fruit => `* ${fruit}`).join("\n")))

  fruitDb.items.push(fruitToAdd)
  await fruitDb.write()

  let fruitToDelete = await arg("Delete a fruit", fruitDb.items)

  fruitDb.items = fruitDb.items.filter(fruit => fruit !== fruitToDelete)

  await fruitDb.write()
}

```

### Edit the Keys and Values of an Object

```ts
// Name: Edit the Keys and Values of an Object
// Group: Data

import "@johnlindquist/kit"

let data = {
  name: "John",
  age: 42,
  location: "USA",
}

let result = await fields(
  Object.entries(data).map(([key, value]) => ({
    name: key,
    label: key,
    value: String(value),
  }))
)

let newData = Object.entries(data).map(([key], i) => ({
  [key]: result[i],
}))

inspect(newData)

```

### Populate db example

```ts
// Name: Populate db example
// Description: Shows how to pre-populate database
// Group: Data

// Pass in a function to generate data for the db
// Because this script is named "db-basic.js"
// The database is found at "~/.kenv/db/_db-basic.json"

let reposDb = await db(async () => {
  let response = await get("https://api.github.com/users/johnlindquist/repos")

  return response.data.map(({ name, description, html_url }) => {
    return {
      name,
      description,
      value: html_url,
    }
  })
})
let repoUrl = await arg("Select repo to open:", reposDb.items)

exec(`open "${repoUrl}"`)

```

## Desktop

### Get Active App on Mac

```ts
// Name: Get Active App on Mac
// Group: Desktop

// MAC ONLY!
import "@johnlindquist/kit"

// Always hide immmediately if you're not going to show a prompt
await hide()

// Note: This uses "https://www.npmjs.com/package/@johnlindquist/mac-frontmost" inside Kit.app,
// but you can import that package directly (or another similar package) if you prefer
let info = await getActiveAppInfo()
if (info.bundleIdentifier === "com.google.Chrome") {
  await keyboard.pressKey(Key.LeftSuper, Key.T)
  await keyboard.releaseKey(Key.LeftSuper, Key.T)
}

```

## Markdown

### Generate Tips.md from Scripts

```ts
// Name: Generate Tips.md from Scripts
// Group: Markdown

import "@johnlindquist/kit"

let scripts = await getScripts()

// Check if kit-docs is a kenv

let kenv = path.basename(projectPath())
let isKitDocsInAKenv = kenv !== ".kenv"
let outFilePath = projectPath("TIPS.md")

if (isKitDocsInAKenv) {
  scripts = scripts.filter(script => script.kenv === kenv)
}

scripts.sort((a, b) => a.group.localeCompare(b.group))

// Group by group
let groups = {}
for (let script of scripts) {
  if (!groups[script.group]) groups[script.group] = []
  groups[script.group].push(script)
}

// Convert Groups into Markdown h2's with the Content Below
let markdownBody = ``
for (let [group, scripts] of Object.entries(groups)) {
  markdownBody += `## ${group}\n\n`
  for (let script of scripts.sort((a, b) => a.name.localeCompare(b.name))) {
    let content = await readFile(script.filePath, "utf8")
    markdownBody += `### ${script.name}\n\n`
    markdownBody += "```ts\n"
    markdownBody += content
    markdownBody += "\n```\n\n"
  }
}

let markdown = `# Tips

Tips are a collection of answers to user questions in GitHub Discussions and our Discord organized by topic.

${markdownBody}
`.trim()

await writeFile(outFilePath, markdown)

```

## Prompt

### Force a User to Pick an Option

```ts
// Name: Force a User to Pick an Option
// Group: Prompt

import "@johnlindquist/kit"

let animals = ["dog", "cat", "rabbit", "horse", "elephant"]
let secondsRemaining = 3
let getHint = secondsRemaining => `Hurry! You only have ${secondsRemaining} seconds to choose an animal...`

let animal = ""

animal = await arg(
  {
    hint: getHint(secondsRemaining),
    onInit: async () => {
      while (secondsRemaining > 0 && !animal) {
        setHint(getHint(secondsRemaining))
        await wait(1000)
        secondsRemaining--
      }

      if (!animal) exit()
    },
  },
  animals
)

await div(md(`# Phew! You made it! You chose ${animal}`))

```

### Progress Panel

```ts
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

```

### Return to the Main Script on Escape

```ts
// Name: Return to the Main Script on Escape
// Group: Prompt

import "@johnlindquist/kit"

await div({
  html: md(`# Hello`),
  shortcuts: [
    {
      key: "escape",
      onPress: async () => {
        await mainScript()
      },
    },
  ],
})

```

### Rewind Prompts

```ts
// Name: Rewind Prompts
// Group: Prompt

import { Shortcut } from "@johnlindquist/kit"

let currentStep = 0
let direction = 1

let shortcuts: Shortcut[] = [
  {
    key: "escape",
    onPress: async () => {
      submit("")
    },
  },
]

let step1 = async () =>
  await arg({
    placeholder: "one",
    shortcuts,
  })

let step2 = async () =>
  await arg({
    placeholder: "two",
    shortcuts,
  })

let step3 = async () =>
  await arg({
    placeholder: "three",
    shortcuts,
  })

let steps = [
  { prompt: step1, value: "" },
  { prompt: step2, value: "" },
  { prompt: step3, value: "" },
]

while (currentStep < steps.length) {
  let step = steps[currentStep]
  step.value = await step.prompt()
  direction = step.value ? 1 : -1
  currentStep += direction
  if (currentStep < 0) {
    exit() // Pressing escape on the first prompt will exit the script
  }
}

inspect(steps)

```

### Single Keystroke Demo

```ts
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

```

### Strict Mode

```ts
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

```

## Styles

### Adjust the CSS of Choices

```ts
// Name: Adjust the CSS of Choices
// Group: Styles

import "@johnlindquist/kit"

let choice = await arg({
  css: `
.light-purple {
  background-color: #c8a2c8;
}  
.medium-purple {
  background-color: #967bb6;
}
.dark-purple {
  background-color: #5d4777;
}

.focused {
  box-shadow: inset .5rem 0 0 0 #ffffffee;
}
  `,
  placeholder: "Choose a shade of purple",
  choices: [
    { name: "[L]ight Purple", value: "light-purple", className: "light-purple", focusedClassName: "focused" },
    { name: "[M]edium Purple", value: "medium-purple", className: "medium-purple", focusedClassName: "focused" },
    { name: "[D]ark Purple", value: "dark-purple", className: "dark-purple", focusedClassName: "focused" },
  ],
})

await div(md(`You chose ${choice}`))

```