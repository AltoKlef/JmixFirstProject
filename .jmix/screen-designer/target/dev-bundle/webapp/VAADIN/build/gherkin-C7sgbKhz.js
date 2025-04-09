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
var gherkin$2 = { exports: {} };
var hasRequiredGherkin;
function requireGherkin() {
  if (hasRequiredGherkin) return gherkin$2.exports;
  hasRequiredGherkin = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/gherkin"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(gherkin$2);
  return gherkin$2.exports;
}
var gherkinExports = requireGherkin();
const gherkin = /* @__PURE__ */ getDefaultExportFromCjs(gherkinExports);
const gherkin$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: gherkin
}, [gherkinExports]);
export {
  gherkin$1 as g
};
