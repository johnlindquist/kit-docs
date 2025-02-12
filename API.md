---
# Slash as slug makes this the home page
slug: /
title: "API"
sidebar_position: 1
---

# API

## Intro

### Welcome to Script Kit! 👋

Script Kit provides an opinionated set of global APIs meant to streamline the process of writing scripts. Many of them (such as prompts) are meant to interact with the app, but there are also many common APIs for working with files, etc, that are simply built-in node or third-party libraries exposed as globals.

_You do not need to use any of these APIs._ You are free to write your scripts and add whatever npm packages you like.

If you have questions, please reach out on our [Script Kit GitHub Discussions](https://github.com/johnlindquist/kit/discussions)

Happy Scripting! ❤️ - John Lindquist

### Play with Examples in the App

With Script Kit open, type `docs` and hit enter.

With any example open, press `cmd+p` to generate a script where you can experiment with examples contained in that section.


## Prompts

### arg

- Accept text input from the user.
- Optionally provide a list of choices filtered by the text input.
- Optionally provide a list of actions to trigger when the user presses a shortcut.

1. The first argument is a string or a prompt configuration object.
2. The second argument is a list of choices, a string to render, or a function that returns choices or a string to render.

#### arg example

```ts
let value = await arg()
```

#### arg basic string input

```ts
let name = await arg("Enter your name")
```

#### arg with choices array

```ts
let name = await arg("Select a name", [
  "John",
  "Mindy",
  "Joy",
])
```

#### arg with async choices

```ts
let name = await arg("Select a name", async () => {
    let response = await get("https://swapi.dev/api/people/");
    return response?.data?.results.map((p) => p.name);
})
```

#### arg with async choices object

```ts
let person = await arg("Select a person", async () => {
    let response = await get("https://swapi.dev/api/people/");
    // return an array of objects with "name", "value", and "description" properties
    return response?.data?.results.map((person) => { 
        return {
            name: person.name,
            description: person.url,
            value: person
        }
    });
})
```

#### arg with generated choices

```ts
let char = await arg("Type then pick a char", (input) => { 
    // return an array of strings
    return input.split("")
})
```

#### arg with shortcuts

```ts
let url = "https://swapi.dev/api/people"
let name = await arg({
    placeholder: "Select a name",
    shortcuts: [
        {
            name: "Explore API",
            key: "cmd+e",
            onPress: async () => { 
                open(url)
            },
            bar: "right"
        }
    ]
}, async () => { 
    let response = await get(url);
    return response?.data?.results.map((p) => p.name);
})
```

### micro

Same API as `arg`, but with a tiny, adorable UI.

### env

Load an env var if it exists, prompt to set the env var if not:

#### env example

```ts
// Write write "MY_ENV_VAR" to ~/.kenv/.env
let MY_ENV_VAR = await env("MY_ENV_VAR")
```

You can also prompt the user to set the env var using a prompt by nesting it in an async function:

#### env example with prompt

```ts
// Prompt the user to select from a path
let OUTPUT_DIR = await env("OUTPUT_DIR", async () => {
  return await path({
    hint: `Select the output directory`,
  })
})
```

### editor



The `editor` function opens a text editor with the given text. The editor is a full-featured "Monaco" editor with syntax highlighting, find/replace, and more. The editor is a great way to edit or update text to write a file. The default language is markdown.


#### editor example

```ts
let content = await editor()
```

#### editor with initial content

```ts
let content = await editor("Hello world!")
```

#### editor load remote text content

```ts
let response = await get(`https://raw.githubusercontent.com/johnlindquist/kit/main/API.md`)

let content = await editor(response.data)
```

### div

`div` displays HTML. Pass a string of HTML to `div` to render it. `div` is commonly used in conjunction with `md` to render markdown.


1. Just like arg, the first argument is a string or a prompt configuration object.
2. Optional:The second argument is a string of tailwind class to apply to the container, e.g., `bg-white p-4`.


#### div example

```ts
await div(`Hello world!`)
```

#### div with markdown

```ts
await div(md(`
# example!

### Thanks for coming to my demo
* This is a list
* This is another item
* This is the last item

`))
```

#### div with tailwind classes

```ts
await div(`Hello world!`, `bg-white text-black text-4xl p-4`)
```

#### div with submit links

```ts
let name = await div(md(`# Pick a Name
* [John](submit:John)
* [Mindy](submit:Mindy)
* [Joy](submit:Joy)
`))

await div(md(`# You selected ${name}`))
```

### term


The `term` function opens a terminal window. The terminal is a full-featured terminal, but only intended for running commands and CLI tools that require user input. `term` is not suitable for long-running processes (try `exec` instead).

1. Optional: the first argument is a command to run with the terminal

#### term example

```ts
await term()
```

#### term with command

```ts
await term(`cd ~/.kenv/scripts && ls`)
```

### template

The `template` prompt will present the editor populated by your template. You can then tab through each variable in your template and edit it. 

1. The first argument is a string template. Add variables using $1, $2, etc. You can also use 

[//]: # (\${1:default value} to set a default value.&#41;)

#### template example

```ts
let text = await template(`Hello $1!`)
```

#### template standard usage

```ts
let text = await template(`
Dear \${1:name},

Please meet me at \${2:address}

    Sincerely, John`)
```

### hotkey

The `hotkey` prompt allows you to press modifier keys, then submits once you've pressed a non-monodifier key. For example, press `command` then `e` to submit key info about the `command` and `e` keys:

```json
{
  "key": "e",
  "command": true,
  "shift": false,
  "option": false,
  "control": false,
  "fn": false,
  "hyper": false,
  "os": false,
  "super": false,
  "win": false,
  "shortcut": "command e",
  "keyCode": "KeyE"
}
```

This can be useful when you want to use a palette of commands and trigger each of them by switching on a hotkey.

1. Optional: The first argument is a string to display in the prompt.


#### hotkey example

```ts
let keyInfo = await hotkey()
await editor(JSON.stringify(keyInfo, null, 2))
```

### drop

Use `await drop()` to prompt the user to drop a file or folder.

#### drop example

```ts
// Note: Dropping one or more files returns an array of file information
// Dropping text or an image from the browser returns a string
let fileInfos = await drop()

let filePaths = fileInfos.map(f => f.path).join(",")

await div(md(filePaths))
```



### fields

The `fields` prompt allows you to rapidly create a form with fields. 

1. An array of labels or objects with label and field properties.

#### fields example

```ts
let [first, last] = await fields(["First name", "Last name"])
```


#### fields with field properties

```ts
let [name, age] = await fields([
    {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "John"
    },
    {
        name: "age",
        label: "Age",
        type: "number",
        placeholder: "40"
    }
])
```


### form

Use an HTML form which returns an Object based on the names of the form fields.

#### form example

```ts
let result = await form(`
<div class="p-4">
    <input type="text" name="textInput" placeholder="Text Input" />
    <input type="password" name="passwordInput" placeholder="Password" />
    <input type="email" name="emailInput" placeholder="Email" />
    <input type="number" name="numberInput" placeholder="Number" />
    <input type="date" name="dateInput" placeholder="Date" />
    <input type="time" name="timeInput" placeholder="Time" />
    <input type="datetime-local" name="dateTimeInput" placeholder="Date and Time" />
    <input type="month" name="monthInput" placeholder="Month" />
    <input type="week" name="weekInput" placeholder="Week" />
    <input type="url" name="urlInput" placeholder="URL" />
    <input type="search" name="searchInput" placeholder="Search" />
    <input type="tel" name="telInput" placeholder="Telephone" />
    <input type="color" name="colorInput" placeholder="Color" />
    <textarea name="textareaInput" placeholder="Textarea"></textarea>
</div>
`)

inspect(result)
```

### chat

A chat prompt. Use `chat.addMessage()` to insert messages into the chat.

> Note: Manually invoke `submit` inside of a shortcut/action/etc to end the chat.


#### chat example

```ts
// Name: Testing Chat

import "@johnlindquist/kit"

await chat({
  onInit: async () => {
    chat.addMessage({
      // Note: text and position are implemented, there are other properties that are a WIP
      text: "You like Script Kit",
      position: "left",
    })

    await wait(1000)

    chat.addMessage({
      text: "Yeah! It's awesome!",
      position: "right",
    })

    await wait(1000)

    chat.addMessage({
      text: "I know, right?!?",
      position: "left",
    })

    await wait(1000)

    chat.addMessage({
      text: `<img src="https://media0.giphy.com/media/yeE6B8nEKcTMWWvBzD/giphy.gif?cid=0b9ef2f49arnbs4aajuycirjsclpbtimvib6a76g7afizgr5&ep=v1_gifs_search&rid=giphy.gif" width="200px" />`,
      position: "right",
    })
  },
})

```ts

Also see the included "chatgpt" example for a much more advanced scenario.

### selectFile



Prompt the user to select a file using the Finder dialog:

```ts
let filePath = await selectFile()
```

### selectFolder

Prompt the user to select a folder using the Finder dialog:

#### selectFolder example

```ts
let folderPath = await selectFolder()
```

### path

The `path` prompt allows you to select a file or folder from the file system. You navigate with tab/shift+tab (or right/left arrows) and enter to select.

1. Optional: The first argument is the initial directory to open with. Defaults to the home directory.


#### path example

```ts
let selectedFile = await path()
```

### select

`select` lets you choose from a list of options.

1. The first argument is a array or a prompt configuration object.
2. The second argument is a list of choices, a array to render, or a function that returns choices or a string to render.

#### select basic array input

```ts
let multipleChoice = await select(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

#### select array object

```ts
const people = [
  {
    name: "John",
    description: "Full-stack Dev",
    value: "John",
  },
  {
    name: "Nghia",
    description: "Full-stackoverflow dev",
    value: "Nghia",
  },
  {
    name: "Mindy",
    description: "Business Analyst",
    value: "Mindy",
  },
  {
    name: "Joy",
    description: "Leader",
    value: "Joy",
  },
]
let multipleChoice = await select(
  "Select one or more developer",
  people
)
```

#### select async choices array object

```ts
let name = await select(
  "GET: NAME (please wait)",
  async () => {
    let response = await get(
      "https://swapi.dev/api/people/"
    )
    return response?.data?.results.map(person => {
      return {
        name: person.name,
        description: `height: ${person.height}, mass: ${person.mass}`,
        value: person,
        preview: () => JSON.stringify(person),
      }
    })
  }
)
```

#### select generated input choices

```ts
let word = await select("Type then pick a words", input => {
  return input.trim().split(new RegExp("[.,;/-_\n]", "g"))
})
```

### inspect



`inspect` takes an object and writes out a text file you can use to read/copy/paste the values from:

```ts
let response = await get("https://swapi.dev/api/people/1/")
await inspect(response.data)
```

> Note: It will automatically convert objects to JSON to display them in the file


### dev

`dev` Opens a standalone instance of Chrome Dev Tools so you can play with JavaScript in the console. Passing in an object will set the variable `x` to your object in the console making it easy to inspect.

1. Optional: the first argument is an object to set to the variable `x` to in the console.

#### dev example

```ts
dev()
```

#### dev with object

```ts
dev({
    name: "John",
    age: 40
})
```

### find

A file search prompt

#### find example

```ts
let filePath = await find("Search in the Downloads directory", {
  onlyin: home("Downloads"),
})

await revealFile(filePath)
```

### webcam

Prompt for webcam access. Press enter to capture an image buffer:

#### webcam example

```ts
let buffer = await webcam()
let imagePath = tmpPath("image.jpg")
await writeFile(imagePath, buffer)
await revealFile(imagePath)
```

## Alerts

### beep

Beep the system speaker:

#### beep example

```ts
await beep()
```

### say

Say something using the built-in text-to-speech:

#### say example

```ts
await say("Done!")
```

### setStatus

Set the system menu bar icon and message. 
Each status message will be appended to a list. 
Clicking on the menu will display the list of messages. 
The status and messages will be dismissed once the tray closes, so use `log` if you want to persist messages.

#### setStatus example

```ts
await setStatus({
  message: "Working on it...",
  status: "busy",
})
```

### menu

Set the system menu to a custom message/emoji with a list of scripts to run.

#### menu example

```ts
await menu(`👍`, ["my-script", "another-script"])
```

Reset the menu to the default icon and scripts by passing an empty string

```ts
await menu(``)
```

### notify

Send a system notification

#### notify example

```ts
await notify("Attention!")
```

> Note: osx notifications require permissions for "Terminal Notifier" in the system preferences. Due to the complicated nature of configuring notifications, please use a search engine to find the latest instructions for your osx version.
> In the Script Kit menu bar icon: "Permissions -> Request Notification Permissions" might help.


## Widget

### widget

A `widget` creates a new window using HTML. The HTML can be styled via [Tailwind CSS](https://tailwindcss.com/docs/utility-first) class names.
Templating and interactivity can be added via [petite-vue](https://github.com/vuejs/petite-vue).

1. The first argument is a string of HTML to render in the window.
2. Optional: the second argument is ["Browser Window Options"](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions)

#### widget example

```ts
await widget(`<h1 class="p-4 text-4xl">Hello World!</h1>`)
```

#### widget Clock

```ts
let clock = await widget(`<h1 class="text-7xl p-5 whitespace-nowrap">{{date}}</h1>`, {
    transparent: true,
    draggable: true,
    hasShadow: false,
    alwaysOnTop: true,
})

setInterval(()=> {
    clock.setState({
        date: new Date().toLocaleTimeString()
    })
}, 1000)
```

#### widget Events

```ts

let text = ""
let count = 0

let w = await widget(`
<div class="p-5">
    <h1>Widget Events</h1>
    <input autofocus type="text" class="border dark:bg-black"/>
    <button id="myButton" class="border px-2 py-1">+</button>
    <span>{{count}}</span>    
</div>
`)

w.onClick((event) => {
    if (event.targetId === "myButton") {
        w.setState({count: count++})
    }
})

w.onClose(async () => {
    await widget(`
<div class="p-5">
    <h1>You closed the other widget</h1>
    <p>${text}</p>
</div>
`)
})

w.onInput((event) => {
    text = event.value
})

w.onMoved(({ x, y}) => {
    // e.g., save position
})

w.onResized(({ width, height }) => {
    // e.g., save size
})
```

## Commands

### exec

`exec` uses allows you to run shell commands within your script:
> Note: Execa is an alias for `execaCommand` from the `execa` npm package with "shell" and "all" true by default.

#### exec example

```ts

let result = await exec(`ls -la`, {
  cwd: home(), // where to run the command
  shell: "/bin/zsh", // if you're expecting to use specific shell features/configs
  all: true, // pipe both stdout and stderr to "all"
})

inspect(result.all)
```


#### exec with prompt info

```ts
// It's extremely common to show the user what's happening while your command is running. This is often done by using `div` with `onInit` + `sumbit`:
let result = await div({
  html: md(`# Loading your home directory`),
  onInit: async () => {
    let result = await exec(`sleep 2 && ls -la`, {
      cwd: home(), // where to run the command
      shell: "/bin/zsh", // use if you're expecting the command to load in your .zshrc
      all: true, // pipe both stdout and stderr to "all"
    })

    submit(result.all)
  },
})
```

## Pro APIs

### menubar

Sets a custom menu bar item with scripts.

#### menubar example

```ts
await menubar(`👍`, ["my-script", "another-script"])
```

### term

Opens a built-in Terminal window.

#### term example

```ts
await term(`cd ~/.kenv/scripts && ls`)
```

- Can run interactive commands
- Supports custom working directory and shell

### showLogWindow

Opens a logs window to display script output.

#### showLogWindow example

```ts
await showLogWindow()
```

- Displays output from all scripts run in the current session

## Platform APIs

### scatterWindows

Evenly spaces out all open windows across the screen in a neat grid.

#### scatterWindows example

```ts
// Script to auto-arrange windows with a single command
await scatterWindows()
```

- Only tested on macOS.  
- May require accessibility permissions if it's moving windows across multiple monitors.

### focusKitWindow

Brings the Script Kit window into focus.

#### focusKitWindow example

```ts
await focusKitWindow()
```

- Only tested on macOS.  
- May require accessibility permissions.


### attemptScriptFocus

Attempts to bring the Script Kit window into focus.

#### attemptScriptFocus example

```ts
await attemptScriptFocus()
```

- Only tested on macOS.  
- May require accessibility permissions.


### getKitWindows

Retrieves the Script Kit window objects.

#### getKitWindows example

```ts
let windows = await getKitWindows()
```

- Only tested on macOS.  
- May require accessibility permissions.

### focusWindow

Brings a specific window into focus.

#### focusWindow example

```ts
await focusWindow(12345)
```

- Only tested on macOS.  
- May require accessibility permissions.


### focusAppWindow

Brings a specific application window into focus.

#### focusAppWindow example

```ts
await focusAppWindow("Google Chrome", "Script Kit - Google Chrome")
```

- Only tested on macOS.  
- May require accessibility permissions.

### setWindowPosition

Sets the position of a specific window.

#### setWindowPosition example

```ts
await setWindowPosition(12345, 100, 200)
```

- Only tested on macOS.  
- May require accessibility permissions.

### setWindowPositionByIndex

Sets the position of a window based on its index.

#### setWindowPositionByIndex example

```ts
await setWindowPositionByIndex(0, 100, 200)
```

- Only tested on macOS.  
- May require accessibility permissions.


### scatterWindows

Evenly spaces out all open windows across the screen in a neat grid.

#### scatterWindows example
```ts
await scatterWindows()
```

- Only tested on macOS.  
- May require accessibility permissions if it's moving windows across multiple monitors.

### organizeWindows

Organizes windows in a specific way.

#### organizeWindows example

```ts
await organizeWindows({
  direction?: "horizontal" | "vertical",
  padding?: number,
  ...
}): Promise<string>
```

- Only tested on macOS.  
- May require accessibility permissions.

### tileWindow

Tiles a specific window.

#### tileWindow example

```ts
await tileWindow(12345, {
  direction: "horizontal",
  padding: 10
})
```

- Only tested on macOS.  
- May require accessibility permissions.

### scrapeSelector

Scrapes a webpage using a CSS selector.

#### scrapeSelector example

```ts
let text = await scrapeSelector("https://example.com", "#main-content")
```

- Requires a Pro subscription
- May require additional permissions or configurations

### scrapeAttribute

Scrapes a webpage and extracts an attribute value.

#### scrapeAttribute example

```ts
let src = await scrapeAttribute("https://example.com", "img", "src")
```

- Requires a Pro subscription
- May require additional permissions or configurations

### getScreenshotFromWebpage

Captures a screenshot of a webpage.

#### getScreenshotFromWebpage example

```ts
let buffer = await getScreenshotFromWebpage("https://example.com", {
  width?: number,
  height?: number,
  ...
}): Promise<Buffer>
```

- Requires a Pro subscription
- May require additional permissions or configurations

### getWebpageAsPdf

Converts a webpage to a PDF.

#### getWebpageAsPdf example

```ts
let buffer = await getWebpageAsPdf("https://example.com", {
  width: 800,
  height: 600
})
```

- Requires a Pro subscription
- May require additional permissions or configurations

### applescript

Executes an applescript string

#### applescript example

```ts
let result = await applescript(`
tell application "Finder"
  return name of every disk
end tell
`)
```

- Only tested on macOS
- May require additional permissions or configurations

### lock

Locks the screen.

#### lock example

```ts
await lock()
```

- Only tested on macOS
- May require additional permissions or configurations

### logout

Logs out the current user.

#### logout example

```ts
await logout()
```

- Only tested on macOS
- May require additional permissions or configurations  

### shutdown

Shuts down the computer.

#### shutdown example

```ts
await shutdown()
```

- Only tested on macOS
- May require additional permissions or configurations

### shutdown

Shuts down the computer.

#### shutdown example

```ts
await shutdown()
```

- Only tested on macOS
- May require additional permissions or configurations

### sleep

Puts the computer to sleep.

#### sleep example

```ts
await sleep()
```

  - Only tested on macOS
- May require additional permissions or configurations

### sleep

Puts the computer to sleep.

#### sleep example

```ts
await sleep()
```

- Only tested on macOS
- May require additional permissions or configurations

### sleep

Puts the computer to sleep.

#### sleep example

```ts
await sleep()
```

- Only tested on macOS
- May require additional permissions or configurations

### fileSearch

Searches for files on the filesystem.

#### fileSearch example

```ts
async function fileSearch(query: string, options?: {
  onlyin?: string,
  ...
}): Promise<string[]>
```

- Only tested on macOS
- May require additional permissions or configurations

### copyPathAsImage

Copies a file path as an image to the clipboard.

#### copyPathAsImage example

```ts
let results = await fileSearch("*.md", {
  onlyin: home("Documents")
})
```

- Only tested on macOS
- May require additional permissions or configurations

### copyPathAsImage

Copies a file path as an image to the clipboard.

#### copyPathAsImage example

```ts
await copyPathAsImage("/path/to/file.txt")
```

- Only tested on macOS
- May require additional permissions or configurations

### copyPathAsImage

Copies a file path as an image to the clipboard.

#### copyPathAsImage example

```ts
await copyPathAsImage("/path/to/file.txt")
```

- Only tested on macOS
- May require additional permissions or configurations

### getWindows

Retrieves information about open windows.

#### getWindows example

```ts
let windows = await getWindows()
```

- Only tested on macOS
- May require additional permissions or configurations

### getWindowsBounds

Retrieves the bounds of open windows.

#### getWindowsBounds example

```ts
let bounds = await getWindowsBounds()
```

- Only tested on macOS
- May require additional permissions or configurations

## Package APIs

### trash

Moves files or directories to the trash.

#### trash example

```ts
await trash("/path/to/file.txt")
```

- Only tested on macOS
- May require additional permissions or configurations

### git

Git utility functions.

#### git example

```ts
await git.clone("https://github.com/user/repo.git", "/path/to/repo")
```

- Only tested on macOS
- May require additional permissions or configurations

### degit

Clones a GitHub repository using degit.

#### degit example


```ts
await degit("https://github.com/user/repo.git", "/path/to/repo")
```

- Only tested on macOS
- May require additional permissions or configurations

### openApp

Opens an application.

#### openApp example

```ts
await openApp("Google Chrome")
```

- Only tested on macOS
- May require additional permissions or configurations

### createGist

Creates a GitHub gist.

#### createGist example

```ts
let gistUrl = await createGist({
  description: "My awesome gist",
  public: true,
  files: {
    "hello.txt": {
      content: "Hello, world!"
    }
  }
})
```

- Only tested on macOS
- May require additional permissions or configurations

### npm

> Deprecated: Use standard `import` instead.

Installs an npm package.

#### npm example

```ts
await npm("lodash")
```

- Only tested on macOS
- May require additional permissions or configurations

### attemptImport

Attempts to import a module.

#### attemptImport example

```ts
let module = await attemptImport("lodash")
```

### silentAttemptImport

Attempts to import a module silently.

#### silentAttemptImport example

```ts
let module = await silentAttemptImport("lodash")
```

- Only tested on macOS
- May require additional permissions or configurations

### store

Stores data in a persistent key-value store.

#### store example

```ts
await store.set("myKey", "myValue")
let value = await store.get("myKey")
```

- Only tested on macOS
- May require additional permissions or configurations


### db

An extremely simple database that persists to a file.


### memoryMap

Manages a memory map of objects.

#### memoryMap example

```ts
memoryMap.set("myKey", { myObject: true })
let value = memoryMap.get("myKey")
```

### show

Shows the main prompt.

#### show example

```ts
await show()
```

### hide

Hides the main prompt.

#### hide example

```ts
await hide()
```

### setPanel

Sets the panel content.

#### setPanel example

```ts
await setPanel("<h1>Hello, world!</h1>")
```

### setPrompt

Sets the prompt content.

#### setPrompt example

```ts
await setPrompt("<h1>Enter your name:</h1>")
```

### setPreview

Sets the preview content.

#### setPreview example

```ts
await setPreview("<h1>Preview</h1>")
```

### setIgnoreBlur

Sets whether to ignore blur events.

#### setIgnoreBlur example

```ts
await setIgnoreBlur(true)
```

### removeClipboardItem

Removes an item from the clipboard.

#### removeClipboardItem example

```ts
await removeClipboardItem(item)
```

### clearClipboardHistory

Clears the clipboard history.

#### clearClipboardHistory example

```ts
await clearClipboardHistory()
```

### setScoredChoices

Sets scored choices for a prompt.

#### setScoredChoices example

```ts
await setScoredChoices([
  { name: "John", score: 0.9 },
  { name: "Mindy", score: 0.8 },
  { name: "Joy", score: 0.7 }
])
```

### setSelectedChoices

Sets selected choices for a prompt.

#### setSelectedChoices example

```ts
await setSelectedChoices(["John", "Mindy"])
```

### groupChoices

Groups choices for a prompt.

#### groupChoices example

```ts
await groupChoices([
  { name: "Group 1", choices: ["John", "Mindy"] },
  { name: "Group 2", choices: ["Joy"] }
])
```

### preload

Preloads data for a prompt.

#### preload example

```ts
await preload({
  name: "John",
  age: 40
})
```

### select

Prompts the user to select one or more options.

#### select example

```ts
let multipleChoice = await select(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

### grid

Prompts the user to select one or more options in a grid layout.

#### grid example

```ts
let multipleChoice = await grid(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

### mini

Prompts the user for input in a compact format.

#### mini example
```ts
let name = await mini("Enter your name")
```

### micro

Prompts the user for input in a tiny, adorable format.

#### micro example

```ts
let name = await micro("Enter your name")
```

### getMediaDevices

Retrieves available media devices.

```ts
let devices = await getMediaDevices()
```

### getTypedText

Retrieves typed text from the user.

```ts
let text = await getTypedText()
```

### toast

Displays a small pop-up notification inside the Script Kit window.

#### toast example
```ts
await toast("Hello from Script Kit!", {
  autoClose: 3000, // close after 3 seconds
  pauseOnFocusLoss: false
})
```

### Closing Thoughts

#### Alternate Importing

Also, you can import `kit` and access the APIs like so:

```ts
import kit from "@johnlindquist/kit"

await kit.arg("Enter your name")
```