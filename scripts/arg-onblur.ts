// Name: arg-onblur

import "@johnlindquist/kit"

await arg({
    // Prevent the "arg" prompt from closing when blurred
    // (or implement a custom behavior)
    onBlur: () => { }
})