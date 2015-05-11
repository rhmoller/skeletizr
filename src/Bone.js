export default class Bone {

  constructor(skeletizr, name, img, x = 0, y = 0, a = 0, pivotX = 0, pivotY = 0) {
    this.root = skeletizr.root;
    this.svg = skeletizr.svg;
    this.name = name;
    this.img = img;

    this.pivotX = pivotX;
    this.pivotY = pivotY;

    this.x = x;
    this.y = y;
    this.a = a;

    this.children = new Set();

    var imgGroup = this.svg.group();
    var svgimg = this.svg.image(img.src)
    imgGroup.add(svgimg);
    imgGroup.addClass("imgBone");
    this.svgimg = svgimg;

    var group = this.svg.group();
    group.addClass("bone");
    group.add(imgGroup);
    this.group  = group;
    this.imgGroup = imgGroup;

    this.group.addTo(skeletizr.root);
    this.repaint();
  }

  setPivot(x, y) {
    this.pivotX = x;
    this.pivotY = y;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setAngle(a) {
    this.a = a;
  }

  repaint() {
    this.group
      .translate(this.x - this.pivotX, this.y - this.pivotY)
      .rotate(this.a, this.x, this.y);

    var tx = this.group.node.getTransformToElement(this.root.node);
    var txs = `${tx.a},${tx.b},${tx.c},${tx.d},${tx.e},${tx.f}`;
//    this.svgimg.transform("matrix", txs);
//
    for (let child of this.children) {
      child.repaint();
    }
  }

  setParent(parent) {
    parent.children.add(this);
    this.parent = parent;
    this.group.addTo(parent.group);
  }

}
