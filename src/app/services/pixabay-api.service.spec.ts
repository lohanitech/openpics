/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PixabayApiService } from './pixabay-api.service';

describe('PixabayApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PixabayApiService]
    });
  });

  it('should ...', inject([PixabayApiService], (service: PixabayApiService) => {
    expect(service).toBeTruthy();
  }));
});
