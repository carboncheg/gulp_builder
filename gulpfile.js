const   gulp            = require('gulp'),
        sourcemaps      = require('gulp-sourcemaps'),
        sass            = require('gulp-sass'),
        concat          = require('gulp-concat'),
        autoprefixer    = require('gulp-autoprefixer'),
        cleanCSS        = require('gulp-clean-css'),
        uglify          = require('gulp-uglify'),
        imagemin        = require('gulp-imagemin'),
        del             = require('del'),
        browserSync     = require('browser-sync').create(),
        rename          = require('gulp-rename');

// Указываем порядок в котором нужно объединить файлы
const styleFiles = [
    './src/styles/color.sass',
    './src/styles/main.scss'
];

const scriptsFiles = [
    './src/scripts/lib.js',
    './src/scripts/main.js'
];

gulp.task('styles', () => {
    // Шаблон для поиска файлов CSS
    // Все файлы по шаблону './src/styles/**/*.scss'
    return gulp.src(styleFiles)
    .pipe(sourcemaps.init())
    // Установка препроцессора sass(), less() или stylus()
    .pipe(sass())
    // Конкатенация файлов
    .pipe(concat('style.css'))
    // Автопрефиксикация
    .pipe(autoprefixer({
        browsers: ['last 15 versions'],
        cascade: true
     }))
    // Минификация CSS
    .pipe(cleanCSS({
        level: 2
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: '.min'
     }))
    // Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
    // Шаблон для поиска файлов JS
    // Все файлы по шаблону './src/scripts/**/*.js'
    return gulp.src(scriptsFiles)
    // Конкатенация файлов
    .pipe(concat('script.js'))
    // Минификация JS
    .pipe(uglify({
        toplevel: true
    }))
    .pipe(rename({
        suffix: '.min'
     }))
    // Выходная папка для скриптов
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});

// Очистка папки build
gulp.task('del', () => {
    return del(['build/*']);
});

gulp.task('img-compress', () => {
    return gulp.src('./src/img/**')
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest('./build/img/'));
});

// Отслеживание изменений в файлах
gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/img/**', gulp.series('img-compress'));
    gulp.watch('./src/styles/**/*.scss', gulp.series('styles'));
    gulp.watch('./src/scripts/**/*.js', gulp.series('scripts'));
    gulp.watch("./*.html").on('change', browserSync.reload);
});

// Таск по дефолту запускается просто через $ gulp
gulp.task('default', gulp.series('del', gulp.parallel('styles', 'scripts', 'img-compress'), 'watch'));