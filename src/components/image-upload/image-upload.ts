import { Component, OnInit, Input } from '@angular/core';
import { ActionSheetController, Platform } from 'ionic-angular'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
// import { imageLocalListName} from "../../providers/appConfig"
import { PhotoLibrary } from '@ionic-native/photo-library';

declare var cordova: any;

@Component({
  selector: 'image-upload',
  templateUrl: 'image-upload.html'
})
export class ImageUploadComponent implements OnInit {

  text: string;
  datas;
  isIos: boolean;
  appFolderPath: string;

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
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;


  imageList: Array<any> = [];
  imageNameCounter: number = 0;
  localEvidenceImageList: any;
  allLocalImageList: any ={};

  constructor(private actionSheet: ActionSheetController,
    private camera: Camera,
    private file: File, private imgPicker: ImagePicker, private utils: UtilsProvider,
    private storage: Storage,
    private photoLibrary: PhotoLibrary, private platform: Platform) {
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
    console.log(this.imageLocalCopyId)
    this.storage.get(this.generalQuestion ?'genericQuestionsImages':'allImageList').then(data => {
      this.allLocalImageList = JSON.parse(data) ? JSON.parse(data) : {};
      console.log("First fetch "  + JSON.stringify(this.allLocalImageList))
      console.log(this.generalQuestion)
      if(!this.generalQuestion){
        if(this.allLocalImageList[this.schoolId]){
          this.allLocalImageList[this.schoolId][this.evidenceId] = (this.allLocalImageList[this.schoolId][this.evidenceId] ) ? this.allLocalImageList[this.schoolId][this.evidenceId] : []
        } else {
          console.log(this.schoolId + " " + this.evidenceId)
          this.allLocalImageList[this.schoolId] = {};
          this.allLocalImageList[this.schoolId][this.evidenceId] = []
          this.localEvidenceImageList = [];
        }
      } else {
        console.log("oninit ")
        if(this.allLocalImageList[this.schoolId]){
          this.allLocalImageList[this.schoolId] = (this.allLocalImageList[this.schoolId] ) ? this.allLocalImageList[this.schoolId] : []
        } else {
          this.allLocalImageList[this.schoolId] = [];
          this.localEvidenceImageList = [];
        }
      console.log("second fetch "  + JSON.stringify(this.allLocalImageList))

      }

      // this.allLocalImageList = JSON.parse(data) ? JSON.parse(data) : {};
      // this.localEvidenceImageList = (this.allLocalImageList && this.allLocalImageList[this.evidenceId]) ? this.allLocalImageList[this.evidenceId] : [];
      // console.log('local images' + JSON.stringify(this.allLocalImageList));
      // console.log(JSON.stringify(this.datas));
      // console.log(this.evidenceId)
    })
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + 'images' : cordova.file.externalDataDirectory + 'images';

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
    console.log("Open Camera");
    this.camera.getPicture(options).then(imagePath => {
      // con
      this.checkForLocalFolder(imagePath);
      this.saveToLibrary(imagePath);
    }).catch(error => {
      // console.log(JSON.stringify(error))
    })
  }

  saveToLibrary(url): void {
    this.photoLibrary.saveImage(url, 'samiksha').then(data => {
      // console.log("saved " + data)
    }).catch(error => {
      // console.log("error " + error)
    })
  }

  checkForLocalFolder(imagePath) {
    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    let currentPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

    if (this.isIos) {
      console.log("Ios ")
      this.file.checkDir(this.file.documentsDirectory, 'images').then(success => {
        this.copyFileToLocalDir(currentPath, currentName);
      }).catch(err => {

        this.file.createDir(cordova.file.documentsDirectory, 'images', false).then(success => {

          this.copyFileToLocalDir(currentPath, currentName)
        }, error => { })
      });
    } else {
      this.file.checkDir(this.file.externalDataDirectory, 'images').then(success => {
        this.copyFileToLocalDir(currentPath, currentName);
      }).catch(err => {
        this.file.createDir(cordova.file.externalDataDirectory, 'images', false).then(success => {
          this.copyFileToLocalDir(currentPath, currentName)
        }, error => { })
      });
    }

  }


  createFileName() {
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName) {
    // console.log("Copy file");
    // console.log("namePath " + namePath);
    // console.log("currentname " + currentName);
    // console.log("destination path " + this.appFolderPath);

    // this.file.resolveLocalFilesystemUrl(namePath).then(succes => {
    //   console.log("Resolved  path " + JSON.stringify(succes.nativeURL))
    // }).catch(error => {

    // })
    this.file.copyFile(namePath, currentName, this.appFolderPath, currentName).then(success => {
      // console.log(JSON.stringify(success));
      this.pushToImageList(currentName);
    }, error => {
      // console.log("error" + JSON.stringify(error));
    });
  }

  pushToImageList(fileName) {
    this.file.checkFile(this.appFolderPath + '/', fileName).then(response => {
      this.file.readAsDataURL(this.appFolderPath, fileName).then(data => {
        this.imageList.push(data);
        this.datas.fileName.push(fileName);
        console.log("Update local list")
        console.log(this.schoolId + " " + this.evidenceId)

        console.log(this.localEvidenceImageList);
        if(!this.generalQuestion){
          this.allLocalImageList[this.schoolId][this.evidenceId].push({ name: fileName,  uploaded: false});
        } else {
        this.allLocalImageList[this.schoolId].push({ name: fileName,  uploaded: false});
        }
        this.updateLocalImageList();

        // console.log(JSON.stringify(this.data.imageNames))
      }).catch(err => {

      })
    }).catch(error => {
      // console.log('Error ' + JSON.stringify(error))
    })
  }

  createImageFromName(imageList) {
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + 'images' : cordova.file.externalDataDirectory + 'images';
    for (const image of imageList) {
      this.file.checkFile(this.appFolderPath + '/', image).then(response => {
        this.file.readAsDataURL(this.appFolderPath, image).then(data => {
          this.imageList.push(data);

        }).catch(err => {

        })
      }).catch(error => {
        this.imageList.push(image);
        // console.log('Error ' + JSON.stringify(error))
      })
    }
  }

  openLocalLibrary(): void {
    const options: ImagePickerOptions = {
      maximumImagesCount: 50,
      quality: 10,
    }
    this.imgPicker.getPictures(options).then(imageData => {
      for (const image of imageData) {
        this.checkForLocalFolder(image);
      }
      // console.log('Image URI: ' + imageData);
    })
  }

  removeImgFromList(index): void {
    // console.log(this.localEvidenceImageList);
    this.file.removeFile(this.appFolderPath + '/', this.datas.fileName[index]).then(success => {
      let indexInLocalList;
      if(!this.generalQuestion) {
        for (let i = 0; i < this.allLocalImageList[this.schoolId][this.evidenceId].length; i++) {
          if (this.allLocalImageList[this.schoolId][this.evidenceId].name === this.imageList[i]) {
            indexInLocalList = i;
          }
        }
        this.allLocalImageList[this.schoolId][this.evidenceId].splice(indexInLocalList, 1);
      } else {
        console.log("remove image else")
        for (let i = 0; i < this.allLocalImageList[this.schoolId].length; i++) {
          if (this.allLocalImageList[this.schoolId].name === this.imageList[i]) {
            indexInLocalList = i;
          }
        }
        this.allLocalImageList[this.schoolId].splice(indexInLocalList, 1);
      }
      this.datas.fileName.splice(index, 1);
      this.imageList.splice(index, 1);
      this.updateLocalImageList();
    })
  }

  updateLocalImageList() {
    console.log("Image lsit");
    console.log(this.generalQuestion)
    // this.allLocalImageList[this.evidenceId] = this.localEvidenceImageList;
    console.log("LOcal image List" + JSON.stringify(this.allLocalImageList))
    this.utils.setLocalImages(this.allLocalImageList, this.generalQuestion);
  }

}
