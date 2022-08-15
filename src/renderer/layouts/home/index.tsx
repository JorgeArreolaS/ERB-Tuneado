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
import { ListBox } from 'primereact/listbox';
import { useElectron } from 'renderer/electron_ipc';

export const knobAtom = atom(0)
export const chipsAtom = atom<string[]>([])

export const HomeLayout = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [knob, setKnob] = useAtom(knobAtom)
  const [chips, setChips] = useAtom(chipsAtom)
  const selected = useAtomValue(selectedAtom)

  const [items] = useElectron.test({
    initial: {
      path: ['uwu', 'fino señores', 'nyatzu']
    }
  })

  return (
    <div className=" p-2 flex flex-column gap-3 ">
      <div className=" flex justify-content-between ">
        <div tw=" text-yellow-400 text-2xl font-semibold mx-1 ">
          Dashboard {selected && ` - ${selected}`}
        </div>
        <Button
          label="Test"
          icon=" pi pi-cog "
          className=" p-button-info p-button-sm self-align-right py-0 px-2 "
          onClick={() => navigate('/test')}
        />
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

      <Card>
        <pre>
          <ListBox
            listStyle={{ maxHeight: '30vh' }}
            options={items?.items}
          />
        </pre>
      </Card>

    </div>
  );
};

export const HomeRoute = setupRoute('/', HomeLayout)
