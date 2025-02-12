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

Also, you can import `kit` and access the APIs like so:

```ts
import kit from "@johnlindquist/kit"

await kit.arg("Enter your name")
```

If you have questions, please reach out on our [Script Kit GitHub Discussions](https://github.com/johnlindquist/kit/discussions)

Happy Scripting! ❤️ - John Lindquist

### Playground

Press `cmd+p` while browsing an API to generate a script where you can experiment with examples contained in that section. Go ahead and try it now to experiment with the example below:

```ts
await arg("Welcome to the playground!")
```

## Prompts

### arg



- Accept text input from the user.
- Optionally provide a list of choices filtered by the text input.
- Optionally provide a list of actions to trigger when the user presses a shortcut.


#### Details

1. The first argument is a string or a prompt configuration object.
2. The second argument is a list of choices, a string to render, or a function that returns choices or a string to render.

#### arg Hello World

```ts
let value = await arg()
```

#### A Basic String Input

```ts
let name = await arg("Enter your name")
```

#### arg with Choices Array

```ts
let name = await arg("Select a name", [
  "John",
  "Mindy",
  "Joy",
])
```

#### arg with Async Choices

```ts
let name = await arg("Select a name", async () => {
    let response = await get("https://swapi.dev/api/people/");
    return response?.data?.results.map((p) => p.name);
})
```

#### arg with Async Choices Object

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

#### arg with Generated Choices

```ts
let char = await arg("Type then pick a char", (input) => { 
    // return an array of strings
    return input.split("")
})
```

#### arg with Shortcuts

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

```ts
// Write write "MY_ENV_VAR" to ~/.kenv/.env
let MY_ENV_VAR = await env("MY_ENV_VAR")
```

You can also prompt the user to set the env var using a prompt by nesting it in an async function:

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


#### editor Hello World

```ts
let content = await editor()
```

#### editor with Initial Content

```ts
let content = await editor("Hello world!")
```

#### Load Remote Text Content into Editor

```ts
let response = await get(`https://raw.githubusercontent.com/johnlindquist/kit/main/API.md`)

let content = await editor(response.data)
```

### div




`div` displays HTML. Pass a string of HTML to `div` to render it. `div` is commonly used in conjunction with `md` to render markdown.

#### Details

1. Just like arg, the first argument is a string or a prompt configuration object.
2. Optional:The second argument is a string of tailwind class to apply to the container, e.g., `bg-white p-4`.


#### div Hello World

```ts
await div(`Hello world!`)
```

#### div with Markdown

```ts
await div(md(`
# Hello world!

### Thanks for coming to my demo
* This is a list
* This is another item
* This is the last item

`))
```

#### div with Tailwind Classes

```ts
await div(`Hello world!`, `bg-white text-black text-4xl p-4`)
```

#### div with Submit Links

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

#### Details

1. Optional: the first argument is a command to run with the terminal

#### term Hello World

```ts
await term()
```

#### term with Command

```ts
await term(`cd ~/.kenv/scripts && ls`)
```

### template



The `template` prompt will present the editor populated by your template. You can then tab through each variable in your template and edit it. 

#### Details

1. The first argument is a string template. Add variables using $1, $2, etc. You can also use 

[//]: # (\${1:default value} to set a default value.&#41;)

#### Template Hello World

```ts
let text = await template(`Hello $1!`)
```

#### Standard Usage

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

#### Details

1. Optional: The first argument is a string to display in the prompt.


#### hotkey Hello World

```ts
let keyInfo = await hotkey()
await editor(JSON.stringify(keyInfo, null, 2))
```

### drop



Use `await drop()` to prompt the user to drop a file or folder.

#### drop Hello World

```ts
// Note: Dropping one or more files returns an array of file information
// Dropping text or an image from the browser returns a string
let fileInfos = await drop()

let filePaths = fileInfos.map(f => f.path).join(",")

await div(md(filePaths))
```



### fields



The `fields` prompt allows you to rapidly create a form with fields. 

#### Details

1. An array of labels or objects with label and field properties.

#### fields Hello World

```ts
let [first, last] = await fields(["First name", "Last name"])
```


#### fields with Field Properties

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

```ts
let folderPath = await selectFolder()
```


### path

The `path` prompt allows you to select a file or folder from the file system. You navigate with tab/shift+tab (or right/left arrows) and enter to select.

#### Details

1. Optional: The first argument is the initial directory to open with. Defaults to the home directory.


#### path Hello World

```ts
let selectedFile = await path()
```

### select

`select` lets you choose from a list of options.

#### Details

1. The first argument is a array or a prompt configuration object.
2. The second argument is a list of choices, a array to render, or a function that returns choices or a string to render.

#### select Basic Array Input

```ts
let multipleChoice = await select(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

#### select Array Object

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

#### select Async Choices Array Object

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

#### select Generated Input Choices

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

#### Details

1. Optional: the first argument is an object to set to the variable `x` to in the console.

#### dev Hello World

```ts
dev()
```

#### dev with Object

```ts
dev({
    name: "John",
    age: 40
})
```


### find

A file search prompt

```ts
let filePath = await find("Search in the Downloads directory", {
  onlyin: home("Downloads"),
})

await revealFile(filePath)
```

### webcam

Prompt for webcam access. Press enter to capture an image buffer:

```ts
let buffer = await webcam()
let imagePath = tmpPath("image.jpg")
await writeFile(imagePath, buffer)
await revealFile(imagePath)
```

## Alerts

### beep

Beep the system speaker:

```ts
await beep()
```

### say

Say something using the built-in text-to-speech:

```ts
await say("Done!")
```

### setStatus

Set the system menu bar icon and message. 
Each status message will be appended to a list. 
Clicking on the menu will display the list of messages. 
The status and messages will be dismissed once the tray closes, so use `log` if you want to persist messages.

```ts
await setStatus({
  message: "Working on it...",
  status: "busy",
})
```

### menu

Set the system menu to a custom message/emoji with a list of scripts to run.

```ts
await menu(`👍`, ["my-script", "another-script"])
```

Reset the menu to the default icon and scripts by passing an empty string

```ts
await menu(``)
```

### notify

Send a system notification

```ts
await notify("Attention!")
```

> Note: osx notifications require permissions for "Terminal Notifier" in the system preferences. Due to the complicated nature of configuring notifications, please use a search engine to find the latest instructions for your osx version.
> In the Script Kit menu bar icon: "Permissions -> Request Notification Permissions" might help.


## Widget

### widget

A `widget` creates a new window using HTML. The HTML can be styled via [Tailwind CSS](https://tailwindcss.com/docs/utility-first) class names.
Templating and interactivity can be added via [petite-vue](https://github.com/vuejs/petite-vue).

### Details

1. The first argument is a string of HTML to render in the window.
2. Optional: the second argument is ["Browser Window Options"](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions)

### widget Hello World

```ts
await widget(`<h1 class="p-4 text-4xl">Hello World!</h1>`)
```

### widget Clock

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

### widget Events

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

```ts

let result = await exec(`ls -la`, {
  cwd: home(), // where to run the command
  shell: "/bin/zsh", // if you're expecting to use specific shell features/configs
  all: true, // pipe both stdout and stderr to "all"
})

inspect(result.all)
```

### Displaying an Info Screen

It's extremely common to show the user what's happening while your command is running. This is often done by using `div` with `onInit` + `sumbit`:

```ts
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

### widget

**Description**
Creates a persistent UI window with HTML content.

**Signature**

```ts
widget(html: string, options?: {
  width?: number,
  height?: number,
  x?: number,
  y?: number,
  transparent?: boolean,
  draggable?: boolean,
  hasShadow?: boolean,
  alwaysOnTop?: boolean,
  ...
}): Promise<Widget>
```

**Usage**

```ts
let clock = await widget(`<h1 class="text-7xl p-5 whitespace-nowrap">{{date}}</h1>`, {
  transparent: true,
  draggable: true,
  hasShadow: false,
  alwaysOnTop: true,
})

setInterval(() => {
  clock.setState({
    date: new Date().toLocaleTimeString()
  })
}, 1000)
```

**Returns**
- A `Widget` instance with methods for updating state, handling events, etc.

**Notes**
- Requires a Pro subscription
- Can be styled with Tailwind CSS
- Interactivity can be added with petite-vue

### menubar

**Description**
Sets a custom menu bar item with scripts.

**Signature**

```ts
menubar(icon: string, scripts: string[]): Promise<void>
```

**Usage**

```ts
await menubar(`👍`, ["my-script", "another-script"])
```

**Returns**
- A promise that resolves when the menu bar is set

**Notes**
- Requires a Pro subscription
- The icon can be an emoji or a base64-encoded image
- Scripts should be in the user's `~/.kenv/scripts` directory

### term

**Description**
Opens a built-in Terminal window.

**Signature**

```ts
term(command?: string, options?: {
  cwd?: string,
  shell?: string,
  ...
}): Promise<void>
```

**Usage**

```ts
await term(`cd ~/.kenv/scripts && ls`)
```

**Returns**
- A promise that resolves when the terminal window is closed

**Notes**
- Requires a Pro subscription
- Can run interactive commands
- Supports custom working directory and shell

### showLogWindow

**Description**
Opens a logs window to display script output.

**Signature**

```ts
showLogWindow(): Promise<void>
```

**Usage**

```ts
await showLogWindow()
```

**Returns**
- A promise that resolves when the logs window is opened

**Notes**
- Requires a Pro subscription
- Displays output from all scripts run in the current session

## Platform APIs

### scatterWindows

**Description**
Evenly spaces out all open windows across the screen in a neat grid.

**Signature**

```ts
async function scatterWindows(): Promise<string>
```

**Usage**

```ts
// Script to auto-arrange windows with a single command
await scatterWindows()
```

**Returns**
- A string containing a status or log message, e.g. "Windows scattered."

**Notes**
- Only tested on macOS.  
- May require accessibility permissions if it's moving windows across multiple monitors.
```

### focusKitWindow

**Description**
Brings the Script Kit window into focus.

**Signature**

```ts
async function focusKitWindow(): Promise<void>
```

**Usage**

```ts
await focusKitWindow()
```

**Returns**
- A promise that resolves when the Script Kit window is focused

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.
```

### attemptScriptFocus

**Description**
Attempts to bring the Script Kit window into focus.

**Signature**

```ts
async function attemptScriptFocus(): Promise<void>
```

**Usage**

```ts
await attemptScriptFocus()
```

**Returns**
- A promise that resolves when the Script Kit window is focused or if it's already in focus

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.
```

### getKitWindows

**Description**
Retrieves the Script Kit window objects.

**Signature**

```ts
async function getKitWindows(): Promise<Electron.BrowserWindow[]>
```

**Usage**

```ts
let windows = await getKitWindows()
```

**Returns**
- An array of Electron BrowserWindow objects representing the Script Kit windows

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.
```

### focusWindow

**Description**
Brings a specific window into focus.

**Signature**

```ts
async function focusWindow(windowId: number): Promise<void>
```

**Usage**

```ts
await focusWindow(12345)
```

**Returns**
- A promise that resolves when the specified window is focused

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.
```

### focusAppWindow

**Description**
Brings a specific application window into focus.

**Signature**

```ts
async function focusAppWindow(appName: string, windowTitle: string): Promise<void>
```

**Usage**

```ts
await focusAppWindow("Google Chrome", "Script Kit - Google Chrome")
```

**Returns**
- A promise that resolves when the specified application window is focused

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.
```

### setWindowPosition

**Description**
Sets the position of a specific window.

**Signature**

```ts
async function setWindowPosition(windowId: number, x: number, y: number): Promise<void>
```

**Usage**

```ts
await setWindowPosition(12345, 100, 200)
```

**Returns**
- A promise that resolves when the window position is set

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.
```

### setWindowPositionByIndex

**Description**
Sets the position of a window based on its index.

**Signature**

```ts
async function setWindowPositionByIndex(index: number, x: number, y: number): Promise<void>
```

**Usage**

```ts
await setWindowPositionByIndex(0, 100, 200)
```

**Returns**
- A promise that resolves when the window position is set

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.
```

### scatterWindows

**Description**
Evenly spaces out all open windows across the screen in a neat grid.

**Signature**

```ts
async function scatterWindows(): Promise<string>
```

**Usage**

```ts
// Script to auto-arrange windows with a single command
await scatterWindows()
```

**Returns**
- A string containing a status or log message, e.g. "Windows scattered."

**Notes**
- Only tested on macOS.  
- May require accessibility permissions if it's moving windows across multiple monitors.
```

### organizeWindows

**Description**
Organizes windows in a specific way.

**Signature**

```ts
async function organizeWindows(options: {
  direction?: "horizontal" | "vertical",
  padding?: number,
  ...
}): Promise<string>
```

**Usage**

```ts
await organizeWindows({
  direction: "horizontal",
  padding: 10
})
```

**Returns**
- A string containing a status or log message, e.g. "Windows organized."

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.

### tileWindow

**Description**
Tiles a specific window.

**Signature**

```ts
async function tileWindow(windowId: number, options: {
  direction?: "horizontal" | "vertical",
  padding?: number,
  ...
}): Promise<void>
```

**Usage**

```ts
await tileWindow(12345, {
  direction: "horizontal",
  padding: 10
})
```

**Returns**
- A promise that resolves when the window is tiled

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.

### scrapeSelector

**Description**
Scrapes a webpage using a CSS selector.

**Signature**

```ts
async function scrapeSelector(url: string, selector: string): Promise<string>
```

**Usage**

```ts
let text = await scrapeSelector("https://example.com", "#main-content")
```

**Returns**
- A string containing the scraped content

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### scrapeAttribute

**Description**
Scrapes a webpage and extracts an attribute value.

**Signature**

```ts
async function scrapeAttribute(url: string, selector: string, attribute: string): Promise<string>
```

**Usage**

```ts
let src = await scrapeAttribute("https://example.com", "img", "src")
```

**Returns**
- A string containing the attribute value

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### getScreenshotFromWebpage

**Description**
Captures a screenshot of a webpage.

**Signature**

```ts
async function getScreenshotFromWebpage(url: string, options?: {
  width?: number,
  height?: number,
  ...
}): Promise<Buffer>
```

**Usage**

```ts
let buffer = await getScreenshotFromWebpage("https://example.com", {
  width: 800,
  height: 600
})
```

**Returns**
- A Buffer containing the screenshot image data

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### getWebpageAsPdf

**Description**
Converts a webpage to a PDF.

**Signature**

```ts
async function getWebpageAsPdf(url: string, options?: {
  width?: number,
  height?: number,
  ...
}): Promise<Buffer>
```

**Usage**

```ts
let buffer = await getWebpageAsPdf("https://example.com", {
  width: 800,
  height: 600
})
```

**Returns**
- A Buffer containing the PDF data

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### appleScript

**Description**
Executes an AppleScript.

**Signature**

```ts
async function appleScript(script: string): Promise<string>
```

**Usage**

```ts
let result = await appleScript(`
tell application "Finder"
  return name of every disk
end tell
`)
```

**Returns**
- A string containing the result of the AppleScript execution

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

### lock

**Description**
Locks the screen.

**Signature**

```ts
async function lock(): Promise<void>
```

**Usage**

```ts
await lock()
```

**Returns**
- A promise that resolves when the screen is locked

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

### logout

**Description**
Logs out the current user.

**Signature**

```ts
async function logout(): Promise<void>
```

**Usage**

```ts
await logout()
```

**Returns**
- A promise that resolves when the user is logged out

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

### shutdown

**Description**
Shuts down the computer.

**Signature**

```ts
async function shutdown(): Promise<void>
```

**Usage**

```ts
await shutdown()
```

**Returns**
- A promise that resolves when the computer is shut down

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

### sleep

**Description**
Puts the computer to sleep.

**Signature**

```ts
async function sleep(): Promise<void>
```

**Usage**

```ts
await sleep()
```

**Returns**
- A promise that resolves when the computer is put to sleep

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

### fileSearch

**Description**
Searches for files on the filesystem.

**Signature**

```ts
async function fileSearch(query: string, options?: {
  onlyin?: string,
  ...
}): Promise<string[]>
```

**Usage**

```ts
let results = await fileSearch("*.md", {
  onlyin: home("Documents")
})
```

**Returns**
- An array of file paths matching the search query

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

### copyPathAsImage

**Description**
Copies a file path as an image to the clipboard.

**Signature**

```ts
async function copyPathAsImage(path: string): Promise<void>
```

**Usage**

```ts
await copyPathAsImage("/path/to/file.txt")
```

**Returns**
- A promise that resolves when the file path is copied as an image

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

### getWindows

**Description**
Retrieves information about open windows.

**Signature**

```ts
async function getWindows(): Promise<WindowInfo[]>
```

**Usage**

```ts
let windows = await getWindows()
```

**Returns**
- An array of WindowInfo objects containing information about open windows

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

### getWindowsBounds

**Description**
Retrieves the bounds of open windows.

**Signature**

```ts
async function getWindowsBounds(): Promise<WindowBounds[]>
```

**Usage**

```ts
let bounds = await getWindowsBounds()
```

**Returns**
- An array of WindowBounds objects containing the bounds of open windows

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

## Package APIs

### trash

**Description**
Moves files or directories to the trash.

**Signature**

```ts
async function trash(paths: string | string[]): Promise<void>
```

**Usage**

```ts
await trash("/path/to/file.txt")
```

**Returns**
- A promise that resolves when the files or directories are moved to the trash

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

### git

**Description**
Git utility functions.

**Signature**

```ts
const git = {
  clone: async (repoUrl: string, destPath: string): Promise<void>,
  pull: async (repoPath: string): Promise<void>,
  push: async (repoPath: string): Promise<void>,
  ...
}
```

**Usage**

```ts
await git.clone("https://github.com/user/repo.git", "/path/to/repo")
```

**Returns**
- Promises that resolve when the git operations are completed

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### degit

**Description**
Clones a GitHub repository using degit.

**Signature**

```ts
async function degit(repoUrl: string, destPath: string): Promise<void>
```

**Usage**

```ts
await degit("https://github.com/user/repo.git", "/path/to/repo")
```

**Returns**
- A promise that resolves when the repository is cloned

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### openApp

**Description**
Opens an application.

**Signature**

```ts
async function openApp(appName: string): Promise<void>
```

**Usage**

```ts
await openApp("Google Chrome")
```

**Returns**
- A promise that resolves when the application is opened

**Notes**
- Only tested on macOS
- May require additional permissions or configurations

## Misc APIs

### createGist

**Description**
Creates a GitHub gist.

**Signature**

```ts
async function createGist(options: {
  description?: string,
  public?: boolean,
  files: {
    [fileName: string]: {
      content: string,
    },
  },
}): Promise<string>
```

**Usage**

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

**Returns**
- A string containing the URL of the created gist

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### npm

**Description**
Installs an npm package.

**Signature**

```ts
async function npm(packageName: string): Promise<void>
```

**Usage**

```ts
await npm("lodash")
```

**Returns**
- A promise that resolves when the package is installed

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### attemptImport

**Description**
Attempts to import a module.

**Signature**

```ts
async function attemptImport(moduleName: string): Promise<any>
```

**Usage**

```ts
let module = await attemptImport("lodash")
```

**Returns**
- The imported module or null if it couldn't be imported

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### silentAttemptImport

**Description**
Attempts to import a module silently.

**Signature**

```ts
async function silentAttemptImport(moduleName: string): Promise<any>
```

**Usage**

```ts
let module = await silentAttemptImport("lodash")
```

**Returns**
- The imported module or null if it couldn't be imported

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### store

**Description**
Stores data in a persistent key-value store.

**Signature**

```ts
const store = {
  get: async (key: string): Promise<any>,
  set: async (key: string, value: any): Promise<void>,
  ...
}
```

**Usage**

```ts
await store.set("myKey", "myValue")
let value = await store.get("myKey")
```

**Returns**
- Promises that resolve when the store operations are completed

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### memoryMap

**Description**
Manages a memory map of objects.

**Signature**

```ts
const memoryMap = {
  get: (key: string) => any,
  set: (key: string, value: any) => void,
  ...
}
```

**Usage**

```ts
memoryMap.set("myKey", { myObject: true })
let value = memoryMap.get("myKey")
```

**Returns**
- The retrieved object or undefined if the key doesn't exist

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### show

**Description**
Shows the main prompt.

**Signature**

```ts
async function show(): Promise<void>
```

**Usage**

```ts
await show()
```

**Returns**
- A promise that resolves when the main prompt is shown

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### hide

**Description**
Hides the main prompt.

**Signature**

```ts
async function hide(): Promise<void>
```

**Usage**

```ts
await hide()
```

**Returns**
- A promise that resolves when the main prompt is hidden

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### setPanel

**Description**
Sets the panel content.

**Signature**

```ts
async function setPanel(content: string): Promise<void>
```

**Usage**

```ts
await setPanel("<h1>Hello, world!</h1>")
```

**Returns**
- A promise that resolves when the panel content is set

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### setPrompt

**Description**
Sets the prompt content.

**Signature**

```ts
async function setPrompt(content: string): Promise<void>
```

**Usage**

```ts
await setPrompt("<h1>Enter your name:</h1>")
```

**Returns**
- A promise that resolves when the prompt content is set

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### setPreview

**Description**
Sets the preview content.

**Signature**

```ts
async function setPreview(content: string): Promise<void>
```

**Usage**

```ts
await setPreview("<h1>Preview</h1>")
```

**Returns**
- A promise that resolves when the preview content is set

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### setIgnoreBlur

**Description**
Sets whether to ignore blur events.

**Signature**

```ts
async function setIgnoreBlur(ignore: boolean): Promise<void>
```

**Usage**

```ts
await setIgnoreBlur(true)
```

**Returns**
- A promise that resolves when the ignore blur setting is set

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### removeClipboardItem

**Description**
Removes an item from the clipboard.

**Signature**

```ts
async function removeClipboardItem(item: ClipboardItem): Promise<void>
```

**Usage**

```ts
await removeClipboardItem(item)
```

**Returns**
- A promise that resolves when the item is removed from the clipboard

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### clearClipboardHistory

**Description**
Clears the clipboard history.

**Signature**

```ts
async function clearClipboardHistory(): Promise<void>
```

**Usage**

```ts
await clearClipboardHistory()
```

**Returns**
- A promise that resolves when the clipboard history is cleared

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### setScoredChoices

**Description**
Sets scored choices for a prompt.

**Signature**

```ts
async function setScoredChoices(choices: ScoredChoice[]): Promise<void>
```

**Usage**

```ts
await setScoredChoices([
  { name: "John", score: 0.9 },
  { name: "Mindy", score: 0.8 },
  { name: "Joy", score: 0.7 }
])
```

**Returns**
- A promise that resolves when the scored choices are set

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### setSelectedChoices

**Description**
Sets selected choices for a prompt.

**Signature**

```ts
async function setSelectedChoices(choices: string[]): Promise<void>
```

**Usage**

```ts
await setSelectedChoices(["John", "Mindy"])
```

**Returns**
- A promise that resolves when the selected choices are set

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### groupChoices

**Description**
Groups choices for a prompt.

**Signature**

```ts
async function groupChoices(groups: ChoiceGroup[]): Promise<void>
```

**Usage**

```ts
await groupChoices([
  { name: "Group 1", choices: ["John", "Mindy"] },
  { name: "Group 2", choices: ["Joy"] }
])
```

**Returns**
- A promise that resolves when the choices are grouped

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### preload

**Description**
Preloads data for a prompt.

**Signature**

```ts
async function preload(data: any): Promise<void>
```

**Usage**

```ts
await preload({
  name: "John",
  age: 40
})
```

**Returns**
- A promise that resolves when the data is preloaded

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### select

**Description**
Prompts the user to select one or more options.

**Signature**

```ts
async function select(
  prompt: string | PromptConfig,
  choices: string[] | ChoiceObject[] | AsyncChoicesFunction
): Promise<string | string[]>
```

**Usage**

```ts
let multipleChoice = await select(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

**Returns**
- A string or an array of strings representing the selected options

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### grid

**Description**
Prompts the user to select one or more options in a grid layout.

**Signature**

```ts
async function grid(
  prompt: string | PromptConfig,
  choices: string[] | ChoiceObject[] | AsyncChoicesFunction
): Promise<string | string[]>
```

**Usage**

```ts
let multipleChoice = await grid(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

**Returns**
- A string or an array of strings representing the selected options

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### mini

**Description**
Prompts the user for input in a compact format.

**Signature**

```ts
async function mini(
  prompt: string | PromptConfig,
  choices: string[] | ChoiceObject[] | AsyncChoicesFunction
): Promise<string | string[]>
```

**Usage**

```ts
let name = await mini("Enter your name")
```

**Returns**
- A string or an array of strings representing the user's input

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### micro

**Description**
Prompts the user for input in a tiny, adorable format.

**Signature**

```ts
async function micro(
  prompt: string | PromptConfig,
  choices: string[] | ChoiceObject[] | AsyncChoicesFunction
): Promise<string | string[]>
```

**Usage**

```ts
let name = await micro("Enter your name")
```

**Returns**
- A string or an array of strings representing the user's input

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### getMediaDevices

**Description**
Retrieves available media devices.

**Signature**

```ts
async function getMediaDevices(): Promise<MediaDeviceInfo[]>
```

**Usage**

```ts
let devices = await getMediaDevices()
```

**Returns**
- An array of MediaDeviceInfo objects representing the available media devices

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### getTypedText

**Description**
Retrieves typed text from the user.

**Signature**

```ts
async function getTypedText(options?: {
  placeholder?: string,
  ...
}): Promise<string>
```

**Usage**

```ts
let text = await getTypedText({
  placeholder: "Enter your name"
})
```

**Returns**
- A string containing the typed text

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### speech

**Description**
Speaks a given text using text-to-speech.

**Signature**

```ts
async function speech(text: string): Promise<void>
```

**Usage**

```ts
await speech("Hello, world!")
```

**Returns**
- A promise that resolves when the text is spoken

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### toast

**Description**
Displays a small pop-up notification.

**Signature**

```ts
async function toast(text: string, options?: {
  autoClose?: number | false,
  pauseOnHover?: boolean,
  ...
}): Promise<void>
```

**Usage**

```ts
await toast("Hello from Script Kit!", {
  autoClose: 3000, // close after 3 seconds
  pauseOnFocusLoss: false
})
```

**Returns**
- A promise that resolves when the notification is displayed

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### find

**Description**
Searches for files on the filesystem.

**Signature**

```ts
async function find(query: string, options?: {
  onlyin?: string,
  ...
}): Promise<string[]>
```

**Usage**

```ts
let results = await find("*.md", {
  onlyin: home("Documents")
})
```

**Returns**
- An array of file paths matching the search query

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

### webcam

**Description**
Prompts the user for webcam access and captures an image.

**Signature**

```ts
async function webcam(): Promise<Buffer>
```

**Usage**

```ts
let buffer = await webcam()
```

**Returns**
- A Buffer containing the captured image data

**Notes**
- Requires a Pro subscription
- May require additional permissions or configurations

**Notes**
- Only available on macOS
- Useful for scripting automation tasks

**Usage**

```ts
await setWindowPosition("My App", 100, 100)
```

**Returns**
- A promise that resolves when the window position is set

**Notes**
- Only tested on macOS.  
- May require accessibility permissions.

```ts
setInterval(() => {
  clock.setState({
    date: new Date().toLocaleTimeString()
  })
}, 1000)
```


