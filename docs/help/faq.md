<meta path="help/faq">
      
## What is Script Kit?

Script Kit is an open-source dev tool for creating, running, editing, and sharing scripts.

These scripts can run in the Kit.app, the Terminal, GitHub actions, package.json scripts, webhooks, or pretty much anywhere.

## Community of Scripters?

The main goal of Script Kit is to build a community of people who love to script away the frictions of their day! 🥰

## What are Kit.app, kit, and kenvs?

- Kit.app - The Kit.app provides a UI for your scripts. The app is "script-driven" meaning that every time you launch the app, you're really launching a script. The main menu, even though complex, is a script you could write.

- kit - "kit" is the sdk of Script Kit

  - A bundle of JavaScript common libs wrapped by an API to make writing scripts easier (`get`, `download`, `replace`, `outputFile`, etc)
  - APIs for interacting with your OS (`edit`, `focusTab`, `say`, `notify`, etc)
  - APIs for interacting with Kit.app and Terminal (`arg`, `env`, etc)
  - Scripts and utils for app setup, managing kenvs, parsing scripts, etc

- kenvs - Kit Enviroments (AKA "kenv") are directories that contain a "scripts" directory. If you point "kit" at a "kenv", kit will parse the scripts and give you tools to simplify running and managing them.
