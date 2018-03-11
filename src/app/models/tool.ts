import { IPoint } from './point';

export interface ITool {
  type: ToolType;
  onStartAction: (drawContext: CanvasRenderingContext2D, currentPosition: IPoint) => void;
  onMoveAction: (drawContext: CanvasRenderingContext2D, currentPosition: IPoint) => void;
}

export enum ToolType {
  Brush = 'Brush',
  Eraser = 'Eraser',
  ColorPicker = 'ColorPicker'
}
