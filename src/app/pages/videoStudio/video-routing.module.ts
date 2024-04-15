import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: "",loadComponent: ()=> import("./top-video/top-video.component")
      .then(c=>c.TopVideoComponent),
    children: [
      {
        path: "",
        pathMatch:"full",
        redirectTo:"novita-text2video",

      },
      {
        path: 'novita-text2video',
        loadComponent: ()=>import("./novita-text2-video/novita-text2-video.component")
          .then(c=>c.NovitaText2VideoComponent)
      },
      {
        path: "task-lib",
        loadComponent: ()=> import("../imageStudio/task-lib/task-lib.component")
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
export class VideoRoutingModule{

}
