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
var themeCobalt$2 = { exports: {} };
var hasRequiredThemeCobalt;
function requireThemeCobalt() {
  if (hasRequiredThemeCobalt) return themeCobalt$2.exports;
  hasRequiredThemeCobalt = 1;
  (function(module, exports) {
    ace.define("ace/theme/cobalt.css", ["require", "exports", "module"], function(require2, exports2, module2) {
      module2.exports = ".ace-cobalt .ace_gutter {\n  background: #011e3a;\n  color: rgb(128,145,160)\n}\n\n.ace-cobalt .ace_print-margin {\n  width: 1px;\n  background: #555555\n}\n\n.ace-cobalt {\n  background-color: #002240;\n  color: #FFFFFF\n}\n\n.ace-cobalt .ace_cursor {\n  color: #FFFFFF\n}\n\n.ace-cobalt .ace_marker-layer .ace_selection {\n  background: rgba(179, 101, 57, 0.75)\n}\n\n.ace-cobalt.ace_multiselect .ace_selection.ace_start {\n  box-shadow: 0 0 3px 0px #002240;\n}\n\n.ace-cobalt .ace_marker-layer .ace_step {\n  background: rgb(127, 111, 19)\n}\n\n.ace-cobalt .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgba(255, 255, 255, 0.15)\n}\n\n.ace-cobalt .ace_marker-layer .ace_active-line {\n  background: rgba(0, 0, 0, 0.35)\n}\n\n.ace-cobalt .ace_gutter-active-line {\n  background-color: rgba(0, 0, 0, 0.35)\n}\n\n.ace-cobalt .ace_marker-layer .ace_selected-word {\n  border: 1px solid rgba(179, 101, 57, 0.75)\n}\n\n.ace-cobalt .ace_invisible {\n  color: rgba(255, 255, 255, 0.15)\n}\n\n.ace-cobalt .ace_keyword,\n.ace-cobalt .ace_meta {\n  color: #FF9D00\n}\n\n.ace-cobalt .ace_constant,\n.ace-cobalt .ace_constant.ace_character,\n.ace-cobalt .ace_constant.ace_character.ace_escape,\n.ace-cobalt .ace_constant.ace_other {\n  color: #FF628C\n}\n\n.ace-cobalt .ace_invalid {\n  color: #F8F8F8;\n  background-color: #800F00\n}\n\n.ace-cobalt .ace_support {\n  color: #80FFBB\n}\n\n.ace-cobalt .ace_support.ace_constant {\n  color: #EB939A\n}\n\n.ace-cobalt .ace_fold {\n  background-color: #FF9D00;\n  border-color: #FFFFFF\n}\n\n.ace-cobalt .ace_support.ace_function {\n  color: #FFB054\n}\n\n.ace-cobalt .ace_storage {\n  color: #FFEE80\n}\n\n.ace-cobalt .ace_entity {\n  color: #FFDD00\n}\n\n.ace-cobalt .ace_string {\n  color: #3AD900\n}\n\n.ace-cobalt .ace_string.ace_regexp {\n  color: #80FFC2\n}\n\n.ace-cobalt .ace_comment {\n  font-style: italic;\n  color: #0088FF\n}\n\n.ace-cobalt .ace_heading,\n.ace-cobalt .ace_markup.ace_heading {\n  color: #C8E4FD;\n  background-color: #001221\n}\n\n.ace-cobalt .ace_list,\n.ace-cobalt .ace_markup.ace_list {\n  background-color: #130D26\n}\n\n.ace-cobalt .ace_variable {\n  color: #CCCCCC\n}\n\n.ace-cobalt .ace_variable.ace_language {\n  color: #FF80E1\n}\n\n.ace-cobalt .ace_meta.ace_tag {\n  color: #9EFFFF\n}\n\n.ace-cobalt .ace_indent-guide {\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHCLSvkPAAP3AgSDTRd4AAAAAElFTkSuQmCC) right repeat-y\n}\n\n.ace-cobalt .ace_indent-guide-active {\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQIW2PQ1dX9zzBz5sz/ABCcBFFentLlAAAAAElFTkSuQmCC) right repeat-y;\n}\n";
    });
    ace.define("ace/theme/cobalt", ["require", "exports", "module", "ace/theme/cobalt.css", "ace/lib/dom"], function(require2, exports2, module2) {
      exports2.isDark = true;
      exports2.cssClass = "ace-cobalt";
      exports2.cssText = require2("./cobalt.css");
      var dom = require2("../lib/dom");
      dom.importCssString(exports2.cssText, exports2.cssClass, false);
    });
    (function() {
      ace.require(["ace/theme/cobalt"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(themeCobalt$2);
  return themeCobalt$2.exports;
}
var themeCobaltExports = requireThemeCobalt();
const themeCobalt = /* @__PURE__ */ getDefaultExportFromCjs(themeCobaltExports);
const themeCobalt$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: themeCobalt
}, [themeCobaltExports]);
export {
  themeCobalt$1 as t
};
