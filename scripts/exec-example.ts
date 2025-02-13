let result = await exec(`ls -la`, {
  cwd: home(), // where to run the command
  shell: "/bin/zsh", // if you're expecting to use specific shell features/configs
  all: true, // pipe both stdout and stderr to "all"
})

inspect(result.all)