/** Autogrow Textareas while typing
 *
 * https://github.com/duzun/jquery.autobox
 *
 * Copyright (c) 2015 Dumitru Uzun
 *
 * @license MIT
 * @version 2.0.0 - 2015-04-10
 * @author DUzun.Me
 */
;(function(window) {
    'use strict';

    var TEXTAREA = 'TEXTAREA'
    ,   autoboxedClass = 'autoboxed'
    ,   namespace = '.dynSiz'

    ,   _events = [
            'keypress'
          , 'keyup'
          , 'click'
          , 'change'
          , 'focusin'
          , 'cut'
          , 'paste'
        ]
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
    function chkSize(save) {
        var t = $(this)
        ,   s = t.get(0)
        ,   w = t.outerWidth()
        ,   h = t.outerHeight()
        ;
        if ( save ) {
            if ( cchChkElement && cchChkElement !== s ) {
                chkSize.call(cchChkElement);
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

    function taBoxAdj(e) {
        var t  = this
        ,   o  = $(t)
        ,   d  = o.data()
        ,   s  = t.style
        ,   ol = o.val()
        ,   v  = ol.split('\n')
        ,   ar = o.prop('rows')
        ,   ac = o.prop('cols')
        ,   c  = 0
        ,   r, i, l
        ;

        chkSize.call(o, true);

        for ( i=0,r=v.length; i<r; i++ ) {
            if ( (l=v[i].length) > c ) {
                c = l;
            }
        }
        if ( !d._ab_origs ) {
            o.stop(true);
            d = d._ab_origs = [ar,ac,s.height||o.css('height'),s.width||o.css('width'),o.css('overflow-y'),o.css('overflow-x'),o.css('resize')];
            d.aw = o.attr('width');
            d.ah = o.attr('height');
            i = 0;
            if(!d.ah) { i |= 1; }
            if(!d.aw) { i |= 2; }
            if(i === 0 || i === 3) { // use ar
                switch(o.prop('resize') || o.attr('resize') || d[6]) {
                    case 'vertical':   i = 1; break;
                    case 'horizontal': i = 2; break;
                }
            }
            if ( d.ar = i ) {
                if(i === 1) { o.css({'overflow-y':'hidden'}); !d.aw && (d.aw = d[3]); delete d.ah; }
                if(i === 2) { o.css({'overflow-x':'hidden'}); !d.ah && (d.ah = d[2]); delete d.aw; }
                o.css({'resize':'none'});
            }
            // Ensure data is saved
            o.data('_ab_origs', d);
        }
        else {
            d = d._ab_origs;
            delete d.rest;
        }

        ol = ol.length;
        v = d.ah || 'auto';
        l = d.aw || 'auto';
        d.nadj = ~d.ar & 1;

        if(!c) {
            if(r <= 1) { r = d[0]; v = d[2]; d.nadj = true; }
            else { r++; }
            c = d[1];
            l = d[3];
            (d.ar & 1) && o.prop('rows', r);
        }
        else {
            c += 5 + (c>>4);
            r += ar > 2 || r > 1;
            (r > ar || ol < d.tl && (d.ar & 1)) && o.prop('rows', r);
        }
        (d.ar & 2) && o.prop('cols', c).prop('size', c);
        o.css({'height':taMH(v),'width':l});
        d.tl = ol;

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
            if(a > 5 && ih != h) setTimeout(adjRows, 11);

            chkSize.call(o);
        }
        d.nadj ? chkSize.call(o) : adjRows();
    };

    function taRestoreBox(e) {
        var o = $(this)
        ,   d = e.data
        ;
        if(e=o.data('_ab_origs')) {
            e.rest = true;
            setTimeout(function () {
                if(!e.rest) return;
                chkSize.call(o, true);
                o.removeData('_ab_origs')
                 .prop('rows', e[0])
                 .prop('cols', e[1])
                 .prop('size', e[1])
                 .css({'overflow-y': e[4], 'overflow-x': e[5], 'resize':e[6]}),
                e = {'height':taMH(e[2]),'width':e[3]};

                if(d.speed) {
                    o.animate(e, d.speed, function () {
                        chkSize.call(o);
                    })
                } else {
                    chkSize.call(o.css(e));
                }
            }, d.delay||10)
        }
    };

    function autoBox() {
        var o = findTEXTAREA(this) ;
        o.each(taBoxAdj);
        return this;
    };

    function bindAutoBox(s) {
        var o = findTEXTAREA(this) ;
        s || (s={});
        o
         .addClass(autoboxedClass)
         .unbind(namespace)
        $.each(_events, function (i,e) {
            o.bind(e+namespace, taBoxAdj);
        })
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
        $.fn.bindAutobox = bindAutoBox ;

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


