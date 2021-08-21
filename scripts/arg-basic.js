// Menu: Basic arg example
// Description: Shows how to pick from a list

let fruit = await arg("Select a fruit:", [
  "apple",
  "banana",
  "orange",
])

console.log(`You selected ${fruit}`)
await wait(3000)
