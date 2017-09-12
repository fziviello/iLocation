var config = require("./gulpconfig.json");
var gulp = require('gulp')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var util = require('gulp-util');
var ngConfig = require('gulp-ng-config');
var watch = require('gulp-watch');
var eslint = require('gulp-eslint');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var surge = require('gulp-surge');
var deletefile = require('gulp-delete-file');

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

gulp.task("ImportHTML",function(){
    gulp.src(config.htmlSrc)
      .pipe(gulp.dest(config.DEST+"/view"))
});

gulp.task("ImportJSON",function(){
  gulp.src(config.jsonSrc)
    .pipe(gulp.dest(config.DEST+"/view"))
});

gulp.task("start",[
  "build",
  "watch"
]);

gulp.task("build",[
    "ImportJS",
    "ImportCSS",
    "ImportHTML",
    "ImportMEDIA",
    "ImportJSON"
]);

gulp.task("watch",function(){
  gulp.watch(config.jsSrc,["ImportJS"]);
  gulp.watch(config.csSrc,["ImportCSS"]);
  gulp.watch(config.mediaSrc,["ImportMEDIA"]);
  gulp.watch(config.htmlSrc,["ImportHTML"]);
  gulp.watch(config.jsonSrc,["ImportJSON"]);
});

gulp.task("clean-all",[
  "clean",
  "clean-bundle",
  "clean-dep"
]);

gulp.task('clean', function () {
  return gulp.src(config.buildLibs, {read: false})
      .pipe(clean());
});

gulp.task('clean-bundle', function () {
  return gulp.src(config.buildBundle, {read: false})
      .pipe(clean());
});

gulp.task('clean-dep', function () {
  return gulp.src(config.buildDependency, {read: false})
      .pipe(clean());
});