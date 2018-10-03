import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from 'ionic-angular'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { ImagePicker , ImagePickerOptions} from '@ionic-native/image-picker';

declare var cordova: any;

@Component({
  selector: 'image-upload',
  templateUrl: 'image-upload.html'
})
export class ImageUploadComponent implements OnInit {

  text: string;
  appFolderPath: string = cordova.file.externalDataDirectory + 'images';
  imageList: Array<any> = [];

  constructor(private actionSheet: ActionSheetController, private camera: Camera,
    private file: File, private imgPicker: ImagePicker) {
    console.log('Hello ImageUploadComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit() {
    // this.imageList.push('1538556284785.jpg')
  }

  openActionSheet(): void {
    const actionSheet = this.actionSheet.create({
      title: 'Add images',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            this.openCamera();
          }
        }, {
          text: 'Upload',
          icon: 'cloud-upload',
          handler: () => {
            this.openLocalLibrary();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  openCamera(): void {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    this.camera.getPicture(options).then(imagePath => {
      this.checkForLocalFolder(imagePath)
    }).catch(error => {

    })
  }

  checkForLocalFolder(imagePath)  {
    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    let currentPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

    this.file.checkDir(this.file.externalDataDirectory, 'images').then(success => {
      this.copyFileToLocalDir(currentPath, currentName, this.createFileName());
    }).catch(err => {
      this.file.createDir(cordova.file.externalDataDirectory, 'images', false).then(success => {
        this.copyFileToLocalDir(currentPath, currentName, this.createFileName())
      }, error => { })
    });
  }

  createFileName() {
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log(cordova.file.dataDirectory);
    this.file.copyFile(namePath, currentName, this.appFolderPath, newFileName).then(success => {
      // console.log(JSON.stringify(success));
      this.pushToImageList(newFileName);
    }, error => {
    });
  }

  pushToImageList(fileName) {
    console.log(fileName)
    // this.file.checkFile(this.appFolderPath, fileName).then(response => {
    //   console.log('Check For file name : '+ response);
      // this.isFileExist = JSON.stringify(response);
      this.file.readAsDataURL(this.appFolderPath, fileName).then(data => {
        console.log(JSON.stringify(data))
        this.imageList.push(data);
      }).catch(err => {

      })
    // }).catch(error => {
    //   console.log('Error ' + JSON.stringify(error))
    // })
  }

  openLocalLibrary(): void {
    const options: ImagePickerOptions = {
      maximumImagesCount: 7,
      quality: 100,
    }
    this.imgPicker.getPictures(options).then(imageData => {
      for (const image of imageData) {
        this.checkForLocalFolder(image);
      }
      console.log('Image URI: ' + imageData);
    })
  }

  removeImgFromList(index) : void {
    this.imageList.splice(index, 1);
  }

}
