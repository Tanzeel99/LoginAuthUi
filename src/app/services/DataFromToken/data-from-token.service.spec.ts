import { TestBed } from '@angular/core/testing';

import { DataFromTokenService } from './data-from-token.service';

describe('DataFromTokenService', () => {
  let service: DataFromTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFromTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
