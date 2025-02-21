// Name: download-example

import "@johnlindquist/kit";

const url = "https://github.com/johnlindquist/kit/archive/refs/heads/main.zip";
const destination = home("Downloads");

await download(url, destination);
