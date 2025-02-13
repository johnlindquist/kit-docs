let gistUrl = await createGist({
  description: "My awesome gist",
  public: true,
  files: {
    "hello.txt": {
      content: "Hello, world!"
    }
  }
})