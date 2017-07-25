import { TestBed, inject } from '@angular/core/testing';

import { SectorsService } from './sectors.service';

describe('SectorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectorsService]
    });
  });

  it('should be created', inject([SectorsService], (service: SectorsService) => {
    expect(service).toBeTruthy();
  }));
});
