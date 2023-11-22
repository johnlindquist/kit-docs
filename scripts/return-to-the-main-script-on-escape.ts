// Name: Return to the Main Script on Escape
// Group: Prompt

import "@johnlindquist/kit"

await div({
  html: md(`# Hello`),
  shortcuts: [
    {
      key: "escape",
      onPress: async () => {
        await mainScript()
      },
    },
  ],
})
