// Name: path-example-startingpath
// Shortcut: opt p

import "@johnlindquist/kit";

const projectPath = await path({
  startPath: home("dev"),
  hint: "Select a project from your dev folder",
});

await editor(projectPath);
