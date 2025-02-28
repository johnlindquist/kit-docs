---
slug: scriptlets
title: "Scriptlets"
sidebar_position: 2
---

# Scriptlets

### Basics

A scriptlet is a markdown file containing "mini scripts". Tiny actions that are grouped together.

For example:

Create a file `~/.kenv/scriptlets/url.md` with the following content.

> Note: create as many *.md files as need to keep organized

~~~markdown
# URLs

### Script Kit

```ts
await open('https://scriptkit.com')
```

## egghead.io

```ts
await open('https://egghead.io')
```
~~~

Each header 2 (##) will be added to the main Script Kit menu as a runnable script.

### Shared Functionaltiy

A codefence declared under the header 1 will be avaiable to use in all of the header 2 codefences. The entire Script Kit api is available!

~~~markdown
# Greet

```ts
function greet(message:string){
    notify(`Hello, ${message}`)
}
```

## Hi John

```ts
greet("John")
```


### Hi Mindy

```ts
greet("Mindy")
```
~~~

### Built-In Codefence Tools

Scriptlets provide "codefence tools" which describe what to do with the text inside the codefence.

~~~markdown
# Open

## Script Kit

```open
https://scriptkit.com
```

## egghead.io

```open
https://egghead.io
```
~~~

#### Example Codefence Tools

The following tools are supported:

- paste: Pastes the enclosed text to the focused application
- template: Open a template editor to fill out variables, then pastes to the focused application
- edit: Opens the path in your configured editor
- codefence language: Runs a snippet from other programming languages

> Note: for a codefence language to work, they need to already be installed/configured on your system


~~~
# Tools Overiew

## paste tool

Running this "paste" tool will paste the enclosed text into the focused app

```paste
You should check out Script Kit!
```

## template tool

Running this "template" scriptlet will prompt open a template editor where you can tab through the stops. Once the template is complete, submitting will paste it.

```template
Hello ${1|John,Mindy|},

Hope your are $2!

Sincerely,
$3
```

## edit tool

Running this "edit" scriptlet will open the path with the `KIT_EDITOR` defined in ~/.kenv/.env

```edit
~/dev/kit-docs
```

## python tool

```python
from pathlib import Path

path = Path.home() / 'hello-python.txt'
with open(str(path), 'w') as f:
    f.write('Hello from Python!')
print(f"File written to: {path}")
```
~~~

### Codefence Language Tools Map

Like the "python" example above, the following codefence languages are supported.

The codefence language will create a tmp file with the mapped extension, then attempt to run it in the built-in terminal with the mapped command: 

~~~ts
const toolExtensionMap = new Map([
  ['ruby', 'rb'],
  ['python', 'py'],
  ['python3', 'py'],
  ['perl', 'pl'],
  ['php', 'php'],
  ['node', 'js'],
  ['bash', 'sh'],
  ['powershell', 'ps1'],
  ['lua', 'lua'],
  ['r', 'r'],
  ['groovy', 'groovy'],
  ['scala', 'scala'],
  ['swift', 'swift'],
  ['go', 'go'],
  ['rust', 'rs'],
  ['java', 'java'],
  ['clojure', 'clj'],
  ['elixir', 'ex'],
  ['erlang', 'erl'],
  ['ocaml', 'ml'],
  ['osascript', 'scpt'],
  ['deno', 'ts'],
  ['kotlin', 'kt'],
  ['julia', 'jl'],
  ['dart', 'dart'],
  ['haskell', 'hs'],
  ['csharp', 'cs']
])

const toolCommandMap = new Map([
  ['ruby', (scriptPath) => `ruby ${scriptPath}`],
  ['python', (scriptPath) => `python ${scriptPath}`],
  ['python3', (scriptPath) => `python3 ${scriptPath}`],
  ['perl', (scriptPath) => `perl ${scriptPath}`],
  ['php', (scriptPath) => `php ${scriptPath}`],
  ['node', (scriptPath) => `node ${scriptPath}`],
  ['bash', (scriptPath) => `bash ${scriptPath}`],
  ['zsh', (scriptPath) => `zsh ${scriptPath}`],
  ['fish', (scriptPath) => `fish ${scriptPath}`],
  ['sh', (scriptPath) => `sh ${scriptPath}`],
  ['cmd', (scriptPath) => `cmd /s /c ${scriptPath}`],
  ['powershell', (scriptPath) => `powershell -File ${scriptPath}`],
  ['pwsh', (scriptPath) => `pwsh -File ${scriptPath}`],
  ['lua', (scriptPath) => `lua ${scriptPath}`],
  ['r', (scriptPath) => `Rscript ${scriptPath}`],
  ['groovy', (scriptPath) => `groovy ${scriptPath}`],
  ['scala', (scriptPath) => `scala ${scriptPath}`],
  ['swift', (scriptPath) => `swift ${scriptPath}`],
  ['go', (scriptPath) => `go run ${scriptPath}`],
  ['rust', (scriptPath) => `rustc ${scriptPath} -o ${scriptPath}.exe && ${scriptPath}.exe`],
  ['java', (scriptPath) => `java ${scriptPath}`],
  ['clojure', (scriptPath) => `clojure ${scriptPath}`],
  ['elixir', (scriptPath) => `elixir ${scriptPath}`],
  ['erlang', (scriptPath) => `escript ${scriptPath}`],
  ['ocaml', (scriptPath) => `ocaml ${scriptPath}`],
  ['osascript', (scriptPath) => `osascript ${scriptPath}`],
  ['deno', (scriptPath) => `deno run ${scriptPath}`],
  ['kotlin', (scriptPath) => `kotlinc -script ${scriptPath}`],
  ['julia', (scriptPath) => `julia ${scriptPath}`],
  ['dart', (scriptPath) => `dart run ${scriptPath}`],
  ['haskell', (scriptPath) => `runhaskell ${scriptPath}`],
  ['csharp', (scriptPath) => `dotnet script ${scriptPath}`]
])
~~~


### Scriptlet Placeholders

Any codefence can include a $0, $1, $2, etc to pormpt the user for finalized the scriptlet before it runs: 

~~~
# Placeholders

## Search Google Images

Will prompt for 2 arguments before opening the url:

```open
https://www.google.com/search?q=$0+$1
```
~~~