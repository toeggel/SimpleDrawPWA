import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MockComponent } from 'mock-component';

import { MaterialModule } from '../material/material.module';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { CanvasComponent } from './canvas.component';
import { AppStore, DrawOptions } from '../app.store';
import { Observable } from 'rxjs/Observable';
import { ToolType } from '../models/toolType';
import { BrushComponent } from '../brush/brush.component';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(
    async(() => {
      this.appStoreMock = {
        drawing$: Observable.of({ current: [], future: [] }),
        drawContext$: Observable.of({ size: 4, color: '#ffffff' }),
        tool$: Observable.of({ type: ToolType.Brush })
      };

      TestBed.configureTestingModule({
        declarations: [
          CanvasComponent,
          MockComponent(ContextMenuComponent),
          MockComponent(BrushComponent)
        ],
        imports: [MaterialModule, FormsModule],
        providers: [{ provide: AppStore, useValue: this.appStoreMock }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
