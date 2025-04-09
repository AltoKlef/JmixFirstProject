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
var applescript$2 = { exports: {} };
var hasRequiredApplescript;
function requireApplescript() {
  if (hasRequiredApplescript) return applescript$2.exports;
  hasRequiredApplescript = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/applescript"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(applescript$2);
  return applescript$2.exports;
}
var applescriptExports = requireApplescript();
const applescript = /* @__PURE__ */ getDefaultExportFromCjs(applescriptExports);
const applescript$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: applescript
}, [applescriptExports]);
export {
  applescript$1 as a
};
