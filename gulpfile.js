"use strict";

let gulp = require("gulp");
let sass = require("gulp-sass");
let babel = require("gulp-babel");
let rename = require("gulp-rename");
let postcss = require("gulp-postcss");
let autoprefixer = require("autoprefixer");
let uglify = require('gulp-uglify');
let concat = require("gulp-concat");
let del = require("del");
let eslint = require('gulp-eslint');
let sourcemaps = require('gulp-sourcemaps');
let imagemin = require('gulp-imagemin');
let server = require("browser-sync").create();

gulp.task("css", () => {
    return gulp.src("src/styles/style.scss")
    .pipe(sourcemaps.init())
        .pipe(sass( { outputStyle: 'compressed'} ))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(concat('style.css'))
        .pipe(rename("style.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/styles"))
        .pipe(server.stream());
});

gulp.task("clean", () => {
    return del(['build/', '!build/img']);
});

gulp.task("images", () => {
    return gulp.src("src/images/*.{png,jpg,svg}")
        .pipe(imagemin())
        .pipe(gulp.dest("build/images"));
});

gulp.task("html", () => {
    return gulp.src([
        "src/*.html"
    ], {
        base: "src"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("js", () => {
    return gulp.src([
        "src/js/**/*.js"
    ], {
        base: "src"
    })
    .pipe(sourcemaps.init())
        .pipe(eslint( {
            "rules": {
                "semi": 2
            },
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(babel({
            "presets": ["@babel/preset-env"] 
        }))
        .pipe(uglify()) 
        .pipe(concat('bundle.js'))
        .pipe(rename("bundle.min.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("build/js"))
});

gulp.task("json", () => {
    return gulp.src([
        "src/*.json"
    ], {
        base: "src"
    })
        .pipe(gulp.dest("build"));
});

gulp.task("server", function () {
    // server.init({
    //     server: "build/",
    //     open: true,
    // 

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

gulp.task("start", gulp.series("build", "server"));

