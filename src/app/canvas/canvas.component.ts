import { SwitchToolAction, ChangeToolSizeAction, ChangeToolColorAction } from '../app.action';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import '../shared/rxjs-operators';
import { IPoint, Point } from '../models/point';
import { AppStore, AppState, DrawOptions } from '../app.store';
import { BaseComponent } from '../shared/base.component';
import { Line } from '../models/line';
import { ToolType } from '../models/toolType';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;

  drawOptions$: Observable<DrawOptions>;
  activeTool$: Observable<ToolType>;
  color$: Observable<string>;
  toolSize$: Observable<number>;
  brushDisplayColor$: Observable<string>;
  showBrushDisplay = false;

  private pointerdown$: Observable<PointerEvent>;
  private pointermove$: Observable<PointerEvent>;
  private pointerup$: Observable<PointerEvent>;

  private brushTimer: NodeJS.Timer;

  constructor(private store: AppStore) {
    super();

    this.drawOptions$ = this.store.drawContext$;
    this.activeTool$ = this.store.tool$;
    this.color$ = this.drawOptions$.map(d => d.color);
    this.toolSize$ = this.drawOptions$.map(d => d.size);
    this.brushDisplayColor$ = this.activeTool$.switchMap(type => type === ToolType.Eraser ? Observable.of('#ffffff') : this.color$);
  }

  ngAfterViewInit() {
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    const drawContext = canvasElement.getContext('2d');
    this.drawOptions$
      .takeUntil(this.destroyed$)
      .subscribe(ctx => {
        drawContext.lineWidth = ctx.size;
        drawContext.lineCap = ctx.style;
        drawContext.globalCompositeOperation = ctx.compositionType;
        drawContext.strokeStyle = ctx.color;
      });

    this.registerPointerEvents(canvasElement);
  }

  onToolChange(toolType: ToolType): void {
    this.store.switchTool(toolType);

    if (toolType === ToolType.Brush || toolType === ToolType.Eraser) {
      this.showBrush();
    }
  }

  onSizeChange(size: number): void {
    this.store.changeToolSize(size);
    this.showBrush();
  }

  onColorChange(color: string): void {
    this.store.changeToolColor(color);
    this.showBrush();
  }

  private registerPointerEvents(canvasElement: HTMLCanvasElement): void {
    this.pointerdown$ = Observable.fromEvent(canvasElement, 'pointerdown');
    this.pointermove$ = Observable.fromEvent(document, 'pointermove');
    this.pointerup$ = Observable.fromEvent(document, 'pointerup');

    const lines$ = this.pointerdown$.switchMap((firstPoint) => this.getLine$(firstPoint, canvasElement));
    lines$
      .withLatestFrom(this.drawOptions$)
      .takeUntil(this.destroyed$)
      .subscribe(([line, drawOptions]) => {
        this.drawLine(canvasElement.getContext('2d'), line.pointA, line.pointB);
      });

    lines$
      .buffer(this.pointerup$)
      .withLatestFrom(this.drawOptions$)
      .takeUntil(this.destroyed$)
      .subscribe(([lines, drawOptions]) => {
        this.store.addDrawingPart({
          drawOptions,
          lines
        });
      });
  }

  private getLine$(firstPoint: PointerEvent, canvasElement: HTMLCanvasElement): Observable<Line> {
    return this.pointermove$
      .takeUntil(this.pointerup$)
      .pairwise()
      .map(([pointA, pointB]) => this.createLine(pointA, pointB, canvasElement))
      .startWith(this.createLine(firstPoint, firstPoint, canvasElement));
  }

  private createLine(pointA: PointerEvent, pointB: PointerEvent, canvasElement: Element): Line {
    return {
      pointA: this.getCurrentPointerPosition(pointA, canvasElement),
      pointB: this.getCurrentPointerPosition(pointB, canvasElement),
    };
  }

  // todo: create current pointer position from pointermove observable
  private getCurrentPointerPosition(event: PointerEvent, canvasElement: Element): IPoint {
    const canvasBoundingRect = canvasElement.getBoundingClientRect();
    return new Point(event.clientX - canvasBoundingRect.left, event.clientY - canvasBoundingRect.top);
  }

  private showBrush(): void {
    this.stopBrushTimer();
    this.showBrushDisplay = true;
    this.startBrushTimer();
  }

  private startBrushTimer(): void {
    this.brushTimer = setTimeout(() => {
      this.showBrushDisplay = false;
      this.brushTimer = null;
    }, 1500);
  }

  private stopBrushTimer(): void {
    clearTimeout(this.brushTimer);
    this.brushTimer = null;
  }

  public drawLine(drawContext: CanvasRenderingContext2D, pointA: IPoint, pointB: IPoint, isStart?: boolean): void {
    if (isStart) { return; }
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
