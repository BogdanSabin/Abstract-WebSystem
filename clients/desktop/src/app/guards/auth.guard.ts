import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router, private activateRoute: ActivatedRoute) { }

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      const siteId = this.activateRoute.snapshot.paramMap.get('siteid') || '';
      this.router.navigate([`site/${siteId}/login`]);
      return false;
    }
    else return true;
  }

}
