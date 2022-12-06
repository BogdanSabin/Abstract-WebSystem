import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';

export interface ISite {
  id?: string,
  name: string,
  description?: string,
  linkDesktop?: string,
  productsSettings: {
    fields: {
      key: string,
      type: string,
      isMandatory: boolean
    }[]
  },
  ordersSettings: {
    fields: {
      key: string,
      type: string,
      isMandatory: boolean
    }[]
  }
}

export interface IUserInSite {
  id: string,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  emailConfirmation: string
}

interface IUserInSiteResponse {
  response: IUserInSite[];
}

interface ISiteResponse {
  response: ISite[];
}

@Injectable({
  providedIn: 'root'
})
export class SiteApiService {

  constructor(private ApiClient: ApiClientService) { }

  async queryAllSites(): Promise<ISite[]> {
    return this.ApiClient.get<ISiteResponse>({
      url: '/api/admin/site'
    }).then(sites => {
      return sites.response;
    })
  }

  deleteSite(siteId: string): Promise<boolean> {
    return this.ApiClient.delete<boolean>({
      url: `/api/admin/site/${siteId}`
    }).then(() => { return true })
  }

  createSite(newSite: ISite): Promise<ISite> {
    return this.ApiClient.post<ISite>({
      url: '/api/admin/site',
      data: newSite
    }).then(response => { return response })
  }

  getSiteById(siteId: string): Promise<ISite> {
    return this.ApiClient.get<ISiteResponse>({
      url: `/api/admin/site/${siteId}`
    }).then(response => { return response.response as unknown as ISite })
  }

  updateSite(siteId: string, siteData: ISite): Promise<ISite> {
    return this.ApiClient.put<ISite>({
      url: `/api/admin/site/${siteId}`,
      data: siteData
    }).then(response => { return response })
  }

  getUsersInSite(siteId: string): Promise<IUserInSite[]> {
    return this.ApiClient.get<IUserInSiteResponse>({
      url: `/api/admin/site/users/bysite/${siteId}`
    }).then(response => { return response.response })
  }

}