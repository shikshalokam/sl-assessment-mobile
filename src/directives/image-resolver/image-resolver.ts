import { Directive, Input, Output, EventEmitter, OnInit , ElementRef} from '@angular/core';
import { File } from '@ionic-native/file';

declare var cordova;

@Directive({
  selector: '[imageResolver]' 
})
export class ImageResolverDirective implements OnInit{
  private element: HTMLInputElement;

  @Input() fname: string;
  @Output() imagePath = new EventEmitter();

  constructor(private file : File, private elRef: ElementRef) {
    console.log('Hello ImageResolverDirective Directive');
    this.element = this.elRef.nativeElement;
  }

  ngOnInit() {
    this.findAndGenerateImageData();
  }

  findAndGenerateImageData() : void {
    this.file.checkFile(cordova.file.externalDataDirectory + 'images/', this.fname).then(response => {
      this.file.readAsDataURL(cordova.file.externalDataDirectory + 'images/', this.fname).then(data => {
        this.imagePath.emit(data);
      }).catch(err => {
      })
    }).catch(error => {
    })
  }
}
