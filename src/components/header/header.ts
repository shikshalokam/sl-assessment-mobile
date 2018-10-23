import { Component, Input, OnDestroy } from '@angular/core';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { Events } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent implements OnDestroy{
  @Input() title: string;
  @Input() showLogout: boolean;
  @Input() hideBack: boolean; 
  
  text: string;
  networkSubscription: any;
  networkAvailable: boolean;
  subscription: any;

  constructor(private ngps: NetworkGpsProvider, 
    private feedbackService: FeedbackProvider, 
    private events: Events, private utils: UtilsProvider,
    private network: Network) {

    this.subscription = this.events.subscribe('network:offline', () => {
      this.utils.openToast("Network disconnected");
      this.networkAvailable = false;
    });

    // Online event
    const onine = this.events.subscribe('network:online', () => {
      this.utils.openToast("Network connected");
      this.networkAvailable = true;
    });

    this.networkAvailable = this.ngps.getNetworkStatus();
    
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  feedback(): void {
    this.feedbackService.sendFeedback();
  }

}
