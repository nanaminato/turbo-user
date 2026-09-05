import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzPopconfirmDirective, NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {RouterLink} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {KeyCallService} from "../../../../services";
import {KeyTypes, SupplierKey} from "../../../../models/keys";
import { admin_routes } from '../../../../routes';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-key-exhibit',
  standalone: true,
    imports: [
        NzCardComponent,
        NzPopconfirmModule,
        RouterLink,
        ReactiveFormsModule
    ],
  templateUrl: './key-exhibit.component.html',
  styleUrl: './key-exhibit.component.css'
})
export class KeyExhibitComponent {
  constructor(private call: KeyCallService,private message: NzMessageService) {
    this.fetchTypes();
  }
  types:KeyTypes[] | undefined;
  @Output()
  refresh = new EventEmitter<boolean>();
  @Input()
  key: SupplierKey | undefined;
  delete(id: number){
    this.call.deleteKey(id)
      .subscribe({
        next: msg=>{
          this.message.success("删除成功")
          this.refresh.next(true);
        },
        error: err=>{
          this.message.error(err.error)
        }
      })
  }
  fetchTypes(){
    this.call.getKeyTypes().subscribe({
      next: types=>{
        this.types = types;
      },
      error: err => {
        this.message.error("加载密钥类型失败")
      }
    })
  }
  protected readonly admin_routes = admin_routes;

  getKeyDescription(requestIdentifier: number | undefined) {
    let type = this.types?.find(t=>t.requestIdentifier === requestIdentifier);
    return type === undefined? "未知":type.type;
  }
}
