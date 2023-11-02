var config = require("./gulpconfig.json");
var gulp = require('gulp')
var concat = require('gulp-concat')
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var exec = require('child_process').exec;

gulp.task("ImportJS",function(){
    gulp.src(config.jsSrc)
      .pipe(concat("bundle.js"))
      .pipe(sourcemaps.write(config.DEST))
      .pipe(gulp.dest(config.DEST))
});

gulp.task("ImportCSS",function(){
    gulp.src(config.cssSrc)
      .pipe(concat("style.css"))
      .pipe(gulp.dest(config.DEST))
});

gulp.task("ImportMEDIA",function(){
  gulp.src(config.mediaSrc)
    .pipe(gulp.dest(config.DEST+"/medias"))
});

gulp.task("ImportINDEX",function(){
    gulp.src(config.IndexSrc)
      .pipe(gulp.dest(config.DEST))
});

gulp.task("ImportHTML",function(){
    gulp.src(config.htmlSrc)
      .pipe(gulp.dest(config.DEST+"/view"))
});

gulp.task("ImportJSON",function(){
  gulp.src(config.jsonSrc)
    .pipe(gulp.dest(config.DEST+"/view"))
});

gulp.task('ImportImgDefaultProfile', function() {  
  return gulp.src(config.ImgDefaultProfileSrc)
  .pipe(gulp.dest(config.DEST+"/uploads/profile"));
});

gulp.task('MinImage', function() {  
  return gulp.src(config.imgSrc)
  .pipe(gulp.dest(config.DEST+"/medias"));
});

gulp.task("default",[
  "vendors",
  "start"
]);

gulp.task("start",[
  "build",
  "watch"
]);

gulp.task('vendors', function (cb) {
   return exec('bower install', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task("build",[
    "ImportJS",
    "ImportCSS",
    "ImportINDEX",
    "ImportHTML",
    "MinImage",
    "ImportMEDIA",
    "ImportImgDefaultProfile",
    "ImportJSON"
]);

gulp.task("watch",function(){
  gulp.watch(config.jsSrc,["ImportJS"]);
  gulp.watch(config.cssSrc,["ImportCSS"]);
  gulp.watch(config.mediaSrc,["ImportMEDIA"]);
  gulp.watch(config.ImgDefaultProfileSrc,["ImportImgDefaultProfile"]);
  gulp.watch(config.IndexSrc,["ImportINDEX"]);
  gulp.watch(config.htmlSrc,["ImportHTML"]);
  gulp.watch(config.jsonSrc,["ImportJSON"]);
});

gulp.task("clean-all",[
  "clean-lib",
  "clean-css",
  "clean-index",
  "clean-bundle",
  "clean-dep"
]);

gulp.task('clean-lib', function () {
  return gulp.src(config.buildLibs, {read: false})
      .pipe(clean());
});

gulp.task('clean-bundle', function () {
  return gulp.src(config.buildBundle, {read: false})
      .pipe(clean());
});

gulp.task('clean-css', function () {
  return gulp.src(config.buildCss, {read: false})
      .pipe(clean());
});

gulp.task('clean-index', function () {
  return gulp.src(config.buildIndex, {read: false})
      .pipe(clean());
});

gulp.task('clean-dep', function () {
  return gulp.src(config.buildDependency, {read: false})
      .pipe(clean());
});
