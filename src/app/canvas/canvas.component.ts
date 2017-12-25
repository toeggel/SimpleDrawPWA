import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { IPoint, Point } from '../models/point';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;

  constructor(private toolService: ToolService) { }

  public ngOnInit() { }

  public ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement;

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    this.registerEvents(canvasElement);
  }

  private registerEvents(canvasElement: HTMLCanvasElement): void {
    const drawContext = canvasElement.getContext('2d');
    const rect = canvasElement.getBoundingClientRect();

    canvasElement.addEventListener('pointerdown', (event) => {
      const activeTool = this.toolService.getActiveTool();
      activeTool.onStartAction(drawContext, this.getCurrentPointerPosition(event, rect));
    });

    canvasElement.addEventListener('pointermove', (event) => {
      const activeTool = this.toolService.getActiveTool();
      activeTool.onMoveAction(drawContext, this.getCurrentPointerPosition(event, rect));
    });

    ['pointerup'].forEach((eventName) => {
      canvasElement.addEventListener(eventName, (event: PointerEvent) => {
        const activeTool = this.toolService.getActiveTool();
        activeTool.onEndAction();
      });
    });
  }

  private getCurrentPointerPosition(event: PointerEvent, canvasBoundingRect: ClientRect): IPoint {
    return new Point(event.clientX - canvasBoundingRect.left, event.clientY - canvasBoundingRect.top);
  }
}
