// Name: tmpPath-example

import "@johnlindquist/kit";

const tmpTestTxtPath = tmpPath("test.txt");
const content = await ensureReadFile(tmpTestTxtPath, "Hello World");

await editor(
  JSON.stringify(
    {
      tmpTestTxtPath,
      content,
    },
    null,
    2
  )
);
