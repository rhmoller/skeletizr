var SVG = require("svg.js")

import Skeletizr from "./Skeletizr"

let config = {
  assets: [
    "dude/arm.png",
    "dude/body.png",
    "dude/foot.png",
    "dude/hand.png",
    "dude/head.png",
    "dude/leg.png"
  ],

  bones: [
    { name: "body", img: "dude/body.png", x: 0, y: 0, a: 90, pivotX: 32, pivotY: 32 },
    { name: "head", img: "dude/head.png", x: 100, y: 0, a: 0, pivotX: 0, pivotY: 0 },
    { name: "arm", img: "dude/arm.png", x: 100, y: 0, a: 0, pivotX: 0, pivotY: 0 },
    { name: "hand", img: "dude/hand.png", x: 100, y: 0, a: 0, pivotX: 0, pivotY: 0 }
  ],

  rig: [
    { parent: "body", child: "head" },
   { parent: "body", child: "arm" },
   { parent: "arm", child: "hand" }
  ]

};

let cf2 = {"assets":["dude/arm.png","dude/body.png","dude/foot.png","dude/hand.png","dude/head.png","dude/leg.png"],"bones":[{"name":"body","img":"dude/body.png","x":0,"y":0,"a":90,"pivotX":32,"pivotY":32},{"name":"head","img":"dude/head.png","x":100,"y":0,"a":0,"pivotX":0,"pivotY":0},{"name":"arm","img":"dude/arm.png","x":100,"y":0,"a":0,"pivotX":0,"pivotY":0},{"name":"hand","img":"dude/hand.png","x":100,"y":0,"a":0,"pivotX":0,"pivotY":0}],"rig":[{"parent":"body","child":"head"},{"parent":"body","child":"arm"},{"parent":"arm","child":"hand"}],"keyframes":[{"body":{"x":-190,"y":-102,"a":34.83652788565692},"head":{"x":100,"y":0,"a":0},"arm":{"x":100,"y":0,"a":0},"hand":{"x":100,"y":0,"a":0}},{"body":{"x":167,"y":-179,"a":34.83652788565692},"head":{"x":100,"y":0,"a":0},"arm":{"x":100,"y":0,"a":0},"hand":{"x":100,"y":0,"a":0}},{"body":{"x":1,"y":87,"a":34.83652788565692},"head":{"x":100,"y":0,"a":0},"arm":{"x":100,"y":0,"a":0},"hand":{"x":100,"y":0,"a":0}}]};

window.Skeletizr = Skeletizr;
