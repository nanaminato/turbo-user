import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: "",loadComponent: ()=> import("./top-media/top-media.component")
      .then(c=>c.TopMediaComponent),
    children: [
      {
        path: "",
        pathMatch:"full",
        redirectTo:"openai-text-to-speech",
      },
      {
        path: "openai-text-to-speech",
        loadComponent: ()=>import("./openai-text-to-speech/openai-text-to-speech.component")
          .then(c=>c.OpenaiTextToSpeechComponent)
      },
      {
        path: "openai-speech-to-text",
        loadComponent: ()=> import("./openai-speech-to-text/openai-speech-to-text.component")
          .then(c=>c.OpenaiSpeechToTextComponent)
      },
      {
        path: "media-extractor",
        loadComponent: ()=>import("./media-extractor/media-extractor.component")
          .then(c=>c.MediaExtractorComponent)
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
