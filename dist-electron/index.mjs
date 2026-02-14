import { contextBridge as i, ipcRenderer as o } from "electron";
i.exposeInMainWorld("ipcRenderer", {
  on(...e) {
    const [n, t] = e;
    return o.on(n, (r, ...l) => t(r, ...l));
  },
  off(...e) {
    const [n, ...t] = e;
    return o.off(n, ...t);
  },
  send(...e) {
    const [n, ...t] = e;
    return o.send(n, ...t);
  },
  invoke(...e) {
    const [n, ...t] = e;
    return o.invoke(n, ...t);
  },
  // Store API
  getStoreValue: (e) => o.invoke("get-store-value", e),
  setStoreValue: (e, n) => o.invoke("set-store-value", e, n),
  deleteStoreValue: (e) => o.invoke("delete-store-value", e),
  clearStore: () => o.invoke("clear-store")
});
