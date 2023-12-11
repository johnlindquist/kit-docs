// dev/kit-docs/scripts/return-to-the-main-script-on-escape.ts
import "@johnlindquist/kit";
await div({
  html: md(`# Hello`),
  shortcuts: [
    {
      key: "escape",
      onPress: async () => {
        await mainScript();
      }
    }
  ]
});
