// Name: kenvPath-example

import "@johnlindquist/kit";

const scriptsPath = kenvPath("scripts");
const scripts = await readdir(scriptsPath);
await editor(JSON.stringify(scripts, null, 2));
