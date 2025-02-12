import "@johnlindquist/kit";

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

await writeFile(apiPath, newContent, "utf8");
console.log("Injection complete.");
