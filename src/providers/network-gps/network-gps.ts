import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { UtilsProvider } from '../utils/utils';
import { Subject } from 'rxjs/Subject';
import { Network } from '@ionic-native/network';
import { Events } from 'ionic-angular';

export enum ConnectionStatusEnum {
  Online,
  Offline
}

@Injectable()
export class NetworkGpsProvider {

  networkStatus$ = new Subject();
  networkStatus: boolean;
  previousStatus: any;
  constructor(
    public http: HttpClient,
    private permissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    private utils: UtilsProvider,
    private network: Network,
    private eventCtrl: Events) {
    console.log('Hello NetworkGpsProvider Provider');
    this.previousStatus = ConnectionStatusEnum.Online;
  }

  checkForLocationPermissions(): void {
    console.log('Check permissions');
    this.permissions.checkPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        console.log('Has permission?', result.hasPermission)
        if (!result.hasPermission) {
          console.log("ask permission");
          this.permissions.requestPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION).then(result => {
            if (result.hasPermission) {
              this.enableGPSRequest();
            }
          }).catch(error => {
            console.log('error')
          })
        } else {
          console.log('yes, Has permission');
          // this.isLocationEnabled();
          this.enableGPSRequest();
        }
      }).catch(error => {
      });
  }


  enableGPSRequest() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.getCurrentLocation();
          },
          error => {
            this.utils.openToast("Location should be turend on for this action", "Ok");
            // this.enableGPSRequest()
          }
        );
      }

    });
  }

  getCurrentLocation(): any {
    console.log('getting current location');
    const options = {
      timeout: 20000
    }
    this.geolocation.getCurrentPosition(options).then((resp) => {
      const gpsLocation = resp.coords.latitude + "," + resp.coords.longitude;
      this.utils.openToast(resp.coords.latitude + " " + resp.coords.longitude);
      return gpsLocation
    }).catch((error) => {
      this.utils.openToast('Error getting location' + JSON.stringify(error));
      console.log(error.message + " " + error.code)
    });
  }

  setNetworkStatus(status): void {
    console.log("NEtwork status" + status);
    this.networkStatus = status;
    this.networkStatus$.next(status);
  }

  getNetworkStatus(): boolean {
    return this.networkStatus
  }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Online) {
        this.eventCtrl.publish('network:offline');
      }
      this.previousStatus = ConnectionStatusEnum.Offline;
      this.networkStatus = false;
    });
    this.network.onConnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Offline) {
        this.eventCtrl.publish('network:online');
      }
      this.previousStatus = ConnectionStatusEnum.Online;
      this.networkStatus = true;
    });

    if (this.network.type !== 'none') {
      this.networkStatus = true;
    } else {
      this.networkStatus = false;
    }

  }


}
