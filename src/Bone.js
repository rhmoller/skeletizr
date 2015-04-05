export default class Bone {

  constructor(sheet, asset, width, height) {
    var shape = sheet.svg.image(asset, width, height);
    var group = sheet.svg.group();//.move(-0.5 * asset.width, -0.5 * asset.height);

    shape.addTo(group);
    group.addTo(sheet.root);

    this.sheet = sheet;
    this.shape = shape;
    this.group = group;

    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.pivotX = 0.5 * width;
    this.pivotY = 0.5 * height;
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
