import {Component, } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {AccountLabel} from "../../accounts/account-label/account-label";
import {NgTemplateOutlet} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-top-video',
  templateUrl: './top-video.html',
  styleUrls: ['./top-video.scss'],
  standalone: true,
  imports:
    [
      RouterOutlet,
      AccountLabel,
      NgTemplateOutlet,
      NzButtonComponent,
      NzSkeletonComponent,
      NzWaveDirective,
      RouterLink,
      TranslatePipe
    ]
})
export class TopVideo {

}
