import "@johnlindquist/kit";

// Resolve paths for the API.md file and the scripts folder
const apiPath = new URL("../API.md", import.meta.url).pathname;
const scriptsDir = path.dirname(new URL(import.meta.url).pathname);

// Read the content of API.md
let content = await readFile(apiPath, "utf8");

// Regex pattern:
// - Optionally matches a preceding newline (group 1)
// - Matches a header line starting with "####" and captures the header text (group 2)
// - Optionally allows a blank line before a fenced code block starting with "```ts"
// - Captures all code until the closing "```" (group 3)
// - Optionally matches a trailing newline (group 4)
const regex = /(\n)?####\s+(.+?)\s*\n(?:\s*\n)?```ts\s*\n([\s\S]*?)\n```(\n)?/g;

let match;
let extractedCount = 0;

// Loop through each match and write the code block to a separate file
while ((match = regex.exec(content)) !== null) {
  const headerText = match[2];
  const codeContent = match[3];

  // Generate a file name from the header text:
  // - Lowercase, trim, replace spaces with dashes, remove non-word/dash characters, then append ".ts"
  const fileName =
    headerText
      .split(" ")
      .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
      .join("-")
      .trim()
      .replace(/[^\w-]/g, "") + ".ts";

  const filePath = path.join(scriptsDir, fileName);

  await writeFile(filePath, codeContent, "utf8");
  console.log(`Created file: ${filePath}`);
  extractedCount++;
}

// Remove the extracted sections completely (no newline or blank lines left behind)
const newContent = content.replace(regex, "");

// Write the cleaned content back to API.md
await writeFile(apiPath, newContent, "utf8");
console.log(`Removed ${extractedCount} extracted code block(s) from API.md.`);
