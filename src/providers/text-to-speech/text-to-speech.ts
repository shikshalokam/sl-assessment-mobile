import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';

/*
  Generated class for the TextToSpeechProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TextToSpeechProvider {

  constructor(public http: HttpClient,private tts: TextToSpeech,
    ) {
    console.log('Hello TextToSpeechProvider Provider');
  }

  speechFromText(options){
    options['local']= options.local ? options.local : 'en-US';
    options['rate']= options.rate ? options.rate : 1;
    
    this.tts.speak(options)
  .then(() => console.log('Success'))
  .catch((reason: any) => console.log(reason));
  }

}
