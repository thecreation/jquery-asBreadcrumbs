export default {
  namespace: 'breadcrumb',
  overflow: "left",

  responsive: true,

  ellipsisText: "&#8230;",
  ellipsisClass: null,

  hiddenClass: 'is-hidden',

  dropdownClass: null,
  dropdownMenuClass: null,
  dropdownItemClass: null,
  dropdownItemDisableClass: 'disabled',

  toggleClass: null,
  toggleIconClass: 'caret',

  getItems: function($parent) {
    return $parent.children();
  },

  getItemLink: function($item) {
    return $item.find('a');
  },

  // templates
  ellipsis: function(classes, label) {
    return `<li class="${classes.ellipsisClass}">${label}</li>`;
  },

  dropdown: function(classes) {
    const dropdownClass = 'dropdown';
    let dropdownMenuClass = 'dropdown-menu';

    if (this.options.overflow === 'right') {
      dropdownMenuClass += ' dropdown-menu-right';
    }

    return `<li class="${dropdownClass} ${classes.dropdownClass}">
      <a href="javascript:void(0);" class="${classes.toggleClass}" data-toggle="dropdown">
        <i class="${classes.toggleIconClass}"></i>
      </a>
      <ul class="${dropdownMenuClass} ${classes.dropdownMenuClass}"></ul>
    </li>`;
  },

  dropdownItem: function(classes, label, href) {
    if(!href) {
      return `<li class="${classes.dropdownItemClass} ${classes.dropdownItemDisableClass}"><a href="#">${label}</a></li>`;
    }
    return `<li class="${classes.dropdownItemClass}"><a href="${href}">${label}</a></li>`;
  },

  // callbacks
  onInit: null,
  onReady: null
};
