import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalStore } from '../../services/local-store';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() search = new EventEmitter();
  query: string;
  showSidebar:boolean;
  constructor(public store: LocalStore, private api: ApiService) {
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
}
