// dev/kit-docs/scripts/get-active-app-on-mac.ts
import "@johnlindquist/kit";
await hide();
var info = await getActiveAppInfo();
if (info.bundleIdentifier === "com.google.Chrome") {
  await keyboard.pressKey(Key.LeftSuper, Key.T);
  await keyboard.releaseKey(Key.LeftSuper, Key.T);
}
