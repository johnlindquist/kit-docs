// Name: edit-example

import "@johnlindquist/kit";

const zshrcPath = home(".zshrc");
await edit(zshrcPath);
