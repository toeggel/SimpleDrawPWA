import { Action } from '@ngrx/store';

import { DrawingPart } from './app.store';
import { ToolType } from './models';

export class SwitchToolAction implements Action {
  static readonly TYPE = '[TOOL] SWITCH';
  readonly type = SwitchToolAction.TYPE;

  constructor(public toolType: ToolType) { }
}

export class ChangeToolSizeAction implements Action {
  static readonly TYPE = '[TOOL] CHANGE_SIZE';
  readonly type = ChangeToolSizeAction.TYPE;

  constructor(public size: number) { }
}

export class ChangeToolColorAction implements Action {
  static readonly TYPE = '[TOOL] CHANGE_COLOR';
  readonly type = ChangeToolColorAction.TYPE;

  constructor(public color: string) { }
}

export class AddDrawingPartAction implements Action {
  static readonly TYPE = '[DRAWING_PART] ADD';
  readonly type = AddDrawingPartAction.TYPE;

  constructor(public drawingPart: DrawingPart) { }
}

export class UndoDrawingAction implements Action {
  static readonly TYPE = '[DRAWING_PART] UNDO';
  readonly type = UndoDrawingAction.TYPE;
}

export class RedoDrawingAction implements Action {
  static readonly TYPE = '[DRAWING_PART] REDO';
  readonly type = RedoDrawingAction.TYPE;
}

export class ZoomAction implements Action {
  static readonly TYPE = '[DRAWING] ZOOM';
  readonly type = ZoomAction.TYPE;

  constructor(public zoomFactor) { }
}

export type DrawAction
  = SwitchToolAction
  | ChangeToolSizeAction
  | ChangeToolColorAction
  | AddDrawingPartAction
  | UndoDrawingAction
  | RedoDrawingAction
  | ZoomAction;
