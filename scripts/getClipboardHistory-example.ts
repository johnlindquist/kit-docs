// Name: getClipboardHistory-example

import "@johnlindquist/kit";

const history = await getClipboardHistory();
const text = await arg("Select from clipboard history", history);
await editor(text);
