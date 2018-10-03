import { Component } from '@angular/core';
import { NavController, normalizeURL } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Http, URLSearchParams, Headers } from '@angular/http';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userData: any;
  imageUrl: any;
  lastImage: string = null;
  currentFileName: string;
  isFileExist: string;
  currentImage: any;
  uploaded: string;

  constructor(public navCtrl: NavController, private camera: Camera,
    private currentUser: CurrentUserProvider, private file: File,
    private filePath: FilePath, private apiService: ApiProvider,
    private fileTransfer: FileTransfer, private http: Http
  ) {

  }

  getPicture(): void {
    const options: CameraOptions = {
      // quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    this.camera.getPicture(options).then((imagePath) => {

      // console.log('normalPath '+imagePath)

      // this.filePath.resolveNativePath(imagePath)
      //   .then(filePath => {
      //     console.log('filepath '+filePath)
      //     // let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      //     // let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
      //     // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      //   });

      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      console.log(currentName)
      var currentPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      console.log(currentPath);
      console.log(imagePath);
      // this.imageUrl = normalizeURL(imagePath) ;
      this.file.checkDir(this.file.externalDataDirectory, 'Samiksha').then(success => {
        // console.log(JSON.stringify('success' + success));
        if (success) {
          this.copyFileToLocalDir(currentPath, currentName, this.createFileName());
          // this.currentFileName = currentName
          console.log("File name:" + this.currentFileName);
        } else {

        }

      }).catch(err => {
        console.log(JSON.stringify(cordova.file))
        this.file.createDir(cordova.file.externalDataDirectory, 'Samiksha', false).then(success => {
          console.log(JSON.stringify(success));
          this.copyFileToLocalDir(currentPath, currentName, this.createFileName())

        }, error => {
          console.log(JSON.stringify(error))

        })
      });

      // console.log(JSON.stringify(imagePath))
      // console.log(imagePath.lastIndexOf('/'))
      // var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      // console.log(currentName)
      // var currentPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      // console.log(currentPath);
      // this.copyFileToLocalDir(currentPath, currentName, this.createFileName())
      // console.log(imagePath);
      // this.imageUrl = normalizeURL(imagePath) ;
      // console.log('serialized:' + this.imageUrl);

    }, (err) => {
      // Handle error
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    this.currentFileName = newFileName;

    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log(cordova.file.dataDirectory);
    this.file.copyFile(namePath, currentName, cordova.file.externalDataDirectory + 'Samiksha', newFileName).then(success => {
      this.lastImage = normalizeURL(success.nativeURL);
      console.log(JSON.stringify(success))
      // console.log(this.pathForImage(this.lastImage))
    }, error => {

      // this.presentToast('Error while storing file.');
    });
  }
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.externalDataDirectory + 'Samiksha/' + img;
    }
  }

  ionViewDidLoad() {
    this.userData = this.currentUser.getCurrentUserData();
  }

  checkForFile() {
    // console.log(this.currentFileName);
    // console.log(cordova.file.externalDataDirectory + 'Samiksha/');
    this.file.checkFile(cordova.file.externalDataDirectory + 'Samiksha/', this.currentFileName).then(response => {
      // console.log('Check For file name : '+ response);
      this.isFileExist = JSON.stringify(response);
      this.file.readAsDataURL(cordova.file.externalDataDirectory + 'Samiksha/', this.currentFileName).then(data => {
        console.log(JSON.stringify(data));
        this.currentImage = data;
        this.getImageUploadUrls();
      }).catch(err => {

      })
    }).catch(error => {
      // this.isFileExist = JSON.stringify(error)

      console.log(JSON.stringify(error))
    })
  }

  getImageUploadUrls() {
    const files = {
      "files": [
        this.currentFileName
      ]
    }
    this.apiService.httpPost(AppConfigs.survey.getImageUploadUr, files, success => {
      console.log(JSON.stringify(success));
      for (const image of success.result) {
        this.cloudImageUpload(image);
      }
      this.fileTransfer.create()
    }, error => {

    })
  }

  cloudImageUpload(image) {
    var options: FileUploadOptions = {
      fileKey: 'Samiksha',
      fileName: image.file,
      chunkedMode: false,
      mimeType: "image/jpeg",
      // params: { 'fileName': image.file },
      headers: {
        "Content-Type": 'multipart/form-data'
      },
      httpMethod: 'PUT',
    };
    let targetPath = this.pathForImage(image.file);
    // console.log(JSON.stringify(this.file.resolveLocalFilesystemUrl(cordova.file.externalDataDirectory + 'Samiksha/'+image.file)));
    let fileTrns: FileTransferObject = this.fileTransfer.create();
    fileTrns.upload(targetPath, image.url, options).then(result => {
      console.log(JSON.stringify(result));
      this.uploaded = "File uploaded";
    }).catch(err => {
      console.log(JSON.stringify(err))
    })



    let payload;

    // console.log("in upload api")
    // this.file.readAsBinaryString(cordova.file.externalDataDirectory + 'Samiksha/', image.file).then(result => {
      // console.log(JSON.stringify(result))
      // payload = result;
      // this.apiService.httpPut(image.url, payload, success => {
      //   console.log(JSON.stringify(success))
      // }, error => {

      // })
      // let headers = new Headers();
      // headers.append("Content-type", 'image/jpeg');
      // console.log(image.url)
      // this.http.put(image.url, payload, { headers: headers }).subscribe(data => {
      //   console.log(JSON.stringify(data));
      // }, error => {
      //   console.log(JSON.stringify(error));
        
      // })
    // }).catch(err => {

    // })


  }
}
