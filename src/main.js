/*
 * Skeletizr
 * a bare bones 2D animation tool
 * by Rene Hangstrup Møller
 *
 * Released under a MIT License
 *
 * TODO: save to file
 * TODO: load from file
 * TODO: keyframe interpolation
 * TODO: remove bone
 * TODO: reparent bones
 * TODO: image library
 * TODO: add bone
 * TODO: zoom and pan
 * TODO: skeleton treeview
 * TODO: swap image
 */
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

  var bone7 = sheet.createBone("dude/arm.png");
  var bone8 = sheet.createBone("dude/hand.png");
  bone8.setParent(bone7);
  bone7.setParent(bone1);

  var bone10 = sheet.createBone("dude/leg.png");
  var bone11 = sheet.createBone("dude/foot.png");
  bone11.setParent(bone10);
  bone10.setParent(bone1);

  bone2.x = 100; bone2.apply();
  bone3.x = 100; bone3.apply();

  var bones = [];
  bones.push(bone1);
  bones.push(bone2);
  bones.push(bone3);
  bones.push(bone4);
  bones.push(bone5);
  bones.push(bone6);
  bones.push(bone7);
  bones.push(bone8);
  bones.push(bone10);
  bones.push(bone11);

  var manipulator = new Manipulator(sheet, bones);
  manipulator.select(bone1);

});
