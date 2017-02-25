import { Component, OnInit, ElementRef } from '@angular/core';
import { PicStore } from '../../services/pic-store/pic-store';
import { LocalStore } from '../../services/local-store';
import { ApiService } from '../../services/api.service';
import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})

export class ImageGalleryComponent implements OnInit {
  pics: any;
  page:number = 1;
  query:string;
  scrollComplete:boolean = true;
  fullWidth='';
  constructor(public api: ApiService, public electron:ElectronService, public picStore: PicStore, public store: LocalStore, public elementRef:ElementRef){
    store.showSidebar.subscribe(show=>{
      this.fullWidth = (show)?'':'full-width';
    })
    picStore.pics$.subscribe(pics=>{
      this.pics = pics;
      console.log(this.pics);
      this.scrollComplete = true;
    })
  }
  scroll(event){
    var loaderPos = this.elementRef.nativeElement.querySelector('#infinite').offsetTop+this.elementRef.nativeElement.querySelector('#infinite').offsetHeight;
    var scrollBottom = event.target.offsetHeight + event.target.scrollTop;
    if(scrollBottom >= loaderPos){
      if(this.scrollComplete){
        this.scrollComplete=false;
        this.api.nextPage();
      }
    }
  }

  ngOnInit() {
    
  }
  select(pic:any){
    this.picStore.selectedPic = pic;
  }

  search(event){
    this.api.search(event.query);
  }
  openExternal(event){
    event.preventDefault();
    this.electron.openExternal(event.target.href);
  }
}
