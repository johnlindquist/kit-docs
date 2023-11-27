// Name: Generate Tips.md from Scripts
// Group: Markdown

import { Script } from "@johnlindquist/kit"

let scripts = await getScripts()

// Check if kit-docs is a kenv

let kenv = path.basename(projectPath())
let isKitDocsInAKenv = kenv !== ".kenv"
let outFilePath = projectPath("TIPS.md")

if (isKitDocsInAKenv) {
  scripts = scripts.filter(script => script.kenv === kenv)
}

scripts.sort((a, b) => a.group.localeCompare(b.group))

// Group by group
let groups: {
  [key: string]: Script[]
} = {}
for (let script of scripts) {
  if (!groups[script.group]) groups[script.group] = []
  groups[script.group].push(script)
}

// Convert Groups into Markdown h2's with the Content Below
let markdownBody = ``
for (let [group, scripts] of Object.entries(groups)) {
  markdownBody += `## ${group}\n\n`
  for (let script of scripts.sort((a, b) => a.name.localeCompare(b.name))) {
    let content = await readFile(script.filePath, "utf8")
    markdownBody += `### ${script.name}\n\n`
    markdownBody += "```ts\n"
    markdownBody += content
    markdownBody += "\n```\n\n"
  }
}

let markdown = `# Tips

Tips are a collection of answers to user questions in GitHub Discussions and our Discord organized by topic.

${markdownBody}
`.trim()

await writeFile(outFilePath, markdown)
