---
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


