import { Action } from '@ngrx/store';
import {ITool, ToolType} from './models/tool';

export class SwitchToolAction implements Action {
  static readonly TYPE = 'TOOL_SWITCH';
  readonly type = SwitchToolAction.TYPE;

  constructor(public tool: ITool) { }
}

export type ToolAction
  = SwitchToolAction;
