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

```js
import kit from "@johnlindquist/kit"

await kit.arg("Enter your name")
```

If you have questions, please reach out on our [Script Kit GitHub Discussions](https://github.com/johnlindquist/kit/discussions)

Happy Scripting! ❤️ - John Lindquist

### Playground

Press `cmd+p` while browsing an API to generate a script where you can experiment with examples contained in that section. Go ahead and try it now to experiment with the example below:

```js
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

```js
let value = await arg()
```

#### A Basic String Input

```js
let name = await arg("Enter your name")
```

#### arg with Choices Array

```js
let name = await arg("Select a name", [
  "John",
  "Mindy",
  "Joy",
])
```

#### arg with Async Choices

```js
let name = await arg("Select a name", async () => {
    let response = await get("https://swapi.dev/api/people/");
    return response?.data?.results.map((p) => p.name);
})
```

#### arg with Async Choices Object

```js
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

```js
let char = await arg("Type then pick a char", (input) => { 
    // return an array of strings
    return input.split("")
})
```

#### arg with Shortcuts

```js
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

```js
// Write write "MY_ENV_VAR" to ~/.kenv/.env
let MY_ENV_VAR = await env("MY_ENV_VAR")
```

You can also prompt the user to set the env var using a prompt by nesting it in an async function:

```js
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

```js
let content = await editor()
```

#### editor with Initial Content

```js
let content = await editor("Hello world!")
```

#### Load Remote Text Content into Editor

```js
let response = await get(`https://raw.githubusercontent.com/johnlindquist/kit/main/API.md`)

let content = await editor(response.data)
```

### div




`div` displays HTML. Pass a string of HTML to `div` to render it. `div` is commonly used in conjunction with `md` to render markdown.

#### Details

1. Just like arg, the first argument is a string or a prompt configuration object.
2. Optional:The second argument is a string of tailwind class to apply to the container, e.g., `bg-white p-4`.


#### div Hello World

```js
await div(`Hello world!`)
```

#### div with Markdown

```js
await div(md(`
# Hello world!

### Thanks for coming to my demo
* This is a list
* This is another item
* This is the last item

`))
```

#### div with Tailwind Classes

```js
await div(`Hello world!`, `bg-white text-black text-4xl p-4`)
```

#### div with Submit Links

```js
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

```js
await term()
```

#### term with Command

```js
await term(`cd ~/.kenv/scripts && ls`)
```

### template



The `template` prompt will present the editor populated by your template. You can then tab through each variable in your template and edit it. 

#### Details

1. The first argument is a string template. Add variables using $1, $2, etc. You can also use 

[//]: # (\${1:default value} to set a default value.&#41;)

#### Template Hello World

```js
let text = await template(`Hello $1!`)
```

#### Standard Usage

```js
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

```js
let keyInfo = await hotkey()
await editor(JSON.stringify(keyInfo, null, 2))
```

### drop



Use `await drop()` to prompt the user to drop a file or folder.

#### drop Hello World

```js
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

```js
let [first, last] = await fields(["First name", "Last name"])
```


#### fields with Field Properties

```js
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

```js
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

```js
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

```

Also see the included "chatgpt" example for a much more advanced scenario.

### selectFile



Prompt the user to select a file using the Finder dialog:

```js
let filePath = await selectFile()
```

### selectFolder



Prompt the user to select a folder using the Finder dialog:

```js
let folderPath = await selectFolder()
```


### path

The `path` prompt allows you to select a file or folder from the file system. You navigate with tab/shift+tab (or right/left arrows) and enter to select.

#### Details

1. Optional: The first argument is the initial directory to open with. Defaults to the home directory.


#### path Hello World

```js
let selectedFile = await path()
```

### select

`select` lets you choose from a list of options.

#### Details

1. The first argument is a array or a prompt configuration object.
2. The second argument is a list of choices, a array to render, or a function that returns choices or a string to render.

#### select Basic Array Input

```js
let multipleChoice = await select(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

#### select Array Object

```js
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

```js
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

```js
let word = await select("Type then pick a words", input => {
  return input.trim().split(new RegExp("[.,;/-_\n]", "g"))
})
```

### inspect



`inspect` takes an object and writes out a text file you can use to read/copy/paste the values from:

```js
let response = await get("https://swapi.dev/api/people/1/")
await inspect(response.data)
```

> Note: It will automatically convert objects to JSON to display them in the file


### dev



`dev` Opens a standalone instance of Chrome Dev Tools so you can play with JavaScript in the console. Passing in an object will set the variable `x` to your object in the console making it easy to inspect.

#### Details

1. Optional: the first argument is an object to set to the variable `x` to in the console.

#### dev Hello World

```js
dev()
```

#### dev with Object

```js
dev({
    name: "John",
    age: 40
})
```


### find

A file search prompt

```js
let filePath = await find("Search in the Downloads directory", {
  onlyin: home("Downloads"),
})

await revealFile(filePath)
```

### webcam

Prompt for webcam access. Press enter to capture an image buffer:

```js
let buffer = await webcam()
let imagePath = tmpPath("image.jpg")
await writeFile(imagePath, buffer)
await revealFile(imagePath)
```

## Alerts

### beep

Beep the system speaker:

```js
await beep()
```

### say

Say something using the built-in text-to-speech:

```js
await say("Done!")
```

### setStatus

Set the system menu bar icon and message. 
Each status message will be appended to a list. 
Clicking on the menu will display the list of messages. 
The status and messages will be dismissed once the tray closes, so use `log` if you want to persist messages.

```js
await setStatus({
  message: "Working on it...",
  status: "busy",
})
```

### menu

Set the system menu to a custom message/emoji with a list of scripts to run.

```js
await menu(`👍`, ["my-script", "another-script"])
```

Reset the menu to the default icon and scripts by passing an empty string

```js
await menu(``)
```

### notify

Send a system notification

```js
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

```js
await widget(`<h1 class="p-4 text-4xl">Hello World!</h1>`)
```

### widget Clock

```js
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

```js

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

```js

let result = await exec(`ls -la`, {
  cwd: home(), // where to run the command
  shell: "/bin/zsh", // if you're expecting to use specific shell features/configs
  all: true, // pipe both stdout and stderr to "all"
})

inspect(result.all)
```

### Displaying an Info Screen

It's extremely common to show the user what's happening while your command is running. This is often done by using `div` with `onInit` + `sumbit`:

```js
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
```js
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
```js
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
```js
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
```js
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
```

async function scatterWindows(): Promise<string>
```

**Usage**  
```

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
```

async function focusKitWindow(): Promise<void>
```

**Usage**  
```

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
```

async function attemptScriptFocus(): Promise<void>
```

**Usage**  
```

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
```

async function getKitWindows(): Promise<Electron.BrowserWindow[]>
```

**Usage**  
```

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
```

async function focusWindow(windowId: number): Promise<void>
```

**Usage**  
```

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
```

async function focusAppWindow(appName: string, windowTitle: string): Promise<void>
```

**Usage**  
```

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
```

async function setWindowPosition(windowId: number, x: number, y: number): Promise<void>
```

**Usage**  
```

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
```

async function setWindowPositionByIndex(index: number, x: number, y: number): Promise<void>
```

**Usage**  
```

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
```

async function scatterWindows(): Promise<string>
```

**Usage**  
```

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
```

async function organizeWindows(options: {
  direction?: "horizontal" | "vertical",
  padding?: number,
  ...
}): Promise<string>
```

**Usage**  
```

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
```

### tileWindow

**Description**  
Tiles a specific window.

**Signature**  
```

async function tileWindow(windowId: number, options: {
  direction?: "horizontal" | "vertical",
  padding?: number,
  ...
}): Promise<void>
```

**Usage**  
```

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
```

### scrapeSelector

**Description**  
Scrapes a webpage using a CSS selector.

**Signature**  
```

async function scrapeSelector(url: string, selector: string): Promise<string>
```

**Usage**  
```

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
```

async function scrapeAttribute(url: string, selector: string, attribute: string): Promise<string>
```

**Usage**  
```

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
```

async function getScreenshotFromWebpage(url: string, options?: {
  width?: number,
  height?: number,
  ...
}): Promise<Buffer>
```

**Usage**  
```

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
```

async function getWebpageAsPdf(url: string, options?: {
  width?: number,
  height?: number,
  ...
}): Promise<Buffer>
```

**Usage**  
```

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
```

async function appleScript(script: string): Promise<string>
```

**Usage**  
```

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
```

async function lock(): Promise<void>
```

**Usage**  
```

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
```

async function logout(): Promise<void>
```

**Usage**  
```

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
```

async function shutdown(): Promise<void>
```

**Usage**  
```

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
```

async function sleep(): Promise<void>
```

**Usage**  
```

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
```

async function fileSearch(query: string, options?: {
  onlyin?: string,
  ...
}): Promise<string[]>
```

**Usage**  
```

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
```

async function copyPathAsImage(path: string): Promise<void>
```

**Usage**  
```

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
```

async function getWindows(): Promise<WindowInfo[]>
```

**Usage**  
```

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
```

async function getWindowsBounds(): Promise<WindowBounds[]>
```

**Usage**  
```

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
```

async function trash(paths: string | string[]): Promise<void>
```

**Usage**  
```

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
```

const git = {
  clone: async (repoUrl: string, destPath: string): Promise<void>,
  pull: async (repoPath: string): Promise<void>,
  push: async (repoPath: string): Promise<void>,
  ...
}
```

**Usage**  
```

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
```

async function degit(repoUrl: string, destPath: string): Promise<void>
```

**Usage**  
```

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
```

async function openApp(appName: string): Promise<void>
```

**Usage**  
```

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
```

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
```

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
```

async function npm(packageName: string): Promise<void>
```

**Usage**  
```

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
```

async function attemptImport(moduleName: string): Promise<any>
```

**Usage**  
```

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
```

async function silentAttemptImport(moduleName: string): Promise<any>
```

**Usage**  
```

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
```

const store = {
  get: async (key: string): Promise<any>,
  set: async (key: string, value: any): Promise<void>,
  ...
}
```

**Usage**  
```

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
```

const memoryMap = {
  get: (key: string) => any,
  set: (key: string, value: any) => void,
  ...
}
```

**Usage**  
```

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
```

async function show(): Promise<void>
```

**Usage**  
```

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
```

async function hide(): Promise<void>
```

**Usage**  
```

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
```

async function setPanel(content: string): Promise<void>
```

**Usage**  
```

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
```

async function setPrompt(content: string): Promise<void>
```

**Usage**  
```

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
```

async function setPreview(content: string): Promise<void>
```

**Usage**  
```

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
```

async function setIgnoreBlur(ignore: boolean): Promise<void>
```

**Usage**  
```

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
```

async function removeClipboardItem(item: ClipboardItem): Promise<void>
```

**Usage**  
```

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
```

async function clearClipboardHistory(): Promise<void>
```

**Usage**  
```

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
```

async function setScoredChoices(choices: ScoredChoice[]): Promise<void>
```

**Usage**  
```

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
```

async function setSelectedChoices(choices: string[]): Promise<void>
```

**Usage**  
```

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
```

async function groupChoices(groups: ChoiceGroup[]): Promise<void>
```

**Usage**  
```

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
```

async function preload(data: any): Promise<void>
```

**Usage**  
```

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
```

async function select(
  prompt: string | PromptConfig,
  choices: string[] | ChoiceObject[] | AsyncChoicesFunction
): Promise<string | string[]>
```

**Usage**  
```

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
```

async function grid(
  prompt: string | PromptConfig,
  choices: string[] | ChoiceObject[] | AsyncChoicesFunction
): Promise<string | string[]>
```

**Usage**  
```

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
```

async function mini(
  prompt: string | PromptConfig,
  choices: string[] | ChoiceObject[] | AsyncChoicesFunction
): Promise<string | string[]>
```

**Usage**  
```

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
```

async function micro(
  prompt: string | PromptConfig,
  choices: string[] | ChoiceObject[] | AsyncChoicesFunction
): Promise<string | string[]>
```

**Usage**  
```

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
```

async function getMediaDevices(): Promise<MediaDeviceInfo[]>
```

**Usage**  
```

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
```

async function getTypedText(options?: {
  placeholder?: string,
  ...
}): Promise<string>
```

**Usage**  
```

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
```

async function speech(text: string): Promise<void>
```

**Usage**  
```

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
```

async function toast(text: string, options?: {
  autoClose?: number | false,
  pauseOnHover?: boolean,
  ...
}): Promise<void>
```

**Usage**  
```

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
```

async function find(query: string, options?: {
  onlyin?: string,
  ...
}): Promise<string[]>
```

**Usage**  
```

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
```

async function webcam(): Promise<Buffer>
```

**Usage**  
```

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
```

await setWindowPosition("My App", 100, 100)
```

**Returns**  
- A promise that resolves when the window position is set

**Notes**  
- Only tested on macOS.  
- May require accessibility permissions.

setInterval(() => {
  clock.setState({
    date: new Date().toLocaleTimeString()
  })
}, 1000)

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

```js
import kit from "@johnlindquist/kit"

await kit.arg("Enter your name")
```

If you have questions, please reach out on our [Script Kit GitHub Discussions](https://github.com/johnlindquist/kit/discussions)

Happy Scripting! ❤️ - John Lindquist

### Playground

Press `cmd+p` while browsing an API to generate a script where you can experiment with examples contained in that section. Go ahead and try it now to experiment with the example below:

```js
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

```js
let value = await arg()
```

#### A Basic String Input

```js
let name = await arg("Enter your name")
```

#### arg with Choices Array

```js
let name = await arg("Select a name", [
  "John",
  "Mindy",
  "Joy",
])
```

#### arg with Async Choices

```js
let name = await arg("Select a name", async () => {
    let response = await get("https://swapi.dev/api/people/");
    return response?.data?.results.map((p) => p.name);
})
```

#### arg with Async Choices Object

```js
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

```js
let char = await arg("Type then pick a char", (input) => { 
    // return an array of strings
    return input.split("")
})
```

#### arg with Shortcuts

```js
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

```js
// Write write "MY_ENV_VAR" to ~/.kenv/.env
let MY_ENV_VAR = await env("MY_ENV_VAR")
```

You can also prompt the user to set the env var using a prompt by nesting it in an async function:

```js
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

```js
let content = await editor()
```

#### editor with Initial Content

```js
let content = await editor("Hello world!")
```

#### Load Remote Text Content into Editor

```js
let response = await get(`https://raw.githubusercontent.com/johnlindquist/kit/main/API.md`)

let content = await editor(response.data)
```

### div




`div` displays HTML. Pass a string of HTML to `div` to render it. `div` is commonly used in conjunction with `md` to render markdown.

#### Details

1. Just like arg, the first argument is a string or a prompt configuration object.
2. Optional:The second argument is a string of tailwind class to apply to the container, e.g., `bg-white p-4`.


#### div Hello World

```js
await div(`Hello world!`)
```

#### div with Markdown

```js
await div(md(`
# Hello world!

### Thanks for coming to my demo
* This is a list
* This is another item
* This is the last item

`))
```

#### div with Tailwind Classes

```js
await div(`Hello world!`, `bg-white text-black text-4xl p-4`)
```

#### div with Submit Links

```js
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

```js
await term()
```

#### term with Command

```js
await term(`cd ~/.kenv/scripts && ls`)
```

### template



The `template` prompt will present the editor populated by your template. You can then tab through each variable in your template and edit it. 

#### Details

1. The first argument is a string template. Add variables using $1, $2, etc. You can also use 

[//]: # (\${1:default value} to set a default value.&#41;)

#### Template Hello World

```js
let text = await template(`Hello $1!`)
```

#### Standard Usage

```js
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

```js
let keyInfo = await hotkey()
await editor(JSON.stringify(keyInfo, null, 2))
```

### drop



Use `await drop()` to prompt the user to drop a file or folder.

#### drop Hello World

```js
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

```js
let [first, last] = await fields(["First name", "Last name"])
```


#### fields with Field Properties

```js
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

```js
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

```js
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

```

Also see the included "chatgpt" example for a much more advanced scenario.

### selectFile



Prompt the user to select a file using the Finder dialog:

```js
let filePath = await selectFile()
```

### selectFolder



Prompt the user to select a folder using the Finder dialog:

```js
let folderPath = await selectFolder()
```


### path

The `path` prompt allows you to select a file or folder from the file system. You navigate with tab/shift+tab (or right/left arrows) and enter to select.

#### Details

1. Optional: The first argument is the initial directory to open with. Defaults to the home directory.


#### path Hello World

```js
let selectedFile = await path()
```

### select

`select` lets you choose from a list of options.

#### Details

1. The first argument is a array or a prompt configuration object.
2. The second argument is a list of choices, a array to render, or a function that returns choices or a string to render.

#### select Basic Array Input

```js
let multipleChoice = await select(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

#### select Array Object

```js
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

```js
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

```js
let word = await select("Type then pick a words", input => {
  return input.trim().split(new RegExp("[.,;/-_\n]", "g"))
})
```

### inspect



`inspect` takes an object and writes out a text file you can use to read/copy/paste the values from:

```js
let response = await get("https://swapi.dev/api/people/1/")
await inspect(response.data)
```

> Note: It will automatically convert objects to JSON to display them in the file


### dev



`dev` Opens a standalone instance of Chrome Dev Tools so you can play with JavaScript in the console. Passing in an object will set the variable `x` to your object in the console making it easy to inspect.

#### Details

1. Optional: the first argument is an object to set to the variable `x` to in the console.

#### dev Hello World

```js
dev()
```

#### dev with Object

```js
dev({
    name: "John",
    age: 40
})
```


### find

A file search prompt

```js
let filePath = await find("Search in the Downloads directory", {
  onlyin: home("Downloads"),
})

await revealFile(filePath)
```

### webcam

Prompt for webcam access. Press enter to capture an image buffer:

```js
let buffer = await webcam()
let imagePath = tmpPath("image.jpg")
await writeFile(imagePath, buffer)
await revealFile(imagePath)
```

## Alerts

### beep

Beep the system speaker:

```js
await beep()
```

### say

Say something using the built-in text-to-speech:

```js
await say("Done!")
```

### setStatus

Set the system menu bar icon and message. 
Each status message will be appended to a list. 
Clicking on the menu will display the list of messages. 
The status and messages will be dismissed once the tray closes, so use `log` if you want to persist messages.

```js
await setStatus({
  message: "Working on it...",
  status: "busy",
})
```

### menu

Set the system menu to a custom message/emoji with a list of scripts to run.

```js
await menu(`👍`, ["my-script", "another-script"])
```

Reset the menu to the default icon and scripts by passing an empty string

```js
await menu(``)
```

### notify

Send a system notification

```js
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

```js
await widget(`<h1 class="p-4 text-4xl">Hello World!</h1>`)
```

### widget Clock

```js
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

```js

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

```js

let result = await exec(`ls -la`, {
  cwd: home(), // where to run the command
  shell: "/bin/zsh", // if you're expecting to use specific shell features/configs
  all: true, // pipe both stdout and stderr to "all"
})

inspect(result.all)
```

### Displaying an Info Screen

It's extremely common to show the user what's happening while your command is running. This is often done by using `div` with `onInit` + `sumbit`:

```js
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
```

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
```

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
```

menubar(icon: string, scripts: string[]): Promise<void>
```

**Usage**  
```

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
```

term(command?: string, options?: {
  cwd?: string,
  shell?: string,
  ...
}): Promise<void>
```

**Usage**  
```

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
```

showLogWindow(): Promise<void>
```

**Usage**  
```

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
```

async function scatterWindows(): Promise<string>
```

**Usage**  
```

// Script to auto-arrange windows with a single command
await scatterWindows()
```

**Returns**  
- A string containing a status or log message, e.g. "Windows scattered."

**Notes**  
- Only tested on macOS.  
- May require accessibility permissions if it's moving windows across multiple monitors.
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display a dialog
let result = await appleScript(`
  display dialog "Hello from AppleScript!"
`)

// Control system volume
await appleScript(`set volume 5`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- Only available on macOS
- Can interact with any application that supports AppleScript
- Useful for system automation tasks

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### focusKitWindow

**Description**  
Brings the Script Kit window into focus.

**Signature**  
```

focusKitWindow(): Promise<void>
```

**Usage**  
```

await focusKitWindow()
```

**Returns**  
- A promise that resolves when the Script Kit window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### attemptScriptFocus

**Description**  
Attempts to bring a specific script window into focus.

**Signature**  
```

attemptScriptFocus(scriptName: string): Promise<void>
```

**Usage**  
```

await attemptScriptFocus("my-script")
```

**Returns**  
- A promise that resolves when the script window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### getKitWindows

**Description**  
Retrieves information about all Script Kit windows.

**Signature**  
```

getKitWindows(): Promise<WindowInfo[]>
```

**Usage**  
```

let windows = await getKitWindows()
```

**Returns**  
- An array of `WindowInfo` objects, each containing information about a Script Kit window

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### focusWindow

**Description**  
Brings a specific window into focus based on its title or ID.

**Signature**  
```

focusWindow(titleOrId: string): Promise<void>
```

**Usage**  
```

await focusWindow("My App")
```

**Returns**  
- A promise that resolves when the window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### focusAppWindow

**Description**  
Brings a specific application window into focus based on its bundle ID.

**Signature**  
```

focusAppWindow(bundleId: string): Promise<void>
```

**Usage**  
```

await focusAppWindow("com.apple.Safari")
```

**Returns**  
- A promise that resolves when the application window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setWindowPosition

**Description**  
Sets the position of a specific window.

**Signature**  
```

setWindowPosition(titleOrId: string, x: number, y: number): Promise<void>
```

**Usage**  
```

await setWindowPosition("My App", 100, 100)
```

**Returns**  
- A promise that resolves when the window position is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setWindowPositionByIndex

**Description**  
Sets the position of a window based on its index in the list of windows.

**Signature**  
```

setWindowPositionByIndex(index: number, x: number, y: number): Promise<void>
```

**Usage**  
```

await setWindowPositionByIndex(0, 100, 100)
```

**Returns**  
- A promise that resolves when the window position is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### scatterWindows

**Description**  
Evenly spaces out all open windows across the screen in a neat grid.

**Signature**  
```

scatterWindows(): Promise<void>
```

**Usage**  
```

await scatterWindows()
```

**Returns**  
- A promise that resolves when the windows are scattered

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### organizeWindows

**Description**  
Organizes windows into a grid based on their current positions.

**Signature**  
```

organizeWindows(): Promise<void>
```

**Usage**  
```

await organizeWindows()
```

**Returns**  
- A promise that resolves when the windows are organized

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### tileWindow

**Description**  
Tiles a specific window to occupy half of the screen.

**Signature**  
```

tileWindow(titleOrId: string, direction: "left" | "right" | "top" | "bottom"): Promise<void>
```

**Usage**  
```

await tileWindow("My App", "left")
```

**Returns**  
- A promise that resolves when the window is tiled

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### lock

**Description**  
Locks the screen.

**Signature**  
```

lock(): Promise<void>
```

**Usage**  
```

await lock()
```

**Returns**  
- A promise that resolves when the screen is locked

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### logout

**Description**  
Logs out the current user.

**Signature**  
```

logout(): Promise<void>
```

**Usage**  
```

await logout()
```

**Returns**  
- A promise that resolves when the user is logged out

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```

shutdown(): Promise<void>
```

**Usage**  
```

await shutdown()
```

**Returns**  
- A promise that resolves when the computer is shut down

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```

sleep(): Promise<void>
```

**Usage**  
```

await sleep()
```

**Returns**  
- A promise that resolves when the computer is put to sleep

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### fileSearch

**Description**  
Searches for files based on a query.

**Signature**  
```

fileSearch(query: string, options?: {
  onlyin?: string,
  ...
}): Promise<string[]>
```

**Usage**  
```

let results = await fileSearch("*.txt", { onlyin: home("Documents") })
```

**Returns**  
- An array of file paths that match the search query

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### copyPathAsImage

**Description**  
Copies a file path as an image to the clipboard.

**Signature**  
```

copyPathAsImage(filePath: string): Promise<void>
```

**Usage**  
```

await copyPathAsImage("/path/to/file.txt")
```

**Returns**  
- A promise that resolves when the file path is copied as an image

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### getWindows

**Description**  
Retrieves information about all open windows.

**Signature**  
```

getWindows(): Promise<WindowInfo[]>
```

**Usage**  
```

let windows = await getWindows()
```

**Returns**  
- An array of `WindowInfo` objects, each containing information about an open window

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### getWindowsBounds

**Description**  
Retrieves the bounds of all open windows.

**Signature**  
```

getWindowsBounds(): Promise<WindowBounds[]>
```

**Usage**  
```

let bounds = await getWindowsBounds()
```

**Returns**  
- An array of `WindowBounds` objects, each containing the bounds of an open window

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

## Misc Tools

### trash

**Description**  
Moves files or directories to the trash.

**Signature**  
```

trash(paths: string | string[]): Promise<void>
```

**Usage**  
```

await trash("/path/to/file.txt")
await trash(["/path/to/file1.txt", "/path/to/file2.txt"])
```

**Returns**  
- A promise that resolves when the files or directories are moved to the trash

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### git

**Description**  
Performs Git operations such as clone, pull, push, etc.

**Signature**  
```

git(command: string, options?: {
  cwd?: string,
  ...
}): Promise<string>
```

**Usage**  
```

await git("clone", { cwd: "/path/to/repo", args: ["https://github.com/user/repo.git"] })
```

**Returns**  
- A promise that resolves with the output of the Git command

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### degit

**Description**  
Clones a Git repository using degit.

**Signature**  
```

degit(repo: string, destination: string, options?: {
  force?: boolean,
  ...
}): Promise<void>
```

**Usage**  
```

await degit("user/repo", "/path/to/destination")
```

**Returns**  
- A promise that resolves when the repository is cloned

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### openApp

**Description**  
Opens an application using the default system handler.

**Signature**  
```

openApp(appPath: string): Promise<void>
```

**Usage**  
```

await openApp("/Applications/Safari.app")
```

**Returns**  
- A promise that resolves when the application is opened

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### createGist

**Description**  
Creates a new GitHub Gist.

**Signature**  
```

createGist(options: {
  description?: string,
  public?: boolean,
  files: { [fileName: string]: string },
}): Promise<string>
```

**Usage**  
```

let gistUrl = await createGist({
  description: "My Gist",
  public: true,
  files: {
    "hello.txt": "Hello, world!"
  }
})
```

**Returns**  
- A promise that resolves with the URL of the created Gist

**Notes**  
- Requires a GitHub personal access token
- Useful for scripting automation tasks

### npm

**Description**  
Installs or uninstalls an npm package.

**Signature**  
```

npm(command: "install" | "uninstall", packageName: string, options?: {
  global?: boolean,
  ...
}): Promise<void>
```

**Usage**  
```

await npm("install", "lodash")
await npm("uninstall", "moment", { global: true })
```

**Returns**  
- A promise that resolves when the npm package is installed or uninstalled

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### attemptImport

**Description**  
Attempts to import a module and returns its exports.

**Signature**  
```

attemptImport(modulePath: string): Promise<any>
```

**Usage**  
```

let lodash = await attemptImport("lodash")
```

**Returns**  
- A promise that resolves with the exports of the imported module

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### silentAttemptImport

**Description**  
Attempts to import a module silently and returns its exports.

**Signature**  
```

silentAttemptImport(modulePath: string): Promise<any>
```

**Usage**  
```

let lodash = await silentAttemptImport("lodash")
```

**Returns**  
- A promise that resolves with the exports of the imported module

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### store

**Description**  
Stores data across script executions.

**Signature**  
```

store(key: string, value: any): Promise<void>
```

**Usage**  
```

await store("myKey", { foo: "bar" })
```

**Returns**  
- A promise that resolves when the data is stored

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### memoryMap

**Description**  
Retrieves the memory map of the current process.

**Signature**  
```

memoryMap(): Promise<MemoryMapEntry[]>
```

**Usage**  
```

let map = await memoryMap()
```

**Returns**  
- A promise that resolves with an array of `MemoryMapEntry` objects

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

## Clipboard Helpers

### removeClipboardItem

**Description**  
Removes a specific item from the clipboard.

**Signature**  
```

removeClipboardItem(item: ClipboardItem): Promise<void>
```

**Usage**  
```

let item = await getClipboardItem()
await removeClipboardItem(item)
```

**Returns**  
- A promise that resolves when the item is removed from the clipboard

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### clearClipboardHistory

**Description**  
Clears the clipboard history.

**Signature**  
```

clearClipboardHistory(): Promise<void>
```

**Usage**  
```

await clearClipboardHistory()
```

**Returns**  
- A promise that resolves when the clipboard history is cleared

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

## Misc Prompt Tools

### show

**Description**  
Shows the main prompt.

**Signature**  
```

show(): Promise<void>
```

**Usage**  
```

await show()
```

**Returns**  
- A promise that resolves when the main prompt is shown

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### hide

**Description**  
Hides the main prompt.

**Signature**  
```

hide(): Promise<void>
```

**Usage**  
```

await hide()
```

**Returns**  
- A promise that resolves when the main prompt is hidden

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setPanel

**Description**  
Sets the content of a specific panel.

**Signature**  
```

setPanel(panel: "left" | "right" | "bottom", content: string): Promise<void>
```

**Usage**  
```

await setPanel("left", "<h1>Hello, world!</h1>")
```

**Returns**  
- A promise that resolves when the panel content is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setPrompt

**Description**  
Sets the content of the main prompt.

**Signature**  
```

setPrompt(content: string): Promise<void>
```

**Usage**  
```

await setPrompt("<h1>Hello, world!</h1>")
```

**Returns**  
- A promise that resolves when the main prompt content is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setPreview

**Description**  
Sets the content of the preview panel.

**Signature**  
```

setPreview(content: string): Promise<void>
```

**Usage**  
```

await setPreview("<h1>Hello, world!</h1>")
```

**Returns**  
- A promise that resolves when the preview panel content is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setIgnoreBlur

**Description**  
Sets whether to ignore blur events.

**Signature**  
```

setIgnoreBlur(ignore: boolean): Promise<void>
```

**Usage**  
```

await setIgnoreBlur(true)
```

**Returns**  
- A promise that resolves when the ignore blur setting is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

## Pro APIs

### widget

**Description**  
Creates a persistent UI window with HTML content.

**Signature**  
```

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
```

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
```

menubar(icon: string, scripts: string[]): Promise<void>
```

**Usage**  
```

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
```

term(command?: string, options?: {
  cwd?: string,
  shell?: string,
  ...
}): Promise<void>
```

**Usage**  
```

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
```

showLogWindow(): Promise<void>
```

**Usage**  
```

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
```

async function scatterWindows(): Promise<string>
```

**Usage**  
```

// Script to auto-arrange windows with a single command
await scatterWindows()
```

**Returns**  
- A string containing a status or log message, e.g. "Windows scattered."

**Notes**  
- Only tested on macOS.  
- May require accessibility permissions if it's moving windows across multiple monitors.
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display a dialog
let result = await appleScript(`
  display dialog "Hello from AppleScript!"
`)

// Control system volume
await appleScript(`set volume 5`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- Only available on macOS
- Can interact with any application that supports AppleScript
- Useful for system automation tasks

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### focusKitWindow

**Description**  
Brings the Script Kit window into focus.

**Signature**  
```

focusKitWindow(): Promise<void>
```

**Usage**  
```

await focusKitWindow()
```

**Returns**  
- A promise that resolves when the Script Kit window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### attemptScriptFocus

**Description**  
Attempts to bring a specific script window into focus.

**Signature**  
```

attemptScriptFocus(scriptName: string): Promise<void>
```

**Usage**  
```

await attemptScriptFocus("my-script")
```

**Returns**  
- A promise that resolves when the script window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### getKitWindows

**Description**  
Retrieves information about all Script Kit windows.

**Signature**  
```

getKitWindows(): Promise<WindowInfo[]>
```

**Usage**  
```

let windows = await getKitWindows()
```

**Returns**  
- An array of `WindowInfo` objects, each containing information about a Script Kit window

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### focusWindow

**Description**  
Brings a specific window into focus based on its title or ID.

**Signature**  
```

focusWindow(titleOrId: string): Promise<void>
```

**Usage**  
```

await focusWindow("My App")
```

**Returns**  
- A promise that resolves when the window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### focusAppWindow

**Description**  
Brings a specific application window into focus based on its bundle ID.

**Signature**  
```

focusAppWindow(bundleId: string): Promise<void>
```

**Usage**  
```

await focusAppWindow("com.apple.Safari")
```

**Returns**  
- A promise that resolves when the application window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setWindowPosition

**Description**  
Sets the position of a specific window.

**Signature**  
```

setWindowPosition(titleOrId: string, x: number, y: number): Promise<void>
```

**Usage**  
```

await setWindowPosition("My App", 100, 100)
```

**Returns**  
- A promise that resolves when the window position is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setWindowPositionByIndex

**Description**  
Sets the position of a window based on its index in the list of windows.

**Signature**  
```

setWindowPositionByIndex(index: number, x: number, y: number): Promise<void>
```

**Usage**  
```

await setWindowPositionByIndex(0, 100, 100)
```

**Returns**  
- A promise that resolves when the window position is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### scatterWindows

**Description**  
Evenly spaces out all open windows across the screen in a neat grid.

**Signature**  
```

scatterWindows(): Promise<void>
```

**Usage**  
```

await scatterWindows()
```

**Returns**  
- A promise that resolves when the windows are scattered

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### organizeWindows

**Description**  
Organizes windows into a grid based on their current positions.

**Signature**  
```

organizeWindows(): Promise<void>
```

**Usage**  
```

await organizeWindows()
```

**Returns**  
- A promise that resolves when the windows are organized

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### tileWindow

**Description**  
Tiles a specific window to occupy half of the screen.

**Signature**  
```

tileWindow(titleOrId: string, direction: "left" | "right" | "top" | "bottom"): Promise<void>
```

**Usage**  
```

await tileWindow("My App", "left")
```

**Returns**  
- A promise that resolves when the window is tiled

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### lock

**Description**  
Locks the screen.

**Signature**  
```

lock(): Promise<void>
```

**Usage**  
```

await lock()
```

**Returns**  
- A promise that resolves when the screen is locked

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### logout

**Description**  
Logs out the current user.

**Signature**  
```

logout(): Promise<void>
```

**Usage**  
```

await logout()
```

**Returns**  
- A promise that resolves when the user is logged out

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```

shutdown(): Promise<void>
```

**Usage**  
```

await shutdown()
```

**Returns**  
- A promise that resolves when the computer is shut down

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```

sleep(): Promise<void>
```

**Usage**  
```

await sleep()
```

**Returns**  
- A promise that resolves when the computer is put to sleep

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### fileSearch

**Description**  
Searches for files based on a query.

**Signature**  
```

fileSearch(query: string, options?: {
  onlyin?: string,
  ...
}): Promise<string[]>
```

**Usage**  
```

let results = await fileSearch("*.txt", { onlyin: home("Documents") })
```

**Returns**  
- An array of file paths that match the search query

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### copyPathAsImage

**Description**  
Copies a file path as an image to the clipboard.

**Signature**  
```

copyPathAsImage(filePath: string): Promise<void>
```

**Usage**  
```

await copyPathAsImage("/path/to/file.txt")
```

**Returns**  
- A promise that resolves when the file path is copied as an image

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### getWindows

**Description**  
Retrieves information about all open windows.

**Signature**  
```

getWindows(): Promise<WindowInfo[]>
```

**Usage**  
```

let windows = await getWindows()
```

**Returns**  
- An array of `WindowInfo` objects, each containing information about an open window

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### getWindowsBounds

**Description**  
Retrieves the bounds of all open windows.

**Signature**  
```

getWindowsBounds(): Promise<WindowBounds[]>
```

**Usage**  
```

let bounds = await getWindowsBounds()
```

**Returns**  
- An array of `WindowBounds` objects, each containing the bounds of an open window

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

## Misc Tools

### trash

**Description**  
Moves files or directories to the trash.

**Signature**  
```

trash(paths: string | string[]): Promise<void>
```

**Usage**  
```

await trash("/path/to/file.txt")
await trash(["/path/to/file1.txt", "/path/to/file2.txt"])
```

**Returns**  
- A promise that resolves when the files or directories are moved to the trash

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### git

**Description**  
Performs Git operations such as clone, pull, push, etc.

**Signature**  
```

git(command: string, options?: {
  cwd?: string,
  ...
}): Promise<string>
```

**Usage**  
```

await git("clone", { cwd: "/path/to/repo", args: ["https://github.com/user/repo.git"] })
```

**Returns**  
- A promise that resolves with the output of the Git command

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### degit

**Description**  
Clones a Git repository using degit.

**Signature**  
```

degit(repo: string, destination: string, options?: {
  force?: boolean,
  ...
}): Promise<void>
```

**Usage**  
```

await degit("user/repo", "/path/to/destination")
```

**Returns**  
- A promise that resolves when the repository is cloned

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### openApp

**Description**  
Opens an application using the default system handler.

**Signature**  
```

openApp(appPath: string): Promise<void>
```

**Usage**  
```

await openApp("/Applications/Safari.app")
```

**Returns**  
- A promise that resolves when the application is opened

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### createGist

**Description**  
Creates a new GitHub Gist.

**Signature**  
```

createGist(options: {
  description?: string,
  public?: boolean,
  files: { [fileName: string]: string },
}): Promise<string>
```

**Usage**  
```

let gistUrl = await createGist({
  description: "My Gist",
  public: true,
  files: {
    "hello.txt": "Hello, world!"
  }
})
```

**Returns**  
- A promise that resolves with the URL of the created Gist

**Notes**  
- Requires a GitHub personal access token
- Useful for scripting automation tasks

### npm

**Description**  
Installs or uninstalls an npm package.

**Signature**  
```

npm(command: "install" | "uninstall", packageName: string, options?: {
  global?: boolean,
  ...
}): Promise<void>
```

**Usage**  
```

await npm("install", "lodash")
await npm("uninstall", "moment", { global: true })
```

**Returns**  
- A promise that resolves when the npm package is installed or uninstalled

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### attemptImport

**Description**  
Attempts to import a module and returns its exports.

**Signature**  
```

attemptImport(modulePath: string): Promise<any>
```

**Usage**  
```

let lodash = await attemptImport("lodash")
```

**Returns**  
- A promise that resolves with the exports of the imported module

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### silentAttemptImport

**Description**  
Attempts to import a module silently and returns its exports.

**Signature**  
```

silentAttemptImport(modulePath: string): Promise<any>
```

**Usage**  
```

let lodash = await silentAttemptImport("lodash")
```

**Returns**  
- A promise that resolves with the exports of the imported module

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### store

**Description**  
Stores data across script executions.

**Signature**  
```

store(key: string, value: any): Promise<void>
```

**Usage**  
```

await store("myKey", { foo: "bar" })
```

**Returns**  
- A promise that resolves when the data is stored

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### memoryMap

**Description**  
Retrieves the memory map of the current process.

**Signature**  
```

memoryMap(): Promise<MemoryMapEntry[]>
```

**Usage**  
```

let map = await memoryMap()
```

**Returns**  
- A promise that resolves with an array of `MemoryMapEntry` objects

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

## Clipboard Helpers

### removeClipboardItem

**Description**  
Removes a specific item from the clipboard.

**Signature**  
```

removeClipboardItem(item: ClipboardItem): Promise<void>
```

**Usage**  
```

let item = await getClipboardItem()
await removeClipboardItem(item)
```

**Returns**  
- A promise that resolves when the item is removed from the clipboard

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### clearClipboardHistory

**Description**  
Clears the clipboard history.

**Signature**  
```

clearClipboardHistory(): Promise<void>
```

**Usage**  
```

await clearClipboardHistory()
```

**Returns**  
- A promise that resolves when the clipboard history is cleared

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

## Misc Prompt Tools

### show

**Description**  
Shows the main prompt.

**Signature**  
```

show(): Promise<void>
```

**Usage**  
```

await show()
```

**Returns**  
- A promise that resolves when the main prompt is shown

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### hide

**Description**  
Hides the main prompt.

**Signature**  
```

hide(): Promise<void>
```

**Usage**  
```

await hide()
```

**Returns**  
- A promise that resolves when the main prompt is hidden

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setPanel

**Description**  
Sets the content of a specific panel.

**Signature**  
```

setPanel(panel: "left" | "right" | "bottom", content: string): Promise<void>
```

**Usage**  
```

await setPanel("left", "<h1>Hello, world!</h1>")
```

**Returns**  
- A promise that resolves when the panel content is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setPrompt

**Description**  
Sets the content of the main prompt.

**Signature**  
```

setPrompt(content: string): Promise<void>
```

**Usage**  
```

await setPrompt("<h1>Hello, world!</h1>")
```

**Returns**  
- A promise that resolves when the main prompt content is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setPreview

**Description**  
Sets the content of the preview panel.

**Signature**  
```

setPreview(content: string): Promise<void>
```

**Usage**  
```

await setPreview("<h1>Hello, world!</h1>")
```

**Returns**  
- A promise that resolves when the preview panel content is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setIgnoreBlur

**Description**  
Sets whether to ignore blur events.

**Signature**  
```

setIgnoreBlur(ignore: boolean): Promise<void>
```

**Usage**  
```

await setIgnoreBlur(true)
```

**Returns**  
- A promise that resolves when the ignore blur setting is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

## Pro APIs

### widget

**Description**  
Creates a persistent UI window with HTML content.

**Signature**  
```

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
```

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
```

menubar(icon: string, scripts: string[]): Promise<void>
```

**Usage**  
```

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
```

term(command?: string, options?: {
  cwd?: string,
  shell?: string,
  ...
}): Promise<void>
```

**Usage**  
```

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
```

showLogWindow(): Promise<void>
```

**Usage**  
```

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
```

async function scatterWindows(): Promise<string>
```

**Usage**  
```

// Script to auto-arrange windows with a single command
await scatterWindows()
```

**Returns**  
- A string containing a status or log message, e.g. "Windows scattered."

**Notes**  
- Only tested on macOS.  
- May require accessibility permissions if it's moving windows across multiple monitors.
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display a dialog
let result = await appleScript(`
  display dialog "Hello from AppleScript!"
`)

// Control system volume
await appleScript(`set volume 5`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- Only available on macOS
- Can interact with any application that supports AppleScript
- Useful for system automation tasks

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### focusKitWindow

**Description**  
Brings the Script Kit window into focus.

**Signature**  
```

focusKitWindow(): Promise<void>
```

**Usage**  
```

await focusKitWindow()
```

**Returns**  
- A promise that resolves when the Script Kit window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### attemptScriptFocus

**Description**  
Attempts to bring a specific script window into focus.

**Signature**  
```

attemptScriptFocus(scriptName: string): Promise<void>
```

**Usage**  
```

await attemptScriptFocus("my-script")
```

**Returns**  
- A promise that resolves when the script window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### getKitWindows

**Description**  
Retrieves information about all Script Kit windows.

**Signature**  
```

getKitWindows(): Promise<WindowInfo[]>
```

**Usage**  
```

let windows = await getKitWindows()
```

**Returns**  
- An array of `WindowInfo` objects, each containing information about a Script Kit window

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### focusWindow

**Description**  
Brings a specific window into focus based on its title or ID.

**Signature**  
```

focusWindow(titleOrId: string): Promise<void>
```

**Usage**  
```

await focusWindow("My App")
```

**Returns**  
- A promise that resolves when the window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### focusAppWindow

**Description**  
Brings a specific application window into focus based on its bundle ID.

**Signature**  
```

focusAppWindow(bundleId: string): Promise<void>
```

**Usage**  
```

await focusAppWindow("com.apple.Safari")
```

**Returns**  
- A promise that resolves when the application window is focused

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setWindowPosition

**Description**  
Sets the position of a specific window.

**Signature**  
```

setWindowPosition(titleOrId: string, x: number, y: number): Promise<void>
```

**Usage**  
```

await setWindowPosition("My App", 100, 100)
```

**Returns**  
- A promise that resolves when the window position is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### setWindowPositionByIndex

**Description**  
Sets the position of a window based on its index in the list of windows.

**Signature**  
```

setWindowPositionByIndex(index: number, x: number, y: number): Promise<void>
```

**Usage**  
```

await setWindowPositionByIndex(0, 100, 100)
```

**Returns**  
- A promise that resolves when the window position is set

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### scatterWindows

**Description**  
Evenly spaces out all open windows across the screen in a neat grid.

**Signature**  
```

scatterWindows(): Promise<void>
```

**Usage**  
```

await scatterWindows()
```

**Returns**  
- A promise that resolves when the windows are scattered

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### organizeWindows

**Description**  
Organizes windows into a grid based on their current positions.

**Signature**  
```

organizeWindows(): Promise<void>
```

**Usage**  
```

await organizeWindows()
```

**Returns**  
- A promise that resolves when the windows are organized

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### tileWindow

**Description**  
Tiles a specific window to occupy half of the screen.

**Signature**  
```

tileWindow(titleOrId: string, direction: "left" | "right" | "top" | "bottom"): Promise<void>
```

**Usage**  
```

await tileWindow("My App", "left")
```

**Returns**  
- A promise that resolves when the window is tiled

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### lock

**Description**  
Locks the screen.

**Signature**  
```

lock(): Promise<void>
```

**Usage**  
```

await lock()
```

**Returns**  
- A promise that resolves when the screen is locked

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### logout

**Description**  
Logs out the current user.

**Signature**  
```

logout(): Promise<void>
```

**Usage**  
```

await logout()
```

**Returns**  
- A promise that resolves when the user is logged out

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```

shutdown(): Promise<void>
```

**Usage**  
```

await shutdown()
```

**Returns**  
- A promise that resolves when the computer is shut down

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```

sleep(): Promise<void>
```

**Usage**  
```

await sleep()
```

**Returns**  
- A promise that resolves when the computer is put to sleep

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### fileSearch

**Description**  
Searches for files based on a query.

**Signature**  
```

fileSearch(query: string, options?: {
  onlyin?: string,
  ...
}): Promise<string[]>
```

**Usage**  
```

let results = await fileSearch("*.txt", { onlyin: home("Documents") })
```

**Returns**  
- An array of file paths that match the search query

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### copyPathAsImage

**Description**  
Copies a file path as an image to the clipboard.

**Signature**  
```

copyPathAsImage(filePath: string): Promise<void>
```

**Usage**  
```

await copyPathAsImage("/path/to/file.txt")
```

**Returns**  
- A promise that resolves when the file path is copied as an image

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### getWindows

**Description**  
Retrieves information about all open windows.

**Signature**  
```

getWindows(): Promise<WindowInfo[]>
```

**Usage**  
```

let windows = await getWindows()
```

**Returns**  
- An array of `WindowInfo` objects, each containing information about an open window

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### getWindowsBounds

**Description**  
Retrieves the bounds of all open windows.

**Signature**  
```

getWindowsBounds(): Promise<WindowBounds[]>
```

**Usage**  
```

let bounds = await getWindowsBounds()
```

**Returns**  
- An array of `WindowBounds` objects, each containing the bounds of an open window

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

## Misc Tools

### trash

**Description**  
Moves files or directories to the trash.

**Signature**  
```

trash(paths: string | string[]): Promise<void>
```

**Usage**  
```

await trash("/path/to/file.txt")
await trash(["/path/to/file1.txt", "/path/to/file2.txt"])
```

**Returns**  
- A promise that resolves when the files or directories are moved to the trash

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### git

**Description**  
Performs Git operations such as clone, pull, push, etc.

**Signature**  
```

git(command: string, options?: {
  cwd?: string,
  ...
}): Promise<string>
```

**Usage**  
```

await git("clone", { cwd: "/path/to/repo", args: ["https://github.com/user/repo.git"] })
```

**Returns**  
- A promise that resolves with the output of the Git command

**Notes**  
- Only available on macOS
- Useful for scripting automation tasks

### degit

**Description**  
Clones a Git repository using degit.

**Signature**  
```

degit(repo: string, destination: string, options?: {
  force?: boolean,
  ...
}): Promise<void>
```

**Usage**  
```

await degit("user/repo", "/path/to/destination")
```

**Returns**  
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

```js
import kit from "@johnlindquist/kit"

await kit.arg("Enter your name")
```

If you have questions, please reach out on our [Script Kit GitHub Discussions](https://github.com/johnlindquist/kit/discussions)

Happy Scripting! ❤️ - John Lindquist

### Playground

Press `cmd+p` while browsing an API to generate a script where you can experiment with examples contained in that section. Go ahead and try it now to experiment with the example below:

```js
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

```js
let value = await arg()
```

#### A Basic String Input

```js
let name = await arg("Enter your name")
```

#### arg with Choices Array

```js
let name = await arg("Select a name", [
  "John",
  "Mindy",
  "Joy",
])
```

#### arg with Async Choices

```js
let name = await arg("Select a name", async () => {
    let response = await get("https://swapi.dev/api/people/");
    return response?.data?.results.map((p) => p.name);
})
```

#### arg with Async Choices Object

```js
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

```js
let char = await arg("Type then pick a char", (input) => { 
    // return an array of strings
    return input.split("")
})
```

#### arg with Shortcuts

```js
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

```js
// Write write "MY_ENV_VAR" to ~/.kenv/.env
let MY_ENV_VAR = await env("MY_ENV_VAR")
```

You can also prompt the user to set the env var using a prompt by nesting it in an async function:

```js
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

```js
let content = await editor()
```

#### editor with Initial Content

```js
let content = await editor("Hello world!")
```

#### Load Remote Text Content into Editor

```js
let response = await get(`https://raw.githubusercontent.com/johnlindquist/kit/main/API.md`)

let content = await editor(response.data)
```

### div




`div` displays HTML. Pass a string of HTML to `div` to render it. `div` is commonly used in conjunction with `md` to render markdown.

#### Details

1. Just like arg, the first argument is a string or a prompt configuration object.
2. Optional:The second argument is a string of tailwind class to apply to the container, e.g., `bg-white p-4`.


#### div Hello World

```js
await div(`Hello world!`)
```

#### div with Markdown

```js
await div(md(`
# Hello world!

### Thanks for coming to my demo
* This is a list
* This is another item
* This is the last item

`))
```

#### div with Tailwind Classes

```js
await div(`Hello world!`, `bg-white text-black text-4xl p-4`)
```

#### div with Submit Links

```js
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

```js
await term()
```

#### term with Command

```js
await term(`cd ~/.kenv/scripts && ls`)
```

### template



The `template` prompt will present the editor populated by your template. You can then tab through each variable in your template and edit it. 

#### Details

1. The first argument is a string template. Add variables using $1, $2, etc. You can also use 

[//]: # (\${1:default value} to set a default value.&#41;)

#### Template Hello World

```js
let text = await template(`Hello $1!`)
```

#### Standard Usage

```js
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

```js
let keyInfo = await hotkey()
await editor(JSON.stringify(keyInfo, null, 2))
```

### drop



Use `await drop()` to prompt the user to drop a file or folder.

#### drop Hello World

```js
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

```js
let [first, last] = await fields(["First name", "Last name"])
```


#### fields with Field Properties

```js
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

```js
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

```js
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

```

Also see the included "chatgpt" example for a much more advanced scenario.

### selectFile



Prompt the user to select a file using the Finder dialog:

```js
let filePath = await selectFile()
```

### selectFolder



Prompt the user to select a folder using the Finder dialog:

```js
let folderPath = await selectFolder()
```


### path

The `path` prompt allows you to select a file or folder from the file system. You navigate with tab/shift+tab (or right/left arrows) and enter to select.

#### Details

1. Optional: The first argument is the initial directory to open with. Defaults to the home directory.


#### path Hello World

```js
let selectedFile = await path()
```

### select

`select` lets you choose from a list of options.

#### Details

1. The first argument is a array or a prompt configuration object.
2. The second argument is a list of choices, a array to render, or a function that returns choices or a string to render.

#### select Basic Array Input

```js
let multipleChoice = await select(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

#### select Array Object

```js
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

```js
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

```js
let word = await select("Type then pick a words", input => {
  return input.trim().split(new RegExp("[.,;/-_\n]", "g"))
})
```

### inspect



`inspect` takes an object and writes out a text file you can use to read/copy/paste the values from:

```js
let response = await get("https://swapi.dev/api/people/1/")
await inspect(response.data)
```

> Note: It will automatically convert objects to JSON to display them in the file


### dev



`dev` Opens a standalone instance of Chrome Dev Tools so you can play with JavaScript in the console. Passing in an object will set the variable `x` to your object in the console making it easy to inspect.

#### Details

1. Optional: the first argument is an object to set to the variable `x` to in the console.

#### dev Hello World

```js
dev()
```

#### dev with Object

```js
dev({
    name: "John",
    age: 40
})
```


### find

A file search prompt

```js
let filePath = await find("Search in the Downloads directory", {
  onlyin: home("Downloads"),
})

await revealFile(filePath)
```

### webcam

Prompt for webcam access. Press enter to capture an image buffer:

```js
let buffer = await webcam()
let imagePath = tmpPath("image.jpg")
await writeFile(imagePath, buffer)
await revealFile(imagePath)
```

## Alerts

### beep

Beep the system speaker:

```js
await beep()
```

### say

Say something using the built-in text-to-speech:

```js
await say("Done!")
```

### setStatus

Set the system menu bar icon and message. 
Each status message will be appended to a list. 
Clicking on the menu will display the list of messages. 
The status and messages will be dismissed once the tray closes, so use `log` if you want to persist messages.

```js
await setStatus({
  message: "Working on it...",
  status: "busy",
})
```

### menu

Set the system menu to a custom message/emoji with a list of scripts to run.

```js
await menu(`👍`, ["my-script", "another-script"])
```

Reset the menu to the default icon and scripts by passing an empty string

```js
await menu(``)
```

### notify

Send a system notification

```js
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

```js
await widget(`<h1 class="p-4 text-4xl">Hello World!</h1>`)
```

### widget Clock

```js
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

```js

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

```js

let result = await exec(`ls -la`, {
  cwd: home(), // where to run the command
  shell: "/bin/zsh", // if you're expecting to use specific shell features/configs
  all: true, // pipe both stdout and stderr to "all"
})

inspect(result.all)
```

### Displaying an Info Screen

It's extremely common to show the user what's happening while your command is running. This is often done by using `div` with `onInit` + `sumbit`:

```js
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

## Clipboard Helpers

### getClipboardHistory

**Description**  
Returns an array of recent clipboard items.

**Signature**  
```ts
getClipboardHistory(): Promise<ClipboardItem[]>
```

**Usage**  
```js
// Get all clipboard history items
let history = await getClipboardHistory()
console.log(history)

// Get most recent item
let [lastItem] = await getClipboardHistory()
```

### clearClipboardHistory

**Description**  
Clears all items from the clipboard history.

**Signature**  
```ts
clearClipboardHistory(): Promise<void>
```

**Usage**  
```js
// Clear entire clipboard history
await clearClipboardHistory()
```

### removeClipboardItem

**Description**  
Removes a specific item from the clipboard history by its ID.

**Signature**  
```ts
removeClipboardItem(itemId: string): Promise<void>
```

**Usage**  
```js
// Remove a specific clipboard item
let history = await getClipboardHistory()
let itemId = history[0].id
await removeClipboardItem(itemId)
```

## Prompt Tools

### show

**Description**  
Shows the main prompt programmatically.

**Signature**  
```ts
show(): Promise<void>
```

**Usage**  
```js
// Show the prompt
await show()
```

### hide

**Description**  
Hides the main prompt programmatically.

**Signature**  
```ts
hide(): Promise<void>
```

**Usage**  
```js
// Hide the prompt
await hide()
```

### setPanel

**Description**  
Sets the content of the main panel beneath the prompt.

**Signature**  
```ts
setPanel(content: string): Promise<void>
```

**Usage**  
```js
// Update panel with HTML content
await setPanel(`<div class="p-4">
  <h1>Panel Content</h1>
  <p>This appears below the prompt.</p>
</div>`)
```

### setPrompt

**Description**  
Sets the prompt message text.

**Signature**  
```ts
setPrompt(message: string): Promise<void>
```

**Usage**  
```js
// Change the prompt message
await setPrompt("Enter your search term:")
```

### setPreview

**Description**  
Sets the preview content in the right panel.

**Signature**  
```ts
setPreview(content: string): Promise<void>
```

**Usage**  
```js
// Show preview content
await setPreview(`<div class="p-4">
  <h2>Preview</h2>
  <p>This appears in the right panel.</p>
</div>`)
```

### setIgnoreBlur

**Description**  
Controls whether the prompt should ignore blur events.

**Signature**  
```ts
setIgnoreBlur(ignore: boolean): Promise<void>
```

**Usage**  
```js
// Keep prompt visible when focus is lost
await setIgnoreBlur(true)

// Allow prompt to close on blur
await setIgnoreBlur(false)
```

**Notes**  
- Useful for prompts that need to stay open while user interacts with other windows
- Should be used carefully to avoid interfering with normal window focus behavior

inspect(result)

### mic

Display the `mic` prompt to record mic audio:

```js
let buffer = await mic()
let filePath = tmpPath(`audio-${formatDate(new Date(), "yyyy-MM-dd-HH-mm-ss")}.webm`)
await writeFile(filePath, buffer)
playAudioFile(filePath)
```

### mic.start and mic.stop

Start and stop the mic recording in any prompt:

```js
await div({
  html: md(`Recording for 5 seconds!`),
  onInit: async () => {    
    let filePath = await mic.start()
    await wait(5000)
    let buffer = await mic.stop()
    await revealFile(filePath)
  },
})
```

### PROMPT

An object map of widths and heights used for setting the size of the prompt:

```js
await editor({
  width: PROMPT.WIDTH["3XL"],
  height: PROMPT.HEIGHT["3XL"],
})
```


### preventSubmit

A global Symbol used in combination with `onSubmit` to prevent the prompt from submitting.

```js
let result = await arg({
  onSubmit: input => {
    if (!input.includes("go")) {
      setHint("You must include the word 'go'")
      return preventSubmit
    }
  },
})

inspect(result)
```

## Process

### cwd

`cwd` is the current working directory of the process. 

- When launching a script from the app, the `kenv` containing the scripts dir will be the current working directory. 
- When launching a script from the terminal, the current working directory will be the directory you're in when you launch the script.

```js
// Example: Joining the current working directory with a filename to create an absolute path
const currentWorkingDirectory = process.cwd();
const fullPathToFile = path.join(currentWorkingDirectory, 'example.txt');
console.log(`The full path to the file is: ${fullPathToFile}`);
```

### pid
```js
// Example: Logging the process ID to find it in the Activity Monitor/Task Manager
const processId = process.pid;
console.log(`This process has the ID: ${processId}`);
```


### uptime
```js
// Example: Logging the uptime of the process
const uptimeInSeconds = process.uptime();
console.log(`The process has been running for ${uptimeInSeconds} seconds.`);
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

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

```js
import kit from "@johnlindquist/kit"

await kit.arg("Enter your name")
```

If you have questions, please reach out on our [Script Kit GitHub Discussions](https://github.com/johnlindquist/kit/discussions)

Happy Scripting! ❤️ - John Lindquist

### Playground

Press `cmd+p` while browsing an API to generate a script where you can experiment with examples contained in that section. Go ahead and try it now to experiment with the example below:

```js
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

```js
let value = await arg()
```

#### A Basic String Input

```js
let name = await arg("Enter your name")
```

#### arg with Choices Array

```js
let name = await arg("Select a name", [
  "John",
  "Mindy",
  "Joy",
])
```

#### arg with Async Choices

```js
let name = await arg("Select a name", async () => {
    let response = await get("https://swapi.dev/api/people/");
    return response?.data?.results.map((p) => p.name);
})
```

#### arg with Async Choices Object

```js
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

```js
let char = await arg("Type then pick a char", (input) => { 
    // return an array of strings
    return input.split("")
})
```

#### arg with Shortcuts

```js
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

```js
// Write write "MY_ENV_VAR" to ~/.kenv/.env
let MY_ENV_VAR = await env("MY_ENV_VAR")
```

You can also prompt the user to set the env var using a prompt by nesting it in an async function:

```js
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

```js
let content = await editor()
```

#### editor with Initial Content

```js
let content = await editor("Hello world!")
```

#### Load Remote Text Content into Editor

```js
let response = await get(`https://raw.githubusercontent.com/johnlindquist/kit/main/API.md`)

let content = await editor(response.data)
```

### div




`div` displays HTML. Pass a string of HTML to `div` to render it. `div` is commonly used in conjunction with `md` to render markdown.

#### Details

1. Just like arg, the first argument is a string or a prompt configuration object.
2. Optional:The second argument is a string of tailwind class to apply to the container, e.g., `bg-white p-4`.


#### div Hello World

```js
await div(`Hello world!`)
```

#### div with Markdown

```js
await div(md(`
# Hello world!

### Thanks for coming to my demo
* This is a list
* This is another item
* This is the last item

`))
```

#### div with Tailwind Classes

```js
await div(`Hello world!`, `bg-white text-black text-4xl p-4`)
```

#### div with Submit Links

```js
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

```js
await term()
```

#### term with Command

```js
await term(`cd ~/.kenv/scripts && ls`)
```

### template



The `template` prompt will present the editor populated by your template. You can then tab through each variable in your template and edit it. 

#### Details

1. The first argument is a string template. Add variables using $1, $2, etc. You can also use 

[//]: # (\${1:default value} to set a default value.&#41;)

#### Template Hello World

```js
let text = await template(`Hello $1!`)
```

#### Standard Usage

```js
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

```js
let keyInfo = await hotkey()
await editor(JSON.stringify(keyInfo, null, 2))
```

### drop



Use `await drop()` to prompt the user to drop a file or folder.

#### drop Hello World

```js
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

```js
let [first, last] = await fields(["First name", "Last name"])
```


#### fields with Field Properties

```js
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

```js
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

```js
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

```

Also see the included "chatgpt" example for a much more advanced scenario.

### selectFile



Prompt the user to select a file using the Finder dialog:

```js
let filePath = await selectFile()
```

### selectFolder



Prompt the user to select a folder using the Finder dialog:

```js
let folderPath = await selectFolder()
```


### path

The `path` prompt allows you to select a file or folder from the file system. You navigate with tab/shift+tab (or right/left arrows) and enter to select.

#### Details

1. Optional: The first argument is the initial directory to open with. Defaults to the home directory.


#### path Hello World

```js
let selectedFile = await path()
```

### select

`select` lets you choose from a list of options.

#### Details

1. The first argument is a array or a prompt configuration object.
2. The second argument is a list of choices, a array to render, or a function that returns choices or a string to render.

#### select Basic Array Input

```js
let multipleChoice = await select(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

#### select Array Object

```js
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

```js
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

```js
let word = await select("Type then pick a words", input => {
  return input.trim().split(new RegExp("[.,;/-_\n]", "g"))
})
```

### inspect



`inspect` takes an object and writes out a text file you can use to read/copy/paste the values from:

```js
let response = await get("https://swapi.dev/api/people/1/")
await inspect(response.data)
```

> Note: It will automatically convert objects to JSON to display them in the file


### dev



`dev` Opens a standalone instance of Chrome Dev Tools so you can play with JavaScript in the console. Passing in an object will set the variable `x` to your object in the console making it easy to inspect.

#### Details

1. Optional: the first argument is an object to set to the variable `x` to in the console.

#### dev Hello World

```js
dev()
```

#### dev with Object

```js
dev({
    name: "John",
    age: 40
})
```


### find

A file search prompt

```js
let filePath = await find("Search in the Downloads directory", {
  onlyin: home("Downloads"),
})

await revealFile(filePath)
```

### webcam

Prompt for webcam access. Press enter to capture an image buffer:

```js
let buffer = await webcam()
let imagePath = tmpPath("image.jpg")
await writeFile(imagePath, buffer)
await revealFile(imagePath)
```

## Alerts

### beep

Beep the system speaker:

```js
await beep()
```

### say

Say something using the built-in text-to-speech:

```js
await say("Done!")
```

### setStatus

Set the system menu bar icon and message. 
Each status message will be appended to a list. 
Clicking on the menu will display the list of messages. 
The status and messages will be dismissed once the tray closes, so use `log` if you want to persist messages.

```js
await setStatus({
  message: "Working on it...",
  status: "busy",
})
```

### menu

Set the system menu to a custom message/emoji with a list of scripts to run.

```js
await menu(`👍`, ["my-script", "another-script"])
```

Reset the menu to the default icon and scripts by passing an empty string

```js
await menu(``)
```

### notify

Send a system notification

```js
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

```js
await widget(`<h1 class="p-4 text-4xl">Hello World!</h1>`)
```

### widget Clock

```js
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

```js

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

```js

let result = await exec(`ls -la`, {
  cwd: home(), // where to run the command
  shell: "/bin/zsh", // if you're expecting to use specific shell features/configs
  all: true, // pipe both stdout and stderr to "all"
})

inspect(result.all)
```

### Displaying an Info Screen

It's extremely common to show the user what's happening while your command is running. This is often done by using `div` with `onInit` + `sumbit`:

```js
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

inspect(result)
```

The `exec` function returns the stdout of the command if the command was successful. It throws an error if the command fails.

## Helpers

### path
PathSelector

### edit
Edit

### browse
Browse


### kenvPath

Generates a path to a file within your main kenv:

```js
let myScript = kenvPath("scripts", "my-script.ts") // ~/.kenv/scripts/my-script.ts
```

### kitPath

Generates a path to a file within the Kit SDK:

```js
let apiPath = kitPath("API.md") // ~/.kit/API.md
```

### knodePath

Generates a path to a file within knode:

```js
let readme = knodePath("README.md") // ~/.knode/readme.md
```

### tmpPath

Generates a path to a tmp directory based on the current script name:

```js
// Run from the "my-script.ts" script
let tmpAsset = await tmpPath("result.txt")
// ~/.kenv/tmp/my-script/result.txt
```

### npm

Deprecated: Use standard `import` syntax instead and you will automatically be prompted to install missing packages.

### run

Run a script based on the script name.

> Note: This is technically dynamically importing an ESM module and resolving the path under the hood

```js
// Run "my-script.ts" from another script
await run("my-script")
```

### select
Select

### basePrompt
Arg


### onTab
OnTab

### onExit
OnExit

### args
Args

### updateArgs
UpdateArgs

### argOpts
string[]

### wait
Wait

### home
PathFn

### isFile
IsCheck

### isDir
IsCheck

### isBin
IsCheck

### createPathResolver
PathResolver

### inspect
Inspect

### db
DB


### getScripts

Get all scripts as choices:

```js
let scripts = await getScripts()
let script = await arg("select a script", scripts)
inspect(script.filePath)
```


### selectScript

Open the main script select prompt with grouped scripts:

```js
let script = await selectScript()
inspect(script.filePath)
```



### selectKenv

Prompts to select a kenv. If you only have a "main" kenv, it will immediately return that kenv.

```js
let kenv = await selectKenv()
inspect(kenv)
```

### blur

Blur the prompt so you can type in the window behind the prompt. If you don't use "ignoreBlur", this will exit the prompt and script. You're probably looking for an example like below:

```js
await div({
  headerClassName: `hidden`,
  footerClassName: `hidden`,
  className: `p-4 justify-center items-center flex flex-col`,
  html: `<h1>Return focus to the app beneath this prompt</h1>

<p>Press the main shortcut to re-focus the prompt.</p>
<p>Make sure to use a "wait" to give system focusing a chance to work.</p>
  
  `,
  alwaysOnTop: true,
  ignoreBlur: true,
  onInit: async () => {
    await wait(500)
    await blur()
  },
})
```

### highlight

A code highlighter for markdown:

```js
let html = await highlight(`
# Hello World

~~~js
console.log("hello world")
~~~
`)

await div(html)
```

### terminal

(Mac only)

Launches the mac terminal using the specified command:

```js
terminal(`cd ~/.kit && ls -la`)
```

### projectPath

The resolver function for the parent directory of the `scripts` folder. Useful when launching scripts outside of your kenv, such as using Kit in the terminal with other projects. 

```js
let app = projectPath("src", "app.ts")
```

### clearAllTimeouts

Manually remove every timeout created by `setTimeout`

### clearAllIntervals

Manually remove every interval created by `setInterval`

### createGist

Create a gist from a string.

```js
let gist = await createGist(`Testing gist`)
open(gist.html_url)
```

### setShortcuts

The legacy approach to settings shortcuts. You're probably looking for `setActions`.

```js
await arg({
  onInit: async () => {
    setShortcuts([
      {
        name: "Testing Set Shortcuts",
        key: `${cmd}+3`,
        bar: "right",
        visible: true,
        onPress: () => {
          inspect("Just use actions instead of shortcuts :)")
        },
      },
    ])
  },
})
```

### isWin/isMac/isLinux

Booleans to help you determine the platform you're on.

### cmd

A global variable that is "cmd" on mac and "ctrl" on windows and linux to help make shortcuts cross-platform.

```js
let shortcut = `${cmd}+0`
```

### formatDate

```js
let today = formatDate(new Date(), "yyyy-MM-dd")
inspect(today) // "2023-11-12"
```

### formatDateToNow

```js
let nye = new Date("2023-12-31")
let until = formatDateToNow(nye)
inspect(until) // "about 2 months"
```

### createChoiceSearch
`(choices: Choice[], config: Partial<Options & ConfigOptions>) => Promise<(query: string) => ScoredChoice[]>`


### groupChoices

If you want to divide your choices into groups, add a group key to each choice, then run `groupChoices` on the choices:

```js
let choices = [{name: "banana", group: "fruit"}, {name: "apple", group: "fruit"}, {name: "carrot", group: "vegetable"}]
let groupedChoices = groupChoices(choices)
let snack = await arg("Select a snack", groupedChoices)
```

```ts
(choices: Choice[], options?: {
  groupKey?: string
  missingGroupName?: string
  order?: string[]
  sortChoicesKey?: string[]
  recentKey?: string
  recentLimit?: number
  excludeGroups?: string[]
}) => Choice[]
```

### preload
(scriptPath?: string) => void

An internal function used to preload the choices for the next script. This is only useful in scenarios where you're ok with showing "stale" data while waiting for the first prompt in the next script to load it's real data from somewhere else.

### finishScript

An internal function that marks the script as "done" and ready for cleanup by the app.

### formatChoices
`(choices: Choice[], className?: string) => Choice[]`

### setScoredChoices
`(scoredChoices: ScoredChoice[]) => Promise<void>`

### setSelectedChoices

Select the last two choices:
```js

let choices: Choice[] = ["1", "2", "3"].map(c => ({
  id: uuid(),
  name: c,
  value: c,
}))

await select(
  {
    onInit: async () => {
      setSelectedChoices(choices.slice(-2))
    },
  },
  choices
)
```

## Setters

### Caution - Internals

The following "set" functions are used internally by Kit. You will only need them in advanced cases that usually involving dynmically manipulating the current prompt.

### setEnter

Set the current name of the "Enter" button. You're probably looking for the "enter" property on the prompt or choice configuration object.

```js
// Prompt Config
await arg({
  enter: "Create File",
})

// Choice Config
await arg("Select a file", [
  {
    name: "Create File",
    enter: "Create File",
  },
])
```

### setFocused

Set the current focused choice. You're probably looking for the "focused" of "focusedId" property on the prompt or choice configuration object.

```js
await arg({
  focused: "banana", // Searches for the choice by "value", then falls back to "name"
}, ["banana"])


let choices = [{name: "a", id: "0"}, {name: "b", id: "1"}]
await arg({
  focusedId: "1"
}, ["banana"])
```

### setPlaceholder

Set the current placeholder. You're probably looking for the "placeholder" property on the prompt or choice configuration object.

```js
await arg({
  placeholder: "Type to search",
})
```

### setPanel

Set the current panel (the area beneath the arg input when displaying HTML instead of choices). You're probably looking to pass a string as the second argument to `arg` instead.

```js
await arg("This is the input", `This is a panel. Use HTML here`)
```

### setDiv

Set the content of the current `div` prompt. You're probably looking to pass a string as the first argument to `div` instead.

```js
await div(`This is a div`)
```

### setAlwaysOnTop

Set the current window to always be on top of other windows on the system. You're probably looking for the "alwaysOnTop" property on the prompt configuration object.

```js
await arg({
  alwaysOnTop: true,
})
```

### setPreview

Update the right preview panel with HTML.

### setPrompt

Mainly for internals. A raw setter for the current prompt. Expect issues, especially with state, if used without care.

### setBounds

Update the bounds of the current prompt. You're probably looking for the width/height/x/y property on the prompt configuration object.

> Note: Automatic prompt resizing is complicated and may interfere with your manual resizing. We're working on improving these APIs, but there are a lot of edge cases.

```js
await div({
  html: `Hello world`,
  width: 500,
  height: 500,
  x: 0,
  y: 0,
})
```

### setHint

Set the current hint. You're probably looking for the "hint" property on the prompt configuration object.

```js
await arg({
  placeholder: "Eat a donut?",
  hint: `[y]es/[n]o`
})
```

### setInput

Set the current input. You're probably looking for the "input" property on the prompt configuration object.

```js
await arg({
  input: "Hello world",
})
```

## Global Input

### onClick

Register a handler to receive a click event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:

```js
onClick(event => {
  // Do something with the event
})
```

```ts
interface UiohookMouseEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  x: number
  y: number
  button: unknown
  clicks: number
}
```

### onMousedown

```js
onMousedown(event => {
  // Do something with the event
})
```

Register a handler to receive a mousedown event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:

```ts
interface UiohookMouseEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  x: number
  y: number
  button: unknown
  clicks: number
}
```

### onMouseup

```js
onMouseup(event => {
  // Do something with the event
})
```

Register a handler to receive a mouseup event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:

```ts
interface UiohookMouseEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  x: number
  y: number
  button: unknown
  clicks: number
}
```

### onWheel

Register a handler to receive a wheel event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:


```js
onWheel(event => {
  // Do something with the event
})
```

```ts
interface UiohookWheelEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  x: number
  y: number
  clicks: number
  amount: number
  direction: WheelDirection
  rotation: number
}
```

### onKeydown

Register a handler to receive a keydown event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:


```js
onKeydown(event => {
  // Do something with the event
})
```

```ts
interface UiohookKeyboardEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  keycode: number
}
```

### onKeyup

Register a handler to receive a keyup event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:


```js
onKeyup(event => {
  // Do something with the event
})
```

```ts
interface UiohookKeyboardEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  keycode: number
}
```


## App Utils

### hide

Hide the prompt when you're script doesn't need a prompt and will simply run a command and open another app.

```js
await hide()
// Do something like create a file then open it in VS Code
```

### submit

Submit a value of the currently focused prompt. Mostly used with actions, but can also be used with timeouts, errors, etc.

```js
let result = await arg(
  "Select",
  ["John", "Mindy", "Joy"],
  [
    {
      name: "Submit Sally",
      shortcut: `${cmd}+s`,
      onAction: () => {
        submit("Sally")
      },
    },
  ]
)

inspect(result) // Sally
```

### blur

Unfocus the prompt.

> Note: You need to use `ignoreBlur` on some prompts or else this will exit the script

### getClipboardHistory

Get the clipboard history:

```js
let history = await getClipboardHistory()
dev(history)
```

### clearClipboardHistory

Clear the clipboard history:

```js
await clearClipboardHistory()
```

### removeClipboardItem

Remove a specific clipboard item:

```js
let history = await getClipboardHistory()
let itemId = history[2].id
await removeClipboardItem(itemId)
```

### mainScript

Return your script to the main menu:

```js
await mainScript()
```

### appKeystroke

### Key

### log


### warn
### keyboard
### mouse
### clipboard
### execLog
### focus

Force focus back to the prompt. Only useful when "ignoreBlur" is true and the user is focusing on another app.

### docs

Feed it a markdown file, it will create groups from the h2s and choices from the h3s.

```js
let value = await docs(kitPath("API.md"))
```

### getAppState
### registerShortcut

Register a global shortcut that's only available for the duration of the script:

```js
registerShortcut("opt y", () => {
  say("You're done", {
    name: "Alice",
    rate: 0.5,
    pitch: 2
  });
  process.exit();
});
```
### unregisterShortcut

Unregister a global shortcut that was registered with `registerShortcut`:

```js
unregisterShortcut("opt y");
```

### startDrag

### eyeDropper

Show the eye dropper to select a color from the screen:

```js
hide()
let { sRGBHex } = await eyeDropper()

let css = `
.result {
    font-size: 24px;
    background-color: ${sRGBHex};
    width: 100%;
    height: 100%;
}    
`

await div({
  css,
  className: "result",
  html: `Color: ${sRGBHex}`,
  height: PROMPT.HEIGHT["2XL"],
})
```

### toast

**Description**  
Displays a small, dismissable notification popup in the corner of the screen.

**Signature**  
```ts
toast(message: string, options?: {
  duration?: number,
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left",
  type?: "info" | "success" | "warning" | "error"
}): Promise<void>
```

**Usage**  
```js
// Basic usage
await toast("Script completed successfully!")

// With options
await toast("Task failed", {
  duration: 5000, // 5 seconds
  position: "top-right",
  type: "error"
})

// Persistent toast (won't auto-dismiss)
await toast("Important message", {
  duration: 0
})
```

**Notes**  
- Works across all operating systems
- Multiple toasts will stack in the specified position
- Toasts can be manually dismissed by clicking

### mic

Display the `mic` prompt to record mic audio:

```js
let buffer = await mic()
let filePath = tmpPath(`audio-${formatDate(new Date(), "yyyy-MM-dd-HH-mm-ss")}.webm`)
await writeFile(filePath, buffer)
playAudioFile(filePath)
```

### mic.start and mic.stop

Start and stop the mic recording in any prompt:

```js
await div({
  html: md(`Recording for 5 seconds!`),
  onInit: async () => {    
    let filePath = await mic.start()
    await wait(5000)
    let buffer = await mic.stop()
    await revealFile(filePath)
  },
})
```

### PROMPT

An object map of widths and heights used for setting the size of the prompt:

```js
await editor({
  width: PROMPT.WIDTH["3XL"],
  height: PROMPT.HEIGHT["3XL"],
})
```


### preventSubmit

A global Symbol used in combination with `onSubmit` to prevent the prompt from submitting.

```js
let result = await arg({
  onSubmit: input => {
    if (!input.includes("go")) {
      setHint("You must include the word 'go'")
      return preventSubmit
    }
  },
})

inspect(result)
```

## Process

### cwd

`cwd` is the current working directory of the process. 

- When launching a script from the app, the `kenv` containing the scripts dir will be the current working directory. 
- When launching a script from the terminal, the current working directory will be the directory you're in when you launch the script.

```js
// Example: Joining the current working directory with a filename to create an absolute path
const currentWorkingDirectory = process.cwd();
const fullPathToFile = path.join(currentWorkingDirectory, 'example.txt');
console.log(`The full path to the file is: ${fullPathToFile}`);
```

### pid
```js
// Example: Logging the process ID to find it in the Activity Monitor/Task Manager
const processId = process.pid;
console.log(`This process has the ID: ${processId}`);
```


### uptime
```js
// Example: Logging the uptime of the process
const uptimeInSeconds = process.uptime();
console.log(`The process has been running for ${uptimeInSeconds} seconds.`);
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```

## System Control

### lock

**Description**  
Locks the computer screen.

**Signature**  
```ts
lock(): Promise<void>
```

**Usage**  
```js
// Lock the screen
await lock()
```

### logout

**Description**  
Logs out the current user.

**Signature**  
```ts
logout(options?: {
  force?: boolean  // Force logout without confirmation
}): Promise<void>
```

**Usage**  
```js
// Normal logout
await logout()

// Force logout
await logout({ force: true })
```

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```ts
shutdown(options?: {
  force?: boolean,  // Force shutdown without confirmation
  restart?: boolean // Restart instead of shutdown
}): Promise<void>
```

**Usage**  
```js
// Normal shutdown
await shutdown()

// Force restart
await shutdown({ 
  force: true,
  restart: true 
})
```

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```ts
sleep(): Promise<void>
```

**Usage**  
```js
// Put computer to sleep
await sleep()
```

**Notes**  
- These system control functions require appropriate permissions
- Some operations may require admin privileges
- Use with caution as they affect system state
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```

## System Control

### lock

**Description**  
Locks the computer screen.

**Signature**  
```ts
lock(): Promise<void>
```

**Usage**  
```js
// Lock the screen
await lock()
```

### logout

**Description**  
Logs out the current user.

**Signature**  
```ts
logout(options?: {
  force?: boolean  // Force logout without confirmation
}): Promise<void>
```

**Usage**  
```js
// Normal logout
await logout()

// Force logout
await logout({ force: true })
```

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```ts
shutdown(options?: {
  force?: boolean,  // Force shutdown without confirmation
  restart?: boolean // Restart instead of shutdown
}): Promise<void>
```

**Usage**  
```js
// Normal shutdown
await shutdown()

// Force restart
await shutdown({ 
  force: true,
  restart: true 
})
```

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```ts
sleep(): Promise<void>
```

**Usage**  
```js
// Put computer to sleep
await sleep()
```

**Notes**  
- These system control functions require appropriate permissions
- Some operations may require admin privileges
- Use with caution as they affect system state
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```

## System Control

### lock

**Description**  
Locks the computer screen.

**Signature**  
```ts
lock(): Promise<void>
```

**Usage**  
```js
// Lock the screen
await lock()
```

### logout

**Description**  
Logs out the current user.

**Signature**  
```ts
logout(options?: {
  force?: boolean  // Force logout without confirmation
}): Promise<void>
```

**Usage**  
```js
// Normal logout
await logout()

// Force logout
await logout({ force: true })
```

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```ts
shutdown(options?: {
  force?: boolean,  // Force shutdown without confirmation
  restart?: boolean // Restart instead of shutdown
}): Promise<void>
```

**Usage**  
```js
// Normal shutdown
await shutdown()

// Force restart
await shutdown({ 
  force: true,
  restart: true 
})
```

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```ts
sleep(): Promise<void>
```

**Usage**  
```js
// Put computer to sleep
await sleep()
```

**Notes**  
- These system control functions require appropriate permissions
- Some operations may require admin privileges
- Use with caution as they affect system state
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```

## System Control

### lock

**Description**  
Locks the computer screen.

**Signature**  
```ts
lock(): Promise<void>
```

**Usage**  
```js
// Lock the screen
await lock()
```

### logout

**Description**  
Logs out the current user.

**Signature**  
```ts
logout(options?: {
  force?: boolean  // Force logout without confirmation
}): Promise<void>
```

**Usage**  
```js
// Normal logout
await logout()

// Force logout
await logout({ force: true })
```

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```ts
shutdown(options?: {
  force?: boolean,  // Force shutdown without confirmation
  restart?: boolean // Restart instead of shutdown
}): Promise<void>
```

**Usage**  
```js
// Normal shutdown
await shutdown()

// Force restart
await shutdown({ 
  force: true,
  restart: true 
})
```

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```ts
sleep(): Promise<void>
```

**Usage**  
```js
// Put computer to sleep
await sleep()
```

**Notes**  
- These system control functions require appropriate permissions
- Some operations may require admin privileges
- Use with caution as they affect system state
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```

## System Control

### lock

**Description**  
Locks the computer screen.

**Signature**  
```ts
lock(): Promise<void>
```

**Usage**  
```js
// Lock the screen
await lock()
```

### logout

**Description**  
Logs out the current user.

**Signature**  
```ts
logout(options?: {
  force?: boolean  // Force logout without confirmation
}): Promise<void>
```

**Usage**  
```js
// Normal logout
await logout()

// Force logout
await logout({ force: true })
```

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```ts
shutdown(options?: {
  force?: boolean,  // Force shutdown without confirmation
  restart?: boolean // Restart instead of shutdown
}): Promise<void>
```

**Usage**  
```js
// Normal shutdown
await shutdown()

// Force restart
await shutdown({ 
  force: true,
  restart: true 
})
```

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```ts
sleep(): Promise<void>
```

**Usage**  
```js
// Put computer to sleep
await sleep()
```

**Notes**  
- These system control functions require appropriate permissions
- Some operations may require admin privileges
- Use with caution as they affect system state
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```

## System Control

### lock

**Description**  
Locks the computer screen.

**Signature**  
```ts
lock(): Promise<void>
```

**Usage**  
```js
// Lock the screen
await lock()
```

### logout

**Description**  
Logs out the current user.

**Signature**  
```ts
logout(options?: {
  force?: boolean  // Force logout without confirmation
}): Promise<void>
```

**Usage**  
```js
// Normal logout
await logout()

// Force logout
await logout({ force: true })
```

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```ts
shutdown(options?: {
  force?: boolean,  // Force shutdown without confirmation
  restart?: boolean // Restart instead of shutdown
}): Promise<void>
```

**Usage**  
```js
// Normal shutdown
await shutdown()

// Force restart
await shutdown({ 
  force: true,
  restart: true 
})
```

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```ts
sleep(): Promise<void>
```

**Usage**  
```js
// Put computer to sleep
await sleep()
```

**Notes**  
- These system control functions require appropriate permissions
- Some operations may require admin privileges
- Use with caution as they affect system state
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```

## System Control

### lock

**Description**  
Locks the computer screen.

**Signature**  
```ts
lock(): Promise<void>
```

**Usage**  
```js
// Lock the screen
await lock()
```

### logout

**Description**  
Logs out the current user.

**Signature**  
```ts
logout(options?: {
  force?: boolean  // Force logout without confirmation
}): Promise<void>
```

**Usage**  
```js
// Normal logout
await logout()

// Force logout
await logout({ force: true })
```

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```ts
shutdown(options?: {
  force?: boolean,  // Force shutdown without confirmation
  restart?: boolean // Restart instead of shutdown
}): Promise<void>
```

**Usage**  
```js
// Normal shutdown
await shutdown()

// Force restart
await shutdown({ 
  force: true,
  restart: true 
})
```

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```ts
sleep(): Promise<void>
```

**Usage**  
```js
// Put computer to sleep
await sleep()
```

**Notes**  
- These system control functions require appropriate permissions
- Some operations may require admin privileges
- Use with caution as they affect system state
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```

## System Control

### lock

**Description**  
Locks the computer screen.

**Signature**  
```ts
lock(): Promise<void>
```

**Usage**  
```js
// Lock the screen
await lock()
```

### logout

**Description**  
Logs out the current user.

**Signature**  
```ts
logout(options?: {
  force?: boolean  // Force logout without confirmation
}): Promise<void>
```

**Usage**  
```js
// Normal logout
await logout()

// Force logout
await logout({ force: true })
```

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```ts
shutdown(options?: {
  force?: boolean,  // Force shutdown without confirmation
  restart?: boolean // Restart instead of shutdown
}): Promise<void>
```

**Usage**  
```js
// Normal shutdown
await shutdown()

// Force restart
await shutdown({ 
  force: true,
  restart: true 
})
```

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```ts
sleep(): Promise<void>
```

**Usage**  
```js
// Put computer to sleep
await sleep()
```

**Notes**  
- These system control functions require appropriate permissions
- Some operations may require admin privileges
- Use with caution as they affect system state
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```

## System Control

### lock

**Description**  
Locks the computer screen.

**Signature**  
```ts
lock(): Promise<void>
```

**Usage**  
```js
// Lock the screen
await lock()
```

### logout

**Description**  
Logs out the current user.

**Signature**  
```ts
logout(options?: {
  force?: boolean  // Force logout without confirmation
}): Promise<void>
```

**Usage**  
```js
// Normal logout
await logout()

// Force logout
await logout({ force: true })
```

### shutdown

**Description**  
Shuts down the computer.

**Signature**  
```ts
shutdown(options?: {
  force?: boolean,  // Force shutdown without confirmation
  restart?: boolean // Restart instead of shutdown
}): Promise<void>
```

**Usage**  
```js
// Normal shutdown
await shutdown()

// Force restart
await shutdown({ 
  force: true,
  restart: true 
})
```

### sleep

**Description**  
Puts the computer to sleep.

**Signature**  
```ts
sleep(): Promise<void>
```

**Usage**  
```js
// Put computer to sleep
await sleep()
```

**Notes**  
- These system control functions require appropriate permissions
- Some operations may require admin privileges
- Use with caution as they affect system state
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
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

```js
import kit from "@johnlindquist/kit"

await kit.arg("Enter your name")
```

If you have questions, please reach out on our [Script Kit GitHub Discussions](https://github.com/johnlindquist/kit/discussions)

Happy Scripting! ❤️ - John Lindquist

### Playground

Press `cmd+p` while browsing an API to generate a script where you can experiment with examples contained in that section. Go ahead and try it now to experiment with the example below:

```js
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

```js
let value = await arg()
```

#### A Basic String Input

```js
let name = await arg("Enter your name")
```

#### arg with Choices Array

```js
let name = await arg("Select a name", [
  "John",
  "Mindy",
  "Joy",
])
```

#### arg with Async Choices

```js
let name = await arg("Select a name", async () => {
    let response = await get("https://swapi.dev/api/people/");
    return response?.data?.results.map((p) => p.name);
})
```

#### arg with Async Choices Object

```js
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

```js
let char = await arg("Type then pick a char", (input) => { 
    // return an array of strings
    return input.split("")
})
```

#### arg with Shortcuts

```js
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

```js
// Write write "MY_ENV_VAR" to ~/.kenv/.env
let MY_ENV_VAR = await env("MY_ENV_VAR")
```

You can also prompt the user to set the env var using a prompt by nesting it in an async function:

```js
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

```js
let content = await editor()
```

#### editor with Initial Content

```js
let content = await editor("Hello world!")
```

#### Load Remote Text Content into Editor

```js
let response = await get(`https://raw.githubusercontent.com/johnlindquist/kit/main/API.md`)

let content = await editor(response.data)
```

### div




`div` displays HTML. Pass a string of HTML to `div` to render it. `div` is commonly used in conjunction with `md` to render markdown.

#### Details

1. Just like arg, the first argument is a string or a prompt configuration object.
2. Optional:The second argument is a string of tailwind class to apply to the container, e.g., `bg-white p-4`.


#### div Hello World

```js
await div(`Hello world!`)
```

#### div with Markdown

```js
await div(md(`
# Hello world!

### Thanks for coming to my demo
* This is a list
* This is another item
* This is the last item

`))
```

#### div with Tailwind Classes

```js
await div(`Hello world!`, `bg-white text-black text-4xl p-4`)
```

#### div with Submit Links

```js
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

```js
await term()
```

#### term with Command

```js
await term(`cd ~/.kenv/scripts && ls`)
```

### template



The `template` prompt will present the editor populated by your template. You can then tab through each variable in your template and edit it. 

#### Details

1. The first argument is a string template. Add variables using $1, $2, etc. You can also use 

[//]: # (\${1:default value} to set a default value.&#41;)

#### Template Hello World

```js
let text = await template(`Hello $1!`)
```

#### Standard Usage

```js
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

```js
let keyInfo = await hotkey()
await editor(JSON.stringify(keyInfo, null, 2))
```

### drop



Use `await drop()` to prompt the user to drop a file or folder.

#### drop Hello World

```js
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

```js
let [first, last] = await fields(["First name", "Last name"])
```


#### fields with Field Properties

```js
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

```js
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

```js
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

```

Also see the included "chatgpt" example for a much more advanced scenario.

### selectFile



Prompt the user to select a file using the Finder dialog:

```js
let filePath = await selectFile()
```

### selectFolder



Prompt the user to select a folder using the Finder dialog:

```js
let folderPath = await selectFolder()
```


### path

The `path` prompt allows you to select a file or folder from the file system. You navigate with tab/shift+tab (or right/left arrows) and enter to select.

#### Details

1. Optional: The first argument is the initial directory to open with. Defaults to the home directory.


#### path Hello World

```js
let selectedFile = await path()
```

### select

`select` lets you choose from a list of options.

#### Details

1. The first argument is a array or a prompt configuration object.
2. The second argument is a list of choices, a array to render, or a function that returns choices or a string to render.

#### select Basic Array Input

```js
let multipleChoice = await select(
  "Select one or more developer",
  ["John", "Nghia", "Mindy", "Joy"]
)
```

#### select Array Object

```js
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

```js
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

```js
let word = await select("Type then pick a words", input => {
  return input.trim().split(new RegExp("[.,;/-_\n]", "g"))
})
```

### inspect



`inspect` takes an object and writes out a text file you can use to read/copy/paste the values from:

```js
let response = await get("https://swapi.dev/api/people/1/")
await inspect(response.data)
```

> Note: It will automatically convert objects to JSON to display them in the file


### dev



`dev` Opens a standalone instance of Chrome Dev Tools so you can play with JavaScript in the console. Passing in an object will set the variable `x` to your object in the console making it easy to inspect.

#### Details

1. Optional: the first argument is an object to set to the variable `x` to in the console.

#### dev Hello World

```js
dev()
```

#### dev with Object

```js
dev({
    name: "John",
    age: 40
})
```


### find

A file search prompt

```js
let filePath = await find("Search in the Downloads directory", {
  onlyin: home("Downloads"),
})

await revealFile(filePath)
```

### webcam

Prompt for webcam access. Press enter to capture an image buffer:

```js
let buffer = await webcam()
let imagePath = tmpPath("image.jpg")
await writeFile(imagePath, buffer)
await revealFile(imagePath)
```

## Alerts

### beep

Beep the system speaker:

```js
await beep()
```

### say

Say something using the built-in text-to-speech:

```js
await say("Done!")
```

### setStatus

Set the system menu bar icon and message. 
Each status message will be appended to a list. 
Clicking on the menu will display the list of messages. 
The status and messages will be dismissed once the tray closes, so use `log` if you want to persist messages.

```js
await setStatus({
  message: "Working on it...",
  status: "busy",
})
```

### menu

Set the system menu to a custom message/emoji with a list of scripts to run.

```js
await menu(`👍`, ["my-script", "another-script"])
```

Reset the menu to the default icon and scripts by passing an empty string

```js
await menu(``)
```

### notify

Send a system notification

```js
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

```js
await widget(`<h1 class="p-4 text-4xl">Hello World!</h1>`)
```

### widget Clock

```js
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

```js

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

```js

let result = await exec(`ls -la`, {
  cwd: home(), // where to run the command
  shell: "/bin/zsh", // if you're expecting to use specific shell features/configs
  all: true, // pipe both stdout and stderr to "all"
})

inspect(result.all)
```

### Displaying an Info Screen

It's extremely common to show the user what's happening while your command is running. This is often done by using `div` with `onInit` + `sumbit`:

```js
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

inspect(result)
```

The `exec` function returns the stdout of the command if the command was successful. It throws an error if the command fails.

## Helpers

### path
PathSelector

### edit
Edit

### browse
Browse


### kenvPath

Generates a path to a file within your main kenv:

```js
let myScript = kenvPath("scripts", "my-script.ts") // ~/.kenv/scripts/my-script.ts
```

### kitPath

Generates a path to a file within the Kit SDK:

```js
let apiPath = kitPath("API.md") // ~/.kit/API.md
```

### knodePath

Generates a path to a file within knode:

```js
let readme = knodePath("README.md") // ~/.knode/readme.md
```

### tmpPath

Generates a path to a tmp directory based on the current script name:

```js
// Run from the "my-script.ts" script
let tmpAsset = await tmpPath("result.txt")
// ~/.kenv/tmp/my-script/result.txt
```

### npm

Deprecated: Use standard `import` syntax instead and you will automatically be prompted to install missing packages.

### run

Run a script based on the script name.

> Note: This is technically dynamically importing an ESM module and resolving the path under the hood

```js
// Run "my-script.ts" from another script
await run("my-script")
```

### select
Select

### basePrompt
Arg


### onTab
OnTab

### onExit
OnExit

### args
Args

### updateArgs
UpdateArgs

### argOpts
string[]

### wait
Wait

### home
PathFn

### isFile
IsCheck

### isDir
IsCheck

### isBin
IsCheck

### createPathResolver
PathResolver

### inspect
Inspect

### db
DB


### getScripts

Get all scripts as choices:

```js
let scripts = await getScripts()
let script = await arg("select a script", scripts)
inspect(script.filePath)
```


### selectScript

Open the main script select prompt with grouped scripts:

```js
let script = await selectScript()
inspect(script.filePath)
```



### selectKenv

Prompts to select a kenv. If you only have a "main" kenv, it will immediately return that kenv.

```js
let kenv = await selectKenv()
inspect(kenv)
```

### blur

Blur the prompt so you can type in the window behind the prompt. If you don't use "ignoreBlur", this will exit the prompt and script. You're probably looking for an example like below:

```js
await div({
  headerClassName: `hidden`,
  footerClassName: `hidden`,
  className: `p-4 justify-center items-center flex flex-col`,
  html: `<h1>Return focus to the app beneath this prompt</h1>

<p>Press the main shortcut to re-focus the prompt.</p>
<p>Make sure to use a "wait" to give system focusing a chance to work.</p>
  
  `,
  alwaysOnTop: true,
  ignoreBlur: true,
  onInit: async () => {
    await wait(500)
    await blur()
  },
})
```

### highlight

A code highlighter for markdown:

```js
let html = await highlight(`
# Hello World

~~~js
console.log("hello world")
~~~
`)

await div(html)
```

### terminal

(Mac only)

Launches the mac terminal using the specified command:

```js
terminal(`cd ~/.kit && ls -la`)
```

### projectPath

The resolver function for the parent directory of the `scripts` folder. Useful when launching scripts outside of your kenv, such as using Kit in the terminal with other projects. 

```js
let app = projectPath("src", "app.ts")
```

### clearAllTimeouts

Manually remove every timeout created by `setTimeout`

### clearAllIntervals

Manually remove every interval created by `setInterval`

### createGist

Create a gist from a string.

```js
let gist = await createGist(`Testing gist`)
open(gist.html_url)
```

### setShortcuts

The legacy approach to settings shortcuts. You're probably looking for `setActions`.

```js
await arg({
  onInit: async () => {
    setShortcuts([
      {
        name: "Testing Set Shortcuts",
        key: `${cmd}+3`,
        bar: "right",
        visible: true,
        onPress: () => {
          inspect("Just use actions instead of shortcuts :)")
        },
      },
    ])
  },
})
```

### isWin/isMac/isLinux

Booleans to help you determine the platform you're on.

### cmd

A global variable that is "cmd" on mac and "ctrl" on windows and linux to help make shortcuts cross-platform.

```js
let shortcut = `${cmd}+0`
```

### formatDate

```js
let today = formatDate(new Date(), "yyyy-MM-dd")
inspect(today) // "2023-11-12"
```

### formatDateToNow

```js
let nye = new Date("2023-12-31")
let until = formatDateToNow(nye)
inspect(until) // "about 2 months"
```

### createChoiceSearch
`(choices: Choice[], config: Partial<Options & ConfigOptions>) => Promise<(query: string) => ScoredChoice[]>`


### groupChoices

If you want to divide your choices into groups, add a group key to each choice, then run `groupChoices` on the choices:

```js
let choices = [{name: "banana", group: "fruit"}, {name: "apple", group: "fruit"}, {name: "carrot", group: "vegetable"}]
let groupedChoices = groupChoices(choices)
let snack = await arg("Select a snack", groupedChoices)
```

```ts
(choices: Choice[], options?: {
  groupKey?: string
  missingGroupName?: string
  order?: string[]
  sortChoicesKey?: string[]
  recentKey?: string
  recentLimit?: number
  excludeGroups?: string[]
}) => Choice[]
```

### preload
(scriptPath?: string) => void

An internal function used to preload the choices for the next script. This is only useful in scenarios where you're ok with showing "stale" data while waiting for the first prompt in the next script to load it's real data from somewhere else.

### finishScript

An internal function that marks the script as "done" and ready for cleanup by the app.

### formatChoices
`(choices: Choice[], className?: string) => Choice[]`

### setScoredChoices
`(scoredChoices: ScoredChoice[]) => Promise<void>`

### setSelectedChoices

Select the last two choices:
```js

let choices: Choice[] = ["1", "2", "3"].map(c => ({
  id: uuid(),
  name: c,
  value: c,
}))

await select(
  {
    onInit: async () => {
      setSelectedChoices(choices.slice(-2))
    },
  },
  choices
)
```

## Setters

### Caution - Internals

The following "set" functions are used internally by Kit. You will only need them in advanced cases that usually involving dynmically manipulating the current prompt.

### setEnter

Set the current name of the "Enter" button. You're probably looking for the "enter" property on the prompt or choice configuration object.

```js
// Prompt Config
await arg({
  enter: "Create File",
})

// Choice Config
await arg("Select a file", [
  {
    name: "Create File",
    enter: "Create File",
  },
])
```

### setFocused

Set the current focused choice. You're probably looking for the "focused" of "focusedId" property on the prompt or choice configuration object.

```js
await arg({
  focused: "banana", // Searches for the choice by "value", then falls back to "name"
}, ["banana"])


let choices = [{name: "a", id: "0"}, {name: "b", id: "1"}]
await arg({
  focusedId: "1"
}, ["banana"])
```

### setPlaceholder

Set the current placeholder. You're probably looking for the "placeholder" property on the prompt or choice configuration object.

```js
await arg({
  placeholder: "Type to search",
})
```

### setPanel

Set the current panel (the area beneath the arg input when displaying HTML instead of choices). You're probably looking to pass a string as the second argument to `arg` instead.

```js
await arg("This is the input", `This is a panel. Use HTML here`)
```

### setDiv

Set the content of the current `div` prompt. You're probably looking to pass a string as the first argument to `div` instead.

```js
await div(`This is a div`)
```

### setAlwaysOnTop

Set the current window to always be on top of other windows on the system. You're probably looking for the "alwaysOnTop" property on the prompt configuration object.

```js
await arg({
  alwaysOnTop: true,
})
```

### setPreview

Update the right preview panel with HTML.

### setPrompt

Mainly for internals. A raw setter for the current prompt. Expect issues, especially with state, if used without care.

### setBounds

Update the bounds of the current prompt. You're probably looking for the width/height/x/y property on the prompt configuration object.

> Note: Automatic prompt resizing is complicated and may interfere with your manual resizing. We're working on improving these APIs, but there are a lot of edge cases.

```js
await div({
  html: `Hello world`,
  width: 500,
  height: 500,
  x: 0,
  y: 0,
})
```

### setHint

Set the current hint. You're probably looking for the "hint" property on the prompt configuration object.

```js
await arg({
  placeholder: "Eat a donut?",
  hint: `[y]es/[n]o`
})
```

### setInput

Set the current input. You're probably looking for the "input" property on the prompt configuration object.

```js
await arg({
  input: "Hello world",
})
```

## Global Input

### onClick

Register a handler to receive a click event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:

```js
onClick(event => {
  // Do something with the event
})
```

```ts
interface UiohookMouseEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  x: number
  y: number
  button: unknown
  clicks: number
}
```

### onMousedown

```js
onMousedown(event => {
  // Do something with the event
})
```

Register a handler to receive a mousedown event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:

```ts
interface UiohookMouseEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  x: number
  y: number
  button: unknown
  clicks: number
}
```

### onMouseup

```js
onMouseup(event => {
  // Do something with the event
})
```

Register a handler to receive a mouseup event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:

```ts
interface UiohookMouseEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  x: number
  y: number
  button: unknown
  clicks: number
}
```

### onWheel

Register a handler to receive a wheel event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:


```js
onWheel(event => {
  // Do something with the event
})
```

```ts
interface UiohookWheelEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  x: number
  y: number
  clicks: number
  amount: number
  direction: WheelDirection
  rotation: number
}
```

### onKeydown

Register a handler to receive a keydown event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:


```js
onKeydown(event => {
  // Do something with the event
})
```

```ts
interface UiohookKeyboardEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  keycode: number
}
```

### onKeyup

Register a handler to receive a keyup event from the [uiohook-napi](https://www.npmjs.com/package/uiohook-napi) library:


```js
onKeyup(event => {
  // Do something with the event
})
```

```ts
interface UiohookKeyboardEvent {
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  keycode: number
}
```


## App Utils

### hide

Hide the prompt when you're script doesn't need a prompt and will simply run a command and open another app.

```js
await hide()
// Do something like create a file then open it in VS Code
```

### submit

Submit a value of the currently focused prompt. Mostly used with actions, but can also be used with timeouts, errors, etc.

```js
let result = await arg(
  "Select",
  ["John", "Mindy", "Joy"],
  [
    {
      name: "Submit Sally",
      shortcut: `${cmd}+s`,
      onAction: () => {
        submit("Sally")
      },
    },
  ]
)

inspect(result) // Sally
```

### blur

Unfocus the prompt.

> Note: You need to use `ignoreBlur` on some prompts or else this will exit the script

### getClipboardHistory

Get the clipboard history:

```js
let history = await getClipboardHistory()
dev(history)
```

### clearClipboardHistory

Clear the clipboard history:

```js
await clearClipboardHistory()
```

### removeClipboardItem

Remove a specific clipboard item:

```js
let history = await getClipboardHistory()
let itemId = history[2].id
await removeClipboardItem(itemId)
```

### mainScript

Return your script to the main menu:

```js
await mainScript()
```

### appKeystroke

### Key

### log


### warn
### keyboard
### mouse
### clipboard
### execLog
### focus

Force focus back to the prompt. Only useful when "ignoreBlur" is true and the user is focusing on another app.

### docs

Feed it a markdown file, it will create groups from the h2s and choices from the h3s.

```js
let value = await docs(kitPath("API.md"))
```

### getAppState
### registerShortcut

Register a global shortcut that's only available for the duration of the script:

```js
registerShortcut("opt y", () => {
  say("You're done", {
    name: "Alice",
    rate: 0.5,
    pitch: 2
  });
  process.exit();
});
```
### unregisterShortcut

Unregister a global shortcut that was registered with `registerShortcut`:

```js
unregisterShortcut("opt y");
```

### startDrag

### eyeDropper

Show the eye dropper to select a color from the screen:

```js
hide()
let { sRGBHex } = await eyeDropper()

let css = `
.result {
    font-size: 24px;
    background-color: ${sRGBHex};
    width: 100%;
    height: 100%;
}    
`

await div({
  css,
  className: "result",
  html: `Color: ${sRGBHex}`,
  height: PROMPT.HEIGHT["2XL"],
})
```

### toast

**Description**  
Displays a small, dismissable notification popup in the corner of the screen.

**Signature**  
```ts
toast(message: string, options?: {
  duration?: number,
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left",
  type?: "info" | "success" | "warning" | "error"
}): Promise<void>
```

**Usage**  
```js
// Basic usage
await toast("Script completed successfully!")

// With options
await toast("Task failed", {
  duration: 5000, // 5 seconds
  position: "top-right",
  type: "error"
})

// Persistent toast (won't auto-dismiss)
await toast("Important message", {
  duration: 0
})
```

**Notes**  
- Works across all operating systems
- Multiple toasts will stack in the specified position
- Toasts can be manually dismissed by clicking

### mic

Display the `mic` prompt to record mic audio:

```js
let buffer = await mic()
let filePath = tmpPath(`audio-${formatDate(new Date(), "yyyy-MM-dd-HH-mm-ss")}.webm`)
await writeFile(filePath, buffer)
playAudioFile(filePath)
```

### mic.start and mic.stop

Start and stop the mic recording in any prompt:

```js
await div({
  html: md(`Recording for 5 seconds!`),
  onInit: async () => {    
    let filePath = await mic.start()
    await wait(5000)
    let buffer = await mic.stop()
    await revealFile(filePath)
  },
})
```

### PROMPT

An object map of widths and heights used for setting the size of the prompt:

```js
await editor({
  width: PROMPT.WIDTH["3XL"],
  height: PROMPT.HEIGHT["3XL"],
})
```


### preventSubmit

A global Symbol used in combination with `onSubmit` to prevent the prompt from submitting.

```js
let result = await arg({
  onSubmit: input => {
    if (!input.includes("go")) {
      setHint("You must include the word 'go'")
      return preventSubmit
    }
  },
})

inspect(result)
```

## Process

### cwd

`cwd` is the current working directory of the process. 

- When launching a script from the app, the `kenv` containing the scripts dir will be the current working directory. 
- When launching a script from the terminal, the current working directory will be the directory you're in when you launch the script.

```js
// Example: Joining the current working directory with a filename to create an absolute path
const currentWorkingDirectory = process.cwd();
const fullPathToFile = path.join(currentWorkingDirectory, 'example.txt');
console.log(`The full path to the file is: ${fullPathToFile}`);
```

### pid
```js
// Example: Logging the process ID to find it in the Activity Monitor/Task Manager
const processId = process.pid;
console.log(`This process has the ID: ${processId}`);
```


### uptime
```js
// Example: Logging the uptime of the process
const uptimeInSeconds = process.uptime();
console.log(`The process has been running for ${uptimeInSeconds} seconds.`);
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```
```

## Axios

### get
```js
const response = await get(url);
```

### put
```js
const response = await put(url, data);
```

### post
```js
const response = await post(url, data);
```

### patch
```js
const response = await patch(url, data);
```

## Chalk

### chalk
```js
const styledText = chalk.color('Hello World');
```

## Child Process

### spawn
```js
const child = child_process.spawn(command, args);
```

### spawnSync
```js
const result = child_process.spawnSync(command, args);
```

### fork
```js
const child = child_process.fork(modulePath, args);
```

## Custom

### ensureReadFile
```js
const fileContent = await ensureReadFile(filePath, defaultContent);
```

## Execa

### exec
```js
const { stdout } = await exec(command, args);
```

### execa
```js
const { stdout } = await execa(command, args);
```

### execaSync
```js
const { stdout } = execa.sync(command, args);
```

### execaCommand
```js
const { stdout } = await execa.command(command);
```

### execaCommandSync
```js
const { stdout } = execa.commandSync(command);
```

### execaNode
```js
const { stdout } = await execa.node(scriptPath, args);
```

## Download

### download
```js
await download(url, outputPath);
```

## FS-Extra

### emptyDir
```js
await emptyDir(directoryPath);
```

### ensureFile
```js
await ensureFile(filePath);
```

### ensureDir
```js
await ensureDir(directoryPath);
```

### ensureLink
```js
await ensureLink(srcPath, destPath);
```

### ensureSymlink
```js
await ensureSymlink(target, path);
```

### mkdirp
```js
await mkdirp(directoryPath);
```

### mkdirs
```js
await mkdirs(directoryPath);
```

### outputFile
```js
await outputFile(filePath, data);
```

### outputJson
```js
await outputJson(filePath, jsonObject);
```

### pathExists
```js
const exists = await pathExists(path);
```

### readJson
```js
const jsonObject = await readJson(filePath);
```

### remove
```js
await remove(path);
```

### writeJson
```js
await writeJson(filePath, jsonObject);
```

### move
```js
await move(srcPath, destPath);
```

## FS/Promises

### readFile
```js
const content = await readFile(filePath, encoding);
```

### writeFile
```js
await writeFile(filePath, data);
```

### appendFile
```js
await appendFile(filePath, data);
```

### readdir
```js
const files = await readdir(directoryPath);
```

### copyFile
```js
await copyFile(srcPath, destPath);
```

### stat
```js
const stats = await stat(path);
```

### lstat
```js
const stats = await lstat(path);
```

### rmdir
```js
await rmdir(directoryPath);
```

### unlink
```js
await unlink(filePath);
```

### symlink
```js
await symlink(target, path);
```

### readlink
```js
const linkString = await readlink(path);
```

### realpath
```js
const resolvedPath = await realpath(path);
```

### access
```js
await access(filePath, fs.constants.R_OK);
```

### rename
```js
await rename(oldPath, newPath);
```

## FS

### createReadStream
```js
const readStream = fs.createReadStream(filePath);
```

### createWriteStream
```js
const writeStream = fs.createWriteStream(filePath);
```

## Handlebars

### compile
```js
const template = Handlebars.compile(source);
const result = template(context);
```

## Marked

### md
```js
const html = marked(markdownString);
```

### marked
```js
const tokens = marked.lexer(markdownString);
const html = marked.parser(tokens);
```

## Crypto

### uuid
```js
const uniqueId = crypto.randomUUID();
```

## Replace-in-file

### replace
```js
const results = await replaceInFile({
  files: filePath,
  from: /searchRegex/g,
  to: 'replacementString',
});
```

## Stream

### Writable
```js
const writable = new stream.Writable({
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Readable
```js
const readable = new stream.Readable({
  read(size) {
    // Read logic here
  }
});
```

### Duplex
```js
const duplex = new stream.Duplex({
  read(size) {
    // Read logic here
  },
  write(chunk, encoding, callback) {
    // Write logic here
    callback();
  }
});
```

### Transform
```js
const transform = new stream.Transform({
  transform(chunk, encoding, callback) {
    // Transform logic here
    callback();
  }
});
```

## Globby

### globby
```js
let dmgFilePaths = await globby(home("Downloads", "*.dmg"));
let choices = dmgFilePaths.map((filePath) => {
  return {
    name: path.basename(filePath),
    value: filePath,
  };
});

let selectedDmgPath = await arg("Select", choices);
```

## Terminal Only

### stderr

Only useful when launching scripts from the terminal

```js
// Example: Writing an error message to the standard error stream
const errorMessage = 'An error occurred!';
stderr.write(`Error: ${errorMessage}\n`);
```

### stdin

Only useful when launching scripts from the terminal

```js
// Example: Reading user input from the standard input stream
stdin.setEncoding('utf-8');
console.log('Please enter your name:');
stdin.on('data', (name) => {
  console.log(`Hello, ${name.toString().trim()}!`);
  stdin.pause(); // Stop reading
});
```

### stdout

Only useful when launching scripts from the terminal

```js
// Example: Writing a message to the standard output stream
const message = 'Hello, World!';
process.stdout.write(`${message}\n`);
```


## Contribute

### Missing Something?

<!-- enter: Update Docs -->
<!-- value: download-md.js -->

These API docs are definitely incomplete and constantly evolving. If you're missing something, [suggest an edit](https://github.com/johnlindquist/kit-docs/blob/main/API.md) to the docs or open an issue on GitHub. 

Press <kbd>Enter</kbd> to download the latest docs

## System Integration

### menubar

**Description**  
Creates a custom menu bar item with a configurable icon, title, and submenu items.

**Signature**  
```ts
menubar(options: {
  icon?: string,       // Path to icon or emoji string
  title?: string,      // Text to show in menu bar
  items?: MenuItem[],  // Array of menu items
  onClick?: Function,  // Click handler for the menu bar item
  tooltip?: string     // Hover text
}): Promise<MenubarInstance>
```

**Usage**  
```js
// Basic menubar with icon
await menubar({
  icon: "🚀",
  title: "My App"
})

// Menubar with submenu items
await menubar({
  icon: "⚡️",
  title: "Tools",
  items: [
    {
      label: "Refresh",
      click: async () => {
        await toast("Refreshing...")
      }
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => open("settings.json")
    }
  ]
})

// Dynamic menubar with click handler
let count = 0
await menubar({
  title: `Count: ${count}`,
  onClick: async () => {
    count++
    await menubar({ title: `Count: ${count}` })
  }
})
```

**Notes**  
- The menubar item persists until explicitly removed or the script ends
- Can be updated dynamically by calling menubar() again with new options
- Supports both images and emoji as icons

### term

**Description**  
Opens an interactive terminal window that supports full TTY features, making it ideal for running commands that require user input.

**Signature**  
```ts
term(command?: string, options?: {
  cwd?: string,           // Working directory
  env?: Record<string, string>, // Environment variables
  shell?: string,         // Custom shell to use
  name?: string          // Terminal window title
}): Promise<void>
```

**Usage**  
```js
// Open a basic terminal
await term()

// Run a specific command
await term("npm install")

// Configure working directory and env vars
await term("yarn start", {
  cwd: home("projects/my-app"),
  env: { 
    NODE_ENV: "development"
  }
})

// Custom shell with title
await term("top", {
  shell: "/bin/zsh",
  name: "System Monitor"
})
```

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits
```

## Window Management

### focusWindow

**Description**  
Brings a window to the front and gives it focus based on its title or process name.

**Signature**  
```ts
focusWindow(options: {
  title?: string | RegExp,  // Window title to match
  appName?: string,         // Application name to match
  index?: number           // Index of window if multiple match
}): Promise<void>
```

**Usage**  
```js
// Focus by window title
await focusWindow({
  title: "Visual Studio Code"
})

// Focus by app name
await focusWindow({
  appName: "Chrome"
})

// Focus using regex pattern
await focusWindow({
  title: /Script Kit/i
})

// Focus specific window instance
await focusWindow({
  appName: "Terminal",
  index: 1  // Focus second terminal window
})
```

### setWindowPosition

**Description**  
Positions and resizes a window on screen using exact coordinates or preset layouts.

**Signature**  
```ts
setWindowPosition(options: {
  title?: string | RegExp,
  appName?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  preset?: "center" | "maximize" | "left" | "right"
}): Promise<void>
```

**Usage**  
```js
// Position by exact coordinates
await setWindowPosition({
  title: "Notes",
  x: 100,
  y: 100,
  width: 800,
  height: 600
})

// Use preset layouts
await setWindowPosition({
  appName: "Terminal",
  preset: "right"  // Snap to right half of screen
})

// Center a window
await setWindowPosition({
  title: "Calculator",
  preset: "center"
})
```

### organizeWindows

**Description**  
Automatically arranges multiple windows in a grid or other organized layout.

**Signature**  
```ts
organizeWindows(options?: {
  apps?: string[],     // List of app names to organize
  layout?: "grid" | "cascade" | "horizontal" | "vertical",
  screen?: number     // Target display screen number
}): Promise<void>
```

**Usage**  
```js
// Organize all windows in a grid
await organizeWindows()

// Organize specific apps
await organizeWindows({
  apps: ["Chrome", "VS Code", "Terminal"],
  layout: "grid"
})

// Cascade windows on second screen
await organizeWindows({
  layout: "cascade",
  screen: 1
})

// Split windows horizontally
await organizeWindows({
  apps: ["Editor", "Browser"],
  layout: "horizontal"
})
```

**Notes**  
- Window management APIs require appropriate system permissions
- Some operations may not work with certain apps that manage their own windows
- Multi-monitor setups are supported via the screen parameter
```
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

// Get active application
let app = await appleScript(`
  tell application "System Events"
    get name of first application process whose frontmost is true
  end tell
`)
```

**Notes**  
- macOS only
- Requires appropriate system permissions
- Can interact with any app that supports AppleScript

### fileSearch

**Description**  
Performs a system-wide file search with advanced filtering options.

**Signature**  
```ts
fileSearch(options: {
  query: string,
  directory?: string,
  type?: "file" | "directory" | "any",
  extensions?: string[],
  maxResults?: number
}): Promise<string[]>
```

**Usage**  
```js
// Basic file search
let files = await fileSearch({
  query: "report"
})

// Advanced search with filters
let images = await fileSearch({
  query: "vacation",
  directory: home("Pictures"),
  type: "file",
  extensions: [".jpg", ".png"],
  maxResults: 50
})

// Search for directories
let projects = await fileSearch({
  query: "node",
  type: "directory",
  directory: home("Developer")
})
```

**Notes**  
- Uses system indexing for fast results
- Supports fuzzy matching
- Can be resource intensive for large directories
```
```

## Automation & OS Tools

### scrapeSelector

**Description**  
Extracts content from a webpage using CSS selectors.

**Signature**  
```ts
scrapeSelector(url: string, selector: string, options?: {
  waitForSelector?: boolean,
  timeout?: number
}): Promise<string[]>
```

**Usage**  
```js
// Get all heading text from a webpage
let headings = await scrapeSelector(
  "https://example.com",
  "h1, h2, h3"
)

// Wait for dynamic content to load
let prices = await scrapeSelector(
  "https://shop.com",
  ".price",
  { waitForSelector: true, timeout: 5000 }
)
```

### getScreenshotFromWebpage

**Description**  
Captures a screenshot of a webpage or element within a webpage.

**Signature**  
```ts
getScreenshotFromWebpage(url: string, options?: {
  selector?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  quality?: number
}): Promise<Buffer>
```

**Usage**  
```js
// Capture full page
let screenshot = await getScreenshotFromWebpage(
  "https://example.com",
  { fullPage: true }
)
await writeFile("screenshot.png", screenshot)

// Capture specific element
let elementShot = await getScreenshotFromWebpage(
  "https://example.com",
  { 
    selector: "#hero-section",
    type: "jpeg",
    quality: 80
  }
)
```

### getWebpageAsPdf

**Description**  
Generates a PDF from a webpage.

**Signature**  
```ts
getWebpageAsPdf(url: string, options?: {
  format?: "Letter" | "A4" | "Legal",
  landscape?: boolean,
  margin?: { top?: string, right?: string, bottom?: string, left?: string }
}): Promise<Buffer>
```

**Usage**  
```js
// Basic PDF generation
let pdf = await getWebpageAsPdf("https://example.com")
await writeFile("webpage.pdf", pdf)

// Customized PDF
let customPdf = await getWebpageAsPdf("https://example.com", {
  format: "A4",
  landscape: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm"
  }
})
```

### appleScript

**Description**  
Executes AppleScript commands on macOS.

**Signature**  
```ts
appleScript(script: string): Promise<string>
```

**Usage**  
```js
// Display dialog
await appleScript(`
  display dialog "Hello from Script Kit!" ¬
  buttons {"OK", "Cancel"} ¬
  default button "OK"
`)

// Control system volume
await appleScript(`
  set volume output volume 50
`)

**Notes**  
- Supports full terminal features including colors and interactive input
- Best for commands requiring user interaction
- For non-interactive commands, prefer `exec` or `spawn`
- Terminal window closes when the command completes or user exits