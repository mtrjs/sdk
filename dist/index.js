(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.monitor = {}));
})(this, (function (exports) { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return exports;
    };
    var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg,
            value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
        method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
              return next.value = undefined, next.done = !0, next;
            };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

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

  var name = "@tubefast/core";
  var version = "1.0.1-alpha.7";
  var description = "";
  var main = "dist/index.min.js";
  var scripts = {
  	build: "rollup -c",
  	"build:watch": "rollup -c --watch"
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
  	"@babel/preset-env": "^7.20.2",
  	"@babel/preset-typescript": "^7.21.0",
  	"@rollup/plugin-babel": "^6.0.3",
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
  	publishConfig: publishConfig
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
              console.log('send 任务发送: 数据', { data: data });
              return send(data).then(function (res) {
                  console.log('send 成功!');
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

  var anyMap = new WeakMap();
  var eventsMap = new WeakMap();
  var producersMap = new WeakMap();

  var anyProducer = Symbol('anyProducer');
  var resolvedPromise = Promise.resolve();

  // Define symbols for "meta" events.
  var listenerAdded = Symbol('listenerAdded');
  var listenerRemoved = Symbol('listenerRemoved');
  var canEmitMetaEvents = false;
  var isGlobalDebugEnabled = false;
  function assertEventName(eventName) {
    if (typeof eventName !== 'string' && _typeof(eventName) !== 'symbol' && typeof eventName !== 'number') {
      throw new TypeError('`eventName` must be a string, symbol, or number');
    }
  }
  function assertListener(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }
  }
  function getListeners(instance, eventName) {
    var events = eventsMap.get(instance);
    if (!events.has(eventName)) {
      return;
    }
    return events.get(eventName);
  }
  function getEventProducers(instance, eventName) {
    var key = typeof eventName === 'string' || _typeof(eventName) === 'symbol' || typeof eventName === 'number' ? eventName : anyProducer;
    var producers = producersMap.get(instance);
    if (!producers.has(key)) {
      return;
    }
    return producers.get(key);
  }
  function enqueueProducers(instance, eventName, eventData) {
    var producers = producersMap.get(instance);
    if (producers.has(eventName)) {
      var _iterator = _createForOfIteratorHelper(producers.get(eventName)),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var producer = _step.value;
          producer.enqueue(eventData);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    if (producers.has(anyProducer)) {
      var item = Promise.all([eventName, eventData]);
      var _iterator2 = _createForOfIteratorHelper(producers.get(anyProducer)),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _producer = _step2.value;
          _producer.enqueue(item);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }
  function iterator(instance, eventNames) {
    eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
    var isFinished = false;
    var flush = function flush() {};
    var queue = [];
    var producer = {
      enqueue: function enqueue(item) {
        queue.push(item);
        flush();
      },
      finish: function finish() {
        isFinished = true;
        flush();
      }
    };
    var _iterator3 = _createForOfIteratorHelper(eventNames),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var eventName = _step3.value;
        var set = getEventProducers(instance, eventName);
        if (!set) {
          set = new Set();
          var producers = producersMap.get(instance);
          producers.set(eventName, set);
        }
        set.add(producer);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return _defineProperty({
      next: function next() {
        var _this = this;
        return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                if (queue) {
                  _context.next = 2;
                  break;
                }
                return _context.abrupt("return", {
                  done: true
                });
              case 2:
                if (!(queue.length === 0)) {
                  _context.next = 9;
                  break;
                }
                if (!isFinished) {
                  _context.next = 6;
                  break;
                }
                queue = undefined;
                return _context.abrupt("return", _this.next());
              case 6:
                _context.next = 8;
                return new Promise(function (resolve) {
                  flush = resolve;
                });
              case 8:
                return _context.abrupt("return", _this.next());
              case 9:
                _context.next = 11;
                return queue.shift();
              case 11:
                _context.t0 = _context.sent;
                return _context.abrupt("return", {
                  done: false,
                  value: _context.t0
                });
              case 13:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }))();
      },
      "return": function _return(value) {
        var _arguments = arguments;
        return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          var _iterator4, _step4, eventName, set, producers;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                queue = undefined;
                _iterator4 = _createForOfIteratorHelper(eventNames);
                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    eventName = _step4.value;
                    set = getEventProducers(instance, eventName);
                    if (set) {
                      set["delete"](producer);
                      if (set.size === 0) {
                        producers = producersMap.get(instance);
                        producers["delete"](eventName);
                      }
                    }
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }
                flush();
                if (!(_arguments.length > 0)) {
                  _context2.next = 11;
                  break;
                }
                _context2.next = 7;
                return value;
              case 7:
                _context2.t1 = _context2.sent;
                _context2.t0 = {
                  done: true,
                  value: _context2.t1
                };
                _context2.next = 12;
                break;
              case 11:
                _context2.t0 = {
                  done: true
                };
              case 12:
                return _context2.abrupt("return", _context2.t0);
              case 13:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }))();
      }
    }, Symbol.asyncIterator, function () {
      return this;
    });
  }
  function defaultMethodNamesOrAssert(methodNames) {
    if (methodNames === undefined) {
      return allEmitteryMethods;
    }
    if (!Array.isArray(methodNames)) {
      throw new TypeError('`methodNames` must be an array of strings');
    }
    var _iterator5 = _createForOfIteratorHelper(methodNames),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var methodName = _step5.value;
        if (!allEmitteryMethods.includes(methodName)) {
          if (typeof methodName !== 'string') {
            throw new TypeError('`methodNames` element must be a string');
          }
          throw new Error("".concat(methodName, " is not Emittery method"));
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    return methodNames;
  }
  var isMetaEvent = function isMetaEvent(eventName) {
    return eventName === listenerAdded || eventName === listenerRemoved;
  };
  function emitMetaEvent(emitter, eventName, eventData) {
    if (isMetaEvent(eventName)) {
      try {
        canEmitMetaEvents = true;
        emitter.emit(eventName, eventData);
      } finally {
        canEmitMetaEvents = false;
      }
    }
  }
  var Emittery = /*#__PURE__*/function () {
    function Emittery() {
      var _options$debug;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, Emittery);
      anyMap.set(this, new Set());
      eventsMap.set(this, new Map());
      producersMap.set(this, new Map());
      producersMap.get(this).set(anyProducer, new Set());
      this.debug = (_options$debug = options.debug) !== null && _options$debug !== void 0 ? _options$debug : {};
      if (this.debug.enabled === undefined) {
        this.debug.enabled = false;
      }
      if (!this.debug.logger) {
        this.debug.logger = function (type, debugName, eventName, eventData) {
          try {
            // TODO: Use https://github.com/sindresorhus/safe-stringify when the package is more mature. Just copy-paste the code.
            eventData = JSON.stringify(eventData);
          } catch (_unused) {
            eventData = "Object with the following keys failed to stringify: ".concat(Object.keys(eventData).join(','));
          }
          if (_typeof(eventName) === 'symbol' || typeof eventName === 'number') {
            eventName = eventName.toString();
          }
          var currentTime = new Date();
          var logTime = "".concat(currentTime.getHours(), ":").concat(currentTime.getMinutes(), ":").concat(currentTime.getSeconds(), ".").concat(currentTime.getMilliseconds());
          console.log("[".concat(logTime, "][emittery:").concat(type, "][").concat(debugName, "] Event Name: ").concat(eventName, "\n\tdata: ").concat(eventData));
        };
      }
    }
    _createClass(Emittery, [{
      key: "logIfDebugEnabled",
      value: function logIfDebugEnabled(type, eventName, eventData) {
        if (Emittery.isDebugEnabled || this.debug.enabled) {
          this.debug.logger(type, this.debug.name, eventName, eventData);
        }
      }
    }, {
      key: "on",
      value: function on(eventNames, listener) {
        assertListener(listener);
        eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
        var _iterator6 = _createForOfIteratorHelper(eventNames),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var eventName = _step6.value;
            assertEventName(eventName);
            var set = getListeners(this, eventName);
            if (!set) {
              set = new Set();
              var events = eventsMap.get(this);
              events.set(eventName, set);
            }
            set.add(listener);
            this.logIfDebugEnabled('subscribe', eventName, undefined);
            if (!isMetaEvent(eventName)) {
              emitMetaEvent(this, listenerAdded, {
                eventName: eventName,
                listener: listener
              });
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
        return this.off.bind(this, eventNames, listener);
      }
    }, {
      key: "off",
      value: function off(eventNames, listener) {
        assertListener(listener);
        eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
        var _iterator7 = _createForOfIteratorHelper(eventNames),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var eventName = _step7.value;
            assertEventName(eventName);
            var set = getListeners(this, eventName);
            if (set) {
              set["delete"](listener);
              if (set.size === 0) {
                var events = eventsMap.get(this);
                events["delete"](eventName);
              }
            }
            this.logIfDebugEnabled('unsubscribe', eventName, undefined);
            if (!isMetaEvent(eventName)) {
              emitMetaEvent(this, listenerRemoved, {
                eventName: eventName,
                listener: listener
              });
            }
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
    }, {
      key: "once",
      value: function once(eventNames) {
        var _this2 = this;
        var off_;
        var promise = new Promise(function (resolve) {
          off_ = _this2.on(eventNames, function (data) {
            off_();
            resolve(data);
          });
        });
        promise.off = off_;
        return promise;
      }
    }, {
      key: "events",
      value: function events(eventNames) {
        eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
        var _iterator8 = _createForOfIteratorHelper(eventNames),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var eventName = _step8.value;
            assertEventName(eventName);
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
        return iterator(this, eventNames);
      }
    }, {
      key: "emit",
      value: function () {
        var _emit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(eventName, eventData) {
          var _getListeners;
          var listeners, anyListeners, staticListeners, staticAnyListeners;
          return _regeneratorRuntime().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                assertEventName(eventName);
                if (!(isMetaEvent(eventName) && !canEmitMetaEvents)) {
                  _context5.next = 3;
                  break;
                }
                throw new TypeError('`eventName` cannot be meta event `listenerAdded` or `listenerRemoved`');
              case 3:
                this.logIfDebugEnabled('emit', eventName, eventData);
                enqueueProducers(this, eventName, eventData);
                listeners = (_getListeners = getListeners(this, eventName)) !== null && _getListeners !== void 0 ? _getListeners : new Set();
                anyListeners = anyMap.get(this);
                staticListeners = _toConsumableArray(listeners);
                staticAnyListeners = isMetaEvent(eventName) ? [] : _toConsumableArray(anyListeners);
                _context5.next = 11;
                return resolvedPromise;
              case 11:
                _context5.next = 13;
                return Promise.all([].concat(_toConsumableArray(staticListeners.map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(listener) {
                    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                      while (1) switch (_context3.prev = _context3.next) {
                        case 0:
                          if (!listeners.has(listener)) {
                            _context3.next = 2;
                            break;
                          }
                          return _context3.abrupt("return", listener(eventData));
                        case 2:
                        case "end":
                          return _context3.stop();
                      }
                    }, _callee3);
                  }));
                  return function (_x3) {
                    return _ref2.apply(this, arguments);
                  };
                }())), _toConsumableArray(staticAnyListeners.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(listener) {
                    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                      while (1) switch (_context4.prev = _context4.next) {
                        case 0:
                          if (!anyListeners.has(listener)) {
                            _context4.next = 2;
                            break;
                          }
                          return _context4.abrupt("return", listener(eventName, eventData));
                        case 2:
                        case "end":
                          return _context4.stop();
                      }
                    }, _callee4);
                  }));
                  return function (_x4) {
                    return _ref3.apply(this, arguments);
                  };
                }()))));
              case 13:
              case "end":
                return _context5.stop();
            }
          }, _callee5, this);
        }));
        function emit(_x, _x2) {
          return _emit.apply(this, arguments);
        }
        return emit;
      }()
    }, {
      key: "emitSerial",
      value: function () {
        var _emitSerial = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(eventName, eventData) {
          var _getListeners2;
          var listeners, anyListeners, staticListeners, staticAnyListeners, _iterator9, _step9, listener, _iterator10, _step10, _listener;
          return _regeneratorRuntime().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                assertEventName(eventName);
                if (!(isMetaEvent(eventName) && !canEmitMetaEvents)) {
                  _context6.next = 3;
                  break;
                }
                throw new TypeError('`eventName` cannot be meta event `listenerAdded` or `listenerRemoved`');
              case 3:
                this.logIfDebugEnabled('emitSerial', eventName, eventData);
                listeners = (_getListeners2 = getListeners(this, eventName)) !== null && _getListeners2 !== void 0 ? _getListeners2 : new Set();
                anyListeners = anyMap.get(this);
                staticListeners = _toConsumableArray(listeners);
                staticAnyListeners = _toConsumableArray(anyListeners);
                _context6.next = 10;
                return resolvedPromise;
              case 10:
                /* eslint-disable no-await-in-loop */
                _iterator9 = _createForOfIteratorHelper(staticListeners);
                _context6.prev = 11;
                _iterator9.s();
              case 13:
                if ((_step9 = _iterator9.n()).done) {
                  _context6.next = 20;
                  break;
                }
                listener = _step9.value;
                if (!listeners.has(listener)) {
                  _context6.next = 18;
                  break;
                }
                _context6.next = 18;
                return listener(eventData);
              case 18:
                _context6.next = 13;
                break;
              case 20:
                _context6.next = 25;
                break;
              case 22:
                _context6.prev = 22;
                _context6.t0 = _context6["catch"](11);
                _iterator9.e(_context6.t0);
              case 25:
                _context6.prev = 25;
                _iterator9.f();
                return _context6.finish(25);
              case 28:
                _iterator10 = _createForOfIteratorHelper(staticAnyListeners);
                _context6.prev = 29;
                _iterator10.s();
              case 31:
                if ((_step10 = _iterator10.n()).done) {
                  _context6.next = 38;
                  break;
                }
                _listener = _step10.value;
                if (!anyListeners.has(_listener)) {
                  _context6.next = 36;
                  break;
                }
                _context6.next = 36;
                return _listener(eventName, eventData);
              case 36:
                _context6.next = 31;
                break;
              case 38:
                _context6.next = 43;
                break;
              case 40:
                _context6.prev = 40;
                _context6.t1 = _context6["catch"](29);
                _iterator10.e(_context6.t1);
              case 43:
                _context6.prev = 43;
                _iterator10.f();
                return _context6.finish(43);
              case 46:
              case "end":
                return _context6.stop();
            }
          }, _callee6, this, [[11, 22, 25, 28], [29, 40, 43, 46]]);
        }));
        function emitSerial(_x5, _x6) {
          return _emitSerial.apply(this, arguments);
        }
        return emitSerial;
      }()
    }, {
      key: "onAny",
      value: function onAny(listener) {
        assertListener(listener);
        this.logIfDebugEnabled('subscribeAny', undefined, undefined);
        anyMap.get(this).add(listener);
        emitMetaEvent(this, listenerAdded, {
          listener: listener
        });
        return this.offAny.bind(this, listener);
      }
    }, {
      key: "anyEvent",
      value: function anyEvent() {
        return iterator(this);
      }
    }, {
      key: "offAny",
      value: function offAny(listener) {
        assertListener(listener);
        this.logIfDebugEnabled('unsubscribeAny', undefined, undefined);
        emitMetaEvent(this, listenerRemoved, {
          listener: listener
        });
        anyMap.get(this)["delete"](listener);
      }
    }, {
      key: "clearListeners",
      value: function clearListeners(eventNames) {
        eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
        var _iterator11 = _createForOfIteratorHelper(eventNames),
          _step11;
        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var eventName = _step11.value;
            this.logIfDebugEnabled('clear', eventName, undefined);
            if (typeof eventName === 'string' || _typeof(eventName) === 'symbol' || typeof eventName === 'number') {
              var set = getListeners(this, eventName);
              if (set) {
                set.clear();
              }
              var producers = getEventProducers(this, eventName);
              if (producers) {
                var _iterator12 = _createForOfIteratorHelper(producers),
                  _step12;
                try {
                  for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                    var producer = _step12.value;
                    producer.finish();
                  }
                } catch (err) {
                  _iterator12.e(err);
                } finally {
                  _iterator12.f();
                }
                producers.clear();
              }
            } else {
              anyMap.get(this).clear();
              var _iterator13 = _createForOfIteratorHelper(eventsMap.get(this).entries()),
                _step13;
              try {
                for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                  var _step13$value = _slicedToArray(_step13.value, 2),
                    _eventName = _step13$value[0],
                    listeners = _step13$value[1];
                  listeners.clear();
                  eventsMap.get(this)["delete"](_eventName);
                }
              } catch (err) {
                _iterator13.e(err);
              } finally {
                _iterator13.f();
              }
              var _iterator14 = _createForOfIteratorHelper(producersMap.get(this).entries()),
                _step14;
              try {
                for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                  var _step14$value = _slicedToArray(_step14.value, 2),
                    _eventName2 = _step14$value[0],
                    _producers = _step14$value[1];
                  var _iterator15 = _createForOfIteratorHelper(_producers),
                    _step15;
                  try {
                    for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
                      var _producer2 = _step15.value;
                      _producer2.finish();
                    }
                  } catch (err) {
                    _iterator15.e(err);
                  } finally {
                    _iterator15.f();
                  }
                  _producers.clear();
                  producersMap.get(this)["delete"](_eventName2);
                }
              } catch (err) {
                _iterator14.e(err);
              } finally {
                _iterator14.f();
              }
            }
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
      }
    }, {
      key: "listenerCount",
      value: function listenerCount(eventNames) {
        eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
        var count = 0;
        var _iterator16 = _createForOfIteratorHelper(eventNames),
          _step16;
        try {
          for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
            var eventName = _step16.value;
            if (typeof eventName === 'string') {
              var _getListeners$size, _getListeners3, _getEventProducers$si, _getEventProducers, _getEventProducers$si2, _getEventProducers2;
              count += anyMap.get(this).size + ((_getListeners$size = (_getListeners3 = getListeners(this, eventName)) === null || _getListeners3 === void 0 ? void 0 : _getListeners3.size) !== null && _getListeners$size !== void 0 ? _getListeners$size : 0) + ((_getEventProducers$si = (_getEventProducers = getEventProducers(this, eventName)) === null || _getEventProducers === void 0 ? void 0 : _getEventProducers.size) !== null && _getEventProducers$si !== void 0 ? _getEventProducers$si : 0) + ((_getEventProducers$si2 = (_getEventProducers2 = getEventProducers(this)) === null || _getEventProducers2 === void 0 ? void 0 : _getEventProducers2.size) !== null && _getEventProducers$si2 !== void 0 ? _getEventProducers$si2 : 0);
              continue;
            }
            if (typeof eventName !== 'undefined') {
              assertEventName(eventName);
            }
            count += anyMap.get(this).size;
            var _iterator17 = _createForOfIteratorHelper(eventsMap.get(this).values()),
              _step17;
            try {
              for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                var value = _step17.value;
                count += value.size;
              }
            } catch (err) {
              _iterator17.e(err);
            } finally {
              _iterator17.f();
            }
            var _iterator18 = _createForOfIteratorHelper(producersMap.get(this).values()),
              _step18;
            try {
              for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
                var _value = _step18.value;
                count += _value.size;
              }
            } catch (err) {
              _iterator18.e(err);
            } finally {
              _iterator18.f();
            }
          }
        } catch (err) {
          _iterator16.e(err);
        } finally {
          _iterator16.f();
        }
        return count;
      }
    }, {
      key: "bindMethods",
      value: function bindMethods(target, methodNames) {
        if (_typeof(target) !== 'object' || target === null) {
          throw new TypeError('`target` must be an object');
        }
        methodNames = defaultMethodNamesOrAssert(methodNames);
        var _iterator19 = _createForOfIteratorHelper(methodNames),
          _step19;
        try {
          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            var methodName = _step19.value;
            if (target[methodName] !== undefined) {
              throw new Error("The property `".concat(methodName, "` already exists on `target`"));
            }
            Object.defineProperty(target, methodName, {
              enumerable: false,
              value: this[methodName].bind(this)
            });
          }
        } catch (err) {
          _iterator19.e(err);
        } finally {
          _iterator19.f();
        }
      }
    }], [{
      key: "mixin",
      value: function mixin(emitteryPropertyName, methodNames) {
        methodNames = defaultMethodNamesOrAssert(methodNames);
        return function (target) {
          if (typeof target !== 'function') {
            throw new TypeError('`target` must be function');
          }
          var _iterator20 = _createForOfIteratorHelper(methodNames),
            _step20;
          try {
            for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
              var methodName = _step20.value;
              if (target.prototype[methodName] !== undefined) {
                throw new Error("The property `".concat(methodName, "` already exists on `target`"));
              }
            }
          } catch (err) {
            _iterator20.e(err);
          } finally {
            _iterator20.f();
          }
          function getEmitteryProperty() {
            Object.defineProperty(this, emitteryPropertyName, {
              enumerable: false,
              value: new Emittery()
            });
            return this[emitteryPropertyName];
          }
          Object.defineProperty(target.prototype, emitteryPropertyName, {
            enumerable: false,
            get: getEmitteryProperty
          });
          var emitteryMethodCaller = function emitteryMethodCaller(methodName) {
            return function () {
              var _this$emitteryPropert;
              return (_this$emitteryPropert = this[emitteryPropertyName])[methodName].apply(_this$emitteryPropert, arguments);
            };
          };
          var _iterator21 = _createForOfIteratorHelper(methodNames),
            _step21;
          try {
            for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
              var _methodName = _step21.value;
              Object.defineProperty(target.prototype, _methodName, {
                enumerable: false,
                value: emitteryMethodCaller(_methodName)
              });
            }
          } catch (err) {
            _iterator21.e(err);
          } finally {
            _iterator21.f();
          }
          return target;
        };
      }
    }, {
      key: "isDebugEnabled",
      get: function get() {
        var _globalThis$process, _globalThis$process2;
        // In a browser environment, `globalThis.process` can potentially reference a DOM Element with a `#process` ID,
        // so instead of just type checking `globalThis.process`, we need to make sure that `globalThis.process.env` exists.
        // eslint-disable-next-line n/prefer-global/process
        if (_typeof((_globalThis$process = globalThis.process) === null || _globalThis$process === void 0 ? void 0 : _globalThis$process.env) !== 'object') {
          return isGlobalDebugEnabled;
        }

        // eslint-disable-next-line n/prefer-global/process
        var _ref4 = (_globalThis$process2 = globalThis.process) !== null && _globalThis$process2 !== void 0 ? _globalThis$process2 : {
            env: {}
          },
          env = _ref4.env;
        return env.DEBUG === 'emittery' || env.DEBUG === '*' || isGlobalDebugEnabled;
      },
      set: function set(newValue) {
        isGlobalDebugEnabled = newValue;
      }
    }]);
    return Emittery;
  }();
  var allEmitteryMethods = Object.getOwnPropertyNames(Emittery.prototype).filter(function (v) {
    return v !== 'constructor';
  });
  Object.defineProperty(Emittery, 'listenerAdded', {
    value: listenerAdded,
    writable: false,
    enumerable: true,
    configurable: false
  });
  Object.defineProperty(Emittery, 'listenerRemoved', {
    value: listenerRemoved,
    writable: false,
    enumerable: true,
    configurable: false
  });

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
      function Reporter() {
      }
      Reporter.prototype.init = function (config) {
          var _a;
          assertConfig(config);
          this.config = config;
          var _b = config.plugins, plugins = _b === void 0 ? [] : _b, appId = config.appId, _c = config.maxPool, maxPool = _c === void 0 ? 10 : _c;
          this.builder = new Builder({ appId: appId });
          this.schedule = new Schedule({ maxPool: maxPool, client: this });
          // @ts-ignore
          this.$hook = new Emittery();
          // 插件注册
          this.registerPlugins(plugins);
          // 事件注册
          this.addListeners();
          // 唤起 init 事件
          (_a = this.$hook) === null || _a === void 0 ? void 0 : _a.emit('init', {});
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
              console.log('report 事件触发, 数据:', data);
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
              console.log('init 事件触发');
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
          var timing = {};
          // v2
          if (!!PerformanceObserver) {
              var fcpP = new Promise(function (r, j) {
                  var observer = new PerformanceObserver(function (list) {
                      list.getEntries().forEach(function (entry) {
                          if (entry.name === 'first-contentful-paint') {
                              r(entry.startTime);
                          }
                      });
                  });
                  observer.observe({ type: 'paint', buffered: true });
              });
              var lcpP = new Promise(function (r, j) {
                  var observer = new PerformanceObserver(function (list) {
                      var entries = list.getEntries();
                      var lastEntry = entries[entries.length - 1];
                      r(lastEntry.startTime);
                  });
                  observer.observe({ type: 'largest-contentful-paint', buffered: true });
              });
              var navigationP = new Promise(function (r, j) {
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
                  var timing = _this_1.formatTiming(navigation);
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
                  var _a = performance.timing, unloadEventStart = _a.unloadEventStart, unloadEventEnd = _a.unloadEventEnd, navigationStart = _a.navigationStart, redirectStart = _a.redirectStart, redirectEnd = _a.redirectEnd, fetchStart = _a.fetchStart, domainLookupStart = _a.domainLookupStart, domainLookupEnd = _a.domainLookupEnd, connectStart = _a.connectStart, secureConnectionStart = _a.secureConnectionStart, connectEnd = _a.connectEnd, requestStart = _a.requestStart, responseStart = _a.responseStart, responseEnd = _a.responseEnd, domLoading = _a.domLoading, domInteractive = _a.domInteractive, domContentLoadedEventEnd = _a.domContentLoadedEventEnd, domContentLoadedEventStart = _a.domContentLoadedEventStart, domComplete = _a.domComplete, loadEventStart = _a.loadEventStart, loadEventEnd = _a.loadEventEnd;
                  var redirectCount = performance.navigation.redirectCount;
                  var startAt = navigationStart || 0;
                  unloadEventStart = unloadEventStart >= startAt ? unloadEventStart - startAt : 0;
                  unloadEventEnd = unloadEventEnd >= startAt ? unloadEventEnd - startAt : unloadEventStart;
                  redirectStart = redirectStart >= startAt ? redirectStart - startAt : unloadEventEnd;
                  redirectEnd = redirectEnd >= startAt ? redirectEnd - startAt : redirectStart;
                  fetchStart = fetchStart >= startAt ? fetchStart - startAt : redirectEnd;
                  domainLookupStart = domainLookupStart >= startAt ? domainLookupStart - startAt : fetchStart;
                  domainLookupEnd = domainLookupStart >= startAt ? domainLookupStart - startAt : domainLookupStart;
                  connectStart = connectStart >= startAt ? connectStart - startAt : domainLookupEnd;
                  secureConnectionStart = secureConnectionStart >= startAt ? secureConnectionStart - startAt : connectStart;
                  connectEnd = connectEnd >= startAt ? connectEnd - startAt : secureConnectionStart;
                  requestStart = requestStart ? requestStart - startAt : connectEnd;
                  responseStart = responseStart >= startAt ? responseStart - startAt : requestStart;
                  responseEnd = responseEnd >= startAt ? responseEnd - startAt : responseStart;
                  domLoading = domLoading >= startAt ? domLoading - startAt : responseEnd;
                  domInteractive = domInteractive >= startAt ? domInteractive - startAt : domLoading;
                  domContentLoadedEventStart =
                      domContentLoadedEventStart >= startAt ? domContentLoadedEventStart - startAt : domInteractive;
                  domContentLoadedEventEnd =
                      domContentLoadedEventEnd >= startAt ? domContentLoadedEventEnd - startAt : domContentLoadedEventStart;
                  domComplete = domComplete >= startAt ? domComplete - startAt : domContentLoadedEventEnd;
                  loadEventStart = loadEventStart >= startAt ? loadEventStart - startAt : domComplete;
                  loadEventEnd = loadEventEnd >= startAt ? loadEventEnd - startAt : loadEventStart;
                  timing = {
                      navigationStart: 0,
                      unloadEventStart: unloadEventStart,
                      unloadEventEnd: unloadEventEnd,
                      redirectStart: redirectStart,
                      redirectEnd: redirectEnd,
                      fetchStart: fetchStart,
                      domainLookupStart: domainLookupStart,
                      domainLookupEnd: domainLookupEnd,
                      connectStart: connectStart,
                      secureConnectionStart: secureConnectionStart,
                      connectEnd: connectEnd,
                      requestStart: requestStart,
                      responseStart: responseStart,
                      responseEnd: responseEnd,
                      domLoading: domLoading,
                      domInteractive: domInteractive,
                      domContentLoadedEventEnd: domContentLoadedEventEnd,
                      domContentLoadedEventStart: domContentLoadedEventStart,
                      domComplete: domComplete,
                      loadEventStart: loadEventStart,
                      loadEventEnd: loadEventEnd,
                      redirectCount: redirectCount,
                  };
                  _this_1.report({ runTime: 'immediately', data: { eid: '1000', l: timing } });
              });
          }
      };
      Browser.prototype.formatTiming = function (timing) {
          var unloadEventStart = timing.unloadEventStart, unloadEventEnd = timing.unloadEventEnd, navigationStart = timing.navigationStart, redirectStart = timing.redirectStart, redirectEnd = timing.redirectEnd, redirectCount = timing.redirectCount, fetchStart = timing.fetchStart, domainLookupStart = timing.domainLookupStart, domainLookupEnd = timing.domainLookupEnd, connectStart = timing.connectStart, secureConnectionStart = timing.secureConnectionStart, connectEnd = timing.connectEnd, requestStart = timing.requestStart, responseStart = timing.responseStart, responseEnd = timing.responseEnd, domLoading = timing.domLoading, domInteractive = timing.domInteractive, domContentLoadedEventEnd = timing.domContentLoadedEventEnd, domContentLoadedEventStart = timing.domContentLoadedEventStart, domComplete = timing.domComplete, loadEventStart = timing.loadEventStart, loadEventEnd = timing.loadEventEnd;
          var t = {
              unloadEventStart: unloadEventStart,
              unloadEventEnd: unloadEventEnd,
              navigationStart: navigationStart,
              redirectStart: redirectStart,
              redirectEnd: redirectEnd,
              redirectCount: redirectCount,
              fetchStart: fetchStart,
              domainLookupStart: domainLookupStart,
              domainLookupEnd: domainLookupEnd,
              connectStart: connectStart,
              secureConnectionStart: secureConnectionStart,
              connectEnd: connectEnd,
              requestStart: requestStart,
              responseStart: responseStart,
              responseEnd: responseEnd,
              domLoading: domLoading,
              domInteractive: domInteractive,
              domContentLoadedEventEnd: domContentLoadedEventEnd,
              domContentLoadedEventStart: domContentLoadedEventStart,
              domComplete: domComplete,
              loadEventStart: loadEventStart,
              loadEventEnd: loadEventEnd,
          };
          Object.entries(t).forEach(function (_a) {
              var key = _a[0], value = _a[1];
              if (typeof value === 'number') {
                  t[key] = Number(value.toFixed(2));
              }
              else {
                  t[key] = value || 0;
              }
          });
          return t;
      };
      return Browser;
  }());

  exports.Browser = Browser;
  exports.default = Reporter;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
