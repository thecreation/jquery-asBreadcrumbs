"use strict";

(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "jQuery"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("jQuery"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jQuery);
        global.jqueryAsBreadcrumbs = mod.exports;
    }
})(this, function (exports, _jQuery) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jQuery2 = babelHelpers.interopRequireDefault(_jQuery);

    var NAME = "asBreadcrumbs";
    var DEFAULT = {
        namespace: NAME,
        overflow: "left",
        ellipsis: "&#8230;",
        dropicon: "caret",
        responsive: true,
        dropdown: function dropdown() {
            return '<div class=\"dropdown\">' + '<a href=\"javascript:void(0);\" class=\"' + this.namespace + '-toggle\" data-toggle=\"dropdown\"><i class=\"' + this.dropicon + '\"></i></a>' + '<div class=\"' + this.namespace + '-menu dropdown-menu\"></div>' + '</div>';
        },
        dropdownContent: function dropdownContent(value) {
            return '<a class=\"dropdown-item\">' + value + '</a>';
        },
        getItem: function getItem($parent) {
            return $parent.children();
        },
        onInit: null,
        onReady: null
    };

    var asBreadcrumbs = function () {
        function asBreadcrumbs(element, options) {
            babelHelpers.classCallCheck(this, asBreadcrumbs);
            this.element = element;
            this.$element = (0, _jQuery2.default)(element);
            this.options = _jQuery2.default.extend({}, DEFAULT, options, this.$element.data());
            this.namespace = this.options.namespace;
            this.$element.addClass(this.namespace);
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

        babelHelpers.createClass(asBreadcrumbs, [{
            key: "init",
            value: function init() {
                var _this = this;

                var self = this;
                this.$element.addClass(this.namespace + '-' + this.options.overflow);
                this.generateChildrenInfo();
                this.createDropdown();
                this.render();

                if (this.options.responsive) {
                    (0, _jQuery2.default)(window).on('resize', this._throttle(function () {
                        _this.resize.call(_this);
                    }, 250));
                }

                this.initialized = true;

                this._trigger('ready');
            }
        }, {
            key: "generateChildrenInfo",
            value: function generateChildrenInfo() {
                var self = this;
                this.$children.each(function () {
                    var $this = (0, _jQuery2.default)(this);
                    self.childrenInfo.push({
                        $this: $this,
                        outerWidth: $this.outerWidth(),
                        $content: (0, _jQuery2.default)(self.options.dropdownContent($this.text())).attr("href", self.options.getItem($this).attr("href"))
                    });
                });

                if (this.options.overflow === "left") {
                    this.childrenInfo.reverse();
                }

                this.childrenLength = this.childrenInfo.length;
            }
        }, {
            key: "createDropdown",
            value: function createDropdown() {
                if (this.isCreated === true) {
                    return;
                }

                var dropdown = this.options.dropdown();
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
        }, {
            key: "render",
            value: function render() {
                var dropdownWidth = this.getDropdownWidth(),
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
        }, {
            key: "resize",
            value: function resize() {
                this._trigger('resize');

                this.render();
            }
        }, {
            key: "getDropdownWidth",
            value: function getDropdownWidth() {
                return this.$dropdownWrap.outerWidth() + (this.options.ellipsis ? this.$ellipsis.outerWidth() : 0);
            }
        }, {
            key: "getWidth",
            value: function getWidth() {
                var width = 0,
                    self = this;
                this.$element.children().each(function () {
                    if ((0, _jQuery2.default)(this).css('display') === 'inline-block' && (0, _jQuery2.default)(this).css('float') === 'none') {
                        width += self.gap;
                    }
                });
                return this.$element.width() - width;
            }
        }, {
            key: "_createEllipsis",
            value: function _createEllipsis() {
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
        }, {
            key: "_createDropdownItem",
            value: function _createDropdownItem() {
                for (var i = 0, l = this.childrenLength; i < l; i++) {
                    this.childrenInfo[i].$content.appendTo(this.$dropdownMenu).hide();
                }
            }
        }, {
            key: "_showDropdown",
            value: function _showDropdown(i) {
                this.childrenInfo[i].$content.show();
                this.childrenInfo[i].$this.hide();
                this.$dropdownWrap.show();
                this.$ellipsis.css("display", "inline-block");
            }
        }, {
            key: "_hideDropdown",
            value: function _hideDropdown(i) {
                this.childrenInfo[i].$this.css("display", "inline-block");
                this.childrenInfo[i].$content.hide();
                this.$dropdownWrap.hide();
                this.$ellipsis.hide();
            }
        }, {
            key: "_throttle",
            value: function _throttle(func, wait) {
                var _now = Date.now || function () {
                    return new Date().getTime();
                };

                var context = undefined,
                    args = undefined,
                    result = undefined;
                var timeout = null;
                var previous = 0;

                var later = function later() {
                    previous = _now();
                    timeout = null;
                    result = func.apply(context, args);
                    context = args = null;
                };

                return function () {
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
            }
        }, {
            key: "_trigger",
            value: function _trigger(eventType) {
                for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    params[_key - 1] = arguments[_key];
                }

                var data = [this].concat(params);
                this.$element.trigger(NAME + '::' + eventType, data);
                eventType = eventType.replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1);
                });
                var onFunction = 'on' + eventType;

                if (typeof this.options[onFunction] === 'function') {
                    this.options[onFunction].apply(this, params);
                }
            }
        }, {
            key: "destroy",
            value: function destroy() {
                this.$element.children().css("display", "");
                this.$dropdownWrap.remove();

                if (this.options.ellipsis) {
                    this.$ellipsis.remove();
                }

                this.isCreated = false;
                this.$element.data(NAME, null);
                (0, _jQuery2.default)(window).off("resize");
                (0, _jQuery2.default)(window).off(".asBreadcrumbs");

                this._trigger('destroy');
            }
        }], [{
            key: "_jQueryInterface",
            value: function _jQueryInterface(options) {
                "use strict";

                var _this2 = this;

                for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                    params[_key2 - 1] = arguments[_key2];
                }

                if (typeof options === 'string') {
                    var _ret = function () {
                        var method = options;

                        if (/^\_/.test(method)) {
                            return {
                                v: false
                            };
                        } else if (/^(get)/.test(method)) {
                            var api = _this2.first().data(NAME);

                            if (api && typeof api[method] === 'function') {
                                return {
                                    v: api[method].apply(api, params)
                                };
                            }
                        } else {
                            return {
                                v: _this2.each(function () {
                                    var api = _jQuery2.default.data(this, NAME);

                                    if (api && typeof api[method] === 'function') {
                                        api[method].apply(api, params);
                                    }
                                })
                            };
                        }
                    }();

                    if ((typeof _ret === "undefined" ? "undefined" : babelHelpers.typeof(_ret)) === "object") return _ret.v;
                } else {
                    return this.each(function () {
                        if (!_jQuery2.default.data(this, NAME)) {
                            _jQuery2.default.data(this, NAME, new asBreadcrumbs(this, options));
                        }
                    });
                }
            }
        }]);
        return asBreadcrumbs;
    }();

    _jQuery2.default.fn[NAME] = asBreadcrumbs._jQueryInterface;
    _jQuery2.default.fn[NAME].constructor = asBreadcrumbs;

    _jQuery2.default.fn[NAME].noConflict = function () {
        _jQuery2.default.fn[NAME] = JQUERY_NO_CONFLICT;
        return asBreadcrumbs._jQueryInterface;
    };

    exports.default = asBreadcrumbs;
});
