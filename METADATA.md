---
slug: metadata
title: Metadata
sidebar_position: 6
---

# Metadata Reference

Metadata are comments at the top of your scripts. You have most likely encountered
```ts
// Name: ...
```
and
```ts
// Description: ...
```
before.

There are many more of these options that control how scripts behave:

```ts
export interface Metadata {
  /**
   * Specifies the name of the script as it appears in the Script Kit interface.
   * If not provided, the file name will be used.
   */
  name?: string
  /** Provides a brief description of the script's functionality. */
  description?: string
  /** Defines an alternative search term to find this script */
  alias?: string
  /** Defines the path to an image to be used for the script */
  image?: string
  /** Defines a global keyboard shortcut to trigger the script. */
  shortcut?: string
  /**
   * Similar to {@link trigger}, defines a string that, when typed in the main menu
   * followed by a space, immediately executes the script.
   */
  shortcode?: string
  /**
   * Similar to {@link shortcode}, defines a string that, when typed in the main menu,
   * immediately executes the script.
   */
  trigger?: string
  /** Designates the script as a text expansion snippet and specifies the trigger text. */
  snippet?: string
  /** Associates a keyword with the script for easier discovery in the main menu. */
  keyword?: string
  /** Indicates that user input in the main menu should be passed as an argument to the script. */
  pass?: boolean
  /** Assigns the script to a specific group for organization in the main menu. */
  group?: string
  /** Excludes the script from appearing in the main menu. */
  exclude?: boolean
  /** Specifies a file or directory to watch for changes, triggering the script upon modifications. */
  watch?: string
  /** Indicates whether to elevate the log level during script execution */
  verbose?: boolean
  /** Indicates whether to disable logs */
  log?: boolean
  /** Designates the script as a background process, running continuously in the background. */
  background?: boolean
  /** Defines the number of seconds after which the script will be terminated */
  timeout?: number
  /** Associates the script with system events such as sleep, wake, or shutdown. */
  system?:
    | "suspend"
    | "resume"
    | "on-ac"
    | "on-battery"
    | "shutdown"
    | "lock-screen"
    | "unlock-screen"
    | "user-did-become-active"
    | "user-did-resign-active"
    | string
  /** Specifies a cron expression for scheduling the script to run at specific times or intervals. */
  schedule?: CronExpression
}
```

## The Metadata Options in Detail

### Name

Specifies the name of the script as it appears in the Script Kit interface. If not provided, the file name will be used.

### Description

Provides a brief description of the script's functionality.

### Alias

Defines an alternative search term to find this script.

### Image

Defines the path to an image to be used for the script.

### Shortcut

Defines a global keyboard shortcut to trigger the script.

### Shortcode

Similar to `trigger`, defines a string that, when typed in the main menu followed by a space, immediately executes the script.

### Trigger

Similar to `shortcode`, defines a string that, when typed in the main menu, immediately executes the script.

### Snippet

Specifies a string of text that, when typed anywhere, executes the subsequent script.\
The `*` character can be used as a wildcard and can be backreferenced using the global `args` array.

Recommendation: It might make sense to mark snippets as `// Exclude: true`, since it's rarely useful to execute them 
directly from the main menu.

Note that the snippet is case-sensitive, so wildcards must be used to match both upper and lower case letters.

**Example:**

```ts
// Name: I'm too lazy to type "Script Kit"
// Snippet: sk

import "@johnlindquist/kit"

await keyboard.type("Script Kit")
```

With this script, when you type "sk" anywhere, the "sk" text will disappear and be replaced by "Script Kit".


### Keyword

Associates a keyword with the script for easier discovery in the main menu.

### Pass

Allows the user to pass a string as input to the script, either from the main menu or as argument in the terminal.

A **pattern** is also possible and show the script in the main menu only if the pattern matches.\

```ts
// Pass /.*\.exe/g
```
This example will match any string ending with `.exe` 

### Group

The group the script belongs to in the main menu.

### Exclude

Whether to display the script in the main menu.

### Watch

The `// Watch` metadata enables you to watch for changes to a file on your system.

```js
// Watch: ~/Downloads/*.{zip,7z}
```

It uses [Chokidar](https://github.com/paulmillr/chokidar) under the hood, so it supports the same glob patterns. 
Please use cautiously, as this can cause a lot of scripts to run at once and potentially cause infinite loops.

### Verbose

Indicates whether to elevate the log level during script execution.

### Log

Indicates whether to disable logs.

### Background

Runs the script continuously in the background. When this metadata is used, running the script will give you options
to start, stop, or view logs for the background process.

### Timeout

Defines the number of seconds after which the script will be terminated.

### System

Add the `System` metadata to run your script on a system event

```js
// System: unlock-screen
```

Available events:

- suspend
- resume
- on-ac
- on-battery
- shutdown
- lock-screen
- unlock-screen
- user-did-become-active
- user-did-resign-active
- Read about the available events [here](https://www.electronjs.org/docs/latest/api/power-monitor#events)

### Schedule

Runs the script at specified times of the day.

```ts
// Schedule: 0 */6 * * *
```

You can use [@JosXa's Cron Expression Validator](https://github.com/johnlindquist/kit/discussions/1486) to generate 
and humanize cron expressions.

