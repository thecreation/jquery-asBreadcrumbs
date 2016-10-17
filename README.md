# [jQuery asBreadcrumbs](https://github.com/amazingSurge/jquery-asBreadcrumbs) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that make bootstrap breadcrumbs responisve.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asBreadcrumbs.js
├── jquery-asBreadcrumbs.es.js
├── jquery-asBreadcrumbs.min.js
└── css/
    ├── asBreadcrumbs.css
    └── asBreadcrumbs.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asBreadcrumbs/master/dist/jquery-asBreadcrumbs.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asBreadcrumbs/master/dist/jquery-asBreadcrumbs.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asBreadcrumbs --save
```

#### Install From Npm
```sh
npm install jquery-asBreadcrumbs --save
```

#### Install From Yarn
```sh
yarn add jquery-asBreadcrumbs
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asBreadcrumbs.git
cd jquery-asBreadcrumbs
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asBreadcrumbs` requires the latest version of [`jQuery`](https://jquery.com/download/) and [`bootstrap`](http://getbootstrap.com).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/bootstrap.css">
<link rel="stylesheet" href="/path/to/asBreadcrumbs.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/bootstrap.js"></script>
<script src="/path/to/jquery-asBreadcrumbs.js"></script>
```

#### Required HTML structure

```html
<ol class="breadcrumb">
  <li><a href="#">Home</a></li>
  <li><a href="#">Getting Started</a></li>
  <li><a href="#">Library</a></li>
  <li><a href="#">Document</a></li>
  <li><a href="#">Components</a></li>
  <li><a href="#">JavaScript</a></li>
  <li><a href="#">Customize</a></li>
  <li class="active">Data</li>
</ol>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').asBreadcrumbs(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asBreadcrumbs/tree/master/examples).

## Options
`jquery-asBreadcrumbs` can accept an options object to alter the way it behaves. You can see the default options by call `$.asBreadcrumbs.setDefaults()`. The structure of an options object is as follows:

```
{
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
}
```

## Methods
Methods are called on asBreadcrumbs instances through the asBreadcrumbs method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asBreadcrumbs('destroy');

// or
var api = $().data('asBreadcrumbs');
api.destroy();
```

#### destroy()
Destroy the breadcrumbs instance.
```javascript
$().asBreadcrumbs('destroy');
```

## Events
`jquery-asBreadcrumbs` provides custom events for the plugin’s unique actions. 

```javascript
$('.breadcrumb').on('asBreadcrumbs::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
init    | Fires when the instance is setup for the first time.
ready   | Fires when the instance is ready for API use.
update  | Fires after the breadcrumb layouts updated.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asBreadcrumbs.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asBreadcrumbs.js"></script>
<script>
  $.asBreadcrumbs.noConflict();
  // Code that uses other plugin's "$().asBreadcrumbs" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asBreadcrumbs` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asBreadcrumbs` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asBreadcrumbs/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asBreadcrumbs.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asBreadcrumbs/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asBreadcrumbs.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asBreadcrumbs
[license]: https://img.shields.io/npm/l/jquery-asBreadcrumbs.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asBreadcrumbs.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asBreadcrumbs
