import {ToolType, ToolOptions} from './models/tool';

export interface AppState {
  tool: ToolState;
}

export interface ToolState {
  type: ToolType;
  options: ToolOptions;
}
