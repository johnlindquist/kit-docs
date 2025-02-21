// Name: md-example

import "@johnlindquist/kit";

const html = md(`# You're the Best

* Thanks for using Script Kit!
`);

await div(html);
