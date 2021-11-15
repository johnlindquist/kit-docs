let { format } = await npm("date-fns")
let { context } = await npm("@actions/github")
let { Octokit } = await npm("@octokit/rest")

console.log(`Past npm...`)

let { owner, repo } = context.repo

console.log({ owner, repo })

let github = new Octokit({
  auth: await env("REPO_TOKEN"),
})

// console.log({ github })

let dateTag = format(new Date(), "yyyy-MM-dd-HH-mm")
let releaseResponse = await github.rest.repos.createRelease(
  {
    owner,
    repo,
    tag_name: dateTag,
  }
)

let name = "docs.json"
let docsPath = kitPath("data", name)
console.log({ docsPath })

let headers = {
  "content-type": "application/json",
}

let data = await readFile(docsPath, "utf-8")
console.log(`DATA:`, data.slice(0, 50))

let uploadResponse =
  await github.rest.repos.uploadReleaseAsset({
    headers,
    owner,
    repo,
    release_id: releaseResponse.data.id,
    name: name,
    data,
  })

console.log(
  `url: ${uploadResponse.data.browser_download_url}`
)
