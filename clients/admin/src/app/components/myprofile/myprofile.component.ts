import { UserData } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageApiService, ImageHandler } from 'src/app/services/image-api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  private DEFAULT_PROFILE_IMAGE = '../../../assets/defaultProfile.png'

  userData!: UserData;
  userImage!: string | SafeUrl;

  constructor(private authService: AuthenticationService, private imageService: ImageApiService, private sanitizer: DomSanitizer) { }

  async ngOnInit(): Promise<void> {
    this.userData = this.authService.getUserData();
    this.userImage = await this.imageService.getImage('User', this.userData.id) || this.DEFAULT_PROFILE_IMAGE;
  }

  onImageChange(event: any) {
    if (event.target.files) {
      const file = event.target.files[0];
      this.userImage = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))
      this.imageService.uploadImage('User', this.userData.id, 'cover', file)
    }
  }

}
