import { Injectable } from '@angular/core';
import { ITool, ToolType, ToolOptions } from '../models/tool';
import { Brush } from '../models/brush';
import { Eraser } from '../models/eraser';

@Injectable()
export class ToolService {
  private activeTool: ITool;

  constructor() {
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
