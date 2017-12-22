import { BrushService } from './../services/brush.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  private _value: number;
  constructor(private brushService: BrushService) {
    this.value = this.brushService.getBrush().size;
  }

  ngOnInit() {
  }

  public set value(value: number) {
    this._value = value;
    let brush = this.brushService.getBrush();
    brush.size = value;
    this.brushService.updateBrush(brush);
  }

  public get value() {
    return this._value;
  }


}
