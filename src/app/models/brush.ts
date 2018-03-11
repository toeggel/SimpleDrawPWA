import { ToolType, ITool } from './tool';
import { IPoint, Point } from './point';

export class Brush implements ITool {
  public type: ToolType = ToolType.Brush;

  private isActive = false;
  private previousPosition: IPoint;

  public onStartAction(drawContext: CanvasRenderingContext2D, currentPosition: IPoint): void {
    this.isActive = true;

    this.previousPosition = currentPosition;
    this.drawLine(drawContext, this.previousPosition, currentPosition);
  }

  public onMoveAction(drawContext: CanvasRenderingContext2D, currentPosition: IPoint): void {
    const wasActive = this.isActive;

    if (!this.isActive) {
      this.onStartAction(drawContext, currentPosition);
      return;
    }

    this.drawLine(drawContext, this.previousPosition, currentPosition);
    this.previousPosition = currentPosition;

  }

  private drawLine(drawContext: CanvasRenderingContext2D, pointA: IPoint, pointB: IPoint): void {
    if (!drawContext) { return; }

    drawContext.beginPath();

    if (pointA && pointB) {
      drawContext.moveTo(pointA.x, pointA.y);
      drawContext.lineTo(pointB.x, pointB.y);
      drawContext.stroke();
    }


    drawContext.closePath();
  }
}
