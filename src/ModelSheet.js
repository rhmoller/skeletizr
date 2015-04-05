import Bone from "./Bone";

export default class ModelSheet {

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
