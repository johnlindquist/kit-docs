// Name: Get Active App on Mac
// Group: Desktop

// MAC ONLY!
import "@johnlindquist/kit"

// Always hide immmediately if you're not going to show a prompt
await hide()

// Note: This uses "https://www.npmjs.com/package/@johnlindquist/mac-frontmost" inside Kit.app,
// but you can import that package directly (or another similar package) if you prefer
let info = await getActiveAppInfo()
if (info.bundleIdentifier === "com.google.Chrome") {
  await keyboard.pressKey(Key.LeftSuper, Key.T)
  await keyboard.releaseKey(Key.LeftSuper, Key.T)
}
