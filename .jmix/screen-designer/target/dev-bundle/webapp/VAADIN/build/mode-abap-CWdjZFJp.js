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
var modeAbap$2 = { exports: {} };
var hasRequiredModeAbap;
function requireModeAbap() {
  if (hasRequiredModeAbap) return modeAbap$2.exports;
  hasRequiredModeAbap = 1;
  (function(module, exports) {
    ace.define("ace/mode/abap_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(require2, exports2, module2) {
      var oop = require2("../lib/oop");
      var TextHighlightRules = require2("./text_highlight_rules").TextHighlightRules;
      var AbapHighlightRules = function() {
        var keywordMapper = this.createKeywordMapper({
          "variable.language": "this",
          "keyword": "ADD ALIAS ALIASES ASCENDING ASSERT ASSIGN ASSIGNING AT BACK CALL CASE CATCH CHECK CLASS CLEAR CLOSE CNT COLLECT COMMIT COMMUNICATION COMPUTE CONCATENATE CONDENSE CONSTANTS CONTINUE CONTROLS CONVERT CREATE CURRENCY DATA DEFINE DEFINITION DEFERRED DELETE DESCENDING DESCRIBE DETAIL DIVIDE DO ELSE ELSEIF ENDAT ENDCASE ENDCLASS ENDDO ENDEXEC ENDFORM ENDFUNCTION ENDIF ENDIFEND ENDINTERFACE ENDLOOP ENDMETHOD ENDMODULE ENDON ENDPROVIDE ENDSELECT ENDTRY ENDWHILE EVENT EVENTS EXEC EXIT EXPORT EXPORTING EXTRACT FETCH FIELDS FORM FORMAT FREE FROM FUNCTION GENERATE GET HIDE IF IMPORT IMPORTING INDEX INFOTYPES INITIALIZATION INTERFACE INTERFACES INPUT INSERT IMPLEMENTATION LEAVE LIKE LINE LOAD LOCAL LOOP MESSAGE METHOD METHODS MODIFY MODULE MOVE MULTIPLY ON OVERLAY OPTIONAL OTHERS PACK PARAMETERS PERFORM POSITION PROGRAM PROVIDE PUT RAISE RANGES READ RECEIVE RECEIVING REDEFINITION REFERENCE REFRESH REJECT REPLACE REPORT RESERVE RESTORE RETURN RETURNING ROLLBACK SCAN SCROLL SEARCH SELECT SET SHIFT SKIP SORT SORTED SPLIT STANDARD STATICS STEP STOP SUBMIT SUBTRACT SUM SUMMARY SUPPRESS TABLES TIMES TRANSFER TRANSLATE TRY TYPE TYPES UNASSIGN ULINE UNPACK UPDATE WHEN WHILE WINDOW WRITE OCCURS STRUCTURE OBJECT PROPERTY CASTING APPEND RAISING VALUE COLOR CHANGING EXCEPTION EXCEPTIONS DEFAULT CHECKBOX COMMENT ID NUMBER FOR TITLE OUTPUT WITH EXIT USING INTO WHERE GROUP BY HAVING ORDER BY SINGLE APPENDING CORRESPONDING FIELDS OF TABLE LEFT RIGHT OUTER INNER JOIN AS CLIENT SPECIFIED BYPASSING BUFFER UP TO ROWS CONNECTING EQ NE LT LE GT GE NOT AND OR XOR IN LIKE BETWEEN",
          "constant.language": "TRUE FALSE NULL SPACE",
          "support.type": "c n i p f d t x string xstring decfloat16 decfloat34",
          "keyword.operator": "abs sign ceil floor trunc frac acos asin atan cos sin tan abapOperator cosh sinh tanh exp log log10 sqrt strlen xstrlen charlen numofchar dbmaxlen lines"
        }, "text", true, " ");
        var compoundKeywords = "WITH\\W+(?:HEADER\\W+LINE|FRAME|KEY)|NO\\W+STANDARD\\W+PAGE\\W+HEADING|EXIT\\W+FROM\\W+STEP\\W+LOOP|BEGIN\\W+OF\\W+(?:BLOCK|LINE)|BEGIN\\W+OF|END\\W+OF\\W+(?:BLOCK|LINE)|END\\W+OF|NO\\W+INTERVALS|RESPECTING\\W+BLANKS|SEPARATED\\W+BY|USING\\W+(?:EDIT\\W+MASK)|WHERE\\W+(?:LINE)|RADIOBUTTON\\W+GROUP|REF\\W+TO|(?:PUBLIC|PRIVATE|PROTECTED)(?:\\W+SECTION)?|DELETING\\W+(?:TRAILING|LEADING)(?:ALL\\W+OCCURRENCES)|(?:FIRST|LAST)\\W+OCCURRENCE|INHERITING\\W+FROM|LINE-COUNT|ADD-CORRESPONDING|AUTHORITY-CHECK|BREAK-POINT|CLASS-DATA|CLASS-METHODS|CLASS-METHOD|DIVIDE-CORRESPONDING|EDITOR-CALL|END-OF-DEFINITION|END-OF-PAGE|END-OF-SELECTION|FIELD-GROUPS|FIELD-SYMBOLS|FUNCTION-POOL|MOVE-CORRESPONDING|MULTIPLY-CORRESPONDING|NEW-LINE|NEW-PAGE|NEW-SECTION|PRINT-CONTROL|RP-PROVIDE-FROM-LAST|SELECT-OPTIONS|SELECTION-SCREEN|START-OF-SELECTION|SUBTRACT-CORRESPONDING|SYNTAX-CHECK|SYNTAX-TRACE|TOP-OF-PAGE|TYPE-POOL|TYPE-POOLS|LINE-SIZE|LINE-COUNT|MESSAGE-ID|DISPLAY-MODE|READ(?:-ONLY)?|IS\\W+(?:NOT\\W+)?(?:ASSIGNED|BOUND|INITIAL|SUPPLIED)";
        this.$rules = {
          "start": [
            { token: "string", regex: "`", next: "string" },
            { token: "string", regex: "'", next: "qstring" },
            { token: "doc.comment", regex: /^\*.+/ },
            { token: "comment", regex: /".+$/ },
            { token: "invalid", regex: "\\.{2,}" },
            { token: "keyword.operator", regex: /\W[\-+%=<>*]\W|\*\*|[~:,\.&$]|->*?|=>/ },
            { token: "paren.lparen", regex: "[\\[({]" },
            { token: "paren.rparen", regex: "[\\])}]" },
            { token: "constant.numeric", regex: "[+-]?\\d+\\b" },
            { token: "variable.parameter", regex: /sy|pa?\d\d\d\d\|t\d\d\d\.|innnn/ },
            { token: "keyword", regex: compoundKeywords },
            { token: "variable.parameter", regex: /\w+-\w[\-\w]*/ },
            { token: keywordMapper, regex: "\\b\\w+\\b" },
            { caseInsensitive: true }
          ],
          "qstring": [
            { token: "constant.language.escape", regex: "''" },
            { token: "string", regex: "'", next: "start" },
            { defaultToken: "string" }
          ],
          "string": [
            { token: "constant.language.escape", regex: "``" },
            { token: "string", regex: "`", next: "start" },
            { defaultToken: "string" }
          ]
        };
      };
      oop.inherits(AbapHighlightRules, TextHighlightRules);
      exports2.AbapHighlightRules = AbapHighlightRules;
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
    ace.define("ace/mode/abap", ["require", "exports", "module", "ace/mode/abap_highlight_rules", "ace/mode/folding/coffee", "ace/range", "ace/mode/text", "ace/lib/oop"], function(require2, exports2, module2) {
      var Rules = require2("./abap_highlight_rules").AbapHighlightRules;
      var FoldMode = require2("./folding/coffee").FoldMode;
      require2("../range").Range;
      var TextMode = require2("./text").Mode;
      var oop = require2("../lib/oop");
      function Mode() {
        this.HighlightRules = Rules;
        this.foldingRules = new FoldMode();
      }
      oop.inherits(Mode, TextMode);
      (function() {
        this.lineCommentStart = '"';
        this.getNextLineIndent = function(state, line, tab) {
          var indent = this.$getIndent(line);
          return indent;
        };
        this.$id = "ace/mode/abap";
      }).call(Mode.prototype);
      exports2.Mode = Mode;
    });
    (function() {
      ace.require(["ace/mode/abap"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(modeAbap$2);
  return modeAbap$2.exports;
}
var modeAbapExports = requireModeAbap();
const modeAbap = /* @__PURE__ */ getDefaultExportFromCjs(modeAbapExports);
const modeAbap$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: modeAbap
}, [modeAbapExports]);
export {
  modeAbap$1 as m
};
