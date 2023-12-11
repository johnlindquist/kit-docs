// dev/kit-docs/scripts/append-text-to-editor.ts
import "@johnlindquist/kit";
var sentence = `This is a sentence that will be appended to the editor.`;
var words = sentence.split(" ");
setInterval(() => {
  let word = words.shift();
  if (word) {
    editor.append(word + " ");
  }
}, 100);
await editor({
  lineNumbers: "on",
  fontFamily: "Menlo"
});
