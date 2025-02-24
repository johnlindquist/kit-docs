// Name: clipboard-example-image

import "@johnlindquist/kit";

const iconPath = kitPath("images", "icon.png");
const imageBuffer = await readFile(iconPath);

// Write and read image buffers to the clipboard
await clipboard.writeImage(imageBuffer);
const resultBuffer = await clipboard.readImage();

const outputPath = home("Downloads", "icon-copy.png");
await writeFile(outputPath, resultBuffer);
await revealFile(outputPath);
