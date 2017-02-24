import { Component } from '@angular/core';
import { LocalStore } from './services/local-store';
import { ElectronService } from './services/electron.service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showSidebar: boolean;
  fullWidth='';
  constructor(public store: LocalStore, public api:ApiService, public electronS: ElectronService){
    store.showSidebar.subscribe(show=>{
      this.showSidebar = show;
      this.fullWidth = (show)?'':'full-width';
    });
    this.api.getRecentPics();
  }
}
