// Name: flag-ecample

import "@johnlindquist/kit";

// This concept is replaced by "Actions", but you will see it in older/legacy scripts
const result = await arg({
  placeholder: "What is your name?",
  flags: {
    post: {
      // This will submit the prompt with the "post" flag
      shortcut: `${cmd}+p`,
    },
    put: {
      // This will submit the prompt with the "put" flag
      shortcut: `${cmd}+u`,
    },
    delete: {
      // This will submit the prompt with the "delete" flag
      shortcut: `${cmd}+d`,
    },
  },
});

await editor(
  JSON.stringify(
    {
      result,
      flag: global.flag, // Inspect which flag was used when submitting
    },
    null,
    2
  )
);
