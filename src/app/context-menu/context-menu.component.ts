import { BrushService } from './../services/brush.service';
import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  public isSliding = false;
  public isBrushActive = true;
  public paletteActive = false;

  private _isErasing: boolean;
  private _brushSize: number;
  private brushTimer;

  constructor(private brushService: BrushService) {
    this._brushSize = this.brushService.getBrush().size;
  }

  ngOnInit() {
  }

  public set isErasing(value: boolean) {
    this._isErasing = value;
    this.brushService.changeColor(this._isErasing ? '#ffffff' : '#000000');
  }

  public get isErasing(): boolean {
    return this._isErasing;
  }

  public set brushSize(value: number) {
    this._brushSize = value;
    this.brushService.changeBrushSize(value);
  }

  public get brushSize(): number {
    return this._brushSize;
  }

  public onSliderMove(event: MatSliderChange) {
    this.brushSize = event.value;
  }

  public toggleBrush() {
    if (this.brushTimer) {
      this.stopBrushTimer();
    } else {
      this.isSliding = !this.isSliding;
    }
  }

  public showBrush() {
    this.stopBrushTimer();
    this.isSliding = true;
    this.startBrushTimer();
  }

  private startBrushTimer() {
    this.brushTimer = setTimeout(() => {
      this.isSliding = false;
      this.brushTimer = null;
    }, 1000);
  }

  private stopBrushTimer() {
    clearTimeout(this.brushTimer);
    this.brushTimer = null;
  }
}
