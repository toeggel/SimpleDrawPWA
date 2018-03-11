import { Brush } from './brush';
import { ToolType } from './tool';

export class Eraser extends Brush {
  public type: ToolType = ToolType.Eraser;
}
