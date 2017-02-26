import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import { PicStore } from './pic-store/pic-store';
import { Pic } from './pic-store/pic';
import { SOURCES } from './sources';
import { ApiKeys } from './api-keys';

@Injectable()
export class UnsplashApiService {
  application_id :string = ApiKeys.unsplash;
  url: string = 'https://api.unsplash.com';
  page:number=1;
  totalPages:number=1;
  loading:boolean=false;
  query:string;
  perPage:number = 20;
  searching = false;
  cache = {};
  constructor(public http: Http, public picStore: PicStore) {}
  nextPage(){
    if(!this.loading){
      this.loading=true;
      this.page++;
      if(this.searching){
        this.search();
      }else{
        this.getRecentPics();
      }
    }
    return
  }
  setQuery(query){
    // this.query = encodeURIComponent(query).replace(/%20/g, "+");
    this.query = query;
  }
  search(){
    this.perPage = 20;
    if(this.page > this.totalPages){
      return true;
    }
    this.loading=true;
    let param={
      query:this.query,
      per_page:this.perPage,
      page:this.page
    }
    this.getPics('search/photos',param);
  }
  getRecentPics(){
    this.perPage = 5;
    this.loading = true;
    let param={
      per_page:this.perPage,
      page:this.page
    }
    this.getPics('photos',param);
  }
  makePics(unsplashpics: any){
    let pics = (<Pic[]>(unsplashpics)).map((pic:any)=>
      new Pic({
          thumbnailUrl: pic.urls.small,
          previewUrl: pic.urls.regular,
          description: "",
          fullUrl: pic.urls.full,
          author: {name: pic.user.name, url: pic.user.links.html, avatar: pic.user.profile_image.large, id: pic.user.id},
          source: SOURCES.unsplash,
          licenseId: SOURCES.unsplash.license,
          primaryColor: pic.color,
          foundAt: pic.links.html
      })
  );
  return pics;
  }
  getPics(endpoint,params){
    var url = this.url + '/' + endpoint;
    var cacheUrl = url+ JSON.stringify(params).replace(/"/g,"");
    this.get(endpoint,params).subscribe((result)=>{
      this.cache[cacheUrl] = result;
      this.totalPages = result.total_pages;
      if(endpoint==='photos'){
        this.picStore.addPics(this.makePics(result));
      }else{
        this.picStore.addPics(this.makePics(result.results));
      }
      this.loading=false;
    })
  }
  get(endpoint: string, params?: any, options?: RequestOptions) {
    var url = this.url + '/' + endpoint;
    if(params){
      var cacheUrl = url+ JSON.stringify(params).replace(/"/g,"");
    }else{
      var cacheUrl = url;
    }
    if (!options) {
      options = new RequestOptions();
    }

    // Support easy query params for GET requests
    params.client_id=this.application_id;
    if (params) {
      let p = new URLSearchParams();
      for(let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    if(this.cache[cacheUrl]){
      console.log('cache available');
      return Observable.of(this.cache[cacheUrl]);
    }else{
      return this.http.get(this.url + '/' + endpoint, options).map(res => res.json());
    }
  }

}
