import { TestBed, inject } from '@angular/core/testing';

import { StatusServiceService } from './status-service.service';

describe('StatusServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusServiceService]
    });
  });

  it('should be created', inject([StatusServiceService], (service: StatusServiceService) => {
    expect(service).toBeTruthy();
  }));
});
