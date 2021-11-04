## Adding Keyboard Shortcuts

Add a global shortcut to any script by adding the `//Shortcut: ` metadata:

```js
// Shortcut: option+g
```

In the `Run` tab, use the script options menu `>` to change a shortcut. (Hit `cmd+k` to toggle to the options menu)
In the `Kit` tab, you can run `Change script shortcut` to list all script with shortcuts and change them from there.

## Shortcodes

If you have a script you run often, you can also use "shortcodes" in the app. Add the following to the top of your script:

```js
// Shortcode: g
```

Now, when you launch the app, type `g` then hit `space` to run the script.

The main menu (`Run New Kit Help Hot`) also uses shortcodes, so typing `h` then space will switch to the `Help` tab. Or `n` then space switches to the `New` tab.
