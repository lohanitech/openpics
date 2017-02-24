import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PicStore } from '../../services/pic-store/pic-store';
import { LocalStore } from '../../services/local-store';
import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  pic:any;
  showSidebar:boolean;
  fullWidth = '';
  progress=-1;
  isLoading = '';
  constructor(private zone: NgZone, private picStore: PicStore, private store:LocalStore, private router:Router, public electron: ElectronService) {
    this.pic = picStore.selectedPic;
    store.showSidebar.subscribe(show=>{
      this.fullWidth = (show)?'':'full-width';
      this.showSidebar = show;
    });
    electron.progress.subscribe(progress=>{
      this.zone.run(()=>{
        this.progress=progress; 
      })
    });
    electron.isDownloading.subscribe(loading=>{
      this.zone.run(()=>{
        this.isLoading = loading;
      })
    })
  }

  ngOnInit() {
    if(!this.pic){
      this.router.navigate(['']);
    }else{
      this.isFavourite();
    }
  }
  addToFavourite(){
    this.store.addPicToCollection(this.pic,LocalStore.KEY_FAVOURITE)
  }
  removeFromFavourite(){
    this.store.removeFromCollection(this.pic, LocalStore.KEY_FAVOURITE);
  }
  toggleSidebar(){
    this.store.updateSidebarVisibility(!this.showSidebar);
  }
  isFavourite(){
    return this.store.isInCollection(this.pic,LocalStore.KEY_FAVOURITE);
  }
  openExternal(event){
    event.preventDefault();
    this.electron.openExternal(event.target.href);
  }
}
