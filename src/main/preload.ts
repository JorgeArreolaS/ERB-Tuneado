import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'ipc-dir';

contextBridge.exposeInMainWorld('electron', {
  async dir(path: string[]){
    console.log(path)
    return await ipcRenderer.invoke('ipc-dir', path);
  },
  ipcRenderer: {
    async sendMessage(channel: Channels, args: unknown[], _a: string) {
      console.log({channel, args})
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
});
