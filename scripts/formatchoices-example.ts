// Name: formatChoices-example

import "@johnlindquist/kit";

const people = [
  {
    name: "Utah",
    choices: ["John", "Mindy"],
  },
  {
    name: "Alaska",
    choices: ["Beth"],
  },
];

const choices = formatChoices(people);

await arg("Select a person from their group", choices);
