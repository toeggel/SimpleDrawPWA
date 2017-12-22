export interface IBrush {
  size: number;
  color: string;
  style: BrushStyle;
}

export enum BrushStyle {
  Round = 'round',
}
