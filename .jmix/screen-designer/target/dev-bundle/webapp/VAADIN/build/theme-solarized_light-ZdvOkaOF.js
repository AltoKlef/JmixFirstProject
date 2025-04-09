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
var themeSolarized_light$2 = { exports: {} };
var hasRequiredThemeSolarized_light;
function requireThemeSolarized_light() {
  if (hasRequiredThemeSolarized_light) return themeSolarized_light$2.exports;
  hasRequiredThemeSolarized_light = 1;
  (function(module, exports) {
    ace.define("ace/theme/solarized_light.css", ["require", "exports", "module"], function(require2, exports2, module2) {
      module2.exports = '.ace-solarized-light .ace_gutter {\n  background: #fbf1d3;\n  color: #333\n}\n\n.ace-solarized-light .ace_print-margin {\n  width: 1px;\n  background: #e8e8e8\n}\n\n.ace-solarized-light {\n  background-color: #FDF6E3;\n  color: #586E75\n}\n\n.ace-solarized-light .ace_cursor {\n  color: #000000\n}\n\n.ace-solarized-light .ace_marker-layer .ace_selection {\n  background: rgba(7, 54, 67, 0.09)\n}\n\n.ace-solarized-light.ace_multiselect .ace_selection.ace_start {\n  box-shadow: 0 0 3px 0px #FDF6E3;\n}\n\n.ace-solarized-light .ace_marker-layer .ace_step {\n  background: rgb(255, 255, 0)\n}\n\n.ace-solarized-light .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgba(147, 161, 161, 0.50)\n}\n\n.ace-solarized-light .ace_marker-layer .ace_active-line {\n  background: #EEE8D5\n}\n\n.ace-solarized-light .ace_gutter-active-line {\n  background-color : #EDE5C1\n}\n\n.ace-solarized-light .ace_marker-layer .ace_selected-word {\n  border: 1px solid #7f9390\n}\n\n.ace-solarized-light .ace_invisible {\n  color: rgba(147, 161, 161, 0.50)\n}\n\n.ace-solarized-light .ace_keyword,\n.ace-solarized-light .ace_meta,\n.ace-solarized-light .ace_support.ace_class,\n.ace-solarized-light .ace_support.ace_type {\n  color: #859900\n}\n\n.ace-solarized-light .ace_constant.ace_character,\n.ace-solarized-light .ace_constant.ace_other {\n  color: #CB4B16\n}\n\n.ace-solarized-light .ace_constant.ace_language {\n  color: #B58900\n}\n\n.ace-solarized-light .ace_constant.ace_numeric {\n  color: #D33682\n}\n\n.ace-solarized-light .ace_fold {\n  background-color: #268BD2;\n  border-color: #586E75\n}\n\n.ace-solarized-light .ace_entity.ace_name.ace_function,\n.ace-solarized-light .ace_entity.ace_name.ace_tag,\n.ace-solarized-light .ace_support.ace_function,\n.ace-solarized-light .ace_variable,\n.ace-solarized-light .ace_variable.ace_language {\n  color: #268BD2\n}\n\n.ace-solarized-light .ace_storage {\n  color: #073642\n}\n\n.ace-solarized-light .ace_string {\n  color: #2AA198\n}\n\n.ace-solarized-light .ace_string.ace_regexp {\n  color: #D30102\n}\n\n.ace-solarized-light .ace_comment,\n.ace-solarized-light .ace_entity.ace_other.ace_attribute-name {\n  color: #93A1A1\n}\n\n.ace-solarized-light .ace_indent-guide {\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHjy8NJ/AAjgA5fzQUmBAAAAAElFTkSuQmCC) right repeat-y\n}\n\n.ace-solarized-light .ace_indent-guide-active {\n  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAZSURBVHjaYvj///9/hivKyv8BAAAA//8DACLqBhbvk+/eAAAAAElFTkSuQmCC") right repeat-y;\n} \n';
    });
    ace.define("ace/theme/solarized_light", ["require", "exports", "module", "ace/theme/solarized_light.css", "ace/lib/dom"], function(require2, exports2, module2) {
      exports2.isDark = false;
      exports2.cssClass = "ace-solarized-light";
      exports2.cssText = require2("./solarized_light.css");
      var dom = require2("../lib/dom");
      dom.importCssString(exports2.cssText, exports2.cssClass, false);
    });
    (function() {
      ace.require(["ace/theme/solarized_light"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(themeSolarized_light$2);
  return themeSolarized_light$2.exports;
}
var themeSolarized_lightExports = requireThemeSolarized_light();
const themeSolarized_light = /* @__PURE__ */ getDefaultExportFromCjs(themeSolarized_lightExports);
const themeSolarized_light$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: themeSolarized_light
}, [themeSolarized_lightExports]);
export {
  themeSolarized_light$1 as t
};
