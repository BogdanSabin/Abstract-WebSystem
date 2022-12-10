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
  description: string,
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
  DEFAULT_PRODUC_IMAGE: string = './../../../../assets/defaultProductImage.jpg';

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
          images.push({
            refid: productId,
            url: imageUrl || this.DEFAULT_PRODUC_IMAGE
          })
        })
    }).then(() => {
      return images;
    })
  }

  getProductsWithImages(siteId: string, sort: string, count: number, category?: string): Promise<IProduct[]> {
    return this.queryAllProducts(siteId).then(products => {
      const productIds = products.map(p => p.id);
      return this.getProductImgaes(productIds)
        .then(images => {
          return this.filterProducts(products.map(product => {
            const imageProduct = images.find(img => img.refid === product.id);
            product.image = imageProduct?.url || this.DEFAULT_PRODUC_IMAGE;

            const name = product.fields.find(f => f.key === "name")?.value;
            product.name = name || '';

            const price = product.fields.find(f => f.key === "price")?.value;
            product.price = parseInt(price || '');

            const description = product.fields.find(f => f.key === "description")?.value;
            product.description = description || '';

            const category = product.fields.find(f => f.key === "category")?.value;
            product.category = category || '';

            return product;
          }), sort, count, category);
        })
    })
  }

  getProductCategories(products: IProduct[]): string[] {
    function onlyUnique(value: string, index: number, self: string[]) {
      return self.indexOf(value) === index;
    }
    return ['All', ...products.map(p => p.category).filter(onlyUnique)];
  }

  private filterProducts(products: IProduct[], sort: string, count: number, category?: string): IProduct[] {
    products = products.sort(this.dynamicSort("name", sort));
    if (count < products.length) products = products.splice(0, count);
    if (category && category != 'All') products = products.filter(p => p.category === category)
    return products;
  }

  private dynamicSort(property: string, sortOrderType: string) {
    const sortOrder = sortOrderType.toLowerCase() === "asc" ? 1 : -1;

    return function (a: any, b: any) {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    }
  }

}