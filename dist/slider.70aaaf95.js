// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../script/slider.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * ChiefSlider by Itchief v2.0.0 (https://github.com/itchief/ui-components/tree/master/simple-adaptive-slider)
 * Copyright 2020 - 2022 Alexander Maltsev
 * Licensed under MIT (https://github.com/itchief/ui-components/blob/master/LICENSE)
 */
var WRAPPER_SELECTOR = '.slider__wrapper';
var ITEMS_SELECTOR = '.slider__items';
var ITEM_SELECTOR = '.slider__item';
var CONTROL_CLASS = 'slider__control';
var SELECTOR_PREV = '.slider__control[data-slide="prev"]';
var SELECTOR_NEXT = '.slider__control[data-slide="next"]';
var SELECTOR_INDICATOR = '.slider__indicators>li';
var SLIDER_TRANSITION_OFF = 'slider_disable-transition';
var CLASS_CONTROL_HIDE = 'slider__control_hide';
var CLASS_ITEM_ACTIVE = 'slider__item_active';
var CLASS_INDICATOR_ACTIVE = 'active';

var ChiefSlider = /*#__PURE__*/function () {
  function ChiefSlider(selector, config) {
    _classCallCheck(this, ChiefSlider);

    // элементы слайдера
    var $root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this._$root = $root;
    this._$wrapper = $root.querySelector(WRAPPER_SELECTOR);
    this._$items = $root.querySelector(ITEMS_SELECTOR);
    this._$itemList = $root.querySelectorAll(ITEM_SELECTOR);
    this._$controlPrev = $root.querySelector(SELECTOR_PREV);
    this._$controlNext = $root.querySelector(SELECTOR_NEXT);
    this._$indicatorList = $root.querySelectorAll(SELECTOR_INDICATOR); // экстремальные значения слайдов

    this._minOrder = 0;
    this._maxOrder = 0;
    this._$itemWithMinOrder = null;
    this._$itemWithMaxOrder = null;
    this._minTranslate = 0;
    this._maxTranslate = 0; // направление смены слайдов (по умолчанию)

    this._direction = 'next'; // determines whether the position of item needs to be determined

    this._balancingItemsFlag = false;
    this._activeItems = []; // текущее значение трансформации

    this._transform = 0; // swipe параметры

    this._hasSwipeState = false;
    this.__swipeStartPos = 0; // slider properties

    this._transform = 0; // текущее значение трансформации

    this._intervalId = null; // configuration of the slider

    this._config = {
      loop: true,
      autoplay: true,
      interval: 3000,
      refresh: true,
      swipe: true
    };
    this._config = Object.assign(this._config, config); // create some constants

    var $itemList = this._$itemList;
    var widthItem = $itemList[0].offsetWidth;
    var widthWrapper = this._$wrapper.offsetWidth;
    var itemsInVisibleArea = Math.round(widthWrapper / widthItem); // initial setting properties

    this._widthItem = widthItem;
    this._widthWrapper = widthWrapper;
    this._itemsInVisibleArea = itemsInVisibleArea;
    this._transformStep = 100 / itemsInVisibleArea; // initial setting order and translate items

    for (var i = 0, length = $itemList.length; i < length; i++) {
      $itemList[i].dataset.index = i;
      $itemList[i].dataset.order = i;
      $itemList[i].dataset.translate = 0;

      if (i < itemsInVisibleArea) {
        this._activeItems.push(i);
      }
    }

    if (this._config.loop) {
      // перемещаем последний слайд перед первым
      var count = $itemList.length - 1;
      var translate = -$itemList.length * 100;
      $itemList[count].dataset.order = -1;
      $itemList[count].dataset.translate = -$itemList.length * 100;
      $itemList[count].style.transform = "translateX(".concat(translate, "%)");

      this.__refreshExtremeValues();
    } else if (this._$controlPrev) {
      this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
    }

    this._setActiveClass();

    this._addEventListener();

    this._updateIndicators();

    this._autoplay();
  }

  _createClass(ChiefSlider, [{
    key: "_addEventListener",
    value: function _addEventListener() {
      var $root = this._$root;
      var $items = this._$items;
      var config = this._config;

      function onClick(e) {
        var $target = e.target;

        this._autoplay('stop');

        if ($target.classList.contains(CONTROL_CLASS)) {
          e.preventDefault();
          this._direction = $target.dataset.slide;

          this._move();
        } else if ($target.dataset.slideTo) {
          var index = parseInt($target.dataset.slideTo, 10);

          this._moveTo(index);
        }

        if (this._config.loop) {
          this._autoplay();
        }
      }

      function onMouseEnter() {
        this._autoplay('stop');
      }

      function onMouseLeave() {
        this._autoplay();
      }

      function onTransitionStart() {
        if (this._balancingItemsFlag) {
          return;
        }

        this._balancingItemsFlag = true;
        window.requestAnimationFrame(this._balancingItems.bind(this));
      }

      function onTransitionEnd() {
        this._balancingItemsFlag = false;
      }

      function onResize() {
        window.requestAnimationFrame(this._refresh.bind(this));
      }

      function onSwipeStart(e) {
        this._autoplay('stop');

        var event = e.type.search('touch') === 0 ? e.touches[0] : e;
        this._swipeStartPos = event.clientX;
        this._hasSwipeState = true;
      }

      function onSwipeEnd(e) {
        if (!this._hasSwipeState) {
          return;
        }

        var event = e.type.search('touch') === 0 ? e.changedTouches[0] : e;
        var diffPos = this._swipeStartPos - event.clientX;

        if (diffPos > 50) {
          this._direction = 'next';

          this._move();
        } else if (diffPos < -50) {
          this._direction = 'prev';

          this._move();
        }

        this._hasSwipeState = false;

        if (this._config.loop) {
          this._autoplay();
        }
      }

      function onDragStart(e) {
        e.preventDefault();
      }

      function onVisibilityChange() {
        if (document.visibilityState === 'hidden') {
          this._autoplay('stop');
        } else if (document.visibilityState === 'visible') {
          if (this._config.loop) {
            this._autoplay();
          }
        }
      }

      $root.addEventListener('click', onClick.bind(this));
      $root.addEventListener('mouseenter', onMouseEnter.bind(this));
      $root.addEventListener('mouseleave', onMouseLeave.bind(this)); // on resize

      if (config.refresh) {
        window.addEventListener('resize', onResize.bind(this));
      } // on transitionstart and transitionend


      if (config.loop) {
        $items.addEventListener('transition-start', onTransitionStart.bind(this));
        $items.addEventListener('transitionend', onTransitionEnd.bind(this));
      } // on touchstart and touchend


      if (config.swipe) {
        $root.addEventListener('touchstart', onSwipeStart.bind(this));
        $root.addEventListener('mousedown', onSwipeStart.bind(this));
        document.addEventListener('touchend', onSwipeEnd.bind(this));
        document.addEventListener('mouseup', onSwipeEnd.bind(this));
      }

      $root.addEventListener('dragstart', onDragStart.bind(this)); // при изменении активности вкладки

      document.addEventListener('visibilitychange', onVisibilityChange.bind(this));
    }
  }, {
    key: "__refreshExtremeValues",
    value: function __refreshExtremeValues() {
      var $itemList = this._$itemList;
      this._minOrder = +$itemList[0].dataset.order;
      this._maxOrder = this._minOrder;
      this._$itemByMinOrder = $itemList[0];
      this._$itemByMaxOrder = $itemList[0];
      this._minTranslate = +$itemList[0].dataset.translate;
      this._maxTranslate = this._minTranslate;

      for (var i = 0, length = $itemList.length; i < length; i++) {
        var $item = $itemList[i];
        var order = +$item.dataset.order;

        if (order < this._minOrder) {
          this._minOrder = order;
          this._$itemByMinOrder = $item;
          this._minTranslate = +$item.dataset.translate;
        } else if (order > this._maxOrder) {
          this._maxOrder = order;
          this._$itemByMaxOrder = $item;
          this._maxTranslate = +$item.dataset.translate;
        }
      }
    }
  }, {
    key: "_balancingItems",
    value: function _balancingItems() {
      if (!this._balancingItemsFlag) {
        return;
      }

      var $wrapper = this._$wrapper;
      var $wrapperClientRect = $wrapper.getBoundingClientRect();
      var widthHalfItem = $wrapperClientRect.width / this._itemsInVisibleArea / 2;
      var count = this._$itemList.length;
      var translate;
      var clientRect;

      if (this._direction === 'next') {
        var wrapperLeft = $wrapperClientRect.left;
        var $min = this._$itemByMinOrder;
        translate = this._minTranslate;
        clientRect = $min.getBoundingClientRect();

        if (clientRect.right < wrapperLeft - widthHalfItem) {
          $min.dataset.order = this._minOrder + count;
          translate += count * 100;
          $min.dataset.translate = translate;
          $min.style.transform = "translateX(".concat(translate, "%)"); // update values of extreme properties

          this.__refreshExtremeValues();
        }
      } else {
        var wrapperRight = $wrapperClientRect.right;
        var $max = this._$itemByMaxOrder;
        translate = this._maxTranslate;
        clientRect = $max.getBoundingClientRect();

        if (clientRect.left > wrapperRight + widthHalfItem) {
          $max.dataset.order = this._maxOrder - count;
          translate -= count * 100;
          $max.dataset.translate = translate;
          $max.style.transform = "translateX(".concat(translate, "%)"); // update values of extreme properties

          this.__refreshExtremeValues();
        }
      } // updating...


      requestAnimationFrame(this._balancingItems.bind(this));
    }
  }, {
    key: "_setActiveClass",
    value: function _setActiveClass() {
      var activeItems = this._activeItems;
      var $itemList = this._$itemList;

      for (var i = 0, length = $itemList.length; i < length; i++) {
        var $item = $itemList[i];
        var index = +$item.dataset.index;

        if (activeItems.indexOf(index) > -1) {
          $item.classList.add(CLASS_ITEM_ACTIVE);
        } else {
          $item.classList.remove(CLASS_ITEM_ACTIVE);
        }
      }
    }
  }, {
    key: "_updateIndicators",
    value: function _updateIndicators() {
      var $indicatorList = this._$indicatorList;
      var $itemList = this._$itemList;

      if (!$indicatorList.length) {
        return;
      }

      for (var index = 0, length = $itemList.length; index < length; index++) {
        var $item = $itemList[index];

        if ($item.classList.contains(CLASS_ITEM_ACTIVE)) {
          $indicatorList[index].classList.add(CLASS_INDICATOR_ACTIVE);
        } else {
          $indicatorList[index].classList.remove(CLASS_INDICATOR_ACTIVE);
        }
      }
    }
  }, {
    key: "_move",
    value: function _move() {
      var step = this._direction === 'next' ? -this._transformStep : this._transformStep;
      var transform = this._transform + step;

      if (!this._config.loop) {
        var endTransformValue = this._transformStep * (this._$itemList.length - this._itemsInVisibleArea);
        transform = Math.round(transform * 10) / 10;

        if (transform < -endTransformValue || transform > 0) {
          return;
        }

        this._$controlPrev.classList.remove(CLASS_CONTROL_HIDE);

        this._$controlNext.classList.remove(CLASS_CONTROL_HIDE);

        if (transform === -endTransformValue) {
          this._$controlNext.classList.add(CLASS_CONTROL_HIDE);
        } else if (transform === 0) {
          this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
        }
      }

      var activeIndex = [];
      var i = 0;
      var length;
      var index;
      var newIndex;

      if (this._direction === 'next') {
        for (i = 0, length = this._activeItems.length; i < length; i++) {
          index = this._activeItems[i];
          index += 1;
          newIndex = index;

          if (newIndex > this._$itemList.length - 1) {
            newIndex -= this._$itemList.length;
          }

          activeIndex.push(newIndex);
        }
      } else {
        for (i = 0, length = this._activeItems.length; i < length; i++) {
          index = this._activeItems[i];
          index -= 1;
          newIndex = index;

          if (newIndex < 0) {
            newIndex += this._$itemList.length;
          }

          activeIndex.push(newIndex);
        }
      }

      this._activeItems = activeIndex;

      this._setActiveClass();

      this._updateIndicators();

      this._transform = transform;
      this._$items.style.transform = "translateX(".concat(transform, "%)");

      this._$items.dispatchEvent(new CustomEvent('transition-start', {
        bubbles: true
      }));
    }
  }, {
    key: "_moveToNext",
    value: function _moveToNext() {
      this._direction = 'next';

      this._move();
    }
  }, {
    key: "_moveToPrev",
    value: function _moveToPrev() {
      this._direction = 'prev';

      this._move();
    }
  }, {
    key: "_moveTo",
    value: function _moveTo(index) {
      var $indicatorList = this._$indicatorList;
      var nearestIndex = null;
      var diff = null;
      var i;
      var length;

      for (i = 0, length = $indicatorList.length; i < length; i++) {
        var $indicator = $indicatorList[i];

        if ($indicator.classList.contains(CLASS_INDICATOR_ACTIVE)) {
          var slideTo = +$indicator.dataset.slideTo;

          if (diff === null) {
            nearestIndex = slideTo;
            diff = Math.abs(index - nearestIndex);
          } else if (Math.abs(index - slideTo) < diff) {
            nearestIndex = slideTo;
            diff = Math.abs(index - nearestIndex);
          }
        }
      }

      diff = index - nearestIndex;

      if (diff === 0) {
        return;
      }

      this._direction = diff > 0 ? 'next' : 'prev';

      for (i = 1; i <= Math.abs(diff); i++) {
        this._move();
      }
    }
  }, {
    key: "_autoplay",
    value: function _autoplay(action) {
      var _this = this;

      if (!this._config.autoplay) {
        return;
      }

      if (action === 'stop') {
        clearInterval(this._intervalId);
        this._intervalId = null;
        return;
      }

      if (this._intervalId === null) {
        this._intervalId = setInterval(function () {
          _this._direction = 'next';

          _this._move();
        }, this._config.interval);
      }
    }
  }, {
    key: "_refresh",
    value: function _refresh() {
      var _this2 = this;

      // create some constants
      var $itemList = this._$itemList;
      var widthItem = $itemList[0].offsetWidth;
      var widthWrapper = this._$wrapper.offsetWidth;
      var itemsInVisibleArea = Math.round(widthWrapper / widthItem);

      if (itemsInVisibleArea === this._itemsInVisibleArea) {
        return;
      }

      this._autoplay('stop');

      this._$items.classList.add(SLIDER_TRANSITION_OFF);

      this._$items.style.transform = 'translateX(0)'; // setting properties after reset

      this._widthItem = widthItem;
      this._widthWrapper = widthWrapper;
      this._itemsInVisibleArea = itemsInVisibleArea;
      this._transform = 0;
      this._transformStep = 100 / itemsInVisibleArea;
      this._balancingItemsFlag = false;
      this._activeItems = []; // setting order and translate items after reset

      for (var i = 0, length = $itemList.length; i < length; i++) {
        var $item = $itemList[i];
        var position = i;
        $item.dataset.index = position;
        $item.dataset.order = position;
        $item.dataset.translate = 0;
        $item.style.transform = 'translateX(0)';

        if (position < itemsInVisibleArea) {
          this._activeItems.push(position);
        }
      }

      this._setActiveClass();

      this._updateIndicators();

      window.requestAnimationFrame(function () {
        _this2._$items.classList.remove(SLIDER_TRANSITION_OFF);
      }); // hide prev arrow for non-infinite slider

      if (!this._config.loop) {
        if (this._$controlPrev) {
          this._$controlPrev.classList.add(CLASS_CONTROL_HIDE);
        }

        return;
      } // translate last item before first


      var count = $itemList.length - 1;
      var translate = -$itemList.length * 100;
      $itemList[count].dataset.order = -1;
      $itemList[count].dataset.translate = -$itemList.length * 100;
      $itemList[count].style.transform = 'translateX('.concat(translate, '%)'); // update values of extreme properties

      this.__refreshExtremeValues(); // calling _autoplay


      this._autoplay();
    }
  }, {
    key: "next",
    value: function next() {
      this._moveToNext();
    }
  }, {
    key: "prev",
    value: function prev() {
      this._moveToPrev();
    }
  }, {
    key: "moveTo",
    value: function moveTo(index) {
      this._moveTo(index);
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this._refresh();
    }
  }]);

  return ChiefSlider;
}();

document.addEventListener('DOMContentLoaded', function () {
  new ChiefSlider('.slider');
});
},{}],"../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64865" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../../script/slider.js"], null)
//# sourceMappingURL=/slider.70aaaf95.js.map