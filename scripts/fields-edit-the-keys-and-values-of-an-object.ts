// Name: Edit the Keys and Values of an Object
// Group: Data

import "@johnlindquist/kit";

let data = {
  name: "John",
  age: 42,
  location: "USA",
};

let result = await fields(
  Object.entries(data).map(([key, value]) => ({
    name: key,
    label: key,
    value: String(value),
  }))
);

let newData = Object.entries(data).map(([key], i) => ({
  [key]: result[i],
}));

inspect(newData);
