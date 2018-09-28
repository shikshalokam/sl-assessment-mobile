import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CurrentUserProvider } from '../../providers/current-user/current-user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userData: any;

  constructor(public navCtrl: NavController, private camera: Camera, private currentUser: CurrentUserProvider) {

  }

  getPicture() : void {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log(JSON.stringify(imageData))
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
  }

  ionViewDidLoad() : void {
    this.userData = this.currentUser.getCurrentUserData();
  }

}
