import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { handlers } from './handlers';

export type Channels = keyof handlers;

type Params<F> =
  F extends (param: infer P, ...args: any[]) => any ? P : unknown
type Return<F> =
  F extends (param: any, ...args: any[]) => Promise<infer R> ? R : unknown

const invoke: <
  channel extends keyof handlers,
  handler = handlers[channel]
  >(path: channel, params: Params<handler>) => Promise<Return<handler>>

  = async (channel, params) => {
    console.log("Called, handler:", channel, "with params:", params)
    return await ipcRenderer.invoke(channel, params);
  }

type key = 'electron'
const key: key = 'electron'

const processed: {
  [channel in Channels]: (params: Params<handlers[channel]>) => Promise<Return<handlers[channel]>>
} = Object.fromEntries((Object.keys(handlers) as Channels[]).map((channel) => {
  return [channel, (params: any) => invoke(channel, params)]
})) as any

console.log({ processed })

const api = {
  invoke,
  exec: processed,
  ipcRenderer: {
    async sendMessage(channel: Channels, args: unknown[], _a: string) {
      console.log({ channel, args })
      return await ipcRenderer.invoke(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  store: {
    get(property: string) {
      return ipcRenderer.sendSync('electron-store-get', property);
    },
    set(property: string, val: any) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
}
export type windowContext = {
  [key]: typeof api
}

contextBridge.exposeInMainWorld(key, api);
