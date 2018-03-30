import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { of } from 'rxjs/observable/of';
import { buffer, tap, withLatestFrom, takeUntil, switchMap, pairwise, map, startWith } from 'rxjs/operators';

import { BaseComponent } from '../shared/base.component';
import {
  SwitchToolAction,
  ChangeToolSizeAction,
  ChangeToolColorAction
} from '../app.action';
import { AppStore, AppState, DrawOptions, DrawingPart } from '../app.store';
import { IPoint, Point, Line, ToolType } from '../models';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;

  drawOptions$: Observable<DrawOptions>;
  activeTool$: Observable<ToolType>;
  undoable$: Observable<boolean>;
  redoable$: Observable<boolean>;
  brushDisplayColor$: Observable<string>;
  showBrushDisplay = false;

  private drawing$: Observable<DrawingPart[]>;
  private pointerdown$: Observable<PointerEvent>;
  private pointermove$: Observable<PointerEvent>;
  private pointerup$: Observable<PointerEvent>;

  private brushTimer: NodeJS.Timer;

  constructor(private store: AppStore) {
    super();

    this.drawing$ = this.store.drawing$.pipe(map(d => d.current));
    this.undoable$ = this.store.drawing$.pipe(map(d => d.current.some(Boolean)));
    this.redoable$ = this.store.drawing$.pipe(map(d => d.future.some(Boolean)));

    this.drawOptions$ = this.store.drawContext$;

    this.activeTool$ = this.store.tool$;
    this.brushDisplayColor$ = this.activeTool$
      .pipe(switchMap(type =>
        type === ToolType.Eraser
          ? of('#ffffff')
          : this.drawOptions$.pipe(map(d => d.color))
      ));
  }

  ngAfterViewInit() {
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    const drawContext = canvasElement.getContext('2d');

    this.drawOptions$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(options => this.applyDrawOptions(drawContext, options));

    fromEvent(window, 'resize')
      .pipe(
        switchMap(e => this.drawing$),
        takeUntil(this.destroyed$)
      )
      .subscribe(drawing => this.redraw(drawContext, canvasElement, drawing));

    this.drawing$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(drawing => this.redraw(drawContext, canvasElement, drawing));

    this.registerPointerEvents(canvasElement);
  }

  undoDrawing(): void {
    this.store.undoDrawing();
  }

  redoDrawing(): void {
    this.store.redoDrawing();
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

  onZoom(zoomFactor: number): void {
    this.store.zoom(zoomFactor);
  }

  private redraw(drawContext: CanvasRenderingContext2D, canvasElement: HTMLCanvasElement, drawingParts: DrawingPart[]): void {
    const oldOptions = <DrawOptions>{
      size: drawContext.lineWidth,
      style: drawContext.lineCap,
      compositionType: drawContext.globalCompositeOperation,
      color: drawContext.strokeStyle
    };

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;
    drawContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    drawingParts.forEach(part => {
      this.applyDrawOptions(drawContext, part.drawOptions);
      part.lines.forEach(line =>
        this.drawLine(drawContext, line.pointA, line.pointB)
      );
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
    this.pointerdown$ = fromEvent(canvasElement, 'pointerdown');
    this.pointermove$ = fromEvent(document, 'pointermove');
    this.pointerup$ = fromEvent(document, 'pointerup');

    this.trackDrawing(canvasElement)
      .pipe(
        tap(line =>
          this.drawLine(canvasElement.getContext('2d'), line.pointA, line.pointB)
        ),
        buffer(this.pointerup$),
        withLatestFrom(this.drawOptions$),
        takeUntil(this.destroyed$)
      )
      .subscribe(([lines, drawOptions]) =>
        this.store.addDrawingPart({ lines, drawOptions })
      );
  }

  private trackDrawing(canvasElement: HTMLCanvasElement): Observable<Line> {
    return this.pointerdown$
      .pipe(switchMap(firstPoint => this.pointermove$
        .pipe(
          takeUntil(merge(this.pointerup$, this.pointerdown$)),
          pairwise(),
          map(([eventA, eventB]) => this.createLine(eventA, eventB, canvasElement)),
          startWith(this.createLine(firstPoint, firstPoint, canvasElement))
        )
      ));
  }

  private createLine(eventA: PointerEvent, eventB: PointerEvent, canvasElement: Element): Line {
    return {
      pointA: this.getPointerPosition(eventA, canvasElement),
      pointB: this.getPointerPosition(eventB, canvasElement)
    };
  }

  private getPointerPosition(event: PointerEvent, canvasElement: Element): IPoint {
    const canvasBoundingRect = canvasElement.getBoundingClientRect();
    return new Point(
      event.clientX - canvasBoundingRect.left,
      event.clientY - canvasBoundingRect.top
    );
  }

  private drawLine(drawContext: CanvasRenderingContext2D, pointA: IPoint, pointB: IPoint): void {
    if (!drawContext) {
      return;
    }

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
