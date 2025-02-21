// Name: put-example

import "@johnlindquist/kit";

const result = await put("https://jsonplaceholder.typicode.com/posts/1", {
  title: "foo",
});

await editor(JSON.stringify(result.data));
