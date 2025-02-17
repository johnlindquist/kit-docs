// Name: onTab-example

import "@johnlindquist/kit";

onTab("People", async (event) => {
  await arg("Select a person", ["John", "Mindy", "Ben"]);
});

onTab("Animals", async (event) => {
  await arg("Select an animal", ["Dog", "Cat", "Bird"]);
});
