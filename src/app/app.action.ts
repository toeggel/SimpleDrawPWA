import { Action } from '@ngrx/store';
import { DrawingPartAction } from './app.store';
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

export class AddDrawingPartAction implements Action {
  static readonly TYPE = 'ADD_DRAWING_PART';
  readonly type = AddDrawingPartAction.TYPE;

  constructor(public drawingPart: DrawingPartAction) { }
}

export type DrawAction
  = SwitchToolAction
  | ChangeToolSizeAction
  | ChangeToolColorAction
  | AddDrawingPartAction;
