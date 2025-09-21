import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder, ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {Router, RouterLink} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {user_routes} from "../../../roots/routes";
import {RegisterService, VerificationService} from "../../../auth_module";

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [
    TranslateModule,
    RouterLink,
    ReactiveFormsModule,
    NzCardComponent,
    NzFormDirective,
    NzColDirective,
    NzRowDirective
  ],
  standalone: true
})
export class Register {
  private fb = inject(NonNullableFormBuilder)
  validateForm: FormGroup<{
    username: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirm: FormControl<string>;
  }> = this.fb.group({
    username: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(20)]],
    confirm: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(20)]]
  });
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
  @ViewChild("vCode")
  vCode: ElementRef |undefined;
  submitForm(): void {
    if (this.validateForm.valid&&this.validateForm.value.confirm===this.validateForm.value.password) {
      if(this.code?.toLowerCase()!==this.vCode?.nativeElement.value.toLowerCase()){
        this.message.error("验证码错误");
        this.generateVerificationCode();
        return;
      }
      this.registerService.register({
        username: this.validateForm.value.username,
        password: this.validateForm.value.password,
        email: this.validateForm.value.email
      }).subscribe({
        next: (data: any)=>{
          this.message.success("注册成功")
          this.router.navigate(user_routes.sign_in)
        }
      })

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  verificationService: VerificationService = inject(VerificationService);
  message: NzMessageService = inject(NzMessageService);
  registerService: RegisterService = inject(RegisterService);
  router: Router = inject(Router);
  constructor(
              ) {
    // @ts-ignore
    this.validateForm.setValidators(this.passwordMatchValidator);
    this.generateVerificationCode();
  }
  private passwordMatchValidator(group: FormGroup) {
    // @ts-ignore
    const password = group.get('password').value;
    // @ts-ignore
    const confirm = group.get('confirm').value;
    return password === confirm ? null : { passwordMatch: true };
  }
}

