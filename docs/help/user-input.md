<meta path="help/user-input">
      
# User Input

Receive text from a user by adding `arg` to your script:

```js
let value = await arg()
```

`arg` will prompt the user to enter text, wait for the text, then return the value of the text to `value` and continue on with the script.
You can then use `value` as a string in your script however you want.

If you want to tell the user what information the prompt expects, provide a string:

```js
await arg("Please enter your name")
```

If you want give the user options to select, provide an array as the second argument:

```js
await arg("Select a fruit:", ["apple", "banana", "grape"])
```

## Drag and drop

Prompt the user to drag and drop a file by using the `drop` method:

```js
let filePath = await drop()
```

## Longer Text

Allow the user to input multiple lines of text using `textarea`:

```js
let text = await textarea()
```

Pre-load the `textarea` with text by passing a string:

```js
let pleaseEditMe = `Some text I want to edit`
let text = await textarea(pleaseEditMe)
```

## Code Editor

(💵 In the future, using `editor` will require a paid update)

Launch a full code editor using `editor`. This is great

```js
let text = await editor()
```

Pre-load the `editor` with text and specify a language for code highlighting/features:

```js
let text = `
# My Markdown

* one
* two
`
let text = await editor(text, "markdown")
```

## Keyboard Shortcut

```js
let keyData = await hotkey()
```

If you were to type `cmd+j`, `keyData` would give you the following response:

```json
{
  "key": "j",
  "command": true,
  "shift": false,
  "option": false,
  "control": false,
  "fn": false,
  "hyper": false,
  "os": false,
  "super": false,
  "win": false,
  "shortcut": "command j"
}
```
