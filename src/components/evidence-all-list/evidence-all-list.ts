import { Component } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
/**
 * Generated class for the EvidenceAllListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'evidence-all-list',
  templateUrl: 'evidence-all-list.html'
})
export class EvidenceAllListComponent {

  selectedTab

  // test
  images= [
    { "url": "https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528_960_720.jpg", "extension": "jpg" },
    { "url": "https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528_960_720.jpg", "extension": "jpg" },
    { "url": "https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528_960_720.jpg", "extension": "jpg" },
    { "url": "https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528_960_720.jpg", "extension": "jpg" }
  ]
  videos= [
    { "url": "https://www.radiantmediaplayer.com/media/bbb-360p.mp4", "extension": "mp4" },
    { "url": "https://www.radiantmediaplayer.com/media/bbb-360p.mp4", "extension": "mp4" },
    { "url": "https://www.radiantmediaplayer.com/media/bbb-360p.mp4", "extension": "mp4" },
    { "url": "https://www.radiantmediaplayer.com/media/bbb-360p.mp4", "extension": "mp4" }
  ]

  documents= [
    { "url": "http://www.orimi.com/pdf-test.pdf", "extension": "mp4" },
    { "url": "http://www.orimi.com/pdf-test.pdf", "extension": "mp4" },
    { "url": "http://www.orimi.com/pdf-test.pdf", "extension": "mp4" },
  ]

  //-----


  constructor(private iab: InAppBrowser, private photoViewer: PhotoViewer, private streamingMedia: StreamingMedia) {
  
  }


  ionViewDidLoad() {
    this.selectedTab = 'evidence';

  }

  onTabChange(tabName) {
    this.selectedTab = tabName;
  }

  playVideo(link){

    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'landscape',
      shouldAutoClose: true,
      controls: false
    };

    this.streamingMedia.playVideo(link, options);

  }

  openImage(link){
        this.photoViewer.show(link);
  }

  openDocument(link){
        this.iab.create('https://docs.google.com/viewer?url='+link,'_self', 'location=no,toolbar=no');

  }






}
