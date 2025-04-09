import { o as getDefaultExportFromCjs } from "./indexhtml-CE3rDMXe.js";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var workerHtml$2 = {};
var hasRequiredWorkerHtml;
function requireWorkerHtml() {
  if (hasRequiredWorkerHtml) return workerHtml$2;
  hasRequiredWorkerHtml = 1;
  !function(window2) {
    if (typeof window2.window != "undefined" && window2.document)
      return;
    if (window2.require && window2.define)
      return;
    if (!window2.console) {
      window2.console = function() {
        var msgs = Array.prototype.slice.call(arguments, 0);
        postMessage({ type: "log", data: msgs });
      };
      window2.console.error = window2.console.warn = window2.console.log = window2.console.trace = window2.console;
    }
    window2.window = window2;
    window2.ace = window2;
    window2.onerror = function(message, file, line, col, err) {
      postMessage({ type: "error", data: {
        message,
        data: err && err.data,
        file,
        line,
        col,
        stack: err && err.stack
      } });
    };
    window2.normalizeModule = function(parentId, moduleName) {
      if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return window2.normalizeModule(parentId, chunks[0]) + "!" + window2.normalizeModule(parentId, chunks[1]);
      }
      if (moduleName.charAt(0) == ".") {
        var base = parentId.split("/").slice(0, -1).join("/");
        moduleName = (base ? base + "/" : "") + moduleName;
        while (moduleName.indexOf(".") !== -1 && previous != moduleName) {
          var previous = moduleName;
          moduleName = moduleName.replace(/^\.\//, "").replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
      }
      return moduleName;
    };
    window2.require = function require2(parentId, id) {
      if (!id) {
        id = parentId;
        parentId = null;
      }
      if (!id.charAt)
        throw new Error("worker.js require() accepts only (parentId, id) as arguments");
      id = window2.normalizeModule(parentId, id);
      var module = window2.require.modules[id];
      if (module) {
        if (!module.initialized) {
          module.initialized = true;
          module.exports = module.factory().exports;
        }
        return module.exports;
      }
      if (!window2.require.tlns)
        return console.log("unable to load " + id);
      var path = resolveModuleId(id, window2.require.tlns);
      if (path.slice(-3) != ".js") path += ".js";
      window2.require.id = id;
      window2.require.modules[id] = {};
      importScripts(path);
      return window2.require(parentId, id);
    };
    function resolveModuleId(id, paths) {
      var testPath = id, tail = "";
      while (testPath) {
        var alias = paths[testPath];
        if (typeof alias == "string") {
          return alias + tail;
        } else if (alias) {
          return alias.location.replace(/\/*$/, "/") + (tail || alias.main || alias.name);
        } else if (alias === false) {
          return "";
        }
        var i = testPath.lastIndexOf("/");
        if (i === -1) break;
        tail = testPath.substr(i) + tail;
        testPath = testPath.slice(0, i);
      }
      return id;
    }
    window2.require.modules = {};
    window2.require.tlns = {};
    window2.define = function(id, deps, factory) {
      if (arguments.length == 2) {
        factory = deps;
        if (typeof id != "string") {
          deps = id;
          id = window2.require.id;
        }
      } else if (arguments.length == 1) {
        factory = id;
        deps = [];
        id = window2.require.id;
      }
      if (typeof factory != "function") {
        window2.require.modules[id] = {
          exports: factory,
          initialized: true
        };
        return;
      }
      if (!deps.length)
        deps = ["require", "exports", "module"];
      var req = function(childId) {
        return window2.require(id, childId);
      };
      window2.require.modules[id] = {
        exports: {},
        factory: function() {
          var module = this;
          var returnExports = factory.apply(this, deps.slice(0, factory.length).map(function(dep) {
            switch (dep) {
              // Because "require", "exports" and "module" aren't actual
              // dependencies, we must handle them seperately.
              case "require":
                return req;
              case "exports":
                return module.exports;
              case "module":
                return module;
              // But for all other dependencies, we can just go ahead and
              // require them.
              default:
                return req(dep);
            }
          }));
          if (returnExports)
            module.exports = returnExports;
          return module;
        }
      };
    };
    window2.define.amd = {};
    window2.require.tlns = {};
    window2.initBaseUrls = function initBaseUrls(topLevelNamespaces) {
      for (var i in topLevelNamespaces)
        this.require.tlns[i] = topLevelNamespaces[i];
    };
    window2.initSender = function initSender() {
      var EventEmitter = window2.require("ace/lib/event_emitter").EventEmitter;
      var oop = window2.require("ace/lib/oop");
      var Sender = function() {
      };
      (function() {
        oop.implement(this, EventEmitter);
        this.callback = function(data, callbackId) {
          postMessage({
            type: "call",
            id: callbackId,
            data
          });
        };
        this.emit = function(name, data) {
          postMessage({
            type: "event",
            name,
            data
          });
        };
      }).call(Sender.prototype);
      return new Sender();
    };
    var main = window2.main = null;
    var sender = window2.sender = null;
    window2.onmessage = function(e) {
      var msg = e.data;
      if (msg.event && sender) {
        sender._signal(msg.event, msg.data);
      } else if (msg.command) {
        if (main[msg.command])
          main[msg.command].apply(main, msg.args);
        else if (window2[msg.command])
          window2[msg.command].apply(window2, msg.args);
        else
          throw new Error("Unknown command:" + msg.command);
      } else if (msg.init) {
        window2.initBaseUrls(msg.tlns);
        sender = window2.sender = window2.initSender();
        var clazz = this.require(msg.module)[msg.classname];
        main = window2.main = new clazz(sender);
      }
    };
  }(workerHtml$2);
  ace.define("ace/lib/oop", [], function(require2, exports, module) {
    exports.inherits = function(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
    exports.mixin = function(obj, mixin) {
      for (var key in mixin) {
        obj[key] = mixin[key];
      }
      return obj;
    };
    exports.implement = function(proto, mixin) {
      exports.mixin(proto, mixin);
    };
  });
  ace.define("ace/lib/lang", [], function(require2, exports, module) {
    exports.last = function(a) {
      return a[a.length - 1];
    };
    exports.stringReverse = function(string) {
      return string.split("").reverse().join("");
    };
    exports.stringRepeat = function(string, count) {
      var result = "";
      while (count > 0) {
        if (count & 1)
          result += string;
        if (count >>= 1)
          string += string;
      }
      return result;
    };
    var trimBeginRegexp = /^\s\s*/;
    var trimEndRegexp = /\s\s*$/;
    exports.stringTrimLeft = function(string) {
      return string.replace(trimBeginRegexp, "");
    };
    exports.stringTrimRight = function(string) {
      return string.replace(trimEndRegexp, "");
    };
    exports.copyObject = function(obj) {
      var copy = {};
      for (var key in obj) {
        copy[key] = obj[key];
      }
      return copy;
    };
    exports.copyArray = function(array) {
      var copy = [];
      for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] && typeof array[i] == "object")
          copy[i] = this.copyObject(array[i]);
        else
          copy[i] = array[i];
      }
      return copy;
    };
    exports.deepCopy = function deepCopy(obj) {
      if (typeof obj !== "object" || !obj)
        return obj;
      var copy;
      if (Array.isArray(obj)) {
        copy = [];
        for (var key = 0; key < obj.length; key++) {
          copy[key] = deepCopy(obj[key]);
        }
        return copy;
      }
      if (Object.prototype.toString.call(obj) !== "[object Object]")
        return obj;
      copy = {};
      for (var key in obj)
        copy[key] = deepCopy(obj[key]);
      return copy;
    };
    exports.arrayToMap = function(arr) {
      var map = {};
      for (var i = 0; i < arr.length; i++) {
        map[arr[i]] = 1;
      }
      return map;
    };
    exports.createMap = function(props) {
      var map = /* @__PURE__ */ Object.create(null);
      for (var i in props) {
        map[i] = props[i];
      }
      return map;
    };
    exports.arrayRemove = function(array, value) {
      for (var i = 0; i <= array.length; i++) {
        if (value === array[i]) {
          array.splice(i, 1);
        }
      }
    };
    exports.escapeRegExp = function(str) {
      return str.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
    };
    exports.escapeHTML = function(str) {
      return ("" + str).replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
    };
    exports.getMatchOffsets = function(string, regExp) {
      var matches = [];
      string.replace(regExp, function(str) {
        matches.push({
          offset: arguments[arguments.length - 2],
          length: str.length
        });
      });
      return matches;
    };
    exports.deferredCall = function(fcn) {
      var timer = null;
      var callback = function() {
        timer = null;
        fcn();
      };
      var deferred = function(timeout) {
        deferred.cancel();
        timer = setTimeout(callback, timeout || 0);
        return deferred;
      };
      deferred.schedule = deferred;
      deferred.call = function() {
        this.cancel();
        fcn();
        return deferred;
      };
      deferred.cancel = function() {
        clearTimeout(timer);
        timer = null;
        return deferred;
      };
      deferred.isPending = function() {
        return timer;
      };
      return deferred;
    };
    exports.delayedCall = function(fcn, defaultTimeout) {
      var timer = null;
      var callback = function() {
        timer = null;
        fcn();
      };
      var _self = function(timeout) {
        if (timer == null)
          timer = setTimeout(callback, timeout || defaultTimeout);
      };
      _self.delay = function(timeout) {
        timer && clearTimeout(timer);
        timer = setTimeout(callback, timeout || defaultTimeout);
      };
      _self.schedule = _self;
      _self.call = function() {
        this.cancel();
        fcn();
      };
      _self.cancel = function() {
        timer && clearTimeout(timer);
        timer = null;
      };
      _self.isPending = function() {
        return timer;
      };
      return _self;
    };
  });
  ace.define("ace/apply_delta", [], function(require2, exports, module) {
    exports.applyDelta = function(docLines, delta, doNotValidate) {
      var row = delta.start.row;
      var startColumn = delta.start.column;
      var line = docLines[row] || "";
      switch (delta.action) {
        case "insert":
          var lines = delta.lines;
          if (lines.length === 1) {
            docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
          } else {
            var args = [row, 1].concat(delta.lines);
            docLines.splice.apply(docLines, args);
            docLines[row] = line.substring(0, startColumn) + docLines[row];
            docLines[row + delta.lines.length - 1] += line.substring(startColumn);
          }
          break;
        case "remove":
          var endColumn = delta.end.column;
          var endRow = delta.end.row;
          if (row === endRow) {
            docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
          } else {
            docLines.splice(row, endRow - row + 1, line.substring(0, startColumn) + docLines[endRow].substring(endColumn));
          }
          break;
      }
    };
  });
  ace.define("ace/lib/event_emitter", [], function(require2, exports, module) {
    var EventEmitter = {};
    var stopPropagation = function() {
      this.propagationStopped = true;
    };
    var preventDefault = function() {
      this.defaultPrevented = true;
    };
    EventEmitter._emit = EventEmitter._dispatchEvent = function(eventName, e) {
      this._eventRegistry || (this._eventRegistry = {});
      this._defaultHandlers || (this._defaultHandlers = {});
      var listeners = this._eventRegistry[eventName] || [];
      var defaultHandler = this._defaultHandlers[eventName];
      if (!listeners.length && !defaultHandler)
        return;
      if (typeof e != "object" || !e)
        e = {};
      if (!e.type)
        e.type = eventName;
      if (!e.stopPropagation)
        e.stopPropagation = stopPropagation;
      if (!e.preventDefault)
        e.preventDefault = preventDefault;
      listeners = listeners.slice();
      for (var i = 0; i < listeners.length; i++) {
        listeners[i](e, this);
        if (e.propagationStopped)
          break;
      }
      if (defaultHandler && !e.defaultPrevented)
        return defaultHandler(e, this);
    };
    EventEmitter._signal = function(eventName, e) {
      var listeners = (this._eventRegistry || {})[eventName];
      if (!listeners)
        return;
      listeners = listeners.slice();
      for (var i = 0; i < listeners.length; i++)
        listeners[i](e, this);
    };
    EventEmitter.once = function(eventName, callback) {
      var _self = this;
      this.on(eventName, function newCallback() {
        _self.off(eventName, newCallback);
        callback.apply(null, arguments);
      });
      if (!callback) {
        return new Promise(function(resolve) {
          callback = resolve;
        });
      }
    };
    EventEmitter.setDefaultHandler = function(eventName, callback) {
      var handlers = this._defaultHandlers;
      if (!handlers)
        handlers = this._defaultHandlers = { _disabled_: {} };
      if (handlers[eventName]) {
        var old = handlers[eventName];
        var disabled = handlers._disabled_[eventName];
        if (!disabled)
          handlers._disabled_[eventName] = disabled = [];
        disabled.push(old);
        var i = disabled.indexOf(callback);
        if (i != -1)
          disabled.splice(i, 1);
      }
      handlers[eventName] = callback;
    };
    EventEmitter.removeDefaultHandler = function(eventName, callback) {
      var handlers = this._defaultHandlers;
      if (!handlers)
        return;
      var disabled = handlers._disabled_[eventName];
      if (handlers[eventName] == callback) {
        if (disabled)
          this.setDefaultHandler(eventName, disabled.pop());
      } else if (disabled) {
        var i = disabled.indexOf(callback);
        if (i != -1)
          disabled.splice(i, 1);
      }
    };
    EventEmitter.on = EventEmitter.addEventListener = function(eventName, callback, capturing) {
      this._eventRegistry = this._eventRegistry || {};
      var listeners = this._eventRegistry[eventName];
      if (!listeners)
        listeners = this._eventRegistry[eventName] = [];
      if (listeners.indexOf(callback) == -1)
        listeners[capturing ? "unshift" : "push"](callback);
      return callback;
    };
    EventEmitter.off = EventEmitter.removeListener = EventEmitter.removeEventListener = function(eventName, callback) {
      this._eventRegistry = this._eventRegistry || {};
      var listeners = this._eventRegistry[eventName];
      if (!listeners)
        return;
      var index = listeners.indexOf(callback);
      if (index !== -1)
        listeners.splice(index, 1);
    };
    EventEmitter.removeAllListeners = function(eventName) {
      if (!eventName)
        this._eventRegistry = this._defaultHandlers = void 0;
      if (this._eventRegistry)
        this._eventRegistry[eventName] = void 0;
      if (this._defaultHandlers)
        this._defaultHandlers[eventName] = void 0;
    };
    exports.EventEmitter = EventEmitter;
  });
  ace.define("ace/range", [], function(require2, exports, module) {
    var comparePoints = function(p1, p2) {
      return p1.row - p2.row || p1.column - p2.column;
    };
    var Range = (
      /** @class */
      function() {
        function Range2(startRow, startColumn, endRow, endColumn) {
          this.start = {
            row: startRow,
            column: startColumn
          };
          this.end = {
            row: endRow,
            column: endColumn
          };
        }
        Range2.prototype.isEqual = function(range) {
          return this.start.row === range.start.row && this.end.row === range.end.row && this.start.column === range.start.column && this.end.column === range.end.column;
        };
        Range2.prototype.toString = function() {
          return "Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]";
        };
        Range2.prototype.contains = function(row, column) {
          return this.compare(row, column) == 0;
        };
        Range2.prototype.compareRange = function(range) {
          var cmp, end = range.end, start = range.start;
          cmp = this.compare(end.row, end.column);
          if (cmp == 1) {
            cmp = this.compare(start.row, start.column);
            if (cmp == 1) {
              return 2;
            } else if (cmp == 0) {
              return 1;
            } else {
              return 0;
            }
          } else if (cmp == -1) {
            return -2;
          } else {
            cmp = this.compare(start.row, start.column);
            if (cmp == -1) {
              return -1;
            } else if (cmp == 1) {
              return 42;
            } else {
              return 0;
            }
          }
        };
        Range2.prototype.comparePoint = function(p) {
          return this.compare(p.row, p.column);
        };
        Range2.prototype.containsRange = function(range) {
          return this.comparePoint(range.start) == 0 && this.comparePoint(range.end) == 0;
        };
        Range2.prototype.intersects = function(range) {
          var cmp = this.compareRange(range);
          return cmp == -1 || cmp == 0 || cmp == 1;
        };
        Range2.prototype.isEnd = function(row, column) {
          return this.end.row == row && this.end.column == column;
        };
        Range2.prototype.isStart = function(row, column) {
          return this.start.row == row && this.start.column == column;
        };
        Range2.prototype.setStart = function(row, column) {
          if (typeof row == "object") {
            this.start.column = row.column;
            this.start.row = row.row;
          } else {
            this.start.row = row;
            this.start.column = column;
          }
        };
        Range2.prototype.setEnd = function(row, column) {
          if (typeof row == "object") {
            this.end.column = row.column;
            this.end.row = row.row;
          } else {
            this.end.row = row;
            this.end.column = column;
          }
        };
        Range2.prototype.inside = function(row, column) {
          if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
              return false;
            } else {
              return true;
            }
          }
          return false;
        };
        Range2.prototype.insideStart = function(row, column) {
          if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column)) {
              return false;
            } else {
              return true;
            }
          }
          return false;
        };
        Range2.prototype.insideEnd = function(row, column) {
          if (this.compare(row, column) == 0) {
            if (this.isStart(row, column)) {
              return false;
            } else {
              return true;
            }
          }
          return false;
        };
        Range2.prototype.compare = function(row, column) {
          if (!this.isMultiLine()) {
            if (row === this.start.row) {
              return column < this.start.column ? -1 : column > this.end.column ? 1 : 0;
            }
          }
          if (row < this.start.row)
            return -1;
          if (row > this.end.row)
            return 1;
          if (this.start.row === row)
            return column >= this.start.column ? 0 : -1;
          if (this.end.row === row)
            return column <= this.end.column ? 0 : 1;
          return 0;
        };
        Range2.prototype.compareStart = function(row, column) {
          if (this.start.row == row && this.start.column == column) {
            return -1;
          } else {
            return this.compare(row, column);
          }
        };
        Range2.prototype.compareEnd = function(row, column) {
          if (this.end.row == row && this.end.column == column) {
            return 1;
          } else {
            return this.compare(row, column);
          }
        };
        Range2.prototype.compareInside = function(row, column) {
          if (this.end.row == row && this.end.column == column) {
            return 1;
          } else if (this.start.row == row && this.start.column == column) {
            return -1;
          } else {
            return this.compare(row, column);
          }
        };
        Range2.prototype.clipRows = function(firstRow, lastRow) {
          if (this.end.row > lastRow)
            var end = { row: lastRow + 1, column: 0 };
          else if (this.end.row < firstRow)
            var end = { row: firstRow, column: 0 };
          if (this.start.row > lastRow)
            var start = { row: lastRow + 1, column: 0 };
          else if (this.start.row < firstRow)
            var start = { row: firstRow, column: 0 };
          return Range2.fromPoints(start || this.start, end || this.end);
        };
        Range2.prototype.extend = function(row, column) {
          var cmp = this.compare(row, column);
          if (cmp == 0)
            return this;
          else if (cmp == -1)
            var start = { row, column };
          else
            var end = { row, column };
          return Range2.fromPoints(start || this.start, end || this.end);
        };
        Range2.prototype.isEmpty = function() {
          return this.start.row === this.end.row && this.start.column === this.end.column;
        };
        Range2.prototype.isMultiLine = function() {
          return this.start.row !== this.end.row;
        };
        Range2.prototype.clone = function() {
          return Range2.fromPoints(this.start, this.end);
        };
        Range2.prototype.collapseRows = function() {
          if (this.end.column == 0)
            return new Range2(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
          else
            return new Range2(this.start.row, 0, this.end.row, 0);
        };
        Range2.prototype.toScreenRange = function(session) {
          var screenPosStart = session.documentToScreenPosition(this.start);
          var screenPosEnd = session.documentToScreenPosition(this.end);
          return new Range2(screenPosStart.row, screenPosStart.column, screenPosEnd.row, screenPosEnd.column);
        };
        Range2.prototype.moveBy = function(row, column) {
          this.start.row += row;
          this.start.column += column;
          this.end.row += row;
          this.end.column += column;
        };
        return Range2;
      }()
    );
    Range.fromPoints = function(start, end) {
      return new Range(start.row, start.column, end.row, end.column);
    };
    Range.comparePoints = comparePoints;
    Range.comparePoints = function(p1, p2) {
      return p1.row - p2.row || p1.column - p2.column;
    };
    exports.Range = Range;
  });
  ace.define("ace/anchor", [], function(require2, exports, module) {
    var oop = require2("./lib/oop");
    var EventEmitter = require2("./lib/event_emitter").EventEmitter;
    var Anchor = (
      /** @class */
      function() {
        function Anchor2(doc, row, column) {
          this.$onChange = this.onChange.bind(this);
          this.attach(doc);
          if (typeof column == "undefined")
            this.setPosition(row.row, row.column);
          else
            this.setPosition(row, column);
        }
        Anchor2.prototype.getPosition = function() {
          return this.$clipPositionToDocument(this.row, this.column);
        };
        Anchor2.prototype.getDocument = function() {
          return this.document;
        };
        Anchor2.prototype.onChange = function(delta) {
          if (delta.start.row == delta.end.row && delta.start.row != this.row)
            return;
          if (delta.start.row > this.row)
            return;
          var point = $getTransformedPoint(delta, { row: this.row, column: this.column }, this.$insertRight);
          this.setPosition(point.row, point.column, true);
        };
        Anchor2.prototype.setPosition = function(row, column, noClip) {
          var pos;
          if (noClip) {
            pos = {
              row,
              column
            };
          } else {
            pos = this.$clipPositionToDocument(row, column);
          }
          if (this.row == pos.row && this.column == pos.column)
            return;
          var old = {
            row: this.row,
            column: this.column
          };
          this.row = pos.row;
          this.column = pos.column;
          this._signal("change", {
            old,
            value: pos
          });
        };
        Anchor2.prototype.detach = function() {
          this.document.off("change", this.$onChange);
        };
        Anchor2.prototype.attach = function(doc) {
          this.document = doc || this.document;
          this.document.on("change", this.$onChange);
        };
        Anchor2.prototype.$clipPositionToDocument = function(row, column) {
          var pos = {};
          if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
          } else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
          } else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
          }
          if (column < 0)
            pos.column = 0;
          return pos;
        };
        return Anchor2;
      }()
    );
    Anchor.prototype.$insertRight = false;
    oop.implement(Anchor.prototype, EventEmitter);
    function $pointsInOrder(point1, point2, equalPointsInOrder) {
      var bColIsAfter = equalPointsInOrder ? point1.column <= point2.column : point1.column < point2.column;
      return point1.row < point2.row || point1.row == point2.row && bColIsAfter;
    }
    function $getTransformedPoint(delta, point, moveIfEqual) {
      var deltaIsInsert = delta.action == "insert";
      var deltaRowShift = (deltaIsInsert ? 1 : -1) * (delta.end.row - delta.start.row);
      var deltaColShift = (deltaIsInsert ? 1 : -1) * (delta.end.column - delta.start.column);
      var deltaStart = delta.start;
      var deltaEnd = deltaIsInsert ? deltaStart : delta.end;
      if ($pointsInOrder(point, deltaStart, moveIfEqual)) {
        return {
          row: point.row,
          column: point.column
        };
      }
      if ($pointsInOrder(deltaEnd, point, !moveIfEqual)) {
        return {
          row: point.row + deltaRowShift,
          column: point.column + (point.row == deltaEnd.row ? deltaColShift : 0)
        };
      }
      return {
        row: deltaStart.row,
        column: deltaStart.column
      };
    }
    exports.Anchor = Anchor;
  });
  ace.define("ace/document", [], function(require2, exports, module) {
    var oop = require2("./lib/oop");
    var applyDelta = require2("./apply_delta").applyDelta;
    var EventEmitter = require2("./lib/event_emitter").EventEmitter;
    var Range = require2("./range").Range;
    var Anchor = require2("./anchor").Anchor;
    var Document = (
      /** @class */
      function() {
        function Document2(textOrLines) {
          this.$lines = [""];
          if (textOrLines.length === 0) {
            this.$lines = [""];
          } else if (Array.isArray(textOrLines)) {
            this.insertMergedLines({ row: 0, column: 0 }, textOrLines);
          } else {
            this.insert({ row: 0, column: 0 }, textOrLines);
          }
        }
        Document2.prototype.setValue = function(text) {
          var len = this.getLength() - 1;
          this.remove(new Range(0, 0, len, this.getLine(len).length));
          this.insert({ row: 0, column: 0 }, text || "");
        };
        Document2.prototype.getValue = function() {
          return this.getAllLines().join(this.getNewLineCharacter());
        };
        Document2.prototype.createAnchor = function(row, column) {
          return new Anchor(this, row, column);
        };
        Document2.prototype.$detectNewLine = function(text) {
          var match = text.match(/^.*?(\r\n|\r|\n)/m);
          this.$autoNewLine = match ? match[1] : "\n";
          this._signal("changeNewLineMode");
        };
        Document2.prototype.getNewLineCharacter = function() {
          switch (this.$newLineMode) {
            case "windows":
              return "\r\n";
            case "unix":
              return "\n";
            default:
              return this.$autoNewLine || "\n";
          }
        };
        Document2.prototype.setNewLineMode = function(newLineMode) {
          if (this.$newLineMode === newLineMode)
            return;
          this.$newLineMode = newLineMode;
          this._signal("changeNewLineMode");
        };
        Document2.prototype.getNewLineMode = function() {
          return this.$newLineMode;
        };
        Document2.prototype.isNewLine = function(text) {
          return text == "\r\n" || text == "\r" || text == "\n";
        };
        Document2.prototype.getLine = function(row) {
          return this.$lines[row] || "";
        };
        Document2.prototype.getLines = function(firstRow, lastRow) {
          return this.$lines.slice(firstRow, lastRow + 1);
        };
        Document2.prototype.getAllLines = function() {
          return this.getLines(0, this.getLength());
        };
        Document2.prototype.getLength = function() {
          return this.$lines.length;
        };
        Document2.prototype.getTextRange = function(range) {
          return this.getLinesForRange(range).join(this.getNewLineCharacter());
        };
        Document2.prototype.getLinesForRange = function(range) {
          var lines;
          if (range.start.row === range.end.row) {
            lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
          } else {
            lines = this.getLines(range.start.row, range.end.row);
            lines[0] = (lines[0] || "").substring(range.start.column);
            var l = lines.length - 1;
            if (range.end.row - range.start.row == l)
              lines[l] = lines[l].substring(0, range.end.column);
          }
          return lines;
        };
        Document2.prototype.insertLines = function(row, lines) {
          console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead.");
          return this.insertFullLines(row, lines);
        };
        Document2.prototype.removeLines = function(firstRow, lastRow) {
          console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead.");
          return this.removeFullLines(firstRow, lastRow);
        };
        Document2.prototype.insertNewLine = function(position) {
          console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead.");
          return this.insertMergedLines(position, ["", ""]);
        };
        Document2.prototype.insert = function(position, text) {
          if (this.getLength() <= 1)
            this.$detectNewLine(text);
          return this.insertMergedLines(position, this.$split(text));
        };
        Document2.prototype.insertInLine = function(position, text) {
          var start = this.clippedPos(position.row, position.column);
          var end = this.pos(position.row, position.column + text.length);
          this.applyDelta({
            start,
            end,
            action: "insert",
            lines: [text]
          }, true);
          return this.clonePos(end);
        };
        Document2.prototype.clippedPos = function(row, column) {
          var length = this.getLength();
          if (row === void 0) {
            row = length;
          } else if (row < 0) {
            row = 0;
          } else if (row >= length) {
            row = length - 1;
            column = void 0;
          }
          var line = this.getLine(row);
          if (column == void 0)
            column = line.length;
          column = Math.min(Math.max(column, 0), line.length);
          return { row, column };
        };
        Document2.prototype.clonePos = function(pos) {
          return { row: pos.row, column: pos.column };
        };
        Document2.prototype.pos = function(row, column) {
          return { row, column };
        };
        Document2.prototype.$clipPosition = function(position) {
          var length = this.getLength();
          if (position.row >= length) {
            position.row = Math.max(0, length - 1);
            position.column = this.getLine(length - 1).length;
          } else {
            position.row = Math.max(0, position.row);
            position.column = Math.min(Math.max(position.column, 0), this.getLine(position.row).length);
          }
          return position;
        };
        Document2.prototype.insertFullLines = function(row, lines) {
          row = Math.min(Math.max(row, 0), this.getLength());
          var column = 0;
          if (row < this.getLength()) {
            lines = lines.concat([""]);
            column = 0;
          } else {
            lines = [""].concat(lines);
            row--;
            column = this.$lines[row].length;
          }
          this.insertMergedLines({ row, column }, lines);
        };
        Document2.prototype.insertMergedLines = function(position, lines) {
          var start = this.clippedPos(position.row, position.column);
          var end = {
            row: start.row + lines.length - 1,
            column: (lines.length == 1 ? start.column : 0) + lines[lines.length - 1].length
          };
          this.applyDelta({
            start,
            end,
            action: "insert",
            lines
          });
          return this.clonePos(end);
        };
        Document2.prototype.remove = function(range) {
          var start = this.clippedPos(range.start.row, range.start.column);
          var end = this.clippedPos(range.end.row, range.end.column);
          this.applyDelta({
            start,
            end,
            action: "remove",
            lines: this.getLinesForRange({ start, end })
          });
          return this.clonePos(start);
        };
        Document2.prototype.removeInLine = function(row, startColumn, endColumn) {
          var start = this.clippedPos(row, startColumn);
          var end = this.clippedPos(row, endColumn);
          this.applyDelta({
            start,
            end,
            action: "remove",
            lines: this.getLinesForRange({ start, end })
          }, true);
          return this.clonePos(start);
        };
        Document2.prototype.removeFullLines = function(firstRow, lastRow) {
          firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
          lastRow = Math.min(Math.max(0, lastRow), this.getLength() - 1);
          var deleteFirstNewLine = lastRow == this.getLength() - 1 && firstRow > 0;
          var deleteLastNewLine = lastRow < this.getLength() - 1;
          var startRow = deleteFirstNewLine ? firstRow - 1 : firstRow;
          var startCol = deleteFirstNewLine ? this.getLine(startRow).length : 0;
          var endRow = deleteLastNewLine ? lastRow + 1 : lastRow;
          var endCol = deleteLastNewLine ? 0 : this.getLine(endRow).length;
          var range = new Range(startRow, startCol, endRow, endCol);
          var deletedLines = this.$lines.slice(firstRow, lastRow + 1);
          this.applyDelta({
            start: range.start,
            end: range.end,
            action: "remove",
            lines: this.getLinesForRange(range)
          });
          return deletedLines;
        };
        Document2.prototype.removeNewLine = function(row) {
          if (row < this.getLength() - 1 && row >= 0) {
            this.applyDelta({
              start: this.pos(row, this.getLine(row).length),
              end: this.pos(row + 1, 0),
              action: "remove",
              lines: ["", ""]
            });
          }
        };
        Document2.prototype.replace = function(range, text) {
          if (!(range instanceof Range))
            range = Range.fromPoints(range.start, range.end);
          if (text.length === 0 && range.isEmpty())
            return range.start;
          if (text == this.getTextRange(range))
            return range.end;
          this.remove(range);
          var end;
          if (text) {
            end = this.insert(range.start, text);
          } else {
            end = range.start;
          }
          return end;
        };
        Document2.prototype.applyDeltas = function(deltas) {
          for (var i = 0; i < deltas.length; i++) {
            this.applyDelta(deltas[i]);
          }
        };
        Document2.prototype.revertDeltas = function(deltas) {
          for (var i = deltas.length - 1; i >= 0; i--) {
            this.revertDelta(deltas[i]);
          }
        };
        Document2.prototype.applyDelta = function(delta, doNotValidate) {
          var isInsert = delta.action == "insert";
          if (isInsert ? delta.lines.length <= 1 && !delta.lines[0] : !Range.comparePoints(delta.start, delta.end)) {
            return;
          }
          if (isInsert && delta.lines.length > 2e4) {
            this.$splitAndapplyLargeDelta(delta, 2e4);
          } else {
            applyDelta(this.$lines, delta, doNotValidate);
            this._signal("change", delta);
          }
        };
        Document2.prototype.$safeApplyDelta = function(delta) {
          var docLength = this.$lines.length;
          if (delta.action == "remove" && delta.start.row < docLength && delta.end.row < docLength || delta.action == "insert" && delta.start.row <= docLength) {
            this.applyDelta(delta);
          }
        };
        Document2.prototype.$splitAndapplyLargeDelta = function(delta, MAX) {
          var lines = delta.lines;
          var l = lines.length - MAX + 1;
          var row = delta.start.row;
          var column = delta.start.column;
          for (var from = 0, to = 0; from < l; from = to) {
            to += MAX - 1;
            var chunk = lines.slice(from, to);
            chunk.push("");
            this.applyDelta({
              start: this.pos(row + from, column),
              end: this.pos(row + to, column = 0),
              action: delta.action,
              lines: chunk
            }, true);
          }
          delta.lines = lines.slice(from);
          delta.start.row = row + from;
          delta.start.column = column;
          this.applyDelta(delta, true);
        };
        Document2.prototype.revertDelta = function(delta) {
          this.$safeApplyDelta({
            start: this.clonePos(delta.start),
            end: this.clonePos(delta.end),
            action: delta.action == "insert" ? "remove" : "insert",
            lines: delta.lines.slice()
          });
        };
        Document2.prototype.indexToPosition = function(index, startRow) {
          var lines = this.$lines || this.getAllLines();
          var newlineLength = this.getNewLineCharacter().length;
          for (var i = startRow || 0, l = lines.length; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
              return { row: i, column: index + lines[i].length + newlineLength };
          }
          return { row: l - 1, column: index + lines[l - 1].length + newlineLength };
        };
        Document2.prototype.positionToIndex = function(pos, startRow) {
          var lines = this.$lines || this.getAllLines();
          var newlineLength = this.getNewLineCharacter().length;
          var index = 0;
          var row = Math.min(pos.row, lines.length);
          for (var i = startRow || 0; i < row; ++i)
            index += lines[i].length + newlineLength;
          return index + pos.column;
        };
        return Document2;
      }()
    );
    Document.prototype.$split = "aaa".split(/a/).length === 0 ? function(text) {
      return text.replace(/\r\n|\r/g, "\n").split("\n");
    } : function(text) {
      return text.split(/\r\n|\r|\n/);
    };
    Document.prototype.$autoNewLine = "";
    Document.prototype.$newLineMode = "auto";
    oop.implement(Document.prototype, EventEmitter);
    exports.Document = Document;
  });
  ace.define("ace/worker/mirror", [], function(require2, exports, module) {
    var Document = require2("../document").Document;
    var lang = require2("../lib/lang");
    var Mirror = exports.Mirror = function(sender) {
      this.sender = sender;
      var doc = this.doc = new Document("");
      var deferredUpdate = this.deferredUpdate = lang.delayedCall(this.onUpdate.bind(this));
      var _self = this;
      sender.on("change", function(e) {
        var data = e.data;
        if (data[0].start) {
          doc.applyDeltas(data);
        } else {
          for (var i = 0; i < data.length; i += 2) {
            var d, err;
            if (Array.isArray(data[i + 1])) {
              d = { action: "insert", start: data[i], lines: data[i + 1] };
            } else {
              d = { action: "remove", start: data[i], end: data[i + 1] };
            }
            if ((d.action == "insert" ? d.start : d.end).row >= doc.$lines.length) {
              err = new Error("Invalid delta");
              err.data = {
                path: _self.$path,
                linesLength: doc.$lines.length,
                start: d.start,
                end: d.end
              };
              throw err;
            }
            doc.applyDelta(d, true);
          }
        }
        if (_self.$timeout)
          return deferredUpdate.schedule(_self.$timeout);
        _self.onUpdate();
      });
    };
    (function() {
      this.$timeout = 500;
      this.setTimeout = function(timeout) {
        this.$timeout = timeout;
      };
      this.setValue = function(value) {
        this.doc.setValue(value);
        this.deferredUpdate.schedule(this.$timeout);
      };
      this.getValue = function(callbackId) {
        this.sender.callback(this.doc.getValue(), callbackId);
      };
      this.onUpdate = function() {
      };
      this.isPending = function() {
        return this.deferredUpdate.isPending();
      };
    }).call(Mirror.prototype);
  });
  ace.define("ace/mode/html/saxparser", [], function(require2, exports, module) {
    module.exports = function e(t, n, r) {
      function s(o2, u) {
        if (!n[o2]) {
          if (!t[o2]) {
            var a = typeof require2 == "function" && require2;
            if (!u && a) return a(o2, true);
            if (i) return i(o2, true);
            throw new Error("Cannot find module '" + o2 + "'");
          }
          var f = n[o2] = { exports: {} };
          t[o2][0].call(f.exports, function(e2) {
            var n2 = t[o2][1][e2];
            return s(n2 ? n2 : e2);
          }, f, f.exports, e, t, n, r);
        }
        return n[o2].exports;
      }
      var i = typeof require2 == "function" && require2;
      for (var o = 0; o < r.length; o++) s(r[o]);
      return s;
    }({
      1: [
        function(_dereq_, module2, exports2) {
          function isScopeMarker(node) {
            if (node.namespaceURI === "http://www.w3.org/1999/xhtml") {
              return node.localName === "applet" || node.localName === "caption" || node.localName === "marquee" || node.localName === "object" || node.localName === "table" || node.localName === "td" || node.localName === "th";
            }
            if (node.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
              return node.localName === "mi" || node.localName === "mo" || node.localName === "mn" || node.localName === "ms" || node.localName === "mtext" || node.localName === "annotation-xml";
            }
            if (node.namespaceURI === "http://www.w3.org/2000/svg") {
              return node.localName === "foreignObject" || node.localName === "desc" || node.localName === "title";
            }
          }
          function isListItemScopeMarker(node) {
            return isScopeMarker(node) || node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "ol" || node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "ul";
          }
          function isTableScopeMarker(node) {
            return node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "table" || node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "html";
          }
          function isTableBodyScopeMarker(node) {
            return node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "tbody" || node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "tfoot" || node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "thead" || node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "html";
          }
          function isTableRowScopeMarker(node) {
            return node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "tr" || node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "html";
          }
          function isButtonScopeMarker(node) {
            return isScopeMarker(node) || node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "button";
          }
          function isSelectScopeMarker(node) {
            return !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "optgroup") && !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === "option");
          }
          function ElementStack() {
            this.elements = [];
            this.rootNode = null;
            this.headElement = null;
            this.bodyElement = null;
          }
          ElementStack.prototype._inScope = function(localName, isMarker) {
            for (var i = this.elements.length - 1; i >= 0; i--) {
              var node = this.elements[i];
              if (node.localName === localName)
                return true;
              if (isMarker(node))
                return false;
            }
          };
          ElementStack.prototype.push = function(item) {
            this.elements.push(item);
          };
          ElementStack.prototype.pushHtmlElement = function(item) {
            this.rootNode = item.node;
            this.push(item);
          };
          ElementStack.prototype.pushHeadElement = function(item) {
            this.headElement = item.node;
            this.push(item);
          };
          ElementStack.prototype.pushBodyElement = function(item) {
            this.bodyElement = item.node;
            this.push(item);
          };
          ElementStack.prototype.pop = function() {
            return this.elements.pop();
          };
          ElementStack.prototype.remove = function(item) {
            this.elements.splice(this.elements.indexOf(item), 1);
          };
          ElementStack.prototype.popUntilPopped = function(localName) {
            var element;
            do {
              element = this.pop();
            } while (element.localName != localName);
          };
          ElementStack.prototype.popUntilTableScopeMarker = function() {
            while (!isTableScopeMarker(this.top))
              this.pop();
          };
          ElementStack.prototype.popUntilTableBodyScopeMarker = function() {
            while (!isTableBodyScopeMarker(this.top))
              this.pop();
          };
          ElementStack.prototype.popUntilTableRowScopeMarker = function() {
            while (!isTableRowScopeMarker(this.top))
              this.pop();
          };
          ElementStack.prototype.item = function(index) {
            return this.elements[index];
          };
          ElementStack.prototype.contains = function(element) {
            return this.elements.indexOf(element) !== -1;
          };
          ElementStack.prototype.inScope = function(localName) {
            return this._inScope(localName, isScopeMarker);
          };
          ElementStack.prototype.inListItemScope = function(localName) {
            return this._inScope(localName, isListItemScopeMarker);
          };
          ElementStack.prototype.inTableScope = function(localName) {
            return this._inScope(localName, isTableScopeMarker);
          };
          ElementStack.prototype.inButtonScope = function(localName) {
            return this._inScope(localName, isButtonScopeMarker);
          };
          ElementStack.prototype.inSelectScope = function(localName) {
            return this._inScope(localName, isSelectScopeMarker);
          };
          ElementStack.prototype.hasNumberedHeaderElementInScope = function() {
            for (var i = this.elements.length - 1; i >= 0; i--) {
              var node = this.elements[i];
              if (node.isNumberedHeader())
                return true;
              if (isScopeMarker(node))
                return false;
            }
          };
          ElementStack.prototype.furthestBlockForFormattingElement = function(element) {
            var furthestBlock = null;
            for (var i = this.elements.length - 1; i >= 0; i--) {
              var node = this.elements[i];
              if (node.node === element)
                break;
              if (node.isSpecial())
                furthestBlock = node;
            }
            return furthestBlock;
          };
          ElementStack.prototype.findIndex = function(localName) {
            for (var i = this.elements.length - 1; i >= 0; i--) {
              if (this.elements[i].localName == localName)
                return i;
            }
            return -1;
          };
          ElementStack.prototype.remove_openElements_until = function(callback) {
            var finished = false;
            var element;
            while (!finished) {
              element = this.elements.pop();
              finished = callback(element);
            }
            return element;
          };
          Object.defineProperty(ElementStack.prototype, "top", {
            get: function() {
              return this.elements[this.elements.length - 1];
            }
          });
          Object.defineProperty(ElementStack.prototype, "length", {
            get: function() {
              return this.elements.length;
            }
          });
          exports2.ElementStack = ElementStack;
        },
        {}
      ],
      2: [
        function(_dereq_, module2, exports2) {
          var entities = _dereq_("html5-entities");
          var InputStream = _dereq_("./InputStream").InputStream;
          var namedEntityPrefixes = {};
          Object.keys(entities).forEach(function(entityKey) {
            for (var i = 0; i < entityKey.length; i++) {
              namedEntityPrefixes[entityKey.substring(0, i + 1)] = true;
            }
          });
          function isAlphaNumeric(c) {
            return c >= "0" && c <= "9" || c >= "a" && c <= "z" || c >= "A" && c <= "Z";
          }
          function isHexDigit(c) {
            return c >= "0" && c <= "9" || c >= "a" && c <= "f" || c >= "A" && c <= "F";
          }
          function isDecimalDigit(c) {
            return c >= "0" && c <= "9";
          }
          var EntityParser = {};
          EntityParser.consumeEntity = function(buffer, tokenizer, additionalAllowedCharacter) {
            var decodedCharacter = "";
            var consumedCharacters = "";
            var ch = buffer.char();
            if (ch === InputStream.EOF)
              return false;
            consumedCharacters += ch;
            if (ch == "	" || ch == "\n" || ch == "\v" || ch == " " || ch == "<" || ch == "&") {
              buffer.unget(consumedCharacters);
              return false;
            }
            if (additionalAllowedCharacter === ch) {
              buffer.unget(consumedCharacters);
              return false;
            }
            if (ch == "#") {
              ch = buffer.shift(1);
              if (ch === InputStream.EOF) {
                tokenizer._parseError("expected-numeric-entity-but-got-eof");
                buffer.unget(consumedCharacters);
                return false;
              }
              consumedCharacters += ch;
              var radix = 10;
              var isDigit = isDecimalDigit;
              if (ch == "x" || ch == "X") {
                radix = 16;
                isDigit = isHexDigit;
                ch = buffer.shift(1);
                if (ch === InputStream.EOF) {
                  tokenizer._parseError("expected-numeric-entity-but-got-eof");
                  buffer.unget(consumedCharacters);
                  return false;
                }
                consumedCharacters += ch;
              }
              if (isDigit(ch)) {
                var code = "";
                while (ch !== InputStream.EOF && isDigit(ch)) {
                  code += ch;
                  ch = buffer.char();
                }
                code = parseInt(code, radix);
                var replacement = this.replaceEntityNumbers(code);
                if (replacement) {
                  tokenizer._parseError("invalid-numeric-entity-replaced");
                  code = replacement;
                }
                if (code > 65535 && code <= 1114111) {
                  code -= 65536;
                  var first = ((1047552 & code) >> 10) + 55296;
                  var second = (1023 & code) + 56320;
                  decodedCharacter = String.fromCharCode(first, second);
                } else
                  decodedCharacter = String.fromCharCode(code);
                if (ch !== ";") {
                  tokenizer._parseError("numeric-entity-without-semicolon");
                  buffer.unget(ch);
                }
                return decodedCharacter;
              }
              buffer.unget(consumedCharacters);
              tokenizer._parseError("expected-numeric-entity");
              return false;
            }
            if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") {
              var mostRecentMatch = "";
              while (namedEntityPrefixes[consumedCharacters]) {
                if (entities[consumedCharacters]) {
                  mostRecentMatch = consumedCharacters;
                }
                if (ch == ";")
                  break;
                ch = buffer.char();
                if (ch === InputStream.EOF)
                  break;
                consumedCharacters += ch;
              }
              if (!mostRecentMatch) {
                tokenizer._parseError("expected-named-entity");
                buffer.unget(consumedCharacters);
                return false;
              }
              decodedCharacter = entities[mostRecentMatch];
              if (ch === ";" || !additionalAllowedCharacter || !(isAlphaNumeric(ch) || ch === "=")) {
                if (consumedCharacters.length > mostRecentMatch.length) {
                  buffer.unget(consumedCharacters.substring(mostRecentMatch.length));
                }
                if (ch !== ";") {
                  tokenizer._parseError("named-entity-without-semicolon");
                }
                return decodedCharacter;
              }
              buffer.unget(consumedCharacters);
              return false;
            }
          };
          EntityParser.replaceEntityNumbers = function(c) {
            switch (c) {
              case 0:
                return 65533;
              // REPLACEMENT CHARACTER
              case 19:
                return 16;
              // Carriage return
              case 128:
                return 8364;
              // EURO SIGN
              case 129:
                return 129;
              // <control>
              case 130:
                return 8218;
              // SINGLE LOW-9 QUOTATION MARK
              case 131:
                return 402;
              // LATIN SMALL LETTER F WITH HOOK
              case 132:
                return 8222;
              // DOUBLE LOW-9 QUOTATION MARK
              case 133:
                return 8230;
              // HORIZONTAL ELLIPSIS
              case 134:
                return 8224;
              // DAGGER
              case 135:
                return 8225;
              // DOUBLE DAGGER
              case 136:
                return 710;
              // MODIFIER LETTER CIRCUMFLEX ACCENT
              case 137:
                return 8240;
              // PER MILLE SIGN
              case 138:
                return 352;
              // LATIN CAPITAL LETTER S WITH CARON
              case 139:
                return 8249;
              // SINGLE LEFT-POINTING ANGLE QUOTATION MARK
              case 140:
                return 338;
              // LATIN CAPITAL LIGATURE OE
              case 141:
                return 141;
              // <control>
              case 142:
                return 381;
              // LATIN CAPITAL LETTER Z WITH CARON
              case 143:
                return 143;
              // <control>
              case 144:
                return 144;
              // <control>
              case 145:
                return 8216;
              // LEFT SINGLE QUOTATION MARK
              case 146:
                return 8217;
              // RIGHT SINGLE QUOTATION MARK
              case 147:
                return 8220;
              // LEFT DOUBLE QUOTATION MARK
              case 148:
                return 8221;
              // RIGHT DOUBLE QUOTATION MARK
              case 149:
                return 8226;
              // BULLET
              case 150:
                return 8211;
              // EN DASH
              case 151:
                return 8212;
              // EM DASH
              case 152:
                return 732;
              // SMALL TILDE
              case 153:
                return 8482;
              // TRADE MARK SIGN
              case 154:
                return 353;
              // LATIN SMALL LETTER S WITH CARON
              case 155:
                return 8250;
              // SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
              case 156:
                return 339;
              // LATIN SMALL LIGATURE OE
              case 157:
                return 157;
              // <control>
              case 158:
                return 382;
              // LATIN SMALL LETTER Z WITH CARON
              case 159:
                return 376;
              // LATIN CAPITAL LETTER Y WITH DIAERESIS
              default:
                if (c >= 55296 && c <= 57343 || c > 1114111) {
                  return 65533;
                } else if (c >= 1 && c <= 8 || c >= 14 && c <= 31 || c >= 127 && c <= 159 || c >= 64976 && c <= 65007 || c == 11 || c == 65534 || c == 131070 || c == 3145726 || c == 196607 || c == 262142 || c == 262143 || c == 327678 || c == 327679 || c == 393214 || c == 393215 || c == 458750 || c == 458751 || c == 524286 || c == 524287 || c == 589822 || c == 589823 || c == 655358 || c == 655359 || c == 720894 || c == 720895 || c == 786430 || c == 786431 || c == 851966 || c == 851967 || c == 917502 || c == 917503 || c == 983038 || c == 983039 || c == 1048574 || c == 1048575 || c == 1114110 || c == 1114111) {
                  return c;
                }
            }
          };
          exports2.EntityParser = EntityParser;
        },
        { "./InputStream": 3, "html5-entities": 12 }
      ],
      3: [
        function(_dereq_, module2, exports2) {
          function InputStream() {
            this.data = "";
            this.start = 0;
            this.committed = 0;
            this.eof = false;
            this.lastLocation = { line: 0, column: 0 };
          }
          InputStream.EOF = -1;
          InputStream.DRAIN = -2;
          InputStream.prototype = {
            slice: function() {
              if (this.start >= this.data.length) {
                if (!this.eof) throw InputStream.DRAIN;
                return InputStream.EOF;
              }
              return this.data.slice(this.start, this.data.length);
            },
            char: function() {
              if (!this.eof && this.start >= this.data.length - 1) throw InputStream.DRAIN;
              if (this.start >= this.data.length) {
                return InputStream.EOF;
              }
              var ch = this.data[this.start++];
              if (ch === "\r")
                ch = "\n";
              return ch;
            },
            advance: function(amount) {
              this.start += amount;
              if (this.start >= this.data.length) {
                if (!this.eof) throw InputStream.DRAIN;
                return InputStream.EOF;
              } else {
                if (this.committed > this.data.length / 2) {
                  this.lastLocation = this.location();
                  this.data = this.data.slice(this.committed);
                  this.start = this.start - this.committed;
                  this.committed = 0;
                }
              }
            },
            matchWhile: function(re) {
              if (this.eof && this.start >= this.data.length) return "";
              var r = new RegExp("^" + re + "+");
              var m = r.exec(this.slice());
              if (m) {
                if (!this.eof && m[0].length == this.data.length - this.start) throw InputStream.DRAIN;
                this.advance(m[0].length);
                return m[0];
              } else {
                return "";
              }
            },
            matchUntil: function(re) {
              var m, s;
              s = this.slice();
              if (s === InputStream.EOF) {
                return "";
              } else if (m = new RegExp(re + (this.eof ? "|$" : "")).exec(s)) {
                var t = this.data.slice(this.start, this.start + m.index);
                this.advance(m.index);
                return t.replace(/\r/g, "\n").replace(/\n{2,}/g, "\n");
              } else {
                throw InputStream.DRAIN;
              }
            },
            append: function(data) {
              this.data += data;
            },
            shift: function(n) {
              if (!this.eof && this.start + n >= this.data.length) throw InputStream.DRAIN;
              if (this.eof && this.start >= this.data.length) return InputStream.EOF;
              var d = this.data.slice(this.start, this.start + n).toString();
              this.advance(Math.min(n, this.data.length - this.start));
              return d;
            },
            peek: function(n) {
              if (!this.eof && this.start + n >= this.data.length) throw InputStream.DRAIN;
              if (this.eof && this.start >= this.data.length) return InputStream.EOF;
              return this.data.slice(this.start, Math.min(this.start + n, this.data.length)).toString();
            },
            length: function() {
              return this.data.length - this.start - 1;
            },
            unget: function(d) {
              if (d === InputStream.EOF) return;
              this.start -= d.length;
            },
            undo: function() {
              this.start = this.committed;
            },
            commit: function() {
              this.committed = this.start;
            },
            location: function() {
              var lastLine = this.lastLocation.line;
              var lastColumn = this.lastLocation.column;
              var read = this.data.slice(0, this.committed);
              var newlines = read.match(/\n/g);
              var line = newlines ? lastLine + newlines.length : lastLine;
              var column = newlines ? read.length - read.lastIndexOf("\n") - 1 : lastColumn + read.length;
              return { line, column };
            }
          };
          exports2.InputStream = InputStream;
        },
        {}
      ],
      4: [
        function(_dereq_, module2, exports2) {
          var SpecialElements = {
            "http://www.w3.org/1999/xhtml": [
              "address",
              "applet",
              "area",
              "article",
              "aside",
              "base",
              "basefont",
              "bgsound",
              "blockquote",
              "body",
              "br",
              "button",
              "caption",
              "center",
              "col",
              "colgroup",
              "dd",
              "details",
              "dir",
              "div",
              "dl",
              "dt",
              "embed",
              "fieldset",
              "figcaption",
              "figure",
              "footer",
              "form",
              "frame",
              "frameset",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "head",
              "header",
              "hgroup",
              "hr",
              "html",
              "iframe",
              "img",
              "input",
              "isindex",
              "li",
              "link",
              "listing",
              "main",
              "marquee",
              "menu",
              "menuitem",
              "meta",
              "nav",
              "noembed",
              "noframes",
              "noscript",
              "object",
              "ol",
              "p",
              "param",
              "plaintext",
              "pre",
              "script",
              "section",
              "select",
              "source",
              "style",
              "summary",
              "table",
              "tbody",
              "td",
              "textarea",
              "tfoot",
              "th",
              "thead",
              "title",
              "tr",
              "track",
              "ul",
              "wbr",
              "xmp"
            ],
            "http://www.w3.org/1998/Math/MathML": [
              "mi",
              "mo",
              "mn",
              "ms",
              "mtext",
              "annotation-xml"
            ],
            "http://www.w3.org/2000/svg": [
              "foreignObject",
              "desc",
              "title"
            ]
          };
          function StackItem(namespaceURI, localName, attributes, node) {
            this.localName = localName;
            this.namespaceURI = namespaceURI;
            this.attributes = attributes;
            this.node = node;
          }
          StackItem.prototype.isSpecial = function() {
            return this.namespaceURI in SpecialElements && SpecialElements[this.namespaceURI].indexOf(this.localName) > -1;
          };
          StackItem.prototype.isFosterParenting = function() {
            if (this.namespaceURI === "http://www.w3.org/1999/xhtml") {
              return this.localName === "table" || this.localName === "tbody" || this.localName === "tfoot" || this.localName === "thead" || this.localName === "tr";
            }
            return false;
          };
          StackItem.prototype.isNumberedHeader = function() {
            if (this.namespaceURI === "http://www.w3.org/1999/xhtml") {
              return this.localName === "h1" || this.localName === "h2" || this.localName === "h3" || this.localName === "h4" || this.localName === "h5" || this.localName === "h6";
            }
            return false;
          };
          StackItem.prototype.isForeign = function() {
            return this.namespaceURI != "http://www.w3.org/1999/xhtml";
          };
          function getAttribute(item, name) {
            for (var i = 0; i < item.attributes.length; i++) {
              if (item.attributes[i].nodeName == name)
                return item.attributes[i].nodeValue;
            }
            return null;
          }
          StackItem.prototype.isHtmlIntegrationPoint = function() {
            if (this.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
              if (this.localName !== "annotation-xml")
                return false;
              var encoding = getAttribute(this, "encoding");
              if (!encoding)
                return false;
              encoding = encoding.toLowerCase();
              return encoding === "text/html" || encoding === "application/xhtml+xml";
            }
            if (this.namespaceURI === "http://www.w3.org/2000/svg") {
              return this.localName === "foreignObject" || this.localName === "desc" || this.localName === "title";
            }
            return false;
          };
          StackItem.prototype.isMathMLTextIntegrationPoint = function() {
            if (this.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
              return this.localName === "mi" || this.localName === "mo" || this.localName === "mn" || this.localName === "ms" || this.localName === "mtext";
            }
            return false;
          };
          exports2.StackItem = StackItem;
        },
        {}
      ],
      5: [
        function(_dereq_, module2, exports2) {
          var InputStream = _dereq_("./InputStream").InputStream;
          var EntityParser = _dereq_("./EntityParser").EntityParser;
          function isWhitespace(c) {
            return c === " " || c === "\n" || c === "	" || c === "\r" || c === "\f";
          }
          function isAlpha(c) {
            return c >= "A" && c <= "Z" || c >= "a" && c <= "z";
          }
          function Tokenizer(tokenHandler) {
            this._tokenHandler = tokenHandler;
            this._state = Tokenizer.DATA;
            this._inputStream = new InputStream();
            this._currentToken = null;
            this._temporaryBuffer = "";
            this._additionalAllowedCharacter = "";
          }
          Tokenizer.prototype._parseError = function(code, args) {
            this._tokenHandler.parseError(code, args);
          };
          Tokenizer.prototype._emitToken = function(token) {
            if (token.type === "StartTag") {
              for (var i = 1; i < token.data.length; i++) {
                if (!token.data[i].nodeName)
                  token.data.splice(i--, 1);
              }
            } else if (token.type === "EndTag") {
              if (token.selfClosing) {
                this._parseError("self-closing-flag-on-end-tag");
              }
              if (token.data.length !== 0) {
                this._parseError("attributes-in-end-tag");
              }
            }
            this._tokenHandler.processToken(token);
            if (token.type === "StartTag" && token.selfClosing && !this._tokenHandler.isSelfClosingFlagAcknowledged()) {
              this._parseError("non-void-element-with-trailing-solidus", { name: token.name });
            }
          };
          Tokenizer.prototype._emitCurrentToken = function() {
            this._state = Tokenizer.DATA;
            this._emitToken(this._currentToken);
          };
          Tokenizer.prototype._currentAttribute = function() {
            return this._currentToken.data[this._currentToken.data.length - 1];
          };
          Tokenizer.prototype.setState = function(state) {
            this._state = state;
          };
          Tokenizer.prototype.tokenize = function(source) {
            Tokenizer.DATA = data_state;
            Tokenizer.RCDATA = rcdata_state;
            Tokenizer.RAWTEXT = rawtext_state;
            Tokenizer.SCRIPT_DATA = script_data_state;
            Tokenizer.PLAINTEXT = plaintext_state;
            this._state = Tokenizer.DATA;
            this._inputStream.append(source);
            this._tokenHandler.startTokenization(this);
            this._inputStream.eof = true;
            var tokenizer = this;
            while (this._state.call(this, this._inputStream)) ;
            function data_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._emitToken({ type: "EOF", data: null });
                return false;
              } else if (data === "&") {
                tokenizer.setState(character_reference_in_data_state);
              } else if (data === "<") {
                tokenizer.setState(tag_open_state);
              } else if (data === "\0") {
                tokenizer._emitToken({ type: "Characters", data });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("&|<|\0");
                tokenizer._emitToken({ type: "Characters", data: data + chars });
                buffer.commit();
              }
              return true;
            }
            function character_reference_in_data_state(buffer) {
              var character = EntityParser.consumeEntity(buffer, tokenizer);
              tokenizer.setState(data_state);
              tokenizer._emitToken({ type: "Characters", data: character || "&" });
              return true;
            }
            function rcdata_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._emitToken({ type: "EOF", data: null });
                return false;
              } else if (data === "&") {
                tokenizer.setState(character_reference_in_rcdata_state);
              } else if (data === "<") {
                tokenizer.setState(rcdata_less_than_sign_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("&|<|\0");
                tokenizer._emitToken({ type: "Characters", data: data + chars });
                buffer.commit();
              }
              return true;
            }
            function character_reference_in_rcdata_state(buffer) {
              var character = EntityParser.consumeEntity(buffer, tokenizer);
              tokenizer.setState(rcdata_state);
              tokenizer._emitToken({ type: "Characters", data: character || "&" });
              return true;
            }
            function rawtext_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._emitToken({ type: "EOF", data: null });
                return false;
              } else if (data === "<") {
                tokenizer.setState(rawtext_less_than_sign_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("<|\0");
                tokenizer._emitToken({ type: "Characters", data: data + chars });
              }
              return true;
            }
            function plaintext_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._emitToken({ type: "EOF", data: null });
                return false;
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("\0");
                tokenizer._emitToken({ type: "Characters", data: data + chars });
              }
              return true;
            }
            function script_data_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._emitToken({ type: "EOF", data: null });
                return false;
              } else if (data === "<") {
                tokenizer.setState(script_data_less_than_sign_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("<|\0");
                tokenizer._emitToken({ type: "Characters", data: data + chars });
              }
              return true;
            }
            function rcdata_less_than_sign_state(buffer) {
              var data = buffer.char();
              if (data === "/") {
                this._temporaryBuffer = "";
                tokenizer.setState(rcdata_end_tag_open_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data: "<" });
                buffer.unget(data);
                tokenizer.setState(rcdata_state);
              }
              return true;
            }
            function rcdata_end_tag_open_state(buffer) {
              var data = buffer.char();
              if (isAlpha(data)) {
                this._temporaryBuffer += data;
                tokenizer.setState(rcdata_end_tag_name_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data: "</" });
                buffer.unget(data);
                tokenizer.setState(rcdata_state);
              }
              return true;
            }
            function rcdata_end_tag_name_state(buffer) {
              var appropriate = tokenizer._currentToken && tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase();
              var data = buffer.char();
              if (isWhitespace(data) && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: this._temporaryBuffer, data: [], selfClosing: false };
                tokenizer.setState(before_attribute_name_state);
              } else if (data === "/" && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: this._temporaryBuffer, data: [], selfClosing: false };
                tokenizer.setState(self_closing_tag_state);
              } else if (data === ">" && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: this._temporaryBuffer, data: [], selfClosing: false };
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else if (isAlpha(data)) {
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                tokenizer._emitToken({ type: "Characters", data: "</" + this._temporaryBuffer });
                buffer.unget(data);
                tokenizer.setState(rcdata_state);
              }
              return true;
            }
            function rawtext_less_than_sign_state(buffer) {
              var data = buffer.char();
              if (data === "/") {
                this._temporaryBuffer = "";
                tokenizer.setState(rawtext_end_tag_open_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data: "<" });
                buffer.unget(data);
                tokenizer.setState(rawtext_state);
              }
              return true;
            }
            function rawtext_end_tag_open_state(buffer) {
              var data = buffer.char();
              if (isAlpha(data)) {
                this._temporaryBuffer += data;
                tokenizer.setState(rawtext_end_tag_name_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data: "</" });
                buffer.unget(data);
                tokenizer.setState(rawtext_state);
              }
              return true;
            }
            function rawtext_end_tag_name_state(buffer) {
              var appropriate = tokenizer._currentToken && tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase();
              var data = buffer.char();
              if (isWhitespace(data) && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: this._temporaryBuffer, data: [], selfClosing: false };
                tokenizer.setState(before_attribute_name_state);
              } else if (data === "/" && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: this._temporaryBuffer, data: [], selfClosing: false };
                tokenizer.setState(self_closing_tag_state);
              } else if (data === ">" && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: this._temporaryBuffer, data: [], selfClosing: false };
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else if (isAlpha(data)) {
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                tokenizer._emitToken({ type: "Characters", data: "</" + this._temporaryBuffer });
                buffer.unget(data);
                tokenizer.setState(rawtext_state);
              }
              return true;
            }
            function script_data_less_than_sign_state(buffer) {
              var data = buffer.char();
              if (data === "/") {
                this._temporaryBuffer = "";
                tokenizer.setState(script_data_end_tag_open_state);
              } else if (data === "!") {
                tokenizer._emitToken({ type: "Characters", data: "<!" });
                tokenizer.setState(script_data_escape_start_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data: "<" });
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_end_tag_open_state(buffer) {
              var data = buffer.char();
              if (isAlpha(data)) {
                this._temporaryBuffer += data;
                tokenizer.setState(script_data_end_tag_name_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data: "</" });
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_end_tag_name_state(buffer) {
              var appropriate = tokenizer._currentToken && tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase();
              var data = buffer.char();
              if (isWhitespace(data) && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: "script", data: [], selfClosing: false };
                tokenizer.setState(before_attribute_name_state);
              } else if (data === "/" && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: "script", data: [], selfClosing: false };
                tokenizer.setState(self_closing_tag_state);
              } else if (data === ">" && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: "script", data: [], selfClosing: false };
                tokenizer._emitCurrentToken();
              } else if (isAlpha(data)) {
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                tokenizer._emitToken({ type: "Characters", data: "</" + this._temporaryBuffer });
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_escape_start_state(buffer) {
              var data = buffer.char();
              if (data === "-") {
                tokenizer._emitToken({ type: "Characters", data: "-" });
                tokenizer.setState(script_data_escape_start_dash_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_escape_start_dash_state(buffer) {
              var data = buffer.char();
              if (data === "-") {
                tokenizer._emitToken({ type: "Characters", data: "-" });
                tokenizer.setState(script_data_escaped_dash_dash_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_escaped_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer._emitToken({ type: "Characters", data: "-" });
                tokenizer.setState(script_data_escaped_dash_state);
              } else if (data === "<") {
                tokenizer.setState(script_data_escaped_less_then_sign_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("<|-|\0");
                tokenizer._emitToken({ type: "Characters", data: data + chars });
              }
              return true;
            }
            function script_data_escaped_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer._emitToken({ type: "Characters", data: "-" });
                tokenizer.setState(script_data_escaped_dash_dash_state);
              } else if (data === "<") {
                tokenizer.setState(script_data_escaped_less_then_sign_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                tokenizer.setState(script_data_escaped_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data });
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_escaped_dash_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-script");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "<") {
                tokenizer.setState(script_data_escaped_less_then_sign_state);
              } else if (data === ">") {
                tokenizer._emitToken({ type: "Characters", data: ">" });
                tokenizer.setState(script_data_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                tokenizer.setState(script_data_escaped_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data });
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_escaped_less_then_sign_state(buffer) {
              var data = buffer.char();
              if (data === "/") {
                this._temporaryBuffer = "";
                tokenizer.setState(script_data_escaped_end_tag_open_state);
              } else if (isAlpha(data)) {
                tokenizer._emitToken({ type: "Characters", data: "<" + data });
                this._temporaryBuffer = data;
                tokenizer.setState(script_data_double_escape_start_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data: "<" });
                buffer.unget(data);
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_escaped_end_tag_open_state(buffer) {
              var data = buffer.char();
              if (isAlpha(data)) {
                this._temporaryBuffer = data;
                tokenizer.setState(script_data_escaped_end_tag_name_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data: "</" });
                buffer.unget(data);
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_escaped_end_tag_name_state(buffer) {
              var appropriate = tokenizer._currentToken && tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase();
              var data = buffer.char();
              if (isWhitespace(data) && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: "script", data: [], selfClosing: false };
                tokenizer.setState(before_attribute_name_state);
              } else if (data === "/" && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: "script", data: [], selfClosing: false };
                tokenizer.setState(self_closing_tag_state);
              } else if (data === ">" && appropriate) {
                tokenizer._currentToken = { type: "EndTag", name: "script", data: [], selfClosing: false };
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isAlpha(data)) {
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                tokenizer._emitToken({ type: "Characters", data: "</" + this._temporaryBuffer });
                buffer.unget(data);
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_double_escape_start_state(buffer) {
              var data = buffer.char();
              if (isWhitespace(data) || data === "/" || data === ">") {
                tokenizer._emitToken({ type: "Characters", data });
                if (this._temporaryBuffer.toLowerCase() === "script")
                  tokenizer.setState(script_data_double_escaped_state);
                else
                  tokenizer.setState(script_data_escaped_state);
              } else if (isAlpha(data)) {
                tokenizer._emitToken({ type: "Characters", data });
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_double_escaped_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-script");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer._emitToken({ type: "Characters", data: "-" });
                tokenizer.setState(script_data_double_escaped_dash_state);
              } else if (data === "<") {
                tokenizer._emitToken({ type: "Characters", data: "<" });
                tokenizer.setState(script_data_double_escaped_less_than_sign_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                buffer.commit();
              } else {
                tokenizer._emitToken({ type: "Characters", data });
                buffer.commit();
              }
              return true;
            }
            function script_data_double_escaped_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-script");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer._emitToken({ type: "Characters", data: "-" });
                tokenizer.setState(script_data_double_escaped_dash_dash_state);
              } else if (data === "<") {
                tokenizer._emitToken({ type: "Characters", data: "<" });
                tokenizer.setState(script_data_double_escaped_less_than_sign_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                tokenizer.setState(script_data_double_escaped_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data });
                tokenizer.setState(script_data_double_escaped_state);
              }
              return true;
            }
            function script_data_double_escaped_dash_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-script");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer._emitToken({ type: "Characters", data: "-" });
                buffer.commit();
              } else if (data === "<") {
                tokenizer._emitToken({ type: "Characters", data: "<" });
                tokenizer.setState(script_data_double_escaped_less_than_sign_state);
              } else if (data === ">") {
                tokenizer._emitToken({ type: "Characters", data: ">" });
                tokenizer.setState(script_data_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({ type: "Characters", data: "�" });
                tokenizer.setState(script_data_double_escaped_state);
              } else {
                tokenizer._emitToken({ type: "Characters", data });
                tokenizer.setState(script_data_double_escaped_state);
              }
              return true;
            }
            function script_data_double_escaped_less_than_sign_state(buffer) {
              var data = buffer.char();
              if (data === "/") {
                tokenizer._emitToken({ type: "Characters", data: "/" });
                this._temporaryBuffer = "";
                tokenizer.setState(script_data_double_escape_end_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_double_escaped_state);
              }
              return true;
            }
            function script_data_double_escape_end_state(buffer) {
              var data = buffer.char();
              if (isWhitespace(data) || data === "/" || data === ">") {
                tokenizer._emitToken({ type: "Characters", data });
                if (this._temporaryBuffer.toLowerCase() === "script")
                  tokenizer.setState(script_data_escaped_state);
                else
                  tokenizer.setState(script_data_double_escaped_state);
              } else if (isAlpha(data)) {
                tokenizer._emitToken({ type: "Characters", data });
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_double_escaped_state);
              }
              return true;
            }
            function tag_open_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("bare-less-than-sign-at-eof");
                tokenizer._emitToken({ type: "Characters", data: "<" });
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isAlpha(data)) {
                tokenizer._currentToken = { type: "StartTag", name: data.toLowerCase(), data: [] };
                tokenizer.setState(tag_name_state);
              } else if (data === "!") {
                tokenizer.setState(markup_declaration_open_state);
              } else if (data === "/") {
                tokenizer.setState(close_tag_open_state);
              } else if (data === ">") {
                tokenizer._parseError("expected-tag-name-but-got-right-bracket");
                tokenizer._emitToken({ type: "Characters", data: "<>" });
                tokenizer.setState(data_state);
              } else if (data === "?") {
                tokenizer._parseError("expected-tag-name-but-got-question-mark");
                buffer.unget(data);
                tokenizer.setState(bogus_comment_state);
              } else {
                tokenizer._parseError("expected-tag-name");
                tokenizer._emitToken({ type: "Characters", data: "<" });
                buffer.unget(data);
                tokenizer.setState(data_state);
              }
              return true;
            }
            function close_tag_open_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("expected-closing-tag-but-got-eof");
                tokenizer._emitToken({ type: "Characters", data: "</" });
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isAlpha(data)) {
                tokenizer._currentToken = { type: "EndTag", name: data.toLowerCase(), data: [] };
                tokenizer.setState(tag_name_state);
              } else if (data === ">") {
                tokenizer._parseError("expected-closing-tag-but-got-right-bracket");
                tokenizer.setState(data_state);
              } else {
                tokenizer._parseError("expected-closing-tag-but-got-char", { data });
                buffer.unget(data);
                tokenizer.setState(bogus_comment_state);
              }
              return true;
            }
            function tag_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-tag-name");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) {
                tokenizer.setState(before_attribute_name_state);
              } else if (isAlpha(data)) {
                tokenizer._currentToken.name += data.toLowerCase();
              } else if (data === ">") {
                tokenizer._emitCurrentToken();
              } else if (data === "/") {
                tokenizer.setState(self_closing_tag_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.name += "�";
              } else {
                tokenizer._currentToken.name += data;
              }
              buffer.commit();
              return true;
            }
            function before_attribute_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("expected-attribute-name-but-got-eof");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) {
                return true;
              } else if (isAlpha(data)) {
                tokenizer._currentToken.data.push({ nodeName: data.toLowerCase(), nodeValue: "" });
                tokenizer.setState(attribute_name_state);
              } else if (data === ">") {
                tokenizer._emitCurrentToken();
              } else if (data === "/") {
                tokenizer.setState(self_closing_tag_state);
              } else if (data === "'" || data === '"' || data === "=" || data === "<") {
                tokenizer._parseError("invalid-character-in-attribute-name");
                tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                tokenizer.setState(attribute_name_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data.push({ nodeName: "�", nodeValue: "" });
              } else {
                tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                tokenizer.setState(attribute_name_state);
              }
              return true;
            }
            function attribute_name_state(buffer) {
              var data = buffer.char();
              var leavingThisState = true;
              var shouldEmit = false;
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-attribute-name");
                buffer.unget(data);
                tokenizer.setState(data_state);
                shouldEmit = true;
              } else if (data === "=") {
                tokenizer.setState(before_attribute_value_state);
              } else if (isAlpha(data)) {
                tokenizer._currentAttribute().nodeName += data.toLowerCase();
                leavingThisState = false;
              } else if (data === ">") {
                shouldEmit = true;
              } else if (isWhitespace(data)) {
                tokenizer.setState(after_attribute_name_state);
              } else if (data === "/") {
                tokenizer.setState(self_closing_tag_state);
              } else if (data === "'" || data === '"') {
                tokenizer._parseError("invalid-character-in-attribute-name");
                tokenizer._currentAttribute().nodeName += data;
                leavingThisState = false;
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeName += "�";
              } else {
                tokenizer._currentAttribute().nodeName += data;
                leavingThisState = false;
              }
              if (leavingThisState) {
                var attributes = tokenizer._currentToken.data;
                var currentAttribute = attributes[attributes.length - 1];
                for (var i = attributes.length - 2; i >= 0; i--) {
                  if (currentAttribute.nodeName === attributes[i].nodeName) {
                    tokenizer._parseError("duplicate-attribute", { name: currentAttribute.nodeName });
                    currentAttribute.nodeName = null;
                    break;
                  }
                }
                if (shouldEmit)
                  tokenizer._emitCurrentToken();
              } else {
                buffer.commit();
              }
              return true;
            }
            function after_attribute_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("expected-end-of-tag-but-got-eof");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) {
                return true;
              } else if (data === "=") {
                tokenizer.setState(before_attribute_value_state);
              } else if (data === ">") {
                tokenizer._emitCurrentToken();
              } else if (isAlpha(data)) {
                tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                tokenizer.setState(attribute_name_state);
              } else if (data === "/") {
                tokenizer.setState(self_closing_tag_state);
              } else if (data === "'" || data === '"' || data === "<") {
                tokenizer._parseError("invalid-character-after-attribute-name");
                tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                tokenizer.setState(attribute_name_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data.push({ nodeName: "�", nodeValue: "" });
              } else {
                tokenizer._currentToken.data.push({ nodeName: data, nodeValue: "" });
                tokenizer.setState(attribute_name_state);
              }
              return true;
            }
            function before_attribute_value_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("expected-attribute-value-but-got-eof");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) {
                return true;
              } else if (data === '"') {
                tokenizer.setState(attribute_value_double_quoted_state);
              } else if (data === "&") {
                tokenizer.setState(attribute_value_unquoted_state);
                buffer.unget(data);
              } else if (data === "'") {
                tokenizer.setState(attribute_value_single_quoted_state);
              } else if (data === ">") {
                tokenizer._parseError("expected-attribute-value-but-got-right-bracket");
                tokenizer._emitCurrentToken();
              } else if (data === "=" || data === "<" || data === "`") {
                tokenizer._parseError("unexpected-character-in-unquoted-attribute-value");
                tokenizer._currentAttribute().nodeValue += data;
                tokenizer.setState(attribute_value_unquoted_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeValue += "�";
              } else {
                tokenizer._currentAttribute().nodeValue += data;
                tokenizer.setState(attribute_value_unquoted_state);
              }
              return true;
            }
            function attribute_value_double_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-attribute-value-double-quote");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '"') {
                tokenizer.setState(after_attribute_value_state);
              } else if (data === "&") {
                this._additionalAllowedCharacter = '"';
                tokenizer.setState(character_reference_in_attribute_value_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeValue += "�";
              } else {
                var s = buffer.matchUntil('[\0"&]');
                data = data + s;
                tokenizer._currentAttribute().nodeValue += data;
              }
              return true;
            }
            function attribute_value_single_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-attribute-value-single-quote");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "'") {
                tokenizer.setState(after_attribute_value_state);
              } else if (data === "&") {
                this._additionalAllowedCharacter = "'";
                tokenizer.setState(character_reference_in_attribute_value_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeValue += "�";
              } else {
                tokenizer._currentAttribute().nodeValue += data + buffer.matchUntil("\0|['&]");
              }
              return true;
            }
            function attribute_value_unquoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-after-attribute-value");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) {
                tokenizer.setState(before_attribute_name_state);
              } else if (data === "&") {
                this._additionalAllowedCharacter = ">";
                tokenizer.setState(character_reference_in_attribute_value_state);
              } else if (data === ">") {
                tokenizer._emitCurrentToken();
              } else if (data === '"' || data === "'" || data === "=" || data === "`" || data === "<") {
                tokenizer._parseError("unexpected-character-in-unquoted-attribute-value");
                tokenizer._currentAttribute().nodeValue += data;
                buffer.commit();
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeValue += "�";
              } else {
                var o = buffer.matchUntil("\0|[	\n\v\f \r&<>\"'=`]");
                if (o === InputStream.EOF) {
                  tokenizer._parseError("eof-in-attribute-value-no-quotes");
                  tokenizer._emitCurrentToken();
                }
                buffer.commit();
                tokenizer._currentAttribute().nodeValue += data + o;
              }
              return true;
            }
            function character_reference_in_attribute_value_state(buffer) {
              var character = EntityParser.consumeEntity(buffer, tokenizer, this._additionalAllowedCharacter);
              this._currentAttribute().nodeValue += character || "&";
              if (this._additionalAllowedCharacter === '"')
                tokenizer.setState(attribute_value_double_quoted_state);
              else if (this._additionalAllowedCharacter === "'")
                tokenizer.setState(attribute_value_single_quoted_state);
              else if (this._additionalAllowedCharacter === ">")
                tokenizer.setState(attribute_value_unquoted_state);
              return true;
            }
            function after_attribute_value_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-after-attribute-value");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) {
                tokenizer.setState(before_attribute_name_state);
              } else if (data === ">") {
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (data === "/") {
                tokenizer.setState(self_closing_tag_state);
              } else {
                tokenizer._parseError("unexpected-character-after-attribute-value");
                buffer.unget(data);
                tokenizer.setState(before_attribute_name_state);
              }
              return true;
            }
            function self_closing_tag_state(buffer) {
              var c = buffer.char();
              if (c === InputStream.EOF) {
                tokenizer._parseError("unexpected-eof-after-solidus-in-tag");
                buffer.unget(c);
                tokenizer.setState(data_state);
              } else if (c === ">") {
                tokenizer._currentToken.selfClosing = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                tokenizer._parseError("unexpected-character-after-solidus-in-tag");
                buffer.unget(c);
                tokenizer.setState(before_attribute_name_state);
              }
              return true;
            }
            function bogus_comment_state(buffer) {
              var data = buffer.matchUntil(">");
              data = data.replace(/\u0000/g, "�");
              buffer.char();
              tokenizer._emitToken({ type: "Comment", data });
              tokenizer.setState(data_state);
              return true;
            }
            function markup_declaration_open_state(buffer) {
              var chars = buffer.shift(2);
              if (chars === "--") {
                tokenizer._currentToken = { type: "Comment", data: "" };
                tokenizer.setState(comment_start_state);
              } else {
                var newchars = buffer.shift(5);
                if (newchars === InputStream.EOF || chars === InputStream.EOF) {
                  tokenizer._parseError("expected-dashes-or-doctype");
                  tokenizer.setState(bogus_comment_state);
                  buffer.unget(chars);
                  return true;
                }
                chars += newchars;
                if (chars.toUpperCase() === "DOCTYPE") {
                  tokenizer._currentToken = { type: "Doctype", name: "", publicId: null, systemId: null, forceQuirks: false };
                  tokenizer.setState(doctype_state);
                } else if (tokenizer._tokenHandler.isCdataSectionAllowed() && chars === "[CDATA[") {
                  tokenizer.setState(cdata_section_state);
                } else {
                  tokenizer._parseError("expected-dashes-or-doctype");
                  buffer.unget(chars);
                  tokenizer.setState(bogus_comment_state);
                }
              }
              return true;
            }
            function cdata_section_state(buffer) {
              var data = buffer.matchUntil("]]>");
              buffer.shift(3);
              if (data) {
                tokenizer._emitToken({ type: "Characters", data });
              }
              tokenizer.setState(data_state);
              return true;
            }
            function comment_start_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer.setState(comment_start_dash_state);
              } else if (data === ">") {
                tokenizer._parseError("incorrect-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                tokenizer.setState(data_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "�";
              } else {
                tokenizer._currentToken.data += data;
                tokenizer.setState(comment_state);
              }
              return true;
            }
            function comment_start_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer.setState(comment_end_state);
              } else if (data === ">") {
                tokenizer._parseError("incorrect-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                tokenizer.setState(data_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "�";
              } else {
                tokenizer._currentToken.data += "-" + data;
                tokenizer.setState(comment_state);
              }
              return true;
            }
            function comment_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer.setState(comment_end_dash_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "�";
              } else {
                tokenizer._currentToken.data += data;
                buffer.commit();
              }
              return true;
            }
            function comment_end_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-comment-end-dash");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer.setState(comment_end_state);
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "-�";
                tokenizer.setState(comment_state);
              } else {
                tokenizer._currentToken.data += "-" + data + buffer.matchUntil("\0|-");
                buffer.char();
              }
              return true;
            }
            function comment_end_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-comment-double-dash");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === ">") {
                tokenizer._emitToken(tokenizer._currentToken);
                tokenizer.setState(data_state);
              } else if (data === "!") {
                tokenizer._parseError("unexpected-bang-after-double-dash-in-comment");
                tokenizer.setState(comment_end_bang_state);
              } else if (data === "-") {
                tokenizer._parseError("unexpected-dash-after-double-dash-in-comment");
                tokenizer._currentToken.data += data;
              } else if (data === "\0") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "--�";
                tokenizer.setState(comment_state);
              } else {
                tokenizer._parseError("unexpected-char-in-comment");
                tokenizer._currentToken.data += "--" + data;
                tokenizer.setState(comment_state);
              }
              return true;
            }
            function comment_end_bang_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-comment-end-bang-state");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === ">") {
                tokenizer._emitToken(tokenizer._currentToken);
                tokenizer.setState(data_state);
              } else if (data === "-") {
                tokenizer._currentToken.data += "--!";
                tokenizer.setState(comment_end_dash_state);
              } else {
                tokenizer._currentToken.data += "--!" + data;
                tokenizer.setState(comment_state);
              }
              return true;
            }
            function doctype_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("expected-doctype-name-but-got-eof");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace(data)) {
                tokenizer.setState(before_doctype_name_state);
              } else {
                tokenizer._parseError("need-space-after-doctype");
                buffer.unget(data);
                tokenizer.setState(before_doctype_name_state);
              }
              return true;
            }
            function before_doctype_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("expected-doctype-name-but-got-eof");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace(data)) ;
              else if (data === ">") {
                tokenizer._parseError("expected-doctype-name-but-got-right-bracket");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                if (isAlpha(data))
                  data = data.toLowerCase();
                tokenizer._currentToken.name = data;
                tokenizer.setState(doctype_name_state);
              }
              return true;
            }
            function doctype_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer._parseError("eof-in-doctype-name");
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace(data)) {
                tokenizer.setState(after_doctype_name_state);
              } else if (data === ">") {
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                if (isAlpha(data))
                  data = data.toLowerCase();
                tokenizer._currentToken.name += data;
                buffer.commit();
              }
              return true;
            }
            function after_doctype_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer._parseError("eof-in-doctype");
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace(data)) ;
              else if (data === ">") {
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                if (["p", "P"].indexOf(data) > -1) {
                  var expected = [["u", "U"], ["b", "B"], ["l", "L"], ["i", "I"], ["c", "C"]];
                  var matched = expected.every(function(expected2) {
                    data = buffer.char();
                    return expected2.indexOf(data) > -1;
                  });
                  if (matched) {
                    tokenizer.setState(after_doctype_public_keyword_state);
                    return true;
                  }
                } else if (["s", "S"].indexOf(data) > -1) {
                  var expected = [["y", "Y"], ["s", "S"], ["t", "T"], ["e", "E"], ["m", "M"]];
                  var matched = expected.every(function(expected2) {
                    data = buffer.char();
                    return expected2.indexOf(data) > -1;
                  });
                  if (matched) {
                    tokenizer.setState(after_doctype_system_keyword_state);
                    return true;
                  }
                }
                buffer.unget(data);
                tokenizer._currentToken.forceQuirks = true;
                if (data === InputStream.EOF) {
                  tokenizer._parseError("eof-in-doctype");
                  buffer.unget(data);
                  tokenizer.setState(data_state);
                  tokenizer._emitCurrentToken();
                } else {
                  tokenizer._parseError("expected-space-or-right-bracket-in-doctype", { data });
                  tokenizer.setState(bogus_doctype_state);
                }
              }
              return true;
            }
            function after_doctype_public_keyword_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace(data)) {
                tokenizer.setState(before_doctype_public_identifier_state);
              } else if (data === "'" || data === '"') {
                tokenizer._parseError("unexpected-char-in-doctype");
                buffer.unget(data);
                tokenizer.setState(before_doctype_public_identifier_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(before_doctype_public_identifier_state);
              }
              return true;
            }
            function before_doctype_public_identifier_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace(data)) ;
              else if (data === '"') {
                tokenizer._currentToken.publicId = "";
                tokenizer.setState(doctype_public_identifier_double_quoted_state);
              } else if (data === "'") {
                tokenizer._currentToken.publicId = "";
                tokenizer.setState(doctype_public_identifier_single_quoted_state);
              } else if (data === ">") {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function doctype_public_identifier_double_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (data === '"') {
                tokenizer.setState(after_doctype_public_identifier_state);
              } else if (data === ">") {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                tokenizer._currentToken.publicId += data;
              }
              return true;
            }
            function doctype_public_identifier_single_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (data === "'") {
                tokenizer.setState(after_doctype_public_identifier_state);
              } else if (data === ">") {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                tokenizer._currentToken.publicId += data;
              }
              return true;
            }
            function after_doctype_public_identifier_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) {
                tokenizer.setState(between_doctype_public_and_system_identifiers_state);
              } else if (data === ">") {
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (data === '"') {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.systemId = "";
                tokenizer.setState(doctype_system_identifier_double_quoted_state);
              } else if (data === "'") {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.systemId = "";
                tokenizer.setState(doctype_system_identifier_single_quoted_state);
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function between_doctype_public_and_system_identifiers_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) ;
              else if (data === ">") {
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else if (data === '"') {
                tokenizer._currentToken.systemId = "";
                tokenizer.setState(doctype_system_identifier_double_quoted_state);
              } else if (data === "'") {
                tokenizer._currentToken.systemId = "";
                tokenizer.setState(doctype_system_identifier_single_quoted_state);
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function after_doctype_system_keyword_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) {
                tokenizer.setState(before_doctype_system_identifier_state);
              } else if (data === "'" || data === '"') {
                tokenizer._parseError("unexpected-char-in-doctype");
                buffer.unget(data);
                tokenizer.setState(before_doctype_system_identifier_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(before_doctype_system_identifier_state);
              }
              return true;
            }
            function before_doctype_system_identifier_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) ;
              else if (data === '"') {
                tokenizer._currentToken.systemId = "";
                tokenizer.setState(doctype_system_identifier_double_quoted_state);
              } else if (data === "'") {
                tokenizer._currentToken.systemId = "";
                tokenizer.setState(doctype_system_identifier_single_quoted_state);
              } else if (data === ">") {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function doctype_system_identifier_double_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '"') {
                tokenizer.setState(after_doctype_system_identifier_state);
              } else if (data === ">") {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else {
                tokenizer._currentToken.systemId += data;
              }
              return true;
            }
            function doctype_system_identifier_single_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "'") {
                tokenizer.setState(after_doctype_system_identifier_state);
              } else if (data === ">") {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else {
                tokenizer._currentToken.systemId += data;
              }
              return true;
            }
            function after_doctype_system_identifier_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace(data)) ;
              else if (data === ">") {
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function bogus_doctype_state(buffer) {
              var data = buffer.char();
              if (data === InputStream.EOF) {
                buffer.unget(data);
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else if (data === ">") {
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              }
              return true;
            }
          };
          Object.defineProperty(Tokenizer.prototype, "lineNumber", {
            get: function() {
              return this._inputStream.location().line;
            }
          });
          Object.defineProperty(Tokenizer.prototype, "columnNumber", {
            get: function() {
              return this._inputStream.location().column;
            }
          });
          exports2.Tokenizer = Tokenizer;
        },
        { "./EntityParser": 2, "./InputStream": 3 }
      ],
      6: [
        function(_dereq_, module2, exports2) {
          var assert = _dereq_("assert");
          var messages = _dereq_("./messages.json");
          var constants = _dereq_("./constants");
          _dereq_("events").EventEmitter;
          var Tokenizer = _dereq_("./Tokenizer").Tokenizer;
          var ElementStack = _dereq_("./ElementStack").ElementStack;
          var StackItem = _dereq_("./StackItem").StackItem;
          var Marker = {};
          function isWhitespace(ch) {
            return ch === " " || ch === "\n" || ch === "	" || ch === "\r" || ch === "\f";
          }
          function isWhitespaceOrReplacementCharacter(ch) {
            return isWhitespace(ch) || ch === "�";
          }
          function isAllWhitespace(characters) {
            for (var i = 0; i < characters.length; i++) {
              var ch = characters[i];
              if (!isWhitespace(ch))
                return false;
            }
            return true;
          }
          function isAllWhitespaceOrReplacementCharacters(characters) {
            for (var i = 0; i < characters.length; i++) {
              var ch = characters[i];
              if (!isWhitespaceOrReplacementCharacter(ch))
                return false;
            }
            return true;
          }
          function getAttribute(node, name) {
            for (var i = 0; i < node.attributes.length; i++) {
              var attribute = node.attributes[i];
              if (attribute.nodeName === name) {
                return attribute;
              }
            }
            return null;
          }
          function CharacterBuffer(characters) {
            this.characters = characters;
            this.current = 0;
            this.end = this.characters.length;
          }
          CharacterBuffer.prototype.skipAtMostOneLeadingNewline = function() {
            if (this.characters[this.current] === "\n")
              this.current++;
          };
          CharacterBuffer.prototype.skipLeadingWhitespace = function() {
            while (isWhitespace(this.characters[this.current])) {
              if (++this.current == this.end)
                return;
            }
          };
          CharacterBuffer.prototype.skipLeadingNonWhitespace = function() {
            while (!isWhitespace(this.characters[this.current])) {
              if (++this.current == this.end)
                return;
            }
          };
          CharacterBuffer.prototype.takeRemaining = function() {
            return this.characters.substring(this.current);
          };
          CharacterBuffer.prototype.takeLeadingWhitespace = function() {
            var start = this.current;
            this.skipLeadingWhitespace();
            if (start === this.current)
              return "";
            return this.characters.substring(start, this.current - start);
          };
          Object.defineProperty(CharacterBuffer.prototype, "length", {
            get: function() {
              return this.end - this.current;
            }
          });
          function TreeBuilder() {
            this.tokenizer = null;
            this.errorHandler = null;
            this.scriptingEnabled = false;
            this.document = null;
            this.head = null;
            this.form = null;
            this.openElements = new ElementStack();
            this.activeFormattingElements = [];
            this.insertionMode = null;
            this.insertionModeName = "";
            this.originalInsertionMode = "";
            this.inQuirksMode = false;
            this.compatMode = "no quirks";
            this.framesetOk = true;
            this.redirectAttachToFosterParent = false;
            this.selfClosingFlagAcknowledged = false;
            this.context = "";
            this.pendingTableCharacters = [];
            this.shouldSkipLeadingNewline = false;
            var tree = this;
            var modes = this.insertionModes = {};
            modes.base = {
              end_tag_handlers: { "-default": "endTagOther" },
              start_tag_handlers: { "-default": "startTagOther" },
              processEOF: function() {
                tree.generateImpliedEndTags();
                if (tree.openElements.length > 2) {
                  tree.parseError("expected-closing-tag-but-got-eof");
                } else if (tree.openElements.length == 2 && tree.openElements.item(1).localName != "body") {
                  tree.parseError("expected-closing-tag-but-got-eof");
                } else if (tree.context && tree.openElements.length > 1) ;
              },
              processComment: function(data) {
                tree.insertComment(data, tree.currentStackItem().node);
              },
              processDoctype: function(name, publicId, systemId, forceQuirks) {
                tree.parseError("unexpected-doctype");
              },
              processStartTag: function(name, attributes, selfClosing) {
                if (this[this.start_tag_handlers[name]]) {
                  this[this.start_tag_handlers[name]](name, attributes, selfClosing);
                } else if (this[this.start_tag_handlers["-default"]]) {
                  this[this.start_tag_handlers["-default"]](name, attributes, selfClosing);
                } else {
                  throw new Error("No handler found for " + name);
                }
              },
              processEndTag: function(name) {
                if (this[this.end_tag_handlers[name]]) {
                  this[this.end_tag_handlers[name]](name);
                } else if (this[this.end_tag_handlers["-default"]]) {
                  this[this.end_tag_handlers["-default"]](name);
                } else {
                  throw new Error("No handler found for " + name);
                }
              },
              startTagHtml: function(name, attributes) {
                modes.inBody.startTagHtml(name, attributes);
              }
            };
            modes.initial = Object.create(modes.base);
            modes.initial.processEOF = function() {
              tree.parseError("expected-doctype-but-got-eof");
              this.anythingElse();
              tree.insertionMode.processEOF();
            };
            modes.initial.processComment = function(data) {
              tree.insertComment(data, tree.document);
            };
            modes.initial.processDoctype = function(name, publicId, systemId, forceQuirks) {
              tree.insertDoctype(name || "", publicId || "", systemId || "");
              if (forceQuirks || name != "html" || publicId != null && ([
                "+//silmaril//dtd html pro v0r11 19970101//",
                "-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
                "-//as//dtd html 3.0 aswedit + extensions//",
                "-//ietf//dtd html 2.0 level 1//",
                "-//ietf//dtd html 2.0 level 2//",
                "-//ietf//dtd html 2.0 strict level 1//",
                "-//ietf//dtd html 2.0 strict level 2//",
                "-//ietf//dtd html 2.0 strict//",
                "-//ietf//dtd html 2.0//",
                "-//ietf//dtd html 2.1e//",
                "-//ietf//dtd html 3.0//",
                "-//ietf//dtd html 3.0//",
                "-//ietf//dtd html 3.2 final//",
                "-//ietf//dtd html 3.2//",
                "-//ietf//dtd html 3//",
                "-//ietf//dtd html level 0//",
                "-//ietf//dtd html level 0//",
                "-//ietf//dtd html level 1//",
                "-//ietf//dtd html level 1//",
                "-//ietf//dtd html level 2//",
                "-//ietf//dtd html level 2//",
                "-//ietf//dtd html level 3//",
                "-//ietf//dtd html level 3//",
                "-//ietf//dtd html strict level 0//",
                "-//ietf//dtd html strict level 0//",
                "-//ietf//dtd html strict level 1//",
                "-//ietf//dtd html strict level 1//",
                "-//ietf//dtd html strict level 2//",
                "-//ietf//dtd html strict level 2//",
                "-//ietf//dtd html strict level 3//",
                "-//ietf//dtd html strict level 3//",
                "-//ietf//dtd html strict//",
                "-//ietf//dtd html strict//",
                "-//ietf//dtd html strict//",
                "-//ietf//dtd html//",
                "-//ietf//dtd html//",
                "-//ietf//dtd html//",
                "-//metrius//dtd metrius presentational//",
                "-//microsoft//dtd internet explorer 2.0 html strict//",
                "-//microsoft//dtd internet explorer 2.0 html//",
                "-//microsoft//dtd internet explorer 2.0 tables//",
                "-//microsoft//dtd internet explorer 3.0 html strict//",
                "-//microsoft//dtd internet explorer 3.0 html//",
                "-//microsoft//dtd internet explorer 3.0 tables//",
                "-//netscape comm. corp.//dtd html//",
                "-//netscape comm. corp.//dtd strict html//",
                "-//o'reilly and associates//dtd html 2.0//",
                "-//o'reilly and associates//dtd html extended 1.0//",
                "-//spyglass//dtd html 2.0 extended//",
                "-//sq//dtd html 2.0 hotmetal + extensions//",
                "-//sun microsystems corp.//dtd hotjava html//",
                "-//sun microsystems corp.//dtd hotjava strict html//",
                "-//w3c//dtd html 3 1995-03-24//",
                "-//w3c//dtd html 3.2 draft//",
                "-//w3c//dtd html 3.2 final//",
                "-//w3c//dtd html 3.2//",
                "-//w3c//dtd html 3.2s draft//",
                "-//w3c//dtd html 4.0 frameset//",
                "-//w3c//dtd html 4.0 transitional//",
                "-//w3c//dtd html experimental 19960712//",
                "-//w3c//dtd html experimental 970421//",
                "-//w3c//dtd w3 html//",
                "-//w3o//dtd w3 html 3.0//",
                "-//webtechs//dtd mozilla html 2.0//",
                "-//webtechs//dtd mozilla html//",
                "html"
              ].some(publicIdStartsWith) || [
                "-//w3o//dtd w3 html strict 3.0//en//",
                "-/w3c/dtd html 4.0 transitional/en",
                "html"
              ].indexOf(publicId.toLowerCase()) > -1 || systemId == null && [
                "-//w3c//dtd html 4.01 transitional//",
                "-//w3c//dtd html 4.01 frameset//"
              ].some(publicIdStartsWith)) || systemId != null && systemId.toLowerCase() == "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd") {
                tree.compatMode = "quirks";
                tree.parseError("quirky-doctype");
              } else if (publicId != null && ([
                "-//w3c//dtd xhtml 1.0 transitional//",
                "-//w3c//dtd xhtml 1.0 frameset//"
              ].some(publicIdStartsWith) || systemId != null && [
                "-//w3c//dtd html 4.01 transitional//",
                "-//w3c//dtd html 4.01 frameset//"
              ].indexOf(publicId.toLowerCase()) > -1)) {
                tree.compatMode = "limited quirks";
                tree.parseError("almost-standards-doctype");
              } else {
                if (publicId == "-//W3C//DTD HTML 4.0//EN" && (systemId == null || systemId == "http://www.w3.org/TR/REC-html40/strict.dtd") || publicId == "-//W3C//DTD HTML 4.01//EN" && (systemId == null || systemId == "http://www.w3.org/TR/html4/strict.dtd") || publicId == "-//W3C//DTD XHTML 1.0 Strict//EN" && systemId == "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" || publicId == "-//W3C//DTD XHTML 1.1//EN" && systemId == "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd") ;
                else if (!((systemId == null || systemId == "about:legacy-compat") && publicId == null)) {
                  tree.parseError("unknown-doctype");
                }
              }
              tree.setInsertionMode("beforeHTML");
              function publicIdStartsWith(string) {
                return publicId.toLowerCase().indexOf(string) === 0;
              }
            };
            modes.initial.processCharacters = function(buffer) {
              buffer.skipLeadingWhitespace();
              if (!buffer.length)
                return;
              tree.parseError("expected-doctype-but-got-chars");
              this.anythingElse();
              tree.insertionMode.processCharacters(buffer);
            };
            modes.initial.processStartTag = function(name, attributes, selfClosing) {
              tree.parseError("expected-doctype-but-got-start-tag", { name });
              this.anythingElse();
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
            };
            modes.initial.processEndTag = function(name) {
              tree.parseError("expected-doctype-but-got-end-tag", { name });
              this.anythingElse();
              tree.insertionMode.processEndTag(name);
            };
            modes.initial.anythingElse = function() {
              tree.compatMode = "quirks";
              tree.setInsertionMode("beforeHTML");
            };
            modes.beforeHTML = Object.create(modes.base);
            modes.beforeHTML.start_tag_handlers = {
              html: "startTagHtml",
              "-default": "startTagOther"
            };
            modes.beforeHTML.processEOF = function() {
              this.anythingElse();
              tree.insertionMode.processEOF();
            };
            modes.beforeHTML.processComment = function(data) {
              tree.insertComment(data, tree.document);
            };
            modes.beforeHTML.processCharacters = function(buffer) {
              buffer.skipLeadingWhitespace();
              if (!buffer.length)
                return;
              this.anythingElse();
              tree.insertionMode.processCharacters(buffer);
            };
            modes.beforeHTML.startTagHtml = function(name, attributes, selfClosing) {
              tree.insertHtmlElement(attributes);
              tree.setInsertionMode("beforeHead");
            };
            modes.beforeHTML.startTagOther = function(name, attributes, selfClosing) {
              this.anythingElse();
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
            };
            modes.beforeHTML.processEndTag = function(name) {
              this.anythingElse();
              tree.insertionMode.processEndTag(name);
            };
            modes.beforeHTML.anythingElse = function() {
              tree.insertHtmlElement();
              tree.setInsertionMode("beforeHead");
            };
            modes.afterAfterBody = Object.create(modes.base);
            modes.afterAfterBody.start_tag_handlers = {
              html: "startTagHtml",
              "-default": "startTagOther"
            };
            modes.afterAfterBody.processComment = function(data) {
              tree.insertComment(data, tree.document);
            };
            modes.afterAfterBody.processDoctype = function(data) {
              modes.inBody.processDoctype(data);
            };
            modes.afterAfterBody.startTagHtml = function(data, attributes) {
              modes.inBody.startTagHtml(data, attributes);
            };
            modes.afterAfterBody.startTagOther = function(name, attributes, selfClosing) {
              tree.parseError("unexpected-start-tag", { name });
              tree.setInsertionMode("inBody");
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
            };
            modes.afterAfterBody.endTagOther = function(name) {
              tree.parseError("unexpected-end-tag", { name });
              tree.setInsertionMode("inBody");
              tree.insertionMode.processEndTag(name);
            };
            modes.afterAfterBody.processCharacters = function(data) {
              if (!isAllWhitespace(data.characters)) {
                tree.parseError("unexpected-char-after-body");
                tree.setInsertionMode("inBody");
                return tree.insertionMode.processCharacters(data);
              }
              modes.inBody.processCharacters(data);
            };
            modes.afterBody = Object.create(modes.base);
            modes.afterBody.end_tag_handlers = {
              html: "endTagHtml",
              "-default": "endTagOther"
            };
            modes.afterBody.processComment = function(data) {
              tree.insertComment(data, tree.openElements.rootNode);
            };
            modes.afterBody.processCharacters = function(data) {
              if (!isAllWhitespace(data.characters)) {
                tree.parseError("unexpected-char-after-body");
                tree.setInsertionMode("inBody");
                return tree.insertionMode.processCharacters(data);
              }
              modes.inBody.processCharacters(data);
            };
            modes.afterBody.processStartTag = function(name, attributes, selfClosing) {
              tree.parseError("unexpected-start-tag-after-body", { name });
              tree.setInsertionMode("inBody");
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
            };
            modes.afterBody.endTagHtml = function(name) {
              if (tree.context) {
                tree.parseError("end-html-in-innerhtml");
              } else {
                tree.setInsertionMode("afterAfterBody");
              }
            };
            modes.afterBody.endTagOther = function(name) {
              tree.parseError("unexpected-end-tag-after-body", { name });
              tree.setInsertionMode("inBody");
              tree.insertionMode.processEndTag(name);
            };
            modes.afterFrameset = Object.create(modes.base);
            modes.afterFrameset.start_tag_handlers = {
              html: "startTagHtml",
              noframes: "startTagNoframes",
              "-default": "startTagOther"
            };
            modes.afterFrameset.end_tag_handlers = {
              html: "endTagHtml",
              "-default": "endTagOther"
            };
            modes.afterFrameset.processCharacters = function(buffer) {
              var characters = buffer.takeRemaining();
              var whitespace = "";
              for (var i = 0; i < characters.length; i++) {
                var ch = characters[i];
                if (isWhitespace(ch))
                  whitespace += ch;
              }
              if (whitespace) {
                tree.insertText(whitespace);
              }
              if (whitespace.length < characters.length)
                tree.parseError("expected-eof-but-got-char");
            };
            modes.afterFrameset.startTagNoframes = function(name, attributes) {
              modes.inHead.processStartTag(name, attributes);
            };
            modes.afterFrameset.startTagOther = function(name, attributes) {
              tree.parseError("unexpected-start-tag-after-frameset", { name });
            };
            modes.afterFrameset.endTagHtml = function(name) {
              tree.setInsertionMode("afterAfterFrameset");
            };
            modes.afterFrameset.endTagOther = function(name) {
              tree.parseError("unexpected-end-tag-after-frameset", { name });
            };
            modes.beforeHead = Object.create(modes.base);
            modes.beforeHead.start_tag_handlers = {
              html: "startTagHtml",
              head: "startTagHead",
              "-default": "startTagOther"
            };
            modes.beforeHead.end_tag_handlers = {
              html: "endTagImplyHead",
              head: "endTagImplyHead",
              body: "endTagImplyHead",
              br: "endTagImplyHead",
              "-default": "endTagOther"
            };
            modes.beforeHead.processEOF = function() {
              this.startTagHead("head", []);
              tree.insertionMode.processEOF();
            };
            modes.beforeHead.processCharacters = function(buffer) {
              buffer.skipLeadingWhitespace();
              if (!buffer.length)
                return;
              this.startTagHead("head", []);
              tree.insertionMode.processCharacters(buffer);
            };
            modes.beforeHead.startTagHead = function(name, attributes) {
              tree.insertHeadElement(attributes);
              tree.setInsertionMode("inHead");
            };
            modes.beforeHead.startTagOther = function(name, attributes, selfClosing) {
              this.startTagHead("head", []);
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
            };
            modes.beforeHead.endTagImplyHead = function(name) {
              this.startTagHead("head", []);
              tree.insertionMode.processEndTag(name);
            };
            modes.beforeHead.endTagOther = function(name) {
              tree.parseError("end-tag-after-implied-root", { name });
            };
            modes.inHead = Object.create(modes.base);
            modes.inHead.start_tag_handlers = {
              html: "startTagHtml",
              head: "startTagHead",
              title: "startTagTitle",
              script: "startTagScript",
              style: "startTagNoFramesStyle",
              noscript: "startTagNoScript",
              noframes: "startTagNoFramesStyle",
              base: "startTagBaseBasefontBgsoundLink",
              basefont: "startTagBaseBasefontBgsoundLink",
              bgsound: "startTagBaseBasefontBgsoundLink",
              link: "startTagBaseBasefontBgsoundLink",
              meta: "startTagMeta",
              "-default": "startTagOther"
            };
            modes.inHead.end_tag_handlers = {
              head: "endTagHead",
              html: "endTagHtmlBodyBr",
              body: "endTagHtmlBodyBr",
              br: "endTagHtmlBodyBr",
              "-default": "endTagOther"
            };
            modes.inHead.processEOF = function() {
              var name = tree.currentStackItem().localName;
              if (["title", "style", "script"].indexOf(name) != -1) {
                tree.parseError("expected-named-closing-tag-but-got-eof", { name });
                tree.popElement();
              }
              this.anythingElse();
              tree.insertionMode.processEOF();
            };
            modes.inHead.processCharacters = function(buffer) {
              var leadingWhitespace = buffer.takeLeadingWhitespace();
              if (leadingWhitespace)
                tree.insertText(leadingWhitespace);
              if (!buffer.length)
                return;
              this.anythingElse();
              tree.insertionMode.processCharacters(buffer);
            };
            modes.inHead.startTagHtml = function(name, attributes) {
              modes.inBody.processStartTag(name, attributes);
            };
            modes.inHead.startTagHead = function(name, attributes) {
              tree.parseError("two-heads-are-not-better-than-one");
            };
            modes.inHead.startTagTitle = function(name, attributes) {
              tree.processGenericRCDATAStartTag(name, attributes);
            };
            modes.inHead.startTagNoScript = function(name, attributes) {
              if (tree.scriptingEnabled)
                return tree.processGenericRawTextStartTag(name, attributes);
              tree.insertElement(name, attributes);
              tree.setInsertionMode("inHeadNoscript");
            };
            modes.inHead.startTagNoFramesStyle = function(name, attributes) {
              tree.processGenericRawTextStartTag(name, attributes);
            };
            modes.inHead.startTagScript = function(name, attributes) {
              tree.insertElement(name, attributes);
              tree.tokenizer.setState(Tokenizer.SCRIPT_DATA);
              tree.originalInsertionMode = tree.insertionModeName;
              tree.setInsertionMode("text");
            };
            modes.inHead.startTagBaseBasefontBgsoundLink = function(name, attributes) {
              tree.insertSelfClosingElement(name, attributes);
            };
            modes.inHead.startTagMeta = function(name, attributes) {
              tree.insertSelfClosingElement(name, attributes);
            };
            modes.inHead.startTagOther = function(name, attributes, selfClosing) {
              this.anythingElse();
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
            };
            modes.inHead.endTagHead = function(name) {
              if (tree.openElements.item(tree.openElements.length - 1).localName == "head") {
                tree.openElements.pop();
              } else {
                tree.parseError("unexpected-end-tag", { name: "head" });
              }
              tree.setInsertionMode("afterHead");
            };
            modes.inHead.endTagHtmlBodyBr = function(name) {
              this.anythingElse();
              tree.insertionMode.processEndTag(name);
            };
            modes.inHead.endTagOther = function(name) {
              tree.parseError("unexpected-end-tag", { name });
            };
            modes.inHead.anythingElse = function() {
              this.endTagHead("head");
            };
            modes.afterHead = Object.create(modes.base);
            modes.afterHead.start_tag_handlers = {
              html: "startTagHtml",
              head: "startTagHead",
              body: "startTagBody",
              frameset: "startTagFrameset",
              base: "startTagFromHead",
              link: "startTagFromHead",
              meta: "startTagFromHead",
              script: "startTagFromHead",
              style: "startTagFromHead",
              title: "startTagFromHead",
              "-default": "startTagOther"
            };
            modes.afterHead.end_tag_handlers = {
              body: "endTagBodyHtmlBr",
              html: "endTagBodyHtmlBr",
              br: "endTagBodyHtmlBr",
              "-default": "endTagOther"
            };
            modes.afterHead.processEOF = function() {
              this.anythingElse();
              tree.insertionMode.processEOF();
            };
            modes.afterHead.processCharacters = function(buffer) {
              var leadingWhitespace = buffer.takeLeadingWhitespace();
              if (leadingWhitespace)
                tree.insertText(leadingWhitespace);
              if (!buffer.length)
                return;
              this.anythingElse();
              tree.insertionMode.processCharacters(buffer);
            };
            modes.afterHead.startTagHtml = function(name, attributes) {
              modes.inBody.processStartTag(name, attributes);
            };
            modes.afterHead.startTagBody = function(name, attributes) {
              tree.framesetOk = false;
              tree.insertBodyElement(attributes);
              tree.setInsertionMode("inBody");
            };
            modes.afterHead.startTagFrameset = function(name, attributes) {
              tree.insertElement(name, attributes);
              tree.setInsertionMode("inFrameset");
            };
            modes.afterHead.startTagFromHead = function(name, attributes, selfClosing) {
              tree.parseError("unexpected-start-tag-out-of-my-head", { name });
              tree.openElements.push(tree.head);
              modes.inHead.processStartTag(name, attributes, selfClosing);
              tree.openElements.remove(tree.head);
            };
            modes.afterHead.startTagHead = function(name, attributes, selfClosing) {
              tree.parseError("unexpected-start-tag", { name });
            };
            modes.afterHead.startTagOther = function(name, attributes, selfClosing) {
              this.anythingElse();
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
            };
            modes.afterHead.endTagBodyHtmlBr = function(name) {
              this.anythingElse();
              tree.insertionMode.processEndTag(name);
            };
            modes.afterHead.endTagOther = function(name) {
              tree.parseError("unexpected-end-tag", { name });
            };
            modes.afterHead.anythingElse = function() {
              tree.insertBodyElement([]);
              tree.setInsertionMode("inBody");
              tree.framesetOk = true;
            };
            modes.inBody = Object.create(modes.base);
            modes.inBody.start_tag_handlers = {
              html: "startTagHtml",
              head: "startTagMisplaced",
              base: "startTagProcessInHead",
              basefont: "startTagProcessInHead",
              bgsound: "startTagProcessInHead",
              link: "startTagProcessInHead",
              meta: "startTagProcessInHead",
              noframes: "startTagProcessInHead",
              script: "startTagProcessInHead",
              style: "startTagProcessInHead",
              title: "startTagProcessInHead",
              body: "startTagBody",
              form: "startTagForm",
              plaintext: "startTagPlaintext",
              a: "startTagA",
              button: "startTagButton",
              xmp: "startTagXmp",
              table: "startTagTable",
              hr: "startTagHr",
              image: "startTagImage",
              input: "startTagInput",
              textarea: "startTagTextarea",
              select: "startTagSelect",
              isindex: "startTagIsindex",
              applet: "startTagAppletMarqueeObject",
              marquee: "startTagAppletMarqueeObject",
              object: "startTagAppletMarqueeObject",
              li: "startTagListItem",
              dd: "startTagListItem",
              dt: "startTagListItem",
              address: "startTagCloseP",
              article: "startTagCloseP",
              aside: "startTagCloseP",
              blockquote: "startTagCloseP",
              center: "startTagCloseP",
              details: "startTagCloseP",
              dir: "startTagCloseP",
              div: "startTagCloseP",
              dl: "startTagCloseP",
              fieldset: "startTagCloseP",
              figcaption: "startTagCloseP",
              figure: "startTagCloseP",
              footer: "startTagCloseP",
              header: "startTagCloseP",
              hgroup: "startTagCloseP",
              main: "startTagCloseP",
              menu: "startTagCloseP",
              nav: "startTagCloseP",
              ol: "startTagCloseP",
              p: "startTagCloseP",
              section: "startTagCloseP",
              summary: "startTagCloseP",
              ul: "startTagCloseP",
              listing: "startTagPreListing",
              pre: "startTagPreListing",
              b: "startTagFormatting",
              big: "startTagFormatting",
              code: "startTagFormatting",
              em: "startTagFormatting",
              font: "startTagFormatting",
              i: "startTagFormatting",
              s: "startTagFormatting",
              small: "startTagFormatting",
              strike: "startTagFormatting",
              strong: "startTagFormatting",
              tt: "startTagFormatting",
              u: "startTagFormatting",
              nobr: "startTagNobr",
              area: "startTagVoidFormatting",
              br: "startTagVoidFormatting",
              embed: "startTagVoidFormatting",
              img: "startTagVoidFormatting",
              keygen: "startTagVoidFormatting",
              wbr: "startTagVoidFormatting",
              param: "startTagParamSourceTrack",
              source: "startTagParamSourceTrack",
              track: "startTagParamSourceTrack",
              iframe: "startTagIFrame",
              noembed: "startTagRawText",
              noscript: "startTagRawText",
              h1: "startTagHeading",
              h2: "startTagHeading",
              h3: "startTagHeading",
              h4: "startTagHeading",
              h5: "startTagHeading",
              h6: "startTagHeading",
              caption: "startTagMisplaced",
              col: "startTagMisplaced",
              colgroup: "startTagMisplaced",
              frame: "startTagMisplaced",
              frameset: "startTagFrameset",
              tbody: "startTagMisplaced",
              td: "startTagMisplaced",
              tfoot: "startTagMisplaced",
              th: "startTagMisplaced",
              thead: "startTagMisplaced",
              tr: "startTagMisplaced",
              option: "startTagOptionOptgroup",
              optgroup: "startTagOptionOptgroup",
              math: "startTagMath",
              svg: "startTagSVG",
              rt: "startTagRpRt",
              rp: "startTagRpRt",
              "-default": "startTagOther"
            };
            modes.inBody.end_tag_handlers = {
              p: "endTagP",
              body: "endTagBody",
              html: "endTagHtml",
              address: "endTagBlock",
              article: "endTagBlock",
              aside: "endTagBlock",
              blockquote: "endTagBlock",
              button: "endTagBlock",
              center: "endTagBlock",
              details: "endTagBlock",
              dir: "endTagBlock",
              div: "endTagBlock",
              dl: "endTagBlock",
              fieldset: "endTagBlock",
              figcaption: "endTagBlock",
              figure: "endTagBlock",
              footer: "endTagBlock",
              header: "endTagBlock",
              hgroup: "endTagBlock",
              listing: "endTagBlock",
              main: "endTagBlock",
              menu: "endTagBlock",
              nav: "endTagBlock",
              ol: "endTagBlock",
              pre: "endTagBlock",
              section: "endTagBlock",
              summary: "endTagBlock",
              ul: "endTagBlock",
              form: "endTagForm",
              applet: "endTagAppletMarqueeObject",
              marquee: "endTagAppletMarqueeObject",
              object: "endTagAppletMarqueeObject",
              dd: "endTagListItem",
              dt: "endTagListItem",
              li: "endTagListItem",
              h1: "endTagHeading",
              h2: "endTagHeading",
              h3: "endTagHeading",
              h4: "endTagHeading",
              h5: "endTagHeading",
              h6: "endTagHeading",
              a: "endTagFormatting",
              b: "endTagFormatting",
              big: "endTagFormatting",
              code: "endTagFormatting",
              em: "endTagFormatting",
              font: "endTagFormatting",
              i: "endTagFormatting",
              nobr: "endTagFormatting",
              s: "endTagFormatting",
              small: "endTagFormatting",
              strike: "endTagFormatting",
              strong: "endTagFormatting",
              tt: "endTagFormatting",
              u: "endTagFormatting",
              br: "endTagBr",
              "-default": "endTagOther"
            };
            modes.inBody.processCharacters = function(buffer) {
              if (tree.shouldSkipLeadingNewline) {
                tree.shouldSkipLeadingNewline = false;
                buffer.skipAtMostOneLeadingNewline();
              }
              tree.reconstructActiveFormattingElements();
              var characters = buffer.takeRemaining();
              characters = characters.replace(/\u0000/g, function(match, index) {
                tree.parseError("invalid-codepoint");
                return "";
              });
              if (!characters)
                return;
              tree.insertText(characters);
              if (tree.framesetOk && !isAllWhitespaceOrReplacementCharacters(characters))
                tree.framesetOk = false;
            };
            modes.inBody.startTagHtml = function(name, attributes) {
              tree.parseError("non-html-root");
              tree.addAttributesToElement(tree.openElements.rootNode, attributes);
            };
            modes.inBody.startTagProcessInHead = function(name, attributes) {
              modes.inHead.processStartTag(name, attributes);
            };
            modes.inBody.startTagBody = function(name, attributes) {
              tree.parseError("unexpected-start-tag", { name: "body" });
              if (tree.openElements.length == 1 || tree.openElements.item(1).localName != "body") {
                assert.ok(tree.context);
              } else {
                tree.framesetOk = false;
                tree.addAttributesToElement(tree.openElements.bodyElement, attributes);
              }
            };
            modes.inBody.startTagFrameset = function(name, attributes) {
              tree.parseError("unexpected-start-tag", { name: "frameset" });
              if (tree.openElements.length == 1 || tree.openElements.item(1).localName != "body") {
                assert.ok(tree.context);
              } else if (tree.framesetOk) {
                tree.detachFromParent(tree.openElements.bodyElement);
                while (tree.openElements.length > 1)
                  tree.openElements.pop();
                tree.insertElement(name, attributes);
                tree.setInsertionMode("inFrameset");
              }
            };
            modes.inBody.startTagCloseP = function(name, attributes) {
              if (tree.openElements.inButtonScope("p"))
                this.endTagP("p");
              tree.insertElement(name, attributes);
            };
            modes.inBody.startTagPreListing = function(name, attributes) {
              if (tree.openElements.inButtonScope("p"))
                this.endTagP("p");
              tree.insertElement(name, attributes);
              tree.framesetOk = false;
              tree.shouldSkipLeadingNewline = true;
            };
            modes.inBody.startTagForm = function(name, attributes) {
              if (tree.form) {
                tree.parseError("unexpected-start-tag", { name });
              } else {
                if (tree.openElements.inButtonScope("p"))
                  this.endTagP("p");
                tree.insertElement(name, attributes);
                tree.form = tree.currentStackItem();
              }
            };
            modes.inBody.startTagRpRt = function(name, attributes) {
              if (tree.openElements.inScope("ruby")) {
                tree.generateImpliedEndTags();
                if (tree.currentStackItem().localName != "ruby") {
                  tree.parseError("unexpected-start-tag", { name });
                }
              }
              tree.insertElement(name, attributes);
            };
            modes.inBody.startTagListItem = function(name, attributes) {
              var stopNames = { li: ["li"], dd: ["dd", "dt"], dt: ["dd", "dt"] };
              var stopName = stopNames[name];
              var els = tree.openElements;
              for (var i = els.length - 1; i >= 0; i--) {
                var node = els.item(i);
                if (stopName.indexOf(node.localName) != -1) {
                  tree.insertionMode.processEndTag(node.localName);
                  break;
                }
                if (node.isSpecial() && node.localName !== "p" && node.localName !== "address" && node.localName !== "div")
                  break;
              }
              if (tree.openElements.inButtonScope("p"))
                this.endTagP("p");
              tree.insertElement(name, attributes);
              tree.framesetOk = false;
            };
            modes.inBody.startTagPlaintext = function(name, attributes) {
              if (tree.openElements.inButtonScope("p"))
                this.endTagP("p");
              tree.insertElement(name, attributes);
              tree.tokenizer.setState(Tokenizer.PLAINTEXT);
            };
            modes.inBody.startTagHeading = function(name, attributes) {
              if (tree.openElements.inButtonScope("p"))
                this.endTagP("p");
              if (tree.currentStackItem().isNumberedHeader()) {
                tree.parseError("unexpected-start-tag", { name });
                tree.popElement();
              }
              tree.insertElement(name, attributes);
            };
            modes.inBody.startTagA = function(name, attributes) {
              var activeA = tree.elementInActiveFormattingElements("a");
              if (activeA) {
                tree.parseError("unexpected-start-tag-implies-end-tag", { startName: "a", endName: "a" });
                tree.adoptionAgencyEndTag("a");
                if (tree.openElements.contains(activeA))
                  tree.openElements.remove(activeA);
                tree.removeElementFromActiveFormattingElements(activeA);
              }
              tree.reconstructActiveFormattingElements();
              tree.insertFormattingElement(name, attributes);
            };
            modes.inBody.startTagFormatting = function(name, attributes) {
              tree.reconstructActiveFormattingElements();
              tree.insertFormattingElement(name, attributes);
            };
            modes.inBody.startTagNobr = function(name, attributes) {
              tree.reconstructActiveFormattingElements();
              if (tree.openElements.inScope("nobr")) {
                tree.parseError("unexpected-start-tag-implies-end-tag", { startName: "nobr", endName: "nobr" });
                this.processEndTag("nobr");
                tree.reconstructActiveFormattingElements();
              }
              tree.insertFormattingElement(name, attributes);
            };
            modes.inBody.startTagButton = function(name, attributes) {
              if (tree.openElements.inScope("button")) {
                tree.parseError("unexpected-start-tag-implies-end-tag", { startName: "button", endName: "button" });
                this.processEndTag("button");
                tree.insertionMode.processStartTag(name, attributes);
              } else {
                tree.framesetOk = false;
                tree.reconstructActiveFormattingElements();
                tree.insertElement(name, attributes);
              }
            };
            modes.inBody.startTagAppletMarqueeObject = function(name, attributes) {
              tree.reconstructActiveFormattingElements();
              tree.insertElement(name, attributes);
              tree.activeFormattingElements.push(Marker);
              tree.framesetOk = false;
            };
            modes.inBody.endTagAppletMarqueeObject = function(name) {
              if (!tree.openElements.inScope(name)) {
                tree.parseError("unexpected-end-tag", { name });
              } else {
                tree.generateImpliedEndTags();
                if (tree.currentStackItem().localName != name) {
                  tree.parseError("end-tag-too-early", { name });
                }
                tree.openElements.popUntilPopped(name);
                tree.clearActiveFormattingElements();
              }
            };
            modes.inBody.startTagXmp = function(name, attributes) {
              if (tree.openElements.inButtonScope("p"))
                this.processEndTag("p");
              tree.reconstructActiveFormattingElements();
              tree.processGenericRawTextStartTag(name, attributes);
              tree.framesetOk = false;
            };
            modes.inBody.startTagTable = function(name, attributes) {
              if (tree.compatMode !== "quirks") {
                if (tree.openElements.inButtonScope("p"))
                  this.processEndTag("p");
              }
              tree.insertElement(name, attributes);
              tree.setInsertionMode("inTable");
              tree.framesetOk = false;
            };
            modes.inBody.startTagVoidFormatting = function(name, attributes) {
              tree.reconstructActiveFormattingElements();
              tree.insertSelfClosingElement(name, attributes);
              tree.framesetOk = false;
            };
            modes.inBody.startTagParamSourceTrack = function(name, attributes) {
              tree.insertSelfClosingElement(name, attributes);
            };
            modes.inBody.startTagHr = function(name, attributes) {
              if (tree.openElements.inButtonScope("p"))
                this.endTagP("p");
              tree.insertSelfClosingElement(name, attributes);
              tree.framesetOk = false;
            };
            modes.inBody.startTagImage = function(name, attributes) {
              tree.parseError("unexpected-start-tag-treated-as", { originalName: "image", newName: "img" });
              this.processStartTag("img", attributes);
            };
            modes.inBody.startTagInput = function(name, attributes) {
              var currentFramesetOk = tree.framesetOk;
              this.startTagVoidFormatting(name, attributes);
              for (var key in attributes) {
                if (attributes[key].nodeName == "type") {
                  if (attributes[key].nodeValue.toLowerCase() == "hidden")
                    tree.framesetOk = currentFramesetOk;
                  break;
                }
              }
            };
            modes.inBody.startTagIsindex = function(name, attributes) {
              tree.parseError("deprecated-tag", { name: "isindex" });
              tree.selfClosingFlagAcknowledged = true;
              if (tree.form)
                return;
              var formAttributes = [];
              var inputAttributes = [];
              var prompt = "This is a searchable index. Enter search keywords: ";
              for (var key in attributes) {
                switch (attributes[key].nodeName) {
                  case "action":
                    formAttributes.push({
                      nodeName: "action",
                      nodeValue: attributes[key].nodeValue
                    });
                    break;
                  case "prompt":
                    prompt = attributes[key].nodeValue;
                    break;
                  case "name":
                    break;
                  default:
                    inputAttributes.push({
                      nodeName: attributes[key].nodeName,
                      nodeValue: attributes[key].nodeValue
                    });
                }
              }
              inputAttributes.push({ nodeName: "name", nodeValue: "isindex" });
              this.processStartTag("form", formAttributes);
              this.processStartTag("hr");
              this.processStartTag("label");
              this.processCharacters(new CharacterBuffer(prompt));
              this.processStartTag("input", inputAttributes);
              this.processEndTag("label");
              this.processStartTag("hr");
              this.processEndTag("form");
            };
            modes.inBody.startTagTextarea = function(name, attributes) {
              tree.insertElement(name, attributes);
              tree.tokenizer.setState(Tokenizer.RCDATA);
              tree.originalInsertionMode = tree.insertionModeName;
              tree.shouldSkipLeadingNewline = true;
              tree.framesetOk = false;
              tree.setInsertionMode("text");
            };
            modes.inBody.startTagIFrame = function(name, attributes) {
              tree.framesetOk = false;
              this.startTagRawText(name, attributes);
            };
            modes.inBody.startTagRawText = function(name, attributes) {
              tree.processGenericRawTextStartTag(name, attributes);
            };
            modes.inBody.startTagSelect = function(name, attributes) {
              tree.reconstructActiveFormattingElements();
              tree.insertElement(name, attributes);
              tree.framesetOk = false;
              var insertionModeName = tree.insertionModeName;
              if (insertionModeName == "inTable" || insertionModeName == "inCaption" || insertionModeName == "inColumnGroup" || insertionModeName == "inTableBody" || insertionModeName == "inRow" || insertionModeName == "inCell") {
                tree.setInsertionMode("inSelectInTable");
              } else {
                tree.setInsertionMode("inSelect");
              }
            };
            modes.inBody.startTagMisplaced = function(name, attributes) {
              tree.parseError("unexpected-start-tag-ignored", { name });
            };
            modes.inBody.endTagMisplaced = function(name) {
              tree.parseError("unexpected-end-tag", { name });
            };
            modes.inBody.endTagBr = function(name) {
              tree.parseError("unexpected-end-tag-treated-as", { originalName: "br", newName: "br element" });
              tree.reconstructActiveFormattingElements();
              tree.insertElement(name, []);
              tree.popElement();
            };
            modes.inBody.startTagOptionOptgroup = function(name, attributes) {
              if (tree.currentStackItem().localName == "option")
                tree.popElement();
              tree.reconstructActiveFormattingElements();
              tree.insertElement(name, attributes);
            };
            modes.inBody.startTagOther = function(name, attributes) {
              tree.reconstructActiveFormattingElements();
              tree.insertElement(name, attributes);
            };
            modes.inBody.endTagOther = function(name) {
              var node;
              for (var i = tree.openElements.length - 1; i > 0; i--) {
                node = tree.openElements.item(i);
                if (node.localName == name) {
                  tree.generateImpliedEndTags(name);
                  if (tree.currentStackItem().localName != name)
                    tree.parseError("unexpected-end-tag", { name });
                  tree.openElements.remove_openElements_until(function(x) {
                    return x === node;
                  });
                  break;
                }
                if (node.isSpecial()) {
                  tree.parseError("unexpected-end-tag", { name });
                  break;
                }
              }
            };
            modes.inBody.startTagMath = function(name, attributes, selfClosing) {
              tree.reconstructActiveFormattingElements();
              attributes = tree.adjustMathMLAttributes(attributes);
              attributes = tree.adjustForeignAttributes(attributes);
              tree.insertForeignElement(name, attributes, "http://www.w3.org/1998/Math/MathML", selfClosing);
            };
            modes.inBody.startTagSVG = function(name, attributes, selfClosing) {
              tree.reconstructActiveFormattingElements();
              attributes = tree.adjustSVGAttributes(attributes);
              attributes = tree.adjustForeignAttributes(attributes);
              tree.insertForeignElement(name, attributes, "http://www.w3.org/2000/svg", selfClosing);
            };
            modes.inBody.endTagP = function(name) {
              if (!tree.openElements.inButtonScope("p")) {
                tree.parseError("unexpected-end-tag", { name: "p" });
                this.startTagCloseP("p", []);
                this.endTagP("p");
              } else {
                tree.generateImpliedEndTags("p");
                if (tree.currentStackItem().localName != "p")
                  tree.parseError("unexpected-implied-end-tag", { name: "p" });
                tree.openElements.popUntilPopped(name);
              }
            };
            modes.inBody.endTagBody = function(name) {
              if (!tree.openElements.inScope("body")) {
                tree.parseError("unexpected-end-tag", { name });
                return;
              }
              if (tree.currentStackItem().localName != "body") {
                tree.parseError("expected-one-end-tag-but-got-another", {
                  expectedName: tree.currentStackItem().localName,
                  gotName: name
                });
              }
              tree.setInsertionMode("afterBody");
            };
            modes.inBody.endTagHtml = function(name) {
              if (!tree.openElements.inScope("body")) {
                tree.parseError("unexpected-end-tag", { name });
                return;
              }
              if (tree.currentStackItem().localName != "body") {
                tree.parseError("expected-one-end-tag-but-got-another", {
                  expectedName: tree.currentStackItem().localName,
                  gotName: name
                });
              }
              tree.setInsertionMode("afterBody");
              tree.insertionMode.processEndTag(name);
            };
            modes.inBody.endTagBlock = function(name) {
              if (!tree.openElements.inScope(name)) {
                tree.parseError("unexpected-end-tag", { name });
              } else {
                tree.generateImpliedEndTags();
                if (tree.currentStackItem().localName != name) {
                  tree.parseError("end-tag-too-early", { name });
                }
                tree.openElements.popUntilPopped(name);
              }
            };
            modes.inBody.endTagForm = function(name) {
              var node = tree.form;
              tree.form = null;
              if (!node || !tree.openElements.inScope(name)) {
                tree.parseError("unexpected-end-tag", { name });
              } else {
                tree.generateImpliedEndTags();
                if (tree.currentStackItem() != node) {
                  tree.parseError("end-tag-too-early-ignored", { name: "form" });
                }
                tree.openElements.remove(node);
              }
            };
            modes.inBody.endTagListItem = function(name) {
              if (!tree.openElements.inListItemScope(name)) {
                tree.parseError("unexpected-end-tag", { name });
              } else {
                tree.generateImpliedEndTags(name);
                if (tree.currentStackItem().localName != name)
                  tree.parseError("end-tag-too-early", { name });
                tree.openElements.popUntilPopped(name);
              }
            };
            modes.inBody.endTagHeading = function(name) {
              if (!tree.openElements.hasNumberedHeaderElementInScope()) {
                tree.parseError("unexpected-end-tag", { name });
                return;
              }
              tree.generateImpliedEndTags();
              if (tree.currentStackItem().localName != name)
                tree.parseError("end-tag-too-early", { name });
              tree.openElements.remove_openElements_until(function(e) {
                return e.isNumberedHeader();
              });
            };
            modes.inBody.endTagFormatting = function(name, attributes) {
              if (!tree.adoptionAgencyEndTag(name))
                this.endTagOther(name, attributes);
            };
            modes.inCaption = Object.create(modes.base);
            modes.inCaption.start_tag_handlers = {
              html: "startTagHtml",
              caption: "startTagTableElement",
              col: "startTagTableElement",
              colgroup: "startTagTableElement",
              tbody: "startTagTableElement",
              td: "startTagTableElement",
              tfoot: "startTagTableElement",
              thead: "startTagTableElement",
              tr: "startTagTableElement",
              "-default": "startTagOther"
            };
            modes.inCaption.end_tag_handlers = {
              caption: "endTagCaption",
              table: "endTagTable",
              body: "endTagIgnore",
              col: "endTagIgnore",
              colgroup: "endTagIgnore",
              html: "endTagIgnore",
              tbody: "endTagIgnore",
              td: "endTagIgnore",
              tfood: "endTagIgnore",
              thead: "endTagIgnore",
              tr: "endTagIgnore",
              "-default": "endTagOther"
            };
            modes.inCaption.processCharacters = function(data) {
              modes.inBody.processCharacters(data);
            };
            modes.inCaption.startTagTableElement = function(name, attributes) {
              tree.parseError("unexpected-end-tag", { name });
              var ignoreEndTag = !tree.openElements.inTableScope("caption");
              tree.insertionMode.processEndTag("caption");
              if (!ignoreEndTag) tree.insertionMode.processStartTag(name, attributes);
            };
            modes.inCaption.startTagOther = function(name, attributes, selfClosing) {
              modes.inBody.processStartTag(name, attributes, selfClosing);
            };
            modes.inCaption.endTagCaption = function(name) {
              if (!tree.openElements.inTableScope("caption")) {
                assert.ok(tree.context);
                tree.parseError("unexpected-end-tag", { name });
              } else {
                tree.generateImpliedEndTags();
                if (tree.currentStackItem().localName != "caption") {
                  tree.parseError("expected-one-end-tag-but-got-another", {
                    gotName: "caption",
                    expectedName: tree.currentStackItem().localName
                  });
                }
                tree.openElements.popUntilPopped("caption");
                tree.clearActiveFormattingElements();
                tree.setInsertionMode("inTable");
              }
            };
            modes.inCaption.endTagTable = function(name) {
              tree.parseError("unexpected-end-table-in-caption");
              var ignoreEndTag = !tree.openElements.inTableScope("caption");
              tree.insertionMode.processEndTag("caption");
              if (!ignoreEndTag) tree.insertionMode.processEndTag(name);
            };
            modes.inCaption.endTagIgnore = function(name) {
              tree.parseError("unexpected-end-tag", { name });
            };
            modes.inCaption.endTagOther = function(name) {
              modes.inBody.processEndTag(name);
            };
            modes.inCell = Object.create(modes.base);
            modes.inCell.start_tag_handlers = {
              html: "startTagHtml",
              caption: "startTagTableOther",
              col: "startTagTableOther",
              colgroup: "startTagTableOther",
              tbody: "startTagTableOther",
              td: "startTagTableOther",
              tfoot: "startTagTableOther",
              th: "startTagTableOther",
              thead: "startTagTableOther",
              tr: "startTagTableOther",
              "-default": "startTagOther"
            };
            modes.inCell.end_tag_handlers = {
              td: "endTagTableCell",
              th: "endTagTableCell",
              body: "endTagIgnore",
              caption: "endTagIgnore",
              col: "endTagIgnore",
              colgroup: "endTagIgnore",
              html: "endTagIgnore",
              table: "endTagImply",
              tbody: "endTagImply",
              tfoot: "endTagImply",
              thead: "endTagImply",
              tr: "endTagImply",
              "-default": "endTagOther"
            };
            modes.inCell.processCharacters = function(data) {
              modes.inBody.processCharacters(data);
            };
            modes.inCell.startTagTableOther = function(name, attributes, selfClosing) {
              if (tree.openElements.inTableScope("td") || tree.openElements.inTableScope("th")) {
                this.closeCell();
                tree.insertionMode.processStartTag(name, attributes, selfClosing);
              } else {
                tree.parseError("unexpected-start-tag", { name });
              }
            };
            modes.inCell.startTagOther = function(name, attributes, selfClosing) {
              modes.inBody.processStartTag(name, attributes, selfClosing);
            };
            modes.inCell.endTagTableCell = function(name) {
              if (tree.openElements.inTableScope(name)) {
                tree.generateImpliedEndTags(name);
                if (tree.currentStackItem().localName != name.toLowerCase()) {
                  tree.parseError("unexpected-cell-end-tag", { name });
                  tree.openElements.popUntilPopped(name);
                } else {
                  tree.popElement();
                }
                tree.clearActiveFormattingElements();
                tree.setInsertionMode("inRow");
              } else {
                tree.parseError("unexpected-end-tag", { name });
              }
            };
            modes.inCell.endTagIgnore = function(name) {
              tree.parseError("unexpected-end-tag", { name });
            };
            modes.inCell.endTagImply = function(name) {
              if (tree.openElements.inTableScope(name)) {
                this.closeCell();
                tree.insertionMode.processEndTag(name);
              } else {
                tree.parseError("unexpected-end-tag", { name });
              }
            };
            modes.inCell.endTagOther = function(name) {
              modes.inBody.processEndTag(name);
            };
            modes.inCell.closeCell = function() {
              if (tree.openElements.inTableScope("td")) {
                this.endTagTableCell("td");
              } else if (tree.openElements.inTableScope("th")) {
                this.endTagTableCell("th");
              }
            };
            modes.inColumnGroup = Object.create(modes.base);
            modes.inColumnGroup.start_tag_handlers = {
              html: "startTagHtml",
              col: "startTagCol",
              "-default": "startTagOther"
            };
            modes.inColumnGroup.end_tag_handlers = {
              colgroup: "endTagColgroup",
              col: "endTagCol",
              "-default": "endTagOther"
            };
            modes.inColumnGroup.ignoreEndTagColgroup = function() {
              return tree.currentStackItem().localName == "html";
            };
            modes.inColumnGroup.processCharacters = function(buffer) {
              var leadingWhitespace = buffer.takeLeadingWhitespace();
              if (leadingWhitespace)
                tree.insertText(leadingWhitespace);
              if (!buffer.length)
                return;
              var ignoreEndTag = this.ignoreEndTagColgroup();
              this.endTagColgroup("colgroup");
              if (!ignoreEndTag) tree.insertionMode.processCharacters(buffer);
            };
            modes.inColumnGroup.startTagCol = function(name, attributes) {
              tree.insertSelfClosingElement(name, attributes);
            };
            modes.inColumnGroup.startTagOther = function(name, attributes, selfClosing) {
              var ignoreEndTag = this.ignoreEndTagColgroup();
              this.endTagColgroup("colgroup");
              if (!ignoreEndTag) tree.insertionMode.processStartTag(name, attributes, selfClosing);
            };
            modes.inColumnGroup.endTagColgroup = function(name) {
              if (this.ignoreEndTagColgroup()) {
                assert.ok(tree.context);
                tree.parseError("unexpected-end-tag", { name });
              } else {
                tree.popElement();
                tree.setInsertionMode("inTable");
              }
            };
            modes.inColumnGroup.endTagCol = function(name) {
              tree.parseError("no-end-tag", { name: "col" });
            };
            modes.inColumnGroup.endTagOther = function(name) {
              var ignoreEndTag = this.ignoreEndTagColgroup();
              this.endTagColgroup("colgroup");
              if (!ignoreEndTag) tree.insertionMode.processEndTag(name);
            };
            modes.inForeignContent = Object.create(modes.base);
            modes.inForeignContent.processStartTag = function(name, attributes, selfClosing) {
              if (["b", "big", "blockquote", "body", "br", "center", "code", "dd", "div", "dl", "dt", "em", "embed", "h1", "h2", "h3", "h4", "h5", "h6", "head", "hr", "i", "img", "li", "listing", "menu", "meta", "nobr", "ol", "p", "pre", "ruby", "s", "small", "span", "strong", "strike", "sub", "sup", "table", "tt", "u", "ul", "var"].indexOf(name) != -1 || name == "font" && attributes.some(function(attr) {
                return ["color", "face", "size"].indexOf(attr.nodeName) >= 0;
              })) {
                tree.parseError("unexpected-html-element-in-foreign-content", { name });
                while (tree.currentStackItem().isForeign() && !tree.currentStackItem().isHtmlIntegrationPoint() && !tree.currentStackItem().isMathMLTextIntegrationPoint()) {
                  tree.openElements.pop();
                }
                tree.insertionMode.processStartTag(name, attributes, selfClosing);
                return;
              }
              if (tree.currentStackItem().namespaceURI == "http://www.w3.org/1998/Math/MathML") {
                attributes = tree.adjustMathMLAttributes(attributes);
              }
              if (tree.currentStackItem().namespaceURI == "http://www.w3.org/2000/svg") {
                name = tree.adjustSVGTagNameCase(name);
                attributes = tree.adjustSVGAttributes(attributes);
              }
              attributes = tree.adjustForeignAttributes(attributes);
              tree.insertForeignElement(name, attributes, tree.currentStackItem().namespaceURI, selfClosing);
            };
            modes.inForeignContent.processEndTag = function(name) {
              var node = tree.currentStackItem();
              var index = tree.openElements.length - 1;
              if (node.localName.toLowerCase() != name)
                tree.parseError("unexpected-end-tag", { name });
              while (true) {
                if (index === 0)
                  break;
                if (node.localName.toLowerCase() == name) {
                  while (tree.openElements.pop() != node) ;
                  break;
                }
                index -= 1;
                node = tree.openElements.item(index);
                if (node.isForeign()) {
                  continue;
                } else {
                  tree.insertionMode.processEndTag(name);
                  break;
                }
              }
            };
            modes.inForeignContent.processCharacters = function(buffer) {
              var characters = buffer.takeRemaining();
              characters = characters.replace(/\u0000/g, function(match, index) {
                tree.parseError("invalid-codepoint");
                return "�";
              });
              if (tree.framesetOk && !isAllWhitespaceOrReplacementCharacters(characters))
                tree.framesetOk = false;
              tree.insertText(characters);
            };
            modes.inHeadNoscript = Object.create(modes.base);
            modes.inHeadNoscript.start_tag_handlers = {
              html: "startTagHtml",
              basefont: "startTagBasefontBgsoundLinkMetaNoframesStyle",
              bgsound: "startTagBasefontBgsoundLinkMetaNoframesStyle",
              link: "startTagBasefontBgsoundLinkMetaNoframesStyle",
              meta: "startTagBasefontBgsoundLinkMetaNoframesStyle",
              noframes: "startTagBasefontBgsoundLinkMetaNoframesStyle",
              style: "startTagBasefontBgsoundLinkMetaNoframesStyle",
              head: "startTagHeadNoscript",
              noscript: "startTagHeadNoscript",
              "-default": "startTagOther"
            };
            modes.inHeadNoscript.end_tag_handlers = {
              noscript: "endTagNoscript",
              br: "endTagBr",
              "-default": "endTagOther"
            };
            modes.inHeadNoscript.processCharacters = function(buffer) {
              var leadingWhitespace = buffer.takeLeadingWhitespace();
              if (leadingWhitespace)
                tree.insertText(leadingWhitespace);
              if (!buffer.length)
                return;
              tree.parseError("unexpected-char-in-frameset");
              this.anythingElse();
              tree.insertionMode.processCharacters(buffer);
            };
            modes.inHeadNoscript.processComment = function(data) {
              modes.inHead.processComment(data);
            };
            modes.inHeadNoscript.startTagBasefontBgsoundLinkMetaNoframesStyle = function(name, attributes) {
              modes.inHead.processStartTag(name, attributes);
            };
            modes.inHeadNoscript.startTagHeadNoscript = function(name, attributes) {
              tree.parseError("unexpected-start-tag-in-frameset", { name });
            };
            modes.inHeadNoscript.startTagOther = function(name, attributes) {
              tree.parseError("unexpected-start-tag-in-frameset", { name });
              this.anythingElse();
              tree.insertionMode.processStartTag(name, attributes);
            };
            modes.inHeadNoscript.endTagBr = function(name, attributes) {
              tree.parseError("unexpected-end-tag-in-frameset", { name });
              this.anythingElse();
              tree.insertionMode.processEndTag(name, attributes);
            };
            modes.inHeadNoscript.endTagNoscript = function(name, attributes) {
              tree.popElement();
              tree.setInsertionMode("inHead");
            };
            modes.inHeadNoscript.endTagOther = function(name, attributes) {
              tree.parseError("unexpected-end-tag-in-frameset", { name });
            };
            modes.inHeadNoscript.anythingElse = function() {
              tree.popElement();
              tree.setInsertionMode("inHead");
            };
            modes.inFrameset = Object.create(modes.base);
            modes.inFrameset.start_tag_handlers = {
              html: "startTagHtml",
              frameset: "startTagFrameset",
              frame: "startTagFrame",
              noframes: "startTagNoframes",
              "-default": "startTagOther"
            };
            modes.inFrameset.end_tag_handlers = {
              frameset: "endTagFrameset",
              noframes: "endTagNoframes",
              "-default": "endTagOther"
            };
            modes.inFrameset.processCharacters = function(data) {
              tree.parseError("unexpected-char-in-frameset");
            };
            modes.inFrameset.startTagFrameset = function(name, attributes) {
              tree.insertElement(name, attributes);
            };
            modes.inFrameset.startTagFrame = function(name, attributes) {
              tree.insertSelfClosingElement(name, attributes);
            };
            modes.inFrameset.startTagNoframes = function(name, attributes) {
              modes.inBody.processStartTag(name, attributes);
            };
            modes.inFrameset.startTagOther = function(name, attributes) {
              tree.parseError("unexpected-start-tag-in-frameset", { name });
            };
            modes.inFrameset.endTagFrameset = function(name, attributes) {
              if (tree.currentStackItem().localName == "html") {
                tree.parseError("unexpected-frameset-in-frameset-innerhtml");
              } else {
                tree.popElement();
              }
              if (!tree.context && tree.currentStackItem().localName != "frameset") {
                tree.setInsertionMode("afterFrameset");
              }
            };
            modes.inFrameset.endTagNoframes = function(name) {
              modes.inBody.processEndTag(name);
            };
            modes.inFrameset.endTagOther = function(name) {
              tree.parseError("unexpected-end-tag-in-frameset", { name });
            };
            modes.inTable = Object.create(modes.base);
            modes.inTable.start_tag_handlers = {
              html: "startTagHtml",
              caption: "startTagCaption",
              colgroup: "startTagColgroup",
              col: "startTagCol",
              table: "startTagTable",
              tbody: "startTagRowGroup",
              tfoot: "startTagRowGroup",
              thead: "startTagRowGroup",
              td: "startTagImplyTbody",
              th: "startTagImplyTbody",
              tr: "startTagImplyTbody",
              style: "startTagStyleScript",
              script: "startTagStyleScript",
              input: "startTagInput",
              form: "startTagForm",
              "-default": "startTagOther"
            };
            modes.inTable.end_tag_handlers = {
              table: "endTagTable",
              body: "endTagIgnore",
              caption: "endTagIgnore",
              col: "endTagIgnore",
              colgroup: "endTagIgnore",
              html: "endTagIgnore",
              tbody: "endTagIgnore",
              td: "endTagIgnore",
              tfoot: "endTagIgnore",
              th: "endTagIgnore",
              thead: "endTagIgnore",
              tr: "endTagIgnore",
              "-default": "endTagOther"
            };
            modes.inTable.processCharacters = function(data) {
              if (tree.currentStackItem().isFosterParenting()) {
                var originalInsertionMode = tree.insertionModeName;
                tree.setInsertionMode("inTableText");
                tree.originalInsertionMode = originalInsertionMode;
                tree.insertionMode.processCharacters(data);
              } else {
                tree.redirectAttachToFosterParent = true;
                modes.inBody.processCharacters(data);
                tree.redirectAttachToFosterParent = false;
              }
            };
            modes.inTable.startTagCaption = function(name, attributes) {
              tree.openElements.popUntilTableScopeMarker();
              tree.activeFormattingElements.push(Marker);
              tree.insertElement(name, attributes);
              tree.setInsertionMode("inCaption");
            };
            modes.inTable.startTagColgroup = function(name, attributes) {
              tree.openElements.popUntilTableScopeMarker();
              tree.insertElement(name, attributes);
              tree.setInsertionMode("inColumnGroup");
            };
            modes.inTable.startTagCol = function(name, attributes) {
              this.startTagColgroup("colgroup", []);
              tree.insertionMode.processStartTag(name, attributes);
            };
            modes.inTable.startTagRowGroup = function(name, attributes) {
              tree.openElements.popUntilTableScopeMarker();
              tree.insertElement(name, attributes);
              tree.setInsertionMode("inTableBody");
            };
            modes.inTable.startTagImplyTbody = function(name, attributes) {
              this.startTagRowGroup("tbody", []);
              tree.insertionMode.processStartTag(name, attributes);
            };
            modes.inTable.startTagTable = function(name, attributes) {
              tree.parseError(
                "unexpected-start-tag-implies-end-tag",
                { startName: "table", endName: "table" }
              );
              tree.insertionMode.processEndTag("table");
              if (!tree.context) tree.insertionMode.processStartTag(name, attributes);
            };
            modes.inTable.startTagStyleScript = function(name, attributes) {
              modes.inHead.processStartTag(name, attributes);
            };
            modes.inTable.startTagInput = function(name, attributes) {
              for (var key in attributes) {
                if (attributes[key].nodeName.toLowerCase() == "type") {
                  if (attributes[key].nodeValue.toLowerCase() == "hidden") {
                    tree.parseError("unexpected-hidden-input-in-table");
                    tree.insertElement(name, attributes);
                    tree.openElements.pop();
                    return;
                  }
                  break;
                }
              }
              this.startTagOther(name, attributes);
            };
            modes.inTable.startTagForm = function(name, attributes) {
              tree.parseError("unexpected-form-in-table");
              if (!tree.form) {
                tree.insertElement(name, attributes);
                tree.form = tree.currentStackItem();
                tree.openElements.pop();
              }
            };
            modes.inTable.startTagOther = function(name, attributes, selfClosing) {
              tree.parseError("unexpected-start-tag-implies-table-voodoo", { name });
              tree.redirectAttachToFosterParent = true;
              modes.inBody.processStartTag(name, attributes, selfClosing);
              tree.redirectAttachToFosterParent = false;
            };
            modes.inTable.endTagTable = function(name) {
              if (tree.openElements.inTableScope(name)) {
                tree.generateImpliedEndTags();
                if (tree.currentStackItem().localName != name) {
                  tree.parseError("end-tag-too-early-named", { gotName: "table", expectedName: tree.currentStackItem().localName });
                }
                tree.openElements.popUntilPopped("table");
                tree.resetInsertionMode();
              } else {
                assert.ok(tree.context);
                tree.parseError("unexpected-end-tag", { name });
              }
            };
            modes.inTable.endTagIgnore = function(name) {
              tree.parseError("unexpected-end-tag", { name });
            };
            modes.inTable.endTagOther = function(name) {
              tree.parseError("unexpected-end-tag-implies-table-voodoo", { name });
              tree.redirectAttachToFosterParent = true;
              modes.inBody.processEndTag(name);
              tree.redirectAttachToFosterParent = false;
            };
            modes.inTableText = Object.create(modes.base);
            modes.inTableText.flushCharacters = function() {
              var characters = tree.pendingTableCharacters.join("");
              if (!isAllWhitespace(characters)) {
                tree.redirectAttachToFosterParent = true;
                tree.reconstructActiveFormattingElements();
                tree.insertText(characters);
                tree.framesetOk = false;
                tree.redirectAttachToFosterParent = false;
              } else {
                tree.insertText(characters);
              }
              tree.pendingTableCharacters = [];
            };
            modes.inTableText.processComment = function(data) {
              this.flushCharacters();
              tree.setInsertionMode(tree.originalInsertionMode);
              tree.insertionMode.processComment(data);
            };
            modes.inTableText.processEOF = function(data) {
              this.flushCharacters();
              tree.setInsertionMode(tree.originalInsertionMode);
              tree.insertionMode.processEOF();
            };
            modes.inTableText.processCharacters = function(buffer) {
              var characters = buffer.takeRemaining();
              characters = characters.replace(/\u0000/g, function(match, index) {
                tree.parseError("invalid-codepoint");
                return "";
              });
              if (!characters)
                return;
              tree.pendingTableCharacters.push(characters);
            };
            modes.inTableText.processStartTag = function(name, attributes, selfClosing) {
              this.flushCharacters();
              tree.setInsertionMode(tree.originalInsertionMode);
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
            };
            modes.inTableText.processEndTag = function(name, attributes) {
              this.flushCharacters();
              tree.setInsertionMode(tree.originalInsertionMode);
              tree.insertionMode.processEndTag(name, attributes);
            };
            modes.inTableBody = Object.create(modes.base);
            modes.inTableBody.start_tag_handlers = {
              html: "startTagHtml",
              tr: "startTagTr",
              td: "startTagTableCell",
              th: "startTagTableCell",
              caption: "startTagTableOther",
              col: "startTagTableOther",
              colgroup: "startTagTableOther",
              tbody: "startTagTableOther",
              tfoot: "startTagTableOther",
              thead: "startTagTableOther",
              "-default": "startTagOther"
            };
            modes.inTableBody.end_tag_handlers = {
              table: "endTagTable",
              tbody: "endTagTableRowGroup",
              tfoot: "endTagTableRowGroup",
              thead: "endTagTableRowGroup",
              body: "endTagIgnore",
              caption: "endTagIgnore",
              col: "endTagIgnore",
              colgroup: "endTagIgnore",
              html: "endTagIgnore",
              td: "endTagIgnore",
              th: "endTagIgnore",
              tr: "endTagIgnore",
              "-default": "endTagOther"
            };
            modes.inTableBody.processCharacters = function(data) {
              modes.inTable.processCharacters(data);
            };
            modes.inTableBody.startTagTr = function(name, attributes) {
              tree.openElements.popUntilTableBodyScopeMarker();
              tree.insertElement(name, attributes);
              tree.setInsertionMode("inRow");
            };
            modes.inTableBody.startTagTableCell = function(name, attributes) {
              tree.parseError("unexpected-cell-in-table-body", { name });
              this.startTagTr("tr", []);
              tree.insertionMode.processStartTag(name, attributes);
            };
            modes.inTableBody.startTagTableOther = function(name, attributes) {
              if (tree.openElements.inTableScope("tbody") || tree.openElements.inTableScope("thead") || tree.openElements.inTableScope("tfoot")) {
                tree.openElements.popUntilTableBodyScopeMarker();
                this.endTagTableRowGroup(tree.currentStackItem().localName);
                tree.insertionMode.processStartTag(name, attributes);
              } else {
                tree.parseError("unexpected-start-tag", { name });
              }
            };
            modes.inTableBody.startTagOther = function(name, attributes) {
              modes.inTable.processStartTag(name, attributes);
            };
            modes.inTableBody.endTagTableRowGroup = function(name) {
              if (tree.openElements.inTableScope(name)) {
                tree.openElements.popUntilTableBodyScopeMarker();
                tree.popElement();
                tree.setInsertionMode("inTable");
              } else {
                tree.parseError("unexpected-end-tag-in-table-body", { name });
              }
            };
            modes.inTableBody.endTagTable = function(name) {
              if (tree.openElements.inTableScope("tbody") || tree.openElements.inTableScope("thead") || tree.openElements.inTableScope("tfoot")) {
                tree.openElements.popUntilTableBodyScopeMarker();
                this.endTagTableRowGroup(tree.currentStackItem().localName);
                tree.insertionMode.processEndTag(name);
              } else {
                tree.parseError("unexpected-end-tag", { name });
              }
            };
            modes.inTableBody.endTagIgnore = function(name) {
              tree.parseError("unexpected-end-tag-in-table-body", { name });
            };
            modes.inTableBody.endTagOther = function(name) {
              modes.inTable.processEndTag(name);
            };
            modes.inSelect = Object.create(modes.base);
            modes.inSelect.start_tag_handlers = {
              html: "startTagHtml",
              option: "startTagOption",
              optgroup: "startTagOptgroup",
              select: "startTagSelect",
              input: "startTagInput",
              keygen: "startTagInput",
              textarea: "startTagInput",
              script: "startTagScript",
              "-default": "startTagOther"
            };
            modes.inSelect.end_tag_handlers = {
              option: "endTagOption",
              optgroup: "endTagOptgroup",
              select: "endTagSelect",
              caption: "endTagTableElements",
              table: "endTagTableElements",
              tbody: "endTagTableElements",
              tfoot: "endTagTableElements",
              thead: "endTagTableElements",
              tr: "endTagTableElements",
              td: "endTagTableElements",
              th: "endTagTableElements",
              "-default": "endTagOther"
            };
            modes.inSelect.processCharacters = function(buffer) {
              var data = buffer.takeRemaining();
              data = data.replace(/\u0000/g, function(match, index) {
                tree.parseError("invalid-codepoint");
                return "";
              });
              if (!data)
                return;
              tree.insertText(data);
            };
            modes.inSelect.startTagOption = function(name, attributes) {
              if (tree.currentStackItem().localName == "option")
                tree.popElement();
              tree.insertElement(name, attributes);
            };
            modes.inSelect.startTagOptgroup = function(name, attributes) {
              if (tree.currentStackItem().localName == "option")
                tree.popElement();
              if (tree.currentStackItem().localName == "optgroup")
                tree.popElement();
              tree.insertElement(name, attributes);
            };
            modes.inSelect.endTagOption = function(name) {
              if (tree.currentStackItem().localName !== "option") {
                tree.parseError("unexpected-end-tag-in-select", { name });
                return;
              }
              tree.popElement();
            };
            modes.inSelect.endTagOptgroup = function(name) {
              if (tree.currentStackItem().localName == "option" && tree.openElements.item(tree.openElements.length - 2).localName == "optgroup") {
                tree.popElement();
              }
              if (tree.currentStackItem().localName == "optgroup") {
                tree.popElement();
              } else {
                tree.parseError("unexpected-end-tag-in-select", { name: "optgroup" });
              }
            };
            modes.inSelect.startTagSelect = function(name) {
              tree.parseError("unexpected-select-in-select");
              this.endTagSelect("select");
            };
            modes.inSelect.endTagSelect = function(name) {
              if (tree.openElements.inTableScope("select")) {
                tree.openElements.popUntilPopped("select");
                tree.resetInsertionMode();
              } else {
                tree.parseError("unexpected-end-tag", { name });
              }
            };
            modes.inSelect.startTagInput = function(name, attributes) {
              tree.parseError("unexpected-input-in-select");
              if (tree.openElements.inSelectScope("select")) {
                this.endTagSelect("select");
                tree.insertionMode.processStartTag(name, attributes);
              }
            };
            modes.inSelect.startTagScript = function(name, attributes) {
              modes.inHead.processStartTag(name, attributes);
            };
            modes.inSelect.endTagTableElements = function(name) {
              tree.parseError("unexpected-end-tag-in-select", { name });
              if (tree.openElements.inTableScope(name)) {
                this.endTagSelect("select");
                tree.insertionMode.processEndTag(name);
              }
            };
            modes.inSelect.startTagOther = function(name, attributes) {
              tree.parseError("unexpected-start-tag-in-select", { name });
            };
            modes.inSelect.endTagOther = function(name) {
              tree.parseError("unexpected-end-tag-in-select", { name });
            };
            modes.inSelectInTable = Object.create(modes.base);
            modes.inSelectInTable.start_tag_handlers = {
              caption: "startTagTable",
              table: "startTagTable",
              tbody: "startTagTable",
              tfoot: "startTagTable",
              thead: "startTagTable",
              tr: "startTagTable",
              td: "startTagTable",
              th: "startTagTable",
              "-default": "startTagOther"
            };
            modes.inSelectInTable.end_tag_handlers = {
              caption: "endTagTable",
              table: "endTagTable",
              tbody: "endTagTable",
              tfoot: "endTagTable",
              thead: "endTagTable",
              tr: "endTagTable",
              td: "endTagTable",
              th: "endTagTable",
              "-default": "endTagOther"
            };
            modes.inSelectInTable.processCharacters = function(data) {
              modes.inSelect.processCharacters(data);
            };
            modes.inSelectInTable.startTagTable = function(name, attributes) {
              tree.parseError("unexpected-table-element-start-tag-in-select-in-table", { name });
              this.endTagOther("select");
              tree.insertionMode.processStartTag(name, attributes);
            };
            modes.inSelectInTable.startTagOther = function(name, attributes, selfClosing) {
              modes.inSelect.processStartTag(name, attributes, selfClosing);
            };
            modes.inSelectInTable.endTagTable = function(name) {
              tree.parseError("unexpected-table-element-end-tag-in-select-in-table", { name });
              if (tree.openElements.inTableScope(name)) {
                this.endTagOther("select");
                tree.insertionMode.processEndTag(name);
              }
            };
            modes.inSelectInTable.endTagOther = function(name) {
              modes.inSelect.processEndTag(name);
            };
            modes.inRow = Object.create(modes.base);
            modes.inRow.start_tag_handlers = {
              html: "startTagHtml",
              td: "startTagTableCell",
              th: "startTagTableCell",
              caption: "startTagTableOther",
              col: "startTagTableOther",
              colgroup: "startTagTableOther",
              tbody: "startTagTableOther",
              tfoot: "startTagTableOther",
              thead: "startTagTableOther",
              tr: "startTagTableOther",
              "-default": "startTagOther"
            };
            modes.inRow.end_tag_handlers = {
              tr: "endTagTr",
              table: "endTagTable",
              tbody: "endTagTableRowGroup",
              tfoot: "endTagTableRowGroup",
              thead: "endTagTableRowGroup",
              body: "endTagIgnore",
              caption: "endTagIgnore",
              col: "endTagIgnore",
              colgroup: "endTagIgnore",
              html: "endTagIgnore",
              td: "endTagIgnore",
              th: "endTagIgnore",
              "-default": "endTagOther"
            };
            modes.inRow.processCharacters = function(data) {
              modes.inTable.processCharacters(data);
            };
            modes.inRow.startTagTableCell = function(name, attributes) {
              tree.openElements.popUntilTableRowScopeMarker();
              tree.insertElement(name, attributes);
              tree.setInsertionMode("inCell");
              tree.activeFormattingElements.push(Marker);
            };
            modes.inRow.startTagTableOther = function(name, attributes) {
              var ignoreEndTag = this.ignoreEndTagTr();
              this.endTagTr("tr");
              if (!ignoreEndTag) tree.insertionMode.processStartTag(name, attributes);
            };
            modes.inRow.startTagOther = function(name, attributes, selfClosing) {
              modes.inTable.processStartTag(name, attributes, selfClosing);
            };
            modes.inRow.endTagTr = function(name) {
              if (this.ignoreEndTagTr()) {
                assert.ok(tree.context);
                tree.parseError("unexpected-end-tag", { name });
              } else {
                tree.openElements.popUntilTableRowScopeMarker();
                tree.popElement();
                tree.setInsertionMode("inTableBody");
              }
            };
            modes.inRow.endTagTable = function(name) {
              var ignoreEndTag = this.ignoreEndTagTr();
              this.endTagTr("tr");
              if (!ignoreEndTag) tree.insertionMode.processEndTag(name);
            };
            modes.inRow.endTagTableRowGroup = function(name) {
              if (tree.openElements.inTableScope(name)) {
                this.endTagTr("tr");
                tree.insertionMode.processEndTag(name);
              } else {
                tree.parseError("unexpected-end-tag", { name });
              }
            };
            modes.inRow.endTagIgnore = function(name) {
              tree.parseError("unexpected-end-tag-in-table-row", { name });
            };
            modes.inRow.endTagOther = function(name) {
              modes.inTable.processEndTag(name);
            };
            modes.inRow.ignoreEndTagTr = function() {
              return !tree.openElements.inTableScope("tr");
            };
            modes.afterAfterFrameset = Object.create(modes.base);
            modes.afterAfterFrameset.start_tag_handlers = {
              html: "startTagHtml",
              noframes: "startTagNoFrames",
              "-default": "startTagOther"
            };
            modes.afterAfterFrameset.processEOF = function() {
            };
            modes.afterAfterFrameset.processComment = function(data) {
              tree.insertComment(data, tree.document);
            };
            modes.afterAfterFrameset.processCharacters = function(buffer) {
              var characters = buffer.takeRemaining();
              var whitespace = "";
              for (var i = 0; i < characters.length; i++) {
                var ch = characters[i];
                if (isWhitespace(ch))
                  whitespace += ch;
              }
              if (whitespace) {
                tree.reconstructActiveFormattingElements();
                tree.insertText(whitespace);
              }
              if (whitespace.length < characters.length)
                tree.parseError("expected-eof-but-got-char");
            };
            modes.afterAfterFrameset.startTagNoFrames = function(name, attributes) {
              modes.inHead.processStartTag(name, attributes);
            };
            modes.afterAfterFrameset.startTagOther = function(name, attributes, selfClosing) {
              tree.parseError("expected-eof-but-got-start-tag", { name });
            };
            modes.afterAfterFrameset.processEndTag = function(name, attributes) {
              tree.parseError("expected-eof-but-got-end-tag", { name });
            };
            modes.text = Object.create(modes.base);
            modes.text.start_tag_handlers = {
              "-default": "startTagOther"
            };
            modes.text.end_tag_handlers = {
              script: "endTagScript",
              "-default": "endTagOther"
            };
            modes.text.processCharacters = function(buffer) {
              if (tree.shouldSkipLeadingNewline) {
                tree.shouldSkipLeadingNewline = false;
                buffer.skipAtMostOneLeadingNewline();
              }
              var data = buffer.takeRemaining();
              if (!data)
                return;
              tree.insertText(data);
            };
            modes.text.processEOF = function() {
              tree.parseError(
                "expected-named-closing-tag-but-got-eof",
                { name: tree.currentStackItem().localName }
              );
              tree.openElements.pop();
              tree.setInsertionMode(tree.originalInsertionMode);
              tree.insertionMode.processEOF();
            };
            modes.text.startTagOther = function(name) {
              throw "Tried to process start tag " + name + " in RCDATA/RAWTEXT mode";
            };
            modes.text.endTagScript = function(name) {
              var node = tree.openElements.pop();
              assert.ok(node.localName == "script");
              tree.setInsertionMode(tree.originalInsertionMode);
            };
            modes.text.endTagOther = function(name) {
              tree.openElements.pop();
              tree.setInsertionMode(tree.originalInsertionMode);
            };
          }
          TreeBuilder.prototype.setInsertionMode = function(name) {
            this.insertionMode = this.insertionModes[name];
            this.insertionModeName = name;
          };
          TreeBuilder.prototype.adoptionAgencyEndTag = function(name) {
            var outerIterationLimit = 8;
            var innerIterationLimit = 3;
            var formattingElement;
            function isActiveFormattingElement(el) {
              return el === formattingElement;
            }
            var outerLoopCounter = 0;
            while (outerLoopCounter++ < outerIterationLimit) {
              formattingElement = this.elementInActiveFormattingElements(name);
              if (!formattingElement || this.openElements.contains(formattingElement) && !this.openElements.inScope(formattingElement.localName)) {
                this.parseError("adoption-agency-1.1", { name });
                return false;
              }
              if (!this.openElements.contains(formattingElement)) {
                this.parseError("adoption-agency-1.2", { name });
                this.removeElementFromActiveFormattingElements(formattingElement);
                return true;
              }
              if (!this.openElements.inScope(formattingElement.localName)) {
                this.parseError("adoption-agency-4.4", { name });
              }
              if (formattingElement != this.currentStackItem()) {
                this.parseError("adoption-agency-1.3", { name });
              }
              var furthestBlock = this.openElements.furthestBlockForFormattingElement(formattingElement.node);
              if (!furthestBlock) {
                this.openElements.remove_openElements_until(isActiveFormattingElement);
                this.removeElementFromActiveFormattingElements(formattingElement);
                return true;
              }
              var afeIndex = this.openElements.elements.indexOf(formattingElement);
              var commonAncestor = this.openElements.item(afeIndex - 1);
              var bookmark = this.activeFormattingElements.indexOf(formattingElement);
              var node = furthestBlock;
              var lastNode = furthestBlock;
              var index = this.openElements.elements.indexOf(node);
              var innerLoopCounter = 0;
              while (innerLoopCounter++ < innerIterationLimit) {
                index -= 1;
                node = this.openElements.item(index);
                if (this.activeFormattingElements.indexOf(node) < 0) {
                  this.openElements.elements.splice(index, 1);
                  continue;
                }
                if (node == formattingElement)
                  break;
                if (lastNode == furthestBlock)
                  bookmark = this.activeFormattingElements.indexOf(node) + 1;
                var clone = this.createElement(node.namespaceURI, node.localName, node.attributes);
                var newNode = new StackItem(node.namespaceURI, node.localName, node.attributes, clone);
                this.activeFormattingElements[this.activeFormattingElements.indexOf(node)] = newNode;
                this.openElements.elements[this.openElements.elements.indexOf(node)] = newNode;
                node = newNode;
                this.detachFromParent(lastNode.node);
                this.attachNode(lastNode.node, node.node);
                lastNode = node;
              }
              this.detachFromParent(lastNode.node);
              if (commonAncestor.isFosterParenting()) {
                this.insertIntoFosterParent(lastNode.node);
              } else {
                this.attachNode(lastNode.node, commonAncestor.node);
              }
              var clone = this.createElement("http://www.w3.org/1999/xhtml", formattingElement.localName, formattingElement.attributes);
              var formattingClone = new StackItem(formattingElement.namespaceURI, formattingElement.localName, formattingElement.attributes, clone);
              this.reparentChildren(furthestBlock.node, clone);
              this.attachNode(clone, furthestBlock.node);
              this.removeElementFromActiveFormattingElements(formattingElement);
              this.activeFormattingElements.splice(Math.min(bookmark, this.activeFormattingElements.length), 0, formattingClone);
              this.openElements.remove(formattingElement);
              this.openElements.elements.splice(this.openElements.elements.indexOf(furthestBlock) + 1, 0, formattingClone);
            }
            return true;
          };
          TreeBuilder.prototype.start = function() {
            throw "Not mplemented";
          };
          TreeBuilder.prototype.startTokenization = function(tokenizer) {
            this.tokenizer = tokenizer;
            this.compatMode = "no quirks";
            this.originalInsertionMode = "initial";
            this.framesetOk = true;
            this.openElements = new ElementStack();
            this.activeFormattingElements = [];
            this.start();
            if (this.context) {
              switch (this.context) {
                case "title":
                case "textarea":
                  this.tokenizer.setState(Tokenizer.RCDATA);
                  break;
                case "style":
                case "xmp":
                case "iframe":
                case "noembed":
                case "noframes":
                  this.tokenizer.setState(Tokenizer.RAWTEXT);
                  break;
                case "script":
                  this.tokenizer.setState(Tokenizer.SCRIPT_DATA);
                  break;
                case "noscript":
                  if (this.scriptingEnabled)
                    this.tokenizer.setState(Tokenizer.RAWTEXT);
                  break;
                case "plaintext":
                  this.tokenizer.setState(Tokenizer.PLAINTEXT);
                  break;
              }
              this.insertHtmlElement();
              if (this.context === "head") {
                this.insertHeadElement();
              } else {
                this.insertBodyElement();
              }
              this.resetInsertionMode();
            } else {
              this.setInsertionMode("initial");
            }
          };
          TreeBuilder.prototype.processToken = function(token) {
            this.selfClosingFlagAcknowledged = false;
            var currentNode = this.openElements.top || null;
            var insertionMode;
            if (!currentNode || !currentNode.isForeign() || currentNode.isMathMLTextIntegrationPoint() && (token.type == "StartTag" && !(token.name in { mglyph: 0, malignmark: 0 }) || token.type === "Characters") || currentNode.namespaceURI == "http://www.w3.org/1998/Math/MathML" && currentNode.localName == "annotation-xml" && token.type == "StartTag" && token.name == "svg" || currentNode.isHtmlIntegrationPoint() && token.type in { StartTag: 0, Characters: 0 } || token.type == "EOF") {
              insertionMode = this.insertionMode;
            } else {
              insertionMode = this.insertionModes.inForeignContent;
            }
            switch (token.type) {
              case "Characters":
                var buffer = new CharacterBuffer(token.data);
                insertionMode.processCharacters(buffer);
                break;
              case "Comment":
                insertionMode.processComment(token.data);
                break;
              case "StartTag":
                insertionMode.processStartTag(token.name, token.data, token.selfClosing);
                break;
              case "EndTag":
                insertionMode.processEndTag(token.name);
                break;
              case "Doctype":
                insertionMode.processDoctype(token.name, token.publicId, token.systemId, token.forceQuirks);
                break;
              case "EOF":
                insertionMode.processEOF();
                break;
            }
          };
          TreeBuilder.prototype.isCdataSectionAllowed = function() {
            return this.openElements.length > 0 && this.currentStackItem().isForeign();
          };
          TreeBuilder.prototype.isSelfClosingFlagAcknowledged = function() {
            return this.selfClosingFlagAcknowledged;
          };
          TreeBuilder.prototype.createElement = function(namespaceURI, localName, attributes) {
            throw new Error("Not implemented");
          };
          TreeBuilder.prototype.attachNode = function(child, parent) {
            throw new Error("Not implemented");
          };
          TreeBuilder.prototype.attachNodeToFosterParent = function(child, table, stackParent) {
            throw new Error("Not implemented");
          };
          TreeBuilder.prototype.detachFromParent = function(node) {
            throw new Error("Not implemented");
          };
          TreeBuilder.prototype.addAttributesToElement = function(element, attributes) {
            throw new Error("Not implemented");
          };
          TreeBuilder.prototype.insertHtmlElement = function(attributes) {
            var root = this.createElement("http://www.w3.org/1999/xhtml", "html", attributes);
            this.attachNode(root, this.document);
            this.openElements.pushHtmlElement(new StackItem("http://www.w3.org/1999/xhtml", "html", attributes, root));
            return root;
          };
          TreeBuilder.prototype.insertHeadElement = function(attributes) {
            var element = this.createElement("http://www.w3.org/1999/xhtml", "head", attributes);
            this.head = new StackItem("http://www.w3.org/1999/xhtml", "head", attributes, element);
            this.attachNode(element, this.openElements.top.node);
            this.openElements.pushHeadElement(this.head);
            return element;
          };
          TreeBuilder.prototype.insertBodyElement = function(attributes) {
            var element = this.createElement("http://www.w3.org/1999/xhtml", "body", attributes);
            this.attachNode(element, this.openElements.top.node);
            this.openElements.pushBodyElement(new StackItem("http://www.w3.org/1999/xhtml", "body", attributes, element));
            return element;
          };
          TreeBuilder.prototype.insertIntoFosterParent = function(node) {
            var tableIndex = this.openElements.findIndex("table");
            var tableElement = this.openElements.item(tableIndex).node;
            if (tableIndex === 0)
              return this.attachNode(node, tableElement);
            this.attachNodeToFosterParent(node, tableElement, this.openElements.item(tableIndex - 1).node);
          };
          TreeBuilder.prototype.insertElement = function(name, attributes, namespaceURI, selfClosing) {
            if (!namespaceURI)
              namespaceURI = "http://www.w3.org/1999/xhtml";
            var element = this.createElement(namespaceURI, name, attributes);
            if (this.shouldFosterParent())
              this.insertIntoFosterParent(element);
            else
              this.attachNode(element, this.openElements.top.node);
            if (!selfClosing)
              this.openElements.push(new StackItem(namespaceURI, name, attributes, element));
          };
          TreeBuilder.prototype.insertFormattingElement = function(name, attributes) {
            this.insertElement(name, attributes, "http://www.w3.org/1999/xhtml");
            this.appendElementToActiveFormattingElements(this.currentStackItem());
          };
          TreeBuilder.prototype.insertSelfClosingElement = function(name, attributes) {
            this.selfClosingFlagAcknowledged = true;
            this.insertElement(name, attributes, "http://www.w3.org/1999/xhtml", true);
          };
          TreeBuilder.prototype.insertForeignElement = function(name, attributes, namespaceURI, selfClosing) {
            if (selfClosing)
              this.selfClosingFlagAcknowledged = true;
            this.insertElement(name, attributes, namespaceURI, selfClosing);
          };
          TreeBuilder.prototype.insertComment = function(data, parent) {
            throw new Error("Not implemented");
          };
          TreeBuilder.prototype.insertDoctype = function(name, publicId, systemId) {
            throw new Error("Not implemented");
          };
          TreeBuilder.prototype.insertText = function(data) {
            throw new Error("Not implemented");
          };
          TreeBuilder.prototype.currentStackItem = function() {
            return this.openElements.top;
          };
          TreeBuilder.prototype.popElement = function() {
            return this.openElements.pop();
          };
          TreeBuilder.prototype.shouldFosterParent = function() {
            return this.redirectAttachToFosterParent && this.currentStackItem().isFosterParenting();
          };
          TreeBuilder.prototype.generateImpliedEndTags = function(exclude) {
            var name = this.openElements.top.localName;
            if (["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"].indexOf(name) != -1 && name != exclude) {
              this.popElement();
              this.generateImpliedEndTags(exclude);
            }
          };
          TreeBuilder.prototype.reconstructActiveFormattingElements = function() {
            if (this.activeFormattingElements.length === 0)
              return;
            var i = this.activeFormattingElements.length - 1;
            var entry = this.activeFormattingElements[i];
            if (entry == Marker || this.openElements.contains(entry))
              return;
            while (entry != Marker && !this.openElements.contains(entry)) {
              i -= 1;
              entry = this.activeFormattingElements[i];
              if (!entry)
                break;
            }
            while (true) {
              i += 1;
              entry = this.activeFormattingElements[i];
              this.insertElement(entry.localName, entry.attributes);
              var element = this.currentStackItem();
              this.activeFormattingElements[i] = element;
              if (element == this.activeFormattingElements[this.activeFormattingElements.length - 1])
                break;
            }
          };
          TreeBuilder.prototype.ensureNoahsArkCondition = function(item) {
            var kNoahsArkCapacity = 3;
            if (this.activeFormattingElements.length < kNoahsArkCapacity)
              return;
            var candidates = [];
            var newItemAttributeCount = item.attributes.length;
            for (var i = this.activeFormattingElements.length - 1; i >= 0; i--) {
              var candidate = this.activeFormattingElements[i];
              if (candidate === Marker)
                break;
              if (item.localName !== candidate.localName || item.namespaceURI !== candidate.namespaceURI)
                continue;
              if (candidate.attributes.length != newItemAttributeCount)
                continue;
              candidates.push(candidate);
            }
            if (candidates.length < kNoahsArkCapacity)
              return;
            var remainingCandidates = [];
            var attributes = item.attributes;
            for (var i = 0; i < attributes.length; i++) {
              var attribute = attributes[i];
              for (var j = 0; j < candidates.length; j++) {
                var candidate = candidates[j];
                var candidateAttribute = getAttribute(candidate, attribute.nodeName);
                if (candidateAttribute && candidateAttribute.nodeValue === attribute.nodeValue)
                  remainingCandidates.push(candidate);
              }
              if (remainingCandidates.length < kNoahsArkCapacity)
                return;
              candidates = remainingCandidates;
              remainingCandidates = [];
            }
            for (var i = kNoahsArkCapacity - 1; i < candidates.length; i++)
              this.removeElementFromActiveFormattingElements(candidates[i]);
          };
          TreeBuilder.prototype.appendElementToActiveFormattingElements = function(item) {
            this.ensureNoahsArkCondition(item);
            this.activeFormattingElements.push(item);
          };
          TreeBuilder.prototype.removeElementFromActiveFormattingElements = function(item) {
            var index = this.activeFormattingElements.indexOf(item);
            if (index >= 0)
              this.activeFormattingElements.splice(index, 1);
          };
          TreeBuilder.prototype.elementInActiveFormattingElements = function(name) {
            var els = this.activeFormattingElements;
            for (var i = els.length - 1; i >= 0; i--) {
              if (els[i] == Marker) break;
              if (els[i].localName == name) return els[i];
            }
            return false;
          };
          TreeBuilder.prototype.clearActiveFormattingElements = function() {
            while (!(this.activeFormattingElements.length === 0 || this.activeFormattingElements.pop() == Marker)) ;
          };
          TreeBuilder.prototype.reparentChildren = function(oldParent, newParent) {
            throw new Error("Not implemented");
          };
          TreeBuilder.prototype.setFragmentContext = function(context) {
            this.context = context;
          };
          TreeBuilder.prototype.parseError = function(code, args) {
            if (!this.errorHandler)
              return;
            var message = formatMessage(messages[code], args);
            this.errorHandler.error(message, this.tokenizer._inputStream.location(), code);
          };
          TreeBuilder.prototype.resetInsertionMode = function() {
            var fragmentAssigned = false;
            var node = null;
            for (var i = this.openElements.length - 1; i >= 0; i--) {
              node = this.openElements.item(i);
              if (i === 0) {
                assert.ok(this.context);
                fragmentAssigned = true;
                node = new StackItem("http://www.w3.org/1999/xhtml", this.context, [], null);
              }
              if (node.namespaceURI === "http://www.w3.org/1999/xhtml") {
                if (node.localName === "select")
                  return this.setInsertionMode("inSelect");
                if (node.localName === "td" || node.localName === "th")
                  return this.setInsertionMode("inCell");
                if (node.localName === "tr")
                  return this.setInsertionMode("inRow");
                if (node.localName === "tbody" || node.localName === "thead" || node.localName === "tfoot")
                  return this.setInsertionMode("inTableBody");
                if (node.localName === "caption")
                  return this.setInsertionMode("inCaption");
                if (node.localName === "colgroup")
                  return this.setInsertionMode("inColumnGroup");
                if (node.localName === "table")
                  return this.setInsertionMode("inTable");
                if (node.localName === "head")
                  return this.setInsertionMode("inHead");
                if (node.localName === "body")
                  return this.setInsertionMode("inBody");
                if (node.localName === "frameset")
                  return this.setInsertionMode("inFrameset");
                if (node.localName === "html")
                  if (!this.openElements.headElement)
                    return this.setInsertionMode("beforeHead");
                  else
                    return this.setInsertionMode("afterHead");
              }
              if (fragmentAssigned)
                return this.setInsertionMode("inBody");
            }
          };
          TreeBuilder.prototype.processGenericRCDATAStartTag = function(name, attributes) {
            this.insertElement(name, attributes);
            this.tokenizer.setState(Tokenizer.RCDATA);
            this.originalInsertionMode = this.insertionModeName;
            this.setInsertionMode("text");
          };
          TreeBuilder.prototype.processGenericRawTextStartTag = function(name, attributes) {
            this.insertElement(name, attributes);
            this.tokenizer.setState(Tokenizer.RAWTEXT);
            this.originalInsertionMode = this.insertionModeName;
            this.setInsertionMode("text");
          };
          TreeBuilder.prototype.adjustMathMLAttributes = function(attributes) {
            attributes.forEach(function(a) {
              a.namespaceURI = "http://www.w3.org/1998/Math/MathML";
              if (constants.MATHMLAttributeMap[a.nodeName])
                a.nodeName = constants.MATHMLAttributeMap[a.nodeName];
            });
            return attributes;
          };
          TreeBuilder.prototype.adjustSVGTagNameCase = function(name) {
            return constants.SVGTagMap[name] || name;
          };
          TreeBuilder.prototype.adjustSVGAttributes = function(attributes) {
            attributes.forEach(function(a) {
              a.namespaceURI = "http://www.w3.org/2000/svg";
              if (constants.SVGAttributeMap[a.nodeName])
                a.nodeName = constants.SVGAttributeMap[a.nodeName];
            });
            return attributes;
          };
          TreeBuilder.prototype.adjustForeignAttributes = function(attributes) {
            for (var i = 0; i < attributes.length; i++) {
              var attribute = attributes[i];
              var adjusted = constants.ForeignAttributeMap[attribute.nodeName];
              if (adjusted) {
                attribute.nodeName = adjusted.localName;
                attribute.prefix = adjusted.prefix;
                attribute.namespaceURI = adjusted.namespaceURI;
              }
            }
            return attributes;
          };
          function formatMessage(format, args) {
            return format.replace(new RegExp("{[0-9a-z-]+}", "gi"), function(match) {
              return args[match.slice(1, -1)] || match;
            });
          }
          exports2.TreeBuilder = TreeBuilder;
        },
        { "./ElementStack": 1, "./StackItem": 4, "./Tokenizer": 5, "./constants": 7, "./messages.json": 8, "assert": 13, "events": 16 }
      ],
      7: [
        function(_dereq_, module2, exports2) {
          exports2.SVGTagMap = {
            "altglyph": "altGlyph",
            "altglyphdef": "altGlyphDef",
            "altglyphitem": "altGlyphItem",
            "animatecolor": "animateColor",
            "animatemotion": "animateMotion",
            "animatetransform": "animateTransform",
            "clippath": "clipPath",
            "feblend": "feBlend",
            "fecolormatrix": "feColorMatrix",
            "fecomponenttransfer": "feComponentTransfer",
            "fecomposite": "feComposite",
            "feconvolvematrix": "feConvolveMatrix",
            "fediffuselighting": "feDiffuseLighting",
            "fedisplacementmap": "feDisplacementMap",
            "fedistantlight": "feDistantLight",
            "feflood": "feFlood",
            "fefunca": "feFuncA",
            "fefuncb": "feFuncB",
            "fefuncg": "feFuncG",
            "fefuncr": "feFuncR",
            "fegaussianblur": "feGaussianBlur",
            "feimage": "feImage",
            "femerge": "feMerge",
            "femergenode": "feMergeNode",
            "femorphology": "feMorphology",
            "feoffset": "feOffset",
            "fepointlight": "fePointLight",
            "fespecularlighting": "feSpecularLighting",
            "fespotlight": "feSpotLight",
            "fetile": "feTile",
            "feturbulence": "feTurbulence",
            "foreignobject": "foreignObject",
            "glyphref": "glyphRef",
            "lineargradient": "linearGradient",
            "radialgradient": "radialGradient",
            "textpath": "textPath"
          };
          exports2.MATHMLAttributeMap = {
            definitionurl: "definitionURL"
          };
          exports2.SVGAttributeMap = {
            attributename: "attributeName",
            attributetype: "attributeType",
            basefrequency: "baseFrequency",
            baseprofile: "baseProfile",
            calcmode: "calcMode",
            clippathunits: "clipPathUnits",
            contentscripttype: "contentScriptType",
            contentstyletype: "contentStyleType",
            diffuseconstant: "diffuseConstant",
            edgemode: "edgeMode",
            externalresourcesrequired: "externalResourcesRequired",
            filterres: "filterRes",
            filterunits: "filterUnits",
            glyphref: "glyphRef",
            gradienttransform: "gradientTransform",
            gradientunits: "gradientUnits",
            kernelmatrix: "kernelMatrix",
            kernelunitlength: "kernelUnitLength",
            keypoints: "keyPoints",
            keysplines: "keySplines",
            keytimes: "keyTimes",
            lengthadjust: "lengthAdjust",
            limitingconeangle: "limitingConeAngle",
            markerheight: "markerHeight",
            markerunits: "markerUnits",
            markerwidth: "markerWidth",
            maskcontentunits: "maskContentUnits",
            maskunits: "maskUnits",
            numoctaves: "numOctaves",
            pathlength: "pathLength",
            patterncontentunits: "patternContentUnits",
            patterntransform: "patternTransform",
            patternunits: "patternUnits",
            pointsatx: "pointsAtX",
            pointsaty: "pointsAtY",
            pointsatz: "pointsAtZ",
            preservealpha: "preserveAlpha",
            preserveaspectratio: "preserveAspectRatio",
            primitiveunits: "primitiveUnits",
            refx: "refX",
            refy: "refY",
            repeatcount: "repeatCount",
            repeatdur: "repeatDur",
            requiredextensions: "requiredExtensions",
            requiredfeatures: "requiredFeatures",
            specularconstant: "specularConstant",
            specularexponent: "specularExponent",
            spreadmethod: "spreadMethod",
            startoffset: "startOffset",
            stddeviation: "stdDeviation",
            stitchtiles: "stitchTiles",
            surfacescale: "surfaceScale",
            systemlanguage: "systemLanguage",
            tablevalues: "tableValues",
            targetx: "targetX",
            targety: "targetY",
            textlength: "textLength",
            viewbox: "viewBox",
            viewtarget: "viewTarget",
            xchannelselector: "xChannelSelector",
            ychannelselector: "yChannelSelector",
            zoomandpan: "zoomAndPan"
          };
          exports2.ForeignAttributeMap = {
            "xlink:actuate": { prefix: "xlink", localName: "actuate", namespaceURI: "http://www.w3.org/1999/xlink" },
            "xlink:arcrole": { prefix: "xlink", localName: "arcrole", namespaceURI: "http://www.w3.org/1999/xlink" },
            "xlink:href": { prefix: "xlink", localName: "href", namespaceURI: "http://www.w3.org/1999/xlink" },
            "xlink:role": { prefix: "xlink", localName: "role", namespaceURI: "http://www.w3.org/1999/xlink" },
            "xlink:show": { prefix: "xlink", localName: "show", namespaceURI: "http://www.w3.org/1999/xlink" },
            "xlink:title": { prefix: "xlink", localName: "title", namespaceURI: "http://www.w3.org/1999/xlink" },
            "xlink:type": { prefix: "xlink", localName: "title", namespaceURI: "http://www.w3.org/1999/xlink" },
            "xml:base": { prefix: "xml", localName: "base", namespaceURI: "http://www.w3.org/XML/1998/namespace" },
            "xml:lang": { prefix: "xml", localName: "lang", namespaceURI: "http://www.w3.org/XML/1998/namespace" },
            "xml:space": { prefix: "xml", localName: "space", namespaceURI: "http://www.w3.org/XML/1998/namespace" },
            "xmlns": { prefix: null, localName: "xmlns", namespaceURI: "http://www.w3.org/2000/xmlns/" },
            "xmlns:xlink": { prefix: "xmlns", localName: "xlink", namespaceURI: "http://www.w3.org/2000/xmlns/" }
          };
        },
        {}
      ],
      8: [
        function(_dereq_, module2, exports2) {
          module2.exports = {
            "null-character": "Null character in input stream, replaced with U+FFFD.",
            "invalid-codepoint": "Invalid codepoint in stream",
            "incorrectly-placed-solidus": "Solidus (/) incorrectly placed in tag.",
            "incorrect-cr-newline-entity": "Incorrect CR newline entity, replaced with LF.",
            "illegal-windows-1252-entity": "Entity used with illegal number (windows-1252 reference).",
            "cant-convert-numeric-entity": "Numeric entity couldn't be converted to character (codepoint U+{charAsInt}).",
            "invalid-numeric-entity-replaced": "Numeric entity represents an illegal codepoint. Expanded to the C1 controls range.",
            "numeric-entity-without-semicolon": "Numeric entity didn't end with ';'.",
            "expected-numeric-entity-but-got-eof": "Numeric entity expected. Got end of file instead.",
            "expected-numeric-entity": "Numeric entity expected but none found.",
            "named-entity-without-semicolon": "Named entity didn't end with ';'.",
            "expected-named-entity": "Named entity expected. Got none.",
            "attributes-in-end-tag": "End tag contains unexpected attributes.",
            "self-closing-flag-on-end-tag": "End tag contains unexpected self-closing flag.",
            "bare-less-than-sign-at-eof": "End of file after <.",
            "expected-tag-name-but-got-right-bracket": "Expected tag name. Got '>' instead.",
            "expected-tag-name-but-got-question-mark": "Expected tag name. Got '?' instead. (HTML doesn't support processing instructions.)",
            "expected-tag-name": "Expected tag name. Got something else instead.",
            "expected-closing-tag-but-got-right-bracket": "Expected closing tag. Got '>' instead. Ignoring '</>'.",
            "expected-closing-tag-but-got-eof": "Expected closing tag. Unexpected end of file.",
            "expected-closing-tag-but-got-char": "Expected closing tag. Unexpected character '{data}' found.",
            "eof-in-tag-name": "Unexpected end of file in the tag name.",
            "expected-attribute-name-but-got-eof": "Unexpected end of file. Expected attribute name instead.",
            "eof-in-attribute-name": "Unexpected end of file in attribute name.",
            "invalid-character-in-attribute-name": "Invalid character in attribute name.",
            "duplicate-attribute": "Dropped duplicate attribute '{name}' on tag.",
            "expected-end-of-tag-but-got-eof": "Unexpected end of file. Expected = or end of tag.",
            "expected-attribute-value-but-got-eof": "Unexpected end of file. Expected attribute value.",
            "expected-attribute-value-but-got-right-bracket": "Expected attribute value. Got '>' instead.",
            "unexpected-character-in-unquoted-attribute-value": "Unexpected character in unquoted attribute",
            "invalid-character-after-attribute-name": "Unexpected character after attribute name.",
            "unexpected-character-after-attribute-value": "Unexpected character after attribute value.",
            "eof-in-attribute-value-double-quote": 'Unexpected end of file in attribute value (").',
            "eof-in-attribute-value-single-quote": "Unexpected end of file in attribute value (').",
            "eof-in-attribute-value-no-quotes": "Unexpected end of file in attribute value.",
            "eof-after-attribute-value": "Unexpected end of file after attribute value.",
            "unexpected-eof-after-solidus-in-tag": "Unexpected end of file in tag. Expected >.",
            "unexpected-character-after-solidus-in-tag": "Unexpected character after / in tag. Expected >.",
            "expected-dashes-or-doctype": "Expected '--' or 'DOCTYPE'. Not found.",
            "unexpected-bang-after-double-dash-in-comment": "Unexpected ! after -- in comment.",
            "incorrect-comment": "Incorrect comment.",
            "eof-in-comment": "Unexpected end of file in comment.",
            "eof-in-comment-end-dash": "Unexpected end of file in comment (-).",
            "unexpected-dash-after-double-dash-in-comment": "Unexpected '-' after '--' found in comment.",
            "eof-in-comment-double-dash": "Unexpected end of file in comment (--).",
            "eof-in-comment-end-bang-state": "Unexpected end of file in comment.",
            "unexpected-char-in-comment": "Unexpected character in comment found.",
            "need-space-after-doctype": "No space after literal string 'DOCTYPE'.",
            "expected-doctype-name-but-got-right-bracket": "Unexpected > character. Expected DOCTYPE name.",
            "expected-doctype-name-but-got-eof": "Unexpected end of file. Expected DOCTYPE name.",
            "eof-in-doctype-name": "Unexpected end of file in DOCTYPE name.",
            "eof-in-doctype": "Unexpected end of file in DOCTYPE.",
            "expected-space-or-right-bracket-in-doctype": "Expected space or '>'. Got '{data}'.",
            "unexpected-end-of-doctype": "Unexpected end of DOCTYPE.",
            "unexpected-char-in-doctype": "Unexpected character in DOCTYPE.",
            "eof-in-bogus-doctype": "Unexpected end of file in bogus doctype.",
            "eof-in-innerhtml": "Unexpected EOF in inner html mode.",
            "unexpected-doctype": "Unexpected DOCTYPE. Ignored.",
            "non-html-root": "html needs to be the first start tag.",
            "expected-doctype-but-got-eof": "Unexpected End of file. Expected DOCTYPE.",
            "unknown-doctype": "Erroneous DOCTYPE. Expected <!DOCTYPE html>.",
            "quirky-doctype": "Quirky doctype. Expected <!DOCTYPE html>.",
            "almost-standards-doctype": "Almost standards mode doctype. Expected <!DOCTYPE html>.",
            "obsolete-doctype": "Obsolete doctype. Expected <!DOCTYPE html>.",
            "expected-doctype-but-got-chars": "Non-space characters found without seeing a doctype first. Expected e.g. <!DOCTYPE html>.",
            "expected-doctype-but-got-start-tag": "Start tag seen without seeing a doctype first. Expected e.g. <!DOCTYPE html>.",
            "expected-doctype-but-got-end-tag": "End tag seen without seeing a doctype first. Expected e.g. <!DOCTYPE html>.",
            "end-tag-after-implied-root": "Unexpected end tag ({name}) after the (implied) root element.",
            "expected-named-closing-tag-but-got-eof": "Unexpected end of file. Expected end tag ({name}).",
            "two-heads-are-not-better-than-one": "Unexpected start tag head in existing head. Ignored.",
            "unexpected-end-tag": "Unexpected end tag ({name}). Ignored.",
            "unexpected-implied-end-tag": "End tag {name} implied, but there were open elements.",
            "unexpected-start-tag-out-of-my-head": "Unexpected start tag ({name}) that can be in head. Moved.",
            "unexpected-start-tag": "Unexpected start tag ({name}).",
            "missing-end-tag": "Missing end tag ({name}).",
            "missing-end-tags": "Missing end tags ({name}).",
            "unexpected-start-tag-implies-end-tag": "Unexpected start tag ({startName}) implies end tag ({endName}).",
            "unexpected-start-tag-treated-as": "Unexpected start tag ({originalName}). Treated as {newName}.",
            "deprecated-tag": "Unexpected start tag {name}. Don't use it!",
            "unexpected-start-tag-ignored": "Unexpected start tag {name}. Ignored.",
            "expected-one-end-tag-but-got-another": "Unexpected end tag ({gotName}). Missing end tag ({expectedName}).",
            "end-tag-too-early": "End tag ({name}) seen too early. Expected other end tag.",
            "end-tag-too-early-named": "Unexpected end tag ({gotName}). Expected end tag ({expectedName}.",
            "end-tag-too-early-ignored": "End tag ({name}) seen too early. Ignored.",
            "adoption-agency-1.1": "End tag ({name}) violates step 1, paragraph 1 of the adoption agency algorithm.",
            "adoption-agency-1.2": "End tag ({name}) violates step 1, paragraph 2 of the adoption agency algorithm.",
            "adoption-agency-1.3": "End tag ({name}) violates step 1, paragraph 3 of the adoption agency algorithm.",
            "adoption-agency-4.4": "End tag ({name}) violates step 4, paragraph 4 of the adoption agency algorithm.",
            "unexpected-end-tag-treated-as": "Unexpected end tag ({originalName}). Treated as {newName}.",
            "no-end-tag": "This element ({name}) has no end tag.",
            "unexpected-implied-end-tag-in-table": "Unexpected implied end tag ({name}) in the table phase.",
            "unexpected-implied-end-tag-in-table-body": "Unexpected implied end tag ({name}) in the table body phase.",
            "unexpected-char-implies-table-voodoo": "Unexpected non-space characters in table context caused voodoo mode.",
            "unexpected-hidden-input-in-table": "Unexpected input with type hidden in table context.",
            "unexpected-form-in-table": "Unexpected form in table context.",
            "unexpected-start-tag-implies-table-voodoo": "Unexpected start tag ({name}) in table context caused voodoo mode.",
            "unexpected-end-tag-implies-table-voodoo": "Unexpected end tag ({name}) in table context caused voodoo mode.",
            "unexpected-cell-in-table-body": "Unexpected table cell start tag ({name}) in the table body phase.",
            "unexpected-cell-end-tag": "Got table cell end tag ({name}) while required end tags are missing.",
            "unexpected-end-tag-in-table-body": "Unexpected end tag ({name}) in the table body phase. Ignored.",
            "unexpected-implied-end-tag-in-table-row": "Unexpected implied end tag ({name}) in the table row phase.",
            "unexpected-end-tag-in-table-row": "Unexpected end tag ({name}) in the table row phase. Ignored.",
            "unexpected-select-in-select": "Unexpected select start tag in the select phase treated as select end tag.",
            "unexpected-input-in-select": "Unexpected input start tag in the select phase.",
            "unexpected-start-tag-in-select": "Unexpected start tag token ({name}) in the select phase. Ignored.",
            "unexpected-end-tag-in-select": "Unexpected end tag ({name}) in the select phase. Ignored.",
            "unexpected-table-element-start-tag-in-select-in-table": "Unexpected table element start tag ({name}) in the select in table phase.",
            "unexpected-table-element-end-tag-in-select-in-table": "Unexpected table element end tag ({name}) in the select in table phase.",
            "unexpected-char-after-body": "Unexpected non-space characters in the after body phase.",
            "unexpected-start-tag-after-body": "Unexpected start tag token ({name}) in the after body phase.",
            "unexpected-end-tag-after-body": "Unexpected end tag token ({name}) in the after body phase.",
            "unexpected-char-in-frameset": "Unepxected characters in the frameset phase. Characters ignored.",
            "unexpected-start-tag-in-frameset": "Unexpected start tag token ({name}) in the frameset phase. Ignored.",
            "unexpected-frameset-in-frameset-innerhtml": "Unexpected end tag token (frameset in the frameset phase (innerHTML).",
            "unexpected-end-tag-in-frameset": "Unexpected end tag token ({name}) in the frameset phase. Ignored.",
            "unexpected-char-after-frameset": "Unexpected non-space characters in the after frameset phase. Ignored.",
            "unexpected-start-tag-after-frameset": "Unexpected start tag ({name}) in the after frameset phase. Ignored.",
            "unexpected-end-tag-after-frameset": "Unexpected end tag ({name}) in the after frameset phase. Ignored.",
            "expected-eof-but-got-char": "Unexpected non-space characters. Expected end of file.",
            "expected-eof-but-got-start-tag": "Unexpected start tag ({name}). Expected end of file.",
            "expected-eof-but-got-end-tag": "Unexpected end tag ({name}). Expected end of file.",
            "unexpected-end-table-in-caption": "Unexpected end table tag in caption. Generates implied end caption.",
            "end-html-in-innerhtml": "Unexpected html end tag in inner html mode.",
            "eof-in-table": "Unexpected end of file. Expected table content.",
            "eof-in-script": "Unexpected end of file. Expected script content.",
            "non-void-element-with-trailing-solidus": "Trailing solidus not allowed on element {name}.",
            "unexpected-html-element-in-foreign-content": 'HTML start tag "{name}" in a foreign namespace context.',
            "unexpected-start-tag-in-table": "Unexpected {name}. Expected table content."
          };
        },
        {}
      ],
      9: [
        function(_dereq_, module2, exports2) {
          var SAXTreeBuilder = _dereq_("./SAXTreeBuilder").SAXTreeBuilder;
          var Tokenizer = _dereq_("../Tokenizer").Tokenizer;
          var TreeParser = _dereq_("./TreeParser").TreeParser;
          function SAXParser() {
            this.contentHandler = null;
            this._errorHandler = null;
            this._treeBuilder = new SAXTreeBuilder();
            this._tokenizer = new Tokenizer(this._treeBuilder);
            this._scriptingEnabled = false;
          }
          SAXParser.prototype.parse = function(source, context) {
            if (context) {
              this._treeBuilder.setFragmentContext(context);
            }
            this._tokenizer.tokenize(source);
            var document = this._treeBuilder.document;
            if (document) {
              new TreeParser(this.contentHandler).parse(document);
            }
          };
          SAXParser.prototype.parseFragment = function(source, context) {
            this._treeBuilder.setFragmentContext(context);
            this._tokenizer.tokenize(source);
            var fragment = this._treeBuilder.getFragment();
            if (fragment) {
              new TreeParser(this.contentHandler).parse(fragment);
            }
          };
          Object.defineProperty(SAXParser.prototype, "scriptingEnabled", {
            get: function() {
              return this._scriptingEnabled;
            },
            set: function(value) {
              this._scriptingEnabled = value;
              this._treeBuilder.scriptingEnabled = value;
            }
          });
          Object.defineProperty(SAXParser.prototype, "errorHandler", {
            get: function() {
              return this._errorHandler;
            },
            set: function(value) {
              this._errorHandler = value;
              this._treeBuilder.errorHandler = value;
            }
          });
          exports2.SAXParser = SAXParser;
        },
        { "../Tokenizer": 5, "./SAXTreeBuilder": 10, "./TreeParser": 11 }
      ],
      10: [
        function(_dereq_, module2, exports2) {
          var util = _dereq_("util");
          var TreeBuilder = _dereq_("../TreeBuilder").TreeBuilder;
          function SAXTreeBuilder() {
            TreeBuilder.call(this);
          }
          util.inherits(SAXTreeBuilder, TreeBuilder);
          SAXTreeBuilder.prototype.start = function(tokenizer) {
            this.document = new Document(this.tokenizer);
          };
          SAXTreeBuilder.prototype.end = function() {
            this.document.endLocator = this.tokenizer;
          };
          SAXTreeBuilder.prototype.insertDoctype = function(name, publicId, systemId) {
            var doctype = new DTD(this.tokenizer, name, publicId);
            doctype.endLocator = this.tokenizer;
            this.document.appendChild(doctype);
          };
          SAXTreeBuilder.prototype.createElement = function(namespaceURI, localName, attributes) {
            var element = new Element(this.tokenizer, namespaceURI, localName, localName, attributes || []);
            return element;
          };
          SAXTreeBuilder.prototype.insertComment = function(data, parent) {
            if (!parent)
              parent = this.currentStackItem();
            var comment = new Comment(this.tokenizer, data);
            parent.appendChild(comment);
          };
          SAXTreeBuilder.prototype.appendCharacters = function(parent, data) {
            var text = new Characters(this.tokenizer, data);
            parent.appendChild(text);
          };
          SAXTreeBuilder.prototype.insertText = function(data) {
            if (this.redirectAttachToFosterParent && this.openElements.top.isFosterParenting()) {
              var tableIndex = this.openElements.findIndex("table");
              var tableItem = this.openElements.item(tableIndex);
              var table = tableItem.node;
              if (tableIndex === 0) {
                return this.appendCharacters(table, data);
              }
              var text = new Characters(this.tokenizer, data);
              var parent = table.parentNode;
              if (parent) {
                parent.insertBetween(text, table.previousSibling, table);
                return;
              }
              var stackParent = this.openElements.item(tableIndex - 1).node;
              stackParent.appendChild(text);
              return;
            }
            this.appendCharacters(this.currentStackItem().node, data);
          };
          SAXTreeBuilder.prototype.attachNode = function(node, parent) {
            parent.appendChild(node);
          };
          SAXTreeBuilder.prototype.attachNodeToFosterParent = function(child, table, stackParent) {
            var parent = table.parentNode;
            if (parent)
              parent.insertBetween(child, table.previousSibling, table);
            else
              stackParent.appendChild(child);
          };
          SAXTreeBuilder.prototype.detachFromParent = function(element) {
            element.detach();
          };
          SAXTreeBuilder.prototype.reparentChildren = function(oldParent, newParent) {
            newParent.appendChildren(oldParent.firstChild);
          };
          SAXTreeBuilder.prototype.getFragment = function() {
            var fragment = new DocumentFragment();
            this.reparentChildren(this.openElements.rootNode, fragment);
            return fragment;
          };
          function getAttribute(node, name) {
            for (var i = 0; i < node.attributes.length; i++) {
              var attribute = node.attributes[i];
              if (attribute.nodeName === name)
                return attribute.nodeValue;
            }
          }
          SAXTreeBuilder.prototype.addAttributesToElement = function(element, attributes) {
            for (var i = 0; i < attributes.length; i++) {
              var attribute = attributes[i];
              if (!getAttribute(element, attribute.nodeName))
                element.attributes.push(attribute);
            }
          };
          var NodeType = {
            CDATA: 1,
            CHARACTERS: 2,
            COMMENT: 3,
            DOCUMENT: 4,
            DOCUMENT_FRAGMENT: 5,
            DTD: 6,
            ELEMENT: 7,
            ENTITY: 8,
            IGNORABLE_WHITESPACE: 9,
            PROCESSING_INSTRUCTION: 10,
            SKIPPED_ENTITY: 11
          };
          function Node(locator) {
            if (!locator) {
              this.columnNumber = -1;
              this.lineNumber = -1;
            } else {
              this.columnNumber = locator.columnNumber;
              this.lineNumber = locator.lineNumber;
            }
            this.parentNode = null;
            this.nextSibling = null;
            this.firstChild = null;
          }
          Node.prototype.visit = function(treeParser) {
            throw new Error("Not Implemented");
          };
          Node.prototype.revisit = function(treeParser) {
            return;
          };
          Node.prototype.detach = function() {
            if (this.parentNode !== null) {
              this.parentNode.removeChild(this);
              this.parentNode = null;
            }
          };
          Object.defineProperty(Node.prototype, "previousSibling", {
            get: function() {
              var prev = null;
              var next = this.parentNode.firstChild;
              for (; ; ) {
                if (this == next) {
                  return prev;
                }
                prev = next;
                next = next.nextSibling;
              }
            }
          });
          function ParentNode(locator) {
            Node.call(this, locator);
            this.lastChild = null;
            this._endLocator = null;
          }
          ParentNode.prototype = Object.create(Node.prototype);
          ParentNode.prototype.insertBefore = function(child, sibling) {
            if (!sibling) {
              return this.appendChild(child);
            }
            child.detach();
            child.parentNode = this;
            if (this.firstChild == sibling) {
              child.nextSibling = sibling;
              this.firstChild = child;
            } else {
              var prev = this.firstChild;
              var next = this.firstChild.nextSibling;
              while (next != sibling) {
                prev = next;
                next = next.nextSibling;
              }
              prev.nextSibling = child;
              child.nextSibling = next;
            }
            return child;
          };
          ParentNode.prototype.insertBetween = function(child, prev, next) {
            if (!next) {
              return this.appendChild(child);
            }
            child.detach();
            child.parentNode = this;
            child.nextSibling = next;
            if (!prev) {
              firstChild = child;
            } else {
              prev.nextSibling = child;
            }
            return child;
          };
          ParentNode.prototype.appendChild = function(child) {
            child.detach();
            child.parentNode = this;
            if (!this.firstChild) {
              this.firstChild = child;
            } else {
              this.lastChild.nextSibling = child;
            }
            this.lastChild = child;
            return child;
          };
          ParentNode.prototype.appendChildren = function(parent) {
            var child = parent.firstChild;
            if (!child) {
              return;
            }
            var another = parent;
            if (!this.firstChild) {
              this.firstChild = child;
            } else {
              this.lastChild.nextSibling = child;
            }
            this.lastChild = another.lastChild;
            do {
              child.parentNode = this;
            } while (child = child.nextSibling);
            another.firstChild = null;
            another.lastChild = null;
          };
          ParentNode.prototype.removeChild = function(node) {
            if (this.firstChild == node) {
              this.firstChild = node.nextSibling;
              if (this.lastChild == node) {
                this.lastChild = null;
              }
            } else {
              var prev = this.firstChild;
              var next = this.firstChild.nextSibling;
              while (next != node) {
                prev = next;
                next = next.nextSibling;
              }
              prev.nextSibling = node.nextSibling;
              if (this.lastChild == node) {
                this.lastChild = prev;
              }
            }
            node.parentNode = null;
            return node;
          };
          Object.defineProperty(ParentNode.prototype, "endLocator", {
            get: function() {
              return this._endLocator;
            },
            set: function(endLocator) {
              this._endLocator = {
                lineNumber: endLocator.lineNumber,
                columnNumber: endLocator.columnNumber
              };
            }
          });
          function Document(locator) {
            ParentNode.call(this, locator);
            this.nodeType = NodeType.DOCUMENT;
          }
          Document.prototype = Object.create(ParentNode.prototype);
          Document.prototype.visit = function(treeParser) {
            treeParser.startDocument(this);
          };
          Document.prototype.revisit = function(treeParser) {
            treeParser.endDocument(this.endLocator);
          };
          function DocumentFragment() {
            ParentNode.call(this, new Locator());
            this.nodeType = NodeType.DOCUMENT_FRAGMENT;
          }
          DocumentFragment.prototype = Object.create(ParentNode.prototype);
          DocumentFragment.prototype.visit = function(treeParser) {
          };
          function Element(locator, uri, localName, qName, atts, prefixMappings2) {
            ParentNode.call(this, locator);
            this.uri = uri;
            this.localName = localName;
            this.qName = qName;
            this.attributes = atts;
            this.prefixMappings = prefixMappings2;
            this.nodeType = NodeType.ELEMENT;
          }
          Element.prototype = Object.create(ParentNode.prototype);
          Element.prototype.visit = function(treeParser) {
            if (this.prefixMappings) {
              for (var key in prefixMappings) {
                var mapping = prefixMappings[key];
                treeParser.startPrefixMapping(
                  mapping.getPrefix(),
                  mapping.getUri(),
                  this
                );
              }
            }
            treeParser.startElement(this.uri, this.localName, this.qName, this.attributes, this);
          };
          Element.prototype.revisit = function(treeParser) {
            treeParser.endElement(this.uri, this.localName, this.qName, this.endLocator);
            if (this.prefixMappings) {
              for (var key in prefixMappings) {
                var mapping = prefixMappings[key];
                treeParser.endPrefixMapping(mapping.getPrefix(), this.endLocator);
              }
            }
          };
          function Characters(locator, data) {
            Node.call(this, locator);
            this.data = data;
            this.nodeType = NodeType.CHARACTERS;
          }
          Characters.prototype = Object.create(Node.prototype);
          Characters.prototype.visit = function(treeParser) {
            treeParser.characters(this.data, 0, this.data.length, this);
          };
          function IgnorableWhitespace(locator, data) {
            Node.call(this, locator);
            this.data = data;
            this.nodeType = NodeType.IGNORABLE_WHITESPACE;
          }
          IgnorableWhitespace.prototype = Object.create(Node.prototype);
          IgnorableWhitespace.prototype.visit = function(treeParser) {
            treeParser.ignorableWhitespace(this.data, 0, this.data.length, this);
          };
          function Comment(locator, data) {
            Node.call(this, locator);
            this.data = data;
            this.nodeType = NodeType.COMMENT;
          }
          Comment.prototype = Object.create(Node.prototype);
          Comment.prototype.visit = function(treeParser) {
            treeParser.comment(this.data, 0, this.data.length, this);
          };
          function CDATA(locator) {
            ParentNode.call(this, locator);
            this.nodeType = NodeType.CDATA;
          }
          CDATA.prototype = Object.create(ParentNode.prototype);
          CDATA.prototype.visit = function(treeParser) {
            treeParser.startCDATA(this);
          };
          CDATA.prototype.revisit = function(treeParser) {
            treeParser.endCDATA(this.endLocator);
          };
          function Entity(name) {
            ParentNode.call(this);
            this.name = name;
            this.nodeType = NodeType.ENTITY;
          }
          Entity.prototype = Object.create(ParentNode.prototype);
          Entity.prototype.visit = function(treeParser) {
            treeParser.startEntity(this.name, this);
          };
          Entity.prototype.revisit = function(treeParser) {
            treeParser.endEntity(this.name);
          };
          function SkippedEntity(name) {
            Node.call(this);
            this.name = name;
            this.nodeType = NodeType.SKIPPED_ENTITY;
          }
          SkippedEntity.prototype = Object.create(Node.prototype);
          SkippedEntity.prototype.visit = function(treeParser) {
            treeParser.skippedEntity(this.name, this);
          };
          function ProcessingInstruction(target, data) {
            Node.call(this);
            this.target = target;
            this.data = data;
          }
          ProcessingInstruction.prototype = Object.create(Node.prototype);
          ProcessingInstruction.prototype.visit = function(treeParser) {
            treeParser.processingInstruction(this.target, this.data, this);
          };
          ProcessingInstruction.prototype.getNodeType = function() {
            return NodeType.PROCESSING_INSTRUCTION;
          };
          function DTD(name, publicIdentifier, systemIdentifier) {
            ParentNode.call(this);
            this.name = name;
            this.publicIdentifier = publicIdentifier;
            this.systemIdentifier = systemIdentifier;
            this.nodeType = NodeType.DTD;
          }
          DTD.prototype = Object.create(ParentNode.prototype);
          DTD.prototype.visit = function(treeParser) {
            treeParser.startDTD(this.name, this.publicIdentifier, this.systemIdentifier, this);
          };
          DTD.prototype.revisit = function(treeParser) {
            treeParser.endDTD();
          };
          exports2.SAXTreeBuilder = SAXTreeBuilder;
        },
        { "../TreeBuilder": 6, "util": 20 }
      ],
      11: [
        function(_dereq_, module2, exports2) {
          function TreeParser(contentHandler, lexicalHandler) {
            this.contentHandler;
            this.lexicalHandler;
            this.locatorDelegate;
            if (!contentHandler) {
              throw new IllegalArgumentException("contentHandler was null.");
            }
            this.contentHandler = contentHandler;
            if (!lexicalHandler) {
              this.lexicalHandler = new NullLexicalHandler();
            } else {
              this.lexicalHandler = lexicalHandler;
            }
          }
          TreeParser.prototype.parse = function(node) {
            this.contentHandler.documentLocator = this;
            var current = node;
            var next;
            for (; ; ) {
              current.visit(this);
              if (next = current.firstChild) {
                current = next;
                continue;
              }
              for (; ; ) {
                current.revisit(this);
                if (current == node) {
                  return;
                }
                if (next = current.nextSibling) {
                  current = next;
                  break;
                }
                current = current.parentNode;
              }
            }
          };
          TreeParser.prototype.characters = function(ch, start, length, locator) {
            this.locatorDelegate = locator;
            this.contentHandler.characters(ch, start, length);
          };
          TreeParser.prototype.endDocument = function(locator) {
            this.locatorDelegate = locator;
            this.contentHandler.endDocument();
          };
          TreeParser.prototype.endElement = function(uri, localName, qName, locator) {
            this.locatorDelegate = locator;
            this.contentHandler.endElement(uri, localName, qName);
          };
          TreeParser.prototype.endPrefixMapping = function(prefix, locator) {
            this.locatorDelegate = locator;
            this.contentHandler.endPrefixMapping(prefix);
          };
          TreeParser.prototype.ignorableWhitespace = function(ch, start, length, locator) {
            this.locatorDelegate = locator;
            this.contentHandler.ignorableWhitespace(ch, start, length);
          };
          TreeParser.prototype.processingInstruction = function(target, data, locator) {
            this.locatorDelegate = locator;
            this.contentHandler.processingInstruction(target, data);
          };
          TreeParser.prototype.skippedEntity = function(name, locator) {
            this.locatorDelegate = locator;
            this.contentHandler.skippedEntity(name);
          };
          TreeParser.prototype.startDocument = function(locator) {
            this.locatorDelegate = locator;
            this.contentHandler.startDocument();
          };
          TreeParser.prototype.startElement = function(uri, localName, qName, atts, locator) {
            this.locatorDelegate = locator;
            this.contentHandler.startElement(uri, localName, qName, atts);
          };
          TreeParser.prototype.startPrefixMapping = function(prefix, uri, locator) {
            this.locatorDelegate = locator;
            this.contentHandler.startPrefixMapping(prefix, uri);
          };
          TreeParser.prototype.comment = function(ch, start, length, locator) {
            this.locatorDelegate = locator;
            this.lexicalHandler.comment(ch, start, length);
          };
          TreeParser.prototype.endCDATA = function(locator) {
            this.locatorDelegate = locator;
            this.lexicalHandler.endCDATA();
          };
          TreeParser.prototype.endDTD = function(locator) {
            this.locatorDelegate = locator;
            this.lexicalHandler.endDTD();
          };
          TreeParser.prototype.endEntity = function(name, locator) {
            this.locatorDelegate = locator;
            this.lexicalHandler.endEntity(name);
          };
          TreeParser.prototype.startCDATA = function(locator) {
            this.locatorDelegate = locator;
            this.lexicalHandler.startCDATA();
          };
          TreeParser.prototype.startDTD = function(name, publicId, systemId, locator) {
            this.locatorDelegate = locator;
            this.lexicalHandler.startDTD(name, publicId, systemId);
          };
          TreeParser.prototype.startEntity = function(name, locator) {
            this.locatorDelegate = locator;
            this.lexicalHandler.startEntity(name);
          };
          Object.defineProperty(TreeParser.prototype, "columnNumber", {
            get: function() {
              if (!this.locatorDelegate)
                return -1;
              else
                return this.locatorDelegate.columnNumber;
            }
          });
          Object.defineProperty(TreeParser.prototype, "lineNumber", {
            get: function() {
              if (!this.locatorDelegate)
                return -1;
              else
                return this.locatorDelegate.lineNumber;
            }
          });
          function NullLexicalHandler() {
          }
          NullLexicalHandler.prototype.comment = function() {
          };
          NullLexicalHandler.prototype.endCDATA = function() {
          };
          NullLexicalHandler.prototype.endDTD = function() {
          };
          NullLexicalHandler.prototype.endEntity = function() {
          };
          NullLexicalHandler.prototype.startCDATA = function() {
          };
          NullLexicalHandler.prototype.startDTD = function() {
          };
          NullLexicalHandler.prototype.startEntity = function() {
          };
          exports2.TreeParser = TreeParser;
        },
        {}
      ],
      12: [
        function(_dereq_, module2, exports2) {
          module2.exports = {
            "Aacute;": "Á",
            "Aacute": "Á",
            "aacute;": "á",
            "aacute": "á",
            "Abreve;": "Ă",
            "abreve;": "ă",
            "ac;": "∾",
            "acd;": "∿",
            "acE;": "∾̳",
            "Acirc;": "Â",
            "Acirc": "Â",
            "acirc;": "â",
            "acirc": "â",
            "acute;": "´",
            "acute": "´",
            "Acy;": "А",
            "acy;": "а",
            "AElig;": "Æ",
            "AElig": "Æ",
            "aelig;": "æ",
            "aelig": "æ",
            "af;": "⁡",
            "Afr;": "𝔄",
            "afr;": "𝔞",
            "Agrave;": "À",
            "Agrave": "À",
            "agrave;": "à",
            "agrave": "à",
            "alefsym;": "ℵ",
            "aleph;": "ℵ",
            "Alpha;": "Α",
            "alpha;": "α",
            "Amacr;": "Ā",
            "amacr;": "ā",
            "amalg;": "⨿",
            "amp;": "&",
            "amp": "&",
            "AMP;": "&",
            "AMP": "&",
            "andand;": "⩕",
            "And;": "⩓",
            "and;": "∧",
            "andd;": "⩜",
            "andslope;": "⩘",
            "andv;": "⩚",
            "ang;": "∠",
            "ange;": "⦤",
            "angle;": "∠",
            "angmsdaa;": "⦨",
            "angmsdab;": "⦩",
            "angmsdac;": "⦪",
            "angmsdad;": "⦫",
            "angmsdae;": "⦬",
            "angmsdaf;": "⦭",
            "angmsdag;": "⦮",
            "angmsdah;": "⦯",
            "angmsd;": "∡",
            "angrt;": "∟",
            "angrtvb;": "⊾",
            "angrtvbd;": "⦝",
            "angsph;": "∢",
            "angst;": "Å",
            "angzarr;": "⍼",
            "Aogon;": "Ą",
            "aogon;": "ą",
            "Aopf;": "𝔸",
            "aopf;": "𝕒",
            "apacir;": "⩯",
            "ap;": "≈",
            "apE;": "⩰",
            "ape;": "≊",
            "apid;": "≋",
            "apos;": "'",
            "ApplyFunction;": "⁡",
            "approx;": "≈",
            "approxeq;": "≊",
            "Aring;": "Å",
            "Aring": "Å",
            "aring;": "å",
            "aring": "å",
            "Ascr;": "𝒜",
            "ascr;": "𝒶",
            "Assign;": "≔",
            "ast;": "*",
            "asymp;": "≈",
            "asympeq;": "≍",
            "Atilde;": "Ã",
            "Atilde": "Ã",
            "atilde;": "ã",
            "atilde": "ã",
            "Auml;": "Ä",
            "Auml": "Ä",
            "auml;": "ä",
            "auml": "ä",
            "awconint;": "∳",
            "awint;": "⨑",
            "backcong;": "≌",
            "backepsilon;": "϶",
            "backprime;": "‵",
            "backsim;": "∽",
            "backsimeq;": "⋍",
            "Backslash;": "∖",
            "Barv;": "⫧",
            "barvee;": "⊽",
            "barwed;": "⌅",
            "Barwed;": "⌆",
            "barwedge;": "⌅",
            "bbrk;": "⎵",
            "bbrktbrk;": "⎶",
            "bcong;": "≌",
            "Bcy;": "Б",
            "bcy;": "б",
            "bdquo;": "„",
            "becaus;": "∵",
            "because;": "∵",
            "Because;": "∵",
            "bemptyv;": "⦰",
            "bepsi;": "϶",
            "bernou;": "ℬ",
            "Bernoullis;": "ℬ",
            "Beta;": "Β",
            "beta;": "β",
            "beth;": "ℶ",
            "between;": "≬",
            "Bfr;": "𝔅",
            "bfr;": "𝔟",
            "bigcap;": "⋂",
            "bigcirc;": "◯",
            "bigcup;": "⋃",
            "bigodot;": "⨀",
            "bigoplus;": "⨁",
            "bigotimes;": "⨂",
            "bigsqcup;": "⨆",
            "bigstar;": "★",
            "bigtriangledown;": "▽",
            "bigtriangleup;": "△",
            "biguplus;": "⨄",
            "bigvee;": "⋁",
            "bigwedge;": "⋀",
            "bkarow;": "⤍",
            "blacklozenge;": "⧫",
            "blacksquare;": "▪",
            "blacktriangle;": "▴",
            "blacktriangledown;": "▾",
            "blacktriangleleft;": "◂",
            "blacktriangleright;": "▸",
            "blank;": "␣",
            "blk12;": "▒",
            "blk14;": "░",
            "blk34;": "▓",
            "block;": "█",
            "bne;": "=⃥",
            "bnequiv;": "≡⃥",
            "bNot;": "⫭",
            "bnot;": "⌐",
            "Bopf;": "𝔹",
            "bopf;": "𝕓",
            "bot;": "⊥",
            "bottom;": "⊥",
            "bowtie;": "⋈",
            "boxbox;": "⧉",
            "boxdl;": "┐",
            "boxdL;": "╕",
            "boxDl;": "╖",
            "boxDL;": "╗",
            "boxdr;": "┌",
            "boxdR;": "╒",
            "boxDr;": "╓",
            "boxDR;": "╔",
            "boxh;": "─",
            "boxH;": "═",
            "boxhd;": "┬",
            "boxHd;": "╤",
            "boxhD;": "╥",
            "boxHD;": "╦",
            "boxhu;": "┴",
            "boxHu;": "╧",
            "boxhU;": "╨",
            "boxHU;": "╩",
            "boxminus;": "⊟",
            "boxplus;": "⊞",
            "boxtimes;": "⊠",
            "boxul;": "┘",
            "boxuL;": "╛",
            "boxUl;": "╜",
            "boxUL;": "╝",
            "boxur;": "└",
            "boxuR;": "╘",
            "boxUr;": "╙",
            "boxUR;": "╚",
            "boxv;": "│",
            "boxV;": "║",
            "boxvh;": "┼",
            "boxvH;": "╪",
            "boxVh;": "╫",
            "boxVH;": "╬",
            "boxvl;": "┤",
            "boxvL;": "╡",
            "boxVl;": "╢",
            "boxVL;": "╣",
            "boxvr;": "├",
            "boxvR;": "╞",
            "boxVr;": "╟",
            "boxVR;": "╠",
            "bprime;": "‵",
            "breve;": "˘",
            "Breve;": "˘",
            "brvbar;": "¦",
            "brvbar": "¦",
            "bscr;": "𝒷",
            "Bscr;": "ℬ",
            "bsemi;": "⁏",
            "bsim;": "∽",
            "bsime;": "⋍",
            "bsolb;": "⧅",
            "bsol;": "\\",
            "bsolhsub;": "⟈",
            "bull;": "•",
            "bullet;": "•",
            "bump;": "≎",
            "bumpE;": "⪮",
            "bumpe;": "≏",
            "Bumpeq;": "≎",
            "bumpeq;": "≏",
            "Cacute;": "Ć",
            "cacute;": "ć",
            "capand;": "⩄",
            "capbrcup;": "⩉",
            "capcap;": "⩋",
            "cap;": "∩",
            "Cap;": "⋒",
            "capcup;": "⩇",
            "capdot;": "⩀",
            "CapitalDifferentialD;": "ⅅ",
            "caps;": "∩︀",
            "caret;": "⁁",
            "caron;": "ˇ",
            "Cayleys;": "ℭ",
            "ccaps;": "⩍",
            "Ccaron;": "Č",
            "ccaron;": "č",
            "Ccedil;": "Ç",
            "Ccedil": "Ç",
            "ccedil;": "ç",
            "ccedil": "ç",
            "Ccirc;": "Ĉ",
            "ccirc;": "ĉ",
            "Cconint;": "∰",
            "ccups;": "⩌",
            "ccupssm;": "⩐",
            "Cdot;": "Ċ",
            "cdot;": "ċ",
            "cedil;": "¸",
            "cedil": "¸",
            "Cedilla;": "¸",
            "cemptyv;": "⦲",
            "cent;": "¢",
            "cent": "¢",
            "centerdot;": "·",
            "CenterDot;": "·",
            "cfr;": "𝔠",
            "Cfr;": "ℭ",
            "CHcy;": "Ч",
            "chcy;": "ч",
            "check;": "✓",
            "checkmark;": "✓",
            "Chi;": "Χ",
            "chi;": "χ",
            "circ;": "ˆ",
            "circeq;": "≗",
            "circlearrowleft;": "↺",
            "circlearrowright;": "↻",
            "circledast;": "⊛",
            "circledcirc;": "⊚",
            "circleddash;": "⊝",
            "CircleDot;": "⊙",
            "circledR;": "®",
            "circledS;": "Ⓢ",
            "CircleMinus;": "⊖",
            "CirclePlus;": "⊕",
            "CircleTimes;": "⊗",
            "cir;": "○",
            "cirE;": "⧃",
            "cire;": "≗",
            "cirfnint;": "⨐",
            "cirmid;": "⫯",
            "cirscir;": "⧂",
            "ClockwiseContourIntegral;": "∲",
            "CloseCurlyDoubleQuote;": "”",
            "CloseCurlyQuote;": "’",
            "clubs;": "♣",
            "clubsuit;": "♣",
            "colon;": ":",
            "Colon;": "∷",
            "Colone;": "⩴",
            "colone;": "≔",
            "coloneq;": "≔",
            "comma;": ",",
            "commat;": "@",
            "comp;": "∁",
            "compfn;": "∘",
            "complement;": "∁",
            "complexes;": "ℂ",
            "cong;": "≅",
            "congdot;": "⩭",
            "Congruent;": "≡",
            "conint;": "∮",
            "Conint;": "∯",
            "ContourIntegral;": "∮",
            "copf;": "𝕔",
            "Copf;": "ℂ",
            "coprod;": "∐",
            "Coproduct;": "∐",
            "copy;": "©",
            "copy": "©",
            "COPY;": "©",
            "COPY": "©",
            "copysr;": "℗",
            "CounterClockwiseContourIntegral;": "∳",
            "crarr;": "↵",
            "cross;": "✗",
            "Cross;": "⨯",
            "Cscr;": "𝒞",
            "cscr;": "𝒸",
            "csub;": "⫏",
            "csube;": "⫑",
            "csup;": "⫐",
            "csupe;": "⫒",
            "ctdot;": "⋯",
            "cudarrl;": "⤸",
            "cudarrr;": "⤵",
            "cuepr;": "⋞",
            "cuesc;": "⋟",
            "cularr;": "↶",
            "cularrp;": "⤽",
            "cupbrcap;": "⩈",
            "cupcap;": "⩆",
            "CupCap;": "≍",
            "cup;": "∪",
            "Cup;": "⋓",
            "cupcup;": "⩊",
            "cupdot;": "⊍",
            "cupor;": "⩅",
            "cups;": "∪︀",
            "curarr;": "↷",
            "curarrm;": "⤼",
            "curlyeqprec;": "⋞",
            "curlyeqsucc;": "⋟",
            "curlyvee;": "⋎",
            "curlywedge;": "⋏",
            "curren;": "¤",
            "curren": "¤",
            "curvearrowleft;": "↶",
            "curvearrowright;": "↷",
            "cuvee;": "⋎",
            "cuwed;": "⋏",
            "cwconint;": "∲",
            "cwint;": "∱",
            "cylcty;": "⌭",
            "dagger;": "†",
            "Dagger;": "‡",
            "daleth;": "ℸ",
            "darr;": "↓",
            "Darr;": "↡",
            "dArr;": "⇓",
            "dash;": "‐",
            "Dashv;": "⫤",
            "dashv;": "⊣",
            "dbkarow;": "⤏",
            "dblac;": "˝",
            "Dcaron;": "Ď",
            "dcaron;": "ď",
            "Dcy;": "Д",
            "dcy;": "д",
            "ddagger;": "‡",
            "ddarr;": "⇊",
            "DD;": "ⅅ",
            "dd;": "ⅆ",
            "DDotrahd;": "⤑",
            "ddotseq;": "⩷",
            "deg;": "°",
            "deg": "°",
            "Del;": "∇",
            "Delta;": "Δ",
            "delta;": "δ",
            "demptyv;": "⦱",
            "dfisht;": "⥿",
            "Dfr;": "𝔇",
            "dfr;": "𝔡",
            "dHar;": "⥥",
            "dharl;": "⇃",
            "dharr;": "⇂",
            "DiacriticalAcute;": "´",
            "DiacriticalDot;": "˙",
            "DiacriticalDoubleAcute;": "˝",
            "DiacriticalGrave;": "`",
            "DiacriticalTilde;": "˜",
            "diam;": "⋄",
            "diamond;": "⋄",
            "Diamond;": "⋄",
            "diamondsuit;": "♦",
            "diams;": "♦",
            "die;": "¨",
            "DifferentialD;": "ⅆ",
            "digamma;": "ϝ",
            "disin;": "⋲",
            "div;": "÷",
            "divide;": "÷",
            "divide": "÷",
            "divideontimes;": "⋇",
            "divonx;": "⋇",
            "DJcy;": "Ђ",
            "djcy;": "ђ",
            "dlcorn;": "⌞",
            "dlcrop;": "⌍",
            "dollar;": "$",
            "Dopf;": "𝔻",
            "dopf;": "𝕕",
            "Dot;": "¨",
            "dot;": "˙",
            "DotDot;": "⃜",
            "doteq;": "≐",
            "doteqdot;": "≑",
            "DotEqual;": "≐",
            "dotminus;": "∸",
            "dotplus;": "∔",
            "dotsquare;": "⊡",
            "doublebarwedge;": "⌆",
            "DoubleContourIntegral;": "∯",
            "DoubleDot;": "¨",
            "DoubleDownArrow;": "⇓",
            "DoubleLeftArrow;": "⇐",
            "DoubleLeftRightArrow;": "⇔",
            "DoubleLeftTee;": "⫤",
            "DoubleLongLeftArrow;": "⟸",
            "DoubleLongLeftRightArrow;": "⟺",
            "DoubleLongRightArrow;": "⟹",
            "DoubleRightArrow;": "⇒",
            "DoubleRightTee;": "⊨",
            "DoubleUpArrow;": "⇑",
            "DoubleUpDownArrow;": "⇕",
            "DoubleVerticalBar;": "∥",
            "DownArrowBar;": "⤓",
            "downarrow;": "↓",
            "DownArrow;": "↓",
            "Downarrow;": "⇓",
            "DownArrowUpArrow;": "⇵",
            "DownBreve;": "̑",
            "downdownarrows;": "⇊",
            "downharpoonleft;": "⇃",
            "downharpoonright;": "⇂",
            "DownLeftRightVector;": "⥐",
            "DownLeftTeeVector;": "⥞",
            "DownLeftVectorBar;": "⥖",
            "DownLeftVector;": "↽",
            "DownRightTeeVector;": "⥟",
            "DownRightVectorBar;": "⥗",
            "DownRightVector;": "⇁",
            "DownTeeArrow;": "↧",
            "DownTee;": "⊤",
            "drbkarow;": "⤐",
            "drcorn;": "⌟",
            "drcrop;": "⌌",
            "Dscr;": "𝒟",
            "dscr;": "𝒹",
            "DScy;": "Ѕ",
            "dscy;": "ѕ",
            "dsol;": "⧶",
            "Dstrok;": "Đ",
            "dstrok;": "đ",
            "dtdot;": "⋱",
            "dtri;": "▿",
            "dtrif;": "▾",
            "duarr;": "⇵",
            "duhar;": "⥯",
            "dwangle;": "⦦",
            "DZcy;": "Џ",
            "dzcy;": "џ",
            "dzigrarr;": "⟿",
            "Eacute;": "É",
            "Eacute": "É",
            "eacute;": "é",
            "eacute": "é",
            "easter;": "⩮",
            "Ecaron;": "Ě",
            "ecaron;": "ě",
            "Ecirc;": "Ê",
            "Ecirc": "Ê",
            "ecirc;": "ê",
            "ecirc": "ê",
            "ecir;": "≖",
            "ecolon;": "≕",
            "Ecy;": "Э",
            "ecy;": "э",
            "eDDot;": "⩷",
            "Edot;": "Ė",
            "edot;": "ė",
            "eDot;": "≑",
            "ee;": "ⅇ",
            "efDot;": "≒",
            "Efr;": "𝔈",
            "efr;": "𝔢",
            "eg;": "⪚",
            "Egrave;": "È",
            "Egrave": "È",
            "egrave;": "è",
            "egrave": "è",
            "egs;": "⪖",
            "egsdot;": "⪘",
            "el;": "⪙",
            "Element;": "∈",
            "elinters;": "⏧",
            "ell;": "ℓ",
            "els;": "⪕",
            "elsdot;": "⪗",
            "Emacr;": "Ē",
            "emacr;": "ē",
            "empty;": "∅",
            "emptyset;": "∅",
            "EmptySmallSquare;": "◻",
            "emptyv;": "∅",
            "EmptyVerySmallSquare;": "▫",
            "emsp13;": " ",
            "emsp14;": " ",
            "emsp;": " ",
            "ENG;": "Ŋ",
            "eng;": "ŋ",
            "ensp;": " ",
            "Eogon;": "Ę",
            "eogon;": "ę",
            "Eopf;": "𝔼",
            "eopf;": "𝕖",
            "epar;": "⋕",
            "eparsl;": "⧣",
            "eplus;": "⩱",
            "epsi;": "ε",
            "Epsilon;": "Ε",
            "epsilon;": "ε",
            "epsiv;": "ϵ",
            "eqcirc;": "≖",
            "eqcolon;": "≕",
            "eqsim;": "≂",
            "eqslantgtr;": "⪖",
            "eqslantless;": "⪕",
            "Equal;": "⩵",
            "equals;": "=",
            "EqualTilde;": "≂",
            "equest;": "≟",
            "Equilibrium;": "⇌",
            "equiv;": "≡",
            "equivDD;": "⩸",
            "eqvparsl;": "⧥",
            "erarr;": "⥱",
            "erDot;": "≓",
            "escr;": "ℯ",
            "Escr;": "ℰ",
            "esdot;": "≐",
            "Esim;": "⩳",
            "esim;": "≂",
            "Eta;": "Η",
            "eta;": "η",
            "ETH;": "Ð",
            "ETH": "Ð",
            "eth;": "ð",
            "eth": "ð",
            "Euml;": "Ë",
            "Euml": "Ë",
            "euml;": "ë",
            "euml": "ë",
            "euro;": "€",
            "excl;": "!",
            "exist;": "∃",
            "Exists;": "∃",
            "expectation;": "ℰ",
            "exponentiale;": "ⅇ",
            "ExponentialE;": "ⅇ",
            "fallingdotseq;": "≒",
            "Fcy;": "Ф",
            "fcy;": "ф",
            "female;": "♀",
            "ffilig;": "ﬃ",
            "fflig;": "ﬀ",
            "ffllig;": "ﬄ",
            "Ffr;": "𝔉",
            "ffr;": "𝔣",
            "filig;": "ﬁ",
            "FilledSmallSquare;": "◼",
            "FilledVerySmallSquare;": "▪",
            "fjlig;": "fj",
            "flat;": "♭",
            "fllig;": "ﬂ",
            "fltns;": "▱",
            "fnof;": "ƒ",
            "Fopf;": "𝔽",
            "fopf;": "𝕗",
            "forall;": "∀",
            "ForAll;": "∀",
            "fork;": "⋔",
            "forkv;": "⫙",
            "Fouriertrf;": "ℱ",
            "fpartint;": "⨍",
            "frac12;": "½",
            "frac12": "½",
            "frac13;": "⅓",
            "frac14;": "¼",
            "frac14": "¼",
            "frac15;": "⅕",
            "frac16;": "⅙",
            "frac18;": "⅛",
            "frac23;": "⅔",
            "frac25;": "⅖",
            "frac34;": "¾",
            "frac34": "¾",
            "frac35;": "⅗",
            "frac38;": "⅜",
            "frac45;": "⅘",
            "frac56;": "⅚",
            "frac58;": "⅝",
            "frac78;": "⅞",
            "frasl;": "⁄",
            "frown;": "⌢",
            "fscr;": "𝒻",
            "Fscr;": "ℱ",
            "gacute;": "ǵ",
            "Gamma;": "Γ",
            "gamma;": "γ",
            "Gammad;": "Ϝ",
            "gammad;": "ϝ",
            "gap;": "⪆",
            "Gbreve;": "Ğ",
            "gbreve;": "ğ",
            "Gcedil;": "Ģ",
            "Gcirc;": "Ĝ",
            "gcirc;": "ĝ",
            "Gcy;": "Г",
            "gcy;": "г",
            "Gdot;": "Ġ",
            "gdot;": "ġ",
            "ge;": "≥",
            "gE;": "≧",
            "gEl;": "⪌",
            "gel;": "⋛",
            "geq;": "≥",
            "geqq;": "≧",
            "geqslant;": "⩾",
            "gescc;": "⪩",
            "ges;": "⩾",
            "gesdot;": "⪀",
            "gesdoto;": "⪂",
            "gesdotol;": "⪄",
            "gesl;": "⋛︀",
            "gesles;": "⪔",
            "Gfr;": "𝔊",
            "gfr;": "𝔤",
            "gg;": "≫",
            "Gg;": "⋙",
            "ggg;": "⋙",
            "gimel;": "ℷ",
            "GJcy;": "Ѓ",
            "gjcy;": "ѓ",
            "gla;": "⪥",
            "gl;": "≷",
            "glE;": "⪒",
            "glj;": "⪤",
            "gnap;": "⪊",
            "gnapprox;": "⪊",
            "gne;": "⪈",
            "gnE;": "≩",
            "gneq;": "⪈",
            "gneqq;": "≩",
            "gnsim;": "⋧",
            "Gopf;": "𝔾",
            "gopf;": "𝕘",
            "grave;": "`",
            "GreaterEqual;": "≥",
            "GreaterEqualLess;": "⋛",
            "GreaterFullEqual;": "≧",
            "GreaterGreater;": "⪢",
            "GreaterLess;": "≷",
            "GreaterSlantEqual;": "⩾",
            "GreaterTilde;": "≳",
            "Gscr;": "𝒢",
            "gscr;": "ℊ",
            "gsim;": "≳",
            "gsime;": "⪎",
            "gsiml;": "⪐",
            "gtcc;": "⪧",
            "gtcir;": "⩺",
            "gt;": ">",
            "gt": ">",
            "GT;": ">",
            "GT": ">",
            "Gt;": "≫",
            "gtdot;": "⋗",
            "gtlPar;": "⦕",
            "gtquest;": "⩼",
            "gtrapprox;": "⪆",
            "gtrarr;": "⥸",
            "gtrdot;": "⋗",
            "gtreqless;": "⋛",
            "gtreqqless;": "⪌",
            "gtrless;": "≷",
            "gtrsim;": "≳",
            "gvertneqq;": "≩︀",
            "gvnE;": "≩︀",
            "Hacek;": "ˇ",
            "hairsp;": " ",
            "half;": "½",
            "hamilt;": "ℋ",
            "HARDcy;": "Ъ",
            "hardcy;": "ъ",
            "harrcir;": "⥈",
            "harr;": "↔",
            "hArr;": "⇔",
            "harrw;": "↭",
            "Hat;": "^",
            "hbar;": "ℏ",
            "Hcirc;": "Ĥ",
            "hcirc;": "ĥ",
            "hearts;": "♥",
            "heartsuit;": "♥",
            "hellip;": "…",
            "hercon;": "⊹",
            "hfr;": "𝔥",
            "Hfr;": "ℌ",
            "HilbertSpace;": "ℋ",
            "hksearow;": "⤥",
            "hkswarow;": "⤦",
            "hoarr;": "⇿",
            "homtht;": "∻",
            "hookleftarrow;": "↩",
            "hookrightarrow;": "↪",
            "hopf;": "𝕙",
            "Hopf;": "ℍ",
            "horbar;": "―",
            "HorizontalLine;": "─",
            "hscr;": "𝒽",
            "Hscr;": "ℋ",
            "hslash;": "ℏ",
            "Hstrok;": "Ħ",
            "hstrok;": "ħ",
            "HumpDownHump;": "≎",
            "HumpEqual;": "≏",
            "hybull;": "⁃",
            "hyphen;": "‐",
            "Iacute;": "Í",
            "Iacute": "Í",
            "iacute;": "í",
            "iacute": "í",
            "ic;": "⁣",
            "Icirc;": "Î",
            "Icirc": "Î",
            "icirc;": "î",
            "icirc": "î",
            "Icy;": "И",
            "icy;": "и",
            "Idot;": "İ",
            "IEcy;": "Е",
            "iecy;": "е",
            "iexcl;": "¡",
            "iexcl": "¡",
            "iff;": "⇔",
            "ifr;": "𝔦",
            "Ifr;": "ℑ",
            "Igrave;": "Ì",
            "Igrave": "Ì",
            "igrave;": "ì",
            "igrave": "ì",
            "ii;": "ⅈ",
            "iiiint;": "⨌",
            "iiint;": "∭",
            "iinfin;": "⧜",
            "iiota;": "℩",
            "IJlig;": "Ĳ",
            "ijlig;": "ĳ",
            "Imacr;": "Ī",
            "imacr;": "ī",
            "image;": "ℑ",
            "ImaginaryI;": "ⅈ",
            "imagline;": "ℐ",
            "imagpart;": "ℑ",
            "imath;": "ı",
            "Im;": "ℑ",
            "imof;": "⊷",
            "imped;": "Ƶ",
            "Implies;": "⇒",
            "incare;": "℅",
            "in;": "∈",
            "infin;": "∞",
            "infintie;": "⧝",
            "inodot;": "ı",
            "intcal;": "⊺",
            "int;": "∫",
            "Int;": "∬",
            "integers;": "ℤ",
            "Integral;": "∫",
            "intercal;": "⊺",
            "Intersection;": "⋂",
            "intlarhk;": "⨗",
            "intprod;": "⨼",
            "InvisibleComma;": "⁣",
            "InvisibleTimes;": "⁢",
            "IOcy;": "Ё",
            "iocy;": "ё",
            "Iogon;": "Į",
            "iogon;": "į",
            "Iopf;": "𝕀",
            "iopf;": "𝕚",
            "Iota;": "Ι",
            "iota;": "ι",
            "iprod;": "⨼",
            "iquest;": "¿",
            "iquest": "¿",
            "iscr;": "𝒾",
            "Iscr;": "ℐ",
            "isin;": "∈",
            "isindot;": "⋵",
            "isinE;": "⋹",
            "isins;": "⋴",
            "isinsv;": "⋳",
            "isinv;": "∈",
            "it;": "⁢",
            "Itilde;": "Ĩ",
            "itilde;": "ĩ",
            "Iukcy;": "І",
            "iukcy;": "і",
            "Iuml;": "Ï",
            "Iuml": "Ï",
            "iuml;": "ï",
            "iuml": "ï",
            "Jcirc;": "Ĵ",
            "jcirc;": "ĵ",
            "Jcy;": "Й",
            "jcy;": "й",
            "Jfr;": "𝔍",
            "jfr;": "𝔧",
            "jmath;": "ȷ",
            "Jopf;": "𝕁",
            "jopf;": "𝕛",
            "Jscr;": "𝒥",
            "jscr;": "𝒿",
            "Jsercy;": "Ј",
            "jsercy;": "ј",
            "Jukcy;": "Є",
            "jukcy;": "є",
            "Kappa;": "Κ",
            "kappa;": "κ",
            "kappav;": "ϰ",
            "Kcedil;": "Ķ",
            "kcedil;": "ķ",
            "Kcy;": "К",
            "kcy;": "к",
            "Kfr;": "𝔎",
            "kfr;": "𝔨",
            "kgreen;": "ĸ",
            "KHcy;": "Х",
            "khcy;": "х",
            "KJcy;": "Ќ",
            "kjcy;": "ќ",
            "Kopf;": "𝕂",
            "kopf;": "𝕜",
            "Kscr;": "𝒦",
            "kscr;": "𝓀",
            "lAarr;": "⇚",
            "Lacute;": "Ĺ",
            "lacute;": "ĺ",
            "laemptyv;": "⦴",
            "lagran;": "ℒ",
            "Lambda;": "Λ",
            "lambda;": "λ",
            "lang;": "⟨",
            "Lang;": "⟪",
            "langd;": "⦑",
            "langle;": "⟨",
            "lap;": "⪅",
            "Laplacetrf;": "ℒ",
            "laquo;": "«",
            "laquo": "«",
            "larrb;": "⇤",
            "larrbfs;": "⤟",
            "larr;": "←",
            "Larr;": "↞",
            "lArr;": "⇐",
            "larrfs;": "⤝",
            "larrhk;": "↩",
            "larrlp;": "↫",
            "larrpl;": "⤹",
            "larrsim;": "⥳",
            "larrtl;": "↢",
            "latail;": "⤙",
            "lAtail;": "⤛",
            "lat;": "⪫",
            "late;": "⪭",
            "lates;": "⪭︀",
            "lbarr;": "⤌",
            "lBarr;": "⤎",
            "lbbrk;": "❲",
            "lbrace;": "{",
            "lbrack;": "[",
            "lbrke;": "⦋",
            "lbrksld;": "⦏",
            "lbrkslu;": "⦍",
            "Lcaron;": "Ľ",
            "lcaron;": "ľ",
            "Lcedil;": "Ļ",
            "lcedil;": "ļ",
            "lceil;": "⌈",
            "lcub;": "{",
            "Lcy;": "Л",
            "lcy;": "л",
            "ldca;": "⤶",
            "ldquo;": "“",
            "ldquor;": "„",
            "ldrdhar;": "⥧",
            "ldrushar;": "⥋",
            "ldsh;": "↲",
            "le;": "≤",
            "lE;": "≦",
            "LeftAngleBracket;": "⟨",
            "LeftArrowBar;": "⇤",
            "leftarrow;": "←",
            "LeftArrow;": "←",
            "Leftarrow;": "⇐",
            "LeftArrowRightArrow;": "⇆",
            "leftarrowtail;": "↢",
            "LeftCeiling;": "⌈",
            "LeftDoubleBracket;": "⟦",
            "LeftDownTeeVector;": "⥡",
            "LeftDownVectorBar;": "⥙",
            "LeftDownVector;": "⇃",
            "LeftFloor;": "⌊",
            "leftharpoondown;": "↽",
            "leftharpoonup;": "↼",
            "leftleftarrows;": "⇇",
            "leftrightarrow;": "↔",
            "LeftRightArrow;": "↔",
            "Leftrightarrow;": "⇔",
            "leftrightarrows;": "⇆",
            "leftrightharpoons;": "⇋",
            "leftrightsquigarrow;": "↭",
            "LeftRightVector;": "⥎",
            "LeftTeeArrow;": "↤",
            "LeftTee;": "⊣",
            "LeftTeeVector;": "⥚",
            "leftthreetimes;": "⋋",
            "LeftTriangleBar;": "⧏",
            "LeftTriangle;": "⊲",
            "LeftTriangleEqual;": "⊴",
            "LeftUpDownVector;": "⥑",
            "LeftUpTeeVector;": "⥠",
            "LeftUpVectorBar;": "⥘",
            "LeftUpVector;": "↿",
            "LeftVectorBar;": "⥒",
            "LeftVector;": "↼",
            "lEg;": "⪋",
            "leg;": "⋚",
            "leq;": "≤",
            "leqq;": "≦",
            "leqslant;": "⩽",
            "lescc;": "⪨",
            "les;": "⩽",
            "lesdot;": "⩿",
            "lesdoto;": "⪁",
            "lesdotor;": "⪃",
            "lesg;": "⋚︀",
            "lesges;": "⪓",
            "lessapprox;": "⪅",
            "lessdot;": "⋖",
            "lesseqgtr;": "⋚",
            "lesseqqgtr;": "⪋",
            "LessEqualGreater;": "⋚",
            "LessFullEqual;": "≦",
            "LessGreater;": "≶",
            "lessgtr;": "≶",
            "LessLess;": "⪡",
            "lesssim;": "≲",
            "LessSlantEqual;": "⩽",
            "LessTilde;": "≲",
            "lfisht;": "⥼",
            "lfloor;": "⌊",
            "Lfr;": "𝔏",
            "lfr;": "𝔩",
            "lg;": "≶",
            "lgE;": "⪑",
            "lHar;": "⥢",
            "lhard;": "↽",
            "lharu;": "↼",
            "lharul;": "⥪",
            "lhblk;": "▄",
            "LJcy;": "Љ",
            "ljcy;": "љ",
            "llarr;": "⇇",
            "ll;": "≪",
            "Ll;": "⋘",
            "llcorner;": "⌞",
            "Lleftarrow;": "⇚",
            "llhard;": "⥫",
            "lltri;": "◺",
            "Lmidot;": "Ŀ",
            "lmidot;": "ŀ",
            "lmoustache;": "⎰",
            "lmoust;": "⎰",
            "lnap;": "⪉",
            "lnapprox;": "⪉",
            "lne;": "⪇",
            "lnE;": "≨",
            "lneq;": "⪇",
            "lneqq;": "≨",
            "lnsim;": "⋦",
            "loang;": "⟬",
            "loarr;": "⇽",
            "lobrk;": "⟦",
            "longleftarrow;": "⟵",
            "LongLeftArrow;": "⟵",
            "Longleftarrow;": "⟸",
            "longleftrightarrow;": "⟷",
            "LongLeftRightArrow;": "⟷",
            "Longleftrightarrow;": "⟺",
            "longmapsto;": "⟼",
            "longrightarrow;": "⟶",
            "LongRightArrow;": "⟶",
            "Longrightarrow;": "⟹",
            "looparrowleft;": "↫",
            "looparrowright;": "↬",
            "lopar;": "⦅",
            "Lopf;": "𝕃",
            "lopf;": "𝕝",
            "loplus;": "⨭",
            "lotimes;": "⨴",
            "lowast;": "∗",
            "lowbar;": "_",
            "LowerLeftArrow;": "↙",
            "LowerRightArrow;": "↘",
            "loz;": "◊",
            "lozenge;": "◊",
            "lozf;": "⧫",
            "lpar;": "(",
            "lparlt;": "⦓",
            "lrarr;": "⇆",
            "lrcorner;": "⌟",
            "lrhar;": "⇋",
            "lrhard;": "⥭",
            "lrm;": "‎",
            "lrtri;": "⊿",
            "lsaquo;": "‹",
            "lscr;": "𝓁",
            "Lscr;": "ℒ",
            "lsh;": "↰",
            "Lsh;": "↰",
            "lsim;": "≲",
            "lsime;": "⪍",
            "lsimg;": "⪏",
            "lsqb;": "[",
            "lsquo;": "‘",
            "lsquor;": "‚",
            "Lstrok;": "Ł",
            "lstrok;": "ł",
            "ltcc;": "⪦",
            "ltcir;": "⩹",
            "lt;": "<",
            "lt": "<",
            "LT;": "<",
            "LT": "<",
            "Lt;": "≪",
            "ltdot;": "⋖",
            "lthree;": "⋋",
            "ltimes;": "⋉",
            "ltlarr;": "⥶",
            "ltquest;": "⩻",
            "ltri;": "◃",
            "ltrie;": "⊴",
            "ltrif;": "◂",
            "ltrPar;": "⦖",
            "lurdshar;": "⥊",
            "luruhar;": "⥦",
            "lvertneqq;": "≨︀",
            "lvnE;": "≨︀",
            "macr;": "¯",
            "macr": "¯",
            "male;": "♂",
            "malt;": "✠",
            "maltese;": "✠",
            "Map;": "⤅",
            "map;": "↦",
            "mapsto;": "↦",
            "mapstodown;": "↧",
            "mapstoleft;": "↤",
            "mapstoup;": "↥",
            "marker;": "▮",
            "mcomma;": "⨩",
            "Mcy;": "М",
            "mcy;": "м",
            "mdash;": "—",
            "mDDot;": "∺",
            "measuredangle;": "∡",
            "MediumSpace;": " ",
            "Mellintrf;": "ℳ",
            "Mfr;": "𝔐",
            "mfr;": "𝔪",
            "mho;": "℧",
            "micro;": "µ",
            "micro": "µ",
            "midast;": "*",
            "midcir;": "⫰",
            "mid;": "∣",
            "middot;": "·",
            "middot": "·",
            "minusb;": "⊟",
            "minus;": "−",
            "minusd;": "∸",
            "minusdu;": "⨪",
            "MinusPlus;": "∓",
            "mlcp;": "⫛",
            "mldr;": "…",
            "mnplus;": "∓",
            "models;": "⊧",
            "Mopf;": "𝕄",
            "mopf;": "𝕞",
            "mp;": "∓",
            "mscr;": "𝓂",
            "Mscr;": "ℳ",
            "mstpos;": "∾",
            "Mu;": "Μ",
            "mu;": "μ",
            "multimap;": "⊸",
            "mumap;": "⊸",
            "nabla;": "∇",
            "Nacute;": "Ń",
            "nacute;": "ń",
            "nang;": "∠⃒",
            "nap;": "≉",
            "napE;": "⩰̸",
            "napid;": "≋̸",
            "napos;": "ŉ",
            "napprox;": "≉",
            "natural;": "♮",
            "naturals;": "ℕ",
            "natur;": "♮",
            "nbsp;": " ",
            "nbsp": " ",
            "nbump;": "≎̸",
            "nbumpe;": "≏̸",
            "ncap;": "⩃",
            "Ncaron;": "Ň",
            "ncaron;": "ň",
            "Ncedil;": "Ņ",
            "ncedil;": "ņ",
            "ncong;": "≇",
            "ncongdot;": "⩭̸",
            "ncup;": "⩂",
            "Ncy;": "Н",
            "ncy;": "н",
            "ndash;": "–",
            "nearhk;": "⤤",
            "nearr;": "↗",
            "neArr;": "⇗",
            "nearrow;": "↗",
            "ne;": "≠",
            "nedot;": "≐̸",
            "NegativeMediumSpace;": "​",
            "NegativeThickSpace;": "​",
            "NegativeThinSpace;": "​",
            "NegativeVeryThinSpace;": "​",
            "nequiv;": "≢",
            "nesear;": "⤨",
            "nesim;": "≂̸",
            "NestedGreaterGreater;": "≫",
            "NestedLessLess;": "≪",
            "NewLine;": "\n",
            "nexist;": "∄",
            "nexists;": "∄",
            "Nfr;": "𝔑",
            "nfr;": "𝔫",
            "ngE;": "≧̸",
            "nge;": "≱",
            "ngeq;": "≱",
            "ngeqq;": "≧̸",
            "ngeqslant;": "⩾̸",
            "nges;": "⩾̸",
            "nGg;": "⋙̸",
            "ngsim;": "≵",
            "nGt;": "≫⃒",
            "ngt;": "≯",
            "ngtr;": "≯",
            "nGtv;": "≫̸",
            "nharr;": "↮",
            "nhArr;": "⇎",
            "nhpar;": "⫲",
            "ni;": "∋",
            "nis;": "⋼",
            "nisd;": "⋺",
            "niv;": "∋",
            "NJcy;": "Њ",
            "njcy;": "њ",
            "nlarr;": "↚",
            "nlArr;": "⇍",
            "nldr;": "‥",
            "nlE;": "≦̸",
            "nle;": "≰",
            "nleftarrow;": "↚",
            "nLeftarrow;": "⇍",
            "nleftrightarrow;": "↮",
            "nLeftrightarrow;": "⇎",
            "nleq;": "≰",
            "nleqq;": "≦̸",
            "nleqslant;": "⩽̸",
            "nles;": "⩽̸",
            "nless;": "≮",
            "nLl;": "⋘̸",
            "nlsim;": "≴",
            "nLt;": "≪⃒",
            "nlt;": "≮",
            "nltri;": "⋪",
            "nltrie;": "⋬",
            "nLtv;": "≪̸",
            "nmid;": "∤",
            "NoBreak;": "⁠",
            "NonBreakingSpace;": " ",
            "nopf;": "𝕟",
            "Nopf;": "ℕ",
            "Not;": "⫬",
            "not;": "¬",
            "not": "¬",
            "NotCongruent;": "≢",
            "NotCupCap;": "≭",
            "NotDoubleVerticalBar;": "∦",
            "NotElement;": "∉",
            "NotEqual;": "≠",
            "NotEqualTilde;": "≂̸",
            "NotExists;": "∄",
            "NotGreater;": "≯",
            "NotGreaterEqual;": "≱",
            "NotGreaterFullEqual;": "≧̸",
            "NotGreaterGreater;": "≫̸",
            "NotGreaterLess;": "≹",
            "NotGreaterSlantEqual;": "⩾̸",
            "NotGreaterTilde;": "≵",
            "NotHumpDownHump;": "≎̸",
            "NotHumpEqual;": "≏̸",
            "notin;": "∉",
            "notindot;": "⋵̸",
            "notinE;": "⋹̸",
            "notinva;": "∉",
            "notinvb;": "⋷",
            "notinvc;": "⋶",
            "NotLeftTriangleBar;": "⧏̸",
            "NotLeftTriangle;": "⋪",
            "NotLeftTriangleEqual;": "⋬",
            "NotLess;": "≮",
            "NotLessEqual;": "≰",
            "NotLessGreater;": "≸",
            "NotLessLess;": "≪̸",
            "NotLessSlantEqual;": "⩽̸",
            "NotLessTilde;": "≴",
            "NotNestedGreaterGreater;": "⪢̸",
            "NotNestedLessLess;": "⪡̸",
            "notni;": "∌",
            "notniva;": "∌",
            "notnivb;": "⋾",
            "notnivc;": "⋽",
            "NotPrecedes;": "⊀",
            "NotPrecedesEqual;": "⪯̸",
            "NotPrecedesSlantEqual;": "⋠",
            "NotReverseElement;": "∌",
            "NotRightTriangleBar;": "⧐̸",
            "NotRightTriangle;": "⋫",
            "NotRightTriangleEqual;": "⋭",
            "NotSquareSubset;": "⊏̸",
            "NotSquareSubsetEqual;": "⋢",
            "NotSquareSuperset;": "⊐̸",
            "NotSquareSupersetEqual;": "⋣",
            "NotSubset;": "⊂⃒",
            "NotSubsetEqual;": "⊈",
            "NotSucceeds;": "⊁",
            "NotSucceedsEqual;": "⪰̸",
            "NotSucceedsSlantEqual;": "⋡",
            "NotSucceedsTilde;": "≿̸",
            "NotSuperset;": "⊃⃒",
            "NotSupersetEqual;": "⊉",
            "NotTilde;": "≁",
            "NotTildeEqual;": "≄",
            "NotTildeFullEqual;": "≇",
            "NotTildeTilde;": "≉",
            "NotVerticalBar;": "∤",
            "nparallel;": "∦",
            "npar;": "∦",
            "nparsl;": "⫽⃥",
            "npart;": "∂̸",
            "npolint;": "⨔",
            "npr;": "⊀",
            "nprcue;": "⋠",
            "nprec;": "⊀",
            "npreceq;": "⪯̸",
            "npre;": "⪯̸",
            "nrarrc;": "⤳̸",
            "nrarr;": "↛",
            "nrArr;": "⇏",
            "nrarrw;": "↝̸",
            "nrightarrow;": "↛",
            "nRightarrow;": "⇏",
            "nrtri;": "⋫",
            "nrtrie;": "⋭",
            "nsc;": "⊁",
            "nsccue;": "⋡",
            "nsce;": "⪰̸",
            "Nscr;": "𝒩",
            "nscr;": "𝓃",
            "nshortmid;": "∤",
            "nshortparallel;": "∦",
            "nsim;": "≁",
            "nsime;": "≄",
            "nsimeq;": "≄",
            "nsmid;": "∤",
            "nspar;": "∦",
            "nsqsube;": "⋢",
            "nsqsupe;": "⋣",
            "nsub;": "⊄",
            "nsubE;": "⫅̸",
            "nsube;": "⊈",
            "nsubset;": "⊂⃒",
            "nsubseteq;": "⊈",
            "nsubseteqq;": "⫅̸",
            "nsucc;": "⊁",
            "nsucceq;": "⪰̸",
            "nsup;": "⊅",
            "nsupE;": "⫆̸",
            "nsupe;": "⊉",
            "nsupset;": "⊃⃒",
            "nsupseteq;": "⊉",
            "nsupseteqq;": "⫆̸",
            "ntgl;": "≹",
            "Ntilde;": "Ñ",
            "Ntilde": "Ñ",
            "ntilde;": "ñ",
            "ntilde": "ñ",
            "ntlg;": "≸",
            "ntriangleleft;": "⋪",
            "ntrianglelefteq;": "⋬",
            "ntriangleright;": "⋫",
            "ntrianglerighteq;": "⋭",
            "Nu;": "Ν",
            "nu;": "ν",
            "num;": "#",
            "numero;": "№",
            "numsp;": " ",
            "nvap;": "≍⃒",
            "nvdash;": "⊬",
            "nvDash;": "⊭",
            "nVdash;": "⊮",
            "nVDash;": "⊯",
            "nvge;": "≥⃒",
            "nvgt;": ">⃒",
            "nvHarr;": "⤄",
            "nvinfin;": "⧞",
            "nvlArr;": "⤂",
            "nvle;": "≤⃒",
            "nvlt;": "<⃒",
            "nvltrie;": "⊴⃒",
            "nvrArr;": "⤃",
            "nvrtrie;": "⊵⃒",
            "nvsim;": "∼⃒",
            "nwarhk;": "⤣",
            "nwarr;": "↖",
            "nwArr;": "⇖",
            "nwarrow;": "↖",
            "nwnear;": "⤧",
            "Oacute;": "Ó",
            "Oacute": "Ó",
            "oacute;": "ó",
            "oacute": "ó",
            "oast;": "⊛",
            "Ocirc;": "Ô",
            "Ocirc": "Ô",
            "ocirc;": "ô",
            "ocirc": "ô",
            "ocir;": "⊚",
            "Ocy;": "О",
            "ocy;": "о",
            "odash;": "⊝",
            "Odblac;": "Ő",
            "odblac;": "ő",
            "odiv;": "⨸",
            "odot;": "⊙",
            "odsold;": "⦼",
            "OElig;": "Œ",
            "oelig;": "œ",
            "ofcir;": "⦿",
            "Ofr;": "𝔒",
            "ofr;": "𝔬",
            "ogon;": "˛",
            "Ograve;": "Ò",
            "Ograve": "Ò",
            "ograve;": "ò",
            "ograve": "ò",
            "ogt;": "⧁",
            "ohbar;": "⦵",
            "ohm;": "Ω",
            "oint;": "∮",
            "olarr;": "↺",
            "olcir;": "⦾",
            "olcross;": "⦻",
            "oline;": "‾",
            "olt;": "⧀",
            "Omacr;": "Ō",
            "omacr;": "ō",
            "Omega;": "Ω",
            "omega;": "ω",
            "Omicron;": "Ο",
            "omicron;": "ο",
            "omid;": "⦶",
            "ominus;": "⊖",
            "Oopf;": "𝕆",
            "oopf;": "𝕠",
            "opar;": "⦷",
            "OpenCurlyDoubleQuote;": "“",
            "OpenCurlyQuote;": "‘",
            "operp;": "⦹",
            "oplus;": "⊕",
            "orarr;": "↻",
            "Or;": "⩔",
            "or;": "∨",
            "ord;": "⩝",
            "order;": "ℴ",
            "orderof;": "ℴ",
            "ordf;": "ª",
            "ordf": "ª",
            "ordm;": "º",
            "ordm": "º",
            "origof;": "⊶",
            "oror;": "⩖",
            "orslope;": "⩗",
            "orv;": "⩛",
            "oS;": "Ⓢ",
            "Oscr;": "𝒪",
            "oscr;": "ℴ",
            "Oslash;": "Ø",
            "Oslash": "Ø",
            "oslash;": "ø",
            "oslash": "ø",
            "osol;": "⊘",
            "Otilde;": "Õ",
            "Otilde": "Õ",
            "otilde;": "õ",
            "otilde": "õ",
            "otimesas;": "⨶",
            "Otimes;": "⨷",
            "otimes;": "⊗",
            "Ouml;": "Ö",
            "Ouml": "Ö",
            "ouml;": "ö",
            "ouml": "ö",
            "ovbar;": "⌽",
            "OverBar;": "‾",
            "OverBrace;": "⏞",
            "OverBracket;": "⎴",
            "OverParenthesis;": "⏜",
            "para;": "¶",
            "para": "¶",
            "parallel;": "∥",
            "par;": "∥",
            "parsim;": "⫳",
            "parsl;": "⫽",
            "part;": "∂",
            "PartialD;": "∂",
            "Pcy;": "П",
            "pcy;": "п",
            "percnt;": "%",
            "period;": ".",
            "permil;": "‰",
            "perp;": "⊥",
            "pertenk;": "‱",
            "Pfr;": "𝔓",
            "pfr;": "𝔭",
            "Phi;": "Φ",
            "phi;": "φ",
            "phiv;": "ϕ",
            "phmmat;": "ℳ",
            "phone;": "☎",
            "Pi;": "Π",
            "pi;": "π",
            "pitchfork;": "⋔",
            "piv;": "ϖ",
            "planck;": "ℏ",
            "planckh;": "ℎ",
            "plankv;": "ℏ",
            "plusacir;": "⨣",
            "plusb;": "⊞",
            "pluscir;": "⨢",
            "plus;": "+",
            "plusdo;": "∔",
            "plusdu;": "⨥",
            "pluse;": "⩲",
            "PlusMinus;": "±",
            "plusmn;": "±",
            "plusmn": "±",
            "plussim;": "⨦",
            "plustwo;": "⨧",
            "pm;": "±",
            "Poincareplane;": "ℌ",
            "pointint;": "⨕",
            "popf;": "𝕡",
            "Popf;": "ℙ",
            "pound;": "£",
            "pound": "£",
            "prap;": "⪷",
            "Pr;": "⪻",
            "pr;": "≺",
            "prcue;": "≼",
            "precapprox;": "⪷",
            "prec;": "≺",
            "preccurlyeq;": "≼",
            "Precedes;": "≺",
            "PrecedesEqual;": "⪯",
            "PrecedesSlantEqual;": "≼",
            "PrecedesTilde;": "≾",
            "preceq;": "⪯",
            "precnapprox;": "⪹",
            "precneqq;": "⪵",
            "precnsim;": "⋨",
            "pre;": "⪯",
            "prE;": "⪳",
            "precsim;": "≾",
            "prime;": "′",
            "Prime;": "″",
            "primes;": "ℙ",
            "prnap;": "⪹",
            "prnE;": "⪵",
            "prnsim;": "⋨",
            "prod;": "∏",
            "Product;": "∏",
            "profalar;": "⌮",
            "profline;": "⌒",
            "profsurf;": "⌓",
            "prop;": "∝",
            "Proportional;": "∝",
            "Proportion;": "∷",
            "propto;": "∝",
            "prsim;": "≾",
            "prurel;": "⊰",
            "Pscr;": "𝒫",
            "pscr;": "𝓅",
            "Psi;": "Ψ",
            "psi;": "ψ",
            "puncsp;": " ",
            "Qfr;": "𝔔",
            "qfr;": "𝔮",
            "qint;": "⨌",
            "qopf;": "𝕢",
            "Qopf;": "ℚ",
            "qprime;": "⁗",
            "Qscr;": "𝒬",
            "qscr;": "𝓆",
            "quaternions;": "ℍ",
            "quatint;": "⨖",
            "quest;": "?",
            "questeq;": "≟",
            "quot;": '"',
            "quot": '"',
            "QUOT;": '"',
            "QUOT": '"',
            "rAarr;": "⇛",
            "race;": "∽̱",
            "Racute;": "Ŕ",
            "racute;": "ŕ",
            "radic;": "√",
            "raemptyv;": "⦳",
            "rang;": "⟩",
            "Rang;": "⟫",
            "rangd;": "⦒",
            "range;": "⦥",
            "rangle;": "⟩",
            "raquo;": "»",
            "raquo": "»",
            "rarrap;": "⥵",
            "rarrb;": "⇥",
            "rarrbfs;": "⤠",
            "rarrc;": "⤳",
            "rarr;": "→",
            "Rarr;": "↠",
            "rArr;": "⇒",
            "rarrfs;": "⤞",
            "rarrhk;": "↪",
            "rarrlp;": "↬",
            "rarrpl;": "⥅",
            "rarrsim;": "⥴",
            "Rarrtl;": "⤖",
            "rarrtl;": "↣",
            "rarrw;": "↝",
            "ratail;": "⤚",
            "rAtail;": "⤜",
            "ratio;": "∶",
            "rationals;": "ℚ",
            "rbarr;": "⤍",
            "rBarr;": "⤏",
            "RBarr;": "⤐",
            "rbbrk;": "❳",
            "rbrace;": "}",
            "rbrack;": "]",
            "rbrke;": "⦌",
            "rbrksld;": "⦎",
            "rbrkslu;": "⦐",
            "Rcaron;": "Ř",
            "rcaron;": "ř",
            "Rcedil;": "Ŗ",
            "rcedil;": "ŗ",
            "rceil;": "⌉",
            "rcub;": "}",
            "Rcy;": "Р",
            "rcy;": "р",
            "rdca;": "⤷",
            "rdldhar;": "⥩",
            "rdquo;": "”",
            "rdquor;": "”",
            "rdsh;": "↳",
            "real;": "ℜ",
            "realine;": "ℛ",
            "realpart;": "ℜ",
            "reals;": "ℝ",
            "Re;": "ℜ",
            "rect;": "▭",
            "reg;": "®",
            "reg": "®",
            "REG;": "®",
            "REG": "®",
            "ReverseElement;": "∋",
            "ReverseEquilibrium;": "⇋",
            "ReverseUpEquilibrium;": "⥯",
            "rfisht;": "⥽",
            "rfloor;": "⌋",
            "rfr;": "𝔯",
            "Rfr;": "ℜ",
            "rHar;": "⥤",
            "rhard;": "⇁",
            "rharu;": "⇀",
            "rharul;": "⥬",
            "Rho;": "Ρ",
            "rho;": "ρ",
            "rhov;": "ϱ",
            "RightAngleBracket;": "⟩",
            "RightArrowBar;": "⇥",
            "rightarrow;": "→",
            "RightArrow;": "→",
            "Rightarrow;": "⇒",
            "RightArrowLeftArrow;": "⇄",
            "rightarrowtail;": "↣",
            "RightCeiling;": "⌉",
            "RightDoubleBracket;": "⟧",
            "RightDownTeeVector;": "⥝",
            "RightDownVectorBar;": "⥕",
            "RightDownVector;": "⇂",
            "RightFloor;": "⌋",
            "rightharpoondown;": "⇁",
            "rightharpoonup;": "⇀",
            "rightleftarrows;": "⇄",
            "rightleftharpoons;": "⇌",
            "rightrightarrows;": "⇉",
            "rightsquigarrow;": "↝",
            "RightTeeArrow;": "↦",
            "RightTee;": "⊢",
            "RightTeeVector;": "⥛",
            "rightthreetimes;": "⋌",
            "RightTriangleBar;": "⧐",
            "RightTriangle;": "⊳",
            "RightTriangleEqual;": "⊵",
            "RightUpDownVector;": "⥏",
            "RightUpTeeVector;": "⥜",
            "RightUpVectorBar;": "⥔",
            "RightUpVector;": "↾",
            "RightVectorBar;": "⥓",
            "RightVector;": "⇀",
            "ring;": "˚",
            "risingdotseq;": "≓",
            "rlarr;": "⇄",
            "rlhar;": "⇌",
            "rlm;": "‏",
            "rmoustache;": "⎱",
            "rmoust;": "⎱",
            "rnmid;": "⫮",
            "roang;": "⟭",
            "roarr;": "⇾",
            "robrk;": "⟧",
            "ropar;": "⦆",
            "ropf;": "𝕣",
            "Ropf;": "ℝ",
            "roplus;": "⨮",
            "rotimes;": "⨵",
            "RoundImplies;": "⥰",
            "rpar;": ")",
            "rpargt;": "⦔",
            "rppolint;": "⨒",
            "rrarr;": "⇉",
            "Rrightarrow;": "⇛",
            "rsaquo;": "›",
            "rscr;": "𝓇",
            "Rscr;": "ℛ",
            "rsh;": "↱",
            "Rsh;": "↱",
            "rsqb;": "]",
            "rsquo;": "’",
            "rsquor;": "’",
            "rthree;": "⋌",
            "rtimes;": "⋊",
            "rtri;": "▹",
            "rtrie;": "⊵",
            "rtrif;": "▸",
            "rtriltri;": "⧎",
            "RuleDelayed;": "⧴",
            "ruluhar;": "⥨",
            "rx;": "℞",
            "Sacute;": "Ś",
            "sacute;": "ś",
            "sbquo;": "‚",
            "scap;": "⪸",
            "Scaron;": "Š",
            "scaron;": "š",
            "Sc;": "⪼",
            "sc;": "≻",
            "sccue;": "≽",
            "sce;": "⪰",
            "scE;": "⪴",
            "Scedil;": "Ş",
            "scedil;": "ş",
            "Scirc;": "Ŝ",
            "scirc;": "ŝ",
            "scnap;": "⪺",
            "scnE;": "⪶",
            "scnsim;": "⋩",
            "scpolint;": "⨓",
            "scsim;": "≿",
            "Scy;": "С",
            "scy;": "с",
            "sdotb;": "⊡",
            "sdot;": "⋅",
            "sdote;": "⩦",
            "searhk;": "⤥",
            "searr;": "↘",
            "seArr;": "⇘",
            "searrow;": "↘",
            "sect;": "§",
            "sect": "§",
            "semi;": ";",
            "seswar;": "⤩",
            "setminus;": "∖",
            "setmn;": "∖",
            "sext;": "✶",
            "Sfr;": "𝔖",
            "sfr;": "𝔰",
            "sfrown;": "⌢",
            "sharp;": "♯",
            "SHCHcy;": "Щ",
            "shchcy;": "щ",
            "SHcy;": "Ш",
            "shcy;": "ш",
            "ShortDownArrow;": "↓",
            "ShortLeftArrow;": "←",
            "shortmid;": "∣",
            "shortparallel;": "∥",
            "ShortRightArrow;": "→",
            "ShortUpArrow;": "↑",
            "shy;": "­",
            "shy": "­",
            "Sigma;": "Σ",
            "sigma;": "σ",
            "sigmaf;": "ς",
            "sigmav;": "ς",
            "sim;": "∼",
            "simdot;": "⩪",
            "sime;": "≃",
            "simeq;": "≃",
            "simg;": "⪞",
            "simgE;": "⪠",
            "siml;": "⪝",
            "simlE;": "⪟",
            "simne;": "≆",
            "simplus;": "⨤",
            "simrarr;": "⥲",
            "slarr;": "←",
            "SmallCircle;": "∘",
            "smallsetminus;": "∖",
            "smashp;": "⨳",
            "smeparsl;": "⧤",
            "smid;": "∣",
            "smile;": "⌣",
            "smt;": "⪪",
            "smte;": "⪬",
            "smtes;": "⪬︀",
            "SOFTcy;": "Ь",
            "softcy;": "ь",
            "solbar;": "⌿",
            "solb;": "⧄",
            "sol;": "/",
            "Sopf;": "𝕊",
            "sopf;": "𝕤",
            "spades;": "♠",
            "spadesuit;": "♠",
            "spar;": "∥",
            "sqcap;": "⊓",
            "sqcaps;": "⊓︀",
            "sqcup;": "⊔",
            "sqcups;": "⊔︀",
            "Sqrt;": "√",
            "sqsub;": "⊏",
            "sqsube;": "⊑",
            "sqsubset;": "⊏",
            "sqsubseteq;": "⊑",
            "sqsup;": "⊐",
            "sqsupe;": "⊒",
            "sqsupset;": "⊐",
            "sqsupseteq;": "⊒",
            "square;": "□",
            "Square;": "□",
            "SquareIntersection;": "⊓",
            "SquareSubset;": "⊏",
            "SquareSubsetEqual;": "⊑",
            "SquareSuperset;": "⊐",
            "SquareSupersetEqual;": "⊒",
            "SquareUnion;": "⊔",
            "squarf;": "▪",
            "squ;": "□",
            "squf;": "▪",
            "srarr;": "→",
            "Sscr;": "𝒮",
            "sscr;": "𝓈",
            "ssetmn;": "∖",
            "ssmile;": "⌣",
            "sstarf;": "⋆",
            "Star;": "⋆",
            "star;": "☆",
            "starf;": "★",
            "straightepsilon;": "ϵ",
            "straightphi;": "ϕ",
            "strns;": "¯",
            "sub;": "⊂",
            "Sub;": "⋐",
            "subdot;": "⪽",
            "subE;": "⫅",
            "sube;": "⊆",
            "subedot;": "⫃",
            "submult;": "⫁",
            "subnE;": "⫋",
            "subne;": "⊊",
            "subplus;": "⪿",
            "subrarr;": "⥹",
            "subset;": "⊂",
            "Subset;": "⋐",
            "subseteq;": "⊆",
            "subseteqq;": "⫅",
            "SubsetEqual;": "⊆",
            "subsetneq;": "⊊",
            "subsetneqq;": "⫋",
            "subsim;": "⫇",
            "subsub;": "⫕",
            "subsup;": "⫓",
            "succapprox;": "⪸",
            "succ;": "≻",
            "succcurlyeq;": "≽",
            "Succeeds;": "≻",
            "SucceedsEqual;": "⪰",
            "SucceedsSlantEqual;": "≽",
            "SucceedsTilde;": "≿",
            "succeq;": "⪰",
            "succnapprox;": "⪺",
            "succneqq;": "⪶",
            "succnsim;": "⋩",
            "succsim;": "≿",
            "SuchThat;": "∋",
            "sum;": "∑",
            "Sum;": "∑",
            "sung;": "♪",
            "sup1;": "¹",
            "sup1": "¹",
            "sup2;": "²",
            "sup2": "²",
            "sup3;": "³",
            "sup3": "³",
            "sup;": "⊃",
            "Sup;": "⋑",
            "supdot;": "⪾",
            "supdsub;": "⫘",
            "supE;": "⫆",
            "supe;": "⊇",
            "supedot;": "⫄",
            "Superset;": "⊃",
            "SupersetEqual;": "⊇",
            "suphsol;": "⟉",
            "suphsub;": "⫗",
            "suplarr;": "⥻",
            "supmult;": "⫂",
            "supnE;": "⫌",
            "supne;": "⊋",
            "supplus;": "⫀",
            "supset;": "⊃",
            "Supset;": "⋑",
            "supseteq;": "⊇",
            "supseteqq;": "⫆",
            "supsetneq;": "⊋",
            "supsetneqq;": "⫌",
            "supsim;": "⫈",
            "supsub;": "⫔",
            "supsup;": "⫖",
            "swarhk;": "⤦",
            "swarr;": "↙",
            "swArr;": "⇙",
            "swarrow;": "↙",
            "swnwar;": "⤪",
            "szlig;": "ß",
            "szlig": "ß",
            "Tab;": "	",
            "target;": "⌖",
            "Tau;": "Τ",
            "tau;": "τ",
            "tbrk;": "⎴",
            "Tcaron;": "Ť",
            "tcaron;": "ť",
            "Tcedil;": "Ţ",
            "tcedil;": "ţ",
            "Tcy;": "Т",
            "tcy;": "т",
            "tdot;": "⃛",
            "telrec;": "⌕",
            "Tfr;": "𝔗",
            "tfr;": "𝔱",
            "there4;": "∴",
            "therefore;": "∴",
            "Therefore;": "∴",
            "Theta;": "Θ",
            "theta;": "θ",
            "thetasym;": "ϑ",
            "thetav;": "ϑ",
            "thickapprox;": "≈",
            "thicksim;": "∼",
            "ThickSpace;": "  ",
            "ThinSpace;": " ",
            "thinsp;": " ",
            "thkap;": "≈",
            "thksim;": "∼",
            "THORN;": "Þ",
            "THORN": "Þ",
            "thorn;": "þ",
            "thorn": "þ",
            "tilde;": "˜",
            "Tilde;": "∼",
            "TildeEqual;": "≃",
            "TildeFullEqual;": "≅",
            "TildeTilde;": "≈",
            "timesbar;": "⨱",
            "timesb;": "⊠",
            "times;": "×",
            "times": "×",
            "timesd;": "⨰",
            "tint;": "∭",
            "toea;": "⤨",
            "topbot;": "⌶",
            "topcir;": "⫱",
            "top;": "⊤",
            "Topf;": "𝕋",
            "topf;": "𝕥",
            "topfork;": "⫚",
            "tosa;": "⤩",
            "tprime;": "‴",
            "trade;": "™",
            "TRADE;": "™",
            "triangle;": "▵",
            "triangledown;": "▿",
            "triangleleft;": "◃",
            "trianglelefteq;": "⊴",
            "triangleq;": "≜",
            "triangleright;": "▹",
            "trianglerighteq;": "⊵",
            "tridot;": "◬",
            "trie;": "≜",
            "triminus;": "⨺",
            "TripleDot;": "⃛",
            "triplus;": "⨹",
            "trisb;": "⧍",
            "tritime;": "⨻",
            "trpezium;": "⏢",
            "Tscr;": "𝒯",
            "tscr;": "𝓉",
            "TScy;": "Ц",
            "tscy;": "ц",
            "TSHcy;": "Ћ",
            "tshcy;": "ћ",
            "Tstrok;": "Ŧ",
            "tstrok;": "ŧ",
            "twixt;": "≬",
            "twoheadleftarrow;": "↞",
            "twoheadrightarrow;": "↠",
            "Uacute;": "Ú",
            "Uacute": "Ú",
            "uacute;": "ú",
            "uacute": "ú",
            "uarr;": "↑",
            "Uarr;": "↟",
            "uArr;": "⇑",
            "Uarrocir;": "⥉",
            "Ubrcy;": "Ў",
            "ubrcy;": "ў",
            "Ubreve;": "Ŭ",
            "ubreve;": "ŭ",
            "Ucirc;": "Û",
            "Ucirc": "Û",
            "ucirc;": "û",
            "ucirc": "û",
            "Ucy;": "У",
            "ucy;": "у",
            "udarr;": "⇅",
            "Udblac;": "Ű",
            "udblac;": "ű",
            "udhar;": "⥮",
            "ufisht;": "⥾",
            "Ufr;": "𝔘",
            "ufr;": "𝔲",
            "Ugrave;": "Ù",
            "Ugrave": "Ù",
            "ugrave;": "ù",
            "ugrave": "ù",
            "uHar;": "⥣",
            "uharl;": "↿",
            "uharr;": "↾",
            "uhblk;": "▀",
            "ulcorn;": "⌜",
            "ulcorner;": "⌜",
            "ulcrop;": "⌏",
            "ultri;": "◸",
            "Umacr;": "Ū",
            "umacr;": "ū",
            "uml;": "¨",
            "uml": "¨",
            "UnderBar;": "_",
            "UnderBrace;": "⏟",
            "UnderBracket;": "⎵",
            "UnderParenthesis;": "⏝",
            "Union;": "⋃",
            "UnionPlus;": "⊎",
            "Uogon;": "Ų",
            "uogon;": "ų",
            "Uopf;": "𝕌",
            "uopf;": "𝕦",
            "UpArrowBar;": "⤒",
            "uparrow;": "↑",
            "UpArrow;": "↑",
            "Uparrow;": "⇑",
            "UpArrowDownArrow;": "⇅",
            "updownarrow;": "↕",
            "UpDownArrow;": "↕",
            "Updownarrow;": "⇕",
            "UpEquilibrium;": "⥮",
            "upharpoonleft;": "↿",
            "upharpoonright;": "↾",
            "uplus;": "⊎",
            "UpperLeftArrow;": "↖",
            "UpperRightArrow;": "↗",
            "upsi;": "υ",
            "Upsi;": "ϒ",
            "upsih;": "ϒ",
            "Upsilon;": "Υ",
            "upsilon;": "υ",
            "UpTeeArrow;": "↥",
            "UpTee;": "⊥",
            "upuparrows;": "⇈",
            "urcorn;": "⌝",
            "urcorner;": "⌝",
            "urcrop;": "⌎",
            "Uring;": "Ů",
            "uring;": "ů",
            "urtri;": "◹",
            "Uscr;": "𝒰",
            "uscr;": "𝓊",
            "utdot;": "⋰",
            "Utilde;": "Ũ",
            "utilde;": "ũ",
            "utri;": "▵",
            "utrif;": "▴",
            "uuarr;": "⇈",
            "Uuml;": "Ü",
            "Uuml": "Ü",
            "uuml;": "ü",
            "uuml": "ü",
            "uwangle;": "⦧",
            "vangrt;": "⦜",
            "varepsilon;": "ϵ",
            "varkappa;": "ϰ",
            "varnothing;": "∅",
            "varphi;": "ϕ",
            "varpi;": "ϖ",
            "varpropto;": "∝",
            "varr;": "↕",
            "vArr;": "⇕",
            "varrho;": "ϱ",
            "varsigma;": "ς",
            "varsubsetneq;": "⊊︀",
            "varsubsetneqq;": "⫋︀",
            "varsupsetneq;": "⊋︀",
            "varsupsetneqq;": "⫌︀",
            "vartheta;": "ϑ",
            "vartriangleleft;": "⊲",
            "vartriangleright;": "⊳",
            "vBar;": "⫨",
            "Vbar;": "⫫",
            "vBarv;": "⫩",
            "Vcy;": "В",
            "vcy;": "в",
            "vdash;": "⊢",
            "vDash;": "⊨",
            "Vdash;": "⊩",
            "VDash;": "⊫",
            "Vdashl;": "⫦",
            "veebar;": "⊻",
            "vee;": "∨",
            "Vee;": "⋁",
            "veeeq;": "≚",
            "vellip;": "⋮",
            "verbar;": "|",
            "Verbar;": "‖",
            "vert;": "|",
            "Vert;": "‖",
            "VerticalBar;": "∣",
            "VerticalLine;": "|",
            "VerticalSeparator;": "❘",
            "VerticalTilde;": "≀",
            "VeryThinSpace;": " ",
            "Vfr;": "𝔙",
            "vfr;": "𝔳",
            "vltri;": "⊲",
            "vnsub;": "⊂⃒",
            "vnsup;": "⊃⃒",
            "Vopf;": "𝕍",
            "vopf;": "𝕧",
            "vprop;": "∝",
            "vrtri;": "⊳",
            "Vscr;": "𝒱",
            "vscr;": "𝓋",
            "vsubnE;": "⫋︀",
            "vsubne;": "⊊︀",
            "vsupnE;": "⫌︀",
            "vsupne;": "⊋︀",
            "Vvdash;": "⊪",
            "vzigzag;": "⦚",
            "Wcirc;": "Ŵ",
            "wcirc;": "ŵ",
            "wedbar;": "⩟",
            "wedge;": "∧",
            "Wedge;": "⋀",
            "wedgeq;": "≙",
            "weierp;": "℘",
            "Wfr;": "𝔚",
            "wfr;": "𝔴",
            "Wopf;": "𝕎",
            "wopf;": "𝕨",
            "wp;": "℘",
            "wr;": "≀",
            "wreath;": "≀",
            "Wscr;": "𝒲",
            "wscr;": "𝓌",
            "xcap;": "⋂",
            "xcirc;": "◯",
            "xcup;": "⋃",
            "xdtri;": "▽",
            "Xfr;": "𝔛",
            "xfr;": "𝔵",
            "xharr;": "⟷",
            "xhArr;": "⟺",
            "Xi;": "Ξ",
            "xi;": "ξ",
            "xlarr;": "⟵",
            "xlArr;": "⟸",
            "xmap;": "⟼",
            "xnis;": "⋻",
            "xodot;": "⨀",
            "Xopf;": "𝕏",
            "xopf;": "𝕩",
            "xoplus;": "⨁",
            "xotime;": "⨂",
            "xrarr;": "⟶",
            "xrArr;": "⟹",
            "Xscr;": "𝒳",
            "xscr;": "𝓍",
            "xsqcup;": "⨆",
            "xuplus;": "⨄",
            "xutri;": "△",
            "xvee;": "⋁",
            "xwedge;": "⋀",
            "Yacute;": "Ý",
            "Yacute": "Ý",
            "yacute;": "ý",
            "yacute": "ý",
            "YAcy;": "Я",
            "yacy;": "я",
            "Ycirc;": "Ŷ",
            "ycirc;": "ŷ",
            "Ycy;": "Ы",
            "ycy;": "ы",
            "yen;": "¥",
            "yen": "¥",
            "Yfr;": "𝔜",
            "yfr;": "𝔶",
            "YIcy;": "Ї",
            "yicy;": "ї",
            "Yopf;": "𝕐",
            "yopf;": "𝕪",
            "Yscr;": "𝒴",
            "yscr;": "𝓎",
            "YUcy;": "Ю",
            "yucy;": "ю",
            "yuml;": "ÿ",
            "yuml": "ÿ",
            "Yuml;": "Ÿ",
            "Zacute;": "Ź",
            "zacute;": "ź",
            "Zcaron;": "Ž",
            "zcaron;": "ž",
            "Zcy;": "З",
            "zcy;": "з",
            "Zdot;": "Ż",
            "zdot;": "ż",
            "zeetrf;": "ℨ",
            "ZeroWidthSpace;": "​",
            "Zeta;": "Ζ",
            "zeta;": "ζ",
            "zfr;": "𝔷",
            "Zfr;": "ℨ",
            "ZHcy;": "Ж",
            "zhcy;": "ж",
            "zigrarr;": "⇝",
            "zopf;": "𝕫",
            "Zopf;": "ℤ",
            "Zscr;": "𝒵",
            "zscr;": "𝓏",
            "zwj;": "‍",
            "zwnj;": "‌"
          };
        },
        {}
      ],
      13: [
        function(_dereq_, module2, exports2) {
          var util = _dereq_("util/");
          var pSlice = Array.prototype.slice;
          var hasOwn = Object.prototype.hasOwnProperty;
          var assert = module2.exports = ok;
          assert.AssertionError = function AssertionError(options) {
            this.name = "AssertionError";
            this.actual = options.actual;
            this.expected = options.expected;
            this.operator = options.operator;
            if (options.message) {
              this.message = options.message;
              this.generatedMessage = false;
            } else {
              this.message = getMessage(this);
              this.generatedMessage = true;
            }
            var stackStartFunction = options.stackStartFunction || fail;
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, stackStartFunction);
            } else {
              var err = new Error();
              if (err.stack) {
                var out = err.stack;
                var fn_name = stackStartFunction.name;
                var idx = out.indexOf("\n" + fn_name);
                if (idx >= 0) {
                  var next_line = out.indexOf("\n", idx + 1);
                  out = out.substring(next_line + 1);
                }
                this.stack = out;
              }
            }
          };
          util.inherits(assert.AssertionError, Error);
          function replacer(key, value) {
            if (util.isUndefined(value)) {
              return "" + value;
            }
            if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
              return value.toString();
            }
            if (util.isFunction(value) || util.isRegExp(value)) {
              return value.toString();
            }
            return value;
          }
          function truncate(s, n) {
            if (util.isString(s)) {
              return s.length < n ? s : s.slice(0, n);
            } else {
              return s;
            }
          }
          function getMessage(self2) {
            return truncate(JSON.stringify(self2.actual, replacer), 128) + " " + self2.operator + " " + truncate(JSON.stringify(self2.expected, replacer), 128);
          }
          function fail(actual, expected, message, operator, stackStartFunction) {
            throw new assert.AssertionError({
              message,
              actual,
              expected,
              operator,
              stackStartFunction
            });
          }
          assert.fail = fail;
          function ok(value, message) {
            if (!value) fail(value, true, message, "==", assert.ok);
          }
          assert.ok = ok;
          assert.equal = function equal(actual, expected, message) {
            if (actual != expected) fail(actual, expected, message, "==", assert.equal);
          };
          assert.notEqual = function notEqual(actual, expected, message) {
            if (actual == expected) {
              fail(actual, expected, message, "!=", assert.notEqual);
            }
          };
          assert.deepEqual = function deepEqual(actual, expected, message) {
            if (!_deepEqual(actual, expected)) {
              fail(actual, expected, message, "deepEqual", assert.deepEqual);
            }
          };
          function _deepEqual(actual, expected) {
            if (actual === expected) {
              return true;
            } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
              if (actual.length != expected.length) return false;
              for (var i = 0; i < actual.length; i++) {
                if (actual[i] !== expected[i]) return false;
              }
              return true;
            } else if (util.isDate(actual) && util.isDate(expected)) {
              return actual.getTime() === expected.getTime();
            } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
              return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase;
            } else if (!util.isObject(actual) && !util.isObject(expected)) {
              return actual == expected;
            } else {
              return objEquiv(actual, expected);
            }
          }
          function isArguments(object) {
            return Object.prototype.toString.call(object) == "[object Arguments]";
          }
          function objEquiv(a, b) {
            if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
              return false;
            if (a.prototype !== b.prototype) return false;
            if (isArguments(a)) {
              if (!isArguments(b)) {
                return false;
              }
              a = pSlice.call(a);
              b = pSlice.call(b);
              return _deepEqual(a, b);
            }
            try {
              var ka = objectKeys(a), kb = objectKeys(b), key, i;
            } catch (e) {
              return false;
            }
            if (ka.length != kb.length)
              return false;
            ka.sort();
            kb.sort();
            for (i = ka.length - 1; i >= 0; i--) {
              if (ka[i] != kb[i])
                return false;
            }
            for (i = ka.length - 1; i >= 0; i--) {
              key = ka[i];
              if (!_deepEqual(a[key], b[key])) return false;
            }
            return true;
          }
          assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
            if (_deepEqual(actual, expected)) {
              fail(actual, expected, message, "notDeepEqual", assert.notDeepEqual);
            }
          };
          assert.strictEqual = function strictEqual(actual, expected, message) {
            if (actual !== expected) {
              fail(actual, expected, message, "===", assert.strictEqual);
            }
          };
          assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
            if (actual === expected) {
              fail(actual, expected, message, "!==", assert.notStrictEqual);
            }
          };
          function expectedException(actual, expected) {
            if (!actual || !expected) {
              return false;
            }
            if (Object.prototype.toString.call(expected) == "[object RegExp]") {
              return expected.test(actual);
            } else if (actual instanceof expected) {
              return true;
            } else if (expected.call({}, actual) === true) {
              return true;
            }
            return false;
          }
          function _throws(shouldThrow, block, expected, message) {
            var actual;
            if (util.isString(expected)) {
              message = expected;
              expected = null;
            }
            try {
              block();
            } catch (e) {
              actual = e;
            }
            message = (expected && expected.name ? " (" + expected.name + ")." : ".") + (message ? " " + message : ".");
            if (shouldThrow && !actual) {
              fail(actual, expected, "Missing expected exception" + message);
            }
            if (!shouldThrow && expectedException(actual, expected)) {
              fail(actual, expected, "Got unwanted exception" + message);
            }
            if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
              throw actual;
            }
          }
          assert.throws = function(block, error, message) {
            _throws.apply(this, [true].concat(pSlice.call(arguments)));
          };
          assert.doesNotThrow = function(block, message) {
            _throws.apply(this, [false].concat(pSlice.call(arguments)));
          };
          assert.ifError = function(err) {
            if (err) {
              throw err;
            }
          };
          var objectKeys = Object.keys || function(obj) {
            var keys = [];
            for (var key in obj) {
              if (hasOwn.call(obj, key)) keys.push(key);
            }
            return keys;
          };
        },
        { "util/": 15 }
      ],
      14: [
        function(_dereq_, module2, exports2) {
          module2.exports = function isBuffer(arg) {
            return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
          };
        },
        {}
      ],
      15: [
        function(_dereq_, module2, exports2) {
          (function(process, global) {
            var formatRegExp = /%[sdj%]/g;
            exports2.format = function(f) {
              if (!isString(f)) {
                var objects = [];
                for (var i = 0; i < arguments.length; i++) {
                  objects.push(inspect(arguments[i]));
                }
                return objects.join(" ");
              }
              var i = 1;
              var args = arguments;
              var len = args.length;
              var str = String(f).replace(formatRegExp, function(x2) {
                if (x2 === "%%") return "%";
                if (i >= len) return x2;
                switch (x2) {
                  case "%s":
                    return String(args[i++]);
                  case "%d":
                    return Number(args[i++]);
                  case "%j":
                    try {
                      return JSON.stringify(args[i++]);
                    } catch (_) {
                      return "[Circular]";
                    }
                  default:
                    return x2;
                }
              });
              for (var x = args[i]; i < len; x = args[++i]) {
                if (isNull(x) || !isObject(x)) {
                  str += " " + x;
                } else {
                  str += " " + inspect(x);
                }
              }
              return str;
            };
            exports2.deprecate = function(fn, msg) {
              if (isUndefined(global.process)) {
                return function() {
                  return exports2.deprecate(fn, msg).apply(this, arguments);
                };
              }
              if (process.noDeprecation === true) {
                return fn;
              }
              var warned = false;
              function deprecated() {
                if (!warned) {
                  if (process.throwDeprecation) {
                    throw new Error(msg);
                  } else if (process.traceDeprecation) {
                    console.trace(msg);
                  } else {
                    console.error(msg);
                  }
                  warned = true;
                }
                return fn.apply(this, arguments);
              }
              return deprecated;
            };
            var debugs = {};
            var debugEnviron;
            exports2.debuglog = function(set) {
              if (isUndefined(debugEnviron))
                debugEnviron = process.env.NODE_DEBUG || "";
              set = set.toUpperCase();
              if (!debugs[set]) {
                if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
                  var pid = process.pid;
                  debugs[set] = function() {
                    var msg = exports2.format.apply(exports2, arguments);
                    console.error("%s %d: %s", set, pid, msg);
                  };
                } else {
                  debugs[set] = function() {
                  };
                }
              }
              return debugs[set];
            };
            function inspect(obj, opts) {
              var ctx = {
                seen: [],
                stylize: stylizeNoColor
              };
              if (arguments.length >= 3) ctx.depth = arguments[2];
              if (arguments.length >= 4) ctx.colors = arguments[3];
              if (isBoolean(opts)) {
                ctx.showHidden = opts;
              } else if (opts) {
                exports2._extend(ctx, opts);
              }
              if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
              if (isUndefined(ctx.depth)) ctx.depth = 2;
              if (isUndefined(ctx.colors)) ctx.colors = false;
              if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
              if (ctx.colors) ctx.stylize = stylizeWithColor;
              return formatValue(ctx, obj, ctx.depth);
            }
            exports2.inspect = inspect;
            inspect.colors = {
              "bold": [1, 22],
              "italic": [3, 23],
              "underline": [4, 24],
              "inverse": [7, 27],
              "white": [37, 39],
              "grey": [90, 39],
              "black": [30, 39],
              "blue": [34, 39],
              "cyan": [36, 39],
              "green": [32, 39],
              "magenta": [35, 39],
              "red": [31, 39],
              "yellow": [33, 39]
            };
            inspect.styles = {
              "special": "cyan",
              "number": "yellow",
              "boolean": "yellow",
              "undefined": "grey",
              "null": "bold",
              "string": "green",
              "date": "magenta",
              "regexp": "red"
            };
            function stylizeWithColor(str, styleType) {
              var style = inspect.styles[styleType];
              if (style) {
                return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
              } else {
                return str;
              }
            }
            function stylizeNoColor(str, styleType) {
              return str;
            }
            function arrayToHash(array) {
              var hash = {};
              array.forEach(function(val, idx) {
                hash[val] = true;
              });
              return hash;
            }
            function formatValue(ctx, value, recurseTimes) {
              if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports2.inspect && !(value.constructor && value.constructor.prototype === value)) {
                var ret = value.inspect(recurseTimes, ctx);
                if (!isString(ret)) {
                  ret = formatValue(ctx, ret, recurseTimes);
                }
                return ret;
              }
              var primitive = formatPrimitive(ctx, value);
              if (primitive) {
                return primitive;
              }
              var keys = Object.keys(value);
              var visibleKeys = arrayToHash(keys);
              if (ctx.showHidden) {
                keys = Object.getOwnPropertyNames(value);
              }
              if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
                return formatError(value);
              }
              if (keys.length === 0) {
                if (isFunction(value)) {
                  var name = value.name ? ": " + value.name : "";
                  return ctx.stylize("[Function" + name + "]", "special");
                }
                if (isRegExp(value)) {
                  return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
                }
                if (isDate(value)) {
                  return ctx.stylize(Date.prototype.toString.call(value), "date");
                }
                if (isError(value)) {
                  return formatError(value);
                }
              }
              var base = "", array = false, braces = ["{", "}"];
              if (isArray(value)) {
                array = true;
                braces = ["[", "]"];
              }
              if (isFunction(value)) {
                var n = value.name ? ": " + value.name : "";
                base = " [Function" + n + "]";
              }
              if (isRegExp(value)) {
                base = " " + RegExp.prototype.toString.call(value);
              }
              if (isDate(value)) {
                base = " " + Date.prototype.toUTCString.call(value);
              }
              if (isError(value)) {
                base = " " + formatError(value);
              }
              if (keys.length === 0 && (!array || value.length == 0)) {
                return braces[0] + base + braces[1];
              }
              if (recurseTimes < 0) {
                if (isRegExp(value)) {
                  return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
                } else {
                  return ctx.stylize("[Object]", "special");
                }
              }
              ctx.seen.push(value);
              var output;
              if (array) {
                output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
              } else {
                output = keys.map(function(key) {
                  return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                });
              }
              ctx.seen.pop();
              return reduceToSingleString(output, base, braces);
            }
            function formatPrimitive(ctx, value) {
              if (isUndefined(value))
                return ctx.stylize("undefined", "undefined");
              if (isString(value)) {
                var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                return ctx.stylize(simple, "string");
              }
              if (isNumber(value))
                return ctx.stylize("" + value, "number");
              if (isBoolean(value))
                return ctx.stylize("" + value, "boolean");
              if (isNull(value))
                return ctx.stylize("null", "null");
            }
            function formatError(value) {
              return "[" + Error.prototype.toString.call(value) + "]";
            }
            function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
              var output = [];
              for (var i = 0, l = value.length; i < l; ++i) {
                if (hasOwnProperty(value, String(i))) {
                  output.push(formatProperty(
                    ctx,
                    value,
                    recurseTimes,
                    visibleKeys,
                    String(i),
                    true
                  ));
                } else {
                  output.push("");
                }
              }
              keys.forEach(function(key) {
                if (!key.match(/^\d+$/)) {
                  output.push(formatProperty(
                    ctx,
                    value,
                    recurseTimes,
                    visibleKeys,
                    key,
                    true
                  ));
                }
              });
              return output;
            }
            function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
              var name, str, desc;
              desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
              if (desc.get) {
                if (desc.set) {
                  str = ctx.stylize("[Getter/Setter]", "special");
                } else {
                  str = ctx.stylize("[Getter]", "special");
                }
              } else {
                if (desc.set) {
                  str = ctx.stylize("[Setter]", "special");
                }
              }
              if (!hasOwnProperty(visibleKeys, key)) {
                name = "[" + key + "]";
              }
              if (!str) {
                if (ctx.seen.indexOf(desc.value) < 0) {
                  if (isNull(recurseTimes)) {
                    str = formatValue(ctx, desc.value, null);
                  } else {
                    str = formatValue(ctx, desc.value, recurseTimes - 1);
                  }
                  if (str.indexOf("\n") > -1) {
                    if (array) {
                      str = str.split("\n").map(function(line) {
                        return "  " + line;
                      }).join("\n").substr(2);
                    } else {
                      str = "\n" + str.split("\n").map(function(line) {
                        return "   " + line;
                      }).join("\n");
                    }
                  }
                } else {
                  str = ctx.stylize("[Circular]", "special");
                }
              }
              if (isUndefined(name)) {
                if (array && key.match(/^\d+$/)) {
                  return str;
                }
                name = JSON.stringify("" + key);
                if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                  name = name.substr(1, name.length - 2);
                  name = ctx.stylize(name, "name");
                } else {
                  name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
                  name = ctx.stylize(name, "string");
                }
              }
              return name + ": " + str;
            }
            function reduceToSingleString(output, base, braces) {
              var length = output.reduce(function(prev, cur) {
                if (cur.indexOf("\n") >= 0) ;
                return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
              }, 0);
              if (length > 60) {
                return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
              }
              return braces[0] + base + " " + output.join(", ") + " " + braces[1];
            }
            function isArray(ar) {
              return Array.isArray(ar);
            }
            exports2.isArray = isArray;
            function isBoolean(arg) {
              return typeof arg === "boolean";
            }
            exports2.isBoolean = isBoolean;
            function isNull(arg) {
              return arg === null;
            }
            exports2.isNull = isNull;
            function isNullOrUndefined(arg) {
              return arg == null;
            }
            exports2.isNullOrUndefined = isNullOrUndefined;
            function isNumber(arg) {
              return typeof arg === "number";
            }
            exports2.isNumber = isNumber;
            function isString(arg) {
              return typeof arg === "string";
            }
            exports2.isString = isString;
            function isSymbol(arg) {
              return typeof arg === "symbol";
            }
            exports2.isSymbol = isSymbol;
            function isUndefined(arg) {
              return arg === void 0;
            }
            exports2.isUndefined = isUndefined;
            function isRegExp(re) {
              return isObject(re) && objectToString(re) === "[object RegExp]";
            }
            exports2.isRegExp = isRegExp;
            function isObject(arg) {
              return typeof arg === "object" && arg !== null;
            }
            exports2.isObject = isObject;
            function isDate(d) {
              return isObject(d) && objectToString(d) === "[object Date]";
            }
            exports2.isDate = isDate;
            function isError(e) {
              return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
            }
            exports2.isError = isError;
            function isFunction(arg) {
              return typeof arg === "function";
            }
            exports2.isFunction = isFunction;
            function isPrimitive(arg) {
              return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
              typeof arg === "undefined";
            }
            exports2.isPrimitive = isPrimitive;
            exports2.isBuffer = _dereq_("./support/isBuffer");
            function objectToString(o) {
              return Object.prototype.toString.call(o);
            }
            function pad(n) {
              return n < 10 ? "0" + n.toString(10) : n.toString(10);
            }
            var months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec"
            ];
            function timestamp() {
              var d = /* @__PURE__ */ new Date();
              var time = [
                pad(d.getHours()),
                pad(d.getMinutes()),
                pad(d.getSeconds())
              ].join(":");
              return [d.getDate(), months[d.getMonth()], time].join(" ");
            }
            exports2.log = function() {
              console.log("%s - %s", timestamp(), exports2.format.apply(exports2, arguments));
            };
            exports2.inherits = _dereq_("inherits");
            exports2._extend = function(origin, add) {
              if (!add || !isObject(add)) return origin;
              var keys = Object.keys(add);
              var i = keys.length;
              while (i--) {
                origin[keys[i]] = add[keys[i]];
              }
              return origin;
            };
            function hasOwnProperty(obj, prop) {
              return Object.prototype.hasOwnProperty.call(obj, prop);
            }
          }).call(this, _dereq_("/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"), typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        },
        { "./support/isBuffer": 14, "/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 18, "inherits": 17 }
      ],
      16: [
        function(_dereq_, module2, exports2) {
          function EventEmitter() {
            this._events = this._events || {};
            this._maxListeners = this._maxListeners || void 0;
          }
          module2.exports = EventEmitter;
          EventEmitter.EventEmitter = EventEmitter;
          EventEmitter.prototype._events = void 0;
          EventEmitter.prototype._maxListeners = void 0;
          EventEmitter.defaultMaxListeners = 10;
          EventEmitter.prototype.setMaxListeners = function(n) {
            if (!isNumber(n) || n < 0 || isNaN(n))
              throw TypeError("n must be a positive number");
            this._maxListeners = n;
            return this;
          };
          EventEmitter.prototype.emit = function(type) {
            var er, handler, len, args, i, listeners;
            if (!this._events)
              this._events = {};
            if (type === "error") {
              if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
                er = arguments[1];
                if (er instanceof Error) {
                  throw er;
                } else {
                  throw TypeError('Uncaught, unspecified "error" event.');
                }
              }
            }
            handler = this._events[type];
            if (isUndefined(handler))
              return false;
            if (isFunction(handler)) {
              switch (arguments.length) {
                case 1:
                  handler.call(this);
                  break;
                case 2:
                  handler.call(this, arguments[1]);
                  break;
                case 3:
                  handler.call(this, arguments[1], arguments[2]);
                  break;
                default:
                  len = arguments.length;
                  args = new Array(len - 1);
                  for (i = 1; i < len; i++)
                    args[i - 1] = arguments[i];
                  handler.apply(this, args);
              }
            } else if (isObject(handler)) {
              len = arguments.length;
              args = new Array(len - 1);
              for (i = 1; i < len; i++)
                args[i - 1] = arguments[i];
              listeners = handler.slice();
              len = listeners.length;
              for (i = 0; i < len; i++)
                listeners[i].apply(this, args);
            }
            return true;
          };
          EventEmitter.prototype.addListener = function(type, listener) {
            var m;
            if (!isFunction(listener))
              throw TypeError("listener must be a function");
            if (!this._events)
              this._events = {};
            if (this._events.newListener)
              this.emit(
                "newListener",
                type,
                isFunction(listener.listener) ? listener.listener : listener
              );
            if (!this._events[type])
              this._events[type] = listener;
            else if (isObject(this._events[type]))
              this._events[type].push(listener);
            else
              this._events[type] = [this._events[type], listener];
            if (isObject(this._events[type]) && !this._events[type].warned) {
              var m;
              if (!isUndefined(this._maxListeners)) {
                m = this._maxListeners;
              } else {
                m = EventEmitter.defaultMaxListeners;
              }
              if (m && m > 0 && this._events[type].length > m) {
                this._events[type].warned = true;
                console.error(
                  "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                  this._events[type].length
                );
                console.trace();
              }
            }
            return this;
          };
          EventEmitter.prototype.on = EventEmitter.prototype.addListener;
          EventEmitter.prototype.once = function(type, listener) {
            if (!isFunction(listener))
              throw TypeError("listener must be a function");
            var fired = false;
            function g() {
              this.removeListener(type, g);
              if (!fired) {
                fired = true;
                listener.apply(this, arguments);
              }
            }
            g.listener = listener;
            this.on(type, g);
            return this;
          };
          EventEmitter.prototype.removeListener = function(type, listener) {
            var list, position, length, i;
            if (!isFunction(listener))
              throw TypeError("listener must be a function");
            if (!this._events || !this._events[type])
              return this;
            list = this._events[type];
            length = list.length;
            position = -1;
            if (list === listener || isFunction(list.listener) && list.listener === listener) {
              delete this._events[type];
              if (this._events.removeListener)
                this.emit("removeListener", type, listener);
            } else if (isObject(list)) {
              for (i = length; i-- > 0; ) {
                if (list[i] === listener || list[i].listener && list[i].listener === listener) {
                  position = i;
                  break;
                }
              }
              if (position < 0)
                return this;
              if (list.length === 1) {
                list.length = 0;
                delete this._events[type];
              } else {
                list.splice(position, 1);
              }
              if (this._events.removeListener)
                this.emit("removeListener", type, listener);
            }
            return this;
          };
          EventEmitter.prototype.removeAllListeners = function(type) {
            var key, listeners;
            if (!this._events)
              return this;
            if (!this._events.removeListener) {
              if (arguments.length === 0)
                this._events = {};
              else if (this._events[type])
                delete this._events[type];
              return this;
            }
            if (arguments.length === 0) {
              for (key in this._events) {
                if (key === "removeListener") continue;
                this.removeAllListeners(key);
              }
              this.removeAllListeners("removeListener");
              this._events = {};
              return this;
            }
            listeners = this._events[type];
            if (isFunction(listeners)) {
              this.removeListener(type, listeners);
            } else {
              while (listeners.length)
                this.removeListener(type, listeners[listeners.length - 1]);
            }
            delete this._events[type];
            return this;
          };
          EventEmitter.prototype.listeners = function(type) {
            var ret;
            if (!this._events || !this._events[type])
              ret = [];
            else if (isFunction(this._events[type]))
              ret = [this._events[type]];
            else
              ret = this._events[type].slice();
            return ret;
          };
          EventEmitter.listenerCount = function(emitter, type) {
            var ret;
            if (!emitter._events || !emitter._events[type])
              ret = 0;
            else if (isFunction(emitter._events[type]))
              ret = 1;
            else
              ret = emitter._events[type].length;
            return ret;
          };
          function isFunction(arg) {
            return typeof arg === "function";
          }
          function isNumber(arg) {
            return typeof arg === "number";
          }
          function isObject(arg) {
            return typeof arg === "object" && arg !== null;
          }
          function isUndefined(arg) {
            return arg === void 0;
          }
        },
        {}
      ],
      17: [
        function(_dereq_, module2, exports2) {
          if (typeof Object.create === "function") {
            module2.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                  value: ctor,
                  enumerable: false,
                  writable: true,
                  configurable: true
                }
              });
            };
          } else {
            module2.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              var TempCtor = function() {
              };
              TempCtor.prototype = superCtor.prototype;
              ctor.prototype = new TempCtor();
              ctor.prototype.constructor = ctor;
            };
          }
        },
        {}
      ],
      18: [
        function(_dereq_, module2, exports2) {
          var process = module2.exports = {};
          process.nextTick = function() {
            var canSetImmediate = typeof window !== "undefined" && window.setImmediate;
            var canPost = typeof window !== "undefined" && window.postMessage && window.addEventListener;
            if (canSetImmediate) {
              return function(f) {
                return window.setImmediate(f);
              };
            }
            if (canPost) {
              var queue = [];
              window.addEventListener("message", function(ev) {
                var source = ev.source;
                if ((source === window || source === null) && ev.data === "process-tick") {
                  ev.stopPropagation();
                  if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                  }
                }
              }, true);
              return function nextTick(fn) {
                queue.push(fn);
                window.postMessage("process-tick", "*");
              };
            }
            return function nextTick(fn) {
              setTimeout(fn, 0);
            };
          }();
          process.title = "browser";
          process.browser = true;
          process.env = {};
          process.argv = [];
          function noop() {
          }
          process.on = noop;
          process.once = noop;
          process.off = noop;
          process.emit = noop;
          process.binding = function(name) {
            throw new Error("process.binding is not supported");
          };
          process.cwd = function() {
            return "/";
          };
          process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
          };
        },
        {}
      ],
      19: [
        function(_dereq_, module2, exports2) {
          module2.exports = _dereq_(14);
        },
        {}
      ],
      20: [
        function(_dereq_, module2, exports2) {
          module2.exports = _dereq_(15);
        },
        { "./support/isBuffer": 19, "/usr/local/lib/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js": 18, "inherits": 17 }
      ]
    }, {}, [9])(9);
  });
  ace.define("ace/mode/html_worker", [], function(require2, exports, module) {
    var oop = require2("../lib/oop");
    require2("../lib/lang");
    var Mirror = require2("../worker/mirror").Mirror;
    var SAXParser = require2("./html/saxparser").SAXParser;
    var errorTypes = {
      "expected-doctype-but-got-start-tag": "info",
      "expected-doctype-but-got-chars": "info",
      "non-html-root": "info"
    };
    var Worker = exports.Worker = function(sender) {
      Mirror.call(this, sender);
      this.setTimeout(400);
      this.context = null;
    };
    oop.inherits(Worker, Mirror);
    (function() {
      this.setOptions = function(options) {
        this.context = options.context;
      };
      this.onUpdate = function() {
        var value = this.doc.getValue();
        if (!value)
          return;
        var parser = new SAXParser();
        var errors = [];
        var noop = function() {
        };
        parser.contentHandler = {
          startDocument: noop,
          endDocument: noop,
          startElement: noop,
          endElement: noop,
          characters: noop
        };
        parser.errorHandler = {
          error: function(message, location, code) {
            errors.push({
              row: location.line,
              column: location.column,
              text: message,
              type: errorTypes[code] || "error"
            });
          }
        };
        parser.parse(value, this.context);
        this.sender.emit("error", errors);
      };
    }).call(Worker.prototype);
  });
  return workerHtml$2;
}
var workerHtmlExports = requireWorkerHtml();
const workerHtml = /* @__PURE__ */ getDefaultExportFromCjs(workerHtmlExports);
const workerHtml$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: workerHtml
}, [workerHtmlExports]);
export {
  workerHtml$1 as w
};
