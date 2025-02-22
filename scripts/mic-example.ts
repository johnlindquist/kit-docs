// Name: mic-example

import "@johnlindquist/kit";

const tmpMicPath = tmpPath("mic.webm");

const buffer = await mic();

await writeFile(tmpMicPath, buffer);
await playAudioFile(tmpMicPath);
