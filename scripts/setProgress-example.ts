// Name: setProgress-example

import "@johnlindquist/kit";

await div({
  html: md(`Imagine something is installing...`),
  onInit: async () => {
    const length = 100;
    const ticks = Array.from({ length }, (_, i) => i);
    for await (let i of ticks) {
      setProgress(i);
      await wait(Math.random() * 1000);
    }
  },
  onSubmit: async () => {
    exit();
  },
});
