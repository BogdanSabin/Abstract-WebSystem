import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ISite, SiteApiService } from 'src/app/services/site-api.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password-request.component.html',
  styleUrls: ['./change-password-request.component.scss']
})
export class ChangePasswordRequestComponent implements OnInit {
  public siteRef!: ISite

  @ViewChild('changePasswordRequestDialog') changePasswordRequestDialog!: TemplateRef<any>;

  public cahngePasswordReqForm!: FormGroup;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private stieApi: SiteApiService, private activateRoute: ActivatedRoute, private dialog: MatDialog, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.cahngePasswordReqForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
    const siteId = this.activateRoute.snapshot.paramMap.get('siteid') || '';
    this.siteRef = await this.stieApi.getSiteById(siteId);
  }

  onSubmit() {
    if (this.cahngePasswordReqForm.invalid) return;
    else
      return this.authService.changePasswordRequest(this.cahngePasswordReqForm.value['email'])
        .then(() => { return this.dialog.open(this.changePasswordRequestDialog); })
  }


  public goTo(route: string): void {
    this.router.navigate([`site/${this.siteRef.id}/${route}`]);
  }
}
