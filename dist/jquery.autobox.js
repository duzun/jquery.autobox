(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('jqueryAutobox', factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.jqueryAutobox = factory());
}(this, (function () { 'use strict';

    /**
     * Autogrow Textareas
     * jQuery.autobox
     *
     * https://github.com/duzun/jquery.autobox
     *
     * Copyright (c) 2021 Dumitru Uzun
     *
     *  @license The MIT license.
     *  @version 3.1.0
     *  @author DUzun.Me
     */

    /**
     *
     * Usage:
     *
     * $().
     *    autobox(options)        - Adjust Height/Width of all TEXTAREAs in this and it's descendants
     *    autoboxOn(sel, options) - Bind Auto Height/Width Adjustment events to matched element, listening on sel elements
     *    autoboxBind(options)    - Bind Auto Height/Width Adjustment events to all TEXTAREAs in this and it's descendants
     *
     * $.autobox(elements, options) - same as $(elements).autobox(options)
     *
     * Options:
     *  permanent: bool - if false, the textarea would restore its size on blur
     *  resize: "vertical" | "horizontal" | <empty> - resize mode, leave empty for autodetection
     *  speed: number - restore height animation speed (default 0 - no animation)
     *  delay: number - delay before restoring textarea height on blur (default 250 milliseconds)
     *
     */

    /*jshint
        esversion: 9,
        browser: true
    */
    var TEXTAREA = 'TEXTAREA';
    var AUTOBOXED_CLASS = 'autoboxed';
    var NAMESPACE = '.dynSiz';
    var _events = ['autobox', 'keypress', 'keyup', 'click', 'change', 'focusin', 'cut', 'paste']; // Constants for internal use

    var RESIZE_VERTICAL_FLAG = 1;
    var RESIZE_HORIZONTAL_FLAG = 2;
    var ROWS_POS = 0;
    var COLS_POS = 1;
    var HEIGHT_POS = 2;
    var WIDTH_POS = 3;
    var OVERFLOW_Y_POS = 4;
    var OVERFLOW_X_POS = 5;
    var RESIZE_POS = 6;
    function initJQAutobox($) {
      var cchChkElement;
      var cchChkWidth;
      var cchChkHeight;

      function taMH(h, i) {
        if (!h || (i = parseInt(h, 10)) && i < 18) {
          h = '18px';
        }

        return h;
      }

      function findTEXTAREA(ctx) {
        return ctx.filter(TEXTAREA).add(ctx.find(TEXTAREA));
      }

      function chkSize(s, save) {
        var t = $(s),
            w = t.outerWidth(),
            h = t.outerHeight();
        s = t.get(0);

        if (save) {
          if (cchChkElement && cchChkElement !== s) {
            chkSize(cchChkElement);
          }

          cchChkWidth = w;
          cchChkHeight = h;
          cchChkElement = s;
        } else {
          if (cchChkElement === s) {
            if (cchChkHeight != h || cchChkWidth != w) {
              t.trigger('resize');
              cchChkWidth = w;
              cchChkHeight = h;
              return true;
            }
          }
        }
      }

      function taBoxAdj(evt) {
        var that = this,
            $ta = $(that),
            data = $ta.data(),
            e = data._ab_origs,
            style = that.style,
            ol = $ta.val(),
            v = ol.split('\n'),
            ar = $ta.prop('rows'),
            ac = $ta.prop('cols'),
            c = 0,
            r,
            i,
            l,
            options = evt && evt.type && evt.data;
        chkSize($ta, true);

        for (i = 0, r = v.length; i < r; i++) {
          if ((l = v[i].length) > c) {
            c = l;
          }
        } // On first call, backup original metric properties


        if (!e) {
          // Can't init when hidden - all metrics are zero
          if ($ta.is(':hidden')) {
            return;
          }

          $ta.stop(true);
          e = data._ab_origs = [ar, ac, style.height || $ta.css('height'), style.width || $ta.css('width'), $ta.css('overflow-y'), $ta.css('overflow-x'), $ta.css('resize')];
          e.aw = $ta.attr('width');
          e.ah = $ta.attr('height');
          i = 0;

          if (!e.ah) {
            i |= RESIZE_VERTICAL_FLAG;
          }

          if (!e.aw) {
            i |= RESIZE_HORIZONTAL_FLAG;
          } // use ar


          if (i === 0 || i === (RESIZE_VERTICAL_FLAG | RESIZE_HORIZONTAL_FLAG)) {
            // resize option overrides CSS and DOM property
            switch (options && options.resize || $ta.prop('resize') || $ta.attr('resize') || e[RESIZE_POS]) {
              case 'vertical':
                i = RESIZE_VERTICAL_FLAG;
                break;

              case 'horizontal':
                i = RESIZE_HORIZONTAL_FLAG;
                break;
            }
          }

          if (e.ar = i) {
            var css = {
              resize: 'none'
            };

            if (i === RESIZE_VERTICAL_FLAG) {
              css['overflow-y'] = 'hidden';
              !e.aw && (e.aw = e[WIDTH_POS]);
              delete e.ah;
            }

            if (i === RESIZE_HORIZONTAL_FLAG) {
              css['overflow-x'] = 'hidden';
              !e.ah && (e.ah = e[HEIGHT_POS]);
              delete e.aw;
            }

            $ta.css(css);
          } // Ensure data is saved


          $ta.data('_ab_origs', e);
        } // Not first call
        else {
          e = data._ab_origs;
          delete e.rest;
        }

        ol = ol.length;
        v = e.ah || 'auto';
        l = e.aw || 'auto';
        e.nadj = ~e.ar & RESIZE_VERTICAL_FLAG;

        if (!c) {
          if (r <= 1) {
            r = e[ROWS_POS];
            v = e[HEIGHT_POS];
            e.nadj = true;
          } else {
            r++;
          }

          c = e[COLS_POS];
          l = e[WIDTH_POS];
          e.ar & RESIZE_VERTICAL_FLAG && $ta.prop('rows', r);
        } else {
          c += 5 + (c >> 4);
          r += ar > 2 || r > 1;
          (r > ar || ol < e.tl && e.ar & RESIZE_VERTICAL_FLAG) && $ta.prop('rows', r);
        }

        e.ar & RESIZE_HORIZONTAL_FLAG && $ta.prop('cols', c).prop('size', c);
        $ta.css({
          'height': taMH(v),
          'width': l
        });
        e.tl = ol;

        function adjRows() {
          if (!$ta.data('_ab_origs')) return;
          ar = that.rows;
          var s = that.scrollHeight,
              h = that.offsetHeight,
              d = 0,
              a = s - h,
              ih = h,
              ir = ar;

          for (; d != a && s && h;) {
            // if(d == a || !s || !h) break;
            d = a;

            if (a > 0) {
              $ta.prop('rows', Math.max(++ar, (s * ar / h >> 0) - 1, r));
              s = that.scrollHeight;
              h = that.offsetHeight;
              a = s - h; // If rows changed but height not, seems there is some limitation on height (ex max-height)

              if (ir != that.rows && ih == h) {
                $ta.css('overflow-y', '');
                $ta.prop('rows', ir);
                break;
              }
            }
          } // if need to adjust height and it changed, try to change it after a delay


          if (a > 5 && ih != h) setTimeout(adjRows, 16);
          chkSize($ta);
        }

        e.nadj ? chkSize($ta) : adjRows();
      }

      function taRestoreBox(e) {
        var o = $(this),
            options = e.data;

        if (e = o.data('_ab_origs')) {
          e.rest = true;
          setTimeout(function () {
            if (!e.rest) {
              return;
            }

            chkSize(o, true);
            o.removeData('_ab_origs').prop('rows', e[ROWS_POS]) // for textarea
            .prop('cols', e[COLS_POS]) // for textarea
            .prop('size', e[COLS_POS]) // for input
            .css({
              'overflow-y': e[OVERFLOW_Y_POS],
              'overflow-x': e[OVERFLOW_X_POS],
              'resize': e[RESIZE_POS]
            });
            e = {
              'height': taMH(e[HEIGHT_POS]),
              'width': e[WIDTH_POS]
            };

            if (options.speed) {
              o.animate(e, options.speed, function () {
                chkSize(o);
              });
            } else {
              chkSize(o.css(e));
            }
          }, options.delay || 250); // bigger delay to allow for clicks on element beneath textarea
        }
      }

      function autoBox(options) {
        var o = findTEXTAREA(this);

        if (options) {
          var evt = {
            type: 'autobox',
            data: options
          };
          o.each(function (i, e) {
            return taBoxAdj.call(e, evt);
          });
        } else {
          o.each(taBoxAdj);
        }

        return this;
      }

      function autoboxBind(options) {
        var o = findTEXTAREA(this);
        options = $.extend({}, $.autobox.options, options);
        o.addClass(AUTOBOXED_CLASS).off(NAMESPACE);
        $.each(_events, function (i, e) {
          o.on(e + NAMESPACE, options, taBoxAdj);
        });

        if (!options.permanent) {
          o.on('blur' + NAMESPACE, options, taRestoreBox);
        }

        return this;
      }

      function autoBoxOn(sel, options) {
        var o = this;
        options = $.extend({}, $.autobox.options, options);
        sel || (sel = TEXTAREA);
        o.off(NAMESPACE, sel).addClass(AUTOBOXED_CLASS).on(_events.join(NAMESPACE + ' ') + NAMESPACE, sel, options, taBoxAdj);

        if (!options.permanent) {
          o.on('blur' + NAMESPACE + ' ' + 'focusout' + NAMESPACE, sel, options, taRestoreBox);
        }

        return o;
      } // Export:
      // Collection methods.


      $.fn.autobox = autoBox;
      $.fn.autoboxOn = autoBoxOn;
      $.fn.autoboxBind = autoboxBind; // Alias

      $.fn.bindAutobox = autoboxBind; // Static method.

      $.autobox = function (elements, options) {
        // Override default options with passed-in options.
        options = $.extend({}, $.autobox.options, options);
        return $(elements).call(autoBox, options);
      }; // Static method default options.


      $.autobox.options = {
        resize: undefined,
        // 'vertical' | 'horizontal'
        permanent: false,
        speed: 0,
        // restore height animation speed
        delay: 250 // delay before restoring textarea height on blur

      }; // Custom selector.

      $.expr[':'].autobox = function (elem) {
        // Is this element autoboxed?
        return $(elem).hasClass(AUTOBOXED_CLASS);
      };
    }

    if (typeof window !== 'undefined') {
      var $ = window.jQuery || window.Zepto;
      if ($) initJQAutobox($);
    }

    return initJQAutobox;

})));

//# sourceMappingURL=jquery.autobox.js.map
