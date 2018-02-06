(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var template = '\n  <div class="alert gmd gmd-alert-popup alert-ALERT_TYPE alert-dismissible" role="alert">\n    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">\xD7</span></button>\n    <strong>ALERT_TITLE</strong> ALERT_MESSAGE\n    <a class="action" style="display: none;">Desfazer</a>\n  </div>\n';

var Provider = function Provider() {

  var alerts = [];

  String.prototype.toDOM = String.prototype.toDOM || function () {
    var el = document.createElement('div');
    el.innerHTML = this;
    var frag = document.createDocumentFragment();
    return frag.appendChild(el.removeChild(el.firstChild));
  };

  String.prototype.hashCode = function () {
    var hash = 0,
        i,
        chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  var getTemplate = function getTemplate(type, title, message) {
    var toReturn = template.trim().replace('ALERT_TYPE', type);
    toReturn = toReturn.trim().replace('ALERT_TITLE', title);
    toReturn = toReturn.trim().replace('ALERT_MESSAGE', message);
    return toReturn;
  };

  var getElementBody = function getElementBody() {
    return angular.element('body')[0];
  };

  var success = function success(title, message, time) {
    return createAlert(getTemplate('success', title || '', message || ''), time, { title: title, message: message });
  };

  var error = function error(title, message, time) {
    return createAlert(getTemplate('danger', title || '', message || ''), time, { title: title, message: message });
  };

  var warning = function warning(title, message, time) {
    return createAlert(getTemplate('warning', title, message), time, { title: title, message: message });
  };

  var info = function info(title, message, time) {
    return createAlert(getTemplate('info', title, message), time, { title: title, message: message });
  };

  var closeAlert = function closeAlert(elm, config) {
    alerts = alerts.filter(function (alert) {
      return !angular.equals(config, alert);
    });
    angular.element(elm).css({
      transform: 'scale(0.3)'
    });
    setTimeout(function () {
      var body = getElementBody();
      if (body.contains(elm)) {
        body.removeChild(elm);
      }
    }, 100);
  };

  var bottomLeft = function bottomLeft(elm) {
    var bottom = 15;
    angular.forEach(angular.element(getElementBody()).find('div.gmd-alert-popup'), function (popup) {
      angular.equals(elm[0], popup) ? angular.noop() : bottom += angular.element(popup).height() * 3;
    });
    elm.css({
      bottom: bottom + 'px',
      left: '15px',
      top: null,
      right: null
    });
  };

  var createAlert = function createAlert(template, time, config) {
    if (alerts.filter(function (alert) {
      return angular.equals(alert, config);
    }).length > 0) {
      return;
    }
    alerts.push(config);
    var _onDismiss = void 0,
        _onRollback = void 0,
        elm = angular.element(template.toDOM());
    getElementBody().appendChild(elm[0]);

    bottomLeft(elm);

    elm.find('button[class="close"]').click(function (evt) {
      closeAlert(elm[0]);
      _onDismiss ? _onDismiss(evt) : angular.noop();
    });

    elm.find('a[class="action"]').click(function (evt) {
      return _onRollback ? _onRollback(evt) : angular.noop();
    });

    time ? setTimeout(function () {
      closeAlert(elm[0], config);
      _onDismiss ? _onDismiss() : angular.noop();
    }, time) : angular.noop();

    return {
      position: function position(_position) {},
      onDismiss: function onDismiss(callback) {
        _onDismiss = callback;
        return this;
      },
      onRollback: function onRollback(callback) {
        elm.find('a[class="action"]').css({ display: 'block' });
        _onRollback = callback;
        return this;
      },
      close: function close() {
        closeAlert(elm[0]);
      }
    };
  };

  return {
    $get: function $get() {
      return {
        success: success,
        error: error,
        warning: warning,
        info: info
      };
    }
  };
};

Provider.$inject = [];

exports.default = Provider;

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isDOMAttrModifiedSupported() {
	var p = document.createElement('p');
	var flag = false;

	if (p.addEventListener) {
		p.addEventListener('DOMAttrModified', function () {
			flag = true;
		}, false);
	} else if (p.attachEvent) {
		p.attachEvent('onDOMAttrModified', function () {
			flag = true;
		});
	} else {
		return false;
	}
	p.setAttribute('id', 'target');
	return flag;
}

function checkAttributes(chkAttr, e) {
	if (chkAttr) {
		var attributes = this.data('attr-old-value');

		if (e.attributeName.indexOf('style') >= 0) {
			if (!attributes['style']) attributes['style'] = {}; //initialize
			var keys = e.attributeName.split('.');
			e.attributeName = keys[0];
			e.oldValue = attributes['style'][keys[1]]; //old value
			e.newValue = keys[1] + ':' + this.prop("style")[$.camelCase(keys[1])]; //new value
			attributes['style'][keys[1]] = e.newValue;
		} else {
			e.oldValue = attributes[e.attributeName];
			e.newValue = this.attr(e.attributeName);
			attributes[e.attributeName] = e.newValue;
		}

		this.data('attr-old-value', attributes); //update the old value object
	}
}

//initialize Mutation Observer
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

angular.element.fn.attrchange = function (a, b) {
	if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object') {
		//core
		var cfg = {
			trackValues: false,
			callback: $.noop
		};
		//backward compatibility
		if (typeof a === "function") {
			cfg.callback = a;
		} else {
			$.extend(cfg, a);
		}

		if (cfg.trackValues) {
			//get attributes old value
			this.each(function (i, el) {
				var attributes = {};
				for (var attr, i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
					attr = attrs.item(i);
					attributes[attr.nodeName] = attr.value;
				}
				$(this).data('attr-old-value', attributes);
			});
		}

		if (MutationObserver) {
			//Modern Browsers supporting MutationObserver
			var mOptions = {
				subtree: false,
				attributes: true,
				attributeOldValue: cfg.trackValues
			};
			var observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (e) {
					var _this = e.target;
					//get new value if trackValues is true
					if (cfg.trackValues) {
						e.newValue = $(_this).attr(e.attributeName);
					}
					if ($(_this).data('attrchange-status') === 'connected') {
						//execute if connected
						cfg.callback.call(_this, e);
					}
				});
			});

			return this.data('attrchange-method', 'Mutation Observer').data('attrchange-status', 'connected').data('attrchange-obs', observer).each(function () {
				observer.observe(this, mOptions);
			});
		} else if (isDOMAttrModifiedSupported()) {
			//Opera
			//Good old Mutation Events
			return this.data('attrchange-method', 'DOMAttrModified').data('attrchange-status', 'connected').on('DOMAttrModified', function (event) {
				if (event.originalEvent) {
					event = event.originalEvent;
				} //jQuery normalization is not required
				event.attributeName = event.attrName; //property names to be consistent with MutationObserver
				event.oldValue = event.prevValue; //property names to be consistent with MutationObserver
				if ($(this).data('attrchange-status') === 'connected') {
					//disconnected logically
					cfg.callback.call(this, event);
				}
			});
		} else if ('onpropertychange' in document.body) {
			//works only in IE
			return this.data('attrchange-method', 'propertychange').data('attrchange-status', 'connected').on('propertychange', function (e) {
				e.attributeName = window.event.propertyName;
				//to set the attr old value
				checkAttributes.call($(this), cfg.trackValues, e);
				if ($(this).data('attrchange-status') === 'connected') {
					//disconnected logically
					cfg.callback.call(this, e);
				}
			});
		}
		return this;
	} else if (typeof a == 'string' && $.fn.attrchange.hasOwnProperty('extensions') && angular.element.fn.attrchange['extensions'].hasOwnProperty(a)) {
		//extensions/options
		return $.fn.attrchange['extensions'][a].call(this, b);
	}
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {
    forceClick: '=?',
    opened: '=?'
  },
  template: '<ng-transclude></ng-transclude>',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    var handlingOptions = function handlingOptions(elements) {
      $timeout(function () {
        angular.forEach(elements, function (option) {
          angular.element(option).css({ left: (measureText(angular.element(option).text(), '14', option.style).width + 30) * -1 });
        });
      });
    };

    function measureText(pText, pFontSize, pStyle) {
      var lDiv = document.createElement('div');
      document.body.appendChild(lDiv);

      if (pStyle != null) {
        lDiv.style = pStyle;
      }

      lDiv.style.fontSize = "" + pFontSize + "px";
      lDiv.style.position = "absolute";
      lDiv.style.left = -1000;
      lDiv.style.top = -1000;

      lDiv.innerHTML = pText;

      var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
      };

      document.body.removeChild(lDiv);

      lDiv = null;

      return lResult;
    }

    var withFocus = function withFocus(ul) {
      $element.on('mouseenter', function () {
        if (ctrl.opened) {
          return;
        }
        angular.forEach($element.find('ul'), function (ul) {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
        });
        open(ul);
      });
      $element.on('mouseleave', function () {
        if (ctrl.opened) {
          return;
        }
        verifyPosition(angular.element(ul));
        close(ul);
      });
    };

    var close = function close(ul) {
      if (ul[0].hasAttribute('left')) {
        ul.find('li').css({ transform: 'rotate(90deg) scale(0.3)' });
      } else {
        ul.find('li').css({ transform: 'scale(0.3)' });
      }
      ul.find('li > span').css({ opacity: '0', position: 'absolute' });
      ul.css({ visibility: "hidden", opacity: '0' });
      ul.removeClass('open');
      // if(ctrl.opened){
      //   ctrl.opened = false;
      //   $scope.$digest();
      // }
    };

    var open = function open(ul) {
      if (ul[0].hasAttribute('left')) {
        ul.find('li').css({ transform: 'rotate(90deg) scale(1)' });
      } else {
        ul.find('li').css({ transform: 'rotate(0deg) scale(1)' });
      }
      ul.find('li > span').hover(function () {
        angular.element(this).css({ opacity: '1', position: 'absolute' });
      });
      ul.css({ visibility: "visible", opacity: '1' });
      ul.addClass('open');
      // if(!ctrl.opened){
      //   ctrl.opened = true;
      //   $scope.$digest();
      // }
    };

    var withClick = function withClick(ul) {
      $element.find('button').first().on('click', function () {
        if (ul.hasClass('open')) {
          close(ul);
        } else {
          open(ul);
        }
      });
    };

    var verifyPosition = function verifyPosition(ul) {
      $element.css({ display: "inline-block" });
      if (ul[0].hasAttribute('left')) {
        var width = 0,
            lis = ul.find('li');
        angular.forEach(lis, function (li) {
          return width += angular.element(li)[0].offsetWidth;
        });
        var size = (width + 10 * lis.length) * -1;
        ul.css({ left: size });
      } else {
        var _size = ul.height();
        ul.css({ top: _size * -1 });
      }
    };

    $scope.$watch('$ctrl.opened', function (value) {
      angular.forEach($element.find('ul'), function (ul) {
        verifyPosition(angular.element(ul));
        handlingOptions(angular.element(ul).find('li > span'));
        if (value) {
          open(angular.element(ul));
        } else {
          close(angular.element(ul));
        }
      });
    }, true);

    $element.ready(function () {
      $timeout(function () {
        angular.forEach($element.find('ul'), function (ul) {
          verifyPosition(angular.element(ul));
          handlingOptions(angular.element(ul).find('li > span'));
          if (!ctrl.forceClick) {
            withFocus(angular.element(ul));
          } else {
            withClick(angular.element(ul));
          }
        });
      });
    });
  }]
};

exports.default = Component;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {},
  template: '\n    <a class="navbar-brand" data-ng-click="$ctrl.navCollapse()" style="position: relative;cursor: pointer;">\n      <div class="navTrigger">\n        <i></i><i></i><i></i>\n      </div>\n    </a>\n  ',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      angular.element("nav.gl-nav").attrchange({
        trackValues: true,
        callback: function callback(evnt) {
          if (evnt.attributeName == 'class') {
            ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
          }
        }
      });

      ctrl.toggleHamburger = function (isCollapsed) {
        isCollapsed ? $element.find('div.navTrigger').addClass('active') : $element.find('div.navTrigger').removeClass('active');
      };

      ctrl.navCollapse = function () {
        document.querySelector('.gumga-layout nav.gl-nav').classList.toggle('collapsed');
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function callback(evnt) {
            if (evnt.attributeName == 'class') {
              ctrl.toggleHamburger(evnt.newValue.indexOf('collapsed') != -1);
            }
          }
        });
      };

      ctrl.toggleHamburger(angular.element('nav.gl-nav').hasClass('collapsed'));
    };
  }]
};

exports.default = Component;

},{}],5:[function(require,module,exports){
'use strict';

var _component = require('./menu/component.js');

var _component2 = _interopRequireDefault(_component);

var _component3 = require('./menu-shrink/component.js');

var _component4 = _interopRequireDefault(_component3);

var _component5 = require('./notification/component.js');

var _component6 = _interopRequireDefault(_component5);

var _component7 = require('./select/component.js');

var _component8 = _interopRequireDefault(_component7);

var _component9 = require('./select/search/component.js');

var _component10 = _interopRequireDefault(_component9);

var _component11 = require('./select/option/component.js');

var _component12 = _interopRequireDefault(_component11);

var _component13 = require('./select/empty/component.js');

var _component14 = _interopRequireDefault(_component13);

var _component15 = require('./input/component.js');

var _component16 = _interopRequireDefault(_component15);

var _component17 = require('./ripple/component.js');

var _component18 = _interopRequireDefault(_component17);

var _component19 = require('./fab/component.js');

var _component20 = _interopRequireDefault(_component19);

var _component21 = require('./spinner/component.js');

var _component22 = _interopRequireDefault(_component21);

var _component23 = require('./hamburger/component.js');

var _component24 = _interopRequireDefault(_component23);

var _provider = require('./alert/provider.js');

var _provider2 = _interopRequireDefault(_provider);

var _provider3 = require('./theme/provider.js');

var _provider4 = _interopRequireDefault(_provider3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

angular.module('gumga.layout', []).provider('$gmdAlert', _provider2.default).provider('$gmdTheme', _provider4.default).directive('gmdRipple', _component18.default).component('glMenu', _component2.default).component('menuShrink', _component4.default).component('glNotification', _component6.default).component('gmdSelect', _component8.default).component('gmdSelectSearch', _component10.default).component('gmdOptionEmpty', _component14.default).component('gmdOption', _component12.default).component('gmdInput', _component16.default).component('gmdFab', _component20.default).component('gmdSpinner', _component22.default).component('gmdHamburger', _component24.default);

},{"./alert/provider.js":1,"./fab/component.js":3,"./hamburger/component.js":4,"./input/component.js":6,"./menu-shrink/component.js":7,"./menu/component.js":8,"./notification/component.js":9,"./ripple/component.js":10,"./select/component.js":11,"./select/empty/component.js":12,"./select/option/component.js":13,"./select/search/component.js":14,"./spinner/component.js":15,"./theme/provider.js":16}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  bindings: {},
  template: '\n    <div ng-transclude></div>\n  ',
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this,
        input = void 0,
        model = void 0;

    ctrl.$onInit = function () {
      var changeActive = function changeActive(target) {
        if (target.value) {
          target.classList.add('active');
        } else {
          target.classList.remove('active');
        }
      };
      ctrl.$doCheck = function () {
        if (input && input[0]) changeActive(input[0]);
      };
      ctrl.$postLink = function () {
        var gmdInput = $element.find('input');
        if (gmdInput[0]) {
          input = angular.element(gmdInput);
        } else {
          input = angular.element($element.find('textarea'));
        }
        model = input.attr('ng-model') || input.attr('data-ng-model');
      };
    };
  }]
};

exports.default = Component;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Component = {
    transclude: true,
    bindings: {
        menu: '<',
        keys: '<',
        logo: '@?',
        largeLogo: '@?',
        smallLogo: '@?',
        hideSearch: '=?',
        isOpened: '=?',
        iconFirstLevel: '@?',
        showButtonFirstLevel: '=?',
        textFirstLevel: '@?',
        itemDisabled: '&?'
    },
    template: '\n\n    <nav class="main-menu">\n        <div class="menu-header">\n            <img ng-init="$ctrl.observeError()" ng-if="$ctrl.logo" ng-src="{{$ctrl.logo}}"/>\n            <img ng-init="$ctrl.observeError()" class="large" ng-if="$ctrl.largeLogo" ng-src="{{$ctrl.largeLogo}}"/>\n            <img ng-init="$ctrl.observeError()" class="small" ng-if="$ctrl.smallLogo" ng-src="{{$ctrl.smallLogo}}"/>\n\n            <svg version="1.1" ng-click="$ctrl.toggleMenu()" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n                width="613.408px" height="613.408px" viewBox="0 0 613.408 613.408" xml:space="preserve">\n                <g>\n                <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n                    l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n                    l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n                    c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n                    c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n                    c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n                    c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n                    L504.856,171.985z"/>\n                </g>\n            </svg>\n\n        </div>\n        <div class="scrollbar style-1">\n            <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n\n                <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n                    <a>\n                        <i class="material-icons">\n                            keyboard_arrow_left\n                        </i>\n                        <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label" class="nav-text"></span>\n                    </a>\n                </li>\n\n                <li class="gmd-ripple"\n                    data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n                    data-ng-show="$ctrl.allow(item)"\n                    data-ng-click="$ctrl.next(item, $event)"\n                    data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {\'disabled\': $ctrl.itemDisabled({item: item})}, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n                    \n                    <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                    <a ng-if="item.type != \'separator\' && !item.state">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                </li>\n            </ul>\n\n            <ng-transclude></ng-transclude>\n\n        </div>\n    </nav>\n    \n    ',
    controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
        var ctrl = this;
        ctrl.keys = ctrl.keys || [];
        ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
        ctrl.previous = [];
        ctrl.back = [];
        var mainContent = void 0,
            headerContent = void 0;

        ctrl.$onInit = function () {
            mainContent = angular.element('.gumga-layout .gl-main');
            headerContent = angular.element('.gumga-layout .gl-header');
            if (eval(sessionStorage.getItem('gmd-menu-shrink'))) {
                $element.addClass('fixed');
            }
        };

        ctrl.observeError = function () {
            $timeout(function () {
                var img = $element.find('img');
                img.bind('error', function () {
                    return img.css({ 'display': 'none' });
                });
                img.bind('load', function () {
                    return img.css({ 'display': 'block' });
                });
            });
        };

        ctrl.toggleMenu = function () {
            $element.toggleClass('fixed');
            sessionStorage.setItem('gmd-menu-shrink', $element.hasClass('fixed'));
        };

        ctrl.prev = function () {
            ctrl.menu = ctrl.previous.pop();
            ctrl.back.pop();
        };

        ctrl.next = function (item) {
            if (item.children && item.children.length > 0) {
                ctrl.previous.push(ctrl.menu);
                ctrl.menu = item.children;
                ctrl.back.push(item);
            }
        };

        ctrl.goBackToFirstLevel = function () {
            ctrl.menu = ctrl.previous[0];
            ctrl.previous = [];
            ctrl.back = [];
        };

        ctrl.allow = function (item) {
            if (ctrl.keys && ctrl.keys.length > 0) {
                if (!item.key) return true;
                return ctrl.keys.indexOf(item.key) > -1;
            }
        };
    }]
};

exports.default = Component;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('../attrchange/attrchange');

var Component = {
  transclude: true,
  bindings: {
    menu: '<',
    keys: '<',
    hideSearch: '=?',
    isOpened: '=?',
    iconFirstLevel: '@?',
    showButtonFirstLevel: '=?',
    textFirstLevel: '@?',
    disableAnimations: '=?',
    shrinkMode: '=?'
  },
  template: '\n\n    <div style="padding: 15px 15px 0px 15px;" ng-if="!$ctrl.hideSearch">\n      <input type="text" data-ng-model="$ctrl.search" class="form-control gmd" placeholder="Busca...">\n      <div class="bar"></div>\n    </div>\n\n    <button class="btn btn-default btn-block gmd" data-ng-if="$ctrl.showButtonFirstLevel" data-ng-click="$ctrl.goBackToFirstLevel()" data-ng-disabled="!$ctrl.previous.length" type="button">\n      <i data-ng-class="[$ctrl.iconFirstLevel]"></i>\n      <span data-ng-bind="$ctrl.textFirstLevel"></span>\n    </button>\n\n    <ul menu data-ng-class="\'level\'.concat($ctrl.back.length)">\n      <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n        <a>\n          <i class="material-icons">\n            keyboard_arrow_left\n          </i>\n          <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label"></span>\n        </a>\n      </li>\n\n      <li class="gmd gmd-ripple" \n          data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n          data-ng-show="$ctrl.allow(item)"\n          ng-click="$ctrl.next(item, $event)"\n          data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n\n          <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n          <a ng-if="item.type != \'separator\' && !item.state">\n            <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n            <span ng-bind="item.label"></span>\n            <i data-ng-if="item.children" class="material-icons pull-right">\n              keyboard_arrow_right\n            </i>\n          </a>\n\n      </li>\n    </ul>\n\n    <ng-transclude></ng-transclude>\n\n    <ul class="gl-menu-chevron" ng-if="$ctrl.shrinkMode && !$ctrl.fixed" ng-click="$ctrl.openMenuShrink()">\n      <li>\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron unfixed" ng-if="$ctrl.shrinkMode && $ctrl.fixed">\n      <li ng-click="$ctrl.unfixedMenuShrink()">\n        <i class="material-icons">chevron_left</i>\n      </li>\n    </ul>\n\n    <ul class="gl-menu-chevron possiblyFixed" ng-if="$ctrl.possiblyFixed">\n      <li ng-click="$ctrl.fixedMenuShrink()" align="center" style="display: flex; justify-content: flex-end;">\n      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n            width="613.408px" style="display: inline-block; position: relative; height: 1em; width: 3em; font-size: 1.33em; padding: 0; margin: 0;;"  height="613.408px" viewBox="0 0 613.408 613.408" style="enable-background:new 0 0 613.408 613.408;"\n            xml:space="preserve">\n        <g>\n          <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n            l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n            l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n            c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n            c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n            c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n            c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n            L504.856,171.985z"/>\n        </g>\n        </svg>\n      </li>\n    </ul>\n\n  ',
  controller: ['$timeout', '$attrs', '$element', function ($timeout, $attrs, $element) {
    var ctrl = this;
    ctrl.keys = ctrl.keys || [];
    ctrl.iconFirstLevel = ctrl.iconFirstLevel || 'glyphicon glyphicon-home';
    ctrl.previous = [];
    ctrl.back = [];

    ctrl.$onInit = function () {
      ctrl.disableAnimations = ctrl.disableAnimations || false;

      var mainContent = angular.element('.gumga-layout .gl-main');
      var headerContent = angular.element('.gumga-layout .gl-header');

      var stringToBoolean = function stringToBoolean(string) {
        switch (string.toLowerCase().trim()) {
          case "true":case "yes":case "1":
            return true;
          case "false":case "no":case "0":case null:
            return false;
          default:
            return Boolean(string);
        }
      };

      ctrl.fixed = stringToBoolean($attrs.fixed || 'false');
      ctrl.fixedMain = stringToBoolean($attrs.fixedMain || 'false');

      if (ctrl.fixedMain) {
        ctrl.fixed = true;
      }

      var onBackdropClick = function onBackdropClick(evt) {
        if (ctrl.shrinkMode) {
          angular.element('.gumga-layout nav.gl-nav').addClass('closed');
          angular.element('div.gmd-menu-backdrop').removeClass('active');
        } else {
          angular.element('.gumga-layout nav.gl-nav').removeClass('collapsed');
        }
      };

      var init = function init() {
        if (!ctrl.fixed || ctrl.shrinkMode) {
          var elm = document.createElement('div');
          elm.classList.add('gmd-menu-backdrop');
          if (angular.element('div.gmd-menu-backdrop').length == 0) {
            angular.element('body')[0].appendChild(elm);
          }
          angular.element('div.gmd-menu-backdrop').on('click', onBackdropClick);
        }
      };

      init();

      var setMenuTop = function setMenuTop() {
        $timeout(function () {
          var size = angular.element('.gumga-layout .gl-header').height();
          if (size == 0) setMenuTop();
          if (ctrl.fixed) size = 0;
          angular.element('.gumga-layout nav.gl-nav.collapsed').css({
            top: size
          });
        });
      };

      ctrl.toggleContent = function (isCollapsed) {
        $timeout(function () {
          if (ctrl.fixed) {
            var _mainContent = angular.element('.gumga-layout .gl-main');
            var _headerContent = angular.element('.gumga-layout .gl-header');
            if (isCollapsed) {
              _headerContent.ready(function () {
                setMenuTop();
              });
            }
            isCollapsed ? _mainContent.addClass('collapsed') : _mainContent.removeClass('collapsed');
            if (!ctrl.fixedMain && ctrl.fixed) {
              isCollapsed ? _headerContent.addClass('collapsed') : _headerContent.removeClass('collapsed');
            }
          }
        });
      };

      var verifyBackdrop = function verifyBackdrop(isCollapsed) {
        var headerContent = angular.element('.gumga-layout .gl-header');
        var backContent = angular.element('div.gmd-menu-backdrop');
        if (isCollapsed && !ctrl.fixed) {
          backContent.addClass('active');
          var size = headerContent.height();
          if (size > 0 && !ctrl.shrinkMode) {
            backContent.css({ top: size });
          } else {
            backContent.css({ top: 0 });
          }
        } else {
          backContent.removeClass('active');
        }
        $timeout(function () {
          return ctrl.isOpened = isCollapsed;
        });
      };

      if (ctrl.shrinkMode) {
        var _mainContent2 = angular.element('.gumga-layout .gl-main');
        var _headerContent2 = angular.element('.gumga-layout .gl-header');
        var navContent = angular.element('.gumga-layout nav.gl-nav');
        _mainContent2.css({ 'margin-left': '64px' });
        _headerContent2.css({ 'margin-left': '64px' });
        navContent.css({ 'z-index': '1006' });
        angular.element("nav.gl-nav").addClass('closed collapsed');
        verifyBackdrop(!angular.element('nav.gl-nav').hasClass('closed'));
      }

      if (angular.element.fn.attrchange) {
        angular.element("nav.gl-nav").attrchange({
          trackValues: true,
          callback: function callback(evnt) {
            if (evnt.attributeName == 'class') {
              if (ctrl.shrinkMode) {
                ctrl.possiblyFixed = evnt.newValue.indexOf('closed') == -1;
                verifyBackdrop(ctrl.possiblyFixed);
              } else {
                ctrl.toggleContent(evnt.newValue.indexOf('collapsed') != -1);
                verifyBackdrop(evnt.newValue.indexOf('collapsed') != -1);
              }
            }
          }
        });
        if (!ctrl.shrinkMode) {
          ctrl.toggleContent(angular.element('nav.gl-nav').hasClass('collapsed'));
          verifyBackdrop(angular.element('nav.gl-nav').hasClass('collapsed'));
        }
      }

      ctrl.$onInit = function () {
        if (!ctrl.hasOwnProperty('showButtonFirstLevel')) {
          ctrl.showButtonFirstLevel = true;
        }
      };

      ctrl.prev = function () {
        $timeout(function () {
          // ctrl.slide = 'slide-in-left';
          ctrl.menu = ctrl.previous.pop();
          ctrl.back.pop();
        }, 250);
      };

      ctrl.next = function (item) {
        var nav = angular.element('nav.gl-nav')[0];
        if (ctrl.shrinkMode && nav.classList.contains('closed') && item.children && angular.element('.gumga-layout nav.gl-nav').is('[open-on-hover]')) {
          ctrl.openMenuShrink();
          ctrl.next(item);
          return;
        }
        $timeout(function () {
          if (item.children) {
            // ctrl.slide = 'slide-in-right';
            ctrl.previous.push(ctrl.menu);
            ctrl.menu = item.children;
            ctrl.back.push(item);
          }
        }, 250);
      };

      ctrl.goBackToFirstLevel = function () {
        // ctrl.slide = 'slide-in-left'
        ctrl.menu = ctrl.previous[0];
        ctrl.previous = [];
        ctrl.back = [];
      };

      ctrl.allow = function (item) {
        if (ctrl.keys && ctrl.keys.length > 0) {
          if (!item.key) return true;
          return ctrl.keys.indexOf(item.key) > -1;
        }
      };

      // ctrl.slide = 'slide-in-left';

      ctrl.openMenuShrink = function () {
        ctrl.possiblyFixed = true;
        angular.element('.gumga-layout nav.gl-nav').removeClass('closed');
      };

      ctrl.fixedMenuShrink = function () {
        $element.attr('fixed', true);
        ctrl.fixed = true;
        ctrl.possiblyFixed = false;
        init();
        mainContent.css({ 'margin-left': '' });
        headerContent.css({ 'margin-left': '' });
        ctrl.toggleContent(true);
        verifyBackdrop(true);
      };

      ctrl.unfixedMenuShrink = function () {
        $element.attr('fixed', false);
        ctrl.fixed = false;
        ctrl.possiblyFixed = true;
        init();
        mainContent.css({ 'margin-left': '64px' });
        headerContent.css({ 'margin-left': '64px' });
        verifyBackdrop(true);
        angular.element('.gumga-layout nav.gl-nav').addClass('closed');
      };
    };
  }]
};

exports.default = Component;

},{"../attrchange/attrchange":2}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    icon: '@',
    notifications: '=',
    onView: '&?'
  },
  template: '\n    <ul class="nav navbar-nav navbar-right notifications">\n      <li class="dropdown">\n        <a href="#" badge="{{$ctrl.notifications.length}}" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">\n          <i class="material-icons" data-ng-bind="$ctrl.icon"></i>\n        </a>\n        <ul class="dropdown-menu">\n          <li data-ng-repeat="item in $ctrl.notifications" data-ng-click="$ctrl.view($event, item)">\n            <div class="media">\n              <div class="media-left">\n                <img class="media-object" data-ng-src="{{item.image}}">\n              </div>\n              <div class="media-body" data-ng-bind="item.content"></div>\n            </div>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  ',
  controller: function controller() {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.view = function (event, item) {
        return ctrl.onView({ event: event, item: item });
      };
    };
  }
};

exports.default = Component;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = function Component() {
  return {
    restrict: 'C',
    link: function link($scope, element, attrs) {
      if (!element[0].classList.contains('fixed')) {
        element[0].style.position = 'relative';
      }
      element[0].style.overflow = 'hidden';
      element[0].style.userSelect = 'none';

      element[0].style.msUserSelect = 'none';
      element[0].style.mozUserSelect = 'none';
      element[0].style.webkitUserSelect = 'none';

      function createRipple(evt) {
        var ripple = angular.element('<span class="gmd-ripple-effect animate">'),
            rect = element[0].getBoundingClientRect(),
            radius = Math.max(rect.height, rect.width),
            left = evt.pageX - rect.left - radius / 2 - document.body.scrollLeft,
            top = evt.pageY - rect.top - radius / 2 - document.body.scrollTop;

        ripple[0].style.width = ripple[0].style.height = radius + 'px';
        ripple[0].style.left = left + 'px';
        ripple[0].style.top = top + 'px';
        ripple.on('animationend webkitAnimationEnd', function () {
          angular.element(this).remove();
        });

        element.append(ripple);
      }

      element.bind('mousedown', createRipple);
    }
  };
};

exports.default = Component;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  require: ['ngModel', 'ngRequired'],
  transclude: true,
  bindings: {
    ngModel: '=',
    ngDisabled: '=?',
    unselect: '@?',
    options: '<',
    option: '@',
    value: '@',
    placeholder: '@?',
    onChange: "&?",
    translateLabel: '=?'
  },
  template: '\n  <div class="dropdown gmd">\n     <label class="control-label floating-dropdown" ng-show="$ctrl.selected">\n      {{$ctrl.placeholder}} <span ng-if="$ctrl.validateGumgaError" ng-class="{\'gmd-select-required\': $ctrl.ngModelCtrl.$error.required}">*<span>\n     </label>\n     <button class="btn btn-default gmd dropdown-toggle gmd-select-button"\n             type="button"\n             style="border-radius: 0;"\n             id="gmdSelect"\n             data-toggle="dropdown"\n             ng-disabled="$ctrl.ngDisabled"\n             aria-haspopup="true"\n             aria-expanded="true">\n       <span class="item-select" ng-if="!$ctrl.translateLabel" data-ng-show="$ctrl.selected" data-ng-bind="$ctrl.selected"></span>\n       <span class="item-select" ng-if="$ctrl.translateLabel" data-ng-show="$ctrl.selected">\n          {{ $ctrl.selected | gumgaTranslate }}\n       </span>\n       <span data-ng-hide="$ctrl.selected" class="item-select placeholder">\n        {{$ctrl.placeholder}}\n       </span>\n       <span ng-if="$ctrl.ngModelCtrl.$error.required && $ctrl.validateGumgaError" class="word-required">*</span>\n       <span class="caret"></span>\n     </button>\n     <ul class="dropdown-menu" aria-labelledby="gmdSelect" ng-show="$ctrl.option" style="display: none;">\n       <li data-ng-click="$ctrl.clear()" ng-if="$ctrl.unselect">\n         <a data-ng-class="{active: false}">{{$ctrl.unselect}}</a>\n       </li>\n       <li data-ng-repeat="option in $ctrl.options track by $index">\n         <a class="select-option" data-ng-click="$ctrl.select(option)" data-ng-bind="option[$ctrl.option] || option" data-ng-class="{active: $ctrl.isActive(option)}"></a>\n       </li>\n     </ul>\n     <ul class="dropdown-menu gmd" aria-labelledby="gmdSelect" ng-show="!$ctrl.option" style="max-height: 250px;overflow: auto;display: none;" ng-transclude></ul>\n   </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', '$compile', function ($scope, $attrs, $timeout, $element, $transclude, $compile) {
    var ctrl = this,
        ngModelCtrl = $element.controller('ngModel');

    var options = ctrl.options || [];

    ctrl.ngModelCtrl = ngModelCtrl;
    ctrl.validateGumgaError = $attrs.hasOwnProperty('gumgaRequired');

    function findParentByName(elm, parentName) {
      if (elm.className == parentName) {
        return elm;
      }
      if (elm.parentNode) {
        return findParentByName(elm.parentNode, parentName);
      }
      return elm;
    }

    function preventDefault(e) {
      e = e || window.event;
      var target = findParentByName(e.target, 'select-option');
      if (target.nodeName == 'A' && target.className == 'select-option' || e.target.nodeName == 'A' && e.target.className == 'select-option') {
        var direction = findScrollDirectionOtherBrowsers(e);
        var scrollTop = angular.element(target.parentNode.parentNode).scrollTop();
        if (scrollTop + angular.element(target.parentNode.parentNode).innerHeight() >= target.parentNode.parentNode.scrollHeight && direction != 'UP') {
          if (e.preventDefault) e.preventDefault();
          e.returnValue = false;
        } else if (scrollTop <= 0 && direction != 'DOWN') {
          if (e.preventDefault) e.preventDefault();
          e.returnValue = false;
        } else {
          e.returnValue = true;
          return;
        }
      } else {
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
      }
    }

    function findScrollDirectionOtherBrowsers(event) {
      var delta;
      if (event.wheelDelta) {
        delta = event.wheelDelta;
      } else {
        delta = -1 * event.deltaY;
      }
      if (delta < 0) {
        return "DOWN";
      } else if (delta > 0) {
        return "UP";
      }
    }

    function preventDefaultForScrollKeys(e) {
      if (keys && keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
      console.clear();
    }

    function disableScroll() {
      if (window.addEventListener) {
        window.addEventListener('scroll', preventDefault, false);
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      }
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove = preventDefault; // mobile
      document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
      if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
    }

    var getOffset = function getOffset(el) {
      var rect = el.getBoundingClientRect(),
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var _x = 0,
          _y = 0;
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        if (el.nodeName == 'BODY') {
          _y += el.offsetTop - Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
        } else {
          _y += el.offsetTop - el.scrollTop;
        }
        el = el.offsetParent;
      }
      return { top: _y, left: rect.left + scrollLeft };
    };

    var getElementMaxHeight = function getElementMaxHeight(elm) {
      var scrollPosition = Math.max(angular.element("html").scrollTop(), angular.element("body").scrollTop());
      var elementOffset = elm.offset().top;
      var elementDistance = elementOffset - scrollPosition;
      var windowHeight = angular.element(window).height();
      return windowHeight - elementDistance;
    };

    var handlingElementStyle = function handlingElementStyle($element, uls) {
      var SIZE_BOTTOM_DISTANCE = 5;
      var position = getOffset($element[0]);

      angular.forEach(uls, function (ul) {
        if (angular.element(ul).height() == 0) return;
        var maxHeight = getElementMaxHeight(angular.element($element[0]));
        if (angular.element(ul).height() > maxHeight) {
          angular.element(ul).css({
            height: maxHeight - SIZE_BOTTOM_DISTANCE + 'px'
          });
        } else if (angular.element(ul).height() != maxHeight - SIZE_BOTTOM_DISTANCE) {
          angular.element(ul).css({
            height: 'auto'
          });
        }

        angular.element(ul).css({
          display: 'block',
          position: 'fixed',
          left: position.left - 1 + 'px',
          top: position.top - 2 + 'px',
          width: $element.find('div.dropdown')[0].clientWidth + 1
        });
      });
    };

    angular.element(document).click(function (evt) {
      close();
    });

    var close = function close() {
      if (!ctrl.div) return;
      enableScroll();
      var uls = angular.element(ctrl.div).find('ul');
      angular.forEach(uls, function (ul) {
        angular.element(ul).css({
          display: 'none'
        });
      });
      $element.find('div.dropdown').append(uls);
      ctrl.div.remove();
    };

    var handlingElementInBody = function handlingElementInBody(elm, uls) {
      var body = angular.element(document).find('body').eq(0);
      ctrl.div = angular.element(document.createElement('div'));
      ctrl.div.addClass("dropdown gmd");
      ctrl.div.append(uls);
      body.append(ctrl.div);
      angular.element(elm.find('button.dropdown-toggle')).attrchange({
        trackValues: true,
        callback: function callback(evnt) {
          if (evnt.attributeName == 'aria-expanded' && evnt.newValue == 'false') {
            close();
          }
        }
      });
    };

    $element.bind('click', function (event) {
      var uls = $element.find('ul');
      if (uls.find('gmd-option').length == 0) {
        event.stopPropagation();
        return;
      }
      handlingElementStyle($element, uls);
      disableScroll();
      handlingElementInBody($element, uls);
    });

    ctrl.select = function (option) {
      angular.forEach(options, function (option) {
        option.selected = false;
      });
      option.selected = true;
      ctrl.ngModel = option.ngValue;
      ctrl.selected = option.ngLabel;
    };

    ctrl.addOption = function (option) {
      options.push(option);
    };

    var setSelected = function setSelected(value) {
      angular.forEach(options, function (option) {
        if (option.ngValue.$$hashKey) {
          delete option.ngValue.$$hashKey;
        }
        if (angular.equals(value, option.ngValue)) {
          ctrl.select(option);
        }
      });
    };

    $timeout(function () {
      return setSelected(ctrl.ngModel);
    });

    ctrl.$doCheck = function () {
      if (options && options.length > 0) setSelected(ctrl.ngModel);
    };
  }]
};

exports.default = Component;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {},
  template: '\n      <a class="select-option" data-ng-click="$ctrl.select()" ng-transclude></a>\n    ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var _this = this;

    var ctrl = this;

    ctrl.select = function () {
      ctrl.gmdSelectCtrl.select(_this);
    };
  }]
};

exports.default = Component;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  // require: ['ngModel','ngRequired'],
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngValue: '=',
    ngLabel: '='
  },
  template: '\n    <a class="select-option" data-ng-click="$ctrl.select($ctrl.ngValue, $ctrl.ngLabel)" ng-class="{active: $ctrl.selected}" ng-transclude></a>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var _this = this;

    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.gmdSelectCtrl.addOption(_this);
    };

    ctrl.select = function () {
      ctrl.gmdSelectCtrl.select(ctrl);
      if (ctrl.gmdSelectCtrl.onChange) {
        ctrl.gmdSelectCtrl.onChange({ value: _this.ngValue });
      }
    };
  }]
};

exports.default = Component;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  transclude: true,
  require: {
    gmdSelectCtrl: '^gmdSelect'
  },
  bindings: {
    ngModel: '=',
    placeholder: '@?'
  },
  template: '\n    <div class="input-group" style="border: none;background: #f9f9f9;">\n      <span class="input-group-addon" id="basic-addon1" style="border: none;">\n        <i class="material-icons">search</i>\n      </span>\n      <input type="text" style="border: none;" class="form-control gmd" ng-model="$ctrl.ngModel" placeholder="{{$ctrl.placeholder}}">\n    </div>\n  ',
  controller: ['$scope', '$attrs', '$timeout', '$element', '$transclude', function ($scope, $attrs, $timeout, $element, $transclude) {
    var ctrl = this;

    $element.bind('click', function (evt) {
      evt.stopPropagation();
    });
  }]
};

exports.default = Component;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Component = {
  bindings: {
    diameter: "@?",
    box: "=?"
  },
  template: "\n  <div class=\"spinner-material\" ng-if=\"$ctrl.diameter\">\n   <svg xmlns=\"http://www.w3.org/2000/svg\"\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n        version=\"1\"\n        ng-class=\"{'spinner-box' : $ctrl.box}\"\n        style=\"width: {{$ctrl.diameter}};height: {{$ctrl.diameter}};\"\n        viewBox=\"0 0 28 28\">\n    <g class=\"qp-circular-loader\">\n     <path class=\"qp-circular-loader-path\" fill=\"none\" d=\"M 14,1.5 A 12.5,12.5 0 1 1 1.5,14\" stroke-linecap=\"round\" />\n    </g>\n   </svg>\n  </div>",
  controller: ['$scope', '$element', '$attrs', '$timeout', '$parse', function ($scope, $element, $attrs, $timeout, $parse) {
    var ctrl = this;

    ctrl.$onInit = function () {
      ctrl.diameter = ctrl.diameter || '50px';
    };
  }]
};

exports.default = Component;

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Provider = function Provider() {

    var setElementHref = function setElementHref(href) {
        var elm = angular.element('link[href*="gumga-layout"]');
        if (elm && elm[0]) {
            elm.attr('href', href);
        }
        elm = angular.element(document.createElement('link'));
        elm.attr('href', href);
        elm.attr('rel', 'stylesheet');
        document.head.appendChild(elm[0]);
    };

    var setThemeDefault = function setThemeDefault(themeName, save) {
        var src = void 0,
            themeDefault = sessionStorage.getItem('gmd-theme-default');
        if (themeName && !themeDefault) {
            if (save) sessionStorage.setItem('gmd-theme-default', themeName);
            src = 'gumga-layout/' + themeName + '/gumga-layout.min.css';
        } else {
            if (themeDefault) {
                src = 'gumga-layout/' + themeDefault + '/gumga-layout.min.css';
            } else {
                src = 'gumga-layout/gumga-layout.min.css';
            }
        }
        setElementHref(src);
    };

    var setTheme = function setTheme(themeName, updateSession) {
        var src,
            themeDefault = sessionStorage.getItem('gmd-theme');

        if (themeName && updateSession || themeName && !themeDefault) {
            sessionStorage.setItem('gmd-theme', themeName);
            src = 'gumga-layout/' + themeName + '/gumga-layout.min.css';
            setElementHref(src);
            return;
        }

        if (themeName && !updateSession) {
            src = 'gumga-layout/' + themeDefault + '/gumga-layout.min.css';
            setElementHref(src);
            return;
        }

        src = 'gumga-layout/gumga-layout.min.css';
        setElementHref(src);
    };

    return {
        setThemeDefault: setThemeDefault,
        setTheme: setTheme,
        $get: function $get() {
            return {
                setThemeDefault: setThemeDefault,
                setTheme: setTheme
            };
        }
    };
};

Provider.$inject = [];

exports.default = Provider;

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2FsZXJ0L3Byb3ZpZGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZS5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9mYWIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL2hhbWJ1cmdlci9jb21wb25lbnQuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9ndW1nYS1sYXlvdXQvc3JjL2NvbXBvbmVudHMvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9ndW1nYS1sYXlvdXQvc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL21lbnUtc2hyaW5rL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9tZW51L2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3JpcHBsZS9jb21wb25lbnQuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9ndW1nYS1sYXlvdXQvc3JjL2NvbXBvbmVudHMvc2VsZWN0L2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9zZWxlY3QvZW1wdHkvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3NlbGVjdC9zZWFyY2gvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvZ3VtZ2EtbGF5b3V0L3NyYy9jb21wb25lbnRzL3RoZW1lL3Byb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNB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QkFHSTtBQUNILG1CQUFPO0FBQ0gsaUNBQWlCLGVBRGQ7QUFFSCwwQkFBVTtBQUZQLGFBQVA7QUFJSDtBQVJFLEtBQVA7QUFVSCxDQTFERDs7QUE0REEsU0FBUyxPQUFULEdBQW1CLEVBQW5COztrQkFFZSxRIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImxldCB0ZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cImFsZXJ0IGdtZCBnbWQtYWxlcnQtcG9wdXAgYWxlcnQtQUxFUlRfVFlQRSBhbGVydC1kaXNtaXNzaWJsZVwiIHJvbGU9XCJhbGVydFwiPlxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj5cbiAgICA8c3Ryb25nPkFMRVJUX1RJVExFPC9zdHJvbmc+IEFMRVJUX01FU1NBR0VcbiAgICA8YSBjbGFzcz1cImFjdGlvblwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5EZXNmYXplcjwvYT5cbiAgPC9kaXY+XG5gO1xuXG5sZXQgUHJvdmlkZXIgPSAoKSA9PiB7XG5cbiAgbGV0IGFsZXJ0cyA9IFtdO1xuXG4gIFN0cmluZy5wcm90b3R5cGUudG9ET00gPSBTdHJpbmcucHJvdG90eXBlLnRvRE9NIHx8IGZ1bmN0aW9uKCl7XG4gICAgbGV0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWwuaW5uZXJIVE1MID0gdGhpcztcbiAgICBsZXQgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICByZXR1cm4gZnJhZy5hcHBlbmRDaGlsZChlbC5yZW1vdmVDaGlsZChlbC5maXJzdENoaWxkKSk7XG4gIH07XG5cbiAgU3RyaW5nLnByb3RvdHlwZS5oYXNoQ29kZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoYXNoID0gMCwgaSwgY2hyO1xuICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGhhc2g7XG4gICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNociAgID0gdGhpcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgaGFzaCAgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNocjtcbiAgICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfVxuICAgIHJldHVybiBoYXNoO1xuICB9O1xuXG4gIGNvbnN0IGdldFRlbXBsYXRlID0gKHR5cGUsIHRpdGxlLCBtZXNzYWdlKSA9PiB7XG4gICAgbGV0IHRvUmV0dXJuID0gdGVtcGxhdGUudHJpbSgpLnJlcGxhY2UoJ0FMRVJUX1RZUEUnLCB0eXBlKTtcbiAgICAgICAgdG9SZXR1cm4gPSB0b1JldHVybi50cmltKCkucmVwbGFjZSgnQUxFUlRfVElUTEUnLCB0aXRsZSk7XG4gICAgICAgIHRvUmV0dXJuID0gdG9SZXR1cm4udHJpbSgpLnJlcGxhY2UoJ0FMRVJUX01FU1NBR0UnLCBtZXNzYWdlKTtcbiAgICByZXR1cm4gdG9SZXR1cm47XG4gIH1cblxuICBjb25zdCBnZXRFbGVtZW50Qm9keSAgICA9ICgpID0+IGFuZ3VsYXIuZWxlbWVudCgnYm9keScpWzBdO1xuXG4gIGNvbnN0IHN1Y2Nlc3MgPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ3N1Y2Nlc3MnLCB0aXRsZSB8fCAnJywgbWVzc2FnZSB8fCAnJyksIHRpbWUsIHt0aXRsZSwgbWVzc2FnZX0pO1xuICB9XG5cbiAgY29uc3QgZXJyb3IgPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ2RhbmdlcicsIHRpdGxlIHx8ICcnLCBtZXNzYWdlIHx8ICcnKSwgdGltZSwge3RpdGxlLCBtZXNzYWdlfSk7XG4gIH1cblxuICBjb25zdCB3YXJuaW5nID0gKHRpdGxlLCBtZXNzYWdlLCB0aW1lKSA9PiB7XG4gICAgcmV0dXJuIGNyZWF0ZUFsZXJ0KGdldFRlbXBsYXRlKCd3YXJuaW5nJywgdGl0bGUsIG1lc3NhZ2UpLCB0aW1lLCB7dGl0bGUsIG1lc3NhZ2V9KTtcbiAgfVxuXG4gIGNvbnN0IGluZm8gPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ2luZm8nLCB0aXRsZSwgbWVzc2FnZSksIHRpbWUsIHt0aXRsZSwgbWVzc2FnZX0pO1xuICB9XG5cbiAgY29uc3QgY2xvc2VBbGVydCA9IChlbG0sIGNvbmZpZykgPT4ge1xuICAgIGFsZXJ0cyA9IGFsZXJ0cy5maWx0ZXIoYWxlcnQgPT4gIWFuZ3VsYXIuZXF1YWxzKGNvbmZpZywgYWxlcnQpKTtcbiAgICBhbmd1bGFyLmVsZW1lbnQoZWxtKS5jc3Moe1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC4zKSdcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxldCBib2R5ID0gZ2V0RWxlbWVudEJvZHkoKTtcbiAgICAgIGlmKGJvZHkuY29udGFpbnMoZWxtKSl7XG4gICAgICAgIGJvZHkucmVtb3ZlQ2hpbGQoZWxtKTtcbiAgICAgIH1cblxuICAgIH0sIDEwMCk7XG4gIH1cblxuICBjb25zdCBib3R0b21MZWZ0ID0gKGVsbSkgPT4ge1xuICAgIGxldCBib3R0b20gPSAxNTtcbiAgICBhbmd1bGFyLmZvckVhY2goYW5ndWxhci5lbGVtZW50KGdldEVsZW1lbnRCb2R5KCkpLmZpbmQoJ2Rpdi5nbWQtYWxlcnQtcG9wdXAnKSwgcG9wdXAgPT4ge1xuICAgICAgYW5ndWxhci5lcXVhbHMoZWxtWzBdLCBwb3B1cCkgPyBhbmd1bGFyLm5vb3AoKSA6IGJvdHRvbSArPSBhbmd1bGFyLmVsZW1lbnQocG9wdXApLmhlaWdodCgpICogMztcbiAgICB9KTtcbiAgICBlbG0uY3NzKHtcbiAgICAgIGJvdHRvbTogYm90dG9tKyAncHgnLFxuICAgICAgbGVmdCAgOiAnMTVweCcsXG4gICAgICB0b3AgICA6ICBudWxsLFxuICAgICAgcmlnaHQgOiAgbnVsbFxuICAgIH0pXG4gIH1cblxuICBjb25zdCBjcmVhdGVBbGVydCA9ICh0ZW1wbGF0ZSwgdGltZSwgY29uZmlnKSA9PiB7XG4gICAgaWYoYWxlcnRzLmZpbHRlcihhbGVydCA9PiBhbmd1bGFyLmVxdWFscyhhbGVydCwgY29uZmlnKSkubGVuZ3RoID4gMCl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGFsZXJ0cy5wdXNoKGNvbmZpZyk7XG4gICAgbGV0IG9uRGlzbWlzcywgb25Sb2xsYmFjaywgZWxtID0gYW5ndWxhci5lbGVtZW50KHRlbXBsYXRlLnRvRE9NKCkpO1xuICAgIGdldEVsZW1lbnRCb2R5KCkuYXBwZW5kQ2hpbGQoZWxtWzBdKTtcblxuICAgIGJvdHRvbUxlZnQoZWxtKTtcblxuICAgIGVsbS5maW5kKCdidXR0b25bY2xhc3M9XCJjbG9zZVwiXScpLmNsaWNrKChldnQpID0+IHtcbiAgICAgIGNsb3NlQWxlcnQoZWxtWzBdKTtcbiAgICAgIG9uRGlzbWlzcyA/IG9uRGlzbWlzcyhldnQpIDogYW5ndWxhci5ub29wKClcbiAgICB9KTtcblxuICAgIGVsbS5maW5kKCdhW2NsYXNzPVwiYWN0aW9uXCJdJykuY2xpY2soKGV2dCkgPT4gb25Sb2xsYmFjayA/IG9uUm9sbGJhY2soZXZ0KSA6IGFuZ3VsYXIubm9vcCgpKTtcblxuICAgIHRpbWUgPyBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNsb3NlQWxlcnQoZWxtWzBdLCBjb25maWcpO1xuICAgICAgb25EaXNtaXNzID8gb25EaXNtaXNzKCkgOiBhbmd1bGFyLm5vb3AoKTtcbiAgICB9LCB0aW1lKSA6IGFuZ3VsYXIubm9vcCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uKHBvc2l0aW9uKXtcblxuICAgICAgfSxcbiAgICAgIG9uRGlzbWlzcyhjYWxsYmFjaykge1xuICAgICAgICBvbkRpc21pc3MgPSBjYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuICAgICAgb25Sb2xsYmFjayhjYWxsYmFjaykge1xuICAgICAgICBlbG0uZmluZCgnYVtjbGFzcz1cImFjdGlvblwiXScpLmNzcyh7IGRpc3BsYXk6ICdibG9jaycgfSk7XG4gICAgICAgIG9uUm9sbGJhY2sgPSBjYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9LFxuICAgICAgY2xvc2UoKXtcbiAgICAgICAgY2xvc2VBbGVydChlbG1bMF0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgICRnZXQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICAgICAgICBlcnJvciAgOiBlcnJvcixcbiAgICAgICAgICB3YXJuaW5nOiB3YXJuaW5nLFxuICAgICAgICAgIGluZm8gICA6IGluZm9cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgfVxufVxuXG5Qcm92aWRlci4kaW5qZWN0ID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IFByb3ZpZGVyXG4iLCJmdW5jdGlvbiBpc0RPTUF0dHJNb2RpZmllZFN1cHBvcnRlZCgpIHtcblx0XHR2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblx0XHR2YXIgZmxhZyA9IGZhbHNlO1xuXG5cdFx0aWYgKHAuYWRkRXZlbnRMaXN0ZW5lcikge1xuXHRcdFx0cC5hZGRFdmVudExpc3RlbmVyKCdET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmxhZyA9IHRydWVcblx0XHRcdH0sIGZhbHNlKTtcblx0XHR9IGVsc2UgaWYgKHAuYXR0YWNoRXZlbnQpIHtcblx0XHRcdHAuYXR0YWNoRXZlbnQoJ29uRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZsYWcgPSB0cnVlXG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRwLnNldEF0dHJpYnV0ZSgnaWQnLCAndGFyZ2V0Jyk7XG5cdFx0cmV0dXJuIGZsYWc7XG5cdH1cblxuXHRmdW5jdGlvbiBjaGVja0F0dHJpYnV0ZXMoY2hrQXR0ciwgZSkge1xuXHRcdGlmIChjaGtBdHRyKSB7XG5cdFx0XHR2YXIgYXR0cmlidXRlcyA9IHRoaXMuZGF0YSgnYXR0ci1vbGQtdmFsdWUnKTtcblxuXHRcdFx0aWYgKGUuYXR0cmlidXRlTmFtZS5pbmRleE9mKCdzdHlsZScpID49IDApIHtcblx0XHRcdFx0aWYgKCFhdHRyaWJ1dGVzWydzdHlsZSddKVxuXHRcdFx0XHRcdGF0dHJpYnV0ZXNbJ3N0eWxlJ10gPSB7fTsgLy9pbml0aWFsaXplXG5cdFx0XHRcdHZhciBrZXlzID0gZS5hdHRyaWJ1dGVOYW1lLnNwbGl0KCcuJyk7XG5cdFx0XHRcdGUuYXR0cmlidXRlTmFtZSA9IGtleXNbMF07XG5cdFx0XHRcdGUub2xkVmFsdWUgPSBhdHRyaWJ1dGVzWydzdHlsZSddW2tleXNbMV1dOyAvL29sZCB2YWx1ZVxuXHRcdFx0XHRlLm5ld1ZhbHVlID0ga2V5c1sxXSArICc6J1xuXHRcdFx0XHRcdFx0KyB0aGlzLnByb3AoXCJzdHlsZVwiKVskLmNhbWVsQ2FzZShrZXlzWzFdKV07IC8vbmV3IHZhbHVlXG5cdFx0XHRcdGF0dHJpYnV0ZXNbJ3N0eWxlJ11ba2V5c1sxXV0gPSBlLm5ld1ZhbHVlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZS5vbGRWYWx1ZSA9IGF0dHJpYnV0ZXNbZS5hdHRyaWJ1dGVOYW1lXTtcblx0XHRcdFx0ZS5uZXdWYWx1ZSA9IHRoaXMuYXR0cihlLmF0dHJpYnV0ZU5hbWUpO1xuXHRcdFx0XHRhdHRyaWJ1dGVzW2UuYXR0cmlidXRlTmFtZV0gPSBlLm5ld1ZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmRhdGEoJ2F0dHItb2xkLXZhbHVlJywgYXR0cmlidXRlcyk7IC8vdXBkYXRlIHRoZSBvbGQgdmFsdWUgb2JqZWN0XG5cdFx0fVxuXHR9XG5cblx0Ly9pbml0aWFsaXplIE11dGF0aW9uIE9ic2VydmVyXG5cdHZhciBNdXRhdGlvbk9ic2VydmVyID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG5cdGFuZ3VsYXIuZWxlbWVudC5mbi5hdHRyY2hhbmdlID0gZnVuY3Rpb24oYSwgYikge1xuXHRcdGlmICh0eXBlb2YgYSA9PSAnb2JqZWN0Jykgey8vY29yZVxuXHRcdFx0dmFyIGNmZyA9IHtcblx0XHRcdFx0dHJhY2tWYWx1ZXMgOiBmYWxzZSxcblx0XHRcdFx0Y2FsbGJhY2sgOiAkLm5vb3Bcblx0XHRcdH07XG5cdFx0XHQvL2JhY2t3YXJkIGNvbXBhdGliaWxpdHlcblx0XHRcdGlmICh0eXBlb2YgYSA9PT0gXCJmdW5jdGlvblwiKSB7IGNmZy5jYWxsYmFjayA9IGE7IH0gZWxzZSB7ICQuZXh0ZW5kKGNmZywgYSk7IH1cblxuXHRcdFx0aWYgKGNmZy50cmFja1ZhbHVlcykgeyAvL2dldCBhdHRyaWJ1dGVzIG9sZCB2YWx1ZVxuXHRcdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcblx0XHRcdFx0XHR2YXIgYXR0cmlidXRlcyA9IHt9O1xuXHRcdFx0XHRcdGZvciAoIHZhciBhdHRyLCBpID0gMCwgYXR0cnMgPSBlbC5hdHRyaWJ1dGVzLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRhdHRyID0gYXR0cnMuaXRlbShpKTtcblx0XHRcdFx0XHRcdGF0dHJpYnV0ZXNbYXR0ci5ub2RlTmFtZV0gPSBhdHRyLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQkKHRoaXMpLmRhdGEoJ2F0dHItb2xkLXZhbHVlJywgYXR0cmlidXRlcyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoTXV0YXRpb25PYnNlcnZlcikgeyAvL01vZGVybiBCcm93c2VycyBzdXBwb3J0aW5nIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0dmFyIG1PcHRpb25zID0ge1xuXHRcdFx0XHRcdHN1YnRyZWUgOiBmYWxzZSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVzIDogdHJ1ZSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVPbGRWYWx1ZSA6IGNmZy50cmFja1ZhbHVlc1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihtdXRhdGlvbnMpIHtcblx0XHRcdFx0XHRtdXRhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0XHR2YXIgX3RoaXMgPSBlLnRhcmdldDtcblx0XHRcdFx0XHRcdC8vZ2V0IG5ldyB2YWx1ZSBpZiB0cmFja1ZhbHVlcyBpcyB0cnVlXG5cdFx0XHRcdFx0XHRpZiAoY2ZnLnRyYWNrVmFsdWVzKSB7XG5cdFx0XHRcdFx0XHRcdGUubmV3VmFsdWUgPSAkKF90aGlzKS5hdHRyKGUuYXR0cmlidXRlTmFtZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoJChfdGhpcykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnKSA9PT0gJ2Nvbm5lY3RlZCcpIHsgLy9leGVjdXRlIGlmIGNvbm5lY3RlZFxuXHRcdFx0XHRcdFx0XHRjZmcuY2FsbGJhY2suY2FsbChfdGhpcywgZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ011dGF0aW9uIE9ic2VydmVyJykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnLCAnY29ubmVjdGVkJylcblx0XHRcdFx0XHRcdC5kYXRhKCdhdHRyY2hhbmdlLW9icycsIG9ic2VydmVyKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5vYnNlcnZlKHRoaXMsIG1PcHRpb25zKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmIChpc0RPTUF0dHJNb2RpZmllZFN1cHBvcnRlZCgpKSB7IC8vT3BlcmFcblx0XHRcdFx0Ly9Hb29kIG9sZCBNdXRhdGlvbiBFdmVudHNcblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAnRE9NQXR0ck1vZGlmaWVkJykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnLCAnY29ubmVjdGVkJykub24oJ0RPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0XHRcdFx0aWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQpIHsgZXZlbnQgPSBldmVudC5vcmlnaW5hbEV2ZW50OyB9Ly9qUXVlcnkgbm9ybWFsaXphdGlvbiBpcyBub3QgcmVxdWlyZWRcblx0XHRcdFx0XHRldmVudC5hdHRyaWJ1dGVOYW1lID0gZXZlbnQuYXR0ck5hbWU7IC8vcHJvcGVydHkgbmFtZXMgdG8gYmUgY29uc2lzdGVudCB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcblx0XHRcdFx0XHRldmVudC5vbGRWYWx1ZSA9IGV2ZW50LnByZXZWYWx1ZTsgLy9wcm9wZXJ0eSBuYW1lcyB0byBiZSBjb25zaXN0ZW50IHdpdGggTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0XHRcdGlmICgkKHRoaXMpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJykgPT09ICdjb25uZWN0ZWQnKSB7IC8vZGlzY29ubmVjdGVkIGxvZ2ljYWxseVxuXHRcdFx0XHRcdFx0Y2ZnLmNhbGxiYWNrLmNhbGwodGhpcywgZXZlbnQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKCdvbnByb3BlcnR5Y2hhbmdlJyBpbiBkb2N1bWVudC5ib2R5KSB7IC8vd29ya3Mgb25seSBpbiBJRVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdwcm9wZXJ0eWNoYW5nZScpLmRhdGEoJ2F0dHJjaGFuZ2Utc3RhdHVzJywgJ2Nvbm5lY3RlZCcpLm9uKCdwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRlLmF0dHJpYnV0ZU5hbWUgPSB3aW5kb3cuZXZlbnQucHJvcGVydHlOYW1lO1xuXHRcdFx0XHRcdC8vdG8gc2V0IHRoZSBhdHRyIG9sZCB2YWx1ZVxuXHRcdFx0XHRcdGNoZWNrQXR0cmlidXRlcy5jYWxsKCQodGhpcyksIGNmZy50cmFja1ZhbHVlcywgZSk7XG5cdFx0XHRcdFx0aWYgKCQodGhpcykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnKSA9PT0gJ2Nvbm5lY3RlZCcpIHsgLy9kaXNjb25uZWN0ZWQgbG9naWNhbGx5XG5cdFx0XHRcdFx0XHRjZmcuY2FsbGJhY2suY2FsbCh0aGlzLCBlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgYSA9PSAnc3RyaW5nJyAmJiAkLmZuLmF0dHJjaGFuZ2UuaGFzT3duUHJvcGVydHkoJ2V4dGVuc2lvbnMnKSAmJlxuXHRcdFx0XHRhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZVsnZXh0ZW5zaW9ucyddLmhhc093blByb3BlcnR5KGEpKSB7IC8vZXh0ZW5zaW9ucy9vcHRpb25zXG5cdFx0XHRyZXR1cm4gJC5mbi5hdHRyY2hhbmdlWydleHRlbnNpb25zJ11bYV0uY2FsbCh0aGlzLCBiKTtcblx0XHR9XG5cdH1cbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgZm9yY2VDbGljazogJz0/JyxcbiAgICBvcGVuZWQ6ICc9PydcbiAgfSxcbiAgdGVtcGxhdGU6IGA8bmctdHJhbnNjbHVkZT48L25nLXRyYW5zY2x1ZGU+YCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY29uc3QgaGFuZGxpbmdPcHRpb25zID0gKGVsZW1lbnRzKSA9PiB7XG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChlbGVtZW50cywgKG9wdGlvbikgPT4ge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChvcHRpb24pLmNzcyh7bGVmdDogKG1lYXN1cmVUZXh0KGFuZ3VsYXIuZWxlbWVudChvcHRpb24pLnRleHQoKSwgJzE0Jywgb3B0aW9uLnN0eWxlKS53aWR0aCArIDMwKSAqIC0xfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZWFzdXJlVGV4dChwVGV4dCwgcEZvbnRTaXplLCBwU3R5bGUpIHtcbiAgICAgICAgdmFyIGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsRGl2KTtcblxuICAgICAgICBpZiAocFN0eWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxEaXYuc3R5bGUgPSBwU3R5bGU7XG4gICAgICAgIH1cblxuICAgICAgICBsRGl2LnN0eWxlLmZvbnRTaXplID0gXCJcIiArIHBGb250U2l6ZSArIFwicHhcIjtcbiAgICAgICAgbERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgbERpdi5zdHlsZS5sZWZ0ID0gLTEwMDA7XG4gICAgICAgIGxEaXYuc3R5bGUudG9wID0gLTEwMDA7XG5cbiAgICAgICAgbERpdi5pbm5lckhUTUwgPSBwVGV4dDtcblxuICAgICAgICB2YXIgbFJlc3VsdCA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBsRGl2LmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBsRGl2LmNsaWVudEhlaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobERpdik7XG5cbiAgICAgICAgbERpdiA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIGxSZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3Qgd2l0aEZvY3VzID0gKHVsKSA9PiB7XG4gICAgICAkZWxlbWVudC5vbignbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgaWYoY3RybC5vcGVuZWQpe1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICB9KVxuICAgICAgICBvcGVuKHVsKTtcbiAgICAgIH0pO1xuICAgICAgJGVsZW1lbnQub24oJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgIGlmKGN0cmwub3BlbmVkKXtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgIGNsb3NlKHVsKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNsb3NlID0gKHVsKSA9PiB7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpIHNjYWxlKDAuMyknfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3NjYWxlKDAuMyknfSk7XG4gICAgICB9XG4gICAgICB1bC5maW5kKCdsaSA+IHNwYW4nKS5jc3Moe29wYWNpdHk6ICcwJywgcG9zaXRpb246ICdhYnNvbHV0ZSd9KVxuICAgICAgdWwuY3NzKHt2aXNpYmlsaXR5OiBcImhpZGRlblwiLCBvcGFjaXR5OiAnMCd9KVxuICAgICAgdWwucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgIC8vIGlmKGN0cmwub3BlbmVkKXtcbiAgICAgIC8vICAgY3RybC5vcGVuZWQgPSBmYWxzZTtcbiAgICAgIC8vICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBjb25zdCBvcGVuID0gKHVsKSA9PiB7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpIHNjYWxlKDEpJ30pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHVsLmZpbmQoJ2xpJykuY3NzKHt0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZykgc2NhbGUoMSknfSk7XG4gICAgICB9XG4gICAgICB1bC5maW5kKCdsaSA+IHNwYW4nKS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQodGhpcykuY3NzKHtvcGFjaXR5OiAnMScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnfSlcbiAgICAgIH0pXG4gICAgICB1bC5jc3Moe3Zpc2liaWxpdHk6IFwidmlzaWJsZVwiLCBvcGFjaXR5OiAnMSd9KVxuICAgICAgdWwuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgIC8vIGlmKCFjdHJsLm9wZW5lZCl7XG4gICAgICAvLyAgIGN0cmwub3BlbmVkID0gdHJ1ZTtcbiAgICAgIC8vICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICBjb25zdCB3aXRoQ2xpY2sgPSAodWwpID0+IHtcbiAgICAgICAkZWxlbWVudC5maW5kKCdidXR0b24nKS5maXJzdCgpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgIGlmKHVsLmhhc0NsYXNzKCdvcGVuJykpe1xuICAgICAgICAgICBjbG9zZSh1bCk7XG4gICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgb3Blbih1bCk7XG4gICAgICAgICB9XG4gICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCB2ZXJpZnlQb3NpdGlvbiA9ICh1bCkgPT4ge1xuICAgICAgJGVsZW1lbnQuY3NzKHtkaXNwbGF5OiBcImlubGluZS1ibG9ja1wifSk7XG4gICAgICBpZih1bFswXS5oYXNBdHRyaWJ1dGUoJ2xlZnQnKSl7XG4gICAgICAgIGxldCB3aWR0aCA9IDAsIGxpcyA9IHVsLmZpbmQoJ2xpJyk7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChsaXMsIGxpID0+IHdpZHRoKz1hbmd1bGFyLmVsZW1lbnQobGkpWzBdLm9mZnNldFdpZHRoKTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9ICh3aWR0aCArICgxMCAqIGxpcy5sZW5ndGgpKSAqIC0xO1xuICAgICAgICB1bC5jc3Moe2xlZnQ6IHNpemV9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICBjb25zdCBzaXplID0gdWwuaGVpZ2h0KCk7XG4gICAgICAgIHVsLmNzcyh7dG9wOiBzaXplICogLTF9KVxuICAgICAgfVxuICAgIH1cblxuICAgICRzY29wZS4kd2F0Y2goJyRjdHJsLm9wZW5lZCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goJGVsZW1lbnQuZmluZCgndWwnKSwgKHVsKSA9PiB7XG4gICAgICAgICAgdmVyaWZ5UG9zaXRpb24oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgaGFuZGxpbmdPcHRpb25zKGFuZ3VsYXIuZWxlbWVudCh1bCkuZmluZCgnbGkgPiBzcGFuJykpO1xuICAgICAgICAgIGlmKHZhbHVlKXtcbiAgICAgICAgICAgIG9wZW4oYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgY2xvc2UoYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfSwgdHJ1ZSk7XG5cbiAgICAkZWxlbWVudC5yZWFkeSgoKSA9PiB7XG4gICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgICAgaWYoIWN0cmwuZm9yY2VDbGljayl7XG4gICAgICAgICAgICB3aXRoRm9jdXMoYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB3aXRoQ2xpY2soYW5ndWxhci5lbGVtZW50KHVsKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YSBjbGFzcz1cIm5hdmJhci1icmFuZFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5uYXZDb2xsYXBzZSgpXCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7Y3Vyc29yOiBwb2ludGVyO1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm5hdlRyaWdnZXJcIj5cbiAgICAgICAgPGk+PC9pPjxpPjwvaT48aT48L2k+XG4gICAgICA8L2Rpdj5cbiAgICA8L2E+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2bnQpIHtcbiAgICAgICAgICAgIGlmKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnY2xhc3MnKXtcbiAgICAgICAgICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICAgIGlzQ29sbGFwc2VkID8gJGVsZW1lbnQuZmluZCgnZGl2Lm5hdlRyaWdnZXInKS5hZGRDbGFzcygnYWN0aXZlJykgOiAkZWxlbWVudC5maW5kKCdkaXYubmF2VHJpZ2dlcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH1cblxuICAgICAgY3RybC5uYXZDb2xsYXBzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKVxuICAgICAgICAgIC5jbGFzc0xpc3QudG9nZ2xlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2bnQpIHtcbiAgICAgICAgICAgICAgaWYoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpe1xuICAgICAgICAgICAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGV2bnQubmV3VmFsdWUuaW5kZXhPZignY29sbGFwc2VkJykgIT0gLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7XG4iLCJpbXBvcnQgTWVudSAgICAgICAgIGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnO1xuaW1wb3J0IE1lbnVTaHJpbmsgICAgICAgICBmcm9tICcuL21lbnUtc2hyaW5rL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgR21kTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgU2VsZWN0ICAgICAgIGZyb20gJy4vc2VsZWN0L2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgU2VsZWN0U2VhcmNoICAgICAgIGZyb20gJy4vc2VsZWN0L3NlYXJjaC9jb21wb25lbnQuanMnO1xuaW1wb3J0IE9wdGlvbiAgICAgICBmcm9tICcuL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzJztcbmltcG9ydCBPcHRpb25FbXB0eSAgICAgICBmcm9tICcuL3NlbGVjdC9lbXB0eS9jb21wb25lbnQuanMnO1xuaW1wb3J0IElucHV0ICAgICAgICBmcm9tICcuL2lucHV0L2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgRmFiICAgICAgICAgIGZyb20gJy4vZmFiL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgU3Bpbm5lciAgICAgIGZyb20gJy4vc3Bpbm5lci9jb21wb25lbnQuanMnO1xuaW1wb3J0IEhhbWJ1cmdlciAgICAgIGZyb20gJy4vaGFtYnVyZ2VyL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgQWxlcnQgICAgICBmcm9tICcuL2FsZXJ0L3Byb3ZpZGVyLmpzJztcbmltcG9ydCBUaGVtZSAgICAgIGZyb20gJy4vdGhlbWUvcHJvdmlkZXIuanMnO1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAucHJvdmlkZXIoJyRnbWRBbGVydCcsIEFsZXJ0KVxuICAucHJvdmlkZXIoJyRnbWRUaGVtZScsIFRoZW1lKVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBSaXBwbGUpXG4gIC5jb21wb25lbnQoJ2dsTWVudScsIE1lbnUpXG4gIC5jb21wb25lbnQoJ21lbnVTaHJpbmsnLCBNZW51U2hyaW5rKVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIEdtZE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3RTZWFyY2gnLCBTZWxlY3RTZWFyY2gpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbkVtcHR5JywgT3B0aW9uRW1wdHkpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbicsIE9wdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kSW5wdXQnLCBJbnB1dClcbiAgLmNvbXBvbmVudCgnZ21kRmFiJywgRmFiKVxuICAuY29tcG9uZW50KCdnbWRTcGlubmVyJywgU3Bpbm5lcilcbiAgLmNvbXBvbmVudCgnZ21kSGFtYnVyZ2VyJywgSGFtYnVyZ2VyKVxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IG5nLXRyYW5zY2x1ZGU+PC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcyxcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIG1vZGVsO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgbGV0IGNoYW5nZUFjdGl2ZSA9IHRhcmdldCA9PiB7XG4gICAgICAgIGlmICh0YXJnZXQudmFsdWUpIHtcbiAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgICAgaWYgKGlucHV0ICYmIGlucHV0WzBdKSBjaGFuZ2VBY3RpdmUoaW5wdXRbMF0pXG4gICAgICB9XG4gICAgICBjdHJsLiRwb3N0TGluayA9ICgpID0+IHtcbiAgICAgICAgbGV0IGdtZElucHV0ID0gJGVsZW1lbnQuZmluZCgnaW5wdXQnKTtcbiAgICAgICAgaWYoZ21kSW5wdXRbMF0pe1xuICAgICAgICAgIGlucHV0ID0gYW5ndWxhci5lbGVtZW50KGdtZElucHV0KVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudC5maW5kKCd0ZXh0YXJlYScpKTtcbiAgICAgICAgfVxuICAgICAgICBtb2RlbCA9IGlucHV0LmF0dHIoJ25nLW1vZGVsJykgfHwgaW5wdXQuYXR0cignZGF0YS1uZy1tb2RlbCcpO1xuICAgICAgfVxuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICBiaW5kaW5nczoge1xuICAgICAgICBtZW51OiAnPCcsXG4gICAgICAgIGtleXM6ICc8JyxcbiAgICAgICAgbG9nbzogJ0A/JyxcbiAgICAgICAgbGFyZ2VMb2dvOiAnQD8nLFxuICAgICAgICBzbWFsbExvZ286ICdAPycsXG4gICAgICAgIGhpZGVTZWFyY2g6ICc9PycsXG4gICAgICAgIGlzT3BlbmVkOiAnPT8nLFxuICAgICAgICBpY29uRmlyc3RMZXZlbDogJ0A/JyxcbiAgICAgICAgc2hvd0J1dHRvbkZpcnN0TGV2ZWw6ICc9PycsXG4gICAgICAgIHRleHRGaXJzdExldmVsOiAnQD8nLFxuICAgICAgICBpdGVtRGlzYWJsZWQ6ICcmPydcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBgXG5cbiAgICA8bmF2IGNsYXNzPVwibWFpbi1tZW51XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtZW51LWhlYWRlclwiPlxuICAgICAgICAgICAgPGltZyBuZy1pbml0PVwiJGN0cmwub2JzZXJ2ZUVycm9yKClcIiBuZy1pZj1cIiRjdHJsLmxvZ29cIiBuZy1zcmM9XCJ7eyRjdHJsLmxvZ299fVwiLz5cbiAgICAgICAgICAgIDxpbWcgbmctaW5pdD1cIiRjdHJsLm9ic2VydmVFcnJvcigpXCIgY2xhc3M9XCJsYXJnZVwiIG5nLWlmPVwiJGN0cmwubGFyZ2VMb2dvXCIgbmctc3JjPVwie3skY3RybC5sYXJnZUxvZ299fVwiLz5cbiAgICAgICAgICAgIDxpbWcgbmctaW5pdD1cIiRjdHJsLm9ic2VydmVFcnJvcigpXCIgY2xhc3M9XCJzbWFsbFwiIG5nLWlmPVwiJGN0cmwuc21hbGxMb2dvXCIgbmctc3JjPVwie3skY3RybC5zbWFsbExvZ299fVwiLz5cblxuICAgICAgICAgICAgPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgbmctY2xpY2s9XCIkY3RybC50b2dnbGVNZW51KClcIiBpZD1cIkNhcGFfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXG4gICAgICAgICAgICAgICAgd2lkdGg9XCI2MTMuNDA4cHhcIiBoZWlnaHQ9XCI2MTMuNDA4cHhcIiB2aWV3Qm94PVwiMCAwIDYxMy40MDggNjEzLjQwOFwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG4gICAgICAgICAgICAgICAgPGc+XG4gICAgICAgICAgICAgICAgPHBhdGggZD1cIk02MDUuMjU0LDE2OC45NEw0NDMuNzkyLDcuNDU3Yy02LjkyNC02Ljg4Mi0xNy4xMDItOS4yMzktMjYuMzE5LTYuMDY5Yy05LjE3NywzLjEyOC0xNS44MDksMTEuMjQxLTE3LjAxOSwyMC44NTVcbiAgICAgICAgICAgICAgICAgICAgbC05LjA5Myw3MC41MTJMMjY3LjU4NSwyMTYuNDI4aC0xNDIuNjVjLTEwLjM0NCwwLTE5LjYyNSw2LjIxNS0yMy42MjksMTUuNzQ2Yy0zLjkyLDkuNTczLTEuNzEsMjAuNTIyLDUuNTg5LDI3Ljc3OVxuICAgICAgICAgICAgICAgICAgICBsMTA1LjQyNCwxMDUuNDAzTDAuNjk5LDYxMy40MDhsMjQ2LjYzNS0yMTIuODY5bDEwNS40MjMsMTA1LjQwMmM0Ljg4MSw0Ljg4MSwxMS40NSw3LjQ2NywxNy45OTksNy40NjdcbiAgICAgICAgICAgICAgICAgICAgYzMuMjk1LDAsNi42MzItMC43MDksOS43OC0yLjAwMmM5LjU3My0zLjkyMiwxNS43MjYtMTMuMjQ0LDE1LjcyNi0yMy41MDRWMzQ1LjE2OGwxMjMuODM5LTEyMy43MTRsNzAuNDI5LTkuMTc2XG4gICAgICAgICAgICAgICAgICAgIGM5LjYxNC0xLjI1MSwxNy43MjctNy44NjIsMjAuODEzLTE3LjAzOUM2MTQuNDcyLDE4Ni4wMjEsNjEyLjEzNiwxNzUuODAxLDYwNS4yNTQsMTY4Ljk0eiBNNTA0Ljg1NiwxNzEuOTg1XG4gICAgICAgICAgICAgICAgICAgIGMtNS41NjgsMC43NTEtMTAuNzYyLDMuMjMyLTE0Ljc0NSw3LjIzN0wzNTIuNzU4LDMxNi41OTZjLTQuNzk2LDQuNzc1LTcuNDY2LDExLjI0Mi03LjQ2NiwxOC4wNDF2OTEuNzQyTDE4Ni40MzcsMjY3LjQ4MWg5MS42OFxuICAgICAgICAgICAgICAgICAgICBjNi43NTcsMCwxMy4yNDMtMi42NjksMTguMDQtNy40NjZMNDMzLjUxLDEyMi43NjZjMy45ODMtMy45ODMsNi41NjktOS4xNzYsNy4yNTgtMTQuNzg2bDMuNjI5LTI3LjY5Nmw4OC4xNTUsODguMTE0XG4gICAgICAgICAgICAgICAgICAgIEw1MDQuODU2LDE3MS45ODV6XCIvPlxuICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgIDwvc3ZnPlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic2Nyb2xsYmFyIHN0eWxlLTFcIj5cbiAgICAgICAgICAgIDx1bCBkYXRhLW5nLWNsYXNzPVwiJ2xldmVsJy5jb25jYXQoJGN0cmwuYmFjay5sZW5ndGgpXCI+XG5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJnb2JhY2sgZ21kIGdtZC1yaXBwbGVcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5wcmV2aW91cy5sZW5ndGggPiAwXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnByZXYoKVwiPlxuICAgICAgICAgICAgICAgICAgICA8YT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19sZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC5iYWNrWyRjdHJsLmJhY2subGVuZ3RoIC0gMV0ubGFiZWxcIiBjbGFzcz1cIm5hdi10ZXh0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9saT5cblxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImdtZC1yaXBwbGVcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLW5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwubWVudSB8IGZpbHRlcjokY3RybC5zZWFyY2hcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLW5nLXNob3c9XCIkY3RybC5hbGxvdyhpdGVtKVwiXG4gICAgICAgICAgICAgICAgICAgIGRhdGEtbmctY2xpY2s9XCIkY3RybC5uZXh0KGl0ZW0sICRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLW5nLWNsYXNzPVwiWyEkY3RybC5kaXNhYmxlQW5pbWF0aW9ucyA/ICRjdHJsLnNsaWRlIDogJycsIHsnZGlzYWJsZWQnOiAkY3RybC5pdGVtRGlzYWJsZWQoe2l0ZW06IGl0ZW19KX0sIHtoZWFkZXI6IGl0ZW0udHlwZSA9PSAnaGVhZGVyJywgZGl2aWRlcjogaXRlbS50eXBlID09ICdzZXBhcmF0b3InfV1cIj5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmIGl0ZW0uc3RhdGVcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtdGV4dFwiIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW4gJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+a2V5Ym9hcmRfYXJyb3dfcmlnaHQ8L2k+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cblxuICAgICAgICAgICAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiAhaXRlbS5zdGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uaWNvblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIiBkYXRhLW5nLWJpbmQ9XCJpdGVtLmljb25cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5hdi10ZXh0XCIgbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlbiAmJiBpdGVtLmNoaWxkcmVuLmxlbmd0aCA+IDBcIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5rZXlib2FyZF9hcnJvd19yaWdodDwvaT5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuXG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG5cbiAgICAgICAgICAgIDxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT5cblxuICAgICAgICA8L2Rpdj5cbiAgICA8L25hdj5cbiAgICBcbiAgICBgLFxuICAgIGNvbnRyb2xsZXI6IFsnJHRpbWVvdXQnLCAnJGF0dHJzJywgJyRlbGVtZW50JywgZnVuY3Rpb24gKCR0aW1lb3V0LCAkYXR0cnMsICRlbGVtZW50KSB7XG4gICAgICAgIGxldCBjdHJsID0gdGhpcztcbiAgICAgICAgY3RybC5rZXlzID0gY3RybC5rZXlzIHx8IFtdO1xuICAgICAgICBjdHJsLmljb25GaXJzdExldmVsID0gY3RybC5pY29uRmlyc3RMZXZlbCB8fCAnZ2x5cGhpY29uIGdseXBoaWNvbi1ob21lJztcbiAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdO1xuICAgICAgICBjdHJsLmJhY2sgPSBbXTtcbiAgICAgICAgbGV0IG1haW5Db250ZW50LCBoZWFkZXJDb250ZW50O1xuXG4gICAgICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgICAgICAgIG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICAgICAgICBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgICAgIGlmKGV2YWwoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZ21kLW1lbnUtc2hyaW5rJykpKXtcbiAgICAgICAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcbiAgICAgICAgfTtcblxuICAgICAgICBjdHJsLm9ic2VydmVFcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaW1nID0gJGVsZW1lbnQuZmluZCgnaW1nJyk7XG4gICAgICAgICAgICAgICAgaW1nLmJpbmQoJ2Vycm9yJywgKCkgPT4gaW1nLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSkpO1xuICAgICAgICAgICAgICAgIGltZy5iaW5kKCdsb2FkJywgICgpID0+IGltZy5jc3MoeydkaXNwbGF5JyA6ICdibG9jayd9KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN0cmwudG9nZ2xlTWVudSA9ICgpID0+IHtcbiAgICAgICAgICAgICRlbGVtZW50LnRvZ2dsZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZ21kLW1lbnUtc2hyaW5rJywgJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZpeGVkJykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwucHJldiA9ICgpID0+IHtcbiAgICAgICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXMucG9wKCk7XG4gICAgICAgICAgICBjdHJsLmJhY2sucG9wKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5uZXh0ID0gKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpO1xuICAgICAgICAgICAgICAgIGN0cmwubWVudSA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgY3RybC5iYWNrLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwgPSAoKSA9PiB7XG4gICAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzWzBdO1xuICAgICAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdO1xuICAgICAgICAgICAgY3RybC5iYWNrID0gW107XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5hbGxvdyA9IGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGN0cmwua2V5cyAmJiBjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICghaXRlbS5rZXkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5kZXhPZihpdGVtLmtleSkgPiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1dXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7IiwicmVxdWlyZSgnLi4vYXR0cmNoYW5nZS9hdHRyY2hhbmdlJyk7XG5cbmxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbWVudTogJzwnLFxuICAgIGtleXM6ICc8JyxcbiAgICBoaWRlU2VhcmNoOiAnPT8nLFxuICAgIGlzT3BlbmVkOiAnPT8nLFxuICAgIGljb25GaXJzdExldmVsOiAnQD8nLFxuICAgIHNob3dCdXR0b25GaXJzdExldmVsOiAnPT8nLFxuICAgIHRleHRGaXJzdExldmVsOiAnQD8nLFxuICAgIGRpc2FibGVBbmltYXRpb25zOiAnPT8nLFxuICAgIHNocmlua01vZGU6ICc9PydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcblxuICAgIDxkaXYgc3R5bGU9XCJwYWRkaW5nOiAxNXB4IDE1cHggMHB4IDE1cHg7XCIgbmctaWY9XCIhJGN0cmwuaGlkZVNlYXJjaFwiPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1uZy1tb2RlbD1cIiRjdHJsLnNlYXJjaFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGdtZFwiIHBsYWNlaG9sZGVyPVwiQnVzY2EuLi5cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJiYXJcIj48L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLWJsb2NrIGdtZFwiIGRhdGEtbmctaWY9XCIkY3RybC5zaG93QnV0dG9uRmlyc3RMZXZlbFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwoKVwiIGRhdGEtbmctZGlzYWJsZWQ9XCIhJGN0cmwucHJldmlvdXMubGVuZ3RoXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgPGkgZGF0YS1uZy1jbGFzcz1cIlskY3RybC5pY29uRmlyc3RMZXZlbF1cIj48L2k+XG4gICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC50ZXh0Rmlyc3RMZXZlbFwiPjwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDx1bCBtZW51IGRhdGEtbmctY2xhc3M9XCInbGV2ZWwnLmNvbmNhdCgkY3RybC5iYWNrLmxlbmd0aClcIj5cbiAgICAgIDxsaSBjbGFzcz1cImdvYmFjayBnbWQgZ21kLXJpcHBsZVwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnByZXZpb3VzLmxlbmd0aCA+IDBcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwucHJldigpXCI+XG4gICAgICAgIDxhPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5cbiAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X2xlZnRcbiAgICAgICAgICA8L2k+XG4gICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuXG4gICAgICA8bGkgY2xhc3M9XCJnbWQgZ21kLXJpcHBsZVwiIFxuICAgICAgICAgIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5tZW51IHwgZmlsdGVyOiRjdHJsLnNlYXJjaFwiXG4gICAgICAgICAgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIlxuICAgICAgICAgIG5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtLCAkZXZlbnQpXCJcbiAgICAgICAgICBkYXRhLW5nLWNsYXNzPVwiWyEkY3RybC5kaXNhYmxlQW5pbWF0aW9ucyA/ICRjdHJsLnNsaWRlIDogJycsIHtoZWFkZXI6IGl0ZW0udHlwZSA9PSAnaGVhZGVyJywgZGl2aWRlcjogaXRlbS50eXBlID09ICdzZXBhcmF0b3InfV1cIj5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmIGl0ZW0uc3RhdGVcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgIDwvYT5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmICFpdGVtLnN0YXRlXCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT5cblxuICAgIDx1bCBjbGFzcz1cImdsLW1lbnUtY2hldnJvblwiIG5nLWlmPVwiJGN0cmwuc2hyaW5rTW9kZSAmJiAhJGN0cmwuZml4ZWRcIiBuZy1jbGljaz1cIiRjdHJsLm9wZW5NZW51U2hyaW5rKClcIj5cbiAgICAgIDxsaT5cbiAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmNoZXZyb25fbGVmdDwvaT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDx1bCBjbGFzcz1cImdsLW1lbnUtY2hldnJvbiB1bmZpeGVkXCIgbmctaWY9XCIkY3RybC5zaHJpbmtNb2RlICYmICRjdHJsLmZpeGVkXCI+XG4gICAgICA8bGkgbmctY2xpY2s9XCIkY3RybC51bmZpeGVkTWVudVNocmluaygpXCI+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5jaGV2cm9uX2xlZnQ8L2k+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8dWwgY2xhc3M9XCJnbC1tZW51LWNoZXZyb24gcG9zc2libHlGaXhlZFwiIG5nLWlmPVwiJGN0cmwucG9zc2libHlGaXhlZFwiPlxuICAgICAgPGxpIG5nLWNsaWNrPVwiJGN0cmwuZml4ZWRNZW51U2hyaW5rKClcIiBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwiZGlzcGxheTogZmxleDsganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcIj5cbiAgICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiQ2FwYV8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcbiAgICAgICAgICAgIHdpZHRoPVwiNjEzLjQwOHB4XCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHBvc2l0aW9uOiByZWxhdGl2ZTsgaGVpZ2h0OiAxZW07IHdpZHRoOiAzZW07IGZvbnQtc2l6ZTogMS4zM2VtOyBwYWRkaW5nOiAwOyBtYXJnaW46IDA7O1wiICBoZWlnaHQ9XCI2MTMuNDA4cHhcIiB2aWV3Qm94PVwiMCAwIDYxMy40MDggNjEzLjQwOFwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MTMuNDA4IDYxMy40MDg7XCJcbiAgICAgICAgICAgIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG4gICAgICAgIDxnPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNjA1LjI1NCwxNjguOTRMNDQzLjc5Miw3LjQ1N2MtNi45MjQtNi44ODItMTcuMTAyLTkuMjM5LTI2LjMxOS02LjA2OWMtOS4xNzcsMy4xMjgtMTUuODA5LDExLjI0MS0xNy4wMTksMjAuODU1XG4gICAgICAgICAgICBsLTkuMDkzLDcwLjUxMkwyNjcuNTg1LDIxNi40MjhoLTE0Mi42NWMtMTAuMzQ0LDAtMTkuNjI1LDYuMjE1LTIzLjYyOSwxNS43NDZjLTMuOTIsOS41NzMtMS43MSwyMC41MjIsNS41ODksMjcuNzc5XG4gICAgICAgICAgICBsMTA1LjQyNCwxMDUuNDAzTDAuNjk5LDYxMy40MDhsMjQ2LjYzNS0yMTIuODY5bDEwNS40MjMsMTA1LjQwMmM0Ljg4MSw0Ljg4MSwxMS40NSw3LjQ2NywxNy45OTksNy40NjdcbiAgICAgICAgICAgIGMzLjI5NSwwLDYuNjMyLTAuNzA5LDkuNzgtMi4wMDJjOS41NzMtMy45MjIsMTUuNzI2LTEzLjI0NCwxNS43MjYtMjMuNTA0VjM0NS4xNjhsMTIzLjgzOS0xMjMuNzE0bDcwLjQyOS05LjE3NlxuICAgICAgICAgICAgYzkuNjE0LTEuMjUxLDE3LjcyNy03Ljg2MiwyMC44MTMtMTcuMDM5QzYxNC40NzIsMTg2LjAyMSw2MTIuMTM2LDE3NS44MDEsNjA1LjI1NCwxNjguOTR6IE01MDQuODU2LDE3MS45ODVcbiAgICAgICAgICAgIGMtNS41NjgsMC43NTEtMTAuNzYyLDMuMjMyLTE0Ljc0NSw3LjIzN0wzNTIuNzU4LDMxNi41OTZjLTQuNzk2LDQuNzc1LTcuNDY2LDExLjI0Mi03LjQ2NiwxOC4wNDF2OTEuNzQyTDE4Ni40MzcsMjY3LjQ4MWg5MS42OFxuICAgICAgICAgICAgYzYuNzU3LDAsMTMuMjQzLTIuNjY5LDE4LjA0LTcuNDY2TDQzMy41MSwxMjIuNzY2YzMuOTgzLTMuOTgzLDYuNTY5LTkuMTc2LDcuMjU4LTE0Ljc4NmwzLjYyOS0yNy42OTZsODguMTU1LDg4LjExNFxuICAgICAgICAgICAgTDUwNC44NTYsMTcxLjk4NXpcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckdGltZW91dCcsICckYXR0cnMnLCAnJGVsZW1lbnQnLCBmdW5jdGlvbiAoJHRpbWVvdXQsICRhdHRycywgJGVsZW1lbnQpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW107XG4gICAgY3RybC5pY29uRmlyc3RMZXZlbCA9IGN0cmwuaWNvbkZpcnN0TGV2ZWwgfHwgJ2dseXBoaWNvbiBnbHlwaGljb24taG9tZSc7XG4gICAgY3RybC5wcmV2aW91cyA9IFtdO1xuICAgIGN0cmwuYmFjayA9IFtdO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5kaXNhYmxlQW5pbWF0aW9ucyA9IGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgfHwgZmFsc2U7XG5cbiAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcblxuICAgICAgY29uc3Qgc3RyaW5nVG9Cb29sZWFuID0gKHN0cmluZykgPT4ge1xuICAgICAgICBzd2l0Y2ggKHN0cmluZy50b0xvd2VyQ2FzZSgpLnRyaW0oKSkge1xuICAgICAgICAgIGNhc2UgXCJ0cnVlXCI6IGNhc2UgXCJ5ZXNcIjogY2FzZSBcIjFcIjogcmV0dXJuIHRydWU7XG4gICAgICAgICAgY2FzZSBcImZhbHNlXCI6IGNhc2UgXCJub1wiOiBjYXNlIFwiMFwiOiBjYXNlIG51bGw6IHJldHVybiBmYWxzZTtcbiAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gQm9vbGVhbihzdHJpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN0cmwuZml4ZWQgPSBzdHJpbmdUb0Jvb2xlYW4oJGF0dHJzLmZpeGVkIHx8ICdmYWxzZScpO1xuICAgICAgY3RybC5maXhlZE1haW4gPSBzdHJpbmdUb0Jvb2xlYW4oJGF0dHJzLmZpeGVkTWFpbiB8fCAnZmFsc2UnKTtcblxuICAgICAgaWYgKGN0cmwuZml4ZWRNYWluKSB7XG4gICAgICAgIGN0cmwuZml4ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbkJhY2tkcm9wQ2xpY2sgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGlmKGN0cmwuc2hyaW5rTW9kZSl7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5hZGRDbGFzcygnY2xvc2VkJyk7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgICAgIGlmICghY3RybC5maXhlZCB8fCBjdHJsLnNocmlua01vZGUpIHtcbiAgICAgICAgICBsZXQgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgZWxtLmNsYXNzTGlzdC5hZGQoJ2dtZC1tZW51LWJhY2tkcm9wJyk7XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpWzBdLmFwcGVuZENoaWxkKGVsbSk7IFxuICAgICAgICAgIH1cbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLm9uKCdjbGljaycsIG9uQmFja2Ryb3BDbGljayk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW5pdCgpO1xuXG4gICAgICBjb25zdCBzZXRNZW51VG9wID0gKCkgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGV0IHNpemUgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpLmhlaWdodCgpO1xuICAgICAgICAgIGlmIChzaXplID09IDApIHNldE1lbnVUb3AoKTtcbiAgICAgICAgICBpZiAoY3RybC5maXhlZCkgc2l6ZSA9IDA7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYuY29sbGFwc2VkJykuY3NzKHtcbiAgICAgICAgICAgIHRvcDogc2l6ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY3RybC50b2dnbGVDb250ZW50ID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoY3RybC5maXhlZCkge1xuICAgICAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICAgICAgaWYgKGlzQ29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgIGhlYWRlckNvbnRlbnQucmVhZHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldE1lbnVUb3AoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpc0NvbGxhcHNlZCA/IG1haW5Db250ZW50LmFkZENsYXNzKCdjb2xsYXBzZWQnKSA6IG1haW5Db250ZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIGlmICghY3RybC5maXhlZE1haW4gJiYgY3RybC5maXhlZCkge1xuICAgICAgICAgICAgICBpc0NvbGxhcHNlZCA/IGhlYWRlckNvbnRlbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpIDogaGVhZGVyQ29udGVudC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2ZXJpZnlCYWNrZHJvcCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpO1xuICAgICAgICBpZiAoaXNDb2xsYXBzZWQgJiYgIWN0cmwuZml4ZWQpIHtcbiAgICAgICAgICBiYWNrQ29udGVudC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgbGV0IHNpemUgPSBoZWFkZXJDb250ZW50LmhlaWdodCgpO1xuICAgICAgICAgIGlmIChzaXplID4gMCAmJiAhY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgICAgICBiYWNrQ29udGVudC5jc3MoeyB0b3A6IHNpemUgfSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBiYWNrQ29udGVudC5jc3MoeyB0b3A6IDAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhY2tDb250ZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICAkdGltZW91dCgoKSA9PiBjdHJsLmlzT3BlbmVkID0gaXNDb2xsYXBzZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICBjb25zdCBuYXZDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKTtcbiAgICAgICAgbWFpbkNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgaGVhZGVyQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICBuYXZDb250ZW50LmNzcyh7ICd6LWluZGV4JzogJzEwMDYnfSk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYWRkQ2xhc3MoJ2Nsb3NlZCBjb2xsYXBzZWQnKTtcbiAgICAgICAgdmVyaWZ5QmFja2Ryb3AoIWFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjbG9zZWQnKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZSkge1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoZXZudCkge1xuICAgICAgICAgICAgaWYgKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgIGlmKGN0cmwuc2hyaW5rTW9kZSl7XG4gICAgICAgICAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjbG9zZWQnKSA9PSAtMTtcbiAgICAgICAgICAgICAgICB2ZXJpZnlCYWNrZHJvcChjdHJsLnBvc3NpYmx5Rml4ZWQpO1xuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgICAgdmVyaWZ5QmFja2Ryb3AoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWN0cmwuc2hyaW5rTW9kZSkge1xuICAgICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgICAgIHZlcmlmeUJhY2tkcm9wKGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIWN0cmwuaGFzT3duUHJvcGVydHkoJ3Nob3dCdXR0b25GaXJzdExldmVsJykpIHtcbiAgICAgICAgICBjdHJsLnNob3dCdXR0b25GaXJzdExldmVsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnO1xuICAgICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXMucG9wKCk7XG4gICAgICAgICAgY3RybC5iYWNrLnBvcCgpO1xuICAgICAgICB9LCAyNTApO1xuICAgICAgfVxuXG4gICAgICBjdHJsLm5leHQgPSAoaXRlbSkgPT4ge1xuICAgICAgICBsZXQgbmF2ID0gYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JylbMF07XG4gICAgICAgIGlmIChjdHJsLnNocmlua01vZGUgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnY2xvc2VkJykgJiYgaXRlbS5jaGlsZHJlbiAmJiBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLmlzKCdbb3Blbi1vbi1ob3Zlcl0nKSkge1xuICAgICAgICAgIGN0cmwub3Blbk1lbnVTaHJpbmsoKTtcbiAgICAgICAgICBjdHJsLm5leHQoaXRlbSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1yaWdodCc7XG4gICAgICAgICAgICBjdHJsLnByZXZpb3VzLnB1c2goY3RybC5tZW51KTtcbiAgICAgICAgICAgIGN0cmwubWVudSA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgICBjdHJsLmJhY2sucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDI1MCk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXNbMF1cbiAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICAgIGN0cmwuYmFjayA9IFtdXG4gICAgICB9XG5cbiAgICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgICAgaWYgKGN0cmwua2V5cyAmJiBjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGlmICghaXRlbS5rZXkpIHJldHVybiB0cnVlXG4gICAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmRleE9mKGl0ZW0ua2V5KSA+IC0xXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcblxuICAgICAgY3RybC5vcGVuTWVudVNocmluayA9ICgpID0+IHtcbiAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gdHJ1ZTsgXG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLmZpeGVkTWVudVNocmluayA9ICgpID0+IHtcbiAgICAgICAgJGVsZW1lbnQuYXR0cignZml4ZWQnLCB0cnVlKTtcbiAgICAgICAgY3RybC5maXhlZCA9IHRydWU7XG4gICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IGZhbHNlO1xuICAgICAgICBpbml0KCk7XG4gICAgICAgIG1haW5Db250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJyd9KTtcbiAgICAgICAgaGVhZGVyQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICcnfSk7XG4gICAgICAgIGN0cmwudG9nZ2xlQ29udGVudCh0cnVlKTtcbiAgICAgICAgdmVyaWZ5QmFja2Ryb3AodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudW5maXhlZE1lbnVTaHJpbmsgPSAoKSA9PiB7XG4gICAgICAgICRlbGVtZW50LmF0dHIoJ2ZpeGVkJywgZmFsc2UpO1xuICAgICAgICBjdHJsLmZpeGVkID0gZmFsc2U7XG4gICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IHRydWU7XG4gICAgICAgIGluaXQoKTtcbiAgICAgICAgbWFpbkNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgaGVhZGVyQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcCh0cnVlKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5hZGRDbGFzcygnY2xvc2VkJyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGljb246ICdAJyxcbiAgICBub3RpZmljYXRpb25zOiAnPScsXG4gICAgb25WaWV3OiAnJj8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0IG5vdGlmaWNhdGlvbnNcIj5cbiAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgYmFkZ2U9XCJ7eyRjdHJsLm5vdGlmaWNhdGlvbnMubGVuZ3RofX1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuaWNvblwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ub3RpZmljYXRpb25zXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnZpZXcoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLW9iamVjdFwiIGRhdGEtbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1ib2R5XCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwudmlldyA9IChldmVudCwgaXRlbSkgPT4gY3RybC5vblZpZXcoe2V2ZW50OiBldmVudCwgaXRlbTogaXRlbX0pXG4gICAgfVxuICAgIFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQycsXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgaWYoIWVsZW1lbnRbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaXhlZCcpKXtcbiAgICAgICAgZWxlbWVudFswXS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVSaXBwbGUoZXZ0KSB7XG4gICAgICAgIHZhciByaXBwbGUgPSBhbmd1bGFyLmVsZW1lbnQoJzxzcGFuIGNsYXNzPVwiZ21kLXJpcHBsZS1lZmZlY3QgYW5pbWF0ZVwiPicpLFxuICAgICAgICAgIHJlY3QgPSBlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHJlY3QuaGVpZ2h0LCByZWN0LndpZHRoKSxcbiAgICAgICAgICBsZWZ0ID0gZXZ0LnBhZ2VYIC0gcmVjdC5sZWZ0IC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcbiAgICAgICAgICB0b3AgPSBldnQucGFnZVkgLSByZWN0LnRvcCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblxuICAgICAgICByaXBwbGVbMF0uc3R5bGUud2lkdGggPSByaXBwbGVbMF0uc3R5bGUuaGVpZ2h0ID0gcmFkaXVzICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIHJpcHBsZS5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5hcHBlbmQocmlwcGxlKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5iaW5kKCdtb3VzZWRvd24nLCBjcmVhdGVSaXBwbGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsICduZ1JlcXVpcmVkJ10sXG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdNb2RlbDogJz0nLFxuICAgIG5nRGlzYWJsZWQ6ICc9PycsXG4gICAgdW5zZWxlY3Q6ICdAPycsXG4gICAgb3B0aW9uczogJzwnLFxuICAgIG9wdGlvbjogJ0AnLFxuICAgIHZhbHVlOiAnQCcsXG4gICAgcGxhY2Vob2xkZXI6ICdAPycsXG4gICAgb25DaGFuZ2U6IFwiJj9cIixcbiAgICB0cmFuc2xhdGVMYWJlbDogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24gZ21kXCI+XG4gICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZmxvYXRpbmctZHJvcGRvd25cIiBuZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIj5cbiAgICAgIHt7JGN0cmwucGxhY2Vob2xkZXJ9fSA8c3BhbiBuZy1pZj1cIiRjdHJsLnZhbGlkYXRlR3VtZ2FFcnJvclwiIG5nLWNsYXNzPVwieydnbWQtc2VsZWN0LXJlcXVpcmVkJzogJGN0cmwubmdNb2RlbEN0cmwuJGVycm9yLnJlcXVpcmVkfVwiPio8c3Bhbj5cbiAgICAgPC9sYWJlbD5cbiAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBnbWQgZHJvcGRvd24tdG9nZ2xlIGdtZC1zZWxlY3QtYnV0dG9uXCJcbiAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICBzdHlsZT1cImJvcmRlci1yYWRpdXM6IDA7XCJcbiAgICAgICAgICAgICBpZD1cImdtZFNlbGVjdFwiXG4gICAgICAgICAgICAgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXG4gICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCIkY3RybC5uZ0Rpc2FibGVkXCJcbiAgICAgICAgICAgICBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiXG4gICAgICAgICAgICAgYXJpYS1leHBhbmRlZD1cInRydWVcIj5cbiAgICAgICA8c3BhbiBjbGFzcz1cIml0ZW0tc2VsZWN0XCIgbmctaWY9XCIhJGN0cmwudHJhbnNsYXRlTGFiZWxcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiIGRhdGEtbmctYmluZD1cIiRjdHJsLnNlbGVjdGVkXCI+PC9zcGFuPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBuZy1pZj1cIiRjdHJsLnRyYW5zbGF0ZUxhYmVsXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwuc2VsZWN0ZWRcIj5cbiAgICAgICAgICB7eyAkY3RybC5zZWxlY3RlZCB8IGd1bWdhVHJhbnNsYXRlIH19XG4gICAgICAgPC9zcGFuPlxuICAgICAgIDxzcGFuIGRhdGEtbmctaGlkZT1cIiRjdHJsLnNlbGVjdGVkXCIgY2xhc3M9XCJpdGVtLXNlbGVjdCBwbGFjZWhvbGRlclwiPlxuICAgICAgICB7eyRjdHJsLnBsYWNlaG9sZGVyfX1cbiAgICAgICA8L3NwYW4+XG4gICAgICAgPHNwYW4gbmctaWY9XCIkY3RybC5uZ01vZGVsQ3RybC4kZXJyb3IucmVxdWlyZWQgJiYgJGN0cmwudmFsaWRhdGVHdW1nYUVycm9yXCIgY2xhc3M9XCJ3b3JkLXJlcXVpcmVkXCI+Kjwvc3Bhbj5cbiAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPlxuICAgICA8L2J1dHRvbj5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiIGFyaWEtbGFiZWxsZWRieT1cImdtZFNlbGVjdFwiIG5nLXNob3c9XCIkY3RybC5vcHRpb25cIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XG4gICAgICAgPGxpIGRhdGEtbmctY2xpY2s9XCIkY3RybC5jbGVhcigpXCIgbmctaWY9XCIkY3RybC51bnNlbGVjdFwiPlxuICAgICAgICAgPGEgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6IGZhbHNlfVwiPnt7JGN0cmwudW5zZWxlY3R9fTwvYT5cbiAgICAgICA8L2xpPlxuICAgICAgIDxsaSBkYXRhLW5nLXJlcGVhdD1cIm9wdGlvbiBpbiAkY3RybC5vcHRpb25zIHRyYWNrIGJ5ICRpbmRleFwiPlxuICAgICAgICAgPGEgY2xhc3M9XCJzZWxlY3Qtb3B0aW9uXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnNlbGVjdChvcHRpb24pXCIgZGF0YS1uZy1iaW5kPVwib3B0aW9uWyRjdHJsLm9wdGlvbl0gfHwgb3B0aW9uXCIgZGF0YS1uZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLmlzQWN0aXZlKG9wdGlvbil9XCI+PC9hPlxuICAgICAgIDwvbGk+XG4gICAgIDwvdWw+XG4gICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZ21kXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctc2hvdz1cIiEkY3RybC5vcHRpb25cIiBzdHlsZT1cIm1heC1oZWlnaHQ6IDI1MHB4O292ZXJmbG93OiBhdXRvO2Rpc3BsYXk6IG5vbmU7XCIgbmctdHJhbnNjbHVkZT48L3VsPlxuICAgPC9kaXY+XG4gIGAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRhdHRycycsICckdGltZW91dCcsICckZWxlbWVudCcsICckdHJhbnNjbHVkZScsICckY29tcGlsZScsIGZ1bmN0aW9uICgkc2NvcGUsICRhdHRycywgJHRpbWVvdXQsICRlbGVtZW50LCAkdHJhbnNjbHVkZSwgJGNvbXBpbGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICAgICwgbmdNb2RlbEN0cmwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICBsZXQgb3B0aW9ucyA9IGN0cmwub3B0aW9ucyB8fCBbXTtcblxuICAgIGN0cmwubmdNb2RlbEN0cmwgPSBuZ01vZGVsQ3RybDtcbiAgICBjdHJsLnZhbGlkYXRlR3VtZ2FFcnJvciA9ICRhdHRycy5oYXNPd25Qcm9wZXJ0eSgnZ3VtZ2FSZXF1aXJlZCcpO1xuXG4gICAgZnVuY3Rpb24gZmluZFBhcmVudEJ5TmFtZShlbG0sIHBhcmVudE5hbWUpIHtcbiAgICAgIGlmIChlbG0uY2xhc3NOYW1lID09IHBhcmVudE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGVsbTtcbiAgICAgIH1cbiAgICAgIGlmIChlbG0ucGFyZW50Tm9kZSkge1xuICAgICAgICByZXR1cm4gZmluZFBhcmVudEJ5TmFtZShlbG0ucGFyZW50Tm9kZSwgcGFyZW50TmFtZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWxtO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0KGUpIHtcbiAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgIGxldCB0YXJnZXQgPSBmaW5kUGFyZW50QnlOYW1lKGUudGFyZ2V0LCAnc2VsZWN0LW9wdGlvbicpO1xuICAgICAgaWYgKCh0YXJnZXQubm9kZU5hbWUgPT0gJ0EnICYmIHRhcmdldC5jbGFzc05hbWUgPT0gJ3NlbGVjdC1vcHRpb24nKSB8fCAoZS50YXJnZXQubm9kZU5hbWUgPT0gJ0EnICYmIGUudGFyZ2V0LmNsYXNzTmFtZSA9PSAnc2VsZWN0LW9wdGlvbicpKSB7XG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBmaW5kU2Nyb2xsRGlyZWN0aW9uT3RoZXJCcm93c2VycyhlKVxuICAgICAgICBsZXQgc2Nyb2xsVG9wID0gYW5ndWxhci5lbGVtZW50KHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpLnNjcm9sbFRvcCgpO1xuICAgICAgICBpZiAoc2Nyb2xsVG9wICsgYW5ndWxhci5lbGVtZW50KHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpLmlubmVySGVpZ2h0KCkgPj0gdGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5zY3JvbGxIZWlnaHQgJiYgZGlyZWN0aW9uICE9ICdVUCcpIHtcbiAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wIDw9IDAgJiYgZGlyZWN0aW9uICE9ICdET1dOJykge1xuICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KVxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRTY3JvbGxEaXJlY3Rpb25PdGhlckJyb3dzZXJzKGV2ZW50KSB7XG4gICAgICB2YXIgZGVsdGE7XG4gICAgICBpZiAoZXZlbnQud2hlZWxEZWx0YSkge1xuICAgICAgICBkZWx0YSA9IGV2ZW50LndoZWVsRGVsdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWx0YSA9IC0xICogZXZlbnQuZGVsdGFZO1xuICAgICAgfVxuICAgICAgaWYgKGRlbHRhIDwgMCkge1xuICAgICAgICByZXR1cm4gXCJET1dOXCI7XG4gICAgICB9IGVsc2UgaWYgKGRlbHRhID4gMCkge1xuICAgICAgICByZXR1cm4gXCJVUFwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0Rm9yU2Nyb2xsS2V5cyhlKSB7XG4gICAgICBpZiAoa2V5cyAmJiBrZXlzW2Uua2V5Q29kZV0pIHtcbiAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNhYmxlU2Nyb2xsKCkge1xuICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBwcmV2ZW50RGVmYXVsdCwgZmFsc2UpO1xuICAgICAgfVxuICAgICAgd2luZG93Lm9ud2hlZWwgPSBwcmV2ZW50RGVmYXVsdDsgLy8gbW9kZXJuIHN0YW5kYXJkXG4gICAgICB3aW5kb3cub25tb3VzZXdoZWVsID0gZG9jdW1lbnQub25tb3VzZXdoZWVsID0gcHJldmVudERlZmF1bHQ7IC8vIG9sZGVyIGJyb3dzZXJzLCBJRVxuICAgICAgd2luZG93Lm9udG91Y2htb3ZlID0gcHJldmVudERlZmF1bHQ7IC8vIG1vYmlsZVxuICAgICAgZG9jdW1lbnQub25rZXlkb3duID0gcHJldmVudERlZmF1bHRGb3JTY3JvbGxLZXlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuYWJsZVNjcm9sbCgpIHtcbiAgICAgIGlmICh3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgcHJldmVudERlZmF1bHQsIGZhbHNlKTtcbiAgICAgIHdpbmRvdy5vbm1vdXNld2hlZWwgPSBkb2N1bWVudC5vbm1vdXNld2hlZWwgPSBudWxsO1xuICAgICAgd2luZG93Lm9ud2hlZWwgPSBudWxsO1xuICAgICAgd2luZG93Lm9udG91Y2htb3ZlID0gbnVsbDtcbiAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0T2Zmc2V0ID0gZWwgPT4ge1xuICAgICAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgICAgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICBsZXQgX3ggPSAwLCBfeSA9IDA7XG4gICAgICB3aGlsZSAoZWwgJiYgIWlzTmFOKGVsLm9mZnNldExlZnQpICYmICFpc05hTihlbC5vZmZzZXRUb3ApKSB7XG4gICAgICAgIF94ICs9IGVsLm9mZnNldExlZnQgLSBlbC5zY3JvbGxMZWZ0O1xuICAgICAgICBpZiAoZWwubm9kZU5hbWUgPT0gJ0JPRFknKSB7XG4gICAgICAgICAgX3kgKz0gZWwub2Zmc2V0VG9wIC0gTWF0aC5tYXgoYW5ndWxhci5lbGVtZW50KFwiaHRtbFwiKS5zY3JvbGxUb3AoKSwgYW5ndWxhci5lbGVtZW50KFwiYm9keVwiKS5zY3JvbGxUb3AoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3kgKz0gZWwub2Zmc2V0VG9wIC0gZWwuc2Nyb2xsVG9wO1xuICAgICAgICB9XG4gICAgICAgIGVsID0gZWwub2Zmc2V0UGFyZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgdG9wOiBfeSwgbGVmdDogcmVjdC5sZWZ0ICsgc2Nyb2xsTGVmdCB9XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0RWxlbWVudE1heEhlaWdodCA9IChlbG0pID0+IHtcbiAgICAgIHZhciBzY3JvbGxQb3NpdGlvbiA9IE1hdGgubWF4KGFuZ3VsYXIuZWxlbWVudChcImh0bWxcIikuc2Nyb2xsVG9wKCksIGFuZ3VsYXIuZWxlbWVudChcImJvZHlcIikuc2Nyb2xsVG9wKCkpO1xuICAgICAgdmFyIGVsZW1lbnRPZmZzZXQgPSBlbG0ub2Zmc2V0KCkudG9wO1xuICAgICAgdmFyIGVsZW1lbnREaXN0YW5jZSA9IChlbGVtZW50T2Zmc2V0IC0gc2Nyb2xsUG9zaXRpb24pO1xuICAgICAgdmFyIHdpbmRvd0hlaWdodCA9IGFuZ3VsYXIuZWxlbWVudCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICAgcmV0dXJuIHdpbmRvd0hlaWdodCAtIGVsZW1lbnREaXN0YW5jZTtcbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGluZ0VsZW1lbnRTdHlsZSA9ICgkZWxlbWVudCwgdWxzKSA9PiB7XG4gICAgICBsZXQgU0laRV9CT1RUT01fRElTVEFOQ0UgPSA1O1xuICAgICAgbGV0IHBvc2l0aW9uID0gZ2V0T2Zmc2V0KCRlbGVtZW50WzBdKTtcblxuICAgICAgYW5ndWxhci5mb3JFYWNoKHVscywgdWwgPT4ge1xuICAgICAgICBpZiAoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSA9PSAwKSByZXR1cm47XG4gICAgICAgIGxldCBtYXhIZWlnaHQgPSBnZXRFbGVtZW50TWF4SGVpZ2h0KGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudFswXSkpO1xuICAgICAgICBpZiAoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSA+IG1heEhlaWdodCkge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh1bCkuY3NzKHtcbiAgICAgICAgICAgIGhlaWdodDogbWF4SGVpZ2h0IC0gU0laRV9CT1RUT01fRElTVEFOQ0UgKyAncHgnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSAhPSAobWF4SGVpZ2h0IC0gU0laRV9CT1RUT01fRElTVEFOQ0UpKSB7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiAnYXV0bydcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCh1bCkuY3NzKHtcbiAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIGxlZnQ6IHBvc2l0aW9uLmxlZnQgLSAxICsgJ3B4JyxcbiAgICAgICAgICB0b3A6IHBvc2l0aW9uLnRvcCAtIDIgKyAncHgnLFxuICAgICAgICAgIHdpZHRoOiAkZWxlbWVudC5maW5kKCdkaXYuZHJvcGRvd24nKVswXS5jbGllbnRXaWR0aCArIDFcbiAgICAgICAgfSk7XG5cblxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5jbGljayhmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBjbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgY2xvc2UgPSAoKSA9PiB7XG4gICAgICBpZighY3RybC5kaXYpIHJldHVybjtcbiAgICAgIGVuYWJsZVNjcm9sbCgpO1xuICAgICAgbGV0IHVscyA9IGFuZ3VsYXIuZWxlbWVudChjdHJsLmRpdikuZmluZCgndWwnKTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCh1bHMsIHVsID0+IHtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgIGRpc3BsYXk6ICdub25lJ1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgICAkZWxlbWVudC5maW5kKCdkaXYuZHJvcGRvd24nKS5hcHBlbmQodWxzKTtcbiAgICAgIGN0cmwuZGl2LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGhhbmRsaW5nRWxlbWVudEluQm9keSA9IChlbG0sIHVscykgPT4ge1xuICAgICAgdmFyIGJvZHkgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoJ2JvZHknKS5lcSgwKTtcbiAgICAgIGN0cmwuZGl2ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAgIGN0cmwuZGl2LmFkZENsYXNzKFwiZHJvcGRvd24gZ21kXCIpO1xuICAgICAgY3RybC5kaXYuYXBwZW5kKHVscyk7XG4gICAgICBib2R5LmFwcGVuZChjdHJsLmRpdik7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoZWxtLmZpbmQoJ2J1dHRvbi5kcm9wZG93bi10b2dnbGUnKSkuYXR0cmNoYW5nZSh7XG4gICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGV2bnQpIHtcbiAgICAgICAgICBpZiAoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdhcmlhLWV4cGFuZGVkJyAmJiBldm50Lm5ld1ZhbHVlID09ICdmYWxzZScpIHtcbiAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkZWxlbWVudC5iaW5kKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIGxldCB1bHMgPSAkZWxlbWVudC5maW5kKCd1bCcpO1xuICAgICAgaWYgKHVscy5maW5kKCdnbWQtb3B0aW9uJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGhhbmRsaW5nRWxlbWVudFN0eWxlKCRlbGVtZW50LCB1bHMpO1xuICAgICAgZGlzYWJsZVNjcm9sbCgpO1xuICAgICAgaGFuZGxpbmdFbGVtZW50SW5Cb2R5KCRlbGVtZW50LCB1bHMpO1xuICAgIH0pXG5cbiAgICBjdHJsLnNlbGVjdCA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgY3RybC5uZ01vZGVsID0gb3B0aW9uLm5nVmFsdWVcbiAgICAgIGN0cmwuc2VsZWN0ZWQgPSBvcHRpb24ubmdMYWJlbFxuICAgIH07XG5cbiAgICBjdHJsLmFkZE9wdGlvbiA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgIH07XG5cbiAgICBsZXQgc2V0U2VsZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBvcHRpb24gPT4ge1xuICAgICAgICBpZiAob3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5KSB7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmVxdWFscyh2YWx1ZSwgb3B0aW9uLm5nVmFsdWUpKSB7XG4gICAgICAgICAgY3RybC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgICR0aW1lb3V0KCgpID0+IHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbCkpO1xuXG4gICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGVuZ3RoID4gMCkgc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKVxuICAgIH1cblxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHJlcXVpcmU6IHtcbiAgICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICAgIH0sXG4gICAgYmluZGluZ3M6IHtcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KClcIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgICBgLFxuICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgICAgbGV0IGN0cmwgPSB0aGlzO1xuIFxuICAgICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodGhpcyk7XG4gICAgICB9XG4gICAgICBcbiAgICB9XVxuICB9XG4gIFxuICBleHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiAgIiwibGV0IENvbXBvbmVudCA9IHtcbiAgLy8gcmVxdWlyZTogWyduZ01vZGVsJywnbmdSZXF1aXJlZCddLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdWYWx1ZTogJz0nLFxuICAgIG5nTGFiZWw6ICc9J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwic2VsZWN0LW9wdGlvblwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3QoJGN0cmwubmdWYWx1ZSwgJGN0cmwubmdMYWJlbClcIiBuZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLnNlbGVjdGVkfVwiIG5nLXRyYW5zY2x1ZGU+PC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuYWRkT3B0aW9uKHRoaXMpXG4gICAgfVxuICAgIFxuICAgIGN0cmwuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLnNlbGVjdChjdHJsKTtcbiAgICAgIGlmKGN0cmwuZ21kU2VsZWN0Q3RybC5vbkNoYW5nZSl7XG4gICAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5vbkNoYW5nZSh7dmFsdWU6IHRoaXMubmdWYWx1ZX0pO1xuICAgICAgfVxuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgcGxhY2Vob2xkZXI6ICdAPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtiYWNrZ3JvdW5kOiAjZjlmOWY5O1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiIGlkPVwiYmFzaWMtYWRkb24xXCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7XCI+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+XG4gICAgICA8L3NwYW4+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnbWRcIiBuZy1tb2RlbD1cIiRjdHJsLm5nTW9kZWxcIiBwbGFjZWhvbGRlcj1cInt7JGN0cmwucGxhY2Vob2xkZXJ9fVwiPlxuICAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICAkZWxlbWVudC5iaW5kKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBkaWFtZXRlcjogXCJAP1wiLFxuICAgIGJveCAgICAgOiBcIj0/XCJcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInNwaW5uZXItbWF0ZXJpYWxcIiBuZy1pZj1cIiRjdHJsLmRpYW1ldGVyXCI+XG4gICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxuICAgICAgICB2ZXJzaW9uPVwiMVwiXG4gICAgICAgIG5nLWNsYXNzPVwieydzcGlubmVyLWJveCcgOiAkY3RybC5ib3h9XCJcbiAgICAgICAgc3R5bGU9XCJ3aWR0aDoge3skY3RybC5kaWFtZXRlcn19O2hlaWdodDoge3skY3RybC5kaWFtZXRlcn19O1wiXG4gICAgICAgIHZpZXdCb3g9XCIwIDAgMjggMjhcIj5cbiAgICA8ZyBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlclwiPlxuICAgICA8cGF0aCBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlci1wYXRoXCIgZmlsbD1cIm5vbmVcIiBkPVwiTSAxNCwxLjUgQSAxMi41LDEyLjUgMCAxIDEgMS41LDE0XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgPC9nPlxuICAgPC9zdmc+XG4gIDwvZGl2PmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZGlhbWV0ZXIgPSBjdHJsLmRpYW1ldGVyIHx8ICc1MHB4JztcbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgUHJvdmlkZXIgPSAoKSA9PiB7XG5cbiAgICBjb25zdCBzZXRFbGVtZW50SHJlZiA9IChocmVmKSA9PiB7XG4gICAgICAgIGxldCBlbG0gPSBhbmd1bGFyLmVsZW1lbnQoJ2xpbmtbaHJlZio9XCJndW1nYS1sYXlvdXRcIl0nKTtcbiAgICAgICAgaWYoZWxtICYmIGVsbVswXSl7XG4gICAgICAgICAgICBlbG0uYXR0cignaHJlZicsIGhyZWYpO1xuICAgICAgICB9XG4gICAgICAgIGVsbSA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJykpO1xuICAgICAgICBlbG0uYXR0cignaHJlZicsIGhyZWYpO1xuICAgICAgICBlbG0uYXR0cigncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbG1bMF0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNldFRoZW1lRGVmYXVsdCA9ICh0aGVtZU5hbWUsIHNhdmUpID0+IHtcbiAgICAgICAgbGV0IHNyYywgdGhlbWVEZWZhdWx0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZ21kLXRoZW1lLWRlZmF1bHQnKTtcbiAgICAgICAgaWYodGhlbWVOYW1lICYmICF0aGVtZURlZmF1bHQpe1xuICAgICAgICAgICAgaWYoc2F2ZSkgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZ21kLXRoZW1lLWRlZmF1bHQnLCB0aGVtZU5hbWUpO1xuICAgICAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC8nK3RoZW1lTmFtZSsnL2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZih0aGVtZURlZmF1bHQpe1xuICAgICAgICAgICAgICAgIHNyYyA9ICdndW1nYS1sYXlvdXQvJyt0aGVtZURlZmF1bHQrJy9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0L2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRFbGVtZW50SHJlZihzcmMpO1xuICAgIH1cblxuICAgIGNvbnN0IHNldFRoZW1lID0gKHRoZW1lTmFtZSwgdXBkYXRlU2Vzc2lvbikgPT4ge1xuICAgICAgICB2YXIgc3JjLCB0aGVtZURlZmF1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdnbWQtdGhlbWUnKTtcblxuICAgICAgICBpZigodGhlbWVOYW1lICYmIHVwZGF0ZVNlc3Npb24pIHx8ICh0aGVtZU5hbWUgJiYgIXRoZW1lRGVmYXVsdCkpe1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZ21kLXRoZW1lJywgdGhlbWVOYW1lKTtcbiAgICAgICAgICAgIHNyYyA9ICdndW1nYS1sYXlvdXQvJyArIHRoZW1lTmFtZSArICcvZ3VtZ2EtbGF5b3V0Lm1pbi5jc3MnO1xuICAgICAgICAgICAgc2V0RWxlbWVudEhyZWYoc3JjKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoZW1lTmFtZSAmJiAhdXBkYXRlU2Vzc2lvbil7XG4gICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0LycgKyB0aGVtZURlZmF1bHQgKyAnL2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgICAgIHNldEVsZW1lbnRIcmVmKHNyYyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0L2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgc2V0RWxlbWVudEhyZWYoc3JjKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0VGhlbWVEZWZhdWx0OiBzZXRUaGVtZURlZmF1bHQsIFxuICAgICAgICBzZXRUaGVtZTogc2V0VGhlbWUsIFxuICAgICAgICAkZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzZXRUaGVtZURlZmF1bHQ6IHNldFRoZW1lRGVmYXVsdCxcbiAgICAgICAgICAgICAgICBzZXRUaGVtZTogc2V0VGhlbWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG5cblByb3ZpZGVyLiRpbmplY3QgPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvdmlkZXI7XG4iXX0=
