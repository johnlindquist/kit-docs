// Name: Force a User to Pick an Option
// Group: Prompt

import "@johnlindquist/kit"

let animals = ["dog", "cat", "rabbit", "horse", "elephant"]
let secondsRemaining = 3
let getHint = secondsRemaining => `Hurry! You only have ${secondsRemaining} seconds to choose an animal...`

let animal = ""

animal = await arg(
  {
    hint: getHint(secondsRemaining),
    onInit: async () => {
      while (secondsRemaining > 0 && !animal) {
        setHint(getHint(secondsRemaining))
        await wait(1000)
        secondsRemaining--
      }

      if (!animal) exit()
    },
  },
  animals
)

await div(md(`# Phew! You made it! You chose ${animal}`))
