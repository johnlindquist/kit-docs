// Name: get-example

import "@johnlindquist/kit";

const result = await get("https://jsonplaceholder.typicode.com/todos/1");

await editor(JSON.stringify(result.data));
