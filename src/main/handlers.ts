import { BrowserWindow, dialog, IpcMainInvokeEvent } from "electron"
import type { Stats } from "fs"
import { readdir, stat } from "fs/promises"
import path, { parse, ParsedPath } from "path"

export type FileType = (Stats & ParsedPath)
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
    let items: FileType[] = []

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

  selectDir: async (_params: any, { mainWindow }) => {
    if (!mainWindow) return
    return await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
  },

  openDir: async (_params: string) => {
    const { shell } = require('electron') // deconstructing assignment
    shell.showItemInFolder(path.resolve( _params )) // Open the given file in the desktop's default manner.
  },

  openFile: async (_params: string) => {
    const { shell } = require('electron') // deconstructing assignment
    // shell.openPath(path.resolve( _params )) // Open the given file in the desktop's default manner.
    shell.openPath(path.resolve( _params )) // Show the given file in a file manager. If possible, select the file.
  },


})

export type handlers = typeof handlers
