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
var modePascal$2 = { exports: {} };
var hasRequiredModePascal;
function requireModePascal() {
  if (hasRequiredModePascal) return modePascal$2.exports;
  hasRequiredModePascal = 1;
  (function(module, exports) {
    ace.define("ace/mode/pascal_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(require2, exports2, module2) {
      var oop = require2("../lib/oop");
      var TextHighlightRules = require2("./text_highlight_rules").TextHighlightRules;
      var PascalHighlightRules = function() {
        var keywordMapper = this.createKeywordMapper({
          "keyword.control": "absolute|abstract|all|and|and_then|array|as|asm|attribute|begin|bindable|case|class|const|constructor|destructor|div|do|do|else|end|except|export|exports|external|far|file|finalization|finally|for|forward|goto|if|implementation|import|in|inherited|initialization|interface|interrupt|is|label|library|mod|module|name|near|nil|not|object|of|only|operator|or|or_else|otherwise|packed|pow|private|program|property|protected|public|published|qualified|record|repeat|resident|restricted|segment|set|shl|shr|then|to|try|type|unit|until|uses|value|var|view|virtual|while|with|xor"
        }, "identifier", true);
        this.$rules = {
          start: [
            {
              caseInsensitive: true,
              token: [
                "variable",
                "text",
                "storage.type.prototype",
                "entity.name.function.prototype"
              ],
              regex: "\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?(?=(?:\\(.*?\\))?;\\s*(?:attribute|forward|external))"
            },
            {
              caseInsensitive: true,
              token: ["variable", "text", "storage.type.function", "entity.name.function"],
              regex: "\\b(function|procedure)(\\s+)(\\w+)(\\.\\w+)?"
            },
            {
              caseInsensitive: true,
              token: keywordMapper,
              regex: /\b[a-z_]+\b/
            },
            {
              token: "constant.numeric",
              regex: "\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\.?[0-9]*)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?)(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
            },
            {
              token: "punctuation.definition.comment",
              regex: "--.*$"
            },
            {
              token: "punctuation.definition.comment",
              regex: "//.*$"
            },
            {
              token: "punctuation.definition.comment",
              regex: "\\(\\*",
              push: [
                {
                  token: "punctuation.definition.comment",
                  regex: "\\*\\)",
                  next: "pop"
                },
                { defaultToken: "comment.block.one" }
              ]
            },
            {
              token: "punctuation.definition.comment",
              regex: "\\{",
              push: [
                {
                  token: "punctuation.definition.comment",
                  regex: "\\}",
                  next: "pop"
                },
                { defaultToken: "comment.block.two" }
              ]
            },
            {
              token: "punctuation.definition.string.begin",
              regex: '"',
              push: [
                { token: "constant.character.escape", regex: "\\\\." },
                {
                  token: "punctuation.definition.string.end",
                  regex: '"',
                  next: "pop"
                },
                { defaultToken: "string.quoted.double" }
              ]
            },
            {
              token: "punctuation.definition.string.begin",
              regex: "'",
              push: [
                {
                  token: "constant.character.escape.apostrophe",
                  regex: "''"
                },
                {
                  token: "punctuation.definition.string.end",
                  regex: "'",
                  next: "pop"
                },
                { defaultToken: "string.quoted.single" }
              ]
            },
            {
              token: "keyword.operator",
              regex: "[+\\-;,/*%]|:=|="
            }
          ]
        };
        this.normalizeRules();
      };
      oop.inherits(PascalHighlightRules, TextHighlightRules);
      exports2.PascalHighlightRules = PascalHighlightRules;
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
    ace.define("ace/mode/pascal", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/pascal_highlight_rules", "ace/mode/folding/coffee"], function(require2, exports2, module2) {
      var oop = require2("../lib/oop");
      var TextMode = require2("./text").Mode;
      var PascalHighlightRules = require2("./pascal_highlight_rules").PascalHighlightRules;
      var FoldMode = require2("./folding/coffee").FoldMode;
      var Mode = function() {
        this.HighlightRules = PascalHighlightRules;
        this.foldingRules = new FoldMode();
        this.$behaviour = this.$defaultBehaviour;
      };
      oop.inherits(Mode, TextMode);
      (function() {
        this.lineCommentStart = ["--", "//"];
        this.blockComment = [
          { start: "(*", end: "*)" },
          { start: "{", end: "}" }
        ];
        this.$id = "ace/mode/pascal";
      }).call(Mode.prototype);
      exports2.Mode = Mode;
    });
    (function() {
      ace.require(["ace/mode/pascal"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(modePascal$2);
  return modePascal$2.exports;
}
var modePascalExports = requireModePascal();
const modePascal = /* @__PURE__ */ getDefaultExportFromCjs(modePascalExports);
const modePascal$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: modePascal
}, [modePascalExports]);
export {
  modePascal$1 as m
};
