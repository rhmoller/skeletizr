export default class Preloader {

  constructor(paths = []) {
    this.paths = paths;
    this.assets = {};
  }

  add(path) {
    this.paths.push(path);
  }

  load(callback) {
    this.remaining = this.paths.length;
    let self = this;

    for (let path of this.paths) {
      let img = document.createElement("img");

      img.addEventListener("load", function (e) {
        self.assets[path] = img;
        self.remaining--;

        if (self.remaining == 0) {
          callback(self.assets);
        }
      });

      img.src = path;
    }
  }

}
