import { Component, OnInit, ViewChild } from '@angular/core';
import { ISite, SiteApiService, IUserInSite } from 'src/app/services/site-api.service';
import { MatTableDataSource, MatTableDataSourcePaginator } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  sites: ISite[] = [];
  selectedSite: ISite | undefined;

  dataSource: MatTableDataSource<IUserInSite>;
  users: IUserInSite[];
  columns: string[] = ['id', 'firstName', 'lastName', 'email', 'phone', 'emailConfirmation'];

  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  constructor(private siteApi: SiteApiService) {
    this.users = [];
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void { this.refreshPage(); }

  siteChanged(event: any) {
    this.selectedSite = (event.value) as unknown as ISite;
    this.refreshPage();
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async refreshPage() {
    this.siteApi.queryAllSites().then(async sites => {
      sites = sites.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      this.sites = sites;
      if (!this.selectedSite) this.selectedSite = sites[0];
      this.users = await this.siteApi.getUsersInSite(this.selectedSite.id || '');
      this.dataSource = new MatTableDataSource(this.users.map(user => {
        user.emailConfirmation = user.emailConfirmation ? 'Yes' : 'No';
        return user;
      }));
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator as unknown as MatTableDataSourcePaginator;
    })
  }

}
