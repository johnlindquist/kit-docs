// Name: mouse-example

import "@johnlindquist/kit";

await mouse.move([
  { x: 100, y: 100 },
  { x: 200, y: 200 },
]);
await mouse.leftClick();
await wait(100);
await mouse.rightClick();
await wait(100);
await mouse.setPosition({ x: 1000, y: 1000 });
