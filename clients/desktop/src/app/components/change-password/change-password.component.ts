import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SiteApiService, ISite } from 'src/app/services/site-api.service';

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
  public siteRef!: ISite
  public cahngePasswordForm!: FormGroup;

  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;

  constructor(private authService: AuthenticationService, private stieApi: SiteApiService, private activateRoute: ActivatedRoute,private formBuilder: FormBuilder, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.cahngePasswordForm = this.formBuilder.group({
      code: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: [null, [Validators.required]]
    }, {
      validators: CustomValidators.passwordsMatch
    });
    const siteId = this.activateRoute.snapshot.paramMap.get('siteid') || '';
    this.siteRef = await this.stieApi.getSiteById(siteId);
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
    this.router.navigate([`site/${this.siteRef.id}/${route}`]);
  }

}