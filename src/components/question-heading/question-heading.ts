import { Component, Input } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { TextToSpeechProvider } from '../../providers/text-to-speech/text-to-speech';
import { Events } from 'ionic-angular';

/**
 * Generated class for the QuestionHeadingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'question-heading',
  templateUrl: 'question-heading.html'
})
export class QuestionHeadingComponent {

  text: string;
  @Input()data ;
  @Input()inputIndex;
  play = false;
  constructor(private textToSpeech : TextToSpeechProvider,private events :Events) {
    console.log('Hello QuestionHeadingComponent Component');
    this.text = 'Hello World';
    this.events.subscribe('speech' , data =>{
      this.play = false;
    })
  }

  playQuestion(question){
    this.play = true;
    this.textToSpeech.speechFromText({text:question});
  }
  pauseQuestion(question){
    this.textToSpeech.stopSpeech();
  }
}
