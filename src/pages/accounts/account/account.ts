import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzIconModule} from "ng-zorro-antd/icon";
import {IonicModule} from "@ionic/angular";
import {SizeReportService} from "../../../services/normal-services";

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  styleUrl: './account.css',
  imports: [
    RouterOutlet,
    TranslateModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    RouterLink,
    IonicModule
  ],
  standalone: true
})
export class Account {
  sizeReportService: SizeReportService = inject(SizeReportService);
  miniPhone() {
    return this.sizeReportService.miniPhoneView();
  }
}
