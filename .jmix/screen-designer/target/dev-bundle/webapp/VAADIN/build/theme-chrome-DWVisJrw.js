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
var themeChrome$2 = { exports: {} };
var hasRequiredThemeChrome;
function requireThemeChrome() {
  if (hasRequiredThemeChrome) return themeChrome$2.exports;
  hasRequiredThemeChrome = 1;
  (function(module, exports) {
    ace.define("ace/theme/chrome.css", ["require", "exports", "module"], function(require2, exports2, module2) {
      module2.exports = '.ace-chrome .ace_gutter {\n  background: #ebebeb;\n  color: #333;\n  overflow : hidden;\n}\n\n.ace-chrome .ace_print-margin {\n  width: 1px;\n  background: #e8e8e8;\n}\n\n.ace-chrome {\n  background-color: #FFFFFF;\n  color: black;\n}\n\n.ace-chrome .ace_cursor {\n  color: black;\n}\n\n.ace-chrome .ace_invisible {\n  color: rgb(191, 191, 191);\n}\n\n.ace-chrome .ace_constant.ace_buildin {\n  color: rgb(88, 72, 246);\n}\n\n.ace-chrome .ace_constant.ace_language {\n  color: rgb(88, 92, 246);\n}\n\n.ace-chrome .ace_constant.ace_library {\n  color: rgb(6, 150, 14);\n}\n\n.ace-chrome .ace_invalid {\n  background-color: rgb(153, 0, 0);\n  color: white;\n}\n\n.ace-chrome .ace_fold {\n}\n\n.ace-chrome .ace_support.ace_function {\n  color: rgb(60, 76, 114);\n}\n\n.ace-chrome .ace_support.ace_constant {\n  color: rgb(6, 150, 14);\n}\n\n.ace-chrome .ace_support.ace_type,\n.ace-chrome .ace_support.ace_class\n.ace-chrome .ace_support.ace_other {\n  color: rgb(109, 121, 222);\n}\n\n.ace-chrome .ace_variable.ace_parameter {\n  font-style:italic;\n  color:#FD971F;\n}\n.ace-chrome .ace_keyword.ace_operator {\n  color: rgb(104, 118, 135);\n}\n\n.ace-chrome .ace_comment {\n  color: #236e24;\n}\n\n.ace-chrome .ace_comment.ace_doc {\n  color: #236e24;\n}\n\n.ace-chrome .ace_comment.ace_doc.ace_tag {\n  color: #236e24;\n}\n\n.ace-chrome .ace_constant.ace_numeric {\n  color: rgb(0, 0, 205);\n}\n\n.ace-chrome .ace_variable {\n  color: rgb(49, 132, 149);\n}\n\n.ace-chrome .ace_xml-pe {\n  color: rgb(104, 104, 91);\n}\n\n.ace-chrome .ace_entity.ace_name.ace_function {\n  color: #0000A2;\n}\n\n\n.ace-chrome .ace_heading {\n  color: rgb(12, 7, 255);\n}\n\n.ace-chrome .ace_list {\n  color:rgb(185, 6, 144);\n}\n\n.ace-chrome .ace_marker-layer .ace_selection {\n  background: rgb(181, 213, 255);\n}\n\n.ace-chrome .ace_marker-layer .ace_step {\n  background: rgb(252, 255, 0);\n}\n\n.ace-chrome .ace_marker-layer .ace_stack {\n  background: rgb(164, 229, 101);\n}\n\n.ace-chrome .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgb(192, 192, 192);\n}\n\n.ace-chrome .ace_marker-layer .ace_active-line {\n  background: rgba(0, 0, 0, 0.07);\n}\n\n.ace-chrome .ace_gutter-active-line {\n    background-color : #dcdcdc;\n}\n\n.ace-chrome .ace_marker-layer .ace_selected-word {\n  background: rgb(250, 250, 255);\n  border: 1px solid rgb(200, 200, 250);\n}\n\n.ace-chrome .ace_storage,\n.ace-chrome .ace_keyword,\n.ace-chrome .ace_meta.ace_tag {\n  color: rgb(147, 15, 128);\n}\n\n.ace-chrome .ace_string.ace_regex {\n  color: rgb(255, 0, 0)\n}\n\n.ace-chrome .ace_string {\n  color: #1A1AA6;\n}\n\n.ace-chrome .ace_entity.ace_other.ace_attribute-name {\n  color: #994409;\n}\n\n.ace-chrome .ace_indent-guide {\n  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") right repeat-y;\n}\n  \n.ace-chrome .ace_indent-guide-active {\n  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAZSURBVHjaYvj///9/hivKyv8BAAAA//8DACLqBhbvk+/eAAAAAElFTkSuQmCC") right repeat-y;\n}\n';
    });
    ace.define("ace/theme/chrome", ["require", "exports", "module", "ace/theme/chrome.css", "ace/lib/dom"], function(require2, exports2, module2) {
      exports2.isDark = false;
      exports2.cssClass = "ace-chrome";
      exports2.cssText = require2("./chrome.css");
      var dom = require2("../lib/dom");
      dom.importCssString(exports2.cssText, exports2.cssClass, false);
    });
    (function() {
      ace.require(["ace/theme/chrome"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(themeChrome$2);
  return themeChrome$2.exports;
}
var themeChromeExports = requireThemeChrome();
const themeChrome = /* @__PURE__ */ getDefaultExportFromCjs(themeChromeExports);
const themeChrome$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: themeChrome
}, [themeChromeExports]);
export {
  themeChrome$1 as t
};
