import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import '../shared/rxjs-operators';
import { IPoint, Point } from '../models/point';
import { ToolService } from '../services/tool.service';
import { AppStore } from '../app.store';
import { ITool } from '../models/tool';
import { Brush } from '../models/brush';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;

  private activeTool$: Observable<ITool>;
  private pointerdown$: Observable<PointerEvent>;
  private pointermove$: Observable<PointerEvent>;
  private pointerup$: Observable<PointerEvent>;

  constructor(private toolService: ToolService, private store: AppStore) {
    this.activeTool$ = this.store.tool$;
  }
  public ngOnInit() { }

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

  private getCurrentPointerPosition(event: PointerEvent, canvasElement: Element): IPoint {
    const canvasBoundingRect = canvasElement.getBoundingClientRect();
    return new Point(event.clientX - canvasBoundingRect.left, event.clientY - canvasBoundingRect.top);
  }
}
