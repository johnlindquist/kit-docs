// dev/kit-docs/scripts/cancel-audio-with-keyboard-shortcut.ts
import "@johnlindquist/kit";
say(`I have so much to say I'm just going to keep talking until someone shuts me up`);
registerShortcut("opt x", () => {
  say("");
  process.exit();
});
registerShortcut("opt y", () => {
  say("You're done", {
    name: "Alice",
    rate: 0.5,
    pitch: 2
  });
  process.exit();
});
