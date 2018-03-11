import { SwitchToolAction, ChangeToolSizeAction, ChangeToolColorAction } from '../app.action';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import '../shared/rxjs-operators';
import { IPoint, Point } from '../models/point';
import { ToolService } from '../services/tool.service';
import { AppStore, AppState } from '../app.store';
import { ITool, ToolType } from '../models/tool';
import { Brush } from '../models/brush';
import { Store } from '@ngrx/store';
import { Eraser } from '../models/eraser';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {

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

  constructor(private toolService: ToolService, private appStore: AppStore, private store: Store<AppState>) {
    this.activeTool$ = this.appStore.tool$;
    this.color$ = this.appStore.tool$.map(t => t.toolOptions.toolColor);
    this.toolSize$ = this.appStore.tool$.map(t => t.toolOptions.toolSize);
    this.brushDisplayColor$ = this.activeTool$.switchMap(c => c.type === ToolType.Eraser ? Observable.of('#ffffff') : this.color$);
  }

  public ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement;

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    const drawContext = canvasElement.getContext('2d');

    this.pointerdown$ = Observable.fromEvent(canvasElement, 'pointerdown');
    this.pointermove$ = Observable.fromEvent(document, 'pointermove');
    this.pointerup$ = Observable.fromEvent(document, 'pointerup');

    // todo: unsubscribe
    const subscription = this.pointerdown$
      .switchMap((down) => this.pointermove$
        .startWith(down)
        .takeUntil(this.pointerup$)
        .withLatestFrom(this.activeTool$))
      .subscribe(([event, tool]) =>
        tool.onMoveAction(
          drawContext,
          this.getCurrentPointerPosition(event, canvasElement)));
  }

  public onToolChange(toolType: ToolType): void {
    this.toolService.selectTool(toolType);
    this.store.dispatch(new SwitchToolAction(toolType));

    if (toolType === ToolType.Brush || toolType === ToolType.Eraser) {
      this.showBrush();
    }
  }

  public onSizeChange(size: number): void {
    this.toolService.getActiveTool().toolOptions.toolSize = size;
    this.store.dispatch(new ChangeToolSizeAction(size));
    this.showBrush();
  }

  public onColorChange(color: string): void {
    this.toolService.getActiveTool().toolOptions.toolColor = color;
    this.store.dispatch(new ChangeToolColorAction(color));
    this.showBrush();
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
