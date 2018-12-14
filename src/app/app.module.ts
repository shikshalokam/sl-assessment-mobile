import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';

import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicStorageModule } from '@ionic/storage';
import { Network} from '@ionic-native/network';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPageModule } from '../pages/login/login.module';
import { AuthProvider } from '../providers/auth/auth';
import { CurrentUserProvider } from '../providers/current-user/current-user';
import { WelcomePage } from '../pages/welcome/welcome';
import { SchoolListPage } from '../pages/school-list/school-list';
import { SchoolListProvider } from '../providers/school-list/school-list';
import { HttpInterceptorProvider } from '../providers/http-interceptor/http-interceptor';
import { UtilsProvider } from '../providers/utils/utils';
import { ApiProvider } from '../providers/api/api';
import { SchoolProfilePageModule } from '../pages/school-profile/school-profile.module';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { EvidenceListPageModule } from '../pages/evidence-list/evidence-list.module';
import { SectionListPageModule } from '../pages/section-list/section-list.module';
import { QuestionerPageModule } from '../pages/questioner/questioner.module';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { FaqPage } from '../pages/faq/faq';
import { SchoolProfileEditPage } from '../pages/school-profile-edit/school-profile-edit';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageListingPage } from '../pages/image-listing/image-listing';
import { MatrixActionModalPage } from '../pages/matrix-action-modal/matrix-action-modal';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RatingProvider } from '../providers/rating/rating';
import { RatingCriteriaListingPageModule } from '../pages/rating-criteria-listing/rating-criteria-listing.module';
import { RatingPageModule } from '../pages/rating/rating.module';
import { NetworkGpsProvider } from '../providers/network-gps/network-gps';
import { RatedCriteriaListPageModule } from '../pages/rated-criteria-list/rated-criteria-list.module';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { EvidenceProvider } from '../providers/evidence/evidence';
import { QuestionDashboardPage } from '../pages/question-dashboard/question-dashboard';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { RemarksPage } from '../pages/remarks/remarks';
import { ParentsListPageModule } from '../pages/parents-list/parents-list.module';
import { UpdateLocalSchoolDataProvider } from '../providers/update-local-school-data/update-local-school-data';
import { FeedbackPage } from '../pages/feedback/feedback';
import { DetailPage } from '../pages/detail/detail';
import { Device } from '@ionic-native/device';
import { ExtendedDeviceInformation } from '@ionic-native/extended-device-information';
import { GeneralQuestionListPageModule } from '../pages/general-question-list/general-question-list.module';
import { GeneralQuestionPage } from '../pages/general-question/general-question';
import { GeneralQuestionSubmitPage } from '../pages/general-question-submit/general-question-submit';
import { SlackProvider } from '../providers/slack/slack';
import { Keyboard } from '@ionic-native/keyboard';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WelcomePage,
    SchoolListPage,
    FaqPage,
    SchoolProfileEditPage,
    ImageListingPage,
    MatrixActionModalPage,
    QuestionDashboardPage,
    RemarksPage,
    FeedbackPage,
    DetailPage,
    GeneralQuestionPage,
    GeneralQuestionSubmitPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot(
      {
        loader: {
         provide: TranslateLoader,
         useFactory: (setTranslateLoader),
         deps: [HttpClient]
       }
      }
    ),
    LoginPageModule,
    HttpModule,
    HttpClientModule,
    SchoolProfilePageModule,
    EvidenceListPageModule,
    SectionListPageModule,
    QuestionerPageModule,
    ComponentsModule,
    DirectivesModule,
    RatingCriteriaListingPageModule,
    RatingPageModule,
    RatedCriteriaListPageModule,
    ParentsListPageModule,
    GeneralQuestionListPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WelcomePage,
    SchoolListPage,
    FaqPage,
    SchoolProfileEditPage,
    ImageListingPage,
    MatrixActionModalPage,
    QuestionDashboardPage,
    RemarksPage,
    FeedbackPage,
    DetailPage,
    GeneralQuestionPage,
    GeneralQuestionSubmitPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InAppBrowser,
    AuthProvider,
    CurrentUserProvider,
    Network,
    SchoolListProvider,
    HttpInterceptorProvider,
    // {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorProvider, multi: true},
    UtilsProvider,
    ApiProvider,
    AndroidPermissions,
    Geolocation,
    Diagnostic,
    Camera,
    File,
    FilePath,
    FileTransfer,
    ImagePicker,
    LocationAccuracy,
    PhotoLibrary,
    RatingProvider,
    NetworkGpsProvider,
    FeedbackProvider,
    EvidenceProvider,
    UpdateLocalSchoolDataProvider,
    Device,
    ExtendedDeviceInformation,
    SlackProvider,
    Keyboard
  ]
})
export class AppModule { }
export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
 }