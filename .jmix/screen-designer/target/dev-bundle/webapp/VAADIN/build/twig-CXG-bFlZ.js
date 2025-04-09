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
var twig$2 = { exports: {} };
var hasRequiredTwig;
function requireTwig() {
  if (hasRequiredTwig) return twig$2.exports;
  hasRequiredTwig = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/twig"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(twig$2);
  return twig$2.exports;
}
var twigExports = requireTwig();
const twig = /* @__PURE__ */ getDefaultExportFromCjs(twigExports);
const twig$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: twig
}, [twigExports]);
export {
  twig$1 as t
};
