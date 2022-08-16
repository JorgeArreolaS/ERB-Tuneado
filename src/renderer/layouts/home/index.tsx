import tw, { css } from 'twin.macro';

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Card } from 'primereact/card';
import { Knob } from 'primereact/knob';
import { Chips } from 'primereact/chips';

import { useToast } from 'renderer/hooks';
import { atom, useAtom, useAtomValue } from 'jotai';
import { selectedAtom } from '../test';
import { setupRoute } from 'renderer/helpers/route';
import ElectronIPC, { useElectron } from 'renderer/electron_ipc';
import { createStoreAtom } from 'renderer/helpers';

export const knobAtom = atom(0)
export const rootAtom = atom<string | null>(null)

const pathAtom = createStoreAtom<string>('root_path', "")
export const chipsAtom = createStoreAtom<string[]>('chips', [])

export const HomeLayout = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [knob, setKnob] = useAtom(knobAtom)
  const [chips, setChips] = useAtom(chipsAtom)
  const selected = useAtomValue(selectedAtom)
  const [test, setTest] = useAtom(pathAtom)

  const handleChangePath = async () => {
    const res = await ElectronIPC.selectDir({})
    if (!res || res.canceled) return
    console.log(res)
    setTest(res.filePaths[0])
  }

  return (
    <div className=" p-2 flex flex-column gap-3 ">
      <div className=" flex justify-content-between ">
        <div tw=" text-yellow-400 text-2xl font-semibold mx-1 ">
          Dashboard <span className="text-gray-200 font-normal ">{test}</span>
        </div>
        <div className="h-full flex gap-2 ">
          <Button
            label="Cambiar directorio raiz"
            icon=" pi pi-home "
            className=" p-button-primary p-button-sm self-align-right py-1 px-2 "
            onClick={handleChangePath}
          />
          <Button
            label="Test"
            icon=" pi pi-cog "
            className=" p-button-info p-button-sm self-align-right py-1 px-2 "
            onClick={() => navigate('/test')}
          />
        </div>
      </div>

      <Card>
        <div className=" card-conteiner flex gap-3 ">
          <div className=" flex flex-column gap-1 w-3 ">
            <Button
              label="Hello world"
              icon=" pi pi-home "
              onClick={() => {
                toast?.show({ severity: 'success', summary: 'Success Message', detail: 'Order submitted' });
              }}
            />
            <Button
              className=" p-button-warning "
              label="Ok world"
              icon=" pi pi-check "
              onClick={() => {
                toast?.show({ severity: 'warn', summary: 'Warning, something is gonna explode', detail: 'Order submitted' });
              }}
            />
            <Button
              className=" p-button-danger "
              label="Die world"
              icon=" pi pi-trash "
              onClick={() => {
                toast?.show([
                  { severity: 'error', summary: 'Message 1', detail: 'PrimeReact rocks' },
                  { severity: 'error', summary: 'Message 2', detail: 'PrimeReact rocks' },
                  { severity: 'error', summary: 'Message 3', detail: 'PrimeFaces rocks' },
                ])
              }}
            />
          </div>


          <div className=" w-3 flex items-center justify-center ">
            <Knob
              size={130}
              value={knob}
              onChange={(e) => setKnob(e.value)}
            />
          </div>

          <div
            className="flex flex-column w-6 "
            css={css`
              .p-chips-multiple-container {
                ${tw` w-full `}
              }
              .p-chips-token-label{
                ${tw` text-green-300 `}
              }
              .p-chips-token-icon {
                ${tw` text-red-400 `}
              }
            `}
          >
            <Chips
              className=" min-w-full "
              value={chips}
              onChange={(e) => setChips(e.value)}
            ></Chips>
          </div>
        </div>
      </Card>

      <Card>
        <pre>
          {JSON.stringify({ knob, chips, selected }, null, 2)}
        </pre>
      </Card>

    </div>
  );
};

export const HomeRoute = setupRoute('/', HomeLayout)
