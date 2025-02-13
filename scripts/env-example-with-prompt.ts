// Prompt the user to select from a path
let OUTPUT_DIR = await env("OUTPUT_DIR", async () => {
  return await path({
    hint: `Select the output directory`,
  })
})