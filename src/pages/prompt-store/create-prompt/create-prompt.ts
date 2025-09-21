import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TranslateModule} from "@ngx-translate/core";
import {SystemPromptService} from "../../../services/db-services/system-prompt.service";

@Component({
  selector: 'app-create-prompt',
  templateUrl: './create-prompt.html',
  styleUrl: './create-prompt.css',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    TranslateModule
  ],
  standalone: true
})
export class CreatePrompt {
  private fb = inject(NonNullableFormBuilder)
  private systemPromptService: SystemPromptService = inject(SystemPromptService);
  private notification: NzNotificationService = inject(NzNotificationService);
  @Output()
  close = new EventEmitter<boolean>();
  validateForm: FormGroup<{
    title: FormControl<string>;
    content: FormControl<string>;
  }> = this.fb.group({
    title: ['',[Validators.required,Validators.minLength(1)]],
    content: ['',[Validators.required, Validators.minLength(2)]]
  });
  submitForm(){
    if(this.validateForm.valid){
      let value = this.validateForm.value;
      this.notification.success("验证成功","");
      this.systemPromptService.addOrPutPrompts({
        id: 0,
        title: value.title,
        content: value.content!
      }).then(()=>{
        this.systemPromptService.reLoad();
        this.close.emit(true);
      })
      this.validateForm.reset();
    }
  }
}
