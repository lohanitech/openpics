import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { PicStore } from './pic-store/pic-store';
import { Pic } from './pic-store/pic';
import { SOURCES } from './sources';
import { ApiKeys } from './api-keys';

@Injectable()
export class TumblrApiService {
  key: string = ApiKeys.tumblr;
  url = 'https://api.tumblr.com/v2';

  tumblrBlogs: any = [
    {url: 'startupstockphotos.com', totalPages: 1, loading:false}, 
    {url: 'jaymantri.com', totalPages: 1, loading:false}, 
    {url: 'nos.twnsnd.co', totalPages: 1, loading:false}, 
    {url: 'moveast.me', totalPages: 1, loading:false}, 
    {url: 'fancycrave.tumblr.com', totalPages: 1, loading:false}, 
    {url: 'realisticshots.com', totalPages: 1, loading:false}, 
    {url: 'littlevisuals.co', totalPages: 1, loading:false}, 
    {url: 'snapwiresnaps.tumblr.com', totalPages: 1, loading:false}, 
    {url: 'crowthestone.tumblr.com', totalPages: 1, loading:false}, 
    {url: 'travelcoffeebook.com', totalPages: 1, loading:false}, 
    {url: 'epicantus.tumblr.com', totalPages: 1, loading:false}, 
    {url: 'martinvorel.tumblr.com', totalPages: 1, loading:false}, 
    {url: 'semi-recta.tumblr.com', totalPages: 1, loading:false}, 
    {url: 'lookingglassfreephotos.tumblr.com', totalPages: 1, loading:false}, 
    {url: 'getrefe.tumblr.com', totalPages: 1, loading:false}
  ]

  loading: boolean = false;
  page: number = 1;
  totalPages:number = 1;
  limit:number = 20;
  query:string;
  searching: boolean = false;

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
    this.limit = 20;
    this.loading=true;
    let param={
      tag:this.query,
      offset:((this.page-1)*this.limit),
      limit: this.limit
    }
    this.getPics(param);
  }
  getRecentPics(){
    this.limit=8;
    this.loading=true;
    let param={
      offset:((this.page-1)*this.limit),
      limit:this.limit
    }
    this.getPics(param);
  }
  
  makePics(tumblrpics: any){
      let pics = (<Pic[]>(tumblrpics)).map((pic:any)=>{
          let fullUrl;
          let author;
          var parser = new DOMParser();
          var elements = parser.parseFromString(pic.caption,"text/html");
          var a = elements.getElementsByTagName('a');
          switch(pic.blog_name){
              case "startupstockphotos":
              case "littlevisuals-blog":
              case "epicantus":
                  fullUrl = pic.link_url;
                  break;
              case "realisticshots":
                  fullUrl = pic.link_url;
                  if(a[0]){
                    author = {
                        name: a[0].innerText,
                        url: a[0].getAttribute('href')
                    }
                  }
                  break;
              case "fancycrave":
                  if(a[0]){
                    fullUrl = a[0].getAttribute('href');
                  }
                  if(a[1]){

                    author = {
                        name: a[1].innerText,
                        url: a[1].getAttribute('href')
                    }
                  }
                  break;
              case "newoldstockphotos":
              case "amantri":
              case "crowthestone":
                  if(a[0]){
                    fullUrl = a[0].getAttribute('href');
                  }
                  break;
              case "travelcoffeebook":
                  if(a[1]){
                    fullUrl = a[1].getAttribute('href');
                  }
                  break;
              case "snapwiresnaps":
                  if(a[2]){
                    fullUrl = a[2].getAttribute('href');
                  }
                  if(a[0]){
                    author = {
                        name: a[0].innerText,
                        url: a[0].getAttribute('href')
                    }
                  }
                  break;
              case "getrefe":
              default:
                  fullUrl = pic.photos[0].original_size.url;

          }
          if(fullUrl===null){
              fullUrl = pic.photos[0].original_size.url;
          }
          return new Pic({
              thumbnailUrl: pic.photos[0].alt_sizes[2].url,
              previewUrl: pic.photos[0].alt_sizes[1].url,
              description: pic.caption,
              fullUrl: fullUrl,
              author: {name: pic.blog_name, url:"https://"+pic.blog_name +".tumblr.com"},
              source: SOURCES[pic.blog_name],
              licenseId: SOURCES[pic.blog_name].license,
              primaryColor: pic.recommended_color,
              foundAt: pic.post_url
          })
      });
      return pics;
    }

  getPics(param){
    this.tumblrBlogs.forEach(blog => {
      if(blog.totalPages >= this.page && !blog.loading){
        blog.loading=true;
        this.get('blog/'+blog.url+'/posts/photo',param).subscribe(result=>{
          blog.totalPages = Math.ceil(result.response.total_posts / 20);
          console.log("tumblr: ",result, blog.totalPages);
          this.picStore.addPics(this.makePics(result.response.posts));
          blog.loading = false;
          this.loading = false;
        })
      }
    });
  }
    
  get(endpoint: string, params ? : any, options ? : RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    // Support easy query params for GET requests
    params.api_key = this.key;
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    return this.http.get(this.url + '/' + endpoint, options).map(res => res.json());
  }
}
