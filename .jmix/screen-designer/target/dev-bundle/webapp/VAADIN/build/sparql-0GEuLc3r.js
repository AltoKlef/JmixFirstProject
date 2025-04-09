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
var sparql$2 = { exports: {} };
var hasRequiredSparql;
function requireSparql() {
  if (hasRequiredSparql) return sparql$2.exports;
  hasRequiredSparql = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/sparql"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(sparql$2);
  return sparql$2.exports;
}
var sparqlExports = requireSparql();
const sparql = /* @__PURE__ */ getDefaultExportFromCjs(sparqlExports);
const sparql$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: sparql
}, [sparqlExports]);
export {
  sparql$1 as s
};
