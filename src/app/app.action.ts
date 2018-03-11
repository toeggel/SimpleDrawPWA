import { Action } from '@ngrx/store';
import { Lines } from './app.store';
import { ToolType } from './models/toolType';

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

export class AddLineAction implements Action {
  static readonly TYPE = 'ADD_LINE';
  readonly type = AddLineAction.TYPE;

  constructor(public lines: Lines) { }
}

export type ToolAction
  = SwitchToolAction
  | ChangeToolSizeAction
  | ChangeToolColorAction
  | AddLineAction;
