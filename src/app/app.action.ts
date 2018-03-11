import { Action } from '@ngrx/store';
import { ITool, ToolType } from './models/tool';

export class SwitchToolAction implements Action {
  static readonly TYPE = 'TOOL_SWITCH';
  readonly type = SwitchToolAction.TYPE;

  constructor(public toolType: ToolType) { }
}

export class ChangeToolSizeAction implements Action {
  static readonly TYPE = 'TOOL_CHANGE_SIZE';
  readonly type = ChangeToolSizeAction.TYPE;

  constructor(public size: number) { }
}

export class ChangeToolColorAction implements Action {
  static readonly TYPE = 'TOOL_CHANGE_COLOR';
  readonly type = ChangeToolColorAction.TYPE;

  constructor(public color: string) { }
}

export type ToolAction
  = SwitchToolAction
  | ChangeToolSizeAction
  | ChangeToolColorAction;
