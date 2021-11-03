## Display HTML

Use the `div` method to display html.

```js
await div(`<h1>Hi</h1>`)
```

### Add Padding

The second argument of `div` allows you to add [tailwind](https://tailwindcss.com/) classes to the container of your html. For example, `p-5` will add a `padding: 1.25rem;` to the container.

```js
await div(`<h1>Hi</h1>`, `p-5`)
```

## Display Markdown

Pass a string of markdown to the `md` method. This will convert the markdown to html which you can then pass to the `div`

```js
let html = md(`
# Hi
`)
await div(html)
```

If you want to highlight your markdown, pass the markdown string to the `await highlight()` method:

```js
let html = await highlight(`
# Hi
`)
await div(html)
```
