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
var handlebars$2 = { exports: {} };
var hasRequiredHandlebars;
function requireHandlebars() {
  if (hasRequiredHandlebars) return handlebars$2.exports;
  hasRequiredHandlebars = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/handlebars"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(handlebars$2);
  return handlebars$2.exports;
}
var handlebarsExports = requireHandlebars();
const handlebars = /* @__PURE__ */ getDefaultExportFromCjs(handlebarsExports);
const handlebars$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: handlebars
}, [handlebarsExports]);
export {
  handlebars$1 as h
};
