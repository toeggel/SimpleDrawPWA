import { State, ActionReducerMap, Action } from '@ngrx/store';

import { ToolAction, SwitchToolAction, ChangeToolColorAction, ChangeToolSizeAction } from './app.action';
import { DrawState, AppState, DrawStyle, DrawOptions, DrawCompositionType } from './app.store';
import { Brush } from './models/brush';
import { ToolType, ITool } from './models/tool';

export const appReducers: ActionReducerMap<AppState> = {
  drawState: drawReducer,
};

const initialToolState: DrawState = {
  activeTool: ToolType.Brush,
  drawOptions: {
    size: 4,
    color: '#000000',
    style: DrawStyle.Round,
    compositionType: DrawCompositionType.Default
  },
};

export function drawReducer(state: DrawState = initialToolState, action: ToolAction): DrawState {
  switch (action.type) {

    case SwitchToolAction.TYPE:
      const toolType: ToolType = (<SwitchToolAction>action).toolType;
      return {
        ...state,
        activeTool: toolType,
        drawOptions: {
          ...state.drawOptions,
          compositionType: toolType === ToolType.Eraser ? DrawCompositionType.Erase : DrawCompositionType.Default
        }
      };

    case ChangeToolSizeAction.TYPE:
      const size: number = (<ChangeToolSizeAction>action).size;
      return {
        ...state,
        drawOptions: {
          ...state.drawOptions,
          size: size
        }
      };

    case ChangeToolColorAction.TYPE:
      const color: string = (<ChangeToolColorAction>action).color;
      return {
        ...state,
        drawOptions: {
          ...state.drawOptions,
          color: color
        }
      };

    default:
      return state;
  }
}
