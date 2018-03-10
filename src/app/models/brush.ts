import { ToolOptions, ToolType, ITool } from './tool';
import { IPoint } from './point';

export class Brush implements ITool {
  public type: ToolType = ToolType.Brush;
  public toolOptions: ToolOptions;

  private style: string;
  private isActive = false;
  private previousPosition: IPoint;

  constructor(toolOptions: ToolOptions) {
    this.toolOptions = toolOptions;
    this.style = 'round';
  }

  public onStartAction(drawContext: CanvasRenderingContext2D, currentPosition: IPoint): void {
    drawContext.lineWidth = this.toolOptions.toolSize;
    drawContext.lineCap = this.style;
    this.setColor(drawContext);

    this.isActive = true;

    this.previousPosition = currentPosition;
    this.drawLine(drawContext, this.previousPosition, currentPosition);
  }

  public onMoveAction(drawContext: CanvasRenderingContext2D, currentPosition: IPoint): void {
    if (this.isActive) {
      this.drawLine(drawContext, this.previousPosition, currentPosition);
      this.previousPosition = currentPosition;
    }
  }

  public onEndAction(): void {
    this.isActive = false;
  }

  protected setColor(drawContext: CanvasRenderingContext2D): void {
    drawContext.strokeStyle = this.toolOptions.toolColor;
  }

  private drawLine(drawContext: CanvasRenderingContext2D, pointA: IPoint, pointB: IPoint): void {
    if (!drawContext) { return; }

    drawContext.beginPath();

    if (pointA && pointB) {
      drawContext.moveTo(pointA.x, pointA.y);
      drawContext.lineTo(pointB.x, pointB.y);
      drawContext.stroke();
    }
  }
}
