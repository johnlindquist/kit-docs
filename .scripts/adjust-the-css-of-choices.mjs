// dev/kit-docs/scripts/adjust-the-css-of-choices.ts
import "@johnlindquist/kit";
var choice = await arg({
  css: `
.light-purple {
  background-color: #c8a2c8;
}  
.medium-purple {
  background-color: #967bb6;
}
.dark-purple {
  background-color: #5d4777;
}

.focused {
  box-shadow: inset .5rem 0 0 0 #ffffffee;
}
  `,
  placeholder: "Choose a shade of purple",
  choices: [
    { name: "[L]ight Purple", value: "light-purple", className: "light-purple", focusedClassName: "focused" },
    { name: "[M]edium Purple", value: "medium-purple", className: "medium-purple", focusedClassName: "focused" },
    { name: "[D]ark Purple", value: "dark-purple", className: "dark-purple", focusedClassName: "focused" }
  ]
});
await div(md(`You chose ${choice}`));
