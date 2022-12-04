import { SafeUrl } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import * as Bluebird from 'bluebird';
import { ApiClientService } from './api-client.service';
import { ImageApiService, ImageResourceRef } from './image-api.service';

export interface IProduct extends IProductCreate {
  id: string
}

export interface IProductCreate {
  siteId: string,
  fields: {
    key: string,
    value: string,
  }[]
}

export interface IProductTable {
  id: string,
  siteId: string,
  fields: string,
  image: SafeUrl | string
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
      url: '/api/admin/product',
      params: {
        siteId: siteId
      }
    }).then(products => {
      return products.response;
    }).catch(error => { return []; })
  }

  deleteProduct(productId: string): Promise<boolean> {
    return this.ApiClient.delete<boolean>({
      url: `/api/admin/product/${productId}`
    }).then(() => { return true })
  }

  createProduct(newProduct: IProductCreate): Promise<IProduct> {
    return this.ApiClient.post<IProductResponse>({
      url: '/api/admin/product',
      data: newProduct
    }).then(response => { return response.response as unknown as IProduct })
  }

  getProductById(productId: string): Promise<IProduct> {
    return this.ApiClient.get<IProductResponse>({
      url: `/api/admin/product${productId}`
    }).then(response => { return response.response as unknown as IProduct })
  }

  updateProduct(productId: string, productData: IProduct): Promise<IProduct> {
    return this.ApiClient.put<IProduct>({
      url: `/api/admin/product/${productId}`,
      data: productData
    }).then(response => { return response })
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
