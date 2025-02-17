// Name: openActions-example

import "@johnlindquist/kit";

await arg(
  {
    onInit: async () => {
      // Automatically open the actions menu
      openActions();
    },
  },
  ["John", "Mindy"],
  [
    {
      name: "Submit Ben Instead",
      onAction: async (name) => {
        submit("Ben");
      },
    },
  ]
);
