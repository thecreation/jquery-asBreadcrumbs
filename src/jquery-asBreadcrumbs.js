import $ from 'jQuery';

const NAME = "asBreadcrumbs";

const DEFAULT = {
    namespace: NAME,
    overflow: "left",
    ellipsis: "&#8230;",
    dropicon: "caret",
    responsive: true,

    dropdown() {
        return '<div class=\"dropdown\">' +
            '<a href=\"javascript:void(0);\" class=\"' + this.namespace + '-toggle\" data-toggle=\"dropdown\"><i class=\"' + this.dropicon + '\"></i></a>' +
            '<ul class=\"' + this.namespace + '-menu dropdown-menu\"></ul>' +
            '</div>';
    },
    dropdownContent(value) {
        return '<li class=\"dropdown-item\">' + value + '</li>';
    },
    getItem($parent) {
        return $parent.children();
    },

    // callback
    onInit: null,
    onReady: null
}

class asBreadcrumbs {
    constructor(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, DEFAULT, options, this.$element.data());

        // this._plugin = NAME;
        this.namespace = this.options.namespace;

        this.$element.addClass(this.namespace);
        // flag
        this.disabled = false;
        this.initialized = false;
        this.isCreated = false;

        this.$children = this.options.getItem(this.$element);
        this.$firstChild = this.$children.eq(0);

        this.$dropdownWrap = null;
        this.$dropdownMenu = null;

        this.gap = 6;
        this.childrenInfo = [];

        this._trigger('init');
        this.init();
    }

    init() {
        let self = this;
        
        this.$element.addClass(this.namespace + '-' + this.options.overflow);

        this.generateChildrenInfo();
        this.createDropdown();

        this.render();

        if (this.options.responsive) {
            $(window).on('resize', this._throttle(() => {
                this.resize.call(this);
            }, 250));
        }

        this.initialized = true;
        this._trigger('ready');
    }

    generateChildrenInfo(){
      let self = this;
      this.$children.each(function() {
        let $this = $(this);
        self.childrenInfo.push({
          $this: $this,
          outerWidth: $this.outerWidth(),
          $content: $(self.options.dropdownContent($this.text()))
        });
      });
      if (this.options.overflow === "left") {
        this.childrenInfo.reverse();
      }

      this.childrenLength = this.childrenInfo.length;
    }

    createDropdown() {
        if (this.isCreated === true) {
            return;
        }

        let dropdown = this.options.dropdown();
        this.$dropdownWrap = this.$firstChild.clone().removeClass().addClass(this.namespace + '-dropdown dropdown').html(dropdown).hide();
        this.$dropdownMenu = this.$dropdownWrap.find('.dropdown-menu');

        this._createDropdownItem();

        if (this.options.overflow === 'right') {
            this.$dropdownWrap.appendTo(this.$element);
        } else {
            this.$dropdownWrap.prependTo(this.$element);
        }

        this._createEllipsis();

        this.isCreated = true;
    }

    render() {
        let dropdownWidth = this.getDropdownWidth(),
            childrenWidthTotal = 0,
            childWidth = 0,
            width = 0;

        for (var i = 0, l = this.childrenLength; i < l; i++) {

            width = this.getWidth();
            childWidth = this.childrenInfo[i].outerWidth;

            childrenWidthTotal += childWidth;

            if (childrenWidthTotal + dropdownWidth > width) {
                this._showDropdown(i);
            } else {
                this._hideDropdown(i);
            }
        }
    }

    resize() {
        this._trigger('resize');
        this.render();
    }

    getDropdownWidth(){
      return this.$dropdownWrap.outerWidth() + (this.options.ellipsis ? this.$ellipsis.outerWidth() : 0);
    }

    getWidth() {
        let width = 0;
       
        this.$element.children().each(function() {
            if ($(this).css('display') === 'inline-block' && $(this).css('float') === 'none') {
                width += this.gap;
            }
        });
        return this.$element.width() - width;
    }

    _createEllipsis() {
        if (!this.options.ellipsis) {
            return;
        }

        this.$ellipsis = this.$firstChild.clone().removeClass().addClass(this.namespace + '-ellipsis').html(this.options.ellipsis);
      
        if (this.options.overflow === 'right') {
            this.$ellipsis.insertBefore(this.$dropdownWrap).hide();
        } else {
            this.$ellipsis.insertAfter(this.$dropdownWrap).hide();
        }
    }

    _createDropdownItem(){
      for (let i = 0, l = this.childrenLength; i < l; i++) {
        this.childrenInfo[i].$content.appendTo(this.$dropdownMenu).hide();
      }
    }

    _showDropdown(i) {
      this.childrenInfo[i].$content.css("display", "inline-block");
      this.childrenInfo[i].$this.hide();
      this.$dropdownWrap.css("display", "inline-block");
      this.$ellipsis.css("display", "inline-block");
    }

    _hideDropdown(i) {
        this.childrenInfo[i].$this.css("display", "inline-block");
        this.childrenInfo[i].$content.hide();
        this.$dropdownWrap.hide();
        this.$ellipsis.hide()
    }

    _throttle(func, wait) {
        let _now = Date.now || function() {
            return new Date().getTime();
        };
        let context, args, result;
        let timeout = null;
        let previous = 0;
        let later = function() {
            previous = _now();
            timeout = null;
            result = func.apply(context, args);
            context = args = null;
        };
        return function() {
            let now = _now();
            let remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                context = args = null;
            } else if (!timeout) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }

    _trigger(eventType, ...params) {
        let data = [this].concat(params);

        // event
        this.$element.trigger(NAME + '::' + eventType, data);

        // callback
        eventType = eventType.replace(/\b\w+\b/g, (word) => {
            return word.substring(0, 1).toUpperCase() + word.substring(1);
        });
        let onFunction = 'on' + eventType;
        if (typeof this.options[onFunction] === 'function') {
            this.options[onFunction].apply(this, params);
        }
    }

    destroy() {
        // detached events first
        // then remove all js generated html
        this.$element.children().css("display", "");
        this.$dropdownWrap.remove();
        if (this.options.ellipsis) {
            this.$ellipsis.remove();
        }
        this.isCreated = false;
        this.$element.data(NAME, null);
        $(window).off("resize");
        $(window).off(".asBreadcrumbs");
        this._trigger('destroy');
    }

    static _jQueryInterface(options, ...params) {
        "use strict";
        if (typeof options === 'string') {
            let method = options;

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)/.test(method))) {
                let api = this.first().data(NAME);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, params);
                }
            } else {
                return this.each(function() {
                    let api = $.data(this, NAME);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, params);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, NAME)) {
                    $.data(this, NAME, new asBreadcrumbs(this, options));
                }
            });
        }
    }
}



$.fn[NAME] = asBreadcrumbs._jQueryInterface;
$.fn[NAME].constructor = asBreadcrumbs;
$.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return asBreadcrumbs._jQueryInterface
};

export default asBreadcrumbs;
