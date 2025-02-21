// Name: del-example

import "@johnlindquist/kit";

const result = await del("https://jsonplaceholder.typicode.com/posts/1");

await editor(JSON.stringify(result.data));
