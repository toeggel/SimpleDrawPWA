import { State, ActionReducerMap, Action } from '@ngrx/store';

import {
  DrawAction,
  SwitchToolAction,
  ChangeToolColorAction,
  ChangeToolSizeAction,
  AddDrawingPartAction,
  UndoDrawingAction,
  RedoDrawingAction,
  ZoomAction
} from './app.action';
import { AppState, DrawStyle, DrawOptions, DrawCompositionType, DrawingPart, Drawing } from './app.store';
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
  compositionType: DrawCompositionType.Default,
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
      return {
        ...state,
        size: (<ChangeToolSizeAction>action).size
      };

    case ChangeToolColorAction.TYPE:
      return {
        ...state,
        color: (<ChangeToolColorAction>action).color
      };

    default:
      return state;
  }
}

export function drawingReducer(state: Drawing = { current: [], future: [] }, action: DrawAction): Drawing {
  switch (action.type) {

    case UndoDrawingAction.TYPE:
      const undoState = { ...state };
      const undoElement = undoState.current.pop();
      if (!!undoElement) {
        undoState.future.push(undoElement);
      }

      return undoState;

    case RedoDrawingAction.TYPE:
      const redoState = { ...state };
      const redoElement = redoState.future.pop();
      if (!!redoElement) {
        redoState.current.push(redoElement);
      }

      return redoState;

    case AddDrawingPartAction.TYPE:
      const drawingPart: DrawingPart = (<AddDrawingPartAction>action).drawingPart;
      return {
        ...state,
        current: [...state.current, drawingPart],
        future: []
      };

    case ZoomAction.TYPE:
      return {
        ...state,
        current: zoom(state.current, (<ZoomAction>action).zoomFactor),
        future: zoom(state.future, (<ZoomAction>action).zoomFactor)
      };

    default:
      return state;
  }
}

function zoom(parts: DrawingPart[], factor: number) {
  return parts.map(d => {
    return {
      ...d,
      drawOptions: { ...d.drawOptions, size: d.drawOptions.size * factor },
      lines: d.lines.map(l => {
        return {
          ...l,
          pointA: { ...l.pointA, x: l.pointA.x * factor, y: l.pointA.y * factor },
          pointB: { ...l.pointB, x: l.pointB.x * factor, y: l.pointB.y * factor }
        };
      })
    };
  });
}
