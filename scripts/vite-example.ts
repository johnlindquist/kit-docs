// Name: vite-example

import "@johnlindquist/kit";

const { workArea } = await getActiveScreen();

// Generates/opens a vite project in ~/.kenv/vite/project-path
const viteWidget = await vite("project-path", {
  x: workArea.x + 100,
  y: workArea.y + 100,
  width: 640,
  height: 480,
});

// In your ~/.kenv/vite/project-path/src/App.tsx (if you picked React)
// use the "send" api to send messages. "send" is injected on the window object
// <input type="text" onInput={(e) => send("input", e.target.value)} />

const filePath = home("vite-example.txt");
viteWidget.on(
  "input",
  debounce(async (input) => {
    await writeFile(filePath, input);
  }, 1000)
);
