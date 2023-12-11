// dev/kit-docs/scripts/generate-tips.ts
var scripts = await getScripts();
var kenv = path.basename(projectPath());
var isKitDocsInAKenv = kenv !== ".kenv";
var outFilePath = projectPath("TIPS.md");
if (isKitDocsInAKenv) {
  scripts = scripts.filter((script) => script.kenv === kenv);
}
scripts.sort((a, b) => a.group.localeCompare(b.group));
var groups = {};
for (let script of scripts) {
  if (!groups[script.group])
    groups[script.group] = [];
  groups[script.group].push(script);
}
var markdownBody = ``;
for (let [group, scripts2] of Object.entries(groups)) {
  markdownBody += `## ${group}

`;
  for (let script of scripts2.sort((a, b) => a.name.localeCompare(b.name))) {
    let content = await readFile(script.filePath, "utf8");
    markdownBody += `### ${script.name}

`;
    markdownBody += "```ts\n";
    markdownBody += content;
    markdownBody += "\n```\n\n";
  }
}
var markdown = `# Tips

Tips are a collection of answers to user questions in GitHub Discussions and our Discord organized by topic.

${markdownBody}
`.trim();
await writeFile(outFilePath, markdown);
