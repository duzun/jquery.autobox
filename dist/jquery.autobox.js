/** Autogrow Textareas while typing
 *
 * https://github.com/duzun/jquery.autobox
 *
 * Copyright (c) 2015 Dumitru Uzun
 *
 * @license MIT
 * @version 2.1.1 - 2015-12-25
 * @author DUzun.Me
 */
;(function(window) {
    'use strict';

    var TEXTAREA = 'TEXTAREA'
    ,   autoboxedClass = 'autoboxed'
    ,   namespace = '.dynSiz'

    ,   _events = [
            'autobox'
          , 'keypress'
          , 'keyup'
          , 'click'
          , 'change'
          , 'focusin'
          , 'cut'
          , 'paste'
        ]
    ;

    // Constants for internal use
    var RESIZE_VERTICAL_FLAG   = 1
    ,   RESIZE_HORIZONTAL_FLAG = 2

    ,   ROWS_POS       = 0
    ,   COLS_POS       = 1
    ,   HEIGHT_POS     = 2
    ,   WIDTH_POS      = 3
    ,   OVERFLOW_Y_POS = 4
    ,   OVERFLOW_X_POS = 5
    ,   RESIZE_POS     = 6
    ;

    function taMH(h,i) {
        if ( !h || ( (i=parseInt(h, 10)) && i < 18 ) ) {
            h = '18px';
        }
        return h;
    }

    function findTEXTAREA(ctx) {
        return ctx.filter(TEXTAREA).add(ctx.find(TEXTAREA));
    }

    var cchChkElement
    ,   cchChkWidth
    ,   cchChkHeight
    ;
    function chkSize(s, save) {
        var t = $(s)
        ,   w = t.outerWidth()
        ,   h = t.outerHeight()
        ;
        s = t.get(0);
        if ( save ) {
            if ( cchChkElement && cchChkElement !== s ) {
                chkSize(cchChkElement);
            }
            cchChkWidth   = w;
            cchChkHeight  = h;
            cchChkElement = s;
        }
        else {
            if ( cchChkElement === s ) {
                if ( cchChkHeight != h || cchChkWidth != w ) {
                    t.trigger('resize');
                    cchChkWidth  = w;
                    cchChkHeight = h;
                    return true;
                }
            }
        }
    }

    function taBoxAdj() {
        var t  = this
        ,   o  = $(t)
        ,   d  = o.data()
        ,   e  = d._ab_origs
        ,   s  = t.style
        ,   ol = o.val()
        ,   v  = ol.split('\n')
        ,   ar = o.prop('rows')
        ,   ac = o.prop('cols')
        ,   c  = 0
        ,   r, i, l
        ;

        chkSize(o, true);

        for ( i=0,r=v.length; i<r; i++ ) {
            if ( (l=v[i].length) > c ) {
                c = l;
            }
        }

        // On first call, backup original metric properties
        if ( !e ) {
            // Can't init when hidden - all metrics are zero
            if ( o.is(':hidden') ) {
                return;
            }
            o.stop(true);
            e = d._ab_origs = [
                ar
              , ac
              , s.height || o.css('height')
              , s.width  || o.css('width')
              , o.css('overflow-y')
              , o.css('overflow-x')
              , o.css('resize')
            ];
            e.aw = o.attr('width');
            e.ah = o.attr('height');
            i = 0;
            if(!e.ah) { i |= RESIZE_VERTICAL_FLAG;   }
            if(!e.aw) { i |= RESIZE_HORIZONTAL_FLAG; }

            // use ar
            if( i === 0 || i === (RESIZE_VERTICAL_FLAG | RESIZE_HORIZONTAL_FLAG) ) {
                switch(o.prop('resize') || o.attr('resize') || e[RESIZE_POS]) {
                    case 'vertical':   i = RESIZE_VERTICAL_FLAG  ; break;
                    case 'horizontal': i = RESIZE_HORIZONTAL_FLAG; break;
                }
            }
            if ( e.ar = i ) {
                if(i === RESIZE_VERTICAL_FLAG  ) { o.css('overflow-y', 'hidden'); !e.aw && (e.aw = e[WIDTH_POS]);  delete e.ah; }
                if(i === RESIZE_HORIZONTAL_FLAG) { o.css('overflow-x', 'hidden'); !e.ah && (e.ah = e[HEIGHT_POS]); delete e.aw; }
                o.css('resize', 'none');
            }
            // Ensure data is saved
            o.data('_ab_origs', e);
        }

        // Not first call
        else {
            e = d._ab_origs;
            delete e.rest;
        }

        ol = ol.length;
        v = e.ah || 'auto';
        l = e.aw || 'auto';
        e.nadj = ~e.ar & RESIZE_VERTICAL_FLAG;

        if(!c) {
            if(r <= 1) {
                r = e[ROWS_POS];
                v = e[HEIGHT_POS];
                e.nadj = true;
            }
            else {
                r++;
            }
            c = e[COLS_POS];
            l = e[WIDTH_POS];
            (e.ar & RESIZE_VERTICAL_FLAG) && o.prop('rows', r);
        }
        else {
            c += 5 + (c>>4);
            r += ar > 2 || r > 1;
            (r > ar || ol < e.tl && (e.ar & RESIZE_VERTICAL_FLAG)) && o.prop('rows', r);
        }
        (e.ar & RESIZE_HORIZONTAL_FLAG) && o.prop('cols', c).prop('size', c);
        o.css({'height':taMH(v),'width':l});
        e.tl = ol;

        function adjRows() {
            if(!o.data('_ab_origs')) return;
            ar = t.rows;
            var s = t.scrollHeight
            ,   h = t.offsetHeight
            ,   d = 0
            ,   a = s - h
            ,   ih = h
            ,   ir = ar
            ;
            for(;d != a && s && h;) {
                // if(d == a || !s || !h) break;
                d = a;
                if(a > 0) {
                    o.prop('rows', Math.max(++ar, (s*ar/h>>0)-1, r));
                    s = t.scrollHeight;
                    h = t.offsetHeight;
                    a = s - h;
                    // If rows changed but height not, seems there is some limitation on height (ex max-height)
                    if(ir != t.rows && ih == h) {
                        o.prop('rows', ir);
                        break;
                    }
                }
            }
            // if need to adjust height and it changed, try to change it after a delay
            if(a > 5 && ih != h) setTimeout(adjRows, 16);

            chkSize(o);
        }

        e.nadj ? chkSize(o) : adjRows();
    };

    function taRestoreBox(e) {
        var o = $(this)
        ,   d = e.data
        ;
        if(e=o.data('_ab_origs')) {
            e.rest = true;
            setTimeout(function () {
                if(!e.rest) return;
                chkSize(o, true);
                o.removeData('_ab_origs')
                 .prop('rows', e[ROWS_POS]) // for textarea
                 .prop('cols', e[COLS_POS]) // for textarea
                 .prop('size', e[COLS_POS]) // for input
                 .css({
                    'overflow-y': e[OVERFLOW_Y_POS]
                  , 'overflow-x': e[OVERFLOW_X_POS]
                  , 'resize'    : e[RESIZE_POS]
                });
                e = {
                    'height': taMH(e[HEIGHT_POS])
                  , 'width' : e[WIDTH_POS]
                };

                if(d.speed) {
                    o.animate(e, d.speed, function () {
                        chkSize(o);
                    });
                }
                else {
                    chkSize(o.css(e));
                }
            }, d.delay||16);
        }
    };

    function autoBox() {
        var o = findTEXTAREA(this) ;
        o.each(taBoxAdj);
        return this;
    };

    function autoboxBind(s) {
        var o = findTEXTAREA(this) ;
        s || (s={});
        o
         .addClass(autoboxedClass)
         .unbind(namespace);
        $.each(_events, function (i,e) {
            o.bind(e+namespace, taBoxAdj);
        });
        if ( !s.permanent ) {
            o.bind('blur'+namespace, s, taRestoreBox) ;
        }
        return this;
    };

    function autoBoxOn(sel, s) {
        var o = this;
        s   || (s={});
        sel || (sel = TEXTAREA);
        o.off(namespace, sel)
         .addClass(autoboxedClass)
         .on(
            _events.join(namespace+' ')+namespace
            , sel
            , taBoxAdj
          );

        if ( !s.permanent ) {
            o.on('blur'+namespace+' '+'focusout'+namespace, sel, s, taRestoreBox) ;
        }
        return this;
    };

  // Export:
    // ---------------------------------------------------------------------------
    var $ = window.jQuery || window.Zepto ;
    (typeof define !== 'function' || !define.amd
        ? typeof module == 'undefined' || !module.exports
            ? function (deps, factory) { factory($); } // Browser
            : function (deps, factory) { module.exports = factory($||require('jquery')); } // CommonJs
        : define // AMD
    )
    /*define*/(/*name, */[$?null:'jquery'], function factory($) {

        // Collection methods.
        $.fn.autobox     = autoBox     ;
        $.fn.autoboxOn   = autoBoxOn   ;
        $.fn.autoboxBind = autoboxBind ;

        // Alias
        $.fn.bindAutobox = autoboxBind ;

        // Static method.
        $.autobox = function(elements, options) {
          // Override default options with passed-in options.
          options = $.extend({}, $.autobox.options, options);
          // Return something awesome.
          return $(elements).call(autoBox);
        };

        // Static method default options.
        $.autobox.options = {
          permanent: false
        };

        // Custom selector.
        $.expr[':'].autobox = function(elem) {
          // Is this element awesome?
          return $(elem).hasClass(autoboxedClass);
        };

    });
}
(this));


