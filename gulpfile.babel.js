'use strict';

import gulp from 'gulp'
import sass from 'gulp-sass'
import pug from 'gulp-pug'
import concat from 'gulp-concat'
import browserSync from 'browser-sync'
import imagemin from 'gulp-imagemin'
import rename from 'gulp-rename'
import autoprefixer from 'gulp-autoprefixer'
import uglify from 'gulp-uglify'
import babel from 'gulp-babel'
import cssimport from 'gulp-cssimport'
import beautify from 'gulp-beautify'
import uncss from 'gulp-uncss'
import cssmin from 'gulp-cssnano'
import sourcemaps from 'gulp-sourcemaps'
import critical from 'critical'

/* baseDirs: baseDirs for the project */

const baseDirs = {
	dist: 'dist/',
	src: 'src/',
	assets: 'dist/assets/'
};

/* routes: object that contains the paths */

const routes = {
	styles: {
		scss: `${baseDirs.src}styles/*.scss`,
		_scss: `${baseDirs.src}styles/_includes/*.scss`,
		css: `${baseDirs.dist}assets/css/`
	},

	templates: {
		pug: `${baseDirs.src}templates/**/*.pug`,
		_pug: `${baseDirs.src}templates/_includes/*.pug`
	},

	scripts: {
		base: `${baseDirs.src}scripts/`,
		js: `${baseDirs.src}scripts/app.js`,
		jses: `${baseDirs.src}scripts/appes.js`,
		jsen: `${baseDirs.src}scripts/appen.js`,
		jsmin: `${baseDirs.dist}assets/js/`
	},

	files: {
		html: 'dist/',
		images: `${baseDirs.src}images/*`,
		imgmin: `${baseDirs.dist}assets/files/img/`,
		cssFiles: `${baseDirs.dist}assets/css/*.css`,
		htmlFiles: `${baseDirs.dist}assets/*.html`,
		styleCss: `${baseDirs.dist}css/style.css`,
		fonts: `${baseDirs.dist}assets/files/fonts`
	}
};

/* Compiling Tasks */

// pug

gulp.task('templates', () => {
	return gulp.src([routes.templates.pug, '!' + routes.templates._pug])
		.pipe(pug())
		.pipe(gulp.dest(routes.files.html))
		.pipe(browserSync.stream())
});

// SCSS

gulp.task('styles', () => {
	return gulp.src(routes.styles.scss)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer('last 3 versions'))
		.pipe(sourcemaps.write())
		.pipe(cssimport({}))
		.pipe(rename('main.css'))
		.pipe(gulp.dest(routes.styles.css))
		.pipe(browserSync.stream())
});

/* Scripts (js) ES6 => ES5, minify and concat into a single file. */

gulp.task('scripts', () => {
	return gulp.src(routes.scripts.js)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(routes.scripts.jsmin))
		.pipe(browserSync.stream())
});

gulp.task('scriptses', () => {
	return gulp.src(routes.scripts.jses)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(routes.scripts.jsmin))
		.pipe(browserSync.stream())
});

gulp.task('scriptsen', () => {
	return gulp.src(routes.scripts.jsen)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(routes.scripts.jsmin))
		.pipe(browserSync.stream())
});

/* Image compressing task */

gulp.task('images', () => {
	gulp.src(routes.files.images)
		.pipe(imagemin())
		.pipe(gulp.dest(routes.files.imgmin));
});

gulp.task('icons', () => {
	gulp.src('node_modules/font-awesome/fonts/**.*')
		.pipe(gulp.dest(routes.files.fonts));
});

/* Preproduction beautifiying task (SCSS, JS) */

gulp.task('beautify', () => {
	return gulp.src(routes.scripts.js)
		.pipe(beautify({indentSize: 4}))
		.pipe(gulp.dest(routes.scripts.base))
});

gulp.task('beautifyes', () => {
	return gulp.src(routes.scripts.jses)
		.pipe(beautify({indentSize: 4}))
		.pipe(gulp.dest(routes.scripts.base))
});

gulp.task('beautifyen', () => {
	return gulp.src(routes.scripts.jsen)
		.pipe(beautify({indentSize: 4}))
		.pipe(gulp.dest(routes.scripts.base))
});

/* Serving (browserSync) and watching for changes in files */

gulp.task('serve', () => {
	browserSync.init({
		server: './dist/',
		open: false
	});

	gulp.watch([routes.styles.scss, routes.styles._scss], ['styles']);
	gulp.watch([routes.templates.pug, routes.templates._pug], ['templates']);
	gulp.watch(routes.scripts.js, ['scripts', 'beautify', 'beautifyes', 'beautifyen']);
});

/* Remove unusued css */

gulp.task('uncss', () => {
	return gulp.src(routes.files.cssFiles)
		.pipe(uncss({
			html: [routes.files.htmlFiles],
			ignore: ['*:*']
		}))
		.pipe(cssmin())
		.pipe(gulp.dest(routes.styles.css))
});

/* Extract CSS critical-path */

gulp.task('critical', () => {
	return gulp.src(routes.files.htmlFiles)
		.pipe(critical.stream({
			base: baseDirs.dist,
			inline: true,
			minify: true,
			html: routes.files.htmlFiles,
			css: routes.files.styleCss,
			ignore: ['@font-face', /url\(/],
			width: 1300,
			height: 900
		}))
			.pipe(gulp.dest(baseDirs.dist))
});

gulp.task('dev', ['templates', 'styles', 'scripts', 'scriptses', 'scriptsen', 'images', 'icons', 'serve']);

gulp.task('build', ['templates', 'styles', 'scripts', 'scriptses', 'scriptsen', 'images', 'icons']);

gulp.task('optimize', ['uncss', 'critical', 'images']);

gulp.task('default', () => {
	gulp.start('dev');
});