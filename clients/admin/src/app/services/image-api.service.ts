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

  uploadImage(scope: 'Product' | 'User', resourceRef: string, displayAs: string, image: File): Promise<boolean> {
    const refData = { resourceScope: scope, resourceId: resourceRef, displayAs: displayAs };
    const fd = new FormData();
    fd.append('referenceData', JSON.stringify(refData));
    fd.append('imageData', image);

    return this.ApiClient.post({
      url: '/api/admin/image',
      data: fd
    }, { "Content-Type": "multipart/form-data" }).then(() => { return true })
  }

  getImage(scope: 'Product' | 'User', resourceRef: string): Promise<string> {
    return this.ApiClient.getBytes<{ headers: any, data: any }>({
      url: `/api/admin/image/byref/${resourceRef}/scope/${scope}`
    }, true).then((response) => {
      const imageType = response.headers["content-type"];
      const image = btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      const imageURL = `data:${imageType.toLowerCase()};base64,${image}`;
      return imageURL
    })
      .catch(() => { return '' });
  }

  deleteImage(imageId: string): Promise<boolean> {
    return this.ApiClient.delete<boolean>({
      url: `/api/admin/image/${imageId}`
    }).then(() => { return true })
  }

}
