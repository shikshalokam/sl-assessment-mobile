import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { UtilsProvider } from '../utils/utils';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class NetworkGpsProvider {

  networkStatus$ = new Subject();
  networkStatus: boolean;
  constructor(
    public http: HttpClient,
    private permissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    private utils: UtilsProvider) {
    console.log('Hello NetworkGpsProvider Provider');
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

}
