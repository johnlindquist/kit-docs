import "@johnlindquist/kit"

const emojiStoryGenerator = ai('Generate a story using only emoji, no text.')
const story = await emojiStoryGenerator('Epic Fantasy')
await editor(story)