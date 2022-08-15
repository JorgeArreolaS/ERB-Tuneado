import { readdir } from "fs/promises"

export const setupHandler = <items extends {
  [path: string]: (param: any) => Promise<any>
}>(items: items) => items

export const handlers = setupHandler({
  test: async (param: { path: string[] }) => ({ items: param.path.map(i => i.toUpperCase()) }),
  getDir: async (params: { path: string[] }) => {
    const path = ['C:/', ...params.path]
    console.log("READING:", path)
    const i = await readdir(path.length > 0 ? path.join('/') : 'C:/')

    return { items: i, test: 'Nyatzuu' }
  }
})

export type handlers = typeof handlers
