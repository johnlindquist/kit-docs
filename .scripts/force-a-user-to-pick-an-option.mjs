// dev/kit-docs/scripts/force-a-user-to-pick-an-option.ts
import "@johnlindquist/kit";
var animals = ["dog", "cat", "rabbit", "horse", "elephant"];
var secondsRemaining = 3;
var getHint = (secondsRemaining2) => `Hurry! You only have ${secondsRemaining2} seconds to choose an animal...`;
var animal = "";
animal = await arg(
  {
    hint: getHint(secondsRemaining),
    onInit: async () => {
      while (secondsRemaining > 0 && !animal) {
        setHint(getHint(secondsRemaining));
        await wait(1e3);
        secondsRemaining--;
      }
      if (!animal)
        exit();
    }
  },
  animals
);
await div(md(`# Phew! You made it! You chose ${animal}`));
