export default class Bone {

  constructor(sheet, asset, width, height) {
    var shape = sheet.svg.image(asset, width, height);
    shape.style({ "user-select" : "none" });

    var group = sheet.svg.group();//.move(-0.5 * asset.width, -0.5 * asset.height);

    shape.addTo(sheet.layers);
    var bounds = sheet.svg.rect(width, height);
    bounds.fill("transparent")
    bounds.addTo(group);
    group.addTo(sheet.root);

    this.sheet = sheet;
    this.shape = shape;
    this.group = group;
    this.bounds = bounds;

    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.pivotX = 0.5 * width;
    this.pivotY = 0.0 * height;
    this.width = width;
    this.height = height;
    this.children = new Set();
  }

  setParent(parent) {
    parent.children.add(this);
    this.group.addTo(parent.group);
    this.apply();
  }

  apply() {
      this.group
        .translate(this.x - this.pivotX, this.y - this.pivotY)
        .rotate(this.a, this.x, this.y);
      this.syncShape();
  }

  syncShape() {
    var tx = this.group.node.getTransformToElement(this.sheet.root.node);
    var txs = `${tx.a},${tx.b},${tx.c},${tx.d},${tx.e},${tx.f}`;
    this.shape.transform("matrix", txs);
    for (let child of this.children) {
      child.syncShape();
    }
  }

}
