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
var modeYaml$2 = { exports: {} };
var hasRequiredModeYaml;
function requireModeYaml() {
  if (hasRequiredModeYaml) return modeYaml$2.exports;
  hasRequiredModeYaml = 1;
  (function(module, exports) {
    ace.define("ace/mode/yaml_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(require2, exports2, module2) {
      var oop = require2("../lib/oop");
      var TextHighlightRules = require2("./text_highlight_rules").TextHighlightRules;
      var YamlHighlightRules = function() {
        this.$rules = {
          "start": [
            {
              token: "comment",
              regex: "#.*$"
            },
            {
              token: "list.markup",
              regex: /^(?:-{3}|\.{3})\s*(?=#|$)/
            },
            {
              token: "list.markup",
              regex: /^\s*[\-?](?:$|\s)/
            },
            {
              token: "constant",
              regex: "!![\\w//]+"
            },
            {
              token: "constant.language",
              regex: "[&\\*][a-zA-Z0-9-_]+"
            },
            {
              token: ["meta.tag", "keyword"],
              regex: /^(\s*\w[^\s:]*?)(:(?=\s|$))/
            },
            {
              token: ["meta.tag", "keyword"],
              regex: /(\w[^\s:]*?)(\s*:(?=\s|$))/
            },
            {
              token: "keyword.operator",
              regex: "<<\\w*:\\w*"
            },
            {
              token: "keyword.operator",
              regex: "-\\s*(?=[{])"
            },
            {
              token: "string",
              regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            },
            {
              token: "string",
              regex: /[|>][-+\d]*(?:$|\s+(?:$|#))/,
              onMatch: function(val, state, stack, line) {
                line = line.replace(/ #.*/, "");
                var indent = /^ *((:\s*)?-(\s*[^|>])?)?/.exec(line)[0].replace(/\S\s*$/, "").length;
                var indentationIndicator = parseInt(/\d+[\s+-]*$/.exec(line));
                if (indentationIndicator) {
                  indent += indentationIndicator - 1;
                  this.next = "mlString";
                } else {
                  this.next = "mlStringPre";
                }
                if (!stack.length) {
                  stack.push(this.next);
                  stack.push(indent);
                } else {
                  stack[0] = this.next;
                  stack[1] = indent;
                }
                return this.token;
              },
              next: "mlString"
            },
            {
              token: "string",
              regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            },
            {
              token: "constant.numeric",
              regex: /(\b|[+\-\.])[\d_]+(?:(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)(?=[^\d-\w]|$)$/
            },
            {
              token: "constant.numeric",
              regex: /[+\-]?\.inf\b|NaN\b|0x[\dA-Fa-f_]+|0b[10_]+/
            },
            {
              token: "constant.language.boolean",
              regex: "\\b(?:true|false|TRUE|FALSE|True|False|yes|no)\\b"
            },
            {
              token: "paren.lparen",
              regex: "[[({]"
            },
            {
              token: "paren.rparen",
              regex: "[\\])}]"
            },
            {
              token: "text",
              regex: /[^\s,:\[\]\{\}]+/
            }
          ],
          "mlStringPre": [
            {
              token: "indent",
              regex: /^ *$/
            },
            {
              token: "indent",
              regex: /^ */,
              onMatch: function(val, state, stack) {
                var curIndent = stack[1];
                if (curIndent >= val.length) {
                  this.next = "start";
                  stack.shift();
                  stack.shift();
                } else {
                  stack[1] = val.length - 1;
                  this.next = stack[0] = "mlString";
                }
                return this.token;
              },
              next: "mlString"
            },
            {
              defaultToken: "string"
            }
          ],
          "mlString": [
            {
              token: "indent",
              regex: /^ *$/
            },
            {
              token: "indent",
              regex: /^ */,
              onMatch: function(val, state, stack) {
                var curIndent = stack[1];
                if (curIndent >= val.length) {
                  this.next = "start";
                  stack.splice(0);
                } else {
                  this.next = "mlString";
                }
                return this.token;
              },
              next: "mlString"
            },
            {
              token: "string",
              regex: ".+"
            }
          ]
        };
        this.normalizeRules();
      };
      oop.inherits(YamlHighlightRules, TextHighlightRules);
      exports2.YamlHighlightRules = YamlHighlightRules;
    });
    ace.define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function(require2, exports2, module2) {
      var Range = require2("../range").Range;
      var MatchingBraceOutdent = function() {
      };
      (function() {
        this.checkOutdent = function(line, input) {
          if (!/^\s+$/.test(line))
            return false;
          return /^\s*\}/.test(input);
        };
        this.autoOutdent = function(doc, row) {
          var line = doc.getLine(row);
          var match = line.match(/^(\s*\})/);
          if (!match)
            return 0;
          var column = match[1].length;
          var openBracePos = doc.findMatchingBracket({ row, column });
          if (!openBracePos || openBracePos.row == row)
            return 0;
          var indent = this.$getIndent(doc.getLine(openBracePos.row));
          doc.replace(new Range(row, 0, row, column - 1), indent);
        };
        this.$getIndent = function(line) {
          return line.match(/^\s*/)[0];
        };
      }).call(MatchingBraceOutdent.prototype);
      exports2.MatchingBraceOutdent = MatchingBraceOutdent;
    });
    ace.define("ace/mode/folding/coffee", ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/fold_mode", "ace/range"], function(require2, exports2, module2) {
      var oop = require2("../../lib/oop");
      var BaseFoldMode = require2("./fold_mode").FoldMode;
      var Range = require2("../../range").Range;
      var FoldMode = exports2.FoldMode = function() {
      };
      oop.inherits(FoldMode, BaseFoldMode);
      (function() {
        this.getFoldWidgetRange = function(session, foldStyle, row) {
          var range = this.indentationBlock(session, row);
          if (range)
            return range;
          var re = /\S/;
          var line = session.getLine(row);
          var startLevel = line.search(re);
          if (startLevel == -1 || line[startLevel] != "#")
            return;
          var startColumn = line.length;
          var maxRow = session.getLength();
          var startRow = row;
          var endRow = row;
          while (++row < maxRow) {
            line = session.getLine(row);
            var level = line.search(re);
            if (level == -1)
              continue;
            if (line[level] != "#")
              break;
            endRow = row;
          }
          if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
          }
        };
        this.getFoldWidget = function(session, foldStyle, row) {
          var line = session.getLine(row);
          var indent = line.search(/\S/);
          var next = session.getLine(row + 1);
          var prev = session.getLine(row - 1);
          var prevIndent = prev.search(/\S/);
          var nextIndent = next.search(/\S/);
          if (indent == -1) {
            session.foldWidgets[row - 1] = prevIndent != -1 && prevIndent < nextIndent ? "start" : "";
            return "";
          }
          if (prevIndent == -1) {
            if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
              session.foldWidgets[row - 1] = "";
              session.foldWidgets[row + 1] = "";
              return "start";
            }
          } else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
            if (session.getLine(row - 2).search(/\S/) == -1) {
              session.foldWidgets[row - 1] = "start";
              session.foldWidgets[row + 1] = "";
              return "";
            }
          }
          if (prevIndent != -1 && prevIndent < indent)
            session.foldWidgets[row - 1] = "start";
          else
            session.foldWidgets[row - 1] = "";
          if (indent < nextIndent)
            return "start";
          else
            return "";
        };
      }).call(FoldMode.prototype);
    });
    ace.define("ace/mode/yaml", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/yaml_highlight_rules", "ace/mode/matching_brace_outdent", "ace/mode/folding/coffee", "ace/worker/worker_client"], function(require2, exports2, module2) {
      var oop = require2("../lib/oop");
      var TextMode = require2("./text").Mode;
      var YamlHighlightRules = require2("./yaml_highlight_rules").YamlHighlightRules;
      var MatchingBraceOutdent = require2("./matching_brace_outdent").MatchingBraceOutdent;
      var FoldMode = require2("./folding/coffee").FoldMode;
      var WorkerClient = require2("../worker/worker_client").WorkerClient;
      var Mode = function() {
        this.HighlightRules = YamlHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.foldingRules = new FoldMode();
        this.$behaviour = this.$defaultBehaviour;
      };
      oop.inherits(Mode, TextMode);
      (function() {
        this.lineCommentStart = ["#"];
        this.getNextLineIndent = function(state, line, tab) {
          var indent = this.$getIndent(line);
          if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
              indent += tab;
            }
          }
          return indent;
        };
        this.checkOutdent = function(state, line, input) {
          return this.$outdent.checkOutdent(line, input);
        };
        this.autoOutdent = function(state, doc, row) {
          this.$outdent.autoOutdent(doc, row);
        };
        this.createWorker = function(session) {
          var worker = new WorkerClient(["ace"], "ace/mode/yaml_worker", "YamlWorker");
          worker.attachToDocument(session.getDocument());
          worker.on("annotate", function(results) {
            session.setAnnotations(results.data);
          });
          worker.on("terminate", function() {
            session.clearAnnotations();
          });
          return worker;
        };
        this.$id = "ace/mode/yaml";
      }).call(Mode.prototype);
      exports2.Mode = Mode;
    });
    (function() {
      ace.require(["ace/mode/yaml"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(modeYaml$2);
  return modeYaml$2.exports;
}
var modeYamlExports = requireModeYaml();
const modeYaml = /* @__PURE__ */ getDefaultExportFromCjs(modeYamlExports);
const modeYaml$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: modeYaml
}, [modeYamlExports]);
export {
  modeYaml$1 as m
};
