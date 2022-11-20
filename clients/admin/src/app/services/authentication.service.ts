import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ApiClientService } from "./api-client.service";
import { RegisterData } from '../components/register/register.component';

interface LoginResponse {
  response: {
    expiresIn: string,
    role: string,
    token: string
  }
}

interface ChangePasswordReqResponse {
  response: {
    token: string
  }
}

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private readonly JWT_TOKEN_KEY = 'access_token';
  private readonly ROLE_KEY = 'role';

  constructor(private ApiClient: ApiClientService, private jwtHelper: JwtHelperService) { }

  login(email: string, password: string): Promise<boolean> {
    return this.ApiClient.post<LoginResponse>({
      url: '/api/admin/auth/login',
      data: {
        email: email,
        password: password
      }
    }).then(data => {
      const token = data.response.token;
      const role = data.response.role;
      localStorage.setItem(this.JWT_TOKEN_KEY, token);
      localStorage.setItem(this.ROLE_KEY, role);
      return true;
    })
  }

  async register(registerData: RegisterData): Promise<boolean> {
    return this.ApiClient.post<RegisterData>({
      url: '/api/admin/auth/register',
      data: registerData
    }).then(() => { return true })
  }

  async changePasswordRequest(email: string): Promise<boolean> {
    return this.ApiClient.post<ChangePasswordReqResponse>({
      url: '/api/admin/auth/changepassword',
      data: { email: email }
    }).then((data) => {
      localStorage.setItem(this.JWT_TOKEN_KEY, data.response.token);
      return true
    }).catch(error => { return Promise.reject(error); })
  }

  async changePasswod(code: string, newPassword: string): Promise<boolean> {
    return this.ApiClient.put<ChangePasswordReqResponse>({
      url: '/api/admin/auth/changepassword',
      data: { code: code, newPassword: newPassword }
    }).then(() => { return true })
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem(this.JWT_TOKEN_KEY) || '';
    const role = localStorage.getItem(this.ROLE_KEY) || '';
    return !this.jwtHelper.isTokenExpired(token) && role != '';
  }

  public logOut(): void {
    localStorage.removeItem(this.JWT_TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }

}