import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import {
  SwitchToolAction,
  ChangeToolColorAction,
  ChangeToolSizeAction,
  AddDrawingPartAction,
  UndoDrawingAction,
  RedoDrawingAction
} from './app.action';
import { Point } from './models/point';
import { Line } from './models/line';
import { ToolType } from './models/toolType';

export interface AppState {
  readonly drawOptions: DrawOptions;
  readonly drawing: Drawing;
}

export interface Drawing {
  readonly current: DrawingPart[];
  readonly future: DrawingPart[];
}

export interface DrawingPart {
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

  undoDrawing(): void {
    this.store.dispatch(new UndoDrawingAction());
  }

  redoDrawing(): void {
    this.store.dispatch(new RedoDrawingAction());
  }

  switchTool(toolType: ToolType): void {
    this.store.dispatch(new SwitchToolAction(toolType));
  }

  changeToolColor(color: string): void {
    this.store.dispatch(new SwitchToolAction(ToolType.Brush));
    this.store.dispatch(new ChangeToolColorAction(color));
  }

  changeToolSize(size: number): void {
    this.store.dispatch(new ChangeToolSizeAction(size));
  }

  addDrawingPart(drawingPart: DrawingPart): void {
    if (drawingPart.lines.length > 0) {
      this.store.dispatch(new AddDrawingPartAction(drawingPart));
    }
  }

  get tool$(): Observable<ToolType> {
    return this.drawingOptions(state => state.activeTool);
  }

  get drawing$(): Observable<DrawingPart[]> {
    return this.drawing(state => state).map(s => s.current);
  }

  get drawContext$(): Observable<DrawOptions> {
    return this.drawingOptions(state => state);
  }

  private drawingOptions<T>(mapFn: (drawOptions: DrawOptions) => T): Observable<T> {
    return this.store.select(s => mapFn(s.drawOptions));
  }

  private drawing<T>(mapFn: (drawing: Drawing) => T): Observable<T> {
    return this.store.select(s => mapFn(s.drawing));
  }
}
