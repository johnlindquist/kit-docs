Script Kit bundles [zx](https://github.com/google/zx) as the global `$`

Example from their docs (make sure to `cd` to the proper dir)

```js
await $`cat package.json | grep name`

let branch = await $`git branch --show-current`
await $`dep deploy --branch=${branch}`

await Promise.all([
  $`sleep 1; echo 1`,
  $`sleep 2; echo 2`,
  $`sleep 3; echo 3`,
])

let name = "foo bar"
await $`mkdir /tmp/${name}`
```
