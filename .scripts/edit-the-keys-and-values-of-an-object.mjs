// dev/kit-docs/scripts/edit-the-keys-and-values-of-an-object.ts
import "@johnlindquist/kit";
var data = {
  name: "John",
  age: 42,
  location: "USA"
};
var result = await fields(
  Object.entries(data).map(([key, value]) => ({
    name: key,
    label: key,
    value: String(value)
  }))
);
var newData = Object.entries(data).map(([key], i) => ({
  [key]: result[i]
}));
inspect(newData);
