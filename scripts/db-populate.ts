// Name: Populate db example
// Description: Shows how to pre-populate database
// Group: Data

// Pass in a function to generate data for the db
// Because this script is named "db-basic.js"
// The database is found at "~/.kenv/db/_db-basic.json"
import "@johnlindquist/kit";

let reposDb = await db(async () => {
  let response = await get("https://api.github.com/users/johnlindquist/repos");

  return response.data.map(({ name, description, html_url }) => {
    return {
      name,
      description,
      value: html_url,
    };
  });
});
let repoUrl = await arg("Select repo to open:", reposDb.items);

exec(`open "${repoUrl}"`);
