import "@johnlindquist/kit";

// Resolve paths for the API.md file and the scripts folder
const apiPath = new URL("../API.md", import.meta.url).pathname;
const scriptsDir = path.dirname(new URL(import.meta.url).pathname);

// Read the content of API.md
let content = await readFile(apiPath, "utf8");

// Helper to convert header text to a filename
function headerToFilename(headerText: string): string {
  return (
    headerText
      .split(" ")
      .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
      .join("-")
      .trim()
      .replace(/[^\w-]/g, "") + ".ts"
  );
}

// Track marker scripts to ensure we don't remove their comments
const markerScripts = new Set<string>();

// First, find all marker comments and track them
const markerRegex = /<!--\s*SCRIPT:\s*([a-zA-Z0-9-_]+)\s*-->/g;
let markerMatch;
while ((markerMatch = markerRegex.exec(content)) !== null) {
  const scriptName = markerMatch[1];
  markerScripts.add(scriptName);
}

// Regex pattern to find and extract code blocks
const codeRegex = /####\s+(.+?)\s*\n\s*\n```ts\s*\n([\s\S]*?)\n```/g;
let match;
let extractedCount = 0;
let markerCount = 0;

// Process each match, extracting the code and handling markers appropriately
while ((match = codeRegex.exec(content)) !== null) {
  const headerText = match[1];
  const codeContent = match[2];

  // Generate a script name (without .ts) from the header
  const scriptName = headerToFilename(headerText).slice(0, -3);
  const fileName = scriptName + ".ts";
  const filePath = path.join(scriptsDir, fileName);

  // Save the extracted code to a file
  await writeFile(filePath, codeContent, "utf8");

  // Check if this is a marker script
  const isMarkerScript = markerScripts.has(scriptName);

  if (isMarkerScript) {
    // Replace code block with the marker comment
    content = content.replace(match[0], `<!-- SCRIPT: ${scriptName} -->`);
    markerCount++;
    console.log(`Extracted marker script: ${filePath}`);
  } else {
    // Remove the code block completely
    content = content.replace(match[0], "");
    extractedCount++;
    console.log(`Extracted regular script: ${filePath}`);
  }
}

// Write the updated content back to API.md
await writeFile(apiPath, content, "utf8");
console.log(
  `Extraction complete: ${extractedCount} regular examples and ${markerCount} marker scripts processed.`
);
