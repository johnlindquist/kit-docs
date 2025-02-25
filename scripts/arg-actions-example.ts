// Name: arg-actions-example

import "@johnlindquist/kit";

const result = await arg(
  "What is your name?",
  ["John", "Mindy", "Ben"],
  [
    {
      name: "Submit Joy",
      shortcut: `${cmd}+j`,
      onAction: () => {
        submit("Joy");
      },
    },
  ]
);

await editor(JSON.stringify(result, null, 2));
