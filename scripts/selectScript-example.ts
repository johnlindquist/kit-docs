// Name: selectScript-example

import type { Script } from "@johnlindquist/kit";

const script = await selectScript(
  "Select a Shortcut Script to Edit",
  true, // "true" will load from ~/.kit/db/scripts.json cache
  (scripts: Script[]) => scripts.filter((script) => script.shortcut)
);

await edit(script.filePath);
