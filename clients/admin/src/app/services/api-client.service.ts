import { Injectable } from '@angular/core';

import axios from "axios";
import { AxiosInstance } from "axios";

export interface Params {
  [key: string]: any;
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
  private axiosClient: AxiosInstance;

  constructor() {
    // The ApiClient wraps calls to the underlying Axios client.
    this.axiosClient = axios.create({
      baseURL: 'http://localhost:8000',
      timeout: 3000,
    });
  }

  public async get<T>(options: GetOptions): Promise<T> {
    const token = localStorage.getItem("access_token") || '';
    return this.axiosClient.request<T>({
      method: "get",
      url: options.url,
      params: options.params,
      headers: {
        ...token.length > 0 && { Authorization: `Bearer ${token}` }
      }
    }).then(response => { return response.data; })
  }

  public async post<T>(options: PostOptions): Promise<T> {
    const token = localStorage.getItem("access_token") || '';
    return this.axiosClient.request<T>({
      method: "post",
      url: options.url,
      data: options.data,
      headers: {
        ...token.length > 0 && { Authorization: `Bearer ${token}` }
      }
    }).then(response => { return response.data; })
  }

  public async put<T>(options: PutOptions): Promise<T> {
    const token = localStorage.getItem("access_token") || '';
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
    const token = localStorage.getItem("access_token") || '';
    return this.axiosClient.request<T>({
      method: "delete",
      url: options.url,
      headers: {
        ...token.length > 0 && { Authorization: `Bearer ${token}` }
      }
    }).then(response => { return response.data; });
  }
}
