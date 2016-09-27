import $ from 'jquery';
import asBreadcrumbs from './asBreadcrumbs';
import info from './info';

const NAME = 'asBreadcrumbs';
const OtherAsScrollbar = $.fn.asBreadcrumbs;

$.fn.asBreadcrumbs = function jQueryAsScrollbar(options, ...args) {
  if (typeof options === 'string') {
    let method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      let instance = this.first().data(NAME);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        let instance = $.data(this, NAME);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAME)) {
      $(this).data(NAME, new asBreadcrumbs(this, options));
    }
  });
};

$.asBreadcrumbs = $.extend({
  setDefaults: asBreadcrumbs.setDefaults,
  noConflict: function() {
    $.fn.asBreadcrumbs = OtherAsScrollbar;
    return this;
  }
}, info);
