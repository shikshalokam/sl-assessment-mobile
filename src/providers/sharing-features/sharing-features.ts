import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';

/*
  Generated class for the SharingFeaturesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class SharingFeaturesProvider {

  constructor(
    public http: HttpClient,
    private fileChooser : FileChooser,
    private file : File ,
    private socialSharing : SocialSharing
    ) {
    console.log('Hello SharingFeaturesProvider Provider');
  }
  
  sharingThroughApp(){
    this.fileChooser.open()
    .then(uri => {
      let subject = "hi";
      let link = "google.com";
      let message = "hi";
      (<any>window).FilePath.resolveNativePath(uri, (result) => {
         let fileName = result.split('/').pop();
         let path = result.substring(0, result.lastIndexOf("/") + 1);
            this.file.readAsDataURL(path, fileName)
            .then(base64File => {
                this.socialSharing.share(message, subject, base64File , link).then(() => {
                  console.log("share Success")
                }).catch(() => {
                  console.log("share Failure")
                });
            })
            .catch(() => {
                console.log('Error reading file');
            })
      });
    }
    )
    .catch(e => console.log(e));
  }

}
