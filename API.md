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

### micro

Same API as `arg`, but with a tiny, adorable UI.

### env

Load an env var if it exists, prompt to set the env var if not:

You can also prompt the user to set the env var using a prompt by nesting it in an async function:

### editor

The `editor` function opens a text editor with the given text. The editor is a full-featured "Monaco" editor with syntax highlighting, find/replace, and more. The editor is a great way to edit or update text to write a file. The default language is markdown.

### div

`div` displays HTML. Pass a string of HTML to `div` to render it. `div` is commonly used in conjunction with `md` to render markdown.

1. Just like arg, the first argument is a string or a prompt configuration object.
2. Optional:The second argument is a string of tailwind class to apply to the container, e.g., `bg-white p-4`.

### term

The `term` function opens a terminal window. The terminal is a full-featured terminal, but only intended for running commands and CLI tools that require user input. `term` is not suitable for long-running processes (try `exec` instead).

1. Optional: the first argument is a command to run with the terminal

### template

The `template` prompt will present the editor populated by your template. You can then tab through each variable in your template and edit it. 

1. The first argument is a string template. Add variables using $1, $2, etc. You can also use 

[//]: # (\${1:default value} to set a default value.&#41;)

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

### drop

Use `await drop()` to prompt the user to drop a file or folder.

### fields

The `fields` prompt allows you to rapidly create a form with fields. 

1. An array of labels or objects with label and field properties.

### form

Use an HTML form which returns an Object based on the names of the form fields.

### chat

A chat prompt. Use `chat.addMessage()` to insert messages into the chat.

> Note: Manually invoke `submit` inside of a shortcut/action/etc to end the chat.

Also see the included "chatgpt" example for a much more advanced scenario.

### selectFile

Prompt the user to select a file using the Finder dialog:

### selectFolder

Prompt the user to select a folder using the Finder dialog:

### path

The `path` prompt allows you to select a file or folder from the file system. You navigate with tab/shift+tab (or right/left arrows) and enter to select.

1. Optional: The first argument is the initial directory to open with. Defaults to the home directory.

### select

`select` lets you choose from a list of options.

1. The first argument is a array or a prompt configuration object.
2. The second argument is a list of choices, a array to render, or a function that returns choices or a string to render.

### inspect

`inspect` takes an object and writes out a text file you can use to read/copy/paste the values from:

> Note: It will automatically convert objects to JSON to display them in the file

### dev

`dev` Opens a standalone instance of Chrome Dev Tools so you can play with JavaScript in the console. Passing in an object will set the variable `x` to your object in the console making it easy to inspect.

1. Optional: the first argument is an object to set to the variable `x` to in the console.

### find

A file search prompt

### webcam

Prompt for webcam access. Press enter to capture an image buffer:

## Choices

### formatChoices

Formats an array of choices.

- If a choice is not an object, it is converted to a basic choice object.
- If a choice has a nested `choices` array (i.e. represents a group), then:
   1. The group header is formatted (its `group` property is preserved if already set, or defaulted to its name).
   2. Its sub-choices are formatted in their original order.
   3. After processing the sub‑choices, any items with an `index` property are re‑inserted at the appropriate positions.
- For top‑level non-group items, if every item is non‑group, then we re‑insert the indexed items in the final array.

Parameters:
- `choices`: An array of choices or simple values
- `className`: An optional default className

Returns the formatted array of choices.


## Advanced

### onTab

onTab allows you to build a menu where prompts are organized under a tab. Press Tab/Shift+Tab to navigate between prompts.

### openActions

Manually open the actions menu

## Alerts

### beep

Beep the system speaker:

### say

Say something using the built-in text-to-speech:

### setStatus

Set the system menu bar icon and message. 
Each status message will be appended to a list. 
Clicking on the menu will display the list of messages. 
The status and messages will be dismissed once the tray closes, so use `log` if you want to persist messages.

### menu

Set the system menu to a custom message/emoji with a list of scripts to run.

### notify

Send a system notification

> Note: osx notifications require permissions for "Terminal Notifier" in the system preferences. Due to the complicated nature of configuring notifications, please use a search engine to find the latest instructions for your osx version.
> In the Script Kit menu bar icon: "Permissions -> Request Notification Permissions" might help.

## Widget

### widget

A `widget` creates a new window using HTML. The HTML can be styled via [Tailwind CSS](https://tailwindcss.com/docs/utility-first) class names.
Templating and interactivity can be added via [petite-vue](https://github.com/vuejs/petite-vue).

1. The first argument is a string of HTML to render in the window.
2. Optional: the second argument is ["Browser Window Options"](https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions)

## Commands

### exec

`exec` uses allows you to run shell commands within your script:
> Note: Execa is an alias for `execaCommand` from the `execa` npm package with "shell" and "all" true by default.

## Pro APIs

### term

Opens a built-in Terminal window.

- Can run interactive commands
- Supports custom working directory and shell

### showLogWindow

Opens a logs window to display script output.

- Displays output from all scripts run in the current session

## Platform APIs

### scatterWindows

Evenly spaces out all open windows across the screen in a neat grid.

- Only tested on macOS.  
- May require accessibility permissions if it's moving windows across multiple monitors.

### focusKitWindow

Brings the Script Kit window into focus.

- Only tested on macOS.  
- May require accessibility permissions.

### attemptScriptFocus

Attempts to bring the Script Kit window into focus.

- Only tested on macOS.  
- May require accessibility permissions.

### getKitWindows

Retrieves the Script Kit window objects.

- Only tested on macOS.  
- May require accessibility permissions.

### focusWindow

Brings a specific window into focus.

- Only tested on macOS.  
- May require accessibility permissions.

### focusAppWindow

Brings a specific application window into focus.

- Only tested on macOS.  
- May require accessibility permissions.

### setWindowPosition

Sets the position of a specific window.

- Only tested on macOS.  
- May require accessibility permissions.

### setWindowPositionByIndex

Sets the position of a window based on its index.

- Only tested on macOS.  
- May require accessibility permissions.

### scatterWindows

Evenly spaces out all open windows across the screen in a neat grid.

- Only tested on macOS.  
- May require accessibility permissions if it's moving windows across multiple monitors.

### organizeWindows

Organizes windows in a specific way.

- Only tested on macOS.  
- May require accessibility permissions.

### tileWindow

Tiles a specific window.

- Only tested on macOS.  
- May require accessibility permissions.

### scrapeSelector

Scrapes a webpage using a CSS selector.

### scrapeAttribute

Scrapes a webpage and extracts an attribute value.

### getScreenshotFromWebpage

Captures a screenshot of a webpage.

### getWebpageAsPdf

Converts a webpage to a PDF.

### applescript

Executes an applescript string

- Only tested on macOS
- May require additional permissions or configurations

### lock

Locks the screen.

- Only tested on macOS
- May require additional permissions or configurations

### logout

Logs out the current user.

- Only tested on macOS
- May require additional permissions or configurations  

### shutdown

Shuts down the computer.

- Only tested on macOS
- May require additional permissions or configurations

### shutdown

Shuts down the computer.

- Only tested on macOS
- May require additional permissions or configurations

### sleep

Puts the computer to sleep.

  - Only tested on macOS
- May require additional permissions or configurations

### sleep

Puts the computer to sleep.

- Only tested on macOS
- May require additional permissions or configurations

### sleep

Puts the computer to sleep.

- Only tested on macOS
- May require additional permissions or configurations

### fileSearch

Searches for files on the filesystem.

- Only tested on macOS
- May require additional permissions or configurations

### copyPathAsImage

Copies a file path as an image to the clipboard.

- Only tested on macOS
- May require additional permissions or configurations

### copyPathAsImage

Copies a file path as an image to the clipboard.

- Only tested on macOS
- May require additional permissions or configurations

### copyPathAsImage

Copies a file path as an image to the clipboard.

- Only tested on macOS
- May require additional permissions or configurations

### getWindows

Retrieves information about open windows.

- Only tested on macOS
- May require additional permissions or configurations

### getWindowsBounds

Retrieves the bounds of open windows.

- Only tested on macOS
- May require additional permissions or configurations

## Utils

### edit

Open a file using the KIT_EDITOR env variable

(For example, set KIT_EDITOR=/usr/local/bin/cursor)

### run

Run another script from the same kenv

### home

Create a path relative to the user's home directory

### get

An alias for axios.get

### post

An alias for axios.post

### put

An alias for axios.put

### patch

An alias for axios.patch

### del

An alias for axios.delete

### download

Download a file from a URL

### replace

Replace a string or regex in one or more files

### md

Convert markdown to HTML for rendering in prompts

### compile

Create a handlebars template compiler

### uuid

Generate a UUID

### globby

Glob a list of files

### isFile

Check if a path is a file

### isDir

Check if a path is a directory

### isBin

Check if a path can be executed

### browse

Open a URL in the default browser.

### formatDate

Formats a date

### trash

Moves files or directories to the trash.

- Only tested on macOS
- May require additional permissions or configurations

### git

Git utility functions.

- Only tested on macOS
- May require additional permissions or configurations

### degit

Clones a GitHub repository using degit.

- Only tested on macOS
- May require additional permissions or configurations

### openApp

Opens an application.

- Only tested on macOS
- May require additional permissions or configurations

### createGist

Creates a GitHub gist.

- Only tested on macOS
- May require additional permissions or configurations

### npm

> Deprecated: Use standard `import` instead.

Installs an npm package.

- Only tested on macOS
- May require additional permissions or configurations

### attemptImport

Attempts to import a module.

### silentAttemptImport

Attempts to import a module silently.

- Only tested on macOS
- May require additional permissions or configurations

### store

Stores data in a persistent key-value store.

- Only tested on macOS
- May require additional permissions or configurations

### db

An extremely simple database that persists to a file.

### memoryMap

Manages a memory map of objects.

### show

Shows the main prompt.

### hide

Hides the main prompt.

### setPanel

Sets the panel content.

### setPrompt

Sets the prompt content.

### setPreview

Sets the preview content.

### setIgnoreBlur

Sets whether to ignore blur events.

### removeClipboardItem

Removes an item from the clipboard.

### clearClipboardHistory

Clears the clipboard history.

### setScoredChoices

Sets scored choices for a prompt.

### setSelectedChoices

Sets selected choices for a prompt.

### groupChoices

Groups choices for a prompt.

### preload

Preloads data for a prompt.

### select

Prompts the user to select one or more options.

### grid

Prompts the user to select one or more options in a grid layout.

### mini

Prompts the user for input in a compact format.

### micro

Prompts the user for input in a tiny, adorable format.

### getMediaDevices

Retrieves available media devices.

### getTypedText

Retrieves typed text from the user.

### toast

Displays a small pop-up notification inside the Script Kit window.

### metadata

Define additional information and capabilities for your script:

The `metadata` object can include:

- `author`: Creator's name
- `name`: Display name in Script Kit UI (defaults to filename)
- `description`: Brief script summary
- `enter`: Text shown on Enter button
- `alias`: Alternative search term
- `image`: Path to script icon
- `shortcut`: Global keyboard shortcut
- `shortcode`: Execute when typed + space in menu
- `trigger`: Execute when typed in menu
- `expand`: Text expansion trigger (replaces deprecated `snippet`)
- `keyword`: Search keyword for menu
- `pass`: Pass menu input as arg (true/string/RegExp)
- `group`: Menu organization category
- `exclude`: Hide from menu
- `watch`: File/dir to watch for changes
- `log`: Disable logging if false
- `background`: Run as background process
- `timeout`: Auto-terminate after seconds
- `system`: Trigger on system events (sleep/wake/etc)
- `schedule`: Cron expression for timing
- `access`: REST API access level (public/key/private)
- `response`: Allow REST API response
- `index`: Order within group

## SDK Utils

### kitPath

Create a path relative to the kit directory.

### kenvPath

Create a path relative to the "kenv" (kit environment) directory

### tmpPath

Create a path relative to a "kit" directory in the system temp directory

> Note: The tmp directory is symlinked to the ~/.kenv/tmp directory for easy access

### getScripts

Get all scripts

### selectScript

Allows you to build a custom script selection menu

## Closing Thoughts

### Alternate Importing

Also, you can import `kit` and access the APIs like so:

```ts
import kit from "@johnlindquist/kit"

await kit.arg("Enter your name")
```