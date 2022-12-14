import { Injectable } from '@angular/core';

import axios from "axios";
import { AxiosInstance } from "axios";

export interface Params {
  [key: string]: any;
}

export interface Headers {
  [key: string]: string;
}

interface Options {
  url: string;
}

export interface GetOptions extends Options {
  params?: Params;
}

export interface PostOptions extends Options {
  data: any;
}

export interface PutOptions extends Options {
  data: any;
}

export interface DeleteOptions extends Options {
}

export interface ErrorResponse {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private readonly JWT_TOKEN_KEY = 'access_token';
  private readonly ENDPOINT = 'http://localhost:8001';
  private axiosClient: AxiosInstance;

  constructor() {
    // The ApiClient wraps calls to the underlying Axios client.
    this.axiosClient = axios.create({
      baseURL: this.ENDPOINT,
      timeout: 60000,
    });
  }

  public async get<T>(options: GetOptions): Promise<T> {
    const token = this.getToken();
    return this.axiosClient.request<T>({
      method: "get",
      url: options.url,
      params: options.params,
      headers: {
        ...token.length > 0 && { Authorization: `Bearer ${token}` }
      }
    }).then(response => { return response.data; })
  }

  public async getBytes<T>(options: GetOptions, returnHeaders = false): Promise<T> {
    const token = this.getToken();
    return this.axiosClient.request<T>({
      method: "get",
      url: options.url,
      params: options.params,
      headers: {
        ...token.length > 0 && { Authorization: `Bearer ${token}` }
      },
      responseType: 'arraybuffer'
    }).then(response => {
      if (returnHeaders) return { headers: response.headers, data: response.data } as unknown as T;
      else return response.data;
    })
  }

  public async post<T>(options: PostOptions, extraHeaders?: Headers): Promise<T> {
    const token = this.getToken();
    return this.axiosClient.request<T>({
      method: "post",
      url: options.url,
      data: options.data,
      headers: {
        ...token.length > 0 && { Authorization: `Bearer ${token}` },
        ...extraHeaders && extraHeaders
      }
    }).then(response => { return response.data; })
  }

  public async put<T>(options: PutOptions): Promise<T> {
    const token = this.getToken();
    return this.axiosClient.request<T>({
      method: "put",
      url: options.url,
      data: options.data,
      headers: {
        ...token.length > 0 && { Authorization: `Bearer ${token}` }
      }
    }).then(response => { return response.data; });

  }

  public async delete<T>(options: DeleteOptions): Promise<T> {
    const token = this.getToken();
    return this.axiosClient.request<T>({
      method: "delete",
      url: options.url,
      headers: {
        ...token.length > 0 && { Authorization: `Bearer ${token}` }
      }
    }).then(response => { return response.data; });
  }

  private getToken(): string {
    return localStorage.getItem(this.JWT_TOKEN_KEY) || '';
  }

}