import { Component } from "@angular/core";
import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import {
  StreamingMedia,
  StreamingVideoOptions,
} from "@ionic-native/streaming-media";
/**
 * Generated class for the EvidenceAllListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "evidence-all-list",
  templateUrl: "evidence-all-list.html",
})
export class EvidenceAllListComponent {
  selectedTab;

  // test
  images = [
    {
      url:
        "https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528_960_720.jpg",
      extension: "jpg",
    },
    {
      url:
        "https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528_960_720.jpg",
      extension: "jpg",
    },
    {
      url:
        "https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528_960_720.jpg",
      extension: "jpg",
    },
    {
      url:
        "https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528_960_720.jpg",
      extension: "jpg",
    },
  ];
  videos = [
    {
      url: "https://www.radiantmediaplayer.com/media/bbb-360p.mp4",
      extension: "mp4",
    },
    {
      url: "https://www.radiantmediaplayer.com/media/bbb-360p.mp4",
      extension: "mp4",
    },
    {
      url: "https://www.radiantmediaplayer.com/media/bbb-360p.mp4",
      extension: "mp4",
    },
    {
      url: "https://www.radiantmediaplayer.com/media/bbb-360p.mp4",
      extension: "mp4",
    },
  ];

  documents = [
    { url: "http://www.orimi.com/pdf-test.pdf", extension: "pdf" },
    { url: "http://www.orimi.com/pdf-test.pdf", extension: "pdf" },
    { url: "http://www.orimi.com/pdf-test.pdf", extension: "pdf" },
  ];

  //-----

  constructor() {}

  ionViewDidLoad() {
    this.selectedTab = "evidence";
  }

  onTabChange(tabName) {
    this.selectedTab = tabName;
  }
}
