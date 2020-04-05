"use strict";

// EXPR

const gulp = require("gulp");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const concat = require("gulp-concat");
const del = require("del");
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const install = require("gulp-install");
const server = require('browser-sync').create();

const path = {
    build: { 
        html: 'build/',
        js: 'build/js/',
        style: 'build/styles/',
        image: 'build/images/',
        json: 'build/',
    },
    src: { 
        html: 'src/*.html', 
        js: 'src/js/*.js',
        style: 'src/styles/*.scss',
        image: 'src/images/*.{png,jpg,svg}', 
        json: 'src/*.json',
    }
};

// TASKS

gulp.task("clean", () => {
    return del(['build/', '!build/img']);
});

gulp.task("html", () => {
    return gulp.src(path.src.html, path.src.json)
        .pipe(gulp.dest(path.build.html));
});

gulp.task("images", () => {
    return gulp.src(path.src.image)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.image));
});

gulp.task("css", () => {
    return gulp.src(path.src.style)
    .pipe(sourcemaps.init())
        .pipe(sass( { outputStyle: 'compressed'} ))
        .pipe(concat(path.build.style))
        .pipe(rename("style.min.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(server.stream());
});

gulp.task("js", () => {
    return gulp.src(path.src.js)
    .pipe(sourcemaps.init())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(babel({
            "presets": ["@babel/preset-env"] 
        }))
        .pipe(uglify()) 
        .pipe(concat('bundle.js'))
        .pipe(rename("bundle.min.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(server.stream());
});

// без данного плагина brouserSync не подтягивает файлы с node_modules и открывает index.html с кучей ошибок в консоле. Но если этот же index.html запустить в папке /build через Live Server, все работает корректно и без ошибок
gulp.task("install", () => {
    return gulp.src('./package.json')
        .pipe(gulp.dest("./build"))
        .pipe(install());
});

gulp.task("json", () => {
    return gulp.src(path.src.json)
        .pipe(gulp.dest(path.build.json));
});

gulp.task("server", function () {
    server.init({
        watch: true,
        server: "./build"
    });

    gulp.watch(path.src.js, gulp.series("js"));
    gulp.watch(path.src.json, gulp.series("json"));
    gulp.watch(path.src.style, gulp.series("css"));
    gulp.watch(path.src.html, gulp.series("html", "refresh"));
});

gulp.task("refresh", (done) => {
    server.reload();
    done();
})

// ASSEMBLY

gulp.task("build", gulp.series(
    "clean",
    "images",
    "html",
    "json",
    "js",
    "css",
    "install"
));

gulp.task("default", gulp.series("build", "server"));
