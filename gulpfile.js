"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var del = require("del");
var imagemin = require('gulp-imagemin');
var server = require("browser-sync").create();

gulp.task("css", function () {
    return gulp.src("src/styles/style.scss")
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest("build/styles"))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/styles"))
        .pipe(server.stream());
});

gulp.task("clean", function () {
    return del(['build/', '!build/img']);
});

gulp.task("images", function() {
    return gulp.src("src/images/*.{png,jpg,svg}")
        .pipe(imagemin())
        .pipe(gulp.dest("build/images"));
});

gulp.task("html", function() {
    return gulp.src([
        "src/*.html"
    ], {
        base: "src"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("js", function() {
    return gulp.src([
        "src/js/**/*.js"
    ], {
        base: "src"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("json", function() {
    return gulp.src([
        "src/*.json"
    ], {
        base: "src"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("server", function () {
    server.init({
        server: "build/",
        open: true,
    });

    gulp.watch("src/js/**/*.js", gulp.series("js"));
    gulp.watch("src/styles/**/*.scss", gulp.series("css"));
    gulp.watch("src/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function(done) {
    server.reload();
    done();
})

gulp.task("build", gulp.series(
    "clean",
    "images",
    "html",
    "json",
    "js",
    "css"
));

gulp.task("start", gulp.series("build"));

