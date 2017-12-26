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
      let sut = new ToolService();
      expect(sut.getActiveTool().constructor.name).toBe('Brush');
    }));
  });
});
