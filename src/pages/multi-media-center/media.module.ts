import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoRoutingModule} from "../videoStudio/video-routing.module";
import {MediaRoutingModule} from "./media-routing.module";



@NgModule({
  declarations: [],
  imports: [
    MediaRoutingModule
  ]
})
export class MediaModule { }
