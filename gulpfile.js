const gulp = require('gulp');
const browserSync = require('browser-sync').create();
// const { src, dest } = require('gulp'); // ??? gulp-pug
const pug = require('gulp-pug');
// const sass = require('gulp-sass')(require('sass')); // ?? orig not work
//  const sass = require('gulp-sass'); // changed sass
const sass = require('gulp-sass')(require('sass')); // compiler advaci
var spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
var rename = require("gulp-rename");

// Server
gulp.task('server', function() {
	browserSync.init({
			server: {
				port: 9000,
				baseDir: "build"
			}
	});

	gulp.watch('build/**/*').on('change', browserSync.reload);
});

// Gulp-pug
exports.views = () => {
  return src('./src/*.pug')
    .pipe(
      pug({
        // Your options in here.
      })
    )
    .pipe(dest('./dist'));
};
// Gulp-pug ???
// gulp.task('templates:compile', function(){
// 	exports.views = () => {
// 		return src('source/template/index.pug')
// 			.pipe(
// 				pug({
// 					// Your options in here.
// 					pretty: true
// 				})
// 			)
// 			.pipe(dest('build'));
// 	};
// });
// Gulp Работает
gulp.task('templates:compile', function(){
		return gulp.src('source/template/index.pug')
			.pipe(
				pug({
					// Your options in here.
					pretty: true
				})
			)
			.pipe(gulp.dest('build'))
});

// Sass orig
// function buildStyles() {
//   return gulp.src('./sass/**/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./css'));
// };
// // Sass 2
gulp.task('styles:compile', function(){
  return gulp.src('source/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});
// Sass 3
// gulp.task('styles:compile', function buildStyles(){
//   return gulp.src('source/styles/main.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('build/css'));
// });

/* --- Sprites ---*/
gulp.task('sprite', function (cb) {
  var spriteData = gulp.src('source/images/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
		imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));
	spriteData.img.pipe(gulp.dest('build/images/'));
	spriteData.css.pipe(gulp.dest('sourse/styles/global/'));
	cb();
}); // Изменена как в видосе. Что делает. Не ясно. Особенно про scss???

/* --- Copy Fonts --- */
gulp.task('copy:fonts', function() {
	return gulp.src('./sourse/fonts/**/*.*').pipe(gulp.dest('build/fonts'));
});

/* --- Copy Images --- */
gulp.task('copy:images', function() {
	return gulp.src('./sourse/images/**/*.*').pipe(gulp.dest('build/images'));
});

/* --- Delete --- */
gulp.task('clean', function del(cb) {
	return rimraf('build', cb);
});


/* --- Copy --- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));


/* --- Delete --- */
gulp.task('watch', function(){
	gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
	gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});


/* --- Default --- */
gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
	gulp.parallel('watch', 'server')
));