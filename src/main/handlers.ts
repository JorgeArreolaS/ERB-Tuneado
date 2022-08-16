import { BrowserWindow, dialog, IpcMainInvokeEvent } from "electron"
import type { Stats } from "fs"
import { readdir, stat } from "fs/promises"
import { parse, ParsedPath } from "path"

type cxt = {
  event: IpcMainInvokeEvent
  mainWindow: BrowserWindow | null
}
export const setupHandler = <items extends {
  [path: string]: (param: any, cxt: cxt) => Promise<any>
}>(items: items) => items

export const handlers = setupHandler({

  test: async (param: { path: string[] }) => {

    return ({ items: param.path.map(i => i.toUpperCase()) })
  },

  getDir: async (params: { path: string[] }, { }) => {
    const path = ['C:/', ...params.path]
    console.log("READING:", path)
    const i = await readdir(path.length > 0 ? path.join('/') : 'C:/')
    let items: (Stats & ParsedPath)[] = []

    for (let item of i) {
      const itemPath = [...path, item].join('/')
      const data = await stat(itemPath)
      const parsed = parse(itemPath)
      if (data.isFile())
        items.push({
          ...data,
          ...parsed,
        })
    }
    return { items: items, test: 'Nyatzuu' }
  },

  deleteFile: async (params: { path: string }, { mainWindow }) => {

    mainWindow?.emit('dirDeleted', { path: params.path, status: true })

    return {}
  },

  selectDir: async (params: any, { mainWindow }) => {
    if(!mainWindow) return
    return await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'openDirectory']
    })
  }

})

export type handlers = typeof handlers
