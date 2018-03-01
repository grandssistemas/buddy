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

},{}],6:[function(require,module,exports){
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
    template: '\n\n    <nav class="main-menu">\n        <div class="menu-header">\n            <img ng-if="$ctrl.logo" ng-src="{{$ctrl.logo}}"/>\n            <img class="large" ng-if="$ctrl.largeLogo" ng-src="{{$ctrl.largeLogo}}"/>\n            <img class="small" ng-if="$ctrl.smallLogo" ng-src="{{$ctrl.smallLogo}}"/>\n\n            <svg version="1.1" ng-click="$ctrl.toggleMenu()" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n                width="613.408px" height="613.408px" viewBox="0 0 613.408 613.408" xml:space="preserve">\n                <g>\n                <path d="M605.254,168.94L443.792,7.457c-6.924-6.882-17.102-9.239-26.319-6.069c-9.177,3.128-15.809,11.241-17.019,20.855\n                    l-9.093,70.512L267.585,216.428h-142.65c-10.344,0-19.625,6.215-23.629,15.746c-3.92,9.573-1.71,20.522,5.589,27.779\n                    l105.424,105.403L0.699,613.408l246.635-212.869l105.423,105.402c4.881,4.881,11.45,7.467,17.999,7.467\n                    c3.295,0,6.632-0.709,9.78-2.002c9.573-3.922,15.726-13.244,15.726-23.504V345.168l123.839-123.714l70.429-9.176\n                    c9.614-1.251,17.727-7.862,20.813-17.039C614.472,186.021,612.136,175.801,605.254,168.94z M504.856,171.985\n                    c-5.568,0.751-10.762,3.232-14.745,7.237L352.758,316.596c-4.796,4.775-7.466,11.242-7.466,18.041v91.742L186.437,267.481h91.68\n                    c6.757,0,13.243-2.669,18.04-7.466L433.51,122.766c3.983-3.983,6.569-9.176,7.258-14.786l3.629-27.696l88.155,88.114\n                    L504.856,171.985z"/>\n                </g>\n            </svg>\n\n        </div>\n        <div class="scrollbar style-1">\n            <ul data-ng-class="\'level\'.concat($ctrl.back.length)">\n\n                <li class="goback gmd gmd-ripple" data-ng-show="$ctrl.previous.length > 0" data-ng-click="$ctrl.prev()">\n                    <a>\n                        <i class="material-icons">\n                            keyboard_arrow_left\n                        </i>\n                        <span data-ng-bind="$ctrl.back[$ctrl.back.length - 1].label" class="nav-text"></span>\n                    </a>\n                </li>\n\n                <li class="gmd-ripple"\n                    data-ng-repeat="item in $ctrl.menu | filter:$ctrl.search"\n                    data-ng-show="$ctrl.allow(item)"\n                    data-ng-click="$ctrl.next(item, $event)"\n                    data-ng-class="[!$ctrl.disableAnimations ? $ctrl.slide : \'\', {\'disabled\': $ctrl.itemDisabled({item: item})}, {header: item.type == \'header\', divider: item.type == \'separator\'}]">\n                    \n                    <a ng-if="item.type != \'separator\' && item.state" ui-sref="{{item.state}}">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                    <a ng-if="item.type != \'separator\' && !item.state">\n                        <i data-ng-if="item.icon" class="material-icons" data-ng-bind="item.icon"></i>\n                        <span class="nav-text" ng-bind="item.label"></span>\n                        <i data-ng-if="item.children && item.children.length > 0" class="material-icons pull-right">keyboard_arrow_right</i>\n                    </a>\n\n                </li>\n            </ul>\n    </nav>\n    \n    ',
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

},{}],7:[function(require,module,exports){
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

},{"../attrchange/attrchange":2}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

    var handlingElementInBody = function handlingElementInBody(elm, uls) {
      var body = angular.element(document).find('body').eq(0);
      var div = angular.element(document.createElement('div'));
      div.addClass("dropdown gmd");
      div.append(uls);
      body.append(div);
      angular.element(elm.find('button.dropdown-toggle')).attrchange({
        trackValues: true,
        callback: function callback(evnt) {
          if (evnt.attributeName == 'aria-expanded' && evnt.newValue == 'false') {
            enableScroll();
            uls = angular.element(div).find('ul');
            angular.forEach(uls, function (ul) {
              angular.element(ul).css({
                display: 'none'
              });
            });
            elm.find('div.dropdown').append(uls);
            div.remove();
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"./alert/provider.js":1,"./fab/component.js":3,"./hamburger/component.js":4,"./input/component.js":5,"./menu-shrink/component.js":6,"./menu/component.js":7,"./notification/component.js":8,"./ripple/component.js":9,"./select/component.js":10,"./select/empty/component.js":11,"./select/option/component.js":12,"./select/search/component.js":13,"./spinner/component.js":14,"./theme/provider.js":15}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvYWxlcnQvcHJvdmlkZXIuanMiLCIuLi8uLi8uLi9tZWRpYS9tYXRldXMvaGQvZ3VtZ2EvbGF5b3V0L3NyYy9jb21wb25lbnRzL2F0dHJjaGFuZ2UvYXR0cmNoYW5nZS5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvZmFiL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvaGFtYnVyZ2VyL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvaW5wdXQvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9tZW51LXNocmluay9jb21wb25lbnQuanMiLCIuLi8uLi8uLi9tZWRpYS9tYXRldXMvaGQvZ3VtZ2EvbGF5b3V0L3NyYy9jb21wb25lbnRzL21lbnUvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9ub3RpZmljYXRpb24vY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9yaXBwbGUvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9zZWxlY3QvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9zZWxlY3QvZW1wdHkvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy9zZWxlY3Qvb3B0aW9uL2NvbXBvbmVudC5qcyIsIi4uLy4uLy4uL21lZGlhL21hdGV1cy9oZC9ndW1nYS9sYXlvdXQvc3JjL2NvbXBvbmVudHMvc2VsZWN0L3NlYXJjaC9jb21wb25lbnQuanMiLCIuLi8uLi8uLi9tZWRpYS9tYXRldXMvaGQvZ3VtZ2EvbGF5b3V0L3NyYy9jb21wb25lbnRzL3NwaW5uZXIvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbWVkaWEvbWF0ZXVzL2hkL2d1bWdhL2xheW91dC9zcmMvY29tcG9uZW50cy90aGVtZS9wcm92aWRlci5qcyIsIi4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2d1bWdhLWxheW91dC9zcmMvY29tcG9uZW50cy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUEsSUFBSSx5VUFBSjs7QUFRQSxJQUFJLFdBQVcsU0FBWCxRQUFXLEdBQU07O0FBRW5CLE1BQUksU0FBUyxFQUFiOztBQUVBLFNBQU8sU0FBUCxDQUFpQixLQUFqQixHQUF5QixPQUFPLFNBQVAsQ0FBaUIsS0FBakIsSUFBMEIsWUFBVTtBQUMzRCxRQUFJLEtBQUssU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQVQ7QUFDQSxPQUFHLFNBQUgsR0FBZSxJQUFmO0FBQ0EsUUFBSSxPQUFPLFNBQVMsc0JBQVQsRUFBWDtBQUNBLFdBQU8sS0FBSyxXQUFMLENBQWlCLEdBQUcsV0FBSCxDQUFlLEdBQUcsVUFBbEIsQ0FBakIsQ0FBUDtBQUNELEdBTEQ7O0FBT0EsU0FBTyxTQUFQLENBQWlCLFFBQWpCLEdBQTRCLFlBQVc7QUFDckMsUUFBSSxPQUFPLENBQVg7QUFBQSxRQUFjLENBQWQ7QUFBQSxRQUFpQixHQUFqQjtBQUNBLFFBQUksS0FBSyxNQUFMLEtBQWdCLENBQXBCLEVBQXVCLE9B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WUcsU0FaSCxDQVlhLFVBWmIsd0JBYUcsU0FiSCxDQWFhLFFBYmIsd0JBY0csU0FkSCxDQWNhLFlBZGIsd0JBZUcsU0FmSCxDQWVhLGNBZmIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibGV0IHRlbXBsYXRlID0gYFxuICA8ZGl2IGNsYXNzPVwiYWxlcnQgZ21kIGdtZC1hbGVydC1wb3B1cCBhbGVydC1BTEVSVF9UWVBFIGFsZXJ0LWRpc21pc3NpYmxlXCIgcm9sZT1cImFsZXJ0XCI+XG4gICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPlxuICAgIDxzdHJvbmc+QUxFUlRfVElUTEU8L3N0cm9uZz4gQUxFUlRfTUVTU0FHRVxuICAgIDxhIGNsYXNzPVwiYWN0aW9uXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPkRlc2ZhemVyPC9hPlxuICA8L2Rpdj5cbmA7XG5cbmxldCBQcm92aWRlciA9ICgpID0+IHtcblxuICBsZXQgYWxlcnRzID0gW107XG5cbiAgU3RyaW5nLnByb3RvdHlwZS50b0RPTSA9IFN0cmluZy5wcm90b3R5cGUudG9ET00gfHwgZnVuY3Rpb24oKXtcbiAgICBsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbC5pbm5lckhUTUwgPSB0aGlzO1xuICAgIGxldCBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHJldHVybiBmcmFnLmFwcGVuZENoaWxkKGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpKTtcbiAgfTtcblxuICBTdHJpbmcucHJvdG90eXBlLmhhc2hDb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhhc2ggPSAwLCBpLCBjaHI7XG4gICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gaGFzaDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hyICAgPSB0aGlzLmNoYXJDb2RlQXQoaSk7XG4gICAgICBoYXNoICA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hyO1xuICAgICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9XG4gICAgcmV0dXJuIGhhc2g7XG4gIH07XG5cbiAgY29uc3QgZ2V0VGVtcGxhdGUgPSAodHlwZSwgdGl0bGUsIG1lc3NhZ2UpID0+IHtcbiAgICBsZXQgdG9SZXR1cm4gPSB0ZW1wbGF0ZS50cmltKCkucmVwbGFjZSgnQUxFUlRfVFlQRScsIHR5cGUpO1xuICAgICAgICB0b1JldHVybiA9IHRvUmV0dXJuLnRyaW0oKS5yZXBsYWNlKCdBTEVSVF9USVRMRScsIHRpdGxlKTtcbiAgICAgICAgdG9SZXR1cm4gPSB0b1JldHVybi50cmltKCkucmVwbGFjZSgnQUxFUlRfTUVTU0FHRScsIG1lc3NhZ2UpO1xuICAgIHJldHVybiB0b1JldHVybjtcbiAgfVxuXG4gIGNvbnN0IGdldEVsZW1lbnRCb2R5ICAgID0gKCkgPT4gYW5ndWxhci5lbGVtZW50KCdib2R5JylbMF07XG5cbiAgY29uc3Qgc3VjY2VzcyA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnc3VjY2VzcycsIHRpdGxlIHx8ICcnLCBtZXNzYWdlIHx8ICcnKSwgdGltZSwge3RpdGxlLCBtZXNzYWdlfSk7XG4gIH1cblxuICBjb25zdCBlcnJvciA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnZGFuZ2VyJywgdGl0bGUgfHwgJycsIG1lc3NhZ2UgfHwgJycpLCB0aW1lLCB7dGl0bGUsIG1lc3NhZ2V9KTtcbiAgfVxuXG4gIGNvbnN0IHdhcm5pbmcgPSAodGl0bGUsIG1lc3NhZ2UsIHRpbWUpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQWxlcnQoZ2V0VGVtcGxhdGUoJ3dhcm5pbmcnLCB0aXRsZSwgbWVzc2FnZSksIHRpbWUsIHt0aXRsZSwgbWVzc2FnZX0pO1xuICB9XG5cbiAgY29uc3QgaW5mbyA9ICh0aXRsZSwgbWVzc2FnZSwgdGltZSkgPT4ge1xuICAgIHJldHVybiBjcmVhdGVBbGVydChnZXRUZW1wbGF0ZSgnaW5mbycsIHRpdGxlLCBtZXNzYWdlKSwgdGltZSwge3RpdGxlLCBtZXNzYWdlfSk7XG4gIH1cblxuICBjb25zdCBjbG9zZUFsZXJ0ID0gKGVsbSwgY29uZmlnKSA9PiB7XG4gICAgYWxlcnRzID0gYWxlcnRzLmZpbHRlcihhbGVydCA9PiAhYW5ndWxhci5lcXVhbHMoY29uZmlnLCBhbGVydCkpO1xuICAgIGFuZ3VsYXIuZWxlbWVudChlbG0pLmNzcyh7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjMpJ1xuICAgIH0pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgbGV0IGJvZHkgPSBnZXRFbGVtZW50Qm9keSgpO1xuICAgICAgaWYoYm9keS5jb250YWlucyhlbG0pKXtcbiAgICAgICAgYm9keS5yZW1vdmVDaGlsZChlbG0pO1xuICAgICAgfVxuXG4gICAgfSwgMTAwKTtcbiAgfVxuXG4gIGNvbnN0IGJvdHRvbUxlZnQgPSAoZWxtKSA9PiB7XG4gICAgbGV0IGJvdHRvbSA9IDE1O1xuICAgIGFuZ3VsYXIuZm9yRWFjaChhbmd1bGFyLmVsZW1lbnQoZ2V0RWxlbWVudEJvZHkoKSkuZmluZCgnZGl2LmdtZC1hbGVydC1wb3B1cCcpLCBwb3B1cCA9PiB7XG4gICAgICBhbmd1bGFyLmVxdWFscyhlbG1bMF0sIHBvcHVwKSA/IGFuZ3VsYXIubm9vcCgpIDogYm90dG9tICs9IGFuZ3VsYXIuZWxlbWVudChwb3B1cCkuaGVpZ2h0KCkgKiAzO1xuICAgIH0pO1xuICAgIGVsbS5jc3Moe1xuICAgICAgYm90dG9tOiBib3R0b20rICdweCcsXG4gICAgICBsZWZ0ICA6ICcxNXB4JyxcbiAgICAgIHRvcCAgIDogIG51bGwsXG4gICAgICByaWdodCA6ICBudWxsXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGNyZWF0ZUFsZXJ0ID0gKHRlbXBsYXRlLCB0aW1lLCBjb25maWcpID0+IHtcbiAgICBpZihhbGVydHMuZmlsdGVyKGFsZXJ0ID0+IGFuZ3VsYXIuZXF1YWxzKGFsZXJ0LCBjb25maWcpKS5sZW5ndGggPiAwKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYWxlcnRzLnB1c2goY29uZmlnKTtcbiAgICBsZXQgb25EaXNtaXNzLCBvblJvbGxiYWNrLCBlbG0gPSBhbmd1bGFyLmVsZW1lbnQodGVtcGxhdGUudG9ET00oKSk7XG4gICAgZ2V0RWxlbWVudEJvZHkoKS5hcHBlbmRDaGlsZChlbG1bMF0pO1xuXG4gICAgYm90dG9tTGVmdChlbG0pO1xuXG4gICAgZWxtLmZpbmQoJ2J1dHRvbltjbGFzcz1cImNsb3NlXCJdJykuY2xpY2soKGV2dCkgPT4ge1xuICAgICAgY2xvc2VBbGVydChlbG1bMF0pO1xuICAgICAgb25EaXNtaXNzID8gb25EaXNtaXNzKGV2dCkgOiBhbmd1bGFyLm5vb3AoKVxuICAgIH0pO1xuXG4gICAgZWxtLmZpbmQoJ2FbY2xhc3M9XCJhY3Rpb25cIl0nKS5jbGljaygoZXZ0KSA9PiBvblJvbGxiYWNrID8gb25Sb2xsYmFjayhldnQpIDogYW5ndWxhci5ub29wKCkpO1xuXG4gICAgdGltZSA/IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY2xvc2VBbGVydChlbG1bMF0sIGNvbmZpZyk7XG4gICAgICBvbkRpc21pc3MgPyBvbkRpc21pc3MoKSA6IGFuZ3VsYXIubm9vcCgpO1xuICAgIH0sIHRpbWUpIDogYW5ndWxhci5ub29wKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb24ocG9zaXRpb24pe1xuXG4gICAgICB9LFxuICAgICAgb25EaXNtaXNzKGNhbGxiYWNrKSB7XG4gICAgICAgIG9uRGlzbWlzcyA9IGNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0sXG4gICAgICBvblJvbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIGVsbS5maW5kKCdhW2NsYXNzPVwiYWN0aW9uXCJdJykuY3NzKHsgZGlzcGxheTogJ2Jsb2NrJyB9KTtcbiAgICAgICAgb25Sb2xsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0sXG4gICAgICBjbG9zZSgpe1xuICAgICAgICBjbG9zZUFsZXJ0KGVsbVswXSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgJGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdWNjZXNzOiBzdWNjZXNzLFxuICAgICAgICAgIGVycm9yICA6IGVycm9yLFxuICAgICAgICAgIHdhcm5pbmc6IHdhcm5pbmcsXG4gICAgICAgICAgaW5mbyAgIDogaW5mb1xuICAgICAgICB9O1xuICAgICAgfVxuICB9XG59XG5cblByb3ZpZGVyLiRpbmplY3QgPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvdmlkZXJcbiIsImZ1bmN0aW9uIGlzRE9NQXR0ck1vZGlmaWVkU3VwcG9ydGVkKCkge1xuXHRcdHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXHRcdHZhciBmbGFnID0gZmFsc2U7XG5cblx0XHRpZiAocC5hZGRFdmVudExpc3RlbmVyKSB7XG5cdFx0XHRwLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUF0dHJNb2RpZmllZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRmbGFnID0gdHJ1ZVxuXHRcdFx0fSwgZmFsc2UpO1xuXHRcdH0gZWxzZSBpZiAocC5hdHRhY2hFdmVudCkge1xuXHRcdFx0cC5hdHRhY2hFdmVudCgnb25ET01BdHRyTW9kaWZpZWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmxhZyA9IHRydWVcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdHAuc2V0QXR0cmlidXRlKCdpZCcsICd0YXJnZXQnKTtcblx0XHRyZXR1cm4gZmxhZztcblx0fVxuXG5cdGZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlcyhjaGtBdHRyLCBlKSB7XG5cdFx0aWYgKGNoa0F0dHIpIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5kYXRhKCdhdHRyLW9sZC12YWx1ZScpO1xuXG5cdFx0XHRpZiAoZS5hdHRyaWJ1dGVOYW1lLmluZGV4T2YoJ3N0eWxlJykgPj0gMCkge1xuXHRcdFx0XHRpZiAoIWF0dHJpYnV0ZXNbJ3N0eWxlJ10pXG5cdFx0XHRcdFx0YXR0cmlidXRlc1snc3R5bGUnXSA9IHt9OyAvL2luaXRpYWxpemVcblx0XHRcdFx0dmFyIGtleXMgPSBlLmF0dHJpYnV0ZU5hbWUuc3BsaXQoJy4nKTtcblx0XHRcdFx0ZS5hdHRyaWJ1dGVOYW1lID0ga2V5c1swXTtcblx0XHRcdFx0ZS5vbGRWYWx1ZSA9IGF0dHJpYnV0ZXNbJ3N0eWxlJ11ba2V5c1sxXV07IC8vb2xkIHZhbHVlXG5cdFx0XHRcdGUubmV3VmFsdWUgPSBrZXlzWzFdICsgJzonXG5cdFx0XHRcdFx0XHQrIHRoaXMucHJvcChcInN0eWxlXCIpWyQuY2FtZWxDYXNlKGtleXNbMV0pXTsgLy9uZXcgdmFsdWVcblx0XHRcdFx0YXR0cmlidXRlc1snc3R5bGUnXVtrZXlzWzFdXSA9IGUubmV3VmFsdWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlLm9sZFZhbHVlID0gYXR0cmlidXRlc1tlLmF0dHJpYnV0ZU5hbWVdO1xuXHRcdFx0XHRlLm5ld1ZhbHVlID0gdGhpcy5hdHRyKGUuYXR0cmlidXRlTmFtZSk7XG5cdFx0XHRcdGF0dHJpYnV0ZXNbZS5hdHRyaWJ1dGVOYW1lXSA9IGUubmV3VmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZGF0YSgnYXR0ci1vbGQtdmFsdWUnLCBhdHRyaWJ1dGVzKTsgLy91cGRhdGUgdGhlIG9sZCB2YWx1ZSBvYmplY3Rcblx0XHR9XG5cdH1cblxuXHQvL2luaXRpYWxpemUgTXV0YXRpb24gT2JzZXJ2ZXJcblx0dmFyIE11dGF0aW9uT2JzZXJ2ZXIgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0fHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cblx0YW5ndWxhci5lbGVtZW50LmZuLmF0dHJjaGFuZ2UgPSBmdW5jdGlvbihhLCBiKSB7XG5cdFx0aWYgKHR5cGVvZiBhID09ICdvYmplY3QnKSB7Ly9jb3JlXG5cdFx0XHR2YXIgY2ZnID0ge1xuXHRcdFx0XHR0cmFja1ZhbHVlcyA6IGZhbHNlLFxuXHRcdFx0XHRjYWxsYmFjayA6ICQubm9vcFxuXHRcdFx0fTtcblx0XHRcdC8vYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXHRcdFx0aWYgKHR5cGVvZiBhID09PSBcImZ1bmN0aW9uXCIpIHsgY2ZnLmNhbGxiYWNrID0gYTsgfSBlbHNlIHsgJC5leHRlbmQoY2ZnLCBhKTsgfVxuXG5cdFx0XHRpZiAoY2ZnLnRyYWNrVmFsdWVzKSB7IC8vZ2V0IGF0dHJpYnV0ZXMgb2xkIHZhbHVlXG5cdFx0XHRcdHRoaXMuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVzID0ge307XG5cdFx0XHRcdFx0Zm9yICggdmFyIGF0dHIsIGkgPSAwLCBhdHRycyA9IGVsLmF0dHJpYnV0ZXMsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRcdGF0dHIgPSBhdHRycy5pdGVtKGkpO1xuXHRcdFx0XHRcdFx0YXR0cmlidXRlc1thdHRyLm5vZGVOYW1lXSA9IGF0dHIudmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCQodGhpcykuZGF0YSgnYXR0ci1vbGQtdmFsdWUnLCBhdHRyaWJ1dGVzKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChNdXRhdGlvbk9ic2VydmVyKSB7IC8vTW9kZXJuIEJyb3dzZXJzIHN1cHBvcnRpbmcgTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0XHR2YXIgbU9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0c3VidHJlZSA6IGZhbHNlLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMgOiB0cnVlLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZU9sZFZhbHVlIDogY2ZnLnRyYWNrVmFsdWVzXG5cdFx0XHRcdH07XG5cdFx0XHRcdHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xuXHRcdFx0XHRcdG11dGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRcdHZhciBfdGhpcyA9IGUudGFyZ2V0O1xuXHRcdFx0XHRcdFx0Ly9nZXQgbmV3IHZhbHVlIGlmIHRyYWNrVmFsdWVzIGlzIHRydWVcblx0XHRcdFx0XHRcdGlmIChjZmcudHJhY2tWYWx1ZXMpIHtcblx0XHRcdFx0XHRcdFx0ZS5uZXdWYWx1ZSA9ICQoX3RoaXMpLmF0dHIoZS5hdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICgkKF90aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2V4ZWN1dGUgaWYgY29ubmVjdGVkXG5cdFx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKF90aGlzLCBlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YSgnYXR0cmNoYW5nZS1tZXRob2QnLCAnTXV0YXRpb24gT2JzZXJ2ZXInKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKVxuXHRcdFx0XHRcdFx0LmRhdGEoJ2F0dHJjaGFuZ2Utb2JzJywgb2JzZXJ2ZXIpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRcdG9ic2VydmVyLm9ic2VydmUodGhpcywgbU9wdGlvbnMpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2UgaWYgKGlzRE9NQXR0ck1vZGlmaWVkU3VwcG9ydGVkKCkpIHsgLy9PcGVyYVxuXHRcdFx0XHQvL0dvb2Qgb2xkIE11dGF0aW9uIEV2ZW50c1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5kYXRhKCdhdHRyY2hhbmdlLW1ldGhvZCcsICdET01BdHRyTW9kaWZpZWQnKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycsICdjb25uZWN0ZWQnKS5vbignRE9NQXR0ck1vZGlmaWVkJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRpZiAoZXZlbnQub3JpZ2luYWxFdmVudCkgeyBldmVudCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQ7IH0vL2pRdWVyeSBub3JtYWxpemF0aW9uIGlzIG5vdCByZXF1aXJlZFxuXHRcdFx0XHRcdGV2ZW50LmF0dHJpYnV0ZU5hbWUgPSBldmVudC5hdHRyTmFtZTsgLy9wcm9wZXJ0eSBuYW1lcyB0byBiZSBjb25zaXN0ZW50IHdpdGggTXV0YXRpb25PYnNlcnZlclxuXHRcdFx0XHRcdGV2ZW50Lm9sZFZhbHVlID0gZXZlbnQucHJldlZhbHVlOyAvL3Byb3BlcnR5IG5hbWVzIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBNdXRhdGlvbk9ic2VydmVyXG5cdFx0XHRcdFx0aWYgKCQodGhpcykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnKSA9PT0gJ2Nvbm5lY3RlZCcpIHsgLy9kaXNjb25uZWN0ZWQgbG9naWNhbGx5XG5cdFx0XHRcdFx0XHRjZmcuY2FsbGJhY2suY2FsbCh0aGlzLCBldmVudCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSBpZiAoJ29ucHJvcGVydHljaGFuZ2UnIGluIGRvY3VtZW50LmJvZHkpIHsgLy93b3JrcyBvbmx5IGluIElFXG5cdFx0XHRcdHJldHVybiB0aGlzLmRhdGEoJ2F0dHJjaGFuZ2UtbWV0aG9kJywgJ3Byb3BlcnR5Y2hhbmdlJykuZGF0YSgnYXR0cmNoYW5nZS1zdGF0dXMnLCAnY29ubmVjdGVkJykub24oJ3Byb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGUuYXR0cmlidXRlTmFtZSA9IHdpbmRvdy5ldmVudC5wcm9wZXJ0eU5hbWU7XG5cdFx0XHRcdFx0Ly90byBzZXQgdGhlIGF0dHIgb2xkIHZhbHVlXG5cdFx0XHRcdFx0Y2hlY2tBdHRyaWJ1dGVzLmNhbGwoJCh0aGlzKSwgY2ZnLnRyYWNrVmFsdWVzLCBlKTtcblx0XHRcdFx0XHRpZiAoJCh0aGlzKS5kYXRhKCdhdHRyY2hhbmdlLXN0YXR1cycpID09PSAnY29ubmVjdGVkJykgeyAvL2Rpc2Nvbm5lY3RlZCBsb2dpY2FsbHlcblx0XHRcdFx0XHRcdGNmZy5jYWxsYmFjay5jYWxsKHRoaXMsIGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhID09ICdzdHJpbmcnICYmICQuZm4uYXR0cmNoYW5nZS5oYXNPd25Qcm9wZXJ0eSgnZXh0ZW5zaW9ucycpICYmXG5cdFx0XHRcdGFuZ3VsYXIuZWxlbWVudC5mbi5hdHRyY2hhbmdlWydleHRlbnNpb25zJ10uaGFzT3duUHJvcGVydHkoYSkpIHsgLy9leHRlbnNpb25zL29wdGlvbnNcblx0XHRcdHJldHVybiAkLmZuLmF0dHJjaGFuZ2VbJ2V4dGVuc2lvbnMnXVthXS5jYWxsKHRoaXMsIGIpO1xuXHRcdH1cblx0fVxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBmb3JjZUNsaWNrOiAnPT8nLFxuICAgIG9wZW5lZDogJz0/J1xuICB9LFxuICB0ZW1wbGF0ZTogYDxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT5gLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjb25zdCBoYW5kbGluZ09wdGlvbnMgPSAoZWxlbWVudHMpID0+IHtcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVsZW1lbnRzLCAob3B0aW9uKSA9PiB7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KG9wdGlvbikuY3NzKHtsZWZ0OiAobWVhc3VyZVRleHQoYW5ndWxhci5lbGVtZW50KG9wdGlvbikudGV4dCgpLCAnMTQnLCBvcHRpb24uc3R5bGUpLndpZHRoICsgMzApICogLTF9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lYXN1cmVUZXh0KHBUZXh0LCBwRm9udFNpemUsIHBTdHlsZSkge1xuICAgICAgICB2YXIgbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxEaXYpO1xuXG4gICAgICAgIGlmIChwU3R5bGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgbERpdi5zdHlsZSA9IHBTdHlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxEaXYuc3R5bGUuZm9udFNpemUgPSBcIlwiICsgcEZvbnRTaXplICsgXCJweFwiO1xuICAgICAgICBsRGl2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBsRGl2LnN0eWxlLmxlZnQgPSAtMTAwMDtcbiAgICAgICAgbERpdi5zdHlsZS50b3AgPSAtMTAwMDtcblxuICAgICAgICBsRGl2LmlubmVySFRNTCA9IHBUZXh0O1xuXG4gICAgICAgIHZhciBsUmVzdWx0ID0ge1xuICAgICAgICAgICAgd2lkdGg6IGxEaXYuY2xpZW50V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGxEaXYuY2xpZW50SGVpZ2h0XG4gICAgICAgIH07XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsRGl2KTtcblxuICAgICAgICBsRGl2ID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gbFJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCB3aXRoRm9jdXMgPSAodWwpID0+IHtcbiAgICAgICRlbGVtZW50Lm9uKCdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICBpZihjdHJsLm9wZW5lZCl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgIH0pXG4gICAgICAgIG9wZW4odWwpO1xuICAgICAgfSk7XG4gICAgICAkZWxlbWVudC5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgaWYoY3RybC5vcGVuZWQpe1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgY2xvc2UodWwpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2xvc2UgPSAodWwpID0+IHtcbiAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZykgc2NhbGUoMC4zKSd9KTtcbiAgICAgIH1lbHNle1xuICAgICAgICB1bC5maW5kKCdsaScpLmNzcyh7dHJhbnNmb3JtOiAnc2NhbGUoMC4zKSd9KTtcbiAgICAgIH1cbiAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmNzcyh7b3BhY2l0eTogJzAnLCBwb3NpdGlvbjogJ2Fic29sdXRlJ30pXG4gICAgICB1bC5jc3Moe3Zpc2liaWxpdHk6IFwiaGlkZGVuXCIsIG9wYWNpdHk6ICcwJ30pXG4gICAgICB1bC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgLy8gaWYoY3RybC5vcGVuZWQpe1xuICAgICAgLy8gICBjdHJsLm9wZW5lZCA9IGZhbHNlO1xuICAgICAgLy8gICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgLy8gfVxuICAgIH1cblxuICAgIGNvbnN0IG9wZW4gPSAodWwpID0+IHtcbiAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZykgc2NhbGUoMSknfSk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdWwuZmluZCgnbGknKS5jc3Moe3RyYW5zZm9ybTogJ3JvdGF0ZSgwZGVnKSBzY2FsZSgxKSd9KTtcbiAgICAgIH1cbiAgICAgIHVsLmZpbmQoJ2xpID4gc3BhbicpLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5jc3Moe29wYWNpdHk6ICcxJywgcG9zaXRpb246ICdhYnNvbHV0ZSd9KVxuICAgICAgfSlcbiAgICAgIHVsLmNzcyh7dmlzaWJpbGl0eTogXCJ2aXNpYmxlXCIsIG9wYWNpdHk6ICcxJ30pXG4gICAgICB1bC5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgLy8gaWYoIWN0cmwub3BlbmVkKXtcbiAgICAgIC8vICAgY3RybC5vcGVuZWQgPSB0cnVlO1xuICAgICAgLy8gICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgLy8gfVxuICAgIH1cblxuICAgIGNvbnN0IHdpdGhDbGljayA9ICh1bCkgPT4ge1xuICAgICAgICRlbGVtZW50LmZpbmQoJ2J1dHRvbicpLmZpcnN0KCkub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgaWYodWwuaGFzQ2xhc3MoJ29wZW4nKSl7XG4gICAgICAgICAgIGNsb3NlKHVsKTtcbiAgICAgICAgIH1lbHNle1xuICAgICAgICAgICBvcGVuKHVsKTtcbiAgICAgICAgIH1cbiAgICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IHZlcmlmeVBvc2l0aW9uID0gKHVsKSA9PiB7XG4gICAgICAkZWxlbWVudC5jc3Moe2Rpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCJ9KTtcbiAgICAgIGlmKHVsWzBdLmhhc0F0dHJpYnV0ZSgnbGVmdCcpKXtcbiAgICAgICAgbGV0IHdpZHRoID0gMCwgbGlzID0gdWwuZmluZCgnbGknKTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKGxpcywgbGkgPT4gd2lkdGgrPWFuZ3VsYXIuZWxlbWVudChsaSlbMF0ub2Zmc2V0V2lkdGgpO1xuICAgICAgICBjb25zdCBzaXplID0gKHdpZHRoICsgKDEwICogbGlzLmxlbmd0aCkpICogLTE7XG4gICAgICAgIHVsLmNzcyh7bGVmdDogc2l6ZX0pO1xuICAgICAgfWVsc2V7XG4gICAgICAgIGNvbnN0IHNpemUgPSB1bC5oZWlnaHQoKTtcbiAgICAgICAgdWwuY3NzKHt0b3A6IHNpemUgKiAtMX0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLiR3YXRjaCgnJGN0cmwub3BlbmVkJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkZWxlbWVudC5maW5kKCd1bCcpLCAodWwpID0+IHtcbiAgICAgICAgICB2ZXJpZnlQb3NpdGlvbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICBoYW5kbGluZ09wdGlvbnMoYW5ndWxhci5lbGVtZW50KHVsKS5maW5kKCdsaSA+IHNwYW4nKSk7XG4gICAgICAgICAgaWYodmFsdWUpe1xuICAgICAgICAgICAgb3Blbihhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBjbG9zZShhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICB9LCB0cnVlKTtcblxuICAgICRlbGVtZW50LnJlYWR5KCgpID0+IHtcbiAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRlbGVtZW50LmZpbmQoJ3VsJyksICh1bCkgPT4ge1xuICAgICAgICAgIHZlcmlmeVBvc2l0aW9uKGFuZ3VsYXIuZWxlbWVudCh1bCkpO1xuICAgICAgICAgIGhhbmRsaW5nT3B0aW9ucyhhbmd1bGFyLmVsZW1lbnQodWwpLmZpbmQoJ2xpID4gc3BhbicpKTtcbiAgICAgICAgICBpZighY3RybC5mb3JjZUNsaWNrKXtcbiAgICAgICAgICAgIHdpdGhGb2N1cyhhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHdpdGhDbGljayhhbmd1bGFyLmVsZW1lbnQodWwpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwibmF2YmFyLWJyYW5kXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLm5hdkNvbGxhcHNlKClcIiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZTtjdXJzb3I6IHBvaW50ZXI7XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibmF2VHJpZ2dlclwiPlxuICAgICAgICA8aT48L2k+PGk+PC9pPjxpPjwvaT5cbiAgICAgIDwvZGl2PlxuICAgIDwvYT5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyRhdHRycycsJyR0aW1lb3V0JywgJyRwYXJzZScsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRpbWVvdXQsJHBhcnNlKSB7XG4gICAgbGV0IGN0cmwgPSB0aGlzO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgYW5ndWxhci5lbGVtZW50KFwibmF2LmdsLW5hdlwiKS5hdHRyY2hhbmdlKHtcbiAgICAgICAgICB0cmFja1ZhbHVlczogdHJ1ZSxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgaWYoZXZudC5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpe1xuICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUhhbWJ1cmdlcihldm50Lm5ld1ZhbHVlLmluZGV4T2YoJ2NvbGxhcHNlZCcpICE9IC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIgPSAoaXNDb2xsYXBzZWQpID0+IHtcbiAgICAgICAgaXNDb2xsYXBzZWQgPyAkZWxlbWVudC5maW5kKCdkaXYubmF2VHJpZ2dlcicpLmFkZENsYXNzKCdhY3RpdmUnKSA6ICRlbGVtZW50LmZpbmQoJ2Rpdi5uYXZUcmlnZ2VyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLm5hdkNvbGxhcHNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpXG4gICAgICAgICAgLmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlZCcpO1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZXZudCkge1xuICAgICAgICAgICAgICBpZihldm50LmF0dHJpYnV0ZU5hbWUgPT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICAgICAgY3RybC50b2dnbGVIYW1idXJnZXIoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudG9nZ2xlSGFtYnVyZ2VyKGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG4gICAgfVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudDtcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBuZy10cmFuc2NsdWRlPjwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJGF0dHJzJywnJHRpbWVvdXQnLCAnJHBhcnNlJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdGltZW91dCwkcGFyc2UpIHtcbiAgICBsZXQgY3RybCA9IHRoaXMsXG4gICAgICAgIGlucHV0LFxuICAgICAgICBtb2RlbDtcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGxldCBjaGFuZ2VBY3RpdmUgPSB0YXJnZXQgPT4ge1xuICAgICAgICBpZiAodGFyZ2V0LnZhbHVlKSB7XG4gICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGN0cmwuJGRvQ2hlY2sgPSAoKSA9PiB7XG4gICAgICAgIGlmIChpbnB1dCAmJiBpbnB1dFswXSkgY2hhbmdlQWN0aXZlKGlucHV0WzBdKVxuICAgICAgfVxuICAgICAgY3RybC4kcG9zdExpbmsgPSAoKSA9PiB7XG4gICAgICAgIGxldCBnbWRJbnB1dCA9ICRlbGVtZW50LmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgIGlmKGdtZElucHV0WzBdKXtcbiAgICAgICAgICBpbnB1dCA9IGFuZ3VsYXIuZWxlbWVudChnbWRJbnB1dClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgaW5wdXQgPSBhbmd1bGFyLmVsZW1lbnQoJGVsZW1lbnQuZmluZCgndGV4dGFyZWEnKSk7XG4gICAgICAgIH1cbiAgICAgICAgbW9kZWwgPSBpbnB1dC5hdHRyKCduZy1tb2RlbCcpIHx8IGlucHV0LmF0dHIoJ2RhdGEtbmctbW9kZWwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgYmluZGluZ3M6IHtcbiAgICAgICAgbWVudTogJzwnLFxuICAgICAgICBrZXlzOiAnPCcsXG4gICAgICAgIGxvZ286ICdAPycsXG4gICAgICAgIGxhcmdlTG9nbzogJ0A/JyxcbiAgICAgICAgc21hbGxMb2dvOiAnQD8nLFxuICAgICAgICBoaWRlU2VhcmNoOiAnPT8nLFxuICAgICAgICBpc09wZW5lZDogJz0/JyxcbiAgICAgICAgaWNvbkZpcnN0TGV2ZWw6ICdAPycsXG4gICAgICAgIHNob3dCdXR0b25GaXJzdExldmVsOiAnPT8nLFxuICAgICAgICB0ZXh0Rmlyc3RMZXZlbDogJ0A/JyxcbiAgICAgICAgaXRlbURpc2FibGVkOiAnJj8nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZTogYFxuXG4gICAgPG5hdiBjbGFzcz1cIm1haW4tbWVudVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWVudS1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxpbWcgbmctaWY9XCIkY3RybC5sb2dvXCIgbmctc3JjPVwie3skY3RybC5sb2dvfX1cIi8+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwibGFyZ2VcIiBuZy1pZj1cIiRjdHJsLmxhcmdlTG9nb1wiIG5nLXNyYz1cInt7JGN0cmwubGFyZ2VMb2dvfX1cIi8+XG4gICAgICAgICAgICA8aW1nIGNsYXNzPVwic21hbGxcIiBuZy1pZj1cIiRjdHJsLnNtYWxsTG9nb1wiIG5nLXNyYz1cInt7JGN0cmwuc21hbGxMb2dvfX1cIi8+XG5cbiAgICAgICAgICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIG5nLWNsaWNrPVwiJGN0cmwudG9nZ2xlTWVudSgpXCIgaWQ9XCJDYXBhXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxuICAgICAgICAgICAgICAgIHdpZHRoPVwiNjEzLjQwOHB4XCIgaGVpZ2h0PVwiNjEzLjQwOHB4XCIgdmlld0JveD1cIjAgMCA2MTMuNDA4IDYxMy40MDhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNjA1LjI1NCwxNjguOTRMNDQzLjc5Miw3LjQ1N2MtNi45MjQtNi44ODItMTcuMTAyLTkuMjM5LTI2LjMxOS02LjA2OWMtOS4xNzcsMy4xMjgtMTUuODA5LDExLjI0MS0xNy4wMTksMjAuODU1XG4gICAgICAgICAgICAgICAgICAgIGwtOS4wOTMsNzAuNTEyTDI2Ny41ODUsMjE2LjQyOGgtMTQyLjY1Yy0xMC4zNDQsMC0xOS42MjUsNi4yMTUtMjMuNjI5LDE1Ljc0NmMtMy45Miw5LjU3My0xLjcxLDIwLjUyMiw1LjU4OSwyNy43NzlcbiAgICAgICAgICAgICAgICAgICAgbDEwNS40MjQsMTA1LjQwM0wwLjY5OSw2MTMuNDA4bDI0Ni42MzUtMjEyLjg2OWwxMDUuNDIzLDEwNS40MDJjNC44ODEsNC44ODEsMTEuNDUsNy40NjcsMTcuOTk5LDcuNDY3XG4gICAgICAgICAgICAgICAgICAgIGMzLjI5NSwwLDYuNjMyLTAuNzA5LDkuNzgtMi4wMDJjOS41NzMtMy45MjIsMTUuNzI2LTEzLjI0NCwxNS43MjYtMjMuNTA0VjM0NS4xNjhsMTIzLjgzOS0xMjMuNzE0bDcwLjQyOS05LjE3NlxuICAgICAgICAgICAgICAgICAgICBjOS42MTQtMS4yNTEsMTcuNzI3LTcuODYyLDIwLjgxMy0xNy4wMzlDNjE0LjQ3MiwxODYuMDIxLDYxMi4xMzYsMTc1LjgwMSw2MDUuMjU0LDE2OC45NHogTTUwNC44NTYsMTcxLjk4NVxuICAgICAgICAgICAgICAgICAgICBjLTUuNTY4LDAuNzUxLTEwLjc2MiwzLjIzMi0xNC43NDUsNy4yMzdMMzUyLjc1OCwzMTYuNTk2Yy00Ljc5Niw0Ljc3NS03LjQ2NiwxMS4yNDItNy40NjYsMTguMDQxdjkxLjc0MkwxODYuNDM3LDI2Ny40ODFoOTEuNjhcbiAgICAgICAgICAgICAgICAgICAgYzYuNzU3LDAsMTMuMjQzLTIuNjY5LDE4LjA0LTcuNDY2TDQzMy41MSwxMjIuNzY2YzMuOTgzLTMuOTgzLDYuNTY5LTkuMTc2LDcuMjU4LTE0Ljc4NmwzLjYyOS0yNy42OTZsODguMTU1LDg4LjExNFxuICAgICAgICAgICAgICAgICAgICBMNTA0Ljg1NiwxNzEuOTg1elwiLz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8L3N2Zz5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNjcm9sbGJhciBzdHlsZS0xXCI+XG4gICAgICAgICAgICA8dWwgZGF0YS1uZy1jbGFzcz1cIidsZXZlbCcuY29uY2F0KCRjdHJsLmJhY2subGVuZ3RoKVwiPlxuXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZ29iYWNrIGdtZCBnbWQtcmlwcGxlXCIgZGF0YS1uZy1zaG93PVwiJGN0cmwucHJldmlvdXMubGVuZ3RoID4gMFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5wcmV2KClcIj5cbiAgICAgICAgICAgICAgICAgICAgPGE+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfbGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCIgY2xhc3M9XCJuYXYtdGV4dFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG5cbiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJnbWQtcmlwcGxlXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLm1lbnUgfCBmaWx0ZXI6JGN0cmwuc2VhcmNoXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICBkYXRhLW5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtLCAkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS1uZy1jbGFzcz1cIlshJGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgPyAkY3RybC5zbGlkZSA6ICcnLCB7J2Rpc2FibGVkJzogJGN0cmwuaXRlbURpc2FibGVkKHtpdGVtOiBpdGVtfSl9LCB7aGVhZGVyOiBpdGVtLnR5cGUgPT0gJ2hlYWRlcicsIGRpdmlkZXI6IGl0ZW0udHlwZSA9PSAnc2VwYXJhdG9yJ31dXCI+XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8YSBuZy1pZj1cIml0ZW0udHlwZSAhPSAnc2VwYXJhdG9yJyAmJiBpdGVtLnN0YXRlXCIgdWktc3JlZj1cInt7aXRlbS5zdGF0ZX19XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmF2LXRleHRcIiBuZy1iaW5kPVwiaXRlbS5sYWJlbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmNoaWxkcmVuICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMFwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPmtleWJvYXJkX2Fycm93X3JpZ2h0PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG5cbiAgICAgICAgICAgICAgICAgICAgPGEgbmctaWY9XCJpdGVtLnR5cGUgIT0gJ3NlcGFyYXRvcicgJiYgIWl0ZW0uc3RhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuYXYtdGV4dFwiIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW4gJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29ucyBwdWxsLXJpZ2h0XCI+a2V5Ym9hcmRfYXJyb3dfcmlnaHQ8L2k+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cblxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgIDwvbmF2PlxuICAgIFxuICAgIGAsXG4gICAgY29udHJvbGxlcjogWyckdGltZW91dCcsICckYXR0cnMnLCAnJGVsZW1lbnQnLCBmdW5jdGlvbiAoJHRpbWVvdXQsICRhdHRycywgJGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGN0cmwgPSB0aGlzO1xuICAgICAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW107XG4gICAgICAgIGN0cmwuaWNvbkZpcnN0TGV2ZWwgPSBjdHJsLmljb25GaXJzdExldmVsIHx8ICdnbHlwaGljb24gZ2x5cGhpY29uLWhvbWUnO1xuICAgICAgICBjdHJsLnByZXZpb3VzID0gW107XG4gICAgICAgIGN0cmwuYmFjayA9IFtdO1xuICAgICAgICBsZXQgbWFpbkNvbnRlbnQsIGhlYWRlckNvbnRlbnQ7XG5cbiAgICAgICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgICAgICAgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgICAgICAgIGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICAgICAgaWYoZXZhbChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdnbWQtbWVudS1zaHJpbmsnKSkpe1xuICAgICAgICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKCdmaXhlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwudG9nZ2xlTWVudSA9ICgpID0+IHtcbiAgICAgICAgICAgICRlbGVtZW50LnRvZ2dsZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZ21kLW1lbnUtc2hyaW5rJywgJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZpeGVkJykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGN0cmwucHJldiA9ICgpID0+IHtcbiAgICAgICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXMucG9wKCk7XG4gICAgICAgICAgICBjdHJsLmJhY2sucG9wKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5uZXh0ID0gKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmNoaWxkcmVuICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGN0cmwucHJldmlvdXMucHVzaChjdHJsLm1lbnUpO1xuICAgICAgICAgICAgICAgIGN0cmwubWVudSA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgY3RybC5iYWNrLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwgPSAoKSA9PiB7XG4gICAgICAgICAgICBjdHJsLm1lbnUgPSBjdHJsLnByZXZpb3VzWzBdO1xuICAgICAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdO1xuICAgICAgICAgICAgY3RybC5iYWNrID0gW107XG4gICAgICAgIH07XG5cbiAgICAgICAgY3RybC5hbGxvdyA9IGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGN0cmwua2V5cyAmJiBjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICghaXRlbS5rZXkpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHJsLmtleXMuaW5kZXhPZihpdGVtLmtleSkgPiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIH1dXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQ7IiwicmVxdWlyZSgnLi4vYXR0cmNoYW5nZS9hdHRyY2hhbmdlJyk7XG5cbmxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIGJpbmRpbmdzOiB7XG4gICAgbWVudTogJzwnLFxuICAgIGtleXM6ICc8JyxcbiAgICBoaWRlU2VhcmNoOiAnPT8nLFxuICAgIGlzT3BlbmVkOiAnPT8nLFxuICAgIGljb25GaXJzdExldmVsOiAnQD8nLFxuICAgIHNob3dCdXR0b25GaXJzdExldmVsOiAnPT8nLFxuICAgIHRleHRGaXJzdExldmVsOiAnQD8nLFxuICAgIGRpc2FibGVBbmltYXRpb25zOiAnPT8nLFxuICAgIHNocmlua01vZGU6ICc9PydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcblxuICAgIDxkaXYgc3R5bGU9XCJwYWRkaW5nOiAxNXB4IDE1cHggMHB4IDE1cHg7XCIgbmctaWY9XCIhJGN0cmwuaGlkZVNlYXJjaFwiPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1uZy1tb2RlbD1cIiRjdHJsLnNlYXJjaFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGdtZFwiIHBsYWNlaG9sZGVyPVwiQnVzY2EuLi5cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJiYXJcIj48L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLWJsb2NrIGdtZFwiIGRhdGEtbmctaWY9XCIkY3RybC5zaG93QnV0dG9uRmlyc3RMZXZlbFwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5nb0JhY2tUb0ZpcnN0TGV2ZWwoKVwiIGRhdGEtbmctZGlzYWJsZWQ9XCIhJGN0cmwucHJldmlvdXMubGVuZ3RoXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgPGkgZGF0YS1uZy1jbGFzcz1cIlskY3RybC5pY29uRmlyc3RMZXZlbF1cIj48L2k+XG4gICAgICA8c3BhbiBkYXRhLW5nLWJpbmQ9XCIkY3RybC50ZXh0Rmlyc3RMZXZlbFwiPjwvc3Bhbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDx1bCBtZW51IGRhdGEtbmctY2xhc3M9XCInbGV2ZWwnLmNvbmNhdCgkY3RybC5iYWNrLmxlbmd0aClcIj5cbiAgICAgIDxsaSBjbGFzcz1cImdvYmFjayBnbWQgZ21kLXJpcHBsZVwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnByZXZpb3VzLmxlbmd0aCA+IDBcIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwucHJldigpXCI+XG4gICAgICAgIDxhPlxuICAgICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5cbiAgICAgICAgICAgIGtleWJvYXJkX2Fycm93X2xlZnRcbiAgICAgICAgICA8L2k+XG4gICAgICAgICAgPHNwYW4gZGF0YS1uZy1iaW5kPVwiJGN0cmwuYmFja1skY3RybC5iYWNrLmxlbmd0aCAtIDFdLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuXG4gICAgICA8bGkgY2xhc3M9XCJnbWQgZ21kLXJpcHBsZVwiIFxuICAgICAgICAgIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5tZW51IHwgZmlsdGVyOiRjdHJsLnNlYXJjaFwiXG4gICAgICAgICAgZGF0YS1uZy1zaG93PVwiJGN0cmwuYWxsb3coaXRlbSlcIlxuICAgICAgICAgIG5nLWNsaWNrPVwiJGN0cmwubmV4dChpdGVtLCAkZXZlbnQpXCJcbiAgICAgICAgICBkYXRhLW5nLWNsYXNzPVwiWyEkY3RybC5kaXNhYmxlQW5pbWF0aW9ucyA/ICRjdHJsLnNsaWRlIDogJycsIHtoZWFkZXI6IGl0ZW0udHlwZSA9PSAnaGVhZGVyJywgZGl2aWRlcjogaXRlbS50eXBlID09ICdzZXBhcmF0b3InfV1cIj5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmIGl0ZW0uc3RhdGVcIiB1aS1zcmVmPVwie3tpdGVtLnN0YXRlfX1cIj5cbiAgICAgICAgICAgIDxpIGRhdGEtbmctaWY9XCJpdGVtLmljb25cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5pY29uXCI+PC9pPlxuICAgICAgICAgICAgPHNwYW4gbmctYmluZD1cIml0ZW0ubGFiZWxcIj48L3NwYW4+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5jaGlsZHJlblwiIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnMgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICBrZXlib2FyZF9hcnJvd19yaWdodFxuICAgICAgICAgICAgPC9pPlxuICAgICAgICAgIDwvYT5cblxuICAgICAgICAgIDxhIG5nLWlmPVwiaXRlbS50eXBlICE9ICdzZXBhcmF0b3InICYmICFpdGVtLnN0YXRlXCI+XG4gICAgICAgICAgICA8aSBkYXRhLW5nLWlmPVwiaXRlbS5pY29uXCIgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiIGRhdGEtbmctYmluZD1cIml0ZW0uaWNvblwiPjwvaT5cbiAgICAgICAgICAgIDxzcGFuIG5nLWJpbmQ9XCJpdGVtLmxhYmVsXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGkgZGF0YS1uZy1pZj1cIml0ZW0uY2hpbGRyZW5cIiBjbGFzcz1cIm1hdGVyaWFsLWljb25zIHB1bGwtcmlnaHRcIj5cbiAgICAgICAgICAgICAga2V5Ym9hcmRfYXJyb3dfcmlnaHRcbiAgICAgICAgICAgIDwvaT5cbiAgICAgICAgICA8L2E+XG5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDxuZy10cmFuc2NsdWRlPjwvbmctdHJhbnNjbHVkZT5cblxuICAgIDx1bCBjbGFzcz1cImdsLW1lbnUtY2hldnJvblwiIG5nLWlmPVwiJGN0cmwuc2hyaW5rTW9kZSAmJiAhJGN0cmwuZml4ZWRcIiBuZy1jbGljaz1cIiRjdHJsLm9wZW5NZW51U2hyaW5rKClcIj5cbiAgICAgIDxsaT5cbiAgICAgICAgPGkgY2xhc3M9XCJtYXRlcmlhbC1pY29uc1wiPmNoZXZyb25fbGVmdDwvaT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cblxuICAgIDx1bCBjbGFzcz1cImdsLW1lbnUtY2hldnJvbiB1bmZpeGVkXCIgbmctaWY9XCIkY3RybC5zaHJpbmtNb2RlICYmICRjdHJsLmZpeGVkXCI+XG4gICAgICA8bGkgbmctY2xpY2s9XCIkY3RybC51bmZpeGVkTWVudVNocmluaygpXCI+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5jaGV2cm9uX2xlZnQ8L2k+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgICA8dWwgY2xhc3M9XCJnbC1tZW51LWNoZXZyb24gcG9zc2libHlGaXhlZFwiIG5nLWlmPVwiJGN0cmwucG9zc2libHlGaXhlZFwiPlxuICAgICAgPGxpIG5nLWNsaWNrPVwiJGN0cmwuZml4ZWRNZW51U2hyaW5rKClcIiBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwiZGlzcGxheTogZmxleDsganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcIj5cbiAgICAgIDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiQ2FwYV8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcbiAgICAgICAgICAgIHdpZHRoPVwiNjEzLjQwOHB4XCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHBvc2l0aW9uOiByZWxhdGl2ZTsgaGVpZ2h0OiAxZW07IHdpZHRoOiAzZW07IGZvbnQtc2l6ZTogMS4zM2VtOyBwYWRkaW5nOiAwOyBtYXJnaW46IDA7O1wiICBoZWlnaHQ9XCI2MTMuNDA4cHhcIiB2aWV3Qm94PVwiMCAwIDYxMy40MDggNjEzLjQwOFwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MTMuNDA4IDYxMy40MDg7XCJcbiAgICAgICAgICAgIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG4gICAgICAgIDxnPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNjA1LjI1NCwxNjguOTRMNDQzLjc5Miw3LjQ1N2MtNi45MjQtNi44ODItMTcuMTAyLTkuMjM5LTI2LjMxOS02LjA2OWMtOS4xNzcsMy4xMjgtMTUuODA5LDExLjI0MS0xNy4wMTksMjAuODU1XG4gICAgICAgICAgICBsLTkuMDkzLDcwLjUxMkwyNjcuNTg1LDIxNi40MjhoLTE0Mi42NWMtMTAuMzQ0LDAtMTkuNjI1LDYuMjE1LTIzLjYyOSwxNS43NDZjLTMuOTIsOS41NzMtMS43MSwyMC41MjIsNS41ODksMjcuNzc5XG4gICAgICAgICAgICBsMTA1LjQyNCwxMDUuNDAzTDAuNjk5LDYxMy40MDhsMjQ2LjYzNS0yMTIuODY5bDEwNS40MjMsMTA1LjQwMmM0Ljg4MSw0Ljg4MSwxMS40NSw3LjQ2NywxNy45OTksNy40NjdcbiAgICAgICAgICAgIGMzLjI5NSwwLDYuNjMyLTAuNzA5LDkuNzgtMi4wMDJjOS41NzMtMy45MjIsMTUuNzI2LTEzLjI0NCwxNS43MjYtMjMuNTA0VjM0NS4xNjhsMTIzLjgzOS0xMjMuNzE0bDcwLjQyOS05LjE3NlxuICAgICAgICAgICAgYzkuNjE0LTEuMjUxLDE3LjcyNy03Ljg2MiwyMC44MTMtMTcuMDM5QzYxNC40NzIsMTg2LjAyMSw2MTIuMTM2LDE3NS44MDEsNjA1LjI1NCwxNjguOTR6IE01MDQuODU2LDE3MS45ODVcbiAgICAgICAgICAgIGMtNS41NjgsMC43NTEtMTAuNzYyLDMuMjMyLTE0Ljc0NSw3LjIzN0wzNTIuNzU4LDMxNi41OTZjLTQuNzk2LDQuNzc1LTcuNDY2LDExLjI0Mi03LjQ2NiwxOC4wNDF2OTEuNzQyTDE4Ni40MzcsMjY3LjQ4MWg5MS42OFxuICAgICAgICAgICAgYzYuNzU3LDAsMTMuMjQzLTIuNjY5LDE4LjA0LTcuNDY2TDQzMy41MSwxMjIuNzY2YzMuOTgzLTMuOTgzLDYuNTY5LTkuMTc2LDcuMjU4LTE0Ljc4NmwzLjYyOS0yNy42OTZsODguMTU1LDg4LjExNFxuICAgICAgICAgICAgTDUwNC44NTYsMTcxLjk4NXpcIi8+XG4gICAgICAgIDwvZz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckdGltZW91dCcsICckYXR0cnMnLCAnJGVsZW1lbnQnLCBmdW5jdGlvbiAoJHRpbWVvdXQsICRhdHRycywgJGVsZW1lbnQpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICBjdHJsLmtleXMgPSBjdHJsLmtleXMgfHwgW107XG4gICAgY3RybC5pY29uRmlyc3RMZXZlbCA9IGN0cmwuaWNvbkZpcnN0TGV2ZWwgfHwgJ2dseXBoaWNvbiBnbHlwaGljb24taG9tZSc7XG4gICAgY3RybC5wcmV2aW91cyA9IFtdO1xuICAgIGN0cmwuYmFjayA9IFtdO1xuXG4gICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgY3RybC5kaXNhYmxlQW5pbWF0aW9ucyA9IGN0cmwuZGlzYWJsZUFuaW1hdGlvbnMgfHwgZmFsc2U7XG5cbiAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcblxuICAgICAgY29uc3Qgc3RyaW5nVG9Cb29sZWFuID0gKHN0cmluZykgPT4ge1xuICAgICAgICBzd2l0Y2ggKHN0cmluZy50b0xvd2VyQ2FzZSgpLnRyaW0oKSkge1xuICAgICAgICAgIGNhc2UgXCJ0cnVlXCI6IGNhc2UgXCJ5ZXNcIjogY2FzZSBcIjFcIjogcmV0dXJuIHRydWU7XG4gICAgICAgICAgY2FzZSBcImZhbHNlXCI6IGNhc2UgXCJub1wiOiBjYXNlIFwiMFwiOiBjYXNlIG51bGw6IHJldHVybiBmYWxzZTtcbiAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gQm9vbGVhbihzdHJpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN0cmwuZml4ZWQgPSBzdHJpbmdUb0Jvb2xlYW4oJGF0dHJzLmZpeGVkIHx8ICdmYWxzZScpO1xuICAgICAgY3RybC5maXhlZE1haW4gPSBzdHJpbmdUb0Jvb2xlYW4oJGF0dHJzLmZpeGVkTWFpbiB8fCAnZmFsc2UnKTtcblxuICAgICAgaWYgKGN0cmwuZml4ZWRNYWluKSB7XG4gICAgICAgIGN0cmwuZml4ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbkJhY2tkcm9wQ2xpY2sgPSAoZXZ0KSA9PiB7XG4gICAgICAgIGlmKGN0cmwuc2hyaW5rTW9kZSl7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5hZGRDbGFzcygnY2xvc2VkJyk7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdkaXYuZ21kLW1lbnUtYmFja2Ryb3AnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgICAgIGlmICghY3RybC5maXhlZCB8fCBjdHJsLnNocmlua01vZGUpIHtcbiAgICAgICAgICBsZXQgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgZWxtLmNsYXNzTGlzdC5hZGQoJ2dtZC1tZW51LWJhY2tkcm9wJyk7XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuZWxlbWVudCgnZGl2LmdtZC1tZW51LWJhY2tkcm9wJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpWzBdLmFwcGVuZENoaWxkKGVsbSk7IFxuICAgICAgICAgIH1cbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpLm9uKCdjbGljaycsIG9uQmFja2Ryb3BDbGljayk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW5pdCgpO1xuXG4gICAgICBjb25zdCBzZXRNZW51VG9wID0gKCkgPT4ge1xuICAgICAgICAkdGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGV0IHNpemUgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpLmhlaWdodCgpO1xuICAgICAgICAgIGlmIChzaXplID09IDApIHNldE1lbnVUb3AoKTtcbiAgICAgICAgICBpZiAoY3RybC5maXhlZCkgc2l6ZSA9IDA7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYuY29sbGFwc2VkJykuY3NzKHtcbiAgICAgICAgICAgIHRvcDogc2l6ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY3RybC50b2dnbGVDb250ZW50ID0gKGlzQ29sbGFwc2VkKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoY3RybC5maXhlZCkge1xuICAgICAgICAgICAgY29uc3QgbWFpbkNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLW1haW4nKTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICAgICAgaWYgKGlzQ29sbGFwc2VkKSB7XG4gICAgICAgICAgICAgIGhlYWRlckNvbnRlbnQucmVhZHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldE1lbnVUb3AoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpc0NvbGxhcHNlZCA/IG1haW5Db250ZW50LmFkZENsYXNzKCdjb2xsYXBzZWQnKSA6IG1haW5Db250ZW50LnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgIGlmICghY3RybC5maXhlZE1haW4gJiYgY3RybC5maXhlZCkge1xuICAgICAgICAgICAgICBpc0NvbGxhcHNlZCA/IGhlYWRlckNvbnRlbnQuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpIDogaGVhZGVyQ29udGVudC5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2ZXJpZnlCYWNrZHJvcCA9IChpc0NvbGxhcHNlZCkgPT4ge1xuICAgICAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1oZWFkZXInKTtcbiAgICAgICAgY29uc3QgYmFja0NvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJ2Rpdi5nbWQtbWVudS1iYWNrZHJvcCcpO1xuICAgICAgICBpZiAoaXNDb2xsYXBzZWQgJiYgIWN0cmwuZml4ZWQpIHtcbiAgICAgICAgICBiYWNrQ29udGVudC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgbGV0IHNpemUgPSBoZWFkZXJDb250ZW50LmhlaWdodCgpO1xuICAgICAgICAgIGlmIChzaXplID4gMCAmJiAhY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgICAgICBiYWNrQ29udGVudC5jc3MoeyB0b3A6IHNpemUgfSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBiYWNrQ29udGVudC5jc3MoeyB0b3A6IDAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhY2tDb250ZW50LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICAkdGltZW91dCgoKSA9PiBjdHJsLmlzT3BlbmVkID0gaXNDb2xsYXBzZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3RybC5zaHJpbmtNb2RlKSB7XG4gICAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IC5nbC1tYWluJyk7XG4gICAgICAgIGNvbnN0IGhlYWRlckNvbnRlbnQgPSBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgLmdsLWhlYWRlcicpO1xuICAgICAgICBjb25zdCBuYXZDb250ZW50ID0gYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKTtcbiAgICAgICAgbWFpbkNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgaGVhZGVyQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICBuYXZDb250ZW50LmNzcyh7ICd6LWluZGV4JzogJzEwMDYnfSk7XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudChcIm5hdi5nbC1uYXZcIikuYWRkQ2xhc3MoJ2Nsb3NlZCBjb2xsYXBzZWQnKTtcbiAgICAgICAgdmVyaWZ5QmFja2Ryb3AoIWFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjbG9zZWQnKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhbmd1bGFyLmVsZW1lbnQuZm4uYXR0cmNoYW5nZSkge1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoXCJuYXYuZ2wtbmF2XCIpLmF0dHJjaGFuZ2Uoe1xuICAgICAgICAgIHRyYWNrVmFsdWVzOiB0cnVlLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoZXZudCkge1xuICAgICAgICAgICAgaWYgKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgIGlmKGN0cmwuc2hyaW5rTW9kZSl7XG4gICAgICAgICAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjbG9zZWQnKSA9PSAtMTtcbiAgICAgICAgICAgICAgICB2ZXJpZnlCYWNrZHJvcChjdHJsLnBvc3NpYmx5Rml4ZWQpO1xuICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBjdHJsLnRvZ2dsZUNvbnRlbnQoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgICAgdmVyaWZ5QmFja2Ryb3AoZXZudC5uZXdWYWx1ZS5pbmRleE9mKCdjb2xsYXBzZWQnKSAhPSAtMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWN0cmwuc2hyaW5rTW9kZSkge1xuICAgICAgICAgIGN0cmwudG9nZ2xlQ29udGVudChhbmd1bGFyLmVsZW1lbnQoJ25hdi5nbC1uYXYnKS5oYXNDbGFzcygnY29sbGFwc2VkJykpO1xuICAgICAgICAgIHZlcmlmeUJhY2tkcm9wKGFuZ3VsYXIuZWxlbWVudCgnbmF2LmdsLW5hdicpLmhhc0NsYXNzKCdjb2xsYXBzZWQnKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3RybC4kb25Jbml0ID0gKCkgPT4ge1xuICAgICAgICBpZiAoIWN0cmwuaGFzT3duUHJvcGVydHkoJ3Nob3dCdXR0b25GaXJzdExldmVsJykpIHtcbiAgICAgICAgICBjdHJsLnNob3dCdXR0b25GaXJzdExldmVsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdHJsLnByZXYgPSAoKSA9PiB7XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnO1xuICAgICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXMucG9wKCk7XG4gICAgICAgICAgY3RybC5iYWNrLnBvcCgpO1xuICAgICAgICB9LCAyNTApO1xuICAgICAgfVxuXG4gICAgICBjdHJsLm5leHQgPSAoaXRlbSkgPT4ge1xuICAgICAgICBsZXQgbmF2ID0gYW5ndWxhci5lbGVtZW50KCduYXYuZ2wtbmF2JylbMF07XG4gICAgICAgIGlmIChjdHJsLnNocmlua01vZGUgJiYgbmF2LmNsYXNzTGlzdC5jb250YWlucygnY2xvc2VkJykgJiYgaXRlbS5jaGlsZHJlbiAmJiBhbmd1bGFyLmVsZW1lbnQoJy5ndW1nYS1sYXlvdXQgbmF2LmdsLW5hdicpLmlzKCdbb3Blbi1vbi1ob3Zlcl0nKSkge1xuICAgICAgICAgIGN0cmwub3Blbk1lbnVTaHJpbmsoKTtcbiAgICAgICAgICBjdHJsLm5leHQoaXRlbSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICR0aW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1yaWdodCc7XG4gICAgICAgICAgICBjdHJsLnByZXZpb3VzLnB1c2goY3RybC5tZW51KTtcbiAgICAgICAgICAgIGN0cmwubWVudSA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgICBjdHJsLmJhY2sucHVzaChpdGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDI1MCk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwuZ29CYWNrVG9GaXJzdExldmVsID0gKCkgPT4ge1xuICAgICAgICAvLyBjdHJsLnNsaWRlID0gJ3NsaWRlLWluLWxlZnQnXG4gICAgICAgIGN0cmwubWVudSA9IGN0cmwucHJldmlvdXNbMF1cbiAgICAgICAgY3RybC5wcmV2aW91cyA9IFtdXG4gICAgICAgIGN0cmwuYmFjayA9IFtdXG4gICAgICB9XG5cbiAgICAgIGN0cmwuYWxsb3cgPSBpdGVtID0+IHtcbiAgICAgICAgaWYgKGN0cmwua2V5cyAmJiBjdHJsLmtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGlmICghaXRlbS5rZXkpIHJldHVybiB0cnVlXG4gICAgICAgICAgcmV0dXJuIGN0cmwua2V5cy5pbmRleE9mKGl0ZW0ua2V5KSA+IC0xXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gY3RybC5zbGlkZSA9ICdzbGlkZS1pbi1sZWZ0JztcblxuICAgICAgY3RybC5vcGVuTWVudVNocmluayA9ICgpID0+IHtcbiAgICAgICAgY3RybC5wb3NzaWJseUZpeGVkID0gdHJ1ZTsgXG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnLmd1bWdhLWxheW91dCBuYXYuZ2wtbmF2JykucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgICAgfVxuXG4gICAgICBjdHJsLmZpeGVkTWVudVNocmluayA9ICgpID0+IHtcbiAgICAgICAgJGVsZW1lbnQuYXR0cignZml4ZWQnLCB0cnVlKTtcbiAgICAgICAgY3RybC5maXhlZCA9IHRydWU7XG4gICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IGZhbHNlO1xuICAgICAgICBpbml0KCk7XG4gICAgICAgIG1haW5Db250ZW50LmNzcyh7J21hcmdpbi1sZWZ0JzogJyd9KTtcbiAgICAgICAgaGVhZGVyQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICcnfSk7XG4gICAgICAgIGN0cmwudG9nZ2xlQ29udGVudCh0cnVlKTtcbiAgICAgICAgdmVyaWZ5QmFja2Ryb3AodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGN0cmwudW5maXhlZE1lbnVTaHJpbmsgPSAoKSA9PiB7XG4gICAgICAgICRlbGVtZW50LmF0dHIoJ2ZpeGVkJywgZmFsc2UpO1xuICAgICAgICBjdHJsLmZpeGVkID0gZmFsc2U7XG4gICAgICAgIGN0cmwucG9zc2libHlGaXhlZCA9IHRydWU7XG4gICAgICAgIGluaXQoKTtcbiAgICAgICAgbWFpbkNvbnRlbnQuY3NzKHsnbWFyZ2luLWxlZnQnOiAnNjRweCd9KTtcbiAgICAgICAgaGVhZGVyQ29udGVudC5jc3MoeydtYXJnaW4tbGVmdCc6ICc2NHB4J30pO1xuICAgICAgICB2ZXJpZnlCYWNrZHJvcCh0cnVlKTtcbiAgICAgICAgYW5ndWxhci5lbGVtZW50KCcuZ3VtZ2EtbGF5b3V0IG5hdi5nbC1uYXYnKS5hZGRDbGFzcygnY2xvc2VkJyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgQ29tcG9uZW50ID0ge1xuICBiaW5kaW5nczoge1xuICAgIGljb246ICdAJyxcbiAgICBub3RpZmljYXRpb25zOiAnPScsXG4gICAgb25WaWV3OiAnJj8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXYgbmF2YmFyLXJpZ2h0IG5vdGlmaWNhdGlvbnNcIj5cbiAgICAgIDxsaSBjbGFzcz1cImRyb3Bkb3duXCI+XG4gICAgICAgIDxhIGhyZWY9XCIjXCIgYmFkZ2U9XCJ7eyRjdHJsLm5vdGlmaWNhdGlvbnMubGVuZ3RofX1cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICA8aSBjbGFzcz1cIm1hdGVyaWFsLWljb25zXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuaWNvblwiPjwvaT5cbiAgICAgICAgPC9hPlxuICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+XG4gICAgICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ub3RpZmljYXRpb25zXCIgZGF0YS1uZy1jbGljaz1cIiRjdHJsLnZpZXcoJGV2ZW50LCBpdGVtKVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cIm1lZGlhLW9iamVjdFwiIGRhdGEtbmctc3JjPVwie3tpdGVtLmltYWdlfX1cIj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZWRpYS1ib2R5XCIgZGF0YS1uZy1iaW5kPVwiaXRlbS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICBgLFxuICBjb250cm9sbGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwudmlldyA9IChldmVudCwgaXRlbSkgPT4gY3RybC5vblZpZXcoe2V2ZW50OiBldmVudCwgaXRlbTogaXRlbX0pXG4gICAgfVxuICAgIFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQycsXG4gICAgbGluazogZnVuY3Rpb24oJHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgaWYoIWVsZW1lbnRbMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaXhlZCcpKXtcbiAgICAgICAgZWxlbWVudFswXS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSdcbiAgICAgIH1cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xuICAgICAgZWxlbWVudFswXS5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnXG5cbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUubXNVc2VyU2VsZWN0ID0gJ25vbmUnXG4gICAgICBlbGVtZW50WzBdLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSdcbiAgICAgIGVsZW1lbnRbMF0uc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJ1xuXG4gICAgICBmdW5jdGlvbiBjcmVhdGVSaXBwbGUoZXZ0KSB7XG4gICAgICAgIHZhciByaXBwbGUgPSBhbmd1bGFyLmVsZW1lbnQoJzxzcGFuIGNsYXNzPVwiZ21kLXJpcHBsZS1lZmZlY3QgYW5pbWF0ZVwiPicpLFxuICAgICAgICAgIHJlY3QgPSBlbGVtZW50WzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICAgIHJhZGl1cyA9IE1hdGgubWF4KHJlY3QuaGVpZ2h0LCByZWN0LndpZHRoKSxcbiAgICAgICAgICBsZWZ0ID0gZXZ0LnBhZ2VYIC0gcmVjdC5sZWZ0IC0gcmFkaXVzIC8gMiAtIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcbiAgICAgICAgICB0b3AgPSBldnQucGFnZVkgLSByZWN0LnRvcCAtIHJhZGl1cyAvIDIgLSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblxuICAgICAgICByaXBwbGVbMF0uc3R5bGUud2lkdGggPSByaXBwbGVbMF0uc3R5bGUuaGVpZ2h0ID0gcmFkaXVzICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4JztcbiAgICAgICAgcmlwcGxlWzBdLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIHJpcHBsZS5vbignYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudC5hcHBlbmQocmlwcGxlKTtcbiAgICAgIH1cblxuICAgICAgZWxlbWVudC5iaW5kKCdtb3VzZWRvd24nLCBjcmVhdGVSaXBwbGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHJlcXVpcmU6IFsnbmdNb2RlbCcsJ25nUmVxdWlyZWQnXSxcbiAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgbmdEaXNhYmxlZDogJz0/JyxcbiAgICB1bnNlbGVjdDogJ0A/JyxcbiAgICBvcHRpb25zOiAnPCcsXG4gICAgb3B0aW9uOiAnQCcsXG4gICAgdmFsdWU6ICdAJyxcbiAgICBwbGFjZWhvbGRlcjogJ0A/JyxcbiAgICBvbkNoYW5nZTogXCImP1wiLFxuICAgIHRyYW5zbGF0ZUxhYmVsOiAnPT8nXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJkcm9wZG93biBnbWRcIj5cbiAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmbG9hdGluZy1kcm9wZG93blwiIG5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiPlxuICAgICAge3skY3RybC5wbGFjZWhvbGRlcn19IDxzcGFuIG5nLWlmPVwiJGN0cmwudmFsaWRhdGVHdW1nYUVycm9yXCIgbmctY2xhc3M9XCJ7J2dtZC1zZWxlY3QtcmVxdWlyZWQnOiAkY3RybC5uZ01vZGVsQ3RybC4kZXJyb3IucmVxdWlyZWR9XCI+KjxzcGFuPlxuICAgICA8L2xhYmVsPlxuICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGdtZCBkcm9wZG93bi10b2dnbGUgZ21kLXNlbGVjdC1idXR0b25cIlxuICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgIHN0eWxlPVwiYm9yZGVyLXJhZGl1czogMDtcIlxuICAgICAgICAgICAgIGlkPVwiZ21kU2VsZWN0XCJcbiAgICAgICAgICAgICBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJcbiAgICAgICAgICAgICBuZy1kaXNhYmxlZD1cIiRjdHJsLm5nRGlzYWJsZWRcIlxuICAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcbiAgICAgICAgICAgICBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiaXRlbS1zZWxlY3RcIiBuZy1pZj1cIiEkY3RybC50cmFuc2xhdGVMYWJlbFwiIGRhdGEtbmctc2hvdz1cIiRjdHJsLnNlbGVjdGVkXCIgZGF0YS1uZy1iaW5kPVwiJGN0cmwuc2VsZWN0ZWRcIj48L3NwYW4+XG4gICAgICAgPHNwYW4gY2xhc3M9XCJpdGVtLXNlbGVjdFwiIG5nLWlmPVwiJGN0cmwudHJhbnNsYXRlTGFiZWxcIiBkYXRhLW5nLXNob3c9XCIkY3RybC5zZWxlY3RlZFwiPlxuICAgICAgICAgIHt7ICRjdHJsLnNlbGVjdGVkIHwgZ3VtZ2FUcmFuc2xhdGUgfX1cbiAgICAgICA8L3NwYW4+XG4gICAgICAgPHNwYW4gZGF0YS1uZy1oaWRlPVwiJGN0cmwuc2VsZWN0ZWRcIiBjbGFzcz1cIml0ZW0tc2VsZWN0IHBsYWNlaG9sZGVyXCI+XG4gICAgICAgIHt7JGN0cmwucGxhY2Vob2xkZXJ9fVxuICAgICAgIDwvc3Bhbj5cbiAgICAgICA8c3BhbiBuZy1pZj1cIiRjdHJsLm5nTW9kZWxDdHJsLiRlcnJvci5yZXF1aXJlZCAmJiAkY3RybC52YWxpZGF0ZUd1bWdhRXJyb3JcIiBjbGFzcz1cIndvcmQtcmVxdWlyZWRcIj4qPC9zcGFuPlxuICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+XG4gICAgIDwvYnV0dG9uPlxuICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwiZ21kU2VsZWN0XCIgbmctc2hvdz1cIiRjdHJsLm9wdGlvblwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cbiAgICAgICA8bGkgZGF0YS1uZy1jbGljaz1cIiRjdHJsLmNsZWFyKClcIiBuZy1pZj1cIiRjdHJsLnVuc2VsZWN0XCI+XG4gICAgICAgICA8YSBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogZmFsc2V9XCI+e3skY3RybC51bnNlbGVjdH19PC9hPlxuICAgICAgIDwvbGk+XG4gICAgICAgPGxpIGRhdGEtbmctcmVwZWF0PVwib3B0aW9uIGluICRjdHJsLm9wdGlvbnMgdHJhY2sgYnkgJGluZGV4XCI+XG4gICAgICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KG9wdGlvbilcIiBkYXRhLW5nLWJpbmQ9XCJvcHRpb25bJGN0cmwub3B0aW9uXSB8fCBvcHRpb25cIiBkYXRhLW5nLWNsYXNzPVwie2FjdGl2ZTogJGN0cmwuaXNBY3RpdmUob3B0aW9uKX1cIj48L2E+XG4gICAgICAgPC9saT5cbiAgICAgPC91bD5cbiAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBnbWRcIiBhcmlhLWxhYmVsbGVkYnk9XCJnbWRTZWxlY3RcIiBuZy1zaG93PVwiISRjdHJsLm9wdGlvblwiIHN0eWxlPVwibWF4LWhlaWdodDogMjUwcHg7b3ZlcmZsb3c6IGF1dG87ZGlzcGxheTogbm9uZTtcIiBuZy10cmFuc2NsdWRlPjwvdWw+XG4gICA8L2Rpdj5cbiAgYCxcbiAgY29udHJvbGxlcjogWyckc2NvcGUnLCckYXR0cnMnLCckdGltZW91dCcsJyRlbGVtZW50JywgJyR0cmFuc2NsdWRlJywgJyRjb21waWxlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSwgJGNvbXBpbGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXNcbiAgICAsICAgbmdNb2RlbEN0cmwgPSAkZWxlbWVudC5jb250cm9sbGVyKCduZ01vZGVsJyk7XG5cbiAgICBsZXQgb3B0aW9ucyA9IGN0cmwub3B0aW9ucyB8fCBbXTtcblxuICAgIGN0cmwubmdNb2RlbEN0cmwgICAgICAgID0gbmdNb2RlbEN0cmw7XG4gICAgY3RybC52YWxpZGF0ZUd1bWdhRXJyb3IgPSAkYXR0cnMuaGFzT3duUHJvcGVydHkoJ2d1bWdhUmVxdWlyZWQnKTtcblxuICAgIGZ1bmN0aW9uIGZpbmRQYXJlbnRCeU5hbWUoZWxtLCBwYXJlbnROYW1lKXtcbiAgICAgIGlmKGVsbS5jbGFzc05hbWUgPT0gcGFyZW50TmFtZSl7XG4gICAgICAgIHJldHVybiBlbG07XG4gICAgICB9XG4gICAgICBpZihlbG0ucGFyZW50Tm9kZSl7XG4gICAgICAgIHJldHVybiBmaW5kUGFyZW50QnlOYW1lKGVsbS5wYXJlbnROb2RlLCBwYXJlbnROYW1lKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbG07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJldmVudERlZmF1bHQoZSkge1xuICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgICAgbGV0IHRhcmdldCA9IGZpbmRQYXJlbnRCeU5hbWUoZS50YXJnZXQsICdzZWxlY3Qtb3B0aW9uJyk7XG4gICAgICBpZigodGFyZ2V0Lm5vZGVOYW1lID09ICdBJyAmJiB0YXJnZXQuY2xhc3NOYW1lID09ICdzZWxlY3Qtb3B0aW9uJykgfHwgKGUudGFyZ2V0Lm5vZGVOYW1lID09ICdBJyAmJiBlLnRhcmdldC5jbGFzc05hbWUgPT0gJ3NlbGVjdC1vcHRpb24nKSl7XG4gICAgICAgIGxldCBkaXJlY3Rpb24gPSBmaW5kU2Nyb2xsRGlyZWN0aW9uT3RoZXJCcm93c2VycyhlKVxuICAgICAgICBsZXQgc2Nyb2xsVG9wID0gYW5ndWxhci5lbGVtZW50KHRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUpLnNjcm9sbFRvcCgpO1xuICAgICAgICBpZihzY3JvbGxUb3AgKyBhbmd1bGFyLmVsZW1lbnQodGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZSkuaW5uZXJIZWlnaHQoKSA+PSB0YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnNjcm9sbEhlaWdodCAmJiBkaXJlY3Rpb24gIT0gJ1VQJyl7XG4gICAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpXG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1lbHNlIGlmKHNjcm9sbFRvcCA8PSAwICAmJiBkaXJlY3Rpb24gIT0gJ0RPV04nKXtcbiAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1lbHNle1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdClcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRTY3JvbGxEaXJlY3Rpb25PdGhlckJyb3dzZXJzKGV2ZW50KXtcbiAgICAgIHZhciBkZWx0YTtcbiAgICAgIGlmIChldmVudC53aGVlbERlbHRhKXtcbiAgICAgICAgZGVsdGEgPSBldmVudC53aGVlbERlbHRhO1xuICAgICAgfWVsc2V7XG4gICAgICAgIGRlbHRhID0gLTEgKmV2ZW50LmRlbHRhWTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWx0YSA8IDApe1xuICAgICAgICByZXR1cm4gXCJET1dOXCI7XG4gICAgICB9ZWxzZSBpZiAoZGVsdGEgPiAwKXtcbiAgICAgICAgcmV0dXJuIFwiVVBcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdEZvclNjcm9sbEtleXMoZSkge1xuICAgICAgICBpZiAoa2V5cyAmJiBrZXlzW2Uua2V5Q29kZV0pIHtcbiAgICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuY2xlYXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXNhYmxlU2Nyb2xsKCkge1xuICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHByZXZlbnREZWZhdWx0LCBmYWxzZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIHByZXZlbnREZWZhdWx0LCBmYWxzZSk7XG4gICAgICB9XG4gICAgICB3aW5kb3cub253aGVlbCA9IHByZXZlbnREZWZhdWx0OyAvLyBtb2Rlcm4gc3RhbmRhcmRcbiAgICAgIHdpbmRvdy5vbm1vdXNld2hlZWwgPSBkb2N1bWVudC5vbm1vdXNld2hlZWwgPSBwcmV2ZW50RGVmYXVsdDsgLy8gb2xkZXIgYnJvd3NlcnMsIElFXG4gICAgICB3aW5kb3cub250b3VjaG1vdmUgID0gcHJldmVudERlZmF1bHQ7IC8vIG1vYmlsZVxuICAgICAgZG9jdW1lbnQub25rZXlkb3duICA9IHByZXZlbnREZWZhdWx0Rm9yU2Nyb2xsS2V5cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbmFibGVTY3JvbGwoKSB7XG4gICAgICAgIGlmICh3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcilcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIHByZXZlbnREZWZhdWx0LCBmYWxzZSk7XG4gICAgICAgIHdpbmRvdy5vbm1vdXNld2hlZWwgPSBkb2N1bWVudC5vbm1vdXNld2hlZWwgPSBudWxsO1xuICAgICAgICB3aW5kb3cub253aGVlbCA9IG51bGw7XG4gICAgICAgIHdpbmRvdy5vbnRvdWNobW92ZSA9IG51bGw7XG4gICAgICAgIGRvY3VtZW50Lm9ua2V5ZG93biA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0T2Zmc2V0ID0gZWwgPT4ge1xuICAgICAgICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLFxuICAgICAgICBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgICBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgbGV0IF94ID0gMCwgX3kgPSAwO1xuICAgICAgICB3aGlsZSggZWwgJiYgIWlzTmFOKCBlbC5vZmZzZXRMZWZ0ICkgJiYgIWlzTmFOKCBlbC5vZmZzZXRUb3AgKSApIHtcbiAgICAgICAgICAgIF94ICs9IGVsLm9mZnNldExlZnQgLSBlbC5zY3JvbGxMZWZ0OyAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoZWwubm9kZU5hbWUgPT0gJ0JPRFknKXtcbiAgICAgICAgICAgICAgX3kgKz0gZWwub2Zmc2V0VG9wIC0gTWF0aC5tYXgoIGFuZ3VsYXIuZWxlbWVudChcImh0bWxcIikuc2Nyb2xsVG9wKCksIGFuZ3VsYXIuZWxlbWVudChcImJvZHlcIikuc2Nyb2xsVG9wKCkgKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICBfeSArPSBlbC5vZmZzZXRUb3AgLSBlbC5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbCA9IGVsLm9mZnNldFBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyB0b3A6IF95LCBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGxMZWZ0IH1cbiAgICB9XG5cbiAgICBjb25zdCBnZXRFbGVtZW50TWF4SGVpZ2h0ID0gKGVsbSkgPT4ge1xuICAgICAgdmFyIHNjcm9sbFBvc2l0aW9uID0gTWF0aC5tYXgoIGFuZ3VsYXIuZWxlbWVudChcImh0bWxcIikuc2Nyb2xsVG9wKCksIGFuZ3VsYXIuZWxlbWVudChcImJvZHlcIikuc2Nyb2xsVG9wKCkgKTtcbiAgICAgIHZhciBlbGVtZW50T2Zmc2V0ID0gZWxtLm9mZnNldCgpLnRvcDtcbiAgICAgIHZhciBlbGVtZW50RGlzdGFuY2UgPSAoZWxlbWVudE9mZnNldCAtIHNjcm9sbFBvc2l0aW9uKTtcbiAgICAgIHZhciB3aW5kb3dIZWlnaHQgPSBhbmd1bGFyLmVsZW1lbnQod2luZG93KS5oZWlnaHQoKTtcbiAgICAgIHJldHVybiB3aW5kb3dIZWlnaHQgLSBlbGVtZW50RGlzdGFuY2U7XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxpbmdFbGVtZW50U3R5bGUgPSAoJGVsZW1lbnQsIHVscykgPT4ge1xuICAgICAgbGV0IFNJWkVfQk9UVE9NX0RJU1RBTkNFID0gNTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGdldE9mZnNldCgkZWxlbWVudFswXSk7XG5cbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCh1bHMsIHVsID0+IHtcbiAgICAgICAgaWYoYW5ndWxhci5lbGVtZW50KHVsKS5oZWlnaHQoKSA9PSAwKSByZXR1cm47XG4gICAgICAgIGxldCBtYXhIZWlnaHQgPSBnZXRFbGVtZW50TWF4SGVpZ2h0KGFuZ3VsYXIuZWxlbWVudCgkZWxlbWVudFswXSkpO1xuICAgICAgICBpZihhbmd1bGFyLmVsZW1lbnQodWwpLmhlaWdodCgpID4gbWF4SGVpZ2h0KXtcbiAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodWwpLmNzcyh7XG4gICAgICAgICAgICBoZWlnaHQ6IG1heEhlaWdodCAtIFNJWkVfQk9UVE9NX0RJU1RBTkNFICsgJ3B4J1xuICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZSBpZihhbmd1bGFyLmVsZW1lbnQodWwpLmhlaWdodCgpICE9IChtYXhIZWlnaHQgLVNJWkVfQk9UVE9NX0RJU1RBTkNFKSl7XG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KHVsKS5jc3Moe1xuICAgICAgICAgICAgaGVpZ2h0OiAnYXV0bydcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCh1bCkuY3NzKHtcbiAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIGxlZnQ6IHBvc2l0aW9uLmxlZnQtMSArICdweCcsXG4gICAgICAgICAgdG9wOiBwb3NpdGlvbi50b3AtMiArICdweCcsXG4gICAgICAgICAgd2lkdGg6ICRlbGVtZW50LmZpbmQoJ2Rpdi5kcm9wZG93bicpWzBdLmNsaWVudFdpZHRoICsgMVxuICAgICAgICB9KTtcblxuXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBoYW5kbGluZ0VsZW1lbnRJbkJvZHkgPSAoZWxtLCB1bHMpID0+IHtcbiAgICAgIHZhciBib2R5ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKCdib2R5JykuZXEoMCk7XG4gICAgICBsZXQgZGl2ID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAgIGRpdi5hZGRDbGFzcyhcImRyb3Bkb3duIGdtZFwiKTtcbiAgICAgIGRpdi5hcHBlbmQodWxzKTtcbiAgICAgIGJvZHkuYXBwZW5kKGRpdik7XG4gICAgICBhbmd1bGFyLmVsZW1lbnQoZWxtLmZpbmQoJ2J1dHRvbi5kcm9wZG93bi10b2dnbGUnKSkuYXR0cmNoYW5nZSh7XG4gICAgICAgICAgdHJhY2tWYWx1ZXM6IHRydWUsXG4gICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGV2bnQpIHtcbiAgICAgICAgICAgIGlmKGV2bnQuYXR0cmlidXRlTmFtZSA9PSAnYXJpYS1leHBhbmRlZCcgJiYgZXZudC5uZXdWYWx1ZSA9PSAnZmFsc2UnKXtcbiAgICAgICAgICAgICAgZW5hYmxlU2Nyb2xsKCk7XG4gICAgICAgICAgICAgIHVscyA9IGFuZ3VsYXIuZWxlbWVudChkaXYpLmZpbmQoJ3VsJyk7XG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh1bHMsIHVsID0+IHtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQodWwpLmNzcyh7XG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnbm9uZSdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgZWxtLmZpbmQoJ2Rpdi5kcm9wZG93bicpLmFwcGVuZCh1bHMpO1xuICAgICAgICAgICAgICBkaXYucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgJGVsZW1lbnQuYmluZCgnY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBsZXQgdWxzID0gJGVsZW1lbnQuZmluZCgndWwnKTtcbiAgICAgIGlmKHVscy5maW5kKCdnbWQtb3B0aW9uJykubGVuZ3RoID09IDApe1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaGFuZGxpbmdFbGVtZW50U3R5bGUoJGVsZW1lbnQsIHVscyk7ICAgIFxuICAgICAgZGlzYWJsZVNjcm9sbCgpO1xuICAgICAgaGFuZGxpbmdFbGVtZW50SW5Cb2R5KCRlbGVtZW50LCB1bHMpO1xuICAgIH0pXG5cbiAgICBjdHJsLnNlbGVjdCA9IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgYW5ndWxhci5mb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIGN0cmwubmdNb2RlbCA9IG9wdGlvbi5uZ1ZhbHVlXG4gICAgICBjdHJsLnNlbGVjdGVkID0gb3B0aW9uLm5nTGFiZWxcbiAgICB9O1xuXG4gICAgY3RybC5hZGRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgIH07XG5cbiAgICBsZXQgc2V0U2VsZWN0ZWQgPSAodmFsdWUpID0+IHtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChvcHRpb25zLCBvcHRpb24gPT4ge1xuICAgICAgICBpZiAob3B0aW9uLm5nVmFsdWUuJCRoYXNoS2V5KSB7XG4gICAgICAgICAgZGVsZXRlIG9wdGlvbi5uZ1ZhbHVlLiQkaGFzaEtleVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbmd1bGFyLmVxdWFscyh2YWx1ZSwgb3B0aW9uLm5nVmFsdWUpKSB7XG4gICAgICAgICAgY3RybC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgICR0aW1lb3V0KCgpID0+IHNldFNlbGVjdGVkKGN0cmwubmdNb2RlbCkpO1xuXG4gICAgY3RybC4kZG9DaGVjayA9ICgpID0+IHtcbiAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGVuZ3RoID4gMCkgc2V0U2VsZWN0ZWQoY3RybC5uZ01vZGVsKVxuICAgIH1cblxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIHJlcXVpcmU6IHtcbiAgICAgIGdtZFNlbGVjdEN0cmw6ICdeZ21kU2VsZWN0J1xuICAgIH0sXG4gICAgYmluZGluZ3M6IHtcbiAgICB9LFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICA8YSBjbGFzcz1cInNlbGVjdC1vcHRpb25cIiBkYXRhLW5nLWNsaWNrPVwiJGN0cmwuc2VsZWN0KClcIiBuZy10cmFuc2NsdWRlPjwvYT5cbiAgICBgLFxuICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGF0dHJzJywnJHRpbWVvdXQnLCckZWxlbWVudCcsJyR0cmFuc2NsdWRlJywgZnVuY3Rpb24oJHNjb3BlLCRhdHRycywkdGltZW91dCwkZWxlbWVudCwkdHJhbnNjbHVkZSkge1xuICAgICAgbGV0IGN0cmwgPSB0aGlzO1xuIFxuICAgICAgY3RybC5zZWxlY3QgPSAoKSA9PiB7XG4gICAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5zZWxlY3QodGhpcyk7XG4gICAgICB9XG4gICAgICBcbiAgICB9XVxuICB9XG4gIFxuICBleHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiAgIiwibGV0IENvbXBvbmVudCA9IHtcbiAgLy8gcmVxdWlyZTogWyduZ01vZGVsJywnbmdSZXF1aXJlZCddLFxuICB0cmFuc2NsdWRlOiB0cnVlLFxuICByZXF1aXJlOiB7XG4gICAgZ21kU2VsZWN0Q3RybDogJ15nbWRTZWxlY3QnXG4gIH0sXG4gIGJpbmRpbmdzOiB7XG4gICAgbmdWYWx1ZTogJz0nLFxuICAgIG5nTGFiZWw6ICc9J1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhIGNsYXNzPVwic2VsZWN0LW9wdGlvblwiIGRhdGEtbmctY2xpY2s9XCIkY3RybC5zZWxlY3QoJGN0cmwubmdWYWx1ZSwgJGN0cmwubmdMYWJlbClcIiBuZy1jbGFzcz1cInthY3RpdmU6ICRjdHJsLnNlbGVjdGVkfVwiIG5nLXRyYW5zY2x1ZGU+PC9hPlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICBjdHJsLiRvbkluaXQgPSAoKSA9PiB7XG4gICAgICBjdHJsLmdtZFNlbGVjdEN0cmwuYWRkT3B0aW9uKHRoaXMpXG4gICAgfVxuICAgIFxuICAgIGN0cmwuc2VsZWN0ID0gKCkgPT4ge1xuICAgICAgY3RybC5nbWRTZWxlY3RDdHJsLnNlbGVjdChjdHJsKTtcbiAgICAgIGlmKGN0cmwuZ21kU2VsZWN0Q3RybC5vbkNoYW5nZSl7XG4gICAgICAgIGN0cmwuZ21kU2VsZWN0Q3RybC5vbkNoYW5nZSh7dmFsdWU6IHRoaXMubmdWYWx1ZX0pO1xuICAgICAgfVxuICAgIH1cblxuICB9XVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnRcbiIsImxldCBDb21wb25lbnQgPSB7XG4gIHRyYW5zY2x1ZGU6IHRydWUsXG4gIHJlcXVpcmU6IHtcbiAgICBnbWRTZWxlY3RDdHJsOiAnXmdtZFNlbGVjdCdcbiAgfSxcbiAgYmluZGluZ3M6IHtcbiAgICBuZ01vZGVsOiAnPScsXG4gICAgcGxhY2Vob2xkZXI6ICdAPydcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtiYWNrZ3JvdW5kOiAjZjlmOWY5O1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiIGlkPVwiYmFzaWMtYWRkb24xXCIgc3R5bGU9XCJib3JkZXI6IG5vbmU7XCI+XG4gICAgICAgIDxpIGNsYXNzPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+XG4gICAgICA8L3NwYW4+XG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBzdHlsZT1cImJvcmRlcjogbm9uZTtcIiBjbGFzcz1cImZvcm0tY29udHJvbCBnbWRcIiBuZy1tb2RlbD1cIiRjdHJsLm5nTW9kZWxcIiBwbGFjZWhvbGRlcj1cInt7JGN0cmwucGxhY2Vob2xkZXJ9fVwiPlxuICAgIDwvZGl2PlxuICBgLFxuICBjb250cm9sbGVyOiBbJyRzY29wZScsJyRhdHRycycsJyR0aW1lb3V0JywnJGVsZW1lbnQnLCckdHJhbnNjbHVkZScsIGZ1bmN0aW9uKCRzY29wZSwkYXR0cnMsJHRpbWVvdXQsJGVsZW1lbnQsJHRyYW5zY2x1ZGUpIHtcbiAgICBsZXQgY3RybCA9IHRoaXM7XG5cbiAgICAkZWxlbWVudC5iaW5kKCdjbGljaycsIChldnQpID0+IHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KVxuXG4gIH1dXG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudFxuIiwibGV0IENvbXBvbmVudCA9IHtcbiAgYmluZGluZ3M6IHtcbiAgICBkaWFtZXRlcjogXCJAP1wiLFxuICAgIGJveCAgICAgOiBcIj0/XCJcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInNwaW5uZXItbWF0ZXJpYWxcIiBuZy1pZj1cIiRjdHJsLmRpYW1ldGVyXCI+XG4gICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIlxuICAgICAgICB2ZXJzaW9uPVwiMVwiXG4gICAgICAgIG5nLWNsYXNzPVwieydzcGlubmVyLWJveCcgOiAkY3RybC5ib3h9XCJcbiAgICAgICAgc3R5bGU9XCJ3aWR0aDoge3skY3RybC5kaWFtZXRlcn19O2hlaWdodDoge3skY3RybC5kaWFtZXRlcn19O1wiXG4gICAgICAgIHZpZXdCb3g9XCIwIDAgMjggMjhcIj5cbiAgICA8ZyBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlclwiPlxuICAgICA8cGF0aCBjbGFzcz1cInFwLWNpcmN1bGFyLWxvYWRlci1wYXRoXCIgZmlsbD1cIm5vbmVcIiBkPVwiTSAxNCwxLjUgQSAxMi41LDEyLjUgMCAxIDEgMS41LDE0XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIC8+XG4gICAgPC9nPlxuICAgPC9zdmc+XG4gIDwvZGl2PmAsXG4gIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckYXR0cnMnLCckdGltZW91dCcsICckcGFyc2UnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0aW1lb3V0LCRwYXJzZSkge1xuICAgIGxldCBjdHJsID0gdGhpcztcblxuICAgIGN0cmwuJG9uSW5pdCA9ICgpID0+IHtcbiAgICAgIGN0cmwuZGlhbWV0ZXIgPSBjdHJsLmRpYW1ldGVyIHx8ICc1MHB4JztcbiAgICB9XG5cbiAgfV1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50XG4iLCJsZXQgUHJvdmlkZXIgPSAoKSA9PiB7XG5cbiAgICBjb25zdCBzZXRFbGVtZW50SHJlZiA9IChocmVmKSA9PiB7XG4gICAgICAgIGxldCBlbG0gPSBhbmd1bGFyLmVsZW1lbnQoJ2xpbmtbaHJlZio9XCJndW1nYS1sYXlvdXRcIl0nKTtcbiAgICAgICAgaWYoZWxtICYmIGVsbVswXSl7XG4gICAgICAgICAgICBlbG0uYXR0cignaHJlZicsIGhyZWYpO1xuICAgICAgICB9XG4gICAgICAgIGVsbSA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJykpO1xuICAgICAgICBlbG0uYXR0cignaHJlZicsIGhyZWYpO1xuICAgICAgICBlbG0uYXR0cigncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbG1bMF0pO1xuICAgIH1cblxuICAgIGNvbnN0IHNldFRoZW1lRGVmYXVsdCA9ICh0aGVtZU5hbWUsIHNhdmUpID0+IHtcbiAgICAgICAgbGV0IHNyYywgdGhlbWVEZWZhdWx0ID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnZ21kLXRoZW1lLWRlZmF1bHQnKTtcbiAgICAgICAgaWYodGhlbWVOYW1lICYmICF0aGVtZURlZmF1bHQpe1xuICAgICAgICAgICAgaWYoc2F2ZSkgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZ21kLXRoZW1lLWRlZmF1bHQnLCB0aGVtZU5hbWUpO1xuICAgICAgICAgICAgc3JjID0gJ2d1bWdhLWxheW91dC8nK3RoZW1lTmFtZSsnL2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBpZih0aGVtZURlZmF1bHQpe1xuICAgICAgICAgICAgICAgIHNyYyA9ICdndW1nYS1sYXlvdXQvJyt0aGVtZURlZmF1bHQrJy9ndW1nYS1sYXlvdXQubWluLmNzcyc7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0L2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRFbGVtZW50SHJlZihzcmMpO1xuICAgIH1cblxuICAgIGNvbnN0IHNldFRoZW1lID0gKHRoZW1lTmFtZSwgdXBkYXRlU2Vzc2lvbikgPT4ge1xuICAgICAgICB2YXIgc3JjLCB0aGVtZURlZmF1bHQgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdnbWQtdGhlbWUnKTtcblxuICAgICAgICBpZigodGhlbWVOYW1lICYmIHVwZGF0ZVNlc3Npb24pIHx8ICh0aGVtZU5hbWUgJiYgIXRoZW1lRGVmYXVsdCkpe1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZ21kLXRoZW1lJywgdGhlbWVOYW1lKTtcbiAgICAgICAgICAgIHNyYyA9ICdndW1nYS1sYXlvdXQvJyArIHRoZW1lTmFtZSArICcvZ3VtZ2EtbGF5b3V0Lm1pbi5jc3MnO1xuICAgICAgICAgICAgc2V0RWxlbWVudEhyZWYoc3JjKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoZW1lTmFtZSAmJiAhdXBkYXRlU2Vzc2lvbil7XG4gICAgICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0LycgKyB0aGVtZURlZmF1bHQgKyAnL2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgICAgIHNldEVsZW1lbnRIcmVmKHNyYyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzcmMgPSAnZ3VtZ2EtbGF5b3V0L2d1bWdhLWxheW91dC5taW4uY3NzJztcbiAgICAgICAgc2V0RWxlbWVudEhyZWYoc3JjKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0VGhlbWVEZWZhdWx0OiBzZXRUaGVtZURlZmF1bHQsIFxuICAgICAgICBzZXRUaGVtZTogc2V0VGhlbWUsIFxuICAgICAgICAkZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzZXRUaGVtZURlZmF1bHQ6IHNldFRoZW1lRGVmYXVsdCxcbiAgICAgICAgICAgICAgICBzZXRUaGVtZTogc2V0VGhlbWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG5cblByb3ZpZGVyLiRpbmplY3QgPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvdmlkZXI7XG4iLCJpbXBvcnQgTWVudSAgICAgICAgIGZyb20gJy4vbWVudS9jb21wb25lbnQuanMnO1xuaW1wb3J0IE1lbnVTaHJpbmsgICAgICAgICBmcm9tICcuL21lbnUtc2hyaW5rL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgR21kTm90aWZpY2F0aW9uIGZyb20gJy4vbm90aWZpY2F0aW9uL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgU2VsZWN0ICAgICAgIGZyb20gJy4vc2VsZWN0L2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgU2VsZWN0U2VhcmNoICAgICAgIGZyb20gJy4vc2VsZWN0L3NlYXJjaC9jb21wb25lbnQuanMnO1xuaW1wb3J0IE9wdGlvbiAgICAgICBmcm9tICcuL3NlbGVjdC9vcHRpb24vY29tcG9uZW50LmpzJztcbmltcG9ydCBPcHRpb25FbXB0eSAgICAgICBmcm9tICcuL3NlbGVjdC9lbXB0eS9jb21wb25lbnQuanMnO1xuaW1wb3J0IElucHV0ICAgICAgICBmcm9tICcuL2lucHV0L2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgUmlwcGxlICAgICAgIGZyb20gJy4vcmlwcGxlL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgRmFiICAgICAgICAgIGZyb20gJy4vZmFiL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgU3Bpbm5lciAgICAgIGZyb20gJy4vc3Bpbm5lci9jb21wb25lbnQuanMnO1xuaW1wb3J0IEhhbWJ1cmdlciAgICAgIGZyb20gJy4vaGFtYnVyZ2VyL2NvbXBvbmVudC5qcyc7XG5pbXBvcnQgQWxlcnQgICAgICBmcm9tICcuL2FsZXJ0L3Byb3ZpZGVyLmpzJztcbmltcG9ydCBUaGVtZSAgICAgIGZyb20gJy4vdGhlbWUvcHJvdmlkZXIuanMnO1xuXG5hbmd1bGFyXG4gIC5tb2R1bGUoJ2d1bWdhLmxheW91dCcsIFtdKVxuICAucHJvdmlkZXIoJyRnbWRBbGVydCcsIEFsZXJ0KVxuICAucHJvdmlkZXIoJyRnbWRUaGVtZScsIFRoZW1lKVxuICAuZGlyZWN0aXZlKCdnbWRSaXBwbGUnLCBSaXBwbGUpXG4gIC5jb21wb25lbnQoJ2dsTWVudScsIE1lbnUpXG4gIC5jb21wb25lbnQoJ21lbnVTaHJpbmsnLCBNZW51U2hyaW5rKVxuICAuY29tcG9uZW50KCdnbE5vdGlmaWNhdGlvbicsIEdtZE5vdGlmaWNhdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kU2VsZWN0JywgU2VsZWN0KVxuICAuY29tcG9uZW50KCdnbWRTZWxlY3RTZWFyY2gnLCBTZWxlY3RTZWFyY2gpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbkVtcHR5JywgT3B0aW9uRW1wdHkpXG4gIC5jb21wb25lbnQoJ2dtZE9wdGlvbicsIE9wdGlvbilcbiAgLmNvbXBvbmVudCgnZ21kSW5wdXQnLCBJbnB1dClcbiAgLmNvbXBvbmVudCgnZ21kRmFiJywgRmFiKVxuICAuY29tcG9uZW50KCdnbWRTcGlubmVyJywgU3Bpbm5lcilcbiAgLmNvbXBvbmVudCgnZ21kSGFtYnVyZ2VyJywgSGFtYnVyZ2VyKVxuIl19
