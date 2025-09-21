import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: "",loadComponent: ()=> import("./top-media/top-media")
      .then(c=>c.TopMedia),
    children: [
      {
        path: "",
        pathMatch:"full",
        redirectTo:"openai-text-to-speech",
      },
      {
        path: "openai-text-to-speech",
        loadComponent: ()=>import("./openai-text-to-speech/openai-text-to-speech")
          .then(c=>c.OpenaiTextToSpeech)
      },
      {
        path: "openai-speech-to-text",
        loadComponent: ()=> import("./openai-speech-to-text/openai-speech-to-text")
          .then(c=>c.OpenaiSpeechToText)
      },
      {
        path: "media-extractor",
        loadComponent: ()=>import("./media-extractor/media-extractor")
          .then(c=>c.MediaExtractor)
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
export class MediaRoutingModule{

}
