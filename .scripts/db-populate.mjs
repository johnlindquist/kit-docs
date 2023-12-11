// dev/kit-docs/scripts/db-populate.ts
var reposDb = await db(async () => {
  let response = await get("https://api.github.com/users/johnlindquist/repos");
  return response.data.map(({ name, description, html_url }) => {
    return {
      name,
      description,
      value: html_url
    };
  });
});
var repoUrl = await arg("Select repo to open:", reposDb.items);
exec(`open "${repoUrl}"`);
