// Name: exit-example

import "@johnlindquist/kit";

// Prevent the script from running for more than 1 second
setTimeout(() => {
  exit();
}, 1000);

await arg("I will exit in 1 second");
