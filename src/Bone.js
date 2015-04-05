export default class Bone {

  constructor(sheet, asset, width, height) {
    var s1 = sheet.svg.image(asset, width, height);
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
