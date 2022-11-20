import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

export interface RegisterData {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
}

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
  @ViewChild('confirmationDialog') confirmationDialog!: TemplateRef<any>;

  public registerForm!: FormGroup;

  public showPassword: boolean = false;
  public showPasswordConfirm: boolean = false;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, []],
      password: [null, [Validators.required,Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required]]
    }, {
      validators: CustomValidators.passwordsMatch
    })
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    else this.register({
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
  
  public goToLoginPage(){
    return this.router.navigate(['login']);
  }

  public isPasswordTooShort(type:string) {
    return this.registerForm.controls?.[type]?.errors?.['minlength']?.actualLength < 6;
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public togglePasswordConfirmVisibility(): void {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

}
