import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ApiClientService } from "./api-client.service";

interface LoginResponse {
  response: {
    expiresIn: string,
    role: string,
    token: string,
    userData: UserData
  }
}

export interface UserData {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  phone: string
}

export interface RegisterData {
  accountInSite: string,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
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
  private readonly USER_DATA_KEY = 'user_data';

  constructor(private ApiClient: ApiClientService, private jwtHelper: JwtHelperService) { }

  login(email: string, password: string, siteId: string): Promise<boolean> {
    return this.ApiClient.post<LoginResponse>({
      url: '/api/desktop/auth/login',
      data: {
        site: siteId,
        email: email,
        password: password
      }
    }).then(data => {
      const token = data.response.token;
      const role = data.response.role;
      const userData = JSON.stringify(data.response.userData);
      localStorage.setItem(this.JWT_TOKEN_KEY, token);
      localStorage.setItem(this.ROLE_KEY, role);
      localStorage.setItem(this.USER_DATA_KEY, userData);
      return true;
    })
  }

  async register(registerData: RegisterData): Promise<boolean> {
    return this.ApiClient.post<RegisterData>({
      url: '/api/desktop/auth/register',
      data: registerData
    }).then(() => { return true })
  }

  async changePasswordRequest(email: string): Promise<boolean> {
    return this.ApiClient.post<ChangePasswordReqResponse>({
      url: '/api/desktop/auth/changepassword',
      data: { email: email }
    }).then((data) => {
      localStorage.setItem(this.JWT_TOKEN_KEY, data.response.token);
      return true
    }).catch(error => { return Promise.reject(error); })
  }

  async changePasswod(code: string, newPassword: string): Promise<boolean> {
    return this.ApiClient.put<ChangePasswordReqResponse>({
      url: '/api/desktop/auth/changepassword',
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

  public getUserData(): UserData {
    return JSON.parse(localStorage.getItem(this.USER_DATA_KEY) || '{}') as UserData;
  }

}