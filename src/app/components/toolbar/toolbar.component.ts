import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalStore } from '../../services/local-store';
import { ApiService } from '../../services/api.service';
import { PicStore } from '../../services/pic-store/pic-store';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() search = new EventEmitter();
  query: string;
  showSidebar:boolean;
  deleteConfirm: string = '';
  constructor(public store: LocalStore, private api: ApiService, private picStore: PicStore) {
    store.showSidebar.subscribe(show=>this.showSidebar = show);
   }

  ngOnInit() {
  }
  searchClicked(event) {
    this.search.emit({ event: event, query: this.query });
    
  }
  toggleSidebar(){
    this.store.updateSidebarVisibility(!this.showSidebar);
  }
  homeClicked($event){
    this.api.getRecentPics();
  }
  nextPage(){
    this.api.nextPage();
  }
  prevPage(){
    this.api.prevPage();
  }
  showDeleteCollection(){
    return (this.picStore.selectedCollection != null) && this.picStore.selectedCollection != 'Favourite';
  }
  deleteCollection(confirmed?:boolean){
    if(confirmed){
      this.store.removeCollection(this.picStore.selectedCollection);
      this.deleteConfirm = '';
      this.picStore.initPics();
    }else{
      this.deleteConfirm = 'is-active'
    }
  }
}
