import { Component, Input, OnDestroy } from '@angular/core';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { FeedbackProvider } from '../../providers/feedback/feedback';

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
  networkAvailable: any;
  subscription: any;

  constructor(private ngps: NetworkGpsProvider, private feedbackService: FeedbackProvider) {
    this.networkAvailable = this.ngps.getNetworkStatus();
    this.networkSubscription = this.ngps.networkStatus$.subscribe(res => {
      console.log("hiiii")
      this.networkAvailable = res;
    })
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
