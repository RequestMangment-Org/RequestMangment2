import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rquestGuard } from './rquest.guard';

describe('rquestGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rquestGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
