// dev/kit-docs/scripts/format-latest-clipboard-item.ts
import "@johnlindquist/kit";
var text = await paste();
var newText = text.replace("a", "b");
await setSelectedText(newText);
