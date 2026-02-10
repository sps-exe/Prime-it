var v$ = Object.defineProperty;
var Yf = (e) => {
  throw TypeError(e);
};
var $$ = (e, t, r) => t in e ? v$(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Mr = (e, t, r) => $$(e, typeof t != "symbol" ? t + "" : t, r), wc = (e, t, r) => t.has(e) || Yf("Cannot " + r);
var ie = (e, t, r) => (wc(e, t, "read from private field"), r ? r.call(e) : t.get(e)), ir = (e, t, r) => t.has(e) ? Yf("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ot = (e, t, r, n) => (wc(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), wr = (e, t, r) => (wc(e, t, "access private method"), r);
import Ar, { ipcMain as Sr, screen as Xf, shell as w$, app as oa, BrowserWindow as ey } from "electron";
import { fileURLToPath as E$ } from "node:url";
import ue from "node:path";
import Ne from "node:process";
import { promisify as Qe, isDeepStrictEqual as Jf } from "node:util";
import se from "node:fs";
import wn from "node:crypto";
import Qf from "node:assert";
import ty from "node:os";
import "node:events";
import "node:stream";
import fn from "fs";
import b$ from "constants";
import xs from "stream";
import ru from "util";
import ry from "assert";
import Re from "path";
import Ra from "child_process";
import ny from "events";
import Vs from "crypto";
import iy from "tty";
import Ca from "os";
import hn from "url";
import sy from "zlib";
import S$ from "http";
const xn = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, oy = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), ay = 1e6, P$ = (e) => e >= "0" && e <= "9";
function cy(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= ay;
  }
  return !1;
}
function Ec(e, t) {
  return oy.has(e) ? !1 : (e && cy(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function T$(e) {
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
        if (!Ec(r, t))
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
          if ((r || n === "property") && !Ec(r, t))
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
            !Number.isNaN(a) && Number.isFinite(a) && a >= 0 && a <= Number.MAX_SAFE_INTEGER && a <= ay && r === String(a) ? t.push(a) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${s}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !P$(o))
          throw new Error(`Invalid character '${o}' in an index at position ${s}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${s}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (i && (r += "\\"), n) {
    case "property": {
      if (!Ec(r, t))
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
function Ia(e) {
  if (typeof e == "string")
    return T$(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (oy.has(n))
        return [];
      typeof n == "string" && cy(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Zf(e, t, r) {
  if (!xn(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = Ia(t);
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
  if (!xn(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, i = Ia(t);
  if (i.length === 0)
    return e;
  for (let s = 0; s < i.length; s++) {
    const o = i[s];
    if (s === i.length - 1)
      e[o] = r;
    else if (!xn(e[o])) {
      const c = typeof i[s + 1] == "number";
      e[o] = c ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function N$(e, t) {
  if (!xn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Ia(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const i = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, i) ? (delete e[i], !0) : !1;
    if (e = e[i], !xn(e))
      return !1;
  }
}
function bc(e, t) {
  if (!xn(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = Ia(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!xn(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Xr = ty.homedir(), nu = ty.tmpdir(), { env: li } = Ne, O$ = (e) => {
  const t = ue.join(Xr, "Library");
  return {
    data: ue.join(t, "Application Support", e),
    config: ue.join(t, "Preferences", e),
    cache: ue.join(t, "Caches", e),
    log: ue.join(t, "Logs", e),
    temp: ue.join(nu, e)
  };
}, A$ = (e) => {
  const t = li.APPDATA || ue.join(Xr, "AppData", "Roaming"), r = li.LOCALAPPDATA || ue.join(Xr, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ue.join(r, e, "Data"),
    config: ue.join(t, e, "Config"),
    cache: ue.join(r, e, "Cache"),
    log: ue.join(r, e, "Log"),
    temp: ue.join(nu, e)
  };
}, R$ = (e) => {
  const t = ue.basename(Xr);
  return {
    data: ue.join(li.XDG_DATA_HOME || ue.join(Xr, ".local", "share"), e),
    config: ue.join(li.XDG_CONFIG_HOME || ue.join(Xr, ".config"), e),
    cache: ue.join(li.XDG_CACHE_HOME || ue.join(Xr, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ue.join(li.XDG_STATE_HOME || ue.join(Xr, ".local", "state"), e),
    temp: ue.join(nu, t, e)
  };
};
function C$(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), Ne.platform === "darwin" ? O$(e) : Ne.platform === "win32" ? A$(e) : R$(e);
}
const Lr = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    return e.apply(void 0, i).catch(r);
  };
}, Er = (e, t) => {
  const { onError: r } = t;
  return function(...i) {
    try {
      return e.apply(void 0, i);
    } catch (s) {
      return r(s);
    }
  };
}, I$ = 250, Ur = (e, t) => {
  const { isRetriable: r } = t;
  return function(i) {
    const { timeout: s } = i, o = i.interval ?? I$, a = Date.now() + s;
    return function c(...u) {
      return e.apply(void 0, u).catch((l) => {
        if (!r(l) || Date.now() >= a)
          throw l;
        const d = Math.round(o * Math.random());
        return d > 0 ? new Promise((p) => setTimeout(p, d)).then(() => c.apply(void 0, u)) : c.apply(void 0, u);
      });
    };
  };
}, xr = (e, t) => {
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
}, ui = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!ui.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !D$ && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!ui.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!ui.isNodeError(e))
      throw e;
    if (!ui.isChangeErrorOk(e))
      throw e;
  }
}, ho = {
  onError: ui.onChangeError
}, At = {
  onError: () => {
  }
}, D$ = Ne.getuid ? !Ne.getuid() : !1, Ze = {
  isRetriable: ui.isRetriableError
}, rt = {
  attempt: {
    /* ASYNC */
    chmod: Lr(Qe(se.chmod), ho),
    chown: Lr(Qe(se.chown), ho),
    close: Lr(Qe(se.close), At),
    fsync: Lr(Qe(se.fsync), At),
    mkdir: Lr(Qe(se.mkdir), At),
    realpath: Lr(Qe(se.realpath), At),
    stat: Lr(Qe(se.stat), At),
    unlink: Lr(Qe(se.unlink), At),
    /* SYNC */
    chmodSync: Er(se.chmodSync, ho),
    chownSync: Er(se.chownSync, ho),
    closeSync: Er(se.closeSync, At),
    existsSync: Er(se.existsSync, At),
    fsyncSync: Er(se.fsync, At),
    mkdirSync: Er(se.mkdirSync, At),
    realpathSync: Er(se.realpathSync, At),
    statSync: Er(se.statSync, At),
    unlinkSync: Er(se.unlinkSync, At)
  },
  retry: {
    /* ASYNC */
    close: Ur(Qe(se.close), Ze),
    fsync: Ur(Qe(se.fsync), Ze),
    open: Ur(Qe(se.open), Ze),
    readFile: Ur(Qe(se.readFile), Ze),
    rename: Ur(Qe(se.rename), Ze),
    stat: Ur(Qe(se.stat), Ze),
    write: Ur(Qe(se.write), Ze),
    writeFile: Ur(Qe(se.writeFile), Ze),
    /* SYNC */
    closeSync: xr(se.closeSync, Ze),
    fsyncSync: xr(se.fsyncSync, Ze),
    openSync: xr(se.openSync, Ze),
    readFileSync: xr(se.readFileSync, Ze),
    renameSync: xr(se.renameSync, Ze),
    statSync: xr(se.statSync, Ze),
    writeSync: xr(se.writeSync, Ze),
    writeFileSync: xr(se.writeFileSync, Ze)
  }
}, k$ = "utf8", eh = 438, F$ = 511, j$ = {}, M$ = Ne.geteuid ? Ne.geteuid() : -1, L$ = Ne.getegid ? Ne.getegid() : -1, U$ = 1e3, x$ = !!Ne.getuid;
Ne.getuid && Ne.getuid();
const th = 128, V$ = (e) => e instanceof Error && "code" in e, rh = (e) => typeof e == "string", Sc = (e) => e === void 0, q$ = Ne.platform === "linux", ly = Ne.platform === "win32", iu = ["SIGHUP", "SIGINT", "SIGTERM"];
ly || iu.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
q$ && iu.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
let B$ = class {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (ly && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? Ne.kill(Ne.pid, "SIGTERM") : Ne.kill(Ne.pid, t));
      }
    }, this.hook = () => {
      Ne.once("exit", () => this.exit());
      for (const t of iu)
        try {
          Ne.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
};
const H$ = new B$(), z$ = H$.register, nt = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), i = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${i}`;
  },
  get: (e, t, r = !0) => {
    const n = nt.truncate(t(e));
    return n in nt.store ? nt.get(e, t, r) : (nt.store[n] = r, [n, () => delete nt.store[n]]);
  },
  purge: (e) => {
    nt.store[e] && (delete nt.store[e], rt.attempt.unlink(e));
  },
  purgeSync: (e) => {
    nt.store[e] && (delete nt.store[e], rt.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in nt.store)
      nt.purgeSync(e);
  },
  truncate: (e) => {
    const t = ue.basename(e);
    if (t.length <= th)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - th;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
z$(nt.purgeSyncAll);
function uy(e, t, r = j$) {
  if (rh(r))
    return uy(e, t, { encoding: r });
  const i = { timeout: r.timeout ?? U$ };
  let s = null, o = null, a = null;
  try {
    const c = rt.attempt.realpathSync(e), u = !!c;
    e = c || e, [o, s] = nt.get(e, r.tmpCreate || nt.create, r.tmpPurge !== !1);
    const l = x$ && Sc(r.chown), d = Sc(r.mode);
    if (u && (l || d)) {
      const h = rt.attempt.statSync(e);
      h && (r = { ...r }, l && (r.chown = { uid: h.uid, gid: h.gid }), d && (r.mode = h.mode));
    }
    if (!u) {
      const h = ue.dirname(e);
      rt.attempt.mkdirSync(h, {
        mode: F$,
        recursive: !0
      });
    }
    a = rt.retry.openSync(i)(o, "w", r.mode || eh), r.tmpCreated && r.tmpCreated(o), rh(t) ? rt.retry.writeSync(i)(a, t, 0, r.encoding || k$) : Sc(t) || rt.retry.writeSync(i)(a, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? rt.retry.fsyncSync(i)(a) : rt.attempt.fsync(a)), rt.retry.closeSync(i)(a), a = null, r.chown && (r.chown.uid !== M$ || r.chown.gid !== L$) && rt.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== eh && rt.attempt.chmodSync(o, r.mode);
    try {
      rt.retry.renameSync(i)(o, e);
    } catch (h) {
      if (!V$(h) || h.code !== "ENAMETOOLONG")
        throw h;
      rt.retry.renameSync(i)(o, nt.truncate(e));
    }
    s(), o = null;
  } finally {
    a && rt.attempt.closeSync(a), o && nt.purge(o);
  }
}
var dt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function dy(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var $l = { exports: {} }, fy = {}, Qt = {}, Si = {}, qs = {}, oe = {}, bs = {};
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
})(bs);
var wl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = bs;
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
})(wl);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = bs, r = wl;
  var n = bs;
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
  var i = wl;
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
        y.optimizeNames(f, g) || (M(f, y.names), T.splice(w, 1));
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
  function M(S, f) {
    for (const g in f)
      S[g] = (S[g] || 0) - (f[g] || 0);
  }
  function B(S) {
    return typeof S == "boolean" || typeof S == "number" || S === null ? !S : (0, t._)`!${N(S)}`;
  }
  e.not = B;
  const L = b(e.operators.AND);
  function H(...S) {
    return S.reduce(L);
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
})(oe);
var W = {};
Object.defineProperty(W, "__esModule", { value: !0 });
W.checkStrictMode = W.getErrorPath = W.Type = W.useFunc = W.setEvaluated = W.evaluatedPropsToName = W.mergeEvaluated = W.eachItem = W.unescapeJsonPointer = W.escapeJsonPointer = W.escapeFragment = W.unescapeFragment = W.schemaRefOrVal = W.schemaHasRulesButRef = W.schemaHasRules = W.checkUnknownRules = W.alwaysValidSchema = W.toHash = void 0;
const ve = oe, G$ = bs;
function W$(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
W.toHash = W$;
function K$(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (hy(e, t), !py(t, e.self.RULES.all));
}
W.alwaysValidSchema = K$;
function hy(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in t)
    i[s] || gy(e, `unknown keyword: "${s}"`);
}
W.checkUnknownRules = hy;
function py(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
W.schemaHasRules = py;
function Y$(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
W.schemaHasRulesButRef = Y$;
function X$({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ve._)`${r}`;
  }
  return (0, ve._)`${e}${t}${(0, ve.getProperty)(n)}`;
}
W.schemaRefOrVal = X$;
function J$(e) {
  return my(decodeURIComponent(e));
}
W.unescapeFragment = J$;
function Q$(e) {
  return encodeURIComponent(su(e));
}
W.escapeFragment = Q$;
function su(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
W.escapeJsonPointer = su;
function my(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
W.unescapeJsonPointer = my;
function Z$(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
W.eachItem = Z$;
function nh({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, s, o, a) => {
    const c = o === void 0 ? s : o instanceof ve.Name ? (s instanceof ve.Name ? e(i, s, o) : t(i, s, o), o) : s instanceof ve.Name ? (t(i, o, s), s) : r(s, o);
    return a === ve.Name && !(c instanceof ve.Name) ? n(i, c) : c;
  };
}
W.mergeEvaluated = {
  props: nh({
    mergeNames: (e, t, r) => e.if((0, ve._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ve._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ve._)`${r} || {}`).code((0, ve._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ve._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ve._)`${r} || {}`), ou(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: yy
  }),
  items: nh({
    mergeNames: (e, t, r) => e.if((0, ve._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ve._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ve._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ve._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function yy(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ve._)`{}`);
  return t !== void 0 && ou(e, r, t), r;
}
W.evaluatedPropsToName = yy;
function ou(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ve._)`${t}${(0, ve.getProperty)(n)}`, !0));
}
W.setEvaluated = ou;
const ih = {};
function ew(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: ih[t.code] || (ih[t.code] = new G$._Code(t.code))
  });
}
W.useFunc = ew;
var El;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(El || (W.Type = El = {}));
function tw(e, t, r) {
  if (e instanceof ve.Name) {
    const n = t === El.Num;
    return r ? n ? (0, ve._)`"[" + ${e} + "]"` : (0, ve._)`"['" + ${e} + "']"` : n ? (0, ve._)`"/" + ${e}` : (0, ve._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ve.getProperty)(e).toString() : "/" + su(e);
}
W.getErrorPath = tw;
function gy(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
W.checkStrictMode = gy;
var Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
const et = oe, rw = {
  // validation function arguments
  data: new et.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new et.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new et.Name("instancePath"),
  parentData: new et.Name("parentData"),
  parentDataProperty: new et.Name("parentDataProperty"),
  rootData: new et.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new et.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new et.Name("vErrors"),
  // null or array of validation errors
  errors: new et.Name("errors"),
  // counter of validation errors
  this: new et.Name("this"),
  // "globals"
  self: new et.Name("self"),
  scope: new et.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new et.Name("json"),
  jsonPos: new et.Name("jsonPos"),
  jsonLen: new et.Name("jsonLen"),
  jsonPart: new et.Name("jsonPart")
};
Rt.default = rw;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = oe, r = W, n = Rt;
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
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.boolOrEmptySchema = Si.topBoolOrEmptySchema = void 0;
const nw = qs, iw = oe, sw = Rt, ow = {
  message: "boolean schema is false"
};
function aw(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? _y(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(sw.default.data) : (t.assign((0, iw._)`${n}.errors`, null), t.return(!0));
}
Si.topBoolOrEmptySchema = aw;
function cw(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), _y(e)) : r.var(t, !0);
}
Si.boolOrEmptySchema = cw;
function _y(e, t) {
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
  (0, nw.reportError)(i, ow, void 0, t);
}
var Me = {}, Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.getRules = Vn.isJSONType = void 0;
const lw = ["string", "number", "integer", "boolean", "null", "object", "array"], uw = new Set(lw);
function dw(e) {
  return typeof e == "string" && uw.has(e);
}
Vn.isJSONType = dw;
function fw() {
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
Vn.getRules = fw;
var Pr = {};
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.shouldUseRule = Pr.shouldUseGroup = Pr.schemaHasRulesForType = void 0;
function hw({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && vy(e, n);
}
Pr.schemaHasRulesForType = hw;
function vy(e, t) {
  return t.rules.some((r) => $y(e, r));
}
Pr.shouldUseGroup = vy;
function $y(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Pr.shouldUseRule = $y;
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.reportTypeError = Me.checkDataTypes = Me.checkDataType = Me.coerceAndCheckDataType = Me.getJSONTypes = Me.getSchemaTypes = Me.DataType = void 0;
const pw = Vn, mw = Pr, yw = qs, ce = oe, wy = W;
var gi;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(gi || (Me.DataType = gi = {}));
function gw(e) {
  const t = Ey(e.type);
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
Me.getSchemaTypes = gw;
function Ey(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(pw.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Me.getJSONTypes = Ey;
function _w(e, t) {
  const { gen: r, data: n, opts: i } = e, s = vw(t, i.coerceTypes), o = t.length > 0 && !(s.length === 0 && t.length === 1 && (0, mw.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const a = au(t, n, i.strictNumbers, gi.Wrong);
    r.if(a, () => {
      s.length ? $w(e, t, s) : cu(e);
    });
  }
  return o;
}
Me.coerceAndCheckDataType = _w;
const by = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function vw(e, t) {
  return t ? e.filter((r) => by.has(r) || t === "array" && r === "array") : [];
}
function $w(e, t, r) {
  const { gen: n, data: i, opts: s } = e, o = n.let("dataType", (0, ce._)`typeof ${i}`), a = n.let("coerced", (0, ce._)`undefined`);
  s.coerceTypes === "array" && n.if((0, ce._)`${o} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, ce._)`${i}[0]`).assign(o, (0, ce._)`typeof ${i}`).if(au(t, i, s.strictNumbers), () => n.assign(a, i))), n.if((0, ce._)`${a} !== undefined`);
  for (const u of r)
    (by.has(u) || u === "array" && s.coerceTypes === "array") && c(u);
  n.else(), cu(e), n.endIf(), n.if((0, ce._)`${a} !== undefined`, () => {
    n.assign(i, a), ww(e, a);
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
function ww({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ce._)`${t} !== undefined`, () => e.assign((0, ce._)`${t}[${r}]`, n));
}
function bl(e, t, r, n = gi.Correct) {
  const i = n === gi.Correct ? ce.operators.EQ : ce.operators.NEQ;
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
  return n === gi.Correct ? s : (0, ce.not)(s);
  function o(a = ce.nil) {
    return (0, ce.and)((0, ce._)`typeof ${t} == "number"`, a, r ? (0, ce._)`isFinite(${t})` : ce.nil);
  }
}
Me.checkDataType = bl;
function au(e, t, r, n) {
  if (e.length === 1)
    return bl(e[0], t, r, n);
  let i;
  const s = (0, wy.toHash)(e);
  if (s.array && s.object) {
    const o = (0, ce._)`typeof ${t} != "object"`;
    i = s.null ? o : (0, ce._)`!${t} || ${o}`, delete s.null, delete s.array, delete s.object;
  } else
    i = ce.nil;
  s.number && delete s.integer;
  for (const o in s)
    i = (0, ce.and)(i, bl(o, t, r, n));
  return i;
}
Me.checkDataTypes = au;
const Ew = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ce._)`{type: ${e}}` : (0, ce._)`{type: ${t}}`
};
function cu(e) {
  const t = bw(e);
  (0, yw.reportError)(t, Ew);
}
Me.reportTypeError = cu;
function bw(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, wy.schemaRefOrVal)(e, n, "type");
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
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
Da.assignDefaults = void 0;
const Xn = oe, Sw = W;
function Pw(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      sh(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, s) => sh(e, s, i.default));
}
Da.assignDefaults = Pw;
function sh(e, t, r) {
  const { gen: n, compositeRule: i, data: s, opts: o } = e;
  if (r === void 0)
    return;
  const a = (0, Xn._)`${s}${(0, Xn.getProperty)(t)}`;
  if (i) {
    (0, Sw.checkStrictMode)(e, `default is ignored for: ${a}`);
    return;
  }
  let c = (0, Xn._)`${a} === undefined`;
  o.useDefaults === "empty" && (c = (0, Xn._)`${c} || ${a} === null || ${a} === ""`), n.if(c, (0, Xn._)`${a} = ${(0, Xn.stringify)(r)}`);
}
var lr = {}, he = {};
Object.defineProperty(he, "__esModule", { value: !0 });
he.validateUnion = he.validateArray = he.usePattern = he.callValidateCode = he.schemaProperties = he.allSchemaProperties = he.noPropertyInData = he.propertyInData = he.isOwnProperty = he.hasPropFunc = he.reportMissingProp = he.checkMissingProp = he.checkReportMissingProp = void 0;
const Se = oe, lu = W, Vr = Rt, Tw = W;
function Nw(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(du(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Se._)`${t}` }, !0), e.error();
  });
}
he.checkReportMissingProp = Nw;
function Ow({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Se.or)(...n.map((s) => (0, Se.and)(du(e, t, s, r.ownProperties), (0, Se._)`${i} = ${s}`)));
}
he.checkMissingProp = Ow;
function Aw(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
he.reportMissingProp = Aw;
function Sy(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Se._)`Object.prototype.hasOwnProperty`
  });
}
he.hasPropFunc = Sy;
function uu(e, t, r) {
  return (0, Se._)`${Sy(e)}.call(${t}, ${r})`;
}
he.isOwnProperty = uu;
function Rw(e, t, r, n) {
  const i = (0, Se._)`${t}${(0, Se.getProperty)(r)} !== undefined`;
  return n ? (0, Se._)`${i} && ${uu(e, t, r)}` : i;
}
he.propertyInData = Rw;
function du(e, t, r, n) {
  const i = (0, Se._)`${t}${(0, Se.getProperty)(r)} === undefined`;
  return n ? (0, Se.or)(i, (0, Se.not)(uu(e, t, r))) : i;
}
he.noPropertyInData = du;
function Py(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
he.allSchemaProperties = Py;
function Cw(e, t) {
  return Py(t).filter((r) => !(0, lu.alwaysValidSchema)(e, t[r]));
}
he.schemaProperties = Cw;
function Iw({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: s }, it: o }, a, c, u) {
  const l = u ? (0, Se._)`${e}, ${t}, ${n}${i}` : t, d = [
    [Vr.default.instancePath, (0, Se.strConcat)(Vr.default.instancePath, s)],
    [Vr.default.parentData, o.parentData],
    [Vr.default.parentDataProperty, o.parentDataProperty],
    [Vr.default.rootData, Vr.default.rootData]
  ];
  o.opts.dynamicRef && d.push([Vr.default.dynamicAnchors, Vr.default.dynamicAnchors]);
  const h = (0, Se._)`${l}, ${r.object(...d)}`;
  return c !== Se.nil ? (0, Se._)`${a}.call(${c}, ${h})` : (0, Se._)`${a}(${h})`;
}
he.callValidateCode = Iw;
const Dw = (0, Se._)`new RegExp`;
function kw({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, s = i(r, n);
  return e.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Se._)`${i.code === "new RegExp" ? Dw : (0, Tw.useFunc)(e, i)}(${r}, ${n})`
  });
}
he.usePattern = kw;
function Fw(e) {
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
        dataPropType: lu.Type.Num
      }, s), t.if((0, Se.not)(s), a);
    });
  }
}
he.validateArray = Fw;
function jw(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, lu.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
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
he.validateUnion = jw;
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.validateKeywordUsage = lr.validSchemaType = lr.funcKeywordCode = lr.macroKeywordCode = void 0;
const ct = oe, Nn = Rt, Mw = he, Lw = qs;
function Uw(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: s, it: o } = e, a = t.macro.call(o.self, i, s, o), c = Ty(r, n, a);
  o.opts.validateSchema !== !1 && o.self.validateSchema(a, !0);
  const u = r.name("valid");
  e.subschema({
    schema: a,
    schemaPath: ct.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
lr.macroKeywordCode = Uw;
function xw(e, t) {
  var r;
  const { gen: n, keyword: i, schema: s, parentSchema: o, $data: a, it: c } = e;
  qw(c, t);
  const u = !a && t.compile ? t.compile.call(c.self, s, o, c) : t.validate, l = Ty(n, i, u), d = n.let("valid");
  e.block$data(d, h), e.ok((r = t.valid) !== null && r !== void 0 ? r : d);
  function h() {
    if (t.errors === !1)
      _(), t.modifying && oh(e), v(() => e.error());
    else {
      const m = t.async ? p() : $();
      t.modifying && oh(e), v(() => Vw(e, m));
    }
  }
  function p() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, ct._)`await `), (E) => n.assign(d, !1).if((0, ct._)`${E} instanceof ${c.ValidationError}`, () => n.assign(m, (0, ct._)`${E}.errors`), () => n.throw(E))), m;
  }
  function $() {
    const m = (0, ct._)`${l}.errors`;
    return n.assign(m, null), _(ct.nil), m;
  }
  function _(m = t.async ? (0, ct._)`await ` : ct.nil) {
    const E = c.opts.passContext ? Nn.default.this : Nn.default.self, A = !("compile" in t && !a || t.schema === !1);
    n.assign(d, (0, ct._)`${m}${(0, Mw.callValidateCode)(e, l, E, A)}`, t.modifying);
  }
  function v(m) {
    var E;
    n.if((0, ct.not)((E = t.valid) !== null && E !== void 0 ? E : d), m);
  }
}
lr.funcKeywordCode = xw;
function oh(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, ct._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Vw(e, t) {
  const { gen: r } = e;
  r.if((0, ct._)`Array.isArray(${t})`, () => {
    r.assign(Nn.default.vErrors, (0, ct._)`${Nn.default.vErrors} === null ? ${t} : ${Nn.default.vErrors}.concat(${t})`).assign(Nn.default.errors, (0, ct._)`${Nn.default.vErrors}.length`), (0, Lw.extendErrors)(e);
  }, () => e.error());
}
function qw({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Ty(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, ct.stringify)(r) });
}
function Bw(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
lr.validSchemaType = Bw;
function Hw({ schema: e, opts: t, self: r, errSchemaPath: n }, i, s) {
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
lr.validateKeywordUsage = Hw;
var nn = {};
Object.defineProperty(nn, "__esModule", { value: !0 });
nn.extendSubschemaMode = nn.extendSubschemaData = nn.getSubschema = void 0;
const ar = oe, Ny = W;
function zw(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: s, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const a = e.schema[t];
    return r === void 0 ? {
      schema: a,
      schemaPath: (0, ar._)`${e.schemaPath}${(0, ar.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: a[r],
      schemaPath: (0, ar._)`${e.schemaPath}${(0, ar.getProperty)(t)}${(0, ar.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Ny.escapeFragment)(r)}`
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
nn.getSubschema = zw;
function Gw(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: s, propertyName: o }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: a } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: d } = t, h = a.let("data", (0, ar._)`${t.data}${(0, ar.getProperty)(r)}`, !0);
    c(h), e.errorPath = (0, ar.str)`${u}${(0, Ny.getErrorPath)(r, n, d.jsPropertySyntax)}`, e.parentDataProperty = (0, ar._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const u = i instanceof ar.Name ? i : a.let("data", i, !0);
    c(u), o !== void 0 && (e.propertyName = o);
  }
  s && (e.dataTypes = s);
  function c(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
nn.extendSubschemaData = Gw;
function Ww(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: s }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), s !== void 0 && (e.allErrors = s), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
nn.extendSubschemaMode = Ww;
var Ge = {}, ka = function e(t, r) {
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
}, Oy = { exports: {} }, Zr = Oy.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  Go(t, n, i, e, "", e);
};
Zr.keywords = {
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
Zr.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Zr.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Zr.skipKeywords = {
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
        if (l in Zr.arrayKeywords)
          for (var h = 0; h < d.length; h++)
            Go(e, t, r, d[h], i + "/" + l + "/" + h, s, i, l, n, h);
      } else if (l in Zr.propsKeywords) {
        if (d && typeof d == "object")
          for (var p in d)
            Go(e, t, r, d[p], i + "/" + l + "/" + Kw(p), s, i, l, n, p);
      } else (l in Zr.keywords || e.allKeys && !(l in Zr.skipKeywords)) && Go(e, t, r, d, i + "/" + l, s, i, l, n);
    }
    r(n, i, s, o, a, c, u);
  }
}
function Kw(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Yw = Oy.exports;
Object.defineProperty(Ge, "__esModule", { value: !0 });
Ge.getSchemaRefs = Ge.resolveUrl = Ge.normalizeId = Ge._getFullPath = Ge.getFullPath = Ge.inlineRef = void 0;
const Xw = W, Jw = ka, Qw = Yw, Zw = /* @__PURE__ */ new Set([
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
function eE(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Sl(e) : t ? Ay(e) <= t : !1;
}
Ge.inlineRef = eE;
const tE = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Sl(e) {
  for (const t in e) {
    if (tE.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Sl) || typeof r == "object" && Sl(r))
      return !0;
  }
  return !1;
}
function Ay(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Zw.has(r) && (typeof e[r] == "object" && (0, Xw.eachItem)(e[r], (n) => t += Ay(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ry(e, t = "", r) {
  r !== !1 && (t = _i(t));
  const n = e.parse(t);
  return Cy(e, n);
}
Ge.getFullPath = Ry;
function Cy(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ge._getFullPath = Cy;
const rE = /#\/?$/;
function _i(e) {
  return e ? e.replace(rE, "") : "";
}
Ge.normalizeId = _i;
function nE(e, t, r) {
  return r = _i(r), e.resolve(t, r);
}
Ge.resolveUrl = nE;
const iE = /^[a-z_][-a-z0-9._]*$/i;
function sE(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = _i(e[r] || t), s = { "": i }, o = Ry(n, i, !1), a = {}, c = /* @__PURE__ */ new Set();
  return Qw(e, { allKeys: !0 }, (d, h, p, $) => {
    if ($ === void 0)
      return;
    const _ = o + h;
    let v = s[$];
    typeof d[r] == "string" && (v = m.call(this, d[r])), E.call(this, d.$anchor), E.call(this, d.$dynamicAnchor), s[h] = v;
    function m(A) {
      const I = this.opts.uriResolver.resolve;
      if (A = _i(v ? I(v, A) : A), c.has(A))
        throw l(A);
      c.add(A);
      let F = this.refs[A];
      return typeof F == "string" && (F = this.refs[F]), typeof F == "object" ? u(d, F.schema, A) : A !== _i(_) && (A[0] === "#" ? (u(d, a[A], A), a[A] = d) : this.refs[A] = _), A;
    }
    function E(A) {
      if (typeof A == "string") {
        if (!iE.test(A))
          throw new Error(`invalid anchor "${A}"`);
        m.call(this, `#${A}`);
      }
    }
  }), a;
  function u(d, h, p) {
    if (h !== void 0 && !Jw(d, h))
      throw l(p);
  }
  function l(d) {
    return new Error(`reference "${d}" resolves to more than one schema`);
  }
}
Ge.getSchemaRefs = sE;
Object.defineProperty(Qt, "__esModule", { value: !0 });
Qt.getData = Qt.KeywordCxt = Qt.validateFunctionCode = void 0;
const Iy = Si, ah = Me, fu = Pr, aa = Me, oE = Da, ls = lr, Pc = nn, Z = oe, re = Rt, aE = Ge, Tr = W, Yi = qs;
function cE(e) {
  if (Fy(e) && (jy(e), ky(e))) {
    dE(e);
    return;
  }
  Dy(e, () => (0, Iy.topBoolOrEmptySchema)(e));
}
Qt.validateFunctionCode = cE;
function Dy({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, s) {
  i.code.es5 ? e.func(t, (0, Z._)`${re.default.data}, ${re.default.valCxt}`, n.$async, () => {
    e.code((0, Z._)`"use strict"; ${ch(r, i)}`), uE(e, i), e.code(s);
  }) : e.func(t, (0, Z._)`${re.default.data}, ${lE(i)}`, n.$async, () => e.code(ch(r, i)).code(s));
}
function lE(e) {
  return (0, Z._)`{${re.default.instancePath}="", ${re.default.parentData}, ${re.default.parentDataProperty}, ${re.default.rootData}=${re.default.data}${e.dynamicRef ? (0, Z._)`, ${re.default.dynamicAnchors}={}` : Z.nil}}={}`;
}
function uE(e, t) {
  e.if(re.default.valCxt, () => {
    e.var(re.default.instancePath, (0, Z._)`${re.default.valCxt}.${re.default.instancePath}`), e.var(re.default.parentData, (0, Z._)`${re.default.valCxt}.${re.default.parentData}`), e.var(re.default.parentDataProperty, (0, Z._)`${re.default.valCxt}.${re.default.parentDataProperty}`), e.var(re.default.rootData, (0, Z._)`${re.default.valCxt}.${re.default.rootData}`), t.dynamicRef && e.var(re.default.dynamicAnchors, (0, Z._)`${re.default.valCxt}.${re.default.dynamicAnchors}`);
  }, () => {
    e.var(re.default.instancePath, (0, Z._)`""`), e.var(re.default.parentData, (0, Z._)`undefined`), e.var(re.default.parentDataProperty, (0, Z._)`undefined`), e.var(re.default.rootData, re.default.data), t.dynamicRef && e.var(re.default.dynamicAnchors, (0, Z._)`{}`);
  });
}
function dE(e) {
  const { schema: t, opts: r, gen: n } = e;
  Dy(e, () => {
    r.$comment && t.$comment && Ly(e), yE(e), n.let(re.default.vErrors, null), n.let(re.default.errors, 0), r.unevaluated && fE(e), My(e), vE(e);
  });
}
function fE(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, Z._)`${r}.evaluated`), t.if((0, Z._)`${e.evaluated}.dynamicProps`, () => t.assign((0, Z._)`${e.evaluated}.props`, (0, Z._)`undefined`)), t.if((0, Z._)`${e.evaluated}.dynamicItems`, () => t.assign((0, Z._)`${e.evaluated}.items`, (0, Z._)`undefined`));
}
function ch(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, Z._)`/*# sourceURL=${r} */` : Z.nil;
}
function hE(e, t) {
  if (Fy(e) && (jy(e), ky(e))) {
    pE(e, t);
    return;
  }
  (0, Iy.boolOrEmptySchema)(e, t);
}
function ky({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Fy(e) {
  return typeof e.schema != "boolean";
}
function pE(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && Ly(e), gE(e), _E(e);
  const s = n.const("_errs", re.default.errors);
  My(e, s), n.var(t, (0, Z._)`${s} === ${re.default.errors}`);
}
function jy(e) {
  (0, Tr.checkUnknownRules)(e), mE(e);
}
function My(e, t) {
  if (e.opts.jtd)
    return lh(e, [], !1, t);
  const r = (0, ah.getSchemaTypes)(e.schema), n = (0, ah.coerceAndCheckDataType)(e, r);
  lh(e, r, !n, t);
}
function mE(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Tr.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function yE(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Tr.checkStrictMode)(e, "default is ignored in the schema root");
}
function gE(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, aE.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function _E(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Ly({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const s = r.$comment;
  if (i.$comment === !0)
    e.code((0, Z._)`${re.default.self}.logger.log(${s})`);
  else if (typeof i.$comment == "function") {
    const o = (0, Z.str)`${n}/$comment`, a = e.scopeValue("root", { ref: t.root });
    e.code((0, Z._)`${re.default.self}.opts.$comment(${s}, ${o}, ${a}.schema)`);
  }
}
function vE(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: s } = e;
  r.$async ? t.if((0, Z._)`${re.default.errors} === 0`, () => t.return(re.default.data), () => t.throw((0, Z._)`new ${i}(${re.default.vErrors})`)) : (t.assign((0, Z._)`${n}.errors`, re.default.vErrors), s.unevaluated && $E(e), t.return((0, Z._)`${re.default.errors} === 0`));
}
function $E({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof Z.Name && e.assign((0, Z._)`${t}.props`, r), n instanceof Z.Name && e.assign((0, Z._)`${t}.items`, n);
}
function lh(e, t, r, n) {
  const { gen: i, schema: s, data: o, allErrors: a, opts: c, self: u } = e, { RULES: l } = u;
  if (s.$ref && (c.ignoreKeywordsWithRef || !(0, Tr.schemaHasRulesButRef)(s, l))) {
    i.block(() => Vy(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || wE(e, t), i.block(() => {
    for (const h of l.rules)
      d(h);
    d(l.post);
  });
  function d(h) {
    (0, fu.shouldUseGroup)(s, h) && (h.type ? (i.if((0, aa.checkDataType)(h.type, o, c.strictNumbers)), uh(e, h), t.length === 1 && t[0] === h.type && r && (i.else(), (0, aa.reportTypeError)(e)), i.endIf()) : uh(e, h), a || i.if((0, Z._)`${re.default.errors} === ${n || 0}`));
  }
}
function uh(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, oE.assignDefaults)(e, t.type), r.block(() => {
    for (const s of t.rules)
      (0, fu.shouldUseRule)(n, s) && Vy(e, s.keyword, s.definition, t.type);
  });
}
function wE(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (EE(e, t), e.opts.allowUnionTypes || bE(e, t), SE(e, e.dataTypes));
}
function EE(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Uy(e.dataTypes, r) || hu(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), TE(e, t);
  }
}
function bE(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && hu(e, "use allowUnionTypes to allow union type keyword");
}
function SE(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, fu.shouldUseRule)(e.schema, i)) {
      const { type: s } = i.definition;
      s.length && !s.some((o) => PE(t, o)) && hu(e, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function PE(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Uy(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function TE(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Uy(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function hu(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Tr.checkStrictMode)(e, t, e.opts.strictTypes);
}
let xy = class {
  constructor(t, r, n) {
    if ((0, ls.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Tr.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", qy(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, ls.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (t ? Yi.reportExtraError : Yi.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Yi.reportError)(this, this.def.$dataError || Yi.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Yi.resetErrorsCount)(this.gen, this.errsCount);
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
        return (0, Z._)`${(0, aa.checkDataTypes)(c, r, s.opts.strictNumbers, aa.DataType.Wrong)}`;
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
    const n = (0, Pc.getSubschema)(this.it, t);
    (0, Pc.extendSubschemaData)(n, this.it, t), (0, Pc.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return hE(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Tr.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Tr.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, Z.Name)), !0;
  }
};
Qt.KeywordCxt = xy;
function Vy(e, t, r, n) {
  const i = new xy(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, ls.funcKeywordCode)(i, r) : "macro" in r ? (0, ls.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, ls.funcKeywordCode)(i, r);
}
const NE = /^\/(?:[^~]|~0|~1)*$/, OE = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function qy(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, s;
  if (e === "")
    return re.default.rootData;
  if (e[0] === "/") {
    if (!NE.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, s = re.default.rootData;
  } else {
    const u = OE.exec(e);
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
    u && (s = (0, Z._)`${s}${(0, Z.getProperty)((0, Tr.unescapeJsonPointer)(u))}`, o = (0, Z._)`${o} && ${s}`);
  return o;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
Qt.getData = qy;
var Bs = {};
Object.defineProperty(Bs, "__esModule", { value: !0 });
class AE extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Bs.default = AE;
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
const Tc = Ge;
let RE = class extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Tc.resolveUrl)(t, r, n), this.missingSchema = (0, Tc.normalizeId)((0, Tc.getFullPath)(t, this.missingRef));
  }
};
Ii.default = RE;
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.resolveSchema = ut.getCompilingSchema = ut.resolveRef = ut.compileSchema = ut.SchemaEnv = void 0;
const Vt = oe, CE = Bs, En = Rt, Xt = Ge, dh = W, IE = Qt;
let Fa = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Xt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
ut.SchemaEnv = Fa;
function pu(e) {
  const t = By.call(this, e);
  if (t)
    return t;
  const r = (0, Xt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, o = new Vt.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let a;
  e.$async && (a = o.scopeValue("Error", {
    ref: CE.default,
    code: (0, Vt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: En.default.data,
    parentData: En.default.parentData,
    parentDataProperty: En.default.parentDataProperty,
    dataNames: [En.default.data],
    dataPathArr: [Vt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Vt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: a,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Vt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Vt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, IE.validateFunctionCode)(u), o.optimize(this.opts.code.optimize);
    const d = o.toString();
    l = `${o.scopeRefs(En.default.scope)}return ${d}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const p = new Function(`${En.default.self}`, `${En.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = e.schema, p.schemaEnv = e, e.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: d, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: $, items: _ } = u;
      p.evaluated = {
        props: $ instanceof Vt.Name ? void 0 : $,
        items: _ instanceof Vt.Name ? void 0 : _,
        dynamicProps: $ instanceof Vt.Name,
        dynamicItems: _ instanceof Vt.Name
      }, p.source && (p.source.evaluated = (0, Vt.stringify)(p.evaluated));
    }
    return e.validate = p, e;
  } catch (d) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), d;
  } finally {
    this._compilations.delete(e);
  }
}
ut.compileSchema = pu;
function DE(e, t, r) {
  var n;
  r = (0, Xt.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let s = jE.call(this, e, r);
  if (s === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: a } = this.opts;
    o && (s = new Fa({ schema: o, schemaId: a, root: e, baseId: t }));
  }
  if (s !== void 0)
    return e.refs[r] = kE.call(this, s);
}
ut.resolveRef = DE;
function kE(e) {
  return (0, Xt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : pu.call(this, e);
}
function By(e) {
  for (const t of this._compilations)
    if (FE(t, e))
      return t;
}
ut.getCompilingSchema = By;
function FE(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function jE(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ja.call(this, e, t);
}
function ja(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Xt._getFullPath)(this.opts.uriResolver, r);
  let i = (0, Xt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return Nc.call(this, r, e);
  const s = (0, Xt.normalizeId)(n), o = this.refs[s] || this.schemas[s];
  if (typeof o == "string") {
    const a = ja.call(this, e, o);
    return typeof (a == null ? void 0 : a.schema) != "object" ? void 0 : Nc.call(this, r, a);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || pu.call(this, o), s === (0, Xt.normalizeId)(t)) {
      const { schema: a } = o, { schemaId: c } = this.opts, u = a[c];
      return u && (i = (0, Xt.resolveUrl)(this.opts.uriResolver, i, u)), new Fa({ schema: a, schemaId: c, root: e, baseId: i });
    }
    return Nc.call(this, r, o);
  }
}
ut.resolveSchema = ja;
const ME = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Nc(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const a of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, dh.unescapeFragment)(a)];
    if (c === void 0)
      return;
    r = c;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !ME.has(a) && u && (t = (0, Xt.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let s;
  if (typeof r != "boolean" && r.$ref && !(0, dh.schemaHasRulesButRef)(r, this.RULES)) {
    const a = (0, Xt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    s = ja.call(this, n, a);
  }
  const { schemaId: o } = this.opts;
  if (s = s || new Fa({ schema: r, schemaId: o, root: n, baseId: t }), s.schema !== s.root.schema)
    return s;
}
const LE = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", UE = "Meta-schema for $data reference (JSON AnySchema extension proposal)", xE = "object", VE = [
  "$data"
], qE = {
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
}, BE = !1, HE = {
  $id: LE,
  description: UE,
  type: xE,
  required: VE,
  properties: qE,
  additionalProperties: BE
};
var mu = {}, Ma = { exports: {} };
const zE = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Hy = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function zy(e) {
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
const GE = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function fh(e) {
  return e.length = 0, !0;
}
function WE(e, t, r) {
  if (e.length) {
    const n = zy(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function KE(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], i = [];
  let s = !1, o = !1, a = WE;
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
        a = fh;
      } else {
        i.push(u);
        continue;
      }
  }
  return i.length && (a === fh ? r.zone = i.join("") : o ? n.push(i.join("")) : n.push(zy(i))), r.address = n.join(""), r;
}
function Gy(e) {
  if (YE(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = KE(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function YE(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function XE(e) {
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
function JE(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function QE(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!Hy(r)) {
      const n = Gy(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Wy = {
  nonSimpleDomain: GE,
  recomposeAuthority: QE,
  normalizeComponentEncoding: JE,
  removeDotSegments: XE,
  isIPv4: Hy,
  isUUID: zE,
  normalizeIPv6: Gy
};
const { isUUID: ZE } = Wy, eb = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Ky(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function Yy(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Xy(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function tb(e) {
  return e.secure = Ky(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function rb(e) {
  if ((e.port === (Ky(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function nb(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(eb);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const i = `${n}:${t.nid || e.nid}`, s = yu(i);
    e.path = void 0, s && (e = s.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function ib(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), i = `${r}:${t.nid || n}`, s = yu(i);
  s && (e = s.serialize(e, t));
  const o = e, a = e.nss;
  return o.path = `${n || t.nid}:${a}`, t.skipEscape = !0, o;
}
function sb(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !ZE(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function ob(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Jy = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Yy,
    serialize: Xy
  }
), ab = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Jy.domainHost,
    parse: Yy,
    serialize: Xy
  }
), Wo = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: tb,
    serialize: rb
  }
), cb = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Wo.domainHost,
    parse: Wo.parse,
    serialize: Wo.serialize
  }
), lb = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: nb,
    serialize: ib,
    skipNormalize: !0
  }
), ub = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: sb,
    serialize: ob,
    skipNormalize: !0
  }
), ca = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Jy,
    https: ab,
    ws: Wo,
    wss: cb,
    urn: lb,
    "urn:uuid": ub
  }
);
Object.setPrototypeOf(ca, null);
function yu(e) {
  return e && (ca[
    /** @type {SchemeName} */
    e
  ] || ca[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var db = {
  SCHEMES: ca,
  getSchemeHandler: yu
};
const { normalizeIPv6: fb, removeDotSegments: is, recomposeAuthority: hb, normalizeComponentEncoding: po, isIPv4: pb, nonSimpleDomain: mb } = Wy, { SCHEMES: yb, getSchemeHandler: Qy } = db;
function gb(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  ur(Rr(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  Rr(ur(e, t), t)), e;
}
function _b(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, i = Zy(Rr(e, n), Rr(t, n), n, !0);
  return n.skipEscape = !0, ur(i, n);
}
function Zy(e, t, r, n) {
  const i = {};
  return n || (e = Rr(ur(e, r), r), t = Rr(ur(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (i.scheme = t.scheme, i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = is(t.path || ""), i.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = is(t.path || ""), i.query = t.query) : (t.path ? (t.path[0] === "/" ? i.path = is(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? i.path = "/" + t.path : e.path ? i.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : i.path = t.path, i.path = is(i.path)), i.query = t.query) : (i.path = e.path, t.query !== void 0 ? i.query = t.query : i.query = e.query), i.userinfo = e.userinfo, i.host = e.host, i.port = e.port), i.scheme = e.scheme), i.fragment = t.fragment, i;
}
function vb(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = ur(po(Rr(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = ur(po(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = ur(po(Rr(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = ur(po(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function ur(e, t) {
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
  }, n = Object.assign({}, t), i = [], s = Qy(n.scheme || r.scheme);
  s && s.serialize && s.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && i.push(r.scheme, ":");
  const o = hb(r);
  if (o !== void 0 && (n.reference !== "suffix" && i.push("//"), i.push(o), r.path && r.path[0] !== "/" && i.push("/")), r.path !== void 0) {
    let a = r.path;
    !n.absolutePath && (!s || !s.absolutePath) && (a = is(a)), o === void 0 && a[0] === "/" && a[1] === "/" && (a = "/%2F" + a.slice(2)), i.push(a);
  }
  return r.query !== void 0 && i.push("?", r.query), r.fragment !== void 0 && i.push("#", r.fragment), i.join("");
}
const $b = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Rr(e, t) {
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
  const s = e.match($b);
  if (s) {
    if (n.scheme = s[1], n.userinfo = s[3], n.host = s[4], n.port = parseInt(s[5], 10), n.path = s[6] || "", n.query = s[7], n.fragment = s[8], isNaN(n.port) && (n.port = s[5]), n.host)
      if (pb(n.host) === !1) {
        const c = fb(n.host);
        n.host = c.host.toLowerCase(), i = c.isIPV6;
      } else
        i = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const o = Qy(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!o || !o.unicodeSupport) && n.host && (r.domainHost || o && o.domainHost) && i === !1 && mb(n.host))
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
const gu = {
  SCHEMES: yb,
  normalize: gb,
  resolve: _b,
  resolveComponent: Zy,
  equal: vb,
  serialize: ur,
  parse: Rr
};
Ma.exports = gu;
Ma.exports.default = gu;
Ma.exports.fastUri = gu;
var eg = Ma.exports;
Object.defineProperty(mu, "__esModule", { value: !0 });
const tg = eg;
tg.code = 'require("ajv/dist/runtime/uri").default';
mu.default = tg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Qt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = oe;
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
  const n = Bs, i = Ii, s = Vn, o = ut, a = oe, c = Ge, u = Me, l = W, d = HE, h = mu, p = (C, b) => new RegExp(C, b);
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
    var b, N, S, f, g, T, w, y, k, O, K, fe, ge, Ee, Te, Xe, _e, je, Ut, Ct, Pt, It, mr, yr, gr;
    const Tt = C.strict, Dt = (b = C.code) === null || b === void 0 ? void 0 : b.optimize, _r = Dt === !0 || Dt === void 0 ? 1 : Dt || 0, Dr = (S = (N = C.code) === null || N === void 0 ? void 0 : N.regExp) !== null && S !== void 0 ? S : p, _t = (f = C.uriResolver) !== null && f !== void 0 ? f : h.default;
    return {
      strictSchema: (T = (g = C.strictSchema) !== null && g !== void 0 ? g : Tt) !== null && T !== void 0 ? T : !0,
      strictNumbers: (y = (w = C.strictNumbers) !== null && w !== void 0 ? w : Tt) !== null && y !== void 0 ? y : !0,
      strictTypes: (O = (k = C.strictTypes) !== null && k !== void 0 ? k : Tt) !== null && O !== void 0 ? O : "log",
      strictTuples: (fe = (K = C.strictTuples) !== null && K !== void 0 ? K : Tt) !== null && fe !== void 0 ? fe : "log",
      strictRequired: (Ee = (ge = C.strictRequired) !== null && ge !== void 0 ? ge : Tt) !== null && Ee !== void 0 ? Ee : !1,
      code: C.code ? { ...C.code, optimize: _r, regExp: Dr } : { optimize: _r, regExp: Dr },
      loopRequired: (Te = C.loopRequired) !== null && Te !== void 0 ? Te : E,
      loopEnum: (Xe = C.loopEnum) !== null && Xe !== void 0 ? Xe : E,
      meta: (_e = C.meta) !== null && _e !== void 0 ? _e : !0,
      messages: (je = C.messages) !== null && je !== void 0 ? je : !0,
      inlineRefs: (Ut = C.inlineRefs) !== null && Ut !== void 0 ? Ut : !0,
      schemaId: (Ct = C.schemaId) !== null && Ct !== void 0 ? Ct : "$id",
      addUsedSchema: (Pt = C.addUsedSchema) !== null && Pt !== void 0 ? Pt : !0,
      validateSchema: (It = C.validateSchema) !== null && It !== void 0 ? It : !0,
      validateFormats: (mr = C.validateFormats) !== null && mr !== void 0 ? mr : !0,
      unicodeRegExp: (yr = C.unicodeRegExp) !== null && yr !== void 0 ? yr : !0,
      int32range: (gr = C.int32range) !== null && gr !== void 0 ? gr : !0,
      uriResolver: _t
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
        return (0, l.eachItem)(S, (g) => M.call(this, g)), this;
      L.call(this, N);
      const f = {
        ...N,
        type: (0, u.getJSONTypes)(N.type),
        schemaType: (0, u.getJSONTypes)(N.schemaType)
      };
      return (0, l.eachItem)(S, f.type.length === 0 ? (g) => M.call(this, g, f) : (g) => f.type.forEach((T) => M.call(this, g, f, T))), this;
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
  function M(C, b, N) {
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
  function L(C) {
    let { metaSchema: b } = C;
    b !== void 0 && (C.$data && this.opts.$data && (b = V(b)), C.validateSchema = this.compile(b, !0));
  }
  const H = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function V(C) {
    return { anyOf: [C, H] };
  }
})(fy);
var _u = {}, vu = {}, $u = {};
Object.defineProperty($u, "__esModule", { value: !0 });
const wb = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
$u.default = wb;
var Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.callRef = Cr.getValidate = void 0;
const Eb = Ii, hh = he, $t = oe, Jn = Rt, ph = ut, mo = W, bb = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: s, validateName: o, opts: a, self: c } = n, { root: u } = s;
    if ((r === "#" || r === "#/") && i === u.baseId)
      return d();
    const l = ph.resolveRef.call(c, u, i, r);
    if (l === void 0)
      throw new Eb.default(n.opts.uriResolver, i, r);
    if (l instanceof ph.SchemaEnv)
      return h(l);
    return p(l);
    function d() {
      if (s === u)
        return Ko(e, o, s, s.$async);
      const $ = t.scopeValue("root", { ref: u });
      return Ko(e, (0, $t._)`${$}.validate`, u, u.$async);
    }
    function h($) {
      const _ = rg(e, $);
      Ko(e, _, $, $.$async);
    }
    function p($) {
      const _ = t.scopeValue("schema", a.code.source === !0 ? { ref: $, code: (0, $t.stringify)($) } : { ref: $ }), v = t.name("valid"), m = e.subschema({
        schema: $,
        dataTypes: [],
        schemaPath: $t.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, v);
      e.mergeEvaluated(m), e.ok(v);
    }
  }
};
function rg(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, $t._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Cr.getValidate = rg;
function Ko(e, t, r, n) {
  const { gen: i, it: s } = e, { allErrors: o, schemaEnv: a, opts: c } = s, u = c.passContext ? Jn.default.this : $t.nil;
  n ? l() : d();
  function l() {
    if (!a.$async)
      throw new Error("async schema referenced by sync schema");
    const $ = i.let("valid");
    i.try(() => {
      i.code((0, $t._)`await ${(0, hh.callValidateCode)(e, t, u)}`), p(t), o || i.assign($, !0);
    }, (_) => {
      i.if((0, $t._)`!(${_} instanceof ${s.ValidationError})`, () => i.throw(_)), h(_), o || i.assign($, !1);
    }), e.ok($);
  }
  function d() {
    e.result((0, hh.callValidateCode)(e, t, u), () => p(t), () => h(t));
  }
  function h($) {
    const _ = (0, $t._)`${$}.errors`;
    i.assign(Jn.default.vErrors, (0, $t._)`${Jn.default.vErrors} === null ? ${_} : ${Jn.default.vErrors}.concat(${_})`), i.assign(Jn.default.errors, (0, $t._)`${Jn.default.vErrors}.length`);
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
        const m = i.var("props", (0, $t._)`${$}.evaluated.props`);
        s.props = mo.mergeEvaluated.props(i, m, s.props, $t.Name);
      }
    if (s.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (s.items = mo.mergeEvaluated.items(i, v.items, s.items));
      else {
        const m = i.var("items", (0, $t._)`${$}.evaluated.items`);
        s.items = mo.mergeEvaluated.items(i, m, s.items, $t.Name);
      }
  }
}
Cr.callRef = Ko;
Cr.default = bb;
Object.defineProperty(vu, "__esModule", { value: !0 });
const Sb = $u, Pb = Cr, Tb = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Sb.default,
  Pb.default
];
vu.default = Tb;
var wu = {}, Eu = {};
Object.defineProperty(Eu, "__esModule", { value: !0 });
const la = oe, qr = la.operators, ua = {
  maximum: { okStr: "<=", ok: qr.LTE, fail: qr.GT },
  minimum: { okStr: ">=", ok: qr.GTE, fail: qr.LT },
  exclusiveMaximum: { okStr: "<", ok: qr.LT, fail: qr.GTE },
  exclusiveMinimum: { okStr: ">", ok: qr.GT, fail: qr.LTE }
}, Nb = {
  message: ({ keyword: e, schemaCode: t }) => (0, la.str)`must be ${ua[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, la._)`{comparison: ${ua[e].okStr}, limit: ${t}}`
}, Ob = {
  keyword: Object.keys(ua),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Nb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, la._)`${r} ${ua[t].fail} ${n} || isNaN(${r})`);
  }
};
Eu.default = Ob;
var bu = {};
Object.defineProperty(bu, "__esModule", { value: !0 });
const us = oe, Ab = {
  message: ({ schemaCode: e }) => (0, us.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, us._)`{multipleOf: ${e}}`
}, Rb = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Ab,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, s = i.opts.multipleOfPrecision, o = t.let("res"), a = s ? (0, us._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${s}` : (0, us._)`${o} !== parseInt(${o})`;
    e.fail$data((0, us._)`(${n} === 0 || (${o} = ${r}/${n}, ${a}))`);
  }
};
bu.default = Rb;
var Su = {}, Pu = {};
Object.defineProperty(Pu, "__esModule", { value: !0 });
function ng(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Pu.default = ng;
ng.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Su, "__esModule", { value: !0 });
const On = oe, Cb = W, Ib = Pu, Db = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, On.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, On._)`{limit: ${e}}`
}, kb = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Db,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, s = t === "maxLength" ? On.operators.GT : On.operators.LT, o = i.opts.unicode === !1 ? (0, On._)`${r}.length` : (0, On._)`${(0, Cb.useFunc)(e.gen, Ib.default)}(${r})`;
    e.fail$data((0, On._)`${o} ${s} ${n}`);
  }
};
Su.default = kb;
var Tu = {};
Object.defineProperty(Tu, "__esModule", { value: !0 });
const Fb = he, da = oe, jb = {
  message: ({ schemaCode: e }) => (0, da.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, da._)`{pattern: ${e}}`
}, Mb = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: jb,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: i, it: s } = e, o = s.opts.unicodeRegExp ? "u" : "", a = r ? (0, da._)`(new RegExp(${i}, ${o}))` : (0, Fb.usePattern)(e, n);
    e.fail$data((0, da._)`!${a}.test(${t})`);
  }
};
Tu.default = Mb;
var Nu = {};
Object.defineProperty(Nu, "__esModule", { value: !0 });
const ds = oe, Lb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, ds.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, ds._)`{limit: ${e}}`
}, Ub = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Lb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? ds.operators.GT : ds.operators.LT;
    e.fail$data((0, ds._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
Nu.default = Ub;
var Ou = {};
Object.defineProperty(Ou, "__esModule", { value: !0 });
const Xi = he, fs = oe, xb = W, Vb = {
  message: ({ params: { missingProperty: e } }) => (0, fs.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, fs._)`{missingProperty: ${e}}`
}, qb = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Vb,
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
          (0, xb.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function u() {
      if (c || s)
        e.block$data(fs.nil, d);
      else
        for (const p of r)
          (0, Xi.checkReportMissingProp)(e, p);
    }
    function l() {
      const p = t.let("missing");
      if (c || s) {
        const $ = t.let("valid", !0);
        e.block$data($, () => h(p, $)), e.ok($);
      } else
        t.if((0, Xi.checkMissingProp)(e, r, p)), (0, Xi.reportMissingProp)(e, p), t.else();
    }
    function d() {
      t.forOf("prop", n, (p) => {
        e.setParams({ missingProperty: p }), t.if((0, Xi.noPropertyInData)(t, i, p, a.ownProperties), () => e.error());
      });
    }
    function h(p, $) {
      e.setParams({ missingProperty: p }), t.forOf(p, n, () => {
        t.assign($, (0, Xi.propertyInData)(t, i, p, a.ownProperties)), t.if((0, fs.not)($), () => {
          e.error(), t.break();
        });
      }, fs.nil);
    }
  }
};
Ou.default = qb;
var Au = {};
Object.defineProperty(Au, "__esModule", { value: !0 });
const hs = oe, Bb = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, hs.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, hs._)`{limit: ${e}}`
}, Hb = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Bb,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? hs.operators.GT : hs.operators.LT;
    e.fail$data((0, hs._)`${r}.length ${i} ${n}`);
  }
};
Au.default = Hb;
var Ru = {}, Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
const ig = ka;
ig.code = 'require("ajv/dist/runtime/equal").default';
Hs.default = ig;
Object.defineProperty(Ru, "__esModule", { value: !0 });
const Oc = Me, He = oe, zb = W, Gb = Hs, Wb = {
  message: ({ params: { i: e, j: t } }) => (0, He.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, He._)`{i: ${e}, j: ${t}}`
}, Kb = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Wb,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: s, schemaCode: o, it: a } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), u = s.items ? (0, Oc.getSchemaTypes)(s.items) : [];
    e.block$data(c, l, (0, He._)`${o} === false`), e.ok(c);
    function l() {
      const $ = t.let("i", (0, He._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: $, j: _ }), t.assign(c, !0), t.if((0, He._)`${$} > 1`, () => (d() ? h : p)($, _));
    }
    function d() {
      return u.length > 0 && !u.some(($) => $ === "object" || $ === "array");
    }
    function h($, _) {
      const v = t.name("item"), m = (0, Oc.checkDataTypes)(u, v, a.opts.strictNumbers, Oc.DataType.Wrong), E = t.const("indices", (0, He._)`{}`);
      t.for((0, He._)`;${$}--;`, () => {
        t.let(v, (0, He._)`${r}[${$}]`), t.if(m, (0, He._)`continue`), u.length > 1 && t.if((0, He._)`typeof ${v} == "string"`, (0, He._)`${v} += "_"`), t.if((0, He._)`typeof ${E}[${v}] == "number"`, () => {
          t.assign(_, (0, He._)`${E}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, He._)`${E}[${v}] = ${$}`);
      });
    }
    function p($, _) {
      const v = (0, zb.useFunc)(t, Gb.default), m = t.name("outer");
      t.label(m).for((0, He._)`;${$}--;`, () => t.for((0, He._)`${_} = ${$}; ${_}--;`, () => t.if((0, He._)`${v}(${r}[${$}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Ru.default = Kb;
var Cu = {};
Object.defineProperty(Cu, "__esModule", { value: !0 });
const Pl = oe, Yb = W, Xb = Hs, Jb = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, Pl._)`{allowedValue: ${e}}`
}, Qb = {
  keyword: "const",
  $data: !0,
  error: Jb,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: s } = e;
    n || s && typeof s == "object" ? e.fail$data((0, Pl._)`!${(0, Yb.useFunc)(t, Xb.default)}(${r}, ${i})`) : e.fail((0, Pl._)`${s} !== ${r}`);
  }
};
Cu.default = Qb;
var Iu = {};
Object.defineProperty(Iu, "__esModule", { value: !0 });
const ss = oe, Zb = W, eS = Hs, tS = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, ss._)`{allowedValues: ${e}}`
}, rS = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: tS,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: o } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const a = i.length >= o.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, Zb.useFunc)(t, eS.default));
    let l;
    if (a || n)
      l = t.let("valid"), e.block$data(l, d);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const p = t.const("vSchema", s);
      l = (0, ss.or)(...i.map(($, _) => h(p, _)));
    }
    e.pass(l);
    function d() {
      t.assign(l, !1), t.forOf("v", s, (p) => t.if((0, ss._)`${u()}(${r}, ${p})`, () => t.assign(l, !0).break()));
    }
    function h(p, $) {
      const _ = i[$];
      return typeof _ == "object" && _ !== null ? (0, ss._)`${u()}(${r}, ${p}[${$}])` : (0, ss._)`${r} === ${_}`;
    }
  }
};
Iu.default = rS;
Object.defineProperty(wu, "__esModule", { value: !0 });
const nS = Eu, iS = bu, sS = Su, oS = Tu, aS = Nu, cS = Ou, lS = Au, uS = Ru, dS = Cu, fS = Iu, hS = [
  // number
  nS.default,
  iS.default,
  // string
  sS.default,
  oS.default,
  // object
  aS.default,
  cS.default,
  // array
  lS.default,
  uS.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  dS.default,
  fS.default
];
wu.default = hS;
var Du = {}, Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.validateAdditionalItems = void 0;
const An = oe, Tl = W, pS = {
  message: ({ params: { len: e } }) => (0, An.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, An._)`{limit: ${e}}`
}, mS = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: pS,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Tl.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    sg(e, n);
  }
};
function sg(e, t) {
  const { gen: r, schema: n, data: i, keyword: s, it: o } = e;
  o.items = !0;
  const a = r.const("len", (0, An._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, An._)`${a} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Tl.alwaysValidSchema)(o, n)) {
    const u = r.var("valid", (0, An._)`${a} <= ${t.length}`);
    r.if((0, An.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    r.forRange("i", t.length, a, (l) => {
      e.subschema({ keyword: s, dataProp: l, dataPropType: Tl.Type.Num }, u), o.allErrors || r.if((0, An.not)(u), () => r.break());
    });
  }
}
Di.validateAdditionalItems = sg;
Di.default = mS;
var ku = {}, ki = {};
Object.defineProperty(ki, "__esModule", { value: !0 });
ki.validateTuple = void 0;
const mh = oe, Yo = W, yS = he, gS = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return og(e, "additionalItems", t);
    r.items = !0, !(0, Yo.alwaysValidSchema)(r, t) && e.ok((0, yS.validateArray)(e));
  }
};
function og(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: o, it: a } = e;
  l(i), a.opts.unevaluated && r.length && a.items !== !0 && (a.items = Yo.mergeEvaluated.items(n, r.length, a.items));
  const c = n.name("valid"), u = n.const("len", (0, mh._)`${s}.length`);
  r.forEach((d, h) => {
    (0, Yo.alwaysValidSchema)(a, d) || (n.if((0, mh._)`${u} > ${h}`, () => e.subschema({
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
ki.validateTuple = og;
ki.default = gS;
Object.defineProperty(ku, "__esModule", { value: !0 });
const _S = ki, vS = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, _S.validateTuple)(e, "items")
};
ku.default = vS;
var Fu = {};
Object.defineProperty(Fu, "__esModule", { value: !0 });
const yh = oe, $S = W, wS = he, ES = Di, bS = {
  message: ({ params: { len: e } }) => (0, yh.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, yh._)`{limit: ${e}}`
}, SS = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: bS,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, $S.alwaysValidSchema)(n, t) && (i ? (0, ES.validateAdditionalItems)(e, i) : e.ok((0, wS.validateArray)(e)));
  }
};
Fu.default = SS;
var ju = {};
Object.defineProperty(ju, "__esModule", { value: !0 });
const Mt = oe, yo = W, PS = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Mt.str)`must contain at least ${e} valid item(s)` : (0, Mt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Mt._)`{minContains: ${e}}` : (0, Mt._)`{minContains: ${e}, maxContains: ${t}}`
}, TS = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: PS,
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
ju.default = TS;
var La = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = oe, r = W, n = he;
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
var Mu = {};
Object.defineProperty(Mu, "__esModule", { value: !0 });
const ag = oe, NS = W, OS = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, ag._)`{propertyName: ${e.propertyName}}`
}, AS = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: OS,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, NS.alwaysValidSchema)(i, r))
      return;
    const s = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, s), t.if((0, ag.not)(s), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(s);
  }
};
Mu.default = AS;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const go = he, zt = oe, RS = Rt, _o = W, CS = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, zt._)`{additionalProperty: ${e.additionalProperty}}`
}, IS = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: CS,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, _o.alwaysValidSchema)(o, r))
      return;
    const u = (0, go.allSchemaProperties)(n.properties), l = (0, go.allSchemaProperties)(n.patternProperties);
    d(), e.ok((0, zt._)`${s} === ${RS.default.errors}`);
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
      } else u.length ? m = (0, zt.or)(...u.map((E) => (0, zt._)`${v} === ${E}`)) : m = zt.nil;
      return l.length && (m = (0, zt.or)(m, ...l.map((E) => (0, zt._)`${(0, go.usePattern)(e, E)}.test(${v})`))), (0, zt.not)(m);
    }
    function p(v) {
      t.code((0, zt._)`delete ${i}[${v}]`);
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
        c.removeAdditional === "failing" ? (_(v, m, !1), t.if((0, zt.not)(m), () => {
          e.reset(), p(v);
        })) : (_(v, m), a || t.if((0, zt.not)(m), () => t.break()));
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
Ua.default = IS;
var Lu = {};
Object.defineProperty(Lu, "__esModule", { value: !0 });
const DS = Qt, gh = he, Ac = W, _h = Ua, kS = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && _h.default.code(new DS.KeywordCxt(s, _h.default, "additionalProperties"));
    const o = (0, gh.allSchemaProperties)(r);
    for (const d of o)
      s.definedProperties.add(d);
    s.opts.unevaluated && o.length && s.props !== !0 && (s.props = Ac.mergeEvaluated.props(t, (0, Ac.toHash)(o), s.props));
    const a = o.filter((d) => !(0, Ac.alwaysValidSchema)(s, r[d]));
    if (a.length === 0)
      return;
    const c = t.name("valid");
    for (const d of a)
      u(d) ? l(d) : (t.if((0, gh.propertyInData)(t, i, d, s.opts.ownProperties)), l(d), s.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(d), e.ok(c);
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
Lu.default = kS;
var Uu = {};
Object.defineProperty(Uu, "__esModule", { value: !0 });
const vh = he, vo = oe, $h = W, wh = W, FS = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: s } = e, { opts: o } = s, a = (0, vh.allSchemaProperties)(r), c = a.filter((_) => (0, $h.alwaysValidSchema)(s, r[_]));
    if (a.length === 0 || c.length === a.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const u = o.strictSchema && !o.allowMatchingProperties && i.properties, l = t.name("valid");
    s.props !== !0 && !(s.props instanceof vo.Name) && (s.props = (0, wh.evaluatedPropsToName)(t, s.props));
    const { props: d } = s;
    h();
    function h() {
      for (const _ of a)
        u && p(_), s.allErrors ? $(_) : (t.var(l, !0), $(_), t.if(l));
    }
    function p(_) {
      for (const v in u)
        new RegExp(_).test(v) && (0, $h.checkStrictMode)(s, `property ${v} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function $(_) {
      t.forIn("key", n, (v) => {
        t.if((0, vo._)`${(0, vh.usePattern)(e, _)}.test(${v})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: v,
            dataPropType: wh.Type.Str
          }, l), s.opts.unevaluated && d !== !0 ? t.assign((0, vo._)`${d}[${v}]`, !0) : !m && !s.allErrors && t.if((0, vo.not)(l), () => t.break());
        });
      });
    }
  }
};
Uu.default = FS;
var xu = {};
Object.defineProperty(xu, "__esModule", { value: !0 });
const jS = W, MS = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, jS.alwaysValidSchema)(n, r)) {
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
xu.default = MS;
var Vu = {};
Object.defineProperty(Vu, "__esModule", { value: !0 });
const LS = he, US = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: LS.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Vu.default = US;
var qu = {};
Object.defineProperty(qu, "__esModule", { value: !0 });
const Xo = oe, xS = W, VS = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Xo._)`{passingSchemas: ${e.passing}}`
}, qS = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: VS,
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
        (0, xS.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
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
qu.default = qS;
var Bu = {};
Object.defineProperty(Bu, "__esModule", { value: !0 });
const BS = W, HS = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((s, o) => {
      if ((0, BS.alwaysValidSchema)(n, s))
        return;
      const a = e.subschema({ keyword: "allOf", schemaProp: o }, i);
      e.ok(i), e.mergeEvaluated(a);
    });
  }
};
Bu.default = HS;
var Hu = {};
Object.defineProperty(Hu, "__esModule", { value: !0 });
const fa = oe, cg = W, zS = {
  message: ({ params: e }) => (0, fa.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, fa._)`{failingKeyword: ${e.ifClause}}`
}, GS = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: zS,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, cg.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = Eh(n, "then"), s = Eh(n, "else");
    if (!i && !s)
      return;
    const o = t.let("valid", !0), a = t.name("_valid");
    if (c(), e.reset(), i && s) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(a, u("then", l), u("else", l));
    } else i ? t.if(a, u("then")) : t.if((0, fa.not)(a), u("else"));
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
        t.assign(o, a), e.mergeValidEvaluated(h, o), d ? t.assign(d, (0, fa._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Eh(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, cg.alwaysValidSchema)(e, r);
}
Hu.default = GS;
var zu = {};
Object.defineProperty(zu, "__esModule", { value: !0 });
const WS = W, KS = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, WS.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
zu.default = KS;
Object.defineProperty(Du, "__esModule", { value: !0 });
const YS = Di, XS = ku, JS = ki, QS = Fu, ZS = ju, eP = La, tP = Mu, rP = Ua, nP = Lu, iP = Uu, sP = xu, oP = Vu, aP = qu, cP = Bu, lP = Hu, uP = zu;
function dP(e = !1) {
  const t = [
    // any
    sP.default,
    oP.default,
    aP.default,
    cP.default,
    lP.default,
    uP.default,
    // object
    tP.default,
    rP.default,
    eP.default,
    nP.default,
    iP.default
  ];
  return e ? t.push(XS.default, QS.default) : t.push(YS.default, JS.default), t.push(ZS.default), t;
}
Du.default = dP;
var Gu = {}, Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.dynamicAnchor = void 0;
const Rc = oe, fP = Rt, bh = ut, hP = Cr, pP = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => lg(e, e.schema)
};
function lg(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const i = (0, Rc._)`${fP.default.dynamicAnchors}${(0, Rc.getProperty)(t)}`, s = n.errSchemaPath === "#" ? n.validateName : mP(e);
  r.if((0, Rc._)`!${i}`, () => r.assign(i, s));
}
Fi.dynamicAnchor = lg;
function mP(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: i, baseId: s, localRefs: o, meta: a } = t.root, { schemaId: c } = n.opts, u = new bh.SchemaEnv({ schema: r, schemaId: c, root: i, baseId: s, localRefs: o, meta: a });
  return bh.compileSchema.call(n, u), (0, hP.getValidate)(e, u);
}
Fi.default = pP;
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.dynamicRef = void 0;
const Sh = oe, yP = Rt, Ph = Cr, gP = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => ug(e, e.schema)
};
function ug(e, t) {
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
      const u = r.let("_v", (0, Sh._)`${yP.default.dynamicAnchors}${(0, Sh.getProperty)(s)}`);
      r.if(u, a(u, c), a(i.validateName, c));
    } else
      a(i.validateName, c)();
  }
  function a(c, u) {
    return u ? () => r.block(() => {
      (0, Ph.callRef)(e, c), r.let(u, !0);
    }) : () => (0, Ph.callRef)(e, c);
  }
}
ji.dynamicRef = ug;
ji.default = gP;
var Wu = {};
Object.defineProperty(Wu, "__esModule", { value: !0 });
const _P = Fi, vP = W, $P = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, _P.dynamicAnchor)(e, "") : (0, vP.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
Wu.default = $P;
var Ku = {};
Object.defineProperty(Ku, "__esModule", { value: !0 });
const wP = ji, EP = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, wP.dynamicRef)(e, e.schema)
};
Ku.default = EP;
Object.defineProperty(Gu, "__esModule", { value: !0 });
const bP = Fi, SP = ji, PP = Wu, TP = Ku, NP = [bP.default, SP.default, PP.default, TP.default];
Gu.default = NP;
var Yu = {}, Xu = {};
Object.defineProperty(Xu, "__esModule", { value: !0 });
const Th = La, OP = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Th.error,
  code: (e) => (0, Th.validatePropertyDeps)(e)
};
Xu.default = OP;
var Ju = {};
Object.defineProperty(Ju, "__esModule", { value: !0 });
const AP = La, RP = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, AP.validateSchemaDeps)(e)
};
Ju.default = RP;
var Qu = {};
Object.defineProperty(Qu, "__esModule", { value: !0 });
const CP = W, IP = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, CP.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
Qu.default = IP;
Object.defineProperty(Yu, "__esModule", { value: !0 });
const DP = Xu, kP = Ju, FP = Qu, jP = [DP.default, kP.default, FP.default];
Yu.default = jP;
var Zu = {}, ed = {};
Object.defineProperty(ed, "__esModule", { value: !0 });
const Wr = oe, Nh = W, MP = Rt, LP = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Wr._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, UP = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: LP,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: i, it: s } = e;
    if (!i)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: a } = s;
    a instanceof Wr.Name ? t.if((0, Wr._)`${a} !== true`, () => t.forIn("key", n, (d) => t.if(u(a, d), () => c(d)))) : a !== !0 && t.forIn("key", n, (d) => a === void 0 ? c(d) : t.if(l(a, d), () => c(d))), s.props = !0, e.ok((0, Wr._)`${i} === ${MP.default.errors}`);
    function c(d) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: d }), e.error(), o || t.break();
        return;
      }
      if (!(0, Nh.alwaysValidSchema)(s, r)) {
        const h = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: d,
          dataPropType: Nh.Type.Str
        }, h), o || t.if((0, Wr.not)(h), () => t.break());
      }
    }
    function u(d, h) {
      return (0, Wr._)`!${d} || !${d}[${h}]`;
    }
    function l(d, h) {
      const p = [];
      for (const $ in d)
        d[$] === !0 && p.push((0, Wr._)`${h} !== ${$}`);
      return (0, Wr.and)(...p);
    }
  }
};
ed.default = UP;
var td = {};
Object.defineProperty(td, "__esModule", { value: !0 });
const Rn = oe, Oh = W, xP = {
  message: ({ params: { len: e } }) => (0, Rn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Rn._)`{limit: ${e}}`
}, VP = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: xP,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e, s = i.items || 0;
    if (s === !0)
      return;
    const o = t.const("len", (0, Rn._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: s }), e.fail((0, Rn._)`${o} > ${s}`);
    else if (typeof r == "object" && !(0, Oh.alwaysValidSchema)(i, r)) {
      const c = t.var("valid", (0, Rn._)`${o} <= ${s}`);
      t.if((0, Rn.not)(c), () => a(c, s)), e.ok(c);
    }
    i.items = !0;
    function a(c, u) {
      t.forRange("i", u, o, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: Oh.Type.Num }, c), i.allErrors || t.if((0, Rn.not)(c), () => t.break());
      });
    }
  }
};
td.default = VP;
Object.defineProperty(Zu, "__esModule", { value: !0 });
const qP = ed, BP = td, HP = [qP.default, BP.default];
Zu.default = HP;
var rd = {}, nd = {};
Object.defineProperty(nd, "__esModule", { value: !0 });
const Ie = oe, zP = {
  message: ({ schemaCode: e }) => (0, Ie.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Ie._)`{format: ${e}}`
}, GP = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: zP,
  code(e, t) {
    const { gen: r, data: n, $data: i, schema: s, schemaCode: o, it: a } = e, { opts: c, errSchemaPath: u, schemaEnv: l, self: d } = a;
    if (!c.validateFormats)
      return;
    i ? h() : p();
    function h() {
      const $ = r.scopeValue("formats", {
        ref: d.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, Ie._)`${$}[${o}]`), v = r.let("fType"), m = r.let("format");
      r.if((0, Ie._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(v, (0, Ie._)`${_}.type || "string"`).assign(m, (0, Ie._)`${_}.validate`), () => r.assign(v, (0, Ie._)`"string"`).assign(m, _)), e.fail$data((0, Ie.or)(E(), A()));
      function E() {
        return c.strictSchema === !1 ? Ie.nil : (0, Ie._)`${o} && !${m}`;
      }
      function A() {
        const I = l.$async ? (0, Ie._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, Ie._)`${m}(${n})`, F = (0, Ie._)`(typeof ${m} == "function" ? ${I} : ${m}.test(${n}))`;
        return (0, Ie._)`${m} && ${m} !== true && ${v} === ${t} && !${F}`;
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
        const z = F instanceof RegExp ? (0, Ie.regexpCode)(F) : c.code.formats ? (0, Ie._)`${c.code.formats}${(0, Ie.getProperty)(s)}` : void 0, G = r.scopeValue("formats", { key: s, ref: F, code: z });
        return typeof F == "object" && !(F instanceof RegExp) ? [F.type || "string", F.validate, (0, Ie._)`${G}.validate`] : ["string", F, G];
      }
      function I() {
        if (typeof $ == "object" && !($ instanceof RegExp) && $.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Ie._)`await ${m}(${n})`;
        }
        return typeof v == "function" ? (0, Ie._)`${m}(${n})` : (0, Ie._)`${m}.test(${n})`;
      }
    }
  }
};
nd.default = GP;
Object.defineProperty(rd, "__esModule", { value: !0 });
const WP = nd, KP = [WP.default];
rd.default = KP;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.contentVocabulary = Pi.metadataVocabulary = void 0;
Pi.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Pi.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(_u, "__esModule", { value: !0 });
const YP = vu, XP = wu, JP = Du, QP = Gu, ZP = Yu, e1 = Zu, t1 = rd, Ah = Pi, r1 = [
  QP.default,
  YP.default,
  XP.default,
  (0, JP.default)(!0),
  t1.default,
  Ah.metadataVocabulary,
  Ah.contentVocabulary,
  ZP.default,
  e1.default
];
_u.default = r1;
var id = {}, xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
xa.DiscrError = void 0;
var Rh;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Rh || (xa.DiscrError = Rh = {}));
Object.defineProperty(id, "__esModule", { value: !0 });
const oi = oe, Nl = xa, Ch = ut, n1 = Ii, i1 = W, s1 = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Nl.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, oi._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, o1 = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: s1,
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
    const c = t.let("valid", !1), u = t.const("tag", (0, oi._)`${r}${(0, oi.getProperty)(a)}`);
    t.if((0, oi._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: Nl.DiscrError.Tag, tag: u, tagName: a })), e.ok(c);
    function l() {
      const p = h();
      t.if(!1);
      for (const $ in p)
        t.elseIf((0, oi._)`${u} === ${$}`), t.assign(c, d(p[$]));
      t.else(), e.error(!1, { discrError: Nl.DiscrError.Mapping, tag: u, tagName: a }), t.endIf();
    }
    function d(p) {
      const $ = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: p }, $);
      return e.mergeEvaluated(_, oi.Name), $;
    }
    function h() {
      var p;
      const $ = {}, _ = m(i);
      let v = !0;
      for (let I = 0; I < o.length; I++) {
        let F = o[I];
        if (F != null && F.$ref && !(0, i1.schemaHasRulesButRef)(F, s.self.RULES)) {
          const G = F.$ref;
          if (F = Ch.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, G), F instanceof Ch.SchemaEnv && (F = F.schema), F === void 0)
            throw new n1.default(s.opts.uriResolver, s.baseId, G);
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
id.default = o1;
var sd = {};
const a1 = "https://json-schema.org/draft/2020-12/schema", c1 = "https://json-schema.org/draft/2020-12/schema", l1 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, u1 = "meta", d1 = "Core and Validation specifications meta-schema", f1 = [
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
], h1 = [
  "object",
  "boolean"
], p1 = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", m1 = {
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
}, y1 = {
  $schema: a1,
  $id: c1,
  $vocabulary: l1,
  $dynamicAnchor: u1,
  title: d1,
  allOf: f1,
  type: h1,
  $comment: p1,
  properties: m1
}, g1 = "https://json-schema.org/draft/2020-12/schema", _1 = "https://json-schema.org/draft/2020-12/meta/applicator", v1 = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, $1 = "meta", w1 = "Applicator vocabulary meta-schema", E1 = [
  "object",
  "boolean"
], b1 = {
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
}, S1 = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, P1 = {
  $schema: g1,
  $id: _1,
  $vocabulary: v1,
  $dynamicAnchor: $1,
  title: w1,
  type: E1,
  properties: b1,
  $defs: S1
}, T1 = "https://json-schema.org/draft/2020-12/schema", N1 = "https://json-schema.org/draft/2020-12/meta/unevaluated", O1 = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, A1 = "meta", R1 = "Unevaluated applicator vocabulary meta-schema", C1 = [
  "object",
  "boolean"
], I1 = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, D1 = {
  $schema: T1,
  $id: N1,
  $vocabulary: O1,
  $dynamicAnchor: A1,
  title: R1,
  type: C1,
  properties: I1
}, k1 = "https://json-schema.org/draft/2020-12/schema", F1 = "https://json-schema.org/draft/2020-12/meta/content", j1 = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, M1 = "meta", L1 = "Content vocabulary meta-schema", U1 = [
  "object",
  "boolean"
], x1 = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, V1 = {
  $schema: k1,
  $id: F1,
  $vocabulary: j1,
  $dynamicAnchor: M1,
  title: L1,
  type: U1,
  properties: x1
}, q1 = "https://json-schema.org/draft/2020-12/schema", B1 = "https://json-schema.org/draft/2020-12/meta/core", H1 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, z1 = "meta", G1 = "Core vocabulary meta-schema", W1 = [
  "object",
  "boolean"
], K1 = {
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
}, Y1 = {
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
}, X1 = {
  $schema: q1,
  $id: B1,
  $vocabulary: H1,
  $dynamicAnchor: z1,
  title: G1,
  type: W1,
  properties: K1,
  $defs: Y1
}, J1 = "https://json-schema.org/draft/2020-12/schema", Q1 = "https://json-schema.org/draft/2020-12/meta/format-annotation", Z1 = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, eT = "meta", tT = "Format vocabulary meta-schema for annotation results", rT = [
  "object",
  "boolean"
], nT = {
  format: {
    type: "string"
  }
}, iT = {
  $schema: J1,
  $id: Q1,
  $vocabulary: Z1,
  $dynamicAnchor: eT,
  title: tT,
  type: rT,
  properties: nT
}, sT = "https://json-schema.org/draft/2020-12/schema", oT = "https://json-schema.org/draft/2020-12/meta/meta-data", aT = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, cT = "meta", lT = "Meta-data vocabulary meta-schema", uT = [
  "object",
  "boolean"
], dT = {
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
}, fT = {
  $schema: sT,
  $id: oT,
  $vocabulary: aT,
  $dynamicAnchor: cT,
  title: lT,
  type: uT,
  properties: dT
}, hT = "https://json-schema.org/draft/2020-12/schema", pT = "https://json-schema.org/draft/2020-12/meta/validation", mT = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, yT = "meta", gT = "Validation vocabulary meta-schema", _T = [
  "object",
  "boolean"
], vT = {
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
}, $T = {
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
}, wT = {
  $schema: hT,
  $id: pT,
  $vocabulary: mT,
  $dynamicAnchor: yT,
  title: gT,
  type: _T,
  properties: vT,
  $defs: $T
};
Object.defineProperty(sd, "__esModule", { value: !0 });
const ET = y1, bT = P1, ST = D1, PT = V1, TT = X1, NT = iT, OT = fT, AT = wT, RT = ["/properties"];
function CT(e) {
  return [
    ET,
    bT,
    ST,
    PT,
    TT,
    t(this, NT),
    OT,
    t(this, AT)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, RT) : n;
  }
}
sd.default = CT;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = fy, n = _u, i = id, s = sd, o = "https://json-schema.org/draft/2020-12/schema";
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
  var c = Qt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var u = oe;
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
  var d = Ii;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return d.default;
  } });
})($l, $l.exports);
var IT = $l.exports, Ol = { exports: {} }, dg = {};
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
    const J = +q[1], j = +q[2], M = +q[3];
    return j >= 1 && j <= 12 && M >= 1 && M <= (j === 2 && r(J) ? 29 : i[j]);
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
      const M = +j[1], B = +j[2], L = +j[3], H = j[4], V = j[5] === "-" ? -1 : 1, C = +(j[6] || 0), b = +(j[7] || 0);
      if (C > 23 || b > 59 || x && !H)
        return !1;
      if (M <= 23 && B <= 59 && L < 60)
        return !0;
      const N = B - b * V, S = M - C * V - (N < 0 ? 1 : 0);
      return (S === 23 || S === -1) && (N === 59 || N === -1) && L < 61;
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
      const M = j.split(d);
      return M.length === 2 && s(M[0]) && q(M[1]);
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
    const [J, j] = x.split(d), [M, B] = q.split(d), L = o(J, M);
    if (L !== void 0)
      return L || u(j, B);
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
})(dg);
var fg = {}, Al = { exports: {} }, hg = {}, Zt = {}, Ti = {}, zs = {}, de = {}, Ss = {};
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
var Rl = {};
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
})(Rl);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = Ss, r = Rl;
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
  var i = Rl;
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
        y.optimizeNames(f, g) || (M(f, y.names), T.splice(w, 1));
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
  function M(S, f) {
    for (const g in f)
      S[g] = (S[g] || 0) - (f[g] || 0);
  }
  function B(S) {
    return typeof S == "boolean" || typeof S == "number" || S === null ? !S : (0, t._)`!${N(S)}`;
  }
  e.not = B;
  const L = b(e.operators.AND);
  function H(...S) {
    return S.reduce(L);
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
const $e = de, DT = Ss;
function kT(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
Y.toHash = kT;
function FT(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (pg(e, t), !mg(t, e.self.RULES.all));
}
Y.alwaysValidSchema = FT;
function pg(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const i = n.RULES.keywords;
  for (const s in t)
    i[s] || _g(e, `unknown keyword: "${s}"`);
}
Y.checkUnknownRules = pg;
function mg(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
Y.schemaHasRules = mg;
function jT(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
Y.schemaHasRulesButRef = jT;
function MT({ topSchemaRef: e, schemaPath: t }, r, n, i) {
  if (!i) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, $e._)`${r}`;
  }
  return (0, $e._)`${e}${t}${(0, $e.getProperty)(n)}`;
}
Y.schemaRefOrVal = MT;
function LT(e) {
  return yg(decodeURIComponent(e));
}
Y.unescapeFragment = LT;
function UT(e) {
  return encodeURIComponent(od(e));
}
Y.escapeFragment = UT;
function od(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
Y.escapeJsonPointer = od;
function yg(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
Y.unescapeJsonPointer = yg;
function xT(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
Y.eachItem = xT;
function Ih({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (i, s, o, a) => {
    const c = o === void 0 ? s : o instanceof $e.Name ? (s instanceof $e.Name ? e(i, s, o) : t(i, s, o), o) : s instanceof $e.Name ? (t(i, o, s), s) : r(s, o);
    return a === $e.Name && !(c instanceof $e.Name) ? n(i, c) : c;
  };
}
Y.mergeEvaluated = {
  props: Ih({
    mergeNames: (e, t, r) => e.if((0, $e._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, $e._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, $e._)`${r} || {}`).code((0, $e._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, $e._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, $e._)`${r} || {}`), ad(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: gg
  }),
  items: Ih({
    mergeNames: (e, t, r) => e.if((0, $e._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, $e._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, $e._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, $e._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function gg(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, $e._)`{}`);
  return t !== void 0 && ad(e, r, t), r;
}
Y.evaluatedPropsToName = gg;
function ad(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, $e._)`${t}${(0, $e.getProperty)(n)}`, !0));
}
Y.setEvaluated = ad;
const Dh = {};
function VT(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Dh[t.code] || (Dh[t.code] = new DT._Code(t.code))
  });
}
Y.useFunc = VT;
var Cl;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Cl || (Y.Type = Cl = {}));
function qT(e, t, r) {
  if (e instanceof $e.Name) {
    const n = t === Cl.Num;
    return r ? n ? (0, $e._)`"[" + ${e} + "]"` : (0, $e._)`"['" + ${e} + "']"` : n ? (0, $e._)`"/" + ${e}` : (0, $e._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, $e.getProperty)(e).toString() : "/" + od(e);
}
Y.getErrorPath = qT;
function _g(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
Y.checkStrictMode = _g;
var hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
const tt = de, BT = {
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
hr.default = BT;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = de, r = Y, n = hr;
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
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.boolOrEmptySchema = Ti.topBoolOrEmptySchema = void 0;
const HT = zs, zT = de, GT = hr, WT = {
  message: "boolean schema is false"
};
function KT(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? vg(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(GT.default.data) : (t.assign((0, zT._)`${n}.errors`, null), t.return(!0));
}
Ti.topBoolOrEmptySchema = KT;
function YT(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), vg(e)) : r.var(t, !0);
}
Ti.boolOrEmptySchema = YT;
function vg(e, t) {
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
  (0, HT.reportError)(i, WT, void 0, t);
}
var Le = {}, qn = {};
Object.defineProperty(qn, "__esModule", { value: !0 });
qn.getRules = qn.isJSONType = void 0;
const XT = ["string", "number", "integer", "boolean", "null", "object", "array"], JT = new Set(XT);
function QT(e) {
  return typeof e == "string" && JT.has(e);
}
qn.isJSONType = QT;
function ZT() {
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
qn.getRules = ZT;
var Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.shouldUseRule = Nr.shouldUseGroup = Nr.schemaHasRulesForType = void 0;
function eN({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && $g(e, n);
}
Nr.schemaHasRulesForType = eN;
function $g(e, t) {
  return t.rules.some((r) => wg(e, r));
}
Nr.shouldUseGroup = $g;
function wg(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
Nr.shouldUseRule = wg;
Object.defineProperty(Le, "__esModule", { value: !0 });
Le.reportTypeError = Le.checkDataTypes = Le.checkDataType = Le.coerceAndCheckDataType = Le.getJSONTypes = Le.getSchemaTypes = Le.DataType = void 0;
const tN = qn, rN = Nr, nN = zs, le = de, Eg = Y;
var vi;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(vi || (Le.DataType = vi = {}));
function iN(e) {
  const t = bg(e.type);
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
Le.getSchemaTypes = iN;
function bg(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(tN.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Le.getJSONTypes = bg;
function sN(e, t) {
  const { gen: r, data: n, opts: i } = e, s = oN(t, i.coerceTypes), o = t.length > 0 && !(s.length === 0 && t.length === 1 && (0, rN.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const a = cd(t, n, i.strictNumbers, vi.Wrong);
    r.if(a, () => {
      s.length ? aN(e, t, s) : ld(e);
    });
  }
  return o;
}
Le.coerceAndCheckDataType = sN;
const Sg = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function oN(e, t) {
  return t ? e.filter((r) => Sg.has(r) || t === "array" && r === "array") : [];
}
function aN(e, t, r) {
  const { gen: n, data: i, opts: s } = e, o = n.let("dataType", (0, le._)`typeof ${i}`), a = n.let("coerced", (0, le._)`undefined`);
  s.coerceTypes === "array" && n.if((0, le._)`${o} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, le._)`${i}[0]`).assign(o, (0, le._)`typeof ${i}`).if(cd(t, i, s.strictNumbers), () => n.assign(a, i))), n.if((0, le._)`${a} !== undefined`);
  for (const u of r)
    (Sg.has(u) || u === "array" && s.coerceTypes === "array") && c(u);
  n.else(), ld(e), n.endIf(), n.if((0, le._)`${a} !== undefined`, () => {
    n.assign(i, a), cN(e, a);
  });
  function c(u) {
    switch (u) {
      case "string":
        n.elseIf((0, le._)`${o} == "number" || ${o} == "boolean"`).assign(a, (0, le._)`"" + ${i}`).elseIf((0, le._)`${i} === null`).assign(a, (0, le._)`""`);
        return;
      case "number":
        n.elseIf((0, le._)`${o} == "boolean" || ${i} === null
              || (${o} == "string" && ${i} && ${i} == +${i})`).assign(a, (0, le._)`+${i}`);
        return;
      case "integer":
        n.elseIf((0, le._)`${o} === "boolean" || ${i} === null
              || (${o} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(a, (0, le._)`+${i}`);
        return;
      case "boolean":
        n.elseIf((0, le._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(a, !1).elseIf((0, le._)`${i} === "true" || ${i} === 1`).assign(a, !0);
        return;
      case "null":
        n.elseIf((0, le._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(a, null);
        return;
      case "array":
        n.elseIf((0, le._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${i} === null`).assign(a, (0, le._)`[${i}]`);
    }
  }
}
function cN({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, le._)`${t} !== undefined`, () => e.assign((0, le._)`${t}[${r}]`, n));
}
function Il(e, t, r, n = vi.Correct) {
  const i = n === vi.Correct ? le.operators.EQ : le.operators.NEQ;
  let s;
  switch (e) {
    case "null":
      return (0, le._)`${t} ${i} null`;
    case "array":
      s = (0, le._)`Array.isArray(${t})`;
      break;
    case "object":
      s = (0, le._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      s = o((0, le._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      s = o();
      break;
    default:
      return (0, le._)`typeof ${t} ${i} ${e}`;
  }
  return n === vi.Correct ? s : (0, le.not)(s);
  function o(a = le.nil) {
    return (0, le.and)((0, le._)`typeof ${t} == "number"`, a, r ? (0, le._)`isFinite(${t})` : le.nil);
  }
}
Le.checkDataType = Il;
function cd(e, t, r, n) {
  if (e.length === 1)
    return Il(e[0], t, r, n);
  let i;
  const s = (0, Eg.toHash)(e);
  if (s.array && s.object) {
    const o = (0, le._)`typeof ${t} != "object"`;
    i = s.null ? o : (0, le._)`!${t} || ${o}`, delete s.null, delete s.array, delete s.object;
  } else
    i = le.nil;
  s.number && delete s.integer;
  for (const o in s)
    i = (0, le.and)(i, Il(o, t, r, n));
  return i;
}
Le.checkDataTypes = cd;
const lN = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, le._)`{type: ${e}}` : (0, le._)`{type: ${t}}`
};
function ld(e) {
  const t = uN(e);
  (0, nN.reportError)(t, lN);
}
Le.reportTypeError = ld;
function uN(e) {
  const { gen: t, data: r, schema: n } = e, i = (0, Eg.schemaRefOrVal)(e, n, "type");
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
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
Va.assignDefaults = void 0;
const Qn = de, dN = Y;
function fN(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const i in r)
      kh(e, i, r[i].default);
  else t === "array" && Array.isArray(n) && n.forEach((i, s) => kh(e, s, i.default));
}
Va.assignDefaults = fN;
function kh(e, t, r) {
  const { gen: n, compositeRule: i, data: s, opts: o } = e;
  if (r === void 0)
    return;
  const a = (0, Qn._)`${s}${(0, Qn.getProperty)(t)}`;
  if (i) {
    (0, dN.checkStrictMode)(e, `default is ignored for: ${a}`);
    return;
  }
  let c = (0, Qn._)`${a} === undefined`;
  o.useDefaults === "empty" && (c = (0, Qn._)`${c} || ${a} === null || ${a} === ""`), n.if(c, (0, Qn._)`${a} = ${(0, Qn.stringify)(r)}`);
}
var dr = {}, pe = {};
Object.defineProperty(pe, "__esModule", { value: !0 });
pe.validateUnion = pe.validateArray = pe.usePattern = pe.callValidateCode = pe.schemaProperties = pe.allSchemaProperties = pe.noPropertyInData = pe.propertyInData = pe.isOwnProperty = pe.hasPropFunc = pe.reportMissingProp = pe.checkMissingProp = pe.checkReportMissingProp = void 0;
const Pe = de, ud = Y, Br = hr, hN = Y;
function pN(e, t) {
  const { gen: r, data: n, it: i } = e;
  r.if(fd(r, n, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Pe._)`${t}` }, !0), e.error();
  });
}
pe.checkReportMissingProp = pN;
function mN({ gen: e, data: t, it: { opts: r } }, n, i) {
  return (0, Pe.or)(...n.map((s) => (0, Pe.and)(fd(e, t, s, r.ownProperties), (0, Pe._)`${i} = ${s}`)));
}
pe.checkMissingProp = mN;
function yN(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
pe.reportMissingProp = yN;
function Pg(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Pe._)`Object.prototype.hasOwnProperty`
  });
}
pe.hasPropFunc = Pg;
function dd(e, t, r) {
  return (0, Pe._)`${Pg(e)}.call(${t}, ${r})`;
}
pe.isOwnProperty = dd;
function gN(e, t, r, n) {
  const i = (0, Pe._)`${t}${(0, Pe.getProperty)(r)} !== undefined`;
  return n ? (0, Pe._)`${i} && ${dd(e, t, r)}` : i;
}
pe.propertyInData = gN;
function fd(e, t, r, n) {
  const i = (0, Pe._)`${t}${(0, Pe.getProperty)(r)} === undefined`;
  return n ? (0, Pe.or)(i, (0, Pe.not)(dd(e, t, r))) : i;
}
pe.noPropertyInData = fd;
function Tg(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
pe.allSchemaProperties = Tg;
function _N(e, t) {
  return Tg(t).filter((r) => !(0, ud.alwaysValidSchema)(e, t[r]));
}
pe.schemaProperties = _N;
function vN({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: i, errorPath: s }, it: o }, a, c, u) {
  const l = u ? (0, Pe._)`${e}, ${t}, ${n}${i}` : t, d = [
    [Br.default.instancePath, (0, Pe.strConcat)(Br.default.instancePath, s)],
    [Br.default.parentData, o.parentData],
    [Br.default.parentDataProperty, o.parentDataProperty],
    [Br.default.rootData, Br.default.rootData]
  ];
  o.opts.dynamicRef && d.push([Br.default.dynamicAnchors, Br.default.dynamicAnchors]);
  const h = (0, Pe._)`${l}, ${r.object(...d)}`;
  return c !== Pe.nil ? (0, Pe._)`${a}.call(${c}, ${h})` : (0, Pe._)`${a}(${h})`;
}
pe.callValidateCode = vN;
const $N = (0, Pe._)`new RegExp`;
function wN({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, s = i(r, n);
  return e.scopeValue("pattern", {
    key: s.toString(),
    ref: s,
    code: (0, Pe._)`${i.code === "new RegExp" ? $N : (0, hN.useFunc)(e, i)}(${r}, ${n})`
  });
}
pe.usePattern = wN;
function EN(e) {
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
        dataPropType: ud.Type.Num
      }, s), t.if((0, Pe.not)(s), a);
    });
  }
}
pe.validateArray = EN;
function bN(e) {
  const { gen: t, schema: r, keyword: n, it: i } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, ud.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
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
pe.validateUnion = bN;
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.validateKeywordUsage = dr.validSchemaType = dr.funcKeywordCode = dr.macroKeywordCode = void 0;
const lt = de, Cn = hr, SN = pe, PN = zs;
function TN(e, t) {
  const { gen: r, keyword: n, schema: i, parentSchema: s, it: o } = e, a = t.macro.call(o.self, i, s, o), c = Ng(r, n, a);
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
dr.macroKeywordCode = TN;
function NN(e, t) {
  var r;
  const { gen: n, keyword: i, schema: s, parentSchema: o, $data: a, it: c } = e;
  AN(c, t);
  const u = !a && t.compile ? t.compile.call(c.self, s, o, c) : t.validate, l = Ng(n, i, u), d = n.let("valid");
  e.block$data(d, h), e.ok((r = t.valid) !== null && r !== void 0 ? r : d);
  function h() {
    if (t.errors === !1)
      _(), t.modifying && Fh(e), v(() => e.error());
    else {
      const m = t.async ? p() : $();
      t.modifying && Fh(e), v(() => ON(e, m));
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
    const E = c.opts.passContext ? Cn.default.this : Cn.default.self, A = !("compile" in t && !a || t.schema === !1);
    n.assign(d, (0, lt._)`${m}${(0, SN.callValidateCode)(e, l, E, A)}`, t.modifying);
  }
  function v(m) {
    var E;
    n.if((0, lt.not)((E = t.valid) !== null && E !== void 0 ? E : d), m);
  }
}
dr.funcKeywordCode = NN;
function Fh(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, lt._)`${n.parentData}[${n.parentDataProperty}]`));
}
function ON(e, t) {
  const { gen: r } = e;
  r.if((0, lt._)`Array.isArray(${t})`, () => {
    r.assign(Cn.default.vErrors, (0, lt._)`${Cn.default.vErrors} === null ? ${t} : ${Cn.default.vErrors}.concat(${t})`).assign(Cn.default.errors, (0, lt._)`${Cn.default.vErrors}.length`), (0, PN.extendErrors)(e);
  }, () => e.error());
}
function AN({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Ng(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, lt.stringify)(r) });
}
function RN(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
dr.validSchemaType = RN;
function CN({ schema: e, opts: t, self: r, errSchemaPath: n }, i, s) {
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
dr.validateKeywordUsage = CN;
var sn = {};
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.extendSubschemaMode = sn.extendSubschemaData = sn.getSubschema = void 0;
const cr = de, Og = Y;
function IN(e, { keyword: t, schemaProp: r, schema: n, schemaPath: i, errSchemaPath: s, topSchemaRef: o }) {
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
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Og.escapeFragment)(r)}`
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
sn.getSubschema = IN;
function DN(e, t, { dataProp: r, dataPropType: n, data: i, dataTypes: s, propertyName: o }) {
  if (i !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: a } = t;
  if (r !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: d } = t, h = a.let("data", (0, cr._)`${t.data}${(0, cr.getProperty)(r)}`, !0);
    c(h), e.errorPath = (0, cr.str)`${u}${(0, Og.getErrorPath)(r, n, d.jsPropertySyntax)}`, e.parentDataProperty = (0, cr._)`${r}`, e.dataPathArr = [...l, e.parentDataProperty];
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
sn.extendSubschemaData = DN;
function kN(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: i, allErrors: s }) {
  n !== void 0 && (e.compositeRule = n), i !== void 0 && (e.createErrors = i), s !== void 0 && (e.allErrors = s), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
sn.extendSubschemaMode = kN;
var We = {}, Ag = { exports: {} }, en = Ag.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, i = r.post || function() {
  };
  Jo(t, n, i, e, "", e);
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
function Jo(e, t, r, n, i, s, o, a, c, u) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, i, s, o, a, c, u);
    for (var l in n) {
      var d = n[l];
      if (Array.isArray(d)) {
        if (l in en.arrayKeywords)
          for (var h = 0; h < d.length; h++)
            Jo(e, t, r, d[h], i + "/" + l + "/" + h, s, i, l, n, h);
      } else if (l in en.propsKeywords) {
        if (d && typeof d == "object")
          for (var p in d)
            Jo(e, t, r, d[p], i + "/" + l + "/" + FN(p), s, i, l, n, p);
      } else (l in en.keywords || e.allKeys && !(l in en.skipKeywords)) && Jo(e, t, r, d, i + "/" + l, s, i, l, n);
    }
    r(n, i, s, o, a, c, u);
  }
}
function FN(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var jN = Ag.exports;
Object.defineProperty(We, "__esModule", { value: !0 });
We.getSchemaRefs = We.resolveUrl = We.normalizeId = We._getFullPath = We.getFullPath = We.inlineRef = void 0;
const MN = Y, LN = ka, UN = jN, xN = /* @__PURE__ */ new Set([
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
function VN(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Dl(e) : t ? Rg(e) <= t : !1;
}
We.inlineRef = VN;
const qN = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Dl(e) {
  for (const t in e) {
    if (qN.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(Dl) || typeof r == "object" && Dl(r))
      return !0;
  }
  return !1;
}
function Rg(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !xN.has(r) && (typeof e[r] == "object" && (0, MN.eachItem)(e[r], (n) => t += Rg(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Cg(e, t = "", r) {
  r !== !1 && (t = $i(t));
  const n = e.parse(t);
  return Ig(e, n);
}
We.getFullPath = Cg;
function Ig(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
We._getFullPath = Ig;
const BN = /#\/?$/;
function $i(e) {
  return e ? e.replace(BN, "") : "";
}
We.normalizeId = $i;
function HN(e, t, r) {
  return r = $i(r), e.resolve(t, r);
}
We.resolveUrl = HN;
const zN = /^[a-z_][-a-z0-9._]*$/i;
function GN(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, i = $i(e[r] || t), s = { "": i }, o = Cg(n, i, !1), a = {}, c = /* @__PURE__ */ new Set();
  return UN(e, { allKeys: !0 }, (d, h, p, $) => {
    if ($ === void 0)
      return;
    const _ = o + h;
    let v = s[$];
    typeof d[r] == "string" && (v = m.call(this, d[r])), E.call(this, d.$anchor), E.call(this, d.$dynamicAnchor), s[h] = v;
    function m(A) {
      const I = this.opts.uriResolver.resolve;
      if (A = $i(v ? I(v, A) : A), c.has(A))
        throw l(A);
      c.add(A);
      let F = this.refs[A];
      return typeof F == "string" && (F = this.refs[F]), typeof F == "object" ? u(d, F.schema, A) : A !== $i(_) && (A[0] === "#" ? (u(d, a[A], A), a[A] = d) : this.refs[A] = _), A;
    }
    function E(A) {
      if (typeof A == "string") {
        if (!zN.test(A))
          throw new Error(`invalid anchor "${A}"`);
        m.call(this, `#${A}`);
      }
    }
  }), a;
  function u(d, h, p) {
    if (h !== void 0 && !LN(d, h))
      throw l(p);
  }
  function l(d) {
    return new Error(`reference "${d}" resolves to more than one schema`);
  }
}
We.getSchemaRefs = GN;
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.getData = Zt.KeywordCxt = Zt.validateFunctionCode = void 0;
const Dg = Ti, jh = Le, hd = Nr, ha = Le, WN = Va, ps = dr, Cc = sn, ee = de, ne = hr, KN = We, Or = Y, Ji = zs;
function YN(e) {
  if (jg(e) && (Mg(e), Fg(e))) {
    QN(e);
    return;
  }
  kg(e, () => (0, Dg.topBoolOrEmptySchema)(e));
}
Zt.validateFunctionCode = YN;
function kg({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: i }, s) {
  i.code.es5 ? e.func(t, (0, ee._)`${ne.default.data}, ${ne.default.valCxt}`, n.$async, () => {
    e.code((0, ee._)`"use strict"; ${Mh(r, i)}`), JN(e, i), e.code(s);
  }) : e.func(t, (0, ee._)`${ne.default.data}, ${XN(i)}`, n.$async, () => e.code(Mh(r, i)).code(s));
}
function XN(e) {
  return (0, ee._)`{${ne.default.instancePath}="", ${ne.default.parentData}, ${ne.default.parentDataProperty}, ${ne.default.rootData}=${ne.default.data}${e.dynamicRef ? (0, ee._)`, ${ne.default.dynamicAnchors}={}` : ee.nil}}={}`;
}
function JN(e, t) {
  e.if(ne.default.valCxt, () => {
    e.var(ne.default.instancePath, (0, ee._)`${ne.default.valCxt}.${ne.default.instancePath}`), e.var(ne.default.parentData, (0, ee._)`${ne.default.valCxt}.${ne.default.parentData}`), e.var(ne.default.parentDataProperty, (0, ee._)`${ne.default.valCxt}.${ne.default.parentDataProperty}`), e.var(ne.default.rootData, (0, ee._)`${ne.default.valCxt}.${ne.default.rootData}`), t.dynamicRef && e.var(ne.default.dynamicAnchors, (0, ee._)`${ne.default.valCxt}.${ne.default.dynamicAnchors}`);
  }, () => {
    e.var(ne.default.instancePath, (0, ee._)`""`), e.var(ne.default.parentData, (0, ee._)`undefined`), e.var(ne.default.parentDataProperty, (0, ee._)`undefined`), e.var(ne.default.rootData, ne.default.data), t.dynamicRef && e.var(ne.default.dynamicAnchors, (0, ee._)`{}`);
  });
}
function QN(e) {
  const { schema: t, opts: r, gen: n } = e;
  kg(e, () => {
    r.$comment && t.$comment && Ug(e), nO(e), n.let(ne.default.vErrors, null), n.let(ne.default.errors, 0), r.unevaluated && ZN(e), Lg(e), oO(e);
  });
}
function ZN(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, ee._)`${r}.evaluated`), t.if((0, ee._)`${e.evaluated}.dynamicProps`, () => t.assign((0, ee._)`${e.evaluated}.props`, (0, ee._)`undefined`)), t.if((0, ee._)`${e.evaluated}.dynamicItems`, () => t.assign((0, ee._)`${e.evaluated}.items`, (0, ee._)`undefined`));
}
function Mh(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, ee._)`/*# sourceURL=${r} */` : ee.nil;
}
function eO(e, t) {
  if (jg(e) && (Mg(e), Fg(e))) {
    tO(e, t);
    return;
  }
  (0, Dg.boolOrEmptySchema)(e, t);
}
function Fg({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function jg(e) {
  return typeof e.schema != "boolean";
}
function tO(e, t) {
  const { schema: r, gen: n, opts: i } = e;
  i.$comment && r.$comment && Ug(e), iO(e), sO(e);
  const s = n.const("_errs", ne.default.errors);
  Lg(e, s), n.var(t, (0, ee._)`${s} === ${ne.default.errors}`);
}
function Mg(e) {
  (0, Or.checkUnknownRules)(e), rO(e);
}
function Lg(e, t) {
  if (e.opts.jtd)
    return Lh(e, [], !1, t);
  const r = (0, jh.getSchemaTypes)(e.schema), n = (0, jh.coerceAndCheckDataType)(e, r);
  Lh(e, r, !n, t);
}
function rO(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: i } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Or.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function nO(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Or.checkStrictMode)(e, "default is ignored in the schema root");
}
function iO(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, KN.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function sO(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Ug({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: i }) {
  const s = r.$comment;
  if (i.$comment === !0)
    e.code((0, ee._)`${ne.default.self}.logger.log(${s})`);
  else if (typeof i.$comment == "function") {
    const o = (0, ee.str)`${n}/$comment`, a = e.scopeValue("root", { ref: t.root });
    e.code((0, ee._)`${ne.default.self}.opts.$comment(${s}, ${o}, ${a}.schema)`);
  }
}
function oO(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: i, opts: s } = e;
  r.$async ? t.if((0, ee._)`${ne.default.errors} === 0`, () => t.return(ne.default.data), () => t.throw((0, ee._)`new ${i}(${ne.default.vErrors})`)) : (t.assign((0, ee._)`${n}.errors`, ne.default.vErrors), s.unevaluated && aO(e), t.return((0, ee._)`${ne.default.errors} === 0`));
}
function aO({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof ee.Name && e.assign((0, ee._)`${t}.props`, r), n instanceof ee.Name && e.assign((0, ee._)`${t}.items`, n);
}
function Lh(e, t, r, n) {
  const { gen: i, schema: s, data: o, allErrors: a, opts: c, self: u } = e, { RULES: l } = u;
  if (s.$ref && (c.ignoreKeywordsWithRef || !(0, Or.schemaHasRulesButRef)(s, l))) {
    i.block(() => qg(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || cO(e, t), i.block(() => {
    for (const h of l.rules)
      d(h);
    d(l.post);
  });
  function d(h) {
    (0, hd.shouldUseGroup)(s, h) && (h.type ? (i.if((0, ha.checkDataType)(h.type, o, c.strictNumbers)), Uh(e, h), t.length === 1 && t[0] === h.type && r && (i.else(), (0, ha.reportTypeError)(e)), i.endIf()) : Uh(e, h), a || i.if((0, ee._)`${ne.default.errors} === ${n || 0}`));
  }
}
function Uh(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: i } } = e;
  i && (0, WN.assignDefaults)(e, t.type), r.block(() => {
    for (const s of t.rules)
      (0, hd.shouldUseRule)(n, s) && qg(e, s.keyword, s.definition, t.type);
  });
}
function cO(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (lO(e, t), e.opts.allowUnionTypes || uO(e, t), dO(e, e.dataTypes));
}
function lO(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      xg(e.dataTypes, r) || pd(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), hO(e, t);
  }
}
function uO(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && pd(e, "use allowUnionTypes to allow union type keyword");
}
function dO(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const i = r[n];
    if (typeof i == "object" && (0, hd.shouldUseRule)(e.schema, i)) {
      const { type: s } = i.definition;
      s.length && !s.some((o) => fO(t, o)) && pd(e, `missing type "${s.join(",")}" for keyword "${n}"`);
    }
  }
}
function fO(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function xg(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function hO(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    xg(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function pd(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Or.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Vg {
  constructor(t, r, n) {
    if ((0, ps.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Or.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Bg(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, ps.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
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
    (t ? Ji.reportExtraError : Ji.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Ji.reportError)(this, this.def.$dataError || Ji.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Ji.resetErrorsCount)(this.gen, this.errsCount);
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
        return (0, ee._)`${(0, ha.checkDataTypes)(c, r, s.opts.strictNumbers, ha.DataType.Wrong)}`;
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
    const n = (0, Cc.getSubschema)(this.it, t);
    (0, Cc.extendSubschemaData)(n, this.it, t), (0, Cc.extendSubschemaMode)(n, t);
    const i = { ...this.it, ...n, items: void 0, props: void 0 };
    return eO(i, r), i;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: i } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Or.mergeEvaluated.props(i, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Or.mergeEvaluated.items(i, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: i } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return i.if(r, () => this.mergeEvaluated(t, ee.Name)), !0;
  }
}
Zt.KeywordCxt = Vg;
function qg(e, t, r, n) {
  const i = new Vg(e, r, t);
  "code" in r ? r.code(i, n) : i.$data && r.validate ? (0, ps.funcKeywordCode)(i, r) : "macro" in r ? (0, ps.macroKeywordCode)(i, r) : (r.compile || r.validate) && (0, ps.funcKeywordCode)(i, r);
}
const pO = /^\/(?:[^~]|~0|~1)*$/, mO = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Bg(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let i, s;
  if (e === "")
    return ne.default.rootData;
  if (e[0] === "/") {
    if (!pO.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, s = ne.default.rootData;
  } else {
    const u = mO.exec(e);
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
    u && (s = (0, ee._)`${s}${(0, ee.getProperty)((0, Or.unescapeJsonPointer)(u))}`, o = (0, ee._)`${o} && ${s}`);
  return o;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
Zt.getData = Bg;
var $o = {}, xh;
function md() {
  if (xh) return $o;
  xh = 1, Object.defineProperty($o, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return $o.default = e, $o;
}
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
const Ic = We;
class yO extends Error {
  constructor(t, r, n, i) {
    super(i || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ic.resolveUrl)(t, r, n), this.missingSchema = (0, Ic.normalizeId)((0, Ic.getFullPath)(t, this.missingRef));
  }
}
Mi.default = yO;
var Et = {};
Object.defineProperty(Et, "__esModule", { value: !0 });
Et.resolveSchema = Et.getCompilingSchema = Et.resolveRef = Et.compileSchema = Et.SchemaEnv = void 0;
const qt = de, gO = md(), bn = hr, Jt = We, Vh = Y, _O = Zt;
class qa {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Jt.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Et.SchemaEnv = qa;
function yd(e) {
  const t = Hg.call(this, e);
  if (t)
    return t;
  const r = (0, Jt.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: i } = this.opts.code, { ownProperties: s } = this.opts, o = new qt.CodeGen(this.scope, { es5: n, lines: i, ownProperties: s });
  let a;
  e.$async && (a = o.scopeValue("Error", {
    ref: gO.default,
    code: (0, qt._)`require("ajv/dist/runtime/validation_error").default`
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
    dataPathArr: [qt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, qt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: a,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: qt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, qt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, _O.validateFunctionCode)(u), o.optimize(this.opts.code.optimize);
    const d = o.toString();
    l = `${o.scopeRefs(bn.default.scope)}return ${d}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const p = new Function(`${bn.default.self}`, `${bn.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: p }), p.errors = null, p.schema = e.schema, p.schemaEnv = e, e.$async && (p.$async = !0), this.opts.code.source === !0 && (p.source = { validateName: c, validateCode: d, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: $, items: _ } = u;
      p.evaluated = {
        props: $ instanceof qt.Name ? void 0 : $,
        items: _ instanceof qt.Name ? void 0 : _,
        dynamicProps: $ instanceof qt.Name,
        dynamicItems: _ instanceof qt.Name
      }, p.source && (p.source.evaluated = (0, qt.stringify)(p.evaluated));
    }
    return e.validate = p, e;
  } catch (d) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), d;
  } finally {
    this._compilations.delete(e);
  }
}
Et.compileSchema = yd;
function vO(e, t, r) {
  var n;
  r = (0, Jt.resolveUrl)(this.opts.uriResolver, t, r);
  const i = e.refs[r];
  if (i)
    return i;
  let s = EO.call(this, e, r);
  if (s === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: a } = this.opts;
    o && (s = new qa({ schema: o, schemaId: a, root: e, baseId: t }));
  }
  if (s !== void 0)
    return e.refs[r] = $O.call(this, s);
}
Et.resolveRef = vO;
function $O(e) {
  return (0, Jt.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : yd.call(this, e);
}
function Hg(e) {
  for (const t of this._compilations)
    if (wO(t, e))
      return t;
}
Et.getCompilingSchema = Hg;
function wO(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function EO(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ba.call(this, e, t);
}
function Ba(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Jt._getFullPath)(this.opts.uriResolver, r);
  let i = (0, Jt.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === i)
    return Dc.call(this, r, e);
  const s = (0, Jt.normalizeId)(n), o = this.refs[s] || this.schemas[s];
  if (typeof o == "string") {
    const a = Ba.call(this, e, o);
    return typeof (a == null ? void 0 : a.schema) != "object" ? void 0 : Dc.call(this, r, a);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || yd.call(this, o), s === (0, Jt.normalizeId)(t)) {
      const { schema: a } = o, { schemaId: c } = this.opts, u = a[c];
      return u && (i = (0, Jt.resolveUrl)(this.opts.uriResolver, i, u)), new qa({ schema: a, schemaId: c, root: e, baseId: i });
    }
    return Dc.call(this, r, o);
  }
}
Et.resolveSchema = Ba;
const bO = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Dc(e, { baseId: t, schema: r, root: n }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const a of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Vh.unescapeFragment)(a)];
    if (c === void 0)
      return;
    r = c;
    const u = typeof r == "object" && r[this.opts.schemaId];
    !bO.has(a) && u && (t = (0, Jt.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let s;
  if (typeof r != "boolean" && r.$ref && !(0, Vh.schemaHasRulesButRef)(r, this.RULES)) {
    const a = (0, Jt.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    s = Ba.call(this, n, a);
  }
  const { schemaId: o } = this.opts;
  if (s = s || new qa({ schema: r, schemaId: o, root: n, baseId: t }), s.schema !== s.root.schema)
    return s;
}
const SO = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", PO = "Meta-schema for $data reference (JSON AnySchema extension proposal)", TO = "object", NO = [
  "$data"
], OO = {
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
}, AO = !1, RO = {
  $id: SO,
  description: PO,
  type: TO,
  required: NO,
  properties: OO,
  additionalProperties: AO
};
var gd = {};
Object.defineProperty(gd, "__esModule", { value: !0 });
const zg = eg;
zg.code = 'require("ajv/dist/runtime/uri").default';
gd.default = zg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Zt;
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
  const n = md(), i = Mi, s = qn, o = Et, a = de, c = We, u = Le, l = Y, d = RO, h = gd, p = (C, b) => new RegExp(C, b);
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
    var b, N, S, f, g, T, w, y, k, O, K, fe, ge, Ee, Te, Xe, _e, je, Ut, Ct, Pt, It, mr, yr, gr;
    const Tt = C.strict, Dt = (b = C.code) === null || b === void 0 ? void 0 : b.optimize, _r = Dt === !0 || Dt === void 0 ? 1 : Dt || 0, Dr = (S = (N = C.code) === null || N === void 0 ? void 0 : N.regExp) !== null && S !== void 0 ? S : p, _t = (f = C.uriResolver) !== null && f !== void 0 ? f : h.default;
    return {
      strictSchema: (T = (g = C.strictSchema) !== null && g !== void 0 ? g : Tt) !== null && T !== void 0 ? T : !0,
      strictNumbers: (y = (w = C.strictNumbers) !== null && w !== void 0 ? w : Tt) !== null && y !== void 0 ? y : !0,
      strictTypes: (O = (k = C.strictTypes) !== null && k !== void 0 ? k : Tt) !== null && O !== void 0 ? O : "log",
      strictTuples: (fe = (K = C.strictTuples) !== null && K !== void 0 ? K : Tt) !== null && fe !== void 0 ? fe : "log",
      strictRequired: (Ee = (ge = C.strictRequired) !== null && ge !== void 0 ? ge : Tt) !== null && Ee !== void 0 ? Ee : !1,
      code: C.code ? { ...C.code, optimize: _r, regExp: Dr } : { optimize: _r, regExp: Dr },
      loopRequired: (Te = C.loopRequired) !== null && Te !== void 0 ? Te : E,
      loopEnum: (Xe = C.loopEnum) !== null && Xe !== void 0 ? Xe : E,
      meta: (_e = C.meta) !== null && _e !== void 0 ? _e : !0,
      messages: (je = C.messages) !== null && je !== void 0 ? je : !0,
      inlineRefs: (Ut = C.inlineRefs) !== null && Ut !== void 0 ? Ut : !0,
      schemaId: (Ct = C.schemaId) !== null && Ct !== void 0 ? Ct : "$id",
      addUsedSchema: (Pt = C.addUsedSchema) !== null && Pt !== void 0 ? Pt : !0,
      validateSchema: (It = C.validateSchema) !== null && It !== void 0 ? It : !0,
      validateFormats: (mr = C.validateFormats) !== null && mr !== void 0 ? mr : !0,
      unicodeRegExp: (yr = C.unicodeRegExp) !== null && yr !== void 0 ? yr : !0,
      int32range: (gr = C.int32range) !== null && gr !== void 0 ? gr : !0,
      uriResolver: _t
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
        return (0, l.eachItem)(S, (g) => M.call(this, g)), this;
      L.call(this, N);
      const f = {
        ...N,
        type: (0, u.getJSONTypes)(N.type),
        schemaType: (0, u.getJSONTypes)(N.schemaType)
      };
      return (0, l.eachItem)(S, f.type.length === 0 ? (g) => M.call(this, g, f) : (g) => f.type.forEach((T) => M.call(this, g, f, T))), this;
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
  function M(C, b, N) {
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
  function L(C) {
    let { metaSchema: b } = C;
    b !== void 0 && (C.$data && this.opts.$data && (b = V(b)), C.validateSchema = this.compile(b, !0));
  }
  const H = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function V(C) {
    return { anyOf: [C, H] };
  }
})(hg);
var _d = {}, vd = {}, $d = {};
Object.defineProperty($d, "__esModule", { value: !0 });
const CO = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
$d.default = CO;
var Bn = {};
Object.defineProperty(Bn, "__esModule", { value: !0 });
Bn.callRef = Bn.getValidate = void 0;
const IO = Mi, qh = pe, wt = de, Zn = hr, Bh = Et, wo = Y, DO = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: i, schemaEnv: s, validateName: o, opts: a, self: c } = n, { root: u } = s;
    if ((r === "#" || r === "#/") && i === u.baseId)
      return d();
    const l = Bh.resolveRef.call(c, u, i, r);
    if (l === void 0)
      throw new IO.default(n.opts.uriResolver, i, r);
    if (l instanceof Bh.SchemaEnv)
      return h(l);
    return p(l);
    function d() {
      if (s === u)
        return Qo(e, o, s, s.$async);
      const $ = t.scopeValue("root", { ref: u });
      return Qo(e, (0, wt._)`${$}.validate`, u, u.$async);
    }
    function h($) {
      const _ = Gg(e, $);
      Qo(e, _, $, $.$async);
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
function Gg(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, wt._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Bn.getValidate = Gg;
function Qo(e, t, r, n) {
  const { gen: i, it: s } = e, { allErrors: o, schemaEnv: a, opts: c } = s, u = c.passContext ? Zn.default.this : wt.nil;
  n ? l() : d();
  function l() {
    if (!a.$async)
      throw new Error("async schema referenced by sync schema");
    const $ = i.let("valid");
    i.try(() => {
      i.code((0, wt._)`await ${(0, qh.callValidateCode)(e, t, u)}`), p(t), o || i.assign($, !0);
    }, (_) => {
      i.if((0, wt._)`!(${_} instanceof ${s.ValidationError})`, () => i.throw(_)), h(_), o || i.assign($, !1);
    }), e.ok($);
  }
  function d() {
    e.result((0, qh.callValidateCode)(e, t, u), () => p(t), () => h(t));
  }
  function h($) {
    const _ = (0, wt._)`${$}.errors`;
    i.assign(Zn.default.vErrors, (0, wt._)`${Zn.default.vErrors} === null ? ${_} : ${Zn.default.vErrors}.concat(${_})`), i.assign(Zn.default.errors, (0, wt._)`${Zn.default.vErrors}.length`);
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
        const m = i.var("props", (0, wt._)`${$}.evaluated.props`);
        s.props = wo.mergeEvaluated.props(i, m, s.props, wt.Name);
      }
    if (s.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (s.items = wo.mergeEvaluated.items(i, v.items, s.items));
      else {
        const m = i.var("items", (0, wt._)`${$}.evaluated.items`);
        s.items = wo.mergeEvaluated.items(i, m, s.items, wt.Name);
      }
  }
}
Bn.callRef = Qo;
Bn.default = DO;
Object.defineProperty(vd, "__esModule", { value: !0 });
const kO = $d, FO = Bn, jO = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  kO.default,
  FO.default
];
vd.default = jO;
var wd = {}, Ed = {};
Object.defineProperty(Ed, "__esModule", { value: !0 });
const pa = de, Hr = pa.operators, ma = {
  maximum: { okStr: "<=", ok: Hr.LTE, fail: Hr.GT },
  minimum: { okStr: ">=", ok: Hr.GTE, fail: Hr.LT },
  exclusiveMaximum: { okStr: "<", ok: Hr.LT, fail: Hr.GTE },
  exclusiveMinimum: { okStr: ">", ok: Hr.GT, fail: Hr.LTE }
}, MO = {
  message: ({ keyword: e, schemaCode: t }) => (0, pa.str)`must be ${ma[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, pa._)`{comparison: ${ma[e].okStr}, limit: ${t}}`
}, LO = {
  keyword: Object.keys(ma),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: MO,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, pa._)`${r} ${ma[t].fail} ${n} || isNaN(${r})`);
  }
};
Ed.default = LO;
var bd = {};
Object.defineProperty(bd, "__esModule", { value: !0 });
const ms = de, UO = {
  message: ({ schemaCode: e }) => (0, ms.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, ms._)`{multipleOf: ${e}}`
}, xO = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: UO,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: i } = e, s = i.opts.multipleOfPrecision, o = t.let("res"), a = s ? (0, ms._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${s}` : (0, ms._)`${o} !== parseInt(${o})`;
    e.fail$data((0, ms._)`(${n} === 0 || (${o} = ${r}/${n}, ${a}))`);
  }
};
bd.default = xO;
var Sd = {}, Pd = {};
Object.defineProperty(Pd, "__esModule", { value: !0 });
function Wg(e) {
  const t = e.length;
  let r = 0, n = 0, i;
  for (; n < t; )
    r++, i = e.charCodeAt(n++), i >= 55296 && i <= 56319 && n < t && (i = e.charCodeAt(n), (i & 64512) === 56320 && n++);
  return r;
}
Pd.default = Wg;
Wg.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Sd, "__esModule", { value: !0 });
const In = de, VO = Y, qO = Pd, BO = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, In.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, In._)`{limit: ${e}}`
}, HO = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: BO,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: i } = e, s = t === "maxLength" ? In.operators.GT : In.operators.LT, o = i.opts.unicode === !1 ? (0, In._)`${r}.length` : (0, In._)`${(0, VO.useFunc)(e.gen, qO.default)}(${r})`;
    e.fail$data((0, In._)`${o} ${s} ${n}`);
  }
};
Sd.default = HO;
var Td = {};
Object.defineProperty(Td, "__esModule", { value: !0 });
const zO = pe, ya = de, GO = {
  message: ({ schemaCode: e }) => (0, ya.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, ya._)`{pattern: ${e}}`
}, WO = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: GO,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: i, it: s } = e, o = s.opts.unicodeRegExp ? "u" : "", a = r ? (0, ya._)`(new RegExp(${i}, ${o}))` : (0, zO.usePattern)(e, n);
    e.fail$data((0, ya._)`!${a}.test(${t})`);
  }
};
Td.default = WO;
var Nd = {};
Object.defineProperty(Nd, "__esModule", { value: !0 });
const ys = de, KO = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, ys.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, ys._)`{limit: ${e}}`
}, YO = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: KO,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxProperties" ? ys.operators.GT : ys.operators.LT;
    e.fail$data((0, ys._)`Object.keys(${r}).length ${i} ${n}`);
  }
};
Nd.default = YO;
var Od = {};
Object.defineProperty(Od, "__esModule", { value: !0 });
const Qi = pe, gs = de, XO = Y, JO = {
  message: ({ params: { missingProperty: e } }) => (0, gs.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, gs._)`{missingProperty: ${e}}`
}, QO = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: JO,
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
          (0, XO.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function u() {
      if (c || s)
        e.block$data(gs.nil, d);
      else
        for (const p of r)
          (0, Qi.checkReportMissingProp)(e, p);
    }
    function l() {
      const p = t.let("missing");
      if (c || s) {
        const $ = t.let("valid", !0);
        e.block$data($, () => h(p, $)), e.ok($);
      } else
        t.if((0, Qi.checkMissingProp)(e, r, p)), (0, Qi.reportMissingProp)(e, p), t.else();
    }
    function d() {
      t.forOf("prop", n, (p) => {
        e.setParams({ missingProperty: p }), t.if((0, Qi.noPropertyInData)(t, i, p, a.ownProperties), () => e.error());
      });
    }
    function h(p, $) {
      e.setParams({ missingProperty: p }), t.forOf(p, n, () => {
        t.assign($, (0, Qi.propertyInData)(t, i, p, a.ownProperties)), t.if((0, gs.not)($), () => {
          e.error(), t.break();
        });
      }, gs.nil);
    }
  }
};
Od.default = QO;
var Ad = {};
Object.defineProperty(Ad, "__esModule", { value: !0 });
const _s = de, ZO = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, _s.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, _s._)`{limit: ${e}}`
}, eA = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: ZO,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, i = t === "maxItems" ? _s.operators.GT : _s.operators.LT;
    e.fail$data((0, _s._)`${r}.length ${i} ${n}`);
  }
};
Ad.default = eA;
var Rd = {}, Gs = {};
Object.defineProperty(Gs, "__esModule", { value: !0 });
const Kg = ka;
Kg.code = 'require("ajv/dist/runtime/equal").default';
Gs.default = Kg;
Object.defineProperty(Rd, "__esModule", { value: !0 });
const kc = Le, ze = de, tA = Y, rA = Gs, nA = {
  message: ({ params: { i: e, j: t } }) => (0, ze.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ze._)`{i: ${e}, j: ${t}}`
}, iA = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: nA,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, parentSchema: s, schemaCode: o, it: a } = e;
    if (!n && !i)
      return;
    const c = t.let("valid"), u = s.items ? (0, kc.getSchemaTypes)(s.items) : [];
    e.block$data(c, l, (0, ze._)`${o} === false`), e.ok(c);
    function l() {
      const $ = t.let("i", (0, ze._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: $, j: _ }), t.assign(c, !0), t.if((0, ze._)`${$} > 1`, () => (d() ? h : p)($, _));
    }
    function d() {
      return u.length > 0 && !u.some(($) => $ === "object" || $ === "array");
    }
    function h($, _) {
      const v = t.name("item"), m = (0, kc.checkDataTypes)(u, v, a.opts.strictNumbers, kc.DataType.Wrong), E = t.const("indices", (0, ze._)`{}`);
      t.for((0, ze._)`;${$}--;`, () => {
        t.let(v, (0, ze._)`${r}[${$}]`), t.if(m, (0, ze._)`continue`), u.length > 1 && t.if((0, ze._)`typeof ${v} == "string"`, (0, ze._)`${v} += "_"`), t.if((0, ze._)`typeof ${E}[${v}] == "number"`, () => {
          t.assign(_, (0, ze._)`${E}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ze._)`${E}[${v}] = ${$}`);
      });
    }
    function p($, _) {
      const v = (0, tA.useFunc)(t, rA.default), m = t.name("outer");
      t.label(m).for((0, ze._)`;${$}--;`, () => t.for((0, ze._)`${_} = ${$}; ${_}--;`, () => t.if((0, ze._)`${v}(${r}[${$}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Rd.default = iA;
var Cd = {};
Object.defineProperty(Cd, "__esModule", { value: !0 });
const kl = de, sA = Y, oA = Gs, aA = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, kl._)`{allowedValue: ${e}}`
}, cA = {
  keyword: "const",
  $data: !0,
  error: aA,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: i, schema: s } = e;
    n || s && typeof s == "object" ? e.fail$data((0, kl._)`!${(0, sA.useFunc)(t, oA.default)}(${r}, ${i})`) : e.fail((0, kl._)`${s} !== ${r}`);
  }
};
Cd.default = cA;
var Id = {};
Object.defineProperty(Id, "__esModule", { value: !0 });
const os = de, lA = Y, uA = Gs, dA = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, os._)`{allowedValues: ${e}}`
}, fA = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: dA,
  code(e) {
    const { gen: t, data: r, $data: n, schema: i, schemaCode: s, it: o } = e;
    if (!n && i.length === 0)
      throw new Error("enum must have non-empty array");
    const a = i.length >= o.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, lA.useFunc)(t, uA.default));
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
Id.default = fA;
Object.defineProperty(wd, "__esModule", { value: !0 });
const hA = Ed, pA = bd, mA = Sd, yA = Td, gA = Nd, _A = Od, vA = Ad, $A = Rd, wA = Cd, EA = Id, bA = [
  // number
  hA.default,
  pA.default,
  // string
  mA.default,
  yA.default,
  // object
  gA.default,
  _A.default,
  // array
  vA.default,
  $A.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  wA.default,
  EA.default
];
wd.default = bA;
var Dd = {}, Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.validateAdditionalItems = void 0;
const Dn = de, Fl = Y, SA = {
  message: ({ params: { len: e } }) => (0, Dn.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Dn._)`{limit: ${e}}`
}, PA = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: SA,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, Fl.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Yg(e, n);
  }
};
function Yg(e, t) {
  const { gen: r, schema: n, data: i, keyword: s, it: o } = e;
  o.items = !0;
  const a = r.const("len", (0, Dn._)`${i}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Dn._)`${a} <= ${t.length}`);
  else if (typeof n == "object" && !(0, Fl.alwaysValidSchema)(o, n)) {
    const u = r.var("valid", (0, Dn._)`${a} <= ${t.length}`);
    r.if((0, Dn.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    r.forRange("i", t.length, a, (l) => {
      e.subschema({ keyword: s, dataProp: l, dataPropType: Fl.Type.Num }, u), o.allErrors || r.if((0, Dn.not)(u), () => r.break());
    });
  }
}
Li.validateAdditionalItems = Yg;
Li.default = PA;
var kd = {}, Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.validateTuple = void 0;
const Hh = de, Zo = Y, TA = pe, NA = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Xg(e, "additionalItems", t);
    r.items = !0, !(0, Zo.alwaysValidSchema)(r, t) && e.ok((0, TA.validateArray)(e));
  }
};
function Xg(e, t, r = e.schema) {
  const { gen: n, parentSchema: i, data: s, keyword: o, it: a } = e;
  l(i), a.opts.unevaluated && r.length && a.items !== !0 && (a.items = Zo.mergeEvaluated.items(n, r.length, a.items));
  const c = n.name("valid"), u = n.const("len", (0, Hh._)`${s}.length`);
  r.forEach((d, h) => {
    (0, Zo.alwaysValidSchema)(a, d) || (n.if((0, Hh._)`${u} > ${h}`, () => e.subschema({
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
Ui.validateTuple = Xg;
Ui.default = NA;
Object.defineProperty(kd, "__esModule", { value: !0 });
const OA = Ui, AA = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, OA.validateTuple)(e, "items")
};
kd.default = AA;
var Fd = {};
Object.defineProperty(Fd, "__esModule", { value: !0 });
const zh = de, RA = Y, CA = pe, IA = Li, DA = {
  message: ({ params: { len: e } }) => (0, zh.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, zh._)`{limit: ${e}}`
}, kA = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: DA,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: i } = r;
    n.items = !0, !(0, RA.alwaysValidSchema)(n, t) && (i ? (0, IA.validateAdditionalItems)(e, i) : e.ok((0, CA.validateArray)(e)));
  }
};
Fd.default = kA;
var jd = {};
Object.defineProperty(jd, "__esModule", { value: !0 });
const Lt = de, Eo = Y, FA = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Lt.str)`must contain at least ${e} valid item(s)` : (0, Lt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Lt._)`{minContains: ${e}}` : (0, Lt._)`{minContains: ${e}, maxContains: ${t}}`
}, jA = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: FA,
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
jd.default = jA;
var Jg = {};
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
})(Jg);
var Md = {};
Object.defineProperty(Md, "__esModule", { value: !0 });
const Qg = de, MA = Y, LA = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Qg._)`{propertyName: ${e.propertyName}}`
}, UA = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: LA,
  code(e) {
    const { gen: t, schema: r, data: n, it: i } = e;
    if ((0, MA.alwaysValidSchema)(i, r))
      return;
    const s = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, s), t.if((0, Qg.not)(s), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(s);
  }
};
Md.default = UA;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const bo = pe, Gt = de, xA = hr, So = Y, VA = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Gt._)`{additionalProperty: ${e.additionalProperty}}`
}, qA = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: VA,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, errsCount: s, it: o } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: a, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, So.alwaysValidSchema)(o, r))
      return;
    const u = (0, bo.allSchemaProperties)(n.properties), l = (0, bo.allSchemaProperties)(n.patternProperties);
    d(), e.ok((0, Gt._)`${s} === ${xA.default.errors}`);
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
      } else u.length ? m = (0, Gt.or)(...u.map((E) => (0, Gt._)`${v} === ${E}`)) : m = Gt.nil;
      return l.length && (m = (0, Gt.or)(m, ...l.map((E) => (0, Gt._)`${(0, bo.usePattern)(e, E)}.test(${v})`))), (0, Gt.not)(m);
    }
    function p(v) {
      t.code((0, Gt._)`delete ${i}[${v}]`);
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
        c.removeAdditional === "failing" ? (_(v, m, !1), t.if((0, Gt.not)(m), () => {
          e.reset(), p(v);
        })) : (_(v, m), a || t.if((0, Gt.not)(m), () => t.break()));
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
Ha.default = qA;
var Ld = {};
Object.defineProperty(Ld, "__esModule", { value: !0 });
const BA = Zt, Gh = pe, Fc = Y, Wh = Ha, HA = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: i, it: s } = e;
    s.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Wh.default.code(new BA.KeywordCxt(s, Wh.default, "additionalProperties"));
    const o = (0, Gh.allSchemaProperties)(r);
    for (const d of o)
      s.definedProperties.add(d);
    s.opts.unevaluated && o.length && s.props !== !0 && (s.props = Fc.mergeEvaluated.props(t, (0, Fc.toHash)(o), s.props));
    const a = o.filter((d) => !(0, Fc.alwaysValidSchema)(s, r[d]));
    if (a.length === 0)
      return;
    const c = t.name("valid");
    for (const d of a)
      u(d) ? l(d) : (t.if((0, Gh.propertyInData)(t, i, d, s.opts.ownProperties)), l(d), s.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(d), e.ok(c);
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
Ld.default = HA;
var Ud = {};
Object.defineProperty(Ud, "__esModule", { value: !0 });
const Kh = pe, Po = de, Yh = Y, Xh = Y, zA = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: i, it: s } = e, { opts: o } = s, a = (0, Kh.allSchemaProperties)(r), c = a.filter((_) => (0, Yh.alwaysValidSchema)(s, r[_]));
    if (a.length === 0 || c.length === a.length && (!s.opts.unevaluated || s.props === !0))
      return;
    const u = o.strictSchema && !o.allowMatchingProperties && i.properties, l = t.name("valid");
    s.props !== !0 && !(s.props instanceof Po.Name) && (s.props = (0, Xh.evaluatedPropsToName)(t, s.props));
    const { props: d } = s;
    h();
    function h() {
      for (const _ of a)
        u && p(_), s.allErrors ? $(_) : (t.var(l, !0), $(_), t.if(l));
    }
    function p(_) {
      for (const v in u)
        new RegExp(_).test(v) && (0, Yh.checkStrictMode)(s, `property ${v} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function $(_) {
      t.forIn("key", n, (v) => {
        t.if((0, Po._)`${(0, Kh.usePattern)(e, _)}.test(${v})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: v,
            dataPropType: Xh.Type.Str
          }, l), s.opts.unevaluated && d !== !0 ? t.assign((0, Po._)`${d}[${v}]`, !0) : !m && !s.allErrors && t.if((0, Po.not)(l), () => t.break());
        });
      });
    }
  }
};
Ud.default = zA;
var xd = {};
Object.defineProperty(xd, "__esModule", { value: !0 });
const GA = Y, WA = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, GA.alwaysValidSchema)(n, r)) {
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
xd.default = WA;
var Vd = {};
Object.defineProperty(Vd, "__esModule", { value: !0 });
const KA = pe, YA = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: KA.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Vd.default = YA;
var qd = {};
Object.defineProperty(qd, "__esModule", { value: !0 });
const ea = de, XA = Y, JA = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, ea._)`{passingSchemas: ${e.passing}}`
}, QA = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: JA,
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
        (0, XA.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
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
qd.default = QA;
var Bd = {};
Object.defineProperty(Bd, "__esModule", { value: !0 });
const ZA = Y, eR = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    r.forEach((s, o) => {
      if ((0, ZA.alwaysValidSchema)(n, s))
        return;
      const a = e.subschema({ keyword: "allOf", schemaProp: o }, i);
      e.ok(i), e.mergeEvaluated(a);
    });
  }
};
Bd.default = eR;
var Hd = {};
Object.defineProperty(Hd, "__esModule", { value: !0 });
const ga = de, Zg = Y, tR = {
  message: ({ params: e }) => (0, ga.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ga._)`{failingKeyword: ${e.ifClause}}`
}, rR = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: tR,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Zg.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const i = Jh(n, "then"), s = Jh(n, "else");
    if (!i && !s)
      return;
    const o = t.let("valid", !0), a = t.name("_valid");
    if (c(), e.reset(), i && s) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(a, u("then", l), u("else", l));
    } else i ? t.if(a, u("then")) : t.if((0, ga.not)(a), u("else"));
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
        t.assign(o, a), e.mergeValidEvaluated(h, o), d ? t.assign(d, (0, ga._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Jh(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Zg.alwaysValidSchema)(e, r);
}
Hd.default = rR;
var zd = {};
Object.defineProperty(zd, "__esModule", { value: !0 });
const nR = Y, iR = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, nR.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
zd.default = iR;
Object.defineProperty(Dd, "__esModule", { value: !0 });
const sR = Li, oR = kd, aR = Ui, cR = Fd, lR = jd, uR = Jg, dR = Md, fR = Ha, hR = Ld, pR = Ud, mR = xd, yR = Vd, gR = qd, _R = Bd, vR = Hd, $R = zd;
function wR(e = !1) {
  const t = [
    // any
    mR.default,
    yR.default,
    gR.default,
    _R.default,
    vR.default,
    $R.default,
    // object
    dR.default,
    fR.default,
    uR.default,
    hR.default,
    pR.default
  ];
  return e ? t.push(oR.default, cR.default) : t.push(sR.default, aR.default), t.push(lR.default), t;
}
Dd.default = wR;
var Gd = {}, Wd = {};
Object.defineProperty(Wd, "__esModule", { value: !0 });
const De = de, ER = {
  message: ({ schemaCode: e }) => (0, De.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, De._)`{format: ${e}}`
}, bR = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: ER,
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
Wd.default = bR;
Object.defineProperty(Gd, "__esModule", { value: !0 });
const SR = Wd, PR = [SR.default];
Gd.default = PR;
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.contentVocabulary = Ni.metadataVocabulary = void 0;
Ni.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Ni.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(_d, "__esModule", { value: !0 });
const TR = vd, NR = wd, OR = Dd, AR = Gd, Qh = Ni, RR = [
  TR.default,
  NR.default,
  (0, OR.default)(),
  AR.default,
  Qh.metadataVocabulary,
  Qh.contentVocabulary
];
_d.default = RR;
var Kd = {}, za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
za.DiscrError = void 0;
var Zh;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Zh || (za.DiscrError = Zh = {}));
Object.defineProperty(Kd, "__esModule", { value: !0 });
const ai = de, jl = za, ep = Et, CR = Mi, IR = Y, DR = {
  message: ({ params: { discrError: e, tagName: t } }) => e === jl.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, ai._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, kR = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: DR,
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
    t.if((0, ai._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: jl.DiscrError.Tag, tag: u, tagName: a })), e.ok(c);
    function l() {
      const p = h();
      t.if(!1);
      for (const $ in p)
        t.elseIf((0, ai._)`${u} === ${$}`), t.assign(c, d(p[$]));
      t.else(), e.error(!1, { discrError: jl.DiscrError.Mapping, tag: u, tagName: a }), t.endIf();
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
        if (F != null && F.$ref && !(0, IR.schemaHasRulesButRef)(F, s.self.RULES)) {
          const G = F.$ref;
          if (F = ep.resolveRef.call(s.self, s.schemaEnv.root, s.baseId, G), F instanceof ep.SchemaEnv && (F = F.schema), F === void 0)
            throw new CR.default(s.opts.uriResolver, s.baseId, G);
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
Kd.default = kR;
const FR = "http://json-schema.org/draft-07/schema#", jR = "http://json-schema.org/draft-07/schema#", MR = "Core schema meta-schema", LR = {
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
}, UR = [
  "object",
  "boolean"
], xR = {
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
}, VR = {
  $schema: FR,
  $id: jR,
  title: MR,
  definitions: LR,
  type: UR,
  properties: xR,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = hg, n = _d, i = Kd, s = VR, o = ["/properties"], a = "http://json-schema.org/draft-07/schema";
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
  var u = Zt;
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
  var d = md();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return d.default;
  } });
  var h = Mi;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Al, Al.exports);
var qR = Al.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = qR, r = de, n = r.operators, i = {
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
})(fg);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = dg, n = fg, i = de, s = new i.Name("fullFormats"), o = new i.Name("fastFormats"), a = (u, l = { keywords: !0 }) => {
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
})(Ol, Ol.exports);
var BR = Ol.exports;
const HR = /* @__PURE__ */ dy(BR), zR = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const i = Object.getOwnPropertyDescriptor(e, r), s = Object.getOwnPropertyDescriptor(t, r);
  !GR(i, s) && n || Object.defineProperty(e, r, s);
}, GR = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, WR = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, KR = (e, t) => `/* Wrapped ${e}*/
${t}`, YR = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), XR = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), JR = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, i = KR.bind(null, n, t.toString());
  Object.defineProperty(i, "name", XR);
  const { writable: s, enumerable: o, configurable: a } = YR;
  Object.defineProperty(e, "toString", { value: i, writable: s, enumerable: o, configurable: a });
};
function QR(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const i of Reflect.ownKeys(t))
    zR(e, t, i, r);
  return WR(e, t), JR(e, t, n), e;
}
const tp = (e, t = {}) => {
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
  return QR(u, e), u.cancel = () => {
    o && (clearTimeout(o), o = void 0), a && (clearTimeout(a), a = void 0);
  }, u;
};
var Ml = { exports: {} };
const ZR = "2.0.0", e0 = 256, eC = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, tC = 16, rC = e0 - 6, nC = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Ga = {
  MAX_LENGTH: e0,
  MAX_SAFE_COMPONENT_LENGTH: tC,
  MAX_SAFE_BUILD_LENGTH: rC,
  MAX_SAFE_INTEGER: eC,
  RELEASE_TYPES: nC,
  SEMVER_SPEC_VERSION: ZR,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const iC = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Wa = iC;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = Ga, s = Wa;
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
})(Ml, Ml.exports);
var Ws = Ml.exports;
const sC = Object.freeze({ loose: !0 }), oC = Object.freeze({}), aC = (e) => e ? typeof e != "object" ? sC : e : oC;
var Yd = aC;
const rp = /^[0-9]+$/, t0 = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = rp.test(e), n = rp.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, cC = (e, t) => t0(t, e);
var r0 = {
  compareIdentifiers: t0,
  rcompareIdentifiers: cC
};
const To = Wa, { MAX_LENGTH: np, MAX_SAFE_INTEGER: No } = Ga, { safeRe: Oo, t: Ao } = Ws, lC = Yd, { compareIdentifiers: jc } = r0;
let uC = class sr {
  constructor(t, r) {
    if (r = lC(r), t instanceof sr) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > np)
      throw new TypeError(
        `version is longer than ${np} characters`
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
    if (To("SemVer.compare", this.version, this.options, t), !(t instanceof sr)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new sr(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof sr || (t = new sr(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof sr || (t = new sr(t, this.options)), this.prerelease.length && !t.prerelease.length)
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
      return jc(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof sr || (t = new sr(t, this.options));
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
      return jc(n, i);
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
          n === !1 && (s = [r]), jc(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = s) : this.prerelease = s;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var pt = uC;
const ip = pt, dC = (e, t, r = !1) => {
  if (e instanceof ip)
    return e;
  try {
    return new ip(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var xi = dC;
const fC = xi, hC = (e, t) => {
  const r = fC(e, t);
  return r ? r.version : null;
};
var pC = hC;
const mC = xi, yC = (e, t) => {
  const r = mC(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var gC = yC;
const sp = pt, _C = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new sp(
      e instanceof sp ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var vC = _C;
const op = xi, $C = (e, t) => {
  const r = op(e, null, !0), n = op(t, null, !0), i = r.compare(n);
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
var wC = $C;
const EC = pt, bC = (e, t) => new EC(e, t).major;
var SC = bC;
const PC = pt, TC = (e, t) => new PC(e, t).minor;
var NC = TC;
const OC = pt, AC = (e, t) => new OC(e, t).patch;
var RC = AC;
const CC = xi, IC = (e, t) => {
  const r = CC(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var DC = IC;
const ap = pt, kC = (e, t, r) => new ap(e, r).compare(new ap(t, r));
var er = kC;
const FC = er, jC = (e, t, r) => FC(t, e, r);
var MC = jC;
const LC = er, UC = (e, t) => LC(e, t, !0);
var xC = UC;
const cp = pt, VC = (e, t, r) => {
  const n = new cp(e, r), i = new cp(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var Xd = VC;
const qC = Xd, BC = (e, t) => e.sort((r, n) => qC(r, n, t));
var HC = BC;
const zC = Xd, GC = (e, t) => e.sort((r, n) => zC(n, r, t));
var WC = GC;
const KC = er, YC = (e, t, r) => KC(e, t, r) > 0;
var Ka = YC;
const XC = er, JC = (e, t, r) => XC(e, t, r) < 0;
var Jd = JC;
const QC = er, ZC = (e, t, r) => QC(e, t, r) === 0;
var n0 = ZC;
const eI = er, tI = (e, t, r) => eI(e, t, r) !== 0;
var i0 = tI;
const rI = er, nI = (e, t, r) => rI(e, t, r) >= 0;
var Qd = nI;
const iI = er, sI = (e, t, r) => iI(e, t, r) <= 0;
var Zd = sI;
const oI = n0, aI = i0, cI = Ka, lI = Qd, uI = Jd, dI = Zd, fI = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return oI(e, r, n);
    case "!=":
      return aI(e, r, n);
    case ">":
      return cI(e, r, n);
    case ">=":
      return lI(e, r, n);
    case "<":
      return uI(e, r, n);
    case "<=":
      return dI(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var s0 = fI;
const hI = pt, pI = xi, { safeRe: Ro, t: Co } = Ws, mI = (e, t) => {
  if (e instanceof hI)
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
  return pI(`${n}.${i}.${s}${o}${a}`, t);
};
var yI = mI;
class gI {
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
var _I = gI, Mc, lp;
function tr() {
  if (lp) return Mc;
  lp = 1;
  const e = /\s+/g;
  class t {
    constructor(M, B) {
      if (B = i(B), M instanceof t)
        return M.loose === !!B.loose && M.includePrerelease === !!B.includePrerelease ? M : new t(M.raw, B);
      if (M instanceof s)
        return this.raw = M.value, this.set = [[M]], this.formatted = void 0, this;
      if (this.options = B, this.loose = !!B.loose, this.includePrerelease = !!B.includePrerelease, this.raw = M.trim().replace(e, " "), this.set = this.raw.split("||").map((L) => this.parseRange(L.trim())).filter((L) => L.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const L = this.set[0];
        if (this.set = this.set.filter((H) => !_(H[0])), this.set.length === 0)
          this.set = [L];
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
        for (let M = 0; M < this.set.length; M++) {
          M > 0 && (this.formatted += "||");
          const B = this.set[M];
          for (let L = 0; L < B.length; L++)
            L > 0 && (this.formatted += " "), this.formatted += B[L].toString().trim();
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
    parseRange(M) {
      const L = ((this.options.includePrerelease && p) | (this.options.loose && $)) + ":" + M, H = n.get(L);
      if (H)
        return H;
      const V = this.options.loose, C = V ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      M = M.replace(C, q(this.options.includePrerelease)), o("hyphen replace", M), M = M.replace(c[u.COMPARATORTRIM], l), o("comparator trim", M), M = M.replace(c[u.TILDETRIM], d), o("tilde trim", M), M = M.replace(c[u.CARETTRIM], h), o("caret trim", M);
      let b = M.split(" ").map((g) => E(g, this.options)).join(" ").split(/\s+/).map((g) => x(g, this.options));
      V && (b = b.filter((g) => (o("loose invalid filter", g, this.options), !!g.match(c[u.COMPARATORLOOSE])))), o("range list", b);
      const N = /* @__PURE__ */ new Map(), S = b.map((g) => new s(g, this.options));
      for (const g of S) {
        if (_(g))
          return [g];
        N.set(g.value, g);
      }
      N.size > 1 && N.has("") && N.delete("");
      const f = [...N.values()];
      return n.set(L, f), f;
    }
    intersects(M, B) {
      if (!(M instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((L) => m(L, B) && M.set.some((H) => m(H, B) && L.every((V) => H.every((C) => V.intersects(C, B)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(M) {
      if (!M)
        return !1;
      if (typeof M == "string")
        try {
          M = new a(M, this.options);
        } catch {
          return !1;
        }
      for (let B = 0; B < this.set.length; B++)
        if (J(this.set[B], M, this.options))
          return !0;
      return !1;
    }
  }
  Mc = t;
  const r = _I, n = new r(), i = Yd, s = Ya(), o = Wa, a = pt, {
    safeRe: c,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: d,
    caretTrimReplace: h
  } = Ws, { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: $ } = Ga, _ = (j) => j.value === "<0.0.0-0", v = (j) => j.value === "", m = (j, M) => {
    let B = !0;
    const L = j.slice();
    let H = L.pop();
    for (; B && L.length; )
      B = L.every((V) => H.intersects(V, M)), H = L.pop();
    return B;
  }, E = (j, M) => (j = j.replace(c[u.BUILD], ""), o("comp", j, M), j = z(j, M), o("caret", j), j = I(j, M), o("tildes", j), j = me(j, M), o("xrange", j), j = Q(j, M), o("stars", j), j), A = (j) => !j || j.toLowerCase() === "x" || j === "*", I = (j, M) => j.trim().split(/\s+/).map((B) => F(B, M)).join(" "), F = (j, M) => {
    const B = M.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return j.replace(B, (L, H, V, C, b) => {
      o("tilde", j, L, H, V, C, b);
      let N;
      return A(H) ? N = "" : A(V) ? N = `>=${H}.0.0 <${+H + 1}.0.0-0` : A(C) ? N = `>=${H}.${V}.0 <${H}.${+V + 1}.0-0` : b ? (o("replaceTilde pr", b), N = `>=${H}.${V}.${C}-${b} <${H}.${+V + 1}.0-0`) : N = `>=${H}.${V}.${C} <${H}.${+V + 1}.0-0`, o("tilde return", N), N;
    });
  }, z = (j, M) => j.trim().split(/\s+/).map((B) => G(B, M)).join(" "), G = (j, M) => {
    o("caret", j, M);
    const B = M.loose ? c[u.CARETLOOSE] : c[u.CARET], L = M.includePrerelease ? "-0" : "";
    return j.replace(B, (H, V, C, b, N) => {
      o("caret", j, H, V, C, b, N);
      let S;
      return A(V) ? S = "" : A(C) ? S = `>=${V}.0.0${L} <${+V + 1}.0.0-0` : A(b) ? V === "0" ? S = `>=${V}.${C}.0${L} <${V}.${+C + 1}.0-0` : S = `>=${V}.${C}.0${L} <${+V + 1}.0.0-0` : N ? (o("replaceCaret pr", N), V === "0" ? C === "0" ? S = `>=${V}.${C}.${b}-${N} <${V}.${C}.${+b + 1}-0` : S = `>=${V}.${C}.${b}-${N} <${V}.${+C + 1}.0-0` : S = `>=${V}.${C}.${b}-${N} <${+V + 1}.0.0-0`) : (o("no pr"), V === "0" ? C === "0" ? S = `>=${V}.${C}.${b}${L} <${V}.${C}.${+b + 1}-0` : S = `>=${V}.${C}.${b}${L} <${V}.${+C + 1}.0-0` : S = `>=${V}.${C}.${b} <${+V + 1}.0.0-0`), o("caret return", S), S;
    });
  }, me = (j, M) => (o("replaceXRanges", j, M), j.split(/\s+/).map((B) => R(B, M)).join(" ")), R = (j, M) => {
    j = j.trim();
    const B = M.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return j.replace(B, (L, H, V, C, b, N) => {
      o("xRange", j, L, H, V, C, b, N);
      const S = A(V), f = S || A(C), g = f || A(b), T = g;
      return H === "=" && T && (H = ""), N = M.includePrerelease ? "-0" : "", S ? H === ">" || H === "<" ? L = "<0.0.0-0" : L = "*" : H && T ? (f && (C = 0), b = 0, H === ">" ? (H = ">=", f ? (V = +V + 1, C = 0, b = 0) : (C = +C + 1, b = 0)) : H === "<=" && (H = "<", f ? V = +V + 1 : C = +C + 1), H === "<" && (N = "-0"), L = `${H + V}.${C}.${b}${N}`) : f ? L = `>=${V}.0.0${N} <${+V + 1}.0.0-0` : g && (L = `>=${V}.${C}.0${N} <${V}.${+C + 1}.0-0`), o("xRange return", L), L;
    });
  }, Q = (j, M) => (o("replaceStars", j, M), j.trim().replace(c[u.STAR], "")), x = (j, M) => (o("replaceGTE0", j, M), j.trim().replace(c[M.includePrerelease ? u.GTE0PRE : u.GTE0], "")), q = (j) => (M, B, L, H, V, C, b, N, S, f, g, T) => (A(L) ? B = "" : A(H) ? B = `>=${L}.0.0${j ? "-0" : ""}` : A(V) ? B = `>=${L}.${H}.0${j ? "-0" : ""}` : C ? B = `>=${B}` : B = `>=${B}${j ? "-0" : ""}`, A(S) ? N = "" : A(f) ? N = `<${+S + 1}.0.0-0` : A(g) ? N = `<${S}.${+f + 1}.0-0` : T ? N = `<=${S}.${f}.${g}-${T}` : j ? N = `<${S}.${f}.${+g + 1}-0` : N = `<=${N}`, `${B} ${N}`.trim()), J = (j, M, B) => {
    for (let L = 0; L < j.length; L++)
      if (!j[L].test(M))
        return !1;
    if (M.prerelease.length && !B.includePrerelease) {
      for (let L = 0; L < j.length; L++)
        if (o(j[L].semver), j[L].semver !== s.ANY && j[L].semver.prerelease.length > 0) {
          const H = j[L].semver;
          if (H.major === M.major && H.minor === M.minor && H.patch === M.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Mc;
}
var Lc, up;
function Ya() {
  if (up) return Lc;
  up = 1;
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
  Lc = t;
  const r = Yd, { safeRe: n, t: i } = Ws, s = s0, o = Wa, a = pt, c = tr();
  return Lc;
}
const vI = tr(), $I = (e, t, r) => {
  try {
    t = new vI(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Xa = $I;
const wI = tr(), EI = (e, t) => new wI(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var bI = EI;
const SI = pt, PI = tr(), TI = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new PI(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === -1) && (n = o, i = new SI(n, r));
  }), n;
};
var NI = TI;
const OI = pt, AI = tr(), RI = (e, t, r) => {
  let n = null, i = null, s = null;
  try {
    s = new AI(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    s.test(o) && (!n || i.compare(o) === 1) && (n = o, i = new OI(n, r));
  }), n;
};
var CI = RI;
const Uc = pt, II = tr(), dp = Ka, DI = (e, t) => {
  e = new II(e, t);
  let r = new Uc("0.0.0");
  if (e.test(r) || (r = new Uc("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let s = null;
    i.forEach((o) => {
      const a = new Uc(o.semver.version);
      switch (o.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!s || dp(a, s)) && (s = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), s && (!r || dp(r, s)) && (r = s);
  }
  return r && e.test(r) ? r : null;
};
var kI = DI;
const FI = tr(), jI = (e, t) => {
  try {
    return new FI(e, t).range || "*";
  } catch {
    return null;
  }
};
var MI = jI;
const LI = pt, o0 = Ya(), { ANY: UI } = o0, xI = tr(), VI = Xa, fp = Ka, hp = Jd, qI = Zd, BI = Qd, HI = (e, t, r, n) => {
  e = new LI(e, n), t = new xI(t, n);
  let i, s, o, a, c;
  switch (r) {
    case ">":
      i = fp, s = qI, o = hp, a = ">", c = ">=";
      break;
    case "<":
      i = hp, s = BI, o = fp, a = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (VI(e, t, n))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let d = null, h = null;
    if (l.forEach((p) => {
      p.semver === UI && (p = new o0(">=0.0.0")), d = d || p, h = h || p, i(p.semver, d.semver, n) ? d = p : o(p.semver, h.semver, n) && (h = p);
    }), d.operator === a || d.operator === c || (!h.operator || h.operator === a) && s(e, h.semver))
      return !1;
    if (h.operator === c && o(e, h.semver))
      return !1;
  }
  return !0;
};
var ef = HI;
const zI = ef, GI = (e, t, r) => zI(e, t, ">", r);
var WI = GI;
const KI = ef, YI = (e, t, r) => KI(e, t, "<", r);
var XI = YI;
const pp = tr(), JI = (e, t, r) => (e = new pp(e, r), t = new pp(t, r), e.intersects(t, r));
var QI = JI;
const ZI = Xa, eD = er;
var tD = (e, t, r) => {
  const n = [];
  let i = null, s = null;
  const o = e.sort((l, d) => eD(l, d, r));
  for (const l of o)
    ZI(l, t, r) ? (s = l, i || (i = l)) : (s && n.push([i, s]), s = null, i = null);
  i && n.push([i, null]);
  const a = [];
  for (const [l, d] of n)
    l === d ? a.push(l) : !d && l === o[0] ? a.push("*") : d ? l === o[0] ? a.push(`<=${d}`) : a.push(`${l} - ${d}`) : a.push(`>=${l}`);
  const c = a.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < u.length ? c : t;
};
const mp = tr(), tf = Ya(), { ANY: xc } = tf, Zi = Xa, rf = er, rD = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new mp(e, r), t = new mp(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const s of t.set) {
      const o = iD(i, s, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, nD = [new tf(">=0.0.0-0")], yp = [new tf(">=0.0.0")], iD = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === xc) {
    if (t.length === 1 && t[0].semver === xc)
      return !0;
    r.includePrerelease ? e = nD : e = yp;
  }
  if (t.length === 1 && t[0].semver === xc) {
    if (r.includePrerelease)
      return !0;
    t = yp;
  }
  const n = /* @__PURE__ */ new Set();
  let i, s;
  for (const p of e)
    p.operator === ">" || p.operator === ">=" ? i = gp(i, p, r) : p.operator === "<" || p.operator === "<=" ? s = _p(s, p, r) : n.add(p.semver);
  if (n.size > 1)
    return null;
  let o;
  if (i && s) {
    if (o = rf(i.semver, s.semver, r), o > 0)
      return null;
    if (o === 0 && (i.operator !== ">=" || s.operator !== "<="))
      return null;
  }
  for (const p of n) {
    if (i && !Zi(p, String(i), r) || s && !Zi(p, String(s), r))
      return null;
    for (const $ of t)
      if (!Zi(p, String($), r))
        return !1;
    return !0;
  }
  let a, c, u, l, d = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1, h = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  d && d.prerelease.length === 1 && s.operator === "<" && d.prerelease[0] === 0 && (d = !1);
  for (const p of t) {
    if (l = l || p.operator === ">" || p.operator === ">=", u = u || p.operator === "<" || p.operator === "<=", i) {
      if (h && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === h.major && p.semver.minor === h.minor && p.semver.patch === h.patch && (h = !1), p.operator === ">" || p.operator === ">=") {
        if (a = gp(i, p, r), a === p && a !== i)
          return !1;
      } else if (i.operator === ">=" && !Zi(i.semver, String(p), r))
        return !1;
    }
    if (s) {
      if (d && p.semver.prerelease && p.semver.prerelease.length && p.semver.major === d.major && p.semver.minor === d.minor && p.semver.patch === d.patch && (d = !1), p.operator === "<" || p.operator === "<=") {
        if (c = _p(s, p, r), c === p && c !== s)
          return !1;
      } else if (s.operator === "<=" && !Zi(s.semver, String(p), r))
        return !1;
    }
    if (!p.operator && (s || i) && o !== 0)
      return !1;
  }
  return !(i && u && !s && o !== 0 || s && l && !i && o !== 0 || h || d);
}, gp = (e, t, r) => {
  if (!e)
    return t;
  const n = rf(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, _p = (e, t, r) => {
  if (!e)
    return t;
  const n = rf(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var sD = rD;
const Vc = Ws, vp = Ga, oD = pt, $p = r0, aD = xi, cD = pC, lD = gC, uD = vC, dD = wC, fD = SC, hD = NC, pD = RC, mD = DC, yD = er, gD = MC, _D = xC, vD = Xd, $D = HC, wD = WC, ED = Ka, bD = Jd, SD = n0, PD = i0, TD = Qd, ND = Zd, OD = s0, AD = yI, RD = Ya(), CD = tr(), ID = Xa, DD = bI, kD = NI, FD = CI, jD = kI, MD = MI, LD = ef, UD = WI, xD = XI, VD = QI, qD = tD, BD = sD;
var nf = {
  parse: aD,
  valid: cD,
  clean: lD,
  inc: uD,
  diff: dD,
  major: fD,
  minor: hD,
  patch: pD,
  prerelease: mD,
  compare: yD,
  rcompare: gD,
  compareLoose: _D,
  compareBuild: vD,
  sort: $D,
  rsort: wD,
  gt: ED,
  lt: bD,
  eq: SD,
  neq: PD,
  gte: TD,
  lte: ND,
  cmp: OD,
  coerce: AD,
  Comparator: RD,
  Range: CD,
  satisfies: ID,
  toComparators: DD,
  maxSatisfying: kD,
  minSatisfying: FD,
  minVersion: jD,
  validRange: MD,
  outside: LD,
  gtr: UD,
  ltr: xD,
  intersects: VD,
  simplifyRange: qD,
  subset: BD,
  SemVer: oD,
  re: Vc.re,
  src: Vc.src,
  tokens: Vc.t,
  SEMVER_SPEC_VERSION: vp.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: vp.RELEASE_TYPES,
  compareIdentifiers: $p.compareIdentifiers,
  rcompareIdentifiers: $p.rcompareIdentifiers
};
const ei = /* @__PURE__ */ dy(nf), HD = Object.prototype.toString, zD = "[object Uint8Array]", GD = "[object ArrayBuffer]";
function a0(e, t, r) {
  return e ? e.constructor === t ? !0 : HD.call(e) === r : !1;
}
function c0(e) {
  return a0(e, Uint8Array, zD);
}
function WD(e) {
  return a0(e, ArrayBuffer, GD);
}
function KD(e) {
  return c0(e) || WD(e);
}
function YD(e) {
  if (!c0(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function XD(e) {
  if (!KD(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function qc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((i, s) => i + s.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const i of e)
    YD(i), r.set(i, n), n += i.length;
  return r;
}
const Io = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Do(e, t = "utf8") {
  return XD(e), Io[t] ?? (Io[t] = new globalThis.TextDecoder(t)), Io[t].decode(e);
}
function JD(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const QD = new globalThis.TextEncoder();
function ko(e) {
  return JD(e), QD.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Bc = "aes-256-cbc", zr = () => /* @__PURE__ */ Object.create(null), wp = (e) => e !== void 0, Hc = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Kr = "__internal__", zc = `${Kr}.migrations.version`;
var Qr, Kt, vt, jt, jn, Mn, bi, or, qe, l0, u0, d0, f0, h0, p0, m0, y0;
class ZD {
  constructor(t = {}) {
    ir(this, qe);
    Mr(this, "path");
    Mr(this, "events");
    ir(this, Qr);
    ir(this, Kt);
    ir(this, vt);
    ir(this, jt, {});
    ir(this, jn, !1);
    ir(this, Mn);
    ir(this, bi);
    ir(this, or);
    Mr(this, "_deserialize", (t) => JSON.parse(t));
    Mr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = wr(this, qe, l0).call(this, t);
    Ot(this, vt, r), wr(this, qe, u0).call(this, r), wr(this, qe, f0).call(this, r), wr(this, qe, h0).call(this, r), this.events = new EventTarget(), Ot(this, Kt, r.encryptionKey), this.path = wr(this, qe, p0).call(this, r), wr(this, qe, m0).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (ie(this, vt).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${Kr} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, i = (s, o) => {
      if (Hc(s, o), ie(this, vt).accessPropertiesByDotNotation)
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
    return ie(this, vt).accessPropertiesByDotNotation ? bc(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    Hc(t, r);
    const n = ie(this, vt).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
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
      wp(ie(this, jt)[r]) && this.set(r, ie(this, jt)[r]);
  }
  delete(t) {
    const { store: r } = this;
    ie(this, vt).accessPropertiesByDotNotation ? N$(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = zr();
    for (const r of Object.keys(ie(this, jt)))
      wp(ie(this, jt)[r]) && (Hc(r, ie(this, jt)[r]), ie(this, vt).accessPropertiesByDotNotation ? fo(t, r, ie(this, jt)[r]) : t[r] = ie(this, jt)[r]);
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
      const r = se.readFileSync(this.path, ie(this, Kt) ? null : "utf8"), n = this._decryptData(r), i = this._deserialize(n);
      return ie(this, jn) || this._validate(i), Object.assign(zr(), i);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), zr();
      if (ie(this, vt).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:"))
          return zr();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !bc(t, Kr))
      try {
        const r = se.readFileSync(this.path, ie(this, Kt) ? null : "utf8"), n = this._decryptData(r), i = this._deserialize(n);
        bc(i, Kr) && fo(t, Kr, Zf(i, Kr));
      } catch {
      }
    ie(this, jn) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    ie(this, Mn) && (ie(this, Mn).close(), Ot(this, Mn, void 0)), ie(this, bi) && (se.unwatchFile(this.path), Ot(this, bi, !1)), Ot(this, or, void 0);
  }
  _decryptData(t) {
    if (!ie(this, Kt))
      return typeof t == "string" ? t : Do(t);
    try {
      const r = t.slice(0, 16), n = wn.pbkdf2Sync(ie(this, Kt), r, 1e4, 32, "sha512"), i = wn.createDecipheriv(Bc, n, r), s = t.slice(17), o = typeof s == "string" ? ko(s) : s;
      return Do(qc([i.update(o), i.final()]));
    } catch {
      try {
        const r = t.slice(0, 16), n = wn.pbkdf2Sync(ie(this, Kt), r.toString(), 1e4, 32, "sha512"), i = wn.createDecipheriv(Bc, n, r), s = t.slice(17), o = typeof s == "string" ? ko(s) : s;
        return Do(qc([i.update(o), i.final()]));
      } catch {
      }
    }
    return typeof t == "string" ? t : Do(t);
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const i = r, s = this.store;
      Jf(s, i) || (r = s, t.call(this, s, i));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const i = () => {
      const s = n, o = t();
      Jf(o, s) || (n = o, r.call(this, o, s));
    };
    return this.events.addEventListener("change", i), () => {
      this.events.removeEventListener("change", i);
    };
  }
  _validate(t) {
    if (!ie(this, Qr) || ie(this, Qr).call(this, t) || !ie(this, Qr).errors)
      return;
    const n = ie(this, Qr).errors.map(({ instancePath: i, message: s = "" }) => `\`${i.slice(1)}\` ${s}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    se.mkdirSync(ue.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (ie(this, Kt)) {
      const n = wn.randomBytes(16), i = wn.pbkdf2Sync(ie(this, Kt), n, 1e4, 32, "sha512"), s = wn.createCipheriv(Bc, i, n);
      r = qc([n, ko(":"), s.update(ko(r)), s.final()]);
    }
    if (Ne.env.SNAP)
      se.writeFileSync(this.path, r, { mode: ie(this, vt).configFileMode });
    else
      try {
        uy(this.path, r, { mode: ie(this, vt).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          se.writeFileSync(this.path, r, { mode: ie(this, vt).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    if (this._ensureDirectory(), se.existsSync(this.path) || this._write(zr()), Ne.platform === "win32" || Ne.platform === "darwin") {
      ie(this, or) ?? Ot(this, or, tp(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ue.dirname(this.path), r = ue.basename(this.path);
      Ot(this, Mn, se.watch(t, { persistent: !1, encoding: "utf8" }, (n, i) => {
        i && i !== r || typeof ie(this, or) == "function" && ie(this, or).call(this);
      }));
    } else
      ie(this, or) ?? Ot(this, or, tp(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), se.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof ie(this, or) == "function" && ie(this, or).call(this);
      }), Ot(this, bi, !0);
  }
  _migrate(t, r, n) {
    let i = this._get(zc, "0.0.0");
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
        c == null || c(this), this._set(zc, a), i = a, o = structuredClone(this.store);
      } catch (c) {
        this.store = o;
        try {
          this._write(o);
        } catch {
        }
        const u = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${u}`);
      }
    (this._isVersionInRangeFormat(i) || !ei.eq(i, r)) && this._set(zc, r);
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
    return t === Kr || t.startsWith(`${Kr}.`);
  }
  _isVersionInRangeFormat(t) {
    return ei.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && ei.satisfies(r, t) ? !1 : ei.satisfies(n, t) : !(ei.lte(t, r) || ei.gt(t, n));
  }
  _get(t, r) {
    return Zf(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    fo(n, t, r), this.store = n;
  }
}
Qr = new WeakMap(), Kt = new WeakMap(), vt = new WeakMap(), jt = new WeakMap(), jn = new WeakMap(), Mn = new WeakMap(), bi = new WeakMap(), or = new WeakMap(), qe = new WeakSet(), l0 = function(t) {
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
    r.cwd = C$(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, u0 = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = HR.default, n = new IT.Ajv2020({
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
  Ot(this, Qr, n.compile(i)), wr(this, qe, d0).call(this, t.schema);
}, d0 = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, i] of r) {
    if (!i || typeof i != "object" || !Object.hasOwn(i, "default"))
      continue;
    const { default: s } = i;
    s !== void 0 && (ie(this, jt)[n] = s);
  }
}, f0 = function(t) {
  t.defaults && Object.assign(ie(this, jt), t.defaults);
}, h0 = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, p0 = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ue.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, m0 = function(t) {
  if (t.migrations) {
    wr(this, qe, y0).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(zr(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Qf.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, y0 = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Ot(this, jn, !0);
    try {
      const i = this.store, s = Object.assign(zr(), t.defaults ?? {}, i);
      try {
        Qf.deepEqual(i, s);
      } catch {
        this._write(s);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      Ot(this, jn, !1);
    }
  }
};
const { app: ta, ipcMain: Ll, shell: ek } = Ar;
let Ep = !1;
const bp = () => {
  if (!Ll || !ta)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: ta.getPath("userData"),
    appVersion: ta.getVersion()
  };
  return Ep || (Ll.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Ep = !0), e;
};
class tk extends ZD {
  constructor(t) {
    let r, n;
    if (Ne.type === "renderer") {
      const i = Ar.ipcRenderer.sendSync("electron-store-get-data");
      if (!i)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = i);
    } else Ll && ta && ({ defaultCwd: r, appVersion: n } = bp());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ue.isAbsolute(t.cwd) ? t.cwd : ue.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    bp();
  }
  async openInEditor() {
    const t = await ek.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const es = new tk({
  defaults: {
    tasks: []
  }
});
function rk() {
  Sr.handle("get-store-value", (e, t) => es.get(t)), Sr.handle("set-store-value", (e, t, r) => {
    r == null ? es.delete(t) : es.set(t, r);
  }), Sr.handle("delete-store-value", (e, t) => {
    es.delete(t);
  }), Sr.handle("clear-store", () => {
    es.clear();
  });
}
class nk {
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
      const r = Xf.getPrimaryDisplay(), { workArea: n } = r;
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
      const r = Xf.getPrimaryDisplay(), { workArea: n } = r, i = 320, s = 50, o = Math.round(n.x + (n.width - i) / 2), a = n.y + 10;
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
const Ja = new nk();
var sf = {}, zn = {}, mt = {};
mt.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, s) => i != null ? n(i) : r(s)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
mt.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var Gr = b$, ik = process.cwd, ra = null, sk = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return ra || (ra = ik.call(process)), ra;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Sp = process.chdir;
  process.chdir = function(e) {
    ra = null, Sp.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Sp);
}
var ok = ak;
function ak(e) {
  Gr.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = o(e.chownSync), e.fchownSync = o(e.fchownSync), e.lchownSync = o(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, d, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, d, h, p) {
    p && process.nextTick(p);
  }, e.lchownSync = function() {
  }), sk === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
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
        Gr.O_WRONLY | Gr.O_SYMLINK,
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
      var p = l.openSync(d, Gr.O_WRONLY | Gr.O_SYMLINK, h), $ = !0, _;
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
    Gr.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(d, h, p, $) {
      l.open(d, Gr.O_SYMLINK, function(_, v) {
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
      var $ = l.openSync(d, Gr.O_SYMLINK), _, v = !0;
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
var Pp = xs.Stream, ck = lk;
function lk(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    Pp.call(this);
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
    Pp.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var uk = fk, dk = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function fk(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: dk(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var Ae = fn, hk = ok, pk = ck, mk = uk, Fo = ru, Ke, _a;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (Ke = Symbol.for("graceful-fs.queue"), _a = Symbol.for("graceful-fs.previous")) : (Ke = "___graceful-fs.queue", _a = "___graceful-fs.previous");
function yk() {
}
function g0(e, t) {
  Object.defineProperty(e, Ke, {
    get: function() {
      return t;
    }
  });
}
var Ln = yk;
Fo.debuglog ? Ln = Fo.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Ln = function() {
  var e = Fo.format.apply(Fo, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!Ae[Ke]) {
  var gk = dt[Ke] || [];
  g0(Ae, gk), Ae.close = function(e) {
    function t(r, n) {
      return e.call(Ae, r, function(i) {
        i || Tp(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, _a, {
      value: e
    }), t;
  }(Ae.close), Ae.closeSync = function(e) {
    function t(r) {
      e.apply(Ae, arguments), Tp();
    }
    return Object.defineProperty(t, _a, {
      value: e
    }), t;
  }(Ae.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Ln(Ae[Ke]), ry.equal(Ae[Ke].length, 0);
  });
}
dt[Ke] || g0(dt, Ae[Ke]);
var yt = of(mk(Ae));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !Ae.__patched && (yt = of(Ae), Ae.__patched = !0);
function of(e) {
  hk(e), e.gracefulify = of, e.createReadStream = F, e.createWriteStream = z;
  var t = e.readFile;
  e.readFile = r;
  function r(R, Q, x) {
    return typeof Q == "function" && (x = Q, Q = null), q(R, Q, x);
    function q(J, j, M, B) {
      return t(J, j, function(L) {
        L && (L.code === "EMFILE" || L.code === "ENFILE") ? ti([q, [J, j, M], L, B || Date.now(), Date.now()]) : typeof M == "function" && M.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(R, Q, x, q) {
    return typeof x == "function" && (q = x, x = null), J(R, Q, x, q);
    function J(j, M, B, L, H) {
      return n(j, M, B, function(V) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? ti([J, [j, M, B, L], V, H || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var s = e.appendFile;
  s && (e.appendFile = o);
  function o(R, Q, x, q) {
    return typeof x == "function" && (q = x, x = null), J(R, Q, x, q);
    function J(j, M, B, L, H) {
      return s(j, M, B, function(V) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? ti([J, [j, M, B, L], V, H || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = c);
  function c(R, Q, x, q) {
    return typeof x == "function" && (q = x, x = 0), J(R, Q, x, q);
    function J(j, M, B, L, H) {
      return a(j, M, B, function(V) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? ti([J, [j, M, B, L], V, H || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var u = e.readdir;
  e.readdir = d;
  var l = /^v[0-5]\./;
  function d(R, Q, x) {
    typeof Q == "function" && (x = Q, Q = null);
    var q = l.test(process.version) ? function(M, B, L, H) {
      return u(M, J(
        M,
        B,
        L,
        H
      ));
    } : function(M, B, L, H) {
      return u(M, B, J(
        M,
        B,
        L,
        H
      ));
    };
    return q(R, Q, x);
    function J(j, M, B, L) {
      return function(H, V) {
        H && (H.code === "EMFILE" || H.code === "ENFILE") ? ti([
          q,
          [j, M, B],
          H,
          L || Date.now(),
          Date.now()
        ]) : (V && V.sort && V.sort(), typeof B == "function" && B.call(this, H, V));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = pk(e);
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
    function J(j, M, B, L, H) {
      return G(j, M, B, function(V, C) {
        V && (V.code === "EMFILE" || V.code === "ENFILE") ? ti([J, [j, M, B, L], V, H || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  return e;
}
function ti(e) {
  Ln("ENQUEUE", e[0].name, e[1]), Ae[Ke].push(e), af();
}
var jo;
function Tp() {
  for (var e = Date.now(), t = 0; t < Ae[Ke].length; ++t)
    Ae[Ke][t].length > 2 && (Ae[Ke][t][3] = e, Ae[Ke][t][4] = e);
  af();
}
function af() {
  if (clearTimeout(jo), jo = void 0, Ae[Ke].length !== 0) {
    var e = Ae[Ke].shift(), t = e[0], r = e[1], n = e[2], i = e[3], s = e[4];
    if (i === void 0)
      Ln("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Ln("TIMEOUT", t.name, r);
      var o = r.pop();
      typeof o == "function" && o.call(null, n);
    } else {
      var a = Date.now() - s, c = Math.max(s - i, 1), u = Math.min(c * 1.2, 100);
      a >= u ? (Ln("RETRY", t.name, r), t.apply(null, r.concat([i]))) : Ae[Ke].push(e);
    }
    jo === void 0 && (jo = setTimeout(af, 0));
  }
}
(function(e) {
  const t = mt.fromCallback, r = yt, n = [
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
})(zn);
var cf = {}, _0 = {};
const _k = Re;
_0.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(_k.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const v0 = zn, { checkPath: $0 } = _0, w0 = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
cf.makeDir = async (e, t) => ($0(e), v0.mkdir(e, {
  mode: w0(t),
  recursive: !0
}));
cf.makeDirSync = (e, t) => ($0(e), v0.mkdirSync(e, {
  mode: w0(t),
  recursive: !0
}));
const vk = mt.fromPromise, { makeDir: $k, makeDirSync: Gc } = cf, Wc = vk($k);
var pr = {
  mkdirs: Wc,
  mkdirsSync: Gc,
  // alias
  mkdirp: Wc,
  mkdirpSync: Gc,
  ensureDir: Wc,
  ensureDirSync: Gc
};
const wk = mt.fromPromise, E0 = zn;
function Ek(e) {
  return E0.access(e).then(() => !0).catch(() => !1);
}
var Gn = {
  pathExists: wk(Ek),
  pathExistsSync: E0.existsSync
};
const wi = yt;
function bk(e, t, r, n) {
  wi.open(e, "r+", (i, s) => {
    if (i) return n(i);
    wi.futimes(s, t, r, (o) => {
      wi.close(s, (a) => {
        n && n(o || a);
      });
    });
  });
}
function Sk(e, t, r) {
  const n = wi.openSync(e, "r+");
  return wi.futimesSync(n, t, r), wi.closeSync(n);
}
var b0 = {
  utimesMillis: bk,
  utimesMillisSync: Sk
};
const Oi = zn, Ve = Re, Pk = ru;
function Tk(e, t, r) {
  const n = r.dereference ? (i) => Oi.stat(i, { bigint: !0 }) : (i) => Oi.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, s]) => ({ srcStat: i, destStat: s }));
}
function Nk(e, t, r) {
  let n;
  const i = r.dereference ? (o) => Oi.statSync(o, { bigint: !0 }) : (o) => Oi.lstatSync(o, { bigint: !0 }), s = i(e);
  try {
    n = i(t);
  } catch (o) {
    if (o.code === "ENOENT") return { srcStat: s, destStat: null };
    throw o;
  }
  return { srcStat: s, destStat: n };
}
function Ok(e, t, r, n, i) {
  Pk.callbackify(Tk)(e, t, n, (s, o) => {
    if (s) return i(s);
    const { srcStat: a, destStat: c } = o;
    if (c) {
      if (Ks(a, c)) {
        const u = Ve.basename(e), l = Ve.basename(t);
        return r === "move" && u !== l && u.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: a, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && lf(e, t) ? i(new Error(Qa(e, t, r))) : i(null, { srcStat: a, destStat: c });
  });
}
function Ak(e, t, r, n) {
  const { srcStat: i, destStat: s } = Nk(e, t, n);
  if (s) {
    if (Ks(i, s)) {
      const o = Ve.basename(e), a = Ve.basename(t);
      if (r === "move" && o !== a && o.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: s, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !s.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && s.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && lf(e, t))
    throw new Error(Qa(e, t, r));
  return { srcStat: i, destStat: s };
}
function S0(e, t, r, n, i) {
  const s = Ve.resolve(Ve.dirname(e)), o = Ve.resolve(Ve.dirname(r));
  if (o === s || o === Ve.parse(o).root) return i();
  Oi.stat(o, { bigint: !0 }, (a, c) => a ? a.code === "ENOENT" ? i() : i(a) : Ks(t, c) ? i(new Error(Qa(e, r, n))) : S0(e, t, o, n, i));
}
function P0(e, t, r, n) {
  const i = Ve.resolve(Ve.dirname(e)), s = Ve.resolve(Ve.dirname(r));
  if (s === i || s === Ve.parse(s).root) return;
  let o;
  try {
    o = Oi.statSync(s, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Ks(t, o))
    throw new Error(Qa(e, r, n));
  return P0(e, t, s, n);
}
function Ks(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function lf(e, t) {
  const r = Ve.resolve(e).split(Ve.sep).filter((i) => i), n = Ve.resolve(t).split(Ve.sep).filter((i) => i);
  return r.reduce((i, s, o) => i && n[o] === s, !0);
}
function Qa(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Vi = {
  checkPaths: Ok,
  checkPathsSync: Ak,
  checkParentPaths: S0,
  checkParentPathsSync: P0,
  isSrcSubdir: lf,
  areIdentical: Ks
};
const bt = yt, Ps = Re, Rk = pr.mkdirs, Ck = Gn.pathExists, Ik = b0.utimesMillis, Ts = Vi;
function Dk(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Ts.checkPaths(e, t, "copy", r, (i, s) => {
    if (i) return n(i);
    const { srcStat: o, destStat: a } = s;
    Ts.checkParentPaths(e, o, t, "copy", (c) => c ? n(c) : r.filter ? T0(Np, a, e, t, r, n) : Np(a, e, t, r, n));
  });
}
function Np(e, t, r, n, i) {
  const s = Ps.dirname(r);
  Ck(s, (o, a) => {
    if (o) return i(o);
    if (a) return va(e, t, r, n, i);
    Rk(s, (c) => c ? i(c) : va(e, t, r, n, i));
  });
}
function T0(e, t, r, n, i, s) {
  Promise.resolve(i.filter(r, n)).then((o) => o ? e(t, r, n, i, s) : s(), (o) => s(o));
}
function kk(e, t, r, n, i) {
  return n.filter ? T0(va, e, t, r, n, i) : va(e, t, r, n, i);
}
function va(e, t, r, n, i) {
  (n.dereference ? bt.stat : bt.lstat)(t, (o, a) => o ? i(o) : a.isDirectory() ? Vk(a, e, t, r, n, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? Fk(a, e, t, r, n, i) : a.isSymbolicLink() ? Hk(e, t, r, n, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Fk(e, t, r, n, i, s) {
  return t ? jk(e, r, n, i, s) : N0(e, r, n, i, s);
}
function jk(e, t, r, n, i) {
  if (n.overwrite)
    bt.unlink(r, (s) => s ? i(s) : N0(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function N0(e, t, r, n, i) {
  bt.copyFile(t, r, (s) => s ? i(s) : n.preserveTimestamps ? Mk(e.mode, t, r, i) : Za(r, e.mode, i));
}
function Mk(e, t, r, n) {
  return Lk(e) ? Uk(r, e, (i) => i ? n(i) : Op(e, t, r, n)) : Op(e, t, r, n);
}
function Lk(e) {
  return (e & 128) === 0;
}
function Uk(e, t, r) {
  return Za(e, t | 128, r);
}
function Op(e, t, r, n) {
  xk(t, r, (i) => i ? n(i) : Za(r, e, n));
}
function Za(e, t, r) {
  return bt.chmod(e, t, r);
}
function xk(e, t, r) {
  bt.stat(e, (n, i) => n ? r(n) : Ik(t, i.atime, i.mtime, r));
}
function Vk(e, t, r, n, i, s) {
  return t ? O0(r, n, i, s) : qk(e.mode, r, n, i, s);
}
function qk(e, t, r, n, i) {
  bt.mkdir(r, (s) => {
    if (s) return i(s);
    O0(t, r, n, (o) => o ? i(o) : Za(r, e, i));
  });
}
function O0(e, t, r, n) {
  bt.readdir(e, (i, s) => i ? n(i) : A0(s, e, t, r, n));
}
function A0(e, t, r, n, i) {
  const s = e.pop();
  return s ? Bk(e, s, t, r, n, i) : i();
}
function Bk(e, t, r, n, i, s) {
  const o = Ps.join(r, t), a = Ps.join(n, t);
  Ts.checkPaths(o, a, "copy", i, (c, u) => {
    if (c) return s(c);
    const { destStat: l } = u;
    kk(l, o, a, i, (d) => d ? s(d) : A0(e, r, n, i, s));
  });
}
function Hk(e, t, r, n, i) {
  bt.readlink(t, (s, o) => {
    if (s) return i(s);
    if (n.dereference && (o = Ps.resolve(process.cwd(), o)), e)
      bt.readlink(r, (a, c) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? bt.symlink(o, r, i) : i(a) : (n.dereference && (c = Ps.resolve(process.cwd(), c)), Ts.isSrcSubdir(o, c) ? i(new Error(`Cannot copy '${o}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Ts.isSrcSubdir(c, o) ? i(new Error(`Cannot overwrite '${c}' with '${o}'.`)) : zk(o, r, i)));
    else
      return bt.symlink(o, r, i);
  });
}
function zk(e, t, r) {
  bt.unlink(t, (n) => n ? r(n) : bt.symlink(e, t, r));
}
var Gk = Dk;
const it = yt, Ns = Re, Wk = pr.mkdirsSync, Kk = b0.utimesMillisSync, Os = Vi;
function Yk(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Os.checkPathsSync(e, t, "copy", r);
  return Os.checkParentPathsSync(e, n, t, "copy"), Xk(i, e, t, r);
}
function Xk(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Ns.dirname(r);
  return it.existsSync(i) || Wk(i), R0(e, t, r, n);
}
function Jk(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return R0(e, t, r, n);
}
function R0(e, t, r, n) {
  const s = (n.dereference ? it.statSync : it.lstatSync)(t);
  if (s.isDirectory()) return iF(s, e, t, r, n);
  if (s.isFile() || s.isCharacterDevice() || s.isBlockDevice()) return Qk(s, e, t, r, n);
  if (s.isSymbolicLink()) return aF(e, t, r, n);
  throw s.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : s.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Qk(e, t, r, n, i) {
  return t ? Zk(e, r, n, i) : C0(e, r, n, i);
}
function Zk(e, t, r, n) {
  if (n.overwrite)
    return it.unlinkSync(r), C0(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function C0(e, t, r, n) {
  return it.copyFileSync(t, r), n.preserveTimestamps && eF(e.mode, t, r), uf(r, e.mode);
}
function eF(e, t, r) {
  return tF(e) && rF(r, e), nF(t, r);
}
function tF(e) {
  return (e & 128) === 0;
}
function rF(e, t) {
  return uf(e, t | 128);
}
function uf(e, t) {
  return it.chmodSync(e, t);
}
function nF(e, t) {
  const r = it.statSync(e);
  return Kk(t, r.atime, r.mtime);
}
function iF(e, t, r, n, i) {
  return t ? I0(r, n, i) : sF(e.mode, r, n, i);
}
function sF(e, t, r, n) {
  return it.mkdirSync(r), I0(t, r, n), uf(r, e);
}
function I0(e, t, r) {
  it.readdirSync(e).forEach((n) => oF(n, e, t, r));
}
function oF(e, t, r, n) {
  const i = Ns.join(t, e), s = Ns.join(r, e), { destStat: o } = Os.checkPathsSync(i, s, "copy", n);
  return Jk(o, i, s, n);
}
function aF(e, t, r, n) {
  let i = it.readlinkSync(t);
  if (n.dereference && (i = Ns.resolve(process.cwd(), i)), e) {
    let s;
    try {
      s = it.readlinkSync(r);
    } catch (o) {
      if (o.code === "EINVAL" || o.code === "UNKNOWN") return it.symlinkSync(i, r);
      throw o;
    }
    if (n.dereference && (s = Ns.resolve(process.cwd(), s)), Os.isSrcSubdir(i, s))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${s}'.`);
    if (it.statSync(r).isDirectory() && Os.isSrcSubdir(s, i))
      throw new Error(`Cannot overwrite '${s}' with '${i}'.`);
    return cF(i, r);
  } else
    return it.symlinkSync(i, r);
}
function cF(e, t) {
  return it.unlinkSync(t), it.symlinkSync(e, t);
}
var lF = Yk;
const uF = mt.fromCallback;
var df = {
  copy: uF(Gk),
  copySync: lF
};
const Ap = yt, D0 = Re, we = ry, As = process.platform === "win32";
function k0(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Ap[r], r = r + "Sync", e[r] = e[r] || Ap[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function ff(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), we(e, "rimraf: missing path"), we.strictEqual(typeof e, "string", "rimraf: path should be a string"), we.strictEqual(typeof r, "function", "rimraf: callback function required"), we(t, "rimraf: invalid options argument provided"), we.strictEqual(typeof t, "object", "rimraf: options should be object"), k0(t), Rp(e, t, function i(s) {
    if (s) {
      if ((s.code === "EBUSY" || s.code === "ENOTEMPTY" || s.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const o = n * 100;
        return setTimeout(() => Rp(e, t, i), o);
      }
      s.code === "ENOENT" && (s = null);
    }
    r(s);
  });
}
function Rp(e, t, r) {
  we(e), we(t), we(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && As)
      return Cp(e, t, n, r);
    if (i && i.isDirectory())
      return na(e, t, n, r);
    t.unlink(e, (s) => {
      if (s) {
        if (s.code === "ENOENT")
          return r(null);
        if (s.code === "EPERM")
          return As ? Cp(e, t, s, r) : na(e, t, s, r);
        if (s.code === "EISDIR")
          return na(e, t, s, r);
      }
      return r(s);
    });
  });
}
function Cp(e, t, r, n) {
  we(e), we(t), we(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (s, o) => {
      s ? n(s.code === "ENOENT" ? null : r) : o.isDirectory() ? na(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Ip(e, t, r) {
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
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? dF(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function dF(e, t, r) {
  we(e), we(t), we(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let s = i.length, o;
    if (s === 0) return t.rmdir(e, r);
    i.forEach((a) => {
      ff(D0.join(e, a), t, (c) => {
        if (!o) {
          if (c) return r(o = c);
          --s === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function F0(e, t) {
  let r;
  t = t || {}, k0(t), we(e, "rimraf: missing path"), we.strictEqual(typeof e, "string", "rimraf: path should be a string"), we(t, "rimraf: missing options"), we.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && As && Ip(e, t, n);
  }
  try {
    r && r.isDirectory() ? ia(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return As ? Ip(e, t, n) : ia(e, t, n);
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
      fF(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function fF(e, t) {
  if (we(e), we(t), t.readdirSync(e).forEach((r) => F0(D0.join(e, r), t)), As) {
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
var hF = ff;
ff.sync = F0;
const $a = yt, pF = mt.fromCallback, j0 = hF;
function mF(e, t) {
  if ($a.rm) return $a.rm(e, { recursive: !0, force: !0 }, t);
  j0(e, t);
}
function yF(e) {
  if ($a.rmSync) return $a.rmSync(e, { recursive: !0, force: !0 });
  j0.sync(e);
}
var ec = {
  remove: pF(mF),
  removeSync: yF
};
const gF = mt.fromPromise, M0 = zn, L0 = Re, U0 = pr, x0 = ec, Dp = gF(async function(t) {
  let r;
  try {
    r = await M0.readdir(t);
  } catch {
    return U0.mkdirs(t);
  }
  return Promise.all(r.map((n) => x0.remove(L0.join(t, n))));
});
function kp(e) {
  let t;
  try {
    t = M0.readdirSync(e);
  } catch {
    return U0.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = L0.join(e, r), x0.removeSync(r);
  });
}
var _F = {
  emptyDirSync: kp,
  emptydirSync: kp,
  emptyDir: Dp,
  emptydir: Dp
};
const vF = mt.fromCallback, V0 = Re, tn = yt, q0 = pr;
function $F(e, t) {
  function r() {
    tn.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  tn.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const s = V0.dirname(e);
    tn.stat(s, (o, a) => {
      if (o)
        return o.code === "ENOENT" ? q0.mkdirs(s, (c) => {
          if (c) return t(c);
          r();
        }) : t(o);
      a.isDirectory() ? r() : tn.readdir(s, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function wF(e) {
  let t;
  try {
    t = tn.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = V0.dirname(e);
  try {
    tn.statSync(r).isDirectory() || tn.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") q0.mkdirsSync(r);
    else throw n;
  }
  tn.writeFileSync(e, "");
}
var EF = {
  createFile: vF($F),
  createFileSync: wF
};
const bF = mt.fromCallback, B0 = Re, Jr = yt, H0 = pr, SF = Gn.pathExists, { areIdentical: z0 } = Vi;
function PF(e, t, r) {
  function n(i, s) {
    Jr.link(i, s, (o) => {
      if (o) return r(o);
      r(null);
    });
  }
  Jr.lstat(t, (i, s) => {
    Jr.lstat(e, (o, a) => {
      if (o)
        return o.message = o.message.replace("lstat", "ensureLink"), r(o);
      if (s && z0(a, s)) return r(null);
      const c = B0.dirname(t);
      SF(c, (u, l) => {
        if (u) return r(u);
        if (l) return n(e, t);
        H0.mkdirs(c, (d) => {
          if (d) return r(d);
          n(e, t);
        });
      });
    });
  });
}
function TF(e, t) {
  let r;
  try {
    r = Jr.lstatSync(t);
  } catch {
  }
  try {
    const s = Jr.lstatSync(e);
    if (r && z0(s, r)) return;
  } catch (s) {
    throw s.message = s.message.replace("lstat", "ensureLink"), s;
  }
  const n = B0.dirname(t);
  return Jr.existsSync(n) || H0.mkdirsSync(n), Jr.linkSync(e, t);
}
var NF = {
  createLink: bF(PF),
  createLinkSync: TF
};
const rn = Re, vs = yt, OF = Gn.pathExists;
function AF(e, t, r) {
  if (rn.isAbsolute(e))
    return vs.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = rn.dirname(t), i = rn.join(n, e);
    return OF(i, (s, o) => s ? r(s) : o ? r(null, {
      toCwd: i,
      toDst: e
    }) : vs.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), r(a)) : r(null, {
      toCwd: e,
      toDst: rn.relative(n, e)
    })));
  }
}
function RF(e, t) {
  let r;
  if (rn.isAbsolute(e)) {
    if (r = vs.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = rn.dirname(t), i = rn.join(n, e);
    if (r = vs.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = vs.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: rn.relative(n, e)
    };
  }
}
var CF = {
  symlinkPaths: AF,
  symlinkPathsSync: RF
};
const G0 = yt;
function IF(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  G0.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function DF(e, t) {
  let r;
  if (t) return t;
  try {
    r = G0.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var kF = {
  symlinkType: IF,
  symlinkTypeSync: DF
};
const FF = mt.fromCallback, W0 = Re, Yt = zn, K0 = pr, jF = K0.mkdirs, MF = K0.mkdirsSync, Y0 = CF, LF = Y0.symlinkPaths, UF = Y0.symlinkPathsSync, X0 = kF, xF = X0.symlinkType, VF = X0.symlinkTypeSync, qF = Gn.pathExists, { areIdentical: J0 } = Vi;
function BF(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Yt.lstat(t, (i, s) => {
    !i && s.isSymbolicLink() ? Promise.all([
      Yt.stat(e),
      Yt.stat(t)
    ]).then(([o, a]) => {
      if (J0(o, a)) return n(null);
      Fp(e, t, r, n);
    }) : Fp(e, t, r, n);
  });
}
function Fp(e, t, r, n) {
  LF(e, t, (i, s) => {
    if (i) return n(i);
    e = s.toDst, xF(s.toCwd, r, (o, a) => {
      if (o) return n(o);
      const c = W0.dirname(t);
      qF(c, (u, l) => {
        if (u) return n(u);
        if (l) return Yt.symlink(e, t, a, n);
        jF(c, (d) => {
          if (d) return n(d);
          Yt.symlink(e, t, a, n);
        });
      });
    });
  });
}
function HF(e, t, r) {
  let n;
  try {
    n = Yt.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const a = Yt.statSync(e), c = Yt.statSync(t);
    if (J0(a, c)) return;
  }
  const i = UF(e, t);
  e = i.toDst, r = VF(i.toCwd, r);
  const s = W0.dirname(t);
  return Yt.existsSync(s) || MF(s), Yt.symlinkSync(e, t, r);
}
var zF = {
  createSymlink: FF(BF),
  createSymlinkSync: HF
};
const { createFile: jp, createFileSync: Mp } = EF, { createLink: Lp, createLinkSync: Up } = NF, { createSymlink: xp, createSymlinkSync: Vp } = zF;
var GF = {
  // file
  createFile: jp,
  createFileSync: Mp,
  ensureFile: jp,
  ensureFileSync: Mp,
  // link
  createLink: Lp,
  createLinkSync: Up,
  ensureLink: Lp,
  ensureLinkSync: Up,
  // symlink
  createSymlink: xp,
  createSymlinkSync: Vp,
  ensureSymlink: xp,
  ensureSymlinkSync: Vp
};
function WF(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const s = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + s;
}
function KF(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var hf = { stringify: WF, stripBom: KF };
let Ai;
try {
  Ai = yt;
} catch {
  Ai = fn;
}
const tc = mt, { stringify: Q0, stripBom: Z0 } = hf;
async function YF(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Ai, n = "throws" in t ? t.throws : !0;
  let i = await tc.fromCallback(r.readFile)(e, t);
  i = Z0(i);
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
const XF = tc.fromPromise(YF);
function JF(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || Ai, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = Z0(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function QF(e, t, r = {}) {
  const n = r.fs || Ai, i = Q0(t, r);
  await tc.fromCallback(n.writeFile)(e, i, r);
}
const ZF = tc.fromPromise(QF);
function ej(e, t, r = {}) {
  const n = r.fs || Ai, i = Q0(t, r);
  return n.writeFileSync(e, i, r);
}
var tj = {
  readFile: XF,
  readFileSync: JF,
  writeFile: ZF,
  writeFileSync: ej
};
const Mo = tj;
var rj = {
  // jsonfile exports
  readJson: Mo.readFile,
  readJsonSync: Mo.readFileSync,
  writeJson: Mo.writeFile,
  writeJsonSync: Mo.writeFileSync
};
const nj = mt.fromCallback, $s = yt, e_ = Re, t_ = pr, ij = Gn.pathExists;
function sj(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = e_.dirname(e);
  ij(i, (s, o) => {
    if (s) return n(s);
    if (o) return $s.writeFile(e, t, r, n);
    t_.mkdirs(i, (a) => {
      if (a) return n(a);
      $s.writeFile(e, t, r, n);
    });
  });
}
function oj(e, ...t) {
  const r = e_.dirname(e);
  if ($s.existsSync(r))
    return $s.writeFileSync(e, ...t);
  t_.mkdirsSync(r), $s.writeFileSync(e, ...t);
}
var pf = {
  outputFile: nj(sj),
  outputFileSync: oj
};
const { stringify: aj } = hf, { outputFile: cj } = pf;
async function lj(e, t, r = {}) {
  const n = aj(t, r);
  await cj(e, n, r);
}
var uj = lj;
const { stringify: dj } = hf, { outputFileSync: fj } = pf;
function hj(e, t, r) {
  const n = dj(t, r);
  fj(e, n, r);
}
var pj = hj;
const mj = mt.fromPromise, ht = rj;
ht.outputJson = mj(uj);
ht.outputJsonSync = pj;
ht.outputJSON = ht.outputJson;
ht.outputJSONSync = ht.outputJsonSync;
ht.writeJSON = ht.writeJson;
ht.writeJSONSync = ht.writeJsonSync;
ht.readJSON = ht.readJson;
ht.readJSONSync = ht.readJsonSync;
var yj = ht;
const gj = yt, Ul = Re, _j = df.copy, r_ = ec.remove, vj = pr.mkdirp, $j = Gn.pathExists, qp = Vi;
function wj(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  qp.checkPaths(e, t, "move", r, (s, o) => {
    if (s) return n(s);
    const { srcStat: a, isChangingCase: c = !1 } = o;
    qp.checkParentPaths(e, a, t, "move", (u) => {
      if (u) return n(u);
      if (Ej(t)) return Bp(e, t, i, c, n);
      vj(Ul.dirname(t), (l) => l ? n(l) : Bp(e, t, i, c, n));
    });
  });
}
function Ej(e) {
  const t = Ul.dirname(e);
  return Ul.parse(t).root === t;
}
function Bp(e, t, r, n, i) {
  if (n) return Kc(e, t, r, i);
  if (r)
    return r_(t, (s) => s ? i(s) : Kc(e, t, r, i));
  $j(t, (s, o) => s ? i(s) : o ? i(new Error("dest already exists.")) : Kc(e, t, r, i));
}
function Kc(e, t, r, n) {
  gj.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : bj(e, t, r, n) : n());
}
function bj(e, t, r, n) {
  _j(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (s) => s ? n(s) : r_(e, n));
}
var Sj = wj;
const n_ = yt, xl = Re, Pj = df.copySync, i_ = ec.removeSync, Tj = pr.mkdirpSync, Hp = Vi;
function Nj(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: s = !1 } = Hp.checkPathsSync(e, t, "move", r);
  return Hp.checkParentPathsSync(e, i, t, "move"), Oj(t) || Tj(xl.dirname(t)), Aj(e, t, n, s);
}
function Oj(e) {
  const t = xl.dirname(e);
  return xl.parse(t).root === t;
}
function Aj(e, t, r, n) {
  if (n) return Yc(e, t, r);
  if (r)
    return i_(t), Yc(e, t, r);
  if (n_.existsSync(t)) throw new Error("dest already exists.");
  return Yc(e, t, r);
}
function Yc(e, t, r) {
  try {
    n_.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Rj(e, t, r);
  }
}
function Rj(e, t, r) {
  return Pj(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), i_(e);
}
var Cj = Nj;
const Ij = mt.fromCallback;
var Dj = {
  move: Ij(Sj),
  moveSync: Cj
}, pn = {
  // Export promiseified graceful-fs:
  ...zn,
  // Export extra methods:
  ...df,
  ..._F,
  ...GF,
  ...yj,
  ...pr,
  ...Dj,
  ...pf,
  ...Gn,
  ...ec
}, Wn = {}, an = {}, Ue = {}, cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.CancellationError = cn.CancellationToken = void 0;
const kj = ny;
class Fj extends kj.EventEmitter {
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
      return Promise.reject(new Vl());
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
          s(new Vl());
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
cn.CancellationToken = Fj;
class Vl extends Error {
  constructor() {
    super("cancelled");
  }
}
cn.CancellationError = Vl;
var qi = {};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.newError = jj;
function jj(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var ft = {}, ql = { exports: {} }, Lo = { exports: {} }, Xc, zp;
function Mj() {
  if (zp) return Xc;
  zp = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, s = n * 365.25;
  Xc = function(l, d) {
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
  return Xc;
}
var Jc, Gp;
function s_() {
  if (Gp) return Jc;
  Gp = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = u, n.disable = a, n.enable = s, n.enabled = c, n.humanize = Mj(), n.destroy = l, Object.keys(t).forEach((d) => {
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
  return Jc = e, Jc;
}
var Wp;
function Lj() {
  return Wp || (Wp = 1, function(e, t) {
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
    e.exports = s_()(t);
    const { formatters: a } = e.exports;
    a.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(Lo, Lo.exports)), Lo.exports;
}
var Uo = { exports: {} }, Qc, Kp;
function Uj() {
  return Kp || (Kp = 1, Qc = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), Qc;
}
var Zc, Yp;
function xj() {
  if (Yp) return Zc;
  Yp = 1;
  const e = Ca, t = iy, r = Uj(), { env: n } = process;
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
  return Zc = {
    supportsColor: a,
    stdout: s(o(!0, t.isatty(1))),
    stderr: s(o(!0, t.isatty(2)))
  }, Zc;
}
var Xp;
function Vj() {
  return Xp || (Xp = 1, function(e, t) {
    const r = iy, n = ru;
    t.init = l, t.log = a, t.formatArgs = s, t.save = c, t.load = u, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = xj();
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
    e.exports = s_()(t);
    const { formatters: d } = e.exports;
    d.o = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, d.O = function(h) {
      return this.inspectOpts.colors = this.useColors, n.inspect(h, this.inspectOpts);
    };
  }(Uo, Uo.exports)), Uo.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? ql.exports = Lj() : ql.exports = Vj();
var qj = ql.exports, Ys = {};
Object.defineProperty(Ys, "__esModule", { value: !0 });
Ys.ProgressCallbackTransform = void 0;
const Bj = xs;
class Hj extends Bj.Transform {
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
Ys.ProgressCallbackTransform = Hj;
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.DigestTransform = ft.HttpExecutor = ft.HttpError = void 0;
ft.createHttpError = Hl;
ft.parseJson = Qj;
ft.configureRequestOptionsFromUrl = a_;
ft.configureRequestUrl = yf;
ft.safeGetHeader = Ei;
ft.configureRequestOptions = wa;
ft.safeStringifyJson = Ea;
const zj = Vs, Gj = qj, Wj = fn, Kj = xs, Bl = hn, Yj = cn, Jp = qi, Xj = Ys, Sn = (0, Gj.default)("electron-builder");
function Hl(e, t = null) {
  return new mf(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Ea(e.headers), t);
}
const Jj = /* @__PURE__ */ new Map([
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
class mf extends Error {
  constructor(t, r = `HTTP error: ${Jj.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
ft.HttpError = mf;
function Qj(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class di {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Yj.CancellationToken(), n) {
    wa(t);
    const i = n == null ? void 0 : JSON.stringify(n), s = i ? Buffer.from(i) : void 0;
    if (s != null) {
      Sn(i);
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
    return Sn.enabled && Sn(`Request: ${Ea(t)}`), r.createPromise((s, o, a) => {
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
    if (Sn.enabled && Sn(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Ea(r)}`), t.statusCode === 404) {
      s(Hl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const u = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = u >= 300 && u < 400, d = Ei(t, "location");
    if (l && d != null) {
      if (o > this.maxRedirects) {
        s(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(di.prepareRedirectUrlOptions(d, r), n, a, o).then(i).catch(s);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", s), t.on("data", (p) => h += p), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const p = Ei(t, "content-type"), $ = p != null && (Array.isArray(p) ? p.find((_) => _.includes("json")) != null : p.includes("json"));
          s(Hl(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

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
      yf(t, a), wa(a), this.doDownload(a, {
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
      const o = Ei(s, "location");
      if (o != null) {
        n < this.maxRedirects ? this.doDownload(di.prepareRedirectUrlOptions(o, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? eM(r, s) : r.responseHandler(s, r.callback);
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
    const n = a_(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const s = di.reconstructOriginalUrl(r), o = o_(t, r);
      di.isCrossOriginRedirect(s, o) && (Sn.enabled && Sn(`Given the cross-origin redirect (from ${s.host} to ${o.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", s = t.path || "/";
    return new Bl.URL(`${r}//${n}${i}${s}`);
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
        if (n < r && (i instanceof mf && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
ft.HttpExecutor = di;
function o_(e, t) {
  try {
    return new Bl.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", s = `${n}//${r}${i}`;
    return new Bl.URL(e, s);
  }
}
function a_(e, t) {
  const r = wa(t), n = o_(e, t);
  return yf(n, r), r;
}
function yf(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class zl extends Kj.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, zj.createHash)(r);
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
      throw (0, Jp.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Jp.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
ft.DigestTransform = zl;
function Zj(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function Ei(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function eM(e, t) {
  if (!Zj(Ei(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const o = Ei(t, "content-length");
    o != null && r.push(new Xj.ProgressCallbackTransform(parseInt(o, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new zl(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new zl(e.options.sha2, "sha256", "hex"));
  const i = (0, Wj.createWriteStream)(e.destination);
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
function wa(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Ea(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var rc = {};
Object.defineProperty(rc, "__esModule", { value: !0 });
rc.MemoLazy = void 0;
class tM {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && c_(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
rc.MemoLazy = tM;
function c_(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), s = Object.keys(t);
    return i.length === s.length && i.every((o) => c_(e[o], t[o]));
  }
  return e === t;
}
var Xs = {};
Object.defineProperty(Xs, "__esModule", { value: !0 });
Xs.githubUrl = rM;
Xs.githubTagPrefix = nM;
Xs.getS3LikeProviderBaseUrl = iM;
function rM(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function nM(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function iM(e) {
  const t = e.provider;
  if (t === "s3")
    return sM(e);
  if (t === "spaces")
    return oM(e);
  throw new Error(`Not supported provider: ${t}`);
}
function sM(e) {
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
  return l_(t, e.path);
}
function l_(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function oM(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return l_(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var gf = {};
Object.defineProperty(gf, "__esModule", { value: !0 });
gf.retry = u_;
const aM = cn;
async function u_(e, t) {
  var r;
  const { retries: n, interval: i, backoff: s = 0, attempt: o = 0, shouldRetry: a, cancellationToken: c = new aM.CancellationToken() } = t;
  try {
    return await e();
  } catch (u) {
    if (await Promise.resolve((r = a == null ? void 0 : a(u)) !== null && r !== void 0 ? r : !0) && n > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + s * o)), await u_(e, { ...t, retries: n - 1, attempt: o + 1 });
    throw u;
  }
}
var _f = {};
Object.defineProperty(_f, "__esModule", { value: !0 });
_f.parseDn = cM;
function cM(e) {
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
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.nil = Ri.UUID = void 0;
const d_ = Vs, f_ = qi, lM = "options.name must be either a string or a Buffer", Qp = (0, d_.randomBytes)(16);
Qp[0] = Qp[0] | 1;
const sa = {}, ye = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  sa[t] = e, ye[e] = t;
}
class Hn {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Hn.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return uM(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = dM(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (sa[t[14] + t[15]] & 240) >> 4,
        variant: Zp((sa[t[19] + t[20]] & 224) >> 5),
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
        variant: Zp((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, f_.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
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
Ri.UUID = Hn;
Hn.OID = Hn.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Zp(e) {
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
var ws;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(ws || (ws = {}));
function uM(e, t, r, n, i = ws.ASCII) {
  const s = (0, d_.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, f_.newError)(lM, "ERR_INVALID_UUID_NAME");
  s.update(n), s.update(e);
  const a = s.digest();
  let c;
  switch (i) {
    case ws.BINARY:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, c = a;
      break;
    case ws.OBJECT:
      a[6] = a[6] & 15 | r, a[8] = a[8] & 63 | 128, c = new Hn(a);
      break;
    default:
      c = ye[a[0]] + ye[a[1]] + ye[a[2]] + ye[a[3]] + "-" + ye[a[4]] + ye[a[5]] + "-" + ye[a[6] & 15 | r] + ye[a[7]] + "-" + ye[a[8] & 63 | 128] + ye[a[9]] + "-" + ye[a[10]] + ye[a[11]] + ye[a[12]] + ye[a[13]] + ye[a[14]] + ye[a[15]];
      break;
  }
  return c;
}
function dM(e) {
  return ye[e[0]] + ye[e[1]] + ye[e[2]] + ye[e[3]] + "-" + ye[e[4]] + ye[e[5]] + "-" + ye[e[6]] + ye[e[7]] + "-" + ye[e[8]] + ye[e[9]] + "-" + ye[e[10]] + ye[e[11]] + ye[e[12]] + ye[e[13]] + ye[e[14]] + ye[e[15]];
}
Ri.nil = new Hn("00000000-0000-0000-0000-000000000000");
var Js = {}, h_ = {};
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
              M(w, "Max buffer length exceeded: " + r[O]);
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
    function M(w, y) {
      return J(w), w.trackPosition && (y += `
Line: ` + w.line + `
Column: ` + w.column + `
Char: ` + w.c), y = new Error(y), w.error = y, x(w, "onerror", y), w;
    }
    function B(w) {
      return w.sawRoot && !w.closedRoot && L(w, "Unclosed root tag"), w.state !== R.BEGIN && w.state !== R.BEGIN_WHITESPACE && w.state !== R.TEXT && M(w, "Unexpected end"), J(w), w.c = "", w.closed = !0, x(w, "onend"), n.call(w, w.strict, w.opt), w;
    }
    function L(w, y) {
      if (typeof w != "object" || !(w instanceof n))
        throw new Error("bad call to strictFail");
      w.strict && M(w, y);
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
            L(
              w,
              "xml: prefix must be bound to " + p + `
Actual: ` + w.attribValue
            );
          else if (O === "xmlns" && w.attribValue !== $)
            L(
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
        k.prefix = O.prefix, k.local = O.local, k.uri = k.ns[O.prefix] || "", k.prefix && !k.uri && (L(
          w,
          "Unbound namespace prefix: " + JSON.stringify(w.tagName)
        ), k.uri = O.prefix);
        var K = w.tags[w.tags.length - 1] || w;
        k.ns && K.ns !== k.ns && Object.keys(k.ns).forEach(function(It) {
          q(w, "onopennamespace", {
            prefix: It,
            uri: k.ns[It]
          });
        });
        for (var fe = 0, ge = w.attribList.length; fe < ge; fe++) {
          var Ee = w.attribList[fe], Te = Ee[0], Xe = Ee[1], _e = V(Te, !0), je = _e.prefix, Ut = _e.local, Ct = je === "" ? "" : k.ns[je] || "", Pt = {
            name: Te,
            value: Xe,
            prefix: je,
            local: Ut,
            uri: Ct
          };
          je && je !== "xmlns" && !Ct && (L(
            w,
            "Unbound namespace prefix: " + JSON.stringify(je)
          ), Pt.uri = je), w.tag.attributes[Te] = Pt, q(w, "onattribute", Pt);
        }
        w.attribList.length = 0;
      }
      w.tag.isSelfClosing = !!y, w.sawRoot = !0, w.tags.push(w.tag), q(w, "onopentag", w.tag), y || (!w.noscript && w.tagName.toLowerCase() === "script" ? w.state = R.SCRIPT : w.state = R.TEXT, w.tag = null, w.tagName = ""), w.attribName = w.attribValue = "", w.attribList.length = 0;
    }
    function N(w) {
      if (!w.tagName) {
        L(w, "Weird empty close tag."), w.textNode += "</>", w.state = R.TEXT;
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
          L(w, "Unexpected close tag");
        else
          break;
      }
      if (y < 0) {
        L(w, "Unmatched closing tag: " + w.tagName), w.textNode += "</" + w.tagName + ">", w.state = R.TEXT;
        return;
      }
      w.tagName = k;
      for (var fe = w.tags.length; fe-- > y; ) {
        var ge = w.tag = w.tags.pop();
        w.tagName = w.tag.name, q(w, "onclosetag", w.tagName);
        var Ee = {};
        for (var Te in ge.ns)
          Ee[Te] = ge.ns[Te];
        var Xe = w.tags[w.tags.length - 1] || w;
        w.opt.xmlns && ge.ns !== Xe.ns && Object.keys(ge.ns).forEach(function(_e) {
          var je = ge.ns[_e];
          q(w, "onclosenamespace", { prefix: _e, uri: je });
        });
      }
      y === 0 && (w.closedRoot = !0), w.tagName = w.attribValue = w.attribName = "", w.attribList.length = 0, w.state = R.TEXT;
    }
    function S(w) {
      var y = w.entity, k = y.toLowerCase(), O, K = "";
      return w.ENTITIES[y] ? w.ENTITIES[y] : w.ENTITIES[k] ? w.ENTITIES[k] : (y = k, y.charAt(0) === "#" && (y.charAt(1) === "x" ? (y = y.slice(2), O = parseInt(y, 16), K = O.toString(16)) : (y = y.slice(1), O = parseInt(y, 10), K = O.toString(10))), y = y.replace(/^0+/, ""), isNaN(O) || K.toLowerCase() !== y || O < 0 || O > 1114111 ? (L(w, "Invalid character entity"), "&" + w.entity + ";") : String.fromCodePoint(O));
    }
    function f(w, y) {
      y === "<" ? (w.state = R.OPEN_WAKA, w.startTagPosition = w.position) : I(y) || (L(w, "Non-whitespace before first tag."), w.textNode = y, w.state = R.TEXT);
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
        return M(
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
            O === "<" && !(y.sawRoot && y.closedRoot && !y.strict) ? (y.state = R.OPEN_WAKA, y.startTagPosition = y.position) : (!I(O) && (!y.sawRoot || y.closedRoot) && L(y, "Text data outside of root node."), O === "&" ? y.state = R.TEXT_ENTITY : y.textNode += O);
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
              if (L(y, "Unencoded <"), y.startTagPosition + 1 < y.position) {
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
            y.doctype && y.doctype !== !0 && y.sgmlDecl ? (y.state = R.DOCTYPE_DTD, y.doctype += "<!" + y.sgmlDecl + O, y.sgmlDecl = "") : (y.sgmlDecl + O).toUpperCase() === d ? (q(y, "onopencdata"), y.state = R.CDATA, y.sgmlDecl = "", y.cdata = "") : (y.sgmlDecl + O).toUpperCase() === h ? (y.state = R.DOCTYPE, (y.doctype || y.sawRoot) && L(
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
            O !== ">" ? (L(y, "Malformed comment"), y.comment += "--" + O, y.state = R.COMMENT) : y.doctype && y.doctype !== !0 ? y.state = R.DOCTYPE_DTD : y.state = R.TEXT;
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
            G(m, O) ? y.tagName += O : (H(y), O === ">" ? b(y) : O === "/" ? y.state = R.OPEN_TAG_SLASH : (I(O) || L(y, "Invalid character in tag name"), y.state = R.ATTRIB));
            continue;
          case R.OPEN_TAG_SLASH:
            O === ">" ? (b(y, !0), N(y)) : (L(
              y,
              "Forward-slash in opening tag not followed by >"
            ), y.state = R.ATTRIB);
            continue;
          case R.ATTRIB:
            if (I(O))
              continue;
            O === ">" ? b(y) : O === "/" ? y.state = R.OPEN_TAG_SLASH : G(v, O) ? (y.attribName = O, y.attribValue = "", y.state = R.ATTRIB_NAME) : L(y, "Invalid attribute name");
            continue;
          case R.ATTRIB_NAME:
            O === "=" ? y.state = R.ATTRIB_VALUE : O === ">" ? (L(y, "Attribute without value"), y.attribValue = y.attribName, C(y), b(y)) : I(O) ? y.state = R.ATTRIB_NAME_SAW_WHITE : G(m, O) ? y.attribName += O : L(y, "Invalid attribute name");
            continue;
          case R.ATTRIB_NAME_SAW_WHITE:
            if (O === "=")
              y.state = R.ATTRIB_VALUE;
            else {
              if (I(O))
                continue;
              L(y, "Attribute without value"), y.tag.attributes[y.attribName] = "", y.attribValue = "", q(y, "onattribute", {
                name: y.attribName,
                value: ""
              }), y.attribName = "", O === ">" ? b(y) : G(v, O) ? (y.attribName = O, y.state = R.ATTRIB_NAME) : (L(y, "Invalid attribute name"), y.state = R.ATTRIB);
            }
            continue;
          case R.ATTRIB_VALUE:
            if (I(O))
              continue;
            F(O) ? (y.q = O, y.state = R.ATTRIB_VALUE_QUOTED) : (y.opt.unquotedAttributeValues || M(y, "Unquoted attribute value"), y.state = R.ATTRIB_VALUE_UNQUOTED, y.attribValue = O);
            continue;
          case R.ATTRIB_VALUE_QUOTED:
            if (O !== y.q) {
              O === "&" ? y.state = R.ATTRIB_VALUE_ENTITY_Q : y.attribValue += O;
              continue;
            }
            C(y), y.q = "", y.state = R.ATTRIB_VALUE_CLOSED;
            continue;
          case R.ATTRIB_VALUE_CLOSED:
            I(O) ? y.state = R.ATTRIB : O === ">" ? b(y) : O === "/" ? y.state = R.OPEN_TAG_SLASH : G(v, O) ? (L(y, "No whitespace between attributes"), y.attribName = O, y.attribValue = "", y.state = R.ATTRIB_NAME) : L(y, "Invalid attribute name");
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
              O === ">" ? N(y) : G(m, O) ? y.tagName += O : y.script ? (y.script += "</" + y.tagName + O, y.tagName = "", y.state = R.SCRIPT) : (I(O) || L(y, "Invalid tagname in closing tag"), y.state = R.CLOSE_TAG_SAW_WHITE);
            else {
              if (I(O))
                continue;
              me(v, O) ? y.script ? (y.script += "</" + O, y.state = R.SCRIPT) : L(y, "Invalid tagname in closing tag.") : y.tagName = O;
            }
            continue;
          case R.CLOSE_TAG_SAW_WHITE:
            if (I(O))
              continue;
            O === ">" ? N(y) : L(y, "Invalid characters in closing tag");
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
            } else G(y.entity.length ? A : E, O) ? y.entity += O : (L(y, "Invalid character in entity name"), y[Ee] += "&" + y.entity + O, y.entity = "", y.state = ge);
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
        for (var Xe = ""; ++Ee < Te; ) {
          var _e = Number(arguments[Ee]);
          if (!isFinite(_e) || // `NaN`, `+Infinity`, or `-Infinity`
          _e < 0 || // not a valid Unicode code point
          _e > 1114111 || // not a valid Unicode code point
          y(_e) !== _e)
            throw RangeError("Invalid code point: " + _e);
          _e <= 65535 ? K.push(_e) : (_e -= 65536, fe = (_e >> 10) + 55296, ge = _e % 1024 + 56320, K.push(fe, ge)), (Ee + 1 === Te || K.length > O) && (Xe += w.apply(null, K), K.length = 0);
        }
        return Xe;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: k,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = k;
    }();
  })(e);
})(h_);
Object.defineProperty(Js, "__esModule", { value: !0 });
Js.XElement = void 0;
Js.parseXml = mM;
const fM = h_, xo = qi;
class p_ {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, xo.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!pM(t))
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
      if (em(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => em(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
Js.XElement = p_;
const hM = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function pM(e) {
  return hM.test(e);
}
function em(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function mM(e) {
  let t = null;
  const r = fM.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const s = new p_(i.name);
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
  var t = cn;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = qi;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = ft;
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
  var i = rc;
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
  var a = gf;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var c = _f;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var u = Ri;
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
})(Ue);
var Ye = {}, vf = {}, rr = {};
function m_(e) {
  return typeof e > "u" || e === null;
}
function yM(e) {
  return typeof e == "object" && e !== null;
}
function gM(e) {
  return Array.isArray(e) ? e : m_(e) ? [] : [e];
}
function _M(e, t) {
  var r, n, i, s;
  if (t)
    for (s = Object.keys(t), r = 0, n = s.length; r < n; r += 1)
      i = s[r], e[i] = t[i];
  return e;
}
function vM(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function $M(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
rr.isNothing = m_;
rr.isObject = yM;
rr.toArray = gM;
rr.repeat = vM;
rr.isNegativeZero = $M;
rr.extend = _M;
function y_(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Rs(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = y_(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Rs.prototype = Object.create(Error.prototype);
Rs.prototype.constructor = Rs;
Rs.prototype.toString = function(t) {
  return this.name + ": " + y_(this, t);
};
var Qs = Rs, as = rr;
function el(e, t, r, n, i) {
  var s = "", o = "", a = Math.floor(i / 2) - 1;
  return n - t > a && (s = " ... ", t = n - a + s.length), r - n > a && (o = " ...", r = n + a - o.length), {
    str: s + e.slice(t, r).replace(/\t/g, "→") + o,
    pos: n - t + s.length
    // relative position
  };
}
function tl(e, t) {
  return as.repeat(" ", t - e.length) + e;
}
function wM(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], s, o = -1; s = r.exec(e.buffer); )
    i.push(s.index), n.push(s.index + s[0].length), e.position <= s.index && o < 0 && (o = n.length - 2);
  o < 0 && (o = n.length - 1);
  var a = "", c, u, l = Math.min(e.line + t.linesAfter, i.length).toString().length, d = t.maxLength - (t.indent + l + 3);
  for (c = 1; c <= t.linesBefore && !(o - c < 0); c++)
    u = el(
      e.buffer,
      n[o - c],
      i[o - c],
      e.position - (n[o] - n[o - c]),
      d
    ), a = as.repeat(" ", t.indent) + tl((e.line - c + 1).toString(), l) + " | " + u.str + `
` + a;
  for (u = el(e.buffer, n[o], i[o], e.position, d), a += as.repeat(" ", t.indent) + tl((e.line + 1).toString(), l) + " | " + u.str + `
`, a += as.repeat("-", t.indent + l + 3 + u.pos) + `^
`, c = 1; c <= t.linesAfter && !(o + c >= i.length); c++)
    u = el(
      e.buffer,
      n[o + c],
      i[o + c],
      e.position - (n[o] - n[o + c]),
      d
    ), a += as.repeat(" ", t.indent) + tl((e.line + c + 1).toString(), l) + " | " + u.str + `
`;
  return a.replace(/\n$/, "");
}
var EM = wM, tm = Qs, bM = [
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
], SM = [
  "scalar",
  "sequence",
  "mapping"
];
function PM(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function TM(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (bM.indexOf(r) === -1)
      throw new tm('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = PM(t.styleAliases || null), SM.indexOf(this.kind) === -1)
    throw new tm('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var gt = TM, ts = Qs, rl = gt;
function rm(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(s, o) {
      s.tag === n.tag && s.kind === n.kind && s.multi === n.multi && (i = o);
    }), r[i] = n;
  }), r;
}
function NM() {
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
function Gl(e) {
  return this.extend(e);
}
Gl.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof rl)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new ts("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(s) {
    if (!(s instanceof rl))
      throw new ts("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (s.loadKind && s.loadKind !== "scalar")
      throw new ts("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (s.multi)
      throw new ts("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(s) {
    if (!(s instanceof rl))
      throw new ts("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Gl.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = rm(i, "implicit"), i.compiledExplicit = rm(i, "explicit"), i.compiledTypeMap = NM(i.compiledImplicit, i.compiledExplicit), i;
};
var g_ = Gl, OM = gt, __ = new OM("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), AM = gt, v_ = new AM("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), RM = gt, $_ = new RM("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), CM = g_, w_ = new CM({
  explicit: [
    __,
    v_,
    $_
  ]
}), IM = gt;
function DM(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function kM() {
  return null;
}
function FM(e) {
  return e === null;
}
var E_ = new IM("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: DM,
  construct: kM,
  predicate: FM,
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
}), jM = gt;
function MM(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function LM(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function UM(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var b_ = new jM("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: MM,
  construct: LM,
  predicate: UM,
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
}), xM = rr, VM = gt;
function qM(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function BM(e) {
  return 48 <= e && e <= 55;
}
function HM(e) {
  return 48 <= e && e <= 57;
}
function zM(e) {
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
          if (!qM(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!BM(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!HM(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function GM(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function WM(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !xM.isNegativeZero(e);
}
var S_ = new VM("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: zM,
  construct: GM,
  predicate: WM,
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
}), P_ = rr, KM = gt, YM = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function XM(e) {
  return !(e === null || !YM.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function JM(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var QM = /^[-+]?[0-9]+e/;
function ZM(e, t) {
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
  else if (P_.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), QM.test(r) ? r.replace("e", ".e") : r;
}
function eL(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || P_.isNegativeZero(e));
}
var T_ = new KM("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: XM,
  construct: JM,
  predicate: eL,
  represent: ZM,
  defaultStyle: "lowercase"
}), N_ = w_.extend({
  implicit: [
    E_,
    b_,
    S_,
    T_
  ]
}), O_ = N_, tL = gt, A_ = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), R_ = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function rL(e) {
  return e === null ? !1 : A_.exec(e) !== null || R_.exec(e) !== null;
}
function nL(e) {
  var t, r, n, i, s, o, a, c = 0, u = null, l, d, h;
  if (t = A_.exec(e), t === null && (t = R_.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (s = +t[4], o = +t[5], a = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (l = +t[10], d = +(t[11] || 0), u = (l * 60 + d) * 6e4, t[9] === "-" && (u = -u)), h = new Date(Date.UTC(r, n, i, s, o, a, c)), u && h.setTime(h.getTime() - u), h;
}
function iL(e) {
  return e.toISOString();
}
var C_ = new tL("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: rL,
  construct: nL,
  instanceOf: Date,
  represent: iL
}), sL = gt;
function oL(e) {
  return e === "<<" || e === null;
}
var I_ = new sL("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: oL
}), aL = gt, $f = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function cL(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, s = $f;
  for (r = 0; r < i; r++)
    if (t = s.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function lL(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, s = $f, o = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(o >> 16 & 255), a.push(o >> 8 & 255), a.push(o & 255)), o = o << 6 | s.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (a.push(o >> 16 & 255), a.push(o >> 8 & 255), a.push(o & 255)) : r === 18 ? (a.push(o >> 10 & 255), a.push(o >> 2 & 255)) : r === 12 && a.push(o >> 4 & 255), new Uint8Array(a);
}
function uL(e) {
  var t = "", r = 0, n, i, s = e.length, o = $f;
  for (n = 0; n < s; n++)
    n % 3 === 0 && n && (t += o[r >> 18 & 63], t += o[r >> 12 & 63], t += o[r >> 6 & 63], t += o[r & 63]), r = (r << 8) + e[n];
  return i = s % 3, i === 0 ? (t += o[r >> 18 & 63], t += o[r >> 12 & 63], t += o[r >> 6 & 63], t += o[r & 63]) : i === 2 ? (t += o[r >> 10 & 63], t += o[r >> 4 & 63], t += o[r << 2 & 63], t += o[64]) : i === 1 && (t += o[r >> 2 & 63], t += o[r << 4 & 63], t += o[64], t += o[64]), t;
}
function dL(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var D_ = new aL("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: cL,
  construct: lL,
  predicate: dL,
  represent: uL
}), fL = gt, hL = Object.prototype.hasOwnProperty, pL = Object.prototype.toString;
function mL(e) {
  if (e === null) return !0;
  var t = [], r, n, i, s, o, a = e;
  for (r = 0, n = a.length; r < n; r += 1) {
    if (i = a[r], o = !1, pL.call(i) !== "[object Object]") return !1;
    for (s in i)
      if (hL.call(i, s))
        if (!o) o = !0;
        else return !1;
    if (!o) return !1;
    if (t.indexOf(s) === -1) t.push(s);
    else return !1;
  }
  return !0;
}
function yL(e) {
  return e !== null ? e : [];
}
var k_ = new fL("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: mL,
  construct: yL
}), gL = gt, _L = Object.prototype.toString;
function vL(e) {
  if (e === null) return !0;
  var t, r, n, i, s, o = e;
  for (s = new Array(o.length), t = 0, r = o.length; t < r; t += 1) {
    if (n = o[t], _L.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    s[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function $L(e) {
  if (e === null) return [];
  var t, r, n, i, s, o = e;
  for (s = new Array(o.length), t = 0, r = o.length; t < r; t += 1)
    n = o[t], i = Object.keys(n), s[t] = [i[0], n[i[0]]];
  return s;
}
var F_ = new gL("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: vL,
  construct: $L
}), wL = gt, EL = Object.prototype.hasOwnProperty;
function bL(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (EL.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function SL(e) {
  return e !== null ? e : {};
}
var j_ = new wL("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: bL,
  construct: SL
}), wf = O_.extend({
  implicit: [
    C_,
    I_
  ],
  explicit: [
    D_,
    k_,
    F_,
    j_
  ]
}), kn = rr, M_ = Qs, PL = EM, TL = wf, ln = Object.prototype.hasOwnProperty, ba = 1, L_ = 2, U_ = 3, Sa = 4, nl = 1, NL = 2, nm = 3, OL = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, AL = /[\x85\u2028\u2029]/, RL = /[,\[\]\{\}]/, x_ = /^(?:!|!!|![a-z\-]+!)$/i, V_ = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function im(e) {
  return Object.prototype.toString.call(e);
}
function fr(e) {
  return e === 10 || e === 13;
}
function Un(e) {
  return e === 9 || e === 32;
}
function St(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function fi(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function CL(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function IL(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function DL(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function sm(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function kL(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function q_(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var B_ = new Array(256), H_ = new Array(256);
for (var ri = 0; ri < 256; ri++)
  B_[ri] = sm(ri) ? 1 : 0, H_[ri] = sm(ri);
function FL(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || TL, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function z_(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = PL(r), new M_(t, r);
}
function te(e, t) {
  throw z_(e, t);
}
function Pa(e, t) {
  e.onWarning && e.onWarning.call(null, z_(e, t));
}
var om = {
  YAML: function(t, r, n) {
    var i, s, o;
    t.version !== null && te(t, "duplication of %YAML directive"), n.length !== 1 && te(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && te(t, "ill-formed argument of the YAML directive"), s = parseInt(i[1], 10), o = parseInt(i[2], 10), s !== 1 && te(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = o < 2, o !== 1 && o !== 2 && Pa(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, s;
    n.length !== 2 && te(t, "TAG directive accepts exactly two arguments"), i = n[0], s = n[1], x_.test(i) || te(t, "ill-formed tag handle (first argument) of the TAG directive"), ln.call(t.tagMap, i) && te(t, 'there is a previously declared suffix for "' + i + '" tag handle'), V_.test(s) || te(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      s = decodeURIComponent(s);
    } catch {
      te(t, "tag prefix is malformed: " + s);
    }
    t.tagMap[i] = s;
  }
};
function on(e, t, r, n) {
  var i, s, o, a;
  if (t < r) {
    if (a = e.input.slice(t, r), n)
      for (i = 0, s = a.length; i < s; i += 1)
        o = a.charCodeAt(i), o === 9 || 32 <= o && o <= 1114111 || te(e, "expected valid JSON character");
    else OL.test(a) && te(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function am(e, t, r, n) {
  var i, s, o, a;
  for (kn.isObject(r) || te(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), o = 0, a = i.length; o < a; o += 1)
    s = i[o], ln.call(t, s) || (q_(t, s, r[s]), n[s] = !0);
}
function hi(e, t, r, n, i, s, o, a, c) {
  var u, l;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), u = 0, l = i.length; u < l; u += 1)
      Array.isArray(i[u]) && te(e, "nested arrays are not supported inside keys"), typeof i == "object" && im(i[u]) === "[object Object]" && (i[u] = "[object Object]");
  if (typeof i == "object" && im(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(s))
      for (u = 0, l = s.length; u < l; u += 1)
        am(e, t, s[u], r);
    else
      am(e, t, s, r);
  else
    !e.json && !ln.call(r, i) && ln.call(t, i) && (e.line = o || e.line, e.lineStart = a || e.lineStart, e.position = c || e.position, te(e, "duplicated mapping key")), q_(t, i, s), delete r[i];
  return t;
}
function Ef(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : te(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ke(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Un(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (fr(i))
      for (Ef(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Pa(e, "deficient indentation"), n;
}
function nc(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || St(r)));
}
function bf(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += kn.repeat(`
`, t - 1));
}
function jL(e, t, r) {
  var n, i, s, o, a, c, u, l, d = e.kind, h = e.result, p;
  if (p = e.input.charCodeAt(e.position), St(p) || fi(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), St(i) || r && fi(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", s = o = e.position, a = !1; p !== 0; ) {
    if (p === 58) {
      if (i = e.input.charCodeAt(e.position + 1), St(i) || r && fi(i))
        break;
    } else if (p === 35) {
      if (n = e.input.charCodeAt(e.position - 1), St(n))
        break;
    } else {
      if (e.position === e.lineStart && nc(e) || r && fi(p))
        break;
      if (fr(p))
        if (c = e.line, u = e.lineStart, l = e.lineIndent, ke(e, !1, -1), e.lineIndent >= t) {
          a = !0, p = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = o, e.line = c, e.lineStart = u, e.lineIndent = l;
          break;
        }
    }
    a && (on(e, s, o, !1), bf(e, e.line - c), s = o = e.position, a = !1), Un(p) || (o = e.position + 1), p = e.input.charCodeAt(++e.position);
  }
  return on(e, s, o, !1), e.result ? !0 : (e.kind = d, e.result = h, !1);
}
function ML(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (on(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else fr(r) ? (on(e, n, i, !0), bf(e, ke(e, !1, t)), n = i = e.position) : e.position === e.lineStart && nc(e) ? te(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  te(e, "unexpected end of the stream within a single quoted scalar");
}
function LL(e, t) {
  var r, n, i, s, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return on(e, r, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (on(e, r, e.position, !0), a = e.input.charCodeAt(++e.position), fr(a))
        ke(e, !1, t);
      else if (a < 256 && B_[a])
        e.result += H_[a], e.position++;
      else if ((o = IL(a)) > 0) {
        for (i = o, s = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (o = CL(a)) >= 0 ? s = (s << 4) + o : te(e, "expected hexadecimal character");
        e.result += kL(s), e.position++;
      } else
        te(e, "unknown escape sequence");
      r = n = e.position;
    } else fr(a) ? (on(e, r, n, !0), bf(e, ke(e, !1, t)), r = n = e.position) : e.position === e.lineStart && nc(e) ? te(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  te(e, "unexpected end of the stream within a double quoted scalar");
}
function UL(e, t) {
  var r = !0, n, i, s, o = e.tag, a, c = e.anchor, u, l, d, h, p, $ = /* @__PURE__ */ Object.create(null), _, v, m, E;
  if (E = e.input.charCodeAt(e.position), E === 91)
    l = 93, p = !1, a = [];
  else if (E === 123)
    l = 125, p = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), E = e.input.charCodeAt(++e.position); E !== 0; ) {
    if (ke(e, !0, t), E = e.input.charCodeAt(e.position), E === l)
      return e.position++, e.tag = o, e.anchor = c, e.kind = p ? "mapping" : "sequence", e.result = a, !0;
    r ? E === 44 && te(e, "expected the node content, but found ','") : te(e, "missed comma between flow collection entries"), v = _ = m = null, d = h = !1, E === 63 && (u = e.input.charCodeAt(e.position + 1), St(u) && (d = h = !0, e.position++, ke(e, !0, t))), n = e.line, i = e.lineStart, s = e.position, Ci(e, t, ba, !1, !0), v = e.tag, _ = e.result, ke(e, !0, t), E = e.input.charCodeAt(e.position), (h || e.line === n) && E === 58 && (d = !0, E = e.input.charCodeAt(++e.position), ke(e, !0, t), Ci(e, t, ba, !1, !0), m = e.result), p ? hi(e, a, $, v, _, m, n, i, s) : d ? a.push(hi(e, null, $, v, _, m, n, i, s)) : a.push(_), ke(e, !0, t), E = e.input.charCodeAt(e.position), E === 44 ? (r = !0, E = e.input.charCodeAt(++e.position)) : r = !1;
  }
  te(e, "unexpected end of the stream within a flow collection");
}
function xL(e, t) {
  var r, n, i = nl, s = !1, o = !1, a = t, c = 0, u = !1, l, d;
  if (d = e.input.charCodeAt(e.position), d === 124)
    n = !1;
  else if (d === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; d !== 0; )
    if (d = e.input.charCodeAt(++e.position), d === 43 || d === 45)
      nl === i ? i = d === 43 ? nm : NL : te(e, "repeat of a chomping mode identifier");
    else if ((l = DL(d)) >= 0)
      l === 0 ? te(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? te(e, "repeat of an indentation width identifier") : (a = t + l - 1, o = !0);
    else
      break;
  if (Un(d)) {
    do
      d = e.input.charCodeAt(++e.position);
    while (Un(d));
    if (d === 35)
      do
        d = e.input.charCodeAt(++e.position);
      while (!fr(d) && d !== 0);
  }
  for (; d !== 0; ) {
    for (Ef(e), e.lineIndent = 0, d = e.input.charCodeAt(e.position); (!o || e.lineIndent < a) && d === 32; )
      e.lineIndent++, d = e.input.charCodeAt(++e.position);
    if (!o && e.lineIndent > a && (a = e.lineIndent), fr(d)) {
      c++;
      continue;
    }
    if (e.lineIndent < a) {
      i === nm ? e.result += kn.repeat(`
`, s ? 1 + c : c) : i === nl && s && (e.result += `
`);
      break;
    }
    for (n ? Un(d) ? (u = !0, e.result += kn.repeat(`
`, s ? 1 + c : c)) : u ? (u = !1, e.result += kn.repeat(`
`, c + 1)) : c === 0 ? s && (e.result += " ") : e.result += kn.repeat(`
`, c) : e.result += kn.repeat(`
`, s ? 1 + c : c), s = !0, o = !0, c = 0, r = e.position; !fr(d) && d !== 0; )
      d = e.input.charCodeAt(++e.position);
    on(e, r, e.position, !1);
  }
  return !0;
}
function cm(e, t) {
  var r, n = e.tag, i = e.anchor, s = [], o, a = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, te(e, "tab characters must not be used in indentation")), !(c !== 45 || (o = e.input.charCodeAt(e.position + 1), !St(o)))); ) {
    if (a = !0, e.position++, ke(e, !0, -1) && e.lineIndent <= t) {
      s.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, Ci(e, t, U_, !1, !0), s.push(e.result), ke(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && c !== 0)
      te(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = s, !0) : !1;
}
function VL(e, t, r) {
  var n, i, s, o, a, c, u = e.tag, l = e.anchor, d = {}, h = /* @__PURE__ */ Object.create(null), p = null, $ = null, _ = null, v = !1, m = !1, E;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = d), E = e.input.charCodeAt(e.position); E !== 0; ) {
    if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, te(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), s = e.line, (E === 63 || E === 58) && St(n))
      E === 63 ? (v && (hi(e, d, h, p, $, null, o, a, c), p = $ = _ = null), m = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : te(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, E = n;
    else {
      if (o = e.line, a = e.lineStart, c = e.position, !Ci(e, r, L_, !1, !0))
        break;
      if (e.line === s) {
        for (E = e.input.charCodeAt(e.position); Un(E); )
          E = e.input.charCodeAt(++e.position);
        if (E === 58)
          E = e.input.charCodeAt(++e.position), St(E) || te(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (hi(e, d, h, p, $, null, o, a, c), p = $ = _ = null), m = !0, v = !1, i = !1, p = e.tag, $ = e.result;
        else if (m)
          te(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = u, e.anchor = l, !0;
      } else if (m)
        te(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = u, e.anchor = l, !0;
    }
    if ((e.line === s || e.lineIndent > t) && (v && (o = e.line, a = e.lineStart, c = e.position), Ci(e, t, Sa, !0, i) && (v ? $ = e.result : _ = e.result), v || (hi(e, d, h, p, $, _, o, a, c), p = $ = _ = null), ke(e, !0, -1), E = e.input.charCodeAt(e.position)), (e.line === s || e.lineIndent > t) && E !== 0)
      te(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return v && hi(e, d, h, p, $, null, o, a, c), m && (e.tag = u, e.anchor = l, e.kind = "mapping", e.result = d), m;
}
function qL(e) {
  var t, r = !1, n = !1, i, s, o;
  if (o = e.input.charCodeAt(e.position), o !== 33) return !1;
  if (e.tag !== null && te(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (r = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (n = !0, i = "!!", o = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      o = e.input.charCodeAt(++e.position);
    while (o !== 0 && o !== 62);
    e.position < e.length ? (s = e.input.slice(t, e.position), o = e.input.charCodeAt(++e.position)) : te(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; o !== 0 && !St(o); )
      o === 33 && (n ? te(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), x_.test(i) || te(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), o = e.input.charCodeAt(++e.position);
    s = e.input.slice(t, e.position), RL.test(s) && te(e, "tag suffix cannot contain flow indicator characters");
  }
  s && !V_.test(s) && te(e, "tag name cannot contain such characters: " + s);
  try {
    s = decodeURIComponent(s);
  } catch {
    te(e, "tag name is malformed: " + s);
  }
  return r ? e.tag = s : ln.call(e.tagMap, i) ? e.tag = e.tagMap[i] + s : i === "!" ? e.tag = "!" + s : i === "!!" ? e.tag = "tag:yaml.org,2002:" + s : te(e, 'undeclared tag handle "' + i + '"'), !0;
}
function BL(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && te(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !St(r) && !fi(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && te(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function HL(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !St(n) && !fi(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && te(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), ln.call(e.anchorMap, r) || te(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], ke(e, !0, -1), !0;
}
function Ci(e, t, r, n, i) {
  var s, o, a, c = 1, u = !1, l = !1, d, h, p, $, _, v;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, s = o = a = Sa === r || U_ === r, n && ke(e, !0, -1) && (u = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; qL(e) || BL(e); )
      ke(e, !0, -1) ? (u = !0, a = s, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : a = !1;
  if (a && (a = u || i), (c === 1 || Sa === r) && (ba === r || L_ === r ? _ = t : _ = t + 1, v = e.position - e.lineStart, c === 1 ? a && (cm(e, v) || VL(e, v, _)) || UL(e, _) ? l = !0 : (o && xL(e, _) || ML(e, _) || LL(e, _) ? l = !0 : HL(e) ? (l = !0, (e.tag !== null || e.anchor !== null) && te(e, "alias node should not have any properties")) : jL(e, _, ba === r) && (l = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (l = a && cm(e, v))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && te(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), d = 0, h = e.implicitTypes.length; d < h; d += 1)
      if ($ = e.implicitTypes[d], $.resolve(e.result)) {
        e.result = $.construct(e.result), e.tag = $.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (ln.call(e.typeMap[e.kind || "fallback"], e.tag))
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
function zL(e) {
  var t = e.position, r, n, i, s = !1, o;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (o = e.input.charCodeAt(e.position)) !== 0 && (ke(e, !0, -1), o = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || o !== 37)); ) {
    for (s = !0, o = e.input.charCodeAt(++e.position), r = e.position; o !== 0 && !St(o); )
      o = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && te(e, "directive name must not be less than one character in length"); o !== 0; ) {
      for (; Un(o); )
        o = e.input.charCodeAt(++e.position);
      if (o === 35) {
        do
          o = e.input.charCodeAt(++e.position);
        while (o !== 0 && !fr(o));
        break;
      }
      if (fr(o)) break;
      for (r = e.position; o !== 0 && !St(o); )
        o = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    o !== 0 && Ef(e), ln.call(om, n) ? om[n](e, n, i) : Pa(e, 'unknown document directive "' + n + '"');
  }
  if (ke(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ke(e, !0, -1)) : s && te(e, "directives end mark is expected"), Ci(e, e.lineIndent - 1, Sa, !1, !0), ke(e, !0, -1), e.checkLineBreaks && AL.test(e.input.slice(t, e.position)) && Pa(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && nc(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ke(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    te(e, "end of the stream or a document separator is expected");
  else
    return;
}
function G_(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new FL(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, te(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    zL(r);
  return r.documents;
}
function GL(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = G_(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, s = n.length; i < s; i += 1)
    t(n[i]);
}
function WL(e, t) {
  var r = G_(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new M_("expected a single document in the stream, but found more");
  }
}
vf.loadAll = GL;
vf.load = WL;
var W_ = {}, ic = rr, Zs = Qs, KL = wf, K_ = Object.prototype.toString, Y_ = Object.prototype.hasOwnProperty, Sf = 65279, YL = 9, Cs = 10, XL = 13, JL = 32, QL = 33, ZL = 34, Wl = 35, eU = 37, tU = 38, rU = 39, nU = 42, X_ = 44, iU = 45, Ta = 58, sU = 61, oU = 62, aU = 63, cU = 64, J_ = 91, Q_ = 93, lU = 96, Z_ = 123, uU = 124, ev = 125, st = {};
st[0] = "\\0";
st[7] = "\\a";
st[8] = "\\b";
st[9] = "\\t";
st[10] = "\\n";
st[11] = "\\v";
st[12] = "\\f";
st[13] = "\\r";
st[27] = "\\e";
st[34] = '\\"';
st[92] = "\\\\";
st[133] = "\\N";
st[160] = "\\_";
st[8232] = "\\L";
st[8233] = "\\P";
var dU = [
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
], fU = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function hU(e, t) {
  var r, n, i, s, o, a, c;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, s = n.length; i < s; i += 1)
    o = n[i], a = String(t[o]), o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2)), c = e.compiledTypeMap.fallback[o], c && Y_.call(c.styleAliases, a) && (a = c.styleAliases[a]), r[o] = a;
  return r;
}
function pU(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new Zs("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + ic.repeat("0", n - t.length) + t;
}
var mU = 1, Is = 2;
function yU(e) {
  this.schema = e.schema || KL, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ic.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = hU(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Is : mU, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function lm(e, t) {
  for (var r = ic.repeat(" ", t), n = 0, i = -1, s = "", o, a = e.length; n < a; )
    i = e.indexOf(`
`, n), i === -1 ? (o = e.slice(n), n = a) : (o = e.slice(n, i + 1), n = i + 1), o.length && o !== `
` && (s += r), s += o;
  return s;
}
function Kl(e, t) {
  return `
` + ic.repeat(" ", e.indent * t);
}
function gU(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Na(e) {
  return e === JL || e === YL;
}
function Ds(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Sf || 65536 <= e && e <= 1114111;
}
function um(e) {
  return Ds(e) && e !== Sf && e !== XL && e !== Cs;
}
function dm(e, t, r) {
  var n = um(e), i = n && !Na(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== X_ && e !== J_ && e !== Q_ && e !== Z_ && e !== ev) && e !== Wl && !(t === Ta && !i) || um(t) && !Na(t) && e === Wl || t === Ta && i
  );
}
function _U(e) {
  return Ds(e) && e !== Sf && !Na(e) && e !== iU && e !== aU && e !== Ta && e !== X_ && e !== J_ && e !== Q_ && e !== Z_ && e !== ev && e !== Wl && e !== tU && e !== nU && e !== QL && e !== uU && e !== sU && e !== oU && e !== rU && e !== ZL && e !== eU && e !== cU && e !== lU;
}
function vU(e) {
  return !Na(e) && e !== Ta;
}
function cs(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function tv(e) {
  var t = /^\n* /;
  return t.test(e);
}
var rv = 1, Yl = 2, nv = 3, iv = 4, ci = 5;
function $U(e, t, r, n, i, s, o, a) {
  var c, u = 0, l = null, d = !1, h = !1, p = n !== -1, $ = -1, _ = _U(cs(e, 0)) && vU(cs(e, e.length - 1));
  if (t || o)
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = cs(e, c), !Ds(u))
        return ci;
      _ = _ && dm(u, l, a), l = u;
    }
  else {
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = cs(e, c), u === Cs)
        d = !0, p && (h = h || // Foldable line = too long, and not more-indented.
        c - $ - 1 > n && e[$ + 1] !== " ", $ = c);
      else if (!Ds(u))
        return ci;
      _ = _ && dm(u, l, a), l = u;
    }
    h = h || p && c - $ - 1 > n && e[$ + 1] !== " ";
  }
  return !d && !h ? _ && !o && !i(e) ? rv : s === Is ? ci : Yl : r > 9 && tv(e) ? ci : o ? s === Is ? ci : Yl : h ? iv : nv;
}
function wU(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Is ? '""' : "''";
    if (!e.noCompatMode && (dU.indexOf(t) !== -1 || fU.test(t)))
      return e.quotingType === Is ? '"' + t + '"' : "'" + t + "'";
    var s = e.indent * Math.max(1, r), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - s), a = n || e.flowLevel > -1 && r >= e.flowLevel;
    function c(u) {
      return gU(e, u);
    }
    switch ($U(
      t,
      a,
      e.indent,
      o,
      c,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case rv:
        return t;
      case Yl:
        return "'" + t.replace(/'/g, "''") + "'";
      case nv:
        return "|" + fm(t, e.indent) + hm(lm(t, s));
      case iv:
        return ">" + fm(t, e.indent) + hm(lm(EU(t, o), s));
      case ci:
        return '"' + bU(t) + '"';
      default:
        throw new Zs("impossible error: invalid scalar style");
    }
  }();
}
function fm(e, t) {
  var r = tv(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), s = i ? "+" : n ? "" : "-";
  return r + s + `
`;
}
function hm(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function EU(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var u = e.indexOf(`
`);
    return u = u !== -1 ? u : e.length, r.lastIndex = u, pm(e.slice(0, u), t);
  }(), i = e[0] === `
` || e[0] === " ", s, o; o = r.exec(e); ) {
    var a = o[1], c = o[2];
    s = c[0] === " ", n += a + (!i && !s && c !== "" ? `
` : "") + pm(c, t), i = s;
  }
  return n;
}
function pm(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, s, o = 0, a = 0, c = ""; n = r.exec(e); )
    a = n.index, a - i > t && (s = o > i ? o : a, c += `
` + e.slice(i, s), i = s + 1), o = a;
  return c += `
`, e.length - i > t && o > i ? c += e.slice(i, o) + `
` + e.slice(o + 1) : c += e.slice(i), c.slice(1);
}
function bU(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = cs(e, i), n = st[r], !n && Ds(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || pU(r);
  return t;
}
function SU(e, t, r) {
  var n = "", i = e.tag, s, o, a;
  for (s = 0, o = r.length; s < o; s += 1)
    a = r[s], e.replacer && (a = e.replacer.call(r, String(s), a)), (Ir(e, t, a, !1, !1) || typeof a > "u" && Ir(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function mm(e, t, r, n) {
  var i = "", s = e.tag, o, a, c;
  for (o = 0, a = r.length; o < a; o += 1)
    c = r[o], e.replacer && (c = e.replacer.call(r, String(o), c)), (Ir(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && Ir(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += Kl(e, t)), e.dump && Cs === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = s, e.dump = i || "[]";
}
function PU(e, t, r) {
  var n = "", i = e.tag, s = Object.keys(r), o, a, c, u, l;
  for (o = 0, a = s.length; o < a; o += 1)
    l = "", n !== "" && (l += ", "), e.condenseFlow && (l += '"'), c = s[o], u = r[c], e.replacer && (u = e.replacer.call(r, c, u)), Ir(e, t, c, !1, !1) && (e.dump.length > 1024 && (l += "? "), l += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), Ir(e, t, u, !1, !1) && (l += e.dump, n += l));
  e.tag = i, e.dump = "{" + n + "}";
}
function TU(e, t, r, n) {
  var i = "", s = e.tag, o = Object.keys(r), a, c, u, l, d, h;
  if (e.sortKeys === !0)
    o.sort();
  else if (typeof e.sortKeys == "function")
    o.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Zs("sortKeys must be a boolean or a function");
  for (a = 0, c = o.length; a < c; a += 1)
    h = "", (!n || i !== "") && (h += Kl(e, t)), u = o[a], l = r[u], e.replacer && (l = e.replacer.call(r, u, l)), Ir(e, t + 1, u, !0, !0, !0) && (d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, d && (e.dump && Cs === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, d && (h += Kl(e, t)), Ir(e, t + 1, l, !0, d) && (e.dump && Cs === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = s, e.dump = i || "{}";
}
function ym(e, t, r) {
  var n, i, s, o, a, c;
  for (i = r ? e.explicitTypes : e.implicitTypes, s = 0, o = i.length; s < o; s += 1)
    if (a = i[s], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (r ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (c = e.styleMap[a.tag] || a.defaultStyle, K_.call(a.represent) === "[object Function]")
          n = a.represent(t, c);
        else if (Y_.call(a.represent, c))
          n = a.represent[c](t, c);
        else
          throw new Zs("!<" + a.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function Ir(e, t, r, n, i, s, o) {
  e.tag = null, e.dump = r, ym(e, r, !1) || ym(e, r, !0);
  var a = K_.call(e.dump), c = n, u;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var l = a === "[object Object]" || a === "[object Array]", d, h;
  if (l && (d = e.duplicates.indexOf(r), h = d !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[d])
    e.dump = "*ref_" + d;
  else {
    if (l && h && !e.usedDuplicates[d] && (e.usedDuplicates[d] = !0), a === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (TU(e, t, e.dump, i), h && (e.dump = "&ref_" + d + e.dump)) : (PU(e, t, e.dump), h && (e.dump = "&ref_" + d + " " + e.dump));
    else if (a === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? mm(e, t - 1, e.dump, i) : mm(e, t, e.dump, i), h && (e.dump = "&ref_" + d + e.dump)) : (SU(e, t, e.dump), h && (e.dump = "&ref_" + d + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && wU(e, e.dump, t, s, c);
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
function NU(e, t) {
  var r = [], n = [], i, s;
  for (Xl(e, r, n), i = 0, s = n.length; i < s; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(s);
}
function Xl(e, t, r) {
  var n, i, s;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, s = e.length; i < s; i += 1)
        Xl(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, s = n.length; i < s; i += 1)
        Xl(e[n[i]], t, r);
}
function OU(e, t) {
  t = t || {};
  var r = new yU(t);
  r.noRefs || NU(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), Ir(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
W_.dump = OU;
var sv = vf, AU = W_;
function Pf(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
Ye.Type = gt;
Ye.Schema = g_;
Ye.FAILSAFE_SCHEMA = w_;
Ye.JSON_SCHEMA = N_;
Ye.CORE_SCHEMA = O_;
Ye.DEFAULT_SCHEMA = wf;
Ye.load = sv.load;
Ye.loadAll = sv.loadAll;
Ye.dump = AU.dump;
Ye.YAMLException = Qs;
Ye.types = {
  binary: D_,
  float: T_,
  map: $_,
  null: E_,
  pairs: F_,
  set: j_,
  timestamp: C_,
  bool: b_,
  int: S_,
  merge: I_,
  omap: k_,
  seq: v_,
  str: __
};
Ye.safeLoad = Pf("safeLoad", "load");
Ye.safeLoadAll = Pf("safeLoadAll", "loadAll");
Ye.safeDump = Pf("safeDump", "dump");
var sc = {};
Object.defineProperty(sc, "__esModule", { value: !0 });
sc.Lazy = void 0;
class RU {
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
sc.Lazy = RU;
var eo = {}, Oa = { exports: {} };
Oa.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, s = 2, o = 9007199254740991, a = "[object Arguments]", c = "[object Array]", u = "[object AsyncFunction]", l = "[object Boolean]", d = "[object Date]", h = "[object Error]", p = "[object Function]", $ = "[object GeneratorFunction]", _ = "[object Map]", v = "[object Number]", m = "[object Null]", E = "[object Object]", A = "[object Promise]", I = "[object Proxy]", F = "[object RegExp]", z = "[object Set]", G = "[object String]", me = "[object Symbol]", R = "[object Undefined]", Q = "[object WeakMap]", x = "[object ArrayBuffer]", q = "[object DataView]", J = "[object Float32Array]", j = "[object Float64Array]", M = "[object Int8Array]", B = "[object Int16Array]", L = "[object Int32Array]", H = "[object Uint8Array]", V = "[object Uint8ClampedArray]", C = "[object Uint16Array]", b = "[object Uint32Array]", N = /[\\^$.*+?()[\]{}|]/g, S = /^\[object .+?Constructor\]$/, f = /^(?:0|[1-9]\d*)$/, g = {};
  g[J] = g[j] = g[M] = g[B] = g[L] = g[H] = g[V] = g[C] = g[b] = !0, g[a] = g[c] = g[x] = g[l] = g[q] = g[d] = g[h] = g[p] = g[_] = g[v] = g[E] = g[F] = g[z] = g[G] = g[Q] = !1;
  var T = typeof dt == "object" && dt && dt.Object === Object && dt, w = typeof self == "object" && self && self.Object === Object && self, y = T || w || Function("return this")(), k = t && !t.nodeType && t, O = k && !0 && e && !e.nodeType && e, K = O && O.exports === k, fe = K && T.process, ge = function() {
    try {
      return fe && fe.binding && fe.binding("util");
    } catch {
    }
  }(), Ee = ge && ge.isTypedArray;
  function Te(P, D) {
    for (var U = -1, X = P == null ? 0 : P.length, be = 0, ae = []; ++U < X; ) {
      var Ce = P[U];
      D(Ce, U, P) && (ae[be++] = Ce);
    }
    return ae;
  }
  function Xe(P, D) {
    for (var U = -1, X = D.length, be = P.length; ++U < X; )
      P[be + U] = D[U];
    return P;
  }
  function _e(P, D) {
    for (var U = -1, X = P == null ? 0 : P.length; ++U < X; )
      if (D(P[U], U, P))
        return !0;
    return !1;
  }
  function je(P, D) {
    for (var U = -1, X = Array(P); ++U < P; )
      X[U] = D(U);
    return X;
  }
  function Ut(P) {
    return function(D) {
      return P(D);
    };
  }
  function Ct(P, D) {
    return P.has(D);
  }
  function Pt(P, D) {
    return P == null ? void 0 : P[D];
  }
  function It(P) {
    var D = -1, U = Array(P.size);
    return P.forEach(function(X, be) {
      U[++D] = [be, X];
    }), U;
  }
  function mr(P, D) {
    return function(U) {
      return P(D(U));
    };
  }
  function yr(P) {
    var D = -1, U = Array(P.size);
    return P.forEach(function(X) {
      U[++D] = X;
    }), U;
  }
  var gr = Array.prototype, Tt = Function.prototype, Dt = Object.prototype, _r = y["__core-js_shared__"], Dr = Tt.toString, _t = Dt.hasOwnProperty, If = function() {
    var P = /[^.]+$/.exec(_r && _r.keys && _r.keys.IE_PROTO || "");
    return P ? "Symbol(src)_1." + P : "";
  }(), Df = Dt.toString, wv = RegExp(
    "^" + Dr.call(_t).replace(N, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), kf = K ? y.Buffer : void 0, io = y.Symbol, Ff = y.Uint8Array, jf = Dt.propertyIsEnumerable, Ev = gr.splice, yn = io ? io.toStringTag : void 0, Mf = Object.getOwnPropertySymbols, bv = kf ? kf.isBuffer : void 0, Sv = mr(Object.keys, Object), mc = Yn(y, "DataView"), zi = Yn(y, "Map"), yc = Yn(y, "Promise"), gc = Yn(y, "Set"), _c = Yn(y, "WeakMap"), Gi = Yn(Object, "create"), Pv = vn(mc), Tv = vn(zi), Nv = vn(yc), Ov = vn(gc), Av = vn(_c), Lf = io ? io.prototype : void 0, vc = Lf ? Lf.valueOf : void 0;
  function gn(P) {
    var D = -1, U = P == null ? 0 : P.length;
    for (this.clear(); ++D < U; ) {
      var X = P[D];
      this.set(X[0], X[1]);
    }
  }
  function Rv() {
    this.__data__ = Gi ? Gi(null) : {}, this.size = 0;
  }
  function Cv(P) {
    var D = this.has(P) && delete this.__data__[P];
    return this.size -= D ? 1 : 0, D;
  }
  function Iv(P) {
    var D = this.__data__;
    if (Gi) {
      var U = D[P];
      return U === n ? void 0 : U;
    }
    return _t.call(D, P) ? D[P] : void 0;
  }
  function Dv(P) {
    var D = this.__data__;
    return Gi ? D[P] !== void 0 : _t.call(D, P);
  }
  function kv(P, D) {
    var U = this.__data__;
    return this.size += this.has(P) ? 0 : 1, U[P] = Gi && D === void 0 ? n : D, this;
  }
  gn.prototype.clear = Rv, gn.prototype.delete = Cv, gn.prototype.get = Iv, gn.prototype.has = Dv, gn.prototype.set = kv;
  function vr(P) {
    var D = -1, U = P == null ? 0 : P.length;
    for (this.clear(); ++D < U; ) {
      var X = P[D];
      this.set(X[0], X[1]);
    }
  }
  function Fv() {
    this.__data__ = [], this.size = 0;
  }
  function jv(P) {
    var D = this.__data__, U = oo(D, P);
    if (U < 0)
      return !1;
    var X = D.length - 1;
    return U == X ? D.pop() : Ev.call(D, U, 1), --this.size, !0;
  }
  function Mv(P) {
    var D = this.__data__, U = oo(D, P);
    return U < 0 ? void 0 : D[U][1];
  }
  function Lv(P) {
    return oo(this.__data__, P) > -1;
  }
  function Uv(P, D) {
    var U = this.__data__, X = oo(U, P);
    return X < 0 ? (++this.size, U.push([P, D])) : U[X][1] = D, this;
  }
  vr.prototype.clear = Fv, vr.prototype.delete = jv, vr.prototype.get = Mv, vr.prototype.has = Lv, vr.prototype.set = Uv;
  function _n(P) {
    var D = -1, U = P == null ? 0 : P.length;
    for (this.clear(); ++D < U; ) {
      var X = P[D];
      this.set(X[0], X[1]);
    }
  }
  function xv() {
    this.size = 0, this.__data__ = {
      hash: new gn(),
      map: new (zi || vr)(),
      string: new gn()
    };
  }
  function Vv(P) {
    var D = ao(this, P).delete(P);
    return this.size -= D ? 1 : 0, D;
  }
  function qv(P) {
    return ao(this, P).get(P);
  }
  function Bv(P) {
    return ao(this, P).has(P);
  }
  function Hv(P, D) {
    var U = ao(this, P), X = U.size;
    return U.set(P, D), this.size += U.size == X ? 0 : 1, this;
  }
  _n.prototype.clear = xv, _n.prototype.delete = Vv, _n.prototype.get = qv, _n.prototype.has = Bv, _n.prototype.set = Hv;
  function so(P) {
    var D = -1, U = P == null ? 0 : P.length;
    for (this.__data__ = new _n(); ++D < U; )
      this.add(P[D]);
  }
  function zv(P) {
    return this.__data__.set(P, n), this;
  }
  function Gv(P) {
    return this.__data__.has(P);
  }
  so.prototype.add = so.prototype.push = zv, so.prototype.has = Gv;
  function kr(P) {
    var D = this.__data__ = new vr(P);
    this.size = D.size;
  }
  function Wv() {
    this.__data__ = new vr(), this.size = 0;
  }
  function Kv(P) {
    var D = this.__data__, U = D.delete(P);
    return this.size = D.size, U;
  }
  function Yv(P) {
    return this.__data__.get(P);
  }
  function Xv(P) {
    return this.__data__.has(P);
  }
  function Jv(P, D) {
    var U = this.__data__;
    if (U instanceof vr) {
      var X = U.__data__;
      if (!zi || X.length < r - 1)
        return X.push([P, D]), this.size = ++U.size, this;
      U = this.__data__ = new _n(X);
    }
    return U.set(P, D), this.size = U.size, this;
  }
  kr.prototype.clear = Wv, kr.prototype.delete = Kv, kr.prototype.get = Yv, kr.prototype.has = Xv, kr.prototype.set = Jv;
  function Qv(P, D) {
    var U = co(P), X = !U && h$(P), be = !U && !X && $c(P), ae = !U && !X && !be && Wf(P), Ce = U || X || be || ae, xe = Ce ? je(P.length, String) : [], Be = xe.length;
    for (var Oe in P)
      _t.call(P, Oe) && !(Ce && // Safari 9 has enumerable `arguments.length` in strict mode.
      (Oe == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      be && (Oe == "offset" || Oe == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      ae && (Oe == "buffer" || Oe == "byteLength" || Oe == "byteOffset") || // Skip index properties.
      c$(Oe, Be))) && xe.push(Oe);
    return xe;
  }
  function oo(P, D) {
    for (var U = P.length; U--; )
      if (Bf(P[U][0], D))
        return U;
    return -1;
  }
  function Zv(P, D, U) {
    var X = D(P);
    return co(P) ? X : Xe(X, U(P));
  }
  function Wi(P) {
    return P == null ? P === void 0 ? R : m : yn && yn in Object(P) ? o$(P) : f$(P);
  }
  function Uf(P) {
    return Ki(P) && Wi(P) == a;
  }
  function xf(P, D, U, X, be) {
    return P === D ? !0 : P == null || D == null || !Ki(P) && !Ki(D) ? P !== P && D !== D : e$(P, D, U, X, xf, be);
  }
  function e$(P, D, U, X, be, ae) {
    var Ce = co(P), xe = co(D), Be = Ce ? c : Fr(P), Oe = xe ? c : Fr(D);
    Be = Be == a ? E : Be, Oe = Oe == a ? E : Oe;
    var Nt = Be == E, xt = Oe == E, Je = Be == Oe;
    if (Je && $c(P)) {
      if (!$c(D))
        return !1;
      Ce = !0, Nt = !1;
    }
    if (Je && !Nt)
      return ae || (ae = new kr()), Ce || Wf(P) ? Vf(P, D, U, X, be, ae) : i$(P, D, Be, U, X, be, ae);
    if (!(U & i)) {
      var kt = Nt && _t.call(P, "__wrapped__"), Ft = xt && _t.call(D, "__wrapped__");
      if (kt || Ft) {
        var jr = kt ? P.value() : P, $r = Ft ? D.value() : D;
        return ae || (ae = new kr()), be(jr, $r, U, X, ae);
      }
    }
    return Je ? (ae || (ae = new kr()), s$(P, D, U, X, be, ae)) : !1;
  }
  function t$(P) {
    if (!Gf(P) || u$(P))
      return !1;
    var D = Hf(P) ? wv : S;
    return D.test(vn(P));
  }
  function r$(P) {
    return Ki(P) && zf(P.length) && !!g[Wi(P)];
  }
  function n$(P) {
    if (!d$(P))
      return Sv(P);
    var D = [];
    for (var U in Object(P))
      _t.call(P, U) && U != "constructor" && D.push(U);
    return D;
  }
  function Vf(P, D, U, X, be, ae) {
    var Ce = U & i, xe = P.length, Be = D.length;
    if (xe != Be && !(Ce && Be > xe))
      return !1;
    var Oe = ae.get(P);
    if (Oe && ae.get(D))
      return Oe == D;
    var Nt = -1, xt = !0, Je = U & s ? new so() : void 0;
    for (ae.set(P, D), ae.set(D, P); ++Nt < xe; ) {
      var kt = P[Nt], Ft = D[Nt];
      if (X)
        var jr = Ce ? X(Ft, kt, Nt, D, P, ae) : X(kt, Ft, Nt, P, D, ae);
      if (jr !== void 0) {
        if (jr)
          continue;
        xt = !1;
        break;
      }
      if (Je) {
        if (!_e(D, function($r, $n) {
          if (!Ct(Je, $n) && (kt === $r || be(kt, $r, U, X, ae)))
            return Je.push($n);
        })) {
          xt = !1;
          break;
        }
      } else if (!(kt === Ft || be(kt, Ft, U, X, ae))) {
        xt = !1;
        break;
      }
    }
    return ae.delete(P), ae.delete(D), xt;
  }
  function i$(P, D, U, X, be, ae, Ce) {
    switch (U) {
      case q:
        if (P.byteLength != D.byteLength || P.byteOffset != D.byteOffset)
          return !1;
        P = P.buffer, D = D.buffer;
      case x:
        return !(P.byteLength != D.byteLength || !ae(new Ff(P), new Ff(D)));
      case l:
      case d:
      case v:
        return Bf(+P, +D);
      case h:
        return P.name == D.name && P.message == D.message;
      case F:
      case G:
        return P == D + "";
      case _:
        var xe = It;
      case z:
        var Be = X & i;
        if (xe || (xe = yr), P.size != D.size && !Be)
          return !1;
        var Oe = Ce.get(P);
        if (Oe)
          return Oe == D;
        X |= s, Ce.set(P, D);
        var Nt = Vf(xe(P), xe(D), X, be, ae, Ce);
        return Ce.delete(P), Nt;
      case me:
        if (vc)
          return vc.call(P) == vc.call(D);
    }
    return !1;
  }
  function s$(P, D, U, X, be, ae) {
    var Ce = U & i, xe = qf(P), Be = xe.length, Oe = qf(D), Nt = Oe.length;
    if (Be != Nt && !Ce)
      return !1;
    for (var xt = Be; xt--; ) {
      var Je = xe[xt];
      if (!(Ce ? Je in D : _t.call(D, Je)))
        return !1;
    }
    var kt = ae.get(P);
    if (kt && ae.get(D))
      return kt == D;
    var Ft = !0;
    ae.set(P, D), ae.set(D, P);
    for (var jr = Ce; ++xt < Be; ) {
      Je = xe[xt];
      var $r = P[Je], $n = D[Je];
      if (X)
        var Kf = Ce ? X($n, $r, Je, D, P, ae) : X($r, $n, Je, P, D, ae);
      if (!(Kf === void 0 ? $r === $n || be($r, $n, U, X, ae) : Kf)) {
        Ft = !1;
        break;
      }
      jr || (jr = Je == "constructor");
    }
    if (Ft && !jr) {
      var lo = P.constructor, uo = D.constructor;
      lo != uo && "constructor" in P && "constructor" in D && !(typeof lo == "function" && lo instanceof lo && typeof uo == "function" && uo instanceof uo) && (Ft = !1);
    }
    return ae.delete(P), ae.delete(D), Ft;
  }
  function qf(P) {
    return Zv(P, y$, a$);
  }
  function ao(P, D) {
    var U = P.__data__;
    return l$(D) ? U[typeof D == "string" ? "string" : "hash"] : U.map;
  }
  function Yn(P, D) {
    var U = Pt(P, D);
    return t$(U) ? U : void 0;
  }
  function o$(P) {
    var D = _t.call(P, yn), U = P[yn];
    try {
      P[yn] = void 0;
      var X = !0;
    } catch {
    }
    var be = Df.call(P);
    return X && (D ? P[yn] = U : delete P[yn]), be;
  }
  var a$ = Mf ? function(P) {
    return P == null ? [] : (P = Object(P), Te(Mf(P), function(D) {
      return jf.call(P, D);
    }));
  } : g$, Fr = Wi;
  (mc && Fr(new mc(new ArrayBuffer(1))) != q || zi && Fr(new zi()) != _ || yc && Fr(yc.resolve()) != A || gc && Fr(new gc()) != z || _c && Fr(new _c()) != Q) && (Fr = function(P) {
    var D = Wi(P), U = D == E ? P.constructor : void 0, X = U ? vn(U) : "";
    if (X)
      switch (X) {
        case Pv:
          return q;
        case Tv:
          return _;
        case Nv:
          return A;
        case Ov:
          return z;
        case Av:
          return Q;
      }
    return D;
  });
  function c$(P, D) {
    return D = D ?? o, !!D && (typeof P == "number" || f.test(P)) && P > -1 && P % 1 == 0 && P < D;
  }
  function l$(P) {
    var D = typeof P;
    return D == "string" || D == "number" || D == "symbol" || D == "boolean" ? P !== "__proto__" : P === null;
  }
  function u$(P) {
    return !!If && If in P;
  }
  function d$(P) {
    var D = P && P.constructor, U = typeof D == "function" && D.prototype || Dt;
    return P === U;
  }
  function f$(P) {
    return Df.call(P);
  }
  function vn(P) {
    if (P != null) {
      try {
        return Dr.call(P);
      } catch {
      }
      try {
        return P + "";
      } catch {
      }
    }
    return "";
  }
  function Bf(P, D) {
    return P === D || P !== P && D !== D;
  }
  var h$ = Uf(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Uf : function(P) {
    return Ki(P) && _t.call(P, "callee") && !jf.call(P, "callee");
  }, co = Array.isArray;
  function p$(P) {
    return P != null && zf(P.length) && !Hf(P);
  }
  var $c = bv || _$;
  function m$(P, D) {
    return xf(P, D);
  }
  function Hf(P) {
    if (!Gf(P))
      return !1;
    var D = Wi(P);
    return D == p || D == $ || D == u || D == I;
  }
  function zf(P) {
    return typeof P == "number" && P > -1 && P % 1 == 0 && P <= o;
  }
  function Gf(P) {
    var D = typeof P;
    return P != null && (D == "object" || D == "function");
  }
  function Ki(P) {
    return P != null && typeof P == "object";
  }
  var Wf = Ee ? Ut(Ee) : r$;
  function y$(P) {
    return p$(P) ? Qv(P) : n$(P);
  }
  function g$() {
    return [];
  }
  function _$() {
    return !1;
  }
  e.exports = m$;
})(Oa, Oa.exports);
var CU = Oa.exports;
Object.defineProperty(eo, "__esModule", { value: !0 });
eo.DownloadedUpdateHelper = void 0;
eo.createTempUpdateFile = jU;
const IU = Vs, DU = fn, gm = CU, Pn = pn, Es = Re;
class kU {
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
    return Es.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return gm(this.versionInfo, r) && gm(this.fileInfo.info, n.info) && await (0, Pn.pathExists)(t) ? t : null;
    const s = await this.getValidCachedUpdateFile(n, i);
    return s === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = s, s);
  }
  async setDownloadedFile(t, r, n, i, s, o) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: s,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, o && await (0, Pn.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Pn.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, Pn.pathExists)(n))
      return null;
    let s;
    try {
      s = await (0, Pn.readJson)(n);
    } catch (u) {
      let l = "No cached update info available";
      return u.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${u.message})`), r.info(l), null;
    }
    if (!((s == null ? void 0 : s.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== s.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${s.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = Es.join(this.cacheDirForPendingUpdate, s.fileName);
    if (!await (0, Pn.pathExists)(a))
      return r.info("Cached update file doesn't exist"), null;
    const c = await FU(a);
    return t.info.sha512 !== c ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = s, a);
  }
  getUpdateInfoFile() {
    return Es.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
eo.DownloadedUpdateHelper = kU;
function FU(e, t = "sha512", r = "base64", n) {
  return new Promise((i, s) => {
    const o = (0, IU.createHash)(t);
    o.on("error", s).setEncoding(r), (0, DU.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", s).on("end", () => {
      o.end(), i(o.read());
    }).pipe(o, { end: !1 });
  });
}
async function jU(e, t, r) {
  let n = 0, i = Es.join(t, e);
  for (let s = 0; s < 3; s++)
    try {
      return await (0, Pn.unlink)(i), i;
    } catch (o) {
      if (o.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${o}`), i = Es.join(t, `${n++}-${e}`);
    }
  return i;
}
var oc = {}, Tf = {};
Object.defineProperty(Tf, "__esModule", { value: !0 });
Tf.getAppCacheDir = LU;
const il = Re, MU = Ca;
function LU() {
  const e = (0, MU.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || il.join(e, "AppData", "Local") : process.platform === "darwin" ? t = il.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || il.join(e, ".cache"), t;
}
Object.defineProperty(oc, "__esModule", { value: !0 });
oc.ElectronAppAdapter = void 0;
const _m = Re, UU = Tf;
class xU {
  constructor(t = Ar.app) {
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
    return this.isPackaged ? _m.join(process.resourcesPath, "app-update.yml") : _m.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, UU.getAppCacheDir)();
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
oc.ElectronAppAdapter = xU;
var ov = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = Ue;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return Ar.session.fromPartition(e.NET_SESSION_NAME, {
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
      const a = Ar.net.request({
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
})(ov);
var to = {}, nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.newBaseUrl = VU;
nr.newUrlFromBase = qU;
nr.getChannelFilename = BU;
const av = hn;
function VU(e) {
  const t = new av.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function qU(e, t, r = !1) {
  const n = new av.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function BU(e) {
  return `${e}.yml`;
}
var Fe = {}, HU = "[object Symbol]", cv = /[\\^$.*+?()[\]{}|]/g, zU = RegExp(cv.source), GU = typeof dt == "object" && dt && dt.Object === Object && dt, WU = typeof self == "object" && self && self.Object === Object && self, KU = GU || WU || Function("return this")(), YU = Object.prototype, XU = YU.toString, vm = KU.Symbol, $m = vm ? vm.prototype : void 0, wm = $m ? $m.toString : void 0;
function JU(e) {
  if (typeof e == "string")
    return e;
  if (ZU(e))
    return wm ? wm.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function QU(e) {
  return !!e && typeof e == "object";
}
function ZU(e) {
  return typeof e == "symbol" || QU(e) && XU.call(e) == HU;
}
function e2(e) {
  return e == null ? "" : JU(e);
}
function t2(e) {
  return e = e2(e), e && zU.test(e) ? e.replace(cv, "\\$&") : e;
}
var lv = t2;
Object.defineProperty(Fe, "__esModule", { value: !0 });
Fe.Provider = void 0;
Fe.findFile = o2;
Fe.parseUpdateInfo = a2;
Fe.getFileList = uv;
Fe.resolveFiles = c2;
const un = Ue, r2 = Ye, n2 = hn, Aa = nr, i2 = lv;
class s2 {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const s = (0, Aa.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, Aa.newUrlFromBase)(`${t.pathname.replace(new RegExp(i2(n), "g"), r)}.blockmap`, i ? new n2.URL(i) : t), s];
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
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, un.configureRequestUrl)(t, n), n;
  }
}
Fe.Provider = s2;
function o2(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, un.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((o) => o.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), s = (n = i.find((o) => [o.url.pathname, o.info.url].some((a) => a.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return s || (r == null ? e[0] : e.find((o) => !r.some((a) => o.url.pathname.toLowerCase().endsWith(`.${a.toLowerCase()}`))));
}
function a2(e, t, r) {
  if (e == null)
    throw (0, un.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, r2.load)(e);
  } catch (i) {
    throw (0, un.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function uv(e) {
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
  throw (0, un.newError)(`No files provided: ${(0, un.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function c2(e, t, r = (n) => n) {
  const i = uv(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, un.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, un.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Aa.newUrlFromBase)(r(a.url), t),
      info: a
    };
  }), s = e.packages, o = s == null ? null : s[process.arch] || s.ia32;
  return o != null && (i[0].packageInfo = {
    ...o,
    path: (0, Aa.newUrlFromBase)(r(o.path), t).href
  }), i;
}
Object.defineProperty(to, "__esModule", { value: !0 });
to.GenericProvider = void 0;
const Em = Ue, sl = nr, ol = Fe;
class l2 extends ol.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, sl.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, sl.getChannelFilename)(this.channel), r = (0, sl.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, ol.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Em.HttpError && i.statusCode === 404)
          throw (0, Em.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, ol.resolveFiles)(t, this.baseUrl);
  }
}
to.GenericProvider = l2;
var ac = {}, cc = {};
Object.defineProperty(cc, "__esModule", { value: !0 });
cc.BitbucketProvider = void 0;
const bm = Ue, al = nr, cl = Fe;
class u2 extends cl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: s } = t;
    this.baseUrl = (0, al.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${s}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new bm.CancellationToken(), r = (0, al.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, al.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, cl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, bm.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, cl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
cc.BitbucketProvider = u2;
var dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.GitHubProvider = dn.BaseGitHubProvider = void 0;
dn.computeReleaseNotes = fv;
const br = Ue, pi = nf, d2 = hn, mi = nr, Jl = Fe, ll = /\/tag\/([^/]+)$/;
class dv extends Jl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, mi.newBaseUrl)((0, br.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, mi.newBaseUrl)((0, br.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
dn.BaseGitHubProvider = dv;
class f2 extends dv {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, s;
    const o = new br.CancellationToken(), a = await this.httpRequest((0, mi.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, o), c = (0, br.parseXml)(a);
    let u = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const v = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = pi.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (v === null)
          l = ll.exec(u.element("link").attribute("href"))[1];
        else
          for (const m of c.getElements("entry")) {
            const E = ll.exec(m.element("link").attribute("href"));
            if (E === null)
              continue;
            const A = E[1], I = ((n = pi.prerelease(A)) === null || n === void 0 ? void 0 : n[0]) || null, F = !v || ["alpha", "beta"].includes(v), z = I !== null && !["alpha", "beta"].includes(String(I));
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
          if (ll.exec(v.element("link").attribute("href"))[1] === l) {
            u = v;
            break;
          }
      }
    } catch (v) {
      throw (0, br.newError)(`Cannot parse releases feed: ${v.stack || v.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, br.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let d, h = "", p = "";
    const $ = async (v) => {
      h = (0, mi.getChannelFilename)(v), p = (0, mi.newUrlFromBase)(this.getBaseDownloadPath(String(l), h), this.baseUrl);
      const m = this.createRequestOptions(p);
      try {
        return await this.executor.request(m, o);
      } catch (E) {
        throw E instanceof br.HttpError && E.statusCode === 404 ? (0, br.newError)(`Cannot find ${h} in the latest release artifacts (${p}): ${E.stack || E.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : E;
      }
    };
    try {
      let v = this.channel;
      this.updater.allowPrerelease && (!((i = pi.prerelease(l)) === null || i === void 0) && i[0]) && (v = this.getCustomChannelName(String((s = pi.prerelease(l)) === null || s === void 0 ? void 0 : s[0]))), d = await $(v);
    } catch (v) {
      if (this.updater.allowPrerelease)
        d = await $(this.getDefaultChannelName());
      else
        throw v;
    }
    const _ = (0, Jl.parseUpdateInfo)(d, h, p);
    return _.releaseName == null && (_.releaseName = u.elementValueOrEmpty("title")), _.releaseNotes == null && (_.releaseNotes = fv(this.updater.currentVersion, this.updater.fullChangelog, c, u)), {
      tag: l,
      ..._
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, mi.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new d2.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, br.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Jl.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
dn.GitHubProvider = f2;
function Sm(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function fv(e, t, r, n) {
  if (!t)
    return Sm(n);
  const i = [];
  for (const s of r.getElements("entry")) {
    const o = /\/tag\/v?([^/]+)$/.exec(s.element("link").attribute("href"))[1];
    pi.lt(e, o) && i.push({
      version: o,
      note: Sm(s)
    });
  }
  return i.sort((s, o) => pi.rcompare(s.version, o.version));
}
var lc = {};
Object.defineProperty(lc, "__esModule", { value: !0 });
lc.GitLabProvider = void 0;
const ot = Ue, ul = hn, h2 = lv, Vo = nr, dl = Fe;
class p2 extends dl.Provider {
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
    const t = new ot.CancellationToken(), r = (0, Vo.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let n;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, p = await this.httpRequest(r, h, t);
      if (!p)
        throw (0, ot.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      n = JSON.parse(p);
    } catch (h) {
      throw (0, ot.newError)(`Unable to find latest release on GitLab (${r}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = n.tag_name;
    let s = null, o = "", a = null;
    const c = async (h) => {
      o = (0, Vo.getChannelFilename)(h);
      const p = n.assets.links.find((_) => _.name === o);
      if (!p)
        throw (0, ot.newError)(`Cannot find ${o} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      a = new ul.URL(p.direct_asset_url);
      const $ = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const _ = await this.httpRequest(a, $, t);
        if (!_)
          throw (0, ot.newError)(`Empty response from ${a}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return _;
      } catch (_) {
        throw _ instanceof ot.HttpError && _.statusCode === 404 ? (0, ot.newError)(`Cannot find ${o} in the latest release artifacts (${a}): ${_.stack || _.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : _;
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
      throw (0, ot.newError)(`Unable to parse channel data from ${o}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const u = (0, dl.parseUpdateInfo)(s, o, a);
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
        return new ul.URL(s);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new ot.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const s = (0, Vo.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const o = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, a = await this.httpRequest(s, o, r);
        if (a)
          return JSON.parse(a);
      } catch (o) {
        if (o instanceof ot.HttpError && o.statusCode === 404)
          continue;
        throw (0, ot.newError)(`Unable to find release ${i} on GitLab (${s}): ${o.stack || o.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, ot.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
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
      const c = n.replace(new RegExp(h2(r), "g"), t);
      s = this.findBlockMapInAssets(a, c);
    }
    return [s, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const s = t.pathname.split("/").pop() || "", [o, a] = await this.findBlockMapUrlsFromAssets(r, n, s);
      if (!a)
        throw (0, ot.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!o)
        throw (0, ot.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [o, a];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, dl.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((o) => t.assets.has(o)), s = i ? t.assets.get(i) : void 0;
      if (!s)
        throw (0, ot.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ul.URL(s),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
lc.GitLabProvider = p2;
var uc = {};
Object.defineProperty(uc, "__esModule", { value: !0 });
uc.KeygenProvider = void 0;
const Pm = Ue, fl = nr, hl = Fe;
class m2 extends hl.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, fl.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Pm.CancellationToken(), r = (0, fl.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, fl.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, hl.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Pm.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, hl.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
uc.KeygenProvider = m2;
var dc = {};
Object.defineProperty(dc, "__esModule", { value: !0 });
dc.PrivateGitHubProvider = void 0;
const ni = Ue, y2 = Ye, g2 = Re, Tm = hn, Nm = nr, _2 = dn, v2 = Fe;
class $2 extends _2.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new ni.CancellationToken(), r = (0, Nm.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((a) => a.name === r);
    if (i == null)
      throw (0, ni.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const s = new Tm.URL(i.url);
    let o;
    try {
      o = (0, y2.load)(await this.httpRequest(s, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof ni.HttpError && a.statusCode === 404 ? (0, ni.newError)(`Cannot find ${r} in the latest release artifacts (${s}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
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
    const i = (0, Nm.newUrlFromBase)(n, this.baseUrl);
    try {
      const s = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? s.find((o) => o.prerelease) || s[0] : s;
    } catch (s) {
      throw (0, ni.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${s.stack || s.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, v2.getFileList)(t).map((r) => {
      const n = g2.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((s) => s != null && s.name === n);
      if (i == null)
        throw (0, ni.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Tm.URL(i.url),
        info: r
      };
    });
  }
}
dc.PrivateGitHubProvider = $2;
Object.defineProperty(ac, "__esModule", { value: !0 });
ac.isUrlProbablySupportMultiRangeRequests = hv;
ac.createClient = T2;
const qo = Ue, w2 = cc, Om = to, E2 = dn, b2 = lc, S2 = uc, P2 = dc;
function hv(e) {
  return !e.includes("s3.amazonaws.com");
}
function T2(e, t, r) {
  if (typeof e == "string")
    throw (0, qo.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, s = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return s == null ? new E2.GitHubProvider(i, t, r) : new P2.PrivateGitHubProvider(i, t, s, r);
    }
    case "bitbucket":
      return new w2.BitbucketProvider(e, t, r);
    case "gitlab":
      return new b2.GitLabProvider(e, t, r);
    case "keygen":
      return new S2.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Om.GenericProvider({
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
      return new Om.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && hv(i.url)
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
var fc = {}, ro = {}, Bi = {}, Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.OperationKind = void 0;
Kn.computeOperations = N2;
var Fn;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Fn || (Kn.OperationKind = Fn = {}));
function N2(e, t, r) {
  const n = Rm(e.files), i = Rm(t.files);
  let s = null;
  const o = t.files[0], a = [], c = o.name, u = n.get(c);
  if (u == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let d = 0;
  const { checksumToOffset: h, checksumToOldSize: p } = A2(n.get(c), u.offset, r);
  let $ = o.offset;
  for (let _ = 0; _ < l.checksums.length; $ += l.sizes[_], _++) {
    const v = l.sizes[_], m = l.checksums[_];
    let E = h.get(m);
    E != null && p.get(m) !== v && (r.warn(`Checksum ("${m}") matches, but size differs (old: ${p.get(m)}, new: ${v})`), E = void 0), E === void 0 ? (d++, s != null && s.kind === Fn.DOWNLOAD && s.end === $ ? s.end += v : (s = {
      kind: Fn.DOWNLOAD,
      start: $,
      end: $ + v
      // oldBlocks: null,
    }, Am(s, a, m, _))) : s != null && s.kind === Fn.COPY && s.end === E ? s.end += v : (s = {
      kind: Fn.COPY,
      start: E,
      end: E + v
      // oldBlocks: [checksum]
    }, Am(s, a, m, _));
  }
  return d > 0 && r.info(`File${o.name === "file" ? "" : " " + o.name} has ${d} changed blocks`), a;
}
const O2 = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Am(e, t, r, n) {
  if (O2 && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const s = [i.start, i.end, e.start, e.end].reduce((o, a) => o < a ? o : a);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${Fn[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - s} until ${i.end - s} and ${e.start - s} until ${e.end - s}`);
    }
  }
  t.push(e);
}
function A2(e, t, r) {
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
function Rm(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.DataSplitter = void 0;
Bi.copyData = pv;
const Bo = Ue, R2 = fn, C2 = xs, I2 = Kn, Cm = Buffer.from(`\r
\r
`);
var Yr;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Yr || (Yr = {}));
function pv(e, t, r, n, i) {
  const s = (0, R2.createReadStream)("", {
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
class D2 extends C2.Writable {
  constructor(t, r, n, i, s, o) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = s, this.finishHandler = o, this.partIndex = -1, this.headerListBuffer = null, this.readState = Yr.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      if (this.readState === Yr.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = Yr.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Yr.BODY)
          this.readState = Yr.INIT;
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
            this.readState = Yr.HEADER;
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
        if (o.kind !== I2.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        pv(o, this.out, this.options.oldFileFd, i, () => {
          t++, s();
        });
      };
      s();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(Cm, r);
    if (n !== -1)
      return n + Cm.length;
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
Bi.DataSplitter = D2;
var hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
hc.executeTasksUsingMultipleRangeRequests = k2;
hc.checkIsRangesSupported = Zl;
const Ql = Ue, Im = Bi, Dm = Kn;
function k2(e, t, r, n, i) {
  const s = (o) => {
    if (o >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const a = o + 1e3;
    F2(e, {
      tasks: t,
      start: o,
      end: Math.min(t.length, a),
      oldFileFd: n
    }, r, () => s(a), i);
  };
  return s;
}
function F2(e, t, r, n, i) {
  let s = "bytes=", o = 0;
  const a = /* @__PURE__ */ new Map(), c = [];
  for (let d = t.start; d < t.end; d++) {
    const h = t.tasks[d];
    h.kind === Dm.OperationKind.DOWNLOAD && (s += `${h.start}-${h.end - 1}, `, a.set(o, d), o++, c.push(h.end - h.start));
  }
  if (o <= 1) {
    const d = (h) => {
      if (h >= t.end) {
        n();
        return;
      }
      const p = t.tasks[h++];
      if (p.kind === Dm.OperationKind.COPY)
        (0, Im.copyData)(p, r, t.oldFileFd, i, () => d(h));
      else {
        const $ = e.createRequestOptions();
        $.headers.Range = `bytes=${p.start}-${p.end - 1}`;
        const _ = e.httpExecutor.createRequest($, (v) => {
          v.on("error", i), Zl(v, i) && (v.pipe(r, {
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
    if (!Zl(d, i))
      return;
    const h = (0, Ql.safeGetHeader)(d, "content-type"), p = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(h);
    if (p == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${h}"`));
      return;
    }
    const $ = new Im.DataSplitter(r, t, a, p[1] || p[2], c, n);
    $.on("error", i), d.pipe($), d.on("end", () => {
      setTimeout(() => {
        l.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(l, i), l.end();
}
function Zl(e, t) {
  if (e.statusCode >= 400)
    return t((0, Ql.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, Ql.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var pc = {};
Object.defineProperty(pc, "__esModule", { value: !0 });
pc.ProgressDifferentialDownloadCallbackTransform = void 0;
const j2 = xs;
var yi;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(yi || (yi = {}));
class M2 extends j2.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = yi.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == yi.COPY) {
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
    this.operationType = yi.COPY;
  }
  beginRangeDownload() {
    this.operationType = yi.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
pc.ProgressDifferentialDownloadCallbackTransform = M2;
Object.defineProperty(ro, "__esModule", { value: !0 });
ro.DifferentialDownloader = void 0;
const rs = Ue, pl = pn, L2 = fn, U2 = Bi, x2 = hn, Ho = Kn, km = hc, V2 = pc;
class q2 {
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
    return (0, rs.configureRequestUrl)(this.options.newUrl, t), (0, rs.configureRequestOptions)(t), t;
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
    return n.info(`Full: ${Fm(a)}, To download: ${Fm(s)} (${Math.round(s / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, pl.close)(i.descriptor).catch((s) => {
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
    const n = await (0, pl.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, pl.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const s = (0, L2.createWriteStream)(this.options.newFile, { fd: i });
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
        u = new V2.ProgressDifferentialDownloadCallbackTransform(A, this.options.cancellationToken, this.options.onProgress), c.push(u);
      }
      const l = new rs.DigestTransform(this.blockAwareFileInfo.sha512);
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
        p = (0, km.executeTasksUsingMultipleRangeRequests)(this, t, h, n, a), p(0);
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
          u && u.beginFileCopy(), (0, U2.copyData)(I, h, n, a, () => p(m));
          return;
        }
        const F = `bytes=${I.start}-${I.end - 1}`;
        v.headers.range = F, (A = (E = this.logger) === null || E === void 0 ? void 0 : E.debug) === null || A === void 0 || A.call(E, `download range: ${F}`), u && u.beginRangeDownload();
        const z = this.httpExecutor.createRequest(v, (G) => {
          G.on("error", a), G.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), G.statusCode >= 400 && a((0, rs.createHttpError)(G)), G.pipe(h, {
            end: !1
          }), G.once("end", () => {
            u && u.endRangeDownload(), ++$ === 100 ? ($ = 0, setTimeout(() => p(m), 1e3)) : p(m);
          });
        });
        z.on("redirect", (G, me, R) => {
          this.logger.info(`Redirect to ${B2(R)}`), _ = R, (0, rs.configureRequestUrl)(new x2.URL(_), v), z.followRedirect();
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
        (0, km.checkIsRangesSupported)(o, i) && (o.on("error", i), o.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), o.on("data", r), o.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(s, i), s.end();
    });
  }
}
ro.DifferentialDownloader = q2;
function Fm(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function B2(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(fc, "__esModule", { value: !0 });
fc.GenericDifferentialDownloader = void 0;
const H2 = ro;
class z2 extends H2.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
fc.GenericDifferentialDownloader = z2;
var mn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = Ue;
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
})(mn);
Object.defineProperty(an, "__esModule", { value: !0 });
an.NoOpLogger = an.AppUpdater = void 0;
const at = Ue, G2 = Vs, W2 = Ca, K2 = ny, Bt = pn, Y2 = Ye, ml = sc, Ht = Re, Tn = nf, jm = eo, X2 = oc, Mm = ov, J2 = to, yl = ac, gl = sy, Q2 = fc, ii = mn;
class Nf extends K2.EventEmitter {
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
        throw (0, at.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, at.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, Mm.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new mv();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new ml.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new ii.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (s) => this.checkIfUpdateSupported(s), this._isUserWithinRollout = (s) => this.isStagingMatch(s), this.clientPromise = null, this.stagingUserIdPromise = new ml.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new ml.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (s) => {
      this._logger.error(`Error: ${s.stack || s.message}`);
    }), r == null ? (this.app = new X2.ElectronAppAdapter(), this.httpExecutor = new Mm.ElectronHttpExecutor((s, o) => this.emit("login", s, o))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Tn.parse)(n);
    if (i == null)
      throw (0, at.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = Z2(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? n = new J2.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, yl.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, yl.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
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
      const n = Nf.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new Ar.Notification(n).show();
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
    const i = await this.stagingUserIdPromise.value, o = at.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${o}, user id: ${i}`), o < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Tn.parse)(t.version);
    if (r == null)
      throw (0, at.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Tn.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const s = (0, Tn.gt)(r, n), o = (0, Tn.lt)(r, n);
    return s ? !0 : this.allowDowngrade && o;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, W2.release)();
    if (r)
      try {
        if ((0, Tn.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, yl.createClient)(n, this, this.createProviderRuntimeOptions())));
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
    const n = new at.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, at.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new at.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, at.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof at.CancellationError))
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
    this.emit(ii.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, Y2.load)(await (0, Bt.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Ht.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Bt.readFile)(t, "utf-8");
      if (at.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = at.UUID.v5((0, G2.randomBytes)(4096), at.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Bt.outputFile)(t, r);
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
      const i = Ht.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new jm.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(ii.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (E) => this.emit(ii.DOWNLOAD_PROGRESS, E));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, s = i.version, o = r.packageInfo;
    function a() {
      const E = decodeURIComponent(t.fileInfo.url.pathname);
      return E.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Ht.basename(E) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), u = c.cacheDirForPendingUpdate;
    await (0, Bt.mkdir)(u, { recursive: !0 });
    const l = a();
    let d = Ht.join(u, l);
    const h = o == null ? null : Ht.join(u, `package-${s}${Ht.extname(o.path) || ".7z"}`), p = async (E) => {
      await c.setDownloadedFile(d, h, i, r, l, E), await t.done({
        ...i,
        downloadedFile: d
      });
      const A = Ht.join(u, "current.blockmap");
      return await (0, Bt.pathExists)(A) && await (0, Bt.copyFile)(A, Ht.join(c.cacheDir, "current.blockmap")), h == null ? [d] : [d, h];
    }, $ = this._logger, _ = await c.validateDownloadedPath(d, i, r, $);
    if (_ != null)
      return d = _, await p(!1);
    const v = async () => (await c.clear().catch(() => {
    }), await (0, Bt.unlink)(d).catch(() => {
    })), m = await (0, jm.createTempUpdateFile)(`temp-${l}`, u, $);
    try {
      await t.task(m, n, h, v), await (0, at.retry)(() => (0, Bt.rename)(m, d), {
        retries: 60,
        interval: 500,
        shouldRetry: (E) => E instanceof Error && /^EBUSY:/.test(E.message) ? !0 : ($.warn(`Cannot rename temp file to final file: ${E.message || E.stack}`), !1)
      });
    } catch (E) {
      throw await v(), E instanceof at.CancellationError && ($.info("cancelled"), this.emit("update-cancelled", i)), E;
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
          return JSON.parse((0, gl.gunzipSync)(_).toString());
        } catch (v) {
          throw new Error(`Cannot parse blockmap "${$.href}", error: ${v}`);
        }
      }, u = {
        newUrl: t.url,
        oldFile: Ht.join(this.downloadedUpdateHelper.cacheDir, s),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: o.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(ii.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = ($) => this.emit(ii.DOWNLOAD_PROGRESS, $));
      const l = async ($, _) => {
        const v = Ht.join(_, "current.blockmap");
        await (0, Bt.outputFile)(v, (0, gl.gzipSync)(JSON.stringify($)));
      }, d = async ($) => {
        const _ = Ht.join($, "current.blockmap");
        try {
          if (await (0, Bt.pathExists)(_))
            return JSON.parse((0, gl.gunzipSync)(await (0, Bt.readFile)(_)).toString());
        } catch (v) {
          this._logger.warn(`Cannot parse blockmap "${_}", error: ${v}`);
        }
        return null;
      }, h = await c(a[1]);
      await l(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let p = await d(this.downloadedUpdateHelper.cacheDir);
      return p == null && (p = await c(a[0])), await new Q2.GenericDifferentialDownloader(t.info, this.httpExecutor, u).download(p, h), !1;
    } catch (o) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), this._testOnlyOptions != null)
        throw o;
      return !0;
    }
  }
}
an.AppUpdater = Nf;
function Z2(e) {
  const t = (0, Tn.prerelease)(e);
  return t != null && t.length > 0;
}
class mv {
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
an.NoOpLogger = mv;
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.BaseUpdater = void 0;
const Lm = Ra, ex = an;
class tx extends ex.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Ar.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
    const i = (0, Lm.spawnSync)(t, r, {
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
        const a = { stdio: i, env: n, detached: !0 }, c = (0, Lm.spawn)(t, r, a);
        c.on("error", (u) => {
          o(u);
        }), c.unref(), c.pid !== void 0 && s(!0);
      } catch (a) {
        o(a);
      }
    });
  }
}
Wn.BaseUpdater = tx;
var ks = {}, no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
no.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const si = pn, rx = ro, nx = sy;
class ix extends rx.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = yv(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await sx(this.options.oldFile), i);
  }
}
no.FileWithEmbeddedBlockMapDifferentialDownloader = ix;
function yv(e) {
  return JSON.parse((0, nx.inflateRawSync)(e).toString());
}
async function sx(e) {
  const t = await (0, si.open)(e, "r");
  try {
    const r = (await (0, si.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, si.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, si.read)(t, i, 0, i.length, r - n.length - i.length), await (0, si.close)(t), yv(i);
  } catch (r) {
    throw await (0, si.close)(t), r;
  }
}
Object.defineProperty(ks, "__esModule", { value: !0 });
ks.AppImageUpdater = void 0;
const Um = Ue, xm = Ra, ox = pn, ax = fn, ns = Re, cx = Wn, lx = no, ux = Fe, Vm = mn;
class dx extends cx.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, ux.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        const o = process.env.APPIMAGE;
        if (o == null)
          throw (0, Um.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, o, i, r, t)) && await this.httpExecutor.download(n.url, i, s), await (0, ox.chmod)(i, 493);
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
      return this.listenerCount(Vm.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Vm.DOWNLOAD_PROGRESS, a)), await new lx.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, o).download(), !1;
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Um.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, ax.unlinkSync)(r);
    let n;
    const i = ns.basename(r), s = this.installerPath;
    if (s == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    ns.basename(s) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = ns.join(ns.dirname(r), ns.basename(s)), (0, xm.execFileSync)("mv", ["-f", s, n]), n !== r && this.emit("appimage-filename-updated", n);
    const o = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], o) : (o.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, xm.execFileSync)(n, [], { env: o })), !0;
  }
}
ks.AppImageUpdater = dx;
var Fs = {}, Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.LinuxUpdater = void 0;
const fx = Wn;
class hx extends fx.BaseUpdater {
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
Hi.LinuxUpdater = hx;
Object.defineProperty(Fs, "__esModule", { value: !0 });
Fs.DebUpdater = void 0;
const px = Fe, qm = mn, mx = Hi;
class Of extends mx.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, px.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(qm.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(qm.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
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
      Of.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Fs.DebUpdater = Of;
var js = {};
Object.defineProperty(js, "__esModule", { value: !0 });
js.PacmanUpdater = void 0;
const Bm = mn, yx = Fe, gx = Hi;
class Af extends gx.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, yx.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Bm.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Bm.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      Af.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
js.PacmanUpdater = Af;
var Ms = {};
Object.defineProperty(Ms, "__esModule", { value: !0 });
Ms.RpmUpdater = void 0;
const Hm = mn, _x = Fe, vx = Hi;
class Rf extends vx.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, _x.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, s) => {
        this.listenerCount(Hm.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Hm.DOWNLOAD_PROGRESS, o)), await this.httpExecutor.download(n.url, i, s);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      Rf.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
Ms.RpmUpdater = Rf;
var Ls = {};
Object.defineProperty(Ls, "__esModule", { value: !0 });
Ls.MacUpdater = void 0;
const zm = Ue, _l = pn, $x = fn, Gm = Re, wx = S$, Ex = an, bx = Fe, Wm = Ra, Km = Vs;
class Sx extends Ex.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = Ar.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
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
      this.debug("Checking for macOS Rosetta environment"), s = (0, Wm.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${s})`);
    } catch (d) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${d}`);
    }
    let o = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, Wm.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const c = (0, bx.findFile)(r, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, zm.newError)(`ZIP file not provided: ${(0, zm.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const u = t.updateInfoAndProvider.provider, l = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (d, h) => {
        const p = Gm.join(this.downloadedUpdateHelper.cacheDir, l), $ = () => (0, _l.pathExistsSync)(p) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let _ = !0;
        $() && (_ = await this.differentialDownloadInstaller(c, t, d, u, l)), _ && await this.httpExecutor.download(c.url, d, h);
      },
      done: async (d) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Gm.join(this.downloadedUpdateHelper.cacheDir, l);
            await (0, _l.copyFile)(d.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(c, d);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, s = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, _l.stat)(i)).size, o = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, wx.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      o.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const c = (u) => {
      const l = u.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((u, l) => {
      const d = (0, Km.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${d}`, "ascii"), p = `/${(0, Km.randomBytes)(64).toString("hex")}.zip`;
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
        const E = (0, $x.createReadStream)(i);
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
Ls.MacUpdater = Sx;
var Us = {}, Cf = {};
Object.defineProperty(Cf, "__esModule", { value: !0 });
Cf.verifySignature = Tx;
const Ym = Ue, gv = Ra, Px = Ca, Xm = Re;
function _v(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function Tx(e, t, r) {
  return new Promise((n, i) => {
    const s = t.replace(/'/g, "''");
    r.info(`Verifying signature ${s}`), (0, gv.execFile)(..._v(`"Get-AuthenticodeSignature -LiteralPath '${s}' | ConvertTo-Json -Compress"`, 20 * 1e3), (o, a, c) => {
      var u;
      try {
        if (o != null || c) {
          vl(r, o, c, i), n(null);
          return;
        }
        const l = Nx(a);
        if (l.Status === 0) {
          try {
            const $ = Xm.normalize(l.Path), _ = Xm.normalize(t);
            if (r.info(`LiteralPath: ${$}. Update Path: ${_}`), $ !== _) {
              vl(r, new Error(`LiteralPath of ${$} is different than ${_}`), c, i), n(null);
              return;
            }
          } catch ($) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(u = $.message) !== null && u !== void 0 ? u : $.stack}`);
          }
          const h = (0, Ym.parseDn)(l.SignerCertificate.Subject);
          let p = !1;
          for (const $ of e) {
            const _ = (0, Ym.parseDn)($);
            if (_.size ? p = Array.from(_.keys()).every((m) => _.get(m) === h.get(m)) : $ === h.get("CN") && (r.warn(`Signature validated using only CN ${$}. Please add your full Distinguished Name (DN) to publisherNames configuration`), p = !0), p) {
              n(null);
              return;
            }
          }
        }
        const d = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (h, p) => h === "RawData" ? void 0 : p, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${d}`), n(d);
      } catch (l) {
        vl(r, l, null, i), n(null);
        return;
      }
    });
  });
}
function Nx(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function vl(e, t, r, n) {
  if (Ox()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, gv.execFileSync)(..._v("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function Ox() {
  const e = Px.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Us, "__esModule", { value: !0 });
Us.NsisUpdater = void 0;
const zo = Ue, Jm = Re, Ax = Wn, Rx = no, Qm = mn, Cx = Fe, Ix = pn, Dx = Cf, Zm = hn;
class kx extends Ax.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, Dx.verifySignature)(n, i, this._logger);
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
    const r = t.updateInfoAndProvider.provider, n = (0, Cx.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
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
            await this.httpExecutor.download(new Zm.URL(c.path), o, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (d) {
            try {
              await (0, Ix.unlink)(o);
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
      this.spawnLog(Jm.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((o) => this.dispatchError(o));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), s(), !0) : (this.spawnLog(r, n).catch((o) => {
      const a = o.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${o.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? s() : a === "ENOENT" ? Ar.shell.openPath(r).catch((c) => this.dispatchError(c)) : this.dispatchError(o);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const s = {
        newUrl: new Zm.URL(r.path),
        oldFile: Jm.join(this.downloadedUpdateHelper.cacheDir, zo.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Qm.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (o) => this.emit(Qm.DOWNLOAD_PROGRESS, o)), await new Rx.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, s).download();
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "win32";
    }
    return !1;
  }
}
Us.NsisUpdater = kx;
(function(e) {
  var t = dt && dt.__createBinding || (Object.create ? function(v, m, E, A) {
    A === void 0 && (A = E);
    var I = Object.getOwnPropertyDescriptor(m, E);
    (!I || ("get" in I ? !m.__esModule : I.writable || I.configurable)) && (I = { enumerable: !0, get: function() {
      return m[E];
    } }), Object.defineProperty(v, A, I);
  } : function(v, m, E, A) {
    A === void 0 && (A = E), v[A] = m[E];
  }), r = dt && dt.__exportStar || function(v, m) {
    for (var E in v) E !== "default" && !Object.prototype.hasOwnProperty.call(m, E) && t(m, v, E);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = pn, i = Re;
  var s = Wn;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return s.BaseUpdater;
  } });
  var o = an;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return o.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return o.NoOpLogger;
  } });
  var a = Fe;
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
  var d = Ms;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return d.RpmUpdater;
  } });
  var h = Ls;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var p = Us;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return p.NsisUpdater;
  } }), r(mn, e);
  let $;
  function _() {
    if (process.platform === "win32")
      $ = new Us.NsisUpdater();
    else if (process.platform === "darwin")
      $ = new Ls.MacUpdater();
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
            $ = new Ms.RpmUpdater();
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
})(sf);
Sr.handle("open-external", async (e, t) => {
  console.log("[MAIN] Opening external URL:", t), await w$.openExternal(t);
});
Sr.handle("set-overlay-mode", (e, t) => {
  console.log("[MAIN] set-overlay-mode IPC received, enabled:", t), Ja.toggleOverlayMode(t), console.log("[MAIN] toggleOverlayMode called successfully");
});
Sr.handle("set-mini-mode", (e, t) => {
  console.log("[MAIN] set-mini-mode IPC received, enabled:", t), Ja.toggleMiniMode(t), console.log("[MAIN] toggleMiniMode called successfully");
});
Sr.handle("set-mini-mode-height", (e, t) => {
  console.log("[MAIN] set-mini-mode-height IPC received, height:", t), Ja.setMiniModeHeight(t);
});
Sr.handle("minimize-window", () => {
  Wt && Wt.minimize();
});
const eu = ue.dirname(E$(import.meta.url));
process.env.APP_ROOT = ue.join(eu, "..");
const tu = process.env.VITE_DEV_SERVER_URL, d3 = ue.join(process.env.APP_ROOT, "dist-electron"), vv = ue.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = tu ? ue.join(process.env.APP_ROOT, "public") : vv;
rk();
let Wt;
function $v() {
  console.log("[MAIN] Creating BrowserWindow..."), console.log("[MAIN] Preload path:", ue.join(eu, "index.mjs")), Wt = new ey({
    icon: ue.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
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
      preload: ue.join(eu, "index.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1,
      sandbox: !1
      // Required for preload scripts to work
    }
  }), console.log("[MAIN] BrowserWindow created, setting windowManager..."), Ja.setWindow(Wt), Wt.webContents.on("did-finish-load", () => {
    Wt == null || Wt.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), tu ? Wt.loadURL(tu) : Wt.loadFile(ue.join(vv, "index.html"));
}
oa.on("window-all-closed", () => {
  process.platform !== "darwin" && (oa.quit(), Wt = null);
});
oa.on("activate", () => {
  ey.getAllWindows().length === 0 && $v();
});
sf.autoUpdater.logger = console;
oa.whenReady().then(() => {
  $v();
  try {
    sf.autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    console.error("Failed to check for updates:", e);
  }
});
export {
  d3 as MAIN_DIST,
  vv as RENDERER_DIST,
  tu as VITE_DEV_SERVER_URL
};
