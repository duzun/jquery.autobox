# Autogrow `<textarea>` while typing

Resize the `<textarea>` (vertically or horizontally) automatically to fit the contents.

[![devDependencies](https://david-dm.org/duzun/jquery.autobox/dev-status.svg)](https://david-dm.org/duzun/jquery.autobox#info=devDependencies&view=table)

## Getting Started

Download the [production version][min] or the [development version][max] 
or use [unpkg version][unpkg] directly in your HTML.

[min]: https://raw.github.com/duzun/jquery.autobox/master/dist/jquery.autobox.min.js
[max]: https://raw.github.com/duzun/jquery.autobox/master/dist/jquery.autobox.js
[unpkg]: https://unpkg.com/jquery.autobox

In your web page:

```html
<script src="jquery.js"></script>

<!-- Include local copy of the lib -->
<script src="dist/jquery.autobox.min.js"></script>

<!-- or CDN version -->
<script src="//unpkg.com/jquery.autobox"></script>

<script>
jQuery(function($) {

    // Bind autobox events to all TEXTAREAs in `.myView` and it's descendants, animation speed 200ms and delay before restoring size 400ms
    $('.myView').autoboxBind({ speed: 200, delay: 400 });

    // Bind autobox events to `document`, listening on `textarea.autobox` elements.
    $(document).autoboxOn('textarea.autobox');

    // Bind autobox events to `document`, listening on `textarea.autobox` elements, with horizontal autogrow.
    $(document).autoboxOn('textarea.autoboxh', { resize: 'horizontal' });

    // Bind autobox events to `document`, listening on `textarea.autobox` elements, don't shrink after blur.
    $(document).autoboxOn('textarea.autoboxp', { permanent: true });

    // Adjust once Height of all TEXTAREAs in `.myView` and it's descendants.
    $('.myView').autobox({ resize: 'vertical' });

    // Adjust once Height and/or Width of all TEXTAREAs in `.myView` and it's descendants.
    $('.myView').autobox();
});
</script>
```


If you are using a build system:

```js
import jQuery from 'jquery'; // we need jQuery
import autobox from 'jquery.autobox'; // import the init function of the plugin

autobox(jQuery); // init the plugin on this copy of jQuery
```


## Documentation

This plugin exports three jQuery methods:

* $(sel).autobox(options)          - Adjust Height/Width of all TEXTAREAs in `this` and it's descendants
* $(sel).autoboxOn(sel, options)   - Bind Auto Height/Width Adjustment events to matched element, listening on `sel` elements
* $(sel).autoboxBind(options)      - Bind Auto Height/Width Adjustment events to all TEXTAREAs in `this` and it's descendants
* $.autobox(elements, options)  - same as `$(elements).autobox(options)`

#### Options:
 
 *  permanent: bool - if false (default), the textarea would restore its size on blur
 *  resize: "" | "vertical" | "horizontal" - resize mode, leave empty for auto-detection
 *  speed: number - restore height animation speed (default 0 - no animation)
 *  delay: number - delay before restoring textarea height on blur (default 250 milliseconds)

## Examples


```html
<table class="autobox">
    <tr><td>Text field #1</td><td><textarea resize="vertical">Some very important contents</textarea></td></tr>
    <tr><td>Text field #2</td><td><textarea resize="horizontal">Ulgy resize, but may be useful sometimes</textarea></td></tr>
    <tr><td>Text field #3</td><td><textarea style="resize:vertical">CSS resize works too</textarea></td></tr>
</table>

<script>
$('body').autoboxOn('.autobox', { permanent: false, resize: '' }); // All textareas inside .autobox elements would be autoboxed
</script>
```

Live example on [DUzun.Me](https://duzun.me/playground/encode#base64UrlEncode=).

## Release History

#### v3.0.0

In AMD, CommonJs and ES6 modules `jquery.autobox` exports the init function only 
and doesn't initialize automatically.

See **Getting Started** above.

