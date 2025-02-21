// Name: globby-example

import "@johnlindquist/kit";

const kenvScripts = kenvPath("scripts", "*.ts");
const kenvScriptlets = kenvPath("scriptlets", "*.md");

const pathsForScriptsAndScriptlets = await globby([
  kenvScripts,
  kenvScriptlets,
]);
await editor(JSON.stringify(pathsForScriptsAndScriptlets, null, 2));
