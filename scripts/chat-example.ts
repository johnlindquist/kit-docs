// Name: Testing Chat

import "@johnlindquist/kit"

await chat({
  onInit: async () => {
    chat.addMessage({
      // Note: text and position are implemented, there are other properties that are a WIP
      text: "You like Script Kit",
      position: "left",
    })

    await wait(1000)

    chat.addMessage({
      text: "Yeah! It's awesome!",
      position: "right",
    })

    await wait(1000)

    chat.addMessage({
      text: "I know, right?!?",
      position: "left",
    })

    await wait(1000)

    chat.addMessage({
      text: `<img src="https://media0.giphy.com/media/yeE6B8nEKcTMWWvBzD/giphy.gif?cid=0b9ef2f49arnbs4aajuycirjsclpbtimvib6a76g7afizgr5&ep=v1_gifs_search&rid=giphy.gif" width="200px" />`,
      position: "right",
    })
  },
})
