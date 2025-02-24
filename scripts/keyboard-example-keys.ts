// Name: keyboard-example-keys

import "@johnlindquist/kit";

metadata = {
  prompt: false,
};

await keyboard.tap(Key.LeftSuper, Key.A);
await wait(100);
await keyboard.tap(Key.LeftSuper, Key.C);
await wait(100);
await keyboard.tap(Key.LeftSuper, Key.N);
await wait(100);
await keyboard.tap(Key.LeftSuper, Key.V);
