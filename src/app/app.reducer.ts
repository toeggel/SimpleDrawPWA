import { State, ActionReducerMap, Action } from '@ngrx/store';

import { DrawAction, SwitchToolAction, ChangeToolColorAction, ChangeToolSizeAction, AddDrawingPartAction } from './app.action';
import { AppState, DrawStyle, DrawOptions, DrawCompositionType, DrawingPart } from './app.store';
import { ToolType } from './models/toolType';

export const appReducers: ActionReducerMap<AppState> = {
  drawOptions: drawOptionsReducer,
  drawing: drawingReducer
};

const initialAppState: DrawOptions = {
  activeTool: ToolType.Brush,
  size: 4,
  color: '#000000',
  style: DrawStyle.Round,
  compositionType: DrawCompositionType.Default
};

export function drawOptionsReducer(state: DrawOptions = initialAppState, action: DrawAction): DrawOptions {
  switch (action.type) {

    case SwitchToolAction.TYPE:
      const toolType: ToolType = (<SwitchToolAction>action).toolType;
      return {
        ...state,
        activeTool: toolType,
        compositionType: toolType === ToolType.Eraser ? DrawCompositionType.Erase : DrawCompositionType.Default
      };

    case ChangeToolSizeAction.TYPE:
      const size: number = (<ChangeToolSizeAction>action).size;
      return {
        ...state,
        size: size
      };

    case ChangeToolColorAction.TYPE:
      const color: string = (<ChangeToolColorAction>action).color;
      return {
        ...state,
        color: color
      };

    default:
      return state;
  }
}

export function drawingReducer(state: DrawingPart[] = [], action: DrawAction): DrawingPart[] {
  switch (action.type) {

    case AddDrawingPartAction.TYPE:
      const drawingPart: DrawingPart = (<AddDrawingPartAction>action).drawingPart;
      return [...state, drawingPart];

    default:
      return state;
  }
}
