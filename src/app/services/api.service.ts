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
    
    this.freerangestock.page = 1;
    this.freerangestock.setQuery(query);
    this.freerangestock.search();

    this.tumblr.page = 1;
    this.tumblr.searching = true;
    this.tumblr.setQuery(query);
    this.tumblr.search();

    this.unsplash.page = 1;
    this.unsplash.setQuery(query);
    this.unsplash.searching=true;
    this.unsplash.search();

    this.pixabay.page = 1;
    this.pixabay.searching = true;
    this.pixabay.setQuery(query);
    this.pixabay.search()
  }
  nextPage(){
    this.picStore.initPics();
    if(!this.tumblr.loading){
      this.tumblr.nextPage();
    }
    if(!this.pixabay.loading){
      this.pixabay.nextPage();
    }
    if(!this.unsplash.loading){
      this.unsplash.nextPage();
    }
    if(!this.freerangestock.loading){
      this.freerangestock.nextPage();
    }
  }
  prevPage(){
    this.picStore.initPics();
    if(!this.tumblr.loading){
      this.tumblr.prevPage();
    }
    if(!this.pixabay.loading){
      this.pixabay.prevPage();
    }
    if(!this.unsplash.loading){
      this.unsplash.prevPage();
    }
    if(!this.freerangestock.loading){
      this.freerangestock.prevPage();
    }
  }
  showPrev(){
    return (this.tumblr.page > 1 || this.pixabay.page > 1 || this.unsplash.page > 1 || this.freerangestock.page > 1);
  }
  showNext(){
    return (this.pixabay.page < this.pixabay.totalPages || this.unsplash.page < this.unsplash.totalPages || this.freerangestock.page < this.freerangestock.totalPages);
  }
  loadComplete(){
    return !(this.tumblr.loading || this.pixabay.loading || this.unsplash.loading || this.freerangestock.loading);
  }
}
