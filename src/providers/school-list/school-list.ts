import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigs } from '../appConfig';
import { SchoolConfig } from './schoolConfig';

/*
  Generated class for the SchoolListProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SchoolListProvider {

  constructor(public http: HttpClient) {
    console.log('Hello SchoolListProvider Provider');
  }

  getSchools() {
    console.log(AppConfigs.api_base_url + SchoolConfig.getSchoolsOfAssessors);
    return this.http.get(AppConfigs.api_base_url + SchoolConfig.getSchoolsOfAssessors)
  }


}
