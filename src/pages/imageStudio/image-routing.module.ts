import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: "",loadComponent: ()=> import("./top-image/top-image")
      .then(c=>c.TopImage),
    children: [
      {
        path: "",
        pathMatch:"full",
        redirectTo:"novita-lcm-txt2img",

      },
      {
        path: 'novita-lcm-txt2img',
        loadComponent: ()=>import("./novita-text2-img-lcm/novita-text2-image-lcm")
          .then(c=>c.NovitaText2ImageLcm)
      },
      {
        path: "novita-lcm-img2img",
        loadComponent: ()=> import("./novita-img2-image-lcm/novita-img2-image-lcm")
          .then(c=>c.NovitaImg2ImageLcm)
      },
      {
        path: "novita-txt2img",
        loadComponent: ()=> import("./novita-text2-img/novita-text2-img")
          .then(c=>c.NovitaText2Img)
      },
      {
        path: "novita-img2img",
        loadComponent: ()=> import("./novita-img2-img/novita-img2-img")
          .then(c=>c.NovitaImg2Img)
      },
      {
        path: "dalle",
        loadComponent: ()=> import("./dalle/dalle")
          .then(c=>c.Dalle)
      },
      {
        path: "task-lib",
        loadComponent: ()=> import("./task-lib/task-lib")
          .then(c=>c.TaskLib)
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
