
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(Module) {
  Module = Module || {};


var d;
d || (d = typeof Module !== 'undefined' ? Module : {});
var aa, ba;
d.ready = new Promise(function(a, b) {
  aa = a;
  ba = b;
});
["_main", "_fflush", "onRuntimeInitialized"].forEach(a => {
  Object.getOwnPropertyDescriptor(d.ready, a) || Object.defineProperty(d.ready, a, {get:() => k("You are getting " + a + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"), set:() => k("You are setting " + a + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),});
});
d.noInitialRun = !0;
var ca = Object.assign({}, d), da = [], ea = "./this.program", fa = (a, b) => {
  throw b;
}, ha = "object" == typeof window, n = "function" == typeof importScripts, p = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, ia = !ha && !p && !n;
if (d.ENVIRONMENT) {
  throw Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
}
var u = "", ka, la, ma;
function na(a) {
  if (!(a instanceof oa)) {
    var b = a;
    a && "object" == typeof a && a.stack && (b = [a, a.stack]);
    v("exiting due to exception: " + b);
  }
}
if (p) {
  if ("undefined" == typeof process || !process.release || "node" !== process.release.name) {
    throw Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
  }
  var fs = require("fs"), pa = require("path");
  u = n ? pa.dirname(u) + "/" : __dirname + "/";
  ka = (a, b) => {
    a = qa(a) ? new URL(a) : pa.normalize(a);
    return fs.readFileSync(a, b ? void 0 : "utf8");
  };
  ma = a => {
    a = ka(a, !0);
    a.buffer || (a = new Uint8Array(a));
    assert(a.buffer);
    return a;
  };
  la = (a, b, c) => {
    a = qa(a) ? new URL(a) : pa.normalize(a);
    fs.readFile(a, function(e, f) {
      e ? c(e) : b(f.buffer);
    });
  };
  1 < process.argv.length && (ea = process.argv[1].replace(/\\/g, "/"));
  da = process.argv.slice(2);
  process.on("uncaughtException", function(a) {
    if (!(a instanceof oa)) {
      throw a;
    }
  });
  process.on("unhandledRejection", function(a) {
    throw a;
  });
  fa = (a, b) => {
    if (noExitRuntime) {
      throw process.exitCode = a, b;
    }
    na(b);
    process.exit(a);
  };
  d.inspect = function() {
    return "[Emscripten Module object]";
  };
} else if (ia) {
  if ("object" == typeof process && "function" === typeof require || "object" == typeof window || "function" == typeof importScripts) {
    throw Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
  }
  "undefined" != typeof read && (ka = function(a) {
    return read(a);
  });
  ma = function(a) {
    if ("function" == typeof readbuffer) {
      return new Uint8Array(readbuffer(a));
    }
    a = read(a, "binary");
    assert("object" == typeof a);
    return a;
  };
  la = function(a, b) {
    setTimeout(() => b(ma(a)), 0);
  };
  "undefined" != typeof scriptArgs ? da = scriptArgs : "undefined" != typeof arguments && (da = arguments);
  "function" == typeof quit && (fa = (a, b) => {
    na(b);
    quit(a);
  });
  "undefined" != typeof print && ("undefined" == typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" != typeof printErr ? printErr : print);
} else if (ha || n) {
  n ? u = self.location.href : "undefined" != typeof document && document.currentScript && (u = document.currentScript.src);
  _scriptDir && (u = _scriptDir);
  0 !== u.indexOf("blob:") ? u = u.substr(0, u.replace(/[?#].*/, "").lastIndexOf("/") + 1) : u = "";
  if ("object" != typeof window && "function" != typeof importScripts) {
    throw Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
  }
  ka = a => {
    var b = new XMLHttpRequest();
    b.open("GET", a, !1);
    b.send(null);
    return b.responseText;
  };
  n && (ma = a => {
    var b = new XMLHttpRequest();
    b.open("GET", a, !1);
    b.responseType = "arraybuffer";
    b.send(null);
    return new Uint8Array(b.response);
  });
  la = (a, b, c) => {
    var e = new XMLHttpRequest();
    e.open("GET", a, !0);
    e.responseType = "arraybuffer";
    e.onload = () => {
      200 == e.status || 0 == e.status && e.response ? b(e.response) : c();
    };
    e.onerror = c;
    e.send(null);
  };
} else {
  throw Error("environment detection error");
}
var w = console.log.bind(console), v = console.warn.bind(console);
Object.assign(d, ca);
ca = null;
z("ENVIRONMENT");
z("GL_MAX_TEXTURE_IMAGE_UNITS");
z("SDL_canPlayWithWebAudio");
z("SDL_numSimultaneouslyQueuedBuffers");
z("INITIAL_MEMORY");
z("wasmMemory");
z("arguments");
z("buffer");
z("canvas");
z("doNotCaptureKeyboard");
z("dynamicLibraries");
z("elementPointerLock");
z("extraStackTrace");
z("forcedAspectRatio");
z("keyboardListeningElement");
z("freePreloadedMediaOnUse");
z("loadSplitModule");
z("logReadFiles");
z("mainScriptUrlOrBlob");
z("mem");
z("monitorRunDependencies");
z("noExitRuntime");
z("onAbort");
z("onCustomMessage");
z("onExit");
z("onFree");
z("onFullScreen");
z("onMalloc");
z("onRealloc");
z("onRuntimeInitialized");
z("postMainLoop");
z("postRun");
z("preInit");
z("preMainLoop");
z("preinitializedWebGLContext");
z("memoryInitializerRequest");
z("preloadPlugins");
z("print");
z("printErr");
z("quit");
z("setStatus");
z("statusMessage");
z("stderr");
z("stdin");
z("stdout");
z("thisProgram");
z("wasm");
z("wasmBinary");
z("websocket");
z("fetchSettings");
B("arguments", "arguments_");
B("thisProgram", "thisProgram");
B("quit", "quit_");
assert("undefined" == typeof d.memoryInitializerPrefixURL, "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
assert("undefined" == typeof d.pthreadMainPrefixURL, "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
assert("undefined" == typeof d.cdInitializerPrefixURL, "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
assert("undefined" == typeof d.filePackagePrefixURL, "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
assert("undefined" == typeof d.read, "Module.read option was removed (modify read_ in JS)");
assert("undefined" == typeof d.readAsync, "Module.readAsync option was removed (modify readAsync in JS)");
assert("undefined" == typeof d.readBinary, "Module.readBinary option was removed (modify readBinary in JS)");
assert("undefined" == typeof d.setWindowTitle, "Module.setWindowTitle option was removed (modify setWindowTitle in JS)");
assert("undefined" == typeof d.TOTAL_MEMORY, "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
B("read", "read_");
B("readAsync", "readAsync");
B("readBinary", "readBinary");
B("setWindowTitle", "setWindowTitle");
assert(!ia, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");
function B(a, b) {
  Object.getOwnPropertyDescriptor(d, a) || Object.defineProperty(d, a, {configurable:!0, get:function() {
    k("Module." + a + " has been replaced with plain " + b + " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
  }});
}
function z(a) {
  Object.getOwnPropertyDescriptor(d, a) && k("`Module." + a + "` was supplied but `" + a + "` not included in INCOMING_MODULE_JS_API");
}
function ra(a) {
  return "FS_createPath" === a || "FS_createDataFile" === a || "FS_createPreloadedFile" === a || "FS_unlink" === a || "addRunDependency" === a || "FS_createLazyFile" === a || "FS_createDevice" === a || "removeRunDependency" === a;
}
B("wasmBinary", "wasmBinary");
var noExitRuntime = !0;
B("noExitRuntime", "noExitRuntime");
"object" != typeof WebAssembly && k("no native wasm support detected");
var sa, ta = !1, ua;
function assert(a, b) {
  a || k("Assertion failed" + (b ? ": " + b : ""));
}
var va = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
function wa(a, b) {
  for (var c = b + NaN, e = b; a[e] && !(e >= c);) {
    ++e;
  }
  if (16 < e - b && a.buffer && va) {
    return va.decode(a.subarray(b, e));
  }
  for (c = ""; b < e;) {
    var f = a[b++];
    if (f & 128) {
      var g = a[b++] & 63;
      if (192 == (f & 224)) {
        c += String.fromCharCode((f & 31) << 6 | g);
      } else {
        var h = a[b++] & 63;
        224 == (f & 240) ? f = (f & 15) << 12 | g << 6 | h : (240 != (f & 248) && xa("Invalid UTF-8 leading byte " + ya(f) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"), f = (f & 7) << 18 | g << 12 | h << 6 | a[b++] & 63);
        65536 > f ? c += String.fromCharCode(f) : (f -= 65536, c += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023));
      }
    } else {
      c += String.fromCharCode(f);
    }
  }
  return c;
}
function C(a) {
  return a ? wa(za, a) : "";
}
function Aa(a, b, c, e) {
  if (!(0 < e)) {
    return 0;
  }
  var f = c;
  e = c + e - 1;
  for (var g = 0; g < a.length; ++g) {
    var h = a.charCodeAt(g);
    if (55296 <= h && 57343 >= h) {
      var m = a.charCodeAt(++g);
      h = 65536 + ((h & 1023) << 10) | m & 1023;
    }
    if (127 >= h) {
      if (c >= e) {
        break;
      }
      b[c++] = h;
    } else {
      if (2047 >= h) {
        if (c + 1 >= e) {
          break;
        }
        b[c++] = 192 | h >> 6;
      } else {
        if (65535 >= h) {
          if (c + 2 >= e) {
            break;
          }
          b[c++] = 224 | h >> 12;
        } else {
          if (c + 3 >= e) {
            break;
          }
          1114111 < h && xa("Invalid Unicode code point " + ya(h) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
          b[c++] = 240 | h >> 18;
          b[c++] = 128 | h >> 12 & 63;
        }
        b[c++] = 128 | h >> 6 & 63;
      }
      b[c++] = 128 | h & 63;
    }
  }
  b[c] = 0;
  return c - f;
}
function Ba(a) {
  for (var b = 0, c = 0; c < a.length; ++c) {
    var e = a.charCodeAt(c);
    127 >= e ? b++ : 2047 >= e ? b += 2 : 55296 <= e && 57343 >= e ? (b += 4, ++c) : b += 3;
  }
  return b;
}
var Ca, D, za, Da, E, G;
function Ea() {
  var a = sa.buffer;
  Ca = a;
  d.HEAP8 = D = new Int8Array(a);
  d.HEAP16 = Da = new Int16Array(a);
  d.HEAP32 = E = new Int32Array(a);
  d.HEAPU8 = za = new Uint8Array(a);
  d.HEAPU16 = new Uint16Array(a);
  d.HEAPU32 = G = new Uint32Array(a);
  d.HEAPF32 = new Float32Array(a);
  d.HEAPF64 = new Float64Array(a);
  d.HEAP64 = new BigInt64Array(a);
  d.HEAPU64 = new BigUint64Array(a);
}
d.STACK_SIZE && assert(65536 === d.STACK_SIZE, "the stack size can no longer be determined at runtime");
B("INITIAL_MEMORY", "INITIAL_MEMORY");
assert(!0, "INITIAL_MEMORY should be larger than STACK_SIZE, was 18743296! (STACK_SIZE=65536)");
assert("undefined" != typeof Int32Array && "undefined" !== typeof Float64Array && void 0 != Int32Array.prototype.subarray && void 0 != Int32Array.prototype.set, "JS engine does not provide full typed array support");
assert(!d.wasmMemory, "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
assert(!0, "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
var Fa;
function Ga() {
  if (!ta) {
    var a = Ha();
    0 == a && (a += 4);
    var b = G[a >> 2], c = G[a + 4 >> 2];
    34821223 == b && 2310721022 == c || k("Stack overflow! Stack cookie has been overwritten at " + ya(a) + ", expected hex dwords 0x89BACDFE and 0x2135467, but received " + ya(c) + " " + ya(b));
    1668509029 !== G[0] && k("Runtime error: The application has corrupted its heap memory area (address zero)!");
  }
}
var Ia = new Int16Array(1), Ja = new Int8Array(Ia.buffer);
Ia[0] = 25459;
if (115 !== Ja[0] || 99 !== Ja[1]) {
  throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
}
var Ka = [], La = [], Ma = [], Na = [], Oa = !1;
assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
var Pa = 0, H = null, Qa = null, Ra = {};
function Sa(a) {
  for (var b = a;;) {
    if (!Ra[a]) {
      return a;
    }
    a = b + Math.random();
  }
}
function Ta(a) {
  Pa++;
  a ? (assert(!Ra[a]), Ra[a] = 1, null === H && "undefined" != typeof setInterval && (H = setInterval(function() {
    if (ta) {
      clearInterval(H), H = null;
    } else {
      var b = !1, c;
      for (c in Ra) {
        b || (b = !0, v("still waiting on run dependencies:")), v("dependency: " + c);
      }
      b && v("(end of list)");
    }
  }, 10000))) : v("warning: run dependency added without ID");
}
function Ua(a) {
  Pa--;
  a ? (assert(Ra[a]), delete Ra[a]) : v("warning: run dependency removed without ID");
  0 == Pa && (null !== H && (clearInterval(H), H = null), Qa && (a = Qa, Qa = null, a()));
}
function k(a) {
  a = "Aborted(" + a + ")";
  v(a);
  ta = !0;
  ua = 1;
  a = new WebAssembly.RuntimeError(a);
  ba(a);
  throw a;
}
function Va() {
  return I.startsWith("data:application/octet-stream;base64,");
}
function qa(a) {
  return a.startsWith("file://");
}
function J(a) {
  return function() {
    var b = d.asm;
    assert(Oa, "native function `" + a + "` called before runtime initialization");
    b[a] || assert(b[a], "exported native function `" + a + "` not found");
    return b[a].apply(null, arguments);
  };
}
var I;
I = "gs.wasm";
if (!Va()) {
  var Wa = I;
  I = d.locateFile ? d.locateFile(Wa, u) : u + Wa;
}
function Xa() {
  var a = I;
  try {
    if (ma) {
      return ma(a);
    }
    throw "both async and sync fetching of the wasm failed";
  } catch (b) {
    k(b);
  }
}
function Ya() {
  if (ha || n) {
    if ("function" == typeof fetch && !qa(I)) {
      return fetch(I, {credentials:"same-origin"}).then(function(a) {
        if (!a.ok) {
          throw "failed to load wasm binary file at '" + I + "'";
        }
        return a.arrayBuffer();
      }).catch(function() {
        return Xa();
      });
    }
    if (la) {
      return new Promise(function(a, b) {
        la(I, function(c) {
          a(new Uint8Array(c));
        }, b);
      });
    }
  }
  return Promise.resolve().then(function() {
    return Xa();
  });
}
var K, L;
function oa(a) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + a + ")";
  this.status = a;
}
function Za(a) {
  for (; 0 < a.length;) {
    a.shift()(d);
  }
}
function ya(a) {
  return "0x" + a.toString(16).padStart(8, "0");
}
function xa(a) {
  $a || ($a = {});
  $a[a] || ($a[a] = 1, p && (a = "warning: " + a), v(a));
}
var $a, ab = (a, b) => {
  for (var c = 0, e = a.length - 1; 0 <= e; e--) {
    var f = a[e];
    "." === f ? a.splice(e, 1) : ".." === f ? (a.splice(e, 1), c++) : c && (a.splice(e, 1), c--);
  }
  if (b) {
    for (; c; c--) {
      a.unshift("..");
    }
  }
  return a;
}, M = a => {
  var b = "/" === a.charAt(0), c = "/" === a.substr(-1);
  (a = ab(a.split("/").filter(e => !!e), !b).join("/")) || b || (a = ".");
  a && c && (a += "/");
  return (b ? "/" : "") + a;
}, bb = a => {
  var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
  a = b[0];
  b = b[1];
  if (!a && !b) {
    return ".";
  }
  b && (b = b.substr(0, b.length - 1));
  return a + b;
}, O = a => {
  if ("/" === a) {
    return "/";
  }
  a = M(a);
  a = a.replace(/\/$/, "");
  var b = a.lastIndexOf("/");
  return -1 === b ? a : a.substr(b + 1);
};
function cb() {
  var a = Array.prototype.slice.call(arguments);
  return M(a.join("/"));
}
var db = (a, b) => M(a + "/" + b);
function eb() {
  if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
    var a = new Uint8Array(1);
    return () => {
      crypto.getRandomValues(a);
      return a[0];
    };
  }
  if (p) {
    try {
      var b = require("crypto");
      return () => b.randomBytes(1)[0];
    } catch (c) {
    }
  }
  return () => k("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
}
function fb() {
  for (var a = "", b = !1, c = arguments.length - 1; -1 <= c && !b; c--) {
    b = 0 <= c ? arguments[c] : P.cwd();
    if ("string" != typeof b) {
      throw new TypeError("Arguments to path.resolve must be strings");
    }
    if (!b) {
      return "";
    }
    a = b + "/" + a;
    b = "/" === b.charAt(0);
  }
  a = ab(a.split("/").filter(e => !!e), !b).join("/");
  return (b ? "/" : "") + a || ".";
}
var gb = (a, b) => {
  function c(h) {
    for (var m = 0; m < h.length && "" === h[m]; m++) {
    }
    for (var q = h.length - 1; 0 <= q && "" === h[q]; q--) {
    }
    return m > q ? [] : h.slice(m, q - m + 1);
  }
  a = fb(a).substr(1);
  b = fb(b).substr(1);
  a = c(a.split("/"));
  b = c(b.split("/"));
  for (var e = Math.min(a.length, b.length), f = e, g = 0; g < e; g++) {
    if (a[g] !== b[g]) {
      f = g;
      break;
    }
  }
  e = [];
  for (g = f; g < a.length; g++) {
    e.push("..");
  }
  e = e.concat(b.slice(f));
  return e.join("/");
};
function hb(a, b) {
  var c = Array(Ba(a) + 1);
  a = Aa(a, c, 0, c.length);
  b && (c.length = a);
  return c;
}
var ib = [];
function jb(a, b) {
  ib[a] = {input:[], output:[], ia:b};
  P.Ba(a, kb);
}
var kb = {open:function(a) {
  var b = ib[a.node.rdev];
  if (!b) {
    throw new P.g(43);
  }
  a.tty = b;
  a.seekable = !1;
}, close:function(a) {
  a.tty.ia.fsync(a.tty);
}, fsync:function(a) {
  a.tty.ia.fsync(a.tty);
}, read:function(a, b, c, e) {
  if (!a.tty || !a.tty.ia.ib) {
    throw new P.g(60);
  }
  for (var f = 0, g = 0; g < e; g++) {
    try {
      var h = a.tty.ia.ib(a.tty);
    } catch (m) {
      throw new P.g(29);
    }
    if (void 0 === h && 0 === f) {
      throw new P.g(6);
    }
    if (null === h || void 0 === h) {
      break;
    }
    f++;
    b[c + g] = h;
  }
  f && (a.node.timestamp = Date.now());
  return f;
}, write:function(a, b, c, e) {
  if (!a.tty || !a.tty.ia.Pa) {
    throw new P.g(60);
  }
  try {
    for (var f = 0; f < e; f++) {
      a.tty.ia.Pa(a.tty, b[c + f]);
    }
  } catch (g) {
    throw new P.g(29);
  }
  e && (a.node.timestamp = Date.now());
  return f;
}}, lb = {ib:function(a) {
  if (!a.input.length) {
    var b = null;
    if (p) {
      var c = Buffer.alloc(256), e = 0;
      try {
        e = fs.readSync(process.stdin.fd, c, 0, 256, -1);
      } catch (f) {
        if (f.toString().includes("EOF")) {
          e = 0;
        } else {
          throw f;
        }
      }
      0 < e ? b = c.slice(0, e).toString("utf-8") : b = null;
    } else {
      "undefined" != typeof window && "function" == typeof window.prompt ? (b = window.prompt("Input: "), null !== b && (b += "\n")) : "function" == typeof readline && (b = readline(), null !== b && (b += "\n"));
    }
    if (!b) {
      return null;
    }
    a.input = hb(b, !0);
  }
  return a.input.shift();
}, Pa:function(a, b) {
  null === b || 10 === b ? (w(wa(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
}, fsync:function(a) {
  a.output && 0 < a.output.length && (w(wa(a.output, 0)), a.output = []);
}}, mb = {Pa:function(a, b) {
  null === b || 10 === b ? (v(wa(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
}, fsync:function(a) {
  a.output && 0 < a.output.length && (v(wa(a.output, 0)), a.output = []);
}};
function nb() {
  k("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
}
var R = {M:null, m:function() {
  return R.createNode(null, "/", 16895, 0);
}, createNode:function(a, b, c, e) {
  if (P.nb(c) || P.isFIFO(c)) {
    throw new P.g(63);
  }
  R.M || (R.M = {dir:{node:{D:R.h.D, A:R.h.A, lookup:R.h.lookup, I:R.h.I, rename:R.h.rename, unlink:R.h.unlink, rmdir:R.h.rmdir, readdir:R.h.readdir, symlink:R.h.symlink}, stream:{C:R.i.C}}, file:{node:{D:R.h.D, A:R.h.A}, stream:{C:R.i.C, read:R.i.read, write:R.i.write, ma:R.i.ma, Y:R.i.Y, ha:R.i.ha}}, link:{node:{D:R.h.D, A:R.h.A, readlink:R.h.readlink}, stream:{}}, $a:{node:{D:R.h.D, A:R.h.A}, stream:P.wb}});
  c = P.createNode(a, b, c, e);
  P.u(c.mode) ? (c.h = R.M.dir.node, c.i = R.M.dir.stream, c.j = {}) : P.isFile(c.mode) ? (c.h = R.M.file.node, c.i = R.M.file.stream, c.s = 0, c.j = null) : P.R(c.mode) ? (c.h = R.M.link.node, c.i = R.M.link.stream) : P.ga(c.mode) && (c.h = R.M.$a.node, c.i = R.M.$a.stream);
  c.timestamp = Date.now();
  a && (a.j[b] = c, a.timestamp = c.timestamp);
  return c;
}, mc:function(a) {
  return a.j ? a.j.subarray ? a.j.subarray(0, a.s) : new Uint8Array(a.j) : new Uint8Array(0);
}, fb:function(a, b) {
  var c = a.j ? a.j.length : 0;
  c >= b || (b = Math.max(b, c * (1048576 > c ? 2.0 : 1.125) >>> 0), 0 != c && (b = Math.max(b, 256)), c = a.j, a.j = new Uint8Array(b), 0 < a.s && a.j.set(c.subarray(0, a.s), 0));
}, Xb:function(a, b) {
  if (a.s != b) {
    if (0 == b) {
      a.j = null, a.s = 0;
    } else {
      var c = a.j;
      a.j = new Uint8Array(b);
      c && a.j.set(c.subarray(0, Math.min(b, a.s)));
      a.s = b;
    }
  }
}, h:{D:function(a) {
  var b = {};
  b.dev = P.ga(a.mode) ? a.id : 1;
  b.ino = a.id;
  b.mode = a.mode;
  b.nlink = 1;
  b.uid = 0;
  b.gid = 0;
  b.rdev = a.rdev;
  P.u(a.mode) ? b.size = 4096 : P.isFile(a.mode) ? b.size = a.s : P.R(a.mode) ? b.size = a.link.length : b.size = 0;
  b.atime = new Date(a.timestamp);
  b.mtime = new Date(a.timestamp);
  b.ctime = new Date(a.timestamp);
  b.S = 4096;
  b.blocks = Math.ceil(b.size / b.S);
  return b;
}, A:function(a, b) {
  void 0 !== b.mode && (a.mode = b.mode);
  void 0 !== b.timestamp && (a.timestamp = b.timestamp);
  void 0 !== b.size && R.Xb(a, b.size);
}, lookup:function() {
  throw P.Ja[44];
}, I:function(a, b, c, e) {
  return R.createNode(a, b, c, e);
}, rename:function(a, b, c) {
  if (P.u(a.mode)) {
    try {
      var e = P.K(b, c);
    } catch (g) {
    }
    if (e) {
      for (var f in e.j) {
        throw new P.g(55);
      }
    }
  }
  delete a.parent.j[a.name];
  a.parent.timestamp = Date.now();
  a.name = c;
  b.j[c] = a;
  b.timestamp = a.parent.timestamp;
  a.parent = b;
}, unlink:function(a, b) {
  delete a.j[b];
  a.timestamp = Date.now();
}, rmdir:function(a, b) {
  var c = P.K(a, b), e;
  for (e in c.j) {
    throw new P.g(55);
  }
  delete a.j[b];
  a.timestamp = Date.now();
}, readdir:function(a) {
  var b = [".", ".."], c;
  for (c in a.j) {
    a.j.hasOwnProperty(c) && b.push(c);
  }
  return b;
}, symlink:function(a, b, c) {
  a = R.createNode(a, b, 41471, 0);
  a.link = c;
  return a;
}, readlink:function(a) {
  if (!P.R(a.mode)) {
    throw new P.g(28);
  }
  return a.link;
}}, i:{read:function(a, b, c, e, f) {
  var g = a.node.j;
  if (f >= a.node.s) {
    return 0;
  }
  a = Math.min(a.node.s - f, e);
  assert(0 <= a);
  if (8 < a && g.subarray) {
    b.set(g.subarray(f, f + a), c);
  } else {
    for (e = 0; e < a; e++) {
      b[c + e] = g[f + e];
    }
  }
  return a;
}, write:function(a, b, c, e, f, g) {
  assert(!(b instanceof ArrayBuffer));
  b.buffer === D.buffer && (g = !1);
  if (!e) {
    return 0;
  }
  a = a.node;
  a.timestamp = Date.now();
  if (b.subarray && (!a.j || a.j.subarray)) {
    if (g) {
      return assert(0 === f, "canOwn must imply no weird position inside the file"), a.j = b.subarray(c, c + e), a.s = e;
    }
    if (0 === a.s && 0 === f) {
      return a.j = b.slice(c, c + e), a.s = e;
    }
    if (f + e <= a.s) {
      return a.j.set(b.subarray(c, c + e), f), e;
    }
  }
  R.fb(a, f + e);
  if (a.j.subarray && b.subarray) {
    a.j.set(b.subarray(c, c + e), f);
  } else {
    for (g = 0; g < e; g++) {
      a.j[f + g] = b[c + g];
    }
  }
  a.s = Math.max(a.s, f + e);
  return e;
}, C:function(a, b, c) {
  1 === c ? b += a.position : 2 === c && P.isFile(a.node.mode) && (b += a.node.s);
  if (0 > b) {
    throw new P.g(28);
  }
  return b;
}, ma:function(a, b, c) {
  R.fb(a.node, b + c);
  a.node.s = Math.max(a.node.s, b + c);
}, Y:function(a, b, c, e, f) {
  if (!P.isFile(a.node.mode)) {
    throw new P.g(43);
  }
  a = a.node.j;
  if (f & 2 || a.buffer !== Ca) {
    if (0 < c || c + b < a.length) {
      a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
    }
    c = !0;
    b = nb();
    if (!b) {
      throw new P.g(48);
    }
    D.set(a, b);
  } else {
    c = !1, b = a.byteOffset;
  }
  return {pb:b, Ya:c};
}, ha:function(a, b, c, e) {
  R.i.write(a, b, 0, e, c, !1);
  return 0;
}}};
function ob(a, b, c) {
  var e = Sa("al " + a);
  la(a, f => {
    assert(f, 'Loading data file "' + a + '" failed (no arrayBuffer).');
    b(new Uint8Array(f));
    e && Ua(e);
  }, () => {
    if (c) {
      c();
    } else {
      throw 'Loading data file "' + a + '" failed.';
    }
  });
  e && Ta(e);
}
var pb = {}, S = {za:!1, Ta:() => {
  S.za = !!process.platform.match(/^win/);
  var a = process.binding("constants");
  a.fs && (a = a.fs);
  S.Ga = {1024:a.O_APPEND, 64:a.O_CREAT, 128:a.O_EXCL, 256:a.O_NOCTTY, 0:a.O_RDONLY, 2:a.O_RDWR, 4096:a.O_SYNC, 512:a.O_TRUNC, 1:a.O_WRONLY, 131072:a.O_NOFOLLOW,};
  assert(0 === S.Ga["0"]);
}, B:a => {
  var b = a.code;
  assert(b in pb, "unexpected node error code: " + b + " (" + a + ")");
  return pb[b];
}, m:a => {
  assert(p);
  return S.createNode(null, "/", S.da(a.ja.root), 0);
}, createNode:(a, b, c) => {
  if (!P.u(c) && !P.isFile(c) && !P.R(c)) {
    throw new P.g(28);
  }
  a = P.createNode(a, b, c);
  a.h = S.h;
  a.i = S.i;
  return a;
}, da:a => {
  try {
    var b = fs.lstatSync(a);
    S.za && (b.mode = b.mode | (b.mode & 292) >> 2);
  } catch (c) {
    if (!c.code) {
      throw c;
    }
    throw new P.g(S.B(c));
  }
  return b.mode;
}, F:a => {
  for (var b = []; a.parent !== a;) {
    b.push(a.name), a = a.parent;
  }
  b.push(a.m.ja.root);
  b.reverse();
  return cb.apply(null, b);
}, Jb:a => {
  a &= -2721793;
  var b = 0, c;
  for (c in S.Ga) {
    a & c && (b |= S.Ga[c], a ^= c);
  }
  if (a) {
    throw new P.g(28);
  }
  return b;
}, h:{D:a => {
  a = S.F(a);
  try {
    var b = fs.lstatSync(a);
  } catch (c) {
    if (!c.code) {
      throw c;
    }
    throw new P.g(S.B(c));
  }
  S.za && !b.S && (b.S = 4096);
  S.za && !b.blocks && (b.blocks = (b.size + b.S - 1) / b.S | 0);
  return {dev:b.dev, ino:b.ino, mode:b.mode, nlink:b.nlink, uid:b.uid, gid:b.gid, rdev:b.rdev, size:b.size, atime:b.atime, mtime:b.mtime, ctime:b.ctime, S:b.S, blocks:b.blocks};
}, A:(a, b) => {
  var c = S.F(a);
  try {
    void 0 !== b.mode && (fs.chmodSync(c, b.mode), a.mode = b.mode), void 0 !== b.size && fs.truncateSync(c, b.size);
  } catch (e) {
    if (!e.code) {
      throw e;
    }
    throw new P.g(S.B(e));
  }
}, lookup:(a, b) => {
  var c = db(S.F(a), b);
  c = S.da(c);
  return S.createNode(a, b, c);
}, I:(a, b, c, e) => {
  a = S.createNode(a, b, c, e);
  b = S.F(a);
  try {
    P.u(a.mode) ? fs.mkdirSync(b, a.mode) : fs.writeFileSync(b, "", {mode:a.mode});
  } catch (f) {
    if (!f.code) {
      throw f;
    }
    throw new P.g(S.B(f));
  }
  return a;
}, rename:(a, b, c) => {
  var e = S.F(a);
  b = db(S.F(b), c);
  try {
    fs.renameSync(e, b);
  } catch (f) {
    if (!f.code) {
      throw f;
    }
    throw new P.g(S.B(f));
  }
  a.name = c;
}, unlink:(a, b) => {
  a = db(S.F(a), b);
  try {
    fs.unlinkSync(a);
  } catch (c) {
    if (!c.code) {
      throw c;
    }
    throw new P.g(S.B(c));
  }
}, rmdir:(a, b) => {
  a = db(S.F(a), b);
  try {
    fs.rmdirSync(a);
  } catch (c) {
    if (!c.code) {
      throw c;
    }
    throw new P.g(S.B(c));
  }
}, readdir:a => {
  a = S.F(a);
  try {
    return fs.readdirSync(a);
  } catch (b) {
    if (!b.code) {
      throw b;
    }
    throw new P.g(S.B(b));
  }
}, symlink:(a, b, c) => {
  a = db(S.F(a), b);
  try {
    fs.symlinkSync(c, a);
  } catch (e) {
    if (!e.code) {
      throw e;
    }
    throw new P.g(S.B(e));
  }
}, readlink:a => {
  var b = S.F(a);
  try {
    return b = fs.readlinkSync(b), b = pa.relative(pa.resolve(a.m.ja.root), b);
  } catch (c) {
    if (!c.code) {
      throw c;
    }
    if ("UNKNOWN" === c.code) {
      throw new P.g(28);
    }
    throw new P.g(S.B(c));
  }
}}, i:{open:a => {
  var b = S.F(a.node);
  try {
    P.isFile(a.node.mode) && (a.ta = fs.openSync(b, S.Jb(a.flags)));
  } catch (c) {
    if (!c.code) {
      throw c;
    }
    throw new P.g(S.B(c));
  }
}, close:a => {
  try {
    P.isFile(a.node.mode) && a.ta && fs.closeSync(a.ta);
  } catch (b) {
    if (!b.code) {
      throw b;
    }
    throw new P.g(S.B(b));
  }
}, read:(a, b, c, e, f) => {
  if (0 === e) {
    return 0;
  }
  try {
    return fs.readSync(a.ta, Buffer.from(b.buffer), c, e, f);
  } catch (g) {
    throw new P.g(S.B(g));
  }
}, write:(a, b, c, e, f) => {
  try {
    return fs.writeSync(a.ta, Buffer.from(b.buffer), c, e, f);
  } catch (g) {
    throw new P.g(S.B(g));
  }
}, C:(a, b, c) => {
  if (1 === c) {
    b += a.position;
  } else if (2 === c && P.isFile(a.node.mode)) {
    try {
      b += fs.fstatSync(a.ta).size;
    } catch (e) {
      throw new P.g(S.B(e));
    }
  }
  if (0 > b) {
    throw new P.g(28);
  }
  return b;
}, Y:(a, b, c) => {
  if (!P.isFile(a.node.mode)) {
    throw new P.g(43);
  }
  var e = nb();
  S.i.read(a, D, e, b, c);
  return {pb:e, Ya:!0};
}, ha:(a, b, c, e) => {
  S.i.write(a, b, 0, e, c, !1);
  return 0;
}}}, T = {Ea:16895, la:33279, Ra:null, m:function(a) {
  function b(g) {
    g = g.split("/");
    for (var h = e, m = 0; m < g.length - 1; m++) {
      var q = g.slice(0, m + 1).join("/");
      f[q] || (f[q] = T.createNode(h, g[m], T.Ea, 0));
      h = f[q];
    }
    return h;
  }
  function c(g) {
    g = g.split("/");
    return g[g.length - 1];
  }
  assert(n);
  T.Ra || (T.Ra = new FileReaderSync());
  var e = T.createNode(null, "/", T.Ea, 0), f = {};
  Array.prototype.forEach.call(a.ja.files || [], function(g) {
    T.createNode(b(g.name), c(g.name), T.la, 0, g, g.lastModifiedDate);
  });
  (a.ja.blobs || []).forEach(function(g) {
    T.createNode(b(g.name), c(g.name), T.la, 0, g.data);
  });
  (a.ja.packages || []).forEach(function(g) {
    g.metadata.files.forEach(function(h) {
      var m = h.filename.substr(1);
      T.createNode(b(m), c(m), T.la, 0, g.blob.slice(h.start, h.end));
    });
  });
  return e;
}, createNode:function(a, b, c, e, f, g) {
  e = P.createNode(a, b, c);
  e.mode = c;
  e.h = T.h;
  e.i = T.i;
  e.timestamp = (g || new Date()).getTime();
  assert(T.la !== T.Ea);
  c === T.la ? (e.size = f.size, e.j = f) : (e.size = 4096, e.j = {});
  a && (a.j[b] = e);
  return e;
}, h:{D:function(a) {
  return {dev:1, ino:a.id, mode:a.mode, nlink:1, uid:0, gid:0, rdev:void 0, size:a.size, atime:new Date(a.timestamp), mtime:new Date(a.timestamp), ctime:new Date(a.timestamp), S:4096, blocks:Math.ceil(a.size / 4096),};
}, A:function(a, b) {
  void 0 !== b.mode && (a.mode = b.mode);
  void 0 !== b.timestamp && (a.timestamp = b.timestamp);
}, lookup:function() {
  throw new P.g(44);
}, I:function() {
  throw new P.g(63);
}, rename:function() {
  throw new P.g(63);
}, unlink:function() {
  throw new P.g(63);
}, rmdir:function() {
  throw new P.g(63);
}, readdir:function(a) {
  var b = [".", ".."], c;
  for (c in a.j) {
    a.j.hasOwnProperty(c) && b.push(c);
  }
  return b;
}, symlink:function() {
  throw new P.g(63);
}, readlink:function() {
  throw new P.g(63);
}}, i:{read:function(a, b, c, e, f) {
  if (f >= a.node.size) {
    return 0;
  }
  a = a.node.j.slice(f, f + e);
  e = T.Ra.readAsArrayBuffer(a);
  b.set(new Uint8Array(e), c);
  return a.size;
}, write:function() {
  throw new P.g(29);
}, C:function(a, b, c) {
  1 === c ? b += a.position : 2 === c && P.isFile(a.node.mode) && (b += a.node.size);
  if (0 > b) {
    throw new P.g(28);
  }
  return b;
}}}, qb = {0:"Success", 1:"Arg list too long", 2:"Permission denied", 3:"Address already in use", 4:"Address not available", 5:"Address family not supported by protocol family", 6:"No more processes", 7:"Socket already connected", 8:"Bad file number", 9:"Trying to read unreadable message", 10:"Mount device busy", 11:"Operation canceled", 12:"No children", 13:"Connection aborted", 14:"Connection refused", 15:"Connection reset by peer", 16:"File locking deadlock error", 17:"Destination address required", 
18:"Math arg out of domain of func", 19:"Quota exceeded", 20:"File exists", 21:"Bad address", 22:"File too large", 23:"Host is unreachable", 24:"Identifier removed", 25:"Illegal byte sequence", 26:"Connection already in progress", 27:"Interrupted system call", 28:"Invalid argument", 29:"I/O error", 30:"Socket is already connected", 31:"Is a directory", 32:"Too many symbolic links", 33:"Too many open files", 34:"Too many links", 35:"Message too long", 36:"Multihop attempted", 37:"File or path name too long", 
38:"Network interface is not configured", 39:"Connection reset by network", 40:"Network is unreachable", 41:"Too many open files in system", 42:"No buffer space available", 43:"No such device", 44:"No such file or directory", 45:"Exec format error", 46:"No record locks available", 47:"The link has been severed", 48:"Not enough core", 49:"No message of desired type", 50:"Protocol not available", 51:"No space left on device", 52:"Function not implemented", 53:"Socket is not connected", 54:"Not a directory", 
55:"Directory not empty", 56:"State not recoverable", 57:"Socket operation on non-socket", 59:"Not a typewriter", 60:"No such device or address", 61:"Value too large for defined data type", 62:"Previous owner died", 63:"Not super-user", 64:"Broken pipe", 65:"Protocol error", 66:"Unknown protocol", 67:"Protocol wrong type for socket", 68:"Math result not representable", 69:"Read only file system", 70:"Illegal seek", 71:"No such process", 72:"Stale file handle", 73:"Connection timed out", 74:"Text file busy", 
75:"Cross-device link", 100:"Device not a stream", 101:"Bad font file fmt", 102:"Invalid slot", 103:"Invalid request code", 104:"No anode", 105:"Block device required", 106:"Channel number out of range", 107:"Level 3 halted", 108:"Level 3 reset", 109:"Link number out of range", 110:"Protocol driver not attached", 111:"No CSI structure available", 112:"Level 2 halted", 113:"Invalid exchange", 114:"Invalid request descriptor", 115:"Exchange full", 116:"No data (for no delay io)", 117:"Timer expired", 
118:"Out of streams resources", 119:"Machine is not on the network", 120:"Package not installed", 121:"The object is remote", 122:"Advertise error", 123:"Srmount error", 124:"Communication error on send", 125:"Cross mount point (not really error)", 126:"Given log. name not unique", 127:"f.d. invalid for this operation", 128:"Remote address changed", 129:"Can   access a needed shared lib", 130:"Accessing a corrupted shared lib", 131:".lib section in a.out corrupted", 132:"Attempting to link in too many libs", 
133:"Attempting to exec a shared library", 135:"Streams pipe error", 136:"Too many users", 137:"Socket type not supported", 138:"Not supported", 139:"Protocol family not supported", 140:"Can't send after socket shutdown", 141:"Too many references", 142:"Host is down", 148:"No medium (in tape drive)", 156:"Level 2 not synchronized"};
function rb(a) {
  return a.replace(/\b_Z[\w\d_]+/g, function(b) {
    xa("warning: build with -sDEMANGLE_SUPPORT to link in libcxxabi demangling");
    return b === b ? b : b + " [" + b + "]";
  });
}
var P = {root:null, ra:[], cb:{}, streams:[], Rb:1, L:null, bb:"/", wa:!1, mb:!0, g:null, Ja:{}, Hb:null, ua:0, o:(a, b = {}) => {
  a = fb(a);
  if (!a) {
    return {path:"", node:null};
  }
  b = Object.assign({Ha:!0, Sa:0}, b);
  if (8 < b.Sa) {
    throw new P.g(32);
  }
  a = a.split("/").filter(h => !!h);
  for (var c = P.root, e = "/", f = 0; f < a.length; f++) {
    var g = f === a.length - 1;
    if (g && b.parent) {
      break;
    }
    c = P.K(c, a[f]);
    e = M(e + "/" + a[f]);
    P.X(c) && (!g || g && b.Ha) && (c = c.qa.root);
    if (!g || b.H) {
      for (g = 0; P.R(c.mode);) {
        if (c = P.readlink(e), e = fb(bb(e), c), c = P.o(e, {Sa:b.Sa + 1}).node, 40 < g++) {
          throw new P.g(32);
        }
      }
    }
  }
  return {path:e, node:c};
}, P:a => {
  for (var b;;) {
    if (P.ya(a)) {
      return a = a.m.ob, b ? "/" !== a[a.length - 1] ? a + "/" + b : a + b : a;
    }
    b = b ? a.name + "/" + b : a.name;
    a = a.parent;
  }
}, Ka:(a, b) => {
  for (var c = 0, e = 0; e < b.length; e++) {
    c = (c << 5) - c + b.charCodeAt(e) | 0;
  }
  return (a + c >>> 0) % P.L.length;
}, kb:a => {
  var b = P.Ka(a.parent.id, a.name);
  a.Z = P.L[b];
  P.L[b] = a;
}, lb:a => {
  var b = P.Ka(a.parent.id, a.name);
  if (P.L[b] === a) {
    P.L[b] = a.Z;
  } else {
    for (b = P.L[b]; b;) {
      if (b.Z === a) {
        b.Z = a.Z;
        break;
      }
      b = b.Z;
    }
  }
}, K:(a, b) => {
  var c = P.Ob(a);
  if (c) {
    throw new P.g(c, a);
  }
  for (c = P.L[P.Ka(a.id, b)]; c; c = c.Z) {
    var e = c.name;
    if (c.parent.id === a.id && e === b) {
      return c;
    }
  }
  return P.lookup(a, b);
}, createNode:(a, b, c, e) => {
  assert("object" == typeof a);
  a = new P.rb(a, b, c, e);
  P.kb(a);
  return a;
}, Fa:a => {
  P.lb(a);
}, ya:a => a === a.parent, X:a => !!a.qa, isFile:a => 32768 === (a & 61440), u:a => 16384 === (a & 61440), R:a => 40960 === (a & 61440), ga:a => 8192 === (a & 61440), nb:a => 24576 === (a & 61440), isFIFO:a => 4096 === (a & 61440), isSocket:a => 49152 === (a & 49152), Ib:{r:0, "r+":2, w:577, "w+":578, a:1089, "a+":1090}, Qb:a => {
  var b = P.Ib[a];
  if ("undefined" == typeof b) {
    throw Error("Unknown file open mode: " + a);
  }
  return b;
}, gb:a => {
  var b = ["r", "w", "rw"][a & 3];
  a & 512 && (b += "w");
  return b;
}, V:(a, b) => {
  if (P.mb) {
    return 0;
  }
  if (!b.includes("r") || a.mode & 292) {
    if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) {
      return 2;
    }
  } else {
    return 2;
  }
  return 0;
}, Ob:a => {
  var b = P.V(a, "x");
  return b ? b : a.h.lookup ? 0 : 2;
}, Oa:(a, b) => {
  try {
    return P.K(a, b), 20;
  } catch (c) {
  }
  return P.V(a, "wx");
}, Aa:(a, b, c) => {
  try {
    var e = P.K(a, b);
  } catch (f) {
    return f.l;
  }
  if (a = P.V(a, "wx")) {
    return a;
  }
  if (c) {
    if (!P.u(e.mode)) {
      return 54;
    }
    if (P.ya(e) || P.P(e) === P.cwd()) {
      return 10;
    }
  } else {
    if (P.u(e.mode)) {
      return 31;
    }
  }
  return 0;
}, Pb:(a, b) => a ? P.R(a.mode) ? 32 : P.u(a.mode) && ("r" !== P.gb(b) || b & 512) ? 31 : P.V(a, P.gb(b)) : 44, sb:4096, Sb:(a = 0, b = P.sb) => {
  for (; a <= b; a++) {
    if (!P.streams[a]) {
      return a;
    }
  }
  throw new P.g(33);
}, ea:a => P.streams[a], ba:(a, b, c) => {
  P.va || (P.va = function() {
    this.O = {};
  }, P.va.prototype = {}, Object.defineProperties(P.va.prototype, {object:{get:function() {
    return this.node;
  }, set:function(e) {
    this.node = e;
  }}, flags:{get:function() {
    return this.O.flags;
  }, set:function(e) {
    this.O.flags = e;
  },}, position:{get:function() {
    return this.O.position;
  }, set:function(e) {
    this.O.position = e;
  },},}));
  a = Object.assign(new P.va(), a);
  b = P.Sb(b, c);
  a.fd = b;
  return P.streams[b] = a;
}, xb:a => {
  P.streams[a] = null;
}, wb:{open:a => {
  a.i = P.Lb(a.node.rdev).i;
  a.i.open && a.i.open(a);
}, C:() => {
  throw new P.g(70);
}}, Na:a => a >> 8, qc:a => a & 255, U:(a, b) => a << 8 | b, Ba:(a, b) => {
  P.cb[a] = {i:b};
}, Lb:a => P.cb[a], hb:a => {
  var b = [];
  for (a = [a]; a.length;) {
    var c = a.pop();
    b.push(c);
    a.push.apply(a, c.ra);
  }
  return b;
}, Ua:(a, b) => {
  function c(h) {
    assert(0 < P.ua);
    P.ua--;
    return b(h);
  }
  function e(h) {
    if (h) {
      if (!e.Gb) {
        return e.Gb = !0, c(h);
      }
    } else {
      ++g >= f.length && c(null);
    }
  }
  "function" == typeof a && (b = a, a = !1);
  P.ua++;
  1 < P.ua && v("warning: " + P.ua + " FS.syncfs operations in flight at once, probably just doing extra work");
  var f = P.hb(P.root.m), g = 0;
  f.forEach(h => {
    if (!h.type.Ua) {
      return e(null);
    }
    h.type.Ua(h, a, e);
  });
}, m:(a, b, c) => {
  if ("string" == typeof a) {
    throw a;
  }
  var e = "/" === c, f = !c;
  if (e && P.root) {
    throw new P.g(10);
  }
  if (!e && !f) {
    var g = P.o(c, {Ha:!1});
    c = g.path;
    g = g.node;
    if (P.X(g)) {
      throw new P.g(10);
    }
    if (!P.u(g.mode)) {
      throw new P.g(54);
    }
  }
  b = {type:a, ja:b, ob:c, ra:[]};
  a = a.m(b);
  a.m = b;
  b.root = a;
  e ? P.root = a : g && (g.qa = b, g.m && g.m.ra.push(b));
  return a;
}, dc:a => {
  a = P.o(a, {Ha:!1});
  if (!P.X(a.node)) {
    throw new P.g(28);
  }
  a = a.node;
  var b = a.qa, c = P.hb(b);
  Object.keys(P.L).forEach(e => {
    for (e = P.L[e]; e;) {
      var f = e.Z;
      c.includes(e.m) && P.Fa(e);
      e = f;
    }
  });
  a.qa = null;
  b = a.m.ra.indexOf(b);
  assert(-1 !== b);
  a.m.ra.splice(b, 1);
}, lookup:(a, b) => a.h.lookup(a, b), I:(a, b, c) => {
  var e = P.o(a, {parent:!0}).node;
  a = O(a);
  if (!a || "." === a || ".." === a) {
    throw new P.g(28);
  }
  var f = P.Oa(e, a);
  if (f) {
    throw new P.g(f);
  }
  if (!e.h.I) {
    throw new P.g(63);
  }
  return e.h.I(e, a, b, c);
}, create:(a, b) => P.I(a, (void 0 !== b ? b : 438) & 4095 | 32768, 0), mkdir:(a, b) => P.I(a, (void 0 !== b ? b : 511) & 1023 | 16384, 0), rc:(a, b) => {
  a = a.split("/");
  for (var c = "", e = 0; e < a.length; ++e) {
    if (a[e]) {
      c += "/" + a[e];
      try {
        P.mkdir(c, b);
      } catch (f) {
        if (20 != f.l) {
          throw f;
        }
      }
    }
  }
}, pa:(a, b, c) => {
  "undefined" == typeof c && (c = b, b = 438);
  return P.I(a, b | 8192, c);
}, symlink:(a, b) => {
  if (!fb(a)) {
    throw new P.g(44);
  }
  var c = P.o(b, {parent:!0}).node;
  if (!c) {
    throw new P.g(44);
  }
  b = O(b);
  var e = P.Oa(c, b);
  if (e) {
    throw new P.g(e);
  }
  if (!c.h.symlink) {
    throw new P.g(63);
  }
  return c.h.symlink(c, b, a);
}, rename:(a, b) => {
  var c = bb(a), e = bb(b), f = O(a), g = O(b);
  var h = P.o(a, {parent:!0});
  var m = h.node;
  h = P.o(b, {parent:!0});
  h = h.node;
  if (!m || !h) {
    throw new P.g(44);
  }
  if (m.m !== h.m) {
    throw new P.g(75);
  }
  var q = P.K(m, f);
  a = gb(a, e);
  if ("." !== a.charAt(0)) {
    throw new P.g(28);
  }
  a = gb(b, c);
  if ("." !== a.charAt(0)) {
    throw new P.g(55);
  }
  try {
    var t = P.K(h, g);
  } catch (r) {
  }
  if (q !== t) {
    b = P.u(q.mode);
    if (f = P.Aa(m, f, b)) {
      throw new P.g(f);
    }
    if (f = t ? P.Aa(h, g, b) : P.Oa(h, g)) {
      throw new P.g(f);
    }
    if (!m.h.rename) {
      throw new P.g(63);
    }
    if (P.X(q) || t && P.X(t)) {
      throw new P.g(10);
    }
    if (h !== m && (f = P.V(m, "w"))) {
      throw new P.g(f);
    }
    P.lb(q);
    try {
      m.h.rename(q, h, g);
    } catch (r) {
      throw r;
    } finally {
      P.kb(q);
    }
  }
}, rmdir:a => {
  var b = P.o(a, {parent:!0}).node;
  a = O(a);
  var c = P.K(b, a), e = P.Aa(b, a, !0);
  if (e) {
    throw new P.g(e);
  }
  if (!b.h.rmdir) {
    throw new P.g(63);
  }
  if (P.X(c)) {
    throw new P.g(10);
  }
  b.h.rmdir(b, a);
  P.Fa(c);
}, readdir:a => {
  a = P.o(a, {H:!0}).node;
  if (!a.h.readdir) {
    throw new P.g(54);
  }
  return a.h.readdir(a);
}, unlink:a => {
  var b = P.o(a, {parent:!0}).node;
  if (!b) {
    throw new P.g(44);
  }
  a = O(a);
  var c = P.K(b, a), e = P.Aa(b, a, !1);
  if (e) {
    throw new P.g(e);
  }
  if (!b.h.unlink) {
    throw new P.g(63);
  }
  if (P.X(c)) {
    throw new P.g(10);
  }
  b.h.unlink(b, a);
  P.Fa(c);
}, readlink:a => {
  a = P.o(a).node;
  if (!a) {
    throw new P.g(44);
  }
  if (!a.h.readlink) {
    throw new P.g(28);
  }
  return fb(P.P(a.parent), a.h.readlink(a));
}, stat:(a, b) => {
  a = P.o(a, {H:!b}).node;
  if (!a) {
    throw new P.g(44);
  }
  if (!a.h.D) {
    throw new P.g(63);
  }
  return a.h.D(a);
}, lstat:a => P.stat(a, !0), chmod:(a, b, c) => {
  a = "string" == typeof a ? P.o(a, {H:!c}).node : a;
  if (!a.h.A) {
    throw new P.g(63);
  }
  a.h.A(a, {mode:b & 4095 | a.mode & -4096, timestamp:Date.now()});
}, lchmod:(a, b) => {
  P.chmod(a, b, !0);
}, fchmod:(a, b) => {
  a = P.ea(a);
  if (!a) {
    throw new P.g(8);
  }
  P.chmod(a.node, b);
}, chown:(a, b, c, e) => {
  a = "string" == typeof a ? P.o(a, {H:!e}).node : a;
  if (!a.h.A) {
    throw new P.g(63);
  }
  a.h.A(a, {timestamp:Date.now()});
}, lchown:(a, b, c) => {
  P.chown(a, b, c, !0);
}, fchown:(a, b, c) => {
  a = P.ea(a);
  if (!a) {
    throw new P.g(8);
  }
  P.chown(a.node, b, c);
}, truncate:(a, b) => {
  if (0 > b) {
    throw new P.g(28);
  }
  a = "string" == typeof a ? P.o(a, {H:!0}).node : a;
  if (!a.h.A) {
    throw new P.g(63);
  }
  if (P.u(a.mode)) {
    throw new P.g(31);
  }
  if (!P.isFile(a.mode)) {
    throw new P.g(28);
  }
  var c = P.V(a, "w");
  if (c) {
    throw new P.g(c);
  }
  a.h.A(a, {size:b, timestamp:Date.now()});
}, Kb:(a, b) => {
  a = P.ea(a);
  if (!a) {
    throw new P.g(8);
  }
  if (0 === (a.flags & 2097155)) {
    throw new P.g(28);
  }
  P.truncate(a.node, b);
}, ec:(a, b, c) => {
  a = P.o(a, {H:!0}).node;
  a.h.A(a, {timestamp:Math.max(b, c)});
}, open:(a, b, c) => {
  if ("" === a) {
    throw new P.g(44);
  }
  b = "string" == typeof b ? P.Qb(b) : b;
  c = b & 64 ? ("undefined" == typeof c ? 438 : c) & 4095 | 32768 : 0;
  if ("object" == typeof a) {
    var e = a;
  } else {
    a = M(a);
    try {
      e = P.o(a, {H:!(b & 131072)}).node;
    } catch (g) {
    }
  }
  var f = !1;
  if (b & 64) {
    if (e) {
      if (b & 128) {
        throw new P.g(20);
      }
    } else {
      e = P.I(a, c, 0), f = !0;
    }
  }
  if (!e) {
    throw new P.g(44);
  }
  P.ga(e.mode) && (b &= -513);
  if (b & 65536 && !P.u(e.mode)) {
    throw new P.g(54);
  }
  if (!f && (c = P.Pb(e, b))) {
    throw new P.g(c);
  }
  b & 512 && !f && P.truncate(e, 0);
  b &= -131713;
  e = P.ba({node:e, path:P.P(e), flags:b, seekable:!0, position:0, i:e.i, cc:[], error:!1});
  e.i.open && e.i.open(e);
  !d.logReadFiles || b & 1 || (P.Qa || (P.Qa = {}), a in P.Qa || (P.Qa[a] = 1));
  return e;
}, close:a => {
  if (P.oa(a)) {
    throw new P.g(8);
  }
  a.W && (a.W = null);
  try {
    a.i.close && a.i.close(a);
  } catch (b) {
    throw b;
  } finally {
    P.xb(a.fd);
  }
  a.fd = null;
}, oa:a => null === a.fd, C:(a, b, c) => {
  if (P.oa(a)) {
    throw new P.g(8);
  }
  if (!a.seekable || !a.i.C) {
    throw new P.g(70);
  }
  if (0 != c && 1 != c && 2 != c) {
    throw new P.g(28);
  }
  a.position = a.i.C(a, b, c);
  a.cc = [];
  return a.position;
}, read:(a, b, c, e, f) => {
  if (0 > e || 0 > f) {
    throw new P.g(28);
  }
  if (P.oa(a)) {
    throw new P.g(8);
  }
  if (1 === (a.flags & 2097155)) {
    throw new P.g(8);
  }
  if (P.u(a.node.mode)) {
    throw new P.g(31);
  }
  if (!a.i.read) {
    throw new P.g(28);
  }
  var g = "undefined" != typeof f;
  if (!g) {
    f = a.position;
  } else if (!a.seekable) {
    throw new P.g(70);
  }
  b = a.i.read(a, b, c, e, f);
  g || (a.position += b);
  return b;
}, write:(a, b, c, e, f, g) => {
  if (0 > e || 0 > f) {
    throw new P.g(28);
  }
  if (P.oa(a)) {
    throw new P.g(8);
  }
  if (0 === (a.flags & 2097155)) {
    throw new P.g(8);
  }
  if (P.u(a.node.mode)) {
    throw new P.g(31);
  }
  if (!a.i.write) {
    throw new P.g(28);
  }
  a.seekable && a.flags & 1024 && P.C(a, 0, 2);
  var h = "undefined" != typeof f;
  if (!h) {
    f = a.position;
  } else if (!a.seekable) {
    throw new P.g(70);
  }
  b = a.i.write(a, b, c, e, f, g);
  h || (a.position += b);
  return b;
}, ma:(a, b, c) => {
  if (P.oa(a)) {
    throw new P.g(8);
  }
  if (0 > b || 0 >= c) {
    throw new P.g(28);
  }
  if (0 === (a.flags & 2097155)) {
    throw new P.g(8);
  }
  if (!P.isFile(a.node.mode) && !P.u(a.node.mode)) {
    throw new P.g(43);
  }
  if (!a.i.ma) {
    throw new P.g(138);
  }
  a.i.ma(a, b, c);
}, Y:(a, b, c, e, f) => {
  if (0 !== (e & 2) && 0 === (f & 2) && 2 !== (a.flags & 2097155)) {
    throw new P.g(2);
  }
  if (1 === (a.flags & 2097155)) {
    throw new P.g(2);
  }
  if (!a.i.Y) {
    throw new P.g(43);
  }
  return a.i.Y(a, b, c, e, f);
}, ha:(a, b, c, e, f) => a.i.ha ? a.i.ha(a, b, c, e, f) : 0, tc:() => 0, xa:(a, b, c) => {
  if (!a.i.xa) {
    throw new P.g(59);
  }
  return a.i.xa(a, b, c);
}, readFile:(a, b = {}) => {
  b.flags = b.flags || 0;
  b.encoding = b.encoding || "binary";
  if ("utf8" !== b.encoding && "binary" !== b.encoding) {
    throw Error('Invalid encoding type "' + b.encoding + '"');
  }
  var c, e = P.open(a, b.flags);
  a = P.stat(a).size;
  var f = new Uint8Array(a);
  P.read(e, f, 0, a, 0);
  "utf8" === b.encoding ? c = wa(f, 0) : "binary" === b.encoding && (c = f);
  P.close(e);
  return c;
}, writeFile:(a, b, c = {}) => {
  c.flags = c.flags || 577;
  a = P.open(a, c.flags, c.mode);
  if ("string" == typeof b) {
    var e = new Uint8Array(Ba(b) + 1);
    b = Aa(b, e, 0, e.length);
    P.write(a, e, 0, b, void 0, c.vb);
  } else if (ArrayBuffer.isView(b)) {
    P.write(a, b, 0, b.byteLength, void 0, c.vb);
  } else {
    throw Error("Unsupported data type");
  }
  P.close(a);
}, cwd:() => P.bb, chdir:a => {
  a = P.o(a, {H:!0});
  if (null === a.node) {
    throw new P.g(44);
  }
  if (!P.u(a.node.mode)) {
    throw new P.g(54);
  }
  var b = P.V(a.node, "x");
  if (b) {
    throw new P.g(b);
  }
  P.bb = a.path;
}, zb:() => {
  P.mkdir("/tmp");
  P.mkdir("/home");
  P.mkdir("/home/web_user");
}, yb:() => {
  P.mkdir("/dev");
  P.Ba(P.U(1, 3), {read:() => 0, write:(b, c, e, f) => f,});
  P.pa("/dev/null", P.U(1, 3));
  jb(P.U(5, 0), lb);
  jb(P.U(6, 0), mb);
  P.pa("/dev/tty", P.U(5, 0));
  P.pa("/dev/tty1", P.U(6, 0));
  var a = eb();
  P.T("/dev", "random", a);
  P.T("/dev", "urandom", a);
  P.mkdir("/dev/shm");
  P.mkdir("/dev/shm/tmp");
}, Eb:() => {
  P.mkdir("/proc");
  var a = P.mkdir("/proc/self");
  P.mkdir("/proc/self/fd");
  P.m({m:() => {
    var b = P.createNode(a, "fd", 16895, 73);
    b.h = {lookup:(c, e) => {
      var f = P.ea(+e);
      if (!f) {
        throw new P.g(8);
      }
      c = {parent:null, m:{ob:"fake"}, h:{readlink:() => f.path},};
      return c.parent = c;
    }};
    return b;
  }}, {}, "/proc/self/fd");
}, Fb:() => {
  d.stdin ? P.T("/dev", "stdin", d.stdin) : P.symlink("/dev/tty", "/dev/stdin");
  d.stdout ? P.T("/dev", "stdout", null, d.stdout) : P.symlink("/dev/tty", "/dev/stdout");
  d.stderr ? P.T("/dev", "stderr", null, d.stderr) : P.symlink("/dev/tty1", "/dev/stderr");
  var a = P.open("/dev/stdin", 0), b = P.open("/dev/stdout", 1), c = P.open("/dev/stderr", 1);
  assert(0 === a.fd, "invalid handle for stdin (" + a.fd + ")");
  assert(1 === b.fd, "invalid handle for stdout (" + b.fd + ")");
  assert(2 === c.fd, "invalid handle for stderr (" + c.fd + ")");
}, eb:() => {
  P.g || (P.g = function(a, b) {
    this.node = b;
    this.Yb = function(c) {
      this.l = c;
      for (var e in pb) {
        if (pb[e] === c) {
          this.code = e;
          break;
        }
      }
    };
    this.Yb(a);
    this.message = qb[a];
    this.stack && (Object.defineProperty(this, "stack", {value:Error().stack, writable:!0}), this.stack = rb(this.stack));
  }, P.g.prototype = Error(), P.g.prototype.constructor = P.g, [44].forEach(a => {
    P.Ja[a] = new P.g(a);
    P.Ja[a].stack = "<generic error, no stack>";
  }));
}, Ta:() => {
  P.eb();
  P.L = Array(4096);
  P.m(R, {}, "/");
  P.zb();
  P.yb();
  P.Eb();
  P.Hb = {MEMFS:R, NODEFS:S, WORKERFS:T,};
}, fa:(a, b, c) => {
  assert(!P.fa.wa, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
  P.fa.wa = !0;
  P.eb();
  d.stdin = a || d.stdin;
  d.stdout = b || d.stdout;
  d.stderr = c || d.stderr;
  P.Fb();
}, vc:() => {
  P.fa.wa = !1;
  sb(0);
  for (var a = 0; a < P.streams.length; a++) {
    var b = P.streams[a];
    b && P.close(b);
  }
}, da:(a, b) => {
  var c = 0;
  a && (c |= 365);
  b && (c |= 146);
  return c;
}, lc:(a, b) => {
  a = P.na(a, b);
  return a.exists ? a.object : null;
}, na:(a, b) => {
  try {
    var c = P.o(a, {H:!b});
    a = c.path;
  } catch (f) {
  }
  var e = {ya:!1, exists:!1, error:0, name:null, path:null, object:null, Tb:!1, Vb:null, Ub:null};
  try {
    c = P.o(a, {parent:!0}), e.Tb = !0, e.Vb = c.path, e.Ub = c.node, e.name = O(a), c = P.o(a, {H:!b}), e.exists = !0, e.path = c.path, e.object = c.node, e.name = c.node.name, e.ya = "/" === c.path;
  } catch (f) {
    e.error = f.l;
  }
  return e;
}, kc:(a, b) => {
  a = "string" == typeof a ? a : P.P(a);
  for (b = b.split("/").reverse(); b.length;) {
    var c = b.pop();
    if (c) {
      var e = M(a + "/" + c);
      try {
        P.mkdir(e);
      } catch (f) {
      }
      a = e;
    }
  }
  return e;
}, Ab:(a, b, c, e, f) => {
  a = db("string" == typeof a ? a : P.P(a), b);
  e = P.da(e, f);
  return P.create(a, e);
}, ab:(a, b, c, e, f, g) => {
  var h = b;
  a && (a = "string" == typeof a ? a : P.P(a), h = b ? M(a + "/" + b) : a);
  a = P.da(e, f);
  h = P.create(h, a);
  if (c) {
    if ("string" == typeof c) {
      b = Array(c.length);
      e = 0;
      for (f = c.length; e < f; ++e) {
        b[e] = c.charCodeAt(e);
      }
      c = b;
    }
    P.chmod(h, a | 146);
    b = P.open(h, 577);
    P.write(b, c, 0, c.length, 0, g);
    P.close(b);
    P.chmod(h, a);
  }
  return h;
}, T:(a, b, c, e) => {
  a = db("string" == typeof a ? a : P.P(a), b);
  b = P.da(!!c, !!e);
  P.T.Na || (P.T.Na = 64);
  var f = P.U(P.T.Na++, 0);
  P.Ba(f, {open:g => {
    g.seekable = !1;
  }, close:() => {
    e && e.buffer && e.buffer.length && e(10);
  }, read:(g, h, m, q) => {
    for (var t = 0, r = 0; r < q; r++) {
      try {
        var x = c();
      } catch (F) {
        throw new P.g(29);
      }
      if (void 0 === x && 0 === t) {
        throw new P.g(6);
      }
      if (null === x || void 0 === x) {
        break;
      }
      t++;
      h[m + r] = x;
    }
    t && (g.node.timestamp = Date.now());
    return t;
  }, write:(g, h, m, q) => {
    for (var t = 0; t < q; t++) {
      try {
        e(h[m + t]);
      } catch (r) {
        throw new P.g(29);
      }
    }
    q && (g.node.timestamp = Date.now());
    return t;
  }});
  return P.pa(a, b, f);
}, Ia:a => {
  if (a.La || a.Nb || a.link || a.j) {
    return !0;
  }
  if ("undefined" != typeof XMLHttpRequest) {
    throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
  }
  if (ka) {
    try {
      a.j = hb(ka(a.url), !0), a.s = a.j.length;
    } catch (b) {
      throw new P.g(29);
    }
  } else {
    throw Error("Cannot load without read() or XMLHttpRequest.");
  }
}, Bb:(a, b, c, e, f) => {
  function g() {
    this.Ma = !1;
    this.O = [];
  }
  function h(r, x, F, l, y) {
    r = r.node.j;
    if (y >= r.length) {
      return 0;
    }
    l = Math.min(r.length - y, l);
    assert(0 <= l);
    if (r.slice) {
      for (var A = 0; A < l; A++) {
        x[F + A] = r[y + A];
      }
    } else {
      for (A = 0; A < l; A++) {
        x[F + A] = r.get(y + A);
      }
    }
    return l;
  }
  g.prototype.get = function(r) {
    if (!(r > this.length - 1 || 0 > r)) {
      var x = r % this.chunkSize;
      return this.jb(r / this.chunkSize | 0)[x];
    }
  };
  g.prototype.Mb = function(r) {
    this.jb = r;
  };
  g.prototype.Za = function() {
    var r = new XMLHttpRequest();
    r.open("HEAD", c, !1);
    r.send(null);
    if (!(200 <= r.status && 300 > r.status || 304 === r.status)) {
      throw Error("Couldn't load " + c + ". Status: " + r.status);
    }
    var x = Number(r.getResponseHeader("Content-length")), F, l = (F = r.getResponseHeader("Accept-Ranges")) && "bytes" === F;
    r = (F = r.getResponseHeader("Content-Encoding")) && "gzip" === F;
    var y = 1048576;
    l || (y = x);
    var A = this;
    A.Mb(N => {
      var X = N * y, ja = (N + 1) * y - 1;
      ja = Math.min(ja, x - 1);
      if ("undefined" == typeof A.O[N]) {
        var Sb = A.O;
        if (X > ja) {
          throw Error("invalid range (" + X + ", " + ja + ") or no bytes requested!");
        }
        if (ja > x - 1) {
          throw Error("only " + x + " bytes available! programmer error!");
        }
        var Q = new XMLHttpRequest();
        Q.open("GET", c, !1);
        x !== y && Q.setRequestHeader("Range", "bytes=" + X + "-" + ja);
        Q.responseType = "arraybuffer";
        Q.overrideMimeType && Q.overrideMimeType("text/plain; charset=x-user-defined");
        Q.send(null);
        if (!(200 <= Q.status && 300 > Q.status || 304 === Q.status)) {
          throw Error("Couldn't load " + c + ". Status: " + Q.status);
        }
        X = void 0 !== Q.response ? new Uint8Array(Q.response || []) : hb(Q.responseText || "", !0);
        Sb[N] = X;
      }
      if ("undefined" == typeof A.O[N]) {
        throw Error("doXHR failed!");
      }
      return A.O[N];
    });
    if (r || !x) {
      y = x = 1, y = x = this.jb(0).length, w("LazyFiles on gzip forces download of the whole file when length is accessed");
    }
    this.ub = x;
    this.tb = y;
    this.Ma = !0;
  };
  if ("undefined" != typeof XMLHttpRequest) {
    if (!n) {
      throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
    }
    var m = new g();
    Object.defineProperties(m, {length:{get:function() {
      this.Ma || this.Za();
      return this.ub;
    }}, chunkSize:{get:function() {
      this.Ma || this.Za();
      return this.tb;
    }}});
    m = {La:!1, j:m};
  } else {
    m = {La:!1, url:c};
  }
  var q = P.Ab(a, b, m, e, f);
  m.j ? q.j = m.j : m.url && (q.j = null, q.url = m.url);
  Object.defineProperties(q, {s:{get:function() {
    return this.j.length;
  }}});
  var t = {};
  Object.keys(q.i).forEach(r => {
    var x = q.i[r];
    t[r] = function() {
      P.Ia(q);
      return x.apply(null, arguments);
    };
  });
  t.read = (r, x, F, l, y) => {
    P.Ia(q);
    return h(r, x, F, l, y);
  };
  t.Y = (r, x, F) => {
    P.Ia(q);
    var l = nb();
    if (!l) {
      throw new P.g(48);
    }
    h(r, D, l, x, F);
    return {pb:l, Ya:!0};
  };
  q.i = t;
  return q;
}, Db:(a, b, c, e, f, g, h, m, q, t) => {
  function r(l) {
    function y(A) {
      t && t();
      m || P.ab(a, b, A, e, f, q);
      g && g();
      Ua(F);
    }
    tb.nc(l, x, y, () => {
      h && h();
      Ua(F);
    }) || y(l);
  }
  var x = b ? fb(M(a + "/" + b)) : a, F = Sa("cp " + x);
  Ta(F);
  "string" == typeof c ? ob(c, l => r(l), h) : r(c);
}, indexedDB:() => window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB, Wa:() => "EM_FS_" + window.location.pathname, Xa:20, ka:"FILE_DATA", wc:(a, b, c) => {
  b = b || (() => {
  });
  c = c || (() => {
  });
  var e = P.indexedDB();
  try {
    var f = e.open(P.Wa(), P.Xa);
  } catch (g) {
    return c(g);
  }
  f.onupgradeneeded = () => {
    w("creating db");
    f.result.createObjectStore(P.ka);
  };
  f.onsuccess = () => {
    var g = f.result.transaction([P.ka], "readwrite"), h = g.objectStore(P.ka), m = 0, q = 0, t = a.length;
    a.forEach(r => {
      r = h.put(P.na(r).object.j, r);
      r.onsuccess = () => {
        m++;
        m + q == t && (0 == q ? b() : c());
      };
      r.onerror = () => {
        q++;
        m + q == t && (0 == q ? b() : c());
      };
    });
    g.onerror = c;
  };
  f.onerror = c;
}, pc:(a, b, c) => {
  b = b || (() => {
  });
  c = c || (() => {
  });
  var e = P.indexedDB();
  try {
    var f = e.open(P.Wa(), P.Xa);
  } catch (g) {
    return c(g);
  }
  f.onupgradeneeded = c;
  f.onsuccess = () => {
    var g = f.result;
    try {
      var h = g.transaction([P.ka], "readonly");
    } catch (x) {
      c(x);
      return;
    }
    var m = h.objectStore(P.ka), q = 0, t = 0, r = a.length;
    a.forEach(x => {
      var F = m.get(x);
      F.onsuccess = () => {
        P.na(x).exists && P.unlink(x);
        P.ab(bb(x), O(x), F.result, !0, !0, !0);
        q++;
        q + t == r && (0 == t ? b() : c());
      };
      F.onerror = () => {
        t++;
        q + t == r && (0 == t ? b() : c());
      };
    });
    h.onerror = c;
  };
  f.onerror = c;
}, hc:() => {
  k("FS.absolutePath has been removed; use PATH_FS.resolve instead");
}, ic:() => {
  k("FS.createFolder has been removed; use FS.mkdir instead");
}, jc:() => {
  k("FS.createLink has been removed; use FS.symlink instead");
}, oc:() => {
  k("FS.joinPath has been removed; use PATH.join instead");
}, sc:() => {
  k("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
}, xc:() => {
  k("FS.standardizePath has been removed; use PATH.normalize instead");
}};
function ub(a, b, c) {
  if ("/" === b.charAt(0)) {
    return b;
  }
  a = -100 === a ? P.cwd() : U(a).path;
  if (0 == b.length) {
    if (!c) {
      throw new P.g(44);
    }
    return a;
  }
  return M(a + "/" + b);
}
function vb(a, b, c) {
  try {
    var e = a(b);
  } catch (g) {
    if (g && g.node && M(b) !== M(P.P(g.node))) {
      return -54;
    }
    throw g;
  }
  E[c >> 2] = e.dev;
  E[c + 8 >> 2] = e.ino;
  E[c + 12 >> 2] = e.mode;
  G[c + 16 >> 2] = e.nlink;
  E[c + 20 >> 2] = e.uid;
  E[c + 24 >> 2] = e.gid;
  E[c + 28 >> 2] = e.rdev;
  L = [e.size >>> 0, (K = e.size, 1.0 <= +Math.abs(K) ? 0.0 < K ? (Math.min(+Math.floor(K / 4294967296.0), 4294967295.0) | 0) >>> 0 : ~~+Math.ceil((K - +(~~K >>> 0)) / 4294967296.0) >>> 0 : 0)];
  E[c + 40 >> 2] = L[0];
  E[c + 44 >> 2] = L[1];
  E[c + 48 >> 2] = 4096;
  E[c + 52 >> 2] = e.blocks;
  a = e.atime.getTime();
  b = e.mtime.getTime();
  var f = e.ctime.getTime();
  L = [Math.floor(a / 1000) >>> 0, (K = Math.floor(a / 1000), 1.0 <= +Math.abs(K) ? 0.0 < K ? (Math.min(+Math.floor(K / 4294967296.0), 4294967295.0) | 0) >>> 0 : ~~+Math.ceil((K - +(~~K >>> 0)) / 4294967296.0) >>> 0 : 0)];
  E[c + 56 >> 2] = L[0];
  E[c + 60 >> 2] = L[1];
  G[c + 64 >> 2] = a % 1000 * 1000;
  L = [Math.floor(b / 1000) >>> 0, (K = Math.floor(b / 1000), 1.0 <= +Math.abs(K) ? 0.0 < K ? (Math.min(+Math.floor(K / 4294967296.0), 4294967295.0) | 0) >>> 0 : ~~+Math.ceil((K - +(~~K >>> 0)) / 4294967296.0) >>> 0 : 0)];
  E[c + 72 >> 2] = L[0];
  E[c + 76 >> 2] = L[1];
  G[c + 80 >> 2] = b % 1000 * 1000;
  L = [Math.floor(f / 1000) >>> 0, (K = Math.floor(f / 1000), 1.0 <= +Math.abs(K) ? 0.0 < K ? (Math.min(+Math.floor(K / 4294967296.0), 4294967295.0) | 0) >>> 0 : ~~+Math.ceil((K - +(~~K >>> 0)) / 4294967296.0) >>> 0 : 0)];
  E[c + 88 >> 2] = L[0];
  E[c + 92 >> 2] = L[1];
  G[c + 96 >> 2] = f % 1000 * 1000;
  L = [e.ino >>> 0, (K = e.ino, 1.0 <= +Math.abs(K) ? 0.0 < K ? (Math.min(+Math.floor(K / 4294967296.0), 4294967295.0) | 0) >>> 0 : ~~+Math.ceil((K - +(~~K >>> 0)) / 4294967296.0) >>> 0 : 0)];
  E[c + 104 >> 2] = L[0];
  E[c + 108 >> 2] = L[1];
  return 0;
}
var wb = void 0;
function xb() {
  assert(void 0 != wb);
  wb += 4;
  return E[wb - 4 >> 2];
}
function U(a) {
  a = P.ea(a);
  if (!a) {
    throw new P.g(8);
  }
  return a;
}
var V = {G:8192, m:function() {
  return P.createNode(null, "/", 16895, 0);
}, Cb:function() {
  var a = {v:[], qb:2,};
  a.v.push({buffer:new Uint8Array(V.G), offset:0, J:0});
  var b = V.sa(), c = V.sa(), e = P.createNode(V.root, b, 4096, 0), f = P.createNode(V.root, c, 4096, 0);
  e.pipe = a;
  f.pipe = a;
  a = P.ba({path:b, node:e, flags:0, seekable:!1, i:V.i});
  e.stream = a;
  c = P.ba({path:c, node:f, flags:1, seekable:!1, i:V.i});
  f.stream = c;
  return {Wb:a.fd, fc:c.fd};
}, i:{uc:function(a) {
  var b = a.node.pipe;
  if (1 === (a.flags & 2097155)) {
    return 260;
  }
  if (0 < b.v.length) {
    for (a = 0; a < b.v.length; a++) {
      var c = b.v[a];
      if (0 < c.offset - c.J) {
        return 65;
      }
    }
  }
  return 0;
}, xa:function() {
  return 28;
}, fsync:function() {
  return 28;
}, read:function(a, b, c, e) {
  a = a.node.pipe;
  for (var f = 0, g = 0; g < a.v.length; g++) {
    var h = a.v[g];
    f += h.offset - h.J;
  }
  assert(b instanceof ArrayBuffer || ArrayBuffer.isView(b));
  b = b.subarray(c, c + e);
  if (0 >= e) {
    return 0;
  }
  if (0 == f) {
    throw new P.g(6);
  }
  c = e = Math.min(f, e);
  for (g = f = 0; g < a.v.length; g++) {
    h = a.v[g];
    var m = h.offset - h.J;
    if (e <= m) {
      var q = h.buffer.subarray(h.J, h.offset);
      e < m ? (q = q.subarray(0, e), h.J += e) : f++;
      b.set(q);
      break;
    } else {
      q = h.buffer.subarray(h.J, h.offset), b.set(q), b = b.subarray(q.byteLength), e -= q.byteLength, f++;
    }
  }
  f && f == a.v.length && (f--, a.v[f].offset = 0, a.v[f].J = 0);
  a.v.splice(0, f);
  return c;
}, write:function(a, b, c, e) {
  a = a.node.pipe;
  assert(b instanceof ArrayBuffer || ArrayBuffer.isView(b));
  b = b.subarray(c, c + e);
  c = b.byteLength;
  if (0 >= c) {
    return 0;
  }
  0 == a.v.length ? (e = {buffer:new Uint8Array(V.G), offset:0, J:0}, a.v.push(e)) : e = a.v[a.v.length - 1];
  assert(e.offset <= V.G);
  var f = V.G - e.offset;
  if (f >= c) {
    return e.buffer.set(b, e.offset), e.offset += c, c;
  }
  0 < f && (e.buffer.set(b.subarray(0, f), e.offset), e.offset += f, b = b.subarray(f, b.byteLength));
  e = b.byteLength / V.G | 0;
  f = b.byteLength % V.G;
  for (var g = 0; g < e; g++) {
    var h = {buffer:new Uint8Array(V.G), offset:V.G, J:0};
    a.v.push(h);
    h.buffer.set(b.subarray(0, V.G));
    b = b.subarray(V.G, b.byteLength);
  }
  0 < f && (h = {buffer:new Uint8Array(V.G), offset:b.byteLength, J:0}, a.v.push(h), h.buffer.set(b));
  return c;
}, close:function(a) {
  a = a.node.pipe;
  a.qb--;
  0 === a.qb && (a.v = null);
}}, sa:function() {
  V.sa.current || (V.sa.current = 0);
  return "pipe[" + V.sa.current++ + "]";
}};
function yb(a) {
  return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
}
var zb = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Ab = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
function Bb(a) {
  return (yb(a.getFullYear()) ? zb : Ab)[a.getMonth()] + a.getDate() - 1;
}
function Cb(a) {
  var b = Ba(a) + 1, c = Db(b);
  c && Aa(a, D, c, b);
  return c;
}
var Eb;
Eb = p ? () => {
  var a = process.hrtime();
  return 1e3 * a[0] + a[1] / 1e6;
} : () => performance.now();
var Fb = {};
function Gb() {
  if (!Hb) {
    var a = {USER:"web_user", LOGNAME:"web_user", PATH:"/", PWD:"/", HOME:"/home/web_user", LANG:("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _:ea || "./this.program"}, b;
    for (b in Fb) {
      void 0 === Fb[b] ? delete a[b] : a[b] = Fb[b];
    }
    var c = [];
    for (b in a) {
      c.push(b + "=" + a[b]);
    }
    Hb = c;
  }
  return Hb;
}
var Hb;
function Ib(a, b) {
  ua = a;
  Jb();
  noExitRuntime && !b && (b = "program exited (with status: " + a + "), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)", ba(b), v(b));
  ua = a;
  noExitRuntime || (ta = !0);
  fa(a, new oa(a));
}
function Kb(a, b, c, e) {
  for (var f = 0, g = 0; g < c; g++) {
    var h = G[b >> 2], m = G[b + 4 >> 2];
    b += 8;
    h = P.read(a, D, h, m, e);
    if (0 > h) {
      return -1;
    }
    f += h;
    if (h < m) {
      break;
    }
  }
  return f;
}
function Lb(a, b, c, e) {
  for (var f = 0, g = 0; g < c; g++) {
    var h = G[b >> 2], m = G[b + 4 >> 2];
    b += 8;
    h = P.write(a, D, h, m, e);
    if (0 > h) {
      return -1;
    }
    f += h;
  }
  return f;
}
var Mb = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Nb = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function Ob(a, b) {
  assert(0 <= a.length, "writeArrayToMemory array must have a length (should be an array or typed array)");
  D.set(a, b);
}
function Pb(a) {
  if (a instanceof oa || "unwind" == a) {
    return ua;
  }
  Ga();
  a instanceof WebAssembly.RuntimeError && 0 >= Qb() && v("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 65536)");
  fa(1, a);
}
function Rb(a, b, c, e) {
  a || (a = this);
  this.parent = a;
  this.m = a.m;
  this.qa = null;
  this.id = P.Rb++;
  this.name = b;
  this.mode = c;
  this.h = {};
  this.i = {};
  this.rdev = e;
}
Object.defineProperties(Rb.prototype, {read:{get:function() {
  return 365 === (this.mode & 365);
}, set:function(a) {
  a ? this.mode |= 365 : this.mode &= -366;
}}, write:{get:function() {
  return 146 === (this.mode & 146);
}, set:function(a) {
  a ? this.mode |= 146 : this.mode &= -147;
}}, Nb:{get:function() {
  return P.u(this.mode);
}}, La:{get:function() {
  return P.ga(this.mode);
}}});
P.rb = Rb;
P.Ta();
var tb;
p && S.Ta();
pb = {EPERM:63, ENOENT:44, ESRCH:71, EINTR:27, EIO:29, ENXIO:60, E2BIG:1, ENOEXEC:45, EBADF:8, ECHILD:12, EAGAIN:6, EWOULDBLOCK:6, ENOMEM:48, EACCES:2, EFAULT:21, ENOTBLK:105, EBUSY:10, EEXIST:20, EXDEV:75, ENODEV:43, ENOTDIR:54, EISDIR:31, EINVAL:28, ENFILE:41, EMFILE:33, ENOTTY:59, ETXTBSY:74, EFBIG:22, ENOSPC:51, ESPIPE:70, EROFS:69, EMLINK:34, EPIPE:64, EDOM:18, ERANGE:68, ENOMSG:49, EIDRM:24, ECHRNG:106, EL2NSYNC:156, EL3HLT:107, EL3RST:108, ELNRNG:109, EUNATCH:110, ENOCSI:111, EL2HLT:112, EDEADLK:16, 
ENOLCK:46, EBADE:113, EBADR:114, EXFULL:115, ENOANO:104, EBADRQC:103, EBADSLT:102, EDEADLOCK:16, EBFONT:101, ENOSTR:100, ENODATA:116, ETIME:117, ENOSR:118, ENONET:119, ENOPKG:120, EREMOTE:121, ENOLINK:47, EADV:122, ESRMNT:123, ECOMM:124, EPROTO:65, EMULTIHOP:36, EDOTDOT:125, EBADMSG:9, ENOTUNIQ:126, EBADFD:127, EREMCHG:128, ELIBACC:129, ELIBBAD:130, ELIBSCN:131, ELIBMAX:132, ELIBEXEC:133, ENOSYS:52, ENOTEMPTY:55, ENAMETOOLONG:37, ELOOP:32, EOPNOTSUPP:138, EPFNOSUPPORT:139, ECONNRESET:15, ENOBUFS:42, 
EAFNOSUPPORT:5, EPROTOTYPE:67, ENOTSOCK:57, ENOPROTOOPT:50, ESHUTDOWN:140, ECONNREFUSED:14, EADDRINUSE:3, ECONNABORTED:13, ENETUNREACH:40, ENETDOWN:38, ETIMEDOUT:73, EHOSTDOWN:142, EHOSTUNREACH:23, EINPROGRESS:26, EALREADY:7, EDESTADDRREQ:17, EMSGSIZE:35, EPROTONOSUPPORT:66, ESOCKTNOSUPPORT:137, EADDRNOTAVAIL:4, ENETRESET:39, EISCONN:30, ENOTCONN:53, ETOOMANYREFS:141, EUSERS:136, EDQUOT:19, ESTALE:72, ENOTSUP:138, ENOMEDIUM:148, EILSEQ:25, EOVERFLOW:61, ECANCELED:11, ENOTRECOVERABLE:56, EOWNERDEAD:62, 
ESTRPIPE:135,};
var ic = {__assert_fail:function(a, b, c, e) {
  k("Assertion failed: " + C(a) + ", at: " + [b ? C(b) : "unknown filename", c, e ? C(e) : "unknown function"]);
}, __syscall_dup:function(a) {
  try {
    var b = U(a);
    return P.ba(b, 0).fd;
  } catch (c) {
    if ("undefined" == typeof P || !(c instanceof P.g)) {
      throw c;
    }
    return -c.l;
  }
}, __syscall_dup3:function(a, b, c) {
  try {
    var e = U(a);
    assert(!c);
    if (e.fd === b) {
      return -28;
    }
    var f = P.ea(b);
    f && P.close(f);
    return P.ba(e, b, b + 1).fd;
  } catch (g) {
    if ("undefined" == typeof P || !(g instanceof P.g)) {
      throw g;
    }
    return -g.l;
  }
}, __syscall_faccessat:function(a, b, c, e) {
  try {
    b = C(b);
    assert(0 === e);
    b = ub(a, b);
    if (c & -8) {
      return -28;
    }
    var f = P.o(b, {H:!0}).node;
    if (!f) {
      return -44;
    }
    a = "";
    c & 4 && (a += "r");
    c & 2 && (a += "w");
    c & 1 && (a += "x");
    return a && P.V(f, a) ? -2 : 0;
  } catch (g) {
    if ("undefined" == typeof P || !(g instanceof P.g)) {
      throw g;
    }
    return -g.l;
  }
}, __syscall_fcntl64:function(a, b, c) {
  wb = c;
  try {
    var e = U(a);
    switch(b) {
      case 0:
        var f = xb();
        return 0 > f ? -28 : P.ba(e, f).fd;
      case 1:
      case 2:
        return 0;
      case 3:
        return e.flags;
      case 4:
        return f = xb(), e.flags |= f, 0;
      case 5:
        return f = xb(), Da[f + 0 >> 1] = 2, 0;
      case 6:
      case 7:
        return 0;
      case 16:
      case 8:
        return -28;
      case 9:
        return E[Tb() >> 2] = 28, -1;
      default:
        return -28;
    }
  } catch (g) {
    if ("undefined" == typeof P || !(g instanceof P.g)) {
      throw g;
    }
    return -g.l;
  }
}, __syscall_fstat64:function(a, b) {
  try {
    var c = U(a);
    return vb(P.stat, c.path, b);
  } catch (e) {
    if ("undefined" == typeof P || !(e instanceof P.g)) {
      throw e;
    }
    return -e.l;
  }
}, __syscall_getdents64:function(a, b, c) {
  try {
    var e = U(a);
    e.W || (e.W = P.readdir(e.path));
    a = 0;
    for (var f = P.C(e, 0, 1), g = Math.floor(f / 280); g < e.W.length && a + 280 <= c;) {
      var h = e.W[g];
      if ("." === h) {
        var m = e.node.id;
        var q = 4;
      } else if (".." === h) {
        m = P.o(e.path, {parent:!0}).node.id, q = 4;
      } else {
        var t = P.K(e.node, h);
        m = t.id;
        q = P.ga(t.mode) ? 2 : P.u(t.mode) ? 4 : P.R(t.mode) ? 10 : 8;
      }
      assert(m);
      L = [m >>> 0, (K = m, 1.0 <= +Math.abs(K) ? 0.0 < K ? (Math.min(+Math.floor(K / 4294967296.0), 4294967295.0) | 0) >>> 0 : ~~+Math.ceil((K - +(~~K >>> 0)) / 4294967296.0) >>> 0 : 0)];
      E[b + a >> 2] = L[0];
      E[b + a + 4 >> 2] = L[1];
      L = [280 * (g + 1) >>> 0, (K = 280 * (g + 1), 1.0 <= +Math.abs(K) ? 0.0 < K ? (Math.min(+Math.floor(K / 4294967296.0), 4294967295.0) | 0) >>> 0 : ~~+Math.ceil((K - +(~~K >>> 0)) / 4294967296.0) >>> 0 : 0)];
      E[b + a + 8 >> 2] = L[0];
      E[b + a + 12 >> 2] = L[1];
      Da[b + a + 16 >> 1] = 280;
      D[b + a + 18 >> 0] = q;
      f = h;
      var r = b + a + 19;
      assert(!0, "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
      Aa(f, za, r, 256);
      a += 280;
      g += 1;
    }
    P.C(e, 280 * g, 0);
    return a;
  } catch (x) {
    if ("undefined" == typeof P || !(x instanceof P.g)) {
      throw x;
    }
    return -x.l;
  }
}, __syscall_ioctl:function(a, b, c) {
  wb = c;
  try {
    var e = U(a);
    switch(b) {
      case 21509:
      case 21505:
        return e.tty ? 0 : -59;
      case 21510:
      case 21511:
      case 21512:
      case 21506:
      case 21507:
      case 21508:
        return e.tty ? 0 : -59;
      case 21519:
        if (!e.tty) {
          return -59;
        }
        var f = xb();
        return E[f >> 2] = 0;
      case 21520:
        return e.tty ? -28 : -59;
      case 21531:
        return f = xb(), P.xa(e, b, f);
      case 21523:
        return e.tty ? 0 : -59;
      case 21524:
        return e.tty ? 0 : -59;
      default:
        return -28;
    }
  } catch (g) {
    if ("undefined" == typeof P || !(g instanceof P.g)) {
      throw g;
    }
    return -g.l;
  }
}, __syscall_lstat64:function(a, b) {
  try {
    return a = C(a), vb(P.lstat, a, b);
  } catch (c) {
    if ("undefined" == typeof P || !(c instanceof P.g)) {
      throw c;
    }
    return -c.l;
  }
}, __syscall_newfstatat:function(a, b, c, e) {
  try {
    b = C(b);
    var f = e & 256, g = e & 4096;
    e &= -6401;
    assert(!e, "unknown flags in __syscall_newfstatat: " + e);
    b = ub(a, b, g);
    return vb(f ? P.lstat : P.stat, b, c);
  } catch (h) {
    if ("undefined" == typeof P || !(h instanceof P.g)) {
      throw h;
    }
    return -h.l;
  }
}, __syscall_openat:function(a, b, c, e) {
  wb = e;
  try {
    b = C(b);
    b = ub(a, b);
    var f = e ? xb() : 0;
    return P.open(b, c, f).fd;
  } catch (g) {
    if ("undefined" == typeof P || !(g instanceof P.g)) {
      throw g;
    }
    return -g.l;
  }
}, __syscall_pipe:function(a) {
  try {
    if (0 == a) {
      throw new P.g(21);
    }
    var b = V.Cb();
    E[a >> 2] = b.Wb;
    E[a + 4 >> 2] = b.fc;
    return 0;
  } catch (c) {
    if ("undefined" == typeof P || !(c instanceof P.g)) {
      throw c;
    }
    return -c.l;
  }
}, __syscall_renameat:function(a, b, c, e) {
  try {
    return b = C(b), e = C(e), b = ub(a, b), e = ub(c, e), P.rename(b, e), 0;
  } catch (f) {
    if ("undefined" == typeof P || !(f instanceof P.g)) {
      throw f;
    }
    return -f.l;
  }
}, __syscall_rmdir:function(a) {
  try {
    return a = C(a), P.rmdir(a), 0;
  } catch (b) {
    if ("undefined" == typeof P || !(b instanceof P.g)) {
      throw b;
    }
    return -b.l;
  }
}, __syscall_stat64:function(a, b) {
  try {
    return a = C(a), vb(P.stat, a, b);
  } catch (c) {
    if ("undefined" == typeof P || !(c instanceof P.g)) {
      throw c;
    }
    return -c.l;
  }
}, __syscall_unlinkat:function(a, b, c) {
  try {
    return b = C(b), b = ub(a, b), 0 === c ? P.unlink(b) : 512 === c ? P.rmdir(b) : k("Invalid flags passed to unlinkat"), 0;
  } catch (e) {
    if ("undefined" == typeof P || !(e instanceof P.g)) {
      throw e;
    }
    return -e.l;
  }
}, _dlinit:function() {
}, _dlopen_js:function() {
  k("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
}, _dlsym_js:function() {
  k("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking");
}, _emscripten_get_now_is_monotonic:function() {
  return !0;
}, _emscripten_throw_longjmp:function() {
  throw Infinity;
}, _gmtime_js:function(a, b) {
  a = new Date(1000 * (G[a >> 2] + 4294967296 * E[a + 4 >> 2]));
  E[b >> 2] = a.getUTCSeconds();
  E[b + 4 >> 2] = a.getUTCMinutes();
  E[b + 8 >> 2] = a.getUTCHours();
  E[b + 12 >> 2] = a.getUTCDate();
  E[b + 16 >> 2] = a.getUTCMonth();
  E[b + 20 >> 2] = a.getUTCFullYear() - 1900;
  E[b + 24 >> 2] = a.getUTCDay();
  E[b + 28 >> 2] = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864E5 | 0;
}, _localtime_js:function(a, b) {
  a = new Date(1000 * (G[a >> 2] + 4294967296 * E[a + 4 >> 2]));
  E[b >> 2] = a.getSeconds();
  E[b + 4 >> 2] = a.getMinutes();
  E[b + 8 >> 2] = a.getHours();
  E[b + 12 >> 2] = a.getDate();
  E[b + 16 >> 2] = a.getMonth();
  E[b + 20 >> 2] = a.getFullYear() - 1900;
  E[b + 24 >> 2] = a.getDay();
  E[b + 28 >> 2] = Bb(a) | 0;
  E[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
  var c = (new Date(a.getFullYear(), 6, 1)).getTimezoneOffset(), e = (new Date(a.getFullYear(), 0, 1)).getTimezoneOffset();
  E[b + 32 >> 2] = (c != e && a.getTimezoneOffset() == Math.min(e, c)) | 0;
}, _mktime_js:function(a) {
  var b = new Date(E[a + 20 >> 2] + 1900, E[a + 16 >> 2], E[a + 12 >> 2], E[a + 8 >> 2], E[a + 4 >> 2], E[a >> 2], 0), c = E[a + 32 >> 2], e = b.getTimezoneOffset(), f = (new Date(b.getFullYear(), 6, 1)).getTimezoneOffset(), g = (new Date(b.getFullYear(), 0, 1)).getTimezoneOffset(), h = Math.min(g, f);
  0 > c ? E[a + 32 >> 2] = Number(f != g && h == e) : 0 < c != (h == e) && (f = Math.max(g, f), b.setTime(b.getTime() + 60000 * ((0 < c ? h : f) - e)));
  E[a + 24 >> 2] = b.getDay();
  E[a + 28 >> 2] = Bb(b) | 0;
  E[a >> 2] = b.getSeconds();
  E[a + 4 >> 2] = b.getMinutes();
  E[a + 8 >> 2] = b.getHours();
  E[a + 12 >> 2] = b.getDate();
  E[a + 16 >> 2] = b.getMonth();
  E[a + 20 >> 2] = b.getYear();
  return b.getTime() / 1000 | 0;
}, _tzset_js:function(a, b, c) {
  function e(q) {
    return (q = q.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? q[1] : "GMT";
  }
  var f = (new Date()).getFullYear(), g = new Date(f, 0, 1), h = new Date(f, 6, 1);
  f = g.getTimezoneOffset();
  var m = h.getTimezoneOffset();
  G[a >> 2] = 60 * Math.max(f, m);
  E[b >> 2] = Number(f != m);
  a = e(g);
  b = e(h);
  a = Cb(a);
  b = Cb(b);
  m < f ? (G[c >> 2] = a, G[c + 4 >> 2] = b) : (G[c >> 2] = b, G[c + 4 >> 2] = a);
}, abort:function() {
  k("native code called abort()");
}, emscripten_date_now:function() {
  return Date.now();
}, emscripten_get_now:Eb, emscripten_memcpy_big:function(a, b, c) {
  za.copyWithin(a, b, b + c);
}, emscripten_resize_heap:function(a) {
  var b = za.length;
  a >>>= 0;
  assert(a > b);
  if (2147483648 < a) {
    return v("Cannot enlarge memory, asked to go up to " + a + " bytes, but the limit is 2147483648 bytes!"), !1;
  }
  for (var c = 1; 4 >= c; c *= 2) {
    var e = b * (1 + 0.2 / c);
    e = Math.min(e, a + 100663296);
    var f = Math;
    e = Math.max(a, e);
    f = f.min.call(f, 2147483648, e + (65536 - e % 65536) % 65536);
    a: {
      e = f;
      try {
        sa.grow(e - Ca.byteLength + 65535 >>> 16);
        Ea();
        var g = 1;
        break a;
      } catch (h) {
        v("emscripten_realloc_buffer: Attempted to grow heap from " + Ca.byteLength + " bytes to " + e + " bytes, but got error: " + h);
      }
      g = void 0;
    }
    if (g) {
      return !0;
    }
  }
  v("Failed to grow the heap from " + b + " bytes to " + f + " bytes, not enough memory!");
  return !1;
}, environ_get:function(a, b) {
  var c = 0;
  Gb().forEach(function(e, f) {
    var g = b + c;
    f = G[a + 4 * f >> 2] = g;
    for (g = 0; g < e.length; ++g) {
      assert(e.charCodeAt(g) === (e.charCodeAt(g) & 255)), D[f++ >> 0] = e.charCodeAt(g);
    }
    D[f >> 0] = 0;
    c += e.length + 1;
  });
  return 0;
}, environ_sizes_get:function(a, b) {
  var c = Gb();
  G[a >> 2] = c.length;
  var e = 0;
  c.forEach(function(f) {
    e += f.length + 1;
  });
  G[b >> 2] = e;
  return 0;
}, exit:Ib, fd_close:function(a) {
  try {
    var b = U(a);
    P.close(b);
    return 0;
  } catch (c) {
    if ("undefined" == typeof P || !(c instanceof P.g)) {
      throw c;
    }
    return c.l;
  }
}, fd_fdstat_get:function(a, b) {
  try {
    var c = U(a), e = c.tty ? 2 : P.u(c.mode) ? 3 : P.R(c.mode) ? 7 : 4;
    D[b >> 0] = e;
    return 0;
  } catch (f) {
    if ("undefined" == typeof P || !(f instanceof P.g)) {
      throw f;
    }
    return f.l;
  }
}, fd_pread:function(a, b, c, e, f) {
  try {
    e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
    if (isNaN(e)) {
      return 61;
    }
    var g = U(a), h = Kb(g, b, c, e);
    G[f >> 2] = h;
    return 0;
  } catch (m) {
    if ("undefined" == typeof P || !(m instanceof P.g)) {
      throw m;
    }
    return m.l;
  }
}, fd_pwrite:function(a, b, c, e, f) {
  try {
    e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
    if (isNaN(e)) {
      return 61;
    }
    var g = U(a), h = Lb(g, b, c, e);
    G[f >> 2] = h;
    return 0;
  } catch (m) {
    if ("undefined" == typeof P || !(m instanceof P.g)) {
      throw m;
    }
    return m.l;
  }
}, fd_read:function(a, b, c, e) {
  try {
    var f = U(a), g = Kb(f, b, c);
    G[e >> 2] = g;
    return 0;
  } catch (h) {
    if ("undefined" == typeof P || !(h instanceof P.g)) {
      throw h;
    }
    return h.l;
  }
}, fd_seek:function(a, b, c, e) {
  try {
    b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
    if (isNaN(b)) {
      return 61;
    }
    var f = U(a);
    P.C(f, b, c);
    L = [f.position >>> 0, (K = f.position, 1.0 <= +Math.abs(K) ? 0.0 < K ? (Math.min(+Math.floor(K / 4294967296.0), 4294967295.0) | 0) >>> 0 : ~~+Math.ceil((K - +(~~K >>> 0)) / 4294967296.0) >>> 0 : 0)];
    E[e >> 2] = L[0];
    E[e + 4 >> 2] = L[1];
    f.W && 0 === b && 0 === c && (f.W = null);
    return 0;
  } catch (g) {
    if ("undefined" == typeof P || !(g instanceof P.g)) {
      throw g;
    }
    return g.l;
  }
}, fd_write:function(a, b, c, e) {
  try {
    var f = U(a), g = Lb(f, b, c);
    G[e >> 2] = g;
    return 0;
  } catch (h) {
    if ("undefined" == typeof P || !(h instanceof P.g)) {
      throw h;
    }
    return h.l;
  }
}, invoke_ii:Ub, invoke_iii:Vb, invoke_iiii:Wb, invoke_iiiii:Xb, invoke_iiiiiiii:Yb, invoke_iiiiiiiii:Zb, invoke_iiji:$b, invoke_v:ac, invoke_vi:bc, invoke_vii:cc, invoke_viii:dc, invoke_viiii:ec, invoke_viiiii:fc, invoke_viiiiii:gc, invoke_viiiiiiiii:hc, strftime:function(a, b, c, e) {
  function f(l, y, A) {
    for (l = "number" == typeof l ? l.toString() : l || ""; l.length < y;) {
      l = A[0] + l;
    }
    return l;
  }
  function g(l, y) {
    return f(l, y, "0");
  }
  function h(l, y) {
    function A(X) {
      return 0 > X ? -1 : 0 < X ? 1 : 0;
    }
    var N;
    0 === (N = A(l.getFullYear() - y.getFullYear())) && 0 === (N = A(l.getMonth() - y.getMonth())) && (N = A(l.getDate() - y.getDate()));
    return N;
  }
  function m(l) {
    switch(l.getDay()) {
      case 0:
        return new Date(l.getFullYear() - 1, 11, 29);
      case 1:
        return l;
      case 2:
        return new Date(l.getFullYear(), 0, 3);
      case 3:
        return new Date(l.getFullYear(), 0, 2);
      case 4:
        return new Date(l.getFullYear(), 0, 1);
      case 5:
        return new Date(l.getFullYear() - 1, 11, 31);
      case 6:
        return new Date(l.getFullYear() - 1, 11, 30);
    }
  }
  function q(l) {
    var y = l.$;
    for (l = new Date((new Date(l.aa + 1900, 0, 1)).getTime()); 0 < y;) {
      var A = l.getMonth(), N = (yb(l.getFullYear()) ? Mb : Nb)[A];
      if (y > N - l.getDate()) {
        y -= N - l.getDate() + 1, l.setDate(1), 11 > A ? l.setMonth(A + 1) : (l.setMonth(0), l.setFullYear(l.getFullYear() + 1));
      } else {
        l.setDate(l.getDate() + y);
        break;
      }
    }
    A = new Date(l.getFullYear() + 1, 0, 4);
    y = m(new Date(l.getFullYear(), 0, 4));
    A = m(A);
    return 0 >= h(y, l) ? 0 >= h(A, l) ? l.getFullYear() + 1 : l.getFullYear() : l.getFullYear() - 1;
  }
  var t = E[e + 40 >> 2];
  e = {ac:E[e >> 2], $b:E[e + 4 >> 2], Ca:E[e + 8 >> 2], Va:E[e + 12 >> 2], Da:E[e + 16 >> 2], aa:E[e + 20 >> 2], N:E[e + 24 >> 2], $:E[e + 28 >> 2], yc:E[e + 32 >> 2], Zb:E[e + 36 >> 2], bc:t ? C(t) : ""};
  c = C(c);
  t = {"%c":"%a %b %d %H:%M:%S %Y", "%D":"%m/%d/%y", "%F":"%Y-%m-%d", "%h":"%b", "%r":"%I:%M:%S %p", "%R":"%H:%M", "%T":"%H:%M:%S", "%x":"%m/%d/%y", "%X":"%H:%M:%S", "%Ec":"%c", "%EC":"%C", "%Ex":"%m/%d/%y", "%EX":"%H:%M:%S", "%Ey":"%y", "%EY":"%Y", "%Od":"%d", "%Oe":"%e", "%OH":"%H", "%OI":"%I", "%Om":"%m", "%OM":"%M", "%OS":"%S", "%Ou":"%u", "%OU":"%U", "%OV":"%V", "%Ow":"%w", "%OW":"%W", "%Oy":"%y",};
  for (var r in t) {
    c = c.replace(new RegExp(r, "g"), t[r]);
  }
  var x = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), F = "January February March April May June July August September October November December".split(" ");
  t = {"%a":function(l) {
    return x[l.N].substring(0, 3);
  }, "%A":function(l) {
    return x[l.N];
  }, "%b":function(l) {
    return F[l.Da].substring(0, 3);
  }, "%B":function(l) {
    return F[l.Da];
  }, "%C":function(l) {
    return g((l.aa + 1900) / 100 | 0, 2);
  }, "%d":function(l) {
    return g(l.Va, 2);
  }, "%e":function(l) {
    return f(l.Va, 2, " ");
  }, "%g":function(l) {
    return q(l).toString().substring(2);
  }, "%G":function(l) {
    return q(l);
  }, "%H":function(l) {
    return g(l.Ca, 2);
  }, "%I":function(l) {
    l = l.Ca;
    0 == l ? l = 12 : 12 < l && (l -= 12);
    return g(l, 2);
  }, "%j":function(l) {
    for (var y = 0, A = 0; A <= l.Da - 1; y += (yb(l.aa + 1900) ? Mb : Nb)[A++]) {
    }
    return g(l.Va + y, 3);
  }, "%m":function(l) {
    return g(l.Da + 1, 2);
  }, "%M":function(l) {
    return g(l.$b, 2);
  }, "%n":function() {
    return "\n";
  }, "%p":function(l) {
    return 0 <= l.Ca && 12 > l.Ca ? "AM" : "PM";
  }, "%S":function(l) {
    return g(l.ac, 2);
  }, "%t":function() {
    return "\t";
  }, "%u":function(l) {
    return l.N || 7;
  }, "%U":function(l) {
    return g(Math.floor((l.$ + 7 - l.N) / 7), 2);
  }, "%V":function(l) {
    var y = Math.floor((l.$ + 7 - (l.N + 6) % 7) / 7);
    2 >= (l.N + 371 - l.$ - 2) % 7 && y++;
    if (y) {
      53 == y && (A = (l.N + 371 - l.$) % 7, 4 == A || 3 == A && yb(l.aa) || (y = 1));
    } else {
      y = 52;
      var A = (l.N + 7 - l.$ - 1) % 7;
      (4 == A || 5 == A && yb(l.aa % 400 - 1)) && y++;
    }
    return g(y, 2);
  }, "%w":function(l) {
    return l.N;
  }, "%W":function(l) {
    return g(Math.floor((l.$ + 7 - (l.N + 6) % 7) / 7), 2);
  }, "%y":function(l) {
    return (l.aa + 1900).toString().substring(2);
  }, "%Y":function(l) {
    return l.aa + 1900;
  }, "%z":function(l) {
    l = l.Zb;
    var y = 0 <= l;
    l = Math.abs(l) / 60;
    return (y ? "+" : "-") + String("0000" + (l / 60 * 100 + l % 60)).slice(-4);
  }, "%Z":function(l) {
    return l.bc;
  }, "%%":function() {
    return "%";
  }};
  c = c.replace(/%%/g, "\x00\x00");
  for (r in t) {
    c.includes(r) && (c = c.replace(new RegExp(r, "g"), t[r](e)));
  }
  c = c.replace(/\0\0/g, "%");
  r = hb(c, !1);
  if (r.length > b) {
    return 0;
  }
  Ob(r, a);
  return r.length - 1;
}};
(function() {
  function a(g) {
    d.asm = g.exports;
    sa = d.asm.memory;
    assert(sa, "memory not found in wasm exports");
    Ea();
    Fa = d.asm.__indirect_function_table;
    assert(Fa, "table not found in wasm exports");
    La.unshift(d.asm.__wasm_call_ctors);
    Ua("wasm-instantiate");
  }
  function b(g) {
    assert(d === f, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
    f = null;
    a(g.instance);
  }
  function c(g) {
    return Ya().then(function(h) {
      return WebAssembly.instantiate(h, e);
    }).then(function(h) {
      return h;
    }).then(g, function(h) {
      v("failed to asynchronously prepare wasm: " + h);
      qa(I) && v("warning: Loading from a file URI (" + I + ") is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing");
      k(h);
    });
  }
  var e = {env:ic, wasi_snapshot_preview1:ic,};
  Ta("wasm-instantiate");
  var f = d;
  if (d.instantiateWasm) {
    try {
      return d.instantiateWasm(e, a);
    } catch (g) {
      v("Module.instantiateWasm callback failed with error: " + g), ba(g);
    }
  }
  (function() {
    return "function" != typeof WebAssembly.instantiateStreaming || Va() || qa(I) || p || "function" != typeof fetch ? c(b) : fetch(I, {credentials:"same-origin"}).then(function(g) {
      return WebAssembly.instantiateStreaming(g, e).then(b, function(h) {
        v("wasm streaming compile failed: " + h);
        v("falling back to ArrayBuffer instantiation");
        return c(b);
      });
    });
  })().catch(ba);
  return {};
})();
d.___wasm_call_ctors = J("__wasm_call_ctors");
d._main = J("__main_argc_argv");
var Tb = d.___errno_location = J("__errno_location"), Db = d._malloc = J("malloc");
d.setTempRet0 = J("setTempRet0");
d.getTempRet0 = J("getTempRet0");
d._saveSetjmp = J("saveSetjmp");
d._free = J("free");
var sb = d._fflush = J("fflush");
d.___dl_seterr = J("__dl_seterr");
var W = d._setThrew = J("setThrew"), jc = d._emscripten_stack_init = function() {
  return (jc = d._emscripten_stack_init = d.asm.emscripten_stack_init).apply(null, arguments);
};
d._emscripten_stack_get_free = function() {
  return (d._emscripten_stack_get_free = d.asm.emscripten_stack_get_free).apply(null, arguments);
};
d._emscripten_stack_get_base = function() {
  return (d._emscripten_stack_get_base = d.asm.emscripten_stack_get_base).apply(null, arguments);
};
var Ha = d._emscripten_stack_get_end = function() {
  return (Ha = d._emscripten_stack_get_end = d.asm.emscripten_stack_get_end).apply(null, arguments);
}, Y = d.stackSave = J("stackSave"), Z = d.stackRestore = J("stackRestore"), kc = d.stackAlloc = J("stackAlloc"), Qb = d._emscripten_stack_get_current = function() {
  return (Qb = d._emscripten_stack_get_current = d.asm.emscripten_stack_get_current).apply(null, arguments);
};
d.___cxa_free_exception = J("__cxa_free_exception");
d.___cxa_can_catch = J("__cxa_can_catch");
d.___cxa_is_pointer_type = J("__cxa_is_pointer_type");
var lc = d.dynCall_ii = J("dynCall_ii"), mc = d.dynCall_iiiiiiii = J("dynCall_iiiiiiii"), nc = d.dynCall_viiii = J("dynCall_viiii"), oc = d.dynCall_iiiii = J("dynCall_iiiii");
d.dynCall_iiiiiii = J("dynCall_iiiiiii");
var dynCall_iii = d.dynCall_iii = J("dynCall_iii"), dynCall_vii = d.dynCall_vii = J("dynCall_vii"), pc = d.dynCall_iiii = J("dynCall_iiii"), qc = d.dynCall_viii = J("dynCall_viii");
d.dynCall_iiiiii = J("dynCall_iiiiii");
var dynCall_vi = d.dynCall_vi = J("dynCall_vi");
d.dynCall_iiiiiiiifi = J("dynCall_iiiiiiiifi");
var rc = d.dynCall_iiiiiiiii = J("dynCall_iiiiiiiii");
d.dynCall_iiiiiiiiiiii = J("dynCall_iiiiiiiiiiii");
d.dynCall_iiiiiiiiiii = J("dynCall_iiiiiiiiiii");
d.dynCall_iiiiiiiiiiiiiiiii = J("dynCall_iiiiiiiiiiiiiiiii");
d.dynCall_iiiiiiiiii = J("dynCall_iiiiiiiiii");
var sc = d.dynCall_iiji = J("dynCall_iiji");
d.dynCall_jii = J("dynCall_jii");
d.dynCall_iiiiiiijjii = J("dynCall_iiiiiiijjii");
d.dynCall_iiiiiiiiiiji = J("dynCall_iiiiiiiiiiji");
d.dynCall_iiiiiiiiiijj = J("dynCall_iiiiiiiiiijj");
d.dynCall_iiiiiij = J("dynCall_iiiiiij");
d.dynCall_iiiiiiiiiiiiii = J("dynCall_iiiiiiiiiiiiii");
d.dynCall_iiiiiiiiiiiii = J("dynCall_iiiiiiiiiiiii");
d.dynCall_iiiijii = J("dynCall_iiiijii");
d.dynCall_iiiiijiiiii = J("dynCall_iiiiijiiiii");
d.dynCall_fdi = J("dynCall_fdi");
d.dynCall_iiijiii = J("dynCall_iiijiii");
d.dynCall_iijiii = J("dynCall_iijiii");
d.dynCall_iij = J("dynCall_iij");
d.dynCall_iidiii = J("dynCall_iidiii");
var tc = d.dynCall_viiiii = J("dynCall_viiiii");
d.dynCall_viiiiiii = J("dynCall_viiiiiii");
var uc = d.dynCall_viiiiii = J("dynCall_viiiiii");
d.dynCall_idii = J("dynCall_idii");
d.dynCall_iiiiiiiiiiiiiii = J("dynCall_iiiiiiiiiiiiiii");
d.dynCall_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijiiiiii = J("dynCall_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijiiiiii");
d.dynCall_viiiiiiiiiiiiiijiiiii = J("dynCall_viiiiiiiiiiiiiijiiiii");
var vc = d.dynCall_viiiiiiiii = J("dynCall_viiiiiiiii");
d.dynCall_vijii = J("dynCall_vijii");
d.dynCall_ji = J("dynCall_ji");
d.dynCall_iijii = J("dynCall_iijii");
d.dynCall_diiid = J("dynCall_diiid");
d.dynCall_iidi = J("dynCall_iidi");
d.dynCall_jji = J("dynCall_jji");
d.dynCall_iji = J("dynCall_iji");
d.dynCall_jiji = J("dynCall_jiji");
d.dynCall_viij = J("dynCall_viij");
d.dynCall_iid = J("dynCall_iid");
d.dynCall_iiiid = J("dynCall_iiiid");
d.dynCall_iiddddi = J("dynCall_iiddddi");
d.dynCall_iiddddddddi = J("dynCall_iiddddddddi");
d.dynCall_ddd = J("dynCall_ddd");
d.dynCall_iijj = J("dynCall_iijj");
d.dynCall_iiiijj = J("dynCall_iiiijj");
d.dynCall_iiiji = J("dynCall_iiiji");
d.dynCall_fdii = J("dynCall_fdii");
d.dynCall_iddii = J("dynCall_iddii");
d.dynCall_iijjjjjj = J("dynCall_iijjjjjj");
d.dynCall_viiiiiiii = J("dynCall_viiiiiiii");
var dynCall_v = d.dynCall_v = J("dynCall_v");
d.dynCall_viiiiiiiiijiiii = J("dynCall_viiiiiiiiijiiii");
d.dynCall_iiiiiiiiiiiiiiii = J("dynCall_iiiiiiiiiiiiiiii");
d.dynCall_id = J("dynCall_id");
d.dynCall_dd = J("dynCall_dd");
d.dynCall_fdd = J("dynCall_fdd");
d.dynCall_iiiij = J("dynCall_iiiij");
d.dynCall_iiiiijiiii = J("dynCall_iiiiijiiii");
d.dynCall_iiijii = J("dynCall_iiijii");
d.dynCall_iiiijiiii = J("dynCall_iiiijiiii");
d.dynCall_iidiiii = J("dynCall_iidiiii");
function bc(a, b) {
  var c = Y();
  try {
    dynCall_vi(a, b);
  } catch (e) {
    Z(c);
    if (e !== e + 0) {
      throw e;
    }
    W(1, 0);
  }
}
function Ub(a, b) {
  var c = Y();
  try {
    return lc(a, b);
  } catch (e) {
    Z(c);
    if (e !== e + 0) {
      throw e;
    }
    W(1, 0);
  }
}
function cc(a, b, c) {
  var e = Y();
  try {
    dynCall_vii(a, b, c);
  } catch (f) {
    Z(e);
    if (f !== f + 0) {
      throw f;
    }
    W(1, 0);
  }
}
function Vb(a, b, c) {
  var e = Y();
  try {
    return dynCall_iii(a, b, c);
  } catch (f) {
    Z(e);
    if (f !== f + 0) {
      throw f;
    }
    W(1, 0);
  }
}
function dc(a, b, c, e) {
  var f = Y();
  try {
    qc(a, b, c, e);
  } catch (g) {
    Z(f);
    if (g !== g + 0) {
      throw g;
    }
    W(1, 0);
  }
}
function Wb(a, b, c, e) {
  var f = Y();
  try {
    return pc(a, b, c, e);
  } catch (g) {
    Z(f);
    if (g !== g + 0) {
      throw g;
    }
    W(1, 0);
  }
}
function ec(a, b, c, e, f) {
  var g = Y();
  try {
    nc(a, b, c, e, f);
  } catch (h) {
    Z(g);
    if (h !== h + 0) {
      throw h;
    }
    W(1, 0);
  }
}
function Yb(a, b, c, e, f, g, h, m) {
  var q = Y();
  try {
    return mc(a, b, c, e, f, g, h, m);
  } catch (t) {
    Z(q);
    if (t !== t + 0) {
      throw t;
    }
    W(1, 0);
  }
}
function $b(a, b, c, e) {
  var f = Y();
  try {
    return sc(a, b, c, e);
  } catch (g) {
    Z(f);
    if (g !== g + 0) {
      throw g;
    }
    W(1, 0);
  }
}
function Xb(a, b, c, e, f) {
  var g = Y();
  try {
    return oc(a, b, c, e, f);
  } catch (h) {
    Z(g);
    if (h !== h + 0) {
      throw h;
    }
    W(1, 0);
  }
}
function fc(a, b, c, e, f, g) {
  var h = Y();
  try {
    tc(a, b, c, e, f, g);
  } catch (m) {
    Z(h);
    if (m !== m + 0) {
      throw m;
    }
    W(1, 0);
  }
}
function hc(a, b, c, e, f, g, h, m, q, t) {
  var r = Y();
  try {
    vc(a, b, c, e, f, g, h, m, q, t);
  } catch (x) {
    Z(r);
    if (x !== x + 0) {
      throw x;
    }
    W(1, 0);
  }
}
function gc(a, b, c, e, f, g, h) {
  var m = Y();
  try {
    uc(a, b, c, e, f, g, h);
  } catch (q) {
    Z(m);
    if (q !== q + 0) {
      throw q;
    }
    W(1, 0);
  }
}
function Zb(a, b, c, e, f, g, h, m, q) {
  var t = Y();
  try {
    return rc(a, b, c, e, f, g, h, m, q);
  } catch (r) {
    Z(t);
    if (r !== r + 0) {
      throw r;
    }
    W(1, 0);
  }
}
function ac(a) {
  var b = Y();
  try {
    dynCall_v(a);
  } catch (c) {
    Z(b);
    if (c !== c + 0) {
      throw c;
    }
    W(1, 0);
  }
}
d.callMain = wc;
d.ENV = Fb;
d.FS = P;
d.NODEFS = S;
d.WORKERFS = T;
"run UTF8ArrayToString UTF8ToString stringToUTF8Array stringToUTF8 lengthBytesUTF8 addOnPreRun addOnInit addOnPreMain addOnExit addOnPostRun addRunDependency removeRunDependency FS_createFolder FS_createPath FS_createDataFile FS_createPreloadedFile FS_createLazyFile FS_createLink FS_createDevice FS_unlink getLEB getFunctionTables alignFunctionTables registerFunctions prettyPrint getCompilerSetting out err abort keepRuntimeAlive wasmMemory stackAlloc stackSave stackRestore getTempRet0 setTempRet0 writeStackCookie checkStackCookie ptrToString zeroMemory stringToNewUTF8 exitJS getHeapMax emscripten_realloc_buffer ERRNO_CODES ERRNO_MESSAGES setErrNo inetPton4 inetNtop4 inetPton6 inetNtop6 readSockaddr writeSockaddr DNS getHostByName Protocols Sockets getRandomDevice warnOnce traverseStack UNWIND_CACHE convertPCtoSourceLocation readEmAsmArgsArray readEmAsmArgs runEmAsmFunction runMainThreadEmAsm jstoi_q jstoi_s getExecutableName listenOnce autoResumeAudioContext dynCallLegacy getDynCaller dynCall handleException runtimeKeepalivePush runtimeKeepalivePop callUserCallback maybeExit safeSetTimeout asmjsMangle asyncLoad alignMemory mmapAlloc writeI53ToI64 writeI53ToI64Clamped writeI53ToI64Signaling writeI53ToU64Clamped writeI53ToU64Signaling readI53FromI64 readI53FromU64 convertI32PairToI53 convertI32PairToI53Checked convertU32PairToI53 MAX_INT53 MIN_INT53 bigintToI53Checked getCFunc ccall cwrap uleb128Encode sigToWasmTypes generateFuncType convertJsFunctionToWasm freeTableIndexes functionsInTableMap getEmptyTableSlot updateTableMap addFunction removeFunction reallyNegative unSign strLen reSign formatString setValue getValue PATH PATH_FS intArrayFromString intArrayToString AsciiToString stringToAscii UTF16Decoder UTF16ToString stringToUTF16 lengthBytesUTF16 UTF32ToString stringToUTF32 lengthBytesUTF32 allocateUTF8 allocateUTF8OnStack writeStringToMemory writeArrayToMemory writeAsciiToMemory SYSCALLS getSocketFromFD getSocketAddress JSEvents registerKeyEventCallback specialHTMLTargets maybeCStringToJsString findEventTarget findCanvasEventTarget getBoundingClientRect fillMouseEventData registerMouseEventCallback registerWheelEventCallback registerUiEventCallback registerFocusEventCallback fillDeviceOrientationEventData registerDeviceOrientationEventCallback fillDeviceMotionEventData registerDeviceMotionEventCallback screenOrientation fillOrientationChangeEventData registerOrientationChangeEventCallback fillFullscreenChangeEventData registerFullscreenChangeEventCallback JSEvents_requestFullscreen JSEvents_resizeCanvasForFullscreen registerRestoreOldStyle hideEverythingExceptGivenElement restoreHiddenElements setLetterbox currentFullscreenStrategy restoreOldWindowedStyle softFullscreenResizeWebGLRenderTarget doRequestFullscreen fillPointerlockChangeEventData registerPointerlockChangeEventCallback registerPointerlockErrorEventCallback requestPointerLock fillVisibilityChangeEventData registerVisibilityChangeEventCallback registerTouchEventCallback fillGamepadEventData registerGamepadEventCallback registerBeforeUnloadEventCallback fillBatteryEventData battery registerBatteryEventCallback setCanvasElementSize getCanvasElementSize demangle demangleAll jsStackTrace stackTrace ExitStatus getEnvStrings checkWasiClock doReadv doWritev dlopenMissingError createDyncallWrapper setImmediateWrapped clearImmediateWrapped polyfillSetImmediate uncaughtExceptionCount exceptionLast exceptionCaught ExceptionInfo exception_addRef exception_decRef getExceptionMessageCommon incrementExceptionRefcount decrementExceptionRefcount getExceptionMessage Browser setMainLoop wget MEMFS TTY PIPEFS SOCKFS _setNetworkCallback tempFixedLengthArray miniTempWebGLFloatBuffers heapObjectForWebGLType heapAccessShiftForWebGLHeap GL emscriptenWebGLGet computeUnpackAlignedImageSize emscriptenWebGLGetTexPixelData emscriptenWebGLGetUniform webglGetUniformLocation webglPrepareUniformLocationsBeforeFirstUse webglGetLeftBracePos emscriptenWebGLGetVertexAttrib writeGLArray AL SDL_unicode SDL_ttfContext SDL_audio SDL SDL_gfx GLUT EGL GLFW_Window GLFW GLEW IDBStore runAndAbortIfError ALLOC_NORMAL ALLOC_STACK allocate".split(" ").forEach(function(a) {
  Object.getOwnPropertyDescriptor(d, a) || Object.defineProperty(d, a, {configurable:!0, get:function() {
    var b = "'" + a + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";
    ra(a) && (b += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you");
    k(b);
  }});
});
"stringToNewUTF8 inetPton4 inetNtop4 inetPton6 inetNtop6 readSockaddr writeSockaddr getHostByName traverseStack convertPCtoSourceLocation readEmAsmArgs runEmAsmFunction runMainThreadEmAsm jstoi_q jstoi_s listenOnce autoResumeAudioContext dynCallLegacy getDynCaller dynCall runtimeKeepalivePush runtimeKeepalivePop callUserCallback maybeExit safeSetTimeout asmjsMangle writeI53ToI64 writeI53ToI64Clamped writeI53ToI64Signaling writeI53ToU64Clamped writeI53ToU64Signaling readI53FromU64 convertI32PairToI53 convertI32PairToI53Checked convertU32PairToI53 getCFunc ccall cwrap uleb128Encode sigToWasmTypes generateFuncType convertJsFunctionToWasm getEmptyTableSlot updateTableMap addFunction removeFunction reallyNegative unSign strLen reSign formatString intArrayToString AsciiToString stringToAscii UTF16ToString stringToUTF16 lengthBytesUTF16 UTF32ToString stringToUTF32 lengthBytesUTF32 writeStringToMemory getSocketFromFD getSocketAddress registerKeyEventCallback maybeCStringToJsString findEventTarget findCanvasEventTarget getBoundingClientRect fillMouseEventData registerMouseEventCallback registerWheelEventCallback registerUiEventCallback registerFocusEventCallback fillDeviceOrientationEventData registerDeviceOrientationEventCallback fillDeviceMotionEventData registerDeviceMotionEventCallback screenOrientation fillOrientationChangeEventData registerOrientationChangeEventCallback fillFullscreenChangeEventData registerFullscreenChangeEventCallback JSEvents_requestFullscreen JSEvents_resizeCanvasForFullscreen registerRestoreOldStyle hideEverythingExceptGivenElement restoreHiddenElements setLetterbox softFullscreenResizeWebGLRenderTarget doRequestFullscreen fillPointerlockChangeEventData registerPointerlockChangeEventCallback registerPointerlockErrorEventCallback requestPointerLock fillVisibilityChangeEventData registerVisibilityChangeEventCallback registerTouchEventCallback fillGamepadEventData registerGamepadEventCallback registerBeforeUnloadEventCallback fillBatteryEventData battery registerBatteryEventCallback setCanvasElementSize getCanvasElementSize jsStackTrace stackTrace checkWasiClock createDyncallWrapper setImmediateWrapped clearImmediateWrapped polyfillSetImmediate ExceptionInfo exception_addRef exception_decRef getExceptionMessageCommon incrementExceptionRefcount decrementExceptionRefcount getExceptionMessage setMainLoop _setNetworkCallback heapObjectForWebGLType heapAccessShiftForWebGLHeap emscriptenWebGLGet computeUnpackAlignedImageSize emscriptenWebGLGetTexPixelData emscriptenWebGLGetUniform webglGetUniformLocation webglPrepareUniformLocationsBeforeFirstUse webglGetLeftBracePos emscriptenWebGLGetVertexAttrib writeGLArray SDL_unicode SDL_ttfContext SDL_audio GLFW_Window runAndAbortIfError ALLOC_NORMAL ALLOC_STACK allocate".split(" ").forEach(function(a) {
  "undefined" === typeof globalThis || Object.getOwnPropertyDescriptor(globalThis, a) || Object.defineProperty(globalThis, a, {configurable:!0, get:function() {
    var b = "`" + a + "` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line", c = a;
    c.startsWith("_") || (c = "$" + a);
    b += " (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE=" + c + ")";
    ra(a) && (b += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you");
    xa(b);
  }});
});
var xc;
Qa = function yc() {
  xc || zc();
  xc || (Qa = yc);
};
function wc(a) {
  assert(0 == Pa, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(0 == Ka.length, "cannot call main when preRun functions remain to be called");
  var b = d._main;
  a = a || [];
  a.unshift(ea);
  var c = a.length, e = kc(4 * (c + 1)), f = e >> 2;
  a.forEach(h => {
    var m = E, q = f++, t = Ba(h) + 1, r = kc(t);
    Aa(h, D, r, t);
    m[q] = r;
  });
  E[f] = 0;
  try {
    var g = b(c, e);
    Ib(g, !0);
    return g;
  } catch (h) {
    return Pb(h);
  }
}
function zc() {
  var a = a || da;
  if (!(0 < Pa)) {
    jc();
    var b = Ha();
    assert(0 == (b & 3));
    0 == b && (b += 4);
    G[b >> 2] = 34821223;
    G[b + 4 >> 2] = 2310721022;
    G[0] = 1668509029;
    if (d.preRun) {
      for ("function" == typeof d.preRun && (d.preRun = [d.preRun]); d.preRun.length;) {
        b = d.preRun.shift(), Ka.unshift(b);
      }
    }
    Za(Ka);
    0 < Pa || (xc || (xc = !0, d.calledRun = !0, ta || (assert(!Oa), Oa = !0, Ga(), d.noFSInit || P.fa.wa || P.fa(), P.mb = !1, V.root = P.m(V, {}, null), Za(La), Ga(), Za(Ma), aa(d), Ac && wc(a), Ga(), Za(Na))), Ga());
  }
}
function Jb() {
  var a = w, b = v, c = !1;
  w = v = () => {
    c = !0;
  };
  try {
    sb(0), ["stdout", "stderr"].forEach(function(e) {
      (e = P.na("/dev/" + e)) && (e = ib[e.object.rdev]) && e.output && e.output.length && (c = !0);
    });
  } catch (e) {
  }
  w = a;
  v = b;
  c && xa("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.");
}
var Ac = !0;
d.noInitialRun && (Ac = !1);
zc();
Object.assign(P, {makedev:P.U, registerDevice:P.Ba, init:P.fa, mount:P.m, unmount:P.dc, syncfs:P.Ua, mkdir:P.mkdir, mkdev:P.pa, symlink:P.symlink, rename:P.rename, rmdir:P.rmdir, unlink:P.unlink, readlink:P.readlink, stat:P.stat, lstat:P.lstat, chmod:P.chmod, lchmod:P.lchmod, fchmod:P.fchmod, chown:P.chown, lchown:P.lchown, fchown:P.fchown, truncate:P.truncate, ftruncate:P.Kb, utime:P.ec, open:P.open, close:P.close, llseek:P.C, read:P.read, write:P.write, readFile:P.readFile, writeFile:P.writeFile, 
createLazyFile:P.Bb, createPreloadedFile:P.Db, trackingDelegate:P.zc, isFile:P.isFile, isDir:P.u, isLink:P.R, isChrdev:P.ga, isBlkdev:P.nb, isSocket:P.isSocket, cwd:P.cwd, chdir:P.chdir, readdir:P.readdir, lookupPath:P.o, analyzePath:P.na, getPath:P.P,});



  return Module.ready
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return Module; });
else if (typeof exports === 'object')
  exports["Module"] = Module;
