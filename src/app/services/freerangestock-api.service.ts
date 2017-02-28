import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import { PicStore } from './pic-store/pic-store';
import { Pic } from './pic-store/pic';
import { SOURCES } from './sources';
import { ApiKeys } from './api-keys';

@Injectable()
export class FreerangestockApiService {
  key = ApiKeys.freerangestock;
  url = 'https://freerangestock.com/api.php';

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
        this.loading=false;
      }
    }
    return
  }

  prevPage(){
    if(this.loading) return;
    if(this.page == 1) return;
    this.loading = true;
    this.page--;
    (this.searching)?this.search():this.loading=false;
  }

  setQuery(query){
    this.query = query;
  }
  search(){
    if(this.page > this.totalPages){
      return true;
    }
    this.loading=true;
    let param={
      q:this.query,
      rpp:this.perPage,
      page:this.page
    }
    this.getPics('',param);
  }
  makePics(unsplashpics: any){
    let pics = (<Pic[]>(unsplashpics)).map((pic:any)=>
      new Pic({
          thumbnailUrl: pic.thumbnail_url,
          previewUrl: pic.image_url_medium,
          description: pic.description,
          fullUrl: pic.image_url_large,
          author: {name: SOURCES.freerangestock.name, url: SOURCES.freerangestock.url},
          source: SOURCES.freerangestock,
          licenseId: SOURCES.freerangestock.license,
          primaryColor: '',
          foundAt: pic.web_url
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
      this.picStore.addPics(this.makePics(result.results));
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
    params.key=this.key;
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




  /*Sample output
    {
      "results": [
        {
          "id": "1551",
          "title": "Pretty woman smiles at camera",
          "keywords": "woman, smile, smirk, person, people, brunette, face, eyes, portrait, fit, healthy, happy, adult, cheerful",
          "description": "Attractive caucasian woman looking at camera.",
          "thumbnail_url": "https://freerangestock.com/thumbnail/1509/pretty-woman-smiles-at-camera.jpg",
          "image_url_medium": "https://freerangestock.com/sample/1509/pretty-woman-smiles-at-camera.jpg",
          "image_url_large": "https://freerangestock.com/fullsize//1509/pretty-woman-smiles-at-camera.jpg",
          "web_url": "https://freerangestock.com/photos/1551/pretty-woman-smiles-at-camera.html"
        },
        {
          "id": "1450",
          "title": "Healthy Woman Flexes Muscles",
          "keywords": "woman,fitness,exercise,healthy,flexing,muscular,muscles,silhouette,people,person,torso,fist,arm,hand,back,powerful,yoga",
          "description": "Silhouette of woman flexing biceps",
          "thumbnail_url": "https://freerangestock.com/thumbnail/1408/healthy-woman-flexes-muscles.jpg",
          "image_url_medium": "https://freerangestock.com/sample/1408/healthy-woman-flexes-muscles.jpg",
          "image_url_large": "https://freerangestock.com/fullsize//1408/healthy-woman-flexes-muscles.jpg",
          "web_url": "https://freerangestock.com/photos/1450/healthy-woman-flexes-muscles.html"
        }
      ],
      "rpp": 2,
      "page": 1,
      "total_results": "1043",
      "total_pages": 522
    }

  */
}
