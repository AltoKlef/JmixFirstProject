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
var ejs$2 = { exports: {} };
var hasRequiredEjs;
function requireEjs() {
  if (hasRequiredEjs) return ejs$2.exports;
  hasRequiredEjs = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/ejs"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(ejs$2);
  return ejs$2.exports;
}
var ejsExports = requireEjs();
const ejs = /* @__PURE__ */ getDefaultExportFromCjs(ejsExports);
const ejs$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: ejs
}, [ejsExports]);
export {
  ejs$1 as e
};
