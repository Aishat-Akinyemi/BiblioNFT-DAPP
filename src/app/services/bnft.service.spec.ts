import { TestBed } from '@angular/core/testing';

import { BnftService } from './bnft.service';

describe('BnftService', () => {
  let service: BnftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BnftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
