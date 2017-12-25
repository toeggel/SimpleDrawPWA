import { IPoint } from './point';

export interface ITool {
  toolOptions: ToolOptions;
  onStartAction: (drawContext: CanvasRenderingContext2D, currentPosition: IPoint) => void;
  onMoveAction: (drawContext: CanvasRenderingContext2D, currentPosition: IPoint) => void;
  onEndAction: () => void;
}

export class ToolOptions {
  public toolSize: number;
  public toolColor: string;

  constructor() {
    this.toolSize = 4;
    this.toolColor = '#000000';
  }
}

export enum ToolType {
  Brush,
  Eraser,
  ColorPicker
}
