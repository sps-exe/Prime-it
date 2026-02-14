var P$ = Object.defineProperty;
var Jf = (e) => {
  throw TypeError(e);
};
var T$ = (e, t, r) => t in e ? P$(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Mr = (e, t, r) => T$(e, typeof t != "symbol" ? t + "" : t, r), Ec = (e, t, r) => t.has(e) || Jf("Cannot " + r);
var ie = (e, t, r) => (Ec(e, t, "read from private field"), r ? r.call(e) : t.get(e)), sr = (e, t, r) => t.has(e) ? Jf("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), At = (e, t, r, n) => (Ec(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), br = (e, t, r) => (Ec(e, t, "access private method"), r);
import Rr, { ipcMain as ur, screen as Qf, shell as N$, app as oa, BrowserWindow as oy } from "electron";
import { fileURLToPath as O$ } from "node:url";
import ue from "node:path";
import Ne from "node:process";
import { promisify as Ze, isDeepStrictEqual as Zf } from "node:util";
import se from "node:fs";
import En from "node:crypto";
import eh from "node:assert";
import ay from "node:os";
import "node:events";
import "node:stream";
import hn from "fs";
import A$ from "constants";
import xs from "stream";
import su from "util";
import cy from "assert";
import Ce from "path";
import Ca from "child_process";
import ly from "events";
import Vs from "crypto";
import uy from "tty";
import Ia from "os";
import pn from "url";
import dy from "zlib";
import R$ from "http";
const Vn = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, fy = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), hy = 1e6, C$ = (e) => e >= "0" && e <= "9";
function py(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= hy;
  }
  return !1;
}
function bc(e, t) {
  return fy.has(e) ? !1 : (e && py(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function I$(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", i = !1, s = 0;
  for (const o of e) {
    if (s++, i) {
      r += o, i = !1;
      continue;
    }
    if (o === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${o}' in an index at position ${s}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${o}' after an index at position ${s}`);
      i = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (o) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${s}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!bc(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${s}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !bc(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const a = Number.parseInt(r, 10);
            !Number.isNaN(a) && Number.isFinite(a) && a >= 0 && a <= Number.MAX_SAFE_INTEGER && a <= hy && r === String(a) ? t.push(a) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${s}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !C$(o))
          throw new Error(`Invalid character '${o}' in an index at position ${s}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${s}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (i && (r += "\\"), n) {
    case "property": {
      if (!bc(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function Da(e) {
  if (typeof e == "string")
    return I$(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (fy.has(n))
        return [];
      typeof n == "string" && py(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function th(e, t, r) {
  if (!Vn(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = Da(t);
  if (n.length === 0)
    return r;
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    if (e = e[s], e == null) {
      if (i !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function fo(e, t, r) {
  if (!Vn(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, i = Da(t);
  if (i.length === 0)
    return e;
  for (let s = 0; s < i.length; s++) {
    const o = i[s];
    if (s === i.length - 1)
      e[o] = r;
    else if (!Vn(e[o])) {
      const c = typeof i[s + 1] == "number";
      e[o] = c ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function D$(e, t) {
  if (!Vn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Da(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const i = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, i) ? (delete e[i], !0) : !1;
    if (e = e[i], !Vn(e))
      return !1;
  }
}
function Sc(e, t) {
  if (!Vn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Da(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!Vn(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Jr = ay.homedir(), ou = ay.tmpdir(), { env: ui } = Ne, k$ = (e) => {
  const t = ue.join(Jr, "Library");
  return {
    data: ue.join(t, "Application Support", e),
    config: ue.join(t, "Preferences", e),
    cache: ue.join(t, "Caches", e),
    log: ue.join(t, "Logs", e),
    temp: ue.join(ou, e)
  };
}, F$ = (e) => {
  const t = ui.APPDATA || ue.join(Jr, "AppData", "Roaming"), r = ui.LOCALAPPDATA || ue.join(Jr, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ue.join(r, e, "Data"),
    config: ue.join(t, e, "Config"),
    cache: ue.join(r, e, "Cache"),
    log: ue.join(r, e, "Log"),
    temp: ue.join(ou, e)
  };
}, j$ = (e) => {
  const t = ue.basename(Jr);
  return {
    data: ue.join(ui.XDG_DATA_HOME || ue.join(Jr, ".local", "share"), e),
    config: ue.join(ui.XDG_CONFIG_HOME || ue.join(Jr, ".config"), e),
    cache: ue.join(ui.XDG_CACHE_HOME || ue.join(Jr, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ue.join(ui.XDG_STATE_HOME || ue.join(Jr, ".local", "state"), e),
    temp: ue.join(ou, t, e)
  };
};
function U$(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), Ne.platform === "darwin" ? k$(e) : Ne.platform === "win32" ? F$(e) : j$(e);
}
const Lr = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    return e.apply(void 0, i).catch(r);
  };
}, Sr = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    try {
      return e.apply(void 0, i);
    } catch (s) {
      return r(s);
    }
  };
}, M$ = 250, xr = (e, t) => {
  const { isRetriable: r } = t;
  return function(i) {
    const { timeout: s } = i, o = i.interval ?? M$, a = Date.now() + s;
    return function c(...u) {
      return e.apply(void 0, u).catch((l) => {
        if (!r(l) || Date.now() >= a)
          throw l;
        const d = Math.round(o * Math.random());
        return d > 0 ? new Promise((p) => setTimeout(p, d)).then(() => c.apply(void 0, u)) : c.apply(void 0, u);
      });
    };
  };
}, Vr = (e, t) => {
  const { isRetriable: r } = t;
  return function(i) {
    const { timeout: s } = i, o = Date.now() + s;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (u) {
          if (!r(u) || Date.now() >= o)
            throw u;
          continue;
        }
    };
  };
}, di = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!di.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !L$ && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!di.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!di.isNodeError(e))
      throw e;
    if (!di.isChangeErrorOk(e))
      throw e;
  }
}, ho = {
  onError: di.onChangeError
}, Rt = {
  onError: () => {
  }
}, L$ = Ne.getuid ? !Ne.getuid() : !1, et = {
  isRetriable: di.isRetriableError
}, nt = {
  attempt: {
    /* ASYNC */
    chmod: Lr(Ze(se.chmod), ho),
    chown: Lr(Ze(se.chown), ho),
    close: Lr(Ze(se.close), Rt),
    fsync: Lr(Ze(se.fsync), Rt),
    mkdir: Lr(Ze(se.mkdir), Rt),
    realpath: Lr(Ze(se.realpath), Rt),
    stat: Lr(Ze(se.stat), Rt),
    unlink: Lr(Ze(se.unlink), Rt),
    /* SYNC */
    chmodSync: Sr(se.chmodSync, ho),
    chownSync: Sr(se.chownSync, ho),
    closeSync: Sr(se.closeSync, Rt),
    existsSync: Sr(se.existsSync, Rt),
    fsyncSync: Sr(se.fsync, Rt),
    mkdirSync: Sr(se.mkdirSync, Rt),
    realpathSync: Sr(se.realpathSync, Rt),
    statSync: Sr(se.statSync, Rt),
    unlinkSync: Sr(se.unlinkSync, Rt)
  },
  retry: {
    /* ASYNC */
    close: xr(Ze(se.close), et),
    fsync: xr(Ze(se.fsync), et),
    open: xr(Ze(se.open), et),
    readFile: xr(Ze(se.readFile), et),
    rename: xr(Ze(se.rename), et),
    stat: xr(Ze(se.stat), et),
    write: xr(Ze(se.write), et),
    writeFile: xr(Ze(se.writeFile), et),
    /* SYNC */
    closeSync: Vr(se.closeSync, et),
    fsyncSync: Vr(se.fsyncSync, et),
    openSync: Vr(se.openSync, et),
    readFileSync: Vr(se.readFileSync, et),
    renameSync: Vr(se.renameSync, et),
    statSync: Vr(se.statSync, et),
    writeSync: Vr(se.writeSync, et),
    writeFileSync: Vr(se.writeFileSync, et)
  }
}, x$ = "utf8", rh = 438, V$ = 511, q$ = {}, B$ = Ne.geteuid ? Ne.geteuid() : -1, H$ = Ne.getegid ? Ne.getegid() : -1, z$ = 1e3, G$ = !!Ne.getuid;
Ne.getuid && Ne.getuid();
const nh = 128, W$ = (e) => e instanceof Error && "code" in e, ih = (e) => typeof e == "string", Pc = (e) => e === void 0, K$ = Ne.platform === "linux", my = Ne.platform === "win32", au = ["SIGHUP", "SIGINT", "SIGTERM"];
my || au.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
K$ && au.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
let Y$ = class {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (my && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? Ne.kill(Ne.pid, "SIGTERM") : Ne.kill(Ne.pid, t));
      }
    }, this.hook = () => {
      Ne.once("exit", () => this.exit());
      for (const t of au)
        try {
          Ne.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
};
const X$ = new Y$(), J$ = X$.register, it = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), i = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${i}`;
  },
  get: (e, t, r = !0) => {
    const n = it.truncate(t(e));
    return n in it.store ? it.get(e, t, r) : (it.store[n] = r, [n, () => delete it.store[n]]);
  },
  purge: (e) => {
    it.store[e] && (delete it.store[e], nt.attempt.unlink(e));
  },
  purgeSync: (e) => {
    it.store[e] && (delete it.store[e], nt.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in it.store)
      it.purgeSync(e);
  },
  truncate: (e) => {
    const t = ue.basename(e);
    if (t.length <= nh)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - nh;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
J$(it.purgeSyncAll);
function yy(e, t, r = q$) {
  if (ih(r))
    return yy(e, t, { encoding: r });
  const i = { timeout: r.timeout ?? z$ };
  let s = null, o = null, a = null;
  try {
    const c = nt.attempt.realpathSync(e), u = !!c;
    e = c || e, [o, s] = it.get(e, r.tmpCreate || it.create, r.tmpPurge !== !1);
    const l = G$ && Pc(r.chown), d = Pc(r.mode);
    if (u && (l || d)) {
      const h = nt.attempt.statSync(e);
      h && (r = { ...r }, l && (r.chown = { uid: h.uid, gid: h.gid }), d && (r.mode = h.mode));
    }
    if (!u) {
      const h = ue.dirname(e);
      nt.attempt.mkdirSync(h, {
        mode: V$,
        recursive: !0
      });
    }
    a = nt.retry.openSync(i)(o, "w", r.mode || rh), r.tmpCreated && r.tmpCreated(o), ih(t) ? nt.retry.writeSync(i)(a, t, 0, r.encoding || x$) : Pc(t) || nt.retry.writeSync(i)(a, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? nt.retry.fsyncSync(i)(a) : nt.attempt.fsync(a)), nt.retry.closeSync(i)(a), a = null, r.chown && (r.chown.uid !== B$ || r.chown.gid !== H$) && nt.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== rh && nt.attempt.chmodSync(o, r.mode);
    try {
      nt.retry.renameSync(i)(o, e);
    } catch (h) {
      if (!W$(h) || h.code !== "ENAMETOOLONG")
        throw h;
      nt.retry.renameSync(i)(o, it.truncate(e));
    }
    s(), o = null;
  } finally {
    a && nt.attempt.closeSync(a), o && it.purge(o);
  }
}
var ft = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function gy(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Sl = { exports: {} }, _y = {}, Zt = {}, Pi = {}, qs = {}, Tc = {}, Nc = {}, sh;
function aa() {
  return sh || (sh = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class t {
    }
    e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class r extends t {
      constructor(E) {
        if (super(), !e.IDENTIFIER.test(E))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = E;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = r;
    class n extends t {
      constructor(E) {
        super(), this._items = typeof E == "string" ? [E] : E;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const E = this._items[0];
        return E === "" || E === '""';
      }
      get str() {
        var E;
        return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((A, I) => `${A}${I}`, "");
      }
      get names() {
        var E;
        return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((A, I) => (I instanceof r && (A[I.str] = (A[I.str] || 0) + 1), A), {});
      }
    }
    e._Code = n, e.nil = new n("");
    function i(m, ...E) {
      const A = [m[0]];
      let I = 0;
      for (; I < E.length; )
        a(A, E[I]), A.push(m[++I]);
      return new n(A);
    }
    e._ = i;
    const s = new n("+");
    function o(m, ...E) {
      const A = [p(m[0])];
      let I = 0;
      for (; I < E.length; )
        A.push(s), a(A, E[I]), A.push(s, p(m[++I]));
      return c(A), new n(A);
    }
    e.str = o;
    function a(m, E) {
      E instanceof n ? m.push(...E._items) : E instanceof r ? m.push(E) : m.push(d(E));
    }
    e.addCodeArg = a;
    function c(m) {
      let E = 1;
      for (; E < m.length - 1; ) {
        if (m[E] === s) {
          const A = u(m[E - 1], m[E + 1]);
          if (A !== void 0) {
            m.splice(E - 1, 3, A);
            continue;
          }
          m[E++] = "+";
        }
        E++;
      }
    }
    function u(m, E) {
      if (E === '""')
        return m;
      if (m === '""')
        return E;
      if (typeof m == "string")
        return E instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${m.slice(0, -1)}${E}"` : E[0] === '"' ? m.slice(0, -1) + E.slice(1) : void 0;
      if (typeof E == "string" && E[0] === '"' && !(m instanceof r))
        return `"${m}${E.slice(1)}`;
    }
    function l(m, E) {
      return E.emptyStr() ? m : m.emptyStr() ? E : o`${m}${E}`;
    }
    e.strConcat = l;
    function d(m) {
      return typeof m == "number" || typeof m == "boolean" || m === null ? m : p(Array.isArray(m) ? m.join(",") : m);
    }
    function h(m) {
      return new n(p(m));
    }
    e.stringify = h;
    function p(m) {
      return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = p;
    function $(m) {
      return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : i`[${m}]`;
    }
    e.getProperty = $;
    function _(m) {
      if (typeof m == "string" && e.IDENTIFIER.test(m))
        return new n(`${m}`);
      throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
    }
    e.getEsmExportName = _;
    function v(m) {
      return new n(m.toString());
    }
    e.regexpCode = v;
  }(Nc)), Nc;
}
var Oc = {}, oh;
function ah() {
  return oh || (oh = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const t = aa();
    class r extends Error {
      constructor(u) {
        super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
      }
    }
    var n;
    (function(c) {
      c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
    })(n || (e.UsedValueState = n = {})), e.varKinds = {
      const: new t.Name("const"),
      let: new t.Name("let"),
      var: new t.Name("var")
    };
    class i {
      constructor({ prefixes: u, parent: l } = {}) {
        this._names = {}, this._prefixes = u, this._parent = l;
      }
      toName(u) {
        return u instanceof t.Name ? u : this.name(u);
      }
      name(u) {
        return new t.Name(this._newName(u));
      }
      _newName(u) {
        const l = this._names[u] || this._nameGroup(u);
        return `${u}${l.index++}`;
      }
      _nameGroup(u) {
        var l, d;
        if (!((d = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || d === void 0) && d.has(u) || this._prefixes && !this._prefixes.has(u))
          throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
        return this._names[u] = { prefix: u, index: 0 };
      }
    }
    e.Scope = i;
    class s extends t.Name {
      constructor(u, l) {
        super(l), this.prefix = u;
      }
      setValue(u, { property: l, itemIndex: d }) {
        this.value = u, this.scopePath = (0, t._)`.${new t.Name(l)}[${d}]`;
      }
    }
    e.ValueScopeName = s;
    const o = (0, t._)`\n`;
    class a extends i {
      constructor(u) {
        super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? o : t.nil };
      }
      get() {
        return this._scope;
      }
      name(u) {
        return new s(u, this._newName(u));
      }
      value(u, l) {
        var d;
        if (l.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const h = this.toName(u), { prefix: p } = h, $ = (d = l.key) !== null && d !== void 0 ? d : l.ref;
        let _ = this._values[p];
        if (_) {
          const E = _.get($);
          if (E)
            return E;
        } else
          _ = this._values[p] = /* @__PURE__ */ new Map();
        _.set($, h);
        const v = this._scope[p] || (this._scope[p] = []), m = v.length;
        return v[m] = l.ref, h.setValue(l, { property: p, itemIndex: m }), h;
      }
      getValue(u, l) {
        const d = this._values[u];
        if (d)
          return d.get(l);
      }
      scopeRefs(u, l = this._values) {
        return this._reduceValues(l, (d) => {
          if (d.scopePath === void 0)
            throw new Error(`CodeGen: name "${d}" has no value`);
          return (0, t._)`${u}${d.scopePath}`;
        });
      }
      scopeCode(u = this._values, l, d) {
        return this._reduceValues(u, (h) => {
          if (h.value === void 0)
            throw new Error(`CodeGen: name "${h}" has no value`);
          return h.value.code;
        }, l, d);
      }
      _reduceValues(u, l, d = {}, h) {
        let p = t.nil;
        for (const $ in u) {
          const _ = u[$];
          if (!_)
            continue;
          const v = d[$] = d[$] || /* @__PURE__ */ new Map();
          _.forEach((m) => {
            if (v.has(m))
              return;
            v.set(m, n.Started);
            let E = l(m);
            if (E) {
              const A = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              p = (0, t._)`${p}${A} ${m} = ${E};${this.opts._n}`;
            } else if (E = h == null ? void 0 : h(m))
              p = (0, t._)`${p}${E}${this.opts._n}`;
            else
              throw new r(m);
            v.set(m, n.Completed);
          });
        }
        return p;
      }
    }
    e.ValueScope = a;
  }(Oc)), Oc;
}
var ch;
function le() {
  return ch || (ch = 1, function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const t = aa(), r = ah();
    var n = aa();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return n._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return n.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return n.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return n.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return n.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return n.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return n.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return n.Name;
    } });
    var i = ah();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return i.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return i.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return i.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return i.varKinds;
    } }), e.operators = {
      GT: new t._Code(">"),
      GTE: new t._Code(">="),
      LT: new t._Code("<"),
      LTE: new t._Code("<="),
      EQ: new t._Code("==="),
      NEQ: new t._Code("!=="),
      NOT: new t._Code("!"),
      OR: new t._Code("||"),
      AND: new t._Code("&&"),
      ADD: new t._Code("+")
    };
    class s {
      optimizeNodes() {
        return this;
      }
      optimizeNames(f, g) {
        return this;
      }
    }
    class o extends s {
      constructor(f, g, T) {
        super(), this.varKind = f, this.name = g, this.rhs = T;
      }
      render({ es5: f, _n: g }) {
        const T = f ? r.varKinds.var : this.varKind, w = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${T} ${this.name}${w};` + g;
      }
      optimizeNames(f, g) {
        if (f[this.name.str])
          return this.rhs && (this.rhs = j(this.rhs, f, g)), this;
      }
      get names() {
        return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
      }
    }
    class a extends s {
      constructor(f, g, T) {
        super(), this.lhs = f, this.rhs = g, this.sideEffects = T;
      }
      render({ _n: f }) {
        return `${this.lhs} = ${this.rhs};` + f;
      }
      optimizeNames(f, g) {
        if (!(this.lhs instanceof t.Name && !f[this.lhs.str] && !this.sideEffects))
          return this.rhs = j(this.rhs, f, g), this;
      }
      get names() {
        const f = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
        return J(f, this.rhs);
      }
    }
    class c extends a {
      constructor(f, g, T, w) {
        super(f, T, w), this.op = g;
      }
      render({ _n: f }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + f;
      }
    }
    class u extends s {
      constructor(f) {
        super(), this.label = f, this.names = {};
      }
      render({ _n: f }) {
        return `${this.label}:` + f;
      }
    }
    class l extends s {
      constructor(f) {
        super(), this.label = f, this.names = {};
      }
      render({ _n: f }) {
        return `break${this.label ? ` ${this.label}` : ""};` + f;
      }
    }
    class d extends s {
      constructor(f) {
        super(), this.error = f;
      }
      render({ _n: f }) {
        return `throw ${this.error};` + f;
      }
      get names() {
        return this.error.names;
      }
    }
    class h extends s {
      constructor(f) {
        super(), this.code = f;
      }
      render({ _n: f }) {
        return `${this.code};` + f;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(f, g) {
        return this.code = j(this.code, f, g), this;
      }
      get names() {
        return this.code instanceof t._CodeOrName ? this.code.names : {};
      }
    }
    class p extends s {
      constructor(f = []) {
        super(), this.nodes = f;
      }
      render(f) {
        return this.nodes.reduce((g, T) => g + T.render(f), "");
      }
      optimizeNodes() {
        const { nodes: f } = this;
        let g = f.length;
        for (; g--; ) {
          const T = f[g].optimizeNodes();
          Array.isArray(T) ? f.splice(g, 1, ...T) : T ? f[g] = T : f.splice(g, 1);
        }
        return f.length > 0 ? this : void 0;
      }
      optimizeNames(f, g) {
        const { nodes: T } = this;
        let w = T.length;
        for (; w--; ) {
          const y = T[w];
          y.optimizeNames(f, g) || (U(f, y.names), T.splice(w, 1));
        }
        return T.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((f, g) => q(f, g.names), {});
      }
    }
    class $ extends p {
      render(f) {
        return "{" + f._n + super.render(f) + "}" + f._n;
      }
    }
    class _ extends p {
    }
    class v extends $ {
    }
    v.kind = "else";
    class m extends $ {
      constructor(f, g) {
        super(g), this.condition = f;
      }
      render(f) {
        let g = `if(${this.condition})` + super.render(f);
        return this.else && (g += "else " + this.else.render(f)), g;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const f = this.condition;
        if (f === !0)
          return this.nodes;
        let g = this.else;
        if (g) {
          const T = g.optimizeNodes();
          g = this.else = Array.isArray(T) ? new v(T) : T;
        }
        if (g)
          return f === !1 ? g instanceof m ? g : g.nodes : this.nodes.length ? this : new m(B(f), g instanceof m ? [g] : g.nodes);
        if (!(f === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(f, g) {
        var T;
        if (this.else = (T = this.else) === null || T === void 0 ? void 0 : T.optimizeNames(f, g), !!(super.optimizeNames(f, g) || this.else))
          return this.condition = j(this.condition, f, g), this;
      }
      get names() {
        const f = super.names;
        return J(f, this.condition), this.else && q(f, this.else.names), f;
      }
    }
    m.kind = "if";
    class E extends $ {
    }
    E.kind = "for";
    class A extends E {
      constructor(f) {
        super(), this.iteration = f;
      }
      render(f) {
        return `for(${this.iteration})` + super.render(f);
      }
      optimizeNames(f, g) {
        if (super.optimizeNames(f, g))
          return this.iteration = j(this.iteration, f, g), this;
      }
      get names() {
        return q(super.names, this.iteration.names);
      }
    }
    class I extends E {
      constructor(f, g, T, w) {
        super(), this.varKind = f, this.name = g, this.from = T, this.to = w;
      }
      render(f) {
        const g = f.es5 ? r.varKinds.var : this.varKind, { name: T, from: w, to: y } = this;
        return `for(${g} ${T}=${w}; ${T}<${y}; ${T}++)` + super.render(f);
      }
      get names() {
        const f = J(super.names, this.from);
        return J(f, this.to);
      }
    }
    class F extends E {
      constructor(f, g, T, w) {
        super(), this.loop = f, this.varKind = g, this.name = T, this.iterable = w;
      }
      render(f) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(f);
      }
      optimizeNames(f, g) {
        if (super.optimizeNames(f, g))
          return this.iterable = j(this.iterable, f, g), this;
      }
      get names() {
        return q(super.names, this.iterable.names);
      }
    }
    class z extends $ {
      constructor(f, g, T) {
        super(), this.name = f, this.args = g, this.async = T;
      }
      render(f) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(f);
      }
    }
    z.kind = "func";
    class G extends p {
      render(f) {
        return "return " + super.render(f);
      }
    }
    G.kind = "return";
    class me extends $ {
      render(f) {
        let g = "try" + super.render(f);
        return this.catch && (g += this.catch.render(f)), this.finally && (g += this.finally.render(f)), g;
      }
      optimizeNodes() {
        var f, g;
        return super.optimizeNodes(), (f = this.catch) === null || f === void 0 || f.optimizeNodes(), (g = this.finally) === null || g === void 0 || g.optimizeNodes(), this;
      }
      optimizeNames(f, g) {
        var T, w;
        return super.optimizeNames(f, g), (T = this.catch) === null || T === void 0 || T.optimizeNames(f, g), (w = this.finally) === null || w === void 0 || w.optimizeNames(f, g), this;
      }
      get names() {
        const f = super.names;
        return this.catch && q(f, this.catch.names), this.finally && q(f, this.finally.names), f;
      }
    }
    class R extends $ {
      constructor(f) {
        super(), this.error = f;
      }
      render(f) {
        return `catch(${this.error})` + super.render(f);
      }
    }
    R.kind = "catch";
    class Q extends $ {
      render(f) {
        return "finally" + super.render(f);
      }
    }
    Q.kind = "finally";
    class x {
      constructor(f, g = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...g, _n: g.lines ? `
` : "" }, this._extScope = f, this._scope = new r.Scope({ parent: f }), this._nodes = [new _()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(f) {
        return this._scope.name(f);
      }
      // reserves unique name in the external scope
      scopeName(f) {
        return this._extScope.name(f);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(f, g) {
        const T = this._extScope.value(f, g);
        return (this._values[T.prefix] || (this._values[T.prefix] = /* @__PURE__ */ new Set())).add(T), T;
      }
      getScopeValue(f, g) {
        return this._extScope.getValue(f, g);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(f) {
        return this._extScope.scopeRefs(f, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(f, g, T, w) {
        const y = this._scope.toName(g);
        return T !== void 0 && w && (this._constants[y.str] = T), this._leafNode(new o(f, y, T)), y;
      }
      // `const` declaration (`var` in es5 mode)
      const(f, g, T) {
        return this._def(r.varKinds.const, f, g, T);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(f, g, T) {
        return this._def(r.varKinds.let, f, g, T);
      }
      // `var` declaration with optional assignment
      var(f, g, T) {
        return this._def(r.varKinds.var, f, g, T);
      }
      // assignment code
      assign(f, g, T) {
        return this._leafNode(new a(f, g, T));
      }
      // `+=` code
      add(f, g) {
        return this._leafNode(new c(f, e.operators.ADD, g));
      }
      // appends passed SafeExpr to code or executes Block
      code(f) {
        return typeof f == "function" ? f() : f !== t.nil && this._leafNode(new h(f)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...f) {
        const g = ["{"];
        for (const [T, w] of f)
          g.length > 1 && g.push(","), g.push(T), (T !== w || this.opts.es5) && (g.push(":"), (0, t.addCodeArg)(g, w));
        return g.push("}"), new t._Code(g);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(f, g, T) {
        if (this._blockNode(new m(f)), g && T)
          this.code(g).else().code(T).endIf();
        else if (g)
          this.code(g).endIf();
        else if (T)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(f) {
        return this._elseNode(new m(f));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new v());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(m, v);
      }
      _for(f, g) {
        return this._blockNode(f), g && this.code(g).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(f, g) {
        return this._for(new A(f), g);
      }
      // `for` statement for a range of values
      forRange(f, g, T, w, y = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
        const k = this._scope.toName(f);
        return this._for(new I(y, k, g, T), () => w(k));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(f, g, T, w = r.varKinds.const) {
        const y = this._scope.toName(f);
        if (this.opts.es5) {
          const k = g instanceof t.Name ? g : this.var("_arr", g);
          return this.forRange("_i", 0, (0, t._)`${k}.length`, (O) => {
            this.var(y, (0, t._)`${k}[${O}]`), T(y);
          });
        }
        return this._for(new F("of", w, y, g), () => T(y));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(f, g, T, w = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(f, (0, t._)`Object.keys(${g})`, T);
        const y = this._scope.toName(f);
        return this._for(new F("in", w, y, g), () => T(y));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(E);
      }
      // `label` statement
      label(f) {
        return this._leafNode(new u(f));
      }
      // `break` statement
      break(f) {
        return this._leafNode(new l(f));
      }
      // `return` statement
      return(f) {
        const g = new G();
        if (this._blockNode(g), this.code(f), g.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(G);
      }
      // `try` statement
      try(f, g, T) {
        if (!g && !T)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const w = new me();
        if (this._blockNode(w), this.code(f), g) {
          const y = this.name("e");
          this._currNode = w.catch = new R(y), g(y);
        }
        return T && (this._currNode = w.finally = new Q(), this.code(T)), this._endBlockNode(R, Q);
      }
      // `throw` statement
      throw(f) {
        return this._leafNode(new d(f));
      }
      // start self-balancing block
      block(f, g) {
        return this._blockStarts.push(this._nodes.length), f && this.code(f).endBlock(g), this;
      }
      // end the current self-balancing block
      endBlock(f) {
        const g = this._blockStarts.pop();
        if (g === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const T = this._nodes.length - g;
        if (T < 0 || f !== void 0 && T !== f)
          throw new Error(`CodeGen: wrong number of nodes: ${T} vs ${f} expected`);
        return this._nodes.length = g, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(f, g = t.nil, T, w) {
        return this._blockNode(new z(f, g, T)), w && this.code(w).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(z);
      }
      optimize(f = 1) {
        for (; f-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(f) {
        return this._currNode.nodes.push(f), this;
      }
      _blockNode(f) {
        this._currNode.nodes.push(f), this._nodes.push(f);
      }
      _endBlockNode(f, g) {
        const T = this._currNode;
        if (T instanceof f || g && T instanceof g)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${g ? `${f.kind}/${g.kind}` : f.kind}"`);
      }
      _elseNode(f) {
        const g = this._currNode;
        if (!(g instanceof m))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = g.else = f, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const f = this._nodes;
        return f[f.length - 1];
      }
      set _currNode(f) {
        const g = this._nodes;
        g[g.length - 1] = f;
      }
    }
    e.CodeGen = x;
    function q(S, f) {
      for (const g in f)
        S[g] = (S[g] || 0) + (f[g] || 0);
      return S;
    }
    function J(S, f) {
      return f instanceof t._CodeOrName ? q(S, f.names) : S;
    }
    function j(S, f, g) {
      if (S instanceof t.Name)
        return T(S);
      if (!w(S))
        return S;
      return new t._Code(S._items.reduce((y, k) => (k instanceof t.Name && (k = T(k)), k instanceof t._Code ? y.push(...k._items) : y.push(k), y), []));
      function T(y) {
        const k = g[y.str];
        return k === void 0 || f[y.str] !== 1 ? y : (delete f[y.str], k);
      }
      function w(y) {
        return y instanceof t._Code && y._items.some((k) => k instanceof t.Name && f[k.str] === 1 && g[k.str] !== void 0);
      }
    }
    function U(S, f) {
      for (const g in f)
        S[g] = (S[g] || 0) - (f[g] || 0);
    }
    function B(S) {
      return typeof S == "boolean" || typeof S == "number" || S === null ? !S : (0, t._)`!${N(S)}`;
    }
    e.not = B;
    const M = b(e.operators.AND);
    function H(...S) {
      return S.reduce(M);
    }
    e.and = H;
    const V = b(e.operators.OR);
    function C(...S) {
      return S.reduce(V);
    }
    e.or = C;
    function b(S) {
      return (f, g) => f === t.nil ? g : g === t.nil ? f : (0, t._)`${N(f)} ${S} ${N(g)}`;
    }
    function N(S) {
      return S instanceof t.Name ? S : (0, t._)`(${S})`;
    }
  }(Tc)), Tc;
}
var W = {};
Object.defineProperty(W, "__esModule", { value: !0 });
W.checkStrictMode = W.getErrorPath = W.Type = W.useFunc = W.setEvaluated = W.evaluatedPropsToName = W.mergeEvaluated = W.eachItem = W.unescapeJsonPointer = W.escapeJsonPointer = W.escapeFragment = W.unescapeFragment = W.schemaRefOrVal = W.schemaHasRulesButRef = W.schemaHasRules = W.checkUnknownRules = W.alwaysValidSchema = W.toHash = void 0;
const ve = le(), Q$ = aa();
function Z$(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
W.toHash = Z$;
function ew(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (vy(e, t), !$y(t, e.self.RULES.all));
}
W.alwaysValidSchema = ew;
function vy(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in t)
    i[s] || by(e, `unknown keyword: "${s}"`);
}
W.checkUnknownRules = vy;
function $y(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
W.schemaHasRules = $y;
function tw(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
W.schemaHasRulesButRef = tw;
function rw({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ve._)`${r}`;
  }
  return (0, ve._)`${e}${t}${(0, ve.getProperty)(n)}`;
}
W.schemaRefOrVal = rw;
function nw(e) {
  return wy(decodeURIComponent(e));
}
W.unescapeFragment = nw;
function iw(e) {
  return encodeURIComponent(cu(e));
}
W.escapeFragment = iw;
function cu(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
W.escapeJsonPointer = cu;
function wy(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
W.unescapeJsonPointer = wy;
function sw(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
W.eachItem = sw;
function lh({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, s, o, a) => {
    const c = o === void 0 ? s : o instanceof ve.Name ? (s instanceof ve.Name ? e(i, s, o) : t(i, s, o), o) : s instanceof ve.Name ? (t(i, o, s), s) : r(s, o);
    return a === ve.Name && !(c instanceof ve.Name) ? n(i, c) : c;
  };
}
W.mergeEvaluated = {
  props: lh({
    mergeNames: (e, t, r) => e.if((0, ve._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ve._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ve._)`${r} || {}`).code((0, ve._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ve._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ve._)`${r} || {}`), lu(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Ey
  }),
  items: lh({
    mergeNames: (e, t, r) => e.if((0, ve._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ve._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ve._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ve._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Ey(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ve._)`{}`);
  return t !== void 0 && lu(e, r, t), r;
}
W.evaluatedPropsToName = Ey;
function lu(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ve._)`${t}${(0, ve.getProperty)(n)}`, !0));
}
W.setEvaluated = lu;
const uh = {};
function ow(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: uh[t.code] || (uh[t.code] = new Q$._Code(t.code))
  });
}
W.useFunc = ow;
var Pl;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Pl || (W.Type = Pl = {}));
function aw(e, t, r) {
  if (e instanceof ve.Name) {
    const n = t === Pl.Num;
    return r ? n ? (0, ve._)`"[" + ${e} + "]"` : (0, ve._)`"['" + ${e} + "']"` : n ? (0, ve._)`"/" + ${e}` : (0, ve._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ve.getProperty)(e).toString() : "/" + cu(e);
}
W.getErrorPath = aw;
function by(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
W.checkStrictMode = by;
var Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
const tt = le(), cw = {
  // validation function arguments
  data: new tt.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new tt.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new tt.Name("instancePath"),
  parentData: new tt.Name("parentData"),
  parentDataProperty: new tt.Name("parentDataProperty"),
  rootData: new tt.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new tt.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new tt.Name("vErrors"),
  // null or array of validation errors
  errors: new tt.Name("errors"),
  // counter of validation errors
  this: new tt.Name("this"),
  // "globals"
  self: new tt.Name("self"),
  scope: new tt.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new tt.Name("json"),
  jsonPos: new tt.Name("jsonPos"),
  jsonLen: new tt.Name("jsonLen"),
  jsonPart: new tt.Name("jsonPart")
};
Ct.default = cw;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = le(), r = W, n = Ct;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, t.str)`"${v}" keyword must be ${m} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, m = e.keywordError, E, A) {
    const { it: I } = v, { gen: F, compositeRule: z, allErrors: G } = I, me = d(v, m, E);
    A ?? (z || G) ? c(F, me) : u(I, (0, t._)`[${me}]`);
  }
  e.reportError = i;
  function s(v, m = e.keywordError, E) {
    const { it: A } = v, { gen: I, compositeRule: F, allErrors: z } = A, G = d(v, m, E);
    c(I, G), F || z || u(A, n.default.vErrors);
  }
  e.reportExtraError = s;
  function o(v, m) {
    v.assign(n.default.errors, m), v.if((0, t._)`${n.default.vErrors} !== null`, () => v.if(m, () => v.assign((0, t._)`${n.default.vErrors}.length`, m), () => v.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function a({ gen: v, keyword: m, schemaValue: E, data: A, errsCount: I, it: F }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const z = v.name("err");
    v.forRange("i", I, n.default.errors, (G) => {
      v.const(z, (0, t._)`${n.default.vErrors}[${G}]`), v.if((0, t._)`${z}.instancePath === undefined`, () => v.assign((0, t._)`${z}.instancePath`, (0, t.strConcat)(n.default.instancePath, F.errorPath))), v.assign((0, t._)`${z}.schemaPath`, (0, t.str)`${F.errSchemaPath}/${m}`), F.opts.verbose && (v.assign((0, t._)`${z}.schema`, E), v.assign((0, t._)`${z}.data`, A));
    });
  }
  e.extendErrors = a;
  function c(v, m) {
    const E = v.const("err", m);
    v.if((0, t._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), v.code((0, t._)`${n.default.errors}++`);
  }
  function u(v, m) {
    const { gen: E, validateName: A, schemaEnv: I } = v;
    I.$async ? E.throw((0, t._)`new ${v.ValidationError}(${m})`) : (E.assign((0, t._)`${A}.errors`, m), E.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function d(v, m, E) {
    const { createErrors: A } = v.it;
    return A === !1 ? (0, t._)`{}` : h(v, m, E);
  }
  function h(v, m, E = {}) {
    const { gen: A, it: I } = v, F = [
      p(I, E),
      $(v, E)
    ];
    return _(v, m, F), A.object(...F);
  }
  function p({ errorPath: v }, { instancePath: m }) {
    const E = m ? (0, t.str)`${v}${(0, r.getErrorPath)(m, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function $({ keyword: v, it: { errSchemaPath: m } }, { schemaPath: E, parentSchema: A }) {
    let I = A ? m : (0, t.str)`${m}/${v}`;
    return E && (I = (0, t.str)`${I}${(0, r.getErrorPath)(E, r.Type.Str)}`), [l.schemaPath, I];
  }
  function _(v, { params: m, message: E }, A) {
    const { keyword: I, data: F, schemaValue: z, it: G } = v, { opts: me, propertyName: R, topSchemaRef: Q, schemaPath: x } = G;
    A.push([l.keyword, I], [l.params, typeof m == "function" ? m(v) : m || (0, t._)`{}`]), me.messages && A.push([l.message, typeof E == "function" ? E(v) : E]), me.verbose && A.push([l.schema, z], [l.parentSchema, (0, t._)`${Q}${x}`], [n.default.data, F]), R && A.push([l.propertyName, R]);
  }
})(qs);
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.boolOrEmptySchema = Pi.topBoolOrEmptySchema = void 0;
const lw = qs, uw = le(), dw = Ct, fw = {
  message: "boolean schema is false"
};
function hw(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Sy(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(dw.default.data) : (t.assign((0, uw._)`${n}.errors`, null), t.return(!0));
}
Pi.topBoolOrEmptySchema = hw;
function pw(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Sy(e)) : r.var(t, !0);
}
Pi.boolOrEmptySchema = pw;
function Sy(e, t) {
  const { gen: r, data: n } = e, i = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, lw.reportError)(i, fw, void 0, t);
}
var Me = {}, qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.getRules = qn.isJSONType = void 0;
const mw = ["string", "number", "integer", "boolean", "null", "object", "array"], yw = new Set(mw);
function gw(e) {
  return typeof e == "string" && yw.has(e);
}
qn.isJSONType = gw;
function _w() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
qn.getRules = _w;
var Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.shouldUseRule = Tr.shouldUseGroup = Tr.schemaHasRulesForType = void 0;
function vw({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Py(e, n);
}
Tr.schemaHasRulesForType = vw;
function Py(e, t) {
  return t.rules.some((r) => Ty(e, r));
}
Tr.shouldUseGroup = Py;
function Ty(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Tr.shouldUseRule = Ty;
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.reportTypeError = Me.checkDataTypes = Me.checkDataType = Me.coerceAndCheckDataType = Me.getJSONTypes = Me.getSchemaTypes = Me.DataType = void 0;
const $w = qn, ww = Tr, Ew = qs, ae = le(), Ny = W;
var _i;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(_i || (Me.DataType = _i = {}));
function bw(e) {
  const t = Oy(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Me.getSchemaTypes = bw;
function Oy(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every($w.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Me.getJSONTypes = Oy;
function Sw(e, t) {
  const { gen: r, data: n, opts: i } = e, s = Pw(t, i.coerceTypes), o = t.length > 0 && !(s.length === 0 && t.length === 1 && (0, ww.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const a = uu(t, n, i.strictNumbers, _i.Wrong);
    r.if(a, () => {
      s.length ? Tw(e, t, s) : du(e);
    });
  }
  return o;
}
Me.coerceAndCheckDataType = Sw;
const Ay = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Pw(e, t) {
  return t ? e.filter((r) => Ay.has(r) || t === "array" && r === "array") : [];
}
function Tw(e, t, r) {
  const { gen: n, data: i, opts: s } = e, o = n.let("dataType", (0, ae._)`typeof ${i}`), a = n.let("coerced", (0, ae._)`undefined`);
  s.coerceTypes === "array" && n.if((0, ae._)`${o} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, ae._)`${i}[0]`).assign(o, (0, ae._)`typeof ${i}`).if(uu(t, i, s.strictNumbers), () => n.assign(a, i))), n.if((0, ae._)`${a} !== undefined`);
  for (const u of r)
    (Ay.has(u) || u === "array" && s.coerceTypes === "array") && c(u);
  n.else(), du(e), n.endIf(), n.if((0, ae._)`${a} !== undefined`, () => {
    n.assign(i, a), Nw(e, a);
  });
  function c(u) {
    switch (u) {
      case "string":
        n.elseIf((0, ae._)`${o} == "number" || ${o} == "boolean"`).assign(a, (0, ae._)`"" + ${i}`).elseIf((0, ae._)`${i} === null`).assign(a, (0, ae._)`""`);
        return;
      case "number":
        n.elseIf((0, ae._)`${o} == "boolean" || ${i} === null
              || (${o} == "string" && ${i} && ${i} == +${i})`).assign(a, (0, ae._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, ae._)`${o} === "boolean" || ${i} === null
              || (${o} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(a, (0, ae._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, ae._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(a, !1).elseIf((0, ae._)`${i} === "true" || ${i} === 1`).assign(a, !0);
        return;
      case "null":
        n.elseIf((0, ae._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(a, null);
        return;
      case "array":
        n.elseIf((0, ae._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${i} === null`).assign(a, (0, ae._)`[${i}]`);
    }
  }
}
function Nw({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ae._)`${t} !== undefined`, () => e.assign((0, ae._)`${t}[${r}]`, n));
}
function Tl(e, t, r, n = _i.Correct) {
  const i = n === _i.Correct ? ae.operators.EQ : ae.operators.NEQ;
  let s;
  switch (e) {
    case "null":
      return (0, ae._)`${t} ${i} null`;
    case "array":
      s = (0, ae._)`Array.isArray(${t})`;
      break;
    case "object":
      s = (0, ae._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      s = o((0, ae._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      s = o();
      break;
    default:
      return (0, ae._)`typeof ${t} ${i} ${e}`;
  }
  return n === _i.Correct ? s : (0, ae.not)(s);
  function o(a = ae.nil) {
    return (0, ae.and)((0, ae._)`typeof ${t} == "number"`, a, r ? (0, ae._)`isFinite(${t})` : ae.nil);
  }
}
Me.checkDataType = Tl;
function uu(e, t, r, n) {
  if (e.length === 1)
    return Tl(e[0], t, r, n);
  let i;
  const s = (0, Ny.toHash)(e);
  if (s.array && s.object) {
    const o = (0, ae._)`typeof ${t} != "object"`;
    i = s.null ? o : (0, ae._)`!${t} || ${o}`, delete s.null, delete s.array, delete s.object;
  } else
    i = ae.nil;
  s.number && delete s.integer;
  for (const o in s)
    i = (0, ae.and)(i, Tl(o, t, r, n));
  return i;
}
Me.checkDataTypes = uu;
const Ow = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ae._)`{type: ${e}}` : (0, ae._)`{type: ${t}}`
};
function du(e) {
  const t = Aw(e);
  (0, Ew.reportError)(t, Ow);
}
Me.reportTypeError = du;
function Aw(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, Ny.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: n,
    params: {},
    it: e
  };
}
var ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
ka.assignDefaults = void 0;
const Jn = le(), Rw = W;
function Cw(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      dh(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, s) => dh(e, s, i.default));
}
ka.assignDefaults = Cw;
function dh(e, t, r) {
  const { gen: n, compositeRule: i, data: s, opts: o } = e;
  if (r === void 0)
    return;
  const a = (0, Jn._)`${s}${(0, Jn.getProperty)(t)}`;
  if (i) {
    (0, Rw.checkStrictMode)(e, `default is ignored for: ${a}`);
    return;
  }
  let c = (0, Jn._)`${a} === undefined`;
  o.useDefaults === "empty" && (c = (0, Jn._)`${c} || ${a} === null || ${a} === ""`), n.if(c, (0, Jn._)`${a} = ${(0, Jn.stringify)(r)}`);
}
var dr = {}, he = {};
Object.defineProperty(he, "__esModule", { value: !0 });
he.validateUnion = he.validateArray = he.usePattern = he.callValidateCode = he.schemaProperties = he.allSchemaProperties = he.noPropertyInData = he.propertyInData = he.isOwnProperty = he.hasPropFunc = he.reportMissingProp = he.checkMissingProp = he.checkReportMissingProp = void 0;
const Se = le(), fu = W, qr = Ct, Iw = W;
function Dw(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(pu(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Se._)`${t}` }, !0), e.error();
  });
}
he.checkReportMissingProp = Dw;
function kw({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Se.or)(...n.map((s) => (0, Se.and)(pu(e, t, s, r.ownProperties), (0, Se._)`${i} = ${s}`)));
}
he.checkMissingProp = kw;
function Fw(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
he.reportMissingProp = Fw;
function Ry(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Se._)`Object.prototype.hasOwnProperty`
  });
}
he.hasPropFunc = Ry;
function hu(e, t, r) {
  return (0, Se._)`${Ry(e)}.call(${t}, ${r})`;
}
he.isOwnProperty = hu;
function jw(e, t, r, n) {
  const i = (0, Se._)`${t}${(0, Se.getProperty)(r)} !== undefined`;
  return n ? (0, Se._)`${i} && ${hu(e, t, r)}` : i;
}
he.propertyInData = jw;
function pu(e, t, r, n) {
  const i = (0, Se._)`${t}${(0, Se.getProperty)(r)} === undefined`;
  return n ? (0, Se.or)(i, (0, Se.not)(hu(e, t, r))) : i;
}
he.noPropertyInData = pu;
function Cy(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
he.allSchemaProperties = Cy;
function Uw(e, t) {
  return Cy(t).filter((r) => !(0, fu.alwaysValidSchema)(e, t[r]));
}
he.schemaProperties = Uw;
function Mw({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: s }, it: o }, a, c, u) {
  const l = u ? (0, Se._)`${e}, ${t}, ${n}${i}` : t, d = [
    [qr.default.instancePath, (0, Se.strConcat)(qr.default.instancePath, s)],
    [qr.default.parentData, o.parentData],
    [qr.default.parentDataProperty, o.parentDataProperty],
    [qr.default.rootData, qr.default.rootData]
  ];
  o.opts.dynamicRef && d.push([qr.default.dynamicAnchors, qr.default.dynamicAnchors]);
  const h = (0, Se._)`${l}, ${r.object(...d)}`;
  return c !== Se.nil ? (0, Se._)`${a}.call(${c}, ${h})` : (0, Se._)`${a}(${h})`;
}
he.callValidateCode = Mw;
const Lw = (0, Se._)`new RegExp`;
function xw({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, s = i(r, n);
  return e.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Se._)`${i.code === "new RegExp" ? Lw : (0, Iw.useFunc)(e, i)}(${r}, ${n})`
  });
}
he.usePattern = xw;
function Vw(e) {
  const { gen: t, data: r, keyword: n, it: i } = e, s = t.name("valid");
  if (i.allErrors) {
    const a = t.let("valid", !0);
    return o(() => t.assign(a, !1)), a;
  }
  return t.var(s, !0), o(() => t.break()), s;
  function o(a) {
    const c = t.const("len", (0, Se._)`${r}.length`);
    t.forRange("i", 0, c, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: fu.Type.Num
      }, s), t.if((0, Se.not)(s), a);
    });
  }
}
he.validateArray = Vw;
function qw(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, fu.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const o = t.let("valid", !1), a = t.name("_valid");
  t.block(() => r.forEach((c, u) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, a);
    t.assign(o, (0, Se._)`${o} || ${a}`), e.mergeValidEvaluated(l, a) || t.if((0, Se.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
he.validateUnion = qw;
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.validateKeywordUsage = dr.validSchemaType = dr.funcKeywordCode = dr.macroKeywordCode = void 0;
const lt = le(), On = Ct, Bw = he, Hw = qs;
function zw(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: s, it: o } = e, a = t.macro.call(o.self, i, s, o), c = Iy(r, n, a);
  o.opts.validateSchema !== !1 && o.self.validateSchema(a, !0);
  const u = r.name("valid");
  e.subschema({
    schema: a,
    schemaPath: lt.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
dr.macroKeywordCode = zw;
function Gw(e, t) {
  var r;
  const { gen: n, keyword: i, schema: s, parentSchema: o, $data: a, it: c } = e;
  Kw(c, t);
  const u = !a && t.compile ? t.compile.call(c.self, s, o, c) : t.validate, l = Iy(n, i, u), d = n.let("valid");
  e.block$data(d, h), e.ok((r = t.valid) !== null && r !== void 0 ? r : d);
  function h() {
    if (t.errors === !1)
      _(), t.modifying && fh(e), v(() => e.error());
    else {
      const m = t.async ? p() : $();
      t.modifying && fh(e), v(() => Ww(e, m));
    }
  }
  function p() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, lt._)`await `), (E) => n.assign(d, !1).if((0, lt._)`${E} instanceof ${c.ValidationError}`, () => n.assign(m, (0, lt._)`${E}.errors`), () => n.throw(E))), m;
  }
  function $() {
    const m = (0, lt._)`${l}.errors`;
    return n.assign(m, null), _(lt.nil), m;
  }
  function _(m = t.async ? (0, lt._)`await ` : lt.nil) {
    const E = c.opts.passContext ? On.default.this : On.default.self, A = !("compile" in t && !a || t.schema === !1);
    n.assign(d, (0, lt._)`${m}${(0, Bw.callValidateCode)(e, l, E, A)}`, t.modifying);
  }
  function v(m) {
    var E;
    n.if((0, lt.not)((E = t.valid) !== null && E !== void 0 ? E : d), m);
  }
}
dr.funcKeywordCode = Gw;
function fh(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, lt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Ww(e, t) {
  const { gen: r } = e;
  r.if((0, lt._)`Array.isArray(${t})`, () => {
    r.assign(On.default.vErrors, (0, lt._)`${On.default.vErrors} === null ? ${t} : ${On.default.vErrors}.concat(${t})`).assign(On.default.errors, (0, lt._)`${On.default.vErrors}.length`), (0, Hw.extendErrors)(e);
  }, () => e.error());
}
function Kw({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Iy(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, lt.stringify)(r) });
}
function Yw(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
dr.validSchemaType = Yw;
function Xw({ schema: e, opts: t, self: r, errSchemaPath: n }, i, s) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(s) : i.keyword !== s)
    throw new Error("ajv implementation error");
  const o = i.dependencies;
  if (o != null && o.some((a) => !Object.prototype.hasOwnProperty.call(e, a)))
    throw new Error(`parent schema must have dependencies of ${s}: ${o.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[s])) {
    const c = `keyword "${s}" value is invalid at path "${n}": ` + r.errorsText(i.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
dr.validateKeywordUsage = Xw;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.extendSubschemaMode = sn.extendSubschemaData = sn.getSubschema = void 0;
const cr = le(), Dy = W;
function Jw(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: s, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const a = e.schema[t];
    return r === void 0 ? {
      schema: a,
      schemaPath: (0, cr._)`${e.schemaPath}${(0, cr.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: a[r],
      schemaPath: (0, cr._)`${e.schemaPath}${(0, cr.getProperty)(t)}${(0, cr.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Dy.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || s === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: o,
      errSchemaPath: s
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
sn.getSubschema = Jw;
function Qw(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: s, propertyName: o }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: a } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: d } = t, h = a.let("data", (0, cr._)`${t.data}${(0, cr.getProperty)(r)}`, !0);
    c(h), e.errorPath = (0, cr.str)`${u}${(0, Dy.getErrorPath)(r, n, d.jsPropertySyntax)}`, e.parentDataProperty = (0, cr._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const u = i instanceof cr.Name ? i : a.let("data", i, !0);
    c(u), o !== void 0 && (e.propertyName = o);
  }
  s && (e.dataTypes = s);
  function c(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
sn.extendSubschemaData = Qw;
function Zw(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: s }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), s !== void 0 && (e.allErrors = s), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
sn.extendSubschemaMode = Zw;
var We = {}, Fa = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, i, s;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (i = n; i-- !== 0; )
        if (!e(t[i], r[i])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (s = Object.keys(t), n = s.length, n !== Object.keys(r).length) return !1;
    for (i = n; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, s[i])) return !1;
    for (i = n; i-- !== 0; ) {
      var o = s[i];
      if (!e(t[o], r[o])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, ky = { exports: {} }, en = ky.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  Go(t, n, i, e, "", e);
};
en.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
en.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
en.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
en.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Go(e, t, r, n, i, s, o, a, c, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, i, s, o, a, c, u);
    for (var l in n) {
      var d = n[l];
      if (Array.isArray(d)) {
        if (l in en.arrayKeywords)
          for (var h = 0; h < d.length; h++)
            Go(e, t, r, d[h], i + "/" + l + "/" + h, s, i, l, n, h);
      } else if (l in en.propsKeywords) {
        if (d && typeof d == "object")
          for (var p in d)
            Go(e, t, r, d[p], i + "/" + l + "/" + eE(p), s, i, l, n, p);
      } else (l in en.keywords || e.allKeys && !(l in en.skipKeywords)) && Go(e, t, r, d, i + "/" + l, s, i, l, n);
    }
    r(n, i, s, o, a, c, u);
  }
}
function eE(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var tE = ky.exports;
Object.defineProperty(We, "__esModule", { value: !0 });
We.getSchemaRefs = We.resolveUrl = We.normalizeId = We._getFullPath = We.getFullPath = We.inlineRef = void 0;
const rE = W, nE = Fa, iE = tE, sE = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function oE(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Nl(e) : t ? Fy(e) <= t : !1;
}
We.inlineRef = oE;
const aE = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Nl(e) {
  for (const t in e) {
    if (aE.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Nl) || typeof r == "object" && Nl(r))
      return !0;
  }
  return !1;
}
function Fy(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !sE.has(r) && (typeof e[r] == "object" && (0, rE.eachItem)(e[r], (n) => t += Fy(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function jy(e, t = "", r) {
  r !== !1 && (t = vi(t));
  const n = e.parse(t);
  return Uy(e, n);
}
We.getFullPath = jy;
function Uy(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
We._getFullPath = Uy;
const cE = /#\/?$/;
function vi(e) {
  return e ? e.replace(cE, "") : "";
}
We.normalizeId = vi;
function lE(e, t, r) {
  return r = vi(r), e.resolve(t, r);
}
We.resolveUrl = lE;
const uE = /^[a-z_][-a-z0-9._]*$/i;
function dE(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = vi(e[r] || t), s = { "": i }, o = jy(n, i, !1), a = {}, c = /* @__PURE__ */ new Set();
  return iE(e, { allKeys: !0 }, (d, h, p, $) => {
    if ($ === void 0)
      return;
    const _ = o + h;
    let v = s[$];
    typeof d[r] == "string" && (v = m.call(this, d[r])), E.call(this, d.$anchor), E.call(this, d.$dynamicAnchor), s[h] = v;
    function m(A) {
      const I = this.opts.uriResolver.resolve;
      if (A = vi(v ? I(v, A) : A), c.has(A))
        throw l(A);
      c.add(A);
      let F = this.refs[A];
      return typeof F == "string" && (F = this.refs[F]), typeof F == "object" ? u(d, F.schema, A) : A !== vi(_) && (A[0] === "#" ? (u(d, a[A], A), a[A] = d) : this.refs[A] = _), A;
    }
    function E(A) {
      if (typeof A == "string") {
        if (!uE.test(A))
          throw new Error(`invalid anchor "${A}"`);
        m.call(this, `#${A}`);
      }
    }
  }), a;
  function u(d, h, p) {
    if (h !== void 0 && !nE(d, h))
      throw l(p);
  }
  function l(d) {
    return new Error(`reference "${d}" resolves to more than one schema`);
  }
}
We.getSchemaRefs = dE;
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.getData = Zt.KeywordCxt = Zt.validateFunctionCode = void 0;
const My = Pi, hh = Me, mu = Tr, ca = Me, fE = ka, us = dr, Ac = sn, Z = le(), re = Ct, hE = We, Nr = W, Xi = qs;
function pE(e) {
  if (Vy(e) && (qy(e), xy(e))) {
    gE(e);
    return;
  }
  Ly(e, () => (0, My.topBoolOrEmptySchema)(e));
}
Zt.validateFunctionCode = pE;
function Ly({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, s) {
  i.code.es5 ? e.func(t, (0, Z._)`${re.default.data}, ${re.default.valCxt}`, n.$async, () => {
    e.code((0, Z._)`"use strict"; ${ph(r, i)}`), yE(e, i), e.code(s);
  }) : e.func(t, (0, Z._)`${re.default.data}, ${mE(i)}`, n.$async, () => e.code(ph(r, i)).code(s));
}
function mE(e) {
  return (0, Z._)`{${re.default.instancePath}="", ${re.default.parentData}, ${re.default.parentDataProperty}, ${re.default.rootData}=${re.default.data}${e.dynamicRef ? (0, Z._)`, ${re.default.dynamicAnchors}={}` : Z.nil}}={}`;
}
function yE(e, t) {
  e.if(re.default.valCxt, () => {
    e.var(re.default.instancePath, (0, Z._)`${re.default.valCxt}.${re.default.instancePath}`), e.var(re.default.parentData, (0, Z._)`${re.default.valCxt}.${re.default.parentData}`), e.var(re.default.parentDataProperty, (0, Z._)`${re.default.valCxt}.${re.default.parentDataProperty}`), e.var(re.default.rootData, (0, Z._)`${re.default.valCxt}.${re.default.rootData}`), t.dynamicRef && e.var(re.default.dynamicAnchors, (0, Z._)`${re.default.valCxt}.${re.default.dynamicAnchors}`);
  }, () => {
    e.var(re.default.instancePath, (0, Z._)`""`), e.var(re.default.parentData, (0, Z._)`undefined`), e.var(re.default.parentDataProperty, (0, Z._)`undefined`), e.var(re.default.rootData, re.default.data), t.dynamicRef && e.var(re.default.dynamicAnchors, (0, Z._)`{}`);
  });
}
function gE(e) {
  const { schema: t, opts: r, gen: n } = e;
  Ly(e, () => {
    r.$comment && t.$comment && Hy(e), EE(e), n.let(re.default.vErrors, null), n.let(re.default.errors, 0), r.unevaluated && _E(e), By(e), PE(e);
  });
}
function _E(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, Z._)`${r}.evaluated`), t.if((0, Z._)`${e.evaluated}.dynamicProps`, () => t.assign((0, Z._)`${e.evaluated}.props`, (0, Z._)`undefined`)), t.if((0, Z._)`${e.evaluated}.dynamicItems`, () => t.assign((0, Z._)`${e.evaluated}.items`, (0, Z._)`undefined`));
}
function ph(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, Z._)`/*# sourceURL=${r} */` : Z.nil;
}
function vE(e, t) {
  if (Vy(e) && (qy(e), xy(e))) {
    $E(e, t);
    return;
  }
  (0, My.boolOrEmptySchema)(e, t);
}
function xy({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Vy(e) {
  return typeof e.schema != "boolean";
}
function $E(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && Hy(e), bE(e), SE(e);
  const s = n.const("_errs", re.default.errors);
  By(e, s), n.var(t, (0, Z._)`${s} === ${re.default.errors}`);
}
function qy(e) {
  (0, Nr.checkUnknownRules)(e), wE(e);
}
function By(e, t) {
  if (e.opts.jtd)
    return mh(e, [], !1, t);
  const r = (0, hh.getSchemaTypes)(e.schema), n = (0, hh.coerceAndCheckDataType)(e, r);
  mh(e, r, !n, t);
}
function wE(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Nr.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function EE(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Nr.checkStrictMode)(e, "default is ignored in the schema root");
}
function bE(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, hE.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function SE(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Hy({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const s = r.$comment;
  if (i.$comment === !0)
    e.code((0, Z._)`${re.default.self}.logger.log(${s})`);
  else if (typeof i.$comment == "function") {
    const o = (0, Z.str)`${n}/$comment`, a = e.scopeValue("root", { ref: t.root });
    e.code((0, Z._)`${re.default.self}.opts.$comment(${s}, ${o}, ${a}.schema)`);
  }
}
function PE(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: s } = e;
  r.$async ? t.if((0, Z._)`${re.default.errors} === 0`, () => t.return(re.default.data), () => t.throw((0, Z._)`new ${i}(${re.default.vErrors})`)) : (t.assign((0, Z._)`${n}.errors`, re.default.vErrors), s.unevaluated && TE(e), t.return((0, Z._)`${re.default.errors} === 0`));
}
function TE({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof Z.Name && e.assign((0, Z._)`${t}.props`, r), n instanceof Z.Name && e.assign((0, Z._)`${t}.items`, n);
}
function mh(e, t, r, n) {
  const { gen: i, schema: s, data: o, allErrors: a, opts: c, self: u } = e, { RULES: l } = u;
  if (s.$ref && (c.ignoreKeywordsWithRef || !(0, Nr.schemaHasRulesButRef)(s, l))) {
    i.block(() => Wy(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || NE(e, t), i.block(() => {
    for (const h of l.rules)
      d(h);
    d(l.post);
  });
  function d(h) {
    (0, mu.shouldUseGroup)(s, h) && (h.type ? (i.if((0, ca.checkDataType)(h.type, o, c.strictNumbers)), yh(e, h), t.length === 1 && t[0] === h.type && r && (i.else(), (0, ca.reportTypeError)(e)), i.endIf()) : yh(e, h), a || i.if((0, Z._)`${re.default.errors} === ${n || 0}`));
  }
}
function yh(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, fE.assignDefaults)(e, t.type), r.block(() => {
    for (const s of t.rules)
      (0, mu.shouldUseRule)(n, s) && Wy(e, s.keyword, s.definition, t.type);
  });
}
function NE(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (OE(e, t), e.opts.allowUnionTypes || AE(e, t), RE(e, e.dataTypes));
}
function OE(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      zy(e.dataTypes, r) || yu(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), IE(e, t);
  }
}
function AE(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && yu(e, "use allowUnionTypes to allow union type keyword");
}
function RE(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, mu.shouldUseRule)(e.schema, i)) {
      const { type: s } = i.definition;
      s.length && !s.some((o) => CE(t, o)) && yu(e, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function CE(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function zy(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function IE(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    zy(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function yu(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Nr.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Gy = class {
  constructor(t, r, n) {
    if ((0, us.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Nr.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Ky(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, us.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", re.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, Z.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, Z.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, Z._)`${r} !== undefined && (${(0, Z.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Xi.reportExtraError : Xi.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Xi.reportError)(this, this.def.$dataError || Xi.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Xi.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = Z.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = Z.nil, r = Z.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: s, def: o } = this;
    n.if((0, Z.or)((0, Z._)`${i} === undefined`, r)), t !== Z.nil && n.assign(t, !0), (s.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== Z.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: i, it: s } = this;
    return (0, Z.or)(o(), a());
    function o() {
      if (n.length) {
        if (!(r instanceof Z.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, Z._)`${(0, ca.checkDataTypes)(c, r, s.opts.strictNumbers, ca.DataType.Wrong)}`;
      }
      return Z.nil;
    }
    function a() {
      if (i.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, Z._)`!${c}(${r})`;
      }
      return Z.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Ac.getSubschema)(this.it, t);
    (0, Ac.extendSubschemaData)(n, this.it, t), (0, Ac.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return vE(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Nr.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Nr.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, Z.Name)), !0;
  }
};
Zt.KeywordCxt = Gy;
function Wy(e, t, r, n) {
  const i = new Gy(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, us.funcKeywordCode)(i, r) : "macro" in r ? (0, us.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, us.funcKeywordCode)(i, r);
}
const DE = /^\/(?:[^~]|~0|~1)*$/, kE = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Ky(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, s;
  if (e === "")
    return re.default.rootData;
  if (e[0] === "/") {
    if (!DE.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, s = re.default.rootData;
  } else {
    const u = kE.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +u[1];
    if (i = u[2], i === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (s = r[t - l], !i)
      return s;
  }
  let o = s;
  const a = i.split("/");
  for (const u of a)
    u && (s = (0, Z._)`${s}${(0, Z.getProperty)((0, Nr.unescapeJsonPointer)(u))}`, o = (0, Z._)`${o} && ${s}`);
  return o;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
Zt.getData = Ky;
var Bs = {};
Object.defineProperty(Bs, "__esModule", { value: !0 });
class FE extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Bs.default = FE;
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
const Rc = We;
let jE = class extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Rc.resolveUrl)(t, r, n), this.missingSchema = (0, Rc.normalizeId)((0, Rc.getFullPath)(t, this.missingRef));
  }
};
Di.default = jE;
var dt = {};
Object.defineProperty(dt, "__esModule", { value: !0 });
dt.resolveSchema = dt.getCompilingSchema = dt.resolveRef = dt.compileSchema = dt.SchemaEnv = void 0;
const Bt = le(), UE = Bs, bn = Ct, Jt = We, gh = W, ME = Zt;
let ja = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Jt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
dt.SchemaEnv = ja;
function gu(e) {
  const t = Yy.call(this, e);
  if (t)
    return t;
  const r = (0, Jt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, o = new Bt.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let a;
  e.$async && (a = o.scopeValue("Error", {
    ref: UE.default,
    code: (0, Bt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: bn.default.data,
    parentData: bn.default.parentData,
    parentDataProperty: bn.default.parentDataProperty,
    dataNames: [bn.default.data],
    dataPathArr: [Bt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Bt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: a,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Bt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Bt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, ME.validateFunctionCode)(u), o.optimize(this.opts.code.optimize);
    const d = o.toString();
    l = `${o.scopeRefs(bn.default.scope)}return ${d}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const p = new Function(`${bn.default.self}`, `${bn.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = e.schema, p.schemaEnv = e, e.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: d, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: $, items: _ } = u;
      p.evaluated = {
        props: $ instanceof Bt.Name ? void 0 : $,
        items: _ instanceof Bt.Name ? void 0 : _,
        dynamicProps: $ instanceof Bt.Name,
        dynamicItems: _ instanceof Bt.Name
      }, p.source && (p.source.evaluated = (0, Bt.stringify)(p.evaluated));
    }
    return e.validate = p, e;
  } catch (d) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), d;
  } finally {
    this._compilations.delete(e);
  }
}
dt.compileSchema = gu;
function LE(e, t, r) {
  var n;
  r = (0, Jt.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let s = qE.call(this, e, r);
  if (s === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: a } = this.opts;
    o && (s = new ja({ schema: o, schemaId: a, root: e, baseId: t }));
  }
  if (s !== void 0)
    return e.refs[r] = xE.call(this, s);
}
dt.resolveRef = LE;
function xE(e) {
  return (0, Jt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : gu.call(this, e);
}
function Yy(e) {
  for (const t of this._compilations)
    if (VE(t, e))
      return t;
}
dt.getCompilingSchema = Yy;
function VE(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function qE(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ua.call(this, e, t);
}
function Ua(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Jt._getFullPath)(this.opts.uriResolver, r);
  let i = (0, Jt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return Cc.call(this, r, e);
  const s = (0, Jt.normalizeId)(n), o = this.refs[s] || this.schemas[s];
  if (typeof o == "string") {
    const a = Ua.call(this, e, o);
    return typeof (a == null ? void 0 : a.schema) != "object" ? void 0 : Cc.call(this, r, a);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || gu.call(this, o), s === (0, Jt.normalizeId)(t)) {
      const { schema: a } = o, { schemaId: c } = this.opts, u = a[c];
      return u && (i = (0, Jt.resolveUrl)(this.opts.uriResolver, i, u)), new ja({ schema: a, schemaId: c, root: e, baseId: i });
    }
    return Cc.call(this, r, o);
  }
}
dt.resolveSchema = Ua;
const BE = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Cc(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const a of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, gh.unescapeFragment)(a)];
    if (c === void 0)
      return;
    r = c;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !BE.has(a) && u && (t = (0, Jt.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let s;
  if (typeof r != "boolean" && r.$ref && !(0, gh.schemaHasRulesButRef)(r, this.RULES)) {
    const a = (0, Jt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    s = Ua.call(this, n, a);
  }
  const { schemaId: o } = this.opts;
  if (s = s || new ja({ schema: r, schemaId: o, root: n, baseId: t }), s.schema !== s.root.schema)
    return s;
}
const HE = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", zE = "Meta-schema for $data reference (JSON AnySchema extension proposal)", GE = "object", WE = [
  "$data"
], KE = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, YE = !1, XE = {
  $id: HE,
  description: zE,
  type: GE,
  required: WE,
  properties: KE,
  additionalProperties: YE
};
var _u = {}, Ma = { exports: {} };
const JE = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Xy = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function Jy(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const QE = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function _h(e) {
  return e.length = 0, !0;
}
function ZE(e, t, r) {
  if (e.length) {
    const n = Jy(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function eb(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], i = [];
  let s = !1, o = !1, a = ZE;
  for (let c = 0; c < e.length; c++) {
    const u = e[c];
    if (!(u === "[" || u === "]"))
      if (u === ":") {
        if (s === !0 && (o = !0), !a(i, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (s = !0), n.push(":");
        continue;
      } else if (u === "%") {
        if (!a(i, n, r))
          break;
        a = _h;
      } else {
        i.push(u);
        continue;
      }
  }
  return i.length && (a === _h ? r.zone = i.join("") : o ? n.push(i.join("")) : n.push(Jy(i))), r.address = n.join(""), r;
}
function Qy(e) {
  if (tb(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = eb(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function tb(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function rb(e) {
  let t = e;
  const r = [];
  let n = -1, i = 0;
  for (; i = t.length; ) {
    if (i === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (i === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (i === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function nb(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function ib(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!Xy(r)) {
      const n = Qy(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Zy = {
  nonSimpleDomain: QE,
  recomposeAuthority: ib,
  normalizeComponentEncoding: nb,
  removeDotSegments: rb,
  isIPv4: Xy,
  isUUID: JE,
  normalizeIPv6: Qy
};
const { isUUID: sb } = Zy, ob = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function eg(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function tg(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function rg(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function ab(e) {
  return e.secure = eg(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function cb(e) {
  if ((e.port === (eg(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function lb(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(ob);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const i = `${n}:${t.nid || e.nid}`, s = vu(i);
    e.path = void 0, s && (e = s.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function ub(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), i = `${r}:${t.nid || n}`, s = vu(i);
  s && (e = s.serialize(e, t));
  const o = e, a = e.nss;
  return o.path = `${n || t.nid}:${a}`, t.skipEscape = !0, o;
}
function db(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !sb(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function fb(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const ng = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: tg,
    serialize: rg
  }
), hb = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: ng.domainHost,
    parse: tg,
    serialize: rg
  }
), Wo = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: ab,
    serialize: cb
  }
), pb = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Wo.domainHost,
    parse: Wo.parse,
    serialize: Wo.serialize
  }
), mb = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: lb,
    serialize: ub,
    skipNormalize: !0
  }
), yb = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: db,
    serialize: fb,
    skipNormalize: !0
  }
), la = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: ng,
    https: hb,
    ws: Wo,
    wss: pb,
    urn: mb,
    "urn:uuid": yb
  }
);
Object.setPrototypeOf(la, null);
function vu(e) {
  return e && (la[
    /** @type {SchemeName} */
    e
  ] || la[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var gb = {
  SCHEMES: la,
  getSchemeHandler: vu
};
const { normalizeIPv6: _b, removeDotSegments: ss, recomposeAuthority: vb, normalizeComponentEncoding: po, isIPv4: $b, nonSimpleDomain: wb } = Zy, { SCHEMES: Eb, getSchemeHandler: ig } = gb;
function bb(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  fr(Cr(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  Cr(fr(e, t), t)), e;
}
function Sb(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, i = sg(Cr(e, n), Cr(t, n), n, !0);
  return n.skipEscape = !0, fr(i, n);
}
function sg(e, t, r, n) {
  const i = {};
  return n || (e = Cr(fr(e, r), r), t = Cr(fr(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (i.scheme = t.scheme, i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = ss(t.path || ""), i.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = ss(t.path || ""), i.query = t.query) : (t.path ? (t.path[0] === "/" ? i.path = ss(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? i.path = "/" + t.path : e.path ? i.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : i.path = t.path, i.path = ss(i.path)), i.query = t.query) : (i.path = e.path, t.query !== void 0 ? i.query = t.query : i.query = e.query), i.userinfo = e.userinfo, i.host = e.host, i.port = e.port), i.scheme = e.scheme), i.fragment = t.fragment, i;
}
function Pb(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = fr(po(Cr(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = fr(po(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = fr(po(Cr(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = fr(po(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function fr(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), i = [], s = ig(n.scheme || r.scheme);
  s && s.serialize && s.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && i.push(r.scheme, ":");
  const o = vb(r);
  if (o !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(o), r.path && r.path[0] !== "/" && i.push("/")), r.path !== void 0) {
    let a = r.path;
    !n.absolutePath && (!s || !s.absolutePath) && (a = ss(a)), o === void 0 && a[0] === "/" && a[1] === "/" && (a = "/%2F" + a.slice(2)), i.push(a);
  }
  return r.query !== void 0 && i.push("?", r.query), r.fragment !== void 0 && i.push("#", r.fragment), i.join("");
}
const Tb = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Cr(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let i = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const s = e.match(Tb);
  if (s) {
    if (n.scheme = s[1], n.userinfo = s[3], n.host = s[4], n.port = parseInt(s[5], 10), n.path = s[6] || "", n.query = s[7], n.fragment = s[8], isNaN(n.port) && (n.port = s[5]), n.host)
      if ($b(n.host) === !1) {
        const c = _b(n.host);
        n.host = c.host.toLowerCase(), i = c.isIPV6;
      } else
        i = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const o = ig(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!o || !o.unicodeSupport) && n.host && (r.domainHost || o && o.domainHost) && i === !1 && wb(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (a) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + a;
      }
    (!o || o && !o.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), o && o.parse && o.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const $u = {
  SCHEMES: Eb,
  normalize: bb,
  resolve: Sb,
  resolveComponent: sg,
  equal: Pb,
  serialize: fr,
  parse: Cr
};
Ma.exports = $u;
Ma.exports.default = $u;
Ma.exports.fastUri = $u;
var og = Ma.exports;
Object.defineProperty(_u, "__esModule", { value: !0 });
const ag = og;
ag.code = 'require("ajv/dist/runtime/uri").default';
_u.default = ag;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Zt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = le();
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Bs, i = Di, s = qn, o = dt, a = le(), c = We, u = Me, l = W, d = XE, h = _u, p = (C, b) => new RegExp(C, b);
  p.code = "new RegExp";
  const $ = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), v = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function A(C) {
    var b, N, S, f, g, T, w, y, k, O, K, fe, ge, Ee, Te, Je, _e, Ue, Vt, It, Tt, Dt, gr, _r, vr;
    const Nt = C.strict, kt = (b = C.code) === null || b === void 0 ? void 0 : b.optimize, $r = kt === !0 || kt === void 0 ? 1 : kt || 0, kr = (S = (N = C.code) === null || N === void 0 ? void 0 : N.regExp) !== null && S !== void 0 ? S : p, vt = (f = C.uriResolver) !== null && f !== void 0 ? f : h.default;
    return {
      strictSchema: (T = (g = C.strictSchema) !== null && g !== void 0 ? g : Nt) !== null && T !== void 0 ? T : !0,
      strictNumbers: (y = (w = C.strictNumbers) !== null && w !== void 0 ? w : Nt) !== null && y !== void 0 ? y : !0,
      strictTypes: (O = (k = C.strictTypes) !== null && k !== void 0 ? k : Nt) !== null && O !== void 0 ? O : "log",
      strictTuples: (fe = (K = C.strictTuples) !== null && K !== void 0 ? K : Nt) !== null && fe !== void 0 ? fe : "log",
      strictRequired: (Ee = (ge = C.strictRequired) !== null && ge !== void 0 ? ge : Nt) !== null && Ee !== void 0 ? Ee : !1,
      code: C.code ? { ...C.code, optimize: $r, regExp: kr } : { optimize: $r, regExp: kr },
      loopRequired: (Te = C.loopRequired) !== null && Te !== void 0 ? Te : E,
      loopEnum: (Je = C.loopEnum) !== null && Je !== void 0 ? Je : E,
      meta: (_e = C.meta) !== null && _e !== void 0 ? _e : !0,
      messages: (Ue = C.messages) !== null && Ue !== void 0 ? Ue : !0,
      inlineRefs: (Vt = C.inlineRefs) !== null && Vt !== void 0 ? Vt : !0,
      schemaId: (It = C.schemaId) !== null && It !== void 0 ? It : "$id",
      addUsedSchema: (Tt = C.addUsedSchema) !== null && Tt !== void 0 ? Tt : !0,
      validateSchema: (Dt = C.validateSchema) !== null && Dt !== void 0 ? Dt : !0,
      validateFormats: (gr = C.validateFormats) !== null && gr !== void 0 ? gr : !0,
      unicodeRegExp: (_r = C.unicodeRegExp) !== null && _r !== void 0 ? _r : !0,
      int32range: (vr = C.int32range) !== null && vr !== void 0 ? vr : !0,
      uriResolver: vt
    };
  }
  class I {
    constructor(b = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), b = this.opts = { ...b, ...A(b) };
      const { es5: N, lines: S } = this.opts.code;
      this.scope = new a.ValueScope({ scope: {}, prefixes: _, es5: N, lines: S }), this.logger = q(b.logger);
      const f = b.validateFormats;
      b.validateFormats = !1, this.RULES = (0, s.getRules)(), F.call(this, v, b, "NOT SUPPORTED"), F.call(this, m, b, "DEPRECATED", "warn"), this._metaOpts = Q.call(this), b.formats && me.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), b.keywords && R.call(this, b.keywords), typeof b.meta == "object" && this.addMetaSchema(b.meta), G.call(this), b.validateFormats = f;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: b, meta: N, schemaId: S } = this.opts;
      let f = d;
      S === "id" && (f = { ...d }, f.id = f.$id, delete f.$id), N && b && this.addMetaSchema(f, f[S], !1);
    }
    defaultMeta() {
      const { meta: b, schemaId: N } = this.opts;
      return this.opts.defaultMeta = typeof b == "object" ? b[N] || b : void 0;
    }
    validate(b, N) {
      let S;
      if (typeof b == "string") {
        if (S = this.getSchema(b), !S)
          throw new Error(`no schema with key or ref "${b}"`);
      } else
        S = this.compile(b);
      const f = S(N);
      return "$async" in S || (this.errors = S.errors), f;
    }
    compile(b, N) {
      const S = this._addSchema(b, N);
      return S.validate || this._compileSchemaEnv(S);
    }
    compileAsync(b, N) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: S } = this.opts;
      return f.call(this, b, N);
      async function f(O, K) {
        await g.call(this, O.$schema);
        const fe = this._addSchema(O, K);
        return fe.validate || T.call(this, fe);
      }
      async function g(O) {
        O && !this.getSchema(O) && await f.call(this, { $ref: O }, !0);
      }
      async function T(O) {
        try {
          return this._compileSchemaEnv(O);
        } catch (K) {
          if (!(K instanceof i.default))
            throw K;
          return w.call(this, K), await y.call(this, K.missingSchema), T.call(this, O);
        }
      }
      function w({ missingSchema: O, missingRef: K }) {
        if (this.refs[O])
          throw new Error(`AnySchema ${O} is loaded but ${K} cannot be resolved`);
      }
      async function y(O) {
        const K = await k.call(this, O);
        this.refs[O] || await g.call(this, K.$schema), this.refs[O] || this.addSchema(K, O, N);
      }
      async function k(O) {
        const K = this._loading[O];
        if (K)
          return K;
        try {
          return await (this._loading[O] = S(O));
        } finally {
          delete this._loading[O];
        }
      }
    }
    // Adds schema to the instance
    addSchema(b, N, S, f = this.opts.validateSchema) {
      if (Array.isArray(b)) {
        for (const T of b)
          this.addSchema(T, void 0, S, f);
        return this;
      }
      let g;
      if (typeof b == "object") {
        const { schemaId: T } = this.opts;
        if (g = b[T], g !== void 0 && typeof g != "string")
          throw new Error(`schema ${T} must be string`);
      }
      return N = (0, c.normalizeId)(N || g), this._checkUnique(N), this.schemas[N] = this._addSchema(b, S, N, f, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(b, N, S = this.opts.validateSchema) {
      return this.addSchema(b, N, !0, S), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(b, N) {
      if (typeof b == "boolean")
        return !0;
      let S;
      if (S = b.$schema, S !== void 0 && typeof S != "string")
        throw new Error("$schema must be a string");
      if (S = S || this.opts.defaultMeta || this.defaultMeta(), !S)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const f = this.validate(S, b);
      if (!f && N) {
        const g = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(g);
        else
          throw new Error(g);
      }
      return f;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(b) {
      let N;
      for (; typeof (N = z.call(this, b)) == "string"; )
        b = N;
      if (N === void 0) {
        const { schemaId: S } = this.opts, f = new o.SchemaEnv({ schema: {}, schemaId: S });
        if (N = o.resolveSchema.call(this, f, b), !N)
          return;
        this.refs[b] = N;
      }
      return N.validate || this._compileSchemaEnv(N);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(b) {
      if (b instanceof RegExp)
        return this._removeAllSchemas(this.schemas, b), this._removeAllSchemas(this.refs, b), this;
      switch (typeof b) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const N = z.call(this, b);
          return typeof N == "object" && this._cache.delete(N.schema), delete this.schemas[b], delete this.refs[b], this;
        }
        case "object": {
          const N = b;
          this._cache.delete(N);
          let S = b[this.opts.schemaId];
          return S && (S = (0, c.normalizeId)(S), delete this.schemas[S], delete this.refs[S]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(b) {
      for (const N of b)
        this.addKeyword(N);
      return this;
    }
    addKeyword(b, N) {
      let S;
      if (typeof b == "string")
        S = b, typeof N == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), N.keyword = S);
      else if (typeof b == "object" && N === void 0) {
        if (N = b, S = N.keyword, Array.isArray(S) && !S.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (j.call(this, S, N), !N)
        return (0, l.eachItem)(S, (g) => U.call(this, g)), this;
      M.call(this, N);
      const f = {
        ...N,
        type: (0, u.getJSONTypes)(N.type),
        schemaType: (0, u.getJSONTypes)(N.schemaType)
      };
      return (0, l.eachItem)(S, f.type.length === 0 ? (g) => U.call(this, g, f) : (g) => f.type.forEach((T) => U.call(this, g, f, T))), this;
    }
    getKeyword(b) {
      const N = this.RULES.all[b];
      return typeof N == "object" ? N.definition : !!N;
    }
    // Remove keyword
    removeKeyword(b) {
      const { RULES: N } = this;
      delete N.keywords[b], delete N.all[b];
      for (const S of N.rules) {
        const f = S.rules.findIndex((g) => g.keyword === b);
        f >= 0 && S.rules.splice(f, 1);
      }
      return this;
    }
    // Add format
    addFormat(b, N) {
      return typeof N == "string" && (N = new RegExp(N)), this.formats[b] = N, this;
    }
    errorsText(b = this.errors, { separator: N = ", ", dataVar: S = "data" } = {}) {
      return !b || b.length === 0 ? "No errors" : b.map((f) => `${S}${f.instancePath} ${f.message}`).reduce((f, g) => f + N + g);
    }
    $dataMetaSchema(b, N) {
      const S = this.RULES.all;
      b = JSON.parse(JSON.stringify(b));
      for (const f of N) {
        const g = f.split("/").slice(1);
        let T = b;
        for (const w of g)
          T = T[w];
        for (const w in S) {
          const y = S[w];
          if (typeof y != "object")
            continue;
          const { $data: k } = y.definition, O = T[w];
          k && O && (T[w] = V(O));
        }
      }
      return b;
    }
    _removeAllSchemas(b, N) {
      for (const S in b) {
        const f = b[S];
        (!N || N.test(S)) && (typeof f == "string" ? delete b[S] : f && !f.meta && (this._cache.delete(f.schema), delete b[S]));
      }
    }
    _addSchema(b, N, S, f = this.opts.validateSchema, g = this.opts.addUsedSchema) {
      let T;
      const { schemaId: w } = this.opts;
      if (typeof b == "object")
        T = b[w];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof b != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let y = this._cache.get(b);
      if (y !== void 0)
        return y;
      S = (0, c.normalizeId)(T || S);
      const k = c.getSchemaRefs.call(this, b, S);
      return y = new o.SchemaEnv({ schema: b, schemaId: w, meta: N, baseId: S, localRefs: k }), this._cache.set(y.schema, y), g && !S.startsWith("#") && (S && this._checkUnique(S), this.refs[S] = y), f && this.validateSchema(b, !0), y;
    }
    _checkUnique(b) {
      if (this.schemas[b] || this.refs[b])
        throw new Error(`schema with key or id "${b}" already exists`);
    }
    _compileSchemaEnv(b) {
      if (b.meta ? this._compileMetaSchema(b) : o.compileSchema.call(this, b), !b.validate)
        throw new Error("ajv implementation error");
      return b.validate;
    }
    _compileMetaSchema(b) {
      const N = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, b);
      } finally {
        this.opts = N;
      }
    }
  }
  I.ValidationError = n.default, I.MissingRefError = i.default, e.default = I;
  function F(C, b, N, S = "error") {
    for (const f in C) {
      const g = f;
      g in b && this.logger[S](`${N}: option ${f}. ${C[g]}`);
    }
  }
  function z(C) {
    return C = (0, c.normalizeId)(C), this.schemas[C] || this.refs[C];
  }
  function G() {
    const C = this.opts.schemas;
    if (C)
      if (Array.isArray(C))
        this.addSchema(C);
      else
        for (const b in C)
          this.addSchema(C[b], b);
  }
  function me() {
    for (const C in this.opts.formats) {
      const b = this.opts.formats[C];
      b && this.addFormat(C, b);
    }
  }
  function R(C) {
    if (Array.isArray(C)) {
      this.addVocabulary(C);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const b in C) {
      const N = C[b];
      N.keyword || (N.keyword = b), this.addKeyword(N);
    }
  }
  function Q() {
    const C = { ...this.opts };
    for (const b of $)
      delete C[b];
    return C;
  }
  const x = { log() {
  }, warn() {
  }, error() {
  } };
  function q(C) {
    if (C === !1)
      return x;
    if (C === void 0)
      return console;
    if (C.log && C.warn && C.error)
      return C;
    throw new Error("logger must implement log, warn and error methods");
  }
  const J = /^[a-z_$][a-z0-9_$:-]*$/i;
  function j(C, b) {
    const { RULES: N } = this;
    if ((0, l.eachItem)(C, (S) => {
      if (N.keywords[S])
        throw new Error(`Keyword ${S} is already defined`);
      if (!J.test(S))
        throw new Error(`Keyword ${S} has invalid name`);
    }), !!b && b.$data && !("code" in b || "validate" in b))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function U(C, b, N) {
    var S;
    const f = b == null ? void 0 : b.post;
    if (N && f)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: g } = this;
    let T = f ? g.post : g.rules.find(({ type: y }) => y === N);
    if (T || (T = { type: N, rules: [] }, g.rules.push(T)), g.keywords[C] = !0, !b)
      return;
    const w = {
      keyword: C,
      definition: {
        ...b,
        type: (0, u.getJSONTypes)(b.type),
        schemaType: (0, u.getJSONTypes)(b.schemaType)
      }
    };
    b.before ? B.call(this, T, w, b.before) : T.rules.push(w), g.all[C] = w, (S = b.implements) === null || S === void 0 || S.forEach((y) => this.addKeyword(y));
  }
  function B(C, b, N) {
    const S = C.rules.findIndex((f) => f.keyword === N);
    S >= 0 ? C.rules.splice(S, 0, b) : (C.rules.push(b), this.logger.warn(`rule ${N} is not defined`));
  }
  function M(C) {
    let { metaSchema: b } = C;
    b !== void 0 && (C.$data && this.opts.$data && (b = V(b)), C.validateSchema = this.compile(b, !0));
  }
  const H = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function V(C) {
    return { anyOf: [C, H] };
  }
})(_y);
var wu = {}, Eu = {}, bu = {};
Object.defineProperty(bu, "__esModule", { value: !0 });
const Nb = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
bu.default = Nb;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
Ir.callRef = Ir.getValidate = void 0;
const Ob = Di, vh = he, wt = le(), Qn = Ct, $h = dt, mo = W, Ab = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: s, validateName: o, opts: a, self: c } = n, { root: u } = s;
    if ((r === "#" || r === "#/") && i === u.baseId)
      return d();
    const l = $h.resolveRef.call(c, u, i, r);
    if (l === void 0)
      throw new Ob.default(n.opts.uriResolver, i, r);
    if (l instanceof $h.SchemaEnv)
      return h(l);
    return p(l);
    function d() {
      if (s === u)
        return Ko(e, o, s, s.$async);
      const $ = t.scopeValue("root", { ref: u });
      return Ko(e, (0, wt._)`${$}.validate`, u, u.$async);
    }
    function h($) {
      const _ = cg(e, $);
      Ko(e, _, $, $.$async);
    }
    function p($) {
      const _ = t.scopeValue("schema", a.code.source === !0 ? { ref: $, code: (0, wt.stringify)($) } : { ref: $ }), v = t.name("valid"), m = e.subschema({
        schema: $,
        dataTypes: [],
        schemaPath: wt.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(m), e.ok(v);
    }
  }
};
function cg(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, wt._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Ir.getValidate = cg;
function Ko(e, t, r, n) {
  const { gen: i, it: s } = e, { allErrors: o, schemaEnv: a, opts: c } = s, u = c.passContext ? Qn.default.this : wt.nil;
  n ? l() : d();
  function l() {
    if (!a.$async)
      throw new Error("async schema referenced by sync schema");
    const $ = i.let("valid");
    i.try(() => {
      i.code((0, wt._)`await ${(0, vh.callValidateCode)(e, t, u)}`), p(t), o || i.assign($, !0);
    }, (_) => {
      i.if((0, wt._)`!(${_} instanceof ${s.ValidationError})`, () => i.throw(_)), h(_), o || i.assign($, !1);
    }), e.ok($);
  }
  function d() {
    e.result((0, vh.callValidateCode)(e, t, u), () => p(t), () => h(t));
  }
  function h($) {
    const _ = (0, wt._)`${$}.errors`;
    i.assign(Qn.default.vErrors, (0, wt._)`${Qn.default.vErrors} === null ? ${_} : ${Qn.default.vErrors}.concat(${_})`), i.assign(Qn.default.errors, (0, wt._)`${Qn.default.vErrors}.length`);
  }
  function p($) {
    var _;
    if (!s.opts.unevaluated)
      return;
    const v = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (s.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (s.props = mo.mergeEvaluated.props(i, v.props, s.props));
      else {
        const m = i.var("props", (0, wt._)`${$}.evaluated.props`);
        s.props = mo.mergeEvaluated.props(i, m, s.props, wt.Name);
      }
    if (s.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (s.items = mo.mergeEvaluated.items(i, v.items, s.items));
      else {
        const m = i.var("items", (0, wt._)`${$}.evaluated.items`);
        s.items = mo.mergeEvaluated.items(i, m, s.items, wt.Name);
      }
  }
}
Ir.callRef = Ko;
Ir.default = Ab;
Object.defineProperty(Eu, "__esModule", { value: !0 });
const Rb = bu, Cb = Ir, Ib = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Rb.default,
  Cb.default
];
Eu.default = Ib;
var Su = {}, Pu = {};
Object.defineProperty(Pu, "__esModule", { value: !0 });
const ua = le(), Br = ua.operators, da = {
  maximum: { okStr: "<=", ok: Br.LTE, fail: Br.GT },
  minimum: { okStr: ">=", ok: Br.GTE, fail: Br.LT },
  exclusiveMaximum: { okStr: "<", ok: Br.LT, fail: Br.GTE },
  exclusiveMinimum: { okStr: ">", ok: Br.GT, fail: Br.LTE }
}, Db = {
  message: ({ keyword: e, schemaCode: t }) => (0, ua.str)`must be ${da[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, ua._)`{comparison: ${da[e].okStr}, limit: ${t}}`
}, kb = {
  keyword: Object.keys(da),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Db,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, ua._)`${r} ${da[t].fail} ${n} || isNaN(${r})`);
  }
};
Pu.default = kb;
var Tu = {};
Object.defineProperty(Tu, "__esModule", { value: !0 });
const ds = le(), Fb = {
  message: ({ schemaCode: e }) => (0, ds.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, ds._)`{multipleOf: ${e}}`
}, jb = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Fb,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, s = i.opts.multipleOfPrecision, o = t.let("res"), a = s ? (0, ds._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${s}` : (0, ds._)`${o} !== parseInt(${o})`;
    e.fail$data((0, ds._)`(${n} === 0 || (${o} = ${r}/${n}, ${a}))`);
  }
};
Tu.default = jb;
var Nu = {}, Ou = {};
Object.defineProperty(Ou, "__esModule", { value: !0 });
function lg(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Ou.default = lg;
lg.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Nu, "__esModule", { value: !0 });
const An = le(), Ub = W, Mb = Ou, Lb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, An.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, An._)`{limit: ${e}}`
}, xb = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Lb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, s = t === "maxLength" ? An.operators.GT : An.operators.LT, o = i.opts.unicode === !1 ? (0, An._)`${r}.length` : (0, An._)`${(0, Ub.useFunc)(e.gen, Mb.default)}(${r})`;
    e.fail$data((0, An._)`${o} ${s} ${n}`);
  }
};
Nu.default = xb;
var Au = {};
Object.defineProperty(Au, "__esModule", { value: !0 });
const Vb = he, fa = le(), qb = {
  message: ({ schemaCode: e }) => (0, fa.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, fa._)`{pattern: ${e}}`
}, Bb = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: qb,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: i, it: s } = e, o = s.opts.unicodeRegExp ? "u" : "", a = r ? (0, fa._)`(new RegExp(${i}, ${o}))` : (0, Vb.usePattern)(e, n);
    e.fail$data((0, fa._)`!${a}.test(${t})`);
  }
};
Au.default = Bb;
var Ru = {};
Object.defineProperty(Ru, "__esModule", { value: !0 });
const fs = le(), Hb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, fs.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, fs._)`{limit: ${e}}`
}, zb = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Hb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? fs.operators.GT : fs.operators.LT;
    e.fail$data((0, fs._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
Ru.default = zb;
var Cu = {};
Object.defineProperty(Cu, "__esModule", { value: !0 });
const Ji = he, hs = le(), Gb = W, Wb = {
  message: ({ params: { missingProperty: e } }) => (0, hs.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, hs._)`{missingProperty: ${e}}`
}, Kb = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Wb,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: i, $data: s, it: o } = e, { opts: a } = o;
    if (!s && r.length === 0)
      return;
    const c = r.length >= a.loopRequired;
    if (o.allErrors ? u() : l(), a.strictRequired) {
      const p = e.parentSchema.properties, { definedProperties: $ } = e.it;
      for (const _ of r)
        if ((p == null ? void 0 : p[_]) === void 0 && !$.has(_)) {
          const v = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${v}" (strictRequired)`;
          (0, Gb.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function u() {
      if (c || s)
        e.block$data(hs.nil, d);
      else
        for (const p of r)
          (0, Ji.checkReportMissingProp)(e, p);
    }
    function l() {
      const p = t.let("missing");
      if (c || s) {
        const $ = t.let("valid", !0);
        e.block$data($, () => h(p, $)), e.ok($);
      } else
        t.if((0, Ji.checkMissingProp)(e, r, p)), (0, Ji.reportMissingProp)(e, p), t.else();
    }
    function d() {
      t.forOf("prop", n, (p) => {
        e.setParams({ missingProperty: p }), t.if((0, Ji.noPropertyInData)(t, i, p, a.ownProperties), () => e.error());
      });
    }
    function h(p, $) {
      e.setParams({ missingProperty: p }), t.forOf(p, n, () => {
        t.assign($, (0, Ji.propertyInData)(t, i, p, a.ownProperties)), t.if((0, hs.not)($), () => {
          e.error(), t.break();
        });
      }, hs.nil);
    }
  }
};
Cu.default = Kb;
var Iu = {};
Object.defineProperty(Iu, "__esModule", { value: !0 });
const ps = le(), Yb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, ps.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, ps._)`{limit: ${e}}`
}, Xb = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Yb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? ps.operators.GT : ps.operators.LT;
    e.fail$data((0, ps._)`${r}.length ${i} ${n}`);
  }
};
Iu.default = Xb;
var Du = {}, Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
const ug = Fa;
ug.code = 'require("ajv/dist/runtime/equal").default';
Hs.default = ug;
Object.defineProperty(Du, "__esModule", { value: !0 });
const Ic = Me, ze = le(), Jb = W, Qb = Hs, Zb = {
  message: ({ params: { i: e, j: t } }) => (0, ze.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ze._)`{i: ${e}, j: ${t}}`
}, eS = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Zb,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: s, schemaCode: o, it: a } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), u = s.items ? (0, Ic.getSchemaTypes)(s.items) : [];
    e.block$data(c, l, (0, ze._)`${o} === false`), e.ok(c);
    function l() {
      const $ = t.let("i", (0, ze._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: $, j: _ }), t.assign(c, !0), t.if((0, ze._)`${$} > 1`, () => (d() ? h : p)($, _));
    }
    function d() {
      return u.length > 0 && !u.some(($) => $ === "object" || $ === "array");
    }
    function h($, _) {
      const v = t.name("item"), m = (0, Ic.checkDataTypes)(u, v, a.opts.strictNumbers, Ic.DataType.Wrong), E = t.const("indices", (0, ze._)`{}`);
      t.for((0, ze._)`;${$}--;`, () => {
        t.let(v, (0, ze._)`${r}[${$}]`), t.if(m, (0, ze._)`continue`), u.length > 1 && t.if((0, ze._)`typeof ${v} == "string"`, (0, ze._)`${v} += "_"`), t.if((0, ze._)`typeof ${E}[${v}] == "number"`, () => {
          t.assign(_, (0, ze._)`${E}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ze._)`${E}[${v}] = ${$}`);
      });
    }
    function p($, _) {
      const v = (0, Jb.useFunc)(t, Qb.default), m = t.name("outer");
      t.label(m).for((0, ze._)`;${$}--;`, () => t.for((0, ze._)`${_} = ${$}; ${_}--;`, () => t.if((0, ze._)`${v}(${r}[${$}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Du.default = eS;
var ku = {};
Object.defineProperty(ku, "__esModule", { value: !0 });
const Ol = le(), tS = W, rS = Hs, nS = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ol._)`{allowedValue: ${e}}`
}, iS = {
  keyword: "const",
  $data: !0,
  error: nS,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: s } = e;
    n || s && typeof s == "object" ? e.fail$data((0, Ol._)`!${(0, tS.useFunc)(t, rS.default)}(${r}, ${i})`) : e.fail((0, Ol._)`${s} !== ${r}`);
  }
};
ku.default = iS;
var Fu = {};
Object.defineProperty(Fu, "__esModule", { value: !0 });
const os = le(), sS = W, oS = Hs, aS = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, os._)`{allowedValues: ${e}}`
}, cS = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: aS,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: o } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const a = i.length >= o.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, sS.useFunc)(t, oS.default));
    let l;
    if (a || n)
      l = t.let("valid"), e.block$data(l, d);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const p = t.const("vSchema", s);
      l = (0, os.or)(...i.map(($, _) => h(p, _)));
    }
    e.pass(l);
    function d() {
      t.assign(l, !1), t.forOf("v", s, (p) => t.if((0, os._)`${u()}(${r}, ${p})`, () => t.assign(l, !0).break()));
    }
    function h(p, $) {
      const _ = i[$];
      return typeof _ == "object" && _ !== null ? (0, os._)`${u()}(${r}, ${p}[${$}])` : (0, os._)`${r} === ${_}`;
    }
  }
};
Fu.default = cS;
Object.defineProperty(Su, "__esModule", { value: !0 });
const lS = Pu, uS = Tu, dS = Nu, fS = Au, hS = Ru, pS = Cu, mS = Iu, yS = Du, gS = ku, _S = Fu, vS = [
  // number
  lS.default,
  uS.default,
  // string
  dS.default,
  fS.default,
  // object
  hS.default,
  pS.default,
  // array
  mS.default,
  yS.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  gS.default,
  _S.default
];
Su.default = vS;
var ju = {}, ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.validateAdditionalItems = void 0;
const Rn = le(), Al = W, $S = {
  message: ({ params: { len: e } }) => (0, Rn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Rn._)`{limit: ${e}}`
}, wS = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: $S,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Al.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    dg(e, n);
  }
};
function dg(e, t) {
  const { gen: r, schema: n, data: i, keyword: s, it: o } = e;
  o.items = !0;
  const a = r.const("len", (0, Rn._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Rn._)`${a} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Al.alwaysValidSchema)(o, n)) {
    const u = r.var("valid", (0, Rn._)`${a} <= ${t.length}`);
    r.if((0, Rn.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    r.forRange("i", t.length, a, (l) => {
      e.subschema({ keyword: s, dataProp: l, dataPropType: Al.Type.Num }, u), o.allErrors || r.if((0, Rn.not)(u), () => r.break());
    });
  }
}
ki.validateAdditionalItems = dg;
ki.default = wS;
var Uu = {}, Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.validateTuple = void 0;
const wh = le(), Yo = W, ES = he, bS = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return fg(e, "additionalItems", t);
    r.items = !0, !(0, Yo.alwaysValidSchema)(r, t) && e.ok((0, ES.validateArray)(e));
  }
};
function fg(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: o, it: a } = e;
  l(i), a.opts.unevaluated && r.length && a.items !== !0 && (a.items = Yo.mergeEvaluated.items(n, r.length, a.items));
  const c = n.name("valid"), u = n.const("len", (0, wh._)`${s}.length`);
  r.forEach((d, h) => {
    (0, Yo.alwaysValidSchema)(a, d) || (n.if((0, wh._)`${u} > ${h}`, () => e.subschema({
      keyword: o,
      schemaProp: h,
      dataProp: h
    }, c)), e.ok(c));
  });
  function l(d) {
    const { opts: h, errSchemaPath: p } = a, $ = r.length, _ = $ === d.minItems && ($ === d.maxItems || d[t] === !1);
    if (h.strictTuples && !_) {
      const v = `"${o}" is ${$}-tuple, but minItems or maxItems/${t} are not specified or different at path "${p}"`;
      (0, Yo.checkStrictMode)(a, v, h.strictTuples);
    }
  }
}
Fi.validateTuple = fg;
Fi.default = bS;
Object.defineProperty(Uu, "__esModule", { value: !0 });
const SS = Fi, PS = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, SS.validateTuple)(e, "items")
};
Uu.default = PS;
var Mu = {};
Object.defineProperty(Mu, "__esModule", { value: !0 });
const Eh = le(), TS = W, NS = he, OS = ki, AS = {
  message: ({ params: { len: e } }) => (0, Eh.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Eh._)`{limit: ${e}}`
}, RS = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: AS,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, TS.alwaysValidSchema)(n, t) && (i ? (0, OS.validateAdditionalItems)(e, i) : e.ok((0, NS.validateArray)(e)));
  }
};
Mu.default = RS;
var Lu = {};
Object.defineProperty(Lu, "__esModule", { value: !0 });
const Mt = le(), yo = W, CS = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Mt.str)`must contain at least ${e} valid item(s)` : (0, Mt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Mt._)`{minContains: ${e}}` : (0, Mt._)`{minContains: ${e}, maxContains: ${t}}`
}, IS = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: CS,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    let o, a;
    const { minContains: c, maxContains: u } = n;
    s.opts.next ? (o = c === void 0 ? 1 : c, a = u) : o = 1;
    const l = t.const("len", (0, Mt._)`${i}.length`);
    if (e.setParams({ min: o, max: a }), a === void 0 && o === 0) {
      (0, yo.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (a !== void 0 && o > a) {
      (0, yo.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, yo.alwaysValidSchema)(s, r)) {
      let _ = (0, Mt._)`${l} >= ${o}`;
      a !== void 0 && (_ = (0, Mt._)`${_} && ${l} <= ${a}`), e.pass(_);
      return;
    }
    s.items = !0;
    const d = t.name("valid");
    a === void 0 && o === 1 ? p(d, () => t.if(d, () => t.break())) : o === 0 ? (t.let(d, !0), a !== void 0 && t.if((0, Mt._)`${i}.length > 0`, h)) : (t.let(d, !1), h()), e.result(d, () => e.reset());
    function h() {
      const _ = t.name("_valid"), v = t.let("count", 0);
      p(_, () => t.if(_, () => $(v)));
    }
    function p(_, v) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: yo.Type.Num,
          compositeRule: !0
        }, _), v();
      });
    }
    function $(_) {
      t.code((0, Mt._)`${_}++`), a === void 0 ? t.if((0, Mt._)`${_} >= ${o}`, () => t.assign(d, !0).break()) : (t.if((0, Mt._)`${_} > ${a}`, () => t.assign(d, !1).break()), o === 1 ? t.assign(d, !0) : t.if((0, Mt._)`${_} >= ${o}`, () => t.assign(d, !0)));
    }
  }
};
Lu.default = IS;
var La = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = le(), r = W, n = he;
  e.error = {
    message: ({ params: { property: c, depsCount: u, deps: l } }) => {
      const d = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${d} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: u, deps: l, missingProperty: d } }) => (0, t._)`{property: ${c},
    missingProperty: ${d},
    depsCount: ${u},
    deps: ${l}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [u, l] = s(c);
      o(c, u), a(c, l);
    }
  };
  function s({ schema: c }) {
    const u = {}, l = {};
    for (const d in c) {
      if (d === "__proto__")
        continue;
      const h = Array.isArray(c[d]) ? u : l;
      h[d] = c[d];
    }
    return [u, l];
  }
  function o(c, u = c.schema) {
    const { gen: l, data: d, it: h } = c;
    if (Object.keys(u).length === 0)
      return;
    const p = l.let("missing");
    for (const $ in u) {
      const _ = u[$];
      if (_.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, d, $, h.opts.ownProperties);
      c.setParams({
        property: $,
        depsCount: _.length,
        deps: _.join(", ")
      }), h.allErrors ? l.if(v, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${v} && (${(0, n.checkMissingProp)(c, _, p)})`), (0, n.reportMissingProp)(c, p), l.else());
    }
  }
  e.validatePropertyDeps = o;
  function a(c, u = c.schema) {
    const { gen: l, data: d, keyword: h, it: p } = c, $ = l.name("valid");
    for (const _ in u)
      (0, r.alwaysValidSchema)(p, u[_]) || (l.if(
        (0, n.propertyInData)(l, d, _, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: h, schemaProp: _ }, $);
          c.mergeValidEvaluated(v, $);
        },
        () => l.var($, !0)
        // TODO var
      ), c.ok($));
  }
  e.validateSchemaDeps = a, e.default = i;
})(La);
var xu = {};
Object.defineProperty(xu, "__esModule", { value: !0 });
const hg = le(), DS = W, kS = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, hg._)`{propertyName: ${e.propertyName}}`
}, FS = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: kS,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, DS.alwaysValidSchema)(i, r))
      return;
    const s = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, s), t.if((0, hg.not)(s), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(s);
  }
};
xu.default = FS;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const go = he, Wt = le(), jS = Ct, _o = W, US = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Wt._)`{additionalProperty: ${e.additionalProperty}}`
}, MS = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: US,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, _o.alwaysValidSchema)(o, r))
      return;
    const u = (0, go.allSchemaProperties)(n.properties), l = (0, go.allSchemaProperties)(n.patternProperties);
    d(), e.ok((0, Wt._)`${s} === ${jS.default.errors}`);
    function d() {
      t.forIn("key", i, (v) => {
        !u.length && !l.length ? $(v) : t.if(h(v), () => $(v));
      });
    }
    function h(v) {
      let m;
      if (u.length > 8) {
        const E = (0, _o.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, go.isOwnProperty)(t, E, v);
      } else u.length ? m = (0, Wt.or)(...u.map((E) => (0, Wt._)`${v} === ${E}`)) : m = Wt.nil;
      return l.length && (m = (0, Wt.or)(m, ...l.map((E) => (0, Wt._)`${(0, go.usePattern)(e, E)}.test(${v})`))), (0, Wt.not)(m);
    }
    function p(v) {
      t.code((0, Wt._)`delete ${i}[${v}]`);
    }
    function $(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        p(v);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: v }), e.error(), a || t.break();
        return;
      }
      if (typeof r == "object" && !(0, _o.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(v, m, !1), t.if((0, Wt.not)(m), () => {
          e.reset(), p(v);
        })) : (_(v, m), a || t.if((0, Wt.not)(m), () => t.break()));
      }
    }
    function _(v, m, E) {
      const A = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: _o.Type.Str
      };
      E === !1 && Object.assign(A, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(A, m);
    }
  }
};
xa.default = MS;
var Vu = {};
Object.defineProperty(Vu, "__esModule", { value: !0 });
const LS = Zt, bh = he, Dc = W, Sh = xa, xS = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Sh.default.code(new LS.KeywordCxt(s, Sh.default, "additionalProperties"));
    const o = (0, bh.allSchemaProperties)(r);
    for (const d of o)
      s.definedProperties.add(d);
    s.opts.unevaluated && o.length && s.props !== !0 && (s.props = Dc.mergeEvaluated.props(t, (0, Dc.toHash)(o), s.props));
    const a = o.filter((d) => !(0, Dc.alwaysValidSchema)(s, r[d]));
    if (a.length === 0)
      return;
    const c = t.name("valid");
    for (const d of a)
      u(d) ? l(d) : (t.if((0, bh.propertyInData)(t, i, d, s.opts.ownProperties)), l(d), s.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(d), e.ok(c);
    function u(d) {
      return s.opts.useDefaults && !s.compositeRule && r[d].default !== void 0;
    }
    function l(d) {
      e.subschema({
        keyword: "properties",
        schemaProp: d,
        dataProp: d
      }, c);
    }
  }
};
Vu.default = xS;
var qu = {};
Object.defineProperty(qu, "__esModule", { value: !0 });
const Ph = he, vo = le(), Th = W, Nh = W, VS = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: s } = e, { opts: o } = s, a = (0, Ph.allSchemaProperties)(r), c = a.filter((_) => (0, Th.alwaysValidSchema)(s, r[_]));
    if (a.length === 0 || c.length === a.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const u = o.strictSchema && !o.allowMatchingProperties && i.properties, l = t.name("valid");
    s.props !== !0 && !(s.props instanceof vo.Name) && (s.props = (0, Nh.evaluatedPropsToName)(t, s.props));
    const { props: d } = s;
    h();
    function h() {
      for (const _ of a)
        u && p(_), s.allErrors ? $(_) : (t.var(l, !0), $(_), t.if(l));
    }
    function p(_) {
      for (const v in u)
        new RegExp(_).test(v) && (0, Th.checkStrictMode)(s, `property ${v} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function $(_) {
      t.forIn("key", n, (v) => {
        t.if((0, vo._)`${(0, Ph.usePattern)(e, _)}.test(${v})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: v,
            dataPropType: Nh.Type.Str
          }, l), s.opts.unevaluated && d !== !0 ? t.assign((0, vo._)`${d}[${v}]`, !0) : !m && !s.allErrors && t.if((0, vo.not)(l), () => t.break());
        });
      });
    }
  }
};
qu.default = VS;
var Bu = {};
Object.defineProperty(Bu, "__esModule", { value: !0 });
const qS = W, BS = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, qS.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Bu.default = BS;
var Hu = {};
Object.defineProperty(Hu, "__esModule", { value: !0 });
const HS = he, zS = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: HS.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Hu.default = zS;
var zu = {};
Object.defineProperty(zu, "__esModule", { value: !0 });
const Xo = le(), GS = W, WS = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Xo._)`{passingSchemas: ${e.passing}}`
}, KS = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: WS,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: i } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const s = r, o = t.let("valid", !1), a = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: a }), t.block(u), e.result(o, () => e.reset(), () => e.error(!0));
    function u() {
      s.forEach((l, d) => {
        let h;
        (0, GS.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
          keyword: "oneOf",
          schemaProp: d,
          compositeRule: !0
        }, c), d > 0 && t.if((0, Xo._)`${c} && ${o}`).assign(o, !1).assign(a, (0, Xo._)`[${a}, ${d}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(a, d), h && e.mergeEvaluated(h, Xo.Name);
        });
      });
    }
  }
};
zu.default = KS;
var Gu = {};
Object.defineProperty(Gu, "__esModule", { value: !0 });
const YS = W, XS = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((s, o) => {
      if ((0, YS.alwaysValidSchema)(n, s))
        return;
      const a = e.subschema({ keyword: "allOf", schemaProp: o }, i);
      e.ok(i), e.mergeEvaluated(a);
    });
  }
};
Gu.default = XS;
var Wu = {};
Object.defineProperty(Wu, "__esModule", { value: !0 });
const ha = le(), pg = W, JS = {
  message: ({ params: e }) => (0, ha.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ha._)`{failingKeyword: ${e.ifClause}}`
}, QS = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: JS,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, pg.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = Oh(n, "then"), s = Oh(n, "else");
    if (!i && !s)
      return;
    const o = t.let("valid", !0), a = t.name("_valid");
    if (c(), e.reset(), i && s) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(a, u("then", l), u("else", l));
    } else i ? t.if(a, u("then")) : t.if((0, ha.not)(a), u("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, a);
      e.mergeEvaluated(l);
    }
    function u(l, d) {
      return () => {
        const h = e.subschema({ keyword: l }, a);
        t.assign(o, a), e.mergeValidEvaluated(h, o), d ? t.assign(d, (0, ha._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Oh(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, pg.alwaysValidSchema)(e, r);
}
Wu.default = QS;
var Ku = {};
Object.defineProperty(Ku, "__esModule", { value: !0 });
const ZS = W, eP = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, ZS.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Ku.default = eP;
Object.defineProperty(ju, "__esModule", { value: !0 });
const tP = ki, rP = Uu, nP = Fi, iP = Mu, sP = Lu, oP = La, aP = xu, cP = xa, lP = Vu, uP = qu, dP = Bu, fP = Hu, hP = zu, pP = Gu, mP = Wu, yP = Ku;
function gP(e = !1) {
  const t = [
    // any
    dP.default,
    fP.default,
    hP.default,
    pP.default,
    mP.default,
    yP.default,
    // object
    aP.default,
    cP.default,
    oP.default,
    lP.default,
    uP.default
  ];
  return e ? t.push(rP.default, iP.default) : t.push(tP.default, nP.default), t.push(sP.default), t;
}
ju.default = gP;
var Yu = {}, ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.dynamicAnchor = void 0;
const kc = le(), _P = Ct, Ah = dt, vP = Ir, $P = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => mg(e, e.schema)
};
function mg(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const i = (0, kc._)`${_P.default.dynamicAnchors}${(0, kc.getProperty)(t)}`, s = n.errSchemaPath === "#" ? n.validateName : wP(e);
  r.if((0, kc._)`!${i}`, () => r.assign(i, s));
}
ji.dynamicAnchor = mg;
function wP(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: i, baseId: s, localRefs: o, meta: a } = t.root, { schemaId: c } = n.opts, u = new Ah.SchemaEnv({ schema: r, schemaId: c, root: i, baseId: s, localRefs: o, meta: a });
  return Ah.compileSchema.call(n, u), (0, vP.getValidate)(e, u);
}
ji.default = $P;
var Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.dynamicRef = void 0;
const Rh = le(), EP = Ct, Ch = Ir, bP = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => yg(e, e.schema)
};
function yg(e, t) {
  const { gen: r, keyword: n, it: i } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const s = t.slice(1);
  if (i.allErrors)
    o();
  else {
    const c = r.let("valid", !1);
    o(c), e.ok(c);
  }
  function o(c) {
    if (i.schemaEnv.root.dynamicAnchors[s]) {
      const u = r.let("_v", (0, Rh._)`${EP.default.dynamicAnchors}${(0, Rh.getProperty)(s)}`);
      r.if(u, a(u, c), a(i.validateName, c));
    } else
      a(i.validateName, c)();
  }
  function a(c, u) {
    return u ? () => r.block(() => {
      (0, Ch.callRef)(e, c), r.let(u, !0);
    }) : () => (0, Ch.callRef)(e, c);
  }
}
Ui.dynamicRef = yg;
Ui.default = bP;
var Xu = {};
Object.defineProperty(Xu, "__esModule", { value: !0 });
const SP = ji, PP = W, TP = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, SP.dynamicAnchor)(e, "") : (0, PP.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
Xu.default = TP;
var Ju = {};
Object.defineProperty(Ju, "__esModule", { value: !0 });
const NP = Ui, OP = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, NP.dynamicRef)(e, e.schema)
};
Ju.default = OP;
Object.defineProperty(Yu, "__esModule", { value: !0 });
const AP = ji, RP = Ui, CP = Xu, IP = Ju, DP = [AP.default, RP.default, CP.default, IP.default];
Yu.default = DP;
var Qu = {}, Zu = {};
Object.defineProperty(Zu, "__esModule", { value: !0 });
const Ih = La, kP = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Ih.error,
  code: (e) => (0, Ih.validatePropertyDeps)(e)
};
Zu.default = kP;
var ed = {};
Object.defineProperty(ed, "__esModule", { value: !0 });
const FP = La, jP = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, FP.validateSchemaDeps)(e)
};
ed.default = jP;
var td = {};
Object.defineProperty(td, "__esModule", { value: !0 });
const UP = W, MP = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, UP.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
td.default = MP;
Object.defineProperty(Qu, "__esModule", { value: !0 });
const LP = Zu, xP = ed, VP = td, qP = [LP.default, xP.default, VP.default];
Qu.default = qP;
var rd = {}, nd = {};
Object.defineProperty(nd, "__esModule", { value: !0 });
const Kr = le(), Dh = W, BP = Ct, HP = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Kr._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, zP = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: HP,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: i, it: s } = e;
    if (!i)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: a } = s;
    a instanceof Kr.Name ? t.if((0, Kr._)`${a} !== true`, () => t.forIn("key", n, (d) => t.if(u(a, d), () => c(d)))) : a !== !0 && t.forIn("key", n, (d) => a === void 0 ? c(d) : t.if(l(a, d), () => c(d))), s.props = !0, e.ok((0, Kr._)`${i} === ${BP.default.errors}`);
    function c(d) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: d }), e.error(), o || t.break();
        return;
      }
      if (!(0, Dh.alwaysValidSchema)(s, r)) {
        const h = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: d,
          dataPropType: Dh.Type.Str
        }, h), o || t.if((0, Kr.not)(h), () => t.break());
      }
    }
    function u(d, h) {
      return (0, Kr._)`!${d} || !${d}[${h}]`;
    }
    function l(d, h) {
      const p = [];
      for (const $ in d)
        d[$] === !0 && p.push((0, Kr._)`${h} !== ${$}`);
      return (0, Kr.and)(...p);
    }
  }
};
nd.default = zP;
var id = {};
Object.defineProperty(id, "__esModule", { value: !0 });
const Cn = le(), kh = W, GP = {
  message: ({ params: { len: e } }) => (0, Cn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Cn._)`{limit: ${e}}`
}, WP = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: GP,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e, s = i.items || 0;
    if (s === !0)
      return;
    const o = t.const("len", (0, Cn._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: s }), e.fail((0, Cn._)`${o} > ${s}`);
    else if (typeof r == "object" && !(0, kh.alwaysValidSchema)(i, r)) {
      const c = t.var("valid", (0, Cn._)`${o} <= ${s}`);
      t.if((0, Cn.not)(c), () => a(c, s)), e.ok(c);
    }
    i.items = !0;
    function a(c, u) {
      t.forRange("i", u, o, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: kh.Type.Num }, c), i.allErrors || t.if((0, Cn.not)(c), () => t.break());
      });
    }
  }
};
id.default = WP;
Object.defineProperty(rd, "__esModule", { value: !0 });
const KP = nd, YP = id, XP = [KP.default, YP.default];
rd.default = XP;
var sd = {}, od = {};
Object.defineProperty(od, "__esModule", { value: !0 });
const De = le(), JP = {
  message: ({ schemaCode: e }) => (0, De.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, De._)`{format: ${e}}`
}, QP = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: JP,
  code(e, t) {
    const { gen: r, data: n, $data: i, schema: s, schemaCode: o, it: a } = e, { opts: c, errSchemaPath: u, schemaEnv: l, self: d } = a;
    if (!c.validateFormats)
      return;
    i ? h() : p();
    function h() {
      const $ = r.scopeValue("formats", {
        ref: d.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, De._)`${$}[${o}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, De._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(v, (0, De._)`${_}.type || "string"`).assign(m, (0, De._)`${_}.validate`), () => r.assign(v, (0, De._)`"string"`).assign(m, _)), e.fail$data((0, De.or)(E(), A()));
      function E() {
        return c.strictSchema === !1 ? De.nil : (0, De._)`${o} && !${m}`;
      }
      function A() {
        const I = l.$async ? (0, De._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, De._)`${m}(${n})`, F = (0, De._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
        return (0, De._)`${m} && ${m} !== true && ${v} === ${t} && !${F}`;
      }
    }
    function p() {
      const $ = d.formats[s];
      if (!$) {
        E();
        return;
      }
      if ($ === !0)
        return;
      const [_, v, m] = A($);
      _ === t && e.pass(I());
      function E() {
        if (c.strictSchema === !1) {
          d.logger.warn(F());
          return;
        }
        throw new Error(F());
        function F() {
          return `unknown format "${s}" ignored in schema at path "${u}"`;
        }
      }
      function A(F) {
        const z = F instanceof RegExp ? (0, De.regexpCode)(F) : c.code.formats ? (0, De._)`${c.code.formats}${(0, De.getProperty)(s)}` : void 0, G = r.scopeValue("formats", { key: s, ref: F, code: z });
        return typeof F == "object" && !(F instanceof RegExp) ? [F.type || "string", F.validate, (0, De._)`${G}.validate`] : ["string", F, G];
      }
      function I() {
        if (typeof $ == "object" && !($ instanceof RegExp) && $.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, De._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, De._)`${m}(${n})` : (0, De._)`${m}.test(${n})`;
      }
    }
  }
};
od.default = QP;
Object.defineProperty(sd, "__esModule", { value: !0 });
const ZP = od, e1 = [ZP.default];
sd.default = e1;
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.contentVocabulary = Ti.metadataVocabulary = void 0;
Ti.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ti.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(wu, "__esModule", { value: !0 });
const t1 = Eu, r1 = Su, n1 = ju, i1 = Yu, s1 = Qu, o1 = rd, a1 = sd, Fh = Ti, c1 = [
  i1.default,
  t1.default,
  r1.default,
  (0, n1.default)(!0),
  a1.default,
  Fh.metadataVocabulary,
  Fh.contentVocabulary,
  s1.default,
  o1.default
];
wu.default = c1;
var ad = {}, Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
Va.DiscrError = void 0;
var jh;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(jh || (Va.DiscrError = jh = {}));
Object.defineProperty(ad, "__esModule", { value: !0 });
const ai = le(), Rl = Va, Uh = dt, l1 = Di, u1 = W, d1 = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Rl.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, ai._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, f1 = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: d1,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: i, it: s } = e, { oneOf: o } = i;
    if (!s.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const a = n.propertyName;
    if (typeof a != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), u = t.const("tag", (0, ai._)`${r}${(0, ai.getProperty)(a)}`);
    t.if((0, ai._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: Rl.DiscrError.Tag, tag: u, tagName: a })), e.ok(c);
    function l() {
      const p = h();
      t.if(!1);
      for (const $ in p)
        t.elseIf((0, ai._)`${u} === ${$}`), t.assign(c, d(p[$]));
      t.else(), e.error(!1, { discrError: Rl.DiscrError.Mapping, tag: u, tagName: a }), t.endIf();
    }
    function d(p) {
      const $ = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: p }, $);
      return e.mergeEvaluated(_, ai.Name), $;
    }
    function h() {
      var p;
      const $ = {}, _ = m(i);
      let v = !0;
      for (let I = 0; I < o.length; I++) {
        let F = o[I];
        if (F != null && F.$ref && !(0, u1.schemaHasRulesButRef)(F, s.self.RULES)) {
          const G = F.$ref;
          if (F = Uh.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, G), F instanceof Uh.SchemaEnv && (F = F.schema), F === void 0)
            throw new l1.default(s.opts.uriResolver, s.baseId, G);
        }
        const z = (p = F == null ? void 0 : F.properties) === null || p === void 0 ? void 0 : p[a];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${a}"`);
        v = v && (_ || m(F)), E(z, I);
      }
      if (!v)
        throw new Error(`discriminator: "${a}" must be required`);
      return $;
      function m({ required: I }) {
        return Array.isArray(I) && I.includes(a);
      }
      function E(I, F) {
        if (I.const)
          A(I.const, F);
        else if (I.enum)
          for (const z of I.enum)
            A(z, F);
        else
          throw new Error(`discriminator: "properties/${a}" must have "const" or "enum"`);
      }
      function A(I, F) {
        if (typeof I != "string" || I in $)
          throw new Error(`discriminator: "${a}" values must be unique strings`);
        $[I] = F;
      }
    }
  }
};
ad.default = f1;
var cd = {};
const h1 = "https://json-schema.org/draft/2020-12/schema", p1 = "https://json-schema.org/draft/2020-12/schema", m1 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, y1 = "meta", g1 = "Core and Validation specifications meta-schema", _1 = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], v1 = [
  "object",
  "boolean"
], $1 = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", w1 = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, E1 = {
  $schema: h1,
  $id: p1,
  $vocabulary: m1,
  $dynamicAnchor: y1,
  title: g1,
  allOf: _1,
  type: v1,
  $comment: $1,
  properties: w1
}, b1 = "https://json-schema.org/draft/2020-12/schema", S1 = "https://json-schema.org/draft/2020-12/meta/applicator", P1 = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, T1 = "meta", N1 = "Applicator vocabulary meta-schema", O1 = [
  "object",
  "boolean"
], A1 = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, R1 = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, C1 = {
  $schema: b1,
  $id: S1,
  $vocabulary: P1,
  $dynamicAnchor: T1,
  title: N1,
  type: O1,
  properties: A1,
  $defs: R1
}, I1 = "https://json-schema.org/draft/2020-12/schema", D1 = "https://json-schema.org/draft/2020-12/meta/unevaluated", k1 = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, F1 = "meta", j1 = "Unevaluated applicator vocabulary meta-schema", U1 = [
  "object",
  "boolean"
], M1 = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, L1 = {
  $schema: I1,
  $id: D1,
  $vocabulary: k1,
  $dynamicAnchor: F1,
  title: j1,
  type: U1,
  properties: M1
}, x1 = "https://json-schema.org/draft/2020-12/schema", V1 = "https://json-schema.org/draft/2020-12/meta/content", q1 = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, B1 = "meta", H1 = "Content vocabulary meta-schema", z1 = [
  "object",
  "boolean"
], G1 = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, W1 = {
  $schema: x1,
  $id: V1,
  $vocabulary: q1,
  $dynamicAnchor: B1,
  title: H1,
  type: z1,
  properties: G1
}, K1 = "https://json-schema.org/draft/2020-12/schema", Y1 = "https://json-schema.org/draft/2020-12/meta/core", X1 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, J1 = "meta", Q1 = "Core vocabulary meta-schema", Z1 = [
  "object",
  "boolean"
], eT = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, tT = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, rT = {
  $schema: K1,
  $id: Y1,
  $vocabulary: X1,
  $dynamicAnchor: J1,
  title: Q1,
  type: Z1,
  properties: eT,
  $defs: tT
}, nT = "https://json-schema.org/draft/2020-12/schema", iT = "https://json-schema.org/draft/2020-12/meta/format-annotation", sT = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, oT = "meta", aT = "Format vocabulary meta-schema for annotation results", cT = [
  "object",
  "boolean"
], lT = {
  format: {
    type: "string"
  }
}, uT = {
  $schema: nT,
  $id: iT,
  $vocabulary: sT,
  $dynamicAnchor: oT,
  title: aT,
  type: cT,
  properties: lT
}, dT = "https://json-schema.org/draft/2020-12/schema", fT = "https://json-schema.org/draft/2020-12/meta/meta-data", hT = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, pT = "meta", mT = "Meta-data vocabulary meta-schema", yT = [
  "object",
  "boolean"
], gT = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, _T = {
  $schema: dT,
  $id: fT,
  $vocabulary: hT,
  $dynamicAnchor: pT,
  title: mT,
  type: yT,
  properties: gT
}, vT = "https://json-schema.org/draft/2020-12/schema", $T = "https://json-schema.org/draft/2020-12/meta/validation", wT = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, ET = "meta", bT = "Validation vocabulary meta-schema", ST = [
  "object",
  "boolean"
], PT = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, TT = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, NT = {
  $schema: vT,
  $id: $T,
  $vocabulary: wT,
  $dynamicAnchor: ET,
  title: bT,
  type: ST,
  properties: PT,
  $defs: TT
};
Object.defineProperty(cd, "__esModule", { value: !0 });
const OT = E1, AT = C1, RT = L1, CT = W1, IT = rT, DT = uT, kT = _T, FT = NT, jT = ["/properties"];
function UT(e) {
  return [
    OT,
    AT,
    RT,
    CT,
    IT,
    t(this, DT),
    kT,
    t(this, FT)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, jT) : n;
  }
}
cd.default = UT;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = _y, n = wu, i = ad, s = cd, o = "https://json-schema.org/draft/2020-12/schema";
  class a extends r.default {
    constructor(p = {}) {
      super({
        ...p,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((p) => this.addVocabulary(p)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: p, meta: $ } = this.opts;
      $ && (s.default.call(this, p), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = a, e.exports = t = a, e.exports.Ajv2020 = a, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = a;
  var c = Zt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var u = le();
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var l = Bs;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var d = Di;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return d.default;
  } });
})(Sl, Sl.exports);
var MT = Sl.exports, Cl = { exports: {} }, gg = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(x, q) {
    return { validate: x, compare: q };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(s, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), u),
    "date-time": t(h(!0), p),
    "iso-time": t(c(), l),
    "iso-date-time": t(h(), $),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: Q,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: A,
    // signed 32 bit integer
    int32: { type: "number", validate: z },
    // signed 64 bit integer
    int64: { type: "number", validate: G },
    // C-type float
    float: { type: "number", validate: me },
    // C-type double
    double: { type: "number", validate: me },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, u),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, p),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, $),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(x) {
    return x % 4 === 0 && (x % 100 !== 0 || x % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, i = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function s(x) {
    const q = n.exec(x);
    if (!q)
      return !1;
    const J = +q[1], j = +q[2], U = +q[3];
    return j >= 1 && j <= 12 && U >= 1 && U <= (j === 2 && r(J) ? 29 : i[j]);
  }
  function o(x, q) {
    if (x && q)
      return x > q ? 1 : x < q ? -1 : 0;
  }
  const a = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(x) {
    return function(J) {
      const j = a.exec(J);
      if (!j)
        return !1;
      const U = +j[1], B = +j[2], M = +j[3], H = j[4], V = j[5] === "-" ? -1 : 1, C = +(j[6] || 0), b = +(j[7] || 0);
      if (C > 23 || b > 59 || x && !H)
        return !1;
      if (U <= 23 && B <= 59 && M < 60)
        return !0;
      const N = B - b * V, S = U - C * V - (N < 0 ? 1 : 0);
      return (S === 23 || S === -1) && (N === 59 || N === -1) && M < 61;
    };
  }
  function u(x, q) {
    if (!(x && q))
      return;
    const J = (/* @__PURE__ */ new Date("2020-01-01T" + x)).valueOf(), j = (/* @__PURE__ */ new Date("2020-01-01T" + q)).valueOf();
    if (J && j)
      return J - j;
  }
  function l(x, q) {
    if (!(x && q))
      return;
    const J = a.exec(x), j = a.exec(q);
    if (J && j)
      return x = J[1] + J[2] + J[3], q = j[1] + j[2] + j[3], x > q ? 1 : x < q ? -1 : 0;
  }
  const d = /t|\s/i;
  function h(x) {
    const q = c(x);
    return function(j) {
      const U = j.split(d);
      return U.length === 2 && s(U[0]) && q(U[1]);
    };
  }
  function p(x, q) {
    if (!(x && q))
      return;
    const J = new Date(x).valueOf(), j = new Date(q).valueOf();
    if (J && j)
      return J - j;
  }
  function $(x, q) {
    if (!(x && q))
      return;
    const [J, j] = x.split(d), [U, B] = q.split(d), M = o(J, U);
    if (M !== void 0)
      return M || u(j, B);
  }
  const _ = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(x) {
    return _.test(x) && v.test(x);
  }
  const E = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function A(x) {
    return E.lastIndex = 0, E.test(x);
  }
  const I = -2147483648, F = 2 ** 31 - 1;
  function z(x) {
    return Number.isInteger(x) && x <= F && x >= I;
  }
  function G(x) {
    return Number.isInteger(x);
  }
  function me() {
    return !0;
  }
  const R = /[^\\]\\Z/;
  function Q(x) {
    if (R.test(x))
      return !1;
    try {
      return new RegExp(x), !0;
    } catch {
      return !1;
    }
  }
})(gg);
var _g = {}, Il = { exports: {} }, vg = {}, er = {}, Ni = {}, zs = {}, de = {}, Ss = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(E) {
      if (super(), !e.IDENTIFIER.test(E))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(E) {
      super(), this._items = typeof E == "string" ? [E] : E;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const E = this._items[0];
      return E === "" || E === '""';
    }
    get str() {
      var E;
      return (E = this._str) !== null && E !== void 0 ? E : this._str = this._items.reduce((A, I) => `${A}${I}`, "");
    }
    get names() {
      var E;
      return (E = this._names) !== null && E !== void 0 ? E : this._names = this._items.reduce((A, I) => (I instanceof r && (A[I.str] = (A[I.str] || 0) + 1), A), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function i(m, ...E) {
    const A = [m[0]];
    let I = 0;
    for (; I < E.length; )
      a(A, E[I]), A.push(m[++I]);
    return new n(A);
  }
  e._ = i;
  const s = new n("+");
  function o(m, ...E) {
    const A = [p(m[0])];
    let I = 0;
    for (; I < E.length; )
      A.push(s), a(A, E[I]), A.push(s, p(m[++I]));
    return c(A), new n(A);
  }
  e.str = o;
  function a(m, E) {
    E instanceof n ? m.push(...E._items) : E instanceof r ? m.push(E) : m.push(d(E));
  }
  e.addCodeArg = a;
  function c(m) {
    let E = 1;
    for (; E < m.length - 1; ) {
      if (m[E] === s) {
        const A = u(m[E - 1], m[E + 1]);
        if (A !== void 0) {
          m.splice(E - 1, 3, A);
          continue;
        }
        m[E++] = "+";
      }
      E++;
    }
  }
  function u(m, E) {
    if (E === '""')
      return m;
    if (m === '""')
      return E;
    if (typeof m == "string")
      return E instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof E != "string" ? `${m.slice(0, -1)}${E}"` : E[0] === '"' ? m.slice(0, -1) + E.slice(1) : void 0;
    if (typeof E == "string" && E[0] === '"' && !(m instanceof r))
      return `"${m}${E.slice(1)}`;
  }
  function l(m, E) {
    return E.emptyStr() ? m : m.emptyStr() ? E : o`${m}${E}`;
  }
  e.strConcat = l;
  function d(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : p(Array.isArray(m) ? m.join(",") : m);
  }
  function h(m) {
    return new n(p(m));
  }
  e.stringify = h;
  function p(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = p;
  function $(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : i`[${m}]`;
  }
  e.getProperty = $;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function v(m) {
    return new n(m.toString());
  }
  e.regexpCode = v;
})(Ss);
var Dl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = Ss;
  class r extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class i {
    constructor({ prefixes: u, parent: l } = {}) {
      this._names = {}, this._prefixes = u, this._parent = l;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const l = this._names[u] || this._nameGroup(u);
      return `${u}${l.index++}`;
    }
    _nameGroup(u) {
      var l, d;
      if (!((d = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || d === void 0) && d.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = i;
  class s extends t.Name {
    constructor(u, l) {
      super(l), this.prefix = u;
    }
    setValue(u, { property: l, itemIndex: d }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(l)}[${d}]`;
    }
  }
  e.ValueScopeName = s;
  const o = (0, t._)`\n`;
  class a extends i {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new s(u, this._newName(u));
    }
    value(u, l) {
      var d;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const h = this.toName(u), { prefix: p } = h, $ = (d = l.key) !== null && d !== void 0 ? d : l.ref;
      let _ = this._values[p];
      if (_) {
        const E = _.get($);
        if (E)
          return E;
      } else
        _ = this._values[p] = /* @__PURE__ */ new Map();
      _.set($, h);
      const v = this._scope[p] || (this._scope[p] = []), m = v.length;
      return v[m] = l.ref, h.setValue(l, { property: p, itemIndex: m }), h;
    }
    getValue(u, l) {
      const d = this._values[u];
      if (d)
        return d.get(l);
    }
    scopeRefs(u, l = this._values) {
      return this._reduceValues(l, (d) => {
        if (d.scopePath === void 0)
          throw new Error(`CodeGen: name "${d}" has no value`);
        return (0, t._)`${u}${d.scopePath}`;
      });
    }
    scopeCode(u = this._values, l, d) {
      return this._reduceValues(u, (h) => {
        if (h.value === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return h.value.code;
      }, l, d);
    }
    _reduceValues(u, l, d = {}, h) {
      let p = t.nil;
      for (const $ in u) {
        const _ = u[$];
        if (!_)
          continue;
        const v = d[$] = d[$] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if (v.has(m))
            return;
          v.set(m, n.Started);
          let E = l(m);
          if (E) {
            const A = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            p = (0, t._)`${p}${A} ${m} = ${E};${this.opts._n}`;
          } else if (E = h == null ? void 0 : h(m))
            p = (0, t._)`${p}${E}${this.opts._n}`;
          else
            throw new r(m);
          v.set(m, n.Completed);
        });
      }
      return p;
    }
  }
  e.ValueScope = a;
})(Dl);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Ss, r = Dl;
  var n = Ss;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var i = Dl;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class s {
    optimizeNodes() {
      return this;
    }
    optimizeNames(f, g) {
      return this;
    }
  }
  class o extends s {
    constructor(f, g, T) {
      super(), this.varKind = f, this.name = g, this.rhs = T;
    }
    render({ es5: f, _n: g }) {
      const T = f ? r.varKinds.var : this.varKind, w = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${T} ${this.name}${w};` + g;
    }
    optimizeNames(f, g) {
      if (f[this.name.str])
        return this.rhs && (this.rhs = j(this.rhs, f, g)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class a extends s {
    constructor(f, g, T) {
      super(), this.lhs = f, this.rhs = g, this.sideEffects = T;
    }
    render({ _n: f }) {
      return `${this.lhs} = ${this.rhs};` + f;
    }
    optimizeNames(f, g) {
      if (!(this.lhs instanceof t.Name && !f[this.lhs.str] && !this.sideEffects))
        return this.rhs = j(this.rhs, f, g), this;
    }
    get names() {
      const f = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return J(f, this.rhs);
    }
  }
  class c extends a {
    constructor(f, g, T, w) {
      super(f, T, w), this.op = g;
    }
    render({ _n: f }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + f;
    }
  }
  class u extends s {
    constructor(f) {
      super(), this.label = f, this.names = {};
    }
    render({ _n: f }) {
      return `${this.label}:` + f;
    }
  }
  class l extends s {
    constructor(f) {
      super(), this.label = f, this.names = {};
    }
    render({ _n: f }) {
      return `break${this.label ? ` ${this.label}` : ""};` + f;
    }
  }
  class d extends s {
    constructor(f) {
      super(), this.error = f;
    }
    render({ _n: f }) {
      return `throw ${this.error};` + f;
    }
    get names() {
      return this.error.names;
    }
  }
  class h extends s {
    constructor(f) {
      super(), this.code = f;
    }
    render({ _n: f }) {
      return `${this.code};` + f;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(f, g) {
      return this.code = j(this.code, f, g), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class p extends s {
    constructor(f = []) {
      super(), this.nodes = f;
    }
    render(f) {
      return this.nodes.reduce((g, T) => g + T.render(f), "");
    }
    optimizeNodes() {
      const { nodes: f } = this;
      let g = f.length;
      for (; g--; ) {
        const T = f[g].optimizeNodes();
        Array.isArray(T) ? f.splice(g, 1, ...T) : T ? f[g] = T : f.splice(g, 1);
      }
      return f.length > 0 ? this : void 0;
    }
    optimizeNames(f, g) {
      const { nodes: T } = this;
      let w = T.length;
      for (; w--; ) {
        const y = T[w];
        y.optimizeNames(f, g) || (U(f, y.names), T.splice(w, 1));
      }
      return T.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((f, g) => q(f, g.names), {});
    }
  }
  class $ extends p {
    render(f) {
      return "{" + f._n + super.render(f) + "}" + f._n;
    }
  }
  class _ extends p {
  }
  class v extends $ {
  }
  v.kind = "else";
  class m extends $ {
    constructor(f, g) {
      super(g), this.condition = f;
    }
    render(f) {
      let g = `if(${this.condition})` + super.render(f);
      return this.else && (g += "else " + this.else.render(f)), g;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const f = this.condition;
      if (f === !0)
        return this.nodes;
      let g = this.else;
      if (g) {
        const T = g.optimizeNodes();
        g = this.else = Array.isArray(T) ? new v(T) : T;
      }
      if (g)
        return f === !1 ? g instanceof m ? g : g.nodes : this.nodes.length ? this : new m(B(f), g instanceof m ? [g] : g.nodes);
      if (!(f === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(f, g) {
      var T;
      if (this.else = (T = this.else) === null || T === void 0 ? void 0 : T.optimizeNames(f, g), !!(super.optimizeNames(f, g) || this.else))
        return this.condition = j(this.condition, f, g), this;
    }
    get names() {
      const f = super.names;
      return J(f, this.condition), this.else && q(f, this.else.names), f;
    }
  }
  m.kind = "if";
  class E extends $ {
  }
  E.kind = "for";
  class A extends E {
    constructor(f) {
      super(), this.iteration = f;
    }
    render(f) {
      return `for(${this.iteration})` + super.render(f);
    }
    optimizeNames(f, g) {
      if (super.optimizeNames(f, g))
        return this.iteration = j(this.iteration, f, g), this;
    }
    get names() {
      return q(super.names, this.iteration.names);
    }
  }
  class I extends E {
    constructor(f, g, T, w) {
      super(), this.varKind = f, this.name = g, this.from = T, this.to = w;
    }
    render(f) {
      const g = f.es5 ? r.varKinds.var : this.varKind, { name: T, from: w, to: y } = this;
      return `for(${g} ${T}=${w}; ${T}<${y}; ${T}++)` + super.render(f);
    }
    get names() {
      const f = J(super.names, this.from);
      return J(f, this.to);
    }
  }
  class F extends E {
    constructor(f, g, T, w) {
      super(), this.loop = f, this.varKind = g, this.name = T, this.iterable = w;
    }
    render(f) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(f);
    }
    optimizeNames(f, g) {
      if (super.optimizeNames(f, g))
        return this.iterable = j(this.iterable, f, g), this;
    }
    get names() {
      return q(super.names, this.iterable.names);
    }
  }
  class z extends $ {
    constructor(f, g, T) {
      super(), this.name = f, this.args = g, this.async = T;
    }
    render(f) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(f);
    }
  }
  z.kind = "func";
  class G extends p {
    render(f) {
      return "return " + super.render(f);
    }
  }
  G.kind = "return";
  class me extends $ {
    render(f) {
      let g = "try" + super.render(f);
      return this.catch && (g += this.catch.render(f)), this.finally && (g += this.finally.render(f)), g;
    }
    optimizeNodes() {
      var f, g;
      return super.optimizeNodes(), (f = this.catch) === null || f === void 0 || f.optimizeNodes(), (g = this.finally) === null || g === void 0 || g.optimizeNodes(), this;
    }
    optimizeNames(f, g) {
      var T, w;
      return super.optimizeNames(f, g), (T = this.catch) === null || T === void 0 || T.optimizeNames(f, g), (w = this.finally) === null || w === void 0 || w.optimizeNames(f, g), this;
    }
    get names() {
      const f = super.names;
      return this.catch && q(f, this.catch.names), this.finally && q(f, this.finally.names), f;
    }
  }
  class R extends $ {
    constructor(f) {
      super(), this.error = f;
    }
    render(f) {
      return `catch(${this.error})` + super.render(f);
    }
  }
  R.kind = "catch";
  class Q extends $ {
    render(f) {
      return "finally" + super.render(f);
    }
  }
  Q.kind = "finally";
  class x {
    constructor(f, g = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...g, _n: g.lines ? `
` : "" }, this._extScope = f, this._scope = new r.Scope({ parent: f }), this._nodes = [new _()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(f) {
      return this._scope.name(f);
    }
    // reserves unique name in the external scope
    scopeName(f) {
      return this._extScope.name(f);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(f, g) {
      const T = this._extScope.value(f, g);
      return (this._values[T.prefix] || (this._values[T.prefix] = /* @__PURE__ */ new Set())).add(T), T;
    }
    getScopeValue(f, g) {
      return this._extScope.getValue(f, g);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(f) {
      return this._extScope.scopeRefs(f, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(f, g, T, w) {
      const y = this._scope.toName(g);
      return T !== void 0 && w && (this._constants[y.str] = T), this._leafNode(new o(f, y, T)), y;
    }
    // `const` declaration (`var` in es5 mode)
    const(f, g, T) {
      return this._def(r.varKinds.const, f, g, T);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(f, g, T) {
      return this._def(r.varKinds.let, f, g, T);
    }
    // `var` declaration with optional assignment
    var(f, g, T) {
      return this._def(r.varKinds.var, f, g, T);
    }
    // assignment code
    assign(f, g, T) {
      return this._leafNode(new a(f, g, T));
    }
    // `+=` code
    add(f, g) {
      return this._leafNode(new c(f, e.operators.ADD, g));
    }
    // appends passed SafeExpr to code or executes Block
    code(f) {
      return typeof f == "function" ? f() : f !== t.nil && this._leafNode(new h(f)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...f) {
      const g = ["{"];
      for (const [T, w] of f)
        g.length > 1 && g.push(","), g.push(T), (T !== w || this.opts.es5) && (g.push(":"), (0, t.addCodeArg)(g, w));
      return g.push("}"), new t._Code(g);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(f, g, T) {
      if (this._blockNode(new m(f)), g && T)
        this.code(g).else().code(T).endIf();
      else if (g)
        this.code(g).endIf();
      else if (T)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(f) {
      return this._elseNode(new m(f));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, v);
    }
    _for(f, g) {
      return this._blockNode(f), g && this.code(g).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(f, g) {
      return this._for(new A(f), g);
    }
    // `for` statement for a range of values
    forRange(f, g, T, w, y = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const k = this._scope.toName(f);
      return this._for(new I(y, k, g, T), () => w(k));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(f, g, T, w = r.varKinds.const) {
      const y = this._scope.toName(f);
      if (this.opts.es5) {
        const k = g instanceof t.Name ? g : this.var("_arr", g);
        return this.forRange("_i", 0, (0, t._)`${k}.length`, (O) => {
          this.var(y, (0, t._)`${k}[${O}]`), T(y);
        });
      }
      return this._for(new F("of", w, y, g), () => T(y));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(f, g, T, w = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(f, (0, t._)`Object.keys(${g})`, T);
      const y = this._scope.toName(f);
      return this._for(new F("in", w, y, g), () => T(y));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(E);
    }
    // `label` statement
    label(f) {
      return this._leafNode(new u(f));
    }
    // `break` statement
    break(f) {
      return this._leafNode(new l(f));
    }
    // `return` statement
    return(f) {
      const g = new G();
      if (this._blockNode(g), this.code(f), g.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(G);
    }
    // `try` statement
    try(f, g, T) {
      if (!g && !T)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const w = new me();
      if (this._blockNode(w), this.code(f), g) {
        const y = this.name("e");
        this._currNode = w.catch = new R(y), g(y);
      }
      return T && (this._currNode = w.finally = new Q(), this.code(T)), this._endBlockNode(R, Q);
    }
    // `throw` statement
    throw(f) {
      return this._leafNode(new d(f));
    }
    // start self-balancing block
    block(f, g) {
      return this._blockStarts.push(this._nodes.length), f && this.code(f).endBlock(g), this;
    }
    // end the current self-balancing block
    endBlock(f) {
      const g = this._blockStarts.pop();
      if (g === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const T = this._nodes.length - g;
      if (T < 0 || f !== void 0 && T !== f)
        throw new Error(`CodeGen: wrong number of nodes: ${T} vs ${f} expected`);
      return this._nodes.length = g, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(f, g = t.nil, T, w) {
      return this._blockNode(new z(f, g, T)), w && this.code(w).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(z);
    }
    optimize(f = 1) {
      for (; f-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(f) {
      return this._currNode.nodes.push(f), this;
    }
    _blockNode(f) {
      this._currNode.nodes.push(f), this._nodes.push(f);
    }
    _endBlockNode(f, g) {
      const T = this._currNode;
      if (T instanceof f || g && T instanceof g)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${g ? `${f.kind}/${g.kind}` : f.kind}"`);
    }
    _elseNode(f) {
      const g = this._currNode;
      if (!(g instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = g.else = f, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const f = this._nodes;
      return f[f.length - 1];
    }
    set _currNode(f) {
      const g = this._nodes;
      g[g.length - 1] = f;
    }
  }
  e.CodeGen = x;
  function q(S, f) {
    for (const g in f)
      S[g] = (S[g] || 0) + (f[g] || 0);
    return S;
  }
  function J(S, f) {
    return f instanceof t._CodeOrName ? q(S, f.names) : S;
  }
  function j(S, f, g) {
    if (S instanceof t.Name)
      return T(S);
    if (!w(S))
      return S;
    return new t._Code(S._items.reduce((y, k) => (k instanceof t.Name && (k = T(k)), k instanceof t._Code ? y.push(...k._items) : y.push(k), y), []));
    function T(y) {
      const k = g[y.str];
      return k === void 0 || f[y.str] !== 1 ? y : (delete f[y.str], k);
    }
    function w(y) {
      return y instanceof t._Code && y._items.some((k) => k instanceof t.Name && f[k.str] === 1 && g[k.str] !== void 0);
    }
  }
  function U(S, f) {
    for (const g in f)
      S[g] = (S[g] || 0) - (f[g] || 0);
  }
  function B(S) {
    return typeof S == "boolean" || typeof S == "number" || S === null ? !S : (0, t._)`!${N(S)}`;
  }
  e.not = B;
  const M = b(e.operators.AND);
  function H(...S) {
    return S.reduce(M);
  }
  e.and = H;
  const V = b(e.operators.OR);
  function C(...S) {
    return S.reduce(V);
  }
  e.or = C;
  function b(S) {
    return (f, g) => f === t.nil ? g : g === t.nil ? f : (0, t._)`${N(f)} ${S} ${N(g)}`;
  }
  function N(S) {
    return S instanceof t.Name ? S : (0, t._)`(${S})`;
  }
})(de);
var Y = {};
Object.defineProperty(Y, "__esModule", { value: !0 });
Y.checkStrictMode = Y.getErrorPath = Y.Type = Y.useFunc = Y.setEvaluated = Y.evaluatedPropsToName = Y.mergeEvaluated = Y.eachItem = Y.unescapeJsonPointer = Y.escapeJsonPointer = Y.escapeFragment = Y.unescapeFragment = Y.schemaRefOrVal = Y.schemaHasRulesButRef = Y.schemaHasRules = Y.checkUnknownRules = Y.alwaysValidSchema = Y.toHash = void 0;
const $e = de, LT = Ss;
function xT(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
Y.toHash = xT;
function VT(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : ($g(e, t), !wg(t, e.self.RULES.all));
}
Y.alwaysValidSchema = VT;
function $g(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in t)
    i[s] || Sg(e, `unknown keyword: "${s}"`);
}
Y.checkUnknownRules = $g;
function wg(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
Y.schemaHasRules = wg;
function qT(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
Y.schemaHasRulesButRef = qT;
function BT({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, $e._)`${r}`;
  }
  return (0, $e._)`${e}${t}${(0, $e.getProperty)(n)}`;
}
Y.schemaRefOrVal = BT;
function HT(e) {
  return Eg(decodeURIComponent(e));
}
Y.unescapeFragment = HT;
function zT(e) {
  return encodeURIComponent(ld(e));
}
Y.escapeFragment = zT;
function ld(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
Y.escapeJsonPointer = ld;
function Eg(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
Y.unescapeJsonPointer = Eg;
function GT(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
Y.eachItem = GT;
function Mh({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, s, o, a) => {
    const c = o === void 0 ? s : o instanceof $e.Name ? (s instanceof $e.Name ? e(i, s, o) : t(i, s, o), o) : s instanceof $e.Name ? (t(i, o, s), s) : r(s, o);
    return a === $e.Name && !(c instanceof $e.Name) ? n(i, c) : c;
  };
}
Y.mergeEvaluated = {
  props: Mh({
    mergeNames: (e, t, r) => e.if((0, $e._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, $e._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, $e._)`${r} || {}`).code((0, $e._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, $e._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, $e._)`${r} || {}`), ud(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: bg
  }),
  items: Mh({
    mergeNames: (e, t, r) => e.if((0, $e._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, $e._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, $e._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, $e._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function bg(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, $e._)`{}`);
  return t !== void 0 && ud(e, r, t), r;
}
Y.evaluatedPropsToName = bg;
function ud(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, $e._)`${t}${(0, $e.getProperty)(n)}`, !0));
}
Y.setEvaluated = ud;
const Lh = {};
function WT(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Lh[t.code] || (Lh[t.code] = new LT._Code(t.code))
  });
}
Y.useFunc = WT;
var kl;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(kl || (Y.Type = kl = {}));
function KT(e, t, r) {
  if (e instanceof $e.Name) {
    const n = t === kl.Num;
    return r ? n ? (0, $e._)`"[" + ${e} + "]"` : (0, $e._)`"['" + ${e} + "']"` : n ? (0, $e._)`"/" + ${e}` : (0, $e._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, $e.getProperty)(e).toString() : "/" + ld(e);
}
Y.getErrorPath = KT;
function Sg(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
Y.checkStrictMode = Sg;
var mr = {};
Object.defineProperty(mr, "__esModule", { value: !0 });
const rt = de, YT = {
  // validation function arguments
  data: new rt.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new rt.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new rt.Name("instancePath"),
  parentData: new rt.Name("parentData"),
  parentDataProperty: new rt.Name("parentDataProperty"),
  rootData: new rt.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new rt.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new rt.Name("vErrors"),
  // null or array of validation errors
  errors: new rt.Name("errors"),
  // counter of validation errors
  this: new rt.Name("this"),
  // "globals"
  self: new rt.Name("self"),
  scope: new rt.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new rt.Name("json"),
  jsonPos: new rt.Name("jsonPos"),
  jsonLen: new rt.Name("jsonLen"),
  jsonPart: new rt.Name("jsonPart")
};
mr.default = YT;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = de, r = Y, n = mr;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: m }) => m ? (0, t.str)`"${v}" keyword must be ${m} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, m = e.keywordError, E, A) {
    const { it: I } = v, { gen: F, compositeRule: z, allErrors: G } = I, me = d(v, m, E);
    A ?? (z || G) ? c(F, me) : u(I, (0, t._)`[${me}]`);
  }
  e.reportError = i;
  function s(v, m = e.keywordError, E) {
    const { it: A } = v, { gen: I, compositeRule: F, allErrors: z } = A, G = d(v, m, E);
    c(I, G), F || z || u(A, n.default.vErrors);
  }
  e.reportExtraError = s;
  function o(v, m) {
    v.assign(n.default.errors, m), v.if((0, t._)`${n.default.vErrors} !== null`, () => v.if(m, () => v.assign((0, t._)`${n.default.vErrors}.length`, m), () => v.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function a({ gen: v, keyword: m, schemaValue: E, data: A, errsCount: I, it: F }) {
    if (I === void 0)
      throw new Error("ajv implementation error");
    const z = v.name("err");
    v.forRange("i", I, n.default.errors, (G) => {
      v.const(z, (0, t._)`${n.default.vErrors}[${G}]`), v.if((0, t._)`${z}.instancePath === undefined`, () => v.assign((0, t._)`${z}.instancePath`, (0, t.strConcat)(n.default.instancePath, F.errorPath))), v.assign((0, t._)`${z}.schemaPath`, (0, t.str)`${F.errSchemaPath}/${m}`), F.opts.verbose && (v.assign((0, t._)`${z}.schema`, E), v.assign((0, t._)`${z}.data`, A));
    });
  }
  e.extendErrors = a;
  function c(v, m) {
    const E = v.const("err", m);
    v.if((0, t._)`${n.default.vErrors} === null`, () => v.assign(n.default.vErrors, (0, t._)`[${E}]`), (0, t._)`${n.default.vErrors}.push(${E})`), v.code((0, t._)`${n.default.errors}++`);
  }
  function u(v, m) {
    const { gen: E, validateName: A, schemaEnv: I } = v;
    I.$async ? E.throw((0, t._)`new ${v.ValidationError}(${m})`) : (E.assign((0, t._)`${A}.errors`, m), E.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function d(v, m, E) {
    const { createErrors: A } = v.it;
    return A === !1 ? (0, t._)`{}` : h(v, m, E);
  }
  function h(v, m, E = {}) {
    const { gen: A, it: I } = v, F = [
      p(I, E),
      $(v, E)
    ];
    return _(v, m, F), A.object(...F);
  }
  function p({ errorPath: v }, { instancePath: m }) {
    const E = m ? (0, t.str)`${v}${(0, r.getErrorPath)(m, r.Type.Str)}` : v;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, E)];
  }
  function $({ keyword: v, it: { errSchemaPath: m } }, { schemaPath: E, parentSchema: A }) {
    let I = A ? m : (0, t.str)`${m}/${v}`;
    return E && (I = (0, t.str)`${I}${(0, r.getErrorPath)(E, r.Type.Str)}`), [l.schemaPath, I];
  }
  function _(v, { params: m, message: E }, A) {
    const { keyword: I, data: F, schemaValue: z, it: G } = v, { opts: me, propertyName: R, topSchemaRef: Q, schemaPath: x } = G;
    A.push([l.keyword, I], [l.params, typeof m == "function" ? m(v) : m || (0, t._)`{}`]), me.messages && A.push([l.message, typeof E == "function" ? E(v) : E]), me.verbose && A.push([l.schema, z], [l.parentSchema, (0, t._)`${Q}${x}`], [n.default.data, F]), R && A.push([l.propertyName, R]);
  }
})(zs);
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.boolOrEmptySchema = Ni.topBoolOrEmptySchema = void 0;
const XT = zs, JT = de, QT = mr, ZT = {
  message: "boolean schema is false"
};
function eN(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Pg(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(QT.default.data) : (t.assign((0, JT._)`${n}.errors`, null), t.return(!0));
}
Ni.topBoolOrEmptySchema = eN;
function tN(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Pg(e)) : r.var(t, !0);
}
Ni.boolOrEmptySchema = tN;
function Pg(e, t) {
  const { gen: r, data: n } = e, i = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, XT.reportError)(i, ZT, void 0, t);
}
var Le = {}, Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.getRules = Bn.isJSONType = void 0;
const rN = ["string", "number", "integer", "boolean", "null", "object", "array"], nN = new Set(rN);
function iN(e) {
  return typeof e == "string" && nN.has(e);
}
Bn.isJSONType = iN;
function sN() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
Bn.getRules = sN;
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.shouldUseRule = Or.shouldUseGroup = Or.schemaHasRulesForType = void 0;
function oN({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Tg(e, n);
}
Or.schemaHasRulesForType = oN;
function Tg(e, t) {
  return t.rules.some((r) => Ng(e, r));
}
Or.shouldUseGroup = Tg;
function Ng(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Or.shouldUseRule = Ng;
Object.defineProperty(Le, "__esModule", { value: !0 });
Le.reportTypeError = Le.checkDataTypes = Le.checkDataType = Le.coerceAndCheckDataType = Le.getJSONTypes = Le.getSchemaTypes = Le.DataType = void 0;
const aN = Bn, cN = Or, lN = zs, ce = de, Og = Y;
var $i;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})($i || (Le.DataType = $i = {}));
function uN(e) {
  const t = Ag(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Le.getSchemaTypes = uN;
function Ag(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(aN.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Le.getJSONTypes = Ag;
function dN(e, t) {
  const { gen: r, data: n, opts: i } = e, s = fN(t, i.coerceTypes), o = t.length > 0 && !(s.length === 0 && t.length === 1 && (0, cN.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const a = dd(t, n, i.strictNumbers, $i.Wrong);
    r.if(a, () => {
      s.length ? hN(e, t, s) : fd(e);
    });
  }
  return o;
}
Le.coerceAndCheckDataType = dN;
const Rg = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function fN(e, t) {
  return t ? e.filter((r) => Rg.has(r) || t === "array" && r === "array") : [];
}
function hN(e, t, r) {
  const { gen: n, data: i, opts: s } = e, o = n.let("dataType", (0, ce._)`typeof ${i}`), a = n.let("coerced", (0, ce._)`undefined`);
  s.coerceTypes === "array" && n.if((0, ce._)`${o} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, ce._)`${i}[0]`).assign(o, (0, ce._)`typeof ${i}`).if(dd(t, i, s.strictNumbers), () => n.assign(a, i))), n.if((0, ce._)`${a} !== undefined`);
  for (const u of r)
    (Rg.has(u) || u === "array" && s.coerceTypes === "array") && c(u);
  n.else(), fd(e), n.endIf(), n.if((0, ce._)`${a} !== undefined`, () => {
    n.assign(i, a), pN(e, a);
  });
  function c(u) {
    switch (u) {
      case "string":
        n.elseIf((0, ce._)`${o} == "number" || ${o} == "boolean"`).assign(a, (0, ce._)`"" + ${i}`).elseIf((0, ce._)`${i} === null`).assign(a, (0, ce._)`""`);
        return;
      case "number":
        n.elseIf((0, ce._)`${o} == "boolean" || ${i} === null
              || (${o} == "string" && ${i} && ${i} == +${i})`).assign(a, (0, ce._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, ce._)`${o} === "boolean" || ${i} === null
              || (${o} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(a, (0, ce._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, ce._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(a, !1).elseIf((0, ce._)`${i} === "true" || ${i} === 1`).assign(a, !0);
        return;
      case "null":
        n.elseIf((0, ce._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(a, null);
        return;
      case "array":
        n.elseIf((0, ce._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${i} === null`).assign(a, (0, ce._)`[${i}]`);
    }
  }
}
function pN({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ce._)`${t} !== undefined`, () => e.assign((0, ce._)`${t}[${r}]`, n));
}
function Fl(e, t, r, n = $i.Correct) {
  const i = n === $i.Correct ? ce.operators.EQ : ce.operators.NEQ;
  let s;
  switch (e) {
    case "null":
      return (0, ce._)`${t} ${i} null`;
    case "array":
      s = (0, ce._)`Array.isArray(${t})`;
      break;
    case "object":
      s = (0, ce._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      s = o((0, ce._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      s = o();
      break;
    default:
      return (0, ce._)`typeof ${t} ${i} ${e}`;
  }
  return n === $i.Correct ? s : (0, ce.not)(s);
  function o(a = ce.nil) {
    return (0, ce.and)((0, ce._)`typeof ${t} == "number"`, a, r ? (0, ce._)`isFinite(${t})` : ce.nil);
  }
}
Le.checkDataType = Fl;
function dd(e, t, r, n) {
  if (e.length === 1)
    return Fl(e[0], t, r, n);
  let i;
  const s = (0, Og.toHash)(e);
  if (s.array && s.object) {
    const o = (0, ce._)`typeof ${t} != "object"`;
    i = s.null ? o : (0, ce._)`!${t} || ${o}`, delete s.null, delete s.array, delete s.object;
  } else
    i = ce.nil;
  s.number && delete s.integer;
  for (const o in s)
    i = (0, ce.and)(i, Fl(o, t, r, n));
  return i;
}
Le.checkDataTypes = dd;
const mN = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ce._)`{type: ${e}}` : (0, ce._)`{type: ${t}}`
};
function fd(e) {
  const t = yN(e);
  (0, lN.reportError)(t, mN);
}
Le.reportTypeError = fd;
function yN(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, Og.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: n,
    params: {},
    it: e
  };
}
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
qa.assignDefaults = void 0;
const Zn = de, gN = Y;
function _N(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      xh(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, s) => xh(e, s, i.default));
}
qa.assignDefaults = _N;
function xh(e, t, r) {
  const { gen: n, compositeRule: i, data: s, opts: o } = e;
  if (r === void 0)
    return;
  const a = (0, Zn._)`${s}${(0, Zn.getProperty)(t)}`;
  if (i) {
    (0, gN.checkStrictMode)(e, `default is ignored for: ${a}`);
    return;
  }
  let c = (0, Zn._)`${a} === undefined`;
  o.useDefaults === "empty" && (c = (0, Zn._)`${c} || ${a} === null || ${a} === ""`), n.if(c, (0, Zn._)`${a} = ${(0, Zn.stringify)(r)}`);
}
var hr = {}, pe = {};
Object.defineProperty(pe, "__esModule", { value: !0 });
pe.validateUnion = pe.validateArray = pe.usePattern = pe.callValidateCode = pe.schemaProperties = pe.allSchemaProperties = pe.noPropertyInData = pe.propertyInData = pe.isOwnProperty = pe.hasPropFunc = pe.reportMissingProp = pe.checkMissingProp = pe.checkReportMissingProp = void 0;
const Pe = de, hd = Y, Hr = mr, vN = Y;
function $N(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(md(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Pe._)`${t}` }, !0), e.error();
  });
}
pe.checkReportMissingProp = $N;
function wN({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Pe.or)(...n.map((s) => (0, Pe.and)(md(e, t, s, r.ownProperties), (0, Pe._)`${i} = ${s}`)));
}
pe.checkMissingProp = wN;
function EN(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
pe.reportMissingProp = EN;
function Cg(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Pe._)`Object.prototype.hasOwnProperty`
  });
}
pe.hasPropFunc = Cg;
function pd(e, t, r) {
  return (0, Pe._)`${Cg(e)}.call(${t}, ${r})`;
}
pe.isOwnProperty = pd;
function bN(e, t, r, n) {
  const i = (0, Pe._)`${t}${(0, Pe.getProperty)(r)} !== undefined`;
  return n ? (0, Pe._)`${i} && ${pd(e, t, r)}` : i;
}
pe.propertyInData = bN;
function md(e, t, r, n) {
  const i = (0, Pe._)`${t}${(0, Pe.getProperty)(r)} === undefined`;
  return n ? (0, Pe.or)(i, (0, Pe.not)(pd(e, t, r))) : i;
}
pe.noPropertyInData = md;
function Ig(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
pe.allSchemaProperties = Ig;
function SN(e, t) {
  return Ig(t).filter((r) => !(0, hd.alwaysValidSchema)(e, t[r]));
}
pe.schemaProperties = SN;
function PN({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: s }, it: o }, a, c, u) {
  const l = u ? (0, Pe._)`${e}, ${t}, ${n}${i}` : t, d = [
    [Hr.default.instancePath, (0, Pe.strConcat)(Hr.default.instancePath, s)],
    [Hr.default.parentData, o.parentData],
    [Hr.default.parentDataProperty, o.parentDataProperty],
    [Hr.default.rootData, Hr.default.rootData]
  ];
  o.opts.dynamicRef && d.push([Hr.default.dynamicAnchors, Hr.default.dynamicAnchors]);
  const h = (0, Pe._)`${l}, ${r.object(...d)}`;
  return c !== Pe.nil ? (0, Pe._)`${a}.call(${c}, ${h})` : (0, Pe._)`${a}(${h})`;
}
pe.callValidateCode = PN;
const TN = (0, Pe._)`new RegExp`;
function NN({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, s = i(r, n);
  return e.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Pe._)`${i.code === "new RegExp" ? TN : (0, vN.useFunc)(e, i)}(${r}, ${n})`
  });
}
pe.usePattern = NN;
function ON(e) {
  const { gen: t, data: r, keyword: n, it: i } = e, s = t.name("valid");
  if (i.allErrors) {
    const a = t.let("valid", !0);
    return o(() => t.assign(a, !1)), a;
  }
  return t.var(s, !0), o(() => t.break()), s;
  function o(a) {
    const c = t.const("len", (0, Pe._)`${r}.length`);
    t.forRange("i", 0, c, (u) => {
      e.subschema({
        keyword: n,
        dataProp: u,
        dataPropType: hd.Type.Num
      }, s), t.if((0, Pe.not)(s), a);
    });
  }
}
pe.validateArray = ON;
function AN(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, hd.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const o = t.let("valid", !1), a = t.name("_valid");
  t.block(() => r.forEach((c, u) => {
    const l = e.subschema({
      keyword: n,
      schemaProp: u,
      compositeRule: !0
    }, a);
    t.assign(o, (0, Pe._)`${o} || ${a}`), e.mergeValidEvaluated(l, a) || t.if((0, Pe.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
pe.validateUnion = AN;
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.validateKeywordUsage = hr.validSchemaType = hr.funcKeywordCode = hr.macroKeywordCode = void 0;
const ut = de, In = mr, RN = pe, CN = zs;
function IN(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: s, it: o } = e, a = t.macro.call(o.self, i, s, o), c = Dg(r, n, a);
  o.opts.validateSchema !== !1 && o.self.validateSchema(a, !0);
  const u = r.name("valid");
  e.subschema({
    schema: a,
    schemaPath: ut.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
hr.macroKeywordCode = IN;
function DN(e, t) {
  var r;
  const { gen: n, keyword: i, schema: s, parentSchema: o, $data: a, it: c } = e;
  FN(c, t);
  const u = !a && t.compile ? t.compile.call(c.self, s, o, c) : t.validate, l = Dg(n, i, u), d = n.let("valid");
  e.block$data(d, h), e.ok((r = t.valid) !== null && r !== void 0 ? r : d);
  function h() {
    if (t.errors === !1)
      _(), t.modifying && Vh(e), v(() => e.error());
    else {
      const m = t.async ? p() : $();
      t.modifying && Vh(e), v(() => kN(e, m));
    }
  }
  function p() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, ut._)`await `), (E) => n.assign(d, !1).if((0, ut._)`${E} instanceof ${c.ValidationError}`, () => n.assign(m, (0, ut._)`${E}.errors`), () => n.throw(E))), m;
  }
  function $() {
    const m = (0, ut._)`${l}.errors`;
    return n.assign(m, null), _(ut.nil), m;
  }
  function _(m = t.async ? (0, ut._)`await ` : ut.nil) {
    const E = c.opts.passContext ? In.default.this : In.default.self, A = !("compile" in t && !a || t.schema === !1);
    n.assign(d, (0, ut._)`${m}${(0, RN.callValidateCode)(e, l, E, A)}`, t.modifying);
  }
  function v(m) {
    var E;
    n.if((0, ut.not)((E = t.valid) !== null && E !== void 0 ? E : d), m);
  }
}
hr.funcKeywordCode = DN;
function Vh(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, ut._)`${n.parentData}[${n.parentDataProperty}]`));
}
function kN(e, t) {
  const { gen: r } = e;
  r.if((0, ut._)`Array.isArray(${t})`, () => {
    r.assign(In.default.vErrors, (0, ut._)`${In.default.vErrors} === null ? ${t} : ${In.default.vErrors}.concat(${t})`).assign(In.default.errors, (0, ut._)`${In.default.vErrors}.length`), (0, CN.extendErrors)(e);
  }, () => e.error());
}
function FN({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Dg(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, ut.stringify)(r) });
}
function jN(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
hr.validSchemaType = jN;
function UN({ schema: e, opts: t, self: r, errSchemaPath: n }, i, s) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(s) : i.keyword !== s)
    throw new Error("ajv implementation error");
  const o = i.dependencies;
  if (o != null && o.some((a) => !Object.prototype.hasOwnProperty.call(e, a)))
    throw new Error(`parent schema must have dependencies of ${s}: ${o.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[s])) {
    const c = `keyword "${s}" value is invalid at path "${n}": ` + r.errorsText(i.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
hr.validateKeywordUsage = UN;
var on = {};
Object.defineProperty(on, "__esModule", { value: !0 });
on.extendSubschemaMode = on.extendSubschemaData = on.getSubschema = void 0;
const lr = de, kg = Y;
function MN(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: s, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const a = e.schema[t];
    return r === void 0 ? {
      schema: a,
      schemaPath: (0, lr._)`${e.schemaPath}${(0, lr.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: a[r],
      schemaPath: (0, lr._)`${e.schemaPath}${(0, lr.getProperty)(t)}${(0, lr.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, kg.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (i === void 0 || s === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: i,
      topSchemaRef: o,
      errSchemaPath: s
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
on.getSubschema = MN;
function LN(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: s, propertyName: o }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: a } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: d } = t, h = a.let("data", (0, lr._)`${t.data}${(0, lr.getProperty)(r)}`, !0);
    c(h), e.errorPath = (0, lr.str)`${u}${(0, kg.getErrorPath)(r, n, d.jsPropertySyntax)}`, e.parentDataProperty = (0, lr._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const u = i instanceof lr.Name ? i : a.let("data", i, !0);
    c(u), o !== void 0 && (e.propertyName = o);
  }
  s && (e.dataTypes = s);
  function c(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
on.extendSubschemaData = LN;
function xN(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: s }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), s !== void 0 && (e.allErrors = s), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
on.extendSubschemaMode = xN;
var Ke = {}, Fg = { exports: {} }, tn = Fg.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  Jo(t, n, i, e, "", e);
};
tn.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
tn.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
tn.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
tn.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Jo(e, t, r, n, i, s, o, a, c, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, i, s, o, a, c, u);
    for (var l in n) {
      var d = n[l];
      if (Array.isArray(d)) {
        if (l in tn.arrayKeywords)
          for (var h = 0; h < d.length; h++)
            Jo(e, t, r, d[h], i + "/" + l + "/" + h, s, i, l, n, h);
      } else if (l in tn.propsKeywords) {
        if (d && typeof d == "object")
          for (var p in d)
            Jo(e, t, r, d[p], i + "/" + l + "/" + VN(p), s, i, l, n, p);
      } else (l in tn.keywords || e.allKeys && !(l in tn.skipKeywords)) && Jo(e, t, r, d, i + "/" + l, s, i, l, n);
    }
    r(n, i, s, o, a, c, u);
  }
}
function VN(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var qN = Fg.exports;
Object.defineProperty(Ke, "__esModule", { value: !0 });
Ke.getSchemaRefs = Ke.resolveUrl = Ke.normalizeId = Ke._getFullPath = Ke.getFullPath = Ke.inlineRef = void 0;
const BN = Y, HN = Fa, zN = qN, GN = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function WN(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !jl(e) : t ? jg(e) <= t : !1;
}
Ke.inlineRef = WN;
const KN = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function jl(e) {
  for (const t in e) {
    if (KN.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(jl) || typeof r == "object" && jl(r))
      return !0;
  }
  return !1;
}
function jg(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !GN.has(r) && (typeof e[r] == "object" && (0, BN.eachItem)(e[r], (n) => t += jg(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ug(e, t = "", r) {
  r !== !1 && (t = wi(t));
  const n = e.parse(t);
  return Mg(e, n);
}
Ke.getFullPath = Ug;
function Mg(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ke._getFullPath = Mg;
const YN = /#\/?$/;
function wi(e) {
  return e ? e.replace(YN, "") : "";
}
Ke.normalizeId = wi;
function XN(e, t, r) {
  return r = wi(r), e.resolve(t, r);
}
Ke.resolveUrl = XN;
const JN = /^[a-z_][-a-z0-9._]*$/i;
function QN(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = wi(e[r] || t), s = { "": i }, o = Ug(n, i, !1), a = {}, c = /* @__PURE__ */ new Set();
  return zN(e, { allKeys: !0 }, (d, h, p, $) => {
    if ($ === void 0)
      return;
    const _ = o + h;
    let v = s[$];
    typeof d[r] == "string" && (v = m.call(this, d[r])), E.call(this, d.$anchor), E.call(this, d.$dynamicAnchor), s[h] = v;
    function m(A) {
      const I = this.opts.uriResolver.resolve;
      if (A = wi(v ? I(v, A) : A), c.has(A))
        throw l(A);
      c.add(A);
      let F = this.refs[A];
      return typeof F == "string" && (F = this.refs[F]), typeof F == "object" ? u(d, F.schema, A) : A !== wi(_) && (A[0] === "#" ? (u(d, a[A], A), a[A] = d) : this.refs[A] = _), A;
    }
    function E(A) {
      if (typeof A == "string") {
        if (!JN.test(A))
          throw new Error(`invalid anchor "${A}"`);
        m.call(this, `#${A}`);
      }
    }
  }), a;
  function u(d, h, p) {
    if (h !== void 0 && !HN(d, h))
      throw l(p);
  }
  function l(d) {
    return new Error(`reference "${d}" resolves to more than one schema`);
  }
}
Ke.getSchemaRefs = QN;
Object.defineProperty(er, "__esModule", { value: !0 });
er.getData = er.KeywordCxt = er.validateFunctionCode = void 0;
const Lg = Ni, qh = Le, yd = Or, pa = Le, ZN = qa, ms = hr, Fc = on, ee = de, ne = mr, eO = Ke, Ar = Y, Qi = zs;
function tO(e) {
  if (qg(e) && (Bg(e), Vg(e))) {
    iO(e);
    return;
  }
  xg(e, () => (0, Lg.topBoolOrEmptySchema)(e));
}
er.validateFunctionCode = tO;
function xg({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, s) {
  i.code.es5 ? e.func(t, (0, ee._)`${ne.default.data}, ${ne.default.valCxt}`, n.$async, () => {
    e.code((0, ee._)`"use strict"; ${Bh(r, i)}`), nO(e, i), e.code(s);
  }) : e.func(t, (0, ee._)`${ne.default.data}, ${rO(i)}`, n.$async, () => e.code(Bh(r, i)).code(s));
}
function rO(e) {
  return (0, ee._)`{${ne.default.instancePath}="", ${ne.default.parentData}, ${ne.default.parentDataProperty}, ${ne.default.rootData}=${ne.default.data}${e.dynamicRef ? (0, ee._)`, ${ne.default.dynamicAnchors}={}` : ee.nil}}={}`;
}
function nO(e, t) {
  e.if(ne.default.valCxt, () => {
    e.var(ne.default.instancePath, (0, ee._)`${ne.default.valCxt}.${ne.default.instancePath}`), e.var(ne.default.parentData, (0, ee._)`${ne.default.valCxt}.${ne.default.parentData}`), e.var(ne.default.parentDataProperty, (0, ee._)`${ne.default.valCxt}.${ne.default.parentDataProperty}`), e.var(ne.default.rootData, (0, ee._)`${ne.default.valCxt}.${ne.default.rootData}`), t.dynamicRef && e.var(ne.default.dynamicAnchors, (0, ee._)`${ne.default.valCxt}.${ne.default.dynamicAnchors}`);
  }, () => {
    e.var(ne.default.instancePath, (0, ee._)`""`), e.var(ne.default.parentData, (0, ee._)`undefined`), e.var(ne.default.parentDataProperty, (0, ee._)`undefined`), e.var(ne.default.rootData, ne.default.data), t.dynamicRef && e.var(ne.default.dynamicAnchors, (0, ee._)`{}`);
  });
}
function iO(e) {
  const { schema: t, opts: r, gen: n } = e;
  xg(e, () => {
    r.$comment && t.$comment && zg(e), lO(e), n.let(ne.default.vErrors, null), n.let(ne.default.errors, 0), r.unevaluated && sO(e), Hg(e), fO(e);
  });
}
function sO(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, ee._)`${r}.evaluated`), t.if((0, ee._)`${e.evaluated}.dynamicProps`, () => t.assign((0, ee._)`${e.evaluated}.props`, (0, ee._)`undefined`)), t.if((0, ee._)`${e.evaluated}.dynamicItems`, () => t.assign((0, ee._)`${e.evaluated}.items`, (0, ee._)`undefined`));
}
function Bh(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, ee._)`/*# sourceURL=${r} */` : ee.nil;
}
function oO(e, t) {
  if (qg(e) && (Bg(e), Vg(e))) {
    aO(e, t);
    return;
  }
  (0, Lg.boolOrEmptySchema)(e, t);
}
function Vg({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function qg(e) {
  return typeof e.schema != "boolean";
}
function aO(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && zg(e), uO(e), dO(e);
  const s = n.const("_errs", ne.default.errors);
  Hg(e, s), n.var(t, (0, ee._)`${s} === ${ne.default.errors}`);
}
function Bg(e) {
  (0, Ar.checkUnknownRules)(e), cO(e);
}
function Hg(e, t) {
  if (e.opts.jtd)
    return Hh(e, [], !1, t);
  const r = (0, qh.getSchemaTypes)(e.schema), n = (0, qh.coerceAndCheckDataType)(e, r);
  Hh(e, r, !n, t);
}
function cO(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Ar.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function lO(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Ar.checkStrictMode)(e, "default is ignored in the schema root");
}
function uO(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, eO.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function dO(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function zg({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const s = r.$comment;
  if (i.$comment === !0)
    e.code((0, ee._)`${ne.default.self}.logger.log(${s})`);
  else if (typeof i.$comment == "function") {
    const o = (0, ee.str)`${n}/$comment`, a = e.scopeValue("root", { ref: t.root });
    e.code((0, ee._)`${ne.default.self}.opts.$comment(${s}, ${o}, ${a}.schema)`);
  }
}
function fO(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: s } = e;
  r.$async ? t.if((0, ee._)`${ne.default.errors} === 0`, () => t.return(ne.default.data), () => t.throw((0, ee._)`new ${i}(${ne.default.vErrors})`)) : (t.assign((0, ee._)`${n}.errors`, ne.default.vErrors), s.unevaluated && hO(e), t.return((0, ee._)`${ne.default.errors} === 0`));
}
function hO({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof ee.Name && e.assign((0, ee._)`${t}.props`, r), n instanceof ee.Name && e.assign((0, ee._)`${t}.items`, n);
}
function Hh(e, t, r, n) {
  const { gen: i, schema: s, data: o, allErrors: a, opts: c, self: u } = e, { RULES: l } = u;
  if (s.$ref && (c.ignoreKeywordsWithRef || !(0, Ar.schemaHasRulesButRef)(s, l))) {
    i.block(() => Kg(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || pO(e, t), i.block(() => {
    for (const h of l.rules)
      d(h);
    d(l.post);
  });
  function d(h) {
    (0, yd.shouldUseGroup)(s, h) && (h.type ? (i.if((0, pa.checkDataType)(h.type, o, c.strictNumbers)), zh(e, h), t.length === 1 && t[0] === h.type && r && (i.else(), (0, pa.reportTypeError)(e)), i.endIf()) : zh(e, h), a || i.if((0, ee._)`${ne.default.errors} === ${n || 0}`));
  }
}
function zh(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, ZN.assignDefaults)(e, t.type), r.block(() => {
    for (const s of t.rules)
      (0, yd.shouldUseRule)(n, s) && Kg(e, s.keyword, s.definition, t.type);
  });
}
function pO(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (mO(e, t), e.opts.allowUnionTypes || yO(e, t), gO(e, e.dataTypes));
}
function mO(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Gg(e.dataTypes, r) || gd(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), vO(e, t);
  }
}
function yO(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && gd(e, "use allowUnionTypes to allow union type keyword");
}
function gO(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, yd.shouldUseRule)(e.schema, i)) {
      const { type: s } = i.definition;
      s.length && !s.some((o) => _O(t, o)) && gd(e, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function _O(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Gg(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function vO(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Gg(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function gd(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Ar.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Wg {
  constructor(t, r, n) {
    if ((0, ms.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Ar.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Yg(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, ms.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", ne.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, ee.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, ee.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, ee._)`${r} !== undefined && (${(0, ee.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Qi.reportExtraError : Qi.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Qi.reportError)(this, this.def.$dataError || Qi.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Qi.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = ee.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = ee.nil, r = ee.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: i, schemaType: s, def: o } = this;
    n.if((0, ee.or)((0, ee._)`${i} === undefined`, r)), t !== ee.nil && n.assign(t, !0), (s.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== ee.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: i, it: s } = this;
    return (0, ee.or)(o(), a());
    function o() {
      if (n.length) {
        if (!(r instanceof ee.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, ee._)`${(0, pa.checkDataTypes)(c, r, s.opts.strictNumbers, pa.DataType.Wrong)}`;
      }
      return ee.nil;
    }
    function a() {
      if (i.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, ee._)`!${c}(${r})`;
      }
      return ee.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Fc.getSubschema)(this.it, t);
    (0, Fc.extendSubschemaData)(n, this.it, t), (0, Fc.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return oO(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Ar.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Ar.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, ee.Name)), !0;
  }
}
er.KeywordCxt = Wg;
function Kg(e, t, r, n) {
  const i = new Wg(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, ms.funcKeywordCode)(i, r) : "macro" in r ? (0, ms.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, ms.funcKeywordCode)(i, r);
}
const $O = /^\/(?:[^~]|~0|~1)*$/, wO = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Yg(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, s;
  if (e === "")
    return ne.default.rootData;
  if (e[0] === "/") {
    if (!$O.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, s = ne.default.rootData;
  } else {
    const u = wO.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +u[1];
    if (i = u[2], i === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return n[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (s = r[t - l], !i)
      return s;
  }
  let o = s;
  const a = i.split("/");
  for (const u of a)
    u && (s = (0, ee._)`${s}${(0, ee.getProperty)((0, Ar.unescapeJsonPointer)(u))}`, o = (0, ee._)`${o} && ${s}`);
  return o;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
er.getData = Yg;
var $o = {}, Gh;
function _d() {
  if (Gh) return $o;
  Gh = 1, Object.defineProperty($o, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return $o.default = e, $o;
}
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
const jc = Ke;
class EO extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, jc.resolveUrl)(t, r, n), this.missingSchema = (0, jc.normalizeId)((0, jc.getFullPath)(t, this.missingRef));
  }
}
Mi.default = EO;
var bt = {};
Object.defineProperty(bt, "__esModule", { value: !0 });
bt.resolveSchema = bt.getCompilingSchema = bt.resolveRef = bt.compileSchema = bt.SchemaEnv = void 0;
const Ht = de, bO = _d(), Sn = mr, Qt = Ke, Wh = Y, SO = er;
class Ba {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Qt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
bt.SchemaEnv = Ba;
function vd(e) {
  const t = Xg.call(this, e);
  if (t)
    return t;
  const r = (0, Qt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, o = new Ht.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let a;
  e.$async && (a = o.scopeValue("Error", {
    ref: bO.default,
    code: (0, Ht._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Sn.default.data,
    parentData: Sn.default.parentData,
    parentDataProperty: Sn.default.parentDataProperty,
    dataNames: [Sn.default.data],
    dataPathArr: [Ht.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ht.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: a,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ht.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ht._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, SO.validateFunctionCode)(u), o.optimize(this.opts.code.optimize);
    const d = o.toString();
    l = `${o.scopeRefs(Sn.default.scope)}return ${d}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const p = new Function(`${Sn.default.self}`, `${Sn.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = e.schema, p.schemaEnv = e, e.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: d, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: $, items: _ } = u;
      p.evaluated = {
        props: $ instanceof Ht.Name ? void 0 : $,
        items: _ instanceof Ht.Name ? void 0 : _,
        dynamicProps: $ instanceof Ht.Name,
        dynamicItems: _ instanceof Ht.Name
      }, p.source && (p.source.evaluated = (0, Ht.stringify)(p.evaluated));
    }
    return e.validate = p, e;
  } catch (d) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), d;
  } finally {
    this._compilations.delete(e);
  }
}
bt.compileSchema = vd;
function PO(e, t, r) {
  var n;
  r = (0, Qt.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let s = OO.call(this, e, r);
  if (s === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: a } = this.opts;
    o && (s = new Ba({ schema: o, schemaId: a, root: e, baseId: t }));
  }
  if (s !== void 0)
    return e.refs[r] = TO.call(this, s);
}
bt.resolveRef = PO;
function TO(e) {
  return (0, Qt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : vd.call(this, e);
}
function Xg(e) {
  for (const t of this._compilations)
    if (NO(t, e))
      return t;
}
bt.getCompilingSchema = Xg;
function NO(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function OO(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ha.call(this, e, t);
}
function Ha(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Qt._getFullPath)(this.opts.uriResolver, r);
  let i = (0, Qt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return Uc.call(this, r, e);
  const s = (0, Qt.normalizeId)(n), o = this.refs[s] || this.schemas[s];
  if (typeof o == "string") {
    const a = Ha.call(this, e, o);
    return typeof (a == null ? void 0 : a.schema) != "object" ? void 0 : Uc.call(this, r, a);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || vd.call(this, o), s === (0, Qt.normalizeId)(t)) {
      const { schema: a } = o, { schemaId: c } = this.opts, u = a[c];
      return u && (i = (0, Qt.resolveUrl)(this.opts.uriResolver, i, u)), new Ba({ schema: a, schemaId: c, root: e, baseId: i });
    }
    return Uc.call(this, r, o);
  }
}
bt.resolveSchema = Ha;
const AO = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Uc(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const a of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Wh.unescapeFragment)(a)];
    if (c === void 0)
      return;
    r = c;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !AO.has(a) && u && (t = (0, Qt.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let s;
  if (typeof r != "boolean" && r.$ref && !(0, Wh.schemaHasRulesButRef)(r, this.RULES)) {
    const a = (0, Qt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    s = Ha.call(this, n, a);
  }
  const { schemaId: o } = this.opts;
  if (s = s || new Ba({ schema: r, schemaId: o, root: n, baseId: t }), s.schema !== s.root.schema)
    return s;
}
const RO = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", CO = "Meta-schema for $data reference (JSON AnySchema extension proposal)", IO = "object", DO = [
  "$data"
], kO = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, FO = !1, jO = {
  $id: RO,
  description: CO,
  type: IO,
  required: DO,
  properties: kO,
  additionalProperties: FO
};
var $d = {};
Object.defineProperty($d, "__esModule", { value: !0 });
const Jg = og;
Jg.code = 'require("ajv/dist/runtime/uri").default';
$d.default = Jg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = er;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = de;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = _d(), i = Mi, s = Bn, o = bt, a = de, c = Ke, u = Le, l = Y, d = jO, h = $d, p = (C, b) => new RegExp(C, b);
  p.code = "new RegExp";
  const $ = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), v = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, E = 200;
  function A(C) {
    var b, N, S, f, g, T, w, y, k, O, K, fe, ge, Ee, Te, Je, _e, Ue, Vt, It, Tt, Dt, gr, _r, vr;
    const Nt = C.strict, kt = (b = C.code) === null || b === void 0 ? void 0 : b.optimize, $r = kt === !0 || kt === void 0 ? 1 : kt || 0, kr = (S = (N = C.code) === null || N === void 0 ? void 0 : N.regExp) !== null && S !== void 0 ? S : p, vt = (f = C.uriResolver) !== null && f !== void 0 ? f : h.default;
    return {
      strictSchema: (T = (g = C.strictSchema) !== null && g !== void 0 ? g : Nt) !== null && T !== void 0 ? T : !0,
      strictNumbers: (y = (w = C.strictNumbers) !== null && w !== void 0 ? w : Nt) !== null && y !== void 0 ? y : !0,
      strictTypes: (O = (k = C.strictTypes) !== null && k !== void 0 ? k : Nt) !== null && O !== void 0 ? O : "log",
      strictTuples: (fe = (K = C.strictTuples) !== null && K !== void 0 ? K : Nt) !== null && fe !== void 0 ? fe : "log",
      strictRequired: (Ee = (ge = C.strictRequired) !== null && ge !== void 0 ? ge : Nt) !== null && Ee !== void 0 ? Ee : !1,
      code: C.code ? { ...C.code, optimize: $r, regExp: kr } : { optimize: $r, regExp: kr },
      loopRequired: (Te = C.loopRequired) !== null && Te !== void 0 ? Te : E,
      loopEnum: (Je = C.loopEnum) !== null && Je !== void 0 ? Je : E,
      meta: (_e = C.meta) !== null && _e !== void 0 ? _e : !0,
      messages: (Ue = C.messages) !== null && Ue !== void 0 ? Ue : !0,
      inlineRefs: (Vt = C.inlineRefs) !== null && Vt !== void 0 ? Vt : !0,
      schemaId: (It = C.schemaId) !== null && It !== void 0 ? It : "$id",
      addUsedSchema: (Tt = C.addUsedSchema) !== null && Tt !== void 0 ? Tt : !0,
      validateSchema: (Dt = C.validateSchema) !== null && Dt !== void 0 ? Dt : !0,
      validateFormats: (gr = C.validateFormats) !== null && gr !== void 0 ? gr : !0,
      unicodeRegExp: (_r = C.unicodeRegExp) !== null && _r !== void 0 ? _r : !0,
      int32range: (vr = C.int32range) !== null && vr !== void 0 ? vr : !0,
      uriResolver: vt
    };
  }
  class I {
    constructor(b = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), b = this.opts = { ...b, ...A(b) };
      const { es5: N, lines: S } = this.opts.code;
      this.scope = new a.ValueScope({ scope: {}, prefixes: _, es5: N, lines: S }), this.logger = q(b.logger);
      const f = b.validateFormats;
      b.validateFormats = !1, this.RULES = (0, s.getRules)(), F.call(this, v, b, "NOT SUPPORTED"), F.call(this, m, b, "DEPRECATED", "warn"), this._metaOpts = Q.call(this), b.formats && me.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), b.keywords && R.call(this, b.keywords), typeof b.meta == "object" && this.addMetaSchema(b.meta), G.call(this), b.validateFormats = f;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: b, meta: N, schemaId: S } = this.opts;
      let f = d;
      S === "id" && (f = { ...d }, f.id = f.$id, delete f.$id), N && b && this.addMetaSchema(f, f[S], !1);
    }
    defaultMeta() {
      const { meta: b, schemaId: N } = this.opts;
      return this.opts.defaultMeta = typeof b == "object" ? b[N] || b : void 0;
    }
    validate(b, N) {
      let S;
      if (typeof b == "string") {
        if (S = this.getSchema(b), !S)
          throw new Error(`no schema with key or ref "${b}"`);
      } else
        S = this.compile(b);
      const f = S(N);
      return "$async" in S || (this.errors = S.errors), f;
    }
    compile(b, N) {
      const S = this._addSchema(b, N);
      return S.validate || this._compileSchemaEnv(S);
    }
    compileAsync(b, N) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: S } = this.opts;
      return f.call(this, b, N);
      async function f(O, K) {
        await g.call(this, O.$schema);
        const fe = this._addSchema(O, K);
        return fe.validate || T.call(this, fe);
      }
      async function g(O) {
        O && !this.getSchema(O) && await f.call(this, { $ref: O }, !0);
      }
      async function T(O) {
        try {
          return this._compileSchemaEnv(O);
        } catch (K) {
          if (!(K instanceof i.default))
            throw K;
          return w.call(this, K), await y.call(this, K.missingSchema), T.call(this, O);
        }
      }
      function w({ missingSchema: O, missingRef: K }) {
        if (this.refs[O])
          throw new Error(`AnySchema ${O} is loaded but ${K} cannot be resolved`);
      }
      async function y(O) {
        const K = await k.call(this, O);
        this.refs[O] || await g.call(this, K.$schema), this.refs[O] || this.addSchema(K, O, N);
      }
      async function k(O) {
        const K = this._loading[O];
        if (K)
          return K;
        try {
          return await (this._loading[O] = S(O));
        } finally {
          delete this._loading[O];
        }
      }
    }
    // Adds schema to the instance
    addSchema(b, N, S, f = this.opts.validateSchema) {
      if (Array.isArray(b)) {
        for (const T of b)
          this.addSchema(T, void 0, S, f);
        return this;
      }
      let g;
      if (typeof b == "object") {
        const { schemaId: T } = this.opts;
        if (g = b[T], g !== void 0 && typeof g != "string")
          throw new Error(`schema ${T} must be string`);
      }
      return N = (0, c.normalizeId)(N || g), this._checkUnique(N), this.schemas[N] = this._addSchema(b, S, N, f, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(b, N, S = this.opts.validateSchema) {
      return this.addSchema(b, N, !0, S), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(b, N) {
      if (typeof b == "boolean")
        return !0;
      let S;
      if (S = b.$schema, S !== void 0 && typeof S != "string")
        throw new Error("$schema must be a string");
      if (S = S || this.opts.defaultMeta || this.defaultMeta(), !S)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const f = this.validate(S, b);
      if (!f && N) {
        const g = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(g);
        else
          throw new Error(g);
      }
      return f;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(b) {
      let N;
      for (; typeof (N = z.call(this, b)) == "string"; )
        b = N;
      if (N === void 0) {
        const { schemaId: S } = this.opts, f = new o.SchemaEnv({ schema: {}, schemaId: S });
        if (N = o.resolveSchema.call(this, f, b), !N)
          return;
        this.refs[b] = N;
      }
      return N.validate || this._compileSchemaEnv(N);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(b) {
      if (b instanceof RegExp)
        return this._removeAllSchemas(this.schemas, b), this._removeAllSchemas(this.refs, b), this;
      switch (typeof b) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const N = z.call(this, b);
          return typeof N == "object" && this._cache.delete(N.schema), delete this.schemas[b], delete this.refs[b], this;
        }
        case "object": {
          const N = b;
          this._cache.delete(N);
          let S = b[this.opts.schemaId];
          return S && (S = (0, c.normalizeId)(S), delete this.schemas[S], delete this.refs[S]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(b) {
      for (const N of b)
        this.addKeyword(N);
      return this;
    }
    addKeyword(b, N) {
      let S;
      if (typeof b == "string")
        S = b, typeof N == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), N.keyword = S);
      else if (typeof b == "object" && N === void 0) {
        if (N = b, S = N.keyword, Array.isArray(S) && !S.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (j.call(this, S, N), !N)
        return (0, l.eachItem)(S, (g) => U.call(this, g)), this;
      M.call(this, N);
      const f = {
        ...N,
        type: (0, u.getJSONTypes)(N.type),
        schemaType: (0, u.getJSONTypes)(N.schemaType)
      };
      return (0, l.eachItem)(S, f.type.length === 0 ? (g) => U.call(this, g, f) : (g) => f.type.forEach((T) => U.call(this, g, f, T))), this;
    }
    getKeyword(b) {
      const N = this.RULES.all[b];
      return typeof N == "object" ? N.definition : !!N;
    }
    // Remove keyword
    removeKeyword(b) {
      const { RULES: N } = this;
      delete N.keywords[b], delete N.all[b];
      for (const S of N.rules) {
        const f = S.rules.findIndex((g) => g.keyword === b);
        f >= 0 && S.rules.splice(f, 1);
      }
      return this;
    }
    // Add format
    addFormat(b, N) {
      return typeof N == "string" && (N = new RegExp(N)), this.formats[b] = N, this;
    }
    errorsText(b = this.errors, { separator: N = ", ", dataVar: S = "data" } = {}) {
      return !b || b.length === 0 ? "No errors" : b.map((f) => `${S}${f.instancePath} ${f.message}`).reduce((f, g) => f + N + g);
    }
    $dataMetaSchema(b, N) {
      const S = this.RULES.all;
      b = JSON.parse(JSON.stringify(b));
      for (const f of N) {
        const g = f.split("/").slice(1);
        let T = b;
        for (const w of g)
          T = T[w];
        for (const w in S) {
          const y = S[w];
          if (typeof y != "object")
            continue;
          const { $data: k } = y.definition, O = T[w];
          k && O && (T[w] = V(O));
        }
      }
      return b;
    }
    _removeAllSchemas(b, N) {
      for (const S in b) {
        const f = b[S];
        (!N || N.test(S)) && (typeof f == "string" ? delete b[S] : f && !f.meta && (this._cache.delete(f.schema), delete b[S]));
      }
    }
    _addSchema(b, N, S, f = this.opts.validateSchema, g = this.opts.addUsedSchema) {
      let T;
      const { schemaId: w } = this.opts;
      if (typeof b == "object")
        T = b[w];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof b != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let y = this._cache.get(b);
      if (y !== void 0)
        return y;
      S = (0, c.normalizeId)(T || S);
      const k = c.getSchemaRefs.call(this, b, S);
      return y = new o.SchemaEnv({ schema: b, schemaId: w, meta: N, baseId: S, localRefs: k }), this._cache.set(y.schema, y), g && !S.startsWith("#") && (S && this._checkUnique(S), this.refs[S] = y), f && this.validateSchema(b, !0), y;
    }
    _checkUnique(b) {
      if (this.schemas[b] || this.refs[b])
        throw new Error(`schema with key or id "${b}" already exists`);
    }
    _compileSchemaEnv(b) {
      if (b.meta ? this._compileMetaSchema(b) : o.compileSchema.call(this, b), !b.validate)
        throw new Error("ajv implementation error");
      return b.validate;
    }
    _compileMetaSchema(b) {
      const N = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, b);
      } finally {
        this.opts = N;
      }
    }
  }
  I.ValidationError = n.default, I.MissingRefError = i.default, e.default = I;
  function F(C, b, N, S = "error") {
    for (const f in C) {
      const g = f;
      g in b && this.logger[S](`${N}: option ${f}. ${C[g]}`);
    }
  }
  function z(C) {
    return C = (0, c.normalizeId)(C), this.schemas[C] || this.refs[C];
  }
  function G() {
    const C = this.opts.schemas;
    if (C)
      if (Array.isArray(C))
        this.addSchema(C);
      else
        for (const b in C)
          this.addSchema(C[b], b);
  }
  function me() {
    for (const C in this.opts.formats) {
      const b = this.opts.formats[C];
      b && this.addFormat(C, b);
    }
  }
  function R(C) {
    if (Array.isArray(C)) {
      this.addVocabulary(C);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const b in C) {
      const N = C[b];
      N.keyword || (N.keyword = b), this.addKeyword(N);
    }
  }
  function Q() {
    const C = { ...this.opts };
    for (const b of $)
      delete C[b];
    return C;
  }
  const x = { log() {
  }, warn() {
  }, error() {
  } };
  function q(C) {
    if (C === !1)
      return x;
    if (C === void 0)
      return console;
    if (C.log && C.warn && C.error)
      return C;
    throw new Error("logger must implement log, warn and error methods");
  }
  const J = /^[a-z_$][a-z0-9_$:-]*$/i;
  function j(C, b) {
    const { RULES: N } = this;
    if ((0, l.eachItem)(C, (S) => {
      if (N.keywords[S])
        throw new Error(`Keyword ${S} is already defined`);
      if (!J.test(S))
        throw new Error(`Keyword ${S} has invalid name`);
    }), !!b && b.$data && !("code" in b || "validate" in b))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function U(C, b, N) {
    var S;
    const f = b == null ? void 0 : b.post;
    if (N && f)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: g } = this;
    let T = f ? g.post : g.rules.find(({ type: y }) => y === N);
    if (T || (T = { type: N, rules: [] }, g.rules.push(T)), g.keywords[C] = !0, !b)
      return;
    const w = {
      keyword: C,
      definition: {
        ...b,
        type: (0, u.getJSONTypes)(b.type),
        schemaType: (0, u.getJSONTypes)(b.schemaType)
      }
    };
    b.before ? B.call(this, T, w, b.before) : T.rules.push(w), g.all[C] = w, (S = b.implements) === null || S === void 0 || S.forEach((y) => this.addKeyword(y));
  }
  function B(C, b, N) {
    const S = C.rules.findIndex((f) => f.keyword === N);
    S >= 0 ? C.rules.splice(S, 0, b) : (C.rules.push(b), this.logger.warn(`rule ${N} is not defined`));
  }
  function M(C) {
    let { metaSchema: b } = C;
    b !== void 0 && (C.$data && this.opts.$data && (b = V(b)), C.validateSchema = this.compile(b, !0));
  }
  const H = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function V(C) {
    return { anyOf: [C, H] };
  }
})(vg);
var wd = {}, Ed = {}, bd = {};
Object.defineProperty(bd, "__esModule", { value: !0 });
const UO = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
bd.default = UO;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.callRef = Hn.getValidate = void 0;
const MO = Mi, Kh = pe, Et = de, ei = mr, Yh = bt, wo = Y, LO = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: s, validateName: o, opts: a, self: c } = n, { root: u } = s;
    if ((r === "#" || r === "#/") && i === u.baseId)
      return d();
    const l = Yh.resolveRef.call(c, u, i, r);
    if (l === void 0)
      throw new MO.default(n.opts.uriResolver, i, r);
    if (l instanceof Yh.SchemaEnv)
      return h(l);
    return p(l);
    function d() {
      if (s === u)
        return Qo(e, o, s, s.$async);
      const $ = t.scopeValue("root", { ref: u });
      return Qo(e, (0, Et._)`${$}.validate`, u, u.$async);
    }
    function h($) {
      const _ = Qg(e, $);
      Qo(e, _, $, $.$async);
    }
    function p($) {
      const _ = t.scopeValue("schema", a.code.source === !0 ? { ref: $, code: (0, Et.stringify)($) } : { ref: $ }), v = t.name("valid"), m = e.subschema({
        schema: $,
        dataTypes: [],
        schemaPath: Et.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(m), e.ok(v);
    }
  }
};
function Qg(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Et._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Hn.getValidate = Qg;
function Qo(e, t, r, n) {
  const { gen: i, it: s } = e, { allErrors: o, schemaEnv: a, opts: c } = s, u = c.passContext ? ei.default.this : Et.nil;
  n ? l() : d();
  function l() {
    if (!a.$async)
      throw new Error("async schema referenced by sync schema");
    const $ = i.let("valid");
    i.try(() => {
      i.code((0, Et._)`await ${(0, Kh.callValidateCode)(e, t, u)}`), p(t), o || i.assign($, !0);
    }, (_) => {
      i.if((0, Et._)`!(${_} instanceof ${s.ValidationError})`, () => i.throw(_)), h(_), o || i.assign($, !1);
    }), e.ok($);
  }
  function d() {
    e.result((0, Kh.callValidateCode)(e, t, u), () => p(t), () => h(t));
  }
  function h($) {
    const _ = (0, Et._)`${$}.errors`;
    i.assign(ei.default.vErrors, (0, Et._)`${ei.default.vErrors} === null ? ${_} : ${ei.default.vErrors}.concat(${_})`), i.assign(ei.default.errors, (0, Et._)`${ei.default.vErrors}.length`);
  }
  function p($) {
    var _;
    if (!s.opts.unevaluated)
      return;
    const v = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (s.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (s.props = wo.mergeEvaluated.props(i, v.props, s.props));
      else {
        const m = i.var("props", (0, Et._)`${$}.evaluated.props`);
        s.props = wo.mergeEvaluated.props(i, m, s.props, Et.Name);
      }
    if (s.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (s.items = wo.mergeEvaluated.items(i, v.items, s.items));
      else {
        const m = i.var("items", (0, Et._)`${$}.evaluated.items`);
        s.items = wo.mergeEvaluated.items(i, m, s.items, Et.Name);
      }
  }
}
Hn.callRef = Qo;
Hn.default = LO;
Object.defineProperty(Ed, "__esModule", { value: !0 });
const xO = bd, VO = Hn, qO = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  xO.default,
  VO.default
];
Ed.default = qO;
var Sd = {}, Pd = {};
Object.defineProperty(Pd, "__esModule", { value: !0 });
const ma = de, zr = ma.operators, ya = {
  maximum: { okStr: "<=", ok: zr.LTE, fail: zr.GT },
  minimum: { okStr: ">=", ok: zr.GTE, fail: zr.LT },
  exclusiveMaximum: { okStr: "<", ok: zr.LT, fail: zr.GTE },
  exclusiveMinimum: { okStr: ">", ok: zr.GT, fail: zr.LTE }
}, BO = {
  message: ({ keyword: e, schemaCode: t }) => (0, ma.str)`must be ${ya[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, ma._)`{comparison: ${ya[e].okStr}, limit: ${t}}`
}, HO = {
  keyword: Object.keys(ya),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: BO,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, ma._)`${r} ${ya[t].fail} ${n} || isNaN(${r})`);
  }
};
Pd.default = HO;
var Td = {};
Object.defineProperty(Td, "__esModule", { value: !0 });
const ys = de, zO = {
  message: ({ schemaCode: e }) => (0, ys.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, ys._)`{multipleOf: ${e}}`
}, GO = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: zO,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, s = i.opts.multipleOfPrecision, o = t.let("res"), a = s ? (0, ys._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${s}` : (0, ys._)`${o} !== parseInt(${o})`;
    e.fail$data((0, ys._)`(${n} === 0 || (${o} = ${r}/${n}, ${a}))`);
  }
};
Td.default = GO;
var Nd = {}, Od = {};
Object.defineProperty(Od, "__esModule", { value: !0 });
function Zg(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Od.default = Zg;
Zg.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Nd, "__esModule", { value: !0 });
const Dn = de, WO = Y, KO = Od, YO = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Dn.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Dn._)`{limit: ${e}}`
}, XO = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: YO,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, s = t === "maxLength" ? Dn.operators.GT : Dn.operators.LT, o = i.opts.unicode === !1 ? (0, Dn._)`${r}.length` : (0, Dn._)`${(0, WO.useFunc)(e.gen, KO.default)}(${r})`;
    e.fail$data((0, Dn._)`${o} ${s} ${n}`);
  }
};
Nd.default = XO;
var Ad = {};
Object.defineProperty(Ad, "__esModule", { value: !0 });
const JO = pe, ga = de, QO = {
  message: ({ schemaCode: e }) => (0, ga.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, ga._)`{pattern: ${e}}`
}, ZO = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: QO,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: i, it: s } = e, o = s.opts.unicodeRegExp ? "u" : "", a = r ? (0, ga._)`(new RegExp(${i}, ${o}))` : (0, JO.usePattern)(e, n);
    e.fail$data((0, ga._)`!${a}.test(${t})`);
  }
};
Ad.default = ZO;
var Rd = {};
Object.defineProperty(Rd, "__esModule", { value: !0 });
const gs = de, eA = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, gs.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, gs._)`{limit: ${e}}`
}, tA = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: eA,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? gs.operators.GT : gs.operators.LT;
    e.fail$data((0, gs._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
Rd.default = tA;
var Cd = {};
Object.defineProperty(Cd, "__esModule", { value: !0 });
const Zi = pe, _s = de, rA = Y, nA = {
  message: ({ params: { missingProperty: e } }) => (0, _s.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, _s._)`{missingProperty: ${e}}`
}, iA = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: nA,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: i, $data: s, it: o } = e, { opts: a } = o;
    if (!s && r.length === 0)
      return;
    const c = r.length >= a.loopRequired;
    if (o.allErrors ? u() : l(), a.strictRequired) {
      const p = e.parentSchema.properties, { definedProperties: $ } = e.it;
      for (const _ of r)
        if ((p == null ? void 0 : p[_]) === void 0 && !$.has(_)) {
          const v = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${v}" (strictRequired)`;
          (0, rA.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function u() {
      if (c || s)
        e.block$data(_s.nil, d);
      else
        for (const p of r)
          (0, Zi.checkReportMissingProp)(e, p);
    }
    function l() {
      const p = t.let("missing");
      if (c || s) {
        const $ = t.let("valid", !0);
        e.block$data($, () => h(p, $)), e.ok($);
      } else
        t.if((0, Zi.checkMissingProp)(e, r, p)), (0, Zi.reportMissingProp)(e, p), t.else();
    }
    function d() {
      t.forOf("prop", n, (p) => {
        e.setParams({ missingProperty: p }), t.if((0, Zi.noPropertyInData)(t, i, p, a.ownProperties), () => e.error());
      });
    }
    function h(p, $) {
      e.setParams({ missingProperty: p }), t.forOf(p, n, () => {
        t.assign($, (0, Zi.propertyInData)(t, i, p, a.ownProperties)), t.if((0, _s.not)($), () => {
          e.error(), t.break();
        });
      }, _s.nil);
    }
  }
};
Cd.default = iA;
var Id = {};
Object.defineProperty(Id, "__esModule", { value: !0 });
const vs = de, sA = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, vs.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, vs._)`{limit: ${e}}`
}, oA = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: sA,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? vs.operators.GT : vs.operators.LT;
    e.fail$data((0, vs._)`${r}.length ${i} ${n}`);
  }
};
Id.default = oA;
var Dd = {}, Gs = {};
Object.defineProperty(Gs, "__esModule", { value: !0 });
const e0 = Fa;
e0.code = 'require("ajv/dist/runtime/equal").default';
Gs.default = e0;
Object.defineProperty(Dd, "__esModule", { value: !0 });
const Mc = Le, Ge = de, aA = Y, cA = Gs, lA = {
  message: ({ params: { i: e, j: t } }) => (0, Ge.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Ge._)`{i: ${e}, j: ${t}}`
}, uA = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: lA,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: s, schemaCode: o, it: a } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), u = s.items ? (0, Mc.getSchemaTypes)(s.items) : [];
    e.block$data(c, l, (0, Ge._)`${o} === false`), e.ok(c);
    function l() {
      const $ = t.let("i", (0, Ge._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: $, j: _ }), t.assign(c, !0), t.if((0, Ge._)`${$} > 1`, () => (d() ? h : p)($, _));
    }
    function d() {
      return u.length > 0 && !u.some(($) => $ === "object" || $ === "array");
    }
    function h($, _) {
      const v = t.name("item"), m = (0, Mc.checkDataTypes)(u, v, a.opts.strictNumbers, Mc.DataType.Wrong), E = t.const("indices", (0, Ge._)`{}`);
      t.for((0, Ge._)`;${$}--;`, () => {
        t.let(v, (0, Ge._)`${r}[${$}]`), t.if(m, (0, Ge._)`continue`), u.length > 1 && t.if((0, Ge._)`typeof ${v} == "string"`, (0, Ge._)`${v} += "_"`), t.if((0, Ge._)`typeof ${E}[${v}] == "number"`, () => {
          t.assign(_, (0, Ge._)`${E}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Ge._)`${E}[${v}] = ${$}`);
      });
    }
    function p($, _) {
      const v = (0, aA.useFunc)(t, cA.default), m = t.name("outer");
      t.label(m).for((0, Ge._)`;${$}--;`, () => t.for((0, Ge._)`${_} = ${$}; ${_}--;`, () => t.if((0, Ge._)`${v}(${r}[${$}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Dd.default = uA;
var kd = {};
Object.defineProperty(kd, "__esModule", { value: !0 });
const Ul = de, dA = Y, fA = Gs, hA = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Ul._)`{allowedValue: ${e}}`
}, pA = {
  keyword: "const",
  $data: !0,
  error: hA,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: s } = e;
    n || s && typeof s == "object" ? e.fail$data((0, Ul._)`!${(0, dA.useFunc)(t, fA.default)}(${r}, ${i})`) : e.fail((0, Ul._)`${s} !== ${r}`);
  }
};
kd.default = pA;
var Fd = {};
Object.defineProperty(Fd, "__esModule", { value: !0 });
const as = de, mA = Y, yA = Gs, gA = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, as._)`{allowedValues: ${e}}`
}, _A = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: gA,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: o } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const a = i.length >= o.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, mA.useFunc)(t, yA.default));
    let l;
    if (a || n)
      l = t.let("valid"), e.block$data(l, d);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const p = t.const("vSchema", s);
      l = (0, as.or)(...i.map(($, _) => h(p, _)));
    }
    e.pass(l);
    function d() {
      t.assign(l, !1), t.forOf("v", s, (p) => t.if((0, as._)`${u()}(${r}, ${p})`, () => t.assign(l, !0).break()));
    }
    function h(p, $) {
      const _ = i[$];
      return typeof _ == "object" && _ !== null ? (0, as._)`${u()}(${r}, ${p}[${$}])` : (0, as._)`${r} === ${_}`;
    }
  }
};
Fd.default = _A;
Object.defineProperty(Sd, "__esModule", { value: !0 });
const vA = Pd, $A = Td, wA = Nd, EA = Ad, bA = Rd, SA = Cd, PA = Id, TA = Dd, NA = kd, OA = Fd, AA = [
  // number
  vA.default,
  $A.default,
  // string
  wA.default,
  EA.default,
  // object
  bA.default,
  SA.default,
  // array
  PA.default,
  TA.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  NA.default,
  OA.default
];
Sd.default = AA;
var jd = {}, Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.validateAdditionalItems = void 0;
const kn = de, Ml = Y, RA = {
  message: ({ params: { len: e } }) => (0, kn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, kn._)`{limit: ${e}}`
}, CA = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: RA,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Ml.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    t0(e, n);
  }
};
function t0(e, t) {
  const { gen: r, schema: n, data: i, keyword: s, it: o } = e;
  o.items = !0;
  const a = r.const("len", (0, kn._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, kn._)`${a} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Ml.alwaysValidSchema)(o, n)) {
    const u = r.var("valid", (0, kn._)`${a} <= ${t.length}`);
    r.if((0, kn.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    r.forRange("i", t.length, a, (l) => {
      e.subschema({ keyword: s, dataProp: l, dataPropType: Ml.Type.Num }, u), o.allErrors || r.if((0, kn.not)(u), () => r.break());
    });
  }
}
Li.validateAdditionalItems = t0;
Li.default = CA;
var Ud = {}, xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.validateTuple = void 0;
const Xh = de, Zo = Y, IA = pe, DA = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return r0(e, "additionalItems", t);
    r.items = !0, !(0, Zo.alwaysValidSchema)(r, t) && e.ok((0, IA.validateArray)(e));
  }
};
function r0(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: o, it: a } = e;
  l(i), a.opts.unevaluated && r.length && a.items !== !0 && (a.items = Zo.mergeEvaluated.items(n, r.length, a.items));
  const c = n.name("valid"), u = n.const("len", (0, Xh._)`${s}.length`);
  r.forEach((d, h) => {
    (0, Zo.alwaysValidSchema)(a, d) || (n.if((0, Xh._)`${u} > ${h}`, () => e.subschema({
      keyword: o,
      schemaProp: h,
      dataProp: h
    }, c)), e.ok(c));
  });
  function l(d) {
    const { opts: h, errSchemaPath: p } = a, $ = r.length, _ = $ === d.minItems && ($ === d.maxItems || d[t] === !1);
    if (h.strictTuples && !_) {
      const v = `"${o}" is ${$}-tuple, but minItems or maxItems/${t} are not specified or different at path "${p}"`;
      (0, Zo.checkStrictMode)(a, v, h.strictTuples);
    }
  }
}
xi.validateTuple = r0;
xi.default = DA;
Object.defineProperty(Ud, "__esModule", { value: !0 });
const kA = xi, FA = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, kA.validateTuple)(e, "items")
};
Ud.default = FA;
var Md = {};
Object.defineProperty(Md, "__esModule", { value: !0 });
const Jh = de, jA = Y, UA = pe, MA = Li, LA = {
  message: ({ params: { len: e } }) => (0, Jh.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Jh._)`{limit: ${e}}`
}, xA = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: LA,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, jA.alwaysValidSchema)(n, t) && (i ? (0, MA.validateAdditionalItems)(e, i) : e.ok((0, UA.validateArray)(e)));
  }
};
Md.default = xA;
var Ld = {};
Object.defineProperty(Ld, "__esModule", { value: !0 });
const Lt = de, Eo = Y, VA = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Lt.str)`must contain at least ${e} valid item(s)` : (0, Lt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Lt._)`{minContains: ${e}}` : (0, Lt._)`{minContains: ${e}, maxContains: ${t}}`
}, qA = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: VA,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    let o, a;
    const { minContains: c, maxContains: u } = n;
    s.opts.next ? (o = c === void 0 ? 1 : c, a = u) : o = 1;
    const l = t.const("len", (0, Lt._)`${i}.length`);
    if (e.setParams({ min: o, max: a }), a === void 0 && o === 0) {
      (0, Eo.checkStrictMode)(s, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (a !== void 0 && o > a) {
      (0, Eo.checkStrictMode)(s, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Eo.alwaysValidSchema)(s, r)) {
      let _ = (0, Lt._)`${l} >= ${o}`;
      a !== void 0 && (_ = (0, Lt._)`${_} && ${l} <= ${a}`), e.pass(_);
      return;
    }
    s.items = !0;
    const d = t.name("valid");
    a === void 0 && o === 1 ? p(d, () => t.if(d, () => t.break())) : o === 0 ? (t.let(d, !0), a !== void 0 && t.if((0, Lt._)`${i}.length > 0`, h)) : (t.let(d, !1), h()), e.result(d, () => e.reset());
    function h() {
      const _ = t.name("_valid"), v = t.let("count", 0);
      p(_, () => t.if(_, () => $(v)));
    }
    function p(_, v) {
      t.forRange("i", 0, l, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Eo.Type.Num,
          compositeRule: !0
        }, _), v();
      });
    }
    function $(_) {
      t.code((0, Lt._)`${_}++`), a === void 0 ? t.if((0, Lt._)`${_} >= ${o}`, () => t.assign(d, !0).break()) : (t.if((0, Lt._)`${_} > ${a}`, () => t.assign(d, !1).break()), o === 1 ? t.assign(d, !0) : t.if((0, Lt._)`${_} >= ${o}`, () => t.assign(d, !0)));
    }
  }
};
Ld.default = qA;
var n0 = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = de, r = Y, n = pe;
  e.error = {
    message: ({ params: { property: c, depsCount: u, deps: l } }) => {
      const d = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${d} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: u, deps: l, missingProperty: d } }) => (0, t._)`{property: ${c},
    missingProperty: ${d},
    depsCount: ${u},
    deps: ${l}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [u, l] = s(c);
      o(c, u), a(c, l);
    }
  };
  function s({ schema: c }) {
    const u = {}, l = {};
    for (const d in c) {
      if (d === "__proto__")
        continue;
      const h = Array.isArray(c[d]) ? u : l;
      h[d] = c[d];
    }
    return [u, l];
  }
  function o(c, u = c.schema) {
    const { gen: l, data: d, it: h } = c;
    if (Object.keys(u).length === 0)
      return;
    const p = l.let("missing");
    for (const $ in u) {
      const _ = u[$];
      if (_.length === 0)
        continue;
      const v = (0, n.propertyInData)(l, d, $, h.opts.ownProperties);
      c.setParams({
        property: $,
        depsCount: _.length,
        deps: _.join(", ")
      }), h.allErrors ? l.if(v, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (l.if((0, t._)`${v} && (${(0, n.checkMissingProp)(c, _, p)})`), (0, n.reportMissingProp)(c, p), l.else());
    }
  }
  e.validatePropertyDeps = o;
  function a(c, u = c.schema) {
    const { gen: l, data: d, keyword: h, it: p } = c, $ = l.name("valid");
    for (const _ in u)
      (0, r.alwaysValidSchema)(p, u[_]) || (l.if(
        (0, n.propertyInData)(l, d, _, p.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: h, schemaProp: _ }, $);
          c.mergeValidEvaluated(v, $);
        },
        () => l.var($, !0)
        // TODO var
      ), c.ok($));
  }
  e.validateSchemaDeps = a, e.default = i;
})(n0);
var xd = {};
Object.defineProperty(xd, "__esModule", { value: !0 });
const i0 = de, BA = Y, HA = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, i0._)`{propertyName: ${e.propertyName}}`
}, zA = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: HA,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, BA.alwaysValidSchema)(i, r))
      return;
    const s = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, s), t.if((0, i0.not)(s), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(s);
  }
};
xd.default = zA;
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const bo = pe, Kt = de, GA = mr, So = Y, WA = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Kt._)`{additionalProperty: ${e.additionalProperty}}`
}, KA = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: WA,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, So.alwaysValidSchema)(o, r))
      return;
    const u = (0, bo.allSchemaProperties)(n.properties), l = (0, bo.allSchemaProperties)(n.patternProperties);
    d(), e.ok((0, Kt._)`${s} === ${GA.default.errors}`);
    function d() {
      t.forIn("key", i, (v) => {
        !u.length && !l.length ? $(v) : t.if(h(v), () => $(v));
      });
    }
    function h(v) {
      let m;
      if (u.length > 8) {
        const E = (0, So.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, bo.isOwnProperty)(t, E, v);
      } else u.length ? m = (0, Kt.or)(...u.map((E) => (0, Kt._)`${v} === ${E}`)) : m = Kt.nil;
      return l.length && (m = (0, Kt.or)(m, ...l.map((E) => (0, Kt._)`${(0, bo.usePattern)(e, E)}.test(${v})`))), (0, Kt.not)(m);
    }
    function p(v) {
      t.code((0, Kt._)`delete ${i}[${v}]`);
    }
    function $(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        p(v);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: v }), e.error(), a || t.break();
        return;
      }
      if (typeof r == "object" && !(0, So.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(v, m, !1), t.if((0, Kt.not)(m), () => {
          e.reset(), p(v);
        })) : (_(v, m), a || t.if((0, Kt.not)(m), () => t.break()));
      }
    }
    function _(v, m, E) {
      const A = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: So.Type.Str
      };
      E === !1 && Object.assign(A, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(A, m);
    }
  }
};
za.default = KA;
var Vd = {};
Object.defineProperty(Vd, "__esModule", { value: !0 });
const YA = er, Qh = pe, Lc = Y, Zh = za, XA = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Zh.default.code(new YA.KeywordCxt(s, Zh.default, "additionalProperties"));
    const o = (0, Qh.allSchemaProperties)(r);
    for (const d of o)
      s.definedProperties.add(d);
    s.opts.unevaluated && o.length && s.props !== !0 && (s.props = Lc.mergeEvaluated.props(t, (0, Lc.toHash)(o), s.props));
    const a = o.filter((d) => !(0, Lc.alwaysValidSchema)(s, r[d]));
    if (a.length === 0)
      return;
    const c = t.name("valid");
    for (const d of a)
      u(d) ? l(d) : (t.if((0, Qh.propertyInData)(t, i, d, s.opts.ownProperties)), l(d), s.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(d), e.ok(c);
    function u(d) {
      return s.opts.useDefaults && !s.compositeRule && r[d].default !== void 0;
    }
    function l(d) {
      e.subschema({
        keyword: "properties",
        schemaProp: d,
        dataProp: d
      }, c);
    }
  }
};
Vd.default = XA;
var qd = {};
Object.defineProperty(qd, "__esModule", { value: !0 });
const ep = pe, Po = de, tp = Y, rp = Y, JA = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: s } = e, { opts: o } = s, a = (0, ep.allSchemaProperties)(r), c = a.filter((_) => (0, tp.alwaysValidSchema)(s, r[_]));
    if (a.length === 0 || c.length === a.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const u = o.strictSchema && !o.allowMatchingProperties && i.properties, l = t.name("valid");
    s.props !== !0 && !(s.props instanceof Po.Name) && (s.props = (0, rp.evaluatedPropsToName)(t, s.props));
    const { props: d } = s;
    h();
    function h() {
      for (const _ of a)
        u && p(_), s.allErrors ? $(_) : (t.var(l, !0), $(_), t.if(l));
    }
    function p(_) {
      for (const v in u)
        new RegExp(_).test(v) && (0, tp.checkStrictMode)(s, `property ${v} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function $(_) {
      t.forIn("key", n, (v) => {
        t.if((0, Po._)`${(0, ep.usePattern)(e, _)}.test(${v})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: v,
            dataPropType: rp.Type.Str
          }, l), s.opts.unevaluated && d !== !0 ? t.assign((0, Po._)`${d}[${v}]`, !0) : !m && !s.allErrors && t.if((0, Po.not)(l), () => t.break());
        });
      });
    }
  }
};
qd.default = JA;
var Bd = {};
Object.defineProperty(Bd, "__esModule", { value: !0 });
const QA = Y, ZA = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, QA.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Bd.default = ZA;
var Hd = {};
Object.defineProperty(Hd, "__esModule", { value: !0 });
const eR = pe, tR = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: eR.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Hd.default = tR;
var zd = {};
Object.defineProperty(zd, "__esModule", { value: !0 });
const ea = de, rR = Y, nR = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, ea._)`{passingSchemas: ${e.passing}}`
}, iR = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: nR,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: i } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && n.discriminator)
      return;
    const s = r, o = t.let("valid", !1), a = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: a }), t.block(u), e.result(o, () => e.reset(), () => e.error(!0));
    function u() {
      s.forEach((l, d) => {
        let h;
        (0, rR.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
          keyword: "oneOf",
          schemaProp: d,
          compositeRule: !0
        }, c), d > 0 && t.if((0, ea._)`${c} && ${o}`).assign(o, !1).assign(a, (0, ea._)`[${a}, ${d}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(a, d), h && e.mergeEvaluated(h, ea.Name);
        });
      });
    }
  }
};
zd.default = iR;
var Gd = {};
Object.defineProperty(Gd, "__esModule", { value: !0 });
const sR = Y, oR = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((s, o) => {
      if ((0, sR.alwaysValidSchema)(n, s))
        return;
      const a = e.subschema({ keyword: "allOf", schemaProp: o }, i);
      e.ok(i), e.mergeEvaluated(a);
    });
  }
};
Gd.default = oR;
var Wd = {};
Object.defineProperty(Wd, "__esModule", { value: !0 });
const _a = de, s0 = Y, aR = {
  message: ({ params: e }) => (0, _a.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, _a._)`{failingKeyword: ${e.ifClause}}`
}, cR = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: aR,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, s0.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = np(n, "then"), s = np(n, "else");
    if (!i && !s)
      return;
    const o = t.let("valid", !0), a = t.name("_valid");
    if (c(), e.reset(), i && s) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(a, u("then", l), u("else", l));
    } else i ? t.if(a, u("then")) : t.if((0, _a.not)(a), u("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, a);
      e.mergeEvaluated(l);
    }
    function u(l, d) {
      return () => {
        const h = e.subschema({ keyword: l }, a);
        t.assign(o, a), e.mergeValidEvaluated(h, o), d ? t.assign(d, (0, _a._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function np(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, s0.alwaysValidSchema)(e, r);
}
Wd.default = cR;
var Kd = {};
Object.defineProperty(Kd, "__esModule", { value: !0 });
const lR = Y, uR = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, lR.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Kd.default = uR;
Object.defineProperty(jd, "__esModule", { value: !0 });
const dR = Li, fR = Ud, hR = xi, pR = Md, mR = Ld, yR = n0, gR = xd, _R = za, vR = Vd, $R = qd, wR = Bd, ER = Hd, bR = zd, SR = Gd, PR = Wd, TR = Kd;
function NR(e = !1) {
  const t = [
    // any
    wR.default,
    ER.default,
    bR.default,
    SR.default,
    PR.default,
    TR.default,
    // object
    gR.default,
    _R.default,
    yR.default,
    vR.default,
    $R.default
  ];
  return e ? t.push(fR.default, pR.default) : t.push(dR.default, hR.default), t.push(mR.default), t;
}
jd.default = NR;
var Yd = {}, Xd = {};
Object.defineProperty(Xd, "__esModule", { value: !0 });
const ke = de, OR = {
  message: ({ schemaCode: e }) => (0, ke.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ke._)`{format: ${e}}`
}, AR = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: OR,
  code(e, t) {
    const { gen: r, data: n, $data: i, schema: s, schemaCode: o, it: a } = e, { opts: c, errSchemaPath: u, schemaEnv: l, self: d } = a;
    if (!c.validateFormats)
      return;
    i ? h() : p();
    function h() {
      const $ = r.scopeValue("formats", {
        ref: d.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, ke._)`${$}[${o}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, ke._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(v, (0, ke._)`${_}.type || "string"`).assign(m, (0, ke._)`${_}.validate`), () => r.assign(v, (0, ke._)`"string"`).assign(m, _)), e.fail$data((0, ke.or)(E(), A()));
      function E() {
        return c.strictSchema === !1 ? ke.nil : (0, ke._)`${o} && !${m}`;
      }
      function A() {
        const I = l.$async ? (0, ke._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, ke._)`${m}(${n})`, F = (0, ke._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
        return (0, ke._)`${m} && ${m} !== true && ${v} === ${t} && !${F}`;
      }
    }
    function p() {
      const $ = d.formats[s];
      if (!$) {
        E();
        return;
      }
      if ($ === !0)
        return;
      const [_, v, m] = A($);
      _ === t && e.pass(I());
      function E() {
        if (c.strictSchema === !1) {
          d.logger.warn(F());
          return;
        }
        throw new Error(F());
        function F() {
          return `unknown format "${s}" ignored in schema at path "${u}"`;
        }
      }
      function A(F) {
        const z = F instanceof RegExp ? (0, ke.regexpCode)(F) : c.code.formats ? (0, ke._)`${c.code.formats}${(0, ke.getProperty)(s)}` : void 0, G = r.scopeValue("formats", { key: s, ref: F, code: z });
        return typeof F == "object" && !(F instanceof RegExp) ? [F.type || "string", F.validate, (0, ke._)`${G}.validate`] : ["string", F, G];
      }
      function I() {
        if (typeof $ == "object" && !($ instanceof RegExp) && $.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, ke._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, ke._)`${m}(${n})` : (0, ke._)`${m}.test(${n})`;
      }
    }
  }
};
Xd.default = AR;
Object.defineProperty(Yd, "__esModule", { value: !0 });
const RR = Xd, CR = [RR.default];
Yd.default = CR;
var Oi = {};
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.contentVocabulary = Oi.metadataVocabulary = void 0;
Oi.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Oi.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(wd, "__esModule", { value: !0 });
const IR = Ed, DR = Sd, kR = jd, FR = Yd, ip = Oi, jR = [
  IR.default,
  DR.default,
  (0, kR.default)(),
  FR.default,
  ip.metadataVocabulary,
  ip.contentVocabulary
];
wd.default = jR;
var Jd = {}, Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
Ga.DiscrError = void 0;
var sp;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(sp || (Ga.DiscrError = sp = {}));
Object.defineProperty(Jd, "__esModule", { value: !0 });
const ci = de, Ll = Ga, op = bt, UR = Mi, MR = Y, LR = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Ll.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, ci._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, xR = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: LR,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: i, it: s } = e, { oneOf: o } = i;
    if (!s.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const a = n.propertyName;
    if (typeof a != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), u = t.const("tag", (0, ci._)`${r}${(0, ci.getProperty)(a)}`);
    t.if((0, ci._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: Ll.DiscrError.Tag, tag: u, tagName: a })), e.ok(c);
    function l() {
      const p = h();
      t.if(!1);
      for (const $ in p)
        t.elseIf((0, ci._)`${u} === ${$}`), t.assign(c, d(p[$]));
      t.else(), e.error(!1, { discrError: Ll.DiscrError.Mapping, tag: u, tagName: a }), t.endIf();
    }
    function d(p) {
      const $ = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: p }, $);
      return e.mergeEvaluated(_, ci.Name), $;
    }
    function h() {
      var p;
      const $ = {}, _ = m(i);
      let v = !0;
      for (let I = 0; I < o.length; I++) {
        let F = o[I];
        if (F != null && F.$ref && !(0, MR.schemaHasRulesButRef)(F, s.self.RULES)) {
          const G = F.$ref;
          if (F = op.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, G), F instanceof op.SchemaEnv && (F = F.schema), F === void 0)
            throw new UR.default(s.opts.uriResolver, s.baseId, G);
        }
        const z = (p = F == null ? void 0 : F.properties) === null || p === void 0 ? void 0 : p[a];
        if (typeof z != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${a}"`);
        v = v && (_ || m(F)), E(z, I);
      }
      if (!v)
        throw new Error(`discriminator: "${a}" must be required`);
      return $;
      function m({ required: I }) {
        return Array.isArray(I) && I.includes(a);
      }
      function E(I, F) {
        if (I.const)
          A(I.const, F);
        else if (I.enum)
          for (const z of I.enum)
            A(z, F);
        else
          throw new Error(`discriminator: "properties/${a}" must have "const" or "enum"`);
      }
      function A(I, F) {
        if (typeof I != "string" || I in $)
          throw new Error(`discriminator: "${a}" values must be unique strings`);
        $[I] = F;
      }
    }
  }
};
Jd.default = xR;
const VR = "http://json-schema.org/draft-07/schema#", qR = "http://json-schema.org/draft-07/schema#", BR = "Core schema meta-schema", HR = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, zR = [
  "object",
  "boolean"
], GR = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, WR = {
  $schema: VR,
  $id: qR,
  title: BR,
  definitions: HR,
  type: zR,
  properties: GR,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = vg, n = wd, i = Jd, s = WR, o = ["/properties"], a = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach(($) => this.addVocabulary($)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const $ = this.opts.$data ? this.$dataMetaSchema(s, o) : s;
      this.addMetaSchema($, a, !1), this.refs["http://json-schema.org/schema"] = a;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var u = er;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var l = de;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var d = _d();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return d.default;
  } });
  var h = Mi;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Il, Il.exports);
var KR = Il.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = KR, r = de, n = r.operators, i = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, s = {
    message: ({ keyword: a, schemaCode: c }) => (0, r.str)`should be ${i[a].okStr} ${c}`,
    params: ({ keyword: a, schemaCode: c }) => (0, r._)`{comparison: ${i[a].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(i),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: s,
    code(a) {
      const { gen: c, data: u, schemaCode: l, keyword: d, it: h } = a, { opts: p, self: $ } = h;
      if (!p.validateFormats)
        return;
      const _ = new t.KeywordCxt(h, $.RULES.all.format.definition, "format");
      _.$data ? v() : m();
      function v() {
        const A = c.scopeValue("formats", {
          ref: $.formats,
          code: p.code.formats
        }), I = c.const("fmt", (0, r._)`${A}[${_.schemaCode}]`);
        a.fail$data((0, r.or)((0, r._)`typeof ${I} != "object"`, (0, r._)`${I} instanceof RegExp`, (0, r._)`typeof ${I}.compare != "function"`, E(I)));
      }
      function m() {
        const A = _.schema, I = $.formats[A];
        if (!I || I === !0)
          return;
        if (typeof I != "object" || I instanceof RegExp || typeof I.compare != "function")
          throw new Error(`"${d}": format "${A}" does not define "compare" function`);
        const F = c.scopeValue("formats", {
          key: A,
          ref: I,
          code: p.code.formats ? (0, r._)`${p.code.formats}${(0, r.getProperty)(A)}` : void 0
        });
        a.fail$data(E(F));
      }
      function E(A) {
        return (0, r._)`${A}.compare(${u}, ${l}) ${i[d].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (a) => (a.addKeyword(e.formatLimitDefinition), a);
  e.default = o;
})(_g);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = gg, n = _g, i = de, s = new i.Name("fullFormats"), o = new i.Name("fastFormats"), a = (u, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(u, l, r.fullFormats, s), u;
    const [d, h] = l.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, s], p = l.formats || r.formatNames;
    return c(u, p, d, h), l.keywords && (0, n.default)(u), u;
  };
  a.get = (u, l = "full") => {
    const h = (l === "fast" ? r.fastFormats : r.fullFormats)[u];
    if (!h)
      throw new Error(`Unknown format "${u}"`);
    return h;
  };
  function c(u, l, d, h) {
    var p, $;
    (p = ($ = u.opts.code).formats) !== null && p !== void 0 || ($.formats = (0, i._)`require("ajv-formats/dist/formats").${h}`);
    for (const _ of l)
      u.addFormat(_, d[_]);
  }
  e.exports = t = a, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = a;
})(Cl, Cl.exports);
var YR = Cl.exports;
const XR = /* @__PURE__ */ gy(YR), JR = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const i = Object.getOwnPropertyDescriptor(e, r), s = Object.getOwnPropertyDescriptor(t, r);
  !QR(i, s) && n || Object.defineProperty(e, r, s);
}, QR = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, ZR = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, eC = (e, t) => `/* Wrapped ${e}*/
${t}`, tC = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), rC = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), nC = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, i = eC.bind(null, n, t.toString());
  Object.defineProperty(i, "name", rC);
  const { writable: s, enumerable: o, configurable: a } = tC;
  Object.defineProperty(e, "toString", { value: i, writable: s, enumerable: o, configurable: a });
};
function iC(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const i of Reflect.ownKeys(t))
    JR(e, t, i, r);
  return ZR(e, t), nC(e, t, n), e;
}
const ap = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: i = !1,
    after: s = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!i && !s)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, a, c;
  const u = function(...l) {
    const d = this, h = () => {
      o = void 0, a && (clearTimeout(a), a = void 0), s && (c = e.apply(d, l));
    }, p = () => {
      a = void 0, o && (clearTimeout(o), o = void 0), s && (c = e.apply(d, l));
    }, $ = i && !o;
    return clearTimeout(o), o = setTimeout(h, r), n > 0 && n !== Number.POSITIVE_INFINITY && !a && (a = setTimeout(p, n)), $ && (c = e.apply(d, l)), c;
  };
  return iC(u, e), u.cancel = () => {
    o && (clearTimeout(o), o = void 0), a && (clearTimeout(a), a = void 0);
  }, u;
};
var xl = { exports: {} };
const sC = "2.0.0", o0 = 256, oC = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, aC = 16, cC = o0 - 6, lC = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Wa = {
  MAX_LENGTH: o0,
  MAX_SAFE_COMPONENT_LENGTH: aC,
  MAX_SAFE_BUILD_LENGTH: cC,
  MAX_SAFE_INTEGER: oC,
  RELEASE_TYPES: lC,
  SEMVER_SPEC_VERSION: sC,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const uC = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ka = uC;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = Wa, s = Ka;
  t = e.exports = {};
  const o = t.re = [], a = t.safeRe = [], c = t.src = [], u = t.safeSrc = [], l = t.t = {};
  let d = 0;
  const h = "[a-zA-Z0-9-]", p = [
    ["\\s", 1],
    ["\\d", i],
    [h, n]
  ], $ = (v) => {
    for (const [m, E] of p)
      v = v.split(`${m}*`).join(`${m}{0,${E}}`).split(`${m}+`).join(`${m}{1,${E}}`);
    return v;
  }, _ = (v, m, E) => {
    const A = $(m), I = d++;
    s(v, I, m), l[v] = I, c[I] = m, u[I] = A, o[I] = new RegExp(m, E ? "g" : void 0), a[I] = new RegExp(A, E ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), _("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${h}+`), _("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), _("FULL", `^${c[l.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), _("LOOSE", `^${c[l.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), _("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[l.COERCE], !0), _("COERCERTLFULL", c[l.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(xl, xl.exports);
var Ws = xl.exports;
const dC = Object.freeze({ loose: !0 }), fC = Object.freeze({}), hC = (e) => e ? typeof e != "object" ? dC : e : fC;
var Qd = hC;
const cp = /^[0-9]+$/, a0 = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = cp.test(e), n = cp.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, pC = (e, t) => a0(t, e);
var c0 = {
  compareIdentifiers: a0,
  rcompareIdentifiers: pC
};
const To = Ka, { MAX_LENGTH: lp, MAX_SAFE_INTEGER: No } = Wa, { safeRe: Oo, t: Ao } = Ws, mC = Qd, { compareIdentifiers: xc } = c0;
let yC = class or {
  constructor(t, r) {
    if (r = mC(r), t instanceof or) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > lp)
      throw new TypeError(
        `version is longer than ${lp} characters`
      );
    To("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Oo[Ao.LOOSE] : Oo[Ao.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > No || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > No || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > No || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const s = +i;
        if (s >= 0 && s < No)
          return s;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (To("SemVer.compare", this.version, this.options, t), !(t instanceof or)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new or(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof or || (t = new or(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof or || (t = new or(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (To("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return xc(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof or || (t = new or(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (To("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return xc(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Oo[Ao.PRERELEASELOOSE] : Oo[Ao.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let s = this.prerelease.length;
          for (; --s >= 0; )
            typeof this.prerelease[s] == "number" && (this.prerelease[s]++, s = -2);
          if (s === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let s = [r, i];
          n === !1 && (s = [r]), xc(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var mt = yC;
const up = mt, gC = (e, t, r = !1) => {
  if (e instanceof up)
    return e;
  try {
    return new up(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Vi = gC;
const _C = Vi, vC = (e, t) => {
  const r = _C(e, t);
  return r ? r.version : null;
};
var $C = vC;
const wC = Vi, EC = (e, t) => {
  const r = wC(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var bC = EC;
const dp = mt, SC = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new dp(
      e instanceof dp ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var PC = SC;
const fp = Vi, TC = (e, t) => {
  const r = fp(e, null, !0), n = fp(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const s = i > 0, o = s ? r : n, a = s ? n : r, c = !!o.prerelease.length;
  if (!!a.prerelease.length && !c) {
    if (!a.patch && !a.minor)
      return "major";
    if (a.compareMain(o) === 0)
      return a.minor && !a.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};
var NC = TC;
const OC = mt, AC = (e, t) => new OC(e, t).major;
var RC = AC;
const CC = mt, IC = (e, t) => new CC(e, t).minor;
var DC = IC;
const kC = mt, FC = (e, t) => new kC(e, t).patch;
var jC = FC;
const UC = Vi, MC = (e, t) => {
  const r = UC(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var LC = MC;
const hp = mt, xC = (e, t, r) => new hp(e, r).compare(new hp(t, r));
var tr = xC;
const VC = tr, qC = (e, t, r) => VC(t, e, r);
var BC = qC;
const HC = tr, zC = (e, t) => HC(e, t, !0);
var GC = zC;
const pp = mt, WC = (e, t, r) => {
  const n = new pp(e, r), i = new pp(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Zd = WC;
const KC = Zd, YC = (e, t) => e.sort((r, n) => KC(r, n, t));
var XC = YC;
const JC = Zd, QC = (e, t) => e.sort((r, n) => JC(n, r, t));
var ZC = QC;
const eI = tr, tI = (e, t, r) => eI(e, t, r) > 0;
var Ya = tI;
const rI = tr, nI = (e, t, r) => rI(e, t, r) < 0;
var ef = nI;
const iI = tr, sI = (e, t, r) => iI(e, t, r) === 0;
var l0 = sI;
const oI = tr, aI = (e, t, r) => oI(e, t, r) !== 0;
var u0 = aI;
const cI = tr, lI = (e, t, r) => cI(e, t, r) >= 0;
var tf = lI;
const uI = tr, dI = (e, t, r) => uI(e, t, r) <= 0;
var rf = dI;
const fI = l0, hI = u0, pI = Ya, mI = tf, yI = ef, gI = rf, _I = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return fI(e, r, n);
    case "!=":
      return hI(e, r, n);
    case ">":
      return pI(e, r, n);
    case ">=":
      return mI(e, r, n);
    case "<":
      return yI(e, r, n);
    case "<=":
      return gI(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var d0 = _I;
const vI = mt, $I = Vi, { safeRe: Ro, t: Co } = Ws, wI = (e, t) => {
  if (e instanceof vI)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Ro[Co.COERCEFULL] : Ro[Co.COERCE]);
  else {
    const c = t.includePrerelease ? Ro[Co.COERCERTLFULL] : Ro[Co.COERCERTL];
    let u;
    for (; (u = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || u.index + u[0].length !== r.index + r[0].length) && (r = u), c.lastIndex = u.index + u[1].length + u[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", s = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", a = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return $I(`${n}.${i}.${s}${o}${a}`, t);
};
var EI = wI;
class bI {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var SI = bI, Vc, mp;
function rr() {
  if (mp) return Vc;
  mp = 1;
  const e = /\s+/g;
  class t {
    constructor(U, B) {
      if (B = i(B), U instanceof t)
        return U.loose === !!B.loose && U.includePrerelease === !!B.includePrerelease ? U : new t(U.raw, B);
      if (U instanceof s)
        return this.raw = U.value, this.set = [[U]], this.formatted = void 0, this;
      if (this.options = B, this.loose = !!B.loose, this.includePrerelease = !!B.includePrerelease, this.raw = U.trim().replace(e, " "), this.set = this.raw.split("||").map((M) => this.parseRange(M.trim())).filter((M) => M.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const M = this.set[0];
        if (this.set = this.set.filter((H) => !_(H[0])), this.set.length === 0)
          this.set = [M];
        else if (this.set.length > 1) {
          for (const H of this.set)
            if (H.length === 1 && v(H[0])) {
              this.set = [H];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let U = 0; U < this.set.length; U++) {
          U > 0 && (this.formatted += "||");
          const B = this.set[U];
          for (let M = 0; M < B.length; M++)
            M > 0 && (this.formatted += " "), this.formatted += B[M].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(U) {
      const M = ((this.options.includePrerelease && p) | (this.options.loose && $)) + ":" + U, H = n.get(M);
      if (H)
        return H;
      const V = this.options.loose, C = V ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      U = U.replace(C, q(this.options.includePrerelease)), o("hyphen replace", U), U = U.replace(c[u.COMPARATORTRIM], l), o("comparator trim", U), U = U.replace(c[u.TILDETRIM], d), o("tilde trim", U), U = U.replace(c[u.CARETTRIM], h), o("caret trim", U);
      let b = U.split(" ").map((g) => E(g, this.options)).join(" ").split(/\s+/).map((g) => x(g, this.options));
      V && (b = b.filter((g) => (o("loose invalid filter", g, this.options), !!g.match(c[u.COMPARATORLOOSE])))), o("range list", b);
      const N = /* @__PURE__ */ new Map(), S = b.map((g) => new s(g, this.options));
      for (const g of S) {
        if (_(g))
          return [g];
        N.set(g.value, g);
      }
      N.size > 1 && N.has("") && N.delete("");
      const f = [...N.values()];
      return n.set(M, f), f;
    }
    intersects(U, B) {
      if (!(U instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((M) => m(M, B) && U.set.some((H) => m(H, B) && M.every((V) => H.every((C) => V.intersects(C, B)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(U) {
      if (!U)
        return !1;
      if (typeof U == "string")
        try {
          U = new a(U, this.options);
        } catch {
          return !1;
        }
      for (let B = 0; B < this.set.length; B++)
        if (J(this.set[B], U, this.options))
          return !0;
      return !1;
    }
  }
  Vc = t;
  const r = SI, n = new r(), i = Qd, s = Xa(), o = Ka, a = mt, {
    safeRe: c,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: d,
    caretTrimReplace: h
  } = Ws, { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: $ } = Wa, _ = (j) => j.value === "<0.0.0-0", v = (j) => j.value === "", m = (j, U) => {
    let B = !0;
    const M = j.slice();
    let H = M.pop();
    for (; B && M.length; )
      B = M.every((V) => H.intersects(V, U)), H = M.pop();
    return B;
  }, E = (j, U) => (j = j.replace(c[u.BUILD], ""), o("comp", j, U), j = z(j, U), o("caret", j), j = I(j, U), o("tildes", j), j = me(j, U), o("xrange", j), j = Q(j, U), o("stars", j), j), A = (j) => !j || j.toLowerCase() === "x" || j === "*", I = (j, U) => j.trim().split(/\s+/).map((B) => F(B, U)).join(" "), F = (j, U) => {
    const B = U.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return j.replace(B, (M, H, V, C, b) => {
      o("tilde", j, M, H, V, C, b);
      let N;
      return A(H) ? N = "" : A(V) ? N = `>=${H}.0.0 <${+H + 1}.0.0-0` : A(C) ? N = `>=${H}.${V}.0 <${H}.${+V + 1}.0-0` : b ? (o("replaceTilde pr", b), N = `>=${H}.${V}.${C}-${b} <${H}.${+V + 1}.0-0`) : N = `>=${H}.${V}.${C} <${H}.${+V + 1}.0-0`, o("tilde return", N), N;
    });
  }, z = (j, U) => j.trim().split(/\s+/).map((B) => G(B, U)).join(" "), G = (j, U) => {
    o("caret", j, U);
    const B = U.loose ? c[u.CARETLOOSE] : c[u.CARET], M = U.includePrerelease ? "-0" : "";
    return j.replace(B, (H, V, C, b, N) => {
      o("caret", j, H, V, C, b, N);
      let S;
      return A(V) ? S = "" : A(C) ? S = `>=${V}.0.0${M} <${+V + 1}.0.0-0` : A(b) ? V === "0" ? S = `>=${V}.${C}.0${M} <${V}.${+C + 1}.0-0` : S = `>=${V}.${C}.0${M} <${+V + 1}.0.0-0` : N ? (o("replaceCaret pr", N), V === "0" ? C === "0" ? S = `>=${V}.${C}.${b}-${N} <${V}.${C}.${+b + 1}-0` : S = `>=${V}.${C}.${b}-${N} <${V}.${+C + 1}.0-0` : S = `>=${V}.${C}.${b}-${N} <${+V + 1}.0.0-0`) : (o("no pr"), V === "0" ? C === "0" ? S = `>=${V}.${C}.${b}${M} <${V}.${C}.${+b + 1}-0` : S = `>=${V}.${C}.${b}${M} <${V}.${+C + 1}.0-0` : S = `>=${V}.${C}.${b} <${+V + 1}.0.0-0`), o("caret return", S), S;
    });
  }, me = (j, U) => (o("replaceXRanges", j, U), j.split(/\s+/).map((B) => R(B, U)).join(" ")), R = (j, U) => {
    j = j.trim();
    const B = U.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return j.replace(B, (M, H, V, C, b, N) => {
      o("xRange", j, M, H, V, C, b, N);
      const S = A(V), f = S || A(C), g = f || A(b), T = g;
      return H === "=" && T && (H = ""), N = U.includePrerelease ? "-0" : "", S ? H === ">" || H === "<" ? M = "<0.0.0-0" : M = "*" : H && T ? (f && (C = 0), b = 0, H === ">" ? (H = ">=", f ? (V = +V + 1, C = 0, b = 0) : (C = +C + 1, b = 0)) : H === "<=" && (H = "<", f ? V = +V + 1 : C = +C + 1), H === "<" && (N = "-0"), M = `${H + V}.${C}.${b}${N}`) : f ? M = `>=${V}.0.0${N} <${+V + 1}.0.0-0` : g && (M = `>=${V}.${C}.0${N} <${V}.${+C + 1}.0-0`), o("xRange return", M), M;
    });
  }, Q = (j, U) => (o("replaceStars", j, U), j.trim().replace(c[u.STAR], "")), x = (j, U) => (o("replaceGTE0", j, U), j.trim().replace(c[U.includePrerelease ? u.GTE0PRE : u.GTE0], "")), q = (j) => (U, B, M, H, V, C, b, N, S, f, g, T) => (A(M) ? B = "" : A(H) ? B = `>=${M}.0.0${j ? "-0" : ""}` : A(V) ? B = `>=${M}.${H}.0${j ? "-0" : ""}` : C ? B = `>=${B}` : B = `>=${B}${j ? "-0" : ""}`, A(S) ? N = "" : A(f) ? N = `<${+S + 1}.0.0-0` : A(g) ? N = `<${S}.${+f + 1}.0-0` : T ? N = `<=${S}.${f}.${g}-${T}` : j ? N = `<${S}.${f}.${+g + 1}-0` : N = `<=${N}`, `${B} ${N}`.trim()), J = (j, U, B) => {
    for (let M = 0; M < j.length; M++)
      if (!j[M].test(U))
        return !1;
    if (U.prerelease.length && !B.includePrerelease) {
      for (let M = 0; M < j.length; M++)
        if (o(j[M].semver), j[M].semver !== s.ANY && j[M].semver.prerelease.length > 0) {
          const H = j[M].semver;
          if (H.major === U.major && H.minor === U.minor && H.patch === U.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Vc;
}
var qc, yp;
function Xa() {
  if (yp) return qc;
  yp = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, d) {
      if (d = r(d), l instanceof t) {
        if (l.loose === !!d.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), o("comparator", l, d), this.options = d, this.loose = !!d.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(l) {
      const d = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], h = l.match(d);
      if (!h)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new a(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (o("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new a(l, this.options);
        } catch {
          return !1;
        }
      return s(l, this.operator, this.semver, this.options);
    }
    intersects(l, d) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, d).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, d).test(l.semver) : (d = r(d), d.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !d.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || s(this.semver, "<", l.semver, d) && this.operator.startsWith(">") && l.operator.startsWith("<") || s(this.semver, ">", l.semver, d) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  qc = t;
  const r = Qd, { safeRe: n, t: i } = Ws, s = d0, o = Ka, a = mt, c = rr();
  return qc;
}
const PI = rr(), TI = (e, t, r) => {
  try {
    t = new PI(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ja = TI;
const NI = rr(), OI = (e, t) => new NI(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var AI = OI;
const RI = mt, CI = rr(), II = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new CI(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === -1) && (n = o, i = new RI(n, r));
  }), n;
};
var DI = II;
const kI = mt, FI = rr(), jI = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new FI(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === 1) && (n = o, i = new kI(n, r));
  }), n;
};
var UI = jI;
const Bc = mt, MI = rr(), gp = Ya, LI = (e, t) => {
  e = new MI(e, t);
  let r = new Bc("0.0.0");
  if (e.test(r) || (r = new Bc("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let s = null;
    i.forEach((o) => {
      const a = new Bc(o.semver.version);
      switch (o.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!s || gp(a, s)) && (s = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), s && (!r || gp(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var xI = LI;
const VI = rr(), qI = (e, t) => {
  try {
    return new VI(e, t).range || "*";
  } catch {
    return null;
  }
};
var BI = qI;
const HI = mt, f0 = Xa(), { ANY: zI } = f0, GI = rr(), WI = Ja, _p = Ya, vp = ef, KI = rf, YI = tf, XI = (e, t, r, n) => {
  e = new HI(e, n), t = new GI(t, n);
  let i, s, o, a, c;
  switch (r) {
    case ">":
      i = _p, s = KI, o = vp, a = ">", c = ">=";
      break;
    case "<":
      i = vp, s = YI, o = _p, a = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (WI(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let d = null, h = null;
    if (l.forEach((p) => {
      p.semver === zI && (p = new f0(">=0.0.0")), d = d || p, h = h || p, i(p.semver, d.semver, n) ? d = p : o(p.semver, h.semver, n) && (h = p);
    }), d.operator === a || d.operator === c || (!h.operator || h.operator === a) && s(e, h.semver))
      return !1;
    if (h.operator === c && o(e, h.semver))
      return !1;
  }
  return !0;
};
var nf = XI;
const JI = nf, QI = (e, t, r) => JI(e, t, ">", r);
var ZI = QI;
const eD = nf, tD = (e, t, r) => eD(e, t, "<", r);
var rD = tD;
const $p = rr(), nD = (e, t, r) => (e = new $p(e, r), t = new $p(t, r), e.intersects(t, r));
var iD = nD;
const sD = Ja, oD = tr;
var aD = (e, t, r) => {
  const n = [];
  let i = null, s = null;
  const o = e.sort((l, d) => oD(l, d, r));
  for (const l of o)
    sD(l, t, r) ? (s = l, i || (i = l)) : (s && n.push([i, s]), s = null, i = null);
  i && n.push([i, null]);
  const a = [];
  for (const [l, d] of n)
    l === d ? a.push(l) : !d && l === o[0] ? a.push("*") : d ? l === o[0] ? a.push(`<=${d}`) : a.push(`${l} - ${d}`) : a.push(`>=${l}`);
  const c = a.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < u.length ? c : t;
};
const wp = rr(), sf = Xa(), { ANY: Hc } = sf, es = Ja, of = tr, cD = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new wp(e, r), t = new wp(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const s of t.set) {
      const o = uD(i, s, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, lD = [new sf(">=0.0.0-0")], Ep = [new sf(">=0.0.0")], uD = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Hc) {
    if (t.length === 1 && t[0].semver === Hc)
      return !0;
    r.includePrerelease ? e = lD : e = Ep;
  }
  if (t.length === 1 && t[0].semver === Hc) {
    if (r.includePrerelease)
      return !0;
    t = Ep;
  }
  const n = /* @__PURE__ */ new Set();
  let i, s;
  for (const p of e)
    p.operator === ">" || p.operator === ">=" ? i = bp(i, p, r) : p.operator === "<" || p.operator === "<=" ? s = Sp(s, p, r) : n.add(p.semver);
  if (n.size > 1)
    return null;
  let o;
  if (i && s) {
    if (o = of(i.semver, s.semver, r), o > 0)
      return null;
    if (o === 0 && (i.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const p of n) {
    if (i && !es(p, String(i), r) || s && !es(p, String(s), r))
      return null;
    for (const $ of t)
      if (!es(p, String($), r))
        return !1;
    return !0;
  }
  let a, c, u, l, d = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, h = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  d && d.prerelease.length === 1 && s.operator === "<" && d.prerelease[0] === 0 && (d = !1);
  for (const p of t) {
    if (l = l || p.operator === ">" || p.operator === ">=", u = u || p.operator === "<" || p.operator === "<=", i) {
      if (h && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === h.major && p.semver.minor === h.minor && p.semver.patch === h.patch && (h = !1), p.operator === ">" || p.operator === ">=") {
        if (a = bp(i, p, r), a === p && a !== i)
          return !1;
      } else if (i.operator === ">=" && !es(i.semver, String(p), r))
        return !1;
    }
    if (s) {
      if (d && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === d.major && p.semver.minor === d.minor && p.semver.patch === d.patch && (d = !1), p.operator === "<" || p.operator === "<=") {
        if (c = Sp(s, p, r), c === p && c !== s)
          return !1;
      } else if (s.operator === "<=" && !es(s.semver, String(p), r))
        return !1;
    }
    if (!p.operator && (s || i) && o !== 0)
      return !1;
  }
  return !(i && u && !s && o !== 0 || s && l && !i && o !== 0 || h || d);
}, bp = (e, t, r) => {
  if (!e)
    return t;
  const n = of(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Sp = (e, t, r) => {
  if (!e)
    return t;
  const n = of(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var dD = cD;
const zc = Ws, Pp = Wa, fD = mt, Tp = c0, hD = Vi, pD = $C, mD = bC, yD = PC, gD = NC, _D = RC, vD = DC, $D = jC, wD = LC, ED = tr, bD = BC, SD = GC, PD = Zd, TD = XC, ND = ZC, OD = Ya, AD = ef, RD = l0, CD = u0, ID = tf, DD = rf, kD = d0, FD = EI, jD = Xa(), UD = rr(), MD = Ja, LD = AI, xD = DI, VD = UI, qD = xI, BD = BI, HD = nf, zD = ZI, GD = rD, WD = iD, KD = aD, YD = dD;
var af = {
  parse: hD,
  valid: pD,
  clean: mD,
  inc: yD,
  diff: gD,
  major: _D,
  minor: vD,
  patch: $D,
  prerelease: wD,
  compare: ED,
  rcompare: bD,
  compareLoose: SD,
  compareBuild: PD,
  sort: TD,
  rsort: ND,
  gt: OD,
  lt: AD,
  eq: RD,
  neq: CD,
  gte: ID,
  lte: DD,
  cmp: kD,
  coerce: FD,
  Comparator: jD,
  Range: UD,
  satisfies: MD,
  toComparators: LD,
  maxSatisfying: xD,
  minSatisfying: VD,
  minVersion: qD,
  validRange: BD,
  outside: HD,
  gtr: zD,
  ltr: GD,
  intersects: WD,
  simplifyRange: KD,
  subset: YD,
  SemVer: fD,
  re: zc.re,
  src: zc.src,
  tokens: zc.t,
  SEMVER_SPEC_VERSION: Pp.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Pp.RELEASE_TYPES,
  compareIdentifiers: Tp.compareIdentifiers,
  rcompareIdentifiers: Tp.rcompareIdentifiers
};
const ti = /* @__PURE__ */ gy(af), XD = Object.prototype.toString, JD = "[object Uint8Array]", QD = "[object ArrayBuffer]";
function h0(e, t, r) {
  return e ? e.constructor === t ? !0 : XD.call(e) === r : !1;
}
function p0(e) {
  return h0(e, Uint8Array, JD);
}
function ZD(e) {
  return h0(e, ArrayBuffer, QD);
}
function ek(e) {
  return p0(e) || ZD(e);
}
function tk(e) {
  if (!p0(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function rk(e) {
  if (!ek(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Gc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((i, s) => i + s.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    tk(i), r.set(i, n), n += i.length;
  return r;
}
const Io = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Do(e, t = "utf8") {
  return rk(e), Io[t] ?? (Io[t] = new globalThis.TextDecoder(t)), Io[t].decode(e);
}
function nk(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const ik = new globalThis.TextEncoder();
function ko(e) {
  return nk(e), ik.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Wc = "aes-256-cbc", Gr = () => /* @__PURE__ */ Object.create(null), Np = (e) => e !== void 0, Kc = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Yr = "__internal__", Yc = `${Yr}.migrations.version`;
var Zr, Yt, $t, Ut, Un, Mn, Si, ar, Be, m0, y0, g0, _0, v0, $0, w0, E0;
class sk {
  constructor(t = {}) {
    sr(this, Be);
    Mr(this, "path");
    Mr(this, "events");
    sr(this, Zr);
    sr(this, Yt);
    sr(this, $t);
    sr(this, Ut, {});
    sr(this, Un, !1);
    sr(this, Mn);
    sr(this, Si);
    sr(this, ar);
    Mr(this, "_deserialize", (t) => JSON.parse(t));
    Mr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = br(this, Be, m0).call(this, t);
    At(this, $t, r), br(this, Be, y0).call(this, r), br(this, Be, _0).call(this, r), br(this, Be, v0).call(this, r), this.events = new EventTarget(), At(this, Yt, r.encryptionKey), this.path = br(this, Be, $0).call(this, r), br(this, Be, w0).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (ie(this, $t).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Yr} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, i = (s, o) => {
      if (Kc(s, o), ie(this, $t).accessPropertiesByDotNotation)
        fo(n, s, o);
      else {
        if (s === "__proto__" || s === "constructor" || s === "prototype")
          return;
        n[s] = o;
      }
    };
    if (typeof t == "object") {
      const s = t;
      for (const [o, a] of Object.entries(s))
        i(o, a);
    } else
      i(t, r);
    this.store = n;
  }
  has(t) {
    return ie(this, $t).accessPropertiesByDotNotation ? Sc(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    Kc(t, r);
    const n = ie(this, $t).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      Np(ie(this, Ut)[r]) && this.set(r, ie(this, Ut)[r]);
  }
  delete(t) {
    const { store: r } = this;
    ie(this, $t).accessPropertiesByDotNotation ? D$(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = Gr();
    for (const r of Object.keys(ie(this, Ut)))
      Np(ie(this, Ut)[r]) && (Kc(r, ie(this, Ut)[r]), ie(this, $t).accessPropertiesByDotNotation ? fo(t, r, ie(this, Ut)[r]) : t[r] = ie(this, Ut)[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const r = se.readFileSync(this.path, ie(this, Yt) ? null : "utf8"), n = this._decryptData(r), i = this._deserialize(n);
      return ie(this, Un) || this._validate(i), Object.assign(Gr(), i);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), Gr();
      if (ie(this, $t).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:"))
          return Gr();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Sc(t, Yr))
      try {
        const r = se.readFileSync(this.path, ie(this, Yt) ? null : "utf8"), n = this._decryptData(r), i = this._deserialize(n);
        Sc(i, Yr) && fo(t, Yr, th(i, Yr));
      } catch {
      }
    ie(this, Un) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    ie(this, Mn) && (ie(this, Mn).close(), At(this, Mn, void 0)), ie(this, Si) && (se.unwatchFile(this.path), At(this, Si, !1)), At(this, ar, void 0);
  }
  _decryptData(t) {
    if (!ie(this, Yt))
      return typeof t == "string" ? t : Do(t);
    try {
      const r = t.slice(0, 16), n = En.pbkdf2Sync(ie(this, Yt), r, 1e4, 32, "sha512"), i = En.createDecipheriv(Wc, n, r), s = t.slice(17), o = typeof s == "string" ? ko(s) : s;
      return Do(Gc([i.update(o), i.final()]));
    } catch {
      try {
        const r = t.slice(0, 16), n = En.pbkdf2Sync(ie(this, Yt), r.toString(), 1e4, 32, "sha512"), i = En.createDecipheriv(Wc, n, r), s = t.slice(17), o = typeof s == "string" ? ko(s) : s;
        return Do(Gc([i.update(o), i.final()]));
      } catch {
      }
    }
    return typeof t == "string" ? t : Do(t);
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const i = r, s = this.store;
      Zf(s, i) || (r = s, t.call(this, s, i));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const i = () => {
      const s = n, o = t();
      Zf(o, s) || (n = o, r.call(this, o, s));
    };
    return this.events.addEventListener("change", i), () => {
      this.events.removeEventListener("change", i);
    };
  }
  _validate(t) {
    if (!ie(this, Zr) || ie(this, Zr).call(this, t) || !ie(this, Zr).errors)
      return;
    const n = ie(this, Zr).errors.map(({ instancePath: i, message: s = "" }) => `\`${i.slice(1)}\` ${s}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    se.mkdirSync(ue.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (ie(this, Yt)) {
      const n = En.randomBytes(16), i = En.pbkdf2Sync(ie(this, Yt), n, 1e4, 32, "sha512"), s = En.createCipheriv(Wc, i, n);
      r = Gc([n, ko(":"), s.update(ko(r)), s.final()]);
    }
    if (Ne.env.SNAP)
      se.writeFileSync(this.path, r, { mode: ie(this, $t).configFileMode });
    else
      try {
        yy(this.path, r, { mode: ie(this, $t).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          se.writeFileSync(this.path, r, { mode: ie(this, $t).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    if (this._ensureDirectory(), se.existsSync(this.path) || this._write(Gr()), Ne.platform === "win32" || Ne.platform === "darwin") {
      ie(this, ar) ?? At(this, ar, ap(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ue.dirname(this.path), r = ue.basename(this.path);
      At(this, Mn, se.watch(t, { persistent: !1, encoding: "utf8" }, (n, i) => {
        i && i !== r || typeof ie(this, ar) == "function" && ie(this, ar).call(this);
      }));
    } else
      ie(this, ar) ?? At(this, ar, ap(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), se.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof ie(this, ar) == "function" && ie(this, ar).call(this);
      }), At(this, Si, !0);
  }
  _migrate(t, r, n) {
    let i = this._get(Yc, "0.0.0");
    const s = Object.keys(t).filter((a) => this._shouldPerformMigration(a, i, r));
    let o = structuredClone(this.store);
    for (const a of s)
      try {
        n && n(this, {
          fromVersion: i,
          toVersion: a,
          finalVersion: r,
          versions: s
        });
        const c = t[a];
        c == null || c(this), this._set(Yc, a), i = a, o = structuredClone(this.store);
      } catch (c) {
        this.store = o;
        try {
          this._write(o);
        } catch {
        }
        const u = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${u}`);
      }
    (this._isVersionInRangeFormat(i) || !ti.eq(i, r)) && this._set(Yc, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === Yr || t.startsWith(`${Yr}.`);
  }
  _isVersionInRangeFormat(t) {
    return ti.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && ti.satisfies(r, t) ? !1 : ti.satisfies(n, t) : !(ti.lte(t, r) || ti.gt(t, n));
  }
  _get(t, r) {
    return th(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    fo(n, t, r), this.store = n;
  }
}
Zr = new WeakMap(), Yt = new WeakMap(), $t = new WeakMap(), Ut = new WeakMap(), Un = new WeakMap(), Mn = new WeakMap(), Si = new WeakMap(), ar = new WeakMap(), Be = new WeakSet(), m0 = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = U$(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, y0 = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = XR.default, n = new MT.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  r(n);
  const i = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  At(this, Zr, n.compile(i)), br(this, Be, g0).call(this, t.schema);
}, g0 = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, i] of r) {
    if (!i || typeof i != "object" || !Object.hasOwn(i, "default"))
      continue;
    const { default: s } = i;
    s !== void 0 && (ie(this, Ut)[n] = s);
  }
}, _0 = function(t) {
  t.defaults && Object.assign(ie(this, Ut), t.defaults);
}, v0 = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, $0 = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ue.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, w0 = function(t) {
  if (t.migrations) {
    br(this, Be, E0).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(Gr(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    eh.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, E0 = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    At(this, Un, !0);
    try {
      const i = this.store, s = Object.assign(Gr(), t.defaults ?? {}, i);
      try {
        eh.deepEqual(i, s);
      } catch {
        this._write(s);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      At(this, Un, !1);
    }
  }
};
const { app: ta, ipcMain: Vl, shell: ok } = Rr;
let Op = !1;
const Ap = () => {
  if (!Vl || !ta)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: ta.getPath("userData"),
    appVersion: ta.getVersion()
  };
  return Op || (Vl.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Op = !0), e;
};
class ak extends sk {
  constructor(t) {
    let r, n;
    if (Ne.type === "renderer") {
      const i = Rr.ipcRenderer.sendSync("electron-store-get-data");
      if (!i)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = i);
    } else Vl && ta && ({ defaultCwd: r, appVersion: n } = Ap());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ue.isAbsolute(t.cwd) ? t.cwd : ue.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Ap();
  }
  async openInEditor() {
    const t = await ok.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const ts = new ak({
  defaults: {
    tasks: []
  }
});
function ck() {
  ur.handle("get-store-value", (e, t) => ts.get(t)), ur.handle("set-store-value", (e, t, r) => {
    r == null ? ts.delete(t) : ts.set(t, r);
  }), ur.handle("delete-store-value", (e, t) => {
    ts.delete(t);
  }), ur.handle("clear-store", () => {
    ts.clear();
  });
}
class lk {
  constructor() {
    Mr(this, "mainWindow", null);
    Mr(this, "originalBounds", null);
    Mr(this, "isOverlayMode", !1);
  }
  // Track if already in overlay mode
  setWindow(t) {
    this.mainWindow = t;
  }
  toggleOverlayMode(t) {
    if (console.log("[WindowManager] toggleOverlayMode called, enabled:", t), console.log("[WindowManager] mainWindow exists:", !!this.mainWindow), console.log("[WindowManager] isOverlayMode:", this.isOverlayMode), !this.mainWindow) {
      console.error("[WindowManager] ERROR: mainWindow is null!");
      return;
    }
    if (t) {
      this.isOverlayMode ? console.log("[WindowManager] Already in overlay mode, NOT overwriting originalBounds") : (this.originalBounds = this.mainWindow.getBounds(), console.log("[WindowManager] Saved original bounds:", this.originalBounds));
      const r = Qf.getPrimaryDisplay(), { workArea: n } = r;
      console.log("[WindowManager] workArea:", n);
      const i = 300, s = n.height - 50, o = n.x + 10, a = n.y + 25;
      console.log("[WindowManager] Setting bounds to:", { x: o, y: a, width: i, height: s }), this.mainWindow.setMinimumSize(280, 400), this.mainWindow.setBounds({ x: o, y: a, width: i, height: s }, !0), this.mainWindow.setAlwaysOnTop(!0, "floating"), this.mainWindow.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), this.isOverlayMode = !0, console.log("[WindowManager] Overlay mode ENABLED");
    } else
      console.log("[WindowManager] Restoring window from overlay mode"), console.log("[WindowManager] originalBounds:", this.originalBounds), this.mainWindow.setAlwaysOnTop(!1), this.mainWindow.setVisibleOnAllWorkspaces(!1), this.mainWindow.setMinimumSize(800, 600), this.originalBounds ? (console.log("[WindowManager] Restoring to original bounds"), this.mainWindow.setBounds(this.originalBounds, !0)) : (console.log("[WindowManager] No original bounds, setting default size"), this.mainWindow.setSize(1200, 800), this.mainWindow.center()), this.isOverlayMode = !1, console.log("[WindowManager] Overlay mode DISABLED, window restored");
  }
  toggleMiniMode(t) {
    if (console.log("[WindowManager] toggleMiniMode called, enabled:", t), !this.mainWindow) {
      console.error("[WindowManager] ERROR: mainWindow is null!");
      return;
    }
    if (t) {
      const r = Qf.getPrimaryDisplay(), { workArea: n } = r, i = 320, s = 50, o = Math.round(n.x + (n.width - i) / 2), a = n.y + 10;
      this.mainWindow.setWindowButtonVisibility(!1), this.mainWindow.setMinimumSize(200, 40), this.mainWindow.setBounds({ x: o, y: a, width: i, height: s }, !0), this.mainWindow.setAlwaysOnTop(!0, "floating"), this.mainWindow.setVisibleOnAllWorkspaces(!0), this.mainWindow.setBackgroundColor("#00000000"), console.log("[WindowManager] Setting mini mode bounds to:", { x: o, y: a, width: i, height: s }), console.log("[WindowManager] Mini mode ENABLED");
    } else
      this.mainWindow.setAlwaysOnTop(!1), this.mainWindow.setVisibleOnAllWorkspaces(!1), this.mainWindow.setWindowButtonVisibility(!0), this.toggleOverlayMode(!0), console.log("[WindowManager] Mini mode DISABLED, returned to overlay");
  }
  setMiniModeHeight(t) {
    if (this.mainWindow) {
      const r = this.mainWindow.getBounds();
      this.mainWindow.setBounds({
        x: r.x,
        y: r.y,
        width: 320,
        height: t
      }, !0), console.log(`[WindowManager] Resized mini mode height to ${t}`);
    }
  }
}
const Qa = new lk();
var xt = {}, Gn = {}, yt = {};
yt.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, s) => i != null ? n(i) : r(s)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
yt.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var Wr = A$, uk = process.cwd, ra = null, dk = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return ra || (ra = uk.call(process)), ra;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Rp = process.chdir;
  process.chdir = function(e) {
    ra = null, Rp.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Rp);
}
var fk = hk;
function hk(e) {
  Wr.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = o(e.chownSync), e.fchownSync = o(e.fchownSync), e.lchownSync = o(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, d, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, d, h, p) {
    p && process.nextTick(p);
  }, e.lchownSync = function() {
  }), dk === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function d(h, p, $) {
      var _ = Date.now(), v = 0;
      l(h, p, function m(E) {
        if (E && (E.code === "EACCES" || E.code === "EPERM" || E.code === "EBUSY") && Date.now() - _ < 6e4) {
          setTimeout(function() {
            e.stat(p, function(A, I) {
              A && A.code === "ENOENT" ? l(h, p, m) : $(E);
            });
          }, v), v < 100 && (v += 10);
          return;
        }
        $ && $(E);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(d, l), d;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function d(h, p, $, _, v, m) {
      var E;
      if (m && typeof m == "function") {
        var A = 0;
        E = function(I, F, z) {
          if (I && I.code === "EAGAIN" && A < 10)
            return A++, l.call(e, h, p, $, _, v, E);
          m.apply(this, arguments);
        };
      }
      return l.call(e, h, p, $, _, v, E);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(d, l), d;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(d, h, p, $, _) {
      for (var v = 0; ; )
        try {
          return l.call(e, d, h, p, $, _);
        } catch (m) {
          if (m.code === "EAGAIN" && v < 10) {
            v++;
            continue;
          }
          throw m;
        }
    };
  }(e.readSync);
  function t(l) {
    l.lchmod = function(d, h, p) {
      l.open(
        d,
        Wr.O_WRONLY | Wr.O_SYMLINK,
        h,
        function($, _) {
          if ($) {
            p && p($);
            return;
          }
          l.fchmod(_, h, function(v) {
            l.close(_, function(m) {
              p && p(v || m);
            });
          });
        }
      );
    }, l.lchmodSync = function(d, h) {
      var p = l.openSync(d, Wr.O_WRONLY | Wr.O_SYMLINK, h), $ = !0, _;
      try {
        _ = l.fchmodSync(p, h), $ = !1;
      } finally {
        if ($)
          try {
            l.closeSync(p);
          } catch {
          }
        else
          l.closeSync(p);
      }
      return _;
    };
  }
  function r(l) {
    Wr.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(d, h, p, $) {
      l.open(d, Wr.O_SYMLINK, function(_, v) {
        if (_) {
          $ && $(_);
          return;
        }
        l.futimes(v, h, p, function(m) {
          l.close(v, function(E) {
            $ && $(m || E);
          });
        });
      });
    }, l.lutimesSync = function(d, h, p) {
      var $ = l.openSync(d, Wr.O_SYMLINK), _, v = !0;
      try {
        _ = l.futimesSync($, h, p), v = !1;
      } finally {
        if (v)
          try {
            l.closeSync($);
          } catch {
          }
        else
          l.closeSync($);
      }
      return _;
    }) : l.futimes && (l.lutimes = function(d, h, p, $) {
      $ && process.nextTick($);
    }, l.lutimesSync = function() {
    });
  }
  function n(l) {
    return l && function(d, h, p) {
      return l.call(e, d, h, function($) {
        u($) && ($ = null), p && p.apply(this, arguments);
      });
    };
  }
  function i(l) {
    return l && function(d, h) {
      try {
        return l.call(e, d, h);
      } catch (p) {
        if (!u(p)) throw p;
      }
    };
  }
  function s(l) {
    return l && function(d, h, p, $) {
      return l.call(e, d, h, p, function(_) {
        u(_) && (_ = null), $ && $.apply(this, arguments);
      });
    };
  }
  function o(l) {
    return l && function(d, h, p) {
      try {
        return l.call(e, d, h, p);
      } catch ($) {
        if (!u($)) throw $;
      }
    };
  }
  function a(l) {
    return l && function(d, h, p) {
      typeof h == "function" && (p = h, h = null);
      function $(_, v) {
        v && (v.uid < 0 && (v.uid += 4294967296), v.gid < 0 && (v.gid += 4294967296)), p && p.apply(this, arguments);
      }
      return h ? l.call(e, d, h, $) : l.call(e, d, $);
    };
  }
  function c(l) {
    return l && function(d, h) {
      var p = h ? l.call(e, d, h) : l.call(e, d);
      return p && (p.uid < 0 && (p.uid += 4294967296), p.gid < 0 && (p.gid += 4294967296)), p;
    };
  }
  function u(l) {
    if (!l || l.code === "ENOSYS")
      return !0;
    var d = !process.getuid || process.getuid() !== 0;
    return !!(d && (l.code === "EINVAL" || l.code === "EPERM"));
  }
}
var Cp = xs.Stream, pk = mk;
function mk(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Cp.call(this);
    var s = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var o = Object.keys(i), a = 0, c = o.length; a < c; a++) {
      var u = o[a];
      this[u] = i[u];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        s._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(l, d) {
      if (l) {
        s.emit("error", l), s.readable = !1;
        return;
      }
      s.fd = d, s.emit("open", d), s._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    Cp.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var s = Object.keys(i), o = 0, a = s.length; o < a; o++) {
      var c = s[o];
      this[c] = i[c];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var yk = _k, gk = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function _k(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: gk(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var Ae = hn, vk = fk, $k = pk, wk = yk, Fo = su, Ye, va;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ye = Symbol.for("graceful-fs.queue"), va = Symbol.for("graceful-fs.previous")) : (Ye = "___graceful-fs.queue", va = "___graceful-fs.previous");
function Ek() {
}
function b0(e, t) {
  Object.defineProperty(e, Ye, {
    get: function() {
      return t;
    }
  });
}
var Ln = Ek;
Fo.debuglog ? Ln = Fo.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Ln = function() {
  var e = Fo.format.apply(Fo, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!Ae[Ye]) {
  var bk = ft[Ye] || [];
  b0(Ae, bk), Ae.close = function(e) {
    function t(r, n) {
      return e.call(Ae, r, function(i) {
        i || Ip(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, va, {
      value: e
    }), t;
  }(Ae.close), Ae.closeSync = function(e) {
    function t(r) {
      e.apply(Ae, arguments), Ip();
    }
    return Object.defineProperty(t, va, {
      value: e
    }), t;
  }(Ae.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Ln(Ae[Ye]), cy.equal(Ae[Ye].length, 0);
  });
}
ft[Ye] || b0(ft, Ae[Ye]);
var gt = cf(wk(Ae));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !Ae.__patched && (gt = cf(Ae), Ae.__patched = !0);
function cf(e) {
  vk(e), e.gracefulify = cf, e.createReadStream = F, e.createWriteStream = z;
  var t = e.readFile;
  e.readFile = r;
  function r(R, Q, x) {
    return typeof Q == "function" && (x = Q, Q = null), q(R, Q, x);
    function q(J, j, U, B) {
      return t(J, j, function(M) {
        M && (M.code === "EMFILE" || M.code === "ENFILE") ? ri([q, [J, j, U], M, B || Date.now(), Date.now()]) : typeof U == "function" && U.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(R, Q, x, q) {
    return typeof x == "function" && (q = x, x = null), J(R, Q, x, q);
    function J(j, U, B, M, H) {
      return n(j, U, B, function(V) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? ri([J, [j, U, B, M], V, H || Date.now(), Date.now()]) : typeof M == "function" && M.apply(this, arguments);
      });
    }
  }
  var s = e.appendFile;
  s && (e.appendFile = o);
  function o(R, Q, x, q) {
    return typeof x == "function" && (q = x, x = null), J(R, Q, x, q);
    function J(j, U, B, M, H) {
      return s(j, U, B, function(V) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? ri([J, [j, U, B, M], V, H || Date.now(), Date.now()]) : typeof M == "function" && M.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = c);
  function c(R, Q, x, q) {
    return typeof x == "function" && (q = x, x = 0), J(R, Q, x, q);
    function J(j, U, B, M, H) {
      return a(j, U, B, function(V) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? ri([J, [j, U, B, M], V, H || Date.now(), Date.now()]) : typeof M == "function" && M.apply(this, arguments);
      });
    }
  }
  var u = e.readdir;
  e.readdir = d;
  var l = /^v[0-5]\./;
  function d(R, Q, x) {
    typeof Q == "function" && (x = Q, Q = null);
    var q = l.test(process.version) ? function(U, B, M, H) {
      return u(U, J(
        U,
        B,
        M,
        H
      ));
    } : function(U, B, M, H) {
      return u(U, B, J(
        U,
        B,
        M,
        H
      ));
    };
    return q(R, Q, x);
    function J(j, U, B, M) {
      return function(H, V) {
        H && (H.code === "EMFILE" || H.code === "ENFILE") ? ri([
          q,
          [j, U, B],
          H,
          M || Date.now(),
          Date.now()
        ]) : (V && V.sort && V.sort(), typeof B == "function" && B.call(this, H, V));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = $k(e);
    m = h.ReadStream, A = h.WriteStream;
  }
  var p = e.ReadStream;
  p && (m.prototype = Object.create(p.prototype), m.prototype.open = E);
  var $ = e.WriteStream;
  $ && (A.prototype = Object.create($.prototype), A.prototype.open = I), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return m;
    },
    set: function(R) {
      m = R;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return A;
    },
    set: function(R) {
      A = R;
    },
    enumerable: !0,
    configurable: !0
  });
  var _ = m;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return _;
    },
    set: function(R) {
      _ = R;
    },
    enumerable: !0,
    configurable: !0
  });
  var v = A;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return v;
    },
    set: function(R) {
      v = R;
    },
    enumerable: !0,
    configurable: !0
  });
  function m(R, Q) {
    return this instanceof m ? (p.apply(this, arguments), this) : m.apply(Object.create(m.prototype), arguments);
  }
  function E() {
    var R = this;
    me(R.path, R.flags, R.mode, function(Q, x) {
      Q ? (R.autoClose && R.destroy(), R.emit("error", Q)) : (R.fd = x, R.emit("open", x), R.read());
    });
  }
  function A(R, Q) {
    return this instanceof A ? ($.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
  }
  function I() {
    var R = this;
    me(R.path, R.flags, R.mode, function(Q, x) {
      Q ? (R.destroy(), R.emit("error", Q)) : (R.fd = x, R.emit("open", x));
    });
  }
  function F(R, Q) {
    return new e.ReadStream(R, Q);
  }
  function z(R, Q) {
    return new e.WriteStream(R, Q);
  }
  var G = e.open;
  e.open = me;
  function me(R, Q, x, q) {
    return typeof x == "function" && (q = x, x = null), J(R, Q, x, q);
    function J(j, U, B, M, H) {
      return G(j, U, B, function(V, C) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? ri([J, [j, U, B, M], V, H || Date.now(), Date.now()]) : typeof M == "function" && M.apply(this, arguments);
      });
    }
  }
  return e;
}
function ri(e) {
  Ln("ENQUEUE", e[0].name, e[1]), Ae[Ye].push(e), lf();
}
var jo;
function Ip() {
  for (var e = Date.now(), t = 0; t < Ae[Ye].length; ++t)
    Ae[Ye][t].length > 2 && (Ae[Ye][t][3] = e, Ae[Ye][t][4] = e);
  lf();
}
function lf() {
  if (clearTimeout(jo), jo = void 0, Ae[Ye].length !== 0) {
    var e = Ae[Ye].shift(), t = e[0], r = e[1], n = e[2], i = e[3], s = e[4];
    if (i === void 0)
      Ln("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Ln("TIMEOUT", t.name, r);
      var o = r.pop();
      typeof o == "function" && o.call(null, n);
    } else {
      var a = Date.now() - s, c = Math.max(s - i, 1), u = Math.min(c * 1.2, 100);
      a >= u ? (Ln("RETRY", t.name, r), t.apply(null, r.concat([i]))) : Ae[Ye].push(e);
    }
    jo === void 0 && (jo = setTimeout(lf, 0));
  }
}
(function(e) {
  const t = yt.fromCallback, r = gt, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, s) {
    return typeof s == "function" ? r.exists(i, s) : new Promise((o) => r.exists(i, o));
  }, e.read = function(i, s, o, a, c, u) {
    return typeof u == "function" ? r.read(i, s, o, a, c, u) : new Promise((l, d) => {
      r.read(i, s, o, a, c, (h, p, $) => {
        if (h) return d(h);
        l({ bytesRead: p, buffer: $ });
      });
    });
  }, e.write = function(i, s, ...o) {
    return typeof o[o.length - 1] == "function" ? r.write(i, s, ...o) : new Promise((a, c) => {
      r.write(i, s, ...o, (u, l, d) => {
        if (u) return c(u);
        a({ bytesWritten: l, buffer: d });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, s, ...o) {
    return typeof o[o.length - 1] == "function" ? r.writev(i, s, ...o) : new Promise((a, c) => {
      r.writev(i, s, ...o, (u, l, d) => {
        if (u) return c(u);
        a({ bytesWritten: l, buffers: d });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Gn);
var uf = {}, S0 = {};
const Sk = Ce;
S0.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Sk.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const P0 = Gn, { checkPath: T0 } = S0, N0 = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
uf.makeDir = async (e, t) => (T0(e), P0.mkdir(e, {
  mode: N0(t),
  recursive: !0
}));
uf.makeDirSync = (e, t) => (T0(e), P0.mkdirSync(e, {
  mode: N0(t),
  recursive: !0
}));
const Pk = yt.fromPromise, { makeDir: Tk, makeDirSync: Xc } = uf, Jc = Pk(Tk);
var yr = {
  mkdirs: Jc,
  mkdirsSync: Xc,
  // alias
  mkdirp: Jc,
  mkdirpSync: Xc,
  ensureDir: Jc,
  ensureDirSync: Xc
};
const Nk = yt.fromPromise, O0 = Gn;
function Ok(e) {
  return O0.access(e).then(() => !0).catch(() => !1);
}
var Wn = {
  pathExists: Nk(Ok),
  pathExistsSync: O0.existsSync
};
const Ei = gt;
function Ak(e, t, r, n) {
  Ei.open(e, "r+", (i, s) => {
    if (i) return n(i);
    Ei.futimes(s, t, r, (o) => {
      Ei.close(s, (a) => {
        n && n(o || a);
      });
    });
  });
}
function Rk(e, t, r) {
  const n = Ei.openSync(e, "r+");
  return Ei.futimesSync(n, t, r), Ei.closeSync(n);
}
var A0 = {
  utimesMillis: Ak,
  utimesMillisSync: Rk
};
const Ai = Gn, qe = Ce, Ck = su;
function Ik(e, t, r) {
  const n = r.dereference ? (i) => Ai.stat(i, { bigint: !0 }) : (i) => Ai.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, s]) => ({ srcStat: i, destStat: s }));
}
function Dk(e, t, r) {
  let n;
  const i = r.dereference ? (o) => Ai.statSync(o, { bigint: !0 }) : (o) => Ai.lstatSync(o, { bigint: !0 }), s = i(e);
  try {
    n = i(t);
  } catch (o) {
    if (o.code === "ENOENT") return { srcStat: s, destStat: null };
    throw o;
  }
  return { srcStat: s, destStat: n };
}
function kk(e, t, r, n, i) {
  Ck.callbackify(Ik)(e, t, n, (s, o) => {
    if (s) return i(s);
    const { srcStat: a, destStat: c } = o;
    if (c) {
      if (Ks(a, c)) {
        const u = qe.basename(e), l = qe.basename(t);
        return r === "move" && u !== l && u.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: a, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && df(e, t) ? i(new Error(Za(e, t, r))) : i(null, { srcStat: a, destStat: c });
  });
}
function Fk(e, t, r, n) {
  const { srcStat: i, destStat: s } = Dk(e, t, n);
  if (s) {
    if (Ks(i, s)) {
      const o = qe.basename(e), a = qe.basename(t);
      if (r === "move" && o !== a && o.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: s, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !s.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && s.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && df(e, t))
    throw new Error(Za(e, t, r));
  return { srcStat: i, destStat: s };
}
function R0(e, t, r, n, i) {
  const s = qe.resolve(qe.dirname(e)), o = qe.resolve(qe.dirname(r));
  if (o === s || o === qe.parse(o).root) return i();
  Ai.stat(o, { bigint: !0 }, (a, c) => a ? a.code === "ENOENT" ? i() : i(a) : Ks(t, c) ? i(new Error(Za(e, r, n))) : R0(e, t, o, n, i));
}
function C0(e, t, r, n) {
  const i = qe.resolve(qe.dirname(e)), s = qe.resolve(qe.dirname(r));
  if (s === i || s === qe.parse(s).root) return;
  let o;
  try {
    o = Ai.statSync(s, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Ks(t, o))
    throw new Error(Za(e, r, n));
  return C0(e, t, s, n);
}
function Ks(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function df(e, t) {
  const r = qe.resolve(e).split(qe.sep).filter((i) => i), n = qe.resolve(t).split(qe.sep).filter((i) => i);
  return r.reduce((i, s, o) => i && n[o] === s, !0);
}
function Za(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var qi = {
  checkPaths: kk,
  checkPathsSync: Fk,
  checkParentPaths: R0,
  checkParentPathsSync: C0,
  isSrcSubdir: df,
  areIdentical: Ks
};
const St = gt, Ps = Ce, jk = yr.mkdirs, Uk = Wn.pathExists, Mk = A0.utimesMillis, Ts = qi;
function Lk(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Ts.checkPaths(e, t, "copy", r, (i, s) => {
    if (i) return n(i);
    const { srcStat: o, destStat: a } = s;
    Ts.checkParentPaths(e, o, t, "copy", (c) => c ? n(c) : r.filter ? I0(Dp, a, e, t, r, n) : Dp(a, e, t, r, n));
  });
}
function Dp(e, t, r, n, i) {
  const s = Ps.dirname(r);
  Uk(s, (o, a) => {
    if (o) return i(o);
    if (a) return $a(e, t, r, n, i);
    jk(s, (c) => c ? i(c) : $a(e, t, r, n, i));
  });
}
function I0(e, t, r, n, i, s) {
  Promise.resolve(i.filter(r, n)).then((o) => o ? e(t, r, n, i, s) : s(), (o) => s(o));
}
function xk(e, t, r, n, i) {
  return n.filter ? I0($a, e, t, r, n, i) : $a(e, t, r, n, i);
}
function $a(e, t, r, n, i) {
  (n.dereference ? St.stat : St.lstat)(t, (o, a) => o ? i(o) : a.isDirectory() ? Wk(a, e, t, r, n, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? Vk(a, e, t, r, n, i) : a.isSymbolicLink() ? Xk(e, t, r, n, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Vk(e, t, r, n, i, s) {
  return t ? qk(e, r, n, i, s) : D0(e, r, n, i, s);
}
function qk(e, t, r, n, i) {
  if (n.overwrite)
    St.unlink(r, (s) => s ? i(s) : D0(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function D0(e, t, r, n, i) {
  St.copyFile(t, r, (s) => s ? i(s) : n.preserveTimestamps ? Bk(e.mode, t, r, i) : ec(r, e.mode, i));
}
function Bk(e, t, r, n) {
  return Hk(e) ? zk(r, e, (i) => i ? n(i) : kp(e, t, r, n)) : kp(e, t, r, n);
}
function Hk(e) {
  return (e & 128) === 0;
}
function zk(e, t, r) {
  return ec(e, t | 128, r);
}
function kp(e, t, r, n) {
  Gk(t, r, (i) => i ? n(i) : ec(r, e, n));
}
function ec(e, t, r) {
  return St.chmod(e, t, r);
}
function Gk(e, t, r) {
  St.stat(e, (n, i) => n ? r(n) : Mk(t, i.atime, i.mtime, r));
}
function Wk(e, t, r, n, i, s) {
  return t ? k0(r, n, i, s) : Kk(e.mode, r, n, i, s);
}
function Kk(e, t, r, n, i) {
  St.mkdir(r, (s) => {
    if (s) return i(s);
    k0(t, r, n, (o) => o ? i(o) : ec(r, e, i));
  });
}
function k0(e, t, r, n) {
  St.readdir(e, (i, s) => i ? n(i) : F0(s, e, t, r, n));
}
function F0(e, t, r, n, i) {
  const s = e.pop();
  return s ? Yk(e, s, t, r, n, i) : i();
}
function Yk(e, t, r, n, i, s) {
  const o = Ps.join(r, t), a = Ps.join(n, t);
  Ts.checkPaths(o, a, "copy", i, (c, u) => {
    if (c) return s(c);
    const { destStat: l } = u;
    xk(l, o, a, i, (d) => d ? s(d) : F0(e, r, n, i, s));
  });
}
function Xk(e, t, r, n, i) {
  St.readlink(t, (s, o) => {
    if (s) return i(s);
    if (n.dereference && (o = Ps.resolve(process.cwd(), o)), e)
      St.readlink(r, (a, c) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? St.symlink(o, r, i) : i(a) : (n.dereference && (c = Ps.resolve(process.cwd(), c)), Ts.isSrcSubdir(o, c) ? i(new Error(`Cannot copy '${o}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Ts.isSrcSubdir(c, o) ? i(new Error(`Cannot overwrite '${c}' with '${o}'.`)) : Jk(o, r, i)));
    else
      return St.symlink(o, r, i);
  });
}
function Jk(e, t, r) {
  St.unlink(t, (n) => n ? r(n) : St.symlink(e, t, r));
}
var Qk = Lk;
const st = gt, Ns = Ce, Zk = yr.mkdirsSync, eF = A0.utimesMillisSync, Os = qi;
function tF(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Os.checkPathsSync(e, t, "copy", r);
  return Os.checkParentPathsSync(e, n, t, "copy"), rF(i, e, t, r);
}
function rF(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Ns.dirname(r);
  return st.existsSync(i) || Zk(i), j0(e, t, r, n);
}
function nF(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return j0(e, t, r, n);
}
function j0(e, t, r, n) {
  const s = (n.dereference ? st.statSync : st.lstatSync)(t);
  if (s.isDirectory()) return uF(s, e, t, r, n);
  if (s.isFile() || s.isCharacterDevice() || s.isBlockDevice()) return iF(s, e, t, r, n);
  if (s.isSymbolicLink()) return hF(e, t, r, n);
  throw s.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : s.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function iF(e, t, r, n, i) {
  return t ? sF(e, r, n, i) : U0(e, r, n, i);
}
function sF(e, t, r, n) {
  if (n.overwrite)
    return st.unlinkSync(r), U0(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function U0(e, t, r, n) {
  return st.copyFileSync(t, r), n.preserveTimestamps && oF(e.mode, t, r), ff(r, e.mode);
}
function oF(e, t, r) {
  return aF(e) && cF(r, e), lF(t, r);
}
function aF(e) {
  return (e & 128) === 0;
}
function cF(e, t) {
  return ff(e, t | 128);
}
function ff(e, t) {
  return st.chmodSync(e, t);
}
function lF(e, t) {
  const r = st.statSync(e);
  return eF(t, r.atime, r.mtime);
}
function uF(e, t, r, n, i) {
  return t ? M0(r, n, i) : dF(e.mode, r, n, i);
}
function dF(e, t, r, n) {
  return st.mkdirSync(r), M0(t, r, n), ff(r, e);
}
function M0(e, t, r) {
  st.readdirSync(e).forEach((n) => fF(n, e, t, r));
}
function fF(e, t, r, n) {
  const i = Ns.join(t, e), s = Ns.join(r, e), { destStat: o } = Os.checkPathsSync(i, s, "copy", n);
  return nF(o, i, s, n);
}
function hF(e, t, r, n) {
  let i = st.readlinkSync(t);
  if (n.dereference && (i = Ns.resolve(process.cwd(), i)), e) {
    let s;
    try {
      s = st.readlinkSync(r);
    } catch (o) {
      if (o.code === "EINVAL" || o.code === "UNKNOWN") return st.symlinkSync(i, r);
      throw o;
    }
    if (n.dereference && (s = Ns.resolve(process.cwd(), s)), Os.isSrcSubdir(i, s))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${s}'.`);
    if (st.statSync(r).isDirectory() && Os.isSrcSubdir(s, i))
      throw new Error(`Cannot overwrite '${s}' with '${i}'.`);
    return pF(i, r);
  } else
    return st.symlinkSync(i, r);
}
function pF(e, t) {
  return st.unlinkSync(t), st.symlinkSync(e, t);
}
var mF = tF;
const yF = yt.fromCallback;
var hf = {
  copy: yF(Qk),
  copySync: mF
};
const Fp = gt, L0 = Ce, we = cy, As = process.platform === "win32";
function x0(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Fp[r], r = r + "Sync", e[r] = e[r] || Fp[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function pf(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), we(e, "rimraf: missing path"), we.strictEqual(typeof e, "string", "rimraf: path should be a string"), we.strictEqual(typeof r, "function", "rimraf: callback function required"), we(t, "rimraf: invalid options argument provided"), we.strictEqual(typeof t, "object", "rimraf: options should be object"), x0(t), jp(e, t, function i(s) {
    if (s) {
      if ((s.code === "EBUSY" || s.code === "ENOTEMPTY" || s.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const o = n * 100;
        return setTimeout(() => jp(e, t, i), o);
      }
      s.code === "ENOENT" && (s = null);
    }
    r(s);
  });
}
function jp(e, t, r) {
  we(e), we(t), we(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && As)
      return Up(e, t, n, r);
    if (i && i.isDirectory())
      return na(e, t, n, r);
    t.unlink(e, (s) => {
      if (s) {
        if (s.code === "ENOENT")
          return r(null);
        if (s.code === "EPERM")
          return As ? Up(e, t, s, r) : na(e, t, s, r);
        if (s.code === "EISDIR")
          return na(e, t, s, r);
      }
      return r(s);
    });
  });
}
function Up(e, t, r, n) {
  we(e), we(t), we(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (s, o) => {
      s ? n(s.code === "ENOENT" ? null : r) : o.isDirectory() ? na(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Mp(e, t, r) {
  let n;
  we(e), we(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? ia(e, t, r) : t.unlinkSync(e);
}
function na(e, t, r, n) {
  we(e), we(t), we(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? gF(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function gF(e, t, r) {
  we(e), we(t), we(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let s = i.length, o;
    if (s === 0) return t.rmdir(e, r);
    i.forEach((a) => {
      pf(L0.join(e, a), t, (c) => {
        if (!o) {
          if (c) return r(o = c);
          --s === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function V0(e, t) {
  let r;
  t = t || {}, x0(t), we(e, "rimraf: missing path"), we.strictEqual(typeof e, "string", "rimraf: path should be a string"), we(t, "rimraf: missing options"), we.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && As && Mp(e, t, n);
  }
  try {
    r && r.isDirectory() ? ia(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return As ? Mp(e, t, n) : ia(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    ia(e, t, n);
  }
}
function ia(e, t, r) {
  we(e), we(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      _F(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function _F(e, t) {
  if (we(e), we(t), t.readdirSync(e).forEach((r) => V0(L0.join(e, r), t)), As) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var vF = pf;
pf.sync = V0;
const wa = gt, $F = yt.fromCallback, q0 = vF;
function wF(e, t) {
  if (wa.rm) return wa.rm(e, { recursive: !0, force: !0 }, t);
  q0(e, t);
}
function EF(e) {
  if (wa.rmSync) return wa.rmSync(e, { recursive: !0, force: !0 });
  q0.sync(e);
}
var tc = {
  remove: $F(wF),
  removeSync: EF
};
const bF = yt.fromPromise, B0 = Gn, H0 = Ce, z0 = yr, G0 = tc, Lp = bF(async function(t) {
  let r;
  try {
    r = await B0.readdir(t);
  } catch {
    return z0.mkdirs(t);
  }
  return Promise.all(r.map((n) => G0.remove(H0.join(t, n))));
});
function xp(e) {
  let t;
  try {
    t = B0.readdirSync(e);
  } catch {
    return z0.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = H0.join(e, r), G0.removeSync(r);
  });
}
var SF = {
  emptyDirSync: xp,
  emptydirSync: xp,
  emptyDir: Lp,
  emptydir: Lp
};
const PF = yt.fromCallback, W0 = Ce, rn = gt, K0 = yr;
function TF(e, t) {
  function r() {
    rn.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  rn.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const s = W0.dirname(e);
    rn.stat(s, (o, a) => {
      if (o)
        return o.code === "ENOENT" ? K0.mkdirs(s, (c) => {
          if (c) return t(c);
          r();
        }) : t(o);
      a.isDirectory() ? r() : rn.readdir(s, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function NF(e) {
  let t;
  try {
    t = rn.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = W0.dirname(e);
  try {
    rn.statSync(r).isDirectory() || rn.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") K0.mkdirsSync(r);
    else throw n;
  }
  rn.writeFileSync(e, "");
}
var OF = {
  createFile: PF(TF),
  createFileSync: NF
};
const AF = yt.fromCallback, Y0 = Ce, Qr = gt, X0 = yr, RF = Wn.pathExists, { areIdentical: J0 } = qi;
function CF(e, t, r) {
  function n(i, s) {
    Qr.link(i, s, (o) => {
      if (o) return r(o);
      r(null);
    });
  }
  Qr.lstat(t, (i, s) => {
    Qr.lstat(e, (o, a) => {
      if (o)
        return o.message = o.message.replace("lstat", "ensureLink"), r(o);
      if (s && J0(a, s)) return r(null);
      const c = Y0.dirname(t);
      RF(c, (u, l) => {
        if (u) return r(u);
        if (l) return n(e, t);
        X0.mkdirs(c, (d) => {
          if (d) return r(d);
          n(e, t);
        });
      });
    });
  });
}
function IF(e, t) {
  let r;
  try {
    r = Qr.lstatSync(t);
  } catch {
  }
  try {
    const s = Qr.lstatSync(e);
    if (r && J0(s, r)) return;
  } catch (s) {
    throw s.message = s.message.replace("lstat", "ensureLink"), s;
  }
  const n = Y0.dirname(t);
  return Qr.existsSync(n) || X0.mkdirsSync(n), Qr.linkSync(e, t);
}
var DF = {
  createLink: AF(CF),
  createLinkSync: IF
};
const nn = Ce, $s = gt, kF = Wn.pathExists;
function FF(e, t, r) {
  if (nn.isAbsolute(e))
    return $s.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = nn.dirname(t), i = nn.join(n, e);
    return kF(i, (s, o) => s ? r(s) : o ? r(null, {
      toCwd: i,
      toDst: e
    }) : $s.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), r(a)) : r(null, {
      toCwd: e,
      toDst: nn.relative(n, e)
    })));
  }
}
function jF(e, t) {
  let r;
  if (nn.isAbsolute(e)) {
    if (r = $s.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = nn.dirname(t), i = nn.join(n, e);
    if (r = $s.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = $s.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: nn.relative(n, e)
    };
  }
}
var UF = {
  symlinkPaths: FF,
  symlinkPathsSync: jF
};
const Q0 = gt;
function MF(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  Q0.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function LF(e, t) {
  let r;
  if (t) return t;
  try {
    r = Q0.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var xF = {
  symlinkType: MF,
  symlinkTypeSync: LF
};
const VF = yt.fromCallback, Z0 = Ce, Xt = Gn, e_ = yr, qF = e_.mkdirs, BF = e_.mkdirsSync, t_ = UF, HF = t_.symlinkPaths, zF = t_.symlinkPathsSync, r_ = xF, GF = r_.symlinkType, WF = r_.symlinkTypeSync, KF = Wn.pathExists, { areIdentical: n_ } = qi;
function YF(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Xt.lstat(t, (i, s) => {
    !i && s.isSymbolicLink() ? Promise.all([
      Xt.stat(e),
      Xt.stat(t)
    ]).then(([o, a]) => {
      if (n_(o, a)) return n(null);
      Vp(e, t, r, n);
    }) : Vp(e, t, r, n);
  });
}
function Vp(e, t, r, n) {
  HF(e, t, (i, s) => {
    if (i) return n(i);
    e = s.toDst, GF(s.toCwd, r, (o, a) => {
      if (o) return n(o);
      const c = Z0.dirname(t);
      KF(c, (u, l) => {
        if (u) return n(u);
        if (l) return Xt.symlink(e, t, a, n);
        qF(c, (d) => {
          if (d) return n(d);
          Xt.symlink(e, t, a, n);
        });
      });
    });
  });
}
function XF(e, t, r) {
  let n;
  try {
    n = Xt.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const a = Xt.statSync(e), c = Xt.statSync(t);
    if (n_(a, c)) return;
  }
  const i = zF(e, t);
  e = i.toDst, r = WF(i.toCwd, r);
  const s = Z0.dirname(t);
  return Xt.existsSync(s) || BF(s), Xt.symlinkSync(e, t, r);
}
var JF = {
  createSymlink: VF(YF),
  createSymlinkSync: XF
};
const { createFile: qp, createFileSync: Bp } = OF, { createLink: Hp, createLinkSync: zp } = DF, { createSymlink: Gp, createSymlinkSync: Wp } = JF;
var QF = {
  // file
  createFile: qp,
  createFileSync: Bp,
  ensureFile: qp,
  ensureFileSync: Bp,
  // link
  createLink: Hp,
  createLinkSync: zp,
  ensureLink: Hp,
  ensureLinkSync: zp,
  // symlink
  createSymlink: Gp,
  createSymlinkSync: Wp,
  ensureSymlink: Gp,
  ensureSymlinkSync: Wp
};
function ZF(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const s = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + s;
}
function ej(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var mf = { stringify: ZF, stripBom: ej };
let Ri;
try {
  Ri = gt;
} catch {
  Ri = hn;
}
const rc = yt, { stringify: i_, stripBom: s_ } = mf;
async function tj(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Ri, n = "throws" in t ? t.throws : !0;
  let i = await rc.fromCallback(r.readFile)(e, t);
  i = s_(i);
  let s;
  try {
    s = JSON.parse(i, t ? t.reviver : null);
  } catch (o) {
    if (n)
      throw o.message = `${e}: ${o.message}`, o;
    return null;
  }
  return s;
}
const rj = rc.fromPromise(tj);
function nj(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Ri, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = s_(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function ij(e, t, r = {}) {
  const n = r.fs || Ri, i = i_(t, r);
  await rc.fromCallback(n.writeFile)(e, i, r);
}
const sj = rc.fromPromise(ij);
function oj(e, t, r = {}) {
  const n = r.fs || Ri, i = i_(t, r);
  return n.writeFileSync(e, i, r);
}
var aj = {
  readFile: rj,
  readFileSync: nj,
  writeFile: sj,
  writeFileSync: oj
};
const Uo = aj;
var cj = {
  // jsonfile exports
  readJson: Uo.readFile,
  readJsonSync: Uo.readFileSync,
  writeJson: Uo.writeFile,
  writeJsonSync: Uo.writeFileSync
};
const lj = yt.fromCallback, ws = gt, o_ = Ce, a_ = yr, uj = Wn.pathExists;
function dj(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = o_.dirname(e);
  uj(i, (s, o) => {
    if (s) return n(s);
    if (o) return ws.writeFile(e, t, r, n);
    a_.mkdirs(i, (a) => {
      if (a) return n(a);
      ws.writeFile(e, t, r, n);
    });
  });
}
function fj(e, ...t) {
  const r = o_.dirname(e);
  if (ws.existsSync(r))
    return ws.writeFileSync(e, ...t);
  a_.mkdirsSync(r), ws.writeFileSync(e, ...t);
}
var yf = {
  outputFile: lj(dj),
  outputFileSync: fj
};
const { stringify: hj } = mf, { outputFile: pj } = yf;
async function mj(e, t, r = {}) {
  const n = hj(t, r);
  await pj(e, n, r);
}
var yj = mj;
const { stringify: gj } = mf, { outputFileSync: _j } = yf;
function vj(e, t, r) {
  const n = gj(t, r);
  _j(e, n, r);
}
var $j = vj;
const wj = yt.fromPromise, pt = cj;
pt.outputJson = wj(yj);
pt.outputJsonSync = $j;
pt.outputJSON = pt.outputJson;
pt.outputJSONSync = pt.outputJsonSync;
pt.writeJSON = pt.writeJson;
pt.writeJSONSync = pt.writeJsonSync;
pt.readJSON = pt.readJson;
pt.readJSONSync = pt.readJsonSync;
var Ej = pt;
const bj = gt, ql = Ce, Sj = hf.copy, c_ = tc.remove, Pj = yr.mkdirp, Tj = Wn.pathExists, Kp = qi;
function Nj(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  Kp.checkPaths(e, t, "move", r, (s, o) => {
    if (s) return n(s);
    const { srcStat: a, isChangingCase: c = !1 } = o;
    Kp.checkParentPaths(e, a, t, "move", (u) => {
      if (u) return n(u);
      if (Oj(t)) return Yp(e, t, i, c, n);
      Pj(ql.dirname(t), (l) => l ? n(l) : Yp(e, t, i, c, n));
    });
  });
}
function Oj(e) {
  const t = ql.dirname(e);
  return ql.parse(t).root === t;
}
function Yp(e, t, r, n, i) {
  if (n) return Qc(e, t, r, i);
  if (r)
    return c_(t, (s) => s ? i(s) : Qc(e, t, r, i));
  Tj(t, (s, o) => s ? i(s) : o ? i(new Error("dest already exists.")) : Qc(e, t, r, i));
}
function Qc(e, t, r, n) {
  bj.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Aj(e, t, r, n) : n());
}
function Aj(e, t, r, n) {
  Sj(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (s) => s ? n(s) : c_(e, n));
}
var Rj = Nj;
const l_ = gt, Bl = Ce, Cj = hf.copySync, u_ = tc.removeSync, Ij = yr.mkdirpSync, Xp = qi;
function Dj(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: s = !1 } = Xp.checkPathsSync(e, t, "move", r);
  return Xp.checkParentPathsSync(e, i, t, "move"), kj(t) || Ij(Bl.dirname(t)), Fj(e, t, n, s);
}
function kj(e) {
  const t = Bl.dirname(e);
  return Bl.parse(t).root === t;
}
function Fj(e, t, r, n) {
  if (n) return Zc(e, t, r);
  if (r)
    return u_(t), Zc(e, t, r);
  if (l_.existsSync(t)) throw new Error("dest already exists.");
  return Zc(e, t, r);
}
function Zc(e, t, r) {
  try {
    l_.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return jj(e, t, r);
  }
}
function jj(e, t, r) {
  return Cj(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), u_(e);
}
var Uj = Dj;
const Mj = yt.fromCallback;
var Lj = {
  move: Mj(Rj),
  moveSync: Uj
}, mn = {
  // Export promiseified graceful-fs:
  ...Gn,
  // Export extra methods:
  ...hf,
  ...SF,
  ...QF,
  ...Ej,
  ...yr,
  ...Lj,
  ...yf,
  ...Wn,
  ...tc
}, Kn = {}, cn = {}, xe = {}, ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.CancellationError = ln.CancellationToken = void 0;
const xj = ly;
class Vj extends xj.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new Hl());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, s) => {
      let o = null;
      if (n = () => {
        try {
          o != null && (o(), o = null);
        } finally {
          s(new Hl());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, s, (a) => {
        o = a;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
ln.CancellationToken = Vj;
class Hl extends Error {
  constructor() {
    super("cancelled");
  }
}
ln.CancellationError = Hl;
var Bi = {};
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.newError = qj;
function qj(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var ht = {}, zl = { exports: {} }, Mo = { exports: {} }, el, Jp;
function Bj() {
  if (Jp) return el;
  Jp = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, s = n * 365.25;
  el = function(l, d) {
    d = d || {};
    var h = typeof l;
    if (h === "string" && l.length > 0)
      return o(l);
    if (h === "number" && isFinite(l))
      return d.long ? c(l) : a(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function o(l) {
    if (l = String(l), !(l.length > 100)) {
      var d = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (d) {
        var h = parseFloat(d[1]), p = (d[2] || "ms").toLowerCase();
        switch (p) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * s;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function a(l) {
    var d = Math.abs(l);
    return d >= n ? Math.round(l / n) + "d" : d >= r ? Math.round(l / r) + "h" : d >= t ? Math.round(l / t) + "m" : d >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var d = Math.abs(l);
    return d >= n ? u(l, d, n, "day") : d >= r ? u(l, d, r, "hour") : d >= t ? u(l, d, t, "minute") : d >= e ? u(l, d, e, "second") : l + " ms";
  }
  function u(l, d, h, p) {
    var $ = d >= h * 1.5;
    return Math.round(l / h) + " " + p + ($ ? "s" : "");
  }
  return el;
}
var tl, Qp;
function d_() {
  if (Qp) return tl;
  Qp = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = u, n.disable = a, n.enable = s, n.enabled = c, n.humanize = Bj(), n.destroy = l, Object.keys(t).forEach((d) => {
      n[d] = t[d];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(d) {
      let h = 0;
      for (let p = 0; p < d.length; p++)
        h = (h << 5) - h + d.charCodeAt(p), h |= 0;
      return n.colors[Math.abs(h) % n.colors.length];
    }
    n.selectColor = r;
    function n(d) {
      let h, p = null, $, _;
      function v(...m) {
        if (!v.enabled)
          return;
        const E = v, A = Number(/* @__PURE__ */ new Date()), I = A - (h || A);
        E.diff = I, E.prev = h, E.curr = A, h = A, m[0] = n.coerce(m[0]), typeof m[0] != "string" && m.unshift("%O");
        let F = 0;
        m[0] = m[0].replace(/%([a-zA-Z%])/g, (G, me) => {
          if (G === "%%")
            return "%";
          F++;
          const R = n.formatters[me];
          if (typeof R == "function") {
            const Q = m[F];
            G = R.call(E, Q), m.splice(F, 1), F--;
          }
          return G;
        }), n.formatArgs.call(E, m), (E.log || n.log).apply(E, m);
      }
      return v.namespace = d, v.useColors = n.useColors(), v.color = n.selectColor(d), v.extend = i, v.destroy = n.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : ($ !== n.namespaces && ($ = n.namespaces, _ = n.enabled(d)), _),
        set: (m) => {
          p = m;
        }
      }), typeof n.init == "function" && n.init(v), v;
    }
    function i(d, h) {
      const p = n(this.namespace + (typeof h > "u" ? ":" : h) + d);
      return p.log = this.log, p;
    }
    function s(d) {
      n.save(d), n.namespaces = d, n.names = [], n.skips = [];
      const h = (typeof d == "string" ? d : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const p of h)
        p[0] === "-" ? n.skips.push(p.slice(1)) : n.names.push(p);
    }
    function o(d, h) {
      let p = 0, $ = 0, _ = -1, v = 0;
      for (; p < d.length; )
        if ($ < h.length && (h[$] === d[p] || h[$] === "*"))
          h[$] === "*" ? (_ = $, v = p, $++) : (p++, $++);
        else if (_ !== -1)
          $ = _ + 1, v++, p = v;
        else
          return !1;
      for (; $ < h.length && h[$] === "*"; )
        $++;
      return $ === h.length;
    }
    function a() {
      const d = [
        ...n.names,
        ...n.skips.map((h) => "-" + h)
      ].join(",");
      return n.enable(""), d;
    }
    function c(d) {
      for (const h of n.skips)
        if (o(d, h))
          return !1;
      for (const h of n.names)
        if (o(d, h))
          return !0;
      return !1;
    }
    function u(d) {
      return d instanceof Error ? d.stack || d.message : d;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return tl = e, tl;
}
var Zp;
function Hj() {
  return Zp || (Zp = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = s, t.useColors = r, t.storage = o(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const u = "color: " + this.color;
      c.splice(1, 0, u, "color: inherit");
      let l = 0, d = 0;
      c[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (l++, h === "%c" && (d = l));
      }), c.splice(d, 0, u);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function s() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function o() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = d_()(t);
    const { formatters: a } = e.exports;
    a.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(Mo, Mo.exports)), Mo.exports;
}
var Lo = { exports: {} }, rl, em;
function zj() {
  return em || (em = 1, rl = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), rl;
}
var nl, tm;
function Gj() {
  if (tm) return nl;
  tm = 1;
  const e = Ia, t = uy, r = zj(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function s(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function o(c, u) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (c && !u && i === void 0)
      return 0;
    const l = i || 0;
    if (n.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const d = e.release().split(".");
      return Number(d[0]) >= 10 && Number(d[2]) >= 10586 ? Number(d[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((d) => d in n) || n.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const d = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return d >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : l;
  }
  function a(c) {
    const u = o(c, c && c.isTTY);
    return s(u);
  }
  return nl = {
    supportsColor: a,
    stdout: s(o(!0, t.isatty(1))),
    stderr: s(o(!0, t.isatty(2)))
  }, nl;
}
var rm;
function Wj() {
  return rm || (rm = 1, function(e, t) {
    const r = uy, n = su;
    t.init = l, t.log = a, t.formatArgs = s, t.save = c, t.load = u, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = Gj();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, p) => {
      const $ = p.substring(6).toLowerCase().replace(/_([a-z])/g, (v, m) => m.toUpperCase());
      let _ = process.env[p];
      return /^(yes|on|true|enabled)$/i.test(_) ? _ = !0 : /^(no|off|false|disabled)$/i.test(_) ? _ = !1 : _ === "null" ? _ = null : _ = Number(_), h[$] = _, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function s(h) {
      const { namespace: p, useColors: $ } = this;
      if ($) {
        const _ = this.color, v = "\x1B[3" + (_ < 8 ? _ : "8;5;" + _), m = `  ${v};1m${p} \x1B[0m`;
        h[0] = m + h[0].split(`
`).join(`
` + m), h.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = o() + p + " " + h[0];
    }
    function o() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function a(...h) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function c(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function u() {
      return process.env.DEBUG;
    }
    function l(h) {
      h.inspectOpts = {};
      const p = Object.keys(t.inspectOpts);
      for (let $ = 0; $ < p.length; $++)
        h.inspectOpts[p[$]] = t.inspectOpts[p[$]];
    }
    e.exports = d_()(t);
    const { formatters: d } = e.exports;
    d.o = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, d.O = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts);
    };
  }(Lo, Lo.exports)), Lo.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? zl.exports = Hj() : zl.exports = Wj();
var Kj = zl.exports, Ys = {};
Object.defineProperty(Ys, "__esModule", { value: !0 });
Ys.ProgressCallbackTransform = void 0;
const Yj = xs;
class Xj extends Yj.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
Ys.ProgressCallbackTransform = Xj;
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.DigestTransform = ht.HttpExecutor = ht.HttpError = void 0;
ht.createHttpError = Wl;
ht.parseJson = iU;
ht.configureRequestOptionsFromUrl = h_;
ht.configureRequestUrl = _f;
ht.safeGetHeader = bi;
ht.configureRequestOptions = Ea;
ht.safeStringifyJson = ba;
const Jj = Vs, Qj = Kj, Zj = hn, eU = xs, Gl = pn, tU = ln, nm = Bi, rU = Ys, Pn = (0, Qj.default)("electron-builder");
function Wl(e, t = null) {
  return new gf(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + ba(e.headers), t);
}
const nU = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class gf extends Error {
  constructor(t, r = `HTTP error: ${nU.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
ht.HttpError = gf;
function iU(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class fi {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new tU.CancellationToken(), n) {
    Ea(t);
    const i = n == null ? void 0 : JSON.stringify(n), s = i ? Buffer.from(i) : void 0;
    if (s != null) {
      Pn(i);
      const { headers: o, ...a } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": s.length,
          ...o
        },
        ...a
      };
    }
    return this.doApiRequest(t, r, (o) => o.end(s));
  }
  doApiRequest(t, r, n, i = 0) {
    return Pn.enabled && Pn(`Request: ${ba(t)}`), r.createPromise((s, o, a) => {
      const c = this.createRequest(t, (u) => {
        try {
          this.handleResponse(u, t, r, s, o, i, n);
        } catch (l) {
          o(l);
        }
      });
      this.addErrorAndTimeoutHandlers(c, o, t.timeout), this.addRedirectHandlers(c, t, o, i, (u) => {
        this.doApiRequest(u, r, n, i).then(s).catch(o);
      }), n(c, o), a(() => c.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, s) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, s, o, a) {
    var c;
    if (Pn.enabled && Pn(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${ba(r)}`), t.statusCode === 404) {
      s(Wl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const u = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = u >= 300 && u < 400, d = bi(t, "location");
    if (l && d != null) {
      if (o > this.maxRedirects) {
        s(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(fi.prepareRedirectUrlOptions(d, r), n, a, o).then(i).catch(s);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", s), t.on("data", (p) => h += p), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const p = bi(t, "content-type"), $ = p != null && (Array.isArray(p) ? p.find((_) => _.includes("json")) != null : p.includes("json"));
          s(Wl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${$ ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (p) {
        s(p);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, s) => {
      const o = [], a = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      _f(t, a), Ea(a), this.doDownload(a, {
        destination: null,
        options: r,
        onCancel: s,
        callback: (c) => {
          c == null ? n(Buffer.concat(o)) : i(c);
        },
        responseHandler: (c, u) => {
          let l = 0;
          c.on("data", (d) => {
            if (l += d.length, l > 524288e3) {
              u(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            o.push(d);
          }), c.on("end", () => {
            u(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (s) => {
      if (s.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${s.statusCode}: ${s.statusMessage}`));
        return;
      }
      s.on("error", r.callback);
      const o = bi(s, "location");
      if (o != null) {
        n < this.maxRedirects ? this.doDownload(fi.prepareRedirectUrlOptions(o, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? oU(r, s) : r.responseHandler(s, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (s) => {
      this.doDownload(s, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = h_(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const s = fi.reconstructOriginalUrl(r), o = f_(t, r);
      fi.isCrossOriginRedirect(s, o) && (Pn.enabled && Pn(`Given the cross-origin redirect (from ${s.host} to ${o.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", s = t.path || "/";
    return new Gl.URL(`${r}//${n}${i}${s}`);
  }
  static isCrossOriginRedirect(t, r) {
    if (t.hostname.toLowerCase() !== r.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && r.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(r.port))
      return !1;
    if (t.protocol !== r.protocol)
      return !0;
    const n = t.port, i = r.port;
    return n !== i;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof gf && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
ht.HttpExecutor = fi;
function f_(e, t) {
  try {
    return new Gl.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", s = `${n}//${r}${i}`;
    return new Gl.URL(e, s);
  }
}
function h_(e, t) {
  const r = Ea(t), n = f_(e, t);
  return _f(n, r), r;
}
function _f(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Kl extends eU.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, Jj.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, nm.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, nm.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
ht.DigestTransform = Kl;
function sU(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function bi(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function oU(e, t) {
  if (!sU(bi(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const o = bi(t, "content-length");
    o != null && r.push(new rU.ProgressCallbackTransform(parseInt(o, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new Kl(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new Kl(e.options.sha2, "sha256", "hex"));
  const i = (0, Zj.createWriteStream)(e.destination);
  r.push(i);
  let s = t;
  for (const o of r)
    o.on("error", (a) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(a);
    }), s = s.pipe(o);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Ea(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function ba(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var nc = {};
Object.defineProperty(nc, "__esModule", { value: !0 });
nc.MemoLazy = void 0;
class aU {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && p_(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
nc.MemoLazy = aU;
function p_(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), s = Object.keys(t);
    return i.length === s.length && i.every((o) => p_(e[o], t[o]));
  }
  return e === t;
}
var Xs = {};
Object.defineProperty(Xs, "__esModule", { value: !0 });
Xs.githubUrl = cU;
Xs.githubTagPrefix = lU;
Xs.getS3LikeProviderBaseUrl = uU;
function cU(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function lU(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function uU(e) {
  const t = e.provider;
  if (t === "s3")
    return dU(e);
  if (t === "spaces")
    return fU(e);
  throw new Error(`Not supported provider: ${t}`);
}
function dU(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return m_(t, e.path);
}
function m_(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function fU(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return m_(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var vf = {};
Object.defineProperty(vf, "__esModule", { value: !0 });
vf.retry = y_;
const hU = ln;
async function y_(e, t) {
  var r;
  const { retries: n, interval: i, backoff: s = 0, attempt: o = 0, shouldRetry: a, cancellationToken: c = new hU.CancellationToken() } = t;
  try {
    return await e();
  } catch (u) {
    if (await Promise.resolve((r = a == null ? void 0 : a(u)) !== null && r !== void 0 ? r : !0) && n > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + s * o)), await y_(e, { ...t, retries: n - 1, attempt: o + 1 });
    throw u;
  }
}
var $f = {};
Object.defineProperty($f, "__esModule", { value: !0 });
$f.parseDn = pU;
function pU(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const s = /* @__PURE__ */ new Map();
  for (let o = 0; o <= e.length; o++) {
    if (o === e.length) {
      r !== null && s.set(r, n);
      break;
    }
    const a = e[o];
    if (t) {
      if (a === '"') {
        t = !1;
        continue;
      }
    } else {
      if (a === '"') {
        t = !0;
        continue;
      }
      if (a === "\\") {
        o++;
        const c = parseInt(e.slice(o, o + 2), 16);
        Number.isNaN(c) ? n += e[o] : (o++, n += String.fromCharCode(c));
        continue;
      }
      if (r === null && a === "=") {
        r = n, n = "";
        continue;
      }
      if (a === "," || a === ";" || a === "+") {
        r !== null && s.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (a === " " && !t) {
      if (n.length === 0)
        continue;
      if (o > i) {
        let c = o;
        for (; e[c] === " "; )
          c++;
        i = c;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        o = i - 1;
        continue;
      }
    }
    n += a;
  }
  return s;
}
var Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.nil = Ci.UUID = void 0;
const g_ = Vs, __ = Bi, mU = "options.name must be either a string or a Buffer", im = (0, g_.randomBytes)(16);
im[0] = im[0] | 1;
const sa = {}, ye = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  sa[t] = e, ye[e] = t;
}
class zn {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = zn.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return yU(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = gU(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (sa[t[14] + t[15]] & 240) >> 4,
        variant: sm((sa[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: sm((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, __.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = sa[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
Ci.UUID = zn;
zn.OID = zn.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function sm(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Es;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Es || (Es = {}));
function yU(e, t, r, n, i = Es.ASCII) {
  const s = (0, g_.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, __.newError)(mU, "ERR_INVALID_UUID_NAME");
  s.update(n), s.update(e);
  const a = s.digest();
  let c;
  switch (i) {
    case Es.BINARY:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, c = a;
      break;
    case Es.OBJECT:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, c = new zn(a);
      break;
    default:
      c = ye[a[0]] + ye[a[1]] + ye[a[2]] + ye[a[3]] + "-" + ye[a[4]] + ye[a[5]] + "-" + ye[a[6] & 15 | r] + ye[a[7]] + "-" + ye[a[8] & 63 | 128] + ye[a[9]] + "-" + ye[a[10]] + ye[a[11]] + ye[a[12]] + ye[a[13]] + ye[a[14]] + ye[a[15]];
      break;
  }
  return c;
}
function gU(e) {
  return ye[e[0]] + ye[e[1]] + ye[e[2]] + ye[e[3]] + "-" + ye[e[4]] + ye[e[5]] + "-" + ye[e[6]] + ye[e[7]] + "-" + ye[e[8]] + ye[e[9]] + "-" + ye[e[10]] + ye[e[11]] + ye[e[12]] + ye[e[13]] + ye[e[14]] + ye[e[15]];
}
Ci.nil = new zn("00000000-0000-0000-0000-000000000000");
var Js = {}, v_ = {};
(function(e) {
  (function(t) {
    t.parser = function(w, y) {
      return new n(w, y);
    }, t.SAXParser = n, t.SAXStream = l, t.createStream = u, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(w, y) {
      if (!(this instanceof n))
        return new n(w, y);
      var k = this;
      s(k), k.q = k.c = "", k.bufferCheckPosition = t.MAX_BUFFER_LENGTH, k.opt = y || {}, k.opt.lowercase = k.opt.lowercase || k.opt.lowercasetags, k.looseCase = k.opt.lowercase ? "toLowerCase" : "toUpperCase", k.tags = [], k.closed = k.closedRoot = k.sawRoot = !1, k.tag = k.error = null, k.strict = !!w, k.noscript = !!(w || k.opt.noscript), k.state = R.BEGIN, k.strictEntities = k.opt.strictEntities, k.ENTITIES = k.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), k.attribList = [], k.opt.xmlns && (k.ns = Object.create(_)), k.opt.unquotedAttributeValues === void 0 && (k.opt.unquotedAttributeValues = !w), k.trackPosition = k.opt.position !== !1, k.trackPosition && (k.position = k.line = k.column = 0), x(k, "onready");
    }
    Object.create || (Object.create = function(w) {
      function y() {
      }
      y.prototype = w;
      var k = new y();
      return k;
    }), Object.keys || (Object.keys = function(w) {
      var y = [];
      for (var k in w) w.hasOwnProperty(k) && y.push(k);
      return y;
    });
    function i(w) {
      for (var y = Math.max(t.MAX_BUFFER_LENGTH, 10), k = 0, O = 0, K = r.length; O < K; O++) {
        var fe = w[r[O]].length;
        if (fe > y)
          switch (r[O]) {
            case "textNode":
              J(w);
              break;
            case "cdata":
              q(w, "oncdata", w.cdata), w.cdata = "";
              break;
            case "script":
              q(w, "onscript", w.script), w.script = "";
              break;
            default:
              U(w, "Max buffer length exceeded: " + r[O]);
          }
        k = Math.max(k, fe);
      }
      var ge = t.MAX_BUFFER_LENGTH - k;
      w.bufferCheckPosition = ge + w.position;
    }
    function s(w) {
      for (var y = 0, k = r.length; y < k; y++)
        w[r[y]] = "";
    }
    function o(w) {
      J(w), w.cdata !== "" && (q(w, "oncdata", w.cdata), w.cdata = ""), w.script !== "" && (q(w, "onscript", w.script), w.script = "");
    }
    n.prototype = {
      end: function() {
        B(this);
      },
      write: T,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        o(this);
      }
    };
    var a;
    try {
      a = require("stream").Stream;
    } catch {
      a = function() {
      };
    }
    a || (a = function() {
    });
    var c = t.EVENTS.filter(function(w) {
      return w !== "error" && w !== "end";
    });
    function u(w, y) {
      return new l(w, y);
    }
    function l(w, y) {
      if (!(this instanceof l))
        return new l(w, y);
      a.apply(this), this._parser = new n(w, y), this.writable = !0, this.readable = !0;
      var k = this;
      this._parser.onend = function() {
        k.emit("end");
      }, this._parser.onerror = function(O) {
        k.emit("error", O), k._parser.error = null;
      }, this._decoder = null, c.forEach(function(O) {
        Object.defineProperty(k, "on" + O, {
          get: function() {
            return k._parser["on" + O];
          },
          set: function(K) {
            if (!K)
              return k.removeAllListeners(O), k._parser["on" + O] = K, K;
            k.on(O, K);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    l.prototype = Object.create(a.prototype, {
      constructor: {
        value: l
      }
    }), l.prototype.write = function(w) {
      return typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(w) && (this._decoder || (this._decoder = new TextDecoder("utf8")), w = this._decoder.decode(w, { stream: !0 })), this._parser.write(w.toString()), this.emit("data", w), !0;
    }, l.prototype.end = function(w) {
      if (w && w.length && this.write(w), this._decoder) {
        var y = this._decoder.decode();
        y && (this._parser.write(y), this.emit("data", y));
      }
      return this._parser.end(), !0;
    }, l.prototype.on = function(w, y) {
      var k = this;
      return !k._parser["on" + w] && c.indexOf(w) !== -1 && (k._parser["on" + w] = function() {
        var O = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        O.splice(0, 0, w), k.emit.apply(k, O);
      }), a.prototype.on.call(k, w, y);
    };
    var d = "[CDATA[", h = "DOCTYPE", p = "http://www.w3.org/XML/1998/namespace", $ = "http://www.w3.org/2000/xmlns/", _ = { xml: p, xmlns: $ }, v = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, m = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, E = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function I(w) {
      return w === " " || w === `
` || w === "\r" || w === "	";
    }
    function F(w) {
      return w === '"' || w === "'";
    }
    function z(w) {
      return w === ">" || I(w);
    }
    function G(w, y) {
      return w.test(y);
    }
    function me(w, y) {
      return !G(w, y);
    }
    var R = 0;
    t.STATE = {
      BEGIN: R++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: R++,
      // leading whitespace
      TEXT: R++,
      // general stuff
      TEXT_ENTITY: R++,
      // &amp and such.
      OPEN_WAKA: R++,
      // <
      SGML_DECL: R++,
      // <!BLARG
      SGML_DECL_QUOTED: R++,
      // <!BLARG foo "bar
      DOCTYPE: R++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: R++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: R++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: R++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: R++,
      // <!-
      COMMENT: R++,
      // <!--
      COMMENT_ENDING: R++,
      // <!-- blah -
      COMMENT_ENDED: R++,
      // <!-- blah --
      CDATA: R++,
      // <![CDATA[ something
      CDATA_ENDING: R++,
      // ]
      CDATA_ENDING_2: R++,
      // ]]
      PROC_INST: R++,
      // <?hi
      PROC_INST_BODY: R++,
      // <?hi there
      PROC_INST_ENDING: R++,
      // <?hi "there" ?
      OPEN_TAG: R++,
      // <strong
      OPEN_TAG_SLASH: R++,
      // <strong /
      ATTRIB: R++,
      // <a
      ATTRIB_NAME: R++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: R++,
      // <a foo _
      ATTRIB_VALUE: R++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: R++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: R++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: R++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: R++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: R++,
      // <foo bar=&quot
      CLOSE_TAG: R++,
      // </a
      CLOSE_TAG_SAW_WHITE: R++,
      // </a   >
      SCRIPT: R++,
      // <script> ...
      SCRIPT_ENDING: R++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(w) {
      var y = t.ENTITIES[w], k = typeof y == "number" ? String.fromCharCode(y) : y;
      t.ENTITIES[w] = k;
    });
    for (var Q in t.STATE)
      t.STATE[t.STATE[Q]] = Q;
    R = t.STATE;
    function x(w, y, k) {
      w[y] && w[y](k);
    }
    function q(w, y, k) {
      w.textNode && J(w), x(w, y, k);
    }
    function J(w) {
      w.textNode = j(w.opt, w.textNode), w.textNode && x(w, "ontext", w.textNode), w.textNode = "";
    }
    function j(w, y) {
      return w.trim && (y = y.trim()), w.normalize && (y = y.replace(/\s+/g, " ")), y;
    }
    function U(w, y) {
      return J(w), w.trackPosition && (y += `
Line: ` + w.line + `
Column: ` + w.column + `
Char: ` + w.c), y = new Error(y), w.error = y, x(w, "onerror", y), w;
    }
    function B(w) {
      return w.sawRoot && !w.closedRoot && M(w, "Unclosed root tag"), w.state !== R.BEGIN && w.state !== R.BEGIN_WHITESPACE && w.state !== R.TEXT && U(w, "Unexpected end"), J(w), w.c = "", w.closed = !0, x(w, "onend"), n.call(w, w.strict, w.opt), w;
    }
    function M(w, y) {
      if (typeof w != "object" || !(w instanceof n))
        throw new Error("bad call to strictFail");
      w.strict && U(w, y);
    }
    function H(w) {
      w.strict || (w.tagName = w.tagName[w.looseCase]());
      var y = w.tags[w.tags.length - 1] || w, k = w.tag = { name: w.tagName, attributes: {} };
      w.opt.xmlns && (k.ns = y.ns), w.attribList.length = 0, q(w, "onopentagstart", k);
    }
    function V(w, y) {
      var k = w.indexOf(":"), O = k < 0 ? ["", w] : w.split(":"), K = O[0], fe = O[1];
      return y && w === "xmlns" && (K = "xmlns", fe = ""), { prefix: K, local: fe };
    }
    function C(w) {
      if (w.strict || (w.attribName = w.attribName[w.looseCase]()), w.attribList.indexOf(w.attribName) !== -1 || w.tag.attributes.hasOwnProperty(w.attribName)) {
        w.attribName = w.attribValue = "";
        return;
      }
      if (w.opt.xmlns) {
        var y = V(w.attribName, !0), k = y.prefix, O = y.local;
        if (k === "xmlns")
          if (O === "xml" && w.attribValue !== p)
            M(
              w,
              "xml: prefix must be bound to " + p + `
Actual: ` + w.attribValue
            );
          else if (O === "xmlns" && w.attribValue !== $)
            M(
              w,
              "xmlns: prefix must be bound to " + $ + `
Actual: ` + w.attribValue
            );
          else {
            var K = w.tag, fe = w.tags[w.tags.length - 1] || w;
            K.ns === fe.ns && (K.ns = Object.create(fe.ns)), K.ns[O] = w.attribValue;
          }
        w.attribList.push([w.attribName, w.attribValue]);
      } else
        w.tag.attributes[w.attribName] = w.attribValue, q(w, "onattribute", {
          name: w.attribName,
          value: w.attribValue
        });
      w.attribName = w.attribValue = "";
    }
    function b(w, y) {
      if (w.opt.xmlns) {
        var k = w.tag, O = V(w.tagName);
        k.prefix = O.prefix, k.local = O.local, k.uri = k.ns[O.prefix] || "", k.prefix && !k.uri && (M(
          w,
          "Unbound namespace prefix: " + JSON.stringify(w.tagName)
        ), k.uri = O.prefix);
        var K = w.tags[w.tags.length - 1] || w;
        k.ns && K.ns !== k.ns && Object.keys(k.ns).forEach(function(Dt) {
          q(w, "onopennamespace", {
            prefix: Dt,
            uri: k.ns[Dt]
          });
        });
        for (var fe = 0, ge = w.attribList.length; fe < ge; fe++) {
          var Ee = w.attribList[fe], Te = Ee[0], Je = Ee[1], _e = V(Te, !0), Ue = _e.prefix, Vt = _e.local, It = Ue === "" ? "" : k.ns[Ue] || "", Tt = {
            name: Te,
            value: Je,
            prefix: Ue,
            local: Vt,
            uri: It
          };
          Ue && Ue !== "xmlns" && !It && (M(
            w,
            "Unbound namespace prefix: " + JSON.stringify(Ue)
          ), Tt.uri = Ue), w.tag.attributes[Te] = Tt, q(w, "onattribute", Tt);
        }
        w.attribList.length = 0;
      }
      w.tag.isSelfClosing = !!y, w.sawRoot = !0, w.tags.push(w.tag), q(w, "onopentag", w.tag), y || (!w.noscript && w.tagName.toLowerCase() === "script" ? w.state = R.SCRIPT : w.state = R.TEXT, w.tag = null, w.tagName = ""), w.attribName = w.attribValue = "", w.attribList.length = 0;
    }
    function N(w) {
      if (!w.tagName) {
        M(w, "Weird empty close tag."), w.textNode += "</>", w.state = R.TEXT;
        return;
      }
      if (w.script) {
        if (w.tagName !== "script") {
          w.script += "</" + w.tagName + ">", w.tagName = "", w.state = R.SCRIPT;
          return;
        }
        q(w, "onscript", w.script), w.script = "";
      }
      var y = w.tags.length, k = w.tagName;
      w.strict || (k = k[w.looseCase]());
      for (var O = k; y--; ) {
        var K = w.tags[y];
        if (K.name !== O)
          M(w, "Unexpected close tag");
        else
          break;
      }
      if (y < 0) {
        M(w, "Unmatched closing tag: " + w.tagName), w.textNode += "</" + w.tagName + ">", w.state = R.TEXT;
        return;
      }
      w.tagName = k;
      for (var fe = w.tags.length; fe-- > y; ) {
        var ge = w.tag = w.tags.pop();
        w.tagName = w.tag.name, q(w, "onclosetag", w.tagName);
        var Ee = {};
        for (var Te in ge.ns)
          Ee[Te] = ge.ns[Te];
        var Je = w.tags[w.tags.length - 1] || w;
        w.opt.xmlns && ge.ns !== Je.ns && Object.keys(ge.ns).forEach(function(_e) {
          var Ue = ge.ns[_e];
          q(w, "onclosenamespace", { prefix: _e, uri: Ue });
        });
      }
      y === 0 && (w.closedRoot = !0), w.tagName = w.attribValue = w.attribName = "", w.attribList.length = 0, w.state = R.TEXT;
    }
    function S(w) {
      var y = w.entity, k = y.toLowerCase(), O, K = "";
      return w.ENTITIES[y] ? w.ENTITIES[y] : w.ENTITIES[k] ? w.ENTITIES[k] : (y = k, y.charAt(0) === "#" && (y.charAt(1) === "x" ? (y = y.slice(2), O = parseInt(y, 16), K = O.toString(16)) : (y = y.slice(1), O = parseInt(y, 10), K = O.toString(10))), y = y.replace(/^0+/, ""), isNaN(O) || K.toLowerCase() !== y || O < 0 || O > 1114111 ? (M(w, "Invalid character entity"), "&" + w.entity + ";") : String.fromCodePoint(O));
    }
    function f(w, y) {
      y === "<" ? (w.state = R.OPEN_WAKA, w.startTagPosition = w.position) : I(y) || (M(w, "Non-whitespace before first tag."), w.textNode = y, w.state = R.TEXT);
    }
    function g(w, y) {
      var k = "";
      return y < w.length && (k = w.charAt(y)), k;
    }
    function T(w) {
      var y = this;
      if (this.error)
        throw this.error;
      if (y.closed)
        return U(
          y,
          "Cannot write after close. Assign an onready handler."
        );
      if (w === null)
        return B(y);
      typeof w == "object" && (w = w.toString());
      for (var k = 0, O = ""; O = g(w, k++), y.c = O, !!O; )
        switch (y.trackPosition && (y.position++, O === `
` ? (y.line++, y.column = 0) : y.column++), y.state) {
          case R.BEGIN:
            if (y.state = R.BEGIN_WHITESPACE, O === "\uFEFF")
              continue;
            f(y, O);
            continue;
          case R.BEGIN_WHITESPACE:
            f(y, O);
            continue;
          case R.TEXT:
            if (y.sawRoot && !y.closedRoot) {
              for (var fe = k - 1; O && O !== "<" && O !== "&"; )
                O = g(w, k++), O && y.trackPosition && (y.position++, O === `
` ? (y.line++, y.column = 0) : y.column++);
              y.textNode += w.substring(fe, k - 1);
            }
            O === "<" && !(y.sawRoot && y.closedRoot && !y.strict) ? (y.state = R.OPEN_WAKA, y.startTagPosition = y.position) : (!I(O) && (!y.sawRoot || y.closedRoot) && M(y, "Text data outside of root node."), O === "&" ? y.state = R.TEXT_ENTITY : y.textNode += O);
            continue;
          case R.SCRIPT:
            O === "<" ? y.state = R.SCRIPT_ENDING : y.script += O;
            continue;
          case R.SCRIPT_ENDING:
            O === "/" ? y.state = R.CLOSE_TAG : (y.script += "<" + O, y.state = R.SCRIPT);
            continue;
          case R.OPEN_WAKA:
            if (O === "!")
              y.state = R.SGML_DECL, y.sgmlDecl = "";
            else if (!I(O)) if (G(v, O))
              y.state = R.OPEN_TAG, y.tagName = O;
            else if (O === "/")
              y.state = R.CLOSE_TAG, y.tagName = "";
            else if (O === "?")
              y.state = R.PROC_INST, y.procInstName = y.procInstBody = "";
            else {
              if (M(y, "Unencoded <"), y.startTagPosition + 1 < y.position) {
                var K = y.position - y.startTagPosition;
                O = new Array(K).join(" ") + O;
              }
              y.textNode += "<" + O, y.state = R.TEXT;
            }
            continue;
          case R.SGML_DECL:
            if (y.sgmlDecl + O === "--") {
              y.state = R.COMMENT, y.comment = "", y.sgmlDecl = "";
              continue;
            }
            y.doctype && y.doctype !== !0 && y.sgmlDecl ? (y.state = R.DOCTYPE_DTD, y.doctype += "<!" + y.sgmlDecl + O, y.sgmlDecl = "") : (y.sgmlDecl + O).toUpperCase() === d ? (q(y, "onopencdata"), y.state = R.CDATA, y.sgmlDecl = "", y.cdata = "") : (y.sgmlDecl + O).toUpperCase() === h ? (y.state = R.DOCTYPE, (y.doctype || y.sawRoot) && M(
              y,
              "Inappropriately located doctype declaration"
            ), y.doctype = "", y.sgmlDecl = "") : O === ">" ? (q(y, "onsgmldeclaration", y.sgmlDecl), y.sgmlDecl = "", y.state = R.TEXT) : (F(O) && (y.state = R.SGML_DECL_QUOTED), y.sgmlDecl += O);
            continue;
          case R.SGML_DECL_QUOTED:
            O === y.q && (y.state = R.SGML_DECL, y.q = ""), y.sgmlDecl += O;
            continue;
          case R.DOCTYPE:
            O === ">" ? (y.state = R.TEXT, q(y, "ondoctype", y.doctype), y.doctype = !0) : (y.doctype += O, O === "[" ? y.state = R.DOCTYPE_DTD : F(O) && (y.state = R.DOCTYPE_QUOTED, y.q = O));
            continue;
          case R.DOCTYPE_QUOTED:
            y.doctype += O, O === y.q && (y.q = "", y.state = R.DOCTYPE);
            continue;
          case R.DOCTYPE_DTD:
            O === "]" ? (y.doctype += O, y.state = R.DOCTYPE) : O === "<" ? (y.state = R.OPEN_WAKA, y.startTagPosition = y.position) : F(O) ? (y.doctype += O, y.state = R.DOCTYPE_DTD_QUOTED, y.q = O) : y.doctype += O;
            continue;
          case R.DOCTYPE_DTD_QUOTED:
            y.doctype += O, O === y.q && (y.state = R.DOCTYPE_DTD, y.q = "");
            continue;
          case R.COMMENT:
            O === "-" ? y.state = R.COMMENT_ENDING : y.comment += O;
            continue;
          case R.COMMENT_ENDING:
            O === "-" ? (y.state = R.COMMENT_ENDED, y.comment = j(y.opt, y.comment), y.comment && q(y, "oncomment", y.comment), y.comment = "") : (y.comment += "-" + O, y.state = R.COMMENT);
            continue;
          case R.COMMENT_ENDED:
            O !== ">" ? (M(y, "Malformed comment"), y.comment += "--" + O, y.state = R.COMMENT) : y.doctype && y.doctype !== !0 ? y.state = R.DOCTYPE_DTD : y.state = R.TEXT;
            continue;
          case R.CDATA:
            for (var fe = k - 1; O && O !== "]"; )
              O = g(w, k++), O && y.trackPosition && (y.position++, O === `
` ? (y.line++, y.column = 0) : y.column++);
            y.cdata += w.substring(fe, k - 1), O === "]" && (y.state = R.CDATA_ENDING);
            continue;
          case R.CDATA_ENDING:
            O === "]" ? y.state = R.CDATA_ENDING_2 : (y.cdata += "]" + O, y.state = R.CDATA);
            continue;
          case R.CDATA_ENDING_2:
            O === ">" ? (y.cdata && q(y, "oncdata", y.cdata), q(y, "onclosecdata"), y.cdata = "", y.state = R.TEXT) : O === "]" ? y.cdata += "]" : (y.cdata += "]]" + O, y.state = R.CDATA);
            continue;
          case R.PROC_INST:
            O === "?" ? y.state = R.PROC_INST_ENDING : I(O) ? y.state = R.PROC_INST_BODY : y.procInstName += O;
            continue;
          case R.PROC_INST_BODY:
            if (!y.procInstBody && I(O))
              continue;
            O === "?" ? y.state = R.PROC_INST_ENDING : y.procInstBody += O;
            continue;
          case R.PROC_INST_ENDING:
            O === ">" ? (q(y, "onprocessinginstruction", {
              name: y.procInstName,
              body: y.procInstBody
            }), y.procInstName = y.procInstBody = "", y.state = R.TEXT) : (y.procInstBody += "?" + O, y.state = R.PROC_INST_BODY);
            continue;
          case R.OPEN_TAG:
            G(m, O) ? y.tagName += O : (H(y), O === ">" ? b(y) : O === "/" ? y.state = R.OPEN_TAG_SLASH : (I(O) || M(y, "Invalid character in tag name"), y.state = R.ATTRIB));
            continue;
          case R.OPEN_TAG_SLASH:
            O === ">" ? (b(y, !0), N(y)) : (M(
              y,
              "Forward-slash in opening tag not followed by >"
            ), y.state = R.ATTRIB);
            continue;
          case R.ATTRIB:
            if (I(O))
              continue;
            O === ">" ? b(y) : O === "/" ? y.state = R.OPEN_TAG_SLASH : G(v, O) ? (y.attribName = O, y.attribValue = "", y.state = R.ATTRIB_NAME) : M(y, "Invalid attribute name");
            continue;
          case R.ATTRIB_NAME:
            O === "=" ? y.state = R.ATTRIB_VALUE : O === ">" ? (M(y, "Attribute without value"), y.attribValue = y.attribName, C(y), b(y)) : I(O) ? y.state = R.ATTRIB_NAME_SAW_WHITE : G(m, O) ? y.attribName += O : M(y, "Invalid attribute name");
            continue;
          case R.ATTRIB_NAME_SAW_WHITE:
            if (O === "=")
              y.state = R.ATTRIB_VALUE;
            else {
              if (I(O))
                continue;
              M(y, "Attribute without value"), y.tag.attributes[y.attribName] = "", y.attribValue = "", q(y, "onattribute", {
                name: y.attribName,
                value: ""
              }), y.attribName = "", O === ">" ? b(y) : G(v, O) ? (y.attribName = O, y.state = R.ATTRIB_NAME) : (M(y, "Invalid attribute name"), y.state = R.ATTRIB);
            }
            continue;
          case R.ATTRIB_VALUE:
            if (I(O))
              continue;
            F(O) ? (y.q = O, y.state = R.ATTRIB_VALUE_QUOTED) : (y.opt.unquotedAttributeValues || U(y, "Unquoted attribute value"), y.state = R.ATTRIB_VALUE_UNQUOTED, y.attribValue = O);
            continue;
          case R.ATTRIB_VALUE_QUOTED:
            if (O !== y.q) {
              O === "&" ? y.state = R.ATTRIB_VALUE_ENTITY_Q : y.attribValue += O;
              continue;
            }
            C(y), y.q = "", y.state = R.ATTRIB_VALUE_CLOSED;
            continue;
          case R.ATTRIB_VALUE_CLOSED:
            I(O) ? y.state = R.ATTRIB : O === ">" ? b(y) : O === "/" ? y.state = R.OPEN_TAG_SLASH : G(v, O) ? (M(y, "No whitespace between attributes"), y.attribName = O, y.attribValue = "", y.state = R.ATTRIB_NAME) : M(y, "Invalid attribute name");
            continue;
          case R.ATTRIB_VALUE_UNQUOTED:
            if (!z(O)) {
              O === "&" ? y.state = R.ATTRIB_VALUE_ENTITY_U : y.attribValue += O;
              continue;
            }
            C(y), O === ">" ? b(y) : y.state = R.ATTRIB;
            continue;
          case R.CLOSE_TAG:
            if (y.tagName)
              O === ">" ? N(y) : G(m, O) ? y.tagName += O : y.script ? (y.script += "</" + y.tagName + O, y.tagName = "", y.state = R.SCRIPT) : (I(O) || M(y, "Invalid tagname in closing tag"), y.state = R.CLOSE_TAG_SAW_WHITE);
            else {
              if (I(O))
                continue;
              me(v, O) ? y.script ? (y.script += "</" + O, y.state = R.SCRIPT) : M(y, "Invalid tagname in closing tag.") : y.tagName = O;
            }
            continue;
          case R.CLOSE_TAG_SAW_WHITE:
            if (I(O))
              continue;
            O === ">" ? N(y) : M(y, "Invalid characters in closing tag");
            continue;
          case R.TEXT_ENTITY:
          case R.ATTRIB_VALUE_ENTITY_Q:
          case R.ATTRIB_VALUE_ENTITY_U:
            var ge, Ee;
            switch (y.state) {
              case R.TEXT_ENTITY:
                ge = R.TEXT, Ee = "textNode";
                break;
              case R.ATTRIB_VALUE_ENTITY_Q:
                ge = R.ATTRIB_VALUE_QUOTED, Ee = "attribValue";
                break;
              case R.ATTRIB_VALUE_ENTITY_U:
                ge = R.ATTRIB_VALUE_UNQUOTED, Ee = "attribValue";
                break;
            }
            if (O === ";") {
              var Te = S(y);
              y.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Te) ? (y.entity = "", y.state = ge, y.write(Te)) : (y[Ee] += Te, y.entity = "", y.state = ge);
            } else G(y.entity.length ? A : E, O) ? y.entity += O : (M(y, "Invalid character in entity name"), y[Ee] += "&" + y.entity + O, y.entity = "", y.state = ge);
            continue;
          default:
            throw new Error(y, "Unknown state: " + y.state);
        }
      return y.position >= y.bufferCheckPosition && i(y), y;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var w = String.fromCharCode, y = Math.floor, k = function() {
        var O = 16384, K = [], fe, ge, Ee = -1, Te = arguments.length;
        if (!Te)
          return "";
        for (var Je = ""; ++Ee < Te; ) {
          var _e = Number(arguments[Ee]);
          if (!isFinite(_e) || // `NaN`, `+Infinity`, or `-Infinity`
          _e < 0 || // not a valid Unicode code point
          _e > 1114111 || // not a valid Unicode code point
          y(_e) !== _e)
            throw RangeError("Invalid code point: " + _e);
          _e <= 65535 ? K.push(_e) : (_e -= 65536, fe = (_e >> 10) + 55296, ge = _e % 1024 + 56320, K.push(fe, ge)), (Ee + 1 === Te || K.length > O) && (Je += w.apply(null, K), K.length = 0);
        }
        return Je;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: k,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = k;
    }();
  })(e);
})(v_);
Object.defineProperty(Js, "__esModule", { value: !0 });
Js.XElement = void 0;
Js.parseXml = wU;
const _U = v_, xo = Bi;
class $_ {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, xo.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!$U(t))
      throw (0, xo.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, xo.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, xo.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (om(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => om(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
Js.XElement = $_;
const vU = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function $U(e) {
  return vU.test(e);
}
function om(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function wU(e) {
  let t = null;
  const r = _U.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const s = new $_(i.name);
    if (s.attributes = i.attributes, t === null)
      t = s;
    else {
      const o = n[n.length - 1];
      o.elements == null && (o.elements = []), o.elements.push(s);
    }
    n.push(s);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const s = n[n.length - 1];
    s.value = i, s.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = d;
  var t = ln;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = Bi;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = ht;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = nc;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var s = Ys;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return s.ProgressCallbackTransform;
  } });
  var o = Xs;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return o.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return o.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return o.githubTagPrefix;
  } });
  var a = vf;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var c = $f;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var u = Ci;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return u.UUID;
  } });
  var l = Js;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function d(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(xe);
var Xe = {}, wf = {}, nr = {};
function w_(e) {
  return typeof e > "u" || e === null;
}
function EU(e) {
  return typeof e == "object" && e !== null;
}
function bU(e) {
  return Array.isArray(e) ? e : w_(e) ? [] : [e];
}
function SU(e, t) {
  var r, n, i, s;
  if (t)
    for (s = Object.keys(t), r = 0, n = s.length; r < n; r += 1)
      i = s[r], e[i] = t[i];
  return e;
}
function PU(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function TU(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
nr.isNothing = w_;
nr.isObject = EU;
nr.toArray = bU;
nr.repeat = PU;
nr.isNegativeZero = TU;
nr.extend = SU;
function E_(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Rs(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = E_(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Rs.prototype = Object.create(Error.prototype);
Rs.prototype.constructor = Rs;
Rs.prototype.toString = function(t) {
  return this.name + ": " + E_(this, t);
};
var Qs = Rs, cs = nr;
function il(e, t, r, n, i) {
  var s = "", o = "", a = Math.floor(i / 2) - 1;
  return n - t > a && (s = " ... ", t = n - a + s.length), r - n > a && (o = " ...", r = n + a - o.length), {
    str: s + e.slice(t, r).replace(/\t/g, "→") + o,
    pos: n - t + s.length
    // relative position
  };
}
function sl(e, t) {
  return cs.repeat(" ", t - e.length) + e;
}
function NU(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], s, o = -1; s = r.exec(e.buffer); )
    i.push(s.index), n.push(s.index + s[0].length), e.position <= s.index && o < 0 && (o = n.length - 2);
  o < 0 && (o = n.length - 1);
  var a = "", c, u, l = Math.min(e.line + t.linesAfter, i.length).toString().length, d = t.maxLength - (t.indent + l + 3);
  for (c = 1; c <= t.linesBefore && !(o - c < 0); c++)
    u = il(
      e.buffer,
      n[o - c],
      i[o - c],
      e.position - (n[o] - n[o - c]),
      d
    ), a = cs.repeat(" ", t.indent) + sl((e.line - c + 1).toString(), l) + " | " + u.str + `
` + a;
  for (u = il(e.buffer, n[o], i[o], e.position, d), a += cs.repeat(" ", t.indent) + sl((e.line + 1).toString(), l) + " | " + u.str + `
`, a += cs.repeat("-", t.indent + l + 3 + u.pos) + `^
`, c = 1; c <= t.linesAfter && !(o + c >= i.length); c++)
    u = il(
      e.buffer,
      n[o + c],
      i[o + c],
      e.position - (n[o] - n[o + c]),
      d
    ), a += cs.repeat(" ", t.indent) + sl((e.line + c + 1).toString(), l) + " | " + u.str + `
`;
  return a.replace(/\n$/, "");
}
var OU = NU, am = Qs, AU = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], RU = [
  "scalar",
  "sequence",
  "mapping"
];
function CU(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function IU(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (AU.indexOf(r) === -1)
      throw new am('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = CU(t.styleAliases || null), RU.indexOf(this.kind) === -1)
    throw new am('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var _t = IU, rs = Qs, ol = _t;
function cm(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(s, o) {
      s.tag === n.tag && s.kind === n.kind && s.multi === n.multi && (i = o);
    }), r[i] = n;
  }), r;
}
function DU() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function Yl(e) {
  return this.extend(e);
}
Yl.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof ol)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new rs("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(s) {
    if (!(s instanceof ol))
      throw new rs("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (s.loadKind && s.loadKind !== "scalar")
      throw new rs("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (s.multi)
      throw new rs("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(s) {
    if (!(s instanceof ol))
      throw new rs("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Yl.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = cm(i, "implicit"), i.compiledExplicit = cm(i, "explicit"), i.compiledTypeMap = DU(i.compiledImplicit, i.compiledExplicit), i;
};
var b_ = Yl, kU = _t, S_ = new kU("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), FU = _t, P_ = new FU("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), jU = _t, T_ = new jU("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), UU = b_, N_ = new UU({
  explicit: [
    S_,
    P_,
    T_
  ]
}), MU = _t;
function LU(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function xU() {
  return null;
}
function VU(e) {
  return e === null;
}
var O_ = new MU("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: LU,
  construct: xU,
  predicate: VU,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), qU = _t;
function BU(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function HU(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function zU(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var A_ = new qU("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: BU,
  construct: HU,
  predicate: zU,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), GU = nr, WU = _t;
function KU(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function YU(e) {
  return 48 <= e && e <= 55;
}
function XU(e) {
  return 48 <= e && e <= 57;
}
function JU(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!KU(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!YU(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!XU(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function QU(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function ZU(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !GU.isNegativeZero(e);
}
var R_ = new WU("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: JU,
  construct: QU,
  predicate: ZU,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), C_ = nr, eM = _t, tM = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function rM(e) {
  return !(e === null || !tM.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function nM(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var iM = /^[-+]?[0-9]+e/;
function sM(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (C_.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), iM.test(r) ? r.replace("e", ".e") : r;
}
function oM(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || C_.isNegativeZero(e));
}
var I_ = new eM("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: rM,
  construct: nM,
  predicate: oM,
  represent: sM,
  defaultStyle: "lowercase"
}), D_ = N_.extend({
  implicit: [
    O_,
    A_,
    R_,
    I_
  ]
}), k_ = D_, aM = _t, F_ = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), j_ = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function cM(e) {
  return e === null ? !1 : F_.exec(e) !== null || j_.exec(e) !== null;
}
function lM(e) {
  var t, r, n, i, s, o, a, c = 0, u = null, l, d, h;
  if (t = F_.exec(e), t === null && (t = j_.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (s = +t[4], o = +t[5], a = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (l = +t[10], d = +(t[11] || 0), u = (l * 60 + d) * 6e4, t[9] === "-" && (u = -u)), h = new Date(Date.UTC(r, n, i, s, o, a, c)), u && h.setTime(h.getTime() - u), h;
}
function uM(e) {
  return e.toISOString();
}
var U_ = new aM("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: cM,
  construct: lM,
  instanceOf: Date,
  represent: uM
}), dM = _t;
function fM(e) {
  return e === "<<" || e === null;
}
var M_ = new dM("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: fM
}), hM = _t, Ef = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function pM(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, s = Ef;
  for (r = 0; r < i; r++)
    if (t = s.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function mM(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, s = Ef, o = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(o >> 16 & 255), a.push(o >> 8 & 255), a.push(o & 255)), o = o << 6 | s.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (a.push(o >> 16 & 255), a.push(o >> 8 & 255), a.push(o & 255)) : r === 18 ? (a.push(o >> 10 & 255), a.push(o >> 2 & 255)) : r === 12 && a.push(o >> 4 & 255), new Uint8Array(a);
}
function yM(e) {
  var t = "", r = 0, n, i, s = e.length, o = Ef;
  for (n = 0; n < s; n++)
    n % 3 === 0 && n && (t += o[r >> 18 & 63], t += o[r >> 12 & 63], t += o[r >> 6 & 63], t += o[r & 63]), r = (r << 8) + e[n];
  return i = s % 3, i === 0 ? (t += o[r >> 18 & 63], t += o[r >> 12 & 63], t += o[r >> 6 & 63], t += o[r & 63]) : i === 2 ? (t += o[r >> 10 & 63], t += o[r >> 4 & 63], t += o[r << 2 & 63], t += o[64]) : i === 1 && (t += o[r >> 2 & 63], t += o[r << 4 & 63], t += o[64], t += o[64]), t;
}
function gM(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var L_ = new hM("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: pM,
  construct: mM,
  predicate: gM,
  represent: yM
}), _M = _t, vM = Object.prototype.hasOwnProperty, $M = Object.prototype.toString;
function wM(e) {
  if (e === null) return !0;
  var t = [], r, n, i, s, o, a = e;
  for (r = 0, n = a.length; r < n; r += 1) {
    if (i = a[r], o = !1, $M.call(i) !== "[object Object]") return !1;
    for (s in i)
      if (vM.call(i, s))
        if (!o) o = !0;
        else return !1;
    if (!o) return !1;
    if (t.indexOf(s) === -1) t.push(s);
    else return !1;
  }
  return !0;
}
function EM(e) {
  return e !== null ? e : [];
}
var x_ = new _M("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: wM,
  construct: EM
}), bM = _t, SM = Object.prototype.toString;
function PM(e) {
  if (e === null) return !0;
  var t, r, n, i, s, o = e;
  for (s = new Array(o.length), t = 0, r = o.length; t < r; t += 1) {
    if (n = o[t], SM.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    s[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function TM(e) {
  if (e === null) return [];
  var t, r, n, i, s, o = e;
  for (s = new Array(o.length), t = 0, r = o.length; t < r; t += 1)
    n = o[t], i = Object.keys(n), s[t] = [i[0], n[i[0]]];
  return s;
}
var V_ = new bM("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: PM,
  construct: TM
}), NM = _t, OM = Object.prototype.hasOwnProperty;
function AM(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (OM.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function RM(e) {
  return e !== null ? e : {};
}
var q_ = new NM("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: AM,
  construct: RM
}), bf = k_.extend({
  implicit: [
    U_,
    M_
  ],
  explicit: [
    L_,
    x_,
    V_,
    q_
  ]
}), Fn = nr, B_ = Qs, CM = OU, IM = bf, un = Object.prototype.hasOwnProperty, Sa = 1, H_ = 2, z_ = 3, Pa = 4, al = 1, DM = 2, lm = 3, kM = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, FM = /[\x85\u2028\u2029]/, jM = /[,\[\]\{\}]/, G_ = /^(?:!|!!|![a-z\-]+!)$/i, W_ = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function um(e) {
  return Object.prototype.toString.call(e);
}
function pr(e) {
  return e === 10 || e === 13;
}
function xn(e) {
  return e === 9 || e === 32;
}
function Pt(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function hi(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function UM(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function MM(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function LM(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function dm(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function xM(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function K_(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var Y_ = new Array(256), X_ = new Array(256);
for (var ni = 0; ni < 256; ni++)
  Y_[ni] = dm(ni) ? 1 : 0, X_[ni] = dm(ni);
function VM(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || IM, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function J_(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = CM(r), new B_(t, r);
}
function te(e, t) {
  throw J_(e, t);
}
function Ta(e, t) {
  e.onWarning && e.onWarning.call(null, J_(e, t));
}
var fm = {
  YAML: function(t, r, n) {
    var i, s, o;
    t.version !== null && te(t, "duplication of %YAML directive"), n.length !== 1 && te(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && te(t, "ill-formed argument of the YAML directive"), s = parseInt(i[1], 10), o = parseInt(i[2], 10), s !== 1 && te(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = o < 2, o !== 1 && o !== 2 && Ta(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, s;
    n.length !== 2 && te(t, "TAG directive accepts exactly two arguments"), i = n[0], s = n[1], G_.test(i) || te(t, "ill-formed tag handle (first argument) of the TAG directive"), un.call(t.tagMap, i) && te(t, 'there is a previously declared suffix for "' + i + '" tag handle'), W_.test(s) || te(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      s = decodeURIComponent(s);
    } catch {
      te(t, "tag prefix is malformed: " + s);
    }
    t.tagMap[i] = s;
  }
};
function an(e, t, r, n) {
  var i, s, o, a;
  if (t < r) {
    if (a = e.input.slice(t, r), n)
      for (i = 0, s = a.length; i < s; i += 1)
        o = a.charCodeAt(i), o === 9 || 32 <= o && o <= 1114111 || te(e, "expected valid JSON character");
    else kM.test(a) && te(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function hm(e, t, r, n) {
  var i, s, o, a;
  for (Fn.isObject(r) || te(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), o = 0, a = i.length; o < a; o += 1)
    s = i[o], un.call(t, s) || (K_(t, s, r[s]), n[s] = !0);
}
function pi(e, t, r, n, i, s, o, a, c) {
  var u, l;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), u = 0, l = i.length; u < l; u += 1)
      Array.isArray(i[u]) && te(e, "nested arrays are not supported inside keys"), typeof i == "object" && um(i[u]) === "[object Object]" && (i[u] = "[object Object]");
  if (typeof i == "object" && um(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(s))
      for (u = 0, l = s.length; u < l; u += 1)
        hm(e, t, s[u], r);
    else
      hm(e, t, s, r);
  else
    !e.json && !un.call(r, i) && un.call(t, i) && (e.line = o || e.line, e.lineStart = a || e.lineStart, e.position = c || e.position, te(e, "duplicated mapping key")), K_(t, i, s), delete r[i];
  return t;
}
function Sf(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : te(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Fe(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; xn(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (pr(i))
      for (Sf(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Ta(e, "deficient indentation"), n;
}
function ic(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || Pt(r)));
}
function Pf(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Fn.repeat(`
`, t - 1));
}
function qM(e, t, r) {
  var n, i, s, o, a, c, u, l, d = e.kind, h = e.result, p;
  if (p = e.input.charCodeAt(e.position), Pt(p) || hi(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), Pt(i) || r && hi(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", s = o = e.position, a = !1; p !== 0; ) {
    if (p === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Pt(i) || r && hi(i))
        break;
    } else if (p === 35) {
      if (n = e.input.charCodeAt(e.position - 1), Pt(n))
        break;
    } else {
      if (e.position === e.lineStart && ic(e) || r && hi(p))
        break;
      if (pr(p))
        if (c = e.line, u = e.lineStart, l = e.lineIndent, Fe(e, !1, -1), e.lineIndent >= t) {
          a = !0, p = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = o, e.line = c, e.lineStart = u, e.lineIndent = l;
          break;
        }
    }
    a && (an(e, s, o, !1), Pf(e, e.line - c), s = o = e.position, a = !1), xn(p) || (o = e.position + 1), p = e.input.charCodeAt(++e.position);
  }
  return an(e, s, o, !1), e.result ? !0 : (e.kind = d, e.result = h, !1);
}
function BM(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (an(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else pr(r) ? (an(e, n, i, !0), Pf(e, Fe(e, !1, t)), n = i = e.position) : e.position === e.lineStart && ic(e) ? te(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  te(e, "unexpected end of the stream within a single quoted scalar");
}
function HM(e, t) {
  var r, n, i, s, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return an(e, r, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (an(e, r, e.position, !0), a = e.input.charCodeAt(++e.position), pr(a))
        Fe(e, !1, t);
      else if (a < 256 && Y_[a])
        e.result += X_[a], e.position++;
      else if ((o = MM(a)) > 0) {
        for (i = o, s = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (o = UM(a)) >= 0 ? s = (s << 4) + o : te(e, "expected hexadecimal character");
        e.result += xM(s), e.position++;
      } else
        te(e, "unknown escape sequence");
      r = n = e.position;
    } else pr(a) ? (an(e, r, n, !0), Pf(e, Fe(e, !1, t)), r = n = e.position) : e.position === e.lineStart && ic(e) ? te(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  te(e, "unexpected end of the stream within a double quoted scalar");
}
function zM(e, t) {
  var r = !0, n, i, s, o = e.tag, a, c = e.anchor, u, l, d, h, p, $ = /* @__PURE__ */ Object.create(null), _, v, m, E;
  if (E = e.input.charCodeAt(e.position), E === 91)
    l = 93, p = !1, a = [];
  else if (E === 123)
    l = 125, p = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), E = e.input.charCodeAt(++e.position); E !== 0; ) {
    if (Fe(e, !0, t), E = e.input.charCodeAt(e.position), E === l)
      return e.position++, e.tag = o, e.anchor = c, e.kind = p ? "mapping" : "sequence", e.result = a, !0;
    r ? E === 44 && te(e, "expected the node content, but found ','") : te(e, "missed comma between flow collection entries"), v = _ = m = null, d = h = !1, E === 63 && (u = e.input.charCodeAt(e.position + 1), Pt(u) && (d = h = !0, e.position++, Fe(e, !0, t))), n = e.line, i = e.lineStart, s = e.position, Ii(e, t, Sa, !1, !0), v = e.tag, _ = e.result, Fe(e, !0, t), E = e.input.charCodeAt(e.position), (h || e.line === n) && E === 58 && (d = !0, E = e.input.charCodeAt(++e.position), Fe(e, !0, t), Ii(e, t, Sa, !1, !0), m = e.result), p ? pi(e, a, $, v, _, m, n, i, s) : d ? a.push(pi(e, null, $, v, _, m, n, i, s)) : a.push(_), Fe(e, !0, t), E = e.input.charCodeAt(e.position), E === 44 ? (r = !0, E = e.input.charCodeAt(++e.position)) : r = !1;
  }
  te(e, "unexpected end of the stream within a flow collection");
}
function GM(e, t) {
  var r, n, i = al, s = !1, o = !1, a = t, c = 0, u = !1, l, d;
  if (d = e.input.charCodeAt(e.position), d === 124)
    n = !1;
  else if (d === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; d !== 0; )
    if (d = e.input.charCodeAt(++e.position), d === 43 || d === 45)
      al === i ? i = d === 43 ? lm : DM : te(e, "repeat of a chomping mode identifier");
    else if ((l = LM(d)) >= 0)
      l === 0 ? te(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? te(e, "repeat of an indentation width identifier") : (a = t + l - 1, o = !0);
    else
      break;
  if (xn(d)) {
    do
      d = e.input.charCodeAt(++e.position);
    while (xn(d));
    if (d === 35)
      do
        d = e.input.charCodeAt(++e.position);
      while (!pr(d) && d !== 0);
  }
  for (; d !== 0; ) {
    for (Sf(e), e.lineIndent = 0, d = e.input.charCodeAt(e.position); (!o || e.lineIndent < a) && d === 32; )
      e.lineIndent++, d = e.input.charCodeAt(++e.position);
    if (!o && e.lineIndent > a && (a = e.lineIndent), pr(d)) {
      c++;
      continue;
    }
    if (e.lineIndent < a) {
      i === lm ? e.result += Fn.repeat(`
`, s ? 1 + c : c) : i === al && s && (e.result += `
`);
      break;
    }
    for (n ? xn(d) ? (u = !0, e.result += Fn.repeat(`
`, s ? 1 + c : c)) : u ? (u = !1, e.result += Fn.repeat(`
`, c + 1)) : c === 0 ? s && (e.result += " ") : e.result += Fn.repeat(`
`, c) : e.result += Fn.repeat(`
`, s ? 1 + c : c), s = !0, o = !0, c = 0, r = e.position; !pr(d) && d !== 0; )
      d = e.input.charCodeAt(++e.position);
    an(e, r, e.position, !1);
  }
  return !0;
}
function pm(e, t) {
  var r, n = e.tag, i = e.anchor, s = [], o, a = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, te(e, "tab characters must not be used in indentation")), !(c !== 45 || (o = e.input.charCodeAt(e.position + 1), !Pt(o)))); ) {
    if (a = !0, e.position++, Fe(e, !0, -1) && e.lineIndent <= t) {
      s.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, Ii(e, t, z_, !1, !0), s.push(e.result), Fe(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && c !== 0)
      te(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = s, !0) : !1;
}
function WM(e, t, r) {
  var n, i, s, o, a, c, u = e.tag, l = e.anchor, d = {}, h = /* @__PURE__ */ Object.create(null), p = null, $ = null, _ = null, v = !1, m = !1, E;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = d), E = e.input.charCodeAt(e.position); E !== 0; ) {
    if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, te(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), s = e.line, (E === 63 || E === 58) && Pt(n))
      E === 63 ? (v && (pi(e, d, h, p, $, null, o, a, c), p = $ = _ = null), m = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : te(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, E = n;
    else {
      if (o = e.line, a = e.lineStart, c = e.position, !Ii(e, r, H_, !1, !0))
        break;
      if (e.line === s) {
        for (E = e.input.charCodeAt(e.position); xn(E); )
          E = e.input.charCodeAt(++e.position);
        if (E === 58)
          E = e.input.charCodeAt(++e.position), Pt(E) || te(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (pi(e, d, h, p, $, null, o, a, c), p = $ = _ = null), m = !0, v = !1, i = !1, p = e.tag, $ = e.result;
        else if (m)
          te(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = u, e.anchor = l, !0;
      } else if (m)
        te(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = u, e.anchor = l, !0;
    }
    if ((e.line === s || e.lineIndent > t) && (v && (o = e.line, a = e.lineStart, c = e.position), Ii(e, t, Pa, !0, i) && (v ? $ = e.result : _ = e.result), v || (pi(e, d, h, p, $, _, o, a, c), p = $ = _ = null), Fe(e, !0, -1), E = e.input.charCodeAt(e.position)), (e.line === s || e.lineIndent > t) && E !== 0)
      te(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return v && pi(e, d, h, p, $, null, o, a, c), m && (e.tag = u, e.anchor = l, e.kind = "mapping", e.result = d), m;
}
function KM(e) {
  var t, r = !1, n = !1, i, s, o;
  if (o = e.input.charCodeAt(e.position), o !== 33) return !1;
  if (e.tag !== null && te(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (r = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (n = !0, i = "!!", o = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      o = e.input.charCodeAt(++e.position);
    while (o !== 0 && o !== 62);
    e.position < e.length ? (s = e.input.slice(t, e.position), o = e.input.charCodeAt(++e.position)) : te(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; o !== 0 && !Pt(o); )
      o === 33 && (n ? te(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), G_.test(i) || te(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), o = e.input.charCodeAt(++e.position);
    s = e.input.slice(t, e.position), jM.test(s) && te(e, "tag suffix cannot contain flow indicator characters");
  }
  s && !W_.test(s) && te(e, "tag name cannot contain such characters: " + s);
  try {
    s = decodeURIComponent(s);
  } catch {
    te(e, "tag name is malformed: " + s);
  }
  return r ? e.tag = s : un.call(e.tagMap, i) ? e.tag = e.tagMap[i] + s : i === "!" ? e.tag = "!" + s : i === "!!" ? e.tag = "tag:yaml.org,2002:" + s : te(e, 'undeclared tag handle "' + i + '"'), !0;
}
function YM(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && te(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Pt(r) && !hi(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && te(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function XM(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Pt(n) && !hi(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && te(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), un.call(e.anchorMap, r) || te(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], Fe(e, !0, -1), !0;
}
function Ii(e, t, r, n, i) {
  var s, o, a, c = 1, u = !1, l = !1, d, h, p, $, _, v;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, s = o = a = Pa === r || z_ === r, n && Fe(e, !0, -1) && (u = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; KM(e) || YM(e); )
      Fe(e, !0, -1) ? (u = !0, a = s, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : a = !1;
  if (a && (a = u || i), (c === 1 || Pa === r) && (Sa === r || H_ === r ? _ = t : _ = t + 1, v = e.position - e.lineStart, c === 1 ? a && (pm(e, v) || WM(e, v, _)) || zM(e, _) ? l = !0 : (o && GM(e, _) || BM(e, _) || HM(e, _) ? l = !0 : XM(e) ? (l = !0, (e.tag !== null || e.anchor !== null) && te(e, "alias node should not have any properties")) : qM(e, _, Sa === r) && (l = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (l = a && pm(e, v))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && te(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), d = 0, h = e.implicitTypes.length; d < h; d += 1)
      if ($ = e.implicitTypes[d], $.resolve(e.result)) {
        e.result = $.construct(e.result), e.tag = $.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (un.call(e.typeMap[e.kind || "fallback"], e.tag))
      $ = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for ($ = null, p = e.typeMap.multi[e.kind || "fallback"], d = 0, h = p.length; d < h; d += 1)
        if (e.tag.slice(0, p[d].tag.length) === p[d].tag) {
          $ = p[d];
          break;
        }
    $ || te(e, "unknown tag !<" + e.tag + ">"), e.result !== null && $.kind !== e.kind && te(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + $.kind + '", not "' + e.kind + '"'), $.resolve(e.result, e.tag) ? (e.result = $.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : te(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || l;
}
function JM(e) {
  var t = e.position, r, n, i, s = !1, o;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (o = e.input.charCodeAt(e.position)) !== 0 && (Fe(e, !0, -1), o = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || o !== 37)); ) {
    for (s = !0, o = e.input.charCodeAt(++e.position), r = e.position; o !== 0 && !Pt(o); )
      o = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && te(e, "directive name must not be less than one character in length"); o !== 0; ) {
      for (; xn(o); )
        o = e.input.charCodeAt(++e.position);
      if (o === 35) {
        do
          o = e.input.charCodeAt(++e.position);
        while (o !== 0 && !pr(o));
        break;
      }
      if (pr(o)) break;
      for (r = e.position; o !== 0 && !Pt(o); )
        o = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    o !== 0 && Sf(e), un.call(fm, n) ? fm[n](e, n, i) : Ta(e, 'unknown document directive "' + n + '"');
  }
  if (Fe(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Fe(e, !0, -1)) : s && te(e, "directives end mark is expected"), Ii(e, e.lineIndent - 1, Pa, !1, !0), Fe(e, !0, -1), e.checkLineBreaks && FM.test(e.input.slice(t, e.position)) && Ta(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && ic(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Fe(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    te(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Q_(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new VM(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, te(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    JM(r);
  return r.documents;
}
function QM(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = Q_(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, s = n.length; i < s; i += 1)
    t(n[i]);
}
function ZM(e, t) {
  var r = Q_(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new B_("expected a single document in the stream, but found more");
  }
}
wf.loadAll = QM;
wf.load = ZM;
var Z_ = {}, sc = nr, Zs = Qs, eL = bf, ev = Object.prototype.toString, tv = Object.prototype.hasOwnProperty, Tf = 65279, tL = 9, Cs = 10, rL = 13, nL = 32, iL = 33, sL = 34, Xl = 35, oL = 37, aL = 38, cL = 39, lL = 42, rv = 44, uL = 45, Na = 58, dL = 61, fL = 62, hL = 63, pL = 64, nv = 91, iv = 93, mL = 96, sv = 123, yL = 124, ov = 125, ot = {};
ot[0] = "\\0";
ot[7] = "\\a";
ot[8] = "\\b";
ot[9] = "\\t";
ot[10] = "\\n";
ot[11] = "\\v";
ot[12] = "\\f";
ot[13] = "\\r";
ot[27] = "\\e";
ot[34] = '\\"';
ot[92] = "\\\\";
ot[133] = "\\N";
ot[160] = "\\_";
ot[8232] = "\\L";
ot[8233] = "\\P";
var gL = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], _L = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function vL(e, t) {
  var r, n, i, s, o, a, c;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, s = n.length; i < s; i += 1)
    o = n[i], a = String(t[o]), o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2)), c = e.compiledTypeMap.fallback[o], c && tv.call(c.styleAliases, a) && (a = c.styleAliases[a]), r[o] = a;
  return r;
}
function $L(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new Zs("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + sc.repeat("0", n - t.length) + t;
}
var wL = 1, Is = 2;
function EL(e) {
  this.schema = e.schema || eL, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = sc.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = vL(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Is : wL, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function mm(e, t) {
  for (var r = sc.repeat(" ", t), n = 0, i = -1, s = "", o, a = e.length; n < a; )
    i = e.indexOf(`
`, n), i === -1 ? (o = e.slice(n), n = a) : (o = e.slice(n, i + 1), n = i + 1), o.length && o !== `
` && (s += r), s += o;
  return s;
}
function Jl(e, t) {
  return `
` + sc.repeat(" ", e.indent * t);
}
function bL(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Oa(e) {
  return e === nL || e === tL;
}
function Ds(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Tf || 65536 <= e && e <= 1114111;
}
function ym(e) {
  return Ds(e) && e !== Tf && e !== rL && e !== Cs;
}
function gm(e, t, r) {
  var n = ym(e), i = n && !Oa(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== rv && e !== nv && e !== iv && e !== sv && e !== ov) && e !== Xl && !(t === Na && !i) || ym(t) && !Oa(t) && e === Xl || t === Na && i
  );
}
function SL(e) {
  return Ds(e) && e !== Tf && !Oa(e) && e !== uL && e !== hL && e !== Na && e !== rv && e !== nv && e !== iv && e !== sv && e !== ov && e !== Xl && e !== aL && e !== lL && e !== iL && e !== yL && e !== dL && e !== fL && e !== cL && e !== sL && e !== oL && e !== pL && e !== mL;
}
function PL(e) {
  return !Oa(e) && e !== Na;
}
function ls(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function av(e) {
  var t = /^\n* /;
  return t.test(e);
}
var cv = 1, Ql = 2, lv = 3, uv = 4, li = 5;
function TL(e, t, r, n, i, s, o, a) {
  var c, u = 0, l = null, d = !1, h = !1, p = n !== -1, $ = -1, _ = SL(ls(e, 0)) && PL(ls(e, e.length - 1));
  if (t || o)
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = ls(e, c), !Ds(u))
        return li;
      _ = _ && gm(u, l, a), l = u;
    }
  else {
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = ls(e, c), u === Cs)
        d = !0, p && (h = h || // Foldable line = too long, and not more-indented.
        c - $ - 1 > n && e[$ + 1] !== " ", $ = c);
      else if (!Ds(u))
        return li;
      _ = _ && gm(u, l, a), l = u;
    }
    h = h || p && c - $ - 1 > n && e[$ + 1] !== " ";
  }
  return !d && !h ? _ && !o && !i(e) ? cv : s === Is ? li : Ql : r > 9 && av(e) ? li : o ? s === Is ? li : Ql : h ? uv : lv;
}
function NL(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Is ? '""' : "''";
    if (!e.noCompatMode && (gL.indexOf(t) !== -1 || _L.test(t)))
      return e.quotingType === Is ? '"' + t + '"' : "'" + t + "'";
    var s = e.indent * Math.max(1, r), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - s), a = n || e.flowLevel > -1 && r >= e.flowLevel;
    function c(u) {
      return bL(e, u);
    }
    switch (TL(
      t,
      a,
      e.indent,
      o,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case cv:
        return t;
      case Ql:
        return "'" + t.replace(/'/g, "''") + "'";
      case lv:
        return "|" + _m(t, e.indent) + vm(mm(t, s));
      case uv:
        return ">" + _m(t, e.indent) + vm(mm(OL(t, o), s));
      case li:
        return '"' + AL(t) + '"';
      default:
        throw new Zs("impossible error: invalid scalar style");
    }
  }();
}
function _m(e, t) {
  var r = av(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), s = i ? "+" : n ? "" : "-";
  return r + s + `
`;
}
function vm(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function OL(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var u = e.indexOf(`
`);
    return u = u !== -1 ? u : e.length, r.lastIndex = u, $m(e.slice(0, u), t);
  }(), i = e[0] === `
` || e[0] === " ", s, o; o = r.exec(e); ) {
    var a = o[1], c = o[2];
    s = c[0] === " ", n += a + (!i && !s && c !== "" ? `
` : "") + $m(c, t), i = s;
  }
  return n;
}
function $m(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, s, o = 0, a = 0, c = ""; n = r.exec(e); )
    a = n.index, a - i > t && (s = o > i ? o : a, c += `
` + e.slice(i, s), i = s + 1), o = a;
  return c += `
`, e.length - i > t && o > i ? c += e.slice(i, o) + `
` + e.slice(o + 1) : c += e.slice(i), c.slice(1);
}
function AL(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = ls(e, i), n = ot[r], !n && Ds(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || $L(r);
  return t;
}
function RL(e, t, r) {
  var n = "", i = e.tag, s, o, a;
  for (s = 0, o = r.length; s < o; s += 1)
    a = r[s], e.replacer && (a = e.replacer.call(r, String(s), a)), (Dr(e, t, a, !1, !1) || typeof a > "u" && Dr(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function wm(e, t, r, n) {
  var i = "", s = e.tag, o, a, c;
  for (o = 0, a = r.length; o < a; o += 1)
    c = r[o], e.replacer && (c = e.replacer.call(r, String(o), c)), (Dr(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && Dr(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Jl(e, t)), e.dump && Cs === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = s, e.dump = i || "[]";
}
function CL(e, t, r) {
  var n = "", i = e.tag, s = Object.keys(r), o, a, c, u, l;
  for (o = 0, a = s.length; o < a; o += 1)
    l = "", n !== "" && (l += ", "), e.condenseFlow && (l += '"'), c = s[o], u = r[c], e.replacer && (u = e.replacer.call(r, c, u)), Dr(e, t, c, !1, !1) && (e.dump.length > 1024 && (l += "? "), l += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), Dr(e, t, u, !1, !1) && (l += e.dump, n += l));
  e.tag = i, e.dump = "{" + n + "}";
}
function IL(e, t, r, n) {
  var i = "", s = e.tag, o = Object.keys(r), a, c, u, l, d, h;
  if (e.sortKeys === !0)
    o.sort();
  else if (typeof e.sortKeys == "function")
    o.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Zs("sortKeys must be a boolean or a function");
  for (a = 0, c = o.length; a < c; a += 1)
    h = "", (!n || i !== "") && (h += Jl(e, t)), u = o[a], l = r[u], e.replacer && (l = e.replacer.call(r, u, l)), Dr(e, t + 1, u, !0, !0, !0) && (d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, d && (e.dump && Cs === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, d && (h += Jl(e, t)), Dr(e, t + 1, l, !0, d) && (e.dump && Cs === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = s, e.dump = i || "{}";
}
function Em(e, t, r) {
  var n, i, s, o, a, c;
  for (i = r ? e.explicitTypes : e.implicitTypes, s = 0, o = i.length; s < o; s += 1)
    if (a = i[s], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (r ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (c = e.styleMap[a.tag] || a.defaultStyle, ev.call(a.represent) === "[object Function]")
          n = a.represent(t, c);
        else if (tv.call(a.represent, c))
          n = a.represent[c](t, c);
        else
          throw new Zs("!<" + a.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function Dr(e, t, r, n, i, s, o) {
  e.tag = null, e.dump = r, Em(e, r, !1) || Em(e, r, !0);
  var a = ev.call(e.dump), c = n, u;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var l = a === "[object Object]" || a === "[object Array]", d, h;
  if (l && (d = e.duplicates.indexOf(r), h = d !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[d])
    e.dump = "*ref_" + d;
  else {
    if (l && h && !e.usedDuplicates[d] && (e.usedDuplicates[d] = !0), a === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (IL(e, t, e.dump, i), h && (e.dump = "&ref_" + d + e.dump)) : (CL(e, t, e.dump), h && (e.dump = "&ref_" + d + " " + e.dump));
    else if (a === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? wm(e, t - 1, e.dump, i) : wm(e, t, e.dump, i), h && (e.dump = "&ref_" + d + e.dump)) : (RL(e, t, e.dump), h && (e.dump = "&ref_" + d + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && NL(e, e.dump, t, s, c);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Zs("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (u = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? u = "!" + u : u.slice(0, 18) === "tag:yaml.org,2002:" ? u = "!!" + u.slice(18) : u = "!<" + u + ">", e.dump = u + " " + e.dump);
  }
  return !0;
}
function DL(e, t) {
  var r = [], n = [], i, s;
  for (Zl(e, r, n), i = 0, s = n.length; i < s; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(s);
}
function Zl(e, t, r) {
  var n, i, s;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, s = e.length; i < s; i += 1)
        Zl(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, s = n.length; i < s; i += 1)
        Zl(e[n[i]], t, r);
}
function kL(e, t) {
  t = t || {};
  var r = new EL(t);
  r.noRefs || DL(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), Dr(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
Z_.dump = kL;
var dv = wf, FL = Z_;
function Nf(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Xe.Type = _t;
Xe.Schema = b_;
Xe.FAILSAFE_SCHEMA = N_;
Xe.JSON_SCHEMA = D_;
Xe.CORE_SCHEMA = k_;
Xe.DEFAULT_SCHEMA = bf;
Xe.load = dv.load;
Xe.loadAll = dv.loadAll;
Xe.dump = FL.dump;
Xe.YAMLException = Qs;
Xe.types = {
  binary: L_,
  float: I_,
  map: T_,
  null: O_,
  pairs: V_,
  set: q_,
  timestamp: U_,
  bool: A_,
  int: R_,
  merge: M_,
  omap: x_,
  seq: P_,
  str: S_
};
Xe.safeLoad = Nf("safeLoad", "load");
Xe.safeLoadAll = Nf("safeLoadAll", "loadAll");
Xe.safeDump = Nf("safeDump", "dump");
var oc = {};
Object.defineProperty(oc, "__esModule", { value: !0 });
oc.Lazy = void 0;
class jL {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
oc.Lazy = jL;
var eo = {}, Aa = { exports: {} };
Aa.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, o = 9007199254740991, a = "[object Arguments]", c = "[object Array]", u = "[object AsyncFunction]", l = "[object Boolean]", d = "[object Date]", h = "[object Error]", p = "[object Function]", $ = "[object GeneratorFunction]", _ = "[object Map]", v = "[object Number]", m = "[object Null]", E = "[object Object]", A = "[object Promise]", I = "[object Proxy]", F = "[object RegExp]", z = "[object Set]", G = "[object String]", me = "[object Symbol]", R = "[object Undefined]", Q = "[object WeakMap]", x = "[object ArrayBuffer]", q = "[object DataView]", J = "[object Float32Array]", j = "[object Float64Array]", U = "[object Int8Array]", B = "[object Int16Array]", M = "[object Int32Array]", H = "[object Uint8Array]", V = "[object Uint8ClampedArray]", C = "[object Uint16Array]", b = "[object Uint32Array]", N = /[\\^$.*+?()[\]{}|]/g, S = /^\[object .+?Constructor\]$/, f = /^(?:0|[1-9]\d*)$/, g = {};
  g[J] = g[j] = g[U] = g[B] = g[M] = g[H] = g[V] = g[C] = g[b] = !0, g[a] = g[c] = g[x] = g[l] = g[q] = g[d] = g[h] = g[p] = g[_] = g[v] = g[E] = g[F] = g[z] = g[G] = g[Q] = !1;
  var T = typeof ft == "object" && ft && ft.Object === Object && ft, w = typeof self == "object" && self && self.Object === Object && self, y = T || w || Function("return this")(), k = t && !t.nodeType && t, O = k && !0 && e && !e.nodeType && e, K = O && O.exports === k, fe = K && T.process, ge = function() {
    try {
      return fe && fe.binding && fe.binding("util");
    } catch {
    }
  }(), Ee = ge && ge.isTypedArray;
  function Te(P, D) {
    for (var L = -1, X = P == null ? 0 : P.length, be = 0, oe = []; ++L < X; ) {
      var Ie = P[L];
      D(Ie, L, P) && (oe[be++] = Ie);
    }
    return oe;
  }
  function Je(P, D) {
    for (var L = -1, X = D.length, be = P.length; ++L < X; )
      P[be + L] = D[L];
    return P;
  }
  function _e(P, D) {
    for (var L = -1, X = P == null ? 0 : P.length; ++L < X; )
      if (D(P[L], L, P))
        return !0;
    return !1;
  }
  function Ue(P, D) {
    for (var L = -1, X = Array(P); ++L < P; )
      X[L] = D(L);
    return X;
  }
  function Vt(P) {
    return function(D) {
      return P(D);
    };
  }
  function It(P, D) {
    return P.has(D);
  }
  function Tt(P, D) {
    return P == null ? void 0 : P[D];
  }
  function Dt(P) {
    var D = -1, L = Array(P.size);
    return P.forEach(function(X, be) {
      L[++D] = [be, X];
    }), L;
  }
  function gr(P, D) {
    return function(L) {
      return P(D(L));
    };
  }
  function _r(P) {
    var D = -1, L = Array(P.size);
    return P.forEach(function(X) {
      L[++D] = X;
    }), L;
  }
  var vr = Array.prototype, Nt = Function.prototype, kt = Object.prototype, $r = y["__core-js_shared__"], kr = Nt.toString, vt = kt.hasOwnProperty, kf = function() {
    var P = /[^.]+$/.exec($r && $r.keys && $r.keys.IE_PROTO || "");
    return P ? "Symbol(src)_1." + P : "";
  }(), Ff = kt.toString, Nv = RegExp(
    "^" + kr.call(vt).replace(N, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), jf = K ? y.Buffer : void 0, io = y.Symbol, Uf = y.Uint8Array, Mf = kt.propertyIsEnumerable, Ov = vr.splice, gn = io ? io.toStringTag : void 0, Lf = Object.getOwnPropertySymbols, Av = jf ? jf.isBuffer : void 0, Rv = gr(Object.keys, Object), yc = Xn(y, "DataView"), Gi = Xn(y, "Map"), gc = Xn(y, "Promise"), _c = Xn(y, "Set"), vc = Xn(y, "WeakMap"), Wi = Xn(Object, "create"), Cv = $n(yc), Iv = $n(Gi), Dv = $n(gc), kv = $n(_c), Fv = $n(vc), xf = io ? io.prototype : void 0, $c = xf ? xf.valueOf : void 0;
  function _n(P) {
    var D = -1, L = P == null ? 0 : P.length;
    for (this.clear(); ++D < L; ) {
      var X = P[D];
      this.set(X[0], X[1]);
    }
  }
  function jv() {
    this.__data__ = Wi ? Wi(null) : {}, this.size = 0;
  }
  function Uv(P) {
    var D = this.has(P) && delete this.__data__[P];
    return this.size -= D ? 1 : 0, D;
  }
  function Mv(P) {
    var D = this.__data__;
    if (Wi) {
      var L = D[P];
      return L === n ? void 0 : L;
    }
    return vt.call(D, P) ? D[P] : void 0;
  }
  function Lv(P) {
    var D = this.__data__;
    return Wi ? D[P] !== void 0 : vt.call(D, P);
  }
  function xv(P, D) {
    var L = this.__data__;
    return this.size += this.has(P) ? 0 : 1, L[P] = Wi && D === void 0 ? n : D, this;
  }
  _n.prototype.clear = jv, _n.prototype.delete = Uv, _n.prototype.get = Mv, _n.prototype.has = Lv, _n.prototype.set = xv;
  function wr(P) {
    var D = -1, L = P == null ? 0 : P.length;
    for (this.clear(); ++D < L; ) {
      var X = P[D];
      this.set(X[0], X[1]);
    }
  }
  function Vv() {
    this.__data__ = [], this.size = 0;
  }
  function qv(P) {
    var D = this.__data__, L = oo(D, P);
    if (L < 0)
      return !1;
    var X = D.length - 1;
    return L == X ? D.pop() : Ov.call(D, L, 1), --this.size, !0;
  }
  function Bv(P) {
    var D = this.__data__, L = oo(D, P);
    return L < 0 ? void 0 : D[L][1];
  }
  function Hv(P) {
    return oo(this.__data__, P) > -1;
  }
  function zv(P, D) {
    var L = this.__data__, X = oo(L, P);
    return X < 0 ? (++this.size, L.push([P, D])) : L[X][1] = D, this;
  }
  wr.prototype.clear = Vv, wr.prototype.delete = qv, wr.prototype.get = Bv, wr.prototype.has = Hv, wr.prototype.set = zv;
  function vn(P) {
    var D = -1, L = P == null ? 0 : P.length;
    for (this.clear(); ++D < L; ) {
      var X = P[D];
      this.set(X[0], X[1]);
    }
  }
  function Gv() {
    this.size = 0, this.__data__ = {
      hash: new _n(),
      map: new (Gi || wr)(),
      string: new _n()
    };
  }
  function Wv(P) {
    var D = ao(this, P).delete(P);
    return this.size -= D ? 1 : 0, D;
  }
  function Kv(P) {
    return ao(this, P).get(P);
  }
  function Yv(P) {
    return ao(this, P).has(P);
  }
  function Xv(P, D) {
    var L = ao(this, P), X = L.size;
    return L.set(P, D), this.size += L.size == X ? 0 : 1, this;
  }
  vn.prototype.clear = Gv, vn.prototype.delete = Wv, vn.prototype.get = Kv, vn.prototype.has = Yv, vn.prototype.set = Xv;
  function so(P) {
    var D = -1, L = P == null ? 0 : P.length;
    for (this.__data__ = new vn(); ++D < L; )
      this.add(P[D]);
  }
  function Jv(P) {
    return this.__data__.set(P, n), this;
  }
  function Qv(P) {
    return this.__data__.has(P);
  }
  so.prototype.add = so.prototype.push = Jv, so.prototype.has = Qv;
  function Fr(P) {
    var D = this.__data__ = new wr(P);
    this.size = D.size;
  }
  function Zv() {
    this.__data__ = new wr(), this.size = 0;
  }
  function e$(P) {
    var D = this.__data__, L = D.delete(P);
    return this.size = D.size, L;
  }
  function t$(P) {
    return this.__data__.get(P);
  }
  function r$(P) {
    return this.__data__.has(P);
  }
  function n$(P, D) {
    var L = this.__data__;
    if (L instanceof wr) {
      var X = L.__data__;
      if (!Gi || X.length < r - 1)
        return X.push([P, D]), this.size = ++L.size, this;
      L = this.__data__ = new vn(X);
    }
    return L.set(P, D), this.size = L.size, this;
  }
  Fr.prototype.clear = Zv, Fr.prototype.delete = e$, Fr.prototype.get = t$, Fr.prototype.has = r$, Fr.prototype.set = n$;
  function i$(P, D) {
    var L = co(P), X = !L && v$(P), be = !L && !X && wc(P), oe = !L && !X && !be && Yf(P), Ie = L || X || be || oe, Ve = Ie ? Ue(P.length, String) : [], He = Ve.length;
    for (var Oe in P)
      vt.call(P, Oe) && !(Ie && // Safari 9 has enumerable `arguments.length` in strict mode.
      (Oe == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      be && (Oe == "offset" || Oe == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      oe && (Oe == "buffer" || Oe == "byteLength" || Oe == "byteOffset") || // Skip index properties.
      p$(Oe, He))) && Ve.push(Oe);
    return Ve;
  }
  function oo(P, D) {
    for (var L = P.length; L--; )
      if (zf(P[L][0], D))
        return L;
    return -1;
  }
  function s$(P, D, L) {
    var X = D(P);
    return co(P) ? X : Je(X, L(P));
  }
  function Ki(P) {
    return P == null ? P === void 0 ? R : m : gn && gn in Object(P) ? f$(P) : _$(P);
  }
  function Vf(P) {
    return Yi(P) && Ki(P) == a;
  }
  function qf(P, D, L, X, be) {
    return P === D ? !0 : P == null || D == null || !Yi(P) && !Yi(D) ? P !== P && D !== D : o$(P, D, L, X, qf, be);
  }
  function o$(P, D, L, X, be, oe) {
    var Ie = co(P), Ve = co(D), He = Ie ? c : jr(P), Oe = Ve ? c : jr(D);
    He = He == a ? E : He, Oe = Oe == a ? E : Oe;
    var Ot = He == E, qt = Oe == E, Qe = He == Oe;
    if (Qe && wc(P)) {
      if (!wc(D))
        return !1;
      Ie = !0, Ot = !1;
    }
    if (Qe && !Ot)
      return oe || (oe = new Fr()), Ie || Yf(P) ? Bf(P, D, L, X, be, oe) : u$(P, D, He, L, X, be, oe);
    if (!(L & i)) {
      var Ft = Ot && vt.call(P, "__wrapped__"), jt = qt && vt.call(D, "__wrapped__");
      if (Ft || jt) {
        var Ur = Ft ? P.value() : P, Er = jt ? D.value() : D;
        return oe || (oe = new Fr()), be(Ur, Er, L, X, oe);
      }
    }
    return Qe ? (oe || (oe = new Fr()), d$(P, D, L, X, be, oe)) : !1;
  }
  function a$(P) {
    if (!Kf(P) || y$(P))
      return !1;
    var D = Gf(P) ? Nv : S;
    return D.test($n(P));
  }
  function c$(P) {
    return Yi(P) && Wf(P.length) && !!g[Ki(P)];
  }
  function l$(P) {
    if (!g$(P))
      return Rv(P);
    var D = [];
    for (var L in Object(P))
      vt.call(P, L) && L != "constructor" && D.push(L);
    return D;
  }
  function Bf(P, D, L, X, be, oe) {
    var Ie = L & i, Ve = P.length, He = D.length;
    if (Ve != He && !(Ie && He > Ve))
      return !1;
    var Oe = oe.get(P);
    if (Oe && oe.get(D))
      return Oe == D;
    var Ot = -1, qt = !0, Qe = L & s ? new so() : void 0;
    for (oe.set(P, D), oe.set(D, P); ++Ot < Ve; ) {
      var Ft = P[Ot], jt = D[Ot];
      if (X)
        var Ur = Ie ? X(jt, Ft, Ot, D, P, oe) : X(Ft, jt, Ot, P, D, oe);
      if (Ur !== void 0) {
        if (Ur)
          continue;
        qt = !1;
        break;
      }
      if (Qe) {
        if (!_e(D, function(Er, wn) {
          if (!It(Qe, wn) && (Ft === Er || be(Ft, Er, L, X, oe)))
            return Qe.push(wn);
        })) {
          qt = !1;
          break;
        }
      } else if (!(Ft === jt || be(Ft, jt, L, X, oe))) {
        qt = !1;
        break;
      }
    }
    return oe.delete(P), oe.delete(D), qt;
  }
  function u$(P, D, L, X, be, oe, Ie) {
    switch (L) {
      case q:
        if (P.byteLength != D.byteLength || P.byteOffset != D.byteOffset)
          return !1;
        P = P.buffer, D = D.buffer;
      case x:
        return !(P.byteLength != D.byteLength || !oe(new Uf(P), new Uf(D)));
      case l:
      case d:
      case v:
        return zf(+P, +D);
      case h:
        return P.name == D.name && P.message == D.message;
      case F:
      case G:
        return P == D + "";
      case _:
        var Ve = Dt;
      case z:
        var He = X & i;
        if (Ve || (Ve = _r), P.size != D.size && !He)
          return !1;
        var Oe = Ie.get(P);
        if (Oe)
          return Oe == D;
        X |= s, Ie.set(P, D);
        var Ot = Bf(Ve(P), Ve(D), X, be, oe, Ie);
        return Ie.delete(P), Ot;
      case me:
        if ($c)
          return $c.call(P) == $c.call(D);
    }
    return !1;
  }
  function d$(P, D, L, X, be, oe) {
    var Ie = L & i, Ve = Hf(P), He = Ve.length, Oe = Hf(D), Ot = Oe.length;
    if (He != Ot && !Ie)
      return !1;
    for (var qt = He; qt--; ) {
      var Qe = Ve[qt];
      if (!(Ie ? Qe in D : vt.call(D, Qe)))
        return !1;
    }
    var Ft = oe.get(P);
    if (Ft && oe.get(D))
      return Ft == D;
    var jt = !0;
    oe.set(P, D), oe.set(D, P);
    for (var Ur = Ie; ++qt < He; ) {
      Qe = Ve[qt];
      var Er = P[Qe], wn = D[Qe];
      if (X)
        var Xf = Ie ? X(wn, Er, Qe, D, P, oe) : X(Er, wn, Qe, P, D, oe);
      if (!(Xf === void 0 ? Er === wn || be(Er, wn, L, X, oe) : Xf)) {
        jt = !1;
        break;
      }
      Ur || (Ur = Qe == "constructor");
    }
    if (jt && !Ur) {
      var lo = P.constructor, uo = D.constructor;
      lo != uo && "constructor" in P && "constructor" in D && !(typeof lo == "function" && lo instanceof lo && typeof uo == "function" && uo instanceof uo) && (jt = !1);
    }
    return oe.delete(P), oe.delete(D), jt;
  }
  function Hf(P) {
    return s$(P, E$, h$);
  }
  function ao(P, D) {
    var L = P.__data__;
    return m$(D) ? L[typeof D == "string" ? "string" : "hash"] : L.map;
  }
  function Xn(P, D) {
    var L = Tt(P, D);
    return a$(L) ? L : void 0;
  }
  function f$(P) {
    var D = vt.call(P, gn), L = P[gn];
    try {
      P[gn] = void 0;
      var X = !0;
    } catch {
    }
    var be = Ff.call(P);
    return X && (D ? P[gn] = L : delete P[gn]), be;
  }
  var h$ = Lf ? function(P) {
    return P == null ? [] : (P = Object(P), Te(Lf(P), function(D) {
      return Mf.call(P, D);
    }));
  } : b$, jr = Ki;
  (yc && jr(new yc(new ArrayBuffer(1))) != q || Gi && jr(new Gi()) != _ || gc && jr(gc.resolve()) != A || _c && jr(new _c()) != z || vc && jr(new vc()) != Q) && (jr = function(P) {
    var D = Ki(P), L = D == E ? P.constructor : void 0, X = L ? $n(L) : "";
    if (X)
      switch (X) {
        case Cv:
          return q;
        case Iv:
          return _;
        case Dv:
          return A;
        case kv:
          return z;
        case Fv:
          return Q;
      }
    return D;
  });
  function p$(P, D) {
    return D = D ?? o, !!D && (typeof P == "number" || f.test(P)) && P > -1 && P % 1 == 0 && P < D;
  }
  function m$(P) {
    var D = typeof P;
    return D == "string" || D == "number" || D == "symbol" || D == "boolean" ? P !== "__proto__" : P === null;
  }
  function y$(P) {
    return !!kf && kf in P;
  }
  function g$(P) {
    var D = P && P.constructor, L = typeof D == "function" && D.prototype || kt;
    return P === L;
  }
  function _$(P) {
    return Ff.call(P);
  }
  function $n(P) {
    if (P != null) {
      try {
        return kr.call(P);
      } catch {
      }
      try {
        return P + "";
      } catch {
      }
    }
    return "";
  }
  function zf(P, D) {
    return P === D || P !== P && D !== D;
  }
  var v$ = Vf(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Vf : function(P) {
    return Yi(P) && vt.call(P, "callee") && !Mf.call(P, "callee");
  }, co = Array.isArray;
  function $$(P) {
    return P != null && Wf(P.length) && !Gf(P);
  }
  var wc = Av || S$;
  function w$(P, D) {
    return qf(P, D);
  }
  function Gf(P) {
    if (!Kf(P))
      return !1;
    var D = Ki(P);
    return D == p || D == $ || D == u || D == I;
  }
  function Wf(P) {
    return typeof P == "number" && P > -1 && P % 1 == 0 && P <= o;
  }
  function Kf(P) {
    var D = typeof P;
    return P != null && (D == "object" || D == "function");
  }
  function Yi(P) {
    return P != null && typeof P == "object";
  }
  var Yf = Ee ? Vt(Ee) : c$;
  function E$(P) {
    return $$(P) ? i$(P) : l$(P);
  }
  function b$() {
    return [];
  }
  function S$() {
    return !1;
  }
  e.exports = w$;
})(Aa, Aa.exports);
var UL = Aa.exports;
Object.defineProperty(eo, "__esModule", { value: !0 });
eo.DownloadedUpdateHelper = void 0;
eo.createTempUpdateFile = qL;
const ML = Vs, LL = hn, bm = UL, Tn = mn, bs = Ce;
class xL {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return bs.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return bm(this.versionInfo, r) && bm(this.fileInfo.info, n.info) && await (0, Tn.pathExists)(t) ? t : null;
    const s = await this.getValidCachedUpdateFile(n, i);
    return s === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = s, s);
  }
  async setDownloadedFile(t, r, n, i, s, o) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: s,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, o && await (0, Tn.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Tn.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, Tn.pathExists)(n))
      return null;
    let s;
    try {
      s = await (0, Tn.readJson)(n);
    } catch (u) {
      let l = "No cached update info available";
      return u.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${u.message})`), r.info(l), null;
    }
    if (!((s == null ? void 0 : s.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== s.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${s.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = bs.join(this.cacheDirForPendingUpdate, s.fileName);
    if (!await (0, Tn.pathExists)(a))
      return r.info("Cached update file doesn't exist"), null;
    const c = await VL(a);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = s, a);
  }
  getUpdateInfoFile() {
    return bs.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
eo.DownloadedUpdateHelper = xL;
function VL(e, t = "sha512", r = "base64", n) {
  return new Promise((i, s) => {
    const o = (0, ML.createHash)(t);
    o.on("error", s).setEncoding(r), (0, LL.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", s).on("end", () => {
      o.end(), i(o.read());
    }).pipe(o, { end: !1 });
  });
}
async function qL(e, t, r) {
  let n = 0, i = bs.join(t, e);
  for (let s = 0; s < 3; s++)
    try {
      return await (0, Tn.unlink)(i), i;
    } catch (o) {
      if (o.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${o}`), i = bs.join(t, `${n++}-${e}`);
    }
  return i;
}
var ac = {}, Of = {};
Object.defineProperty(Of, "__esModule", { value: !0 });
Of.getAppCacheDir = HL;
const cl = Ce, BL = Ia;
function HL() {
  const e = (0, BL.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || cl.join(e, "AppData", "Local") : process.platform === "darwin" ? t = cl.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || cl.join(e, ".cache"), t;
}
Object.defineProperty(ac, "__esModule", { value: !0 });
ac.ElectronAppAdapter = void 0;
const Sm = Ce, zL = Of;
class GL {
  constructor(t = Rr.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Sm.join(process.resourcesPath, "app-update.yml") : Sm.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, zL.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
ac.ElectronAppAdapter = GL;
var fv = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = xe;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return Rr.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(s) {
      super(), this.proxyLoginCallback = s, this.cachedSession = null;
    }
    async download(s, o, a) {
      return await a.cancellationToken.createPromise((c, u, l) => {
        const d = {
          headers: a.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(s, d), (0, t.configureRequestOptions)(d), this.doDownload(d, {
          destination: o,
          options: a,
          onCancel: l,
          callback: (h) => {
            h == null ? c(o) : u(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(s, o) {
      s.headers && s.headers.Host && (s.host = s.headers.Host, delete s.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const a = Rr.net.request({
        ...s,
        session: this.cachedSession
      });
      return a.on("response", o), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
    }
    addRedirectHandlers(s, o, a, c, u) {
      s.on("redirect", (l, d, h) => {
        s.abort(), c > this.maxRedirects ? a(this.createMaxRedirectError()) : u(t.HttpExecutor.prepareRedirectUrlOptions(h, o));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(fv);
var to = {}, ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.newBaseUrl = WL;
ir.newUrlFromBase = KL;
ir.getChannelFilename = YL;
const hv = pn;
function WL(e) {
  const t = new hv.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function KL(e, t, r = !1) {
  const n = new hv.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function YL(e) {
  return `${e}.yml`;
}
var je = {}, XL = "[object Symbol]", pv = /[\\^$.*+?()[\]{}|]/g, JL = RegExp(pv.source), QL = typeof ft == "object" && ft && ft.Object === Object && ft, ZL = typeof self == "object" && self && self.Object === Object && self, e2 = QL || ZL || Function("return this")(), t2 = Object.prototype, r2 = t2.toString, Pm = e2.Symbol, Tm = Pm ? Pm.prototype : void 0, Nm = Tm ? Tm.toString : void 0;
function n2(e) {
  if (typeof e == "string")
    return e;
  if (s2(e))
    return Nm ? Nm.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function i2(e) {
  return !!e && typeof e == "object";
}
function s2(e) {
  return typeof e == "symbol" || i2(e) && r2.call(e) == XL;
}
function o2(e) {
  return e == null ? "" : n2(e);
}
function a2(e) {
  return e = o2(e), e && JL.test(e) ? e.replace(pv, "\\$&") : e;
}
var mv = a2;
Object.defineProperty(je, "__esModule", { value: !0 });
je.Provider = void 0;
je.findFile = f2;
je.parseUpdateInfo = h2;
je.getFileList = yv;
je.resolveFiles = p2;
const dn = xe, c2 = Xe, l2 = pn, Ra = ir, u2 = mv;
class d2 {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const s = (0, Ra.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, Ra.newUrlFromBase)(`${t.pathname.replace(new RegExp(u2(n), "g"), r)}.blockmap`, i ? new l2.URL(i) : t), s];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, dn.configureRequestUrl)(t, n), n;
  }
}
je.Provider = d2;
function f2(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, dn.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((o) => o.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), s = (n = i.find((o) => [o.url.pathname, o.info.url].some((a) => a.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return s || (r == null ? e[0] : e.find((o) => !r.some((a) => o.url.pathname.toLowerCase().endsWith(`.${a.toLowerCase()}`))));
}
function h2(e, t, r) {
  if (e == null)
    throw (0, dn.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, c2.load)(e);
  } catch (i) {
    throw (0, dn.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function yv(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, dn.newError)(`No files provided: ${(0, dn.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function p2(e, t, r = (n) => n) {
  const i = yv(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, dn.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, dn.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Ra.newUrlFromBase)(r(a.url), t),
      info: a
    };
  }), s = e.packages, o = s == null ? null : s[process.arch] || s.ia32;
  return o != null && (i[0].packageInfo = {
    ...o,
    path: (0, Ra.newUrlFromBase)(r(o.path), t).href
  }), i;
}
Object.defineProperty(to, "__esModule", { value: !0 });
to.GenericProvider = void 0;
const Om = xe, ll = ir, ul = je;
class m2 extends ul.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, ll.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, ll.getChannelFilename)(this.channel), r = (0, ll.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, ul.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Om.HttpError && i.statusCode === 404)
          throw (0, Om.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((s, o) => {
            try {
              setTimeout(s, 1e3 * n);
            } catch (a) {
              o(a);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, ul.resolveFiles)(t, this.baseUrl);
  }
}
to.GenericProvider = m2;
var cc = {}, lc = {};
Object.defineProperty(lc, "__esModule", { value: !0 });
lc.BitbucketProvider = void 0;
const Am = xe, dl = ir, fl = je;
class y2 extends fl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: s } = t;
    this.baseUrl = (0, dl.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${s}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Am.CancellationToken(), r = (0, dl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, dl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, fl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Am.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, fl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
lc.BitbucketProvider = y2;
var fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
fn.GitHubProvider = fn.BaseGitHubProvider = void 0;
fn.computeReleaseNotes = _v;
const Pr = xe, mi = af, g2 = pn, yi = ir, eu = je, hl = /\/tag\/([^/]+)$/;
class gv extends eu.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, yi.newBaseUrl)((0, Pr.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, yi.newBaseUrl)((0, Pr.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
fn.BaseGitHubProvider = gv;
class _2 extends gv {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, s;
    const o = new Pr.CancellationToken(), a = await this.httpRequest((0, yi.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, o), c = (0, Pr.parseXml)(a);
    let u = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const v = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = mi.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (v === null)
          l = hl.exec(u.element("link").attribute("href"))[1];
        else
          for (const m of c.getElements("entry")) {
            const E = hl.exec(m.element("link").attribute("href"));
            if (E === null)
              continue;
            const A = E[1], I = ((n = mi.prerelease(A)) === null || n === void 0 ? void 0 : n[0]) || null, F = !v || ["alpha", "beta"].includes(v), z = I !== null && !["alpha", "beta"].includes(String(I));
            if (F && !z && !(v === "beta" && I === "alpha")) {
              l = A;
              break;
            }
            if (I && I === v) {
              l = A;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(o);
        for (const v of c.getElements("entry"))
          if (hl.exec(v.element("link").attribute("href"))[1] === l) {
            u = v;
            break;
          }
      }
    } catch (v) {
      throw (0, Pr.newError)(`Cannot parse releases feed: ${v.stack || v.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, Pr.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let d, h = "", p = "";
    const $ = async (v) => {
      h = (0, yi.getChannelFilename)(v), p = (0, yi.newUrlFromBase)(this.getBaseDownloadPath(String(l), h), this.baseUrl);
      const m = this.createRequestOptions(p);
      try {
        return await this.executor.request(m, o);
      } catch (E) {
        throw E instanceof Pr.HttpError && E.statusCode === 404 ? (0, Pr.newError)(`Cannot find ${h} in the latest release artifacts (${p}): ${E.stack || E.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : E;
      }
    };
    try {
      let v = this.channel;
      this.updater.allowPrerelease && (!((i = mi.prerelease(l)) === null || i === void 0) && i[0]) && (v = this.getCustomChannelName(String((s = mi.prerelease(l)) === null || s === void 0 ? void 0 : s[0]))), d = await $(v);
    } catch (v) {
      if (this.updater.allowPrerelease)
        d = await $(this.getDefaultChannelName());
      else
        throw v;
    }
    const _ = (0, eu.parseUpdateInfo)(d, h, p);
    return _.releaseName == null && (_.releaseName = u.elementValueOrEmpty("title")), _.releaseNotes == null && (_.releaseNotes = _v(this.updater.currentVersion, this.updater.fullChangelog, c, u)), {
      tag: l,
      ..._
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, yi.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new g2.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Pr.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, eu.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
fn.GitHubProvider = _2;
function Rm(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function _v(e, t, r, n) {
  if (!t)
    return Rm(n);
  const i = [];
  for (const s of r.getElements("entry")) {
    const o = /\/tag\/v?([^/]+)$/.exec(s.element("link").attribute("href"))[1];
    mi.lt(e, o) && i.push({
      version: o,
      note: Rm(s)
    });
  }
  return i.sort((s, o) => mi.rcompare(s.version, o.version));
}
var uc = {};
Object.defineProperty(uc, "__esModule", { value: !0 });
uc.GitLabProvider = void 0;
const at = xe, pl = pn, v2 = mv, Vo = ir, ml = je;
class $2 extends ml.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, r, n) {
    super({
      ...n,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = r, this.cachedLatestVersion = null;
    const s = t.host || "gitlab.com";
    this.baseApiUrl = (0, Vo.newBaseUrl)(`https://${s}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new at.CancellationToken(), r = (0, Vo.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let n;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, p = await this.httpRequest(r, h, t);
      if (!p)
        throw (0, at.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      n = JSON.parse(p);
    } catch (h) {
      throw (0, at.newError)(`Unable to find latest release on GitLab (${r}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = n.tag_name;
    let s = null, o = "", a = null;
    const c = async (h) => {
      o = (0, Vo.getChannelFilename)(h);
      const p = n.assets.links.find((_) => _.name === o);
      if (!p)
        throw (0, at.newError)(`Cannot find ${o} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      a = new pl.URL(p.direct_asset_url);
      const $ = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const _ = await this.httpRequest(a, $, t);
        if (!_)
          throw (0, at.newError)(`Empty response from ${a}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return _;
      } catch (_) {
        throw _ instanceof at.HttpError && _.statusCode === 404 ? (0, at.newError)(`Cannot find ${o} in the latest release artifacts (${a}): ${_.stack || _.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : _;
      }
    };
    try {
      s = await c(this.channel);
    } catch (h) {
      if (this.channel !== this.getDefaultChannelName())
        s = await c(this.getDefaultChannelName());
      else
        throw h;
    }
    if (!s)
      throw (0, at.newError)(`Unable to parse channel data from ${o}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const u = (0, ml.parseUpdateInfo)(s, o, a);
    u.releaseName == null && (u.releaseName = n.name), u.releaseNotes == null && (u.releaseNotes = n.description || null);
    const l = /* @__PURE__ */ new Map();
    for (const h of n.assets.links)
      l.set(this.normalizeFilename(h.name), h.direct_asset_url);
    const d = {
      tag: i,
      assets: l,
      ...u
    };
    return this.cachedLatestVersion = d, d;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const r = /* @__PURE__ */ new Map();
    for (const n of t.links)
      r.set(this.normalizeFilename(n.name), n.direct_asset_url);
    return r;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, r) {
    const n = [`${r}.blockmap`, `${this.normalizeFilename(r)}.blockmap`];
    for (const i of n) {
      const s = t.get(i);
      if (s)
        return new pl.URL(s);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new at.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const s = (0, Vo.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const o = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, a = await this.httpRequest(s, o, r);
        if (a)
          return JSON.parse(a);
      } catch (o) {
        if (o instanceof at.HttpError && o.statusCode === 404)
          continue;
        throw (0, at.newError)(`Unable to find release ${i} on GitLab (${s}): ${o.stack || o.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, at.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const r = {};
    return t != null && (t.startsWith("Bearer") ? r.authorization = t : r["PRIVATE-TOKEN"] = t), r;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const r = await this.fetchReleaseInfoByVersion(t);
    return r && r.assets ? this.convertAssetsToMap(r.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, r, n) {
    let i = null, s = null;
    const o = await this.getVersionInfoForBlockMap(r);
    o && (i = this.findBlockMapInAssets(o, n));
    const a = await this.getVersionInfoForBlockMap(t);
    if (a) {
      const c = n.replace(new RegExp(v2(r), "g"), t);
      s = this.findBlockMapInAssets(a, c);
    }
    return [s, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const s = t.pathname.split("/").pop() || "", [o, a] = await this.findBlockMapUrlsFromAssets(r, n, s);
      if (!a)
        throw (0, at.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!o)
        throw (0, at.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [o, a];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, ml.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((o) => t.assets.has(o)), s = i ? t.assets.get(i) : void 0;
      if (!s)
        throw (0, at.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new pl.URL(s),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
uc.GitLabProvider = $2;
var dc = {};
Object.defineProperty(dc, "__esModule", { value: !0 });
dc.KeygenProvider = void 0;
const Cm = xe, yl = ir, gl = je;
class w2 extends gl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, yl.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Cm.CancellationToken(), r = (0, yl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, yl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, gl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Cm.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, gl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
dc.KeygenProvider = w2;
var fc = {};
Object.defineProperty(fc, "__esModule", { value: !0 });
fc.PrivateGitHubProvider = void 0;
const ii = xe, E2 = Xe, b2 = Ce, Im = pn, Dm = ir, S2 = fn, P2 = je;
class T2 extends S2.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new ii.CancellationToken(), r = (0, Dm.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((a) => a.name === r);
    if (i == null)
      throw (0, ii.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const s = new Im.URL(i.url);
    let o;
    try {
      o = (0, E2.load)(await this.httpRequest(s, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof ii.HttpError && a.statusCode === 404 ? (0, ii.newError)(`Cannot find ${r} in the latest release artifacts (${s}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
    }
    return o.assets = n.assets, o;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, Dm.newUrlFromBase)(n, this.baseUrl);
    try {
      const s = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? s.find((o) => o.prerelease) || s[0] : s;
    } catch (s) {
      throw (0, ii.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${s.stack || s.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, P2.getFileList)(t).map((r) => {
      const n = b2.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((s) => s != null && s.name === n);
      if (i == null)
        throw (0, ii.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Im.URL(i.url),
        info: r
      };
    });
  }
}
fc.PrivateGitHubProvider = T2;
Object.defineProperty(cc, "__esModule", { value: !0 });
cc.isUrlProbablySupportMultiRangeRequests = vv;
cc.createClient = I2;
const qo = xe, N2 = lc, km = to, O2 = fn, A2 = uc, R2 = dc, C2 = fc;
function vv(e) {
  return !e.includes("s3.amazonaws.com");
}
function I2(e, t, r) {
  if (typeof e == "string")
    throw (0, qo.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, s = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return s == null ? new O2.GitHubProvider(i, t, r) : new C2.PrivateGitHubProvider(i, t, s, r);
    }
    case "bitbucket":
      return new N2.BitbucketProvider(e, t, r);
    case "gitlab":
      return new A2.GitLabProvider(e, t, r);
    case "keygen":
      return new R2.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new km.GenericProvider({
        provider: "generic",
        url: (0, qo.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new km.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && vv(i.url)
      });
    }
    case "custom": {
      const i = e, s = i.updateProvider;
      if (!s)
        throw (0, qo.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new s(i, t, r);
    }
    default:
      throw (0, qo.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var hc = {}, ro = {}, Hi = {}, Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.OperationKind = void 0;
Yn.computeOperations = D2;
var jn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(jn || (Yn.OperationKind = jn = {}));
function D2(e, t, r) {
  const n = jm(e.files), i = jm(t.files);
  let s = null;
  const o = t.files[0], a = [], c = o.name, u = n.get(c);
  if (u == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let d = 0;
  const { checksumToOffset: h, checksumToOldSize: p } = F2(n.get(c), u.offset, r);
  let $ = o.offset;
  for (let _ = 0; _ < l.checksums.length; $ += l.sizes[_], _++) {
    const v = l.sizes[_], m = l.checksums[_];
    let E = h.get(m);
    E != null && p.get(m) !== v && (r.warn(`Checksum ("${m}") matches, but size differs (old: ${p.get(m)}, new: ${v})`), E = void 0), E === void 0 ? (d++, s != null && s.kind === jn.DOWNLOAD && s.end === $ ? s.end += v : (s = {
      kind: jn.DOWNLOAD,
      start: $,
      end: $ + v
      // oldBlocks: null,
    }, Fm(s, a, m, _))) : s != null && s.kind === jn.COPY && s.end === E ? s.end += v : (s = {
      kind: jn.COPY,
      start: E,
      end: E + v
      // oldBlocks: [checksum]
    }, Fm(s, a, m, _));
  }
  return d > 0 && r.info(`File${o.name === "file" ? "" : " " + o.name} has ${d} changed blocks`), a;
}
const k2 = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Fm(e, t, r, n) {
  if (k2 && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const s = [i.start, i.end, e.start, e.end].reduce((o, a) => o < a ? o : a);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${jn[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - s} until ${i.end - s} and ${e.start - s} until ${e.end - s}`);
    }
  }
  t.push(e);
}
function F2(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let s = t;
  for (let o = 0; o < e.checksums.length; o++) {
    const a = e.checksums[o], c = e.sizes[o], u = i.get(a);
    if (u === void 0)
      n.set(a, s), i.set(a, c);
    else if (r.debug != null) {
      const l = u === c ? "(same size)" : `(size: ${u}, this size: ${c})`;
      r.debug(`${a} duplicated in blockmap ${l}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    s += c;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function jm(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.DataSplitter = void 0;
Hi.copyData = $v;
const Bo = xe, j2 = hn, U2 = xs, M2 = Yn, Um = Buffer.from(`\r
\r
`);
var Xr;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Xr || (Xr = {}));
function $v(e, t, r, n, i) {
  const s = (0, j2.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  s.on("error", n), s.once("end", i), s.pipe(t, {
    end: !1
  });
}
class L2 extends U2.Writable {
  constructor(t, r, n, i, s, o) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = s, this.finishHandler = o, this.partIndex = -1, this.headerListBuffer = null, this.readState = Xr.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(n).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Bo.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === Xr.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = Xr.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Xr.BODY)
          this.readState = Xr.INIT;
        else {
          this.partIndex++;
          let o = this.partIndexToTaskIndex.get(this.partIndex);
          if (o == null)
            if (this.isFinished)
              o = this.options.end;
            else
              throw (0, Bo.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < o)
            await this.copyExistingData(a, o);
          else if (a > o)
            throw (0, Bo.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = Xr.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, s = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, s), this.remainingPartDataCount = n - (s - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const s = () => {
        if (t === r) {
          n();
          return;
        }
        const o = this.options.tasks[t];
        if (o.kind !== M2.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        $v(o, this.out, this.options.oldFileFd, i, () => {
          t++, s();
        });
      };
      s();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(Um, r);
    if (n !== -1)
      return n + Um.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Bo.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((s, o) => {
      i.on("error", o), i.once("drain", () => {
        i.removeListener("error", o), s();
      });
    });
  }
}
Hi.DataSplitter = L2;
var pc = {};
Object.defineProperty(pc, "__esModule", { value: !0 });
pc.executeTasksUsingMultipleRangeRequests = x2;
pc.checkIsRangesSupported = ru;
const tu = xe, Mm = Hi, Lm = Yn;
function x2(e, t, r, n, i) {
  const s = (o) => {
    if (o >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const a = o + 1e3;
    V2(e, {
      tasks: t,
      start: o,
      end: Math.min(t.length, a),
      oldFileFd: n
    }, r, () => s(a), i);
  };
  return s;
}
function V2(e, t, r, n, i) {
  let s = "bytes=", o = 0;
  const a = /* @__PURE__ */ new Map(), c = [];
  for (let d = t.start; d < t.end; d++) {
    const h = t.tasks[d];
    h.kind === Lm.OperationKind.DOWNLOAD && (s += `${h.start}-${h.end - 1}, `, a.set(o, d), o++, c.push(h.end - h.start));
  }
  if (o <= 1) {
    const d = (h) => {
      if (h >= t.end) {
        n();
        return;
      }
      const p = t.tasks[h++];
      if (p.kind === Lm.OperationKind.COPY)
        (0, Mm.copyData)(p, r, t.oldFileFd, i, () => d(h));
      else {
        const $ = e.createRequestOptions();
        $.headers.Range = `bytes=${p.start}-${p.end - 1}`;
        const _ = e.httpExecutor.createRequest($, (v) => {
          v.on("error", i), ru(v, i) && (v.pipe(r, {
            end: !1
          }), v.once("end", () => d(h)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(_, i), _.end();
      }
    };
    d(t.start);
    return;
  }
  const u = e.createRequestOptions();
  u.headers.Range = s.substring(0, s.length - 2);
  const l = e.httpExecutor.createRequest(u, (d) => {
    if (!ru(d, i))
      return;
    const h = (0, tu.safeGetHeader)(d, "content-type"), p = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(h);
    if (p == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const $ = new Mm.DataSplitter(r, t, a, p[1] || p[2], c, n);
    $.on("error", i), d.pipe($), d.on("end", () => {
      setTimeout(() => {
        l.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(l, i), l.end();
}
function ru(e, t) {
  if (e.statusCode >= 400)
    return t((0, tu.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, tu.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var mc = {};
Object.defineProperty(mc, "__esModule", { value: !0 });
mc.ProgressDifferentialDownloadCallbackTransform = void 0;
const q2 = xs;
var gi;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(gi || (gi = {}));
class B2 extends q2.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = gi.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == gi.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = gi.COPY;
  }
  beginRangeDownload() {
    this.operationType = gi.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
mc.ProgressDifferentialDownloadCallbackTransform = B2;
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.DifferentialDownloader = void 0;
const ns = xe, _l = mn, H2 = hn, z2 = Hi, G2 = pn, Ho = Yn, xm = pc, W2 = mc;
class K2 {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, ns.configureRequestUrl)(this.options.newUrl, t), (0, ns.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Ho.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let s = 0, o = 0;
    for (const c of i) {
      const u = c.end - c.start;
      c.kind === Ho.OperationKind.DOWNLOAD ? s += u : o += u;
    }
    const a = this.blockAwareFileInfo.size;
    if (s + o + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${s}, copySize: ${o}, newSize: ${a}`);
    return n.info(`Full: ${Vm(a)}, To download: ${Vm(s)} (${Math.round(s / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, _l.close)(i.descriptor).catch((s) => {
      this.logger.error(`cannot close file "${i.path}": ${s}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((s) => {
      try {
        this.logger.error(`cannot close files: ${s}`);
      } catch (o) {
        try {
          console.error(o);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, _l.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, _l.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const s = (0, H2.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((o, a) => {
      const c = [];
      let u;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const m = [];
        let E = 0;
        for (const I of t)
          I.kind === Ho.OperationKind.DOWNLOAD && (m.push(I.end - I.start), E += I.end - I.start);
        const A = {
          expectedByteCounts: m,
          grandTotal: E
        };
        u = new W2.ProgressDifferentialDownloadCallbackTransform(A, this.options.cancellationToken, this.options.onProgress), c.push(u);
      }
      const l = new ns.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, c.push(l), s.on("finish", () => {
        s.close(() => {
          r.splice(1, 1);
          try {
            l.validate();
          } catch (m) {
            a(m);
            return;
          }
          o(void 0);
        });
      }), c.push(s);
      let d = null;
      for (const m of c)
        m.on("error", a), d == null ? d = m : d = d.pipe(m);
      const h = c[0];
      let p;
      if (this.options.isUseMultipleRangeRequest) {
        p = (0, xm.executeTasksUsingMultipleRangeRequests)(this, t, h, n, a), p(0);
        return;
      }
      let $ = 0, _ = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const v = this.createRequestOptions();
      v.redirect = "manual", p = (m) => {
        var E, A;
        if (m >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const I = t[m++];
        if (I.kind === Ho.OperationKind.COPY) {
          u && u.beginFileCopy(), (0, z2.copyData)(I, h, n, a, () => p(m));
          return;
        }
        const F = `bytes=${I.start}-${I.end - 1}`;
        v.headers.range = F, (A = (E = this.logger) === null || E === void 0 ? void 0 : E.debug) === null || A === void 0 || A.call(E, `download range: ${F}`), u && u.beginRangeDownload();
        const z = this.httpExecutor.createRequest(v, (G) => {
          G.on("error", a), G.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), G.statusCode >= 400 && a((0, ns.createHttpError)(G)), G.pipe(h, {
            end: !1
          }), G.once("end", () => {
            u && u.endRangeDownload(), ++$ === 100 ? ($ = 0, setTimeout(() => p(m), 1e3)) : p(m);
          });
        });
        z.on("redirect", (G, me, R) => {
          this.logger.info(`Redirect to ${Y2(R)}`), _ = R, (0, ns.configureRequestUrl)(new G2.URL(_), v), z.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(z, a), z.end();
      }, p(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let s = 0;
    if (await this.request(i, (o) => {
      o.copy(n, s), s += o.length;
    }), s !== n.length)
      throw new Error(`Received data length ${s} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const s = this.httpExecutor.createRequest(t, (o) => {
        (0, xm.checkIsRangesSupported)(o, i) && (o.on("error", i), o.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), o.on("data", r), o.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(s, i), s.end();
    });
  }
}
ro.DifferentialDownloader = K2;
function Vm(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Y2(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(hc, "__esModule", { value: !0 });
hc.GenericDifferentialDownloader = void 0;
const X2 = ro;
class J2 extends X2.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
hc.GenericDifferentialDownloader = J2;
var yn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = xe;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(s) {
      this.emitter = s;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(s) {
      n(this.emitter, "login", s);
    }
    progress(s) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, s);
    }
    updateDownloaded(s) {
      n(this.emitter, e.UPDATE_DOWNLOADED, s);
    }
    updateCancelled(s) {
      n(this.emitter, "update-cancelled", s);
    }
  }
  e.UpdaterSignal = r;
  function n(i, s, o) {
    i.on(s, o);
  }
})(yn);
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.NoOpLogger = cn.AppUpdater = void 0;
const ct = xe, Q2 = Vs, Z2 = Ia, ex = ly, zt = mn, tx = Xe, vl = oc, Gt = Ce, Nn = af, qm = eo, rx = ac, Bm = fv, nx = to, $l = cc, wl = dy, ix = hc, si = yn;
class Af extends ex.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, ct.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, ct.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, Bm.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new wv();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new vl.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new si.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (s) => this.checkIfUpdateSupported(s), this._isUserWithinRollout = (s) => this.isStagingMatch(s), this.clientPromise = null, this.stagingUserIdPromise = new vl.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new vl.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (s) => {
      this._logger.error(`Error: ${s.stack || s.message}`);
    }), r == null ? (this.app = new rx.ElectronAppAdapter(), this.httpExecutor = new Bm.ElectronHttpExecutor((s, o) => this.emit("login", s, o))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Nn.parse)(n);
    if (i == null)
      throw (0, ct.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = sx(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new nx.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, $l.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, $l.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = Af.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new Rr.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, o = ct.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${o}, user id: ${i}`), o < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Nn.parse)(t.version);
    if (r == null)
      throw (0, ct.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Nn.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const s = (0, Nn.gt)(r, n), o = (0, Nn.lt)(r, n);
    return s ? !0 : this.allowDowngrade && o;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, Z2.release)();
    if (r)
      try {
        if ((0, Nn.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, $l.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new ct.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, ct.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new ct.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, ct.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof ct.CancellationError))
        try {
          this.dispatchError(i);
        } catch (s) {
          this._logger.warn(`Cannot dispatch error event: ${s.stack || s}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(si.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, tx.load)(await (0, zt.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = Gt.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, zt.readFile)(t, "utf-8");
      if (ct.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = ct.UUID.v5((0, Q2.randomBytes)(4096), ct.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, zt.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = Gt.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new qm.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(si.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (E) => this.emit(si.DOWNLOAD_PROGRESS, E));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, s = i.version, o = r.packageInfo;
    function a() {
      const E = decodeURIComponent(t.fileInfo.url.pathname);
      return E.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Gt.basename(E) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), u = c.cacheDirForPendingUpdate;
    await (0, zt.mkdir)(u, { recursive: !0 });
    const l = a();
    let d = Gt.join(u, l);
    const h = o == null ? null : Gt.join(u, `package-${s}${Gt.extname(o.path) || ".7z"}`), p = async (E) => {
      await c.setDownloadedFile(d, h, i, r, l, E), await t.done({
        ...i,
        downloadedFile: d
      });
      const A = Gt.join(u, "current.blockmap");
      return await (0, zt.pathExists)(A) && await (0, zt.copyFile)(A, Gt.join(c.cacheDir, "current.blockmap")), h == null ? [d] : [d, h];
    }, $ = this._logger, _ = await c.validateDownloadedPath(d, i, r, $);
    if (_ != null)
      return d = _, await p(!1);
    const v = async () => (await c.clear().catch(() => {
    }), await (0, zt.unlink)(d).catch(() => {
    })), m = await (0, qm.createTempUpdateFile)(`temp-${l}`, u, $);
    try {
      await t.task(m, n, h, v), await (0, ct.retry)(() => (0, zt.rename)(m, d), {
        retries: 60,
        interval: 500,
        shouldRetry: (E) => E instanceof Error && /^EBUSY:/.test(E.message) ? !0 : ($.warn(`Cannot rename temp file to final file: ${E.message || E.stack}`), !1)
      });
    } catch (E) {
      throw await v(), E instanceof ct.CancellationError && ($.info("cancelled"), this.emit("update-cancelled", i)), E;
    }
    return $.info(`New version ${s} has been downloaded to ${d}`), await p(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, s) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const o = r.updateInfoAndProvider.provider, a = await o.getBlockMapFiles(t.url, this.app.version, r.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const c = async ($) => {
        const _ = await this.httpExecutor.downloadToBuffer($, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (_ == null || _.length === 0)
          throw new Error(`Blockmap "${$.href}" is empty`);
        try {
          return JSON.parse((0, wl.gunzipSync)(_).toString());
        } catch (v) {
          throw new Error(`Cannot parse blockmap "${$.href}", error: ${v}`);
        }
      }, u = {
        newUrl: t.url,
        oldFile: Gt.join(this.downloadedUpdateHelper.cacheDir, s),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: o.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(si.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = ($) => this.emit(si.DOWNLOAD_PROGRESS, $));
      const l = async ($, _) => {
        const v = Gt.join(_, "current.blockmap");
        await (0, zt.outputFile)(v, (0, wl.gzipSync)(JSON.stringify($)));
      }, d = async ($) => {
        const _ = Gt.join($, "current.blockmap");
        try {
          if (await (0, zt.pathExists)(_))
            return JSON.parse((0, wl.gunzipSync)(await (0, zt.readFile)(_)).toString());
        } catch (v) {
          this._logger.warn(`Cannot parse blockmap "${_}", error: ${v}`);
        }
        return null;
      }, h = await c(a[1]);
      await l(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let p = await d(this.downloadedUpdateHelper.cacheDir);
      return p == null && (p = await c(a[0])), await new ix.GenericDifferentialDownloader(t.info, this.httpExecutor, u).download(p, h), !1;
    } catch (o) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), this._testOnlyOptions != null)
        throw o;
      return !0;
    }
  }
}
cn.AppUpdater = Af;
function sx(e) {
  const t = (0, Nn.prerelease)(e);
  return t != null && t.length > 0;
}
class wv {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
cn.NoOpLogger = wv;
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.BaseUpdater = void 0;
const Hm = Ca, ox = cn;
class ax extends ox.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Rr.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, s = n == null ? null : n.downloadedFileInfo;
    if (i == null || s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: s.isAdminRightsRequired
      });
    } catch (o) {
      return this.dispatchError(o), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, Hm.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: s, status: o, stdout: a, stderr: c } = i;
    if (s != null)
      throw this._logger.error(c), s;
    if (o != null && o !== 0)
      throw this._logger.error(c), new Error(`Command ${t} exited with code ${o}`);
    return a.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((s, o) => {
      try {
        const a = { stdio: i, env: n, detached: !0 }, c = (0, Hm.spawn)(t, r, a);
        c.on("error", (u) => {
          o(u);
        }), c.unref(), c.pid !== void 0 && s(!0);
      } catch (a) {
        o(a);
      }
    });
  }
}
Kn.BaseUpdater = ax;
var ks = {}, no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
no.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const oi = mn, cx = ro, lx = dy;
class ux extends cx.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Ev(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await dx(this.options.oldFile), i);
  }
}
no.FileWithEmbeddedBlockMapDifferentialDownloader = ux;
function Ev(e) {
  return JSON.parse((0, lx.inflateRawSync)(e).toString());
}
async function dx(e) {
  const t = await (0, oi.open)(e, "r");
  try {
    const r = (await (0, oi.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, oi.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, oi.read)(t, i, 0, i.length, r - n.length - i.length), await (0, oi.close)(t), Ev(i);
  } catch (r) {
    throw await (0, oi.close)(t), r;
  }
}
Object.defineProperty(ks, "__esModule", { value: !0 });
ks.AppImageUpdater = void 0;
const zm = xe, Gm = Ca, fx = mn, hx = hn, is = Ce, px = Kn, mx = no, yx = je, Wm = yn;
class gx extends px.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, yx.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        const o = process.env.APPIMAGE;
        if (o == null)
          throw (0, zm.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, o, i, r, t)) && await this.httpExecutor.download(n.url, i, s), await (0, fx.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, s) {
    try {
      const o = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: s.requestHeaders,
        cancellationToken: s.cancellationToken
      };
      return this.listenerCount(Wm.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Wm.DOWNLOAD_PROGRESS, a)), await new mx.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, o).download(), !1;
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, zm.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, hx.unlinkSync)(r);
    let n;
    const i = is.basename(r), s = this.installerPath;
    if (s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    is.basename(s) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = is.join(is.dirname(r), is.basename(s)), (0, Gm.execFileSync)("mv", ["-f", s, n]), n !== r && this.emit("appimage-filename-updated", n);
    const o = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], o) : (o.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, Gm.execFileSync)(n, [], { env: o })), !0;
  }
}
ks.AppImageUpdater = gx;
var Fs = {}, zi = {};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.LinuxUpdater = void 0;
const _x = Kn;
class vx extends _x.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizies the installer path for using with command line tools.
   */
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: r } = this.app, n = `"${r} would like to update"`, i = this.sudoWithArgs(n);
    this._logger.info(`Running as non-root user, using sudo to install: ${i}`);
    let s = '"';
    return (/pkexec/i.test(i[0]) || i[0] === "sudo") && (s = ""), this.spawnSyncLog(i[0], [...i.length > 1 ? i.slice(1) : [], `${s}/bin/bash`, "-c", `'${t.join(" ")}'${s}`]);
  }
  sudoWithArgs(t) {
    const r = this.determineSudoCommand(), n = [r];
    return /kdesudo/i.test(r) ? (n.push("--comment", t), n.push("-c")) : /gksudo/i.test(r) ? n.push("--message", t) : /pkexec/i.test(r) && n.push("--disable-internal-agent"), n;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const r of t)
      if (this.hasCommand(r))
        return r;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var r;
    const n = (r = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || r === void 0 ? void 0 : r.trim();
    if (n)
      return n;
    for (const i of t)
      if (this.hasCommand(i))
        return i;
    return this._logger.warn(`No package manager found in the list: ${t.join(", ")}. Defaulting to the first one: ${t[0]}`), t[0];
  }
}
zi.LinuxUpdater = vx;
Object.defineProperty(Fs, "__esModule", { value: !0 });
Fs.DebUpdater = void 0;
const $x = je, Km = yn, wx = zi;
class Rf extends wx.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, $x.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Km.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Km.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const n = ["dpkg", "apt"], i = this.detectPackageManager(n);
    try {
      Rf.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (s) {
      return this.dispatchError(s), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    var s;
    if (t === "dpkg")
      try {
        n(["dpkg", "-i", r]);
      } catch (o) {
        i.warn((s = o.message) !== null && s !== void 0 ? s : o), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), n(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), n([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        r
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
Fs.DebUpdater = Rf;
var js = {};
Object.defineProperty(js, "__esModule", { value: !0 });
js.PacmanUpdater = void 0;
const Ym = yn, Ex = je, bx = zi;
class Cf extends bx.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Ex.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Ym.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Ym.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      Cf.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (n) {
      return this.dispatchError(n), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n) {
    var i;
    try {
      r(["pacman", "-U", "--noconfirm", t]);
    } catch (s) {
      n.warn((i = s.message) !== null && i !== void 0 ? i : s), n.warn("pacman installation failed, attempting to update package database and retry");
      try {
        r(["pacman", "-Sy", "--noconfirm"]), r(["pacman", "-U", "--noconfirm", t]);
      } catch (o) {
        throw n.error("Retry after pacman -Sy failed"), o;
      }
    }
  }
}
js.PacmanUpdater = Cf;
var Us = {};
Object.defineProperty(Us, "__esModule", { value: !0 });
Us.RpmUpdater = void 0;
const Xm = yn, Sx = je, Px = zi;
class If extends Px.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Sx.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Xm.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Xm.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      If.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (s) {
      return this.dispatchError(s), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    if (t === "zypper")
      return n(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", r]);
    if (t === "dnf")
      return n(["dnf", "install", "--nogpgcheck", "-y", r]);
    if (t === "yum")
      return n(["yum", "install", "--nogpgcheck", "-y", r]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), n(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", r]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
Us.RpmUpdater = If;
var Ms = {};
Object.defineProperty(Ms, "__esModule", { value: !0 });
Ms.MacUpdater = void 0;
const Jm = xe, El = mn, Tx = hn, Qm = Ce, Nx = R$, Ox = cn, Ax = je, Zm = Ca, ey = Vs;
class Rx extends Ox.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = Rr.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let s = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), s = (0, Zm.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${s})`);
    } catch (d) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${d}`);
    }
    let o = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Zm.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${h}`), o = o || h;
    } catch (d) {
      n.warn(`uname shell command to check for arm64 failed: ${d}`);
    }
    o = o || process.arch === "arm64" || s;
    const a = (d) => {
      var h;
      return d.url.pathname.includes("arm64") || ((h = d.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    o && r.some(a) ? r = r.filter((d) => o === a(d)) : r = r.filter((d) => !a(d));
    const c = (0, Ax.findFile)(r, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, Jm.newError)(`ZIP file not provided: ${(0, Jm.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const u = t.updateInfoAndProvider.provider, l = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (d, h) => {
        const p = Qm.join(this.downloadedUpdateHelper.cacheDir, l), $ = () => (0, El.pathExistsSync)(p) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let _ = !0;
        $() && (_ = await this.differentialDownloadInstaller(c, t, d, u, l)), _ && await this.httpExecutor.download(c.url, d, h);
      },
      done: async (d) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Qm.join(this.downloadedUpdateHelper.cacheDir, l);
            await (0, El.copyFile)(d.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(c, d);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, s = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, El.stat)(i)).size, o = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, Nx.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      o.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const c = (u) => {
      const l = u.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((u, l) => {
      const d = (0, ey.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${d}`, "ascii"), p = `/${(0, ey.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", ($, _) => {
        const v = $.url;
        if (o.info(`${v} requested`), v === "/") {
          if (!$.headers.authorization || $.headers.authorization.indexOf("Basic ") === -1) {
            _.statusCode = 401, _.statusMessage = "Invalid Authentication Credentials", _.end(), o.warn("No authenthication info");
            return;
          }
          const A = $.headers.authorization.split(" ")[1], I = Buffer.from(A, "base64").toString("ascii"), [F, z] = I.split(":");
          if (F !== "autoupdater" || z !== d) {
            _.statusCode = 401, _.statusMessage = "Invalid Authentication Credentials", _.end(), o.warn("Invalid authenthication credentials");
            return;
          }
          const G = Buffer.from(`{ "url": "${c(this.server)}${p}" }`);
          _.writeHead(200, { "Content-Type": "application/json", "Content-Length": G.length }), _.end(G);
          return;
        }
        if (!v.startsWith(p)) {
          o.warn(`${v} requested, but not supported`), _.writeHead(404), _.end();
          return;
        }
        o.info(`${p} requested by Squirrel.Mac, pipe ${i}`);
        let m = !1;
        _.on("finish", () => {
          m || (this.nativeUpdater.removeListener("error", l), u([]));
        });
        const E = (0, Tx.createReadStream)(i);
        E.on("error", (A) => {
          try {
            _.end();
          } catch (I) {
            o.warn(`cannot end response: ${I}`);
          }
          m = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${A}`));
        }), _.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": s
        }), E.pipe(_);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${a})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${c(this.server)}, ${a})`), this.nativeUpdater.setFeedURL({
          url: c(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", l), this.nativeUpdater.checkForUpdates()) : u([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
Ms.MacUpdater = Rx;
var Ls = {}, Df = {};
Object.defineProperty(Df, "__esModule", { value: !0 });
Df.verifySignature = Ix;
const ty = xe, bv = Ca, Cx = Ia, ry = Ce;
function Sv(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function Ix(e, t, r) {
  return new Promise((n, i) => {
    const s = t.replace(/'/g, "''");
    r.info(`Verifying signature ${s}`), (0, bv.execFile)(...Sv(`"Get-AuthenticodeSignature -LiteralPath '${s}' | ConvertTo-Json -Compress"`, 20 * 1e3), (o, a, c) => {
      var u;
      try {
        if (o != null || c) {
          bl(r, o, c, i), n(null);
          return;
        }
        const l = Dx(a);
        if (l.Status === 0) {
          try {
            const $ = ry.normalize(l.Path), _ = ry.normalize(t);
            if (r.info(`LiteralPath: ${$}. Update Path: ${_}`), $ !== _) {
              bl(r, new Error(`LiteralPath of ${$} is different than ${_}`), c, i), n(null);
              return;
            }
          } catch ($) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(u = $.message) !== null && u !== void 0 ? u : $.stack}`);
          }
          const h = (0, ty.parseDn)(l.SignerCertificate.Subject);
          let p = !1;
          for (const $ of e) {
            const _ = (0, ty.parseDn)($);
            if (_.size ? p = Array.from(_.keys()).every((m) => _.get(m) === h.get(m)) : $ === h.get("CN") && (r.warn(`Signature validated using only CN ${$}. Please add your full Distinguished Name (DN) to publisherNames configuration`), p = !0), p) {
              n(null);
              return;
            }
          }
        }
        const d = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (h, p) => h === "RawData" ? void 0 : p, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${d}`), n(d);
      } catch (l) {
        bl(r, l, null, i), n(null);
        return;
      }
    });
  });
}
function Dx(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function bl(e, t, r, n) {
  if (kx()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, bv.execFileSync)(...Sv("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function kx() {
  const e = Cx.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Ls, "__esModule", { value: !0 });
Ls.NsisUpdater = void 0;
const zo = xe, ny = Ce, Fx = Kn, jx = no, iy = yn, Ux = je, Mx = mn, Lx = Df, sy = pn;
class xx extends Fx.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, Lx.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Ux.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, s, o, a) => {
        const c = n.packageInfo, u = c != null && o != null;
        if (u && t.disableWebInstaller)
          throw (0, zo.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !u && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (u || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, zo.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, s);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await a(), (0, zo.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (u && await this.differentialDownloadWebPackage(t, c, o, r))
          try {
            await this.httpExecutor.download(new sy.URL(c.path), o, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (d) {
            try {
              await (0, Mx.unlink)(o);
            } catch {
            }
            throw d;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const s = () => {
      this.spawnLog(ny.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((o) => this.dispatchError(o));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), s(), !0) : (this.spawnLog(r, n).catch((o) => {
      const a = o.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${o.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? s() : a === "ENOENT" ? Rr.shell.openPath(r).catch((c) => this.dispatchError(c)) : this.dispatchError(o);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const s = {
        newUrl: new sy.URL(r.path),
        oldFile: ny.join(this.downloadedUpdateHelper.cacheDir, zo.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(iy.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(iy.DOWNLOAD_PROGRESS, o)), await new jx.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, s).download();
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "win32";
    }
    return !1;
  }
}
Ls.NsisUpdater = xx;
(function(e) {
  var t = ft && ft.__createBinding || (Object.create ? function(v, m, E, A) {
    A === void 0 && (A = E);
    var I = Object.getOwnPropertyDescriptor(m, E);
    (!I || ("get" in I ? !m.__esModule : I.writable || I.configurable)) && (I = { enumerable: !0, get: function() {
      return m[E];
    } }), Object.defineProperty(v, A, I);
  } : function(v, m, E, A) {
    A === void 0 && (A = E), v[A] = m[E];
  }), r = ft && ft.__exportStar || function(v, m) {
    for (var E in v) E !== "default" && !Object.prototype.hasOwnProperty.call(m, E) && t(m, v, E);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = mn, i = Ce;
  var s = Kn;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return s.BaseUpdater;
  } });
  var o = cn;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return o.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return o.NoOpLogger;
  } });
  var a = je;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var c = ks;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var u = Fs;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return u.DebUpdater;
  } });
  var l = js;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var d = Us;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return d.RpmUpdater;
  } });
  var h = Ms;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var p = Ls;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return p.NsisUpdater;
  } }), r(yn, e);
  let $;
  function _() {
    if (process.platform === "win32")
      $ = new Ls.NsisUpdater();
    else if (process.platform === "darwin")
      $ = new Ms.MacUpdater();
    else {
      $ = new ks.AppImageUpdater();
      try {
        const v = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(v))
          return $;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const m = (0, n.readFileSync)(v).toString().trim();
        switch (console.info("Found package-type:", m), m) {
          case "deb":
            $ = new Fs.DebUpdater();
            break;
          case "rpm":
            $ = new Us.RpmUpdater();
            break;
          case "pacman":
            $ = new js.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (v) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", v.message);
      }
    }
    return $;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => $ || _()
  });
})(xt);
ur.handle("open-external", async (e, t) => {
  console.log("[MAIN] Opening external URL:", t), await N$.openExternal(t);
});
ur.handle("set-overlay-mode", (e, t) => {
  console.log("[MAIN] set-overlay-mode IPC received, enabled:", t), Qa.toggleOverlayMode(t), console.log("[MAIN] toggleOverlayMode called successfully");
});
ur.handle("set-mini-mode", (e, t) => {
  console.log("[MAIN] set-mini-mode IPC received, enabled:", t), Qa.toggleMiniMode(t), console.log("[MAIN] toggleMiniMode called successfully");
});
ur.handle("set-mini-mode-height", (e, t) => {
  console.log("[MAIN] set-mini-mode-height IPC received, height:", t), Qa.setMiniModeHeight(t);
});
ur.handle("minimize-window", () => {
  Re && Re.minimize();
});
const nu = ue.dirname(O$(import.meta.url));
process.env.APP_ROOT = ue.join(nu, "..");
const iu = process.env.VITE_DEV_SERVER_URL, g3 = ue.join(process.env.APP_ROOT, "dist-electron"), Pv = ue.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = iu ? ue.join(process.env.APP_ROOT, "public") : Pv;
ck();
let Re;
function Tv() {
  console.log("[MAIN] Creating BrowserWindow..."), console.log("[MAIN] Preload path:", ue.join(nu, "index.mjs")), Re = new oy({
    icon: ue.join(process.env.VITE_PUBLIC, "icon.png"),
    width: 1200,
    height: 800,
    titleBarStyle: "hidden",
    // Hide title bar completely
    trafficLightPosition: { x: -100, y: -100 },
    // Move traffic lights off-screen
    transparent: !0,
    // Enable transparency for shaped windows
    backgroundColor: "#00000000",
    // Ensure background starts transparent
    webPreferences: {
      preload: ue.join(nu, "index.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !1
      // Required for preload scripts to work
    }
  }), console.log("[MAIN] BrowserWindow created, setting windowManager..."), Qa.setWindow(Re), Re.webContents.on("did-finish-load", () => {
    Re == null || Re.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), iu ? Re.loadURL(iu) : Re.loadFile(ue.join(Pv, "index.html"));
}
oa.on("window-all-closed", () => {
  process.platform !== "darwin" && (oa.quit(), Re = null);
});
oa.on("activate", () => {
  oy.getAllWindows().length === 0 && Tv();
});
xt.autoUpdater.logger = console;
xt.autoUpdater.autoDownload = !1;
xt.autoUpdater.autoDownload = !0;
oa.whenReady().then(() => {
  Tv();
  try {
    xt.autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    console.error("Failed to check for updates:", e);
  }
});
xt.autoUpdater.on("checking-for-update", () => {
  console.log("[Updater] Checking for update...");
});
xt.autoUpdater.on("update-available", (e) => {
  console.log("[Updater] Update available:", e), Re == null || Re.webContents.send("update-available", e);
});
xt.autoUpdater.on("update-not-available", () => {
  console.log("[Updater] Update not available.");
});
xt.autoUpdater.on("error", (e) => {
  console.error("[Updater] Error in auto-updater:", e), Re == null || Re.webContents.send("update-error", e.toString());
});
xt.autoUpdater.on("download-progress", (e) => {
  let t = "Download speed: " + e.bytesPerSecond;
  t = t + " - Downloaded " + e.percent + "%", t = t + " (" + e.transferred + "/" + e.total + ")", console.log("[Updater] " + t), Re == null || Re.webContents.send("update-download-progress", e);
});
xt.autoUpdater.on("update-downloaded", (e) => {
  console.log("[Updater] Update downloaded:", e), Re == null || Re.webContents.send("update-downloaded", e);
});
ur.handle("install-update", () => {
  console.log("[Updater] User requested install. Quitting and installing..."), xt.autoUpdater.quitAndInstall();
});
export {
  g3 as MAIN_DIST,
  Pv as RENDERER_DIST,
  iu as VITE_DEV_SERVER_URL
};
