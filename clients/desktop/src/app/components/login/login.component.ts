import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SiteApiService, ISite } from 'src/app/services/site-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public siteRef!: ISite
  public loginForm!: FormGroup;

  public showPassword: boolean = false;

  constructor(private authService: AuthenticationService, private stieApi: SiteApiService, private activateRoute: ActivatedRoute, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
    const siteId = this.activateRoute.snapshot.paramMap.get('siteid') || '';
    this.siteRef = await this.stieApi.getSiteById(siteId);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    else this.login(this.loginForm.value['email'], this.loginForm.value['password'], this.siteRef.id || '')
  }

  private login(email: string, password: string, siteId: string) {
    this.authService.login(email, password, siteId)
      .then(() => {this.router.navigate([`site/${this.siteRef.id}/store`]);})
  }

  isPasswordTooShort() {
    return this.loginForm.controls?.['password']?.errors?.['minlength']?.actualLength < 6;
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public goTo(route: string): void {
    this.router.navigate([`site/${this.siteRef.id}/${route}`]);
  }

}
