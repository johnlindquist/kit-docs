import "@johnlindquist/kit";

const kitSDKPath = await arg({
  input: "/Users/johnlindquist/dev/kit",
});

// Helper to convert header text to a slug (same as extraction)
function toSlug(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
    .join("-")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

// Helper to humanize a slug and lowercase only the first letter
function humanizeAndLowercase(slug: string): string {
  const human = slug.replace(/-/g, " ");
  return human.charAt(0).toLowerCase() + human.slice(1);
}

// Helper to check if a file's base name has exactly two words and the second word is "example"
function isExampleFile(fileName: string): boolean {
  const baseName = fileName.slice(0, -3); // remove ".ts"
  const words = baseName.split("-");
  return words.length === 2 && words[1] === "example";
}

// Define paths for the markdown file and the scripts folder
const apiPath = new URL("../API.md", import.meta.url).pathname;
const scriptsDir = path.dirname(new URL(import.meta.url).pathname);

// Read the markdown file
let content = await readFile(apiPath, "utf8");

// Get a list of all files in the scripts folder
let scriptFiles = await readdir(scriptsDir);

// Split content into lines
const lines = content.split("\n");

// Group lines into sections; a section starts with a header-3 ("### ") and includes all lines until the next header-3
type Section = { header: string | null; lines: string[] };
const sections: Section[] = [];
let currentSection: Section = { header: null, lines: [] };

for (const line of lines) {
  if (line.startsWith("### ")) {
    // Start a new section – push the previous one if it exists
    if (currentSection.header !== null || currentSection.lines.length > 0) {
      sections.push(currentSection);
    }
    currentSection = { header: line, lines: [] };
  } else {
    currentSection.lines.push(line);
  }
}
// Push the final section
sections.push(currentSection);

// Process each section that starts with a header-3
for (const section of sections) {
  if (section.header) {
    // Extract the header text (after "### ") and generate its slug
    const headerText = section.header.substring(4).trim();
    const slug = toSlug(headerText);

    // Find any script files whose names start with this slug + "-" and end with ".ts"
    let matchingFiles = scriptFiles.filter(
      (fileName) => fileName.startsWith(slug + "-") && fileName.endsWith(".ts")
    );

    // Sort matching files so that those with exactly two words and the second word is "example" come first.
    matchingFiles.sort((a, b) => {
      const aIsExample = isExampleFile(a);
      const bIsExample = isExampleFile(b);
      if (aIsExample && !bIsExample) return -1;
      if (!aIsExample && bIsExample) return 1;
      return a.localeCompare(b);
    });

    // For each matching file, build an injection block and append it to the section's lines
    for (const fileName of matchingFiles) {
      const filePath = path.join(scriptsDir, fileName);
      const fileContent = await readFile(filePath, "utf8");

      // Remove the ".ts" extension and generate a humanized header (first letter lowercased)
      const baseName = fileName.slice(0, -3);
      const humanHeader = humanizeAndLowercase(baseName);

      // Append a blank line, then a header-4, a blank line before the code block,
      // the code block (starting with "```ts"), then a blank line after the code block.
      section.lines.push("");
      section.lines.push(`#### ${humanHeader}`);
      section.lines.push(""); // newline before the opening code fence
      section.lines.push("```ts");
      section.lines.push(fileContent);
      section.lines.push("```");
      section.lines.push(""); // newline after the closing code fence
    }
  }
}

// Reassemble the updated content and write it back to the markdown file
let newContent = "";
for (const section of sections) {
  if (section.header) {
    newContent += section.header + "\n";
  }
  newContent += section.lines.join("\n") + "\n";
}

/**
 * Reads the API markdown file and returns a Map from a header title
 * (assumed to be a level‑3 header starting with "### ") to its full section.
 *
 * Captures everything from the header until the next "###" header or EOF,
 * and collapses multiple consecutive newlines into a single newline.
 */
async function parseMarkdownForGlobals(): Promise<Map<string, string>> {
  const globalMap = new Map<string, string>();
  const regex = /^###\s+(.+?)\s*\n([\s\S]*?)(?=^###\s+|\Z)/gm;
  let match;
  while ((match = regex.exec(newContent)) !== null) {
    const globalName = match[1].trim();
    // Collapse multiple newlines into one.
    let description = match[2].replace(/(\r?\n\s*){2,}/g, "\n").trim();
    globalMap.set(globalName, description);
  }
  return globalMap;
}

/**
 * Updates the TypeScript file by replacing an optional existing TSDoc block
 * immediately preceding a global declaration with a new TSDoc comment generated
 * from the Markdown documentation, plus appending an "@see" tag.
 *
 * The regex below matches a declaration line that starts (optionally after a TSDoc block)
 * with an optional "var " followed by an identifier and a colon.
 * Only declarations matching that pattern (i.e. properties) are updated.
 */
async function updateTsFile(
  tsPath: string,
  globalDocs: Map<string, string>
): Promise<void> {
  let tsContent = await readFile(tsPath, "utf-8");

  // This regex captures two groups:
  //   group1: an optional preceding TSDoc block (including its newline) – if present.
  //   group2: the declaration line (e.g. "   home: PathFn")
  // It matches only if the declaration line is of the form (optional whitespace)(optional "var ")(word)(optional whitespace colon).
  const regex = /(^[ \t]*)var\s+(\w+)\s*:/gm;

  const updatedContent = tsContent.replace(regex, (match, indent, varName) => {
    if (globalDocs.has(varName)) {
      let docText = globalDocs.get(varName)!;
      const rawLines = docText.split("\n");
      let inCodeBlock = false;
      const processedLines: string[] = [];
      for (const line of rawLines) {
        if (line.trim().startsWith("```")) {
          inCodeBlock = !inCodeBlock;
          processedLines.push(line);
          continue;
        }
        if (!inCodeBlock && line.trim() === "") continue;
        processedLines.push(line);
      }
      while (processedLines.length && processedLines[0].trim() === "") {
        processedLines.shift();
      }
      while (
        processedLines.length &&
        processedLines[processedLines.length - 1].trim() === ""
      ) {
        processedLines.pop();
      }
      const commentLines = processedLines.map((line) => `${indent} * ${line}`);
      commentLines.push(
        `${indent} * @see https://johnlindquist.github.io/kit-docs/#${varName.toLowerCase()}`
      );
      let commentBlock = `${indent}/**\n${commentLines.join(
        "\n"
      )}\n${indent} */\n`;
      commentBlock = commentBlock.replace(/\n{2,}/g, "\n");
      return commentBlock + `${indent}var ${varName}:`;
    }
    return match;
  });

  await writeFile(tsPath, updatedContent, "utf-8");
}

const tsFilePaths = [
  path.resolve(kitSDKPath, "src", "types", "kit.d.ts"),
  path.resolve(kitSDKPath, "src", "types", "kitapp.d.ts"),
];

console.log("Parsing API markdown file for global docs...");
const globalDocs = await parseMarkdownForGlobals();
console.log("Found documentation for globals:", Array.from(globalDocs.keys()));

for (const tsFilePath of tsFilePaths) {
  console.log("Updating TypeScript file with TSDoc comments...");
  await updateTsFile(tsFilePath, globalDocs);
  console.log("Done updating globals in", tsFilePath);
}
