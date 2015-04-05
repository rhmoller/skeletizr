var SVG = require("svg.js")

import Preloader from "./Preloader"

var preloader = new Preloader([
  "dude/arm.png",
  "dude/body.png",
  "dude/foot.png",
  "dude/hand.png",
  "dude/head.png",
  "dude/leg.png"
]);

class Bone {

  constructor(sheet, asset, width, height) {
    var s1 = sheet.svg.image("dude/body.png", asset.width, asset.height);
    var g1 = sheet.svg.group();//.move(-0.5 * asset.width, -0.5 * asset.height);

    s1.addTo(g1);
    g1.addTo(sheet.root);

    this.sheet = sheet;
    this.shape = s1;
    this.group = g1;

    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.pivotX = 0.5 * width;
    this.pivotY = 0.5 * height;

    //this.group.data("bone", this);
  }

  setParent(parent) {
    this.group.addTo(parent.group);
  }

  apply() {
    this.group
      .translate(this.x, this.y)
      .rotate(this.a, this.x + this.pivotX, this.y + this.pivotY);
  }

}

class ModelSheet {

  constructor(assets) {
    var svg = SVG('canvas').size(800, 600);
    var root = svg.group();
    root.translate(400, 300);

    var mouseLine = svg.line(0, 0, 400, 300).stroke({ width: 1, color: "#f00" });
    mouseLine.addTo(root);

    this.svg = svg;
    this.root = root;
    this.assets = assets;
  }

  createBone(imgPath) {
    var asset = this.assets[imgPath];
    var bone = new Bone(this, imgPath, asset.width, asset.height);
    bone.group.addTo(this.root);
    return bone;
  }

}

class Manipulator {

  constructor() {
    this.mode = "Rotate";
    this.addListeners();
  }

  select(bone) {
      this.bone = bone;
  }

  setMode(mode) {
    this.mode = mode;
  }

  addListeners() {

    document.addEventListener("mousedown", (e) => {
      if (this.bone == null) {
        return;
      }

      var mx = e.clientX - 400;
      var my = e.clientY - 300;
      var x = this.bone.x;
      var y = this.bone.y;
      var a = this.bone.a;
      var ma = Math.atan2(this.bone.x + this.bone.pivotX - mx, this.bone.y + this.bone.pivotY - my);
      if (ma < 0) ma += 2.0 * Math.PI
      ma *= -180 / Math.PI;

      this.startPos = {
            "x": x,
            "y": y,
            "a": a,
            "mx" : mx,
            "my" : my,
            "ma" : ma
          }
    });

    document.addEventListener("mouseup", (e) => {
      this.startPos = null;
    });

    document.addEventListener("mousemove", (e) => {
      if (this.startPos == null) return;

      if (this.bone == null) {
        return;
      }

      var mx = e.clientX - 400;
      var my = e.clientY - 300;
      var ma = Math.atan2(this.bone.x + this.bone.pivotX - mx, this.bone.y + this.bone.pivotY - my);
      if (ma < 0) ma += 2.0 * Math.PI
      ma *= -180 / Math.PI;

      switch (this.mode) {
        case "Move":
          let self = this;
          requestAnimationFrame(() => {

            var pt1 = self.bone.sheet.svg.node.createSVGPoint();
            pt1.x = mx;
            pt1.y = my;
            var gpt1 = pt1.matrixTransform(self.bone.group.parent.node.getTransformToElement(self.bone.sheet.root.node).inverse());

            var pt2 = self.bone.sheet.svg.node.createSVGPoint();
            pt2.x = self.startPos.mx;
            pt2.y = self.startPos.my;
            var gpt2 = pt2.matrixTransform(self.bone.group.parent.node.getTransformToElement(self.bone.sheet.root.node).inverse());

            var dx = gpt1.x - gpt2.x;
            var dy = gpt1.y - gpt2.y;

            var x = self.startPos.x + dx;
            var y = self.startPos.y + dy;
            self.bone.x = x;
            self.bone.y = y;
            self.bone.apply();
          });
          break;

        case "Rotate":
          var da = ma - this.startPos.ma;
          var a = this.startPos.a + da;
          this.bone.a = a;
          this.bone.apply();

          break;

      }

      document.addEventListener("keyup", (e) => {
        switch (e.keyCode) {
          case 77:
            this.setMode("Move");
            break;
          case 82:
            this.setMode("Rotate");
            break;

          case 80:
            this.setMode("Pivot");
            break;
        }

      });

    });
  }

}


preloader.load(function (assets) {
  var sheet = new ModelSheet(assets);

  var bone1 = sheet.createBone("dude/body.png");
  var bone2 = sheet.createBone("dude/body.png");
  var bone3 = sheet.createBone("dude/body.png");

  bone3.setParent(bone2);
  bone2.setParent(bone1);

  bone2.x = 100; bone2.apply();
  bone3.x = 100; bone3.apply();

  var manipulator = new Manipulator();
  manipulator.select(bone1);

  //bone1.group.click((e) => { manipulator.select(bone1); });
  //bone2.group.click((e) => { manipulator.select(bone2); });
  //bone3.group.click((e) => { manipulator.select(bone3); });

  console.log("This is new");
  sheet.svg.click((e) => {
    let t = e.target;
    if (t.instance == sheet.svg || t.instance == sheet.root) return;
    console.log(t.instance);

    let g = e.target.instance.parent;
    console.log(g);
    if (g.type == "g") {
      console.log("select " + g);
      if (bone1.group === g) manipulator.select(bone1);
      if (bone2.group === g) manipulator.select(bone2);
      if (bone3.group === g) manipulator.select(bone3);
    }
  });

/*
  s1.addTo(g1);

  var s2 = svg.image("dude/body.png", asset.width, asset.height);
  var g2 = svg.group();//.move(-0.5 * asset.width, -0.5 * asset.height);
  g2.translate(150, 0);
  g2.rotate(45, 150 + 0.5 * asset.width, 0.5 * asset.height);
  g2.addTo(g1);
  s2.addTo(g2);

  var s3 = svg.image("dude/body.png", asset.width, asset.height);
  var g3 = svg.group();//.move(-0.5 * asset.width, -0.5 * asset.height);
  g3.translate(150, 0);
  g3.rotate(45, 150 + 0.5 * asset.width, 0.5 * asset.height);
  g3.addTo(g2);
  s3.addTo(g3);

  var overlay = svg.rect(asset.width, asset.height);
  overlay.stroke("#f00").fill("transparent");
  overlay.addTo(g1);

  mouseLine.addTo(root);

  function clickr(e) {
    var img = e.target.instance;

    var pt = svg.node.createSVGPoint();
    pt.x = img.x() + 0.5 * asset.width;
    pt.y = img.y() + 0.5 * asset.height;
    var gpt = pt.matrixTransform(img.node.getTransformToElement(svg.node));
    console.log(`transformed ${gpt.x}, ${gpt.y}`);

    mouseLine.plot(gpt.x -400, gpt.y - 300, 0, 0);
    overlay.addTo(img.parent);
    overlay.front();
  }

  g1.click(clickr);
  g2.click(clickr);
  g3.click(clickr);
*/
});


/*
var img = svg.image("dude/body.png");

var bone = svg.group();
bone.add(img);
root.add(bone);

img.rotate(45, 0.5 * img.width(), 0.5 * img.height());

svg.click(function (e) {
  var img = e.target;
  var bone = img.instance.parent;
  var bbox = bone.rbox();
  var overlay = svg.rect(bbox.width, bbox.height);
  overlay.fill("transparent").stroke("#f00");
  bone.add(overlay);
});

*/
