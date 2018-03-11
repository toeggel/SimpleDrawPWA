import { Brush } from './brush';
import { ToolOptions, ToolType } from './tool';

export class Eraser extends Brush {
  public type: ToolType = ToolType.Eraser;

  constructor(toolOption: ToolOptions) {
    super(toolOption);
  }

  protected setColor(drawContext: CanvasRenderingContext2D): void {
    drawContext.globalCompositeOperation = 'destination-out';
  }
}
