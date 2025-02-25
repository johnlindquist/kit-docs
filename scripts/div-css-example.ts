// Name: div-css-example

import "@johnlindquist/kit";

await div({
  html: md(`# Hello World
    
<p style="color: red;">This is a note</p>
    `),
  css: `
  body{
    background-color: white !important;
  }

  h1{
    color: blue !important;
  }
    `,
});
