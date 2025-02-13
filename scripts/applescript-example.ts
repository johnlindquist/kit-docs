let result = await applescript(`
tell application "Finder"
  return name of every disk
end tell
`)