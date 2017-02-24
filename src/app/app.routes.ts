import {RouterModule,Routes} from "@angular/router";
import {ImageViewerComponent} from "./components/image-viewer/image-viewer.component";
import { ImageGalleryComponent } from "./components/image-gallery/image-gallery.component";
const appRoutes: Routes = [
  {path: '', component: ImageGalleryComponent},
  {path:'view', component:ImageViewerComponent}
  ];
export const routing = RouterModule.forRoot(appRoutes,{useHash: true});
