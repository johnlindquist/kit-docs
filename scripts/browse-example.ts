// Name: browse-example

import "@johnlindquist/kit";

// When executing a command without UI, "hide" allows you to instantly hide the UI rather than waiting for the command to finish
await hide();
await browse("https://scriptkit.com");
