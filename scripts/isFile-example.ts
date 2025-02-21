// Name: isFile-example

import "@johnlindquist/kit";

const testingIsFileTxtPath = home("testing-isFile.txt");

const isTestingFile = await isFile(testingIsFileTxtPath);
if (!isTestingFile) {
  await writeFile(testingIsFileTxtPath, "Hello World");
}

const content = await readFile(testingIsFileTxtPath, "utf8");
await editor(content);
