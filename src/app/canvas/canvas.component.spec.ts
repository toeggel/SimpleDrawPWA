import { Brush } from '../models/brush';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MockComponent } from 'mock-component';

import { MaterialModule } from '../material/material.module';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { CanvasComponent } from './canvas.component';
import { AppStore } from '../app.store';
import { Observable } from 'rxjs/Observable';
import { ToolOptions } from '../models/tool';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(async(() => {
    // this.toolServiceMock = jasmine.createSpyObj<ToolService>(ToolService.name, ['getActiveTool']);
    this.appStoreMock = { tool$: Observable.of(new Brush(new ToolOptions())) };

    TestBed.configureTestingModule({
      declarations: [CanvasComponent, MockComponent(ContextMenuComponent)],
      imports: [MaterialModule, FormsModule],
      providers: [{ provide: AppStore, useValue: this.appStoreMock }]
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
