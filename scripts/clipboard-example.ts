// Name: clipboard-example

import "@johnlindquist/kit";

// Write and read text to the clipboard
await clipboard.writeText("Hello from Script Kit!");
const result = await clipboard.readText();
await editor(result);
