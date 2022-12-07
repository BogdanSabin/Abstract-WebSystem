import { SafeUrl } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import * as Bluebird from 'bluebird';
import { ApiClientService } from './api-client.service';
import { ImageApiService, ImageResourceRef } from './image-api.service';

export interface IProduct {
  id: string,
  name: string,
  price: number,
  category: string,
  image: SafeUrl | string,
  fields: {
    key: string,
    value: string
  }[]
}

interface IProductResponse {
  response: IProduct[];
}

@Injectable({
  providedIn: 'root'
})

export class ProductApiService {
  constructor(private ApiClient: ApiClientService, private ImageApi: ImageApiService) { }

  async queryAllProducts(siteId: string | undefined): Promise<IProduct[]> {
    return this.ApiClient.get<IProductResponse>({
      url: '/api/desktop/product',
      params: {
        siteId: siteId
      }
    }).then(products => {
      return products.response;
    }).catch(error => { return []; })
  }

  getProductById(productId: string): Promise<IProduct> {
    return this.ApiClient.get<IProductResponse>({
      url: `/api/desktop/product${productId}`
    }).then(response => { return response.response as unknown as IProduct })
  }

  getProductImgaes(prodcutIds: string[]): Promise<ImageResourceRef[]> {
    let images: ImageResourceRef[] = [];
    return Bluebird.each(prodcutIds, (productId) => {
      return this.ImageApi.getImage('Product', productId)
        .then(imageUrl => {
          if (imageUrl && imageUrl.length > 0) {
            images.push({
              refid: productId,
              url: imageUrl
            })
          }
        })
    }).then(() => {
      return images;
    })
  }

}