import { Channels } from 'main/preload';
import { css as cssImport } from '@emotion/css'
import { CSSInterpolation } from '@emotion/serialize'

declare global {
  interface Window {
    electron: {
      dir: (path: string[]) => Promise<any>,
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): Promise<any>;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

import 'twin.macro'
import styledImport from '@emotion/styled'

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport
  const css: typeof cssImport
}


declare module 'react' {

  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSInterpolation
  }

  interface SVCProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSInterpolation
  }
}

export {};
