// Name: blur-example

import "@johnlindquist/kit";

import { URL, fileURLToPath } from "node:url";

await editor({
  onInit: async () => {
    const { workArea } = await getActiveScreen();
    const topLeft = { x: workArea.x, y: workArea.y };
    const size = { height: 900, width: 200 };
    await setBounds({
      ...topLeft,
      ...size,
    });
    await blur();

    // get path to current file
    const currentScript = fileURLToPath(new URL(import.meta.url));
    const content = await readFile(currentScript, "utf8");
    const lines = content.split("\n");
    for await (const line of lines) {
      editor.append(`${line}\n`);
      await wait(100);
    }
  },
});
