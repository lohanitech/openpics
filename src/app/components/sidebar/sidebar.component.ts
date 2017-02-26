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
  downloadPath;
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
    this.picStore.initCollectionPics(this.collections[collection.toLowerCase()]);
  }
  toggleSettings(){
    this.isActive = (this.isActive === '')?'is-active':'';
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
