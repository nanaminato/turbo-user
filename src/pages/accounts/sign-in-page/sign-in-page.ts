import {Component, ElementRef, inject, Inject, ViewChild} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {TranslateModule} from "@ngx-translate/core";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzMessageService} from "ng-zorro-antd/message";
import {VerificationService} from "../../../auth_module";
import {Store} from "@ngrx/store";
import {authActions} from "../../../systems/store/system.actions";

@Component({
  standalone: true,
  imports: [
    NzCardModule,
    RouterLink,
    NzButtonModule,
    NzIconModule,
    TranslateModule,
    NzColDirective,
    ReactiveFormsModule,
    NzRowDirective,
    NzCheckboxComponent,
    FormsModule
  ],
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.css'
})
export class SignInPage {
  private fb = inject(NonNullableFormBuilder)
  validateForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    username: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(20)]],
    password: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(20)]],
    remember: [true]
  });
  verificationService: VerificationService = inject(VerificationService);
  message: NzMessageService = inject(NzMessageService);
  router: Router = inject(Router);
  @ViewChild("vCode")
  vCode: ElementRef |undefined;
  store = inject(Store);
  submitForm(): void {
    if (this.validateForm.valid) {
      if(this.code?.toLowerCase()!==this.vCode?.nativeElement.value.toLowerCase()){
        this.message.error("验证码错误");
        this.generateVerificationCode();
        return;
      }
      let username = this.validateForm.value.username;
      let password = this.validateForm.value.password!;
      this.store.dispatch(authActions.login({ username: username!, password: password! }));
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  ngOnInit(): void {
    this.generateVerificationCode();
  }
  code: string | undefined;
  codeUrl: string | undefined;
  generateVerificationCode() {
    this.verificationService.generateVerificationCode()
      .subscribe(
      {
        next: (value:any) => {
          this.code = value.code;
          this.codeUrl = 'data:image/jpeg;base64,' + value.img;
        }
      }
    );
  }

}
