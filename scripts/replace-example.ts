// Name: replace-example

import "@johnlindquist/kit";

const mdPath = kenvPath("sticky.md");

await replace({
  files: [mdPath],
  from: /nice/g, // replace all instances of "nice"
  to: "great",
});
