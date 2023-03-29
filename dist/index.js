(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.monitor = {}));
})(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function getAugmentedNamespace(n) {
    if (n.__esModule) return n;
    var f = n.default;
  	if (typeof f == "function") {
  		var a = function a () {
  			if (this instanceof a) {
  				var args = [null];
  				args.push.apply(args, arguments);
  				var Ctor = Function.bind.apply(f, args);
  				return new Ctor();
  			}
  			return f.apply(this, arguments);
  		};
  		a.prototype = f.prototype;
    } else a = {};
    Object.defineProperty(a, '__esModule', {value: true});
  	Object.keys(n).forEach(function (k) {
  		var d = Object.getOwnPropertyDescriptor(n, k);
  		Object.defineProperty(a, k, d.get ? d : {
  			enumerable: true,
  			get: function () {
  				return n[k];
  			}
  		});
  	});
  	return a;
  }

  var global$o = require('../internals/global');
  var getOwnPropertyDescriptor$1 = require('../internals/object-get-own-property-descriptor').f;
  var createNonEnumerableProperty$6 = require('../internals/create-non-enumerable-property');
  var defineBuiltIn$a = require('../internals/define-built-in');
  var defineGlobalProperty$3 = require('../internals/define-global-property');
  var copyConstructorProperties$1 = require('../internals/copy-constructor-properties');
  var isForced$2 = require('../internals/is-forced');

  /*
    options.target         - name of the target object
    options.global         - target is the global object
    options.stat           - export as static methods of target
    options.proto          - export as prototype methods of target
    options.real           - real prototype method for the `pure` version
    options.forced         - export even if the native feature is available
    options.bind           - bind methods to the target, required for the `pure` version
    options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe         - use the simple assignment of property instead of delete + defineProperty
    options.sham           - add a flag to not completely full polyfills
    options.enumerable     - export as enumerable property
    options.dontCallGetSet - prevent calling a getter on target
    options.name           - the .name of the function if it does not match the key
  */
  module.exports = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global$o;
    } else if (STATIC) {
      target = global$o[TARGET] || defineGlobalProperty$3(TARGET, {});
    } else {
      target = (global$o[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.dontCallGetSet) {
        descriptor = getOwnPropertyDescriptor$1(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced$2(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (_typeof(sourceProperty) == _typeof(targetProperty)) continue;
        copyConstructorProperties$1(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || targetProperty && targetProperty.sham) {
        createNonEnumerableProperty$6(sourceProperty, 'sham', true);
      }
      defineBuiltIn$a(target, key, sourceProperty, options);
    }
  };

  var _export = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$0$8 = /*@__PURE__*/getAugmentedNamespace(_export);

  /* eslint-disable no-proto -- safe */
  var uncurryThisAccessor = require('../internals/function-uncurry-this-accessor');
  var anObject$b = require('../internals/an-object');
  var aPossiblePrototype = require('../internals/a-possible-prototype');

  // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  // Works with __proto__ only. Old v8 can't work with null proto objects.
  // eslint-disable-next-line es/no-object-setprototypeof -- safe
  module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
      setter(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) {/* empty */}
    return function setPrototypeOf(O, proto) {
      anObject$b(O);
      aPossiblePrototype(proto);
      if (CORRECT_SETTER) setter(O, proto);else O.__proto__ = proto;
      return O;
    };
  }() : undefined);

  var objectSetPrototypeOf = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$6$2 = /*@__PURE__*/getAugmentedNamespace(objectSetPrototypeOf);

  var $$v = require$$0$8;
  var setPrototypeOf$2 = require$$6$2;

  // `Object.setPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.setprototypeof
  $$v({
    target: 'Object',
    stat: true
  }, {
    setPrototypeOf: setPrototypeOf$2
  });

  var $$u = require('../internals/export');
  var DESCRIPTORS$c = require('../internals/descriptors');
  var defineProperty$6 = require('../internals/object-define-property').f;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  $$u({
    target: 'Object',
    stat: true,
    forced: Object.defineProperty !== defineProperty$6,
    sham: !DESCRIPTORS$c
  }, {
    defineProperty: defineProperty$6
  });

  var fails$h = require('../internals/fails');

  // Detect IE8's incomplete defineProperty implementation
  module.exports = !fails$h(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, {
      get: function get() {
        return 7;
      }
    })[1] != 7;
  });

  var descriptors = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$3$5 = /*@__PURE__*/getAugmentedNamespace(descriptors);

  /* global ActiveXObject -- old IE, WSH */
  var anObject$a = require('../internals/an-object');
  var definePropertiesModule$1 = require('../internals/object-define-properties');
  var enumBugKeys = require('../internals/enum-bug-keys');
  var hiddenKeys$1 = require('../internals/hidden-keys');
  var html$1 = require('../internals/html');
  var documentCreateElement = require('../internals/document-create-element');
  var sharedKey$3 = require('../internals/shared-key');
  var GT = '>';
  var LT = '<';
  var PROTOTYPE$1 = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO = sharedKey$3('IE_PROTO');
  var EmptyConstructor = function EmptyConstructor() {/* empty */};
  var scriptTag = function scriptTag(content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function NullProtoObjectViaActiveX(activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function NullProtoObjectViaIFrame() {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html$1.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var _NullProtoObject = function NullProtoObject() {
    try {
      activeXDocument = new ActiveXObject('htmlfile');
    } catch (error) {/* ignore */}
    _NullProtoObject = typeof document != 'undefined' ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) // old IE
    : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument); // WSH
    var length = enumBugKeys.length;
    while (length--) delete _NullProtoObject[PROTOTYPE$1][enumBugKeys[length]];
    return _NullProtoObject();
  };
  hiddenKeys$1[IE_PROTO] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  // eslint-disable-next-line es/no-object-create -- safe
  module.exports = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE$1] = anObject$a(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO] = O;
    } else result = _NullProtoObject();
    return Properties === undefined ? result : definePropertiesModule$1.f(result, Properties);
  };

  var objectCreate = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$2$5 = /*@__PURE__*/getAugmentedNamespace(objectCreate);

  // TODO: Remove from `core-js@4`
  var $$t = require$$0$8;
  var DESCRIPTORS$b = require$$3$5;
  var create = require$$2$5;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  $$t({
    target: 'Object',
    stat: true,
    sham: !DESCRIPTORS$b
  }, {
    create: create
  });

  var $$s = require('../internals/export');
  var assign = require('../internals/object-assign');

  // `Object.assign` method
  // https://tc39.es/ecma262/#sec-object.assign
  // eslint-disable-next-line es/no-object-assign -- required for testing
  $$s({
    target: 'Object',
    stat: true,
    arity: 2,
    forced: Object.assign !== assign
  }, {
    assign: assign
  });

  var $$r = require('../internals/export');
  var uncurryThis$j = require('../internals/function-uncurry-this-clause');
  var $indexOf = require('../internals/array-includes').indexOf;
  var arrayMethodIsStrict$1 = require('../internals/array-method-is-strict');
  var nativeIndexOf = uncurryThis$j([].indexOf);
  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
  var FORCED$4 = NEGATIVE_ZERO || !arrayMethodIsStrict$1('indexOf');

  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  $$r({
    target: 'Array',
    proto: true,
    forced: FORCED$4
  }, {
    indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
      var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
      return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf(this, searchElement, fromIndex) || 0 : $indexOf(this, searchElement, fromIndex);
    }
  });

  var $$q = require$$0$8;
  var global$n = require$$3$4;

  // `globalThis` object
  // https://tc39.es/ecma262/#sec-globalthis
  $$q({
    global: true,
    forced: global$n.globalThis !== global$n
  }, {
    globalThis: global$n
  });

  var check = function check(it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) == 'object' && globalThis) || check((typeof window === "undefined" ? "undefined" : _typeof(window)) == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check((typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self) || check((typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  function () {
    return this;
  }() || Function('return this')();

  var global$m = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$3$4 = /*@__PURE__*/getAugmentedNamespace(global$m);

  var sharedExports = {};
  var shared$6 = {
    get exports(){ return sharedExports; },
    set exports(v){ sharedExports = v; },
  };

  var global$l = require('../internals/global');

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var defineProperty$5 = Object.defineProperty;
  module.exports = function (key, value) {
    try {
      defineProperty$5(global$l, key, {
        value: value,
        configurable: true,
        writable: true
      });
    } catch (error) {
      global$l[key] = value;
    }
    return value;
  };

  var defineGlobalProperty$2 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$1$6 = /*@__PURE__*/getAugmentedNamespace(defineGlobalProperty$2);

  var global$k = require$$3$4;
  var defineGlobalProperty$1 = require$$1$6;
  var SHARED = '__core-js_shared__';
  var store$2 = global$k[SHARED] || defineGlobalProperty$1(SHARED, {});
  var sharedStore = store$2;

  var store$1 = sharedStore;
  (shared$6.exports = function (key, value) {
    return store$1[key] || (store$1[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.29.1',
    mode: 'global',
    copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
    license: 'https://github.com/zloirock/core-js/blob/v3.29.1/LICENSE',
    source: 'https://github.com/zloirock/core-js'
  });

  // TODO: Remove from `core-js@4`
  var $$p = require('../internals/export');
  var bind$5 = require('../internals/function-bind');

  // `Function.prototype.bind` method
  // https://tc39.es/ecma262/#sec-function.prototype.bind
  // eslint-disable-next-line es/no-function-prototype-bind -- detection
  $$p({
    target: 'Function',
    proto: true,
    forced: Function.bind !== bind$5
  }, {
    bind: bind$5
  });

  var NATIVE_BIND$2 = require('../internals/function-bind-native');
  var FunctionPrototype$1 = Function.prototype;
  var call$f = FunctionPrototype$1.call;
  var uncurryThisWithBind = NATIVE_BIND$2 && FunctionPrototype$1.bind.bind(call$f, call$f);
  module.exports = NATIVE_BIND$2 ? uncurryThisWithBind : function (fn) {
    return function () {
      return call$f.apply(fn, arguments);
    };
  };

  var functionUncurryThis = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$0$7 = /*@__PURE__*/getAugmentedNamespace(functionUncurryThis);

  // we can't use just `it == null` since of `document.all` special case
  // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
  var isNullOrUndefined$6 = function (it) {
    return it === null || it === undefined;
  };

  var isNullOrUndefined$5 = isNullOrUndefined$6;
  var $TypeError$9 = TypeError;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$6 = function (it) {
    if (isNullOrUndefined$5(it)) throw $TypeError$9("Can't call method on " + it);
    return it;
  };

  var requireObjectCoercible$5 = requireObjectCoercible$6;
  var $Object$3 = Object;

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject$3 = function (argument) {
    return $Object$3(requireObjectCoercible$5(argument));
  };

  var uncurryThis$i = require$$0$7;
  var toObject$2 = toObject$3;
  var hasOwnProperty = uncurryThis$i({}.hasOwnProperty);

  // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  // eslint-disable-next-line es/no-object-hasown -- safe
  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty(toObject$2(it), key);
  };

  var uncurryThis$h = require('../internals/function-uncurry-this');
  var id$1 = 0;
  var postfix = Math.random();
  var toString$b = uncurryThis$h(1.0.toString);
  module.exports = function (key) {
    return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$b(++id$1 + postfix, 36);
  };

  var uid$3 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$3$3 = /*@__PURE__*/getAugmentedNamespace(uid$3);

  var $$o = require('../internals/export');
  var exec$4 = require('../internals/regexp-exec');

  // `RegExp.prototype.exec` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.exec
  $$o({
    target: 'RegExp',
    proto: true,
    forced: /./.exec !== exec$4
  }, {
    exec: exec$4
  });

  var $$n = require('../internals/export');
  var fails$g = require('../internals/fails');
  var isArray$3 = require('../internals/is-array');
  var isObject$8 = require('../internals/is-object');
  var toObject$1 = require('../internals/to-object');
  var lengthOfArrayLike$3 = require('../internals/length-of-array-like');
  var doesNotExceedSafeInteger = require('../internals/does-not-exceed-safe-integer');
  var createProperty$2 = require('../internals/create-property');
  var arraySpeciesCreate = require('../internals/array-species-create');
  var arrayMethodHasSpeciesSupport$2 = require('../internals/array-method-has-species-support');
  var wellKnownSymbol$h = require('../internals/well-known-symbol');
  var V8_VERSION$3 = require('../internals/engine-v8-version');
  var IS_CONCAT_SPREADABLE = wellKnownSymbol$h('isConcatSpreadable');

  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/679
  var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION$3 >= 51 || !fails$g(function () {
    var array = [];
    array[IS_CONCAT_SPREADABLE] = false;
    return array.concat()[0] !== array;
  });
  var isConcatSpreadable = function isConcatSpreadable(O) {
    if (!isObject$8(O)) return false;
    var spreadable = O[IS_CONCAT_SPREADABLE];
    return spreadable !== undefined ? !!spreadable : isArray$3(O);
  };
  var FORCED$3 = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport$2('concat');

  // `Array.prototype.concat` method
  // https://tc39.es/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  $$n({
    target: 'Array',
    proto: true,
    arity: 1,
    forced: FORCED$3
  }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    concat: function concat(arg) {
      var O = toObject$1(this);
      var A = arraySpeciesCreate(O, 0);
      var n = 0;
      var i, k, length, len, E;
      for (i = -1, length = arguments.length; i < length; i++) {
        E = i === -1 ? O : arguments[i];
        if (isConcatSpreadable(E)) {
          len = lengthOfArrayLike$3(E);
          doesNotExceedSafeInteger(n + len);
          for (k = 0; k < len; k++, n++) if (k in E) createProperty$2(A, n, E[k]);
        } else {
          doesNotExceedSafeInteger(n + 1);
          createProperty$2(A, n++, E);
        }
      }
      A.length = n;
      return A;
    }
  });

  var apply$4 = require('../internals/function-apply');
  var call$e = require('../internals/function-call');
  var uncurryThis$g = require('../internals/function-uncurry-this');
  var fixRegExpWellKnownSymbolLogic$2 = require('../internals/fix-regexp-well-known-symbol-logic');
  var fails$f = require('../internals/fails');
  var anObject$9 = require('../internals/an-object');
  var isCallable$k = require('../internals/is-callable');
  var isNullOrUndefined$4 = require('../internals/is-null-or-undefined');
  var toIntegerOrInfinity$4 = require('../internals/to-integer-or-infinity');
  var toLength$4 = require('../internals/to-length');
  var toString$a = require('../internals/to-string');
  var requireObjectCoercible$4 = require('../internals/require-object-coercible');
  var advanceStringIndex$2 = require('../internals/advance-string-index');
  var getMethod$4 = require('../internals/get-method');
  var getSubstitution = require('../internals/get-substitution');
  var regExpExec$2 = require('../internals/regexp-exec-abstract');
  var wellKnownSymbol$g = require('../internals/well-known-symbol');
  var REPLACE = wellKnownSymbol$g('replace');
  var max$2 = Math.max;
  var min$3 = Math.min;
  var concat = uncurryThis$g([].concat);
  var push$2 = uncurryThis$g([].push);
  var stringIndexOf$1 = uncurryThis$g(''.indexOf);
  var stringSlice$6 = uncurryThis$g(''.slice);
  var maybeToString = function maybeToString(it) {
    return it === undefined ? it : String(it);
  };

  // IE <= 11 replaces $0 with the whole match, as if it was $&
  // https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
  var REPLACE_KEEPS_$0 = function () {
    // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
    return 'a'.replace(/./, '$0') === '$0';
  }();

  // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
    if (/./[REPLACE]) {
      return /./[REPLACE]('a', '$0') === '';
    }
    return false;
  }();
  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$f(function () {
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = {
        a: '7'
      };
      return result;
    };
    // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
    return ''.replace(re, '$<a>') !== '7';
  });

  // @@replace logic
  fixRegExpWellKnownSymbolLogic$2('replace', function (_, nativeReplace, maybeCallNative) {
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
    return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible$4(this);
      var replacer = isNullOrUndefined$4(searchValue) ? undefined : getMethod$4(searchValue, REPLACE);
      return replacer ? call$e(replacer, searchValue, O, replaceValue) : call$e(nativeReplace, toString$a(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject$9(this);
      var S = toString$a(string);
      if (typeof replaceValue == 'string' && stringIndexOf$1(replaceValue, UNSAFE_SUBSTITUTE) === -1 && stringIndexOf$1(replaceValue, '$<') === -1) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }
      var functionalReplace = isCallable$k(replaceValue);
      if (!functionalReplace) replaceValue = toString$a(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec$2(rx, S);
        if (result === null) break;
        push$2(results, result);
        if (!global) break;
        var matchStr = toString$a(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex$2(S, toLength$4(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = toString$a(result[0]);
        var position = max$2(min$3(toIntegerOrInfinity$4(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) push$2(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat([matched], captures, position, S);
          if (namedCaptures !== undefined) push$2(replacerArgs, namedCaptures);
          var replacement = toString$a(apply$4(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice$6(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice$6(S, nextSourcePosition);
    }];
  }, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

  var DESCRIPTORS$a = require('../internals/descriptors');
  var global$j = require('../internals/global');
  var uncurryThis$f = require('../internals/function-uncurry-this');
  var isForced$1 = require('../internals/is-forced');
  var inheritIfRequired = require('../internals/inherit-if-required');
  var createNonEnumerableProperty$5 = require('../internals/create-non-enumerable-property');
  var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
  var isPrototypeOf$5 = require('../internals/object-is-prototype-of');
  var isRegExp$1 = require('../internals/is-regexp');
  var toString$9 = require('../internals/to-string');
  var getRegExpFlags$1 = require('../internals/regexp-get-flags');
  var stickyHelpers$1 = require('../internals/regexp-sticky-helpers');
  var proxyAccessor = require('../internals/proxy-accessor');
  var defineBuiltIn$9 = require('../internals/define-built-in');
  var fails$e = require('../internals/fails');
  var hasOwn$b = require('../internals/has-own-property');
  var enforceInternalState$1 = require('../internals/internal-state').enforce;
  var setSpecies$2 = require('../internals/set-species');
  var wellKnownSymbol$f = require('../internals/well-known-symbol');
  var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
  var UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg');
  var MATCH = wellKnownSymbol$f('match');
  var NativeRegExp = global$j.RegExp;
  var RegExpPrototype$1 = NativeRegExp.prototype;
  var SyntaxError = global$j.SyntaxError;
  var exec$3 = uncurryThis$f(RegExpPrototype$1.exec);
  var charAt$3 = uncurryThis$f(''.charAt);
  var replace$3 = uncurryThis$f(''.replace);
  var stringIndexOf = uncurryThis$f(''.indexOf);
  var stringSlice$5 = uncurryThis$f(''.slice);
  // TODO: Use only proper RegExpIdentifierName
  var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
  var re1 = /a/g;
  var re2 = /a/g;

  // "new" should create a new object, old webkit bug
  var CORRECT_NEW = new NativeRegExp(re1) !== re1;
  var MISSED_STICKY = stickyHelpers$1.MISSED_STICKY;
  var UNSUPPORTED_Y$1 = stickyHelpers$1.UNSUPPORTED_Y;
  var BASE_FORCED = DESCRIPTORS$a && (!CORRECT_NEW || MISSED_STICKY || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG || fails$e(function () {
    re2[MATCH] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
  }));
  var handleDotAll = function handleDotAll(string) {
    var length = string.length;
    var index = 0;
    var result = '';
    var brackets = false;
    var chr;
    for (; index <= length; index++) {
      chr = charAt$3(string, index);
      if (chr === '\\') {
        result += chr + charAt$3(string, ++index);
        continue;
      }
      if (!brackets && chr === '.') {
        result += '[\\s\\S]';
      } else {
        if (chr === '[') {
          brackets = true;
        } else if (chr === ']') {
          brackets = false;
        }
        result += chr;
      }
    }
    return result;
  };
  var handleNCG = function handleNCG(string) {
    var length = string.length;
    var index = 0;
    var result = '';
    var named = [];
    var names = {};
    var brackets = false;
    var ncg = false;
    var groupid = 0;
    var groupname = '';
    var chr;
    for (; index <= length; index++) {
      chr = charAt$3(string, index);
      if (chr === '\\') {
        chr = chr + charAt$3(string, ++index);
      } else if (chr === ']') {
        brackets = false;
      } else if (!brackets) switch (true) {
        case chr === '[':
          brackets = true;
          break;
        case chr === '(':
          if (exec$3(IS_NCG, stringSlice$5(string, index + 1))) {
            index += 2;
            ncg = true;
          }
          result += chr;
          groupid++;
          continue;
        case chr === '>' && ncg:
          if (groupname === '' || hasOwn$b(names, groupname)) {
            throw new SyntaxError('Invalid capture group name');
          }
          names[groupname] = true;
          named[named.length] = [groupname, groupid];
          ncg = false;
          groupname = '';
          continue;
      }
      if (ncg) groupname += chr;else result += chr;
    }
    return [result, named];
  };

  // `RegExp` constructor
  // https://tc39.es/ecma262/#sec-regexp-constructor
  if (isForced$1('RegExp', BASE_FORCED)) {
    var RegExpWrapper = function RegExp(pattern, flags) {
      var thisIsRegExp = isPrototypeOf$5(RegExpPrototype$1, this);
      var patternIsRegExp = isRegExp$1(pattern);
      var flagsAreUndefined = flags === undefined;
      var groups = [];
      var rawPattern = pattern;
      var rawFlags, dotAll, sticky, handled, result, state;
      if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
        return pattern;
      }
      if (patternIsRegExp || isPrototypeOf$5(RegExpPrototype$1, pattern)) {
        pattern = pattern.source;
        if (flagsAreUndefined) flags = getRegExpFlags$1(rawPattern);
      }
      pattern = pattern === undefined ? '' : toString$9(pattern);
      flags = flags === undefined ? '' : toString$9(flags);
      rawPattern = pattern;
      if (UNSUPPORTED_DOT_ALL && 'dotAll' in re1) {
        dotAll = !!flags && stringIndexOf(flags, 's') > -1;
        if (dotAll) flags = replace$3(flags, /s/g, '');
      }
      rawFlags = flags;
      if (MISSED_STICKY && 'sticky' in re1) {
        sticky = !!flags && stringIndexOf(flags, 'y') > -1;
        if (sticky && UNSUPPORTED_Y$1) flags = replace$3(flags, /y/g, '');
      }
      if (UNSUPPORTED_NCG) {
        handled = handleNCG(pattern);
        pattern = handled[0];
        groups = handled[1];
      }
      result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);
      if (dotAll || sticky || groups.length) {
        state = enforceInternalState$1(result);
        if (dotAll) {
          state.dotAll = true;
          state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
        }
        if (sticky) state.sticky = true;
        if (groups.length) state.groups = groups;
      }
      if (pattern !== rawPattern) try {
        // fails in old engines, but we have no alternatives for unsupported regex syntax
        createNonEnumerableProperty$5(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
      } catch (error) {/* empty */}
      return result;
    };
    for (var keys$1 = getOwnPropertyNames(NativeRegExp), index = 0; keys$1.length > index;) {
      proxyAccessor(RegExpWrapper, NativeRegExp, keys$1[index++]);
    }
    RegExpPrototype$1.constructor = RegExpWrapper;
    RegExpWrapper.prototype = RegExpPrototype$1;
    defineBuiltIn$9(global$j, 'RegExp', RegExpWrapper, {
      constructor: true
    });
  }

  // https://tc39.es/ecma262/#sec-get-regexp-@@species
  setSpecies$2('RegExp');

  var DESCRIPTORS$9 = require('../internals/descriptors');
  var FUNCTION_NAME_EXISTS = require('../internals/function-name').EXISTS;
  var uncurryThis$e = require('../internals/function-uncurry-this');
  var defineBuiltInAccessor$4 = require('../internals/define-built-in-accessor');
  var FunctionPrototype = Function.prototype;
  var functionToString = uncurryThis$e(FunctionPrototype.toString);
  var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
  var regExpExec$1 = uncurryThis$e(nameRE.exec);
  var NAME = 'name';

  // Function instances `.name` property
  // https://tc39.es/ecma262/#sec-function-instances-name
  if (DESCRIPTORS$9 && !FUNCTION_NAME_EXISTS) {
    defineBuiltInAccessor$4(FunctionPrototype, NAME, {
      configurable: true,
      get: function get() {
        try {
          return regExpExec$1(nameRE, functionToString(this))[1];
        } catch (error) {
          return '';
        }
      }
    });
  }

  var PROPER_FUNCTION_NAME$1 = require('../internals/function-name').PROPER;
  var defineBuiltIn$8 = require('../internals/define-built-in');
  var anObject$8 = require('../internals/an-object');
  var $toString$1 = require('../internals/to-string');
  var fails$d = require('../internals/fails');
  var getRegExpFlags = require('../internals/regexp-get-flags');
  var TO_STRING$1 = 'toString';
  var RegExpPrototype = RegExp.prototype;
  var nativeToString = RegExpPrototype[TO_STRING$1];
  var NOT_GENERIC = fails$d(function () {
    return nativeToString.call({
      source: 'a',
      flags: 'b'
    }) != '/a/b';
  });
  // FF44- RegExp#toString has a wrong name
  var INCORRECT_NAME = PROPER_FUNCTION_NAME$1 && nativeToString.name != TO_STRING$1;

  // `RegExp.prototype.toString` method
  // https://tc39.es/ecma262/#sec-regexp.prototype.tostring
  if (NOT_GENERIC || INCORRECT_NAME) {
    defineBuiltIn$8(RegExp.prototype, TO_STRING$1, function toString() {
      var R = anObject$8(this);
      var pattern = $toString$1(R.source);
      var flags = $toString$1(getRegExpFlags(R));
      return '/' + pattern + '/' + flags;
    }, {
      unsafe: true
    });
  }

  // TODO: Remove from `core-js@4`
  var uncurryThis$d = require('../internals/function-uncurry-this');
  var defineBuiltIn$7 = require('../internals/define-built-in');
  var DatePrototype = Date.prototype;
  var INVALID_DATE = 'Invalid Date';
  var TO_STRING = 'toString';
  var nativeDateToString = uncurryThis$d(DatePrototype[TO_STRING]);
  var thisTimeValue = uncurryThis$d(DatePrototype.getTime);

  // `Date.prototype.toString` method
  // https://tc39.es/ecma262/#sec-date.prototype.tostring
  if (String(new Date(NaN)) != INVALID_DATE) {
    defineBuiltIn$7(DatePrototype, TO_STRING, function toString() {
      var value = thisTimeValue(this);
      // eslint-disable-next-line no-self-compare -- NaN check
      return value === value ? nativeDateToString(this) : INVALID_DATE;
    });
  }

  // `Symbol.prototype.description` getter
  var $$m = require('../internals/export');
  var DESCRIPTORS$8 = require('../internals/descriptors');
  var global$i = require('../internals/global');
  var uncurryThis$c = require('../internals/function-uncurry-this');
  var hasOwn$a = require('../internals/has-own-property');
  var isCallable$j = require('../internals/is-callable');
  var isPrototypeOf$4 = require('../internals/object-is-prototype-of');
  var toString$8 = require('../internals/to-string');
  var defineBuiltInAccessor$3 = require('../internals/define-built-in-accessor');
  var copyConstructorProperties = require('../internals/copy-constructor-properties');
  var NativeSymbol = global$i.Symbol;
  var SymbolPrototype$1 = NativeSymbol && NativeSymbol.prototype;
  if (DESCRIPTORS$8 && isCallable$j(NativeSymbol) && (!('description' in SymbolPrototype$1) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined)) {
    var EmptyStringDescriptionStore = {};
    // wrap Symbol constructor for correct work with undefined description
    var SymbolWrapper = function _Symbol() {
      var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString$8(arguments[0]);
      var result = isPrototypeOf$4(SymbolPrototype$1, this) ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
      if (description === '') EmptyStringDescriptionStore[result] = true;
      return result;
    };
    copyConstructorProperties(SymbolWrapper, NativeSymbol);
    SymbolWrapper.prototype = SymbolPrototype$1;
    SymbolPrototype$1.constructor = SymbolWrapper;
    var NATIVE_SYMBOL$6 = String(NativeSymbol('test')) == 'Symbol(test)';
    var thisSymbolValue = uncurryThis$c(SymbolPrototype$1.valueOf);
    var symbolDescriptiveString = uncurryThis$c(SymbolPrototype$1.toString);
    var regexp = /^Symbol\((.*)\)[^)]+$/;
    var replace$2 = uncurryThis$c(''.replace);
    var stringSlice$4 = uncurryThis$c(''.slice);
    defineBuiltInAccessor$3(SymbolPrototype$1, 'description', {
      configurable: true,
      get: function description() {
        var symbol = thisSymbolValue(this);
        if (hasOwn$a(EmptyStringDescriptionStore, symbol)) return '';
        var string = symbolDescriptiveString(symbol);
        var desc = NATIVE_SYMBOL$6 ? stringSlice$4(string, 7, -1) : replace$2(string, regexp, '$1');
        return desc === '' ? undefined : desc;
      }
    });
    $$m({
      global: true,
      constructor: true,
      forced: true
    }, {
      Symbol: SymbolWrapper
    });
  }

  /* eslint-disable es/no-symbol -- required for testing */
  var V8_VERSION$2 = require('../internals/engine-v8-version');
  var fails$c = require('../internals/fails');

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  module.exports = !!Object.getOwnPropertySymbols && !fails$c(function () {
    var symbol = Symbol();
    // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
    return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION$2 && V8_VERSION$2 < 41;
  });

  var symbolConstructorDetection = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$1$5 = /*@__PURE__*/getAugmentedNamespace(symbolConstructorDetection);

  var global$h = require$$3$4;
  var path$1 = global$h;

  var wellKnownSymbolWrapped = {};

  var wellKnownSymbol$e = wellKnownSymbol$a;
  wellKnownSymbolWrapped.f = wellKnownSymbol$e;

  var fails$b = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var apply$3 = require('../internals/function-apply');
  var call$d = require('../internals/function-call');
  var uncurryThis$b = require('../internals/function-uncurry-this');
  var fixRegExpWellKnownSymbolLogic$1 = require('../internals/fix-regexp-well-known-symbol-logic');
  var anObject$7 = require('../internals/an-object');
  var isNullOrUndefined$3 = require('../internals/is-null-or-undefined');
  var isRegExp = require('../internals/is-regexp');
  var requireObjectCoercible$3 = require('../internals/require-object-coercible');
  var speciesConstructor$3 = require('../internals/species-constructor');
  var advanceStringIndex$1 = require('../internals/advance-string-index');
  var toLength$3 = require('../internals/to-length');
  var toString$7 = require('../internals/to-string');
  var getMethod$3 = require('../internals/get-method');
  var arraySlice$4 = require('../internals/array-slice-simple');
  var callRegExpExec = require('../internals/regexp-exec-abstract');
  var regexpExec = require('../internals/regexp-exec');
  var stickyHelpers = require('../internals/regexp-sticky-helpers');
  var fails$a = require('../internals/fails');
  var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
  var MAX_UINT32 = 0xFFFFFFFF;
  var min$2 = Math.min;
  var $push = [].push;
  var exec$2 = uncurryThis$b(/./.exec);
  var push$1 = uncurryThis$b($push);
  var stringSlice$3 = uncurryThis$b(''.slice);

  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  // Weex JS has frozen built-in prototypes, so use try / catch wrapper
  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$a(function () {
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () {
      return originalExec.apply(this, arguments);
    };
    var result = 'ab'.split(re);
    return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
  });

  // @@split logic
  fixRegExpWellKnownSymbolLogic$1('split', function (SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit;
    if ('abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function internalSplit(separator, limit) {
        var string = toString$7(requireObjectCoercible$3(this));
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (separator === undefined) return [string];
        // If `separator` is not a regex, use native split
        if (!isRegExp(separator)) {
          return call$d(nativeSplit, string, separator, lim);
        }
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = call$d(regexpExec, separatorCopy, string)) {
          lastIndex = separatorCopy.lastIndex;
          if (lastIndex > lastLastIndex) {
            push$1(output, stringSlice$3(string, lastLastIndex, match.index));
            if (match.length > 1 && match.index < string.length) apply$3($push, output, arraySlice$4(match, 1));
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= lim) break;
          }
          if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
        }

        if (lastLastIndex === string.length) {
          if (lastLength || !exec$2(separatorCopy, '')) push$1(output, '');
        } else push$1(output, stringSlice$3(string, lastLastIndex));
        return output.length > lim ? arraySlice$4(output, 0, lim) : output;
      };
      // Chakra, V8
    } else if ('0'.split(undefined, 0).length) {
      internalSplit = function internalSplit(separator, limit) {
        return separator === undefined && limit === 0 ? [] : call$d(nativeSplit, this, separator, limit);
      };
    } else internalSplit = nativeSplit;
    return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible$3(this);
      var splitter = isNullOrUndefined$3(separator) ? undefined : getMethod$3(separator, SPLIT);
      return splitter ? call$d(splitter, separator, O, limit) : call$d(internalSplit, toString$7(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (string, limit) {
      var rx = anObject$7(this);
      var S = toString$7(string);
      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;
      var C = speciesConstructor$3(rx, RegExp);
      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (UNSUPPORTED_Y ? 'g' : 'y');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
        var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice$3(S, q) : S);
        var e;
        if (z === null || (e = min$2(toLength$3(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p) {
          q = advanceStringIndex$1(S, q, unicodeMatching);
        } else {
          push$1(A, stringSlice$3(S, p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            push$1(A, z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      push$1(A, stringSlice$3(S, p));
      return A;
    }];
  }, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);

  var uncurryThis$a = require('../internals/function-uncurry-this');
  var fails$9 = require('../internals/fails');
  var classof$6 = require('../internals/classof-raw');
  var $Object$2 = Object;
  var split = uncurryThis$a(''.split);

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  module.exports = fails$9(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !$Object$2('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof$6(it) == 'String' ? split(it, '') : $Object$2(it);
  } : $Object$2;

  var indexedObject = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$0$6 = /*@__PURE__*/getAugmentedNamespace(indexedObject);

  // toObject with fallback for non-array-like ES3 strings
  var IndexedObject$1 = require$$0$6;
  var requireObjectCoercible$2 = requireObjectCoercible$6;
  var toIndexedObject$6 = function (it) {
    return IndexedObject$1(requireObjectCoercible$2(it));
  };

  var DESCRIPTORS$7 = require('../internals/descriptors');
  var call$c = require('../internals/function-call');
  var propertyIsEnumerableModule$1 = require('../internals/object-property-is-enumerable');
  var createPropertyDescriptor$4 = require('../internals/create-property-descriptor');
  var toIndexedObject$5 = require('../internals/to-indexed-object');
  var toPropertyKey$4 = require('../internals/to-property-key');
  var hasOwn$9 = require('../internals/has-own-property');
  var IE8_DOM_DEFINE$1 = require('../internals/ie8-dom-define');

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  exports.f = DESCRIPTORS$7 ? $getOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$5(O);
    P = toPropertyKey$4(P);
    if (IE8_DOM_DEFINE$1) try {
      return $getOwnPropertyDescriptor$2(O, P);
    } catch (error) {/* empty */}
    if (hasOwn$9(O, P)) return createPropertyDescriptor$4(!call$c(propertyIsEnumerableModule$1.f, O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$2$4 = /*@__PURE__*/getAugmentedNamespace(objectGetOwnPropertyDescriptor);

  var $$l = require$$0$8;
  var fails$8 = fails$b;
  var toIndexedObject$4 = toIndexedObject$6;
  var nativeGetOwnPropertyDescriptor$1 = require$$2$4.f;
  var DESCRIPTORS$6 = require$$3$5;
  var FORCED$2 = !DESCRIPTORS$6 || fails$8(function () {
    nativeGetOwnPropertyDescriptor$1(1);
  });

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  $$l({
    target: 'Object',
    stat: true,
    forced: FORCED$2,
    sham: !DESCRIPTORS$6
  }, {
    getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
      return nativeGetOwnPropertyDescriptor$1(toIndexedObject$4(it), key);
    }
  });

  var DESCRIPTORS$5 = require('../internals/descriptors');
  var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
  var V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug');
  var anObject$6 = require('../internals/an-object');
  var toPropertyKey$3 = require('../internals/to-property-key');
  var $TypeError$8 = TypeError;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty$1 = Object.defineProperty;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
  var ENUMERABLE = 'enumerable';
  var CONFIGURABLE = 'configurable';
  var WRITABLE = 'writable';

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  exports.f = DESCRIPTORS$5 ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
    anObject$6(O);
    P = toPropertyKey$3(P);
    anObject$6(Attributes);
    if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
      var current = $getOwnPropertyDescriptor$1(O, P);
      if (current && current[WRITABLE]) {
        O[P] = Attributes.value;
        Attributes = {
          configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
          enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
          writable: false
        };
      }
    }
    return $defineProperty$1(O, P, Attributes);
  } : $defineProperty$1 : function defineProperty(O, P, Attributes) {
    anObject$6(O);
    P = toPropertyKey$3(P);
    anObject$6(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty$1(O, P, Attributes);
    } catch (error) {/* empty */}
    if ('get' in Attributes || 'set' in Attributes) throw $TypeError$8('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$1$4 = /*@__PURE__*/getAugmentedNamespace(objectDefineProperty);

  var path = path$1;
  var hasOwn$8 = hasOwnProperty_1;
  var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
  var defineProperty$4 = require$$1$4.f;
  var wellKnownSymbolDefine = function (NAME) {
    var _Symbol = path.Symbol || (path.Symbol = {});
    if (!hasOwn$8(_Symbol, NAME)) defineProperty$4(_Symbol, NAME, {
      value: wrappedWellKnownSymbolModule$1.f(NAME)
    });
  };

  var defineWellKnownSymbol$2 = wellKnownSymbolDefine;

  // `Symbol.iterator` well-known symbol
  // https://tc39.es/ecma262/#sec-symbol.iterator
  defineWellKnownSymbol$2('iterator');

  var toIndexedObject$3 = require('../internals/to-indexed-object');
  var addToUnscopables = require('../internals/add-to-unscopables');
  var Iterators$1 = require('../internals/iterators');
  var InternalStateModule$4 = require('../internals/internal-state');
  var defineProperty$3 = require('../internals/object-define-property').f;
  var defineIterator$1 = require('../internals/iterator-define');
  var createIterResultObject$2 = require('../internals/create-iter-result-object');
  var IS_PURE$4 = require('../internals/is-pure');
  var DESCRIPTORS$4 = require('../internals/descriptors');
  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$3 = InternalStateModule$4.set;
  var getInternalState$3 = InternalStateModule$4.getterFor(ARRAY_ITERATOR);

  // `Array.prototype.entries` method
  // https://tc39.es/ecma262/#sec-array.prototype.entries
  // `Array.prototype.keys` method
  // https://tc39.es/ecma262/#sec-array.prototype.keys
  // `Array.prototype.values` method
  // https://tc39.es/ecma262/#sec-array.prototype.values
  // `Array.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
  // `CreateArrayIterator` internal method
  // https://tc39.es/ecma262/#sec-createarrayiterator
  module.exports = defineIterator$1(Array, 'Array', function (iterated, kind) {
    setInternalState$3(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject$3(iterated),
      // target
      index: 0,
      // next index
      kind: kind // kind
    });
    // `%ArrayIteratorPrototype%.next` method
    // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$3(this);
    var target = state.target;
    var kind = state.kind;
    var index = state.index++;
    if (!target || index >= target.length) {
      state.target = undefined;
      return createIterResultObject$2(undefined, true);
    }
    if (kind == 'keys') return createIterResultObject$2(index, false);
    if (kind == 'values') return createIterResultObject$2(target[index], false);
    return createIterResultObject$2([index, target[index]], false);
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values%
  // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
  // https://tc39.es/ecma262/#sec-createmappedargumentsobject
  var values = Iterators$1.Arguments = Iterators$1.Array;

  // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  // V8 ~ Chrome 45- bug
  if (!IS_PURE$4 && DESCRIPTORS$4 && values.name !== 'values') try {
    defineProperty$3(values, 'name', {
      value: 'values'
    });
  } catch (error) {/* empty */}

  var $$k = require$$0$8;
  var trunc$1 = require$$0$5;

  // `Math.trunc` method
  // https://tc39.es/ecma262/#sec-math.trunc
  $$k({
    target: 'Math',
    stat: true
  }, {
    trunc: trunc$1
  });

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `Math.trunc` method
  // https://tc39.es/ecma262/#sec-math.trunc
  // eslint-disable-next-line es/no-math-trunc -- safe
  module.exports = Math.trunc || function trunc(x) {
    var n = +x;
    return (n > 0 ? floor : ceil)(n);
  };

  var mathTrunc = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$0$5 = /*@__PURE__*/getAugmentedNamespace(mathTrunc);

  var trunc = require$$0$5;

  // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity
  var toIntegerOrInfinity$3 = function (argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- NaN check
    return number !== number || number === 0 ? 0 : trunc(number);
  };

  var documentAll$2 = (typeof document === "undefined" ? "undefined" : _typeof(document)) == 'object' && document.all;

  // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
  // eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
  var IS_HTMLDDA = typeof documentAll$2 == 'undefined' && documentAll$2 !== undefined;
  module.exports = {
    all: documentAll$2,
    IS_HTMLDDA: IS_HTMLDDA
  };

  var documentAll$3 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$0$4 = /*@__PURE__*/getAugmentedNamespace(documentAll$3);

  var $documentAll$1 = require$$0$4;
  var documentAll$1 = $documentAll$1.all;

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable$i = $documentAll$1.IS_HTMLDDA ? function (argument) {
    return typeof argument == 'function' || argument === documentAll$1;
  } : function (argument) {
    return typeof argument == 'function';
  };

  var uncurryThis$9 = require('../internals/function-uncurry-this');
  var toString$6 = uncurryThis$9({}.toString);
  var stringSlice$2 = uncurryThis$9(''.slice);
  module.exports = function (it) {
    return stringSlice$2(toString$6(it), 8, -1);
  };

  var classofRaw$1 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$0$3 = /*@__PURE__*/getAugmentedNamespace(classofRaw$1);

  var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
  var isCallable$h = isCallable$i;
  var classofRaw = require$$0$3;
  var wellKnownSymbol$d = wellKnownSymbol$a;
  var TO_STRING_TAG$3 = wellKnownSymbol$d('toStringTag');
  var $Object$1 = Object;

  // ES3 wrong here
  var CORRECT_ARGUMENTS = classofRaw(function () {
    return arguments;
  }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function tryGet(it, key) {
    try {
      return it[key];
    } catch (error) {/* empty */}
  };

  // getting tag from ES6+ `Object.prototype.toString`
  var classof$5 = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object$1(it), TO_STRING_TAG$3)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable$h(O.callee) ? 'Arguments' : result;
  };

  var classof$4 = classof$5;
  var $String$4 = String;
  var toString$5 = function (argument) {
    if (classof$4(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
    return $String$4(argument);
  };

  var uncurryThis$8 = require$$0$7;
  var toIntegerOrInfinity$2 = toIntegerOrInfinity$3;
  var toString$4 = toString$5;
  var requireObjectCoercible$1 = requireObjectCoercible$6;
  var charAt$2 = uncurryThis$8(''.charAt);
  var charCodeAt$1 = uncurryThis$8(''.charCodeAt);
  var stringSlice$1 = uncurryThis$8(''.slice);
  var createMethod = function createMethod(CONVERT_TO_STRING) {
    return function ($this, pos) {
      var S = toString$4(requireObjectCoercible$1($this));
      var position = toIntegerOrInfinity$2(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
      first = charCodeAt$1(S, position);
      return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = charCodeAt$1(S, position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? charAt$2(S, position) : first : CONVERT_TO_STRING ? stringSlice$1(S, position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
    };
  };
  var stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod(true)
  };

  var global$g = require('../internals/global');
  var isCallable$g = require('../internals/is-callable');
  var WeakMap$1 = global$g.WeakMap;
  module.exports = isCallable$g(WeakMap$1) && /native code/.test(String(WeakMap$1));

  var weakMapBasicDetection = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$0$2 = /*@__PURE__*/getAugmentedNamespace(weakMapBasicDetection);

  var isCallable$f = require('../internals/is-callable');
  var $documentAll = require('../internals/document-all');
  var documentAll = $documentAll.all;
  module.exports = $documentAll.IS_HTMLDDA ? function (it) {
    return _typeof(it) == 'object' ? it !== null : isCallable$f(it) || it === documentAll;
  } : function (it) {
    return _typeof(it) == 'object' ? it !== null : isCallable$f(it);
  };

  var isObject$7 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$3$2 = /*@__PURE__*/getAugmentedNamespace(isObject$7);

  var createPropertyDescriptor$3 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var DESCRIPTORS$3 = require$$3$5;
  var definePropertyModule$3 = require$$1$4;
  var createPropertyDescriptor$2 = createPropertyDescriptor$3;
  var createNonEnumerableProperty$4 = DESCRIPTORS$3 ? function (object, key, value) {
    return definePropertyModule$3.f(object, key, createPropertyDescriptor$2(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var shared$5 = sharedExports;
  var uid$2 = require$$3$3;
  var keys = shared$5('keys');
  var sharedKey$2 = function (key) {
    return keys[key] || (keys[key] = uid$2(key));
  };

  var NATIVE_WEAK_MAP = require$$0$2;
  var global$f = require$$3$4;
  var isObject$6 = require$$3$2;
  var createNonEnumerableProperty$3 = createNonEnumerableProperty$4;
  var hasOwn$7 = hasOwnProperty_1;
  var shared$4 = sharedStore;
  var sharedKey$1 = sharedKey$2;
  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var TypeError$3 = global$f.TypeError;
  var WeakMap = global$f.WeakMap;
  var set$1, get, has;
  var enforce = function enforce(it) {
    return has(it) ? get(it) : set$1(it, {});
  };
  var getterFor = function getterFor(TYPE) {
    return function (it) {
      var state;
      if (!isObject$6(it) || (state = get(it)).type !== TYPE) {
        throw TypeError$3('Incompatible receiver, ' + TYPE + ' required');
      }
      return state;
    };
  };
  if (NATIVE_WEAK_MAP || shared$4.state) {
    var store = shared$4.state || (shared$4.state = new WeakMap());
    /* eslint-disable no-self-assign -- prototype methods protection */
    store.get = store.get;
    store.has = store.has;
    store.set = store.set;
    /* eslint-enable no-self-assign -- prototype methods protection */
    set$1 = function set(it, metadata) {
      if (store.has(it)) throw TypeError$3(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      store.set(it, metadata);
      return metadata;
    };
    get = function get(it) {
      return store.get(it) || {};
    };
    has = function has(it) {
      return store.has(it);
    };
  } else {
    var STATE = sharedKey$1('state');
    set$1 = function set(it, metadata) {
      if (hasOwn$7(it, STATE)) throw TypeError$3(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty$3(it, STATE, metadata);
      return metadata;
    };
    get = function get(it) {
      return hasOwn$7(it, STATE) ? it[STATE] : {};
    };
    has = function has(it) {
      return hasOwn$7(it, STATE);
    };
  }
  var internalState = {
    set: set$1,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var global$e = require('../internals/global');
  var DOMIterables$1 = require('../internals/dom-iterables');
  var DOMTokenListPrototype$1 = require('../internals/dom-token-list-prototype');
  var ArrayIteratorMethods = require('../modules/es.array.iterator');
  var createNonEnumerableProperty$2 = require('../internals/create-non-enumerable-property');
  var wellKnownSymbol$c = require('../internals/well-known-symbol');
  var ITERATOR$2 = wellKnownSymbol$c('iterator');
  var TO_STRING_TAG$2 = wellKnownSymbol$c('toStringTag');
  var ArrayValues = ArrayIteratorMethods.values;
  var handlePrototype$1 = function handlePrototype(CollectionPrototype, COLLECTION_NAME) {
    if (CollectionPrototype) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
        createNonEnumerableProperty$2(CollectionPrototype, ITERATOR$2, ArrayValues);
      } catch (error) {
        CollectionPrototype[ITERATOR$2] = ArrayValues;
      }
      if (!CollectionPrototype[TO_STRING_TAG$2]) {
        createNonEnumerableProperty$2(CollectionPrototype, TO_STRING_TAG$2, COLLECTION_NAME);
      }
      if (DOMIterables$1[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
        // some Chrome versions have non-configurable methods on DOMTokenList
        if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
          createNonEnumerableProperty$2(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
        } catch (error) {
          CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
        }
      }
    }
  };
  for (var COLLECTION_NAME$1 in DOMIterables$1) {
    handlePrototype$1(global$e[COLLECTION_NAME$1] && global$e[COLLECTION_NAME$1].prototype, COLLECTION_NAME$1);
  }
  handlePrototype$1(DOMTokenListPrototype$1, 'DOMTokenList');

  var $$j = require('../internals/export');
  var call$b = require('../internals/function-call');
  var IS_PURE$3 = require('../internals/is-pure');
  var FunctionName = require('../internals/function-name');
  var isCallable$e = require('../internals/is-callable');
  var createIteratorConstructor = require('../internals/iterator-create-constructor');
  var getPrototypeOf = require('../internals/object-get-prototype-of');
  var setPrototypeOf$1 = require('../internals/object-set-prototype-of');
  var setToStringTag$3 = require('../internals/set-to-string-tag');
  var createNonEnumerableProperty$1 = require('../internals/create-non-enumerable-property');
  var defineBuiltIn$6 = require('../internals/define-built-in');
  var wellKnownSymbol$b = require('../internals/well-known-symbol');
  var Iterators = require('../internals/iterators');
  var IteratorsCore = require('../internals/iterators-core');
  var PROPER_FUNCTION_NAME = FunctionName.PROPER;
  var CONFIGURABLE_FUNCTION_NAME$1 = FunctionName.CONFIGURABLE;
  var IteratorPrototype = IteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR$1 = wellKnownSymbol$b('iterator');
  var KEYS = 'keys';
  var VALUES = 'values';
  var ENTRIES = 'entries';
  var returnThis = function returnThis() {
    return this;
  };
  module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);
    var getIterationMethod = function getIterationMethod(KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS:
          return function keys() {
            return new IteratorConstructor(this, KIND);
          };
        case VALUES:
          return function values() {
            return new IteratorConstructor(this, KIND);
          };
        case ENTRIES:
          return function entries() {
            return new IteratorConstructor(this, KIND);
          };
      }
      return function () {
        return new IteratorConstructor(this);
      };
    };
    var TO_STRING_TAG = NAME + ' Iterator';
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR$1] || IterablePrototype['@@iterator'] || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;

    // fix native
    if (anyNativeIterator) {
      CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
        if (!IS_PURE$3 && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
          if (setPrototypeOf$1) {
            setPrototypeOf$1(CurrentIteratorPrototype, IteratorPrototype);
          } else if (!isCallable$e(CurrentIteratorPrototype[ITERATOR$1])) {
            defineBuiltIn$6(CurrentIteratorPrototype, ITERATOR$1, returnThis);
          }
        }
        // Set @@toStringTag to native iterators
        setToStringTag$3(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
        if (IS_PURE$3) Iterators[TO_STRING_TAG] = returnThis;
      }
    }

    // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
    if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      if (!IS_PURE$3 && CONFIGURABLE_FUNCTION_NAME$1) {
        createNonEnumerableProperty$1(IterablePrototype, 'name', VALUES);
      } else {
        INCORRECT_VALUES_NAME = true;
        defaultIterator = function values() {
          return call$b(nativeIterator, this);
        };
      }
    }

    // export additional methods
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          defineBuiltIn$6(IterablePrototype, KEY, methods[KEY]);
        }
      } else $$j({
        target: NAME,
        proto: true,
        forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME
      }, methods);
    }

    // define iterator
    if ((!IS_PURE$3 || FORCED) && IterablePrototype[ITERATOR$1] !== defaultIterator) {
      defineBuiltIn$6(IterablePrototype, ITERATOR$1, defaultIterator, {
        name: DEFAULT
      });
    }
    Iterators[NAME] = defaultIterator;
    return methods;
  };

  var iteratorDefine = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$3$1 = /*@__PURE__*/getAugmentedNamespace(iteratorDefine);

  // `CreateIterResultObject` abstract operation
  // https://tc39.es/ecma262/#sec-createiterresultobject
  var createIterResultObject$1 = function (value, done) {
    return {
      value: value,
      done: done
    };
  };

  var charAt$1 = stringMultibyte.charAt;
  var toString$3 = toString$5;
  var InternalStateModule$3 = internalState;
  var defineIterator = require$$3$1;
  var createIterResultObject = createIterResultObject$1;
  var STRING_ITERATOR = 'String Iterator';
  var setInternalState$2 = InternalStateModule$3.set;
  var getInternalState$2 = InternalStateModule$3.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState$2(this, {
      type: STRING_ITERATOR,
      string: toString$3(iterated),
      index: 0
    });
    // `%StringIteratorPrototype%.next` method
    // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState$2(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return createIterResultObject(undefined, true);
    point = charAt$1(string, index);
    state.index += point.length;
    return createIterResultObject(point, false);
  });

  /* eslint-disable es/no-symbol -- required for testing */
  var NATIVE_SYMBOL$5 = require('../internals/symbol-constructor-detection');
  module.exports = NATIVE_SYMBOL$5 && !Symbol.sham && _typeof(Symbol.iterator) == 'symbol';

  var useSymbolAsUid = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$5$3 = /*@__PURE__*/getAugmentedNamespace(useSymbolAsUid);

  var global$d = require$$3$4;
  var shared$3 = sharedExports;
  var hasOwn$6 = hasOwnProperty_1;
  var uid$1 = require$$3$3;
  var NATIVE_SYMBOL$4 = require$$1$5;
  var USE_SYMBOL_AS_UID$1 = require$$5$3;
  var _Symbol = global$d.Symbol;
  var WellKnownSymbolsStore$1 = shared$3('wks');
  var createWellKnownSymbol = USE_SYMBOL_AS_UID$1 ? _Symbol['for'] || _Symbol : _Symbol && _Symbol.withoutSetter || uid$1;
  var wellKnownSymbol$a = function (name) {
    if (!hasOwn$6(WellKnownSymbolsStore$1, name)) {
      WellKnownSymbolsStore$1[name] = NATIVE_SYMBOL$4 && hasOwn$6(_Symbol, name) ? _Symbol[name] : createWellKnownSymbol('Symbol.' + name);
    }
    return WellKnownSymbolsStore$1[name];
  };

  var wellKnownSymbol$9 = wellKnownSymbol$a;
  var TO_STRING_TAG$1 = wellKnownSymbol$9('toStringTag');
  var test = {};
  test[TO_STRING_TAG$1] = 'z';
  var toStringTagSupport = String(test) === '[object z]';

  var isCallable$d = require('../internals/is-callable');
  var definePropertyModule$2 = require('../internals/object-define-property');
  var makeBuiltIn$3 = require('../internals/make-built-in');
  var defineGlobalProperty = require('../internals/define-global-property');
  module.exports = function (O, key, value, options) {
    if (!options) options = {};
    var simple = options.enumerable;
    var name = options.name !== undefined ? options.name : key;
    if (isCallable$d(value)) makeBuiltIn$3(value, name, options);
    if (options.global) {
      if (simple) O[key] = value;else defineGlobalProperty(key, value);
    } else {
      try {
        if (!options.unsafe) delete O[key];else if (O[key]) simple = true;
      } catch (error) {/* empty */}
      if (simple) O[key] = value;else definePropertyModule$2.f(O, key, {
        value: value,
        enumerable: false,
        configurable: !options.nonConfigurable,
        writable: !options.nonWritable
      });
    }
    return O;
  };

  var defineBuiltIn$5 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$6$1 = /*@__PURE__*/getAugmentedNamespace(defineBuiltIn$5);

  var TO_STRING_TAG_SUPPORT$1 = require('../internals/to-string-tag-support');
  var classof$3 = require('../internals/classof');

  // `Object.prototype.toString` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  module.exports = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
    return '[object ' + classof$3(this) + ']';
  };

  var objectToString = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$2$3 = /*@__PURE__*/getAugmentedNamespace(objectToString);

  var TO_STRING_TAG_SUPPORT = toStringTagSupport;
  var defineBuiltIn$4 = require$$6$1;
  var toString$2 = require$$2$3;

  // `Object.prototype.toString` method
  // https://tc39.es/ecma262/#sec-object.prototype.tostring
  if (!TO_STRING_TAG_SUPPORT) {
    defineBuiltIn$4(Object.prototype, 'toString', toString$2, {
      unsafe: true
    });
  }

  var $$i = require('../internals/export');
  var forEach$1 = require('../internals/array-for-each');

  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  // eslint-disable-next-line es/no-array-prototype-foreach -- safe
  $$i({
    target: 'Array',
    proto: true,
    forced: [].forEach != forEach$1
  }, {
    forEach: forEach$1
  });

  var global$c = require('../internals/global');
  var DOMIterables = require('../internals/dom-iterables');
  var DOMTokenListPrototype = require('../internals/dom-token-list-prototype');
  var forEach = require('../internals/array-for-each');
  var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
  var handlePrototype = function handlePrototype(CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
      createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
    } catch (error) {
      CollectionPrototype.forEach = forEach;
    }
  };
  for (var COLLECTION_NAME in DOMIterables) {
    if (DOMIterables[COLLECTION_NAME]) {
      handlePrototype(global$c[COLLECTION_NAME] && global$c[COLLECTION_NAME].prototype);
    }
  }
  handlePrototype(DOMTokenListPrototype);

  var $$h = require('../internals/export');
  var global$b = require('../internals/global');
  var call$a = require('../internals/function-call');
  var uncurryThis$7 = require('../internals/function-uncurry-this');
  var IS_PURE$2 = require('../internals/is-pure');
  var DESCRIPTORS$2 = require('../internals/descriptors');
  var NATIVE_SYMBOL$3 = require('../internals/symbol-constructor-detection');
  var fails$7 = require('../internals/fails');
  var hasOwn$5 = require('../internals/has-own-property');
  var isPrototypeOf$3 = require('../internals/object-is-prototype-of');
  var anObject$5 = require('../internals/an-object');
  var toIndexedObject$2 = require('../internals/to-indexed-object');
  var toPropertyKey$2 = require('../internals/to-property-key');
  var $toString = require('../internals/to-string');
  var createPropertyDescriptor$1 = require('../internals/create-property-descriptor');
  var nativeObjectCreate = require('../internals/object-create');
  var objectKeys = require('../internals/object-keys');
  var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
  var getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external');
  var getOwnPropertySymbolsModule$1 = require('../internals/object-get-own-property-symbols');
  var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
  var definePropertyModule$1 = require('../internals/object-define-property');
  var definePropertiesModule = require('../internals/object-define-properties');
  var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
  var defineBuiltIn$3 = require('../internals/define-built-in');
  var defineBuiltInAccessor$2 = require('../internals/define-built-in-accessor');
  var shared$2 = require('../internals/shared');
  var sharedKey = require('../internals/shared-key');
  var hiddenKeys = require('../internals/hidden-keys');
  var uid = require('../internals/uid');
  var wellKnownSymbol$8 = require('../internals/well-known-symbol');
  var wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped');
  var defineWellKnownSymbol$1 = require('../internals/well-known-symbol-define');
  var defineSymbolToPrimitive = require('../internals/symbol-define-to-primitive');
  var setToStringTag$2 = require('../internals/set-to-string-tag');
  var InternalStateModule$2 = require('../internals/internal-state');
  var $forEach = require('../internals/array-iteration').forEach;
  var HIDDEN = sharedKey('hidden');
  var SYMBOL = 'Symbol';
  var PROTOTYPE = 'prototype';
  var setInternalState$1 = InternalStateModule$2.set;
  var getInternalState$1 = InternalStateModule$2.getterFor(SYMBOL);
  var ObjectPrototype = Object[PROTOTYPE];
  var $Symbol = global$b.Symbol;
  var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
  var TypeError$2 = global$b.TypeError;
  var QObject = global$b.QObject;
  var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  var nativeDefineProperty = definePropertyModule$1.f;
  var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
  var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
  var push = uncurryThis$7([].push);
  var AllSymbols = shared$2('symbols');
  var ObjectPrototypeSymbols = shared$2('op-symbols');
  var WellKnownSymbolsStore = shared$2('wks');

  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDescriptor = DESCRIPTORS$2 && fails$7(function () {
    return nativeObjectCreate(nativeDefineProperty({}, 'a', {
      get: function get() {
        return nativeDefineProperty(this, 'a', {
          value: 7
        }).a;
      }
    })).a != 7;
  }) ? function (O, P, Attributes) {
    var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
    if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
    nativeDefineProperty(O, P, Attributes);
    if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
      nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
    }
  } : nativeDefineProperty;
  var wrap = function wrap(tag, description) {
    var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
    setInternalState$1(symbol, {
      type: SYMBOL,
      tag: tag,
      description: description
    });
    if (!DESCRIPTORS$2) symbol.description = description;
    return symbol;
  };
  var $defineProperty = function defineProperty(O, P, Attributes) {
    if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
    anObject$5(O);
    var key = toPropertyKey$2(P);
    anObject$5(Attributes);
    if (hasOwn$5(AllSymbols, key)) {
      if (!Attributes.enumerable) {
        if (!hasOwn$5(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor$1(1, {}));
        O[HIDDEN][key] = true;
      } else {
        if (hasOwn$5(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
        Attributes = nativeObjectCreate(Attributes, {
          enumerable: createPropertyDescriptor$1(0, false)
        });
      }
      return setSymbolDescriptor(O, key, Attributes);
    }
    return nativeDefineProperty(O, key, Attributes);
  };
  var $defineProperties = function defineProperties(O, Properties) {
    anObject$5(O);
    var properties = toIndexedObject$2(Properties);
    var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
    $forEach(keys, function (key) {
      if (!DESCRIPTORS$2 || call$a($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
    });
    return O;
  };
  var $create = function create(O, Properties) {
    return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
  };
  var $propertyIsEnumerable = function propertyIsEnumerable(V) {
    var P = toPropertyKey$2(V);
    var enumerable = call$a(nativePropertyIsEnumerable, this, P);
    if (this === ObjectPrototype && hasOwn$5(AllSymbols, P) && !hasOwn$5(ObjectPrototypeSymbols, P)) return false;
    return enumerable || !hasOwn$5(this, P) || !hasOwn$5(AllSymbols, P) || hasOwn$5(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
  };
  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
    var it = toIndexedObject$2(O);
    var key = toPropertyKey$2(P);
    if (it === ObjectPrototype && hasOwn$5(AllSymbols, key) && !hasOwn$5(ObjectPrototypeSymbols, key)) return;
    var descriptor = nativeGetOwnPropertyDescriptor(it, key);
    if (descriptor && hasOwn$5(AllSymbols, key) && !(hasOwn$5(it, HIDDEN) && it[HIDDEN][key])) {
      descriptor.enumerable = true;
    }
    return descriptor;
  };
  var $getOwnPropertyNames = function getOwnPropertyNames(O) {
    var names = nativeGetOwnPropertyNames(toIndexedObject$2(O));
    var result = [];
    $forEach(names, function (key) {
      if (!hasOwn$5(AllSymbols, key) && !hasOwn$5(hiddenKeys, key)) push(result, key);
    });
    return result;
  };
  var $getOwnPropertySymbols = function $getOwnPropertySymbols(O) {
    var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
    var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$2(O));
    var result = [];
    $forEach(names, function (key) {
      if (hasOwn$5(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn$5(ObjectPrototype, key))) {
        push(result, AllSymbols[key]);
      }
    });
    return result;
  };

  // `Symbol` constructor
  // https://tc39.es/ecma262/#sec-symbol-constructor
  if (!NATIVE_SYMBOL$3) {
    $Symbol = function _Symbol() {
      if (isPrototypeOf$3(SymbolPrototype, this)) throw TypeError$2('Symbol is not a constructor');
      var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
      var tag = uid(description);
      var setter = function setter(value) {
        if (this === ObjectPrototype) call$a(setter, ObjectPrototypeSymbols, value);
        if (hasOwn$5(this, HIDDEN) && hasOwn$5(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDescriptor(this, tag, createPropertyDescriptor$1(1, value));
      };
      if (DESCRIPTORS$2 && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, {
        configurable: true,
        set: setter
      });
      return wrap(tag, description);
    };
    SymbolPrototype = $Symbol[PROTOTYPE];
    defineBuiltIn$3(SymbolPrototype, 'toString', function toString() {
      return getInternalState$1(this).tag;
    });
    defineBuiltIn$3($Symbol, 'withoutSetter', function (description) {
      return wrap(uid(description), description);
    });
    propertyIsEnumerableModule.f = $propertyIsEnumerable;
    definePropertyModule$1.f = $defineProperty;
    definePropertiesModule.f = $defineProperties;
    getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
    getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    getOwnPropertySymbolsModule$1.f = $getOwnPropertySymbols;
    wrappedWellKnownSymbolModule.f = function (name) {
      return wrap(wellKnownSymbol$8(name), name);
    };
    if (DESCRIPTORS$2) {
      // https://github.com/tc39/proposal-Symbol-description
      defineBuiltInAccessor$2(SymbolPrototype, 'description', {
        configurable: true,
        get: function description() {
          return getInternalState$1(this).description;
        }
      });
      if (!IS_PURE$2) {
        defineBuiltIn$3(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, {
          unsafe: true
        });
      }
    }
  }
  $$h({
    global: true,
    constructor: true,
    wrap: true,
    forced: !NATIVE_SYMBOL$3,
    sham: !NATIVE_SYMBOL$3
  }, {
    Symbol: $Symbol
  });
  $forEach(objectKeys(WellKnownSymbolsStore), function (name) {
    defineWellKnownSymbol$1(name);
  });
  $$h({
    target: SYMBOL,
    stat: true,
    forced: !NATIVE_SYMBOL$3
  }, {
    useSetter: function useSetter() {
      USE_SETTER = true;
    },
    useSimple: function useSimple() {
      USE_SETTER = false;
    }
  });
  $$h({
    target: 'Object',
    stat: true,
    forced: !NATIVE_SYMBOL$3,
    sham: !DESCRIPTORS$2
  }, {
    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    create: $create,
    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    defineProperty: $defineProperty,
    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    defineProperties: $defineProperties,
    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor
  });
  $$h({
    target: 'Object',
    stat: true,
    forced: !NATIVE_SYMBOL$3
  }, {
    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    getOwnPropertyNames: $getOwnPropertyNames
  });

  // `Symbol.prototype[@@toPrimitive]` method
  // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
  defineSymbolToPrimitive();

  // `Symbol.prototype[@@toStringTag]` property
  // https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
  setToStringTag$2($Symbol, SYMBOL);
  hiddenKeys[HIDDEN] = true;

  var global$a = require$$3$4;
  var isCallable$c = isCallable$i;
  var aFunction = function aFunction(argument) {
    return isCallable$c(argument) ? argument : undefined;
  };
  var getBuiltIn$8 = function (namespace, method) {
    return arguments.length < 2 ? aFunction(global$a[namespace]) : global$a[namespace] && global$a[namespace][method];
  };

  var NATIVE_SYMBOL$2 = require('../internals/symbol-constructor-detection');

  /* eslint-disable es/no-symbol -- safe */
  module.exports = NATIVE_SYMBOL$2 && !!Symbol['for'] && !!Symbol.keyFor;

  var symbolRegistryDetection = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$5$2 = /*@__PURE__*/getAugmentedNamespace(symbolRegistryDetection);

  var $$g = require$$0$8;
  var getBuiltIn$7 = getBuiltIn$8;
  var hasOwn$4 = hasOwnProperty_1;
  var toString$1 = toString$5;
  var shared$1 = sharedExports;
  var NATIVE_SYMBOL_REGISTRY$1 = require$$5$2;
  var StringToSymbolRegistry = shared$1('string-to-symbol-registry');
  var SymbolToStringRegistry$1 = shared$1('symbol-to-string-registry');

  // `Symbol.for` method
  // https://tc39.es/ecma262/#sec-symbol.for
  $$g({
    target: 'Symbol',
    stat: true,
    forced: !NATIVE_SYMBOL_REGISTRY$1
  }, {
    'for': function _for(key) {
      var string = toString$1(key);
      if (hasOwn$4(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
      var symbol = getBuiltIn$7('Symbol')(string);
      StringToSymbolRegistry[string] = symbol;
      SymbolToStringRegistry$1[symbol] = string;
      return symbol;
    }
  });

  var getBuiltIn$6 = require('../internals/get-built-in');
  var isCallable$b = require('../internals/is-callable');
  var isPrototypeOf$2 = require('../internals/object-is-prototype-of');
  var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');
  var $Object = Object;
  module.exports = USE_SYMBOL_AS_UID ? function (it) {
    return _typeof(it) == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn$6('Symbol');
    return isCallable$b($Symbol) && isPrototypeOf$2($Symbol.prototype, $Object(it));
  };

  var isSymbol$4 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$1$3 = /*@__PURE__*/getAugmentedNamespace(isSymbol$4);

  var $String$3 = String;
  var tryToString$4 = function (argument) {
    try {
      return $String$3(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var $$f = require$$0$8;
  var hasOwn$3 = hasOwnProperty_1;
  var isSymbol$3 = require$$1$3;
  var tryToString$3 = tryToString$4;
  var shared = sharedExports;
  var NATIVE_SYMBOL_REGISTRY = require$$5$2;
  var SymbolToStringRegistry = shared('symbol-to-string-registry');

  // `Symbol.keyFor` method
  // https://tc39.es/ecma262/#sec-symbol.keyfor
  $$f({
    target: 'Symbol',
    stat: true,
    forced: !NATIVE_SYMBOL_REGISTRY
  }, {
    keyFor: function keyFor(sym) {
      if (!isSymbol$3(sym)) throw TypeError(tryToString$3(sym) + ' is not a symbol');
      if (hasOwn$3(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
    }
  });

  var $$e = require('../internals/export');
  var getBuiltIn$5 = require('../internals/get-built-in');
  var apply$2 = require('../internals/function-apply');
  var call$9 = require('../internals/function-call');
  var uncurryThis$6 = require('../internals/function-uncurry-this');
  var fails$6 = require('../internals/fails');
  var isCallable$a = require('../internals/is-callable');
  var isSymbol$2 = require('../internals/is-symbol');
  var arraySlice$3 = require('../internals/array-slice');
  var getReplacerFunction = require('../internals/get-json-replacer-function');
  var NATIVE_SYMBOL$1 = require('../internals/symbol-constructor-detection');
  var $String$2 = String;
  var $stringify = getBuiltIn$5('JSON', 'stringify');
  var exec$1 = uncurryThis$6(/./.exec);
  var charAt = uncurryThis$6(''.charAt);
  var charCodeAt = uncurryThis$6(''.charCodeAt);
  var replace$1 = uncurryThis$6(''.replace);
  var numberToString = uncurryThis$6(1.0.toString);
  var tester = /[\uD800-\uDFFF]/g;
  var low = /^[\uD800-\uDBFF]$/;
  var hi = /^[\uDC00-\uDFFF]$/;
  var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL$1 || fails$6(function () {
    var symbol = getBuiltIn$5('Symbol')();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({
      a: symbol
    }) != '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) != '{}';
  });

  // https://github.com/tc39/proposal-well-formed-stringify
  var ILL_FORMED_UNICODE = fails$6(function () {
    return $stringify("\uDF06\uD834") !== "\"\\udf06\\ud834\"" || $stringify("\uDEAD") !== "\"\\udead\"";
  });
  var stringifyWithSymbolsFix = function stringifyWithSymbolsFix(it, replacer) {
    var args = arraySlice$3(arguments);
    var $replacer = getReplacerFunction(replacer);
    if (!isCallable$a($replacer) && (it === undefined || isSymbol$2(it))) return; // IE8 returns string on undefined
    args[1] = function (key, value) {
      // some old implementations (like WebKit) could pass numbers as keys
      if (isCallable$a($replacer)) value = call$9($replacer, this, $String$2(key), value);
      if (!isSymbol$2(value)) return value;
    };
    return apply$2($stringify, null, args);
  };
  var fixIllFormed = function fixIllFormed(match, offset, string) {
    var prev = charAt(string, offset - 1);
    var next = charAt(string, offset + 1);
    if (exec$1(low, match) && !exec$1(hi, next) || exec$1(hi, match) && !exec$1(low, prev)) {
      return "\\u" + numberToString(charCodeAt(match, 0), 16);
    }
    return match;
  };
  if ($stringify) {
    // `JSON.stringify` method
    // https://tc39.es/ecma262/#sec-json.stringify
    $$e({
      target: 'JSON',
      stat: true,
      arity: 3,
      forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE
    }, {
      // eslint-disable-next-line no-unused-vars -- required for `.length`
      stringify: function stringify(it, replacer, space) {
        var args = arraySlice$3(arguments);
        var result = apply$2(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
        return ILL_FORMED_UNICODE && typeof result == 'string' ? replace$1(result, tester, fixIllFormed) : result;
      }
    });
  }

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  exports.f = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$3 = /*@__PURE__*/getAugmentedNamespace(objectGetOwnPropertySymbols);

  var $$d = require$$0$8;
  var NATIVE_SYMBOL = require$$1$5;
  var fails$5 = fails$b;
  var getOwnPropertySymbolsModule = require$$3;
  var toObject = toObject$3;

  // V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  var FORCED$1 = !NATIVE_SYMBOL || fails$5(function () {
    getOwnPropertySymbolsModule.f(1);
  });

  // `Object.getOwnPropertySymbols` method
  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
  $$d({
    target: 'Object',
    stat: true,
    forced: FORCED$1
  }, {
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
      return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
    }
  });

  var classof$2 = require$$0$3;
  var engineIsNode = typeof process != 'undefined' && classof$2(process) == 'process';

  var NATIVE_BIND$1 = require('../internals/function-bind-native');
  var call$8 = Function.prototype.call;
  module.exports = NATIVE_BIND$1 ? call$8.bind(call$8) : function () {
    return call$8.apply(call$8, arguments);
  };

  var functionCall = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(functionCall);

  var defineProperty$2 = require$$1$4.f;
  var hasOwn$2 = hasOwnProperty_1;
  var wellKnownSymbol$7 = wellKnownSymbol$a;
  var TO_STRING_TAG = wellKnownSymbol$7('toStringTag');
  var setToStringTag$1 = function (target, TAG, STATIC) {
    if (target && !STATIC) target = target.prototype;
    if (target && !hasOwn$2(target, TO_STRING_TAG)) {
      defineProperty$2(target, TO_STRING_TAG, {
        configurable: true,
        value: TAG
      });
    }
  };

  var $$c = require('../internals/export');
  var uncurryThis$5 = require('../internals/function-uncurry-this');
  var IndexedObject = require('../internals/indexed-object');
  var toIndexedObject$1 = require('../internals/to-indexed-object');
  var arrayMethodIsStrict = require('../internals/array-method-is-strict');
  var nativeJoin = uncurryThis$5([].join);
  var ES3_STRINGS = IndexedObject != Object;
  var FORCED = ES3_STRINGS || !arrayMethodIsStrict('join', ',');

  // `Array.prototype.join` method
  // https://tc39.es/ecma262/#sec-array.prototype.join
  $$c({
    target: 'Array',
    proto: true,
    forced: FORCED
  }, {
    join: function join(separator) {
      return nativeJoin(toIndexedObject$1(this), separator === undefined ? ',' : separator);
    }
  });

  var uncurryThis$4 = require('../internals/function-uncurry-this');
  var fails$4 = require('../internals/fails');
  var isCallable$9 = require('../internals/is-callable');
  var hasOwn$1 = require('../internals/has-own-property');
  var DESCRIPTORS$1 = require('../internals/descriptors');
  var CONFIGURABLE_FUNCTION_NAME = require('../internals/function-name').CONFIGURABLE;
  var inspectSource$2 = require('../internals/inspect-source');
  var InternalStateModule$1 = require('../internals/internal-state');
  var enforceInternalState = InternalStateModule$1.enforce;
  var getInternalState = InternalStateModule$1.get;
  var $String$1 = String;
  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var defineProperty$1 = Object.defineProperty;
  var stringSlice = uncurryThis$4(''.slice);
  var replace = uncurryThis$4(''.replace);
  var join = uncurryThis$4([].join);
  var CONFIGURABLE_LENGTH = DESCRIPTORS$1 && !fails$4(function () {
    return defineProperty$1(function () {/* empty */}, 'length', {
      value: 8
    }).length !== 8;
  });
  var TEMPLATE = String(String).split('String');
  var makeBuiltIn$1 = module.exports = function (value, name, options) {
    if (stringSlice($String$1(name), 0, 7) === 'Symbol(') {
      name = '[' + replace($String$1(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
    }
    if (options && options.getter) name = 'get ' + name;
    if (options && options.setter) name = 'set ' + name;
    if (!hasOwn$1(value, 'name') || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
      if (DESCRIPTORS$1) defineProperty$1(value, 'name', {
        value: name,
        configurable: true
      });else value.name = name;
    }
    if (CONFIGURABLE_LENGTH && options && hasOwn$1(options, 'arity') && value.length !== options.arity) {
      defineProperty$1(value, 'length', {
        value: options.arity
      });
    }
    try {
      if (options && hasOwn$1(options, 'constructor') && options.constructor) {
        if (DESCRIPTORS$1) defineProperty$1(value, 'prototype', {
          writable: false
        });
        // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
      } else if (value.prototype) value.prototype = undefined;
    } catch (error) {/* empty */}
    var state = enforceInternalState(value);
    if (!hasOwn$1(state, 'source')) {
      state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
    }
    return value;
  };

  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  // eslint-disable-next-line no-extend-native -- required
  Function.prototype.toString = makeBuiltIn$1(function toString() {
    return isCallable$9(this) && getInternalState(this).source || inspectSource$2(this);
  }, 'toString');

  var makeBuiltIn$2 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$0 = /*@__PURE__*/getAugmentedNamespace(makeBuiltIn$2);

  var makeBuiltIn = require$$0;
  var defineProperty = require$$1$4;
  var defineBuiltInAccessor$1 = function (target, name, descriptor) {
    if (descriptor.get) makeBuiltIn(descriptor.get, name, {
      getter: true
    });
    if (descriptor.set) makeBuiltIn(descriptor.set, name, {
      setter: true
    });
    return defineProperty.f(target, name, descriptor);
  };

  var getBuiltIn$4 = getBuiltIn$8;
  var defineBuiltInAccessor = defineBuiltInAccessor$1;
  var wellKnownSymbol$6 = wellKnownSymbol$a;
  var DESCRIPTORS = require$$3$5;
  var SPECIES$4 = wellKnownSymbol$6('species');
  var setSpecies$1 = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn$4(CONSTRUCTOR_NAME);
    if (DESCRIPTORS && Constructor && !Constructor[SPECIES$4]) {
      defineBuiltInAccessor(Constructor, SPECIES$4, {
        configurable: true,
        get: function get() {
          return this;
        }
      });
    }
  };

  var isCallable$8 = isCallable$i;
  var tryToString$2 = tryToString$4;
  var $TypeError$7 = TypeError;

  // `Assert: IsCallable(argument) is true`
  var aCallable$6 = function (argument) {
    if (isCallable$8(argument)) return argument;
    throw $TypeError$7(tryToString$2(argument) + ' is not a function');
  };

  var uncurryThis$3 = require$$0$7;
  var objectIsPrototypeOf = uncurryThis$3({}.isPrototypeOf);

  var isPrototypeOf$1 = objectIsPrototypeOf;
  var $TypeError$6 = TypeError;
  var anInstance$1 = function (it, Prototype) {
    if (isPrototypeOf$1(Prototype, it)) return it;
    throw $TypeError$6('Incorrect invocation');
  };

  var isObject$5 = require$$3$2;
  var $String = String;
  var $TypeError$5 = TypeError;

  // `Assert: Type(argument) is Object`
  var anObject$4 = function (argument) {
    if (isObject$5(argument)) return argument;
    throw $TypeError$5($String(argument) + ' is not an object');
  };

  var uncurryThis$2 = require('../internals/function-uncurry-this');
  var fails$3 = require('../internals/fails');
  var isCallable$7 = require('../internals/is-callable');
  var classof$1 = require('../internals/classof');
  var getBuiltIn$3 = require('../internals/get-built-in');
  var inspectSource$1 = require('../internals/inspect-source');
  var noop = function noop() {/* empty */};
  var empty = [];
  var construct = getBuiltIn$3('Reflect', 'construct');
  var constructorRegExp = /^\s*(?:class|function)\b/;
  var exec = uncurryThis$2(constructorRegExp.exec);
  var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);
  var isConstructorModern = function isConstructor(argument) {
    if (!isCallable$7(argument)) return false;
    try {
      construct(noop, empty, argument);
      return true;
    } catch (error) {
      return false;
    }
  };
  var isConstructorLegacy = function isConstructor(argument) {
    if (!isCallable$7(argument)) return false;
    switch (classof$1(argument)) {
      case 'AsyncFunction':
      case 'GeneratorFunction':
      case 'AsyncGeneratorFunction':
        return false;
    }
    try {
      // we can't check .prototype since constructors produced by .bind haven't it
      // `Function#toString` throws on some built-it function in some legacy engines
      // (for example, `DOMQuad` and similar in FF41-)
      return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource$1(argument));
    } catch (error) {
      return true;
    }
  };
  isConstructorLegacy.sham = true;

  // `IsConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-isconstructor
  module.exports = !construct || fails$3(function () {
    var called;
    return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function () {
      called = true;
    }) || called;
  }) ? isConstructorLegacy : isConstructorModern;

  var isConstructor$2 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$2$2 = /*@__PURE__*/getAugmentedNamespace(isConstructor$2);

  var isConstructor$1 = require$$2$2;
  var tryToString$1 = tryToString$4;
  var $TypeError$4 = TypeError;

  // `Assert: IsConstructor(argument) is true`
  var aConstructor$1 = function (argument) {
    if (isConstructor$1(argument)) return argument;
    throw $TypeError$4(tryToString$1(argument) + ' is not a constructor');
  };

  var anObject$3 = anObject$4;
  var aConstructor = aConstructor$1;
  var isNullOrUndefined$2 = isNullOrUndefined$6;
  var wellKnownSymbol$5 = wellKnownSymbol$a;
  var SPECIES$3 = wellKnownSymbol$5('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.es/ecma262/#sec-speciesconstructor
  var speciesConstructor$2 = function (O, defaultConstructor) {
    var C = anObject$3(O).constructor;
    var S;
    return C === undefined || isNullOrUndefined$2(S = anObject$3(C)[SPECIES$3]) ? defaultConstructor : aConstructor(S);
  };

  var global$9 = require('../internals/global');
  var apply$1 = require('../internals/function-apply');
  var isCallable$6 = require('../internals/is-callable');
  var ENGINE_IS_BUN = require('../internals/engine-is-bun');
  var USER_AGENT = require('../internals/engine-user-agent');
  var arraySlice$2 = require('../internals/array-slice');
  var validateArgumentsLength$1 = require('../internals/validate-arguments-length');
  var Function$2 = global$9.Function;
  // dirty IE9- and Bun 0.3.0- checks
  var WRAP = /MSIE .\./.test(USER_AGENT) || ENGINE_IS_BUN && function () {
    var version = global$9.Bun.version.split('.');
    return version.length < 3 || version[0] == 0 && (version[1] < 3 || version[1] == 3 && version[2] == 0);
  }();

  // IE9- / Bun 0.3.0- setTimeout / setInterval / setImmediate additional parameters fix
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
  // https://github.com/oven-sh/bun/issues/1633
  module.exports = function (scheduler, hasTimeArg) {
    var firstParamIndex = hasTimeArg ? 2 : 1;
    return WRAP ? function (handler, timeout /* , ...arguments */) {
      var boundArgs = validateArgumentsLength$1(arguments.length, 1) > firstParamIndex;
      var fn = isCallable$6(handler) ? handler : Function$2(handler);
      var params = boundArgs ? arraySlice$2(arguments, firstParamIndex) : [];
      var callback = boundArgs ? function () {
        apply$1(fn, this, params);
      } : fn;
      return hasTimeArg ? scheduler(callback, timeout) : scheduler(callback);
    } : scheduler;
  };

  var schedulersFix$2 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$2$1 = /*@__PURE__*/getAugmentedNamespace(schedulersFix$2);

  var $$b = require$$0$8;
  var global$8 = require$$3$4;
  var schedulersFix$1 = require$$2$1;
  var setInterval = schedulersFix$1(global$8.setInterval, true);

  // Bun / IE9- setInterval additional parameters fix
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  $$b({
    global: true,
    bind: true,
    forced: global$8.setInterval !== setInterval
  }, {
    setInterval: setInterval
  });

  var $$a = require$$0$8;
  var global$7 = require$$3$4;
  var schedulersFix = require$$2$1;
  var setTimeout$1 = schedulersFix(global$7.setTimeout, true);

  // Bun / IE9- setTimeout additional parameters fix
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  $$a({
    global: true,
    bind: true,
    forced: global$7.setTimeout !== setTimeout$1
  }, {
    setTimeout: setTimeout$1
  });

  var global$6 = require('../internals/global');
  var apply = require('../internals/function-apply');
  var bind$4 = require('../internals/function-bind-context');
  var isCallable$5 = require('../internals/is-callable');
  var hasOwn = require('../internals/has-own-property');
  var fails$2 = require('../internals/fails');
  var html = require('../internals/html');
  var arraySlice$1 = require('../internals/array-slice');
  var createElement = require('../internals/document-create-element');
  var validateArgumentsLength = require('../internals/validate-arguments-length');
  var IS_IOS$1 = require('../internals/engine-is-ios');
  var IS_NODE$2 = require('../internals/engine-is-node');
  var set = global$6.setImmediate;
  var clear = global$6.clearImmediate;
  var process$4 = global$6.process;
  var Dispatch = global$6.Dispatch;
  var Function$1 = global$6.Function;
  var MessageChannel = global$6.MessageChannel;
  var String$1 = global$6.String;
  var counter = 0;
  var queue$2 = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var $location, defer, channel, port;
  fails$2(function () {
    // Deno throws a ReferenceError on `location` access without `--location` flag
    $location = global$6.location;
  });
  var run = function run(id) {
    if (hasOwn(queue$2, id)) {
      var fn = queue$2[id];
      delete queue$2[id];
      fn();
    }
  };
  var runner = function runner(id) {
    return function () {
      run(id);
    };
  };
  var eventListener = function eventListener(event) {
    run(event.data);
  };
  var globalPostMessageDefer = function globalPostMessageDefer(id) {
    // old engines have not location.origin
    global$6.postMessage(String$1(id), $location.protocol + '//' + $location.host);
  };

  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!set || !clear) {
    set = function setImmediate(handler) {
      validateArgumentsLength(arguments.length, 1);
      var fn = isCallable$5(handler) ? handler : Function$1(handler);
      var args = arraySlice$1(arguments, 1);
      queue$2[++counter] = function () {
        apply(fn, undefined, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue$2[id];
    };
    // Node.js 0.8-
    if (IS_NODE$2) {
      defer = function defer(id) {
        process$4.nextTick(runner(id));
      };
      // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function defer(id) {
        Dispatch.now(runner(id));
      };
      // Browsers with MessageChannel, includes WebWorkers
      // except iOS - https://github.com/zloirock/core-js/issues/624
    } else if (MessageChannel && !IS_IOS$1) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = eventListener;
      defer = bind$4(port.postMessage, port);
      // Browsers with postMessage, skip WebWorkers
      // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (global$6.addEventListener && isCallable$5(global$6.postMessage) && !global$6.importScripts && $location && $location.protocol !== 'file:' && !fails$2(globalPostMessageDefer)) {
      defer = globalPostMessageDefer;
      global$6.addEventListener('message', eventListener, false);
      // IE8-
    } else if (ONREADYSTATECHANGE in createElement('script')) {
      defer = function defer(id) {
        html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
          html.removeChild(this);
          run(id);
        };
      };
      // Rest old browsers
    } else {
      defer = function defer(id) {
        setTimeout(runner(id), 0);
      };
    }
  }
  module.exports = {
    set: set,
    clear: clear
  };

  var task$1 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$14 = /*@__PURE__*/getAugmentedNamespace(task$1);

  var uncurryThis$1 = require('../internals/function-uncurry-this-clause');
  var aCallable$5 = require('../internals/a-callable');
  var NATIVE_BIND = require('../internals/function-bind-native');
  var bind$3 = uncurryThis$1(uncurryThis$1.bind);

  // optional / simple context binding
  module.exports = function (fn, that) {
    aCallable$5(fn);
    return that === undefined ? fn : NATIVE_BIND ? bind$3(fn, that) : function /* ...args */
    () {
      return fn.apply(that, arguments);
    };
  };

  var functionBindContext = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$1$2 = /*@__PURE__*/getAugmentedNamespace(functionBindContext);

  var Queue$2 = function Queue() {
    this.head = null;
    this.tail = null;
  };
  Queue$2.prototype = {
    add: function add(item) {
      var entry = {
        item: item,
        next: null
      };
      var tail = this.tail;
      if (tail) tail.next = entry;else this.head = entry;
      this.tail = entry;
    },
    get: function get() {
      var entry = this.head;
      if (entry) {
        var next = this.head = entry.next;
        if (next === null) this.tail = null;
        return entry.item;
      }
    }
  };
  var queue$1 = Queue$2;

  var userAgent$3 = require('../internals/engine-user-agent');

  // eslint-disable-next-line redos/no-vulnerable -- safe
  module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$3);

  var engineIsIos = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$5$1 = /*@__PURE__*/getAugmentedNamespace(engineIsIos);

  var userAgent$2 = require('../internals/engine-user-agent');
  module.exports = /ipad|iphone|ipod/i.test(userAgent$2) && typeof Pebble != 'undefined';

  var engineIsIosPebble = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$6 = /*@__PURE__*/getAugmentedNamespace(engineIsIosPebble);

  var userAgent$1 = require('../internals/engine-user-agent');
  module.exports = /web0s(?!.*chrome)/i.test(userAgent$1);

  var engineIsWebosWebkit = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$7 = /*@__PURE__*/getAugmentedNamespace(engineIsWebosWebkit);

  var global$5 = require$$3$4;
  var bind$2 = require$$1$2;
  var getOwnPropertyDescriptor = require$$2$4.f;
  var macrotask = require$$14.set;
  var Queue$1 = queue$1;
  var IS_IOS = require$$5$1;
  var IS_IOS_PEBBLE = require$$6;
  var IS_WEBOS_WEBKIT = require$$7;
  var IS_NODE$1 = engineIsNode;
  var MutationObserver = global$5.MutationObserver || global$5.WebKitMutationObserver;
  var document$2 = global$5.document;
  var process$3 = global$5.process;
  var Promise$1 = global$5.Promise;
  // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
  var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global$5, 'queueMicrotask');
  var microtask$1 = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
  var notify$1, toggle, node, promise, then;

  // modern engines have queueMicrotask method
  if (!microtask$1) {
    var queue = new Queue$1();
    var flush = function flush() {
      var parent, fn;
      if (IS_NODE$1 && (parent = process$3.domain)) parent.exit();
      while (fn = queue.get()) try {
        fn();
      } catch (error) {
        if (queue.head) notify$1();
        throw error;
      }
      if (parent) parent.enter();
    };

    // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
    // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
    if (!IS_IOS && !IS_NODE$1 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
      toggle = true;
      node = document$2.createTextNode('');
      new MutationObserver(flush).observe(node, {
        characterData: true
      });
      notify$1 = function notify() {
        node.data = toggle = !toggle;
      };
      // environments with maybe non-completely correct, but existent Promise
    } else if (!IS_IOS_PEBBLE && Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      promise = Promise$1.resolve(undefined);
      // workaround of WebKit ~ iOS Safari 10.1 bug
      promise.constructor = Promise$1;
      then = bind$2(promise.then, promise);
      notify$1 = function notify() {
        then(flush);
      };
      // Node.js without promises
    } else if (IS_NODE$1) {
      notify$1 = function notify() {
        process$3.nextTick(flush);
      };
      // for other environments - macrotask based on:
      // - setImmediate
      // - MessageChannel
      // - window.postMessage
      // - onreadystatechange
      // - setTimeout
    } else {
      // `webpack` dev server bug on IE global methods - use bind(fn, global)
      macrotask = bind$2(macrotask, global$5);
      notify$1 = function notify() {
        macrotask(flush);
      };
    }
    microtask$1 = function microtask(fn) {
      if (!queue.head) notify$1();
      queue.add(fn);
    };
  }
  var microtask_1 = microtask$1;

  var hostReportErrors$1 = function (a, b) {
    try {
      // eslint-disable-next-line no-console -- safe
      arguments.length == 1 ? console.error(a) : console.error(a, b);
    } catch (error) {/* empty */}
  };

  var perform$3 = function (exec) {
    try {
      return {
        error: false,
        value: exec()
      };
    } catch (error) {
      return {
        error: true,
        value: error
      };
    }
  };

  var global$4 = require$$3$4;
  var promiseNativeConstructor = global$4.Promise;

  var $$9 = require('../internals/export');
  var IS_PURE$1 = require('../internals/is-pure');
  var NativePromiseConstructor$4 = require('../internals/promise-native-constructor');
  var fails$1 = require('../internals/fails');
  var getBuiltIn$2 = require('../internals/get-built-in');
  var isCallable$4 = require('../internals/is-callable');
  var speciesConstructor$1 = require('../internals/species-constructor');
  var promiseResolve$2 = require('../internals/promise-resolve');
  var defineBuiltIn$2 = require('../internals/define-built-in');
  var NativePromisePrototype$3 = NativePromiseConstructor$4 && NativePromiseConstructor$4.prototype;

  // Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
  var NON_GENERIC = !!NativePromiseConstructor$4 && fails$1(function () {
    // eslint-disable-next-line unicorn/no-thenable -- required for testing
    NativePromisePrototype$3['finally'].call({
      then: function then() {/* empty */}
    }, function () {/* empty */});
  });

  // `Promise.prototype.finally` method
  // https://tc39.es/ecma262/#sec-promise.prototype.finally
  $$9({
    target: 'Promise',
    proto: true,
    real: true,
    forced: NON_GENERIC
  }, {
    'finally': function _finally(onFinally) {
      var C = speciesConstructor$1(this, getBuiltIn$2('Promise'));
      var isFunction = isCallable$4(onFinally);
      return this.then(isFunction ? function (x) {
        return promiseResolve$2(C, onFinally()).then(function () {
          return x;
        });
      } : onFinally, isFunction ? function (e) {
        return promiseResolve$2(C, onFinally()).then(function () {
          throw e;
        });
      } : onFinally);
    }
  });

  // makes sure that native promise-based APIs `Promise#finally` properly works with patched `Promise#then`
  if (!IS_PURE$1 && isCallable$4(NativePromiseConstructor$4)) {
    var method$1 = getBuiltIn$2('Promise').prototype['finally'];
    if (NativePromisePrototype$3['finally'] !== method$1) {
      defineBuiltIn$2(NativePromisePrototype$3, 'finally', method$1, {
        unsafe: true
      });
    }
  }

  var global$3 = require('../internals/global');
  var NativePromiseConstructor$3 = require('../internals/promise-native-constructor');
  var isCallable$3 = require('../internals/is-callable');
  var isForced = require('../internals/is-forced');
  var inspectSource = require('../internals/inspect-source');
  var wellKnownSymbol$4 = require('../internals/well-known-symbol');
  var IS_BROWSER = require('../internals/engine-is-browser');
  var IS_DENO = require('../internals/engine-is-deno');
  var IS_PURE = require('../internals/is-pure');
  var V8_VERSION$1 = require('../internals/engine-v8-version');
  var NativePromisePrototype$2 = NativePromiseConstructor$3 && NativePromiseConstructor$3.prototype;
  var SPECIES$2 = wellKnownSymbol$4('species');
  var SUBCLASSING = false;
  var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable$3(global$3.PromiseRejectionEvent);
  var FORCED_PROMISE_CONSTRUCTOR$5 = isForced('Promise', function () {
    var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor$3);
    var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor$3);
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION$1 === 66) return true;
    // We need Promise#{ catch, finally } in the pure version for preventing prototype pollution
    if (IS_PURE && !(NativePromisePrototype$2['catch'] && NativePromisePrototype$2['finally'])) return true;
    // We can't use @@species feature detection in V8 since it causes
    // deoptimization and performance degradation
    // https://github.com/zloirock/core-js/issues/679
    if (!V8_VERSION$1 || V8_VERSION$1 < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
      // Detect correctness of subclassing with @@species support
      var promise = new NativePromiseConstructor$3(function (resolve) {
        resolve(1);
      });
      var FakePromise = function FakePromise(exec) {
        exec(function () {/* empty */}, function () {/* empty */});
      };
      var constructor = promise.constructor = {};
      constructor[SPECIES$2] = FakePromise;
      SUBCLASSING = promise.then(function () {/* empty */}) instanceof FakePromise;
      if (!SUBCLASSING) return true;
      // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    }
    return !GLOBAL_CORE_JS_PROMISE && (IS_BROWSER || IS_DENO) && !NATIVE_PROMISE_REJECTION_EVENT$1;
  });
  module.exports = {
    CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
    REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
    SUBCLASSING: SUBCLASSING
  };

  var promiseConstructorDetection = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$4$1 = /*@__PURE__*/getAugmentedNamespace(promiseConstructorDetection);

  var newPromiseCapability$2 = {};

  var aCallable$4 = aCallable$6;
  var $TypeError$3 = TypeError;
  var PromiseCapability = function PromiseCapability(C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) throw $TypeError$3('Bad Promise constructor');
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aCallable$4(resolve);
    this.reject = aCallable$4(reject);
  };

  // `NewPromiseCapability` abstract operation
  // https://tc39.es/ecma262/#sec-newpromisecapability
  newPromiseCapability$2.f = function (C) {
    return new PromiseCapability(C);
  };

  var $$8 = require$$0$8;
  var IS_NODE = engineIsNode;
  var global$2 = require$$3$4;
  var call$7 = require$$0$1;
  var defineBuiltIn$1 = require$$6$1;
  var setPrototypeOf = require$$6$2;
  var setToStringTag = setToStringTag$1;
  var setSpecies = setSpecies$1;
  var aCallable$3 = aCallable$6;
  var isCallable$2 = isCallable$i;
  var isObject$4 = require$$3$2;
  var anInstance = anInstance$1;
  var speciesConstructor = speciesConstructor$2;
  var task = require$$14.set;
  var microtask = microtask_1;
  var hostReportErrors = hostReportErrors$1;
  var perform$2 = perform$3;
  var Queue = queue$1;
  var InternalStateModule = internalState;
  var NativePromiseConstructor$2 = promiseNativeConstructor;
  var PromiseConstructorDetection = require$$4$1;
  var newPromiseCapabilityModule$3 = newPromiseCapability$2;
  var PROMISE = 'Promise';
  var FORCED_PROMISE_CONSTRUCTOR$4 = PromiseConstructorDetection.CONSTRUCTOR;
  var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
  var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
  var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
  var setInternalState = InternalStateModule.set;
  var NativePromisePrototype$1 = NativePromiseConstructor$2 && NativePromiseConstructor$2.prototype;
  var PromiseConstructor = NativePromiseConstructor$2;
  var PromisePrototype = NativePromisePrototype$1;
  var TypeError$1 = global$2.TypeError;
  var document$1 = global$2.document;
  var process$2 = global$2.process;
  var newPromiseCapability$1 = newPromiseCapabilityModule$3.f;
  var newGenericPromiseCapability = newPromiseCapability$1;
  var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$2.dispatchEvent);
  var UNHANDLED_REJECTION = 'unhandledrejection';
  var REJECTION_HANDLED = 'rejectionhandled';
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

  // helpers
  var isThenable = function isThenable(it) {
    var then;
    return isObject$4(it) && isCallable$2(then = it.then) ? then : false;
  };
  var callReaction = function callReaction(reaction, state) {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var handler = ok ? reaction.ok : reaction.fail;
    var resolve = reaction.resolve;
    var reject = reaction.reject;
    var domain = reaction.domain;
    var result, then, exited;
    try {
      if (handler) {
        if (!ok) {
          if (state.rejection === UNHANDLED) onHandleUnhandled(state);
          state.rejection = HANDLED;
        }
        if (handler === true) result = value;else {
          if (domain) domain.enter();
          result = handler(value); // can throw
          if (domain) {
            domain.exit();
            exited = true;
          }
        }
        if (result === reaction.promise) {
          reject(TypeError$1('Promise-chain cycle'));
        } else if (then = isThenable(result)) {
          call$7(then, result, resolve, reject);
        } else resolve(result);
      } else reject(value);
    } catch (error) {
      if (domain && !exited) domain.exit();
      reject(error);
    }
  };
  var notify = function notify(state, isReject) {
    if (state.notified) return;
    state.notified = true;
    microtask(function () {
      var reactions = state.reactions;
      var reaction;
      while (reaction = reactions.get()) {
        callReaction(reaction, state);
      }
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(state);
    });
  };
  var dispatchEvent = function dispatchEvent(name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document$1.createEvent('Event');
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      global$2.dispatchEvent(event);
    } else event = {
      promise: promise,
      reason: reason
    };
    if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global$2['on' + name])) handler(event);else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
  };
  var onUnhandled = function onUnhandled(state) {
    call$7(task, global$2, function () {
      var promise = state.facade;
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform$2(function () {
          if (IS_NODE) {
            process$2.emit('unhandledRejection', value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };
  var isUnhandled = function isUnhandled(state) {
    return state.rejection !== HANDLED && !state.parent;
  };
  var onHandleUnhandled = function onHandleUnhandled(state) {
    call$7(task, global$2, function () {
      var promise = state.facade;
      if (IS_NODE) {
        process$2.emit('rejectionHandled', promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };
  var bind$1 = function bind(fn, state, unwrap) {
    return function (value) {
      fn(state, value, unwrap);
    };
  };
  var internalReject = function internalReject(state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify(state, true);
  };
  var internalResolve = function internalResolve(state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (state.facade === value) throw TypeError$1("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function () {
          var wrapper = {
            done: false
          };
          try {
            call$7(then, value, bind$1(internalResolve, wrapper, state), bind$1(internalReject, wrapper, state));
          } catch (error) {
            internalReject(wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify(state, false);
      }
    } catch (error) {
      internalReject({
        done: false
      }, error, state);
    }
  };

  // constructor polyfill
  if (FORCED_PROMISE_CONSTRUCTOR$4) {
    // 25.4.3.1 Promise(executor)
    PromiseConstructor = function Promise(executor) {
      anInstance(this, PromisePrototype);
      aCallable$3(executor);
      call$7(Internal, this);
      var state = getInternalPromiseState(this);
      try {
        executor(bind$1(internalResolve, state), bind$1(internalReject, state));
      } catch (error) {
        internalReject(state, error);
      }
    };
    PromisePrototype = PromiseConstructor.prototype;

    // eslint-disable-next-line no-unused-vars -- required for `.length`
    Internal = function Promise(executor) {
      setInternalState(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: new Queue(),
        rejection: false,
        state: PENDING,
        value: undefined
      });
    };

    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    Internal.prototype = defineBuiltIn$1(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
      state.parent = true;
      reaction.ok = isCallable$2(onFulfilled) ? onFulfilled : true;
      reaction.fail = isCallable$2(onRejected) && onRejected;
      reaction.domain = IS_NODE ? process$2.domain : undefined;
      if (state.state == PENDING) state.reactions.add(reaction);else microtask(function () {
        callReaction(reaction, state);
      });
      return reaction.promise;
    });
    OwnPromiseCapability = function OwnPromiseCapability() {
      var promise = new Internal();
      var state = getInternalPromiseState(promise);
      this.promise = promise;
      this.resolve = bind$1(internalResolve, state);
      this.reject = bind$1(internalReject, state);
    };
    newPromiseCapabilityModule$3.f = newPromiseCapability$1 = function newPromiseCapability(C) {
      return C === PromiseConstructor || C === PromiseWrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
    };
    if (isCallable$2(NativePromiseConstructor$2) && NativePromisePrototype$1 !== Object.prototype) {
      nativeThen = NativePromisePrototype$1.then;
      if (!NATIVE_PROMISE_SUBCLASSING) {
        // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
        defineBuiltIn$1(NativePromisePrototype$1, 'then', function then(onFulfilled, onRejected) {
          var that = this;
          return new PromiseConstructor(function (resolve, reject) {
            call$7(nativeThen, that, resolve, reject);
          }).then(onFulfilled, onRejected);
          // https://github.com/zloirock/core-js/issues/640
        }, {
          unsafe: true
        });
      }

      // make `.constructor === Promise` work for native promise-based APIs
      try {
        delete NativePromisePrototype$1.constructor;
      } catch (error) {/* empty */}

      // make `instanceof Promise` work for native promise-based APIs
      if (setPrototypeOf) {
        setPrototypeOf(NativePromisePrototype$1, PromisePrototype);
      }
    }
  }
  $$8({
    global: true,
    constructor: true,
    wrap: true,
    forced: FORCED_PROMISE_CONSTRUCTOR$4
  }, {
    Promise: PromiseConstructor
  });
  setToStringTag(PromiseConstructor, PROMISE, false);
  setSpecies(PROMISE);

  var bind = require('../internals/function-bind-context');
  var call$6 = require('../internals/function-call');
  var anObject$2 = require('../internals/an-object');
  var tryToString = require('../internals/try-to-string');
  var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
  var lengthOfArrayLike$2 = require('../internals/length-of-array-like');
  var isPrototypeOf = require('../internals/object-is-prototype-of');
  var getIterator = require('../internals/get-iterator');
  var getIteratorMethod = require('../internals/get-iterator-method');
  var iteratorClose = require('../internals/iterator-close');
  var $TypeError$2 = TypeError;
  var Result = function Result(stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };
  var ResultPrototype = Result.prototype;
  module.exports = function (iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_RECORD = !!(options && options.IS_RECORD);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = bind(unboundFunction, that);
    var iterator, iterFn, index, length, result, next, step;
    var stop = function stop(condition) {
      if (iterator) iteratorClose(iterator, 'normal', condition);
      return new Result(true, condition);
    };
    var callFn = function callFn(value) {
      if (AS_ENTRIES) {
        anObject$2(value);
        return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
      }
      return INTERRUPTED ? fn(value, stop) : fn(value);
    };
    if (IS_RECORD) {
      iterator = iterable.iterator;
    } else if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (!iterFn) throw $TypeError$2(tryToString(iterable) + ' is not iterable');
      // optimisation for array iterators
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = lengthOfArrayLike$2(iterable); length > index; index++) {
          result = callFn(iterable[index]);
          if (result && isPrototypeOf(ResultPrototype, result)) return result;
        }
        return new Result(false);
      }
      iterator = getIterator(iterable, iterFn);
    }
    next = IS_RECORD ? iterable.next : iterator.next;
    while (!(step = call$6(next, iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose(iterator, 'throw', error);
      }
      if (_typeof(result) == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
    }
    return new Result(false);
  };

  var iterate$2 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$5 = /*@__PURE__*/getAugmentedNamespace(iterate$2);

  var $$7 = require('../internals/export');
  var from = require('../internals/array-from');
  var checkCorrectnessOfIteration$2 = require('../internals/check-correctness-of-iteration');
  var INCORRECT_ITERATION = !checkCorrectnessOfIteration$2(function (iterable) {
    // eslint-disable-next-line es/no-array-from -- required for testing
    Array.from(iterable);
  });

  // `Array.from` method
  // https://tc39.es/ecma262/#sec-array.from
  $$7({
    target: 'Array',
    stat: true,
    forced: INCORRECT_ITERATION
  }, {
    from: from
  });

  var wellKnownSymbol$3 = require('../internals/well-known-symbol');
  var ITERATOR = wellKnownSymbol$3('iterator');
  var SAFE_CLOSING = false;
  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function next() {
        return {
          done: !!called++
        };
      },
      'return': function _return() {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR] = function () {
      return this;
    };
    // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
    Array.from(iteratorWithReturn, function () {
      throw 2;
    });
  } catch (error) {/* empty */}
  module.exports = function (exec, SKIP_CLOSING) {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR] = function () {
        return {
          next: function next() {
            return {
              done: ITERATION_SUPPORT = true
            };
          }
        };
      };
      exec(object);
    } catch (error) {/* empty */}
    return ITERATION_SUPPORT;
  };

  var checkCorrectnessOfIteration$1 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$1$1 = /*@__PURE__*/getAugmentedNamespace(checkCorrectnessOfIteration$1);

  var NativePromiseConstructor$1 = promiseNativeConstructor;
  var checkCorrectnessOfIteration = require$$1$1;
  var FORCED_PROMISE_CONSTRUCTOR$3 = require$$4$1.CONSTRUCTOR;
  var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration(function (iterable) {
    NativePromiseConstructor$1.all(iterable).then(undefined, function () {/* empty */});
  });

  var $$6 = require$$0$8;
  var call$5 = require$$0$1;
  var aCallable$2 = aCallable$6;
  var newPromiseCapabilityModule$2 = newPromiseCapability$2;
  var perform$1 = perform$3;
  var iterate$1 = require$$5;
  var PROMISE_STATICS_INCORRECT_ITERATION$1 = promiseStaticsIncorrectIteration;

  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  $$6({
    target: 'Promise',
    stat: true,
    forced: PROMISE_STATICS_INCORRECT_ITERATION$1
  }, {
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapabilityModule$2.f(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform$1(function () {
        var $promiseResolve = aCallable$2(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate$1(iterable, function (promise) {
          var index = counter++;
          var alreadyCalled = false;
          remaining++;
          call$5($promiseResolve, C, promise).then(function (value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  var $$5 = require$$0$8;
  var FORCED_PROMISE_CONSTRUCTOR$2 = require$$4$1.CONSTRUCTOR;
  var NativePromiseConstructor = promiseNativeConstructor;
  var getBuiltIn$1 = getBuiltIn$8;
  var isCallable$1 = isCallable$i;
  var defineBuiltIn = require$$6$1;
  var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

  // `Promise.prototype.catch` method
  // https://tc39.es/ecma262/#sec-promise.prototype.catch
  $$5({
    target: 'Promise',
    proto: true,
    forced: FORCED_PROMISE_CONSTRUCTOR$2,
    real: true
  }, {
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });

  // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
  if (isCallable$1(NativePromiseConstructor)) {
    var method = getBuiltIn$1('Promise').prototype['catch'];
    if (NativePromisePrototype['catch'] !== method) {
      defineBuiltIn(NativePromisePrototype, 'catch', method, {
        unsafe: true
      });
    }
  }

  var $$4 = require$$0$8;
  var call$4 = require$$0$1;
  var aCallable$1 = aCallable$6;
  var newPromiseCapabilityModule$1 = newPromiseCapability$2;
  var perform = perform$3;
  var iterate = require$$5;
  var PROMISE_STATICS_INCORRECT_ITERATION = promiseStaticsIncorrectIteration;

  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  $$4({
    target: 'Promise',
    stat: true,
    forced: PROMISE_STATICS_INCORRECT_ITERATION
  }, {
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapabilityModule$1.f(C);
      var reject = capability.reject;
      var result = perform(function () {
        var $promiseResolve = aCallable$1(C.resolve);
        iterate(iterable, function (promise) {
          call$4($promiseResolve, C, promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });

  var $$3 = require$$0$8;
  var call$3 = require$$0$1;
  var newPromiseCapabilityModule = newPromiseCapability$2;
  var FORCED_PROMISE_CONSTRUCTOR$1 = require$$4$1.CONSTRUCTOR;

  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  $$3({
    target: 'Promise',
    stat: true,
    forced: FORCED_PROMISE_CONSTRUCTOR$1
  }, {
    reject: function reject(r) {
      var capability = newPromiseCapabilityModule.f(this);
      call$3(capability.reject, undefined, r);
      return capability.promise;
    }
  });

  var anObject$1 = anObject$4;
  var isObject$3 = require$$3$2;
  var newPromiseCapability = newPromiseCapability$2;
  var promiseResolve$1 = function (C, x) {
    anObject$1(C);
    if (isObject$3(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var $$2 = require$$0$8;
  var getBuiltIn = getBuiltIn$8;
  var FORCED_PROMISE_CONSTRUCTOR = require$$4$1.CONSTRUCTOR;
  var promiseResolve = promiseResolve$1;
  getBuiltIn('Promise');

  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  $$2({
    target: 'Promise',
    stat: true,
    forced: FORCED_PROMISE_CONSTRUCTOR
  }, {
    resolve: function resolve(x) {
      return promiseResolve(this, x);
    }
  });

  var $$1 = require$$0$8;
  var isArray$2 = require$$1;

  // `Array.isArray` method
  // https://tc39.es/ecma262/#sec-array.isarray
  $$1({
    target: 'Array',
    stat: true
  }, {
    isArray: isArray$2
  });

  var classof = require('../internals/classof-raw');

  // `IsArray` abstract operation
  // https://tc39.es/ecma262/#sec-isarray
  // eslint-disable-next-line es/no-array-isarray -- safe
  module.exports = Array.isArray || function isArray(argument) {
    return classof(argument) == 'Array';
  };

  var isArray$1 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$1 = /*@__PURE__*/getAugmentedNamespace(isArray$1);

  var toIntegerOrInfinity$1 = toIntegerOrInfinity$3;
  var max$1 = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$1 = function (index, length) {
    var integer = toIntegerOrInfinity$1(index);
    return integer < 0 ? max$1(integer + length, 0) : min$1(integer, length);
  };

  var toIntegerOrInfinity = toIntegerOrInfinity$3;
  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength$2 = function (argument) {
    return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var toLength$1 = toLength$2;

  // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike
  var lengthOfArrayLike$1 = function (obj) {
    return toLength$1(obj.length);
  };

  var aCallable = aCallable$6;
  var isNullOrUndefined$1 = isNullOrUndefined$6;

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod$2 = function (V, P) {
    var func = V[P];
    return isNullOrUndefined$1(func) ? undefined : aCallable(func);
  };

  var call$2 = require('../internals/function-call');
  var isCallable = require('../internals/is-callable');
  var isObject$2 = require('../internals/is-object');
  var $TypeError$1 = TypeError;

  // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
  module.exports = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable(fn = input.toString) && !isObject$2(val = call$2(fn, input))) return val;
    if (isCallable(fn = input.valueOf) && !isObject$2(val = call$2(fn, input))) return val;
    if (pref !== 'string' && isCallable(fn = input.toString) && !isObject$2(val = call$2(fn, input))) return val;
    throw $TypeError$1("Can't convert object to primitive value");
  };

  var ordinaryToPrimitive$1 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$4 = /*@__PURE__*/getAugmentedNamespace(ordinaryToPrimitive$1);

  var call$1 = require$$0$1;
  var isObject$1 = require$$3$2;
  var isSymbol$1 = require$$1$3;
  var getMethod$1 = getMethod$2;
  var ordinaryToPrimitive = require$$4;
  var wellKnownSymbol$2 = wellKnownSymbol$a;
  var $TypeError = TypeError;
  var TO_PRIMITIVE = wellKnownSymbol$2('toPrimitive');

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  var toPrimitive$1 = function (input, pref) {
    if (!isObject$1(input) || isSymbol$1(input)) return input;
    var exoticToPrim = getMethod$1(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
      if (pref === undefined) pref = 'default';
      result = call$1(exoticToPrim, input, pref);
      if (!isObject$1(result) || isSymbol$1(result)) return result;
      throw $TypeError("Can't convert object to primitive value");
    }
    if (pref === undefined) pref = 'number';
    return ordinaryToPrimitive(input, pref);
  };

  var toPrimitive = toPrimitive$1;
  var isSymbol = require$$1$3;

  // `ToPropertyKey` abstract operation
  // https://tc39.es/ecma262/#sec-topropertykey
  var toPropertyKey$1 = function (argument) {
    var key = toPrimitive(argument, 'string');
    return isSymbol(key) ? key : key + '';
  };

  var toPropertyKey = toPropertyKey$1;
  var definePropertyModule = require$$1$4;
  var createPropertyDescriptor = createPropertyDescriptor$3;
  var createProperty$1 = function (object, key, value) {
    var propertyKey = toPropertyKey(key);
    if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
  };

  var call = require('../internals/function-call');
  var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
  var anObject = require('../internals/an-object');
  var isNullOrUndefined = require('../internals/is-null-or-undefined');
  var toLength = require('../internals/to-length');
  var toString = require('../internals/to-string');
  var requireObjectCoercible = require('../internals/require-object-coercible');
  var getMethod = require('../internals/get-method');
  var advanceStringIndex = require('../internals/advance-string-index');
  var regExpExec = require('../internals/regexp-exec-abstract');

  // @@match logic
  fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
    return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = isNullOrUndefined(regexp) ? undefined : getMethod(regexp, MATCH);
      return matcher ? call(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(nativeMatch, rx, S);
      if (res.done) return res.value;
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = toString(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }];
  });

  var global$1 = require('../internals/global');
  var userAgent = require('../internals/engine-user-agent');
  var process$1 = global$1.process;
  var Deno = global$1.Deno;
  var versions = process$1 && process$1.versions || Deno && Deno.version;
  var v8 = versions && versions.v8;
  var match, version$1;
  if (v8) {
    match = v8.split('.');
    // in old Chrome, versions of V8 isn't V8 = Chrome / 10
    // but their correct versions are not interesting for us
    version$1 = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
  }

  // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
  // so check `userAgent` even if `.v8` exists, but 0
  if (!version$1 && userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version$1 = +match[1];
    }
  }
  module.exports = version$1;

  var engineV8Version = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$2 = /*@__PURE__*/getAugmentedNamespace(engineV8Version);

  var fails = fails$b;
  var wellKnownSymbol$1 = wellKnownSymbol$a;
  var V8_VERSION = require$$2;
  var SPECIES$1 = wellKnownSymbol$1('species');
  var arrayMethodHasSpeciesSupport$1 = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return V8_VERSION >= 51 || !fails(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES$1] = function () {
        return {
          foo: 1
        };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var uncurryThis = require('../internals/function-uncurry-this');
  module.exports = uncurryThis([].slice);

  var arraySlice = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var require$$10 = /*@__PURE__*/getAugmentedNamespace(arraySlice);

  var $ = require$$0$8;
  var isArray = require$$1;
  var isConstructor = require$$2$2;
  var isObject = require$$3$2;
  var toAbsoluteIndex = toAbsoluteIndex$1;
  var lengthOfArrayLike = lengthOfArrayLike$1;
  var toIndexedObject = toIndexedObject$6;
  var createProperty = createProperty$1;
  var wellKnownSymbol = wellKnownSymbol$a;
  var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$1;
  var nativeSlice = require$$10;
  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
  var SPECIES = wellKnownSymbol('species');
  var $Array = Array;
  var max = Math.max;

  // `Array.prototype.slice` method
  // https://tc39.es/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  $({
    target: 'Array',
    proto: true,
    forced: !HAS_SPECIES_SUPPORT
  }, {
    slice: function slice(start, end) {
      var O = toIndexedObject(this);
      var length = lengthOfArrayLike(O);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length);
      // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
      var Constructor, result, n;
      if (isArray(O)) {
        Constructor = O.constructor;
        // cross-realm fallback
        if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
          Constructor = undefined;
        } else if (isObject(Constructor)) {
          Constructor = Constructor[SPECIES];
          if (Constructor === null) Constructor = undefined;
        }
        if (Constructor === $Array || Constructor === undefined) {
          return nativeSlice(O, k, fin);
        }
      }
      result = new (Constructor === undefined ? $Array : Constructor)(max(fin - k, 0));
      for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
      result.length = n;
      return result;
    }
  });

  var defineWellKnownSymbol = wellKnownSymbolDefine;

  // `Symbol.asyncIterator` well-known symbol
  // https://tc39.es/ecma262/#sec-symbol.asynciterator
  defineWellKnownSymbol('asyncIterator');

  var _assign = function __assign() {
    _assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return _assign.apply(this, arguments);
  };
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function sent() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return g = {
      next: verb(0),
      "throw": verb(1),
      "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
      return this;
    }), g;
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true
      };
    }
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }

  var name = "@tubefast/core";
  var version = "1.0.1-alpha.7";
  var description = "";
  var main = "dist/index.min.js";
  var scripts = {
  	build: "rollup -c --bundleConfigAsCjs",
  	"build:watch": "rollup -c --bundleConfigAsCjs --watch"
  };
  var repository = {
  	type: "git",
  	url: "git+https://github.com/xjq7/monitor.git"
  };
  var keywords = [
  ];
  var author = "";
  var license = "ISC";
  var bugs = {
  	url: "https://github.com/xjq7/monitor/issues"
  };
  var homepage = "https://github.com/xjq7/monitor#readme";
  var devDependencies = {
  	"@babel/core": "^7.21.0",
  	"@babel/plugin-transform-runtime": "^7.21.0",
  	"@babel/preset-env": "^7.20.2",
  	"@babel/preset-typescript": "^7.21.0",
  	"@rollup/plugin-babel": "^6.0.3",
  	"@rollup/plugin-commonjs": "^24.0.1",
  	"@rollup/plugin-json": "^6.0.0",
  	"@rollup/plugin-node-resolve": "^15.0.1",
  	"@rollup/plugin-terser": "^0.4.0",
  	"@rollup/plugin-typescript": "^11.0.0",
  	"@types/node": "^18.14.2",
  	"cross-env": "^7.0.3",
  	emittery: "^1.0.1",
  	jest: "^29.4.3",
  	prettier: "^2.8.4",
  	rimraf: "^4.1.2",
  	rollup: "^3.17.3",
  	"rollup-plugin-clear": "^2.0.7",
  	"rollup-plugin-ts": "^3.2.0",
  	tslib: "^2.5.0",
  	typescript: "^4.9.5"
  };
  var publishConfig = {
  	registry: "https://repo.tuzhanai.com/repository/tuzhan-npm-release/"
  };
  var dependencies = {
  	"core-js": "^3.29.1"
  };
  var pkg = {
  	name: name,
  	version: version,
  	description: description,
  	main: main,
  	scripts: scripts,
  	repository: repository,
  	keywords: keywords,
  	author: author,
  	license: license,
  	bugs: bugs,
  	homepage: homepage,
  	devDependencies: devDependencies,
  	publishConfig: publishConfig,
  	dependencies: dependencies
  };

  function guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
      });
  }
  /**
   * 数据处理
   *
   * @export
   * @class Builder
   */
  var Builder = /** @class */ (function () {
      function Builder(config) {
          var appId = config.appId;
          var traceId = guid();
          this.cache = new Map();
          this.baseData = {
              appId: appId,
              traceId: traceId,
              sdk: {
                  version: pkg.version,
              },
          };
      }
      Builder.prototype.build = function (data) {
          return _assign(_assign({ t: +new Date() }, this.baseData), data);
      };
      return Builder;
  }());

  var Logger = /** @class */ (function () {
      function Logger() {
      }
      Logger.prototype._log = function (level) {
      };
      Logger.prototype.log = function () {
          var rest = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              rest[_i] = arguments[_i];
          }
          logger.log.apply(logger, rest);
      };
      Logger.prototype.info = function () {
          var rest = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              rest[_i] = arguments[_i];
          }
          console.info.apply(console, rest);
      };
      return Logger;
  }());
  var logger = new Logger();

  var id = 0;
  /**
   * 任务中心
   *
   * @export
   * @class Schedule
   */
  var Schedule = /** @class */ (function () {
      function Schedule(config) {
          this.client = config.client;
          this.tasks = [];
          this.maxPool = config.maxPool;
      }
      /**
       * 任务消费
       *
       * @param {boolean} [clear] 是否清空
       * @return {*}
       * @memberof Schedule
       */
      Schedule.prototype.consumer = function (clear) {
          return __awaiter(this, void 0, void 0, function () {
              var runTasks, data;
              var _this = this;
              return __generator(this, function (_a) {
                  switch (_a.label) {
                      case 0:
                          if (!clear && this.tasks.length < this.maxPool)
                              return [2 /*return*/];
                          runTasks = this.tasks.slice(0, this.maxPool);
                          this.tasks = this.tasks.slice(this.maxPool);
                          data = runTasks.map(function (_a) {
                              var data = _a.data;
                              return data;
                          });
                          _a.label = 1;
                      case 1:
                          _a.trys.push([1, 3, , 4]);
                          return [4 /*yield*/, this.send(data)];
                      case 2:
                          _a.sent();
                          setTimeout(function () {
                              _this.consumer();
                          }, 1000);
                          return [3 /*break*/, 4];
                      case 3:
                          _a.sent();
                          return [3 /*break*/, 4];
                      case 4: return [2 /*return*/];
                  }
              });
          });
      };
      /**
       *储存一个延时任务
       *
       * @param {IData} data
       * @memberof Schedule
       */
      Schedule.prototype.push = function (data) {
          var task = { id: ++id, data: data };
          this.tasks.push(task);
          this.consumer();
      };
      /**
       * 向插件发送 send 事件
       *
       * @param {IData[]} data
       * @memberof Schedule
       */
      Schedule.prototype.send = function (data) {
          this.client.$hook.emit('send', function (send) {
              logger.log('send 任务发送: 数据', { data: data });
              return send(data).then(function (res) {
                  logger.log('send 成功!');
                  return res;
              });
          });
      };
      /**
       * 清空任务
       *
       * @memberof Schedule
       */
      Schedule.prototype.clear = function () {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  this.consumer(true);
                  return [2 /*return*/];
              });
          });
      };
      /**
       * 无需等待, 立即上报一个任务
       *
       * @param {IData} data
       * @return {*}
       * @memberof Schedule
       */
      Schedule.prototype.immediate = function (data) {
          return this.send([data]);
      };
      return Schedule;
  }());

  var Event = /** @class */ (function () {
      function Event() {
          this.event = new Map();
          this.maxListener = 100;
      }
      Event.prototype.on = function (type, fn) {
          var list = this.event.get(type) || [];
          if (typeof fn === 'function') {
              this.event.set(type, __spreadArray(__spreadArray([], list, true), [fn], false));
          }
      };
      Event.prototype.once = function (type, fn) {
          var _this = this;
          function newFn() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              fn.apply(void 0, args);
              _this.removeListener(type, newFn);
          }
          this.on(type, newFn);
      };
      Event.prototype.emit = function (type, params) {
          var listeners = this.event.get(type) || [];
          listeners.forEach(function (fn) { return fn(params); });
      };
      Event.prototype.setMaxListeners = function (count) {
          this.maxListener = count;
      };
      Event.prototype.listeners = function (type) {
          return this.event.get(type) || [];
      };
      Event.prototype.removeAllListener = function (type) {
          this.event.set(type, []);
      };
      Event.prototype.removeListener = function (type, listener) {
          var listeners = this.event.get(type) || [];
          listeners = listeners.filter(function (fn) { return listener !== fn; });
          this.event.set(type, listeners);
      };
      return Event;
  }());

  function assertConfig(config) {
      if (!config) {
          throw new Error('缺少 SDK 配置信息');
      }
      if (!config.dsn) {
          throw new Error('缺少 SDK dns 配置信息');
      }
      if (!config.appId) {
          throw new Error('缺少 appId 应用 ID');
      }
  }
  /**
   * Core 实例
   *
   * @export
   * @class Reporter
   */
  var Reporter = /** @class */ (function () {
      function Reporter(config) {
          assertConfig(config);
          this.config = config;
      }
      Reporter.prototype.init = function () {
          var _a;
          var _b = this.config, _c = _b.plugins, plugins = _c === void 0 ? [] : _c, appId = _b.appId, _d = _b.maxPool, maxPool = _d === void 0 ? 10 : _d;
          this.builder = new Builder({ appId: appId });
          this.schedule = new Schedule({ maxPool: maxPool, client: this });
          this.$hook = new Event();
          // 插件注册
          this.registerPlugins(plugins);
          // 事件注册
          this.addListeners();
          // 唤起 init 事件
          (_a = this.$hook) === null || _a === void 0 ? void 0 : _a.emit('init', {});
          logger.info('sdk init');
      };
      /**
       * 插件注册
       *
       * @private
       * @param {IPlugin[]} plugins
       * @return {*}
       * @memberof Reporter
       */
      Reporter.prototype.registerPlugins = function (plugins) {
          var _this = this;
          if (!Array.isArray(plugins))
              return;
          plugins.map(function (plugin) {
              return plugin.apply(_this);
          });
      };
      /**
       * 挂在事件
       *
       * @private
       * @memberof Reporter
       */
      Reporter.prototype.addListeners = function () {
          var _this = this;
          var _a;
          // 接收插件上报事件, 将任务插入调度器
          (_a = this.$hook) === null || _a === void 0 ? void 0 : _a.on('report', function (_a) {
              var _b, _c, _d;
              var data = _a.data, runTime = _a.runTime;
              logger.log('report 事件触发, 数据:', data);
              var pkgData = (_b = _this.builder) === null || _b === void 0 ? void 0 : _b.build(data);
              if (!pkgData)
                  return;
              if (!runTime || runTime === 'delay') {
                  (_c = _this.schedule) === null || _c === void 0 ? void 0 : _c.push(pkgData);
              }
              else if (runTime === 'immediately') {
                  (_d = _this.schedule) === null || _d === void 0 ? void 0 : _d.immediate(pkgData);
              }
          });
      };
      Reporter.prototype.getReportParams = function () {
          return {
              url: this.config.dsn + '/v1/report',
              method: 'POST',
              headers: {},
          };
      };
      Reporter.prototype.getTasks = function () {
          return this.schedule.tasks;
      };
      Reporter.prototype.getConfig = function () {
          return this.config;
      };
      return Reporter;
  }());

  /**
   * 上报类型
   *
   * @export
   * @enum {number}
   */
  var ReportType;
  (function (ReportType) {
      ReportType["PERFORMANCE"] = "1";
      ReportType["RESOURCE"] = "2";
      ReportType["ERROR"] = "3";
  })(ReportType || (ReportType = {}));
  var ErrorType;
  (function (ErrorType) {
      ErrorType[ErrorType["PROMISE"] = 0] = "PROMISE";
      ErrorType[ErrorType["JS"] = 1] = "JS";
      ErrorType[ErrorType["RESOURCE"] = 2] = "RESOURCE";
  })(ErrorType || (ErrorType = {}));
  var RequestType;
  (function (RequestType) {
      RequestType[RequestType["fetch"] = 0] = "fetch";
      RequestType[RequestType["XHR"] = 1] = "XHR";
  })(RequestType || (RequestType = {}));

  var indicators = [
      'navigationStart',
      'unloadEventStart',
      'unloadEventEnd',
      'navigationStart',
      'redirectStart',
      'redirectEnd',
      'fetchStart',
      'domainLookupStart',
      'domainLookupEnd',
      'connectStart',
      'secureConnectionStart',
      'connectEnd',
      'requestStart',
      'responseStart',
      'responseEnd',
      'domLoading',
      'domInteractive',
      'domContentLoadedEventEnd',
      'domContentLoadedEventStart',
      'domComplete',
      'loadEventStart',
      'loadEventEnd',
  ];
  function formatTiming(timing) {
      var t = {
          redirectCount: timing.redirectCount,
      };
      indicators.forEach(function (key) {
          t[key] = Number((timing[key] || 0).toFixed(2));
      });
      return t;
  }
  /**
   * 浏览器端插件
   *
   * @export
   * @class Browser
   */
  var Browser = /** @class */ (function () {
      function Browser(options) {
          this.name = 'Browser';
          this.options = options || {};
      }
      Browser.prototype.apply = function (client) {
          var _this_1 = this;
          this.client = client;
          if (!window)
              return;
          client.$hook.on('init', function () {
              _this_1.timing();
              _this_1.listenError();
              _this_1.promiseError();
              _this_1.overrideFetch();
              _this_1.overrideXHR();
          });
          client.$hook.on('send', function (report) {
              requestIdleCallback(function () { return report(_this_1.send.bind(_this_1)); });
          });
          // 特殊处理, 刷新或者离开页面前保证缓存的数据能够上报
          window.addEventListener('unload', function () {
              var tasks = client.getTasks();
              var data = tasks.map(function (_a) {
                  var data = _a.data;
                  return data;
              });
              _this_1.send(data);
          });
      };
      Browser.prototype.send = function (data) {
          var _a = this.client.getReportParams(), url = _a.url, method = _a.method;
          var formData = new FormData();
          formData.append('data', JSON.stringify(data));
          if (typeof navigator.sendBeacon === 'function') {
              return Promise.resolve(navigator.sendBeacon(url, formData));
          }
          else if (typeof fetch === 'function') {
              return fetch(url, { method: method, keepalive: true }).then(function () {
                  return true;
              });
          }
          else {
              return new Promise(function (r, j) {
                  var XHR = new XMLHttpRequest();
                  XHR.addEventListener('load', function () {
                      r(true);
                  });
                  XHR.addEventListener('error', function () {
                      j();
                  });
                  XHR.open(method, url);
                  XHR.send(formData);
              });
          }
      };
      Browser.prototype.report = function (body) {
          var _a;
          var data = body.data;
          var eid = data.eid, l = data.l;
          var ua = navigator.userAgent;
          (_a = this.client) === null || _a === void 0 ? void 0 : _a.$hook.emit('report', _assign(_assign({}, body), { data: {
                  eid: eid,
                  l: _assign(_assign({}, l), { ua: ua }),
              } }));
      };
      Browser.prototype.overrideXHR = function () {
          var Reporter = this.client;
          if (!XMLHttpRequest)
              return;
          var _open = XMLHttpRequest.prototype.open;
          var _send = XMLHttpRequest.prototype.send;
          XMLHttpRequest.prototype.open = function () {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              var method = args[0], url = args[1];
              var startTime = Date.now();
              this.reporterCollect = _assign(_assign({}, this.reporterCollect), { method: method, url: url, startTime: startTime, type: RequestType.XHR });
              _open.apply(this, args);
          };
          XMLHttpRequest.prototype.send = function () {
              var _this_1 = this;
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              this.addEventListener('loadend', function () {
                  var endTime = Date.now();
                  var _a = _this_1, status = _a.status, statusText = _a.statusText;
                  if (status > 200) {
                      _this_1.reporterCollect = _assign(_assign({}, _this_1.reporterCollect), { endTime: endTime, status: status, statusText: statusText });
                      Reporter === null || Reporter === void 0 ? void 0 : Reporter.$hook.emit('report', {
                          data: {
                              eid: '1001',
                              l: _this_1.reporterCollect,
                          },
                      });
                  }
              });
              _send.apply(this, args);
          };
      };
      Browser.prototype.overrideFetch = function () {
          if (typeof window.fetch !== 'function') {
              return;
          }
          var _this = this;
          var originFetch = window.fetch;
          window.fetch = function () {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              var startTime = Date.now();
              var url = args[0];
              var config = args[1];
              var _a = (config || {}).method, method = _a === void 0 ? 'GET' : _a;
              var reportData = {
                  url: url,
                  startTime: startTime,
                  method: method,
                  type: RequestType.fetch,
              };
              return originFetch
                  .apply(window, args)
                  .then(function (result) {
                  var status = result.status, statusText = result.statusText;
                  if (status && status > 300) {
                      var endTime = Date.now();
                      Object.assign(reportData, { status: status, statusText: statusText, endTime: endTime });
                      _this.report({ data: { eid: '1001', l: reportData } });
                  }
                  return result;
              })
                  .catch(function (error) {
                  var endTime = Date.now();
                  var name = error.name, message = error.message, stack = error.stack;
                  Object.assign(reportData, { name: name, message: message, stack: stack });
                  reportData.endTime = endTime;
                  _this.report({
                      data: {
                          eid: '1001',
                          l: reportData,
                      },
                  });
                  return error;
              });
          };
      };
      /**
       * Js 异常捕捉
       *
       * @param {Reporter} client
       * @memberof Browser
       */
      Browser.prototype.listenError = function () {
          var _this_1 = this;
          window.addEventListener('error', function (e) {
              var type = e.type, error = e.error, colno = e.colno, filename = e.filename, lineno = e.lineno, message = e.message;
              if (type === 'error' && filename && colno && lineno) {
                  if (!message) {
                      message = (error === null || error === void 0 ? void 0 : error.message) || '';
                  }
                  _this_1.report({
                      data: {
                          eid: '1003',
                          l: {
                              colno: colno,
                              message: message,
                              filename: filename,
                              lineno: lineno,
                              stack: error === null || error === void 0 ? void 0 : error.stack,
                              type: ErrorType.JS,
                          },
                      },
                  });
              }
          }, true);
      };
      /**
       * Promise 错误捕捉
       *
       * @param {Reporter} client
       * @memberof Browser
       */
      Browser.prototype.promiseError = function () {
          var _this_1 = this;
          window.addEventListener('unhandledrejection', function (e) {
              var reason = e.reason;
              var reportData = {
                  message: '',
                  stack: '',
                  name: '',
              };
              if (typeof reason === 'string') {
                  reportData.message = reason;
              }
              else if (reason instanceof Error) {
                  var name_1 = reason.name, stack = reason.stack, message = reason.message;
                  reportData.message = message;
                  reportData.stack = stack || '';
                  reportData.name = name_1;
              }
              _this_1.report({
                  data: {
                      eid: '1003',
                      l: _assign({ type: ErrorType.PROMISE }, reportData),
                  },
              });
          });
      };
      /**
       * 性能数据采集
       *
       * @param {Reporter} client
       * @memberof Browser
       */
      Browser.prototype.timing = function () {
          var _this_1 = this;
          // v2
          if (PerformanceObserver) {
              var fcpP = new Promise(function (r) {
                  var observer = new PerformanceObserver(function (list) {
                      list.getEntries().forEach(function (entry) {
                          if (entry.name === 'first-contentful-paint') {
                              r(entry.startTime);
                          }
                      });
                  });
                  observer.observe({ type: 'paint', buffered: true });
              });
              var lcpP = new Promise(function (r) {
                  var observer = new PerformanceObserver(function (list) {
                      var entries = list.getEntries();
                      var lastEntry = entries[entries.length - 1];
                      r(lastEntry.startTime);
                  });
                  observer.observe({ type: 'largest-contentful-paint', buffered: true });
              });
              var navigationP = new Promise(function (r) {
                  var perfObserver = function (entries) {
                      entries.getEntries().forEach(function (entry) {
                          var entryType = entry.entryType;
                          if (entryType === 'navigation') {
                              var t = entry.toJSON();
                              r(t);
                          }
                      });
                  };
                  var observer = new PerformanceObserver(perfObserver);
                  observer.observe({ entryTypes: ['navigation'] });
              });
              Promise.all([navigationP, lcpP, fcpP]).then(function (_a) {
                  var navigation = _a[0], lcp = _a[1], fcp = _a[2];
                  var timing = formatTiming(navigation);
                  _this_1.report({
                      runTime: 'immediately',
                      data: {
                          eid: '1000',
                          l: _assign(_assign({}, timing), { lcp: Number(lcp.toFixed(2)), fcp: Number(fcp.toFixed(2)) }),
                      },
                  });
              });
          }
          else {
              window.addEventListener('load', function () {
                  var _a = performance.timing, navigationStart = _a.navigationStart, unloadEventStart = _a.unloadEventStart;
                  var redirectCount = performance.navigation.redirectCount;
                  var startAt = Math.min(navigationStart, unloadEventStart) || 0;
                  var originTiming = _assign(_assign({}, performance.timing), performance.navigation);
                  var timing = {
                      redirectCount: redirectCount,
                  };
                  indicators.forEach(function (key, index) {
                      if (originTiming[key] > 0) {
                          originTiming[key] -= startAt;
                      }
                      else {
                          originTiming[key] = index === 0 ? 0 : originTiming[indicators[index - 1]];
                      }
                      timing[key] = originTiming[key];
                  });
                  _this_1.report({
                      runTime: 'immediately',
                      data: { eid: '1000', l: timing },
                  });
              });
          }
      };
      return Browser;
  }());

  exports.Browser = Browser;
  exports.default = Reporter;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
