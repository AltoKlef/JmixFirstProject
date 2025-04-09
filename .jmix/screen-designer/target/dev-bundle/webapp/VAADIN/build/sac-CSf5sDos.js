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
var sac$2 = { exports: {} };
var hasRequiredSac;
function requireSac() {
  if (hasRequiredSac) return sac$2.exports;
  hasRequiredSac = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/sac"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(sac$2);
  return sac$2.exports;
}
var sacExports = requireSac();
const sac = /* @__PURE__ */ getDefaultExportFromCjs(sacExports);
const sac$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: sac
}, [sacExports]);
export {
  sac$1 as s
};
