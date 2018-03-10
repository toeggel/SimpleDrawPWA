import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ITool, ToolType, ToolOptions } from '../models/tool';
import { Brush } from '../models/brush';
import { Eraser } from '../models/eraser';
import { AppState } from '../app.store';
import { SwitchToolAction } from '../app.action';

@Injectable()
export class ToolService {
  private activeTool: ITool;

  constructor(private store: Store<AppState>) {
    this.activeTool = new Brush(new ToolOptions());
  }

  public getActiveTool(): ITool {
    return this.activeTool;
  }

  public selectTool(toolType: ToolType): void {

    switch (toolType) {
      case ToolType.Brush:
        this.activeTool = new Brush(this.activeTool.toolOptions);
        break;
      case ToolType.Eraser:
        this.activeTool = new Eraser(this.activeTool.toolOptions);
        break;
      default:
        break;
    }

    this.store.dispatch(new SwitchToolAction(this.activeTool));
  }

  public isActiveTool(toolType: ToolType): boolean {
    switch (toolType) {
      case ToolType.Brush:
        return this.activeTool.constructor.name === Brush.name;
      case ToolType.Eraser:
        return this.activeTool.constructor.name === Eraser.name;
      default:
        return false;
    }
  }
}
