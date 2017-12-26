import { Component, OnInit, HostListener } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { ToolService } from '../services/tool.service';
import { ToolType } from '../models/tool';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  // provide enum values in html template
  public ToolType: typeof ToolType = ToolType;
  public showBrushDisplay = false;

  private brushTimer: NodeJS.Timer;

  public constructor(private toolService: ToolService) { }

  public ngOnInit() { }

  @HostListener('window:wheel', ['$event'])
  public onMouseWheel(event: WheelEvent) {
    this.toolSize = Math.min(Math.max(1, this.toolSize + (event.deltaY > 0 ? 1 : -1)), 50);
  }

  public set toolSize(value: number) {
    this.showBrush();
    this.toolService.getActiveTool().toolOptions.toolSize = value;
  }

  public get toolSize(): number {
    return this.toolService.getActiveTool().toolOptions.toolSize;
  }

  public get toolColor(): string {
    return this.toolService.getActiveTool().toolOptions.toolColor;
  }

  public onBrushClick(): void {
    this.isActiveTool(ToolType.Brush) ? this.selectTool(ToolType.Eraser) : this.selectTool(ToolType.Brush);
  }

  // the mat slider does not detect value change during "sliding" -> hence we have a listener that changes the size while "sliding"
  public onSliderMove(event: MatSliderChange): void {
    this.toolSize = event.value;
  }

  public selectTool(toolType: ToolType): void {
    this.toolService.selectTool(toolType);

    if (toolType === ToolType.Brush || toolType === ToolType.Eraser) {
      this.showBrush();
    }
  }

  public isActiveTool(toolType: ToolType): boolean {
    return this.toolService.isActiveTool(toolType);
  }

  private showBrush(): void {
    this.stopBrushTimer();
    this.showBrushDisplay = true;
    this.startBrushTimer();
  }

  private startBrushTimer(): void {
    this.brushTimer = setTimeout(() => {
      this.showBrushDisplay = false;
      this.brushTimer = null;
    }, 1500);
  }

  private stopBrushTimer(): void {
    clearTimeout(this.brushTimer);
    this.brushTimer = null;
  }
}
