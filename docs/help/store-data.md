## Read/Write to a `.env` file

Use `await env("SOME_KEY")` to check if the value exists in the `~/.kenv/.env` file, if not, prompt the user to enter it and store it for the next time the script is run

```js
let value = await env("MY_KEY")
```
