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
		this.createDropList = false;

		this.$item = this.$element.children().eq(0);

		this.children = this.options.getItem(this.$element);
		this.WidthPlus = 6;
		this.childrenInfo = [];

		this._trigger('init');
		this.init();
	}

	init() {
		let self = this;

		this.children.each(function () {
			self.childrenInfo.push({
				"_this": $(this),
				"thisOuterWidth": $(this).outerWidth(),
				"text": $(self.options.dropdownContent($(this).text()))
			});
		});

		this.length = this.childrenInfo.length;

		if (this.options.overflow === "left") {
			this.childrenInfo.reverse();
		}

		this.$element.addClass(this.namespace + '-' + this.options.overflow);

		this.createDropdown();

		this.dropdownWidth = this.$dropdownWrap.outerWidth() + (this.options.ellipsis ? this.$ellipsis.outerWidth() : 0);

		this.build();

		if (this.options.responsive) {
			$(window).on('resize', this._throttle(() => {
				this.resize.call(this);
			}, 250));
		}

		this.initialized = true;
		this._trigger('ready');
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

	createDropdown() {
		if (this.createDropList === true) {
			return;
		}

		let dropdown = this.options.dropdown();
		this.$dropdownWrap = this.$item.clone().removeClass().addClass(this.namespace + '-dropdown').addClass('dropdown').html(dropdown).hide();

		if (this.options.overflow === 'right') {
			this.$dropdownWrap.appendTo(this.$element);
		} else {
			this.$dropdownWrap.prependTo(this.$element);
		}

		this._createEllipsis();

		for (let i = 0, l = this.length; i < l; i++) {
			this.childrenInfo[i].text.appendTo(this.$element.find('.' + this.namespace + '-menu')).hide();
		}

		this.createDropList = true;
	}

	_createEllipsis() {
		if (!this.options.ellipsis) {
			return;
		}

		this.$ellipsis = this.$item.clone().removeClass().addClass(this.namespace + '-ellipsis').html(this.options.ellipsis);

		if (this.options.overflow === 'right') {
			this.$ellipsis.insertBefore(this.$dropdownWrap).hide();
		} else {
			this.$ellipsis.insertAfter(this.$dropdownWrap).hide();
		}
	}

	_showDropdown(i) {
		$(this.childrenInfo[i]._this).hide();
		this.$dropdownWrap.css("display", "inline-block");
		this.$ellipsis.css("display", "inline-block");
		this.childrenInfo[i].text.css("display", "inline-block");
	}

	_hideDropdown(i) {
		$(this.childrenInfo[i]._this).css("display", "inline-block");
		this.childrenInfo[i].text.hide();
		this.$dropdownWrap.hide();
		this.$ellipsis.hide()
	}

	_getWidth() {
		let width = 0;
		this.$element.children().each(function () {
			if ($(this).css('display') === 'inline-block' && $(this).css('float') === 'none') {
				width += this.WidthPlus;
			}
		});
		return this.$element.width() - width;
	}

	build() {

		let childrenWidthTotal = 0,
			thisChildrenWidth = 0,
			thisWidth = 0;

		for (var i = 0; i < this.length; i++) {

			thisWidth = this._getWidth();
			thisChildrenWidth = this.childrenInfo[i].thisOuterWidth;

			childrenWidthTotal += thisChildrenWidth;

			if (childrenWidthTotal + this.dropdownWidth > thisWidth) {
				this._showDropdown(i);
			} else {
				this._hideDropdown(i);
			}

		}

	}

	resize() {
		this._trigger('resize');

		this.build();
	}

	_throttle(func, wait) {
		let _now = Date.now || function () {
			return new Date().getTime();
		};
		let context, args, result;
		let timeout = null;
		let previous = 0;
		let later = function () {
			previous = _now();
			timeout = null;
			result = func.apply(context, args);
			context = args = null;
		};
		return function () {
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

	destroy() {
		// detached events first
		// then remove all js generated html
		this.$element.children().css("display", "");
		this.$dropdownWrap.remove();
		if (this.options.ellipsis) {
			this.$ellipsis.remove();
		}
		this.createDropList = false;
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
				return this.each(function () {
					let api = $.data(this, NAME);
					if (api && typeof api[method] === 'function') {
						api[method].apply(api, params);
					}
				});
			}
		} else {
			return this.each(function () {
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
