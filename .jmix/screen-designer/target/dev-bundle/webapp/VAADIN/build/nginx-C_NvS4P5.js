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
var nginx$2 = { exports: {} };
var hasRequiredNginx;
function requireNginx() {
  if (hasRequiredNginx) return nginx$2.exports;
  hasRequiredNginx = 1;
  (function(module, exports) {
    (function() {
      ace.require(["ace/snippets/nginx"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(nginx$2);
  return nginx$2.exports;
}
var nginxExports = requireNginx();
const nginx = /* @__PURE__ */ getDefaultExportFromCjs(nginxExports);
const nginx$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: nginx
}, [nginxExports]);
export {
  nginx$1 as n
};
