// Name: Preview Markdown
// Group: Editor

import "@johnlindquist/kit"

let value = `
# Hello World

## Markdown Features

Here are some examples of markdown features:

- **Bold Text**
- *Italic Text*
- \`Inline Code\`

1. First item in a numbered list
2. Second item in a numbered list

> Blockquote

![Image Alt Text](https://example.com/image.jpg "Image Title")

~~~javascript
console.log("Code block with syntax highlighting");
~~~

Here is a table:

| Header 1 | Header 2 |
| -------- | -------- |
| Row 1 Col 1 | Row 1 Col 2 |
| Row 2 Col 1 | Row 2 Col 2 |
`.trim()

await editor({
  value,
  onInput: async input => {
    setPreview(md(input))
  },
})
