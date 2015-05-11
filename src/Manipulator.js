export default class Manipulator {

  constructor(skeletizr) {
    this.svg = skeletizr.svg;
    this.root = skeletizr.root;
    this.skeletizr = skeletizr;

    this.moved = false;

    this.group = this.svg.group();
    var bounds = this.svg.rect(0, 0);
    bounds.fill("transparent")
    bounds.stroke("#ff0");
    this.bounds = bounds;

    var dot = this.svg.circle(10);
    dot.fill("rgba(255,0,0,0.25)");
    dot.stroke("#f00");
    dot.addTo(this.group);
    this.dot = dot;

    bounds.addTo(this.group);
    this.group.addTo(this.root);

    this.addListeners();
    this.mode = "move";
  }

  addListeners() {
    let svg = this.svg;

    svg.on("mousedown", (e) => {
      if (this.bone == null) return;
      var mx = e.clientX - 400;
      var my = e.clientY - 300;
      var x = this.bone.x;
      var y = this.bone.y;
      var a = this.bone.a;
      var ma = this.getAngleFromMouseToBone(mx, my, this.bone);

      this.startPos = {
            "x": x,
            "y": y,
            "a": a,
            "pivotX": this.bone.pivotX,
            "pivotY": this.bone.pivotY,
            "mx" : mx,
            "my" : my,
            "ma" : ma
          }
    });

    svg.on("mousemove", (e) => {
      if (!this.startPos) return;

      this.moved = true;

      let mx = e.clientX - 400;
      let my = e.clientY - 300;

      let ma = this.getAngleFromMouseToBone(mx, my, this.bone);
      let da = ma - this.startPos.ma;

      if (this.mode == "move") {
        var pt1 = this.svg.node.createSVGPoint();
        pt1.x = mx;
        pt1.y = my;
        var gpt1 = pt1.matrixTransform(this.bone.group.parent.node.getTransformToElement(this.root.node).inverse());

        var pt2 = this.svg.node.createSVGPoint();
        pt2.x = this.startPos.mx;
        pt2.y = this.startPos.my;
        var gpt2 = pt2.matrixTransform(this.bone.group.parent.node.getTransformToElement(this.root.node).inverse());

        var dx = gpt1.x - gpt2.x;
        var dy = gpt1.y - gpt2.y;

        this.bone.x = this.startPos.x + dx;
        this.bone.y = this.startPos.y + dy;
      } else if (this.mode == "rotate") {
        this.bone.a = this.startPos.a + da;
      } else if (this.mode == "pivot") {
        var pt1 = this.svg.node.createSVGPoint();
        pt1.x = mx;
        pt1.y = my;
        var gpt1 = pt1.matrixTransform(this.bone.group.parent.node.getTransformToElement(this.root.node).inverse());

        var pt2 = this.svg.node.createSVGPoint();
        pt2.x = this.startPos.mx;
        pt2.y = this.startPos.my;
        var gpt2 = pt2.matrixTransform(this.bone.group.parent.node.getTransformToElement(this.root.node).inverse());

        var dx = gpt1.x - gpt2.x;
        var dy = gpt1.y - gpt2.y;

        var pt1 = this.svg.node.createSVGPoint();
        pt1.x = dx;
        pt1.y = dy;

       this.bone.x = this.startPos.x + dx;
       this.bone.y = this.startPos.y + dy;

        pt1.x = mx;
        pt1.y = my;
        pt2.x = this.startPos.mx;
        pt2.y = this.startPos.my;
        var gpt3 = pt1.matrixTransform(this.bone.group.node.getTransformToElement(this.root.node).inverse());
        var gpt4 = pt2.matrixTransform(this.bone.group.node.getTransformToElement(this.root.node).inverse());

        let dx2 = gpt3.x - gpt4.x;
        let dy2 = gpt3.y - gpt4.y;

       this.bone.pivotX = this.startPos.pivotX + dx2;
        this.bone.pivotY = this.startPos.pivotY + dy2;

      }

      requestAnimationFrame(() => {
        this.bone.repaint();
        this.updateOverlay();
      });
    });

    svg.on("mouseup", e => {
      if (!this.moved) {
        let newBone = null;

        let p = e.target.instance;
        while (p != svg && newBone == null) {
          if (this.group == p) {
            newBone = this.bone;
          } else {
            for (let b of this.skeletizr.bones) {
              if (b.group == p) {
                newBone = b;
                break;
              }
            }
          }

          p = p.parent;
        }

        if (newBone != this.bone) {
          this.select(newBone);
        }
      }

      this.startPos = null;
      this.moved = false;
    });

    document.addEventListener("keyup", e => {
      switch (e.keyCode) {
        case 77: // m
          this.setMode("move");
          break;
        case 82: // r
          this.setMode("rotate");
          break;
        case 80: // p
          this.setMode("pivot");
          break;

        case 81: // q
          this.setMode("ik");
          break;

          case 75: // k
            this.skeletizr.addKeyFrame();
            break;
          case 85: // u
            this.skeletizr.updateKeyFrame();
            break;

          case 69: // e
            this.skeletizr.exportData();
            break;
          case 73: // i
            this.skeletizr.import();
            break;

          case 37:
            this.skeletizr.prevFrame();
            break;

          case 39:
            this.skeletizr.nextFrame();
            break;

          case 33: // pgup
            this.bone.svgimg.forward();
            break;

          case 34: // pgdn
            this.bone.svgimg.backward();
            break;

          case 36: // home
            this.bone.svgimg.front();
            break;

          case 35:
            this.bone.svgimg.back();
            break;

          case 65:
            if (this.skeletizr.animating) {
              this.skeletizr.stopAnimation();
            } else {
              this.skeletizr.startAnimation();
            }
        }
      });
  }

  select(bone) {
    this.bone = bone;
    if (bone == null) {
      this.group.hide();
    } else {
      let group = this.group;
      group.show();
      this.updateOverlay();
    }
  }

  updateOverlay() {
    let bone = this.bone;
    if (!bone) return;
    this.bounds.size(bone.img.width, bone.img.height);

    var tx = bone.imgGroup.node.getTransformToElement(this.root.node);
    var txs = `${tx.a},${tx.b},${tx.c},${tx.d},${tx.e},${tx.f}`;
    this.group.transform("matrix", txs);

    this.dot.center(bone.pivotX, bone.pivotY);
  }

  getAngleFromMouseToBone(mx, my, bone) {
    var ma = Math.atan2(bone.x + bone.pivotX - mx, this.bone.y + this.bone.pivotY - my);
    if (ma < 0) ma += 2.0 * Math.PI
    ma *= -180 / Math.PI;
    return ma;
  }

  setMode(mode) {
    this.mode = mode;
  }
}
