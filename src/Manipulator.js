import Bone from "./Bone";

export default class Manipulator {

  constructor(sheet) {
    this.mode = "Rotate";
    this.addListeners();
    this.sheet = sheet;

    this.overlay = sheet.svg.rect(200, 200);
    this.overlay.stroke("blue");
    this.overlay.fill("transparent");
    this.overlay.addTo(sheet.root);
    this.overlay.attr("pointer-events", "none");

    this.pivotPoint = sheet.svg.circle(5);
    this.pivotPoint.stroke("red").fill("red");
    this.pivotPoint.addTo(sheet.root);
  }

  select(bone) {
      this.bone = bone;
      this.updateOverlay();
  }

  updateOverlay() {
    var tx = this.bone.group.node.getTransformToElement(this.sheet.root.node);
    var txs = `${tx.a},${tx.b},${tx.c},${tx.d},${tx.e},${tx.f}`;
    console.log("tx: " + txs);
    this.overlay.transform("matrix", txs);
    this.overlay.width(this.bone.width);
    this.overlay.height(this.bone.height);

    this.pivotPoint.transform("matrix", txs);
    this.pivotPoint.center(this.bone.pivotX, this.bone.pivotY);

  }

  setMode(mode) {
    this.mode = mode;
  }

  getAngleFromMouseToBone(mouseEvent, bone) {
    var mx = mouseEvent.clientX - 400;
    var my = mouseEvent.clientY - 300;
    var ma = Math.atan2(bone.x + bone.pivotX - mx, this.bone.y + this.bone.pivotY - my);
    if (ma < 0) ma += 2.0 * Math.PI
    ma *= -180 / Math.PI;
    return ma;
  }

  addListeners() {

    document.addEventListener("mousedown", (e) => {
      if (this.bone == null) {
        return;
      }

      switch (this.mode) {
        case "Move":
        case "Rotate":
          var mx = e.clientX - 400;
          var my = e.clientY - 300;
          var x = this.bone.x;
          var y = this.bone.y;
          var a = this.bone.a;
          var ma = this.getAngleFromMouseToBone(e, this.bone);
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
          var mx = e.clientX - 400;
          var my = e.clientY - 300;
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
        return;
      }

      var mx = e.clientX - 400;
      var my = e.clientY - 300;
      var ma = this.getAngleFromMouseToBone(e, this.bone);

      let self = this;

      switch (this.mode) {
        case "Move":
          requestAnimationFrame(() => {
            if (self.startPos == null) return;

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
            self.updateOverlay();
          });
          break;

        case "Rotate":
          var da = ma - this.startPos.ma;
          var a = this.startPos.a + da;
          this.bone.a = a;
          this.bone.apply();
          this.updateOverlay();
          break;

        case "Pivot":
            requestAnimationFrame(() => {
              if (self.startPos == null) return;
              var pt1 = self.bone.sheet.svg.node.createSVGPoint();
              pt1.x = mx;
              pt1.y = my;
              var gpt1 = pt1.matrixTransform(self.bone.group.node.getTransformToElement(self.bone.sheet.root.node).inverse());

              var pt2 = self.bone.sheet.svg.node.createSVGPoint();
              pt2.x = self.startPos.mx;
              pt2.y = self.startPos.my;
              var gpt2 = pt2.matrixTransform(self.bone.group.node.getTransformToElement(self.bone.sheet.root.node).inverse());

              var dx = gpt2.x - gpt1.x;
              var dy = gpt2.y - gpt1.y;

              self.bone.pivotX = self.startPos.x + dx;
              self.bone.pivotY = self.startPos.y + dy;
              self.bone.apply();
              self.updateOverlay();

              console.log(`bone pivot ${self.bone.pivotX}, ${self.bone.pivotY}`);
            });

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
