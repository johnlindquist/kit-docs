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

// Create a map of script files for quick lookup by name
const scriptFileMap = new Map<string, string>();
for (const fileName of scriptFiles) {
  if (fileName.endsWith(".ts")) {
    const baseName = fileName.slice(0, -3); // remove ".ts"
    scriptFileMap.set(baseName, fileName);
  }
}

// Track scripts that have been processed via markers to avoid duplicates
const processedScripts = new Set<string>();

// Define line exclusion rules
type LineRule = {
  name: string;
  description: string;
  match: (line: string) => boolean;
};

const lineExclusionRules: LineRule[] = [
  {
    name: "kitImport",
    description: "Remove Kit SDK import statements",
    match: (line) => Boolean(line.match(/import ['"]@johnlindquist\/kit['"]/)),
  },
  {
    name: "scriptName",
    description: "Remove '// Foo:' comments",
    match: (line) => Boolean(/^\/\/\s*\w+:/.test(line)),
  },
  {
    name: "metadata",
    description: "Remove metadata blocks",
    match: (line) => line.startsWith("metadata = {"),
  },
];

// First, process all marker scripts (simple find and replace)
// The marker format is: <!-- SCRIPT: script-name -->
const markerRegex = /<!--\s*SCRIPT:\s*([a-zA-Z0-9-_]+)\s*-->/g;
let markerMatch;
let markerProcessed = 0;

while ((markerMatch = markerRegex.exec(content)) !== null) {
  const scriptName = markerMatch[1];
  const scriptFileName = scriptFileMap.get(scriptName);

  if (scriptFileName) {
    // Found the script file, read its content
    const filePath = path.join(scriptsDir, scriptFileName);
    const fileContent = await readFile(filePath, "utf8");

    // Filter the script content
    const filteredLines = fileContent
      .split("\n")
      .filter((line) => !lineExclusionRules.some((rule) => rule.match(line)));

    const filteredContent = filteredLines.join("\n").trim();

    // Generate a humanized header
    const humanHeader = humanizeAndLowercase(scriptName);

    // Replace the marker with the formatted script content
    content = content.replace(
      markerMatch[0], // The marker comment
      `#### ${humanHeader}

\`\`\`ts
${filteredContent}
\`\`\`
`
    );

    // Track that this script has been processed
    processedScripts.add(scriptFileName);

    markerProcessed++;
    console.log(`Processed marker script: ${scriptName}`);
  } else {
    console.warn(
      `Warning: Script '${scriptName}' referenced in marker not found`
    );
  }
}

// Now process sections for regular injections
const lines = content.split("\n");

// Group lines into sections based on headers.
// Each section starts with a header line (which is stored in the section if present)
// and a flag (injection) is set to true if the header is level 3 ("### ").
type Section = { header: string | null; lines: string[]; injection: boolean };
const sections: Section[] = [];
let currentSection: Section = { header: null, lines: [], injection: false };

const headerRegex = /^(#{1,6})\s/;
for (const line of lines) {
  const headerMatch = line.match(headerRegex);
  if (headerMatch) {
    // When we hit any header, first push the current section if it has content.
    if (currentSection.header !== null || currentSection.lines.length > 0) {
      sections.push(currentSection);
    }
    const level = headerMatch[1].length;
    // Mark sections that start with a level-3 header for injection.
    currentSection = { header: line, lines: [], injection: level === 3 };
    continue; // header line is stored in .header, so skip adding it to .lines
  }
  // Otherwise, just add the line to the current section.
  currentSection.lines.push(line);
}
// Push any remaining lines as a section.
sections.push(currentSection);

// Process each section that is marked for injection (i.e. sections with a level-3 header)
let regularScriptsProcessed = 0;
for (const section of sections) {
  if (section.injection && section.header) {
    // Extract header text (removing the "### ") and generate a slug.
    const headerText = section.header.substring(4).trim();
    const slug = toSlug(headerText);

    // Find script files whose names start with slug + "-" and end with ".ts"
    let matchingFiles = scriptFiles.filter(
      (fileName) =>
        fileName.startsWith(slug + "-") &&
        fileName.endsWith(".ts") &&
        !processedScripts.has(fileName) // Skip scripts already processed via markers
    );

    // Sort matching files so that those with exactly two words and the second word is "example" come first.
    matchingFiles.sort((a, b) => {
      const aIsExample = isExampleFile(a);
      const bIsExample = isExampleFile(b);
      if (aIsExample && !bIsExample) return -1;
      if (!aIsExample && bIsExample) return 1;
      return a.localeCompare(b);
    });

    // For each matching file, build and append the injection block.
    for (const fileName of matchingFiles) {
      const filePath = path.join(scriptsDir, fileName);
      const fileContent = await readFile(filePath, "utf8");

      const filteredLines = fileContent
        .split("\n")
        .filter((line) => !lineExclusionRules.some((rule) => rule.match(line)));

      const filteredContent = filteredLines.join("\n").trim();

      // Remove the ".ts" extension and generate a humanized header (with only the first letter lowercased)
      const baseName = fileName.slice(0, -3);
      const humanHeader = humanizeAndLowercase(baseName);

      // Append a blank line, then a header-4, a blank line before the code block,
      // the code block (starting with "```ts"), then a blank line after the code block.
      section.lines.push("");
      section.lines.push(`#### ${humanHeader}`);
      section.lines.push("");
      section.lines.push("```ts");
      section.lines.push(filteredContent);
      section.lines.push("```");
      section.lines.push("");

      regularScriptsProcessed++;
      console.log(`Processed regular script: ${baseName}`);
    }
  }
}

// Reassemble the updated content from all sections.
let newContent = "";
for (const section of sections) {
  if (section.header) {
    newContent += section.header + "\n";
  }
  newContent += section.lines.join("\n") + "\n";
}

await writeFile(apiPath, newContent, "utf8");
console.log(
  `Injection complete: ${markerProcessed} marker scripts and ${regularScriptsProcessed} regular scripts processed.`
);
