// Name: editor-actions-example

import "@johnlindquist/kit";

await editor("Hello World", [
  {
    name: "Exclaim",
    shortcut: `${cmd}+2`,
    visible: true, // show the action in the shortcuts bar
    onAction: () => {
      editor.append("!");
    },
  },
  {
    name: "Clear",
    shortcut: `${cmd}+`,
    visible: true, // show the action in the shortcuts bar
    onAction: () => {
      editor.setText("");
    },
  },
]);
