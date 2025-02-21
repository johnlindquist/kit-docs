// Name: home-example

import "@johnlindquist/kit";

const downloadsPath = home("Downloads");
const downloadedFileNames = await readdir(downloadsPath);
await editor(JSON.stringify(downloadedFileNames, null, 2));
