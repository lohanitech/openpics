import { Injectable } from '@angular/core';
import {  Http, URLSearchParams, RequestOptions } from '@angular/http';
import {Observable} from "rxjs/Observable";
import { PicStore } from './pic-store/pic-store';
import { Pic } from './pic-store/pic';
import { SOURCES } from './sources';
import { ApiKeys } from './api-keys';

@Injectable()
export class PixabayApiService {
  key: string = ApiKeys.pixabay;
  url: string = 'https://pixabay.com/api';
  loading: boolean = false;
  page: number = 1;
  totalPages:number = 1;
  perPage:number=20;
  query:string;
  cache = {};
  searching:boolean = false;

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

  prevPage(){
    if(this.loading) return;
    if(this.page == 1) return;
    this.loading = true;
    this.page--;
    (this.searching)?this.search():this.getRecentPics();
  }

  setQuery(query){
    this.query = encodeURIComponent(query).replace(/%20/g, "+");
  }
  search(){
    this.perPage = 20;
    if(this.page > this.totalPages){
      return true;
    }
    this.loading=true;
    let param={
      q:this.query,
      page:this.page,
      per_page: this.perPage
    }
    this.getPics('',param);
  }
  getRecentPics(){
    this.perPage=5;
    this.loading=true;
    var param={
      page: this.page,
      per_page: this.perPage
    }
    this.getPics('',param);
  }
  getPics(endpoint,params){
    var url = this.url + '/' + endpoint;
    var cacheUrl = url+ JSON.stringify(params).replace(/"/g,"");
    this.get(endpoint,params).subscribe(result=>{
      this.cache[cacheUrl] = result;
      this.totalPages = Math.ceil(result.totalHits/20);
      if(this.totalPages < 1){
        this.totalPages = 1;
      }
      this.picStore.addPics(this.makePics(result.hits));
      this.loading=false;
    });
  }
  makePics(pixabaypics: any){
      let pics = (<Pic[]>(pixabaypics)).map((pic:any)=>
          new Pic({
              thumbnailUrl: pic.webformatURL,
              previewUrl: pic.largeImageURL,
              description: "",
              fullUrl: pic.fullHDURL,
              author: {name: pic.user, url: SOURCES.pixabay.url+"/en/users/"+pic.user, avatar: pic.userImageURL, id: pic.user_id},
              source: SOURCES.pixabay,
              licenseId: SOURCES.pixabay.license,
              primaryColor: null,
              foundAt: SOURCES.pixabay.url+"/goto/"+pic.id_hash
          })
      );
      return pics;
    }

  get(endpoint: string, params ? : any, options ? : RequestOptions) {
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
    params.key = this.key;
    params.response_group = "high_resolution";
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
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
