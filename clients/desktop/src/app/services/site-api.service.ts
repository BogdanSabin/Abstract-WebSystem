import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';

export interface ISite {
  id?: string,
  name: string,
  description?: string,
  linkDesktop?: string,
  ordersSettings: {
    fields: {
      key: string,
      value: String
    }[]
  }
}

interface ISiteResponse {
  response: ISite;
}

@Injectable({
  providedIn: 'root'
})
export class SiteApiService {

  constructor(private ApiClient: ApiClientService) { }

  getSiteById(siteId: string): Promise<ISite> {
    return this.ApiClient.get<ISiteResponse>({
      url: `/api/desktop/site/${siteId}`
    }).then(response => { return response.response as ISite })
  }

}