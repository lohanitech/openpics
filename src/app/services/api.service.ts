import { Injectable } from '@angular/core';
import { UnsplashApiService } from './unsplash-api.service';
import { FreerangestockApiService } from './freerangestock-api.service';
import { PixabayApiService } from './pixabay-api.service';
import { TumblrApiService } from './tumblr-api.service';
import { PicStore } from './pic-store/pic-store';

@Injectable()
export class ApiService {

  constructor(public unsplash:UnsplashApiService, public pixabay:PixabayApiService, public tumblr:TumblrApiService, public freerangestock:FreerangestockApiService, public picStore: PicStore) {

  }
  getRecentPics(){
    this.picStore.initPics();
    this.unsplash.searching=false;
    this.unsplash.getRecentPics();
    this.pixabay.searching = false;
    this.pixabay.getRecentPics();
    this.tumblr.searching = false;
    this.tumblr.getRecentPics();
  }
  search(query){
    this.picStore.initPics();
    
    this.freerangestock.setQuery(query);
    this.freerangestock.search();

    this.tumblr.searching = true;
    this.tumblr.setQuery(query);
    this.tumblr.search();

    this.unsplash.setQuery(query);
    this.unsplash.searching=true;
    this.unsplash.search();

    this.pixabay.searching = true;
    this.pixabay.setQuery(query);
    this.pixabay.search()
  }
  nextPage(){
    if(!this.tumblr.loading){
      this.tumblr.nextPage();
    }
    if(!this.pixabay.loading){
      this.pixabay.nextPage();
    }
    if(!this.unsplash.loading){
      this.unsplash.nextPage();
    }
  }

}
