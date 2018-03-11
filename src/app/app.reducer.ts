import { State, ActionReducerMap, Action } from '@ngrx/store';

import { ToolAction, SwitchToolAction, ChangeToolColorAction, ChangeToolSizeAction } from './app.action';
import { DrawState, AppState, DrawStyle, DrawContextState, DrawCompositionType } from './app.store';
import { Brush } from './models/brush';
import { ToolType, ITool } from './models/tool';

export const appReducers: ActionReducerMap<AppState> = {
  drawState: drawReducer,
};

const initialToolState: DrawState = {
  toolType: ToolType.Brush,
  drawContext: {
    size: 4,
    hexColor: '#000000',
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
        toolType: toolType,
        drawContext: {
          ...state.drawContext,
          compositionType: toolType === ToolType.Eraser ? DrawCompositionType.Erase : DrawCompositionType.Default
        }
      };

    case ChangeToolSizeAction.TYPE:
      const size: number = (<ChangeToolSizeAction>action).size;
      return {
        ...state,
        drawContext: {
          ...state.drawContext,
          size: size
        }
      };

    case ChangeToolColorAction.TYPE:
      const color: string = (<ChangeToolColorAction>action).hexColor;
      return {
        ...state,
        drawContext: {
          ...state.drawContext,
          hexColor: color
        }
      };

    default:
      return state;
  }
}
