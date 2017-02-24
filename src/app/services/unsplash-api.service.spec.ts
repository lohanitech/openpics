/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnsplashApiService } from './unsplash-api.service';

describe('UnsplashApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnsplashApiService]
    });
  });

  it('should ...', inject([UnsplashApiService], (service: UnsplashApiService) => {
    expect(service).toBeTruthy();
  }));
});
