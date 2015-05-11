import Preloader from "./Preloader"
import Bone from "./Bone"
import Manipulator  from "./Manipulator"

export default class Skeletizr {

  constructor(config) {
    this.config = config;
    this.bones = [];
    this.boneMap = {};
    this.keyframes = [];
    this.currentFrame = -1;
    this.animating = false;

    if (config.keyframes) {
      this.keyframes = config.keyframes;
    }

    if (config.speed) {
      this.speed = config.speed;
    } else {
      this.speed = 0.01;
    }
  }

  init() {
    this.svg = SVG('canvas').size("100%", "100%");
    this.preloader = new Preloader(this.config.assets);
    this.preloader.load(assets => {
      this.assets = assets;
      this.start();
    });
  }

  start() {
    var svg = this.svg;
    var root = svg.group();
    root.translate(400, 300);
    this.root = root;

    var dot = svg.circle(10);
    dot.fill("rgba(0,255,0,0.25)");
    dot.stroke("#0f0");
    dot.addTo(root);
    dot.center(0, 0);

    for (let boneCfg of this.config.bones) {
      let imgPath = boneCfg.img;
      let img = this.assets[imgPath];

      let bone = new Bone(this, boneCfg.name, img, boneCfg.x, boneCfg.y, boneCfg.a, boneCfg.pivotX, boneCfg.pivotY);
      this.bones.push(bone);
      this.boneMap[bone.name] = bone;
    }

    for (let edge of this.config.rig) {
      let parent = this.boneMap[edge.parent];
      let child = this.boneMap[edge.child];
      child.setParent(parent);
    }

    this.initManipulator();

    if (this.keyframes.length > 0) {
      this.currentFrame = 0;
      this.poseBones();

      if (this.config.rig.length == 0) {
        for (let bone of this.bones) {
          bone.repaint();
        }
      }
    }
  }

  initManipulator() {
    this.manipulator = new Manipulator(this);
    this.manipulator.select(this.bones[0]);
  }

  addKeyFrame() {
    let keyframe = {};

    for (let bone of this.bones) {
      let pose = {};
      pose.x = bone.x;
      pose.y = bone.y;
      pose.a = bone.a;

      keyframe[bone.name] = pose;
    }

    this.keyframes.push(keyframe);
    this.currentFrame++;
  }

  updateKeyFrame() {
    let keyframe = this.keyframes[this.currentFrame];

    for (let bone of this.bones) {
      let pose = {};
      pose.x = bone.x;
      pose.y = bone.y;
      pose.a = bone.a;

      keyframe[bone.name] = pose;
    }

  }

  nextFrame() {
    this.currentFrame = (this.currentFrame + 1) % this.keyframes.length;
    this.poseBones();
  }

  prevFrame() {
    this.currentFrame = (this.currentFrame - 1 + this.keyframes.length) % this.keyframes.length;
    this.poseBones();
  }

  poseBones() {
    let keyframe = this.keyframes[this.currentFrame];
    for (let bone of this.bones) {
      let pose = keyframe[bone.name];
      if (pose) {
        bone.x = pose.x;
        bone.y = pose.y;
        bone.a = pose.a;
      }
    }

    this.bones[0].repaint();
    this.manipulator.updateOverlay();
  }

  exportData() {
    for (let cbone of this.config.bones) {
      let bone = this.boneMap[cbone.name];
      cbone.pivotX = bone.pivotX;
      cbone.pivotY = bone.pivotY;
    }


    let data = {
      "assets": this.config.assets,
      "bones": this.config.bones,
      "rig": this.config.rig,
      "keyframes": this.keyframes
    }
    console.log(JSON.stringify(data));
  }

  startAnimation() {
    this.manipulator.select(null);
    this.animating = true;
    this.animationLoop();
  }

  stopAnimation() {
    this.animating = false;
  }

  animationLoop() {
    let self = this;
    let t = 0;
    let f = 0;

    function loop() {
      if (!self.animating) return;
      requestAnimationFrame(loop);
      t += self.speed;
      if (t >= 1) {
        f = (f + 1) % self.keyframes.length;
        t = 0;
      }
      let tm1 = 1 - t;

      let f2 = (f + 1) % self.keyframes.length;
      console.log(`${f} -> ${f2}`);

      let frame1 = self.keyframes[f];
      let frame2 = self.keyframes[f2];

      for (let bone of self.bones) {
        let pose1 = frame1[bone.name];
        let pose2 = frame2[bone.name];

        bone.x = (pose1.x * tm1) + (pose2.x * t);
        bone.y = (pose1.y * tm1) + (pose2.y * t);
        bone.a = (pose1.a * tm1) + (pose2.a * t);
      }

      // console.log(`frame ${f} t ${t} ${tm1} -- ${self.bones[0].x}`);

      console.log(`${self.bones[0].name}`);
      self.bones[0].repaint();
    }

    loop();
  }


}
