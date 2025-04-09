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
var mask$2 = { exports: {} };
var hasRequiredMask;
function requireMask() {
  if (hasRequiredMask) return mask$2.exports;
  hasRequiredMask = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/mask"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(mask$2);
  return mask$2.exports;
}
var maskExports = requireMask();
const mask = /* @__PURE__ */ getDefaultExportFromCjs(maskExports);
const mask$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: mask
}, [maskExports]);
export {
  mask$1 as m
};
