import { SwitchToolAction, ChangeToolSizeAction, ChangeToolColorAction } from '../app.action';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import '../shared/rxjs-operators';
import { IPoint, Point } from '../models/point';
import { AppStore, AppState, DrawOptions, DrawingPart } from '../app.store';
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
  drawing$: Observable<DrawingPart[]>;
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
    this.drawing$ = this.store.drawing$;
    this.activeTool$ = this.store.tool$;
    this.color$ = this.drawOptions$.map(d => d.color);
    this.toolSize$ = this.drawOptions$.map(d => d.size);
    this.brushDisplayColor$ = this.activeTool$.switchMap(type => type === ToolType.Eraser ? Observable.of('#ffffff') : this.color$);
  }

  ngAfterViewInit() {
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    const drawContext = canvasElement.getContext('2d');

    this.drawOptions$
      .takeUntil(this.destroyed$)
      .subscribe(options => this.applyDrawOptions(drawContext, options));

    this.drawing$
      .takeUntil(this.destroyed$)
      .subscribe(drawing => this.redraw(drawContext, canvasElement, drawing));

    this.registerPointerEvents(canvasElement);
  }

  undoDrawing() {
    this.store.undoDrawing();
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

  private redraw(drawContext: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement, drawingParts: DrawingPart[]): void {
    const oldOptions = <DrawOptions>{
      size: drawContext.lineWidth,
      style: drawContext.lineCap,
      compositionType: drawContext.globalCompositeOperation,
      color: drawContext.strokeStyle,
    };

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;
    drawContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    drawingParts.forEach(part => {
      this.applyDrawOptions(drawContext, part.drawOptions);
      part.lines.forEach(line => this.drawLine(drawContext, line.pointA, line.pointB));
    });

    this.applyDrawOptions(drawContext, oldOptions);
  }

  private applyDrawOptions(drawContext: CanvasRenderingContext2D, drawOptions: DrawOptions) {
    drawContext.lineWidth = drawOptions.size;
    drawContext.lineCap = drawOptions.style;
    drawContext.globalCompositeOperation = drawOptions.compositionType;
    drawContext.strokeStyle = drawOptions.color;
  }

  private registerPointerEvents(canvasElement: HTMLCanvasElement): void {
    this.pointerdown$ = Observable.fromEvent(canvasElement, 'pointerdown');
    this.pointermove$ = Observable.fromEvent(document, 'pointermove');
    this.pointerup$ = Observable.fromEvent(document, 'pointerup');

    this.trackDrawing(canvasElement)
      .do(line => this.drawLine(canvasElement.getContext('2d'), line.pointA, line.pointB))
      .buffer(this.pointerup$)
      .withLatestFrom(this.drawOptions$)
      .takeUntil(this.destroyed$)
      .subscribe(([lines, drawOptions]) => this.store.addDrawingPart({ lines, drawOptions }));
  }

  private trackDrawing(canvasElement: HTMLCanvasElement): Observable<Line> {
    return this.pointerdown$
      .switchMap(firstPoint => this.pointermove$
        .takeUntil(this.pointerup$)
        .pairwise()
        .map(([pointA, pointB]) => this.createLine(pointA, pointB, canvasElement))
        .startWith(this.createLine(firstPoint, firstPoint, canvasElement)));
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
}
