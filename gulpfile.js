/* eslint-disable no-undef */

import gulp from "gulp";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import del from "del";
import terser from "gulp-terser";
import posthtml from "gulp-posthtml";
import include from "posthtml-include";
import htmlmin from "gulp-htmlmin";
import csso from "gulp-csso";
import sourcemap from "gulp-sourcemaps";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import gulpImagemin from "gulp-imagemin";
import imageminPngquant from "imagemin-pngquant";
import svgstore from "gulp-svgstore";
import webp from "gulp-webp";

import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);

import server from "browser-sync";
server.create;

gulp.task("images", function() {
	return gulp
		.src("source/img/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,svg,SVG}")
		.pipe(
			gulpImagemin([
				imageminPngquant({ quality: [0.65, 0.8] }),
				gulpImagemin.optipng({ optimizationLevel: 3 }),
				gulpImagemin.mozjpeg({ progressive: true }),
				gulpImagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
				})
			])
		)
		.pipe(gulp.dest("build/img"));
});

gulp.task("css", function() {
	return gulp
		.src("source/sass/style.scss")
		.pipe(plumber())
		.pipe(sourcemap.init())
		.pipe(sass())
		.pipe(postcss([autoprefixer()]))
		.pipe(csso())
		.pipe(rename("style.min.css"))
		.pipe(sourcemap.write("."))
		.pipe(gulp.dest("build/css"))
		.pipe(server.stream());
});

gulp.task("css_dev", function() {
	return gulp
		.src("source/sass/style.scss")
		.pipe(plumber())
		.pipe(sourcemap.init())
		.pipe(sass())
		.pipe(postcss([autoprefixer()]))
		.pipe(csso())
		.pipe(rename("style.min.css"))
		.pipe(sourcemap.write("."))
		.pipe(gulp.dest("source/css"))
		.pipe(server.stream());
});

gulp.task("server", function() {
	server.init({
		server: "source/",
		notify: false,
		open: true,
		cors: true,
		ui: false,
		browser: ["chrome"]
	});

	gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css_dev", "refresh"));
	gulp.watch("source/*.html", gulp.series("refresh"));
	gulp.watch("source/img/**/*.{png,jpg,svg}", gulp.series("refresh"));
	gulp.watch("source/js/**/*.js", gulp.series("refresh"));
});

gulp.task("refresh", function(done) {
	server.reload();
	done();
});

gulp.task("sprite", function() {
	return gulp
		.src(
			"build/img/{icon-fb.svg,icon-vk.svg,icon-insta.svg,icon-mail.svg,icon-phone.svg}"
		)
		.pipe(
			svgstore({
				inlineSvg: true
			})
		)
		.pipe(rename("sprite.svg"))
		.pipe(gulp.dest("build/img"));
});

gulp.task("webp", function() {
	return gulp
		.src("source/img/**/*.{png,jpg}")
		.pipe(webp({ quality: 90 }))
		.pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
	return gulp
		.src("source/*.html")
		.pipe(posthtml([include()]))
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest("build"));
});

gulp.task("jsmin", function() {
	return gulp
		.src("build/js/*.js")
		.pipe(terser())
		.pipe(gulp.dest("build/js"));
});

gulp.task("clean", function() {
	return del("build");
});

gulp.task("copy", function() {
	return gulp
		.src(["source/fonts/**/*.{woff,woff2}", "source/js/**"], {
			base: "source"
		})
		.pipe(gulp.dest("build"));
});

gulp.task(
	"build_project",
	gulp.series(
		"clean",
		"images",
		"webp",
		"sprite",
		"copy",
		"jsmin",
		"css",
		"html"
	)
);

gulp.task("build", gulp.series("build_project"));
gulp.task("start", gulp.series("css_dev", "server"));
