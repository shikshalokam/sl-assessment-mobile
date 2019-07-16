import { Component, OnInit, Input } from '@angular/core';
import { ActionSheetController, Platform, AlertController } from 'ionic-angular'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { TranslateService } from '@ngx-translate/core';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { IOSFilePicker } from '@ionic-native/file-picker';

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
  videoFormats = ["mp4", "WMV", "WEBM", "flv", "avi", "3GP", "OGG"];
  audioFormats = ["AIF", "cda", "mpa", "ogg", "wav", "wma",'mp3'];
  pptFormats = ["ppt", "pptx", "pps", "ppsx"];
  wordFormats = ["docx", "doc", "docm", "dotx"];
  imageFormats = ['jpg', 'png']
  pdfFormats = ["pdf"];
  spreadSheetFormats = ["xls", "xlsx"];

  
  @Input()
  set data(data) {
    this.datas = data;
    this.createImageFromName(data['fileName'])
  }

  get name() {
    return true
  }
  @Input() evidenceId: any;
  @Input() schoolId: string;
  @Input() submissionId: any;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;


  imageList: Array<any> = [];
  imageNameCounter: number = 0;
  localEvidenceImageList: any;
  allLocalImageList: any = {};

  constructor(private actionSheet: ActionSheetController,
    private camera: Camera,
    private file: File, private imgPicker: ImagePicker, private utils: UtilsProvider,
    private storage: Storage,
    private photoLibrary: PhotoLibrary, private platform: Platform,
    private translate: TranslateService,
    private filePath: FilePath,
    private iosFilePicker: IOSFilePicker,
    private fileChooser: FileChooser,
    private alertCtrl: AlertController) {
    console.log('Hello ImageUploadComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit() {
    this.storage.get(this.generalQuestion ? 'genericQuestionsImages' : 'allImageList').then(data => {
      this.allLocalImageList = JSON.parse(data) ? JSON.parse(data) : {};
      if (!this.generalQuestion) {
        if (this.allLocalImageList[this.submissionId]) {
          this.allLocalImageList[this.submissionId][this.evidenceId] = (this.allLocalImageList[this.submissionId][this.evidenceId]) ? this.allLocalImageList[this.submissionId][this.evidenceId] : []
        } else {
          console.log(this.submissionId + " " + this.evidenceId)
          this.allLocalImageList[this.submissionId] = {};
          this.allLocalImageList[this.submissionId][this.evidenceId] = []
          this.localEvidenceImageList = [];
        }
      } else {
        if (this.allLocalImageList[this.submissionId]) {
          this.allLocalImageList[this.submissionId] = (this.allLocalImageList[this.submissionId]) ? this.allLocalImageList[this.submissionId] : []
        } else {
          this.allLocalImageList[this.submissionId] = [];
          this.localEvidenceImageList = [];
        }
      }
      // this.allLocalImageList = JSON.parse(data) ? JSON.parse(data) : {};
      // this.localEvidenceImageList = (this.allLocalImageList && this.allLocalImageList[this.evidenceId]) ? this.allLocalImageList[this.evidenceId] : [];
    })
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + 'images' : cordova.file.externalDataDirectory + 'images';
  }

  openActionSheet(): void {
    let translateObject;
    this.translate.get(['actionSheet.addimage', 'actionSheet.camera', 'actionSheet.uploadFile', 'actionSheet.uploadImage', 'actionSheet.upload', 'actionSheet.cancel']).subscribe(translations => {
      translateObject = translations;
    })
    const actionSheet = this.actionSheet.create({
      title: translateObject['actionSheet.addimage'],
      buttons: [
        {
          text: translateObject['actionSheet.camera'],
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            this.openCamera();
          }
        },
        {
          text: translateObject['actionSheet.uploadImage'],
          icon: 'cloud-upload',
          handler: () => {
            this.openLocalLibrary();
          }
        }, {
          text: translateObject['actionSheet.uploadFile'],
          icon: 'document',
          handler: () => {
            this.isIos ? this.filePickerForIOS() : this.openFilePicker();
          }
        }, {
          text: translateObject['actionSheet.cancel'],
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  filePickerForIOS() {
    this.iosFilePicker.pickFile().then(data => {
      this.checkForLocalFolder("file://" +data);
    }).catch(error => {

    })
  }

  // For android
  openFilePicker() {
    this.fileChooser.open()
      .then(filePath => {
        this.filePath.resolveNativePath(filePath).then(data => {
          this.checkForLocalFolder(data);
        }).catch(err => {
        })
      })
      .catch(e => console.log(e));
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
      this.checkForLocalFolder(imagePath);
      this.saveToLibrary(imagePath);
    }).catch(error => {
    })
  }

  saveToLibrary(url): void {
    this.photoLibrary.saveImage(url, 'samiksha').then(data => {
    }).catch(error => {
    })
  }

  checkForLocalFolder(imagePath) {
    let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    let currentPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
    if (this.isIos) {
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
    // this.file.resolveLocalFilesystemUrl(namePath).then(succes => {
    //   console.log("Resolved  path " + JSON.stringify(succes.nativeURL))
    // }).catch(error => {

    // })
    this.file.copyFile(namePath, currentName, this.appFolderPath, currentName).then(success => {
      this.pushToFileList(currentName);
    }, error => {
    });
  }

  pushToFileList(fileName) {
    this.file.checkFile(this.appFolderPath + '/', fileName).then(response => {
      if (this.imageFormats.indexOf(this.getExtensionFromName(fileName)) >=0) {
        this.file.readAsDataURL(this.appFolderPath, fileName).then(data => {
          this.imageList.push({ data: data, imageName: fileName, extension: this.getExtensionFromName(fileName) });
          this.setLocalDatas(fileName);
        }).catch(err => {
        })
      } else {
        this.imageList.push({ data: "", imageName: fileName, extension: this.getExtensionFromName(fileName) });
        this.setLocalDatas(fileName);
        this.updateLocalImageList();
      }

    }).catch(error => {
    })
  }

  setLocalDatas(fileName) {
    this.datas.fileName.push(fileName);
    if (!this.generalQuestion) {
      this.allLocalImageList[this.submissionId][this.evidenceId].push({ name: fileName, uploaded: false });
    } else {
      this.allLocalImageList[this.submissionId].push({ name: fileName, uploaded: false });
    }
    this.updateLocalImageList();
  }

  getExtensionFromName(fileName) {
    let splitString = fileName.split('.');
    let extension = splitString[splitString.length - 1];
    return extension
  }

  createImageFromName(imageList) {
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + 'images' : cordova.file.externalDataDirectory + 'images';
    for (const image of imageList) {
      this.file.checkFile(this.appFolderPath + '/', image).then(response => {

        if (this.imageFormats.indexOf(this.getExtensionFromName(image)) >=0) {
          this.file.readAsDataURL(this.appFolderPath, image).then(data => {
            this.imageList.push({ data: data, imageName: image, extension: this.getExtensionFromName(image) });
            // this.setLocalDatas(fileName);
          }).catch(err => {
          })
        } else {
          this.imageList.push({ data: "", imageName: image, extension: this.getExtensionFromName(image) });
          // this.setLocalDatas(image);
          // this.updateLocalImageList();
        }







        // this.file.readAsDataURL(this.appFolderPath, image).then(data => {
        //   this.imageList.push({ data: data, imageName: image });
        // }).catch(err => {
        // })
      }).catch(error => {
        this.imageList.push(image);
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
    })
  }

  removeImgFromList(index): void {
    let indexInLocalList;
    if (!this.generalQuestion) {
      for (let i = 0; i < this.allLocalImageList[this.submissionId][this.evidenceId].length; i++) {
        if (this.allLocalImageList[this.submissionId][this.evidenceId].name === this.imageList[index].imageName) {
          indexInLocalList = i;
        }
      }
      this.allLocalImageList[this.submissionId][this.evidenceId].splice(indexInLocalList, 1);
    } else {
      for (let i = 0; i < this.allLocalImageList[this.submissionId].length; i++) {
        if (this.allLocalImageList[this.submissionId].name === this.imageList[index].imageName) {
          indexInLocalList = i;
        }
      }
      this.allLocalImageList[this.submissionId].splice(indexInLocalList, 1);
    }
    this.datas.fileName.splice(index, 1);
    this.imageList.splice(index, 1);
    this.updateLocalImageList();
  }

  deleteImageAlert(index) {
    let alert = this.alertCtrl.create({
      title: `{{'actionSheet.confirm' | translate}}`,
      message: `{{'actionSheet.confirmDeleteImage' | translate}}`,
      buttons: [
        {
          text: `{{'actionSheet.no' | translate}}`,
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: `{{'actionSheet.yes' | translate}}`,
          handler: () => {
            this.removeImgFromList(index);
          }
        }
      ]
    });
    alert.present();
  }

  updateLocalImageList() {
    this.utils.setLocalImages(this.allLocalImageList, this.generalQuestion);
  }

}
