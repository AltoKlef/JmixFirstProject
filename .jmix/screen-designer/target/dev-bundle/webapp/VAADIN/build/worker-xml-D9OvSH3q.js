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
var workerXml$2 = {};
var hasRequiredWorkerXml;
function requireWorkerXml() {
  if (hasRequiredWorkerXml) return workerXml$2;
  hasRequiredWorkerXml = 1;
  !function(window) {
    if (typeof window.window != "undefined" && window.document)
      return;
    if (window.require && window.define)
      return;
    if (!window.console) {
      window.console = function() {
        var msgs = Array.prototype.slice.call(arguments, 0);
        postMessage({ type: "log", data: msgs });
      };
      window.console.error = window.console.warn = window.console.log = window.console.trace = window.console;
    }
    window.window = window;
    window.ace = window;
    window.onerror = function(message, file, line, col, err) {
      postMessage({ type: "error", data: {
        message,
        data: err && err.data,
        file,
        line,
        col,
        stack: err && err.stack
      } });
    };
    window.normalizeModule = function(parentId, moduleName) {
      if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return window.normalizeModule(parentId, chunks[0]) + "!" + window.normalizeModule(parentId, chunks[1]);
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
    window.require = function require2(parentId, id) {
      if (!id) {
        id = parentId;
        parentId = null;
      }
      if (!id.charAt)
        throw new Error("worker.js require() accepts only (parentId, id) as arguments");
      id = window.normalizeModule(parentId, id);
      var module = window.require.modules[id];
      if (module) {
        if (!module.initialized) {
          module.initialized = true;
          module.exports = module.factory().exports;
        }
        return module.exports;
      }
      if (!window.require.tlns)
        return console.log("unable to load " + id);
      var path = resolveModuleId(id, window.require.tlns);
      if (path.slice(-3) != ".js") path += ".js";
      window.require.id = id;
      window.require.modules[id] = {};
      importScripts(path);
      return window.require(parentId, id);
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
    window.require.modules = {};
    window.require.tlns = {};
    window.define = function(id, deps, factory) {
      if (arguments.length == 2) {
        factory = deps;
        if (typeof id != "string") {
          deps = id;
          id = window.require.id;
        }
      } else if (arguments.length == 1) {
        factory = id;
        deps = [];
        id = window.require.id;
      }
      if (typeof factory != "function") {
        window.require.modules[id] = {
          exports: factory,
          initialized: true
        };
        return;
      }
      if (!deps.length)
        deps = ["require", "exports", "module"];
      var req = function(childId) {
        return window.require(id, childId);
      };
      window.require.modules[id] = {
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
    window.define.amd = {};
    window.require.tlns = {};
    window.initBaseUrls = function initBaseUrls(topLevelNamespaces) {
      for (var i in topLevelNamespaces)
        this.require.tlns[i] = topLevelNamespaces[i];
    };
    window.initSender = function initSender() {
      var EventEmitter = window.require("ace/lib/event_emitter").EventEmitter;
      var oop = window.require("ace/lib/oop");
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
    var main = window.main = null;
    var sender = window.sender = null;
    window.onmessage = function(e) {
      var msg = e.data;
      if (msg.event && sender) {
        sender._signal(msg.event, msg.data);
      } else if (msg.command) {
        if (main[msg.command])
          main[msg.command].apply(main, msg.args);
        else if (window[msg.command])
          window[msg.command].apply(window, msg.args);
        else
          throw new Error("Unknown command:" + msg.command);
      } else if (msg.init) {
        window.initBaseUrls(msg.tlns);
        sender = window.sender = window.initSender();
        var clazz = this.require(msg.module)[msg.classname];
        main = window.main = new clazz(sender);
      }
    };
  }(workerXml$2);
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
    exports.arrayRemove = function(array, value2) {
      for (var i = 0; i <= array.length; i++) {
        if (value2 === array[i]) {
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
      this.setValue = function(value2) {
        this.doc.setValue(value2);
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
  ace.define("ace/mode/xml/sax", [], function(require2, exports, module) {
    var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
    var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "·̀-ͯ\\ux203F-⁀]");
    var tagNamePattern = new RegExp("^" + nameStartChar.source + nameChar.source + "*(?::" + nameStartChar.source + nameChar.source + "*)?$");
    var S_TAG = 0;
    var S_ATTR = 1;
    var S_ATTR_S = 2;
    var S_EQ = 3;
    var S_V = 4;
    var S_E = 5;
    var S_S = 6;
    var S_C = 7;
    function XMLReader() {
    }
    XMLReader.prototype = {
      parse: function(source, defaultNSMap, entityMap) {
        var domBuilder = this.domBuilder;
        domBuilder.startDocument();
        _copy(defaultNSMap, defaultNSMap = {});
        parse(
          source,
          defaultNSMap,
          entityMap,
          domBuilder,
          this.errorHandler
        );
        domBuilder.endDocument();
      }
    };
    function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
      function fixedFromCharCode(code) {
        if (code > 65535) {
          code -= 65536;
          var surrogate1 = 55296 + (code >> 10), surrogate2 = 56320 + (code & 1023);
          return String.fromCharCode(surrogate1, surrogate2);
        } else {
          return String.fromCharCode(code);
        }
      }
      function entityReplacer(a2) {
        var k = a2.slice(1, -1);
        if (k in entityMap) {
          return entityMap[k];
        } else if (k.charAt(0) === "#") {
          return fixedFromCharCode(parseInt(k.substr(1).replace("x", "0x")));
        } else {
          errorHandler.error("entity not found:" + a2);
          return a2;
        }
      }
      function appendText(end2) {
        var xt = source.substring(start, end2).replace(/&#?\w+;/g, entityReplacer);
        locator && position(start);
        domBuilder.characters(xt, 0, end2 - start);
        start = end2;
      }
      function position(start2, m) {
        while (start2 >= endPos && (m = linePattern.exec(source))) {
          startPos = m.index;
          endPos = startPos + m[0].length;
          locator.lineNumber++;
        }
        locator.columnNumber = start2 - startPos + 1;
      }
      var startPos = 0;
      var endPos = 0;
      var linePattern = /.+(?:\r\n?|\n)|.*$/g;
      var locator = domBuilder.locator;
      var parseStack = [{ currentNSMap: defaultNSMapCopy }];
      var closeMap = {};
      var start = 0;
      while (true) {
        var i = source.indexOf("<", start);
        if (i < 0) {
          if (!source.substr(start).match(/^\s*$/)) {
            var doc = domBuilder.document;
            var text = doc.createTextNode(source.substr(start));
            doc.appendChild(text);
            domBuilder.currentElement = text;
          }
          return;
        }
        if (i > start) {
          appendText(i);
        }
        switch (source.charAt(i + 1)) {
          case "/":
            var end = source.indexOf(">", i + 3);
            var tagName = source.substring(i + 2, end);
            var config;
            if (parseStack.length > 1) {
              config = parseStack.pop();
            } else {
              errorHandler.fatalError("end tag name not found for: " + tagName);
              break;
            }
            var localNSMap = config.localNSMap;
            if (config.tagName != tagName) {
              errorHandler.fatalError("end tag name: " + tagName + " does not match the current start tagName: " + config.tagName);
            }
            domBuilder.endElement(config.uri, config.localName, tagName);
            if (localNSMap) {
              for (var prefix in localNSMap) {
                domBuilder.endPrefixMapping(prefix);
              }
            }
            end++;
            break;
          case "?":
            locator && position(i);
            end = parseInstruction(source, i, domBuilder);
            break;
          case "!":
            locator && position(i);
            end = parseDCC(source, i, domBuilder, errorHandler);
            break;
          default:
            try {
              locator && position(i);
              var el = new ElementAttributes();
              var end = parseElementStartPart(source, i, el, entityReplacer, errorHandler);
              var len = el.length;
              if (len && locator) {
                var backup = copyLocator(locator, {});
                for (var i = 0; i < len; i++) {
                  var a = el[i];
                  position(a.offset);
                  a.offset = copyLocator(locator, {});
                }
                copyLocator(backup, locator);
              }
              if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
                el.closed = true;
                if (!entityMap.nbsp) {
                  errorHandler.warning("unclosed xml attribute");
                }
              }
              appendElement(el, domBuilder, parseStack);
              if (el.uri === "http://www.w3.org/1999/xhtml" && !el.closed) {
                end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
              } else {
                end++;
              }
            } catch (e) {
              errorHandler.error("element parse error: " + e);
              end = -1;
            }
        }
        if (end < 0) {
          appendText(i + 1);
        } else {
          start = end;
        }
      }
    }
    function copyLocator(f, t) {
      t.lineNumber = f.lineNumber;
      t.columnNumber = f.columnNumber;
      return t;
    }
    function parseElementStartPart(source, start, el, entityReplacer, errorHandler) {
      var attrName;
      var value2;
      var p = ++start;
      var s = S_TAG;
      while (true) {
        var c = source.charAt(p);
        switch (c) {
          case "=":
            if (s === S_ATTR) {
              attrName = source.slice(start, p);
              s = S_EQ;
            } else if (s === S_ATTR_S) {
              s = S_EQ;
            } else {
              throw new Error("attribute equal must after attrName");
            }
            break;
          case "'":
          case '"':
            if (s === S_EQ) {
              start = p + 1;
              p = source.indexOf(c, start);
              if (p > 0) {
                value2 = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                el.add(attrName, value2, start - 1);
                s = S_E;
              } else {
                throw new Error("attribute value no end '" + c + "' match");
              }
            } else if (s == S_V) {
              value2 = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
              el.add(attrName, value2, start);
              errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ")!!");
              start = p + 1;
              s = S_E;
            } else {
              throw new Error('attribute value must after "="');
            }
            break;
          case "/":
            switch (s) {
              case S_TAG:
                el.setTagName(source.slice(start, p));
              case S_E:
              case S_S:
              case S_C:
                s = S_C;
                el.closed = true;
              case S_V:
              case S_ATTR:
              case S_ATTR_S:
                break;
              default:
                throw new Error("attribute invalid close char('/')");
            }
            break;
          case "":
            errorHandler.error("unexpected end of input");
          case ">":
            switch (s) {
              case S_TAG:
                el.setTagName(source.slice(start, p));
              case S_E:
              case S_S:
              case S_C:
                break;
              //normal
              case S_V:
              //Compatible state
              case S_ATTR:
                value2 = source.slice(start, p);
                if (value2.slice(-1) === "/") {
                  el.closed = true;
                  value2 = value2.slice(0, -1);
                }
              case S_ATTR_S:
                if (s === S_ATTR_S) {
                  value2 = attrName;
                }
                if (s == S_V) {
                  errorHandler.warning('attribute "' + value2 + '" missed quot(")!!');
                  el.add(attrName, value2.replace(/&#?\w+;/g, entityReplacer), start);
                } else {
                  errorHandler.warning('attribute "' + value2 + '" missed value!! "' + value2 + '" instead!!');
                  el.add(value2, value2, start);
                }
                break;
              case S_EQ:
                throw new Error("attribute value missed!!");
            }
            return p;
          case "":
            c = " ";
          default:
            if (c <= " ") {
              switch (s) {
                case S_TAG:
                  el.setTagName(source.slice(start, p));
                  s = S_S;
                  break;
                case S_ATTR:
                  attrName = source.slice(start, p);
                  s = S_ATTR_S;
                  break;
                case S_V:
                  var value2 = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
                  errorHandler.warning('attribute "' + value2 + '" missed quot(")!!');
                  el.add(attrName, value2, start);
                case S_E:
                  s = S_S;
                  break;
              }
            } else {
              switch (s) {
                case S_ATTR_S:
                  errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead!!');
                  el.add(attrName, attrName, start);
                  start = p;
                  s = S_ATTR;
                  break;
                case S_E:
                  errorHandler.warning('attribute space is required"' + attrName + '"!!');
                case S_S:
                  s = S_ATTR;
                  start = p;
                  break;
                case S_EQ:
                  s = S_V;
                  start = p;
                  break;
                case S_C:
                  throw new Error("elements closed character '/' and '>' must be connected to");
              }
            }
        }
        p++;
      }
    }
    function appendElement(el, domBuilder, parseStack) {
      var tagName = el.tagName;
      var localNSMap = null;
      var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
      var i = el.length;
      while (i--) {
        var a = el[i];
        var qName = a.qName;
        var value2 = a.value;
        var nsp = qName.indexOf(":");
        if (nsp > 0) {
          var prefix = a.prefix = qName.slice(0, nsp);
          var localName = qName.slice(nsp + 1);
          var nsPrefix = prefix === "xmlns" && localName;
        } else {
          localName = qName;
          prefix = null;
          nsPrefix = qName === "xmlns" && "";
        }
        a.localName = localName;
        if (nsPrefix !== false) {
          if (localNSMap == null) {
            localNSMap = {};
            _copy(currentNSMap, currentNSMap = {});
          }
          currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value2;
          a.uri = "http://www.w3.org/2000/xmlns/";
          domBuilder.startPrefixMapping(nsPrefix, value2);
        }
      }
      var i = el.length;
      while (i--) {
        a = el[i];
        var prefix = a.prefix;
        if (prefix) {
          if (prefix === "xml") {
            a.uri = "http://www.w3.org/XML/1998/namespace";
          }
          if (prefix !== "xmlns") {
            a.uri = currentNSMap[prefix];
          }
        }
      }
      var nsp = tagName.indexOf(":");
      if (nsp > 0) {
        prefix = el.prefix = tagName.slice(0, nsp);
        localName = el.localName = tagName.slice(nsp + 1);
      } else {
        prefix = null;
        localName = el.localName = tagName;
      }
      var ns = el.uri = currentNSMap[prefix || ""];
      domBuilder.startElement(ns, localName, tagName, el);
      if (el.closed) {
        domBuilder.endElement(ns, localName, tagName);
        if (localNSMap) {
          for (prefix in localNSMap) {
            domBuilder.endPrefixMapping(prefix);
          }
        }
      } else {
        el.currentNSMap = currentNSMap;
        el.localNSMap = localNSMap;
        parseStack.push(el);
      }
    }
    function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
      if (/^(?:script|textarea)$/i.test(tagName)) {
        var elEndStart = source.indexOf("</" + tagName + ">", elStartEnd);
        var text = source.substring(elStartEnd + 1, elEndStart);
        if (/[&<]/.test(text)) {
          if (/^script$/i.test(tagName)) {
            domBuilder.characters(text, 0, text.length);
            return elEndStart;
          }
          text = text.replace(/&#?\w+;/g, entityReplacer);
          domBuilder.characters(text, 0, text.length);
          return elEndStart;
        }
      }
      return elStartEnd + 1;
    }
    function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
      var pos = closeMap[tagName];
      if (pos == null) {
        pos = closeMap[tagName] = source.lastIndexOf("</" + tagName + ">");
      }
      return pos < elStartEnd;
    }
    function _copy(source, target) {
      for (var n in source) {
        target[n] = source[n];
      }
    }
    function parseDCC(source, start, domBuilder, errorHandler) {
      var next = source.charAt(start + 2);
      switch (next) {
        case "-":
          if (source.charAt(start + 3) === "-") {
            var end = source.indexOf("-->", start + 4);
            if (end > start) {
              domBuilder.comment(source, start + 4, end - start - 4);
              return end + 3;
            } else {
              errorHandler.error("Unclosed comment");
              return -1;
            }
          } else {
            return -1;
          }
        default:
          if (source.substr(start + 3, 6) == "CDATA[") {
            var end = source.indexOf("]]>", start + 9);
            if (end > start) {
              domBuilder.startCDATA();
              domBuilder.characters(source, start + 9, end - start - 9);
              domBuilder.endCDATA();
              return end + 3;
            } else {
              errorHandler.error("Unclosed CDATA");
              return -1;
            }
          }
          var matchs = split(source, start);
          var len = matchs.length;
          if (len > 1 && /!doctype/i.test(matchs[0][0])) {
            var name = matchs[1][0];
            var pubid = len > 3 && /^public$/i.test(matchs[2][0]) && matchs[3][0];
            var sysid = len > 4 && matchs[4][0];
            var lastMatch = matchs[len - 1];
            domBuilder.startDTD(
              name,
              pubid && pubid.replace(/^(['"])(.*?)\1$/, "$2"),
              sysid && sysid.replace(/^(['"])(.*?)\1$/, "$2")
            );
            domBuilder.endDTD();
            return lastMatch.index + lastMatch[0].length;
          }
      }
      return -1;
    }
    function parseInstruction(source, start, domBuilder) {
      var end = source.indexOf("?>", start);
      if (end) {
        var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
        if (match) {
          match[0].length;
          domBuilder.processingInstruction(match[1], match[2]);
          return end + 2;
        } else {
          return -1;
        }
      }
      return -1;
    }
    function ElementAttributes(source) {
    }
    ElementAttributes.prototype = {
      setTagName: function(tagName) {
        if (!tagNamePattern.test(tagName)) {
          throw new Error("invalid tagName:" + tagName);
        }
        this.tagName = tagName;
      },
      add: function(qName, value2, offset) {
        if (!tagNamePattern.test(qName)) {
          throw new Error("invalid attribute:" + qName);
        }
        this[this.length++] = { qName, value: value2, offset };
      },
      length: 0,
      getLocalName: function(i) {
        return this[i].localName;
      },
      getOffset: function(i) {
        return this[i].offset;
      },
      getQName: function(i) {
        return this[i].qName;
      },
      getURI: function(i) {
        return this[i].uri;
      },
      getValue: function(i) {
        return this[i].value;
      }
    };
    function _set_proto_(thiz, parent) {
      thiz.__proto__ = parent;
      return thiz;
    }
    if (!(_set_proto_({}, _set_proto_.prototype) instanceof _set_proto_)) {
      _set_proto_ = function(thiz, parent) {
        function p() {
        }
        p.prototype = parent;
        p = new p();
        for (parent in thiz) {
          p[parent] = thiz[parent];
        }
        return p;
      };
    }
    function split(source, start) {
      var match;
      var buf = [];
      var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
      reg.lastIndex = start;
      reg.exec(source);
      while (match = reg.exec(source)) {
        buf.push(match);
        if (match[1]) return buf;
      }
    }
    return XMLReader;
  });
  ace.define("ace/mode/xml/dom", [], function(require2, exports, module) {
    function copy(src, dest) {
      for (var p in src) {
        dest[p] = src[p];
      }
    }
    function _extends(Class, Super) {
      var t = function() {
      };
      var pt = Class.prototype;
      if (Object.create) {
        var ppt = Object.create(Super.prototype);
        pt.__proto__ = ppt;
      }
      if (!(pt instanceof Super)) {
        t.prototype = Super.prototype;
        t = new t();
        copy(pt, t);
        Class.prototype = pt = t;
      }
      if (pt.constructor != Class) {
        if (typeof Class != "function") {
          console.error("unknown Class:" + Class);
        }
        pt.constructor = Class;
      }
    }
    var htmlns = "http://www.w3.org/1999/xhtml";
    var NodeType = {};
    var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
    var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
    var TEXT_NODE = NodeType.TEXT_NODE = 3;
    var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
    var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
    var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
    var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
    var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
    var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
    var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
    var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
    var NOTATION_NODE = NodeType.NOTATION_NODE = 12;
    var ExceptionCode = {};
    var ExceptionMessage = {};
    ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1);
    ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
    ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
    ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4);
    ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5);
    ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6);
    ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
    var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
    ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
    var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
    ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11);
    ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12);
    ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13);
    ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14);
    ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15);
    function DOMException(code, message) {
      if (message instanceof Error) {
        var error = message;
      } else {
        error = this;
        Error.call(this, ExceptionMessage[code]);
        this.message = ExceptionMessage[code];
        if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
      }
      error.code = code;
      if (message) this.message = this.message + ": " + message;
      return error;
    }
    DOMException.prototype = Error.prototype;
    copy(ExceptionCode, DOMException);
    function NodeList() {
    }
    NodeList.prototype = {
      length: 0,
      item: function(index) {
        return this[index] || null;
      }
    };
    function LiveNodeList(node, refresh) {
      this._node = node;
      this._refresh = refresh;
      _updateLiveList(this);
    }
    function _updateLiveList(list) {
      var inc = list._node._inc || list._node.ownerDocument._inc;
      if (list._inc != inc) {
        var ls = list._refresh(list._node);
        __set__(list, "length", ls.length);
        copy(ls, list);
        list._inc = inc;
      }
    }
    LiveNodeList.prototype.item = function(i) {
      _updateLiveList(this);
      return this[i];
    };
    _extends(LiveNodeList, NodeList);
    function NamedNodeMap() {
    }
    function _findNodeIndex(list, node) {
      var i = list.length;
      while (i--) {
        if (list[i] === node) {
          return i;
        }
      }
    }
    function _addNamedNode(el, list, newAttr, oldAttr) {
      if (oldAttr) {
        list[_findNodeIndex(list, oldAttr)] = newAttr;
      } else {
        list[list.length++] = newAttr;
      }
      if (el) {
        newAttr.ownerElement = el;
        var doc = el.ownerDocument;
        if (doc) {
          oldAttr && _onRemoveAttribute(doc, el, oldAttr);
          _onAddAttribute(doc, el, newAttr);
        }
      }
    }
    function _removeNamedNode(el, list, attr) {
      var i = _findNodeIndex(list, attr);
      if (i >= 0) {
        var lastIndex = list.length - 1;
        while (i < lastIndex) {
          list[i] = list[++i];
        }
        list.length = lastIndex;
        if (el) {
          var doc = el.ownerDocument;
          if (doc) {
            _onRemoveAttribute(doc, el, attr);
            attr.ownerElement = null;
          }
        }
      } else {
        throw new DOMException(NOT_FOUND_ERR, new Error());
      }
    }
    NamedNodeMap.prototype = {
      length: 0,
      item: NodeList.prototype.item,
      getNamedItem: function(key) {
        var i = this.length;
        while (i--) {
          var attr = this[i];
          if (attr.nodeName == key) {
            return attr;
          }
        }
      },
      setNamedItem: function(attr) {
        var el = attr.ownerElement;
        if (el && el != this._ownerElement) {
          throw new DOMException(INUSE_ATTRIBUTE_ERR);
        }
        var oldAttr = this.getNamedItem(attr.nodeName);
        _addNamedNode(this._ownerElement, this, attr, oldAttr);
        return oldAttr;
      },
      setNamedItemNS: function(attr) {
        var el = attr.ownerElement, oldAttr;
        if (el && el != this._ownerElement) {
          throw new DOMException(INUSE_ATTRIBUTE_ERR);
        }
        oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
        _addNamedNode(this._ownerElement, this, attr, oldAttr);
        return oldAttr;
      },
      removeNamedItem: function(key) {
        var attr = this.getNamedItem(key);
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
      removeNamedItemNS: function(namespaceURI, localName) {
        var attr = this.getNamedItemNS(namespaceURI, localName);
        _removeNamedNode(this._ownerElement, this, attr);
        return attr;
      },
      getNamedItemNS: function(namespaceURI, localName) {
        var i = this.length;
        while (i--) {
          var node = this[i];
          if (node.localName == localName && node.namespaceURI == namespaceURI) {
            return node;
          }
        }
        return null;
      }
    };
    function DOMImplementation(features) {
      this._features = {};
      if (features) {
        for (var feature in features) {
          this._features = features[feature];
        }
      }
    }
    DOMImplementation.prototype = {
      hasFeature: function(feature, version) {
        var versions = this._features[feature.toLowerCase()];
        if (versions && (!version || version in versions)) {
          return true;
        } else {
          return false;
        }
      },
      createDocument: function(namespaceURI, qualifiedName, doctype) {
        var doc = new Document();
        doc.implementation = this;
        doc.childNodes = new NodeList();
        doc.doctype = doctype;
        if (doctype) {
          doc.appendChild(doctype);
        }
        if (qualifiedName) {
          var root = doc.createElementNS(namespaceURI, qualifiedName);
          doc.appendChild(root);
        }
        return doc;
      },
      createDocumentType: function(qualifiedName, publicId, systemId) {
        var node = new DocumentType();
        node.name = qualifiedName;
        node.nodeName = qualifiedName;
        node.publicId = publicId;
        node.systemId = systemId;
        return node;
      }
    };
    function Node() {
    }
    Node.prototype = {
      firstChild: null,
      lastChild: null,
      previousSibling: null,
      nextSibling: null,
      attributes: null,
      parentNode: null,
      childNodes: null,
      ownerDocument: null,
      nodeValue: null,
      namespaceURI: null,
      prefix: null,
      localName: null,
      insertBefore: function(newChild, refChild) {
        return _insertBefore(this, newChild, refChild);
      },
      replaceChild: function(newChild, oldChild) {
        this.insertBefore(newChild, oldChild);
        if (oldChild) {
          this.removeChild(oldChild);
        }
      },
      removeChild: function(oldChild) {
        return _removeChild(this, oldChild);
      },
      appendChild: function(newChild) {
        return this.insertBefore(newChild, null);
      },
      hasChildNodes: function() {
        return this.firstChild != null;
      },
      cloneNode: function(deep) {
        return cloneNode(this.ownerDocument || this, this, deep);
      },
      normalize: function() {
        var child = this.firstChild;
        while (child) {
          var next = child.nextSibling;
          if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
            this.removeChild(next);
            child.appendData(next.data);
          } else {
            child.normalize();
            child = next;
          }
        }
      },
      isSupported: function(feature, version) {
        return this.ownerDocument.implementation.hasFeature(feature, version);
      },
      hasAttributes: function() {
        return this.attributes.length > 0;
      },
      lookupPrefix: function(namespaceURI) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            for (var n in map) {
              if (map[n] == namespaceURI) {
                return n;
              }
            }
          }
          el = el.nodeType == 2 ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      lookupNamespaceURI: function(prefix) {
        var el = this;
        while (el) {
          var map = el._nsMap;
          if (map) {
            if (prefix in map) {
              return map[prefix];
            }
          }
          el = el.nodeType == 2 ? el.ownerDocument : el.parentNode;
        }
        return null;
      },
      isDefaultNamespace: function(namespaceURI) {
        var prefix = this.lookupPrefix(namespaceURI);
        return prefix == null;
      }
    };
    function _xmlEncoder(c) {
      return c == "<" && "&lt;" || c == ">" && "&gt;" || c == "&" && "&amp;" || c == '"' && "&quot;" || "&#" + c.charCodeAt() + ";";
    }
    copy(NodeType, Node);
    copy(NodeType, Node.prototype);
    function _visitNode(node, callback) {
      if (callback(node)) {
        return true;
      }
      if (node = node.firstChild) {
        do {
          if (_visitNode(node, callback)) {
            return true;
          }
        } while (node = node.nextSibling);
      }
    }
    function Document() {
    }
    function _onAddAttribute(doc, el, newAttr) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns == "http://www.w3.org/2000/xmlns/") {
        el._nsMap[newAttr.prefix ? newAttr.localName : ""] = newAttr.value;
      }
    }
    function _onRemoveAttribute(doc, el, newAttr, remove) {
      doc && doc._inc++;
      var ns = newAttr.namespaceURI;
      if (ns == "http://www.w3.org/2000/xmlns/") {
        delete el._nsMap[newAttr.prefix ? newAttr.localName : ""];
      }
    }
    function _onUpdateChild(doc, el, newChild) {
      if (doc && doc._inc) {
        doc._inc++;
        var cs = el.childNodes;
        if (newChild) {
          cs[cs.length++] = newChild;
        } else {
          var child = el.firstChild;
          var i = 0;
          while (child) {
            cs[i++] = child;
            child = child.nextSibling;
          }
          cs.length = i;
        }
      }
    }
    function _removeChild(parentNode, child) {
      var previous = child.previousSibling;
      var next = child.nextSibling;
      if (previous) {
        previous.nextSibling = next;
      } else {
        parentNode.firstChild = next;
      }
      if (next) {
        next.previousSibling = previous;
      } else {
        parentNode.lastChild = previous;
      }
      _onUpdateChild(parentNode.ownerDocument, parentNode);
      return child;
    }
    function _insertBefore(parentNode, newChild, nextChild) {
      var cp = newChild.parentNode;
      if (cp) {
        cp.removeChild(newChild);
      }
      if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
        var newFirst = newChild.firstChild;
        if (newFirst == null) {
          return newChild;
        }
        var newLast = newChild.lastChild;
      } else {
        newFirst = newLast = newChild;
      }
      var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;
      newFirst.previousSibling = pre;
      newLast.nextSibling = nextChild;
      if (pre) {
        pre.nextSibling = newFirst;
      } else {
        parentNode.firstChild = newFirst;
      }
      if (nextChild == null) {
        parentNode.lastChild = newLast;
      } else {
        nextChild.previousSibling = newLast;
      }
      do {
        newFirst.parentNode = parentNode;
      } while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
      _onUpdateChild(parentNode.ownerDocument || parentNode, parentNode);
      if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
        newChild.firstChild = newChild.lastChild = null;
      }
      return newChild;
    }
    function _appendSingleChild(parentNode, newChild) {
      var cp = newChild.parentNode;
      if (cp) {
        var pre = parentNode.lastChild;
        cp.removeChild(newChild);
        var pre = parentNode.lastChild;
      }
      var pre = parentNode.lastChild;
      newChild.parentNode = parentNode;
      newChild.previousSibling = pre;
      newChild.nextSibling = null;
      if (pre) {
        pre.nextSibling = newChild;
      } else {
        parentNode.firstChild = newChild;
      }
      parentNode.lastChild = newChild;
      _onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
      return newChild;
    }
    Document.prototype = {
      nodeName: "#document",
      nodeType: DOCUMENT_NODE,
      doctype: null,
      documentElement: null,
      _inc: 1,
      insertBefore: function(newChild, refChild) {
        if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
          var child = newChild.firstChild;
          while (child) {
            var next = child.nextSibling;
            this.insertBefore(child, refChild);
            child = next;
          }
          return newChild;
        }
        if (this.documentElement == null && newChild.nodeType == 1) {
          this.documentElement = newChild;
        }
        return _insertBefore(this, newChild, refChild), newChild.ownerDocument = this, newChild;
      },
      removeChild: function(oldChild) {
        if (this.documentElement == oldChild) {
          this.documentElement = null;
        }
        return _removeChild(this, oldChild);
      },
      importNode: function(importedNode, deep) {
        return importNode(this, importedNode, deep);
      },
      getElementById: function(id) {
        var rtv = null;
        _visitNode(this.documentElement, function(node) {
          if (node.nodeType == 1) {
            if (node.getAttribute("id") == id) {
              rtv = node;
              return true;
            }
          }
        });
        return rtv;
      },
      createElement: function(tagName) {
        var node = new Element();
        node.ownerDocument = this;
        node.nodeName = tagName;
        node.tagName = tagName;
        node.childNodes = new NodeList();
        var attrs = node.attributes = new NamedNodeMap();
        attrs._ownerElement = node;
        return node;
      },
      createDocumentFragment: function() {
        var node = new DocumentFragment();
        node.ownerDocument = this;
        node.childNodes = new NodeList();
        return node;
      },
      createTextNode: function(data) {
        var node = new Text();
        node.ownerDocument = this;
        node.appendData(data);
        return node;
      },
      createComment: function(data) {
        var node = new Comment();
        node.ownerDocument = this;
        node.appendData(data);
        return node;
      },
      createCDATASection: function(data) {
        var node = new CDATASection();
        node.ownerDocument = this;
        node.appendData(data);
        return node;
      },
      createProcessingInstruction: function(target, data) {
        var node = new ProcessingInstruction();
        node.ownerDocument = this;
        node.tagName = node.target = target;
        node.nodeValue = node.data = data;
        return node;
      },
      createAttribute: function(name) {
        var node = new Attr();
        node.ownerDocument = this;
        node.name = name;
        node.nodeName = name;
        node.localName = name;
        node.specified = true;
        return node;
      },
      createEntityReference: function(name) {
        var node = new EntityReference();
        node.ownerDocument = this;
        node.nodeName = name;
        return node;
      },
      createElementNS: function(namespaceURI, qualifiedName) {
        var node = new Element();
        var pl = qualifiedName.split(":");
        var attrs = node.attributes = new NamedNodeMap();
        node.childNodes = new NodeList();
        node.ownerDocument = this;
        node.nodeName = qualifiedName;
        node.tagName = qualifiedName;
        node.namespaceURI = namespaceURI;
        if (pl.length == 2) {
          node.prefix = pl[0];
          node.localName = pl[1];
        } else {
          node.localName = qualifiedName;
        }
        attrs._ownerElement = node;
        return node;
      },
      createAttributeNS: function(namespaceURI, qualifiedName) {
        var node = new Attr();
        var pl = qualifiedName.split(":");
        node.ownerDocument = this;
        node.nodeName = qualifiedName;
        node.name = qualifiedName;
        node.namespaceURI = namespaceURI;
        node.specified = true;
        if (pl.length == 2) {
          node.prefix = pl[0];
          node.localName = pl[1];
        } else {
          node.localName = qualifiedName;
        }
        return node;
      }
    };
    _extends(Document, Node);
    function Element() {
      this._nsMap = {};
    }
    Element.prototype = {
      nodeType: ELEMENT_NODE,
      hasAttribute: function(name) {
        return this.getAttributeNode(name) != null;
      },
      getAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        return attr && attr.value || "";
      },
      getAttributeNode: function(name) {
        return this.attributes.getNamedItem(name);
      },
      setAttribute: function(name, value2) {
        var attr = this.ownerDocument.createAttribute(name);
        attr.value = attr.nodeValue = "" + value2;
        this.setAttributeNode(attr);
      },
      removeAttribute: function(name) {
        var attr = this.getAttributeNode(name);
        attr && this.removeAttributeNode(attr);
      },
      appendChild: function(newChild) {
        if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
          return this.insertBefore(newChild, null);
        } else {
          return _appendSingleChild(this, newChild);
        }
      },
      setAttributeNode: function(newAttr) {
        return this.attributes.setNamedItem(newAttr);
      },
      setAttributeNodeNS: function(newAttr) {
        return this.attributes.setNamedItemNS(newAttr);
      },
      removeAttributeNode: function(oldAttr) {
        return this.attributes.removeNamedItem(oldAttr.nodeName);
      },
      removeAttributeNS: function(namespaceURI, localName) {
        var old = this.getAttributeNodeNS(namespaceURI, localName);
        old && this.removeAttributeNode(old);
      },
      hasAttributeNS: function(namespaceURI, localName) {
        return this.getAttributeNodeNS(namespaceURI, localName) != null;
      },
      getAttributeNS: function(namespaceURI, localName) {
        var attr = this.getAttributeNodeNS(namespaceURI, localName);
        return attr && attr.value || "";
      },
      setAttributeNS: function(namespaceURI, qualifiedName, value2) {
        var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
        attr.value = attr.nodeValue = "" + value2;
        this.setAttributeNode(attr);
      },
      getAttributeNodeNS: function(namespaceURI, localName) {
        return this.attributes.getNamedItemNS(namespaceURI, localName);
      },
      getElementsByTagName: function(tagName) {
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node) {
            if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === "*" || node.tagName == tagName)) {
              ls.push(node);
            }
          });
          return ls;
        });
      },
      getElementsByTagNameNS: function(namespaceURI, localName) {
        return new LiveNodeList(this, function(base) {
          var ls = [];
          _visitNode(base, function(node) {
            if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === "*" || node.namespaceURI === namespaceURI) && (localName === "*" || node.localName == localName)) {
              ls.push(node);
            }
          });
          return ls;
        });
      }
    };
    Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
    Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;
    _extends(Element, Node);
    function Attr() {
    }
    Attr.prototype.nodeType = ATTRIBUTE_NODE;
    _extends(Attr, Node);
    function CharacterData() {
    }
    CharacterData.prototype = {
      data: "",
      substringData: function(offset, count) {
        return this.data.substring(offset, offset + count);
      },
      appendData: function(text) {
        text = this.data + text;
        this.nodeValue = this.data = text;
        this.length = text.length;
      },
      insertData: function(offset, text) {
        this.replaceData(offset, 0, text);
      },
      appendChild: function(newChild) {
        throw new Error(ExceptionMessage[3]);
      },
      deleteData: function(offset, count) {
        this.replaceData(offset, count, "");
      },
      replaceData: function(offset, count, text) {
        var start = this.data.substring(0, offset);
        var end = this.data.substring(offset + count);
        text = start + text + end;
        this.nodeValue = this.data = text;
        this.length = text.length;
      }
    };
    _extends(CharacterData, Node);
    function Text() {
    }
    Text.prototype = {
      nodeName: "#text",
      nodeType: TEXT_NODE,
      splitText: function(offset) {
        var text = this.data;
        var newText = text.substring(offset);
        text = text.substring(0, offset);
        this.data = this.nodeValue = text;
        this.length = text.length;
        var newNode = this.ownerDocument.createTextNode(newText);
        if (this.parentNode) {
          this.parentNode.insertBefore(newNode, this.nextSibling);
        }
        return newNode;
      }
    };
    _extends(Text, CharacterData);
    function Comment() {
    }
    Comment.prototype = {
      nodeName: "#comment",
      nodeType: COMMENT_NODE
    };
    _extends(Comment, CharacterData);
    function CDATASection() {
    }
    CDATASection.prototype = {
      nodeName: "#cdata-section",
      nodeType: CDATA_SECTION_NODE
    };
    _extends(CDATASection, CharacterData);
    function DocumentType() {
    }
    DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
    _extends(DocumentType, Node);
    function Notation() {
    }
    Notation.prototype.nodeType = NOTATION_NODE;
    _extends(Notation, Node);
    function Entity() {
    }
    Entity.prototype.nodeType = ENTITY_NODE;
    _extends(Entity, Node);
    function EntityReference() {
    }
    EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
    _extends(EntityReference, Node);
    function DocumentFragment() {
    }
    DocumentFragment.prototype.nodeName = "#document-fragment";
    DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
    _extends(DocumentFragment, Node);
    function ProcessingInstruction() {
    }
    ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
    _extends(ProcessingInstruction, Node);
    function XMLSerializer() {
    }
    XMLSerializer.prototype.serializeToString = function(node) {
      var buf = [];
      serializeToString(node, buf);
      return buf.join("");
    };
    Node.prototype.toString = function() {
      return XMLSerializer.prototype.serializeToString(this);
    };
    function serializeToString(node, buf) {
      switch (node.nodeType) {
        case ELEMENT_NODE:
          var attrs = node.attributes;
          var len = attrs.length;
          var child = node.firstChild;
          var nodeName = node.tagName;
          var isHTML = htmlns === node.namespaceURI;
          buf.push("<", nodeName);
          for (var i = 0; i < len; i++) {
            serializeToString(attrs.item(i), buf);
          }
          if (child || isHTML && !/^(?:meta|link|img|br|hr|input|button)$/i.test(nodeName)) {
            buf.push(">");
            if (isHTML && /^script$/i.test(nodeName)) {
              if (child) {
                buf.push(child.data);
              }
            } else {
              while (child) {
                serializeToString(child, buf);
                child = child.nextSibling;
              }
            }
            buf.push("</", nodeName, ">");
          } else {
            buf.push("/>");
          }
          return;
        case DOCUMENT_NODE:
        case DOCUMENT_FRAGMENT_NODE:
          var child = node.firstChild;
          while (child) {
            serializeToString(child, buf);
            child = child.nextSibling;
          }
          return;
        case ATTRIBUTE_NODE:
          return buf.push(" ", node.name, '="', node.value.replace(/[<&"]/g, _xmlEncoder), '"');
        case TEXT_NODE:
          return buf.push(node.data.replace(/[<&]/g, _xmlEncoder));
        case CDATA_SECTION_NODE:
          return buf.push("<![CDATA[", node.data, "]]>");
        case COMMENT_NODE:
          return buf.push("<!--", node.data, "-->");
        case DOCUMENT_TYPE_NODE:
          var pubid = node.publicId;
          var sysid = node.systemId;
          buf.push("<!DOCTYPE ", node.name);
          if (pubid) {
            buf.push(' PUBLIC "', pubid);
            if (sysid && sysid != ".") {
              buf.push('" "', sysid);
            }
            buf.push('">');
          } else if (sysid && sysid != ".") {
            buf.push(' SYSTEM "', sysid, '">');
          } else {
            var sub = node.internalSubset;
            if (sub) {
              buf.push(" [", sub, "]");
            }
            buf.push(">");
          }
          return;
        case PROCESSING_INSTRUCTION_NODE:
          return buf.push("<?", node.target, " ", node.data, "?>");
        case ENTITY_REFERENCE_NODE:
          return buf.push("&", node.nodeName, ";");
        default:
          buf.push("??", node.nodeName);
      }
    }
    function importNode(doc, node, deep) {
      var node2;
      switch (node.nodeType) {
        case ELEMENT_NODE:
          node2 = node.cloneNode(false);
          node2.ownerDocument = doc;
        case DOCUMENT_FRAGMENT_NODE:
          break;
        case ATTRIBUTE_NODE:
          deep = true;
          break;
      }
      if (!node2) {
        node2 = node.cloneNode(false);
      }
      node2.ownerDocument = doc;
      node2.parentNode = null;
      if (deep) {
        var child = node.firstChild;
        while (child) {
          node2.appendChild(importNode(doc, child, deep));
          child = child.nextSibling;
        }
      }
      return node2;
    }
    function cloneNode(doc, node, deep) {
      var node2 = new node.constructor();
      for (var n in node) {
        var v = node[n];
        if (typeof v != "object") {
          if (v != node2[n]) {
            node2[n] = v;
          }
        }
      }
      if (node.childNodes) {
        node2.childNodes = new NodeList();
      }
      node2.ownerDocument = doc;
      switch (node2.nodeType) {
        case ELEMENT_NODE:
          var attrs = node.attributes;
          var attrs2 = node2.attributes = new NamedNodeMap();
          var len = attrs.length;
          attrs2._ownerElement = node2;
          for (var i = 0; i < len; i++) {
            node2.setAttributeNode(cloneNode(doc, attrs.item(i), true));
          }
          break;
        case ATTRIBUTE_NODE:
          deep = true;
      }
      if (deep) {
        var child = node.firstChild;
        while (child) {
          node2.appendChild(cloneNode(doc, child, deep));
          child = child.nextSibling;
        }
      }
      return node2;
    }
    function __set__(object, key, value2) {
      object[key] = value2;
    }
    function getTextContent(node) {
      switch (node.nodeType) {
        case 1:
        case 11:
          var buf = [];
          node = node.firstChild;
          while (node) {
            if (node.nodeType !== 7 && node.nodeType !== 8) {
              buf.push(getTextContent(node));
            }
            node = node.nextSibling;
          }
          return buf.join("");
        default:
          return node.nodeValue;
      }
    }
    try {
      if (Object.defineProperty) {
        Object.defineProperty(LiveNodeList.prototype, "length", {
          get: function() {
            _updateLiveList(this);
            return this.$$length;
          }
        });
        Object.defineProperty(Node.prototype, "textContent", {
          get: function() {
            return getTextContent(this);
          },
          set: function(data) {
            switch (this.nodeType) {
              case 1:
              case 11:
                while (this.firstChild) {
                  this.removeChild(this.firstChild);
                }
                if (data || String(data)) {
                  this.appendChild(this.ownerDocument.createTextNode(data));
                }
                break;
              default:
                this.data = data;
                this.value = value;
                this.nodeValue = data;
            }
          }
        });
        __set__ = function(object, key, value2) {
          object["$$" + key] = value2;
        };
      }
    } catch (e) {
    }
    return DOMImplementation;
  });
  ace.define("ace/mode/xml/dom-parser", [], function(require2, exports, module) {
    var XMLReader = require2("./sax"), DOMImplementation = require2("./dom");
    function DOMParser(options) {
      this.options = options || { locator: {} };
    }
    DOMParser.prototype.parseFromString = function(source, mimeType) {
      var options = this.options;
      var sax = new XMLReader();
      var domBuilder = options.domBuilder || new DOMHandler();
      var errorHandler = options.errorHandler;
      var locator = options.locator;
      var defaultNSMap = options.xmlns || {};
      var entityMap = { "lt": "<", "gt": ">", "amp": "&", "quot": '"', "apos": "'" };
      if (locator) {
        domBuilder.setDocumentLocator(locator);
      }
      sax.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
      sax.domBuilder = options.domBuilder || domBuilder;
      if (/\/x?html?$/.test(mimeType)) {
        entityMap.nbsp = " ";
        entityMap.copy = "©";
        defaultNSMap[""] = "http://www.w3.org/1999/xhtml";
      }
      if (source) {
        sax.parse(source, defaultNSMap, entityMap);
      } else {
        sax.errorHandler.error("invalid document source");
      }
      return domBuilder.document;
    };
    function buildErrorHandler(errorImpl, domBuilder, locator) {
      if (!errorImpl) {
        if (domBuilder instanceof DOMHandler) {
          return domBuilder;
        }
        errorImpl = domBuilder;
      }
      var errorHandler = {};
      var isCallback = errorImpl instanceof Function;
      locator = locator || {};
      function build(key) {
        var fn = errorImpl[key];
        if (!fn) {
          if (isCallback) {
            fn = errorImpl.length == 2 ? function(msg) {
              errorImpl(key, msg);
            } : errorImpl;
          } else {
            var i = arguments.length;
            while (--i) {
              if (fn = errorImpl[arguments[i]]) {
                break;
              }
            }
          }
        }
        errorHandler[key] = fn && function(msg) {
          fn(msg + _locator(locator), msg, locator);
        } || function() {
        };
      }
      build("warning", "warn");
      build("error", "warn", "warning");
      build("fatalError", "warn", "warning", "error");
      return errorHandler;
    }
    function DOMHandler() {
      this.cdata = false;
    }
    function position(locator, node) {
      node.lineNumber = locator.lineNumber;
      node.columnNumber = locator.columnNumber;
    }
    DOMHandler.prototype = {
      startDocument: function() {
        this.document = new DOMImplementation().createDocument(null, null, null);
        if (this.locator) {
          this.document.documentURI = this.locator.systemId;
        }
      },
      startElement: function(namespaceURI, localName, qName, attrs) {
        var doc = this.document;
        var el = doc.createElementNS(namespaceURI, qName || localName);
        var len = attrs.length;
        appendElement(this, el);
        this.currentElement = el;
        this.locator && position(this.locator, el);
        for (var i = 0; i < len; i++) {
          var namespaceURI = attrs.getURI(i);
          var value2 = attrs.getValue(i);
          var qName = attrs.getQName(i);
          var attr = doc.createAttributeNS(namespaceURI, qName);
          if (attr.getOffset) {
            position(attr.getOffset(1), attr);
          }
          attr.value = attr.nodeValue = value2;
          el.setAttributeNode(attr);
        }
      },
      endElement: function(namespaceURI, localName, qName) {
        var current = this.currentElement;
        current.tagName;
        this.currentElement = current.parentNode;
      },
      startPrefixMapping: function(prefix, uri) {
      },
      endPrefixMapping: function(prefix) {
      },
      processingInstruction: function(target, data) {
        var ins = this.document.createProcessingInstruction(target, data);
        this.locator && position(this.locator, ins);
        appendElement(this, ins);
      },
      ignorableWhitespace: function(ch, start, length) {
      },
      characters: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        if (this.currentElement && chars) {
          if (this.cdata) {
            var charNode = this.document.createCDATASection(chars);
            this.currentElement.appendChild(charNode);
          } else {
            var charNode = this.document.createTextNode(chars);
            this.currentElement.appendChild(charNode);
          }
          this.locator && position(this.locator, charNode);
        }
      },
      skippedEntity: function(name) {
      },
      endDocument: function() {
        this.document.normalize();
      },
      setDocumentLocator: function(locator) {
        if (this.locator = locator) {
          locator.lineNumber = 0;
        }
      },
      comment: function(chars, start, length) {
        chars = _toString.apply(this, arguments);
        var comm = this.document.createComment(chars);
        this.locator && position(this.locator, comm);
        appendElement(this, comm);
      },
      startCDATA: function() {
        this.cdata = true;
      },
      endCDATA: function() {
        this.cdata = false;
      },
      startDTD: function(name, publicId, systemId) {
        var impl = this.document.implementation;
        if (impl && impl.createDocumentType) {
          var dt = impl.createDocumentType(name, publicId, systemId);
          this.locator && position(this.locator, dt);
          appendElement(this, dt);
        }
      },
      warning: function(error) {
        console.warn(error, _locator(this.locator));
      },
      error: function(error) {
        console.error(error, _locator(this.locator));
      },
      fatalError: function(error) {
        console.error(error, _locator(this.locator));
        throw error;
      }
    };
    function _locator(l) {
      if (l) {
        return "\n@" + (l.systemId || "") + "#[line:" + l.lineNumber + ",col:" + l.columnNumber + "]";
      }
    }
    function _toString(chars, start, length) {
      if (typeof chars == "string") {
        return chars.substr(start, length);
      } else {
        if (chars.length >= start + length || start) {
          return new java.lang.String(chars, start, length) + "";
        }
        return chars;
      }
    }
    "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function(key) {
      DOMHandler.prototype[key] = function() {
        return null;
      };
    });
    function appendElement(hander, node) {
      if (!hander.currentElement) {
        hander.document.appendChild(node);
      } else {
        hander.currentElement.appendChild(node);
      }
    }
    return {
      DOMParser
    };
  });
  ace.define("ace/mode/xml_worker", [], function(require2, exports, module) {
    var oop = require2("../lib/oop");
    require2("../lib/lang");
    var Mirror = require2("../worker/mirror").Mirror;
    var DOMParser = require2("./xml/dom-parser").DOMParser;
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
        var value2 = this.doc.getValue();
        if (!value2)
          return;
        var parser = new DOMParser();
        var errors = [];
        parser.options.errorHandler = {
          fatalError: function(fullMsg, errorMsg, locator) {
            errors.push({
              row: locator.lineNumber,
              column: locator.columnNumber,
              text: errorMsg,
              type: "error"
            });
          },
          error: function(fullMsg, errorMsg, locator) {
            errors.push({
              row: locator.lineNumber,
              column: locator.columnNumber,
              text: errorMsg,
              type: "error"
            });
          },
          warning: function(fullMsg, errorMsg, locator) {
            errors.push({
              row: locator.lineNumber,
              column: locator.columnNumber,
              text: errorMsg,
              type: "warning"
            });
          }
        };
        parser.parseFromString(value2);
        this.sender.emit("error", errors);
      };
    }).call(Worker.prototype);
  });
  return workerXml$2;
}
var workerXmlExports = requireWorkerXml();
const workerXml = /* @__PURE__ */ getDefaultExportFromCjs(workerXmlExports);
const workerXml$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: workerXml
}, [workerXmlExports]);
export {
  workerXml$1 as w
};
