// Name: submit-example

import "@johnlindquist/kit";

const result = await arg(
  {
    placeholder: "Pick one in under 3 seconds or I'll pick one for you",
    onInit: async () => {
      await wait(3000);
      submit("broccoli"); //forces a submission
    },
  },
  ["cookie", "donut"]
);

// Wait for 1 second
await editor(result);
