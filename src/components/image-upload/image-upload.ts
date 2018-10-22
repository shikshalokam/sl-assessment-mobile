import { Component, OnInit, Input } from '@angular/core';
import { ActionSheetController } from 'ionic-angular'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
// import { imageLocalListName} from "../../providers/appConfig"

declare var cordova: any;

@Component({
  selector: 'image-upload',
  templateUrl: 'image-upload.html'
})
export class ImageUploadComponent implements OnInit {

  text: string;
  datas;
  @Input()
  set data(data) {
    this.datas = data;
    this.createImageFromName(data['fileName'])
  }

  get name() {
    return true
  }
  @Input() evidenceId: string;
  @Input() schoolId: string;

  appFolderPath: string = cordova.file.externalDataDirectory + 'images';
  imageList: Array<any> = [];

  imageNameCounter: number = 0;
  localEvidenceImageList: any;
  allLocalImageList: any;

  constructor(private actionSheet: ActionSheetController,
    private camera: Camera,
    private file: File, private imgPicker: ImagePicker, private utils: UtilsProvider,
    private storage: Storage) {
    console.log('Hello ImageUploadComponent Component');
    this.text = 'Hello World';
  }

  // ionViewDidLoad() {
  //   console.log("hiiiii")
  //   // this.userData = this.currentUser.getCurrentUserData();
  // }
  ngOnInit() {
    // let localImageListName: imageLocalListName;
    // localImageListName = {
    //   evidenceId:"",
    //   schoolId:"",
    // }
    this.storage.get(this.utils.imagePath).then(data => {
      this.allLocalImageList = JSON.parse(data) ? JSON.parse(data) : {};
      this.localEvidenceImageList = (this.allLocalImageList && this.allLocalImageList[this.evidenceId]) ? this.allLocalImageList[this.evidenceId] : [];
      // console.log('local images' + JSON.stringify(this.allLocalImageList));
      // console.log(JSON.stringify(this.datas));
      // console.log(this.evidenceId)
    })
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
      quality: 10,
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

  checkForLocalFolder(imagePath) {
    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    let currentPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

    this.file.checkDir(this.file.externalDataDirectory, 'images').then(success => {
      this.copyFileToLocalDir(currentPath, currentName);
    }).catch(err => {
      this.file.createDir(cordova.file.externalDataDirectory, 'images', false).then(success => {
        this.copyFileToLocalDir(currentPath, currentName)
      }, error => { })
    });
  }


  createFileName() {
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName) {
    this.file.copyFile(namePath, currentName, this.appFolderPath, currentName).then(success => {
      console.log(JSON.stringify(success));
      this.pushToImageList(currentName);
    }, error => {
    });
  }

  pushToImageList(fileName) {
    this.file.checkFile(this.appFolderPath + '/', fileName).then(response => {
      this.file.readAsDataURL(this.appFolderPath, fileName).then(data => {
        this.imageList.push(data);
        this.datas.fileName.push(fileName);
        this.localEvidenceImageList.push({ name: fileName, uploaded: false });
        this.updateLocalImageList();
        // console.log(JSON.stringify(this.data.imageNames))
      }).catch(err => {

      })
    }).catch(error => {
      console.log('Error ' + JSON.stringify(error))
    })
  }

  createImageFromName(imageList) {
    for (const image of imageList) {
      this.file.checkFile(this.appFolderPath + '/', image).then(response => {
        this.file.readAsDataURL(this.appFolderPath, image).then(data => {
          this.imageList.push(data);

        }).catch(err => {

        })
      }).catch(error => {
        this.imageList.push(image);
        console.log('Error ' + JSON.stringify(error))
      })
    }
  }

  openLocalLibrary(): void {
    const options: ImagePickerOptions = {
      maximumImagesCount: 7,
      quality: 10,
    }
    this.imgPicker.getPictures(options).then(imageData => {
      for (const image of imageData) {
        this.checkForLocalFolder(image);
      }
      console.log('Image URI: ' + imageData);
    })
  }

  removeImgFromList(index): void {
    console.log(this.localEvidenceImageList);
    this.file.removeFile(this.appFolderPath + '/', this.datas.fileName[index]).then(success => {
      let indexInLocalList;
      for (let i = 0; i < this.localEvidenceImageList.length; i++) {
        if (this.localEvidenceImageList[i].name === this.imageList[i]) {
          indexInLocalList = i;
        }
      }
      this.localEvidenceImageList.splice(indexInLocalList, 1);
      this.datas.fileName.splice(index, 1);
      this.imageList.splice(index, 1);
      this.updateLocalImageList();
    })
  }

  updateLocalImageList() {
    this.allLocalImageList[this.evidenceId] = this.localEvidenceImageList;
    console.log(JSON.stringify(this.allLocalImageList[this.evidenceId]))
    this.utils.setLocalImages(this.allLocalImageList);
  }

}
