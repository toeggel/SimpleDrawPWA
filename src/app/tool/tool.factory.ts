import { ToolType, ITool } from '../models/tool';
import { Brush } from '../models/brush';
import { Eraser } from '../models/eraser';

export class ToolFactory {
  static createTool(toolType: ToolType): ITool {
    switch (toolType) {
      case ToolType.Brush:
        return new Brush();
      case ToolType.Eraser:
        return new Eraser();
      default:
        return new Brush();
    }
  }
}
