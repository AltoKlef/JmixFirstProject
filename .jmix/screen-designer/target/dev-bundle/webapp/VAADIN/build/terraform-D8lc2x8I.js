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
var terraform$2 = { exports: {} };
var hasRequiredTerraform;
function requireTerraform() {
  if (hasRequiredTerraform) return terraform$2.exports;
  hasRequiredTerraform = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/terraform"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(terraform$2);
  return terraform$2.exports;
}
var terraformExports = requireTerraform();
const terraform = /* @__PURE__ */ getDefaultExportFromCjs(terraformExports);
const terraform$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: terraform
}, [terraformExports]);
export {
  terraform$1 as t
};
