var SVG = require("svg.js")

import Preloader from "./Preloader";
import Bone from "./Bone";
import ModelSheet from "./ModelSheet";
import Manipulator from "./Manipulator";

var preloader = new Preloader([
  "dude/arm.png",
  "dude/body.png",
  "dude/foot.png",
  "dude/hand.png",
  "dude/head.png",
  "dude/leg.png"
]);

preloader.load(function (assets) {
  var sheet = new ModelSheet(assets);

  var bone1 = sheet.createBone("dude/body.png");

  var bone2 = sheet.createBone("dude/arm.png");
  var bone3 = sheet.createBone("dude/hand.png");
  bone3.setParent(bone2);
  bone2.setParent(bone1);

  var bone4 = sheet.createBone("dude/head.png");
  bone4.setParent(bone1);

  var bone5 = sheet.createBone("dude/leg.png");
  var bone6 = sheet.createBone("dude/foot.png");
  bone6.setParent(bone5);
  bone5.setParent(bone1);

  bone2.x = 100; bone2.apply();
  bone3.x = 100; bone3.apply();

  var manipulator = new Manipulator(sheet);
  manipulator.select(bone1);

  sheet.svg.click((e) => {
    let t = e.target;
    if (t.instance == sheet.svg || t.instance == sheet.root) return;
    console.log(t.instance);

    let g = e.target.instance.parent;
    console.log(g);
    if (g.type == "g") {
      if (bone1.group === g) manipulator.select(bone1);
      if (bone2.group === g) manipulator.select(bone2);
      if (bone3.group === g) manipulator.select(bone3);
      if (bone4.group === g) manipulator.select(bone4);
      if (bone5.group === g) manipulator.select(bone5);
      if (bone6.group === g) manipulator.select(bone6);
    }
  });
});
