// dev/kit-docs/scripts/provide-contextual-search-information.ts
import "@johnlindquist/kit";
var choices = [
  {
    // Always show
    name: "Please contact support if you don't see your fruit",
    info: true
  },
  {
    // Only show when there are no results
    name: "No fruits match your search",
    miss: true
  },
  "apple",
  "banana",
  "orange"
];
await arg(
  {
    placeholder: "Select a fruit for your basket",
    enter: "Checkout"
  },
  choices
);
