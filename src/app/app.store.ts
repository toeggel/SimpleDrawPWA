import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ToolType, ToolOptions, ITool } from './models/tool';
import { ToolFactory } from './tool/tool.factory';
import { SwitchToolAction, ChangeToolColorAction, ChangeToolSizeAction } from './app.action';

export interface AppState {
  drawState: DrawState;
}

export interface DrawState {
  activeTool: ToolType;
  drawOptions: DrawOptions;
}

export interface DrawOptions {
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

  get tool$(): Observable<ITool> {
    return this.select(state => ToolFactory.createTool(
      state.toolType,
      {
        toolColor: state.drawOptions.hexColor,
        toolSize: state.drawOptions.size
      }));
  }

  get drawContext$(): Observable<DrawOptions> {
    return this.select(state => state.drawOptions);
  }

  private select<T>(mapFn: (toolState: DrawState) => any): Observable<T> {
    return this.store.select(s => mapFn(s.drawState));
  }
}
