import Bone from "./Bone";

export default class ModelSheet {

  constructor(assets) {
    var svg = SVG('canvas').size(800, 600);
    var root = svg.group();
    root.translate(400, 300);

    this.svg = svg;
    this.root = root;
    this.assets = assets;
    this.layers = svg.group();
    this.layers.addTo(root);
  }

  createBone(imgPath) {
    var asset = this.assets[imgPath];
    var bone = new Bone(this, imgPath, asset.width, asset.height);
    bone.group.addTo(this.root);
    return bone;
  }

}
