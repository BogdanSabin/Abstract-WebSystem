import { Injectable } from '@angular/core';
import { ApiClientService } from './api-client.service';

export interface AnalyticsResponse {
  response: {
    [key: string]: number
  }
}

@Injectable({
  providedIn: 'root'
})

export class AnalyticsService {

  constructor(private ApiClient: ApiClientService) { }

  getAnalytics(aggMethod: string): Promise<AnalyticsResponse> {
    return this.ApiClient.get<AnalyticsResponse>({
      url: 'api/admin/site/data/analytics',
      params: {
        aggMethod: aggMethod
      }
    }).then(data => { return data; })
  }
}