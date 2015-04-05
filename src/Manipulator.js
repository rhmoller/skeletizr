import Bone from "./Bone";

export default class Manipulator {

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
