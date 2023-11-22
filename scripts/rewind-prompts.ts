// Name: Rewind Prompts
// Group: Prompt

import { Shortcut } from "@johnlindquist/kit"

let currentStep = 0
let direction = 1

let shortcuts: Shortcut[] = [
  {
    key: "escape",
    onPress: async () => {
      submit("")
    },
  },
]

let step1 = async () =>
  await arg({
    placeholder: "one",
    shortcuts,
  })

let step2 = async () =>
  await arg({
    placeholder: "two",
    shortcuts,
  })

let step3 = async () =>
  await arg({
    placeholder: "three",
    shortcuts,
  })

let steps = [
  { prompt: step1, value: "" },
  { prompt: step2, value: "" },
  { prompt: step3, value: "" },
]

while (currentStep < steps.length) {
  let step = steps[currentStep]
  step.value = await step.prompt()
  direction = step.value ? 1 : -1
  currentStep += direction
  if (currentStep < 0) {
    exit() // Pressing escape on the first prompt will exit the script
  }
}

inspect(steps)
