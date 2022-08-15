import { atom, useAtom, useAtomValue } from "jotai"
import { useNavigate } from "react-router-dom"
import { chipsAtom } from "./home"

import { Button } from "primereact/button"
import { ListBox } from 'primereact/listbox';

export const selectedAtom = atom<string | null>(null)

export default () => {
  const chips = useAtomValue(chipsAtom)
  const navigate = useNavigate()
  const [item, setItem] = useAtom(selectedAtom)

  return (
    <div tw="p-4">
      <div className="flex mb-2">
        <Button
          label="Home"
          icon=" pi pi-home "
          className=" p-button-info p-button-sm self-align-right py-1 px-2 "
          onClick={() => navigate('/')}
        />
      </div>
      <h1 tw=" text-3xl text-blue-400 ">Hello World</h1>
      <h3 tw=" text-lg text-gray-200 ">Testing uwu</h3>
      <div className="mt-3 m-2">
        <ListBox value={item} options={chips} onChange={(e) => setItem(e.value)} />
      </div>
    </div>
  )
}
