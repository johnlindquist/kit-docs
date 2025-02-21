// Name: getScripts-example

import "@johnlindquist/kit";

// Get all scripts from ~/.kit/db/scripts.json
const scripts = await getScripts();
const script = await arg("Select a script", scripts);
await editor(JSON.stringify(script, null, 2));
