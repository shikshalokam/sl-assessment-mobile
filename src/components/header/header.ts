import { Component, Input, OnDestroy, Output, EventEmitter, OnInit } from '@angular/core';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { Events, ModalController, ViewController, App } from 'ionic-angular';
import { QuestionDashboardPage } from '../../pages/question-dashboard/question-dashboard';
import { NotificationProvider } from '../../providers/notification/notification';
import { PopoverController } from 'ionic-angular';
import { NotificationCardComponent } from '../notification-card/notification-card';

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent implements OnInit,OnDestroy {
  @Input() title: string;
  @Input() showLogout: boolean;
  @Input() hideBack: boolean;
  @Input() dashbordData: any;
  @Input() enableDashboard: boolean;
  @Input() disableNetwork: boolean;
  @Input() showClose: boolean;
  @Input() showMenu: boolean = true;
  @Output() onDashboardOpen = new EventEmitter();
  @Input() hideNotification;

  text: string;
  networkSubscription: any;
  networkAvailable: boolean;
  subscription: any;
  dashboardModal: any;
  newNotificationPresent: boolean;
  notificationSubscription;
  notificationData;

  constructor(private ngps: NetworkGpsProvider,
    private feedbackService: FeedbackProvider,
    private events: Events,
    public popoverCtrl: PopoverController,
    private modalcntrl: ModalController,
    private app:App,
    private viewCtrl: ViewController, private notificationServ: NotificationProvider) {
    console.log("construct");

    this.notificationSubscription = this.notificationServ.$notificationSubject.subscribe(data => {
      this.notificationData = data;
      this.newNotificationPresent = this.notificationData.count ? true : false
    })


    this.subscription = this.events.subscribe('network:offline', () => {
      // this.utils.openToast("Network disconnected");
      this.networkAvailable = false;
    });

    // Online event
    const onine = this.events.subscribe('network:online', () => {
      // this.utils.openToast("Network connected");
      this.networkAvailable = true;
    });

    this.networkAvailable = this.ngps.getNetworkStatus();

  }

  ngOnInit() {
    console.log("oninit")
    this.notificationSubscription = this.notificationServ.$notificationSubject.subscribe(data => {
      this.notificationData = data;
      if (this.notificationData.count) {
        this.newNotificationPresent = true;
      }
    })
    this.notificationData = this.notificationServ.notificationsData;
    this.newNotificationPresent = (this.notificationData && this.notificationData.count) ? true : false;
  }

  ngOnDestroy() {
    console.log("destroy");
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if(this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  feedback(): void {
    this.feedbackService.sendFeedback();
  }

  openDashboard(): void {
    this.dashboardModal = this.modalcntrl.create(QuestionDashboardPage, { "questions": this.dashbordData });
    this.onDashboardOpen.emit(this.dashboardModal);
    this.dashboardModal.present();
  }

  onNotificationClick(evt) {
    // let popover = this.popoverCtrl.create(
    //   NotificationCardComponent,
    //   { showViewMore: true, data: this.notificationData ? this.notificationData.data : []},
    //   { cssClass: 'customPopOver', showBackdrop: true }
    // );
    // popover.present({
    //   ev: evt
    // });
      this.app.getRootNav().push('NotificationListingPage');
  }

  closeDashboard() {
    this.viewCtrl.dismiss();
  }

}
