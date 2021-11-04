## Read/Write to a `.env` file

Use `await env("SOME_KEY")` to check if the value exists in the `~/.kenv/.env` file, if not, prompt the user to enter it and store it for the next time the script is run

```js
let value = await env("MY_KEY")
```

## Read/Write Data to a json file `db`

The `db` method will create a json file to store values for you in `~/.kenv/db`.

```js
let data = await db({ values: [] })

let value = await arg("Type something")

data.values.push(value)
await data.write()
```
