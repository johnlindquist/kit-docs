// dev/kit-docs/scripts/select-a-choice-with-a-single-keystroke.ts
import "@johnlindquist/kit";
var choice = await arg({
  placeholder: "Choose a color",
  choices: [
    { name: "[R]ed", value: "red" },
    { name: "[G]reen", value: "green" },
    { name: "[B]lue", value: "blue" }
  ]
});
await div(md(`You chose ${choice}`));
