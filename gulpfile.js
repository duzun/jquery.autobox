/**
 * Gulp file for DCMS project.
 *
 * @author  Dumitru Uzun (DUzun.me)
 * @version  1.5.3
 */

/*jshint
    node: true,
    esversion: 6
*/

const fs              = require('fs');
// const path            = require('path');

// const del             = require('del');
const requireJSON     = require('require-json5');
// const streamqueue     = require('streamqueue');
// const es              = require('event-stream');
// const runSequence     = require('run-sequence');
const gulp            = require('gulp');
const $               = require('gulp-load-plugins')();
// const packo           = require("./package.json");
// const { extra } = packo;


// -----------------------------------------------------------------------------
gulp.task('default', ['js', 'js-min']);

// -----------------------------------------------------------------------------
gulp.task('js', function task_js() {
    return procES6(['src/*.js'], 'src/', 'dist/', false, false);
});

gulp.task('js-min', function task_js() {
    return procES6(['src/*.js'], 'src/', 'dist/', false, true);
});

// -----------------------------------------------------------------------------
gulp.task('qunit', function task_qunit() {
    return gulp.src('test/**/*.html')
        .pipe($.qunit())
    ;
});

gulp.task('test', ['qunit']);

// -----------------------------------------------------------------------------
/// Process JS ES6/7 with babel
function procES6(src, base, dest = '', handle_error = false, min = false) {
    const babelOptions = requireJSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
    let bo = Object.assign(babelOptions);
    let bplg = bo.plugins || (bo.plugins = []);
    bplg.push("external-helpers");
    bo.exclude = "node_modules/**";

    let plugins = [
        // require('rollup-plugin-strip')(),
        require('rollup-plugin-babel')(bo),
    ];

    if ( min ) {
        plugins.push(require('rollup-plugin-uglify')({
            output: {
                comments: function(node, comment) {
                    let { value, type } = comment;
                    // multiline comment
                    if (type === "comment2") {
                        return /@preserve|@license|@cc_on/i.test(value);
                    }
                },
            },
        }));
    }

    let s = gulp.src(src, { base })
        .pipe($.sourcemaps.init({loadMaps:true}))
        // .pipe($.babel(babelOptions))

        .pipe($.betterRollup({ plugins }, 'umd'))
        // .pipe($.rename((fn)=>{fn.basename = path.basename(fn.basename, '.es')}))
    ;
    if ( handle_error ) {
        handle_stream_error(s);
    }
    if ( min ) {
        s = s.pipe($.rename({extname: '.min.js'}));
    }
    s = s.pipe($.sourcemaps.write('.'));
    if ( dest ) {
        s = s.pipe(gulp.dest(dest));
    }
    return s;
}
// -----------------------------------------------------------------------------
function handle_stream_error(stream) {
    return stream.on('error', function (/*error*/) {
        // console.error(error);
        $.util.log.apply(this, arguments);
        stream.end();
    });
}
