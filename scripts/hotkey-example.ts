let keyInfo = await hotkey()
await editor(JSON.stringify(keyInfo, null, 2))