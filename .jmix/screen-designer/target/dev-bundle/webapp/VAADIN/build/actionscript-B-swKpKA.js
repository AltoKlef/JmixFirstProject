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
var actionscript$2 = { exports: {} };
var hasRequiredActionscript;
function requireActionscript() {
  if (hasRequiredActionscript) return actionscript$2.exports;
  hasRequiredActionscript = 1;
  (function(module, exports) {
    ace.define("ace/snippets/actionscript.snippets", ["require", "exports", "module"], function(require2, exports2, module2) {
      module2.exports = 'snippet main\n	package {\n		import flash.display.*;\n		import flash.Events.*;\n	\n		public class Main extends Sprite {\n			public function Main (	) {\n				trace("start");\n				stage.scaleMode = StageScaleMode.NO_SCALE;\n				stage.addEventListener(Event.RESIZE, resizeListener);\n			}\n	\n			private function resizeListener (e:Event):void {\n				trace("The application window changed size!");\n				trace("New width:  " + stage.stageWidth);\n				trace("New height: " + stage.stageHeight);\n			}\n	\n		}\n	\n	}\nsnippet class\n	${1:public|internal} class ${2:name} ${3:extends } {\n		public function $2 (	) {\n			("start");\n		}\n	}\nsnippet all\n	package name {\n\n		${1:public|internal|final} class ${2:name} ${3:extends } {\n			private|public| static const FOO = "abc";\n			private|public| static var BAR = "abc";\n\n			// class initializer - no JIT !! one time setup\n			if Cababilities.os == "Linux|MacOS" {\n				FOO = "other";\n			}\n\n			// constructor:\n			public function $2 (	){\n				super2();\n				trace("start");\n			}\n			public function name (a, b...){\n				super.name(..);\n				lable:break\n			}\n		}\n	}\n\n	function A(){\n		// A can only be accessed within this file\n	}\nsnippet switch\n	switch(${1}){\n		case ${2}:\n			${3}\n		break;\n		default:\n	}\nsnippet case\n		case ${1}:\n			${2}\n		break;\nsnippet package\n	package ${1:package}{\n		${2}\n	}\nsnippet wh\n	while ${1:cond}{\n		${2}\n	}\nsnippet do\n	do {\n		${2}\n	} while (${1:cond})\nsnippet while\n	while ${1:cond}{\n		${2}\n	}\nsnippet for enumerate names\n	for (${1:var} in ${2:object}){\n		${3}\n	}\nsnippet for enumerate values\n	for each (${1:var} in ${2:object}){\n		${3}\n	}\nsnippet get_set\n	function get ${1:name} {\n		return ${2}\n	}\n	function set $1 (newValue) {\n		${3}\n	}\nsnippet interface\n	interface name {\n		function method(${1}):${2:returntype};\n	}\nsnippet try\n	try {\n		${1}\n	} catch (error:ErrorType) {\n		${2}\n	} finally {\n		${3}\n	}\n# For Loop (same as c.snippet)\nsnippet for for (..) {..}\n	for (${2:i} = 0; $2 < ${1:count}; $2${3:++}) {\n		${4:/* code */}\n	}\n# Custom For Loop\nsnippet forr\n	for (${1:i} = ${2:0}; ${3:$1 < 10}; $1${4:++}) {\n		${5:/* code */}\n	}\n# If Condition\nsnippet if\n	if (${1:/* condition */}) {\n		${2:/* code */}\n	}\nsnippet el\n	else {\n		${1}\n	}\n# Ternary conditional\nsnippet t\n	${1:/* condition */} ? ${2:a} : ${3:b}\nsnippet fun\n	function ${1:function_name}(${2})${3}\n	{\n		${4:/* code */}\n	}\n# FlxSprite (usefull when using the flixel library)\nsnippet FlxSprite\n	package\n	{\n		import org.flixel.*\n\n		public class ${1:ClassName} extends ${2:FlxSprite}\n		{\n			public function $1(${3: X:Number, Y:Number}):void\n			{\n				super(X,Y);\n				${4: //code...}\n			}\n\n			override public function update():void\n			{\n				super.update();\n				${5: //code...}\n			}\n		}\n	}\n\n';
    });
    ace.define("ace/snippets/actionscript", ["require", "exports", "module", "ace/snippets/actionscript.snippets"], function(require2, exports2, module2) {
      exports2.snippetText = require2("./actionscript.snippets");
      exports2.scope = "actionscript";
    });
    (function() {
      ace.require(["ace/snippets/actionscript"], function(m) {
        {
          module.exports = m;
        }
      });
    })();
  })(actionscript$2);
  return actionscript$2.exports;
}
var actionscriptExports = requireActionscript();
const actionscript = /* @__PURE__ */ getDefaultExportFromCjs(actionscriptExports);
const actionscript$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: actionscript
}, [actionscriptExports]);
export {
  actionscript$1 as a
};
