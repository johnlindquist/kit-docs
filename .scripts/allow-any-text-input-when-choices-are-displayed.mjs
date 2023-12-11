// dev/kit-docs/scripts/allow-any-text-input-when-choices-are-displayed.ts
import "@johnlindquist/kit";
var fruit = await arg(
  {
    placeholder: "Select a fruit",
    hint: "Type 'Grape' and hit enter",
    strict: false
  },
  ["Apple", "Banana", "Cherry"]
);
await div(md(fruit));
