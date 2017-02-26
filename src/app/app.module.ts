import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UnsplashApiService } from './services/unsplash-api.service';
import { TumblrApiService } from './services/tumblr-api.service';
import { PixabayApiService } from './services/pixabay-api.service';
import { FreerangestockApiService } from './services/freerangestock-api.service';
import { ApiService } from './services/api.service';
import { ElectronService } from './services/electron.service';
import { PicStore } from './services/pic-store/pic-store';
import { LocalStore } from './services/local-store';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { LazyLoadDirective } from './directives/lazy-load.directive';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ToolbarComponent,
    ImageViewerComponent,
    ImageGalleryComponent,
    LazyLoadDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [UnsplashApiService, TumblrApiService, PixabayApiService, FreerangestockApiService, ApiService, ElectronService, PicStore, LocalStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
