import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SwitchToolAction, ChangeToolColorAction, ChangeToolSizeAction, AddLineAction } from './app.action';
import { Point } from './models/point';
import { Line } from './models/line';
import { ToolType } from './models/toolType';

export interface AppState {
  drawOptions: DrawOptions;
  drawing: Lines[];
}

export interface Lines {
  drawOptions: DrawOptions;
  lines: Line[];
}

export interface DrawOptions {
  activeTool: ToolType;
  compositionType: DrawCompositionType;
  color: string;
  size: number;
  style: DrawStyle;
}

export enum DrawCompositionType {
  Default = 'source-over',
  Erase = 'destination-out'
}

export enum DrawStyle {
  Round = 'round'
}

@Injectable()
export class AppStore {

  constructor(private store: Store<AppState>) { }

  switchTool(toolType: ToolType) {
    this.store.dispatch(new SwitchToolAction(toolType));
  }

  changeToolColor(color: string) {
    this.store.dispatch(new SwitchToolAction(ToolType.Brush));
    this.store.dispatch(new ChangeToolColorAction(color));
  }

  changeToolSize(size: number) {
    this.store.dispatch(new ChangeToolSizeAction(size));
  }

  addLine(lines: Lines) {
    if (lines.lines.length > 0) {
      this.store.dispatch(new AddLineAction(lines));
    }
  }

  get tool$(): Observable<ToolType> {
    return this.select(state => state.activeTool);
  }

  get drawContext$(): Observable<DrawOptions> {
    return this.select(state => state);
  }

  private select<T>(mapFn: (toolState: DrawOptions) => any): Observable<T> {
    return this.store.select(s => mapFn(s.drawOptions));
  }
}
