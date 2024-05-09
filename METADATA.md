---
slug: metadata
title: "Metadata"
sidebar_position: 5
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

| Option      | Description                                                                                   |
|-------------|-----------------------------------------------------------------------------------------------|
| Name        | Specifies the name of the script as it appears in the Script Kit interface.                   |
| Description | Provides a brief description of the script's functionality.                                   |
| Shortcut    | Defines a global keyboard shortcut to trigger the script.                                     |
| Snippet     | Designates the script as a text expansion snippet and specifies the trigger text.             |
| Keyword     | Associates a keyword with the script for easier discovery in the main menu.                   |
| Pass        | Indicates that user input in the main menu should be passed as an argument to the script.     |
| Group       | Assigns the script to a specific group for organization in the main menu.                     |
| Exclude     | Excludes the script from appearing in the main menu.                                          |
| Watch       | Specifies a file or directory to watch for changes, triggering the script upon modifications. |
| Background  | Designates the script as a background process, running continuously in the background.        |
| System      | Associates the script with system events such as sleep, wake, or shutdown.                    |
| Schedule    | Specifies a cron expression for scheduling the script to run at specific times or intervals.  |


## Name

Specifies the name of the script as it appears in the Script Kit interface.

## Description

Provides a brief description of the script's functionality.

## Shortcut

Defines a global keyboard shortcut to trigger the script.

## Snippet

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


## Keyword

Associates a keyword with the script for easier discovery in the main menu.

## Pass

TODO: Please contribute a description

## Group

TODO: Please contribute a description

## Exclude

TODO: Please contribute a description

## Watch

TODO: Please contribute a description

## Background

TODO: Please contribute a description

## System

TODO: Please contribute a description

## Schedule

TODO: Please contribute a description

Ricardo Bassete has written a useful Cron Builder tool: https://github.com/johnlindquist/kit/discussions/1441

