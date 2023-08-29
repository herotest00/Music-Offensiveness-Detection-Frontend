import { TestBed } from '@angular/core/testing';

import { OffensivenessService } from './offensiveness-service.service';

describe('ServiceService', () => {
  let service: OffensivenessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffensivenessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
