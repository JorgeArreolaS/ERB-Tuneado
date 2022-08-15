import { atom, useAtom, useAtomValue } from "jotai"
import { useNavigate } from "react-router-dom"
import { chipsAtom } from "./home"

import { Button } from "primereact/button"
import { ListBox } from 'primereact/listbox';
import { setupRoute } from "renderer/helpers/route";
import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { useElectron } from "renderer/electron_ipc";

export const selectedAtom = atom<string | null>(null)

export const TestRoute = setupRoute('/test', () => {
  const chips = useAtomValue(chipsAtom)
  const navigate = useNavigate()
  const [item, setItem] = useAtom(selectedAtom)
  const [test, callTest] = useElectron.getDir({ 
    initial: () => {
      return { path: ['/Users/jorgearreola'] }
    } 
  })

  return (
    <div tw="p-4">
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
          onClick={() => callTest({ path: ['/Users/jorgearreola/downloads'] })
}
        />
      </div>
      <h1 tw=" text-3xl text-blue-400 ">Hello World</h1>
      <h3 tw=" text-lg text-gray-200 ">Testing uwu</h3>
      <div className="mt-3 m-2">
        <ListBox value={item} options={chips} onChange={(e) => setItem(e.value)} />
      </div>
      <Card>
        <div className="card-content">
          <h1 tw=" text-3xl text-yellow-400 mb-2 ">{item}</h1>
          {test &&
            <ListBox
              value={item}
              onChange={(e) => setItem(e.value)}
              listStyle={{ maxHeight: '30vh' }}
              options={test?.items}
            />
          }
        </div>
      </Card>
    </div>
  )
}
)
