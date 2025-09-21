import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: "",loadComponent: ()=> import("./top-video/top-video")
      .then(c=>c.TopVideo),
    children: [
      {
        path: "",
        pathMatch:"full",
        redirectTo:"novita-text2video",

      },
      {
        path: 'novita-text2video',
        loadComponent: ()=>import("./novita-text2-video/novita-text2-video")
          .then(c=>c.NovitaText2Video)
      },
      {
        path: "task-lib",
        loadComponent: ()=> import("../imageStudio/task-lib/task-lib")
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
export class VideoRoutingModule{

}
