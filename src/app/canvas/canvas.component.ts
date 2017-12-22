import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';

import { IPoint, Point } from '../models/point';
import { BrushService } from './../services/brush.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas: ElementRef;

  private drawContext: CanvasRenderingContext2D;
  private canvasElement: HTMLCanvasElement;

  private isDrawing = false;

  constructor(private brushService: BrushService) { }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    console.log('window resize');
  }

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.drawContext = this.canvasElement.getContext('2d');

    this.canvasElement.width = this.canvasElement.clientWidth;
    this.canvasElement.height = this.canvasElement.clientHeight;

    this.registerEvents(this.canvasElement);
  }

  private registerEvents(canvasElement: HTMLCanvasElement): void {
    let pointA: IPoint;
    let pointB: IPoint;
    const rect = canvasElement.getBoundingClientRect();

    canvasElement.addEventListener('pointerdown', (event) => {
      this.startDrawing();
      pointA = new Point(event.clientX - rect.left, event.clientY - rect.top);
    });

    canvasElement.addEventListener('pointermove', (event) => {
      if (this.isDrawing) {
        pointB = new Point(event.clientX - rect.left, event.clientY - rect.top);
        this.drawLine(pointA, pointB);
        pointA = pointB;
      }
    });

    ['pointerup', 'pointerout'].forEach((eventName) => {
      canvasElement.addEventListener(eventName, (event: PointerEvent) => {
        this.stopDrawing();
      });
    });
  }

  private startDrawing(): void {
    const brush = this.brushService.getBrush();
    this.drawContext.lineWidth = brush.size;
    this.drawContext.lineCap = brush.style;
    this.drawContext.strokeStyle = brush.color;

    this.isDrawing = true;
  }

  private stopDrawing(): void {
    this.isDrawing = false;
  }

  private drawLine(pointA: IPoint, pointB: IPoint): void {
    if (!this.drawContext) { return; }

    this.drawContext.beginPath();

    if (pointA && pointB) {
      this.drawContext.moveTo(pointA.x, pointA.y);
      this.drawContext.lineTo(pointB.x, pointB.y);
      this.drawContext.stroke();
    }
  }
}
