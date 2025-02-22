// Name: preventSubmit-example

import "@johnlindquist/kit";

await arg({
  placeholder: "Try to submit text less than 10 characters",
  onSubmit: async (input) => {
    if (input.length < 10) {
      setHint(
        "Text must be at least 10 characters. You entered " + input.length
      );
      setEnter("Try Again");
      return preventSubmit;
    }
  },
});
