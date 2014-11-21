/*
 * jquery-asBreadcrumbs
 * https://github.com/amazingSurge/jquery-asBreadcrumbs
 *
 * Copyright (c) 2015 amazingSurge
 * Licensed under the MIT license.
 */
(function($, document, window, undefined) {
    "use strict";

    var pluginName = 'asBreadcrumbs';

    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data());

        this._plugin = pluginName;
        this.namespace = this.options.namespace;

        this.classes = {
            // status
            active: this.namespace + '_active',
            disabled: this.namespace + '_disabled',

            // components -- for example
            wrapper: this.namespace + '-wrapper'
        };

        // flag
        this.disabled = false;
        this.initialized = false;

        this._trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            var self = this;
            this._createHtml();
            this._bindEvent();

            this.createDropList = false;
            this.childrenWithWidths = [];
            this.current = 0;

            this.$breadcrumb.children().each(function() {
                self.childrenWithWidths.push([$(this), $(this).outerWidth()]);
            });
            this.length = this.childrenWithWidths.length;

            this.$element.addClass(this.namespace + '-' + this.options.overflow);
            this.$breadcrumb.addClass(this.namespace);

            this.set();

            $(window).on('resize', this._throttle(function(){
                self.resize.call(self);
            }, 250));

            // set initialized value
            // ...

            this.initialized = true;
            // after init end trigger 'ready'
            this._trigger('ready');
        },
        _bindEvent: function() {
            var self = this;
            this.$breadcrumb.on('click', '.' + this.namespace + '-dropdown', function(e) {
                if ($(this).hasClass(self.classes.active)) {
                    $(this).find('.' + self.namespace + '-menu').fadeOut();
                    $(this).removeClass(self.classes.active);
                } else {
                    $(this).find('.' + self.namespace + '-menu').fadeIn();
                    $(this).addClass(self.classes.active);
                    e.stopPropagation();
                }
            });
        },
        _createHtml: function() {
            this.$breadcrumb = $(this.options.breadcrumb().replace(/\{\{namespace\}\}/g, this.namespace));
            this.$element.append(this.$breadcrumb);
        },
        _trigger: function(eventType) {
            var method_arguments = Array.prototype.slice.call(arguments, 1),
                data = [this].concat(method_arguments);

            // event
            this.$element.trigger(pluginName + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        createDrop: function() {
            if (this.createDropList === true) {
                return;
            }
            var html = [];
            var dropdown = this.options.dropdown();
            this.$dropdownWrap = this.$breadcrumb.children().eq(0).clone().removeClass().addClass(this.namespace + '-dropdown').html(dropdown);

            if (this.options.ellipsis) {
                this.$ellipsis = this.$breadcrumb.children().eq(0).clone().removeClass().addClass(this.namespace + '-ellipsis').html(this.options.ellipsis);
                
            }

            if (this.options.overflow === 'right') {
                this.$dropdownWrap.appendTo(this.$breadcrumb);

                if (this.options.ellipsis) {
                    this.$ellipsis.insertBefore(this.$dropdownWrap);
                }
            } else {
                this.$dropdownWrap.prependTo(this.$breadcrumb);

                if (this.options.ellipsis) {
                    this.$ellipsis.insertAfter(this.$dropdownWrap);
                }
            }

            this.createDropList =  true;
        },
        deleteDrop: function() {
            if (this.current > 1) {
                return;
            }

            this.$breadcrumb.find('.' + this.namespace + '-dropdown').remove();
            if (this.options.ellipsis) {
                this.$breadcrumb.find('.' + this.namespace + '-ellipsis').remove();
            }
            this.createDropList = false;
        },
        _getParameters: function() {
            var width = 0;
            this.$breadcrumb.children().each(function() {
                if ($(this).css('display') === 'inline-block' && $(this).css('float') === 'none') {
                    width += 6;
                }
            });
            this.width = this.$breadcrumb.width() - width;
            if (this.createDropList) {
                this.childrenWidthTotal = this.$dropdownWrap.outerWidth() + (this.options.ellipsis ? 0 : this.$ellipsis.outerWidth());
            } else {
                this.childrenWidthTotal = 0;
            }
        },
        set: function() {
            this._getParameters();

            var real, reverse;
            for (var i = 0; i < this.length; i++) {
                this.current = this.$breadcrumb.find('.' + this.namespace + '-menu').children().length;
                if (this.options.overflow === "left") {
                    real = this.length - i - 1;
                    reverse = this.current - 1;
                } else {
                    real = i;
                    reverse = this.length - this.current;
                }

                this.childrenWidthTotal += this.childrenWithWidths[real][1];
                if (this.childrenWidthTotal > this.width) {
                    this.createDrop();
                    $(this.childrenWithWidths[real][0]).appendTo(this.$breadcrumb.find('.' + this.namespace + '-menu'));
                } else if (real === reverse && this.childrenWidthTotal < this.width) {
                    if (this.options.overflow === "left") {
                        if (this.options.ellipsis) {
                            $(this.childrenWithWidths[reverse][0].insertAfter(this.$ellipsis));
                        } else {
                            $(this.childrenWithWidths[reverse][0].insertAfter(this.$dropdownWrap));
                        }
                    } else {
                        if (this.options.ellipsis) {
                            $(this.childrenWithWidths[reverse][0].insertBefore(this.$ellipsis));
                        } else {
                            $(this.childrenWithWidths[reverse][0].insertBefore(this.$dropdownWrap));
                        }
                    }
                    this.deleteDrop();
                }
            }
        },
        resize: function() {
            this._trigger('resize');

            this.set();
        },
        _throttle: function(func, wait) {
            var _now = Date.now || function() {
                return new Date().getTime();
            };
            var context, args, result;
            var timeout = null;
            var previous = 0;
            var later = function() {
                previous = _now();
                timeout = null;
                result = func.apply(context, args);
                context = args = null;
            };
            return function() {
                var now = _now();
                var remaining = wait - (now - previous);
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
        },
        update: function() {
            // reload comfig
            // render again
            this._trigger('update');
        },

        enable: function() {
            this.disabled = false;

            this.$element.removeClass(this.classes.disabled);

            // here maybe have some events detached
        },
        disable: function() {
            this.disabled = true;
            // which element is up to your requirement
            // .disabled { pointer-events: none; } NO SUPPORT IE11 BELOW
            this.$element.addClass(this.classes.disabled);

            // here maybe have some events attached
        },
        destory: function() {
            // detached events first
            // then remove all js generated html
            this.$element.data(pluginName, null);
            this._trigger('destory');
        }
    };

    Plugin.defaults = {
        namespace: pluginName,
        overflow: "left",
        ellipsis: "&#8230;",
        dropicon: "caret",

        dropdown: function() {
            return '<div class=\"dropdown\">' +
                   '<button class=\"btn btn-default dropdown-toggle ' + this.namespace + '-toggle\" type=\"button\" data-toggle=\"dropdown\"><span class=\"' + this.dropicon + '\"></span></button>' +
                   '<ul class=\"' + this.namespace + '-menu dropdown-menu\"></ul>' +
                   '</div>';
        },

        breadcrumb: function() {
            return '<ol class="{{namespace}}">' +
                        '<li><a href="#">Home</a></li>' +
                        '<li><a href="#">Getting Started</a></li>' +
                        '<li><a href="#">Library</a></li>' +
                        '<li><a href="#">Document</a></li>' +
                        '<li><a href="#">Components</a></li>' +
                        '<li><a href="#">JavaScript</a></li>' +
                        '<li><a href="#">Customize</a></li>' +
                        '<li class="active">Data</li>' +
                    '</ol>';
        },

        // callback
        onInit: null,
        onReady: null
    };

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)/.test(method))) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(jQuery, document, window);
