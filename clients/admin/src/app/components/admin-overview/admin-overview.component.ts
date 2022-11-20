import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.scss']
})
export class AdminOverviewComponent implements OnInit {
  sideNavToggel: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void { }

  public logOut(): void {
    this.authService.logOut();
    this.router.navigate(['login']);
  }

  public goTo(route: string): void {
    this.router.navigate([route]);
  }

}
