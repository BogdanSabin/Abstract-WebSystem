import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

class CustomValidators {
  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const passwordConfirm = control.get('confirmNewPassword')?.value;
    if ((password != passwordConfirm) && password !== null && passwordConfirm !== null)
      return { passwordsNotMatch: true }
    else return null;
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public cahngePasswordForm!: FormGroup;

  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.cahngePasswordForm = this.formBuilder.group({
      code: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: [null, [Validators.required]]
    }, {
      validators: CustomValidators.passwordsMatch
    })
  }

  onSubmit() {
    if (this.cahngePasswordForm.invalid) return;
    else return this.authService.changePasswod(this.cahngePasswordForm.value['code'], this.cahngePasswordForm.value['newPassword'])
      .then(() => { this.router.navigate(['login']); })
  }

  public isPasswordTooShort(type:string) {
    return this.cahngePasswordForm.controls?.[type]?.errors?.['minlength']?.actualLength < 6;
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public togglePasswordConfirmVisibility(): void {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  public goTo(route: string): void {
    this.router.navigate([route]);
  }

}