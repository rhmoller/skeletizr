import Bone from "./Bone";

export default class ModelSheet {

  constructor(assets) {
    var svg = SVG('canvas').size(800, 600);
    svg.style({ "user-select" : "none"});
    var root = svg.group();
    root.translate(400, 300);

    this.svg = svg;
    this.root = root;
    this.assets = assets;
    this.layers = svg.group();
    this.layers.addTo(root);

    this.bones = [];
    this.keyframes = [];
    this.frame = 0;
  }

  createBone(imgPath) {
    var asset = this.assets[imgPath];
    var bone = new Bone(this, imgPath, asset.width, asset.height);
    bone.group.addTo(this.root);

    this.bones.push(bone);
    return bone;
  }

  dump() {
    var pose = [];
    for (let bone of this.bones) {
      let bp = {
        "x": bone.x,
        "y": bone.y,
        "a": bone.a
      }
      pose.push(bp);
    }
    console.log("Stored key frame " + this.keyframes.length);
    this.keyframes.push(pose);
  }

  next() {
    if (this.keyframes.length < 2) return;
    this.frame++;
    if (this.frame >= this.keyframes.length) this.frame = 0;
    this.load();
  }

  prev() {
    if (this.keyframes.length < 2) return;
    this.frame--;
    if (this.frame <= 0) this.frame = this.keyframes.length - 1;
    this.load();
  }

  load() {
    let pose = this.keyframes[this.frame];
    for (let i = 0; i < pose.length; i++) {
      let bone = this.bones[i];
      let bp = pose[i];
      bone.x = bp.x;
      bone.y = bp.y;
      bone.a = bp.a;
      bone.apply();
    }
    console.log("Loaded key frame " + this.frame);
  }

}
