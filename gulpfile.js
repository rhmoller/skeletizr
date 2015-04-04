var gulp = require("gulp");
var gutil = require("gulp-util");
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var watchify = require("watchify");
var browserify = require("browserify");
var browserSync = require("browser-sync");

var bundler = watchify(browserify("./src/main.js", watchify.args));
bundler.transform(babelify);

bundler.on("update", bundle);

function bundle() {
  gutil.log("Compiling js...");
  return bundler.bundle()
    .on("error", function (e) {
      gutil.log(e.message);
      browserSync.notify("Browserify error");
      this.emit("end");
    })
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./build/js"))
    .pipe(browserSync.reload({ stream: true, once: false }));
}

gulp.task("bundle", function() {
  return bundle();
});

gulp.task("assets", function() {
  return gulp.src("./assets/**/*", { base: "./assets"})
    .pipe(gulp.dest("./build"))
    .pipe(browserSync.reload({ stream: true, once: false }));
});

gulp.task("default", ["bundle", "assets"], function () {
  browserSync({
    server: "./build",
    open: false
  });

  gulp.watch("./assets/**/*.*", ["assets"]);
});
