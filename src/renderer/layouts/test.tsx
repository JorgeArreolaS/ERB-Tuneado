import { atom, useAtom, useAtomValue } from "jotai"
import { useNavigate } from "react-router-dom"
import { chipsAtom } from "./home"

import { Button } from "primereact/button"
import { ListBox } from 'primereact/listbox';
import { setupRoute } from "renderer/helpers/route";
import { Card } from "primereact/card";
import ElectronIPC, { useElectron } from "renderer/electron_ipc";
import { useEffect } from "react";
import { useToast } from "renderer/hooks";

import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import FilesTable from "renderer/components/filesTable";

export const selectedAtom = atom<string | null>(null)

export const TestRoute = setupRoute('/test', () => {
  const toast = useToast()
  const chips = useAtomValue(chipsAtom)
  const navigate = useNavigate()
  const [item, setItem] = useAtom(selectedAtom)

  useEffect(() => {
    window.electron.ipcRenderer.on('dirDeleted' as any, (params: any) => {
      console.log(`Dir deleted`, params)
      toast?.show({
        severity: 'warn', summary: 'Sucessfully deleted', detail: 'File: ' + params?.path
      })
    })
  }, [])


  return (
    <div tw=" p-4 h-screen overflow-y-auto ">
      <div className="flex mb-2">
        <Button
          label="Home"
          icon=" pi pi-home "
          className=" p-button-info p-button-sm self-align-right py-1 px-2 "
          onClick={() => navigate('/')}
        />
        <Button
          label="Home"
          icon=" pi pi-check "
          className=" p-button-warn p-button-sm self-align-right py-1 px-2 "
        />
      </div>
      <h1 tw=" text-3xl text-blue-400 ">Hello World</h1>
      <FilesTable/>

    </div>
  )
}
)
