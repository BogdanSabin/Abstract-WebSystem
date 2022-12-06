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

export interface IOrderUpdate {
  id: string,
  products: string[],
  orderInfo: {
    key: string,
    value: string
  }[]
}

interface IOrderResponse {
  response: IOrder[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {

  constructor(private ApiClient: ApiClientService) { }

  queryAllOrders(siteId: string | undefined): Promise<IOrder[]> {
    return this.ApiClient.get<IOrderResponse>({
      url: '/api/admin/order',
      params: {
        siteId: siteId
      }
    }).then(response => { return response.response })
      .catch(() => { return []; })
  }

  deleteOrder(orderId: string): Promise<boolean> {
    return this.ApiClient.delete<boolean>({
      url: `/api/admin/order/${orderId}`
    }).then(() => { return true })
  }

  getOrderById(orderId: string): Promise<IOrder> {
    return this.ApiClient.get<IOrderResponse>({
      url: `/api/admin/order${orderId}`
    }).then(response => { return response.response as unknown as IOrder })
  }

  updateOrder(orderId: string, orderData: IOrderUpdate): Promise<IOrderUpdate> {
    return this.ApiClient.put<IOrderUpdate>({
      url: `/api/admin/order/${orderId}`,
      data: orderData
    }).then(response => { return response })
  }

}
