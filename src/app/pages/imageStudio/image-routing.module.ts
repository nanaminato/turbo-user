import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: "",loadComponent: ()=> import("./top-image/top-image.component")
      .then(c=>c.TopImageComponent),
    children: [
      {
        path: "",
        pathMatch:"full",
        redirectTo:"novita-lcm-img2img",

      },
      {
        path: 'novita-lcm-txt2img',
        loadComponent: ()=>import("./image-default/novita-text2-image-lcm.component")
          .then(c=>c.NovitaText2ImageLcmComponent)
      },
      {
        path: "novita-lcm-img2img",
        loadComponent: ()=> import("./novita-img2-image-lcm/novita-img2-image-lcm.component")
          .then(c=>c.NovitaImg2ImageLcmComponent)
      },
      {
        path: "novita-txt2img",
        loadComponent: ()=> import("./novita-text2-img/novita-text2-img.component")
          .then(c=>c.NovitaText2ImgComponent)
      },
      {
        path: "novita-img2img",
        loadComponent: ()=> import("./novita-img2-img/novita-img2-img.component")
          .then(c=>c.NovitaImg2ImgComponent)
      },
      {
        path: "task-lib",
        loadComponent: ()=> import("./task-lib/task-lib.component")
          .then(c=>c.TaskLibComponent)
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class ImageRoutingModule{

}
