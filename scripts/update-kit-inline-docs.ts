metadata = {
  alias: "ukid",
  shortcut: "opt k",
};

import "@johnlindquist/kit";

const kitSDKPath = "/Users/johnlindquist/dev/kit";

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

// Define line exclusion rules once, for reuse across the codebase
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

// Helper to get the global type name from a script filename (first part before any dash)
function getGlobalTypeFromFileName(fileName: string): string | null {
  const baseName = fileName.slice(0, -3); // remove ".ts"
  const parts = baseName.split("-");
  if (parts.length >= 1) {
    return parts[0];
  }
  return null;
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

// Split content into lines
const lines = content.split("\n");

// Group lines into sections; a section starts with a header-3 ("### ") and includes all lines until the next header-3
type Section = { header: string | null; lines: string[] };
// Group lines into sections; a section starts with a header-3 ("### ")
// and ends when a header of level 1 or 2 (i.e. "## " but not "### ") is encountered.
const sections: Section[] = [];
let currentSection: Section = { header: null, lines: [] };

for (const line of lines) {
  if (line.startsWith("### ")) {
    // Start a new section – push the previous one if it exists
    if (currentSection.header !== null || currentSection.lines.length > 0) {
      sections.push(currentSection);
    }
    currentSection = { header: line, lines: [] };
  } else if (line.startsWith("## ") && !line.startsWith("### ")) {
    // Encountering a level-1 or level-2 header ends the current section.
    if (currentSection.header !== null || currentSection.lines.length > 0) {
      sections.push(currentSection);
    }
    // Optionally, you can start a new section for the lower-level header,
    // but if you only want to process level-3 sections, you can simply reset.
    currentSection = { header: null, lines: [] };
  } else {
    currentSection.lines.push(line);
  }
}
// Push the final section if it has content
if (currentSection.header !== null || currentSection.lines.length > 0) {
  sections.push(currentSection);
}

// Process each section that starts with a header-3
console.log("Processing sections...");
for (const section of sections) {
  console.log("Processing section:", section.header);
  if (section.header) {
    // Extract the header text (after "### ") and generate its slug
    const headerText = section.header.substring(4).trim();
    const slug = toSlug(headerText);

    // Find any script files whose names start with this slug + "-" and end with ".ts"
    let matchingFiles = scriptFiles.filter(
      (fileName) =>
        fileName.toLowerCase().startsWith(slug.toLowerCase() + "-") &&
        fileName.endsWith(".ts")
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
      // remove the line containing "import '@johnlindquist/kit'"
      const lines = fileContent.split("\n");

      const filteredLines = lines.filter(
        (line) => !lineExclusionRules.some((rule) => rule.match(line))
      );

      const filteredContent = filteredLines.join("\n");

      // Remove the ".ts" extension and generate a humanized header (first letter lowercased)
      const baseName = fileName.slice(0, -3);
      const humanHeader = humanizeAndLowercase(baseName);

      // Append a blank line, then a header-4, a blank line before the code block,
      // the code block (starting with "```ts"), then a blank line after the code block.
      section.lines.push("");
      section.lines.push(`#### ${humanHeader}`);
      section.lines.push(""); // newline before the opening code fence
      section.lines.push("```ts");
      section.lines.push(filteredContent);
      section.lines.push("```");
      section.lines.push(""); // newline after the closing code fence
    }

    // Collect marker-based scripts but don't insert them yet
    const markerScripts: Array<{
      scriptName: string;
      content: string;
      humanHeader: string;
    }> = [];

    // First pass: find markers and collect their scripts
    for (let i = 0; i < section.lines.length; i++) {
      const line = section.lines[i];
      // Match the pattern <!-- SCRIPT: script-name -->
      const markerMatch = line.match(/<!--\s*SCRIPT:\s*([a-zA-Z0-9-_]+)\s*-->/);
      if (markerMatch) {
        const scriptName = markerMatch[1];
        const scriptFileName = scriptFileMap.get(scriptName);

        if (scriptFileName) {
          // Found the script file, read its content
          const filePath = path.join(scriptsDir, scriptFileName);
          const fileContent = await readFile(filePath, "utf8");
          const lines = fileContent.split("\n");

          // Apply the same filtering rules as for other scripts
          const filteredLines = lines.filter(
            (line) => !lineExclusionRules.some((rule) => rule.match(line))
          );
          const filteredContent = filteredLines.join("\n");

          // Store for later insertion
          markerScripts.push({
            scriptName,
            content: filteredContent,
            humanHeader: humanizeAndLowercase(scriptName),
          });

          // Remove the marker line
          section.lines.splice(i, 1);
          i--; // Adjust index since we removed a line
        } else {
          console.warn(
            `Warning: Script '${scriptName}' referenced in marker not found`
          );
          // Keep the marker in place if script not found
        }
      }
    }

    // Second pass: add all marker scripts at the end of the section
    for (const script of markerScripts) {
      const replacementLines = [
        "", // blank line before header
        `#### ${script.humanHeader}`,
        "", // blank line before code block
        "```ts",
        script.content,
        "```",
        "", // blank line after code block
      ];

      // Append at the end of the section
      section.lines.push(...replacementLines);
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
  let lines = tsContent.split("\n");
  const newLines: string[] = [];

  // Process the file line by line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check if this line is a var declaration (it must start with "var ")
    if (trimmed.startsWith("var ")) {
      // Extract the variable name using a regex
      const varMatch = trimmed.match(/^var\s+(\w+)\s*:/);
      if (varMatch) {
        const varName = varMatch[1];
        // Only update if we have documentation for this var
        if (globalDocs.has(varName)) {
          let docText = globalDocs.get(varName)!;

          // Extract the links line if it exists
          const linksMatch = docText.match(
            /\[Examples\]\(.*?\) \| \[Docs\]\(.*?\) \| \[Discussions\]\(.*?\)/
          );
          const linksLine = linksMatch ? linksMatch[0] : null;

          // Extract the main description (everything before the first #### header)
          const mainDescriptionMatch = docText.match(
            /^([\s\S]*?)(?=####|\[Examples\]|$)/
          );
          const mainDescription =
            mainDescriptionMatch && mainDescriptionMatch[1].trim()
              ? mainDescriptionMatch[1].trim()
              : "";

          // Extract all example sections
          const allExampleSections =
            docText.match(/#### [\s\S]*?(?=####|\[Examples\]|$)/g) || [];

          // First pass: collect marker scripts by examining all script files
          // We'll look for script files that start with the global name but are actually marker scripts
          const markerScripts = new Set<string>();

          // Iterate through all script files and find those that match this global
          for (const [scriptName, fileName] of scriptFileMap.entries()) {
            if (getGlobalTypeFromFileName(fileName) === varName) {
              // Check if this script is used as a marker anywhere in any section
              const markerPattern = new RegExp(
                `<!--\\s*SCRIPT:\\s*${scriptName}\\s*-->`,
                "i"
              );

              // Search across ALL content (not just this global's section)
              if (markerPattern.test(content)) {
                markerScripts.add(scriptName);
              }
            }
          }

          // Now categorize all examples
          let mainExample: string | null = null;
          const regularExamples: string[] = [];
          const markerExamples: string[] = [];

          for (const section of allExampleSections) {
            const headerMatch = section.match(/#### (.*?)\n/);
            if (headerMatch) {
              const headerText = headerMatch[1].trim();

              // Convert header to a normalized form for comparison
              const normalizedHeader = headerText
                .toLowerCase()
                .replace(/\s+/g, "-");

              // Check if this header corresponds to a marker script file
              let isMarkerExample = false;
              for (const scriptName of markerScripts) {
                const normalizedScriptName = scriptName.toLowerCase();
                const humanizedScriptName =
                  humanizeAndLowercase(scriptName).toLowerCase();

                if (
                  normalizedHeader === normalizedScriptName ||
                  headerText.toLowerCase() === humanizedScriptName
                ) {
                  markerExamples.push(section);
                  isMarkerExample = true;
                  break;
                }
              }

              if (!isMarkerExample) {
                // Check if this is the main example
                const mainExamplePattern = new RegExp(
                  `^${varName}\\s+example$`,
                  "i"
                );
                if (mainExamplePattern.test(headerText)) {
                  mainExample = section;
                } else {
                  regularExamples.push(section);
                }
              }
            } else {
              // If no header found, treat as regular example
              regularExamples.push(section);
            }
          }

          // Special case: If arg-actions-example is in our marker scripts,
          // make sure it's identified correctly in our marker examples
          if (markerScripts.has("arg-actions-example")) {
            for (let i = 0; i < regularExamples.length; i++) {
              const section = regularExamples[i];
              if (section.includes("#### arg actions example")) {
                // Move this to marker examples
                markerExamples.push(section);
                regularExamples.splice(i, 1);
                break;
              }
            }
          }

          // Rebuild the documentation with proper ordering
          let newDocText = "";

          // Add main description
          if (mainDescription) {
            newDocText += mainDescription + "\n\n";
          }

          // Add main example first (if it exists)
          if (mainExample) {
            newDocText += mainExample.trim() + "\n\n";
          }

          // Add regular examples
          for (const example of regularExamples) {
            newDocText += example.trim() + "\n\n";
          }

          // Add marker examples at the very end
          for (const example of markerExamples) {
            newDocText += example.trim() + "\n\n";
          }

          // Add links line at the very end
          if (linksLine) {
            newDocText += linksLine;
          } else {
            newDocText += `[Examples](https://scriptkit.com?query=${varName}) | [Docs](https://johnlindquist.github.io/kit-docs/#${varName}) | [Discussions](https://github.com/johnlindquist/kit/discussions?discussions_q=${varName})`;
          }

          // Format as TSDoc comment
          const rawLines = newDocText.split("\n");
          const processedLines: string[] = [];
          let inCodeBlock = false;

          // Process the markdown lines (skip extra blank lines outside code blocks)
          for (const rawLine of rawLines) {
            if (rawLine.trim().startsWith("```")) {
              inCodeBlock = !inCodeBlock;
              processedLines.push(rawLine);
              continue;
            }
            if (!inCodeBlock && rawLine.trim() === "") continue;
            processedLines.push(rawLine);
          }

          // Use the current line's indentation for the comment
          const indent = line.match(/^\s*/)?.[0] || "";
          const commentLines = processedLines.map((l) => `${indent} * ${l}`);
          const newCommentBlock = `${indent}/**\n${commentLines.join(
            "\n"
          )}\n${indent} */`;

          // Check if there is an existing TSDoc comment block immediately before the var line.
          // If so, remove it from the newLines array.
          if (
            newLines.length &&
            newLines[newLines.length - 1].trim().endsWith("*/")
          ) {
            let j = newLines.length - 1;
            while (j >= 0 && !newLines[j].trim().startsWith("/**")) {
              j--;
            }
            if (j >= 0) {
              newLines.splice(j, newLines.length - j);
            }
          }

          // Insert the new TSDoc block and then the var declaration line
          newLines.push(newCommentBlock);
          newLines.push(line);
          continue; // Move on to the next line
        }
      }
    }

    // Otherwise, leave the line unchanged
    newLines.push(line);
  }

  const updatedContent = newLines.join("\n");
  await writeFile(tsPath, updatedContent, "utf-8");
}

const tsFilePaths = [
  path.resolve(kitSDKPath, "src", "types", "kit.d.ts"),
  path.resolve(kitSDKPath, "src", "types", "kitapp.d.ts"),
  path.resolve(kitSDKPath, "src", "types", "globals.d.ts"),
  path.resolve(kitSDKPath, "src", "types", "packages.d.ts"),
  path.resolve(kitSDKPath, "src", "types", "pro.d.ts"),
  path.resolve(kitSDKPath, "src", "types", "platform.d.ts"),
];

console.log("Parsing API markdown file for global docs...");
const globalDocs = await parseMarkdownForGlobals();
console.log("Found documentation for globals:", Array.from(globalDocs.keys()));

for (const tsFilePath of tsFilePaths) {
  console.log("Updating TypeScript file with TSDoc comments...");
  await updateTsFile(tsFilePath, globalDocs);
  console.log("Done updating globals in", tsFilePath);
}
