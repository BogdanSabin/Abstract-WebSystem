import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { ISite, SiteApiService } from './../../../../admin/src/app/services/site-api.service';

@Injectable({
  providedIn: 'root'
})
export class SiteLinkerService {

  constructor(private stieApi: SiteApiService, private activateRoute: ActivatedRoute) { }


  getSiteLinkage(): Promise<ISite> {
    const siteId = this.activateRoute.snapshot.paramMap.get('id') || '';
    return this.stieApi.getSiteById(siteId)
  }

}
