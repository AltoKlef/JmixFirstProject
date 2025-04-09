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
var aql$2 = { exports: {} };
var hasRequiredAql;
function requireAql() {
  if (hasRequiredAql) return aql$2.exports;
  hasRequiredAql = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/aql"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(aql$2);
  return aql$2.exports;
}
var aqlExports = requireAql();
const aql = /* @__PURE__ */ getDefaultExportFromCjs(aqlExports);
const aql$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: aql
}, [aqlExports]);
export {
  aql$1 as a
};
