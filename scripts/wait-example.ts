// Name: wait-example

import "@johnlindquist/kit";

div(md(`Enjoying your wait?`));
await wait(1000);
div(md(`I waited 1 second. Let's wait some more!`));
await wait(1000);
await div(md(`All done!`));
