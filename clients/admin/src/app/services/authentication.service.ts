import { Injectable } from '@angular/core';

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

  constructor(private ApiClient: ApiClientService) { }

  login(email: string, password: string): Promise<LoginResponse> {
    return this.ApiClient.post<LoginResponse>({
      url: '/api/admin/auth/login',
      data: {
        email: email,
        password: password
      }
    })
  }

  async register(registerData: RegisterData): Promise<boolean> {
    return this.ApiClient.post<RegisterData>({
      url: '/api/admin/auth/register',
      data: registerData
    }).then(() => { return true })
  }

  async changePasswordRequest(email: string): Promise<ChangePasswordReqResponse> {
    return this.ApiClient.post<ChangePasswordReqResponse>({
      url: '/api/admin/auth/changepassword',
      data: { email: email }
    }).then((response) => { return response })
      .catch(error => { return Promise.reject(error); })
  }

  async changePasswod(code: string, newPassword: string): Promise<boolean> {
    return this.ApiClient.put<ChangePasswordReqResponse>({
      url: '/api/admin/auth/changepassword',
      data: { code: code, newPassword: newPassword }
    }).then(() => { return true })
  }

}