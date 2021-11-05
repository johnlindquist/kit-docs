<meta path="new/new">
      
## Pro-tips

1. The fastest way to create a script: Launch the app as you normally would, then type

```bash
new my-script-name
```

Then hit _Enter_.

2. You can use TypeScript by opening the `Kit` tab and "Switch to TypeScript Mode"

3. The files in the `~/.kenv/templates` dir will be used when creating new scripts. You can create a template with your personal data filled out `~/.kenv/templates/john.js` then in your `.env`, set `KIT_TEMPLATE=john`

```js
// Author: John Lindquist
// Twitter: @johnlindquist
```

## Why the Comment?

Creating a new script will add this comment to the top:

```js
/** @type {import("@johnlindquist/kit")} */
```

The line is _not_ required, but this comment helps code editors to apply the correct type definition files for autocomplete/code-hinting.

If you're in `TypeScript` mode (`Kit` tab, `Switch to TypeScript mode`), it will add this import to the top:

```js
import "@johnlindquist/kit"
```

Again, this line isn't required, but code editors using TypeScript will complain about `top-level await` if you don't include at least one import. This also helps the same way as the comment described above.
