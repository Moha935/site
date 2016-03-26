// Gulp
var gulp = require('gulp');

// Debug plugins
var plumber      = require("gulp-plumber");

// Other plugins
var concat       = require('gulp-concat');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano      = require('gulp-cssnano');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var iconfont	 = require('gulp-iconfont');
var consolidate	 = require('gulp-consolidate');

// Paths
var source = './assets/';
var dest   = source;

// Prod
gulp.task('default', ['icons', 'css', 'js']);

// Watch (dev)
gulp.task('watch', function () {
	gulp.watch(source + 'css/scss/**/*.scss', ['css']);
	gulp.watch(source + 'js/app.js', ['js']);
	gulp.watch(source + 'icons/!*', ['icons']);
});

// CSS
gulp.task('css', function() {
	return gulp.src(source + 'css/scss/**/[^_]*.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions', '> 1%', 'Explorer 7', 'Android >= 2', 'Safari > 3'],
		}))
		.pipe(cssnano())
		.pipe(rename({
			extname: '.css'
		}))
		.pipe(gulp.dest(dest + '/css/'));
});

// JS
gulp.task('js', function() {
	return gulp.src([
			'bower_components/Snap.svg/dist/snap.svg.js',
			source + 'js/app.js'
		])
		.pipe(plumber())
		.pipe(concat('dist.js'))
		/*.pipe(uglify({
			mangle: false
		}))*/
		.pipe(gulp.dest(dest + '/js/'));
});

// Icons
var runTimestamp = Math.round(Date.now()/1000);
gulp.task('icons', function(){
	return gulp.src(source +'/icons/*.svg')
		.pipe(iconfont({
			fontName: 'icons',
			appendUnicode: true,
			formats: ['ttf', 'eot', 'woff', 'svg', 'woff2'],
			timestamp: runTimestamp,
			normalize: true
		}))
		.on('glyphs', function(glyphs, options) {
			gulp.src(source +'/icons/icons.template')
				.pipe(consolidate('lodash', {
					glyphs:    glyphs,
					fontName:  'icons',
					fontPath:  source + 'fonts/',
					className: 'icon'
				}))
				.pipe(rename({
					prefix:    '_',
					extname: '.scss'
				}))
				.pipe(gulp.dest(source + 'css/scss/base/'));
		})
		.pipe(chmod(755))
		.pipe(gulp.dest(dest +'/fonts/'));
});
