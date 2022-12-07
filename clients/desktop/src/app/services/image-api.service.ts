import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ApiClientService } from './api-client.service';

export interface ImageHandler {
  image: File | null,
  url: SafeUrl
}

export interface ImageResourceRef {
  refid: string;
  url: SafeUrl;
}

@Injectable({
  providedIn: 'root'
})
export class ImageApiService {

  constructor(private ApiClient: ApiClientService) { }

  getImage(scope: 'Product' | 'User', resourceRef: string): Promise<string> {
    return this.ApiClient.getBytes<{ headers: any, data: any }>({
      url: `/api/desktop/image/byref/${resourceRef}/scope/${scope}`
    }, true).then((response) => {
      const imageType = response.headers["content-type"];
      const image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      const imageURL = `data:${imageType.toLowerCase()};base64,${image}`;
      return imageURL
    })
      .catch(() => { return '' });
  }

}
