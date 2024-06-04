import { Component, OnInit } from '@angular/core';
import {MenuAbleService} from "../../../services/normal-services/menu-able.service";

@Component({
  selector: 'app-media-extractor',
  templateUrl: './media-extractor.component.html',
  styleUrls: ['./media-extractor.component.scss'],
  standalone: true
})
export class MediaExtractorComponent  implements OnInit {

  constructor(private menuAble: MenuAbleService,) {
    this.menuAble.enableMedia()
  }

  ngOnInit() {
    console.log()
  }

}
