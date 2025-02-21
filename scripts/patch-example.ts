// Name: patch-example

import "@johnlindquist/kit";

const result = await patch("https://jsonplaceholder.typicode.com/posts/1", {
  title: "foo",
});

await editor(JSON.stringify(result.data));
