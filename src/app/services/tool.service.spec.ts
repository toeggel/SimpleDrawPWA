import { TestBed, inject } from '@angular/core/testing';

import { ToolService } from './tool.service';

describe('ToolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToolService]
    });
  });

  it('should be created', inject([ToolService], (service: ToolService) => {
    expect(service).toBeTruthy();
  }));

  describe('getActiveTool', () => {
    it('returns brush by default', inject([ToolService], (service: ToolService) => {
      const sut = new ToolService();
      const defaultTool = sut.getActiveTool();
      expect(defaultTool.constructor.name).toBe('Brush');
    }));
  });
});
