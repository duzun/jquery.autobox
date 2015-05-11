# Autogrow `<textarea>` while typing

Resize the `<textarea>` (vertically or horizontally) automatically to fit the contents.

Note: This plugin is **under development**.
      It is fully operational, but might have some unexpected behaviour.

[![devDependencies](https://david-dm.org/duzun/jquery.autobox/dev-status.svg)](https://david-dm.org/duzun/jquery.autobox#info=devDependencies&view=table)

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/duzun/jquery.autobox/master/dist/jquery.autobox.min.js
[max]: https://raw.github.com/duzun/jquery.autobox/master/dist/jquery.autobox.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.autobox.min.js"></script>
<script>
jQuery(function($) {

    // Bind autobox events to all TEXTAREAs in `.myView` and it's descendants.
    $('.myView').autoboxBind();

    // Bind autobox events to `document`, listening on `textarea.autobox` events.
    $(document).autoboxOn('textarea.autobox');

    // Adjust once Height/Width of all TEXTAREAs in `.myView` and it's descendants.
    $('.myView').autobox();

});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

Live example on [DUzun.Me](https://duzun.me/playground/encode#base64UrlEncode=).

## Release History
_(Nothing yet)_
