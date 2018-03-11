import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ToolType, ToolOptions, ITool } from './models/tool';
import { ToolFactory } from './tool/tool.factory';

export interface AppState {
  tool: ToolState;
}

export interface ToolState {
  type: ToolType;
  toolOptions: ToolOptions;
}


@Injectable()
export class ToolStore {

  constructor(private store: Store<AppState>) { }

  get tool$(): Observable<ITool> {
    return this.select(state => ToolFactory.createTool(state.type, state.toolOptions));
  }

  private select(mapFn: (toolState: ToolState) => ITool): Observable<ITool> {
    return this.store.select(s => mapFn(s.tool));
  }
}
