import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";
import {NzImageService} from "ng-zorro-antd/image";
import {AccountLabel} from "../../accounts/account-label/account-label";
import {NgTemplateOutlet} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-top-media',
  templateUrl: './top-media.html',
  styleUrls: ['./top-media.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    AccountLabel,
    NgTemplateOutlet,
    NzButtonComponent,
    NzIconDirective,
    NzSkeletonComponent,
    NzWaveDirective,
    RouterLink,
    TranslatePipe,
  ],
  providers: [
    NzImageService
  ]
})
export class TopMedia {

}
