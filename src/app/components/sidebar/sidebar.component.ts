import { Component, OnInit, NgZone } from '@angular/core';

import { LocalStore } from '../../services/local-store';
import { PicStore } from '../../services/pic-store/pic-store';
import { ElectronService } from '../../services/electron.service';
import { SOURCES } from '../../services/sources';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  sources:any=[];
  collections:any;
  isActive='';
  showAddAlbum='';
  downloadPath;
  albumName;
  constructor(public store:LocalStore, public picStore: PicStore, public electron: ElectronService, public zone: NgZone) {
    for (var key in SOURCES) {
      this.sources.push(SOURCES[key]);
    }
    store.collections.subscribe(collections=>this.collections = collections);
    electron.downloadPath.subscribe(downloadPath=>{
      this.zone.run(()=>{
        this.downloadPath = downloadPath
      })
    });
  }

  ngOnInit() {
  }
  selectCollection(collection){
    this.picStore.initCollectionPics(this.collections[collection.toLowerCase()], collection);
  }
  toggleSettings(){
    this.isActive = (this.isActive === '')?'is-active':'';
  }
  toggleAddAlbum(){
    this.showAddAlbum = (this.showAddAlbum === '')?'is-active':'';
  }
  saveAlbum(){
    if(!this.albumName)return;
    this.store.addCollection(this.albumName);
    this.albumName = null;
    this.toggleAddAlbum();
  }
  changeDownloadPath(){
    this.electron.changeDownloadPath();
  }
  openExternal(event,url){
    event.preventDefault();
    if(url){
      this.electron.openExternal(url);
    }else{
      this.electron.openExternal(event.target.href);
    }
  }
}
