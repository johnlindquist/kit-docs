// dev/kit-docs/scripts/rewind-prompts.ts
var currentStep = 0;
var direction = 1;
var shortcuts = [
  {
    key: "escape",
    onPress: async () => {
      submit("");
    }
  }
];
var step1 = async () => await arg({
  placeholder: "one",
  shortcuts
});
var step2 = async () => await arg({
  placeholder: "two",
  shortcuts
});
var step3 = async () => await arg({
  placeholder: "three",
  shortcuts
});
var steps = [
  { prompt: step1, value: "" },
  { prompt: step2, value: "" },
  { prompt: step3, value: "" }
];
while (currentStep < steps.length) {
  let step = steps[currentStep];
  step.value = await step.prompt();
  direction = step.value ? 1 : -1;
  currentStep += direction;
  if (currentStep < 0) {
    exit();
  }
}
inspect(steps);
