import { ToolType, ITool, ToolOptions } from '../models/tool';
import { Brush } from '../models/brush';
import { Eraser } from '../models/eraser';

export class ToolFactory {
  static createTool(toolType: ToolType, toolOptions: ToolOptions): ITool {
    switch (toolType) {
      case ToolType.Brush:
        return new Brush(toolOptions);
      case ToolType.Eraser:
        return new Eraser(toolOptions);
      default:
        return new Brush(toolOptions);
    }
  }
}
