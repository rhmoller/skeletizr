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

  constructor(img, width, height, rect, pivot, px, py) {
    this.img = img;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.rect = rect;
    this.pivot = pivot;
    this.pivotX = px;
    this.pivotY = py;
    this.selected = false;
  }

  apply() {
    let tx = `translate(${this.x} ${this.y}) rotate(${this.a} ${this.pivotX} ${this.pivotY})`
    this.img.transform(tx);
    this.rect.transform(tx);

    this.pivot.transform(`translate(${this.x + this.pivotX} ${this.y + this.pivotY})`);

    this.rect.attr({"stroke": this.selected ? "blue" : "transparent"});
    this.pivot.attr({"stroke": this.selected ? "blue" : "transparent"});
  }

}

class Manipulator {

  constructor(svg, bones) {
    this.svg = svg;
    this.bones = bones,
    this.bone = null;
    this.mode = "Select";
    this.modeStatus = document.getElementById("mode");
    this.startPos = null;
    this.zoom = 1;
    this.panX = 400;
    this.panY = 300;
  }

  setMode(mode) {
    this.mode = mode;
    this.modeStatus.innerHTML = mode;
  }

  getMousePos(e) {
    return {
      "x": (e.pageX - this.panX) / this.zoom,
      "y": (e.pageY - this.panY) / this.zoom
    }
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

        case 80:
          this.setMode("Pivot");
          break;
      }
    })

    document.addEventListener("keyup", (e) => {

      switch (e.keyCode) {
        case 77:
        case 82:
        case 80:
          this.setMode("Select");
          break;

        case 107:
          this.zoom *= 2;
          this.svg.transform(`translate(${this.panX}, ${this.panY}) scale(${this.zoom}, ${this.zoom})`);
          break;

        case 109:
          this.zoom *= 0.5;
          this.svg.transform(`translate(${this.panX}, ${this.panY}) scale(${this.zoom}, ${this.zoom})`);
          break;

        case 33:
          if (this.bone) {
            this.svg.append(this.bone.img);
          }
          break;

        case 34:
          if (this.bone) {
            this.svg.prepend(this.bone.img);
          }

      }

    });

    document.addEventListener("mousedown", (e) => {
      let m = this.getMousePos(e);

      if (this.bone == null) {
        this.startPos = {
          "x": this.panX,
          "y": this.panY,
          "mx": m.x,
          "my": m.y,
        }
        return;
      }

      switch (this.mode) {
        case "Move":
        case "Rotate":
          var mx = m.x;
          var my = m.y;
          var x = this.bone.x;
          var y = this.bone.y;
          var a = this.bone.a;
          var ma = Snap.angle(x + this.bone.pivotX, y + this.bone.pivotY, mx, my);

          this.startPos = {
            "x": x,
            "y": y,
            "a": a,
            "mx" : mx,
            "my" : my,
            "ma" : ma
          }

          break;

        case "Pivot":
          var mx = m.x;
          var my = m.y;
          var x = this.bone.pivotX;
          var y = this.bone.pivotY;

          this.startPos = {
            "x": x,
            "y": y,
            "mx" : mx,
            "my" : my,
          }

          break;
      }
    });

    document.addEventListener("mouseup", (e) => {
      this.startPos = null;
    });

    document.addEventListener("mousemove", (e) => {
      if (this.startPos == null) return;


      if (this.bone == null) {
        // cannot use getMousePos() because it shifts origin when panning, so the delta gets wrong
        let m = {
          "x": (e.pageX - this.startPos.x) / this.zoom,
          "y": (e.pageY - this.startPos.y) / this.zoom
        };

        let dx = (m.x - this.startPos.mx) * this.zoom;
        let dy = (m.y - this.startPos.my) * this.zoom;
        this.panX = this.startPos.x + dx;
        this.panY = this.startPos.y + dy;
        this.svg.transform(`translate(${this.panX}, ${this.panY}) scale(${this.zoom}, ${this.zoom})`);
        return;
      }

      let m = this.getMousePos(e);

      switch (this.mode) {
        case "Move":
          var mx = m.x;
          var my = m.y;
          var dx = mx - this.startPos.mx;
          var dy = my - this.startPos.my;
          var x = this.startPos.x + dx;
          var y = this.startPos.y + dy;
          this.bone.x = x;
          this.bone.y = y;
          this.bone.apply();
          break;

        case "Rotate":
          var mx = m.x;
          var my = m.y;
          var dx = mx - this.startPos.mx;
          var dy = my - this.startPos.my;

          var ma = Snap.angle(this.startPos.x + this.bone.pivotX, this.startPos.y + this.bone.pivotY, mx, my);
          var da = ma - this.startPos.ma;
          var a = this.startPos.a + da;

          this.bone.a = a;
          this.bone.apply();

          break;

        case "Pivot":
          var mx = m.x;
          var my = m.y;
          var dx = mx - this.startPos.mx;
          var dy = my - this.startPos.my;

          this.bone.pivotX = this.startPos.x + dx;
          this.bone.pivotY = this.startPos.y + dy;
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
          let pos = this.getMousePos(e);

          for (let bone of this.bones) {
            let hit = (pos.x > bone.x &&
                       pos.x < bone.x + bone.width &&
                       pos.y > bone.y &&
                       pos.y < bone.y + bone.height);
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
  s.transform("translate(400, 300) scale(1, 1)");

  function createBone(path, x, y) {
    var asset = assets[path];
    var img = s.image(path, 0, 0, asset.width, asset.height);

    var rect = s.rect(0, 0, asset.width, asset.height);
    rect.attr({"fill": "transparent", "stroke": "transparent", "strokeWidth": 2});

    var pivot = s.circle(0, 0, 4);
    pivot.attr({"fill": "transparent", "stroke": "transparent", "strokeWidth": 2});

    var bone = new Bone(img, asset.width, asset.height, rect, pivot, 0.5 * asset.width, 0.5 * asset.height);
    bone.x = x;
    bone.y = y;
    bone.a = 0;
    bone.apply();

    return bone;
  }

  let bones = [];
  bones.push(createBone("dude/arm.png", 100 - 400, 0));
  bones.push(createBone("dude/body.png", 200 - 400, 0));
  bones.push(createBone("dude/foot.png", 300 - 400, 0));
  bones.push(createBone("dude/hand.png", 400 - 400, 0));
  bones.push(createBone("dude/head.png", 500 - 400, 0));
  bones.push(createBone("dude/leg.png", 600 - 400, 0));

  var manipulator = new Manipulator(s, bones);
  manipulator.init();
}

preloader.load(start);
