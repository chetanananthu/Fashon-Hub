import { TestBed } from '@angular/core/testing';

import { SlidebarService } from './slidebar.service';

describe('SlidebarService', () => {
  let service: SlidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
