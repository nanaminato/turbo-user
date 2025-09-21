import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {MediaModule} from "../pages/multi-media-center/media.module";
import {VideoModule} from "../pages/videoStudio/video.module";

const routes: Routes = [
  {
    path: "", pathMatch: "full", redirectTo: "/chat",
  },
  {
    path: "chat", loadChildren: () => import("../pages/chat.module").then(m=>m.ChatModule)
  },
  {
    path: "image-studio", loadChildren: ()=> import('../pages/imageStudio/image.module')
      .then(m=>m.ImageModule)
  },
  {
    path: "video-studio", loadChildren:()=> import("../pages/videoStudio/video.module")
      .then(m=>VideoModule)
  },
  {
    path: "media-studio",
    loadChildren: ()=>import("../pages/multi-media-center/media.module")
      .then(m=>MediaModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
