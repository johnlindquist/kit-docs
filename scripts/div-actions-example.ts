// Name: div-actions-example

import "@johnlindquist/kit";

const html = md(`# Hello World`);
await div(html, [
  {
    name: "Goodbye",
    onAction: () => {
      setDiv("Goodbye");
    },
  },
]);
