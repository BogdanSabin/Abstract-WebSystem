import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { AuthenticationService, RegisterData } from 'src/app/services/authentication.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ISite, SiteApiService } from 'src/app/services/site-api.service';

class CustomValidators {
  static passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('confirmPassword')?.value;
    if ((password != passwordConfirm) && password !== null && passwordConfirm !== null)
      return { passwordsNotMatch: true }
    else return null;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public siteRef!: ISite

  @ViewChild('confirmationDialog') confirmationDialog!: TemplateRef<any>;

  public registerForm!: FormGroup;

  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;

  constructor(private authService: AuthenticationService, private stieApi: SiteApiService, private activateRoute: ActivatedRoute, private formBuilder: FormBuilder, private dialog: MatDialog, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.registerForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, []],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required]]
    }, {
      validators: CustomValidators.passwordsMatch
    });
    const siteId = this.activateRoute.snapshot.paramMap.get('siteid') || '';
    this.siteRef = await this.stieApi.getSiteById(siteId);
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    else this.register({
      accountInSite: this.siteRef.id || '',
      firstName: this.registerForm.value['firstName'],
      lastName: this.registerForm.value['lastName'],
      email: this.registerForm.value['email'],
      phone: this.registerForm.value['phone'] || '',
      password: this.registerForm.value['password']
    })
  }

  private register(registerData: RegisterData) {
    this.authService.register(registerData).then(() => {
      return this.dialog.open(this.confirmationDialog);
    })
  }

  public isPasswordTooShort(type: string) {
    return this.registerForm.controls?.[type]?.errors?.['minlength']?.actualLength < 6;
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
