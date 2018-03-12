import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SwitchToolAction, ChangeToolColorAction, ChangeToolSizeAction, AddDrawingPartAction } from './app.action';
import { Point } from './models/point';
import { Line } from './models/line';
import { ToolType } from './models/toolType';

export interface AppState {
  readonly drawOptions: DrawOptions;
  readonly drawing: DrawingPartAction[];
}

export interface DrawingPartAction {
  readonly drawOptions: DrawOptions;
  readonly lines: Line[];
}

export interface DrawOptions {
  readonly activeTool: ToolType;
  readonly compositionType: DrawCompositionType;
  readonly color: string;
  readonly size: number;
  readonly style: DrawStyle;
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

  addDrawingPart(drawingPart: DrawingPartAction) {
    if (drawingPart.lines.length > 0) {
      this.store.dispatch(new AddDrawingPartAction(drawingPart));
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
