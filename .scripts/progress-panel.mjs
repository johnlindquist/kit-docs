// dev/kit-docs/scripts/progress-panel.ts
import "@johnlindquist/kit";
var first = "";
var second = "";
var third = "";
var progressPanel = () => md(`# Progress: 
- ${first || "Waiting first value"}
- ${second || "Waiting second value"}
- ${third || "Waiting third value"}
`);
first = await arg("Enter the first value", progressPanel);
second = await arg("Enter the second value", progressPanel);
third = await arg("Enter the third value", progressPanel);
await div(
  md(`# You entered:
- ${first}
- ${second}
- ${third}
`)
);
