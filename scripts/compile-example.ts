// Name: compile-example

import "@johnlindquist/kit";

const compiler = compile(`
Hello {{name}}

Have a {{mood}} day!

{{#if from}}
From {{author}}
{{/if}}
`);

const result = compiler({
  name: "John",
  mood: "great",
  author: "Script Kit",
  from: true,
});

await div(result);
