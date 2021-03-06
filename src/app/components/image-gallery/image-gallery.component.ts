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
  isActive='';
  showAddToAlbum='';
  collections:any;
  constructor(public api: ApiService, public electron:ElectronService, public picStore: PicStore, public store: LocalStore){
    store.showSidebar.subscribe(show=>{
      this.fullWidth = (show)?'':'full-width';
    })
    picStore.pics$.subscribe(pics=>{
      this.pics = pics;
      console.log(this.pics);
      this.scrollComplete = true;
    })
    store.collections.subscribe(collections=>this.collections = collections.collections);
  }
  nextPage(){
    this.api.nextPage();
  }
  prevPage(){
    this.api.prevPage();
  }
  ngOnInit() {
    
  }
  select(pic:any){
    this.picStore.selectedPic = pic;
    this.toggleViewer();
  }

  search(event){
    this.api.search(event.query);
  }
  openExternal(event){
    event.preventDefault();
    this.electron.openExternal(event.target.href);
  }
  trackPic(index,pic){
    return pic ? pic.foundAt : undefined;
  }
  toggleViewer(){
    this.isActive = (this.isActive === '')?'is-active':'';
  }

  addToFavourite(pic){
    this.store.addPicToCollection(pic,LocalStore.KEY_FAVOURITE)
  }
  toggleAddToAlbum(pic){
    this.picStore.selectedPic = pic;
    this.showAddToAlbum = (this.showAddToAlbum === '')?'is-active':'';
  }
  addToAlbum(pic,album){
    this.store.addPicToCollection(pic,album);
    this.toggleAddToAlbum(pic);
  }
  removeFromAlbum(pic,album){
    this.store.removeFromCollection(pic,album);
    this.toggleAddToAlbum(pic);
  }
  removeFromFavourite(pic){
    this.store.removeFromCollection(pic, LocalStore.KEY_FAVOURITE);
  }
  isFavourite(pic){
    return this.store.isInCollection(pic,LocalStore.KEY_FAVOURITE);
  }
  isInCollection(pic,album){
    return this.store.isInCollection(pic, album);
  }
}
