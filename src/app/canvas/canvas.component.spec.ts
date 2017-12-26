import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';
import { MockComponent } from '../../testing/mock-component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { CanvasComponent } from './canvas.component';
import { ToolService } from '../services/tool.service';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(async(() => {
    this.toolServiceMock = jasmine.createSpyObj<ToolService>(ToolService.name, ['getActiveTool']);

    TestBed.configureTestingModule({
      declarations: [CanvasComponent, MockComponent(ContextMenuComponent)],
      imports: [MaterialModule, FormsModule],
      providers: [{ provide: ToolService, useValue: this.toolServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});