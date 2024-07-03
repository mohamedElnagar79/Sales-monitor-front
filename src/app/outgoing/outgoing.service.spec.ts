import { TestBed } from '@angular/core/testing';

import { OutgoingService } from './outgoing.service';

describe('OutgoingService', () => {
  let service: OutgoingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutgoingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
