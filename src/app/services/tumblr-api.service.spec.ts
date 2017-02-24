/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TumblrApiService } from './tumblr-api.service';

describe('TumblrApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TumblrApiService]
    });
  });

  it('should ...', inject([TumblrApiService], (service: TumblrApiService) => {
    expect(service).toBeTruthy();
  }));
});
