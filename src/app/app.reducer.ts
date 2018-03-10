import { Action } from '@ngrx/store';

import { ToolAction, SwitchToolAction } from './app.action';
import { ToolState, AppState } from './app.store';
import { Brush } from './models/brush';
import { ToolType } from './models/tool';

export const appState = {
  tool: toolReducer
};

const initialToolState: ToolState = {
  type: ToolType.Brush,
  options: {
    toolSize: 4,
    toolColor: '#000000'
  }
};

export function toolReducer(state: ToolState = initialToolState, action: ToolAction): ToolState {
  switch (action.type) {

    case SwitchToolAction.TYPE:
      const switchToolAction: SwitchToolAction = <SwitchToolAction>action;
      return {
        ...state,
        type: switchToolAction.tool.type,
        options: switchToolAction.tool.toolOptions
      };

    default:
      return state;
  }
}
