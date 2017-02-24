/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FreerangestockApiService } from './freerangestock-api.service';

describe('FreerangestockApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FreerangestockApiService]
    });
  });

  it('should ...', inject([FreerangestockApiService], (service: FreerangestockApiService) => {
    expect(service).toBeTruthy();
  }));
});
