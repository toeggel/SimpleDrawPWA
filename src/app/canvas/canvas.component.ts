import { SwitchToolAction, ChangeToolSizeAction, ChangeToolColorAction } from '../app.action';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import '../shared/rxjs-operators';
import { IPoint, Point } from '../models/point';
import { AppStore, AppState } from '../app.store';
import { ITool, ToolType } from '../models/tool';
import { Brush } from '../models/brush';
import { Eraser } from '../models/eraser';
import { BaseComponent } from '../shared/base.component';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;

  activeTool$: Observable<ITool>;
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

    this.activeTool$ = this.store.tool$;
    this.color$ = this.store.drawContext$.map(d => d.color);
    this.toolSize$ = this.store.drawContext$.map(d => d.size);
    this.brushDisplayColor$ = this.activeTool$.switchMap(c => c.type === ToolType.Eraser ? Observable.of('#ffffff') : this.color$);
  }

  ngAfterViewInit() {
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    const drawContext = canvasElement.getContext('2d');
    this.store.drawContext$
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

    this.pointerdown$
      .switchMap((down) => this.pointermove$
        .startWith(down)
        .takeUntil(this.pointerup$)
        .withLatestFrom(this.activeTool$))
      .takeUntil(this.destroyed$)
      .subscribe(([event, tool]) =>
        tool.onMoveAction(
          canvasElement.getContext('2d'),
          this.getCurrentPointerPosition(event, canvasElement)));
  }

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
}
