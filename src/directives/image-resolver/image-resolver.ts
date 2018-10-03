import { Directive, Input, Output, EventEmitter, OnInit , ElementRef} from '@angular/core';
import { File } from '@ionic-native/file';

declare var cordova;
/**
 * Generated class for the ImageResolverDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[imageResolver]' // Attribute selector
})
export class ImageResolverDirective implements OnInit{
  private element: HTMLInputElement;

  @Input() fname: string;
  @Output() imagePath = new EventEmitter();

  constructor(private file : File, private elRef: ElementRef) {
    console.log('Hello ImageResolverDirective Directive');
    this.element = this.elRef.nativeElement;
    console.log(JSON.stringify(this.element));
  }

  ngOnInit() {
    this.findAndGenerateImageData();
  }

  findAndGenerateImageData() : void {
    this.file.checkFile(cordova.file.externalDataDirectory + 'images/', this.fname).then(response => {
      console.log('Check For file name : '+ response);
      // this.isFileExist = JSON.stringify(response);
      this.file.readAsDataURL(cordova.file.externalDataDirectory + 'images/', this.fname).then(data => {
        // console.log(JSON.stringify(data));
        // this.currentImage = data;
        // this.getImageUploadUrls();
        this.imagePath.emit(data);
      }).catch(err => {

      })
    }).catch(error => {
      // this.isFileExist = JSON.stringify(error)

      console.log(JSON.stringify(error))
    })
  }
}
