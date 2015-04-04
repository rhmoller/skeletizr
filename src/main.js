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

  constructor(img, width, height, rect) {
    this.img = img;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.rect = rect;
    this.selected = false;
  }

  apply() {
    let tx = `translate(${this.x} ${this.y}) rotate(${this.a} ${0.5 *this.w} ${0.5*this.h})`
    this.img.transform(tx);
    this.rect.transform(tx);
    this.rect.attr({"stroke": this.selected ? "blue" : "transparent"});
  }

}

class Manipulator {

  constructor(bones) {
    this.bones = bones,
    this.bone = null;
    this.mode = "Select";
    this.modeStatus = document.getElementById("mode");
    this.startPos = null;
  }

  setMode(mode) {
    this.mode = mode;
    this.modeStatus.innerHTML = mode;
  }

  init() {
    document.addEventListener("keydown", (e) => {
      switch (e.keyCode) {
        case 77:
          this.setMode("Move");
          break;
        case 82:
          this.setMode("Rotate");
          break;
      }
    })

    document.addEventListener("keyup", (e) => {
      switch (e.keyCode) {
        case 77:
        case 82:
          this.setMode("Select");
          break;
      }
    });

    document.addEventListener("mousedown", (e) => {
      if (this.bone == null) return;

      switch (this.mode) {
        case "Move":
        case "Rotate":
          var mx = e.pageX;
          var my = e.pageY;
          var x = this.bone.x;
          var y = this.bone.y;
          var a = this.bone.a;
          var w2 = this.bone.width *  0.5;
          var h2 = this.bone.height *  0.5;

          var ma = Snap.angle(x + w2, y + h2, mx, my);

          this.startPos = {
            "x": x,
            "y": y,
            "a": a,
            "mx" : e.pageX,
            "my" : e.pageY,
            "ma" : ma
          }

          break;
      }
    });

    document.addEventListener("mouseup", (e) => {
      if (this.bone == null) return;

      switch (this.mode) {
        case "Move":
        case "Rotate":
          this.startPos = null;
          break;
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (this.startPos == null) return;
      if (this.bone == null) return;

      switch (this.mode) {
        case "Move":
          var mx = e.pageX;
          var my = e.pageY;
          var dx = mx - this.startPos.mx;
          var dy = my - this.startPos.my;
          var x = this.startPos.x + dx;
          var y = this.startPos.y + dy;
          this.bone.x = x;
          this.bone.y = y;
          this.bone.apply();
          break;

        case "Rotate":
          var mx = e.pageX;
          var my = e.pageY;
          var dx = mx - this.startPos.mx;
          var dy = my - this.startPos.my;

          var w2 = this.bone.width *  0.5;
          var h2 = this.bone.height *  0.5;

          var ma = Snap.angle(this.startPos.x + w2, this.startPos.y + h2, mx, my);
          var da = ma - this.startPos.ma;
          var a = this.startPos.a + da;

          this.bone.a = a;
          this.bone.apply();

          break;
      }

    });

    document.addEventListener("click", (e) => {
      switch (this.mode) {
        case "Select":
          if (this.bone) {
            this.bone.selected = false;
            this.bone.apply();
          }

          this.bone = null;

          for (let bone of this.bones) {
            let hit = (e.pageX > bone.x &&
                       e.pageX < bone.x + bone.width &&
                       e.pageY > bone.y &&
                       e.pageY < bone.y + bone.height);
             if (hit) {
               this.bone = bone;
               this.bone.selected = true;
               this.bone.apply();
             }
          }
          break;
      }
    });

  }

}


function start(assets) {

  var s = Snap("#canvas");

  function createBone(path, x, y) {
    var asset = assets[path];
    var img = s.image(path, 0, 0, asset.width, asset.height);
    var rect = s.rect(0, 0, asset.width, asset.height);
    rect.attr({"fill": "transparent", "stroke": "transparent", "strokeWidth": 2});

    var bone = new Bone(img, asset.width, asset.height, rect);
    bone.x = x;
    bone.y = y;
    bone.a = 0;
    bone.apply();

    return bone;
  }

  let bones = [];
  bones.push(createBone("dude/head.png", 400, 300));
  bones.push(createBone("dude/body.png", 200, 300));

  var manipulator = new Manipulator(bones);
  manipulator.init();
}

preloader.load(start);
