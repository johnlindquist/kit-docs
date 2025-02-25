import "@johnlindquist/kit";

// Return an array of selected items
const multipleChoice = await select("Select one or more developer", [
  "John",
  "Nghia",
  "Mindy",
  "Joy",
]);

await editor(JSON.stringify(multipleChoice, null, 2));
