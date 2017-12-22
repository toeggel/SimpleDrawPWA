import { IBrush, BrushStyle } from './../models/brush';
import { Injectable } from '@angular/core';

@Injectable()
export class BrushService {

  private brush: IBrush = {
    size: 4,
    style: BrushStyle.Round,
    color: '#000000'
  };

  constructor() { }

  public getBrush(): IBrush {
    return this.brush;
  }

  public updateBrush(brush: IBrush) {
    this.brush = brush;
  }
}
