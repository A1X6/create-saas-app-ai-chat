declare module "culori" {
  export type Color = {
    mode: string;
    l: number;
    c: number;
    h: number;
    alpha?: number;
  };

  export function oklch(color: string): Color | undefined;
  export function formatHex(color: Color): string;
}
