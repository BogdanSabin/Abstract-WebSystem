import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  public showPassword: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    else this.login(this.loginForm.value['email'], this.loginForm.value['password'])
  }

  private login(email: string, password: string) {
    this.authService.login(email, password)
      .then(() => {this.router.navigate(['admin']);})
  }

  isPasswordTooShort() {
    return this.loginForm.controls?.['password']?.errors?.['minlength']?.actualLength < 6;
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}
