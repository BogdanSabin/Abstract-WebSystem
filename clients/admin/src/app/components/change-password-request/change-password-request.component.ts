import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password-request.component.html',
  styleUrls: ['./change-password-request.component.scss']
})
export class ChangePasswordRequestComponent implements OnInit {
  @ViewChild('changePasswordRequestDialog') changePasswordRequestDialog!: TemplateRef<any>;

  public cahngePasswordReqForm!: FormGroup;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.cahngePasswordReqForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    })
  }

  onSubmit() {
    if (this.cahngePasswordReqForm.invalid) return;
    else
      return this.authService.changePasswordRequest(this.cahngePasswordReqForm.value['email'])
        .then((data) => {
          localStorage.setItem('access_token', data.response.token);
          return this.dialog.open(this.changePasswordRequestDialog);
        })
  }

  goToChangePasswordPage() {
    return this.router.navigate(['changepassword']);
  }
}
