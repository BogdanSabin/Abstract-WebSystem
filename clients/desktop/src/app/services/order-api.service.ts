import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';

export interface IOrder {
  id: string,
  customerId: {
    email: string,
    firstName: string,
    lastName: string
  },
  products: {
    id: string,
    fields: {
      key: string,
      value: string
    }[]
  }[],
  orderInfo: {
    key: string,
    value: string
  }[]
  createdAt: string
}

export interface IOrderTable {
  id: string,
  customerId: string,
  products: string[],
  createdAt: string
}

export interface IOrderCreate {
  id: string,
  products: string[],
  orderInfo: {
    key: string,
    value: string
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {

  constructor(private ApiClient: ApiClientService) { }

  createOrder(orderData: IOrderCreate): Promise<IOrderCreate> {
    return this.ApiClient.post<IOrderCreate>({
      url: `/api/desktop/order`,
      data: orderData
    }).then(response => { return response })
  }

}
