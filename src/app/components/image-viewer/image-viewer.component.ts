import { Component, OnInit, Input } from '@angular/core';
import { PicStore } from '../../services/pic-store/pic-store';
import { LocalStore } from '../../services/local-store';
import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  showSidebar:boolean;
  fullWidth = '';
  @Input() pic:any;
  constructor(private picStore: PicStore, private store:LocalStore, public electron: ElectronService) {
  }

  ngOnInit() {
      this.isFavourite();
  }
  addToFavourite(){
    this.store.addPicToCollection(this.pic,LocalStore.KEY_FAVOURITE)
  }
  removeFromFavourite(){
    this.store.removeFromCollection(this.pic, LocalStore.KEY_FAVOURITE);
  }
  isFavourite(){
    return this.store.isInCollection(this.pic,LocalStore.KEY_FAVOURITE);
  }
  openExternal(event){
    event.preventDefault();
    this.electron.openExternal(event.target.href);
  }
}
