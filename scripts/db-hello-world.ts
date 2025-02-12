// Name: db-hello-world

import "@johnlindquist/kit";

// Pre-populate the database with some items

const peopleDb = await db({
  people: [
    {
      name: "John",
      age: 30,
      city: "San Francisco",
    },
    {
      name: "Jane",
      age: 25,
      city: "New York",
    },
  ] as Person[],
});

const person = await arg<Person>("Select a person", peopleDb.people);
// Do something with the person...

const [name, age, city] = await fields({
  fields: ["name", "age", "city"],
  enter: "Add",
  description: "Add a new person to the database",
});

peopleDb.people.push({ name, age: parseInt(age), city });

await peopleDb.write();

await editor(JSON.stringify(peopleDb.people, null, 2));

type Person = {
  name: string;
  age: number;
  city: string;
};
