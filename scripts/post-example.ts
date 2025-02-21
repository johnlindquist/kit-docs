// Name: post-example

import "@johnlindquist/kit";

const result = await post("https://jsonplaceholder.typicode.com/posts", {
  title: "foo",
  body: "bar",
  userId: 1,
});

await editor(JSON.stringify(result.data));
