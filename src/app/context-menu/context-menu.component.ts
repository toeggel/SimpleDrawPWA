import { Component, HostListener, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { ToolType, ITool } from '../models/tool';
import { Brush } from '../models/brush';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {

  @Input() color = '#000000';
  @Input() sliderValue = 4;
  @Input() activeTool: ITool = new Brush();

  @Output() toolChange: EventEmitter<ToolType> = new EventEmitter<ToolType>();
  @Output() colorChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() sizeChange: EventEmitter<number> = new EventEmitter<number>();

  // provide enum values in html template
  ToolType: typeof ToolType = ToolType;

  @HostListener('window:wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    const newSize = Math.min(Math.max(1, this.sliderValue + (event.deltaY > 0 ? 1 : -1)), 50);
    this.changeToolSize(newSize);
  }

  changeToolSize(value: number) {
    this.sizeChange.emit(value);
  }

  onBrushClick(): void {
    this.isActiveTool(ToolType.Brush) ? this.selectTool(ToolType.Eraser) : this.selectTool(ToolType.Brush);
  }

  // the mat slider does not detect value change during "sliding" -> hence we have a listener that changes the size while "sliding"
  onSliderMove(event: MatSliderChange): void {
    this.changeToolSize(event.value);
  }

  isActiveTool(toolType: ToolType): boolean {
    return toolType === this.activeTool.type;
  }

  private selectTool(toolType: ToolType): void {
    this.toolChange.emit(toolType);
  }
}
