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
  private isDrawing = false;

  constructor(private brushService: BrushService) { }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    console.log('window resize');
  }

  public ngOnInit() {
  }

  public ngAfterViewInit() {
    const canvasElement = this.canvas.nativeElement;
    this.drawContext = canvasElement.getContext('2d');

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    this.registerEvents(canvasElement);
  }

  private registerEvents(canvasElement: HTMLCanvasElement): void {
    let pointA: IPoint;
    let pointB: IPoint;
    const rect = canvasElement.getBoundingClientRect();

    document.addEventListener('pointerdown', (event) => {
      pointA = new Point(event.clientX - rect.left, event.clientY - rect.top);
      pointB = pointA;
      this.startDrawing();
      this.drawLine(pointA, pointB);
    });
    
    document.addEventListener('pointermove', (event) => {
      if (this.isDrawing) {
        pointB = new Point(event.clientX - rect.left, event.clientY - rect.top);
        this.drawLine(pointA, pointB);
        pointA = pointB;
      }
    });

    ['pointerup'].forEach((eventName) => {
      document.addEventListener(eventName, (event: PointerEvent) => {
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
